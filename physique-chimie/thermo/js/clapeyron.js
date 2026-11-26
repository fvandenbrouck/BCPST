/*
 * Diagramme de Clapeyron (plan P, V) en SVG responsive (viewBox). Composant
 * de dessin pur : il ne connaît rien à la physique, il place des éléments
 * déclaratifs dans un repère (V en abscisse, P en ordonnée, origine P=0).
 *
 * Toutes les valeurs passées à `render` sont déjà dans les unités d'affichage
 * choisies par l'appelant (L et bar en pratique) — js/atelier-*.js fait la
 * conversion depuis les unités SI de js/physics.js.
 *
 * Éléments acceptés dans `opts.elements` :
 *   {type:'curve',   points:[{V,P},...], cls}      — ligne continue (isotherme, adiabatique, chemin libre)
 *   {type:'segment', V1,P1,V2,P2, cls}              — ligne droite (isobare, isochore)
 *   {type:'point',   V,P,label,cls}                 — état (cercle + étiquette)
 *   {type:'hline',   P,label,cls}                   — droite horizontale (pression extérieure P_a)
 *   {type:'rect',    V1,V2,P,cls}                   — aire rectangulaire [0,P]×[V1,V2] (travail d'une évolution brutale)
 */
(function () {
  function fmt(v) {
    if (Math.abs(v) >= 100) return Math.round(v).toString();
    if (Math.abs(v) >= 10) return v.toFixed(1);
    return v.toFixed(2);
  }

  function render(container, opts) {
    const width = opts.width || 320;
    const height = opts.height || 240;
    const padL = 40, padR = 12, padT = 22, padB = 40;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const Vmin = 0, Vmax = opts.Vmax;
    const Pmin = 0, Pmax = opts.Pmax;

    function toXY(V, P) {
      const x = padL + (V - Vmin) / (Vmax - Vmin) * plotW;
      const y = padT + (Pmax - P) / (Pmax - Pmin) * plotH;
      return [x, y];
    }
    function fromXY(x, y) {
      const V = Vmin + (x - padL) / plotW * (Vmax - Vmin);
      const P = Pmax - (y - padT) / plotH * (Pmax - Pmin);
      return { V, P };
    }

    const nTicks = 5;
    function ticks(min, max) {
      const out = [];
      for (let i = 0; i <= nTicks; i++) out.push(min + (max - min) * i / nTicks);
      return out;
    }

    let svg = `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Diagramme de Clapeyron" class="clapeyron-svg">`;
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="var(--paper)"/>`;

    // axes
    svg += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${height - padB}" stroke="var(--ink-soft)" stroke-width="1"/>`;
    svg += `<line x1="${padL}" y1="${height - padB}" x2="${width - padR}" y2="${height - padB}" stroke="var(--ink-soft)" stroke-width="1"/>`;
    ticks(Vmin, Vmax).forEach(v => {
      const [x, y] = toXY(v, Pmin);
      svg += `<line x1="${x.toFixed(1)}" y1="${(height - padB).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(height - padB + 4).toFixed(1)}" stroke="var(--ink-soft)"/>`;
      svg += `<text x="${x.toFixed(1)}" y="${(height - padB + 15).toFixed(1)}" font-size="9" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${fmt(v)}</text>`;
    });
    ticks(Pmin, Pmax).forEach(p => {
      const [x, y] = toXY(Vmin, p);
      svg += `<line x1="${(padL - 4).toFixed(1)}" y1="${y.toFixed(1)}" x2="${padL.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--ink-soft)"/>`;
      svg += `<text x="${(padL - 7).toFixed(1)}" y="${(y + 3).toFixed(1)}" font-size="9" text-anchor="end" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${fmt(p)}</text>`;
    });
    svg += `<text x="${(width - padR).toFixed(1)}" y="${(height - padB + 27).toFixed(1)}" font-size="10" text-anchor="end" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">V (${opts.unitV || 'L'})</text>`;
    svg += `<text x="${padL.toFixed(1)}" y="9" font-size="10" text-anchor="start" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">P (${opts.unitP || 'bar'})</text>`;

    (opts.elements || []).forEach(el => {
      if (el.type === 'rect') {
        const [x1, y0] = toXY(el.V1, 0);
        const [x2, y1] = toXY(el.V2, el.P);
        const x = Math.min(x1, x2), w = Math.abs(x2 - x1);
        const y = Math.min(y0, y1), h = Math.abs(y0 - y1);
        svg += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" class="clap-rect ${el.cls || ''}" fill="var(--ochre)" opacity="0.28"/>`;
      } else if (el.type === 'hline') {
        const [x1, y] = toXY(Vmin, el.P);
        const [x2] = toXY(Vmax, el.P);
        svg += `<line x1="${x1.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y.toFixed(1)}" class="clap-hline ${el.cls || ''}" stroke="var(--slate)" stroke-dasharray="4 3" stroke-width="1.5"/>`;
        if (el.label) svg += `<text x="${(x1 + 4).toFixed(1)}" y="${(y - 5).toFixed(1)}" font-size="10" text-anchor="start" fill="var(--slate)" font-family="IBM Plex Mono, monospace">${el.label}</text>`;
      } else if (el.type === 'segment') {
        const [x1, y1] = toXY(el.V1, el.P1);
        const [x2, y2] = toXY(el.V2, el.P2);
        svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="clap-segment ${el.cls || ''}" stroke="var(--rust)" stroke-width="2.4" fill="none"/>`;
      } else if (el.type === 'curve') {
        const d = el.points.map((pt, i) => {
          const [x, y] = toXY(pt.V, pt.P);
          return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
        }).join(' ');
        svg += `<path d="${d}" class="clap-curve ${el.cls || ''}" stroke="var(--rust)" stroke-width="2.4" fill="none"/>`;
      }
    });

    (opts.elements || []).forEach(el => {
      if (el.type === 'point') {
        const [x, y] = toXY(el.V, el.P);
        svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" class="clap-point ${el.cls || ''}" fill="var(--ink)" stroke="var(--paper)" stroke-width="1.5"/>`;
        if (el.label) svg += `<text x="${(x + 8).toFixed(1)}" y="${(y - 7).toFixed(1)}" font-size="12" font-weight="600" fill="var(--ink)" font-family="Inter, sans-serif">${el.label}</text>`;
      }
    });

    svg += `</svg>`;
    container.innerHTML = svg;
    return { toXY, fromXY, svgEl: container.querySelector('svg') };
  }

  window.ClapeyronDiagram = { render };
})();
