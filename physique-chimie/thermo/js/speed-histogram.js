/*
 * Composant partagé : histogramme des vitesses individuelles d'un ensemble
 * de particules, dessiné sur un <canvas> 2D, avec la moyenne ⟨v⟩ (ligne) et
 * une bande ⟨v⟩ ± σ (écart-type). Utilisé par l'atelier 0 (gaz parfait) et
 * l'atelier 4 (gaz microscopique). Aucune dépendance au DOM au-delà du
 * contexte 2D fourni par l'appelant.
 */
(function () {
  function speedsOf(particles) {
    return particles.map(p => Math.hypot(p.vx, p.vy));
  }

  function meanStd(values) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / n;
    return { mean, std: Math.sqrt(variance) };
  }

  /*
   * draw(ctx2d, speeds, opts) : dessine l'histogramme dans un canvas de
   * taille opts.w × opts.h. opts.vMax fixe l'échelle de l'axe des vitesses
   * (toujours fixe d'un appel à l'autre : un axe qui s'auto-ajuste à la
   * distribution courante rendrait la moyenne visuellement invariante par
   * changement d'agitation/température, ce qui serait trompeur).
   * Retourne { mean, std } pour affichage texte complémentaire (hors canvas,
   * utile à l'accessibilité).
   */
  function draw(ctx2d, speeds, opts) {
    const w = opts.w, h = opts.h, vMax = opts.vMax;
    const bins = opts.bins || 16;
    const title = opts.title || 'Vitesses individuelles';
    const { mean, std } = meanStd(speeds);
    const padL = 32, padR = 10, padT = 30, padB = 34;
    const plotW = w - padL - padR, plotH = h - padT - padB;

    ctx2d.clearRect(0, 0, w, h);
    ctx2d.fillStyle = '#1d1a14';
    ctx2d.fillRect(0, 0, w, h);

    const counts = new Array(bins).fill(0);
    speeds.forEach(s => {
      const idx = Math.min(bins - 1, Math.max(0, Math.floor((s / vMax) * bins)));
      counts[idx]++;
    });
    const maxCount = Math.max.apply(null, counts.concat([1]));
    const barW = plotW / bins;
    const xOf = (v) => padL + Math.min(1, Math.max(0, v / vMax)) * plotW;

    // bande moyenne ± écart-type
    const xLo = Math.max(padL, xOf(Math.max(0, mean - std)));
    const xHi = Math.min(padL + plotW, xOf(mean + std));
    ctx2d.fillStyle = 'rgba(232,220,192,0.14)';
    ctx2d.fillRect(xLo, padT, xHi - xLo, plotH);

    // barres de l'histogramme
    ctx2d.fillStyle = '#C89B3C';
    counts.forEach((count, i) => {
      const bh = (count / maxCount) * plotH;
      ctx2d.fillRect(padL + i * barW + 1, padT + plotH - bh, Math.max(1, barW - 2), bh);
    });

    // axes
    ctx2d.strokeStyle = '#6b6354';
    ctx2d.lineWidth = 1;
    ctx2d.beginPath();
    ctx2d.moveTo(padL, padT);
    ctx2d.lineTo(padL, padT + plotH);
    ctx2d.lineTo(padL + plotW, padT + plotH);
    ctx2d.stroke();

    // bornes à ±σ (tirets)
    ctx2d.strokeStyle = '#E8DCC0';
    ctx2d.lineWidth = 1;
    ctx2d.setLineDash([4, 3]);
    [mean - std, mean + std].forEach(v => {
      if (v < 0) return;
      const x = xOf(v);
      ctx2d.beginPath();
      ctx2d.moveTo(x, padT);
      ctx2d.lineTo(x, padT + plotH);
      ctx2d.stroke();
    });
    ctx2d.setLineDash([]);

    // ligne de la moyenne
    const xMean = xOf(mean);
    ctx2d.strokeStyle = '#A6512B';
    ctx2d.lineWidth = 2;
    ctx2d.beginPath();
    ctx2d.moveTo(xMean, padT);
    ctx2d.lineTo(xMean, padT + plotH);
    ctx2d.stroke();

    // titre
    ctx2d.fillStyle = '#E8DCC0';
    ctx2d.font = '11px "IBM Plex Mono", monospace';
    ctx2d.textAlign = 'left';
    ctx2d.fillText(title, padL, 14);

    // graduations numériques (échelle fixe, 0 à vMax)
    ctx2d.fillStyle = '#9b9484';
    ctx2d.textAlign = 'left';
    ctx2d.fillText('0', padL, padT + plotH + 13);
    ctx2d.textAlign = 'right';
    ctx2d.fillText(vMax.toFixed(vMax >= 10 ? 0 : 1), padL + plotW, padT + plotH + 13);

    ctx2d.fillStyle = '#E8DCC0';
    ctx2d.textAlign = 'center';
    ctx2d.fillText(opts.xLabel || 'vitesse (u.a.) →', padL + plotW / 2, h - 6);

    return { mean, std };
  }

  window.SpeedHistogram = { speedsOf, meanStd, draw };
})();
