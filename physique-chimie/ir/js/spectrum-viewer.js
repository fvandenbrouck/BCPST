/*
 * Visionneuse de spectre IR simulé/reconstruit à partir des données de
 * data/spectres.js (cf. en-tête de ce fichier pour le statut des données).
 * Trace l'axe en nombre d'onde (convention : valeurs élevées à gauche),
 * bascule entre transmittance (creux) et absorbance (pics), et permet de
 * zoomer sur une bande. La courbe (bosses gaussiennes combinées) est
 * calculée à partir des valeurs numériques des bandes — un graphique de
 * données, pas une formule chimique.
 */
(function(){

  const INTENSITE_AMP = { forte: 1.0, moyenne: 0.5, faible: 0.22 };

  function absorbanceAt(wn, bandes){
    let a = 0;
    bandes.forEach(b => {
      const amp = INTENSITE_AMP[b.intensite] || 0.4;
      const sigma = Math.max(8, b.largeurBande / 1.8);
      a += amp * Math.exp(-((wn - b.centre) ** 2) / (2 * sigma * sigma));
    });
    return a;
  }

  function render(container, spectreId, opts){
    opts = opts || {};
    const spectre = window.IR_SPECTRE_BY_ID(spectreId);
    if (!spectre){ container.innerHTML = '<p class="empty">Spectre introuvable.</p>'; return; }
    let mode = 'T'; // 'T' transmittance (défaut) | 'A' absorbance
    let zoomBand = null;

    function draw(){
      const width = opts.width || 680, height = 230;
      const padX = 28, axisY = 170, topY = 20;
      let minWn = 400, maxWn = 4000;
      if (zoomBand){
        minWn = Math.max(400, zoomBand.centre - Math.max(120, zoomBand.largeurBande * 2));
        maxWn = Math.min(4000, zoomBand.centre + Math.max(120, zoomBand.largeurBande * 2));
      }
      const x = (wn) => padX + (width - 2 * padX) * (1 - (wn - minWn) / (maxWn - minWn));

      const N = 240;
      let pathPts = [];
      for (let i = 0; i <= N; i++){
        const wn = maxWn - (i / N) * (maxWn - minWn);
        const a = absorbanceAt(wn, spectre.bandes);
        const value = mode === 'A' ? a : Math.pow(10, -a) * 100; // transmittance en %
        pathPts.push({ wn, value });
      }
      const maxA = Math.max(0.3, ...pathPts.map(p => mode === 'A' ? p.value : 0));
      const yOf = (v) => {
        if (mode === 'A'){
          return axisY - ((axisY - topY) * (v / Math.max(1.1, maxA)));
        }
        return topY + (axisY - topY) * (1 - v / 100);
      };
      const pathD = pathPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.wn).toFixed(1)} ${yOf(p.value).toFixed(1)}`).join(' ');

      let labelsSvg = '';
      spectre.bandes.forEach((b, idx) => {
        if (b.centre < minWn - 80 || b.centre > maxWn + 80) return;
        const color = `var(--${b.color || 'rust'})`;
        const a = absorbanceAt(b.centre, spectre.bandes);
        const vAtCentre = mode === 'A' ? a : Math.pow(10, -a) * 100;
        const xLab = x(b.centre);
        const yLab = yOf(vAtCentre);
        const dy = (idx % 2 === 0) ? -10 : 14;
        labelsSvg += `<g class="ir-band-hit" data-band="${b.id}" style="cursor:pointer;">
          <circle cx="${xLab.toFixed(1)}" cy="${yLab.toFixed(1)}" r="3.5" fill="${color}"/>
          <rect x="${(xLab - 34).toFixed(1)}" y="${(mode === 'A' ? yLab + dy - 22 : yLab + dy - 2).toFixed(1)}" width="68" height="30" fill="var(--paper)" opacity="0.85"/>
          <text x="${xLab.toFixed(1)}" y="${(mode === 'A' ? yLab + dy - 10 : yLab + dy + 10).toFixed(1)}" font-size="9.5" text-anchor="middle" fill="${color}" font-weight="600">${escapeXml(b.label.split(' (')[0])}</text>
          <text x="${xLab.toFixed(1)}" y="${(mode === 'A' ? yLab + dy : yLab + dy + 22).toFixed(1)}" font-size="8.5" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${b.centre} cm⁻¹</text>
        </g>`;
      });

      let ticks = '';
      const step = zoomBand ? 50 : 500;
      for (let v = Math.floor(maxWn / step) * step; v >= minWn; v -= step){
        const xv = x(v);
        ticks += `<line x1="${xv.toFixed(1)}" y1="${axisY}" x2="${xv.toFixed(1)}" y2="${axisY + 6}" stroke="var(--ink-soft)" stroke-width="1"/>`;
        ticks += `<text x="${xv.toFixed(1)}" y="${axisY + 17}" font-size="9" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${v}</text>`;
      }
      const axisLine = `<line x1="${padX}" y1="${axisY}" x2="${width - padX}" y2="${axisY}" stroke="var(--ink)" stroke-width="1.5"/>`;
      const yLabel = mode === 'A' ? 'Absorbance' : 'Transmittance (%)';
      const dir = `<text x="${width - padX}" y="12" font-size="9" text-anchor="end" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">400 cm⁻¹ →</text><text x="${padX}" y="12" font-size="9" text-anchor="start" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">4000 cm⁻¹ →</text>`;

      const svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Spectre IR — ${escapeXml(spectre.nom)}">
        ${dir}
        <path d="${pathD}" stroke="var(--ink)" stroke-width="1.8" fill="none"/>
        ${axisLine}${ticks}${labelsSvg}
        <text x="${padX}" y="${axisY + 32}" font-size="9" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${yLabel}</text>
      </svg>`;

      const zoomBtn = zoomBand
        ? `<button class="btn ghost ir-spectrum-zoomout" type="button">🔍 Vue d'ensemble</button>`
        : `<span class="m-meta">Clique sur une bande pour zoomer.</span>`;
      const modeToggle = `<button class="btn ghost ir-spectrum-mode" type="button">Afficher en ${mode === 'T' ? 'absorbance' : 'transmittance'}</button>`;

      container.innerHTML = `
        <div class="spectrum-head">
          <div><b>${escapeXml(spectre.nom)}</b> — ${escapeXml(spectre.formule)} <span class="page-tag">${spectre.statut === 'reconstruction' ? 'Reconstruction pédagogique' : 'Expérimental'}</span></div>
          <div class="m-meta">${escapeXml(spectre.conditions)}</div>
        </div>
        <div class="spectrum-svg-wrap">${svg}</div>
        <div class="spectrum-controls">${modeToggle} ${zoomBtn}</div>
      `;

      container.querySelectorAll('.ir-band-hit').forEach(el => {
        el.addEventListener('click', () => {
          const bandId = el.getAttribute('data-band');
          zoomBand = spectre.bandes.find(b => b.id === bandId);
          draw();
        });
      });
      const zoomOut = container.querySelector('.ir-spectrum-zoomout');
      if (zoomOut) zoomOut.addEventListener('click', () => { zoomBand = null; draw(); });
      container.querySelector('.ir-spectrum-mode').addEventListener('click', () => { mode = mode === 'T' ? 'A' : 'T'; draw(); });
    }

    draw();
  }

  function escapeXml(s){
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.SpectrumViewer = { render };
})();
