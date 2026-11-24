/*
 * Atelier 4 — « Gaz microscopique ». Simulation 2D qualitative de disques
 * durs dans une boîte à paroi mobile (curseurs agitation/volume), avec
 * mesure de pression par les chocs sur les parois et option d'interaction
 * attractive (Lennard-Jones simplifié). Explicitement qualitative : un
 * modèle 2D à ~150 particules ne donne pas une vraie pression en pascals,
 * seulement une tendance comparable à P ∝ T/V.
 */
(function () {
  const N = 150;
  const R = 4; // rayon d'un disque, px (résolution interne du canvas)
  const CANVAS_W = 640, CANVAS_H = 360;
  const WINDOW_FRAMES = 40; // fenêtre glissante pour la mesure de pression (~0,66 s à 60 fps)
  const HIST_W = 380, HIST_H = 270, HIST_BINS = 16;

  function speedsOf(particles) {
    return particles.map(p => Math.hypot(p.vx, p.vy));
  }

  function meanStd(values) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / n;
    return { mean, std: Math.sqrt(variance) };
  }

  function defaultInput() {
    return { agitation: 1.5, volume: 1.0, lj: false, predictions: { agitation: null, volume: null } };
  }

  function render(mount, ctx) {
    const { persist, STATE } = ctx;
    if (!STATE.atelier4.input) STATE.atelier4.input = defaultInput();
    const input = STATE.atelier4.input;

    let particles = [];
    let impulseBuffer = [];
    let rafId = null;
    let canvas, canvasCtx;
    let histCanvas, histCanvasCtx;
    let destroyed = false;

    function boxWidth() { return CANVAS_W * (0.35 + 0.65 * input.volume); }

    function initParticles() {
      particles = [];
      const w = boxWidth();
      for (let i = 0; i < N; i++) {
        const speed = input.agitation * (0.5 + Math.random());
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: R + Math.random() * (w - 2 * R),
          y: R + Math.random() * (CANVAS_H - 2 * R),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed
        });
      }
    }

    function rescaleSpeeds(factor) {
      particles.forEach(p => { p.vx *= factor; p.vy *= factor; });
    }

    function step() {
      const w = boxWidth();
      let frameImpulse = 0;
      let potentielPaires = 0;

      // interaction attractive simplifiée (Lennard-Jones, partie attractive seulement
      // — la répulsion à courte distance est assurée par la collision élastique dure)
      if (input.lj) {
        const cutoff = 26;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = b.x - a.x, dy = b.y - a.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < cutoff * cutoff && d2 > (2 * R) * (2 * R)) {
              const d = Math.sqrt(d2);
              const force = 0.0025; // intensité arbitraire, qualitative
              const ax = (dx / d) * force, ay = (dy / d) * force;
              a.vx += ax; a.vy += ay; b.vx -= ax; b.vy -= ay;
              potentielPaires++;
            }
          }
        }
      }

      // intégration + collisions avec les parois
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < R) { p.x = R; p.vx = -p.vx; frameImpulse += Math.abs(p.vx); }
        else if (p.x > w - R) { p.x = w - R; p.vx = -p.vx; frameImpulse += Math.abs(p.vx); }
        if (p.y < R) { p.y = R; p.vy = -p.vy; frameImpulse += Math.abs(p.vy); }
        else if (p.y > CANVAS_H - R) { p.y = CANVAS_H - R; p.vy = -p.vy; frameImpulse += Math.abs(p.vy); }
      });

      // collisions élastiques disque-disque (masses égales : on échange la
      // composante de vitesse portée par la ligne des centres)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d2 = dx * dx + dy * dy;
          const minD = 2 * R;
          if (d2 < minD * minD && d2 > 1e-6) {
            const d = Math.sqrt(d2);
            const nx = dx / d, ny = dy / d;
            const overlap = minD - d;
            a.x -= nx * overlap / 2; a.y -= ny * overlap / 2;
            b.x += nx * overlap / 2; b.y += ny * overlap / 2;
            const relVx = b.vx - a.vx, relVy = b.vy - a.vy;
            const relN = relVx * nx + relVy * ny;
            if (relN < 0) {
              a.vx += relN * nx; a.vy += relN * ny;
              b.vx -= relN * nx; b.vy -= relN * ny;
            }
          }
        }
      }

      impulseBuffer.push(frameImpulse);
      if (impulseBuffer.length > WINDOW_FRAMES) impulseBuffer.shift();

      return { potentielPaires };
    }

    function perimeter() { return 2 * (boxWidth() + CANVAS_H); }

    function pressionMesuree() {
      const sum = impulseBuffer.reduce((a, b) => a + b, 0);
      return sum / (impulseBuffer.length * perimeter() / 1000 || 1);
    }

    function pressionAttendueRelative() {
      // P ∝ T/V : agitation sert de proxy à T, boxWidth (à hauteur fixe) sert de proxy à V
      return input.agitation / (boxWidth() / CANVAS_W);
    }

    function drawFrame(diag) {
      canvasCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      canvasCtx.fillStyle = '#1d1a14';
      canvasCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      const w = boxWidth();
      canvasCtx.strokeStyle = '#C89B3C';
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeRect(1, 1, w - 2, CANVAS_H - 2);
      canvasCtx.fillStyle = '#E8DCC0';
      particles.forEach(p => {
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, R, 0, Math.PI * 2);
        canvasCtx.fill();
      });
    }

    function drawHistogram() {
      if (!histCanvasCtx) return;
      const speeds = speedsOf(particles);
      const { mean, std } = meanStd(speeds);
      const padL = 32, padR = 10, padT = 30, padB = 26;
      const plotW = HIST_W - padL - padR, plotH = HIST_H - padT - padB;

      histCanvasCtx.clearRect(0, 0, HIST_W, HIST_H);
      histCanvasCtx.fillStyle = '#1d1a14';
      histCanvasCtx.fillRect(0, 0, HIST_W, HIST_H);

      const vMax = Math.max(mean + 3.2 * std, 0.6) * 1.05;
      const bins = new Array(HIST_BINS).fill(0);
      speeds.forEach(s => {
        const idx = Math.min(HIST_BINS - 1, Math.floor((s / vMax) * HIST_BINS));
        bins[idx]++;
      });
      const maxCount = Math.max.apply(null, bins.concat([1]));
      const barW = plotW / HIST_BINS;
      const xOf = (v) => padL + (v / vMax) * plotW;

      // bande moyenne ± écart-type
      const xLo = Math.max(padL, xOf(Math.max(0, mean - std)));
      const xHi = Math.min(padL + plotW, xOf(mean + std));
      histCanvasCtx.fillStyle = 'rgba(232,220,192,0.14)';
      histCanvasCtx.fillRect(xLo, padT, xHi - xLo, plotH);

      // barres de l'histogramme
      histCanvasCtx.fillStyle = '#C89B3C';
      bins.forEach((count, i) => {
        const h = (count / maxCount) * plotH;
        histCanvasCtx.fillRect(padL + i * barW + 1, padT + plotH - h, Math.max(1, barW - 2), h);
      });

      // axes
      histCanvasCtx.strokeStyle = '#6b6354';
      histCanvasCtx.lineWidth = 1;
      histCanvasCtx.beginPath();
      histCanvasCtx.moveTo(padL, padT);
      histCanvasCtx.lineTo(padL, padT + plotH);
      histCanvasCtx.lineTo(padL + plotW, padT + plotH);
      histCanvasCtx.stroke();

      // bornes à ±σ (tirets)
      histCanvasCtx.strokeStyle = '#E8DCC0';
      histCanvasCtx.lineWidth = 1;
      histCanvasCtx.setLineDash([4, 3]);
      [mean - std, mean + std].forEach(v => {
        if (v < 0) return;
        const x = xOf(v);
        histCanvasCtx.beginPath();
        histCanvasCtx.moveTo(x, padT);
        histCanvasCtx.lineTo(x, padT + plotH);
        histCanvasCtx.stroke();
      });
      histCanvasCtx.setLineDash([]);

      // ligne de la moyenne
      const xMean = xOf(mean);
      histCanvasCtx.strokeStyle = '#A6512B';
      histCanvasCtx.lineWidth = 2;
      histCanvasCtx.beginPath();
      histCanvasCtx.moveTo(xMean, padT);
      histCanvasCtx.lineTo(xMean, padT + plotH);
      histCanvasCtx.stroke();

      // titre et repère d'axe
      histCanvasCtx.fillStyle = '#E8DCC0';
      histCanvasCtx.font = '11px "IBM Plex Mono", monospace';
      histCanvasCtx.textAlign = 'left';
      histCanvasCtx.fillText('Vitesses individuelles', padL, 14);
      histCanvasCtx.textAlign = 'center';
      histCanvasCtx.fillText('vitesse (u.a.) →', padL + plotW / 2, HIST_H - 6);

      const txt = mount.querySelector('#hist-stats');
      if (txt) txt.innerHTML = `<span style="color:#A6512B;font-weight:600;">⟨v⟩ = ${mean.toFixed(2)}</span> · écart-type σ = ${std.toFixed(2)} (unités arbitraires ; bande claire = [⟨v⟩−σ, ⟨v⟩+σ])`;
    }

    function loop() {
      if (destroyed) return;
      const diag = step();
      drawFrame(diag);
      drawHistogram();
      updateJauges(diag);
      rafId = requestAnimationFrame(loop);
    }

    function updateJauges(diag) {
      const pm = pressionMesuree();
      const pa = pressionAttendueRelative();
      const maxJauge = Math.max(pm, pa, 1) * 1.15;
      const elPm = mount.querySelector('#jauge-pm');
      const elPa = mount.querySelector('#jauge-pa');
      if (elPm) elPm.style.width = Math.min(100, pm / maxJauge * 100) + '%';
      if (elPa) elPa.style.width = Math.min(100, pa / maxJauge * 100) + '%';
      const txtPm = mount.querySelector('#txt-pm');
      if (txtPm) txtPm.textContent = pm.toFixed(2);
      const elEp = mount.querySelector('#jauge-ep');
      if (elEp && input.lj) elEp.style.width = Math.min(100, diag.potentielPaires / 3) + '%';
    }

    function draw() {
      mount.innerHTML = `
        <div class="pont">
          <span class="pont-tag">Déjà vu au lycée</span>
          <span class="pont-lycee">La pression d'un gaz a été présentée comme une grandeur macroscopique, sans lien explicite avec le mouvement des entités microscopiques.</span>
          <b>Ici</b>, la pression apparaît comme la conséquence directe des chocs répétés des particules sur les parois : plus elles vont vite ou plus elles sont confinées, plus les chocs sont fréquents et violents.
        </div>

        <div class="reco"><b>Simulation qualitative</b><br>Ce modèle 2D à ~150 disques ne donne pas une vraie pression en pascals : seule la <b>tendance</b> (la direction dans laquelle la pression varie) est comparable à la relation $P \\propto T/V$ d'un gaz parfait.</div>

        <div class="predict-box">
          <h4>Avant de manipuler — prédis</h4>
          <p style="font-size:13.5px;margin:0 0 4px;"><b>Si on augmente l'agitation (la température) à volume constant, la pression mesurée va…</b></p>
          <div class="predict-row" data-key="agitation">
            <button data-val="augmenter">Augmenter</button>
            <button data-val="diminuer">Diminuer</button>
            <button data-val="stable">Rester stable</button>
          </div>
          <p style="font-size:13.5px;margin:8px 0 4px;"><b>Si on diminue le volume à agitation constante, la pression mesurée va…</b></p>
          <div class="predict-row" data-key="volume">
            <button data-val="augmenter">Augmenter</button>
            <button data-val="diminuer">Diminuer</button>
            <button data-val="stable">Rester stable</button>
          </div>
        </div>

        <div class="card">
          <h3>Commandes</h3>
          <div class="ctrl-row">
            <label>Agitation (∝ température) : <span class="ctrl-value" id="val-agitation">${input.agitation.toFixed(1)}</span></label>
            <input type="range" id="agitation" min="0.3" max="3.0" step="0.1" value="${input.agitation}">
          </div>
          <div class="ctrl-row">
            <label>Volume (paroi mobile) : <span class="ctrl-value" id="val-volume">${(input.volume * 100).toFixed(0)} %</span></label>
            <input type="range" id="volume" min="0.3" max="1.0" step="0.02" value="${input.volume}">
          </div>
          <div class="mode-toggle">
            <button id="toggle-lj" class="${input.lj ? 'active' : ''}">Interaction attractive (Lennard-Jones) : ${input.lj ? 'activée' : 'désactivée'}</button>
          </div>
        </div>

        <div class="gaz-canvas-row">
          <div class="gaz-canvas-wrap"><canvas id="gaz-canvas" width="${CANVAS_W}" height="${CANVAS_H}"></canvas></div>
          <div class="gaz-canvas-wrap gaz-hist-wrap">
            <canvas id="gaz-hist-canvas" width="${HIST_W}" height="${HIST_H}"></canvas>
          </div>
        </div>
        <p class="m-meta" id="hist-stats" style="margin-top:-4px;">⟨v⟩ = — · écart-type σ = —</p>

        <div class="card">
          <h3>Pression mesurée par les chocs</h3>
          <div class="gaz-mesure" style="flex-direction:column;">
            <div style="width:100%;">
              <p class="m-meta">Pression mesurée (unités arbitraires) : <span id="txt-pm">—</span></p>
              <div class="comp-bar-bg" style="height:14px;border-radius:7px;background:var(--parchment-deep);"><div id="jauge-pm" style="height:100%;border-radius:7px;background:var(--rust);width:0%;"></div></div>
            </div>
            <div style="width:100%;margin-top:8px;">
              <p class="m-meta">Tendance attendue, $P\\propto T/V$ (mêmes réglages)</p>
              <div class="comp-bar-bg" style="height:14px;border-radius:7px;background:var(--parchment-deep);"><div id="jauge-pa" style="height:100%;border-radius:7px;background:var(--moss);width:0%;"></div></div>
            </div>
            ${input.lj ? `<div style="width:100%;margin-top:8px;">
              <p class="m-meta">Interaction attractive active : nombre de paires proches (indicateur qualitatif que l'énergie interne dépend aussi de V/N)</p>
              <div class="comp-bar-bg" style="height:14px;border-radius:7px;background:var(--parchment-deep);"><div id="jauge-ep" style="height:100%;border-radius:7px;background:var(--slate);width:0%;"></div></div>
            </div>` : ''}
          </div>
          <p class="m-meta">Si les deux premières barres montent et descendent ensemble quand tu bouges les curseurs, c'est cohérent avec $P\\propto T/V$.</p>
        </div>
      `;

      canvas = mount.querySelector('#gaz-canvas');
      canvasCtx = canvas.getContext('2d');
      histCanvas = mount.querySelector('#gaz-hist-canvas');
      histCanvasCtx = histCanvas.getContext('2d');
      wire();
      if (window.MathRender) window.MathRender.render(mount);
    }

    function wire() {
      mount.querySelectorAll('.predict-row').forEach(row => {
        row.querySelectorAll('button').forEach(b => {
          if (input.predictions[row.dataset.key] === b.dataset.val) b.classList.add('selected');
          b.addEventListener('click', () => {
            input.predictions[row.dataset.key] = b.dataset.val;
            persist();
            row.querySelectorAll('button').forEach(x => x.classList.remove('selected'));
            b.classList.add('selected');
          });
        });
      });
      mount.querySelector('#agitation').addEventListener('input', (ev) => {
        const nv = parseFloat(ev.target.value);
        const factor = nv / input.agitation;
        input.agitation = nv;
        mount.querySelector('#val-agitation').textContent = nv.toFixed(1);
        rescaleSpeeds(factor);
        persist();
      });
      mount.querySelector('#volume').addEventListener('input', (ev) => {
        input.volume = parseFloat(ev.target.value);
        mount.querySelector('#val-volume').textContent = (input.volume * 100).toFixed(0) + ' %';
        const w = boxWidth();
        particles.forEach(p => { if (p.x > w - R) p.x = w - R; });
        persist();
      });
      mount.querySelector('#toggle-lj').addEventListener('click', () => {
        input.lj = !input.lj;
        persist();
        draw();
        initParticles();
        startLoopIfNeeded();
      });
    }

    function startLoopIfNeeded() {
      if (rafId === null) loop();
    }

    draw();
    initParticles();
    startLoopIfNeeded();

    return function destroy() {
      destroyed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }

  window.ThermoAteliers = window.ThermoAteliers || {};
  window.ThermoAteliers['atelier-4'] = { id: 'atelier-4', titre: 'Gaz microscopique', render };
})();
