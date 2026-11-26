/*
 * Atelier 0 — « Découvrir la loi des gaz parfaits ». Introduit l'équation
 * d'état PV = nRT et les trois lois particulières (Boyle-Mariotte,
 * Gay-Lussac, Charles) avant les ateliers 1 à 4, qui utilisent déjà PV = nRT
 * sans l'avoir démontrée.
 *
 * Simulation : particules SANS INTERACTION (aucune collision entre elles,
 * contrairement à l'atelier 4), uniquement des rebonds élastiques sur les
 * parois, dont une paroi mobile (le piston) positionnée directement par un
 * curseur Volume/N — pas de mode « piston libre » : la pression n'est
 * jamais imposée, seulement mesurée. Un thermostat force à chaque image
 * ⟨v²⟩ = 2T (équipartition en 2D, k_B = 1 en unités de simulation), si bien
 * que T est un paramètre d'entrée fiable, jamais une mesure bruitée.
 *
 * Avec m = 1 et k_B = 1 (unités choisies pour que R = 1 aussi), la théorie
 * cinétique (2D, parois dures) donne exactement P·A = N·T, la même relation
 * PV = NkT qu'en 3D. On affiche une seule pression, MESURÉE par les chocs
 * sur le piston, volontairement bruitée (elle fluctue autour de sa valeur
 * moyenne, comme une vraie mesure) — contrairement à l'atelier 4, qualitatif,
 * qui ne comparait qu'une tendance.
 *
 * Unités d'affichage : arbitraires (comme l'atelier 4), choisies pour que
 * V/N et P restent dans des plages lisibles. DISPLAY_K est un facteur
 * d'échelle d'affichage sans signification physique (voir son usage).
 */
(function () {
  const N = 150;
  const R = 4;
  const CANVAS_W = 640, CANVAS_H = 360;
  const WINDOW_FRAMES = 90; // fenêtre glissante (~1,5 s à 60 fps) pour la pression moyenne
  const GAUGE_WINDOW = 10; // sous-fenêtre courte (~0,17 s) pour la jauge de force instantanée
  const DISPLAY_K = 150; // facteur d'échelle d'affichage arbitraire (voir l'en-tête du fichier)

  const HIST_W = 380, HIST_H = 270, HIST_BINS = 16, HIST_VMAX = 8;
  const FORCE_YMAX = 1.5; // échelle fixe de la jauge de force (u.a.) ; sature aux réglages extrêmes (T élevé, V/N faible)

  function fractionToPistonX(f) { return CANVAS_W * f; }

  function defaultInput() {
    return { T: 1.5, fraction: 1.0, predictions: {} };
  }

  function isothermPoints(T, vMin, vMax, steps) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const v = vMin + (vMax - vMin) * i / steps;
      pts.push({ V: v, P: T / v });
    }
    return pts;
  }

  function render(mount, ctx) {
    const { persist, STATE, Physics, Clapeyron } = ctx;
    if (!STATE.atelier0.input) STATE.atelier0.input = defaultInput();
    if (!STATE.atelier0.quiz) STATE.atelier0.quiz = { index: 0, results: [] };
    const input = STATE.atelier0.input;

    let particles = [];
    let pistonX = fractionToPistonX(input.fraction);
    let forceHistory = [];
    let pEma = null; // moyenne lissée de la pression, pour un point fixe dans le diagramme de Clapeyron
    let frameCount = 0;
    let rafId = null;
    let destroyed = false;
    let canvas, canvasCtx, histCanvas, histCanvasCtx;
    let clapMount;

    function initParticles() {
      particles = [];
      for (let i = 0; i < N; i++) {
        const speed = Math.sqrt(2 * input.T) * (0.5 + Math.random());
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: R + Math.random() * (pistonX - 2 * R),
          y: R + Math.random() * (CANVAS_H - 2 * R),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed
        });
      }
    }

    function areaPx() { return pistonX * CANVAS_H; }
    function vDisplay() { return areaPx() / (N * DISPLAY_K); }
    function pMeasuredRaw(windowLen) {
      const arr = windowLen ? forceHistory.slice(-windowLen) : forceHistory;
      if (!arr.length) return 0;
      const meanImpulse = arr.reduce((a, b) => a + b, 0) / arr.length;
      return meanImpulse / CANVAS_H;
    }
    function pMeasuredDisplay(windowLen) { return DISPLAY_K * pMeasuredRaw(windowLen); }
    // Force moyenne attendue par la loi des gaz parfaits (N·T/A, exacte,
    // sans bruit de comptage) : sert de repère fixe sur la jauge, comme
    // ⟨v⟩ sur l'histogramme des vitesses est une moyenne sur les 150
    // particules à l'instant présent, pas une mesure accumulée au cours
    // du temps.
    function forceAttendueRaw() { return N * input.T / areaPx() * CANVAS_H; }

    function step() {
      // Thermostat : force <v^2> = 2T à chaque image (équipartition 2D, k=1).
      let sumSq = 0;
      particles.forEach(p => { sumSq += p.vx * p.vx + p.vy * p.vy; });
      const msq = sumSq / particles.length;
      if (msq > 1e-9) {
        const factor = Math.sqrt(2 * input.T / msq);
        particles.forEach(p => { p.vx *= factor; p.vy *= factor; });
      }

      pistonX = fractionToPistonX(input.fraction);
      let pistonImpulse = 0;

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < R) { p.x = R; p.vx = -p.vx; }
        if (p.y < R) { p.y = R; p.vy = -p.vy; }
        else if (p.y > CANVAS_H - R) { p.y = CANVAS_H - R; p.vy = -p.vy; }
        if (p.x > pistonX - R) {
          p.x = pistonX - R;
          pistonImpulse += 2 * Math.abs(p.vx);
          p.vx = -p.vx;
        }
      });

      forceHistory.push(pistonImpulse);
      if (forceHistory.length > WINDOW_FRAMES) forceHistory.shift();

      const pmFull = pMeasuredDisplay();
      pEma = pEma === null ? pmFull : pEma + (pmFull - pEma) * 0.01;
    }

    function drawFrame() {
      canvasCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      canvasCtx.fillStyle = '#1d1a14';
      canvasCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      canvasCtx.strokeStyle = '#6b6354';
      canvasCtx.lineWidth = 2;
      canvasCtx.beginPath();
      canvasCtx.moveTo(1, CANVAS_H - 1);
      canvasCtx.lineTo(1, 1);
      canvasCtx.lineTo(pistonX, 1);
      canvasCtx.moveTo(1, CANVAS_H - 1);
      canvasCtx.lineTo(pistonX, CANVAS_H - 1);
      canvasCtx.stroke();
      canvasCtx.fillStyle = '#A6512B';
      canvasCtx.fillRect(pistonX - 3, 0, 6, CANVAS_H);
      canvasCtx.fillStyle = '#E8DCC0';
      particles.forEach(p => {
        canvasCtx.beginPath();
        canvasCtx.arc(p.x, p.y, R, 0, Math.PI * 2);
        canvasCtx.fill();
      });
    }

    function drawHistogram() {
      if (!histCanvasCtx) return;
      const speeds = window.SpeedHistogram.speedsOf(particles);
      const { mean, std } = window.SpeedHistogram.draw(histCanvasCtx, speeds, { w: HIST_W, h: HIST_H, bins: HIST_BINS, vMax: HIST_VMAX });
      const txt = mount.querySelector('#gp-hist-stats');
      if (txt) txt.innerHTML = `<span style="color:#A6512B;font-weight:600;">⟨v⟩ = ${mean.toFixed(2)}</span> · écart-type σ = ${std.toFixed(2)} (u.a.)`;
    }

    function updateForceGauge() {
      const instant = pMeasuredRaw(GAUGE_WINDOW) * CANVAS_H; // revient en unités de force brute
      const mean = forceAttendueRaw(); // repère fixe (loi des gaz parfaits), pas une moyenne mesurée
      const fillEl = mount.querySelector('#gp-gauge-fill');
      const meanEl = mount.querySelector('#gp-gauge-mean');
      if (fillEl) fillEl.style.height = Math.min(100, Math.max(0, instant / FORCE_YMAX * 100)) + '%';
      if (meanEl) meanEl.style.bottom = Math.min(100, Math.max(0, mean / FORCE_YMAX * 100)) + '%';
      const txt = mount.querySelector('#gp-force-stats');
      if (txt) txt.innerHTML = `<span style="color:#A6512B;font-weight:600;">Force moyenne attendue</span> ≈ ${mean.toFixed(2)} u.a. (loi des gaz parfaits)`;
    }

    function updateReadouts() {
      const pm = pMeasuredDisplay();
      const txtVn = mount.querySelector('#gp-txt-vn');
      if (txtVn) txtVn.textContent = vDisplay().toFixed(2);
      const combined = mount.querySelector('#gp-combined-value');
      if (combined) combined.textContent = ((pm * vDisplay()) / input.T).toFixed(2);
    }

    function renderClapeyron() {
      if (!clapMount) return;
      const Vmax = 12, Pmax = 1.6;
      const isothermTs = [0.3, 1.0, 1.5, 2.2, 3.0];
      const elements = isothermTs.map(T => {
        const vStart = Math.max(0.5, T / Pmax);
        return { type: 'curve', points: isothermPoints(T, vStart, Vmax, 40), cls: 'gp-isotherm-bg' };
      });
      const pPoint = pEma === null ? pMeasuredDisplay() : pEma;
      elements.push({ type: 'point', V: Math.min(Vmax, vDisplay()), P: Math.min(Pmax, pPoint), label: 'État actuel', cls: 'gp-point-actuel' });
      Clapeyron.render(clapMount, { width: 380, height: 280, Vmax, Pmax, elements, unitV: 'u.a.', unitP: 'u.a.' });
    }

    function loop() {
      if (destroyed) return;
      step();
      drawFrame();
      drawHistogram();
      updateForceGauge();
      updateReadouts();
      frameCount++;
      if (frameCount % 6 === 0) renderClapeyron();
      rafId = requestAnimationFrame(loop);
    }

    function quizSummaryHtml(nbOk, total) {
      return `
        <div class="card">
          <h3>Quizz terminé</h3>
          <p>${nbOk} / ${total} bonnes réponses du premier coup.</p>
          <button type="button" class="btn ghost" id="gp-quiz-restart">Recommencer le quizz</button>
        </div>`;
    }

    function renderQuiz() {
      const quizMount = mount.querySelector('#gp-quiz-mount');
      if (!quizMount) return;
      const quiz = STATE.atelier0.quiz;
      const questions = window.THERMO_QUIZ_GAZ_PARFAIT;
      if (quiz.index >= questions.length) {
        const nbOk = quiz.results.filter(r => r.correct).length;
        quizMount.innerHTML = quizSummaryHtml(nbOk, questions.length);
        quizMount.querySelector('#gp-quiz-restart').addEventListener('click', () => {
          STATE.atelier0.quiz = { index: 0, results: [] };
          persist();
          renderQuiz();
        });
        return;
      }
      quizMount.innerHTML = `<p class="m-meta">Question ${quiz.index + 1} / ${questions.length}</p>`;
      const exoMount = document.createElement('div');
      quizMount.appendChild(exoMount);
      window.QuestionUI.renderPracticeExercise(exoMount, questions[quiz.index], (result) => {
        STATE.atelier0.quiz.results.push(result);
        STATE.atelier0.quiz.index++;
        persist();
        renderQuiz();
      });
      if (window.MathRender) window.MathRender.render(quizMount);
    }

    function draw() {
      mount.innerHTML = `
        <div class="pont">
          <span class="pont-tag">Déjà vu au lycée</span>
          <span class="pont-lycee">Tu as déjà manipulé, séparément, l'effet d'une compression, d'un chauffage ou d'un changement de pression sur un gaz.</span>
          <b>Ici</b>, ces trois lois se révèlent être des cas particuliers d'une seule équation : l'équation d'état du gaz parfait.
        </div>

        <div class="card">
          <h3>L'équation d'état</h3>
          <p>Pour $n$ moles de gaz parfait, à l'équilibre : $$PV = nRT$$ où $R$ est la constante des gaz parfaits. Cette unique relation contient les trois lois particulières ci-dessous, chacune obtenue en bloquant l'une des trois grandeurs P, V, T.</p>
          <div class="gp-law-grid">
            <div class="gp-law-card">
              <h4>Boyle-Mariotte — T bloquée</h4>
              <p>$$PV = \\text{cste}$$ Curseur T immobile, fais varier Volume/N : P mesurée et V/N varient en sens contraire.</p>
            </div>
            <div class="gp-law-card">
              <h4>Gay-Lussac — V bloqué</h4>
              <p>$$\\dfrac{P}{T} = \\text{cste}$$ Curseur Volume/N immobile, fais varier T : P mesurée suit T.</p>
            </div>
            <div class="gp-law-card">
              <h4>Charles — P bloquée</h4>
              <p>$$\\dfrac{V}{T} = \\text{cste}$$ Essaie de trouver un autre réglage (V/N, T) donnant la même pression mesurée : le rapport V/T s'y retrouve inchangé.</p>
            </div>
            <div class="gp-law-card">
              <h4>Loi générale</h4>
              <p>$$\\dfrac{PV}{T} = \\text{cste}$$ Toujours vraie, quels que soient tes réglages : cette constante, c'est $nR$, et elle ne peut changer que si $n$ change. PV/T constant traduit donc la conservation de la matière (aucune particule n'entre ni ne sort de l'enceinte).</p>
            </div>
          </div>
          <p class="m-meta">Exemple numérique (unités du reste du module) : à $P_0=1{,}00\\times10^5$ Pa, $V_0=1{,}00$ L, $T_0=300$ K, on vérifie $P_0 V_0 = ${(Physics.P0 * Physics.V0).toFixed(2)}$ J $= nR\\,T_0 = ${(Physics.NR * Physics.T0).toFixed(2)}$ J.</p>
        </div>

        <div class="predict-box">
          <h4>Avant de manipuler — prédis</h4>
          <p style="font-size:13.5px;margin:0 0 4px;"><b>À température fixée, si tu augmentes le volume par particule (V/N), la pression mesurée va…</b></p>
          <div class="predict-row" data-key="T">
            <button data-val="augmenter">Augmenter</button>
            <button data-val="diminuer">Diminuer</button>
            <button data-val="stable">Rester stable</button>
          </div>
        </div>

        <div class="card">
          <h3>Commandes</h3>
          <div class="ctrl-row">
            <label>T (température, u.a.) : <span class="ctrl-value" id="gp-val-T">${input.T.toFixed(1)}</span></label>
            <input type="range" id="gp-T" min="0.3" max="3.0" step="0.1" value="${input.T}">
          </div>
          <div class="ctrl-row">
            <label>Volume/N (position du piston) : <span class="ctrl-value" id="gp-val-fraction">${vDisplay().toFixed(2)}</span></label>
            <input type="range" id="gp-fraction" min="0.1" max="1.0" step="0.02" value="${input.fraction}">
          </div>
        </div>

        <div class="gaz-canvas-row">
          <div class="gaz-canvas-wrap"><canvas id="gp-canvas" width="${CANVAS_W}" height="${CANVAS_H}"></canvas></div>
          <div class="gaz-canvas-wrap gaz-hist-wrap"><canvas id="gp-hist-canvas" width="${HIST_W}" height="${HIST_H}"></canvas></div>
        </div>
        <p class="m-meta" id="gp-hist-stats" style="margin-top:-4px;">⟨v⟩ = — · écart-type σ = —</p>

        <div class="card">
          <h3>Force sur le piston</h3>
          <div class="gp-gauge-row">
            <div class="gp-gauge-track"><div class="gp-gauge-mean" id="gp-gauge-mean"></div><div class="gp-gauge-fill" id="gp-gauge-fill"></div></div>
            <div class="gp-gauge-label">
              <p class="m-meta">La barre fluctue, choc par choc, autour de sa valeur moyenne (trait).</p>
              <p class="m-meta" id="gp-force-stats">Force moyenne ≈ — u.a.</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Pression mesurée</h3>
          <p class="m-meta">Volume/N = <span id="gp-txt-vn">—</span> u.a.</p>
          <div class="gp-combined">$\\dfrac{P\\cdot (V/N)}{R\\,T}$ = <span id="gp-combined-value">—</span></div>
          <p class="m-meta">Cette quantité doit rester proche de 1, aux fluctuations statistiques près (~1/√150 ≈ 8 %), quels que soient tes réglages — c'est la loi des gaz parfaits.</p>
        </div>

        <div class="card">
          <h3>Diagramme de Clapeyron</h3>
          <div id="gp-clapeyron"></div>
          <p class="m-meta">Les courbes tracées en arrière-plan sont des hyperboles, une par valeur de $T$ (0,3 / 1,0 / 1,5 / 2,2 / 3,0 u.a.). Le point marque l'état courant (V/N, pression moyenne).</p>
        </div>

        <div class="card">
          <h3>Quizz</h3>
          <div id="gp-quiz-mount"></div>
        </div>
      `;

      canvas = mount.querySelector('#gp-canvas');
      canvasCtx = canvas.getContext('2d');
      histCanvas = mount.querySelector('#gp-hist-canvas');
      histCanvasCtx = histCanvas.getContext('2d');
      clapMount = mount.querySelector('#gp-clapeyron');
      wire();
      renderClapeyron();
      renderQuiz();
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

      mount.querySelector('#gp-T').addEventListener('input', (ev) => {
        input.T = parseFloat(ev.target.value);
        mount.querySelector('#gp-val-T').textContent = input.T.toFixed(1);
        persist();
      });

      mount.querySelector('#gp-fraction').addEventListener('input', (ev) => {
        input.fraction = parseFloat(ev.target.value);
        mount.querySelector('#gp-val-fraction').textContent = vDisplay().toFixed(2);
        persist();
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
  window.ThermoAteliers['atelier-0'] = { id: 'atelier-0', titre: 'Découvrir la loi des gaz parfaits', render };
})();
