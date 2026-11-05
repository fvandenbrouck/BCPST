/*
 * Construction et rendu SVG des diagrammes en bâtons de multiplets RMN
 * (couplage du premier ordre). Génère la géométrie à partir des données
 * (nombre de voisins n, constante J) — ce n'est pas une formule chimique
 * (cf. mémoire du projet sur les structures chimiques) mais un diagramme de
 * données, au même titre qu'un graphique : généré dynamiquement, comme la
 * visionneuse de spectres.
 */
(function(){

  function pascalRow(n){
    const row = [1];
    for (let k = 1; k <= n; k++) row.push(row[k - 1] * (n - k + 1) / k);
    return row;
  }

  /*
   * groups: [{n, J}] — un groupe de n voisins équivalents couplés avec la
   * constante J (en Hz, ou en unité arbitraire pour une illustration).
   * Retourne les raies fusionnées [{offset, intensity}], triées, intensité
   * max normalisée à 1. Les raies dont l'écart est inférieur à `epsilon`
   * sont fusionnées (superposition), modélisant le cas J1≈J2.
   */
  function buildMultipletLines(groups, epsilon){
    epsilon = epsilon === undefined ? 1e-6 : epsilon;
    let lines = [{ offset: 0, intensity: 1 }];
    groups.forEach(g => {
      if (!g.n) return;
      const row = pascalRow(g.n);
      const next = [];
      lines.forEach(line => {
        for (let k = 0; k < row.length; k++){
          const offset = line.offset + g.J * (k - g.n / 2);
          next.push({ offset, intensity: line.intensity * row[k] });
        }
      });
      lines = next;
    });
    lines.sort((a, b) => a.offset - b.offset);
    const merged = [];
    lines.forEach(l => {
      const last = merged[merged.length - 1];
      if (last && Math.abs(l.offset - last.offset) <= epsilon){
        last.intensity += l.intensity;
        last.offset = (last.offset + l.offset) / 2;
      } else {
        merged.push({ offset: l.offset, intensity: l.intensity });
      }
    });
    const maxI = Math.max(...merged.map(l => l.intensity));
    merged.forEach(l => { l.intensity = l.intensity / maxI; });
    return merged;
  }

  /* SVG d'un multiplet : bâtons verticaux, hauteur proportionnelle à l'intensité relative. */
  function renderMultipletSVG(lines, opts){
    opts = opts || {};
    const w = opts.width || 260, h = opts.height || 110;
    const padX = 20, baseY = h - 22, topY = 14;
    const offsets = lines.map(l => l.offset);
    const spread = Math.max(1e-6, Math.max(...offsets) - Math.min(...offsets));
    const mid = (Math.max(...offsets) + Math.min(...offsets)) / 2;
    const usable = (w - 2 * padX) / 2;
    const color = opts.color || 'var(--ink)';
    const scale = spread === 0 ? 0 : (usable * 0.8) / (spread / 2);

    let sticks = '';
    lines.forEach(l => {
      const x = w / 2 + (l.offset - mid) * (spread === 0 ? 0 : scale);
      const y = baseY - (baseY - topY) * l.intensity;
      sticks += `<line x1="${x.toFixed(1)}" y1="${baseY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
    });
    const axis = `<line x1="${padX}" y1="${baseY}" x2="${w - padX}" y2="${baseY}" stroke="var(--line)" stroke-width="1.5"/>`;
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Diagramme de multiplet">${axis}${sticks}</svg>`;
  }

  /* Raccourci : multiplet simple à n voisins équivalents (illustration pédagogique, J arbitraire = 1). */
  function renderSimpleMultiplet(n, opts){
    return renderMultipletSVG(buildMultipletLines([{ n, J: 1 }]), opts);
  }

  window.MultipletSVG = { pascalRow, buildMultipletLines, renderMultipletSVG, renderSimpleMultiplet };
})();
