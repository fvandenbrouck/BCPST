/*
 * Atelier 3 — « Frontières et bilan ». Deux parties : un explorateur
 * système/frontières (isolé, fermé, ouvert ; échanges possibles ; forme du
 * premier principe), puis trois exercices guidés corrigés.
 */
(function () {
  const L = 1e-3, BAR = 1e5;

  const SYSTEMES = {
    gaz: {
      label: 'Gaz seul',
      segments: [
        { id: 'paroi', label: 'Paroi latérale du cylindre (fixe)' },
        { id: 'piston', label: 'Piston (interface avec le gaz)' }
      ]
    },
    gaz_piston: {
      label: 'Gaz + piston',
      segments: [
        { id: 'paroi', label: 'Paroi latérale du cylindre (fixe)' },
        { id: 'piston_ext', label: 'Face externe du piston (contact air libre)' }
      ]
    },
    gaz_piston_resistance: {
      label: 'Gaz + piston + résistance électrique',
      segments: [
        { id: 'paroi', label: 'Paroi latérale du cylindre (fixe)' },
        { id: 'piston_ext', label: 'Face externe du piston (contact air libre)' },
        { id: 'fil', label: 'Fil électrique d\'alimentation de la résistance', isFil: true }
      ]
    }
  };

  function defaultInput() {
    const props = {};
    Object.keys(SYSTEMES).forEach(sysId => {
      props[sysId] = {};
      SYSTEMES[sysId].segments.forEach(seg => {
        props[sysId][seg.id] = seg.isFil
          ? { mobile: false, diatherme: false, permeable: false, conducteur: true }
          : { mobile: seg.id.indexOf('piston') === 0 || seg.id === 'piston_ext', diatherme: seg.id === 'paroi', permeable: false };
      });
    });
    return {
      systeme: 'gaz',
      props,
      predictions: { a: null, b: null, c: null },
      revealed: { a: false, b: false, c: false }
    };
  }

  function schemaSvg(sysId) {
    const hasPiston = sysId !== 'none';
    const hasFil = sysId === 'gaz_piston_resistance';
    return `<svg viewBox="0 0 280 120" width="100%" height="auto" role="img" aria-label="Schéma du système">
      <rect x="20" y="20" width="160" height="80" fill="none" stroke="var(--ink)" stroke-width="2"/>
      <rect x="22" y="22" width="110" height="76" fill="var(--ochre)" opacity="0.25"/>
      <text x="75" y="64" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="Inter, sans-serif">Gaz</text>
      <rect x="130" y="20" width="8" height="80" fill="var(--rust)"/>
      <text x="134" y="112" text-anchor="middle" font-size="9" fill="var(--rust-deep)" font-family="IBM Plex Mono, monospace">piston</text>
      <text x="100" y="14" text-anchor="middle" font-size="9" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">paroi</text>
      ${hasFil ? `<line x1="138" y1="60" x2="220" y2="60" stroke="var(--slate)" stroke-width="2" stroke-dasharray="3 2"/>
      <circle cx="230" cy="60" r="12" fill="none" stroke="var(--slate)" stroke-width="2"/>
      <text x="230" y="64" text-anchor="middle" font-size="8" fill="var(--slate)" font-family="IBM Plex Mono, monospace">R</text>
      <text x="178" y="52" text-anchor="middle" font-size="8" fill="var(--slate)" font-family="IBM Plex Mono, monospace">fil</text>` : ''}
    </svg>`;
  }

  function render(mount, ctx) {
    const { Physics, persist, STATE } = ctx;
    if (!STATE.atelier3.input) STATE.atelier3.input = defaultInput();
    const input = STATE.atelier3.input;
    const Cv = Physics.CV_MONO;

    function classify(sysId) {
      const segs = SYSTEMES[sysId].segments;
      const p = input.props[sysId];
      const anyPermeable = segs.some(s => p[s.id].permeable);
      const anyMobile = segs.some(s => p[s.id].mobile);
      const anyDiatherme = segs.some(s => p[s.id].diatherme);
      const anyConducteur = segs.some(s => s.isFil && p[s.id].conducteur);
      let type;
      if (anyPermeable) type = 'ouvert';
      else if (anyMobile || anyDiatherme || anyConducteur) type = 'fermé';
      else type = 'isolé (cas particulier de système fermé)';
      const echanges = [];
      if (anyMobile && !anyPermeable) echanges.push('travail des forces de pression (W)');
      if (anyConducteur) echanges.push('travail électrique (W_élec)');
      if (anyDiatherme) echanges.push('transfert thermique (Q)');
      const termes = [];
      if (anyMobile && !anyPermeable) termes.push('W');
      if (anyConducteur) termes.push('W_{élec}');
      if (anyDiatherme) termes.push('Q');
      const formule = termes.length ? `\\Delta U = ${termes.join(' + ')}` : '\\Delta U = 0';
      return { type, echanges, formule, anyPermeable };
    }

    function draw() {
      const def = SYSTEMES[input.systeme];
      const props = input.props[input.systeme];
      const cl = classify(input.systeme);

      mount.innerHTML = `
        <div class="pont">
          <span class="pont-tag">Déjà vu au lycée</span>
          <span class="pont-lycee">Un système fermé est défini comme un système qui n'échange pas de matière avec l'extérieur.</span>
          <b>En BCPST1</b>, on va plus loin : on examine chaque morceau de frontière séparément (mobile ? diatherme ? perméable à la matière ?) pour en déduire le type de système et la forme exacte du premier principe.
        </div>

        <div class="card">
          <h3>Choix du système</h3>
          <div class="mode-toggle" id="systeme-toggle">
            ${Object.keys(SYSTEMES).map(id => `<button data-sys="${id}" class="${input.systeme === id ? 'active' : ''}">${SYSTEMES[id].label}</button>`).join('')}
          </div>
          <div class="frontiere-svg-wrap">${schemaSvg(input.systeme)}</div>
          <p class="m-meta">Pour chaque morceau de frontière, indique s'il est mobile, diatherme (laisse passer un transfert thermique) et perméable à la matière.</p>
          ${def.segments.map(seg => renderSegmentToggles(seg, props[seg.id])).join('')}
          <div class="reco">
            <b>Système ${cl.type}</b><br>
            Échanges possibles : ${cl.echanges.length ? cl.echanges.join(', ') : 'aucun'}.<br>
            Forme du premier principe : $$${cl.formule}$$
            ${cl.anyPermeable ? '<p class="m-meta">Pour un système ouvert, le premier principe se complique (il faut tenir compte de l\'énergie transportée par la matière échangée) : hors programme de ce module.</p>' : ''}
          </div>
        </div>

        <div class="card">
          <h3>Trois exercices guidés</h3>
          <p class="m-meta">Même gaz parfait monoatomique, mêmes conditions initiales ($P_0$, $V_0$, $T_0$) que dans les autres ateliers. À chaque fois : prédis avant de regarder la correction.</p>
        </div>
        ${renderExercice('a', 'Piston bloqué, chauffage de 250 J', 'Le piston est bloqué (frontière non mobile). La paroi est diatherme : le gaz reçoit un transfert thermique $Q=+250$ J.', exoA)}
        ${renderExercice('b', 'Piston libre sous P₀, chauffage de 250 J', 'Le piston est libre et la pression extérieure vaut $P_0$ : l\'évolution est isobare. Le gaz reçoit un transfert thermique $Q=+250$ J.', exoB)}
        ${renderExercice('c', 'Détente de Joule–Gay-Lussac', 'Le gaz occupe initialement un compartiment de volume $V_0$ dans une enceinte rigide et calorifugée (indéformable, athermane), l\'autre compartiment (volume $V_0$) étant vide. On ouvre une vanne : le gaz se détend dans le vide jusqu\'à occuper $2V_0$.', exoC)}
      `;

      wire(cl);
      if (window.MathRender) window.MathRender.render(mount);
    }

    function renderSegmentToggles(seg, p) {
      function chip(key, label) {
        return `<button data-seg="${seg.id}" data-prop="${key}" class="${p[key] ? 'active' : ''}">${label} : ${p[key] ? 'oui' : 'non'}</button>`;
      }
      return `<div style="margin-bottom:10px;">
        <p style="font-size:13px;font-weight:600;margin:0 0 4px;">${seg.label}</p>
        <div class="frontiere-choice">
          ${chip('mobile', 'Mobile')}
          ${chip('diatherme', 'Diatherme')}
          ${chip('permeable', 'Perméable à la matière')}
          ${seg.isFil ? chip('conducteur', 'Conducteur électrique') : ''}
        </div>
      </div>`;
    }

    function exoA(cv) { return Physics.isochoreFromQ(Physics.P0, Physics.V0, Physics.T0, 250, cv); }
    function exoB(cv) { return Physics.isobareFromQ(Physics.P0, Physics.V0, Physics.T0, 250, cv); }
    function exoC() { return Physics.jouleGayLussac(Physics.P0, Physics.V0, Physics.T0, 2 * Physics.V0); }

    function renderExercice(key, titre, enonce, computeFn) {
      const p = input.predictions[key];
      const revealed = input.revealed[key];
      const r = computeFn(Cv);
      function predictRow(propKey, label) {
        const val = p && p[propKey];
        return `<p style="font-size:13px;margin:0 0 4px;"><b>${label}</b></p>
          <div class="predict-row" data-exo="${key}" data-prop="${propKey}">
            <button data-val="positif">Positif</button>
            <button data-val="negatif">Négatif</button>
            <button data-val="nul">Nul</button>
          </div>`;
      }
      return `
        <div class="card">
          <h3>(${key}) ${titre}</h3>
          <p>${enonce}</p>
          ${!revealed ? `
          <div class="predict-box">
            <h4>Prédis avant de corriger</h4>
            ${predictRow('W', 'Signe du travail W reçu par le gaz')}
            ${predictRow('Q', 'Signe du transfert thermique Q reçu par le gaz')}
          </div>
          <div class="flash-actions"><button class="btn primary" data-reveal="${key}" style="flex:none;">Voir la correction</button></div>
          ` : `
          <div class="etat-grid">
            <div class="etat-card"><div class="e-label">T<sub>f</sub></div><div class="e-value">${r.Tf.toFixed(0)} K</div></div>
            <div class="etat-card"><div class="e-label">V<sub>f</sub></div><div class="e-value">${(r.Vf / L).toFixed(2)} L</div></div>
            <div class="etat-card"><div class="e-label">P<sub>f</sub></div><div class="e-value">${(r.Pf / BAR).toFixed(2)} bar</div></div>
          </div>
          <div class="bilan-row">
            <div class="bilan-card ${r.W >= 0 ? 'recoit' : 'cede'}"><div class="b-label">W</div><div class="b-value">${r.W >= 0 ? '+' : ''}${r.W.toFixed(1)} J</div></div>
            <div class="bilan-card ${r.Q >= 0 ? 'recoit' : 'cede'}"><div class="b-label">Q</div><div class="b-value">${r.Q >= 0 ? '+' : ''}${r.Q.toFixed(1)} J</div></div>
            <div class="bilan-card"><div class="b-label">ΔU</div><div class="b-value">${r.dU >= 0 ? '+' : ''}${r.dU.toFixed(1)} J</div></div>
          </div>
          <div class="reco"><b>Correction</b><br>${correctionText(key, r)}</div>
          `}
        </div>`;
    }

    function correctionText(key, r) {
      if (key === 'a') return `Piston bloqué ⇒ évolution isochore : $W=0$. $Q=+250$ J est imposé, donc $\\Delta U = W+Q = 250$ J, et $T_f=T_0+Q/C_v=300+250/0{,}5=${r.Tf.toFixed(0)}$ K.`;
      if (key === 'b') return `Piston libre sous $P_0$ ⇒ évolution isobare : $T_f=T_0+Q/C_p=${r.Tf.toFixed(0)}$ K, $V_f=nRT_f/P_0=${(r.Vf / L).toFixed(2)}$ L, $W=-P_0(V_f-V_0)=${r.W.toFixed(1)}$ J, $\\Delta U=C_v\\Delta T=${r.dU.toFixed(1)}$ J. Comme $P_i=P_f$, $\\Delta H = Q = 250$ J.`;
      return `Enceinte rigide (pas de frontière mobile côté extérieur réel : aucun travail n'est échangé, $W=0$) et calorifugée ($Q=0$). Le premier principe donne directement $\\Delta U=0$, donc, pour un gaz parfait, $T_f=T_i$ : la détente de Joule–Gay-Lussac ne change pas la température, contrairement à l'intuition (« un gaz qui se détend se refroidit » n'est vraie qu'en détente contre une pression extérieure non nulle).`;
    }

    function wire(cl) {
      mount.querySelectorAll('#systeme-toggle button').forEach(b => b.addEventListener('click', () => { input.systeme = b.dataset.sys; persist(); draw(); }));
      mount.querySelectorAll('.frontiere-choice button[data-seg]').forEach(b => b.addEventListener('click', () => {
        const props = input.props[input.systeme];
        const seg = b.dataset.seg, prop = b.dataset.prop;
        props[seg][prop] = !props[seg][prop];
        persist();
        draw();
      }));
      mount.querySelectorAll('.predict-row[data-exo]').forEach(row => {
        row.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
          const key = row.dataset.exo, prop = row.dataset.prop;
          if (!input.predictions[key]) input.predictions[key] = {};
          input.predictions[key][prop] = b.dataset.val;
          persist();
          draw();
        }));
      });
      mount.querySelectorAll('button[data-reveal]').forEach(b => b.addEventListener('click', () => {
        input.revealed[b.dataset.reveal] = true;
        persist();
        draw();
      }));
    }

    draw();
  }

  window.ThermoAteliers = window.ThermoAteliers || {};
  window.ThermoAteliers['atelier-3'] = { id: 'atelier-3', titre: 'Frontières et bilan', render };
})();
