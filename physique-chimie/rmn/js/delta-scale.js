/*
 * Échelle interactive des déplacements chimiques δ (ppm). Axe orienté comme
 * sur un spectre réel : valeurs élevées à gauche, 0 ppm à droite.
 */
(function(){

  const COLORS = ['rust', 'ochre', 'moss', 'slate', 'rust-deep', 'ink-soft'];

  function ppmToX(ppm, minPpm, maxPpm, width, padX){
    const usable = width - 2 * padX;
    return padX + usable * (1 - (ppm - minPpm) / (maxPpm - minPpm));
  }
  function xToPpm(x, minPpm, maxPpm, width, padX){
    const usable = width - 2 * padX;
    const frac = 1 - (x - padX) / usable;
    return minPpm + frac * (maxPpm - minPpm);
  }

  /*
   * Rendu de l'échelle dans `container` (élément DOM).
   * markers (optionnel) : [{deltaPpm, label, color}] — points à placer (ex. signaux d'une molécule).
   * interactive (optionnel) : si vrai, un survol affiche la valeur δ sous le curseur.
   */
  function render(container, opts){
    opts = opts || {};
    const minPpm = opts.minPpm !== undefined ? opts.minPpm : 0;
    const maxPpm = opts.maxPpm !== undefined ? opts.maxPpm : 10.5;
    const width = opts.width || 680, height = opts.height || (opts.showBands === false ? 90 : 170);
    const padX = 24;
    const axisY = opts.showBands === false ? 40 : 110;

    const plages = window.RMN_COURS.deplacementChimique.plages;
    let bands = '';
    if (opts.showBands !== false){
      plages.forEach((p, i) => {
        const x1 = ppmToX(Math.min(p.max, maxPpm), minPpm, maxPpm, width, padX);
        const x2 = ppmToX(Math.max(p.min, minPpm), minPpm, maxPpm, width, padX);
        const y = 20 + (i % 2) * 20;
        const color = `var(--${COLORS[i % COLORS.length]})`;
        bands += `<rect x="${x1.toFixed(1)}" y="${y}" width="${(x2 - x1).toFixed(1)}" height="12" rx="3" fill="${color}" opacity="0.28"></rect>`;
        bands += `<text x="${((x1 + x2) / 2).toFixed(1)}" y="${y - 4}" font-size="9.5" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${escapeXml(p.domaine.split(' (')[0].split(',')[0].slice(0, 22))}</text>`;
      });
    }

    let ticks = '';
    for (let v = Math.ceil(minPpm); v <= Math.floor(maxPpm); v++){
      const x = ppmToX(v, minPpm, maxPpm, width, padX);
      ticks += `<line x1="${x.toFixed(1)}" y1="${axisY}" x2="${x.toFixed(1)}" y2="${axisY + 7}" stroke="var(--ink-soft)" stroke-width="1"/>`;
      ticks += `<text x="${x.toFixed(1)}" y="${axisY + 19}" font-size="10.5" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${v}</text>`;
    }
    const axisLine = `<line x1="${padX}" y1="${axisY}" x2="${width - padX}" y2="${axisY}" stroke="var(--ink)" stroke-width="1.5"/>`;
    const arrowLabel = `<text x="${width - padX}" y="${axisY - 10}" font-size="10" text-anchor="end" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">0 ppm →</text>`;
    const arrowLabelHigh = `<text x="${padX}" y="${axisY - 10}" font-size="10" text-anchor="start" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">δ élevé ←</text>`;

    let markers = '';
    (opts.markers || []).forEach(m => {
      const x = ppmToX(m.deltaPpm, minPpm, maxPpm, width, padX);
      const color = m.color ? `var(--${m.color})` : 'var(--rust)';
      markers += `<circle cx="${x.toFixed(1)}" cy="${axisY}" r="5" fill="${color}" stroke="var(--paper)" stroke-width="1.5"/>`;
      markers += `<text x="${x.toFixed(1)}" y="${axisY + 34}" font-size="10.5" text-anchor="middle" fill="${color}" font-weight="600">${escapeXml(m.label || '')}</text>`;
    });

    const svgId = 'dscale-' + Math.random().toString(36).slice(2, 9);
    const cursorGroup = opts.interactive
      ? `<g id="${svgId}-cursor" opacity="0"><line x1="0" y1="0" x2="0" y2="${axisY}" stroke="var(--rust-deep)" stroke-width="1" stroke-dasharray="3,2"/><text x="0" y="${axisY + 48}" font-size="11" text-anchor="middle" fill="var(--rust-deep)" font-family="IBM Plex Mono, monospace" font-weight="600"></text></g>`
      : '';

    container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" id="${svgId}" role="img" aria-label="Échelle des déplacements chimiques">${bands}${axisLine}${ticks}${markers}${arrowLabel}${arrowLabelHigh}${cursorGroup}</svg>`;

    if (opts.interactive){
      const svg = container.querySelector('#' + svgId);
      const cursor = container.querySelector('#' + svgId + '-cursor');
      const cursorText = cursor.querySelector('text');
      svg.addEventListener('mousemove', (ev) => {
        const rect = svg.getBoundingClientRect();
        const xSvg = ((ev.clientX - rect.left) / rect.width) * width;
        const ppm = xToPpm(xSvg, minPpm, maxPpm, width, padX);
        if (ppm < minPpm || ppm > maxPpm){ cursor.setAttribute('opacity', '0'); return; }
        cursor.setAttribute('opacity', '1');
        cursor.setAttribute('transform', `translate(${xSvg.toFixed(1)},0)`);
        cursorText.textContent = ppm.toFixed(2) + ' ppm';
      });
      svg.addEventListener('mouseleave', () => cursor.setAttribute('opacity', '0'));
    }
  }

  function escapeXml(s){
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.DeltaScale = { render, ppmToX, xToPpm };
})();
