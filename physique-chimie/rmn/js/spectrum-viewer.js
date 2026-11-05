/*
 * Visionneuse de spectre RMN ¹H simulé/reconstruit à partir des données de
 * data/spectres.js (cf. en-tête de ce fichier pour le statut des données).
 * Trace l'axe δ (convention : valeurs élevées à gauche), les multiplets de
 * chaque signal (géométrie calculée par js/multiplet-svg.js à partir de J),
 * et une courbe d'intégration en escalier. Permet de zoomer sur un signal.
 */
(function(){

  function freqForSpectrum(){ return 400; } // MHz, hypothèse standard documentée dans data/spectres.js

  function render(container, spectreId, opts){
    opts = opts || {};
    const spectre = window.RMN_SPECTRE_BY_ID(spectreId);
    if (!spectre){ container.innerHTML = '<p class="empty">Spectre introuvable.</p>'; return; }
    let zoomSignal = null;

    function draw(){
      const freq = freqForSpectrum();
      const width = opts.width || 680;
      const height = 230;
      const padX = 28;
      const axisY = 150;
      const defaultMin = 0, defaultMax = 10.5;
      let minPpm = defaultMin, maxPpm = defaultMax;
      if (zoomSignal){
        minPpm = Math.max(-0.3, zoomSignal.deltaPpm - 0.35);
        maxPpm = zoomSignal.deltaPpm + 0.35;
      }
      const ppmToX = (ppm) => padX + (width - 2 * padX) * (1 - (ppm - minPpm) / (maxPpm - minPpm));

      let peaksSvg = '';
      let integralSvg = '';
      let labelsSvg = '';
      let cumH = 0;
      const totalH = spectre.signaux.reduce((s, sig) => s + sig.integrationH, 0);
      const sortedByDelta = [...spectre.signaux].sort((a, b) => a.deltaPpm - b.deltaPpm);

      let lastLabelX = -999, staggerToggle = false;
      sortedByDelta.forEach(sig => {
        const info = window.RMN_MULTIPLICITE_INFO[sig.multiplicite] || { n: null };
        let lines;
        if (info.n === null || !sig.J || sig.J.length === 0){
          lines = [{ offset: 0, intensity: 1 }];
        } else {
          lines = window.MultipletSVG.buildMultipletLines([{ n: info.n, J: sig.J[0] }]);
        }
        const color = `var(--${sig.color || 'rust'})`;
        const inWindow = sig.deltaPpm >= minPpm - 0.4 && sig.deltaPpm <= maxPpm + 0.4;
        if (inWindow){
          lines.forEach(l => {
            const ppm = sig.deltaPpm + (l.offset / freq);
            if (ppm < minPpm || ppm > maxPpm) return;
            const x = ppmToX(ppm);
            const hgt = 10 + l.intensity * 70;
            peaksSvg += `<line x1="${x.toFixed(1)}" y1="${axisY}" x2="${x.toFixed(1)}" y2="${(axisY - hgt).toFixed(1)}" stroke="${color}" stroke-width="2.6" stroke-linecap="round" class="rmn-peak" data-sig="${sig.id}"/>`;
          });
          const xLab = ppmToX(sig.deltaPpm);
          if (Math.abs(xLab - lastLabelX) < 64) staggerToggle = !staggerToggle; else staggerToggle = false;
          lastLabelX = xLab;
          const dy = staggerToggle ? 26 : 0;
          labelsSvg += `<g class="rmn-peak-hit" data-sig="${sig.id}" style="cursor:pointer;">
            <rect x="${(xLab - 26).toFixed(1)}" y="${axisY + 4 + dy}" width="52" height="34" fill="var(--paper)" opacity="0.85"/>
            <text x="${xLab.toFixed(1)}" y="${axisY + 16 + dy}" font-size="10.5" text-anchor="middle" fill="${color}" font-weight="600">${escapeXml(sig.label)}</text>
            <text x="${xLab.toFixed(1)}" y="${axisY + 28 + dy}" font-size="9.5" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${sig.deltaPpm.toFixed(2)} ppm</text>
          </g>`;
        }
        // courbe d'intégration en escalier (toujours sur toute la largeur, repère visuel indépendant du zoom)
        cumH += sig.integrationH;
        const xStart = ppmToX(sig.deltaPpm + 0.22);
        const xEnd = ppmToX(sig.deltaPpm - 0.22);
        const yBefore = 34 - (cumH - sig.integrationH) / totalH * 24;
        const yAfter = 34 - cumH / totalH * 24;
        if (xStart >= padX - 5 && xStart <= width - padX + 5){
          integralSvg += `<line x1="${xStart.toFixed(1)}" y1="${yBefore.toFixed(1)}" x2="${xStart.toFixed(1)}" y2="${yBefore.toFixed(1)}" />`;
          integralSvg += `<path d="M ${xStart.toFixed(1)} ${yBefore.toFixed(1)} L ${xEnd.toFixed(1)} ${yAfter.toFixed(1)}" stroke="var(--moss)" stroke-width="1.6" fill="none"/>`;
        }
      });

      let ticks = '';
      for (let v = Math.ceil(minPpm); v <= Math.floor(maxPpm); v++){
        const x = ppmToX(v);
        ticks += `<line x1="${x.toFixed(1)}" y1="${axisY}" x2="${x.toFixed(1)}" y2="${axisY + 6}" stroke="var(--ink-soft)" stroke-width="1"/>`;
        ticks += `<text x="${x.toFixed(1)}" y="${axisY + 18}" font-size="10" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${v.toFixed(zoomSignal ? 1 : 0)}</text>`;
      }
      const axisLine = `<line x1="${padX}" y1="${axisY}" x2="${width - padX}" y2="${axisY}" stroke="var(--ink)" stroke-width="1.5"/>`;
      const dir = `<text x="${width - padX}" y="${axisY - 86}" font-size="9.5" text-anchor="end" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">0 ppm →</text><text x="${padX}" y="${axisY - 86}" font-size="9.5" text-anchor="start" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">δ élevé ←</text>`;

      const svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" role="img" aria-label="Spectre RMN ¹H — ${escapeXml(spectre.nom)}">
        <g stroke="var(--line)" stroke-width="1">${integralSvg}</g>
        ${axisLine}${ticks}${dir}${peaksSvg}${labelsSvg}
      </svg>`;

      const zoomBtn = zoomSignal
        ? `<button class="btn ghost rmn-spectrum-zoomout" type="button">🔍 Vue d'ensemble</button>`
        : `<span class="m-meta">Clique sur un signal pour zoomer.</span>`;

      container.innerHTML = `
        <div class="spectrum-head">
          <div><b>${escapeXml(spectre.nom)}</b> — ${escapeXml(spectre.formule)} <span class="page-tag">${spectre.statut === 'reconstruction' ? 'Reconstruction pédagogique' : 'Expérimental'}</span></div>
          <div class="m-meta">${escapeXml(spectre.conditions)}</div>
        </div>
        <div class="spectrum-svg-wrap">${svg}</div>
        <div class="spectrum-controls">${zoomBtn}</div>
      `;

      container.querySelectorAll('.rmn-peak-hit, .rmn-peak').forEach(el => {
        el.addEventListener('click', () => {
          const sigId = el.getAttribute('data-sig');
          zoomSignal = spectre.signaux.find(s => s.id === sigId);
          draw();
        });
      });
      const zoomOut = container.querySelector('.rmn-spectrum-zoomout');
      if (zoomOut) zoomOut.addEventListener('click', () => { zoomSignal = null; draw(); });
    }

    draw();
  }

  function escapeXml(s){
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.SpectrumViewer = { render };
})();
