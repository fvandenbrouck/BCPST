/*
 * Atelier 2 — « Tracer son chemin de A à B ». A = (P0,V0,T0), B = (P0/2,2V0,T0)
 * (même température : T_A = T_B = T0). Cinq chemins quasi-statiques
 * prédéfinis + un chemin libre tracé à main levée, plus l'évolution brutale
 * de référence contre P_a = P0/2. Message pédagogique central : W et Q
 * dépendent du chemin suivi, ΔU jamais (fonction d'état).
 */
(function () {
  const L = 1e-3, BAR = 1e5;

  function defaultInput() {
    return {
      gaz: 'mono',
      chemin: 'c1',
      librePoints: [{ V: 1.00, P: 1.00 }], // L, bar — premier point = A
      prediction: { W: null, Q: null, dU: null }
    };
  }

  function render(mount, ctx) {
    const { Physics, Clapeyron, persist, STATE } = ctx;
    if (!STATE.atelier2.input) STATE.atelier2.input = defaultInput();
    if (!STATE.atelier2.cheminsRetenus) STATE.atelier2.cheminsRetenus = [];
    const input = STATE.atelier2.input;
    const retenus = STATE.atelier2.cheminsRetenus;

    function Cv() { return input.gaz === 'di' ? Physics.CV_DI : Physics.CV_MONO; }
    function gamma() { return input.gaz === 'di' ? Physics.GAMMA_DI : Physics.GAMMA_MONO; }

    const PA = Physics.P0, VA = Physics.V0, TA = Physics.T0;
    const PB = Physics.P0 / 2, VB = 2 * Physics.V0, TB = Physics.T0;

    const CHEMINS = [
      { id: 'c1', label: '1 — Isotherme', build: (cv, g) => {
          const s1 = Object.assign({ label: 'A → B, isotherme' }, Physics.isotherme(VA, VB, TA));
          return { segments: [s1], curveEls: [curveFor('isotherme', s1)] };
        } },
      { id: 'c2', label: '2 — Isobare puis isochore', build: (cv) => {
          const s1 = Object.assign({ label: 'A → état intermédiaire, isobare' }, Physics.segmentIsobare(PA, VA, TA, VB, cv));
          const s2 = Object.assign({ label: 'intermédiaire → B, isochore' }, Physics.segmentIsochore(s1.Pf, s1.Vf, s1.Tf, PB, cv));
          return { segments: [s1, s2], curveEls: [curveFor('isobare', s1), curveFor('isochore', s2)] };
        } },
      { id: 'c3', label: '3 — Isochore puis isobare', build: (cv) => {
          const s1 = Object.assign({ label: 'A → état intermédiaire, isochore' }, Physics.segmentIsochore(PA, VA, TA, PB, cv));
          const s2 = Object.assign({ label: 'intermédiaire → B, isobare' }, Physics.segmentIsobare(s1.Pf, s1.Vf, s1.Tf, VB, cv));
          return { segments: [s1, s2], curveEls: [curveFor('isochore', s1), curveFor('isobare', s2)] };
        } },
      { id: 'c4', label: '4 — Adiabatique réversible puis isochore', build: (cv, g) => {
          const s1 = Object.assign({ label: 'A → C, adiabatique réversible' }, Physics.segmentAdiabatiqueReversibleVersV(PA, VA, TA, VB, g, cv));
          const s2 = Object.assign({ label: 'C → B, isochore' }, Physics.segmentIsochore(s1.Pf, s1.Vf, s1.Tf, PB, cv));
          return { segments: [s1, s2], curveEls: [curveFor('adiabatique', s1, g), curveFor('isochore', s2)], intermediaire: { nom: 'C', r: s1 } };
        } },
      { id: 'c5', label: '5 — Adiabatique réversible puis isobare', build: (cv, g) => {
          const s1 = Object.assign({ label: 'A → D, adiabatique réversible' }, Physics.segmentAdiabatiqueReversibleVersP(PA, VA, TA, PB, g, cv));
          const s2 = Object.assign({ label: 'D → B, isobare' }, Physics.segmentIsobare(s1.Pf, s1.Vf, s1.Tf, VB, cv));
          return { segments: [s1, s2], curveEls: [curveFor('adiabatique', s1, g), curveFor('isobare', s2)], intermediaire: { nom: 'D', r: s1 } };
        } }
    ];

    function curveFor(type, r, g) {
      const Vi = r.Vi / L, Vf = r.Vf / L;
      if (type === 'isobare' || type === 'isochore') {
        return { type: 'segment', V1: Vi, P1: r.Pi / BAR, V2: Vf, P2: r.Pf / BAR };
      }
      const pts = [];
      const n = 24;
      for (let i = 0; i <= n; i++) {
        const V = Vi + (Vf - Vi) * i / n;
        const P = type === 'isotherme' ? Physics.pressionDe(V * L, r.Ti) / BAR : (r.Pi * Math.pow(r.Vi / (V * L), g)) / BAR;
        pts.push({ V, P });
      }
      return { type: 'curve', points: pts };
    }

    function totalOf(segments) {
      return segments.reduce((acc, s) => ({ W: acc.W + s.W, Q: acc.Q + s.Q, dU: acc.dU + s.dU }), { W: 0, Q: 0, dU: 0 });
    }

    function evolutionBrutaleRef() {
      const r = Physics.brutalThermostat(PA, VA, TA, PB, TA, Cv());
      return { nom: 'Évolution brutale (référence, Pₐ = P0/2)', W: r.W, Q: r.Q, dU: r.dU };
    }

    function draw() {
      const cv = Cv(), g = gamma();
      const def = CHEMINS.find(c => c.id === input.chemin);
      const built = def ? def.build(cv, g) : null;
      const total = built ? totalOf(built.segments) : null;

      mount.innerHTML = `
        <div class="pont">
          <span class="pont-tag">Déjà vu au lycée</span>
          <span class="pont-lycee">En Terminale, l'énergie interne est présentée comme une fonction d'état sans toujours le vérifier sur un exemple chiffré.</span>
          <b>Ici</b>, A et B sont fixés une fois pour toutes ($T_A=T_B=T_0$) : en changeant uniquement le chemin suivi entre ces deux mêmes états, on observe ce qui change et ce qui ne change jamais.
        </div>

        <div class="predict-box">
          <h4>Avant de comparer — prédis</h4>
          ${predictRow('W', 'Le travail W dépend-il du chemin suivi entre A et B ?')}
          ${predictRow('Q', 'Le transfert thermique Q dépend-il du chemin suivi ?')}
          ${predictRow('dU', 'La variation d\'énergie interne ΔU dépend-elle du chemin suivi ?')}
        </div>

        <div class="card">
          <h3>Gaz</h3>
          <div class="mode-toggle" id="gaz-toggle">
            <button data-gaz="mono" class="${input.gaz === 'mono' ? 'active' : ''}">Monoatomique</button>
            <button data-gaz="di" class="${input.gaz === 'di' ? 'active' : ''}">Diatomique</button>
          </div>
          <p class="m-meta">État A : $P_0$=1,00 bar, $V_0$=1,00 L, $T_0$=300 K. État B : $P_0/2$, $2V_0$, $T_0$ (même température que A).</p>
        </div>

        <div class="card">
          <h3>Choix du chemin</h3>
          <div class="mode-toggle" id="chemin-toggle">
            ${CHEMINS.map(c => `<button data-chemin="${c.id}" class="${input.chemin === c.id ? 'active' : ''}">${c.label}</button>`).join('')}
            <button data-chemin="libre" class="${input.chemin === 'libre' ? 'active' : ''}">Chemin libre (à main levée)</button>
          </div>
          ${input.chemin === 'libre' ? renderLibre() : renderPredefini(built, total, g)}
        </div>

        <div class="clapeyron-wrap" id="clap-mount"></div>

        <div class="card">
          <h3>Tableau comparatif cumulatif</h3>
          <p class="m-meta">Ajoute plusieurs chemins (et l'évolution brutale de référence) pour les comparer.</p>
          <div class="comparatif-table-wrap">
            <table class="comparatif-table">
              <thead><tr><th>Chemin</th><th>W (J)</th><th>Q (J)</th><th>ΔU (J)</th></tr></thead>
              <tbody>${retenus.map((r, i) => `<tr><td>${r.nom}</td><td>${fmt(r.W)}</td><td>${fmt(r.Q)}</td><td>${fmt(r.dU)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">Aucun chemin ajouté pour l\'instant.</td></tr>'}</tbody>
            </table>
          </div>
          ${retenus.length >= 2 ? renderMessageEmergent() : ''}
          <div class="flash-actions" style="margin-top:10px;">
            <button class="btn ghost" id="btn-ajouter-brutal">+ Ajouter l'évolution brutale de référence</button>
            <button class="btn ghost" id="btn-vider-tableau">Vider le tableau</button>
          </div>
        </div>
      `;

      drawDiagram(built, g);
      wire(built, total, g);
      if (window.MathRender) window.MathRender.render(mount);
    }

    function predictRow(key, label) {
      const p = input.prediction;
      return `<p style="font-size:13.5px;margin:0 0 4px;"><b>${label}</b></p>
        <div class="predict-row" data-key="${key}">
          <button data-val="oui" class="${p[key] === 'oui' ? 'selected' : ''}">Oui, ça change</button>
          <button data-val="non" class="${p[key] === 'non' ? 'selected' : ''}">Non, toujours pareil</button>
        </div>`;
    }

    function fmt(x) { return (x >= 0 ? '+' : '') + x.toFixed(1); }

    function renderPredefini(built, total, g) {
      let html = `<table class="comparatif-table"><thead><tr><th>Segment</th><th>W (J)</th><th>Q (J)</th><th>ΔU (J)</th></tr></thead><tbody>`;
      built.segments.forEach(s => { html += `<tr><td>${s.label}</td><td>${fmt(s.W)}</td><td>${fmt(s.Q)}</td><td>${fmt(s.dU)}</td></tr>`; });
      html += `<tr style="font-weight:700;"><td>Total A → B</td><td>${fmt(total.W)}</td><td>${fmt(total.Q)}</td><td>${fmt(total.dU)}</td></tr></tbody></table>`;

      if (built.intermediaire) {
        const r = built.intermediaire.r;
        html += `<div class="reco"><b>État intermédiaire ${built.intermediaire.nom}</b><br>
          $P_{${built.intermediaire.nom}}≈${(r.Pf / BAR).toFixed(2)}$ bar, $V_{${built.intermediaire.nom}}≈${(r.Vf / L).toFixed(2)}$ L, $T_{${built.intermediaire.nom}}≈${r.Tf.toFixed(0)}$ K.
          A et B sont à la <b>même température</b> ($T_0=300$ K) alors que ${built.intermediaire.nom} est <b>plus froid</b> : une adiabatique seule ne peut jamais relier A à B, puisqu'elle ne conserve ni la pression, ni le volume, ni la température.
        </div>`;
      }

      const segAdiab = built.segments.find(s => s.Q === 0 && s.dU !== 0 && Math.abs(s.W - s.dU) < 1e-6);
      if (segAdiab) {
        html += `<div class="reco"><b>Formule fournie (jamais démontrée)</b><br>
          Loi de Laplace, pour l'évolution adiabatique réversible : $$P\\cdot V^{\\gamma}=\\text{constante}, \\qquad \\gamma=${input.gaz === 'di' ? '\\tfrac{7}{5}' : '\\tfrac{5}{3}'}$$
        </div>`;
        const Wnum = Physics.integraleAdiabatique(segAdiab.Pi, segAdiab.Vi, segAdiab.Vf, g);
        html += `<p class="m-meta">Vérification numérique sur ce segment : $-\\int P\\,\\mathrm{d}V ≈ ${Wnum.toFixed(2)}$ J, à comparer à $C_v\\Delta T = ${segAdiab.dU.toFixed(2)}$ J (premier principe, $Q=0$).</p>`;
      }

      html += `<div class="flash-actions" style="margin-top:10px;"><button class="btn primary" id="btn-ajouter-chemin" style="flex:none;">+ Ajouter ce chemin au tableau comparatif</button></div>`;
      return html;
    }

    function renderLibre() {
      return `
        <p class="m-meta">Trace un chemin à main levée du point A (1,00 L ; 1,00 bar) au point B (2,00 L ; 0,50 bar) directement sur le diagramme ci-dessous (glisser le doigt ou la souris). Le travail est calculé par sommation des travaux élémentaires (méthode des trapèzes).</p>
        <div class="flash-actions">
          <button class="btn ghost" id="btn-libre-effacer">Effacer</button>
          <button class="btn ghost" id="btn-libre-fermer">Fermer en B</button>
        </div>
        <div id="libre-resultat"></div>
      `;
    }

    function drawDiagram(built, g) {
      const Vmax = 3.2, Pmax = 1.3;
      let elements;
      if (input.chemin === 'libre') {
        elements = [
          { type: 'curve', points: input.librePoints },
          { type: 'point', V: VA / L, P: PA / BAR, label: 'A' },
          { type: 'point', V: VB / L, P: PB / BAR, label: 'B' }
        ];
      } else {
        elements = built.curveEls.concat([
          { type: 'point', V: VA / L, P: PA / BAR, label: 'A' },
          { type: 'point', V: VB / L, P: PB / BAR, label: 'B' }
        ]);
        if (built.intermediaire) {
          const r = built.intermediaire.r;
          elements.push({ type: 'point', V: r.Vf / L, P: r.Pf / BAR, label: built.intermediaire.nom });
        }
      }
      const clapMount = mount.querySelector('#clap-mount');
      const view = Clapeyron.render(clapMount, { Vmax, Pmax, elements, unitV: 'L', unitP: 'bar' });
      if (input.chemin === 'libre') wireLibre(view, clapMount);
    }

    function wireLibre(view, clapMount) {
      const svgEl = clapMount.querySelector('svg');
      if (!svgEl) return;
      let drawing = false;
      function pointFromEvent(ev) {
        const rect = svgEl.getBoundingClientRect();
        const vb = svgEl.viewBox.baseVal;
        const x = vb.x + (ev.clientX - rect.left) / rect.width * vb.width;
        const y = vb.y + (ev.clientY - rect.top) / rect.height * vb.height;
        return view.fromXY(x, y);
      }
      svgEl.style.touchAction = 'none';
      svgEl.addEventListener('pointerdown', (ev) => {
        drawing = true;
        const p = pointFromEvent(ev);
        input.librePoints.push({ V: Math.max(0.1, p.V), P: Math.max(0.05, p.P) });
        persist();
        drawLibreCurveOnly();
      });
      svgEl.addEventListener('pointermove', (ev) => {
        if (!drawing) return;
        const p = pointFromEvent(ev);
        input.librePoints.push({ V: Math.max(0.1, p.V), P: Math.max(0.05, p.P) });
        persist();
        drawLibreCurveOnly();
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(evName => svgEl.addEventListener(evName, () => { drawing = false; }));
    }

    function drawLibreCurveOnly() {
      const Vmax = 3.2, Pmax = 1.3;
      const elements = [
        { type: 'curve', points: input.librePoints },
        { type: 'point', V: VA / L, P: PA / BAR, label: 'A' },
        { type: 'point', V: VB / L, P: PB / BAR, label: 'B' }
      ];
      const clapMount = mount.querySelector('#clap-mount');
      const view = Clapeyron.render(clapMount, { Vmax, Pmax, elements, unitV: 'L', unitP: 'bar' });
      wireLibre(view, clapMount);
    }

    function computeLibre() {
      const pointsSI = input.librePoints.map(p => ({ V: p.V * L, P: p.P * BAR }));
      return Physics.cheminLibre(pointsSI, Cv());
    }

    function renderMessageEmergent() {
      const Ws = retenus.map(r => r.W), Qs = retenus.map(r => r.Q), dUs = retenus.map(r => r.dU);
      const spread = (arr) => Math.max(...arr) - Math.min(...arr);
      const wVarie = spread(Ws) > 0.5, qVarie = spread(Qs) > 0.5, dUconstant = spread(dUs) < 0.5;
      return `<div class="reco"><b>Ce que montre le tableau</b><br>
        ${wVarie ? 'Le travail W change d\'un chemin à l\'autre. ' : ''}${qVarie ? 'Le transfert thermique Q aussi. ' : ''}
        ${dUconstant ? 'En revanche, ΔU reste identique pour tous les chemins testés : c\'est une fonction d\'état, sa variation ne dépend que de l\'état initial et de l\'état final.' : ''}
      </div>`;
    }

    function wire(built, total, g) {
      mount.querySelectorAll('#gaz-toggle button').forEach(b => b.addEventListener('click', () => { input.gaz = b.dataset.gaz; persist(); draw(); }));
      mount.querySelectorAll('#chemin-toggle button').forEach(b => b.addEventListener('click', () => { input.chemin = b.dataset.chemin; persist(); draw(); }));

      mount.querySelectorAll('.predict-row').forEach(row => {
        row.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
          input.prediction[row.dataset.key] = b.dataset.val;
          persist();
          draw();
        }));
      });

      const btnAjouter = mount.querySelector('#btn-ajouter-chemin');
      if (btnAjouter) btnAjouter.addEventListener('click', () => {
        const def = CHEMINS.find(c => c.id === input.chemin);
        retenus.push({ nom: def.label, W: total.W, Q: total.Q, dU: total.dU });
        persist();
        draw();
      });

      const btnAjouterBrutal = mount.querySelector('#btn-ajouter-brutal');
      if (btnAjouterBrutal) btnAjouterBrutal.addEventListener('click', () => {
        retenus.push(evolutionBrutaleRef());
        persist();
        draw();
      });
      const btnVider = mount.querySelector('#btn-vider-tableau');
      if (btnVider) btnVider.addEventListener('click', () => {
        STATE.atelier2.cheminsRetenus = [];
        persist();
        draw();
      });

      const btnEffacer = mount.querySelector('#btn-libre-effacer');
      if (btnEffacer) btnEffacer.addEventListener('click', () => {
        input.librePoints = [{ V: VA / L, P: PA / BAR }];
        persist();
        draw();
      });
      const btnFermer = mount.querySelector('#btn-libre-fermer');
      if (btnFermer) btnFermer.addEventListener('click', () => {
        input.librePoints.push({ V: VB / L, P: PB / BAR });
        persist();
        const r = computeLibre();
        mount.querySelector('#libre-resultat').innerHTML = `
          <div class="reco"><b>Chemin libre — résultat</b><br>
          $W=${r.W.toFixed(1)}$ J, $Q=${r.Q.toFixed(1)}$ J, $\\Delta U=${r.dU.toFixed(1)}$ J (${input.librePoints.length - 1} segments sommés par la méthode des trapèzes).</div>
          <div class="flash-actions"><button class="btn primary" id="btn-ajouter-libre" style="flex:none;">+ Ajouter ce chemin au tableau comparatif</button></div>`;
        if (window.MathRender) window.MathRender.render(mount);
        mount.querySelector('#btn-ajouter-libre').addEventListener('click', () => {
          retenus.push({ nom: 'Chemin libre', W: r.W, Q: r.Q, dU: r.dU });
          persist();
          draw();
        });
      });
    }

    draw();
  }

  window.ThermoAteliers = window.ThermoAteliers || {};
  window.ThermoAteliers['atelier-2'] = { id: 'atelier-2', titre: 'Tracer son chemin de A à B', render };
})();
