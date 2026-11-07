/*
 * Échelle interactive des nombres d'onde (cm⁻¹). Axe orienté comme sur un
 * spectre IR réel : valeurs élevées à gauche (4000 cm⁻¹), valeurs faibles à
 * droite (400 cm⁻¹).
 */
(function(){

  const COLORS = ['rust', 'ochre', 'moss', 'slate', 'rust-deep', 'ink-soft', 'moss', 'ochre'];

  function wnToX(wn, minWn, maxWn, width, padX){
    const usable = width - 2 * padX;
    return padX + usable * (1 - (wn - minWn) / (maxWn - minWn));
  }
  function xToWn(x, minWn, maxWn, width, padX){
    const usable = width - 2 * padX;
    const frac = 1 - (x - padX) / usable;
    return minWn + frac * (maxWn - minWn);
  }

  function render(container, opts){
    opts = opts || {};
    const minWn = opts.minWn !== undefined ? opts.minWn : 400;
    const maxWn = opts.maxWn !== undefined ? opts.maxWn : 4000;
    const width = opts.width || 680, height = opts.height || (opts.showBands === false ? 90 : 180);
    const padX = 26;
    const axisY = opts.showBands === false ? 40 : 120;

    const table = window.IR_TABLE_BANDES;
    let bands = '';
    if (opts.showBands !== false){
      table.forEach((p, i) => {
        const x1 = wnToX(Math.min(p.domaine[1], maxWn), minWn, maxWn, width, padX);
        const x2 = wnToX(Math.max(p.domaine[0], minWn), minWn, maxWn, width, padX);
        const y = 16 + (i % 3) * 18;
        const color = `var(--${COLORS[i % COLORS.length]})`;
        bands += `<rect x="${x1.toFixed(1)}" y="${y}" width="${(x2 - x1).toFixed(1)}" height="11" rx="3" fill="${color}" opacity="0.3"></rect>`;
        bands += `<text x="${((x1 + x2) / 2).toFixed(1)}" y="${y - 3}" font-size="9" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${escapeXml(p.groupe.split(' (')[0].slice(0, 20))}</text>`;
      });
    }

    let ticks = '';
    for (let v = Math.floor(maxWn / 500) * 500; v >= minWn; v -= 500){
      const x = wnToX(v, minWn, maxWn, width, padX);
      ticks += `<line x1="${x.toFixed(1)}" y1="${axisY}" x2="${x.toFixed(1)}" y2="${axisY + 7}" stroke="var(--ink-soft)" stroke-width="1"/>`;
      ticks += `<text x="${x.toFixed(1)}" y="${axisY + 19}" font-size="9.5" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${v}</text>`;
    }
    const axisLine = `<line x1="${padX}" y1="${axisY}" x2="${width - padX}" y2="${axisY}" stroke="var(--ink)" stroke-width="1.5"/>`;
    const arrowLow = `<text x="${width - padX}" y="${axisY - 10}" font-size="10" text-anchor="end" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">← ${minWn} cm⁻¹</text>`;
    const arrowHigh = `<text x="${padX}" y="${axisY - 10}" font-size="10" text-anchor="start" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${maxWn} cm⁻¹ →</text>`;

    let markers = '';
    (opts.markers || []).forEach(m => {
      const x = wnToX(m.centre, minWn, maxWn, width, padX);
      const color = m.color ? `var(--${m.color})` : 'var(--rust)';
      markers += `<circle cx="${x.toFixed(1)}" cy="${axisY}" r="5" fill="${color}" stroke="var(--paper)" stroke-width="1.5"/>`;
      markers += `<text x="${x.toFixed(1)}" y="${axisY + 34}" font-size="10" text-anchor="middle" fill="${color}" font-weight="600">${escapeXml(m.label || '')}</text>`;
    });

    const svgId = 'iscale-' + Math.random().toString(36).slice(2, 9);
    const cursorGroup = opts.interactive
      ? `<g id="${svgId}-cursor" opacity="0"><line x1="0" y1="0" x2="0" y2="${axisY}" stroke="var(--rust-deep)" stroke-width="1" stroke-dasharray="3,2"/><text x="0" y="${axisY + 48}" font-size="11" text-anchor="middle" fill="var(--rust-deep)" font-family="IBM Plex Mono, monospace" font-weight="600"></text></g>`
      : '';

    container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" id="${svgId}" role="img" aria-label="Échelle des nombres d'onde">${bands}${axisLine}${ticks}${markers}${arrowLow}${arrowHigh}${cursorGroup}</svg>`;

    if (opts.interactive){
      const svg = container.querySelector('#' + svgId);
      const cursor = container.querySelector('#' + svgId + '-cursor');
      const cursorText = cursor.querySelector('text');
      svg.addEventListener('mousemove', (ev) => {
        const rect = svg.getBoundingClientRect();
        const xSvg = ((ev.clientX - rect.left) / rect.width) * width;
        const wn = xToWn(xSvg, minWn, maxWn, width, padX);
        if (wn < minWn || wn > maxWn){ cursor.setAttribute('opacity', '0'); return; }
        cursor.setAttribute('opacity', '1');
        cursor.setAttribute('transform', `translate(${xSvg.toFixed(1)},0)`);
        cursorText.textContent = Math.round(wn) + ' cm⁻¹';
      });
      svg.addEventListener('mouseleave', () => cursor.setAttribute('opacity', '0'));
    }
  }

  function escapeXml(s){
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.IrScale = { render, wnToX, xToWn };
})();
