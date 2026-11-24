/*
 * Atelier 1 — « Piston, gaz et chemins ». Un piston enferme un gaz parfait
 * dans un cylindre horizontal ; l'étudiant choisit l'état initial, la
 * pression extérieure et le type d'évolution (brutale ou quasi-statique),
 * prédit le signe de W et de Q, puis observe le résultat calculé par
 * js/physics.js et affiché dans le diagramme de Clapeyron (js/clapeyron.js).
 *
 * Évolution brutale monobare : la pression du gaz n'est pas définie pendant
 * le mouvement du piston — le diagramme n'affiche jamais de chemin dans ce
 * cas, seulement l'état initial, l'état final, la droite P = P_a et l'aire
 * du rectangle représentant le travail.
 */
(function () {
  const L = 1e-3; // 1 L en m³
  const BAR = 1e5; // 1 bar en Pa

  function defaultInput() {
    return {
      gaz: 'mono',
      Vi_L: 1.00, Ti_K: 300,
      Pa_bar: 1.00,
      mode: 'brutal',
      brutalSub: 'Q',
      Q_J: 250,
      quasiType: 'isotherme',
      Vf_L: 2.00,
      Pf_bar: 2.00,
      prediction: { W: null, Q: null },
      revealed: false
    };
  }

  function render(mount, ctx) {
    const { Physics, Clapeyron, escapeXml, persist, STATE } = ctx;
    if (!STATE.atelier1.input) STATE.atelier1.input = defaultInput();
    const input = STATE.atelier1.input;

    function Cv() { return input.gaz === 'di' ? Physics.CV_DI : Physics.CV_MONO; }
    function gamma() { return input.gaz === 'di' ? Physics.GAMMA_DI : Physics.GAMMA_MONO; }

    function compute() {
      const Pi = input.Pa_bar; // non utilisé directement : Pi est déduite de Vi, Ti
      const Vi = input.Vi_L * L, Ti = input.Ti_K;
      const PiSI = Physics.pressionDe(Vi, Ti);
      if (input.mode === 'brutal') {
        const Pa = input.Pa_bar * BAR;
        if (input.brutalSub === 'Q') {
          return Physics.brutalMonobareQImpose(PiSI, Vi, Ti, Pa, input.Q_J, Cv());
        }
        return Physics.brutalThermostat(PiSI, Vi, Ti, Pa, Physics.T0, Cv());
      }
      if (input.quasiType === 'isotherme') {
        return Physics.isotherme(Vi, input.Vf_L * L, Ti);
      }
      if (input.quasiType === 'isobare') {
        const Pi2 = PiSI;
        const r = Physics.segmentIsobare(Pi2, Vi, Ti, input.Vf_L * L, Cv());
        return r;
      }
      if (input.quasiType === 'isochore') {
        return Physics.segmentIsochore(PiSI, Vi, Ti, input.Pf_bar * BAR, Cv());
      }
      // adiabatique réversible
      return Physics.segmentAdiabatiqueReversibleVersV(PiSI, Vi, Ti, input.Vf_L * L, gamma(), Cv());
    }

    function diagramElements(r) {
      const Vi = r.Vi / L, Vf = r.Vf / L, Pi = r.Pi / BAR, Pf = r.Pf / BAR;
      if (input.mode === 'brutal') {
        return {
          Vmax: Math.max(Vi, Vf) * 1.35,
          Pmax: Math.max(Pi, Pf, input.Pa_bar) * 1.35,
          elements: [
            { type: 'hline', P: input.Pa_bar, label: 'P = Pₐ' },
            { type: 'rect', V1: Vi, V2: Vf, P: input.Pa_bar },
            { type: 'point', V: Vi, P: Pi, label: 'État initial' },
            { type: 'point', V: Vf, P: Pf, label: 'État final' }
          ]
        };
      }
      const Vmax = Math.max(Vi, Vf) * 1.35, Pmax = Math.max(Pi, Pf) * 1.35;
      let curveEl;
      if (input.quasiType === 'isotherme') {
        const pts = [];
        const n = 24;
        for (let i = 0; i <= n; i++) {
          const V = Vi + (Vf - Vi) * i / n;
          pts.push({ V, P: Physics.pressionDe(V * L, r.Ti) / BAR });
        }
        curveEl = { type: 'curve', points: pts, cls: 'isotherme' };
      } else if (input.quasiType === 'adiabatique') {
        const pts = [];
        const n = 24;
        for (let i = 0; i <= n; i++) {
          const V = Vi + (Vf - Vi) * i / n;
          pts.push({ V, P: (r.Pi * Math.pow(r.Vi / (V * L), gamma())) / BAR });
        }
        curveEl = { type: 'curve', points: pts, cls: 'adiabatique' };
      } else {
        curveEl = { type: 'segment', V1: Vi, P1: Pi, V2: Vf, P2: Pf, cls: input.quasiType };
      }
      return {
        Vmax, Pmax,
        elements: [curveEl,
          { type: 'point', V: Vi, P: Pi, label: 'État initial' },
          { type: 'point', V: Vf, P: Pf, label: 'État final' }]
      };
    }

    function signeLabel(x, eps) {
      eps = eps || 1e-6;
      if (x > eps) return 'positif (reçu)';
      if (x < -eps) return 'négatif (cédé)';
      return 'nul';
    }

    function draw() {
      const r = compute();
      const d = diagramElements(r);

      mount.innerHTML = `
        <div class="pont">
          <span class="pont-tag">Déjà vu au lycée</span>
          <span class="pont-lycee">En Terminale, le premier principe $\\Delta U = W + Q$ est appliqué à des cas simples (bloc qui chauffe, système qui reçoit un travail).</span>
          <b>En BCPST1</b>, on distingue explicitement une évolution <b>brutale</b> (la pression du gaz n'est définie qu'à l'équilibre, jamais pendant le mouvement) d'une évolution <b>quasi-statique</b> (la pression est définie à chaque instant, $W=-\\int P\\,\\mathrm{d}V$ est l'aire sous la courbe).
        </div>

        <div class="card">
          <h3>Gaz et état initial</h3>
          <div class="mode-toggle" id="gaz-toggle">
            <button data-gaz="mono" class="${input.gaz === 'mono' ? 'active' : ''}">Monoatomique ($C_v=\\tfrac{3}{2}nR$)</button>
            <button data-gaz="di" class="${input.gaz === 'di' ? 'active' : ''}">Diatomique ($C_v=\\tfrac{5}{2}nR$)</button>
          </div>
          <div class="ctrl-row">
            <label>Volume initial $V_i$ : <span class="ctrl-value">${input.Vi_L.toFixed(2)} L</span></label>
            <input type="range" id="Vi" min="0.5" max="2.0" step="0.05" value="${input.Vi_L}">
          </div>
          <div class="ctrl-row">
            <label>Température initiale $T_i$ : <span class="ctrl-value">${input.Ti_K} K</span></label>
            <input type="range" id="Ti" min="200" max="400" step="5" value="${input.Ti_K}">
          </div>
          <p class="m-meta">Pression initiale déduite de $P_iV_i=nRT_i$ : $P_i ≈ ${(r.Pi / BAR).toFixed(2)}$ bar.</p>
        </div>

        <div class="card">
          <h3>Type d'évolution</h3>
          <div class="mode-toggle" id="mode-toggle">
            <button data-mode="brutal" class="${input.mode === 'brutal' ? 'active' : ''}">Brutale (contre $P_a$)</button>
            <button data-mode="quasi" class="${input.mode === 'quasi' ? 'active' : ''}">Quasi-statique</button>
          </div>
          ${input.mode === 'brutal' ? renderBrutalControls(r) : renderQuasiControls(r)}
        </div>

        ${!input.revealed ? renderPredictBox() : ''}

        <div class="card" style="text-align:center;">
          <button class="btn primary" id="btn-lancer" style="flex:none;padding:12px 28px;">${input.revealed ? 'Relancer avec ces réglages' : 'Lancer la simulation'}</button>
        </div>

        ${input.revealed ? renderResultats(r) : ''}

        <div class="clapeyron-wrap" id="clap-mount"></div>
        <div class="clap-legend">
          <span><span class="sw" style="background:var(--ink);"></span> États</span>
          ${input.mode === 'brutal' ? '<span><span class="sw" style="background:var(--ochre);border-radius:2px;"></span> Travail −P<sub>a</sub>ΔV</span>' : '<span><span class="sw" style="background:var(--rust);border-radius:2px;"></span> Chemin quasi-statique</span>'}
        </div>

        ${input.mode === 'brutal' ? `
        <div class="card">
          <h3>Option — animation du piston</h3>
          <p class="m-meta">En évolution brutale, le piston oscille et s'amortit avant de s'immobiliser à l'équilibre final : l'énergie cinétique du piston devient énergie interne du gaz au cours de l'amortissement, sans apparaître séparément dans le bilan ΔU = W + Q.</p>
        </div>` : ''}
      `;

      Clapeyron.render(mount.querySelector('#clap-mount'), { Vmax: d.Vmax, Pmax: d.Pmax, elements: d.elements, unitV: 'L', unitP: 'bar' });

      wire(r);
      if (window.MathRender) window.MathRender.render(mount);
    }

    function renderBrutalControls(r) {
      return `
        <div class="mode-toggle" id="brutalsub-toggle">
          <button data-sub="Q" class="${input.brutalSub === 'Q' ? 'active' : ''}">Transfert thermique Q imposé</button>
          <button data-sub="thermostat" class="${input.brutalSub === 'thermostat' ? 'active' : ''}">Thermostat à $T_0$ = 300 K</button>
        </div>
        <div class="ctrl-row">
          <label>Pression extérieure $P_a$ : <span class="ctrl-value">${input.Pa_bar.toFixed(2)} bar</span></label>
          <input type="range" id="Pa" min="0.3" max="3.0" step="0.05" value="${input.Pa_bar}">
        </div>
        ${input.brutalSub === 'Q' ? `
        <div class="ctrl-row">
          <label>Transfert thermique imposé $Q$ : <span class="ctrl-value">${input.Q_J} J</span></label>
          <input type="range" id="Q" min="-300" max="300" step="10" value="${input.Q_J}">
        </div>` : `<p class="m-meta">Le gaz, mis en contact d'un thermostat, revient à l'équilibre à $T_f=T_0=300$ K ; $Q$ est alors déduit du premier principe.</p>`}
      `;
    }

    function renderQuasiControls(r) {
      const types = [['isotherme', 'Isotherme'], ['isobare', 'Isobare'], ['isochore', 'Isochore'], ['adiabatique', 'Adiabatique réversible']];
      let extra = '';
      if (input.quasiType === 'isochore') {
        extra = `<div class="ctrl-row">
          <label>Pression finale $P_f$ : <span class="ctrl-value">${input.Pf_bar.toFixed(2)} bar</span></label>
          <input type="range" id="Pf" min="0.3" max="3.0" step="0.05" value="${input.Pf_bar}">
        </div>`;
      } else {
        extra = `<div class="ctrl-row">
          <label>Volume final $V_f$ : <span class="ctrl-value">${input.Vf_L.toFixed(2)} L</span></label>
          <input type="range" id="Vf" min="0.5" max="2.5" step="0.05" value="${input.Vf_L}">
        </div>`;
      }
      const laplace = input.quasiType === 'adiabatique' ? `
        <div class="reco"><b>Formule fournie (jamais démontrée)</b><br>
        Loi de Laplace, valable pour une évolution adiabatique réversible d'un gaz parfait :
        $$P\\cdot V^{\\gamma} = \\text{constante}, \\qquad \\gamma = \\dfrac{C_p}{C_v} = ${input.gaz === 'di' ? '\\dfrac{7}{5}' : '\\dfrac{5}{3}'}$$
        </div>` : '';
      return `
        <div class="mode-toggle" id="quasitype-toggle">
          ${types.map(([k, l]) => `<button data-qt="${k}" class="${input.quasiType === k ? 'active' : ''}">${l}</button>`).join('')}
        </div>
        ${extra}
        ${laplace}
      `;
    }

    function renderPredictBox() {
      const p = input.prediction;
      function row(key, label) {
        const opts = [['positif', 'Positif (reçu)'], ['negatif', 'Négatif (cédé)'], ['nul', 'Nul']];
        return `<p style="font-size:13.5px;margin:0 0 4px;"><b>${label}</b></p>
          <div class="predict-row" data-key="${key}">
            ${opts.map(([v, l]) => `<button data-val="${v}" class="${p[key] === v ? 'selected' : ''}">${l}</button>`).join('')}
          </div>`;
      }
      return `
        <div class="predict-box">
          <h4>Avant de lancer — prédis</h4>
          ${row('W', 'Signe du travail W reçu par le gaz')}
          ${row('Q', 'Signe du transfert thermique Q reçu par le gaz')}
        </div>`;
    }

    function renderResultats(r) {
      const Wsign = r.W > 1e-6 ? 'positif' : (r.W < -1e-6 ? 'negatif' : 'nul');
      const Qsign = r.Q > 1e-6 ? 'positif' : (r.Q < -1e-6 ? 'negatif' : 'nul');
      const p = input.prediction;
      function feedback(predicted, actual, label) {
        if (!predicted) return '';
        if (predicted === actual) return `<p class="predict-feedback ok">✓ Bien vu : ${label} est effectivement ${signeLabel(actual === 'positif' ? 1 : (actual === 'negatif' ? -1 : 0))}.</p>`;
        return `<p class="predict-feedback encourage">À reprendre : ${label} est en réalité ${signeLabel(actual === 'positif' ? 1 : (actual === 'negatif' ? -1 : 0))}. Regarde le sens du déplacement du piston et la direction du transfert thermique.</p>`;
      }
      return `
        <div class="card">
          <h3>État final</h3>
          <div class="etat-grid">
            <div class="etat-card"><div class="e-label">P<sub>f</sub></div><div class="e-value">${(r.Pf / BAR).toFixed(2)} bar</div></div>
            <div class="etat-card"><div class="e-label">V<sub>f</sub></div><div class="e-value">${(r.Vf / L).toFixed(2)} L</div></div>
            <div class="etat-card"><div class="e-label">T<sub>f</sub></div><div class="e-value">${r.Tf.toFixed(0)} K</div></div>
          </div>
          <div class="bilan-row">
            <div class="bilan-card ${r.W >= 0 ? 'recoit' : 'cede'}"><div class="b-label">W</div><div class="b-value">${r.W >= 0 ? '+' : ''}${r.W.toFixed(1)} J</div></div>
            <div class="bilan-card ${r.Q >= 0 ? 'recoit' : 'cede'}"><div class="b-label">Q</div><div class="b-value">${r.Q >= 0 ? '+' : ''}${r.Q.toFixed(1)} J</div></div>
            <div class="bilan-card"><div class="b-label">ΔU</div><div class="b-value">${r.dU >= 0 ? '+' : ''}${r.dU.toFixed(1)} J</div></div>
            ${r.dH !== null ? `<div class="bilan-card"><div class="b-label">ΔH</div><div class="b-value">${r.dH >= 0 ? '+' : ''}${r.dH.toFixed(1)} J</div></div>` : ''}
          </div>
          ${feedback(p.W, Wsign, 'le travail W')}
          ${feedback(p.Q, Qsign, 'le transfert thermique Q')}
          <div class="reco">
            <b>Bilan écrit</b><br>
            Le système passe de l'état initial ($P_i≈${(r.Pi / BAR).toFixed(2)}$ bar, $V_i=${(r.Vi / L).toFixed(2)}$ L, $T_i=${r.Ti.toFixed(0)}$ K) à l'état final ($P_f≈${(r.Pf / BAR).toFixed(2)}$ bar, $V_f=${(r.Vf / L).toFixed(2)}$ L, $T_f≈${r.Tf.toFixed(0)}$ K).
            Il ${r.W >= 0 ? 'reçoit' : 'cède'} un travail $W=${r.W.toFixed(1)}$ J et ${r.Q >= 0 ? 'reçoit' : 'cède'} un transfert thermique $Q=${r.Q.toFixed(1)}$ J, d'où $\\Delta U = W+Q=${r.dU.toFixed(1)}$ J.
            ${r.dH !== null ? `Comme $P_i=P_f$, $\\Delta H=Q=${r.dH.toFixed(1)}$ J.` : `$\\Delta H$ n'est pas définie ici : la condition $P_i=P_f$ n'est pas vérifiée (ou le volume est constant).`}
          </div>
        </div>`;
    }

    function wire() {
      mount.querySelectorAll('#gaz-toggle button').forEach(b => b.addEventListener('click', () => { input.gaz = b.dataset.gaz; persist(); draw(); }));
      mount.querySelectorAll('#mode-toggle button').forEach(b => b.addEventListener('click', () => { input.mode = b.dataset.mode; input.revealed = false; persist(); draw(); }));
      const brutalsub = mount.querySelector('#brutalsub-toggle');
      if (brutalsub) brutalsub.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { input.brutalSub = b.dataset.sub; input.revealed = false; persist(); draw(); }));
      const quasitype = mount.querySelector('#quasitype-toggle');
      if (quasitype) quasitype.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { input.quasiType = b.dataset.qt; input.revealed = false; persist(); draw(); }));

      ['Vi', 'Ti', 'Pa', 'Q', 'Vf', 'Pf'].forEach(id => {
        const el = mount.querySelector('#' + id);
        if (!el) return;
        el.addEventListener('input', () => {
          const map = { Vi: 'Vi_L', Ti: 'Ti_K', Pa: 'Pa_bar', Q: 'Q_J', Vf: 'Vf_L', Pf: 'Pf_bar' };
          input[map[id]] = parseFloat(el.value);
          input.revealed = false;
          persist();
          draw();
        });
      });

      mount.querySelectorAll('.predict-row').forEach(row => {
        row.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
          input.prediction[row.dataset.key] = b.dataset.val;
          persist();
          draw();
        }));
      });

      mount.querySelector('#btn-lancer').addEventListener('click', () => {
        input.revealed = true;
        persist();
        draw();
      });
    }

    draw();
  }

  window.ThermoAteliers = window.ThermoAteliers || {};
  window.ThermoAteliers['atelier-1'] = { id: 'atelier-1', titre: 'Piston, gaz et chemins', render };
})();
