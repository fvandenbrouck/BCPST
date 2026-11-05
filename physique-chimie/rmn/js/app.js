/*
 * Routeur et orchestration de l'application RMN. Navigation par hash
 * (#/accueil, #/cours, #/methode, #/diagnostic-initial, #/parcours,
 * #/activite/A1, #/diagnostic-sortie/D1, #/tableau). L'état complet
 * (réponses, résultats, niveaux de maîtrise) est relu/réécrit à chaque
 * interaction via RmnStorage, pour une reprise exacte au rechargement.
 */
(function(){
  let STATE = window.RmnStorage.load();
  const root = document.getElementById('app');

  function persist(){ window.RmnStorage.save(STATE); }

  function ensureActivite(id){
    if (!STATE.activites[id]) STATE.activites[id] = { exercices: {}, completed: false, exerciseIndex: 0 };
    return STATE.activites[id];
  }

  // ---------------------------------------------------------------- UTILS
  function escapeXml(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function hexLerp(hexA, hexB, t){
    const a = [1, 3, 5].map(i => parseInt(hexA.slice(i, i + 2), 16));
    const b = [1, 3, 5].map(i => parseInt(hexB.slice(i, i + 2), 16));
    const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  }
  const MASTERY_ANCHORS = [
    { p: 10, c: '#79513A' }, { p: 30, c: '#A47D55' }, { p: 50, c: '#C0A16B' },
    { p: 70, c: '#82945A' }, { p: 90, c: '#398653' }
  ];
  function masteryColor(pct){
    if (pct === null || pct === undefined) return '#C9C2AE';
    const p = Math.max(0, Math.min(100, pct));
    if (p <= MASTERY_ANCHORS[0].p) return MASTERY_ANCHORS[0].c;
    if (p >= MASTERY_ANCHORS[MASTERY_ANCHORS.length - 1].p) return MASTERY_ANCHORS[MASTERY_ANCHORS.length - 1].c;
    for (let i = 0; i < MASTERY_ANCHORS.length - 1; i++){
      const A = MASTERY_ANCHORS[i], B = MASTERY_ANCHORS[i + 1];
      if (p >= A.p && p <= B.p) return hexLerp(A.c, B.c, (p - A.p) / (B.p - A.p));
    }
    return MASTERY_ANCHORS[MASTERY_ANCHORS.length - 1].c;
  }

  function competenceById(id){ return window.RMN_COMPETENCES.find(c => c.id === id); }

  function navLink(hash, label, active){
    return `<a href="#${hash}" class="tab${active ? ' active' : ''}">${label}</a>`;
  }

  function topNav(current){
    const items = [
      ['/accueil', 'Accueil'], ['/cours', "L'essentiel du cours"], ['/methode', 'Méthode'],
      ['/diagnostic-initial', 'Diagnostic initial'], ['/parcours', "Parcours d'apprentissage"], ['/tableau', 'Tableau de maîtrise']
    ];
    return `<div class="tabs">${items.map(([h, l]) => navLink(h, l, current === h)).join('')}</div>`;
  }

  function masteryHeader(){
    const levels = window.MasteryEngine.computeLevels(STATE);
    const { pct, evaluated, total } = window.MasteryEngine.computeGlobalPct(levels);
    const avancement = window.MasteryEngine.computeAvancement(STATE);
    const color = masteryColor(pct);
    const pctDisplay = pct === null ? '—' : pct + '%';
    return `
      <div class="mastery-header">
        <div class="mastery-row">
          <div class="mastery-bar-wrap" title="Maîtrise démontrée (évaluations diagnostiques)">
            <div class="mastery-bar-bg"><div class="mastery-bar-fill" style="width:${pct || 0}%;background:${color};"></div></div>
            <div class="mastery-caption"><b>Maîtrise démontrée : ${pctDisplay}</b> <span class="m-meta">(${evaluated}/${total} compétences évaluées)</span></div>
          </div>
        </div>
        <div class="mastery-row secondary">
          <div class="avancement-bar-wrap" title="Avancement du parcours (activités réalisées)">
            <div class="avancement-bar-bg"><div class="avancement-bar-fill" style="width:${avancement}%;"></div></div>
            <div class="mastery-caption"><span class="m-meta">Parcours réalisé : ${avancement}%</span></div>
          </div>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------- ROUTER
  function parseHash(){
    const h = (location.hash || '#/accueil').slice(1);
    const parts = h.split('/').filter(Boolean);
    return parts;
  }

  function go(hash){ location.hash = hash; }

  function render(){
    const parts = parseHash();
    const page = '/' + (parts[0] || 'accueil');
    STATE.nav.page = page;
    persist();

    root.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.innerHTML = masteryHeader() + topNav(page);
    root.appendChild(wrap);

    const body = document.createElement('div');
    body.className = 'page-body';
    root.appendChild(body);

    if (page === '/accueil') renderAccueil(body);
    else if (page === '/cours') renderCours(body);
    else if (page === '/methode') renderMethode(body);
    else if (page === '/diagnostic-initial') renderDiagnosticInitial(body);
    else if (page === '/parcours') renderParcours(body);
    else if (page === '/activite') renderActivite(body, parts[1]);
    else if (page === '/diagnostic-sortie') renderDiagnosticSortieResults(body, parts[1]);
    else if (page === '/tableau') renderTableau(body);
    else renderAccueil(body);

    appendFicheMethodeFloatingButton();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);

  // ---------------------------------------------------------------- ACCUEIL
  function renderAccueil(body){
    body.innerHTML = `
      <div class="card">
        <h3>RMN du proton — BCPST1</h3>
        <p>Ce module couvre la spectroscopie de résonance magnétique nucléaire du proton (programme officiel BCPST1, section C.1.3) : déplacement chimique, intégration, multiplicité, couplages du premier ordre A<sub>m</sub>X<sub>p</sub> et A<sub>m</sub>M<sub>p</sub>X<sub>q</sub>, jusqu'à la capacité exigible « confirmer ou attribuer une structure à partir de données IR et/ou RMN ».</p>
        <p>Quatre briques : un <a href="#/cours">cours</a> synthétique, une <a href="#/methode">méthode</a> d'analyse en 6 étapes, un <a href="#/diagnostic-initial">diagnostic initial</a> pour faire un point de départ, puis un <a href="#/parcours">parcours</a> de 6 activités, chacune suivie d'une évaluation diagnostique indépendante.</p>
        <p class="m-meta">Important : réussir une activité ne prouve pas, à elle seule, la maîtrise d'une compétence. Seule l'évaluation diagnostique qui suit chaque activité fait évoluer la barre de maîtrise ci-dessus.</p>
      </div>
      <div class="card">
        <h3>Par où commencer ?</h3>
        <p>${STATE.diagnosticInitial.done
          ? 'Le diagnostic initial est fait : rendez-vous sur le <a href="#/parcours">parcours d\'apprentissage</a>.'
          : 'Commencez par le <a href="#/diagnostic-initial">diagnostic initial</a> (10 à 12 questions) pour initialiser votre tableau de maîtrise.'}</p>
      </div>
      <button class="reset-btn" id="btn-reset-all">Reprendre le parcours à zéro</button>
    `;
    body.querySelector('#btn-reset-all').addEventListener('click', confirmResetAll);
  }

  function confirmResetAll(){
    showModal(`
      <h3>Reprendre à zéro ?</h3>
      <p>Toutes les réponses, résultats et niveaux de maîtrise enregistrés localement seront définitivement effacés. Cette action est irréversible.</p>
      <div class="flash-actions">
        <button class="btn ghost" id="modal-cancel">Annuler</button>
        <button class="btn primary" id="modal-confirm" style="background:var(--rust-deep);border-color:var(--rust-deep);">Oui, tout effacer</button>
      </div>
    `, (modalEl) => {
      modalEl.querySelector('#modal-cancel').addEventListener('click', closeModal);
      modalEl.querySelector('#modal-confirm').addEventListener('click', () => {
        STATE = window.RmnStorage.reset();
        persist(); closeModal(); go('/accueil'); render();
      });
    });
  }

  // ---------------------------------------------------------------- COURS
  function renderCours(body){
    const C = window.RMN_COURS;
    let html = `<div class="card"><h3>Les quatre informations d'un spectre RMN ¹H</h3>
      <ul>${C.quatreInfos.map(i => `<li><b>${escapeXml(i.info)}</b> — ${escapeXml(i.interpretation)}</li>`).join('')}</ul>
      <p class="m-meta">${escapeXml(C.croisementNote)}</p></div>`;

    html += `<div class="card"><h3>Équivalence chimique</h3><p>${escapeXml(C.equivalence.intro)}</p><p>${escapeXml(C.equivalence.regle)}</p></div>`;

    C.equivalence.exemples.forEach(ex => {
      const spectre = window.RMN_SPECTRE_BY_ID(ex.spectreId);
      html += `<div class="card eq-demo-card" data-spectre="${ex.spectreId}">
        <h3>${escapeXml(spectre.nom)} — ${escapeXml(spectre.formule)}</h3>
        <div class="eq-demo-mount"></div>
        <p class="m-meta">${escapeXml(ex.note)}</p>
      </div>`;
    });

    html += `<div class="card"><h3>Déplacement chimique</h3><p>${escapeXml(C.deplacementChimique.intro)}</p>
      <div class="delta-scale-mount" id="delta-scale-cours"></div>
      <p class="m-meta">${escapeXml(C.deplacementChimique.limites)}</p>
      <p class="m-meta">${escapeXml(C.deplacementChimique.echangeables)}</p></div>`;

    html += `<div class="card"><h3>Intégration</h3><p>${escapeXml(C.integration.intro)}</p><ul>${C.integration.pieges.map(p => `<li>${escapeXml(p)}</li>`).join('')}</ul>
      <ul>${C.integration.exemples.map(e => `<li>${escapeXml(window.RMN_SPECTRE_BY_ID(e.spectreId).nom)} : ${escapeXml(e.note)}</li>`).join('')}</ul></div>`;

    html += `<div class="card"><h3>Multiplicité</h3><p>${escapeXml(C.multiplicite.intro)}</p><p><b>${escapeXml(C.multiplicite.regleN1)}</b></p>
      <ul>${C.multiplicite.conditionsN1.map(p => `<li>${escapeXml(p)}</li>`).join('')}</ul>
      <div class="multiplet-gallery">${C.multiplicite.multipletsSimples.map(m => `
        <div class="multiplet-item">
          <div class="mono m-meta">${escapeXml(m.nom)}</div>
          ${window.MultipletSVG.renderSimpleMultiplet(m.n, { width: 150, height: 80 })}
          <div class="m-meta">${escapeXml(m.exemple)}</div>
        </div>`).join('')}</div>
      <h3 style="margin-top:16px;">Couplages multiples (A<sub>m</sub>M<sub>p</sub>X<sub>q</sub>)</h3>
      <p>${escapeXml(C.multiplicite.couplagesMultiples.intro)}</p>
      <ul>${C.multiplicite.couplagesMultiples.cas.map(p => `<li>${escapeXml(p)}</li>`).join('')}</ul>
      <p class="m-meta">${escapeXml(C.multiplicite.couplagesMultiples.exempleTexte)}</p></div>`;

    html += `<div class="card"><h3>Cas particuliers et pièges</h3>${C.pieges.map(p => `<p><b>${escapeXml(p.titre)}.</b> ${escapeXml(p.texte)}</p>`).join('')}</div>`;

    body.innerHTML = html;

    window.DeltaScale.render(body.querySelector('#delta-scale-cours'), { interactive: true });
    body.querySelectorAll('.eq-demo-card').forEach(card => {
      const spectre = window.RMN_SPECTRE_BY_ID(card.getAttribute('data-spectre'));
      // La légende se construit directement depuis mol.groups (une clé par groupe
      // coloré, dans le même ordre que les signaux du spectre correspondant).
      const groupKeys = spectre.mol.groups ? Object.keys(spectre.mol.groups) : [];
      const legend = groupKeys.map((k, i) => ({ key: k, label: spectre.signaux[i] ? spectre.signaux[i].label : k, color: spectre.signaux[i] ? spectre.signaux[i].color : 'rust' }));
      window.MoleculeView.renderEquivalenceDemo(card.querySelector('.eq-demo-mount'), spectre.nom, spectre.mol, legend);
    });
  }

  // ---------------------------------------------------------------- MÉTHODE
  function methodeHtml(){
    const M = window.RMN_METHODE;
    return `<div class="card"><h3>Comment analyser rigoureusement un spectre RMN ?</h3>
      <p class="m-meta mono">${escapeXml(M.ficheCourte)}</p></div>` +
      M.etapes.map(e => `
        <div class="card">
          <h3>Étape ${e.n} — ${escapeXml(e.titre)}</h3>
          <p>${escapeXml(e.explication)}</p>
          <p><b>Exemple.</b> ${escapeXml(e.exemple)}</p>
          <div class="reco"><b>Erreur fréquente</b><br>${escapeXml(e.erreur)}</div>
        </div>`).join('') +
      `<div class="card"><h3>Tableau d'attribution (modèle)</h3>
        <p class="m-meta">À utiliser dans les activités d'attribution spectrale (activités 5 et 6) : ${M.tableauAttributionColonnes.join(' | ')}.</p>
      </div>`;
  }
  function renderMethode(body){ body.innerHTML = methodeHtml(); }

  function appendFicheMethodeFloatingButton(){
    if (document.getElementById('fiche-methode-fab')) return;
    const btn = document.createElement('button');
    btn.id = 'fiche-methode-fab';
    btn.className = 'fiche-fab';
    btn.type = 'button';
    btn.title = 'Fiche méthode (consultable sans perdre sa progression)';
    btn.textContent = '📋 Méthode';
    btn.addEventListener('click', () => {
      showModal(`<div class="fiche-modal-scroll">${methodeHtml()}</div>`, (modalEl) => {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn ghost'; closeBtn.textContent = 'Fermer'; closeBtn.style.marginTop = '10px';
        closeBtn.addEventListener('click', closeModal);
        modalEl.appendChild(closeBtn);
      });
    });
    document.body.appendChild(btn);
  }

  // ---------------------------------------------------------------- MODAL
  function showModal(innerHtml, wire){
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'rmn-modal-overlay';
    overlay.id = 'rmn-modal-overlay';
    const modal = document.createElement('div');
    modal.className = 'rmn-modal';
    modal.innerHTML = innerHtml;
    overlay.appendChild(modal);
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeModal(); });
    document.body.appendChild(overlay);
    if (wire) wire(modal);
  }
  function closeModal(){
    const el = document.getElementById('rmn-modal-overlay');
    if (el) el.remove();
  }

  // ---------------------------------------------------------------- DIAGNOSTIC INITIAL
  function renderDiagnosticInitial(body){
    if (STATE.diagnosticInitial.done){
      renderDiagnosticResultsView(body, 'Diagnostic initial', STATE.diagnosticInitial.results, STATE.diagnosticInitial.bilan, null);
      const btn = document.createElement('button');
      btn.className = 'btn ghost'; btn.style.marginTop = '12px';
      btn.textContent = 'Revoir les questions et explications';
      btn.addEventListener('click', () => renderDiagnosticReview(body, window.RMN_DIAGNOSTIC_INITIAL, STATE.diagnosticInitial.answers));
      body.appendChild(btn);
      return;
    }
    body.innerHTML = `<div class="card"><h3>Diagnostic initial</h3>
      <p>${window.RMN_DIAGNOSTIC_INITIAL.length} questions couvrant les sept compétences du module. Aucune correction n'est affichée pendant le diagnostic : un bilan détaillé par compétence apparaîtra une fois toutes les réponses soumises.</p></div>`;
    const mount = document.createElement('div');
    body.appendChild(mount);
    window.QuestionUI.renderDiagnosticForm(mount, window.RMN_DIAGNOSTIC_INITIAL, (answers) => {
      const results = gradeAndAggregate(window.RMN_DIAGNOSTIC_INITIAL, answers, 'initial');
      STATE.diagnosticInitial = { done: true, answers, results: results.perCompetence, timestamp: Date.now(), bilan: buildBilan(results.perCompetence) };
      window.MasteryEngine.pushHistoryPoint(STATE, 'Diagnostic initial');
      persist();
      render();
    }, 'Valider le diagnostic initial');
  }

  function gradeAndAggregate(questions, answers, source){
    const perCompetence = {};
    const evidenceRecords = [];
    questions.forEach(q => {
      const result = window.GradingEngine.gradeQuestion(q, answers[q.id]);
      (q.competences || [q.competence]).forEach(cid => {
        if (!perCompetence[cid]) perCompetence[cid] = { correct: 0, total: 0 };
        perCompetence[cid].total++;
        if (result.correct) perCompetence[cid].correct++;
        evidenceRecords.push({ competence: cid, correct: result.correct, difficulte: q.difficulte || 1, source });
      });
    });
    window.MasteryEngine.addEvidence(STATE, evidenceRecords);
    return { perCompetence };
  }

  function buildBilan(perCompetence){
    const acquis = [], fragiles = [];
    window.RMN_COMPETENCES.forEach(c => {
      const r = perCompetence[c.id];
      if (!r) return;
      const acc = r.correct / r.total;
      if (acc >= 0.7) acquis.push(c.titre);
      else fragiles.push(c.titre);
    });
    let txt = '';
    if (acquis.length) txt += `Les bases sont acquises pour : ${acquis.join(', ')}. `;
    if (fragiles.length) txt += `Le parcours mettra particulièrement l'accent sur : ${fragiles.join(', ')}.`;
    if (!fragiles.length) txt += "Aucune compétence fragile identifiée sur ce diagnostic initial : le parcours permettra tout de même de consolider le transfert vers des situations plus complexes.";
    return txt;
  }

  function renderDiagnosticResultsView(body, titre, perCompetence, bilan, comparisonPrev){
    const rows = window.RMN_COMPETENCES.map(c => {
      const r = perCompetence[c.id];
      if (!r) return `<tr><td>${c.id} — ${escapeXml(c.titre)}</td><td colspan="2" class="m-meta">Non testée dans ce diagnostic</td></tr>`;
      const acc = Math.round((r.correct / r.total) * 100);
      return `<tr><td>${c.id} — ${escapeXml(c.titre)}</td><td>${r.correct}/${r.total}</td><td>${acc}%</td></tr>`;
    }).join('');
    body.innerHTML = `
      <div class="card">
        <h3>${escapeXml(titre)} — résultats</h3>
        <table class="result-table"><thead><tr><th>Compétence</th><th>Score</th><th>%</th></tr></thead><tbody>${rows}</tbody></table>
        <div class="reco"><b>Bilan</b><br>${escapeXml(bilan)}</div>
      </div>`;
  }

  function renderDiagnosticReview(body, questions, answers){
    const mount = document.createElement('div');
    mount.innerHTML = questions.map((q, i) => {
      const r = window.GradingEngine.gradeQuestion(q, answers[q.id]);
      return `<div class="card">
        <p class="q-title">${i + 1}. ${escapeXml(q.enonce)} ${r.correct ? '✓' : '✗'}</p>
        <p class="reco"><b>Explication</b><br>${escapeXml(q.explication)}</p>
      </div>`;
    }).join('');
    body.appendChild(mount);
  }

  // ---------------------------------------------------------------- PARCOURS
  function renderParcours(body){
    const cards = window.RMN_ACTIVITES.map(a => {
      const st = STATE.activites[a.id];
      const dKey = 'D' + a.n;
      const dDone = STATE.diagnosticsSortie[dKey] && STATE.diagnosticsSortie[dKey].done;
      let badge = 'À commencer';
      if (st && st.completed && dDone) badge = 'Activité + diagnostic terminés';
      else if (st && st.completed) badge = 'Activité terminée — diagnostic à faire';
      else if (st && st.exerciseIndex > 0) badge = 'En cours';
      return `<a class="module-card" style="--card-accent:var(--ochre)" href="#/activite/${a.id}">
        <div><p class="m-title">Activité ${a.n} — ${escapeXml(a.titre)}</p>
        <p class="m-meta">${a.competences.join(', ')}</p></div>
        <span class="m-badge ${dDone ? 'active' : ''}">${badge}</span>
      </a>`;
    }).join('');
    body.innerHTML = `<div class="card"><h3>Parcours d'apprentissage</h3><p>Six activités de difficulté croissante. Chacune est suivie d'un diagnostic de sortie indépendant, portant sur des situations nouvelles.</p></div>
      <div class="module-grid">${cards}</div>`;
  }

  // ---------------------------------------------------------------- ACTIVITÉ
  function renderActivite(body, activiteId){
    const a = window.RMN_ACTIVITES.find(x => x.id === activiteId);
    if (!a){ body.innerHTML = '<p class="empty">Activité introuvable.</p>'; return; }
    const st = ensureActivite(a.id);
    persist();

    if (st.exerciseIndex >= a.exercices.length){
      renderActiviteTerminee(body, a, st);
      return;
    }

    const ex = a.exercices[st.exerciseIndex];
    body.innerHTML = `
      <div class="card">
        <h3>Activité ${a.n} — ${escapeXml(a.titre)}</h3>
        <p><b>Objectif.</b> ${escapeXml(a.objectif)}</p>
        <p class="m-meta">${escapeXml(a.rappel)}</p>
        <p class="flash-progress">Exercice ${st.exerciseIndex + 1} / ${a.exercices.length}</p>
      </div>`;
    if (a.simulateurJ && st.exerciseIndex === 1){
      const simCard = document.createElement('div');
      simCard.className = 'card';
      simCard.innerHTML = `<h3>Simulateur de couplage J₁ / J₂</h3><div id="jsim-mount"></div>`;
      body.appendChild(simCard);
      renderJCouplingSimulator(simCard.querySelector('#jsim-mount'));
    }
    if (a.spectreId){
      const specCard = document.createElement('div');
      specCard.className = 'card';
      specCard.innerHTML = `<h3>Spectre à analyser</h3><div id="spectrum-mount"></div>`;
      body.appendChild(specCard);
      window.SpectrumViewer.render(specCard.querySelector('#spectrum-mount'), a.spectreId);
    }
    const mount = document.createElement('div');
    body.appendChild(mount);
    window.QuestionUI.renderPracticeExercise(mount, ex, (result) => {
      st.exercices[ex.id] = result;
      st.exerciseIndex++;
      persist();
      render();
    });
  }

  function renderActiviteTerminee(body, a, st){
    if (!st.completed){ st.completed = true; persist(); }
    const dKey = 'D' + a.n;
    const dDone = STATE.diagnosticsSortie[dKey] && STATE.diagnosticsSortie[dKey].done;
    const nCorrect = Object.values(st.exercices).filter(r => r.correct).length;
    body.innerHTML = `
      <div class="card">
        <h3>Activité ${a.n} terminée</h3>
        <p>${nCorrect} / ${a.exercices.length} exercices réussis du premier coup (les tentatives suivantes et indices utilisés sont normaux et ne sont pas pénalisés).</p>
        <p class="m-meta">Pour vérifier ce qui est réellement acquis, un diagnostic indépendant suit maintenant, avec de nouvelles situations.</p>
      </div>`;
    const btn = document.createElement('button');
    btn.className = 'btn primary';
    btn.textContent = dDone ? 'Revoir le diagnostic ' + dKey : 'Commencer le diagnostic ' + dKey;
    btn.addEventListener('click', () => go('/diagnostic-sortie/' + dKey));
    body.appendChild(btn);
    const redo = document.createElement('button');
    redo.className = 'btn ghost'; redo.style.marginLeft = '8px';
    redo.textContent = 'Refaire les exercices';
    redo.addEventListener('click', () => { st.exerciseIndex = 0; st.exercices = {}; persist(); render(); });
    body.appendChild(redo);
  }

  // ---------------------------------------------------------------- SIMULATEUR J1/J2
  function renderJCouplingSimulator(mount){
    mount.innerHTML = `
      <div class="jsim-controls">
        <label>m (voisins groupe 1) <input type="range" min="0" max="3" value="2" id="jsim-m"><span id="jsim-m-val">2</span></label>
        <label>J₁ (Hz) <input type="range" min="2" max="16" value="7" id="jsim-j1"><span id="jsim-j1-val">7</span></label>
        <label>p (voisins groupe 2) <input type="range" min="0" max="3" value="3" id="jsim-p"><span id="jsim-p-val">3</span></label>
        <label>J₂ (Hz) <input type="range" min="2" max="16" value="7" id="jsim-j2"><span id="jsim-j2-val">7</span></label>
      </div>
      <div id="jsim-svg-mount"></div>
      <p class="m-meta" id="jsim-note"></p>`;
    const m = mount.querySelector('#jsim-m'), p = mount.querySelector('#jsim-p'), j1 = mount.querySelector('#jsim-j1'), j2 = mount.querySelector('#jsim-j2');
    const svgMount = mount.querySelector('#jsim-svg-mount');
    const note = mount.querySelector('#jsim-note');
    function draw(){
      mount.querySelector('#jsim-m-val').textContent = m.value;
      mount.querySelector('#jsim-p-val').textContent = p.value;
      mount.querySelector('#jsim-j1-val').textContent = j1.value;
      mount.querySelector('#jsim-j2-val').textContent = j2.value;
      const groups = [];
      if (Number(m.value) > 0) groups.push({ n: Number(m.value), J: Number(j1.value) });
      if (Number(p.value) > 0) groups.push({ n: Number(p.value), J: Number(j2.value) });
      const lines = window.MultipletSVG.buildMultipletLines(groups.length ? groups : [{ n: 0, J: 1 }], 0.35);
      svgMount.innerHTML = window.MultipletSVG.renderMultipletSVG(lines, { width: 500, height: 130 });
      note.textContent = `${lines.length} raie(s) visible(s) (jusqu'à ${(Number(m.value) + 1) * (Number(p.value) + 1)} raies théoriques sans superposition).`;
    }
    [m, p, j1, j2].forEach(el => el.addEventListener('input', draw));
    draw();
  }

  // ---------------------------------------------------------------- DIAGNOSTIC DE SORTIE
  function renderDiagnosticSortieResults(body, dKey){
    const def = window.RMN_DIAGNOSTICS_SORTIE[dKey];
    if (!def){ body.innerHTML = '<p class="empty">Diagnostic introuvable.</p>'; return; }
    const saved = STATE.diagnosticsSortie[dKey];

    if (saved && saved.done){
      const prevKey = 'D' + (Number(dKey.slice(1)) - 1);
      const prev = STATE.diagnosticsSortie[prevKey];
      renderDiagnosticResultsView(body, def.titre, saved.results, saved.bilan, prev);
      if (saved.remediationOffered && saved.fragiles && saved.fragiles.length){
        renderRemediationSection(body, saved.fragiles, dKey);
      }
      const back = document.createElement('a');
      back.className = 'btn ghost'; back.style.display = 'inline-block'; back.style.marginTop = '10px';
      back.href = '#/parcours'; back.textContent = '← Retour au parcours';
      body.appendChild(back);
      return;
    }

    body.innerHTML = `<div class="card"><h3>${escapeXml(def.titre)}</h3>
      <p>${def.questions.length} questions inédites, sur de nouvelles situations. Aucune correction affichée avant la validation complète.</p></div>`;
    if (def.spectreId){
      const specCard = document.createElement('div');
      specCard.className = 'card';
      specCard.innerHTML = `<h3>Spectre à analyser</h3><div id="spectrum-mount-diag"></div>`;
      body.appendChild(specCard);
      window.SpectrumViewer.render(specCard.querySelector('#spectrum-mount-diag'), def.spectreId);
    }
    const mount = document.createElement('div');
    body.appendChild(mount);
    window.QuestionUI.renderDiagnosticForm(mount, def.questions, (answers) => {
      const results = gradeAndAggregate(def.questions, answers, dKey);
      const fragiles = Object.keys(results.perCompetence).filter(cid => {
        const r = results.perCompetence[cid];
        return (r.correct / r.total) < 0.6;
      });
      STATE.diagnosticsSortie[dKey] = {
        done: true, answers, results: results.perCompetence, timestamp: Date.now(),
        bilan: buildBilan(results.perCompetence), fragiles, remediationOffered: fragiles.length > 0
      };
      window.MasteryEngine.pushHistoryPoint(STATE, dKey);
      persist();
      render();
    }, 'Valider le diagnostic ' + dKey);
  }

  function renderRemediationSection(body, fragileCompetences, dKey){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>Remédiation ciblée</h3>
      <p>Compétence(s) à consolider : ${fragileCompetences.map(c => competenceById(c) ? competenceById(c).titre : c).join(', ')}. Une courte question de remédiation est proposée pour chacune, suivie d'une nouvelle vérification.</p>`;
    body.appendChild(card);
    fragileCompetences.forEach(cid => {
      const bank = window.RMN_REMEDIATION[cid];
      if (!bank || !bank.length) return;
      const q = bank[Math.floor(Math.random() * bank.length)];
      const mount = document.createElement('div');
      body.appendChild(mount);
      window.QuestionUI.renderPracticeExercise(mount, Object.assign({ competences: [cid], difficulte: 2 }, q), (result) => {
        window.MasteryEngine.addEvidence(STATE, [{ competence: cid, correct: result.correct, difficulte: 2, source: 'remediation' }]);
        window.MasteryEngine.pushHistoryPoint(STATE, 'Remédiation ' + cid);
        persist();
        render();
      });
    });
  }

  // ---------------------------------------------------------------- TABLEAU DE MAÎTRISE
  function renderTableau(body){
    const levels = window.MasteryEngine.computeLevels(STATE);
    const rows = window.RMN_COMPETENCES.map(c => {
      const lvl = levels[c.id];
      const pct = lvl === null ? 0 : (lvl / 4) * 100;
      const color = lvl === null ? '#C9C2AE' : masteryColor(20 + lvl * 20);
      return `<div class="comp-bar-row">
        <div class="comp-bar-label"><b>${c.id}</b> ${escapeXml(c.titre)} <span class="m-meta">— ${window.RMN_NIVEAU_LABEL(lvl)}</span></div>
        <div class="comp-bar-bg"><div class="comp-bar-fill" style="width:${pct}%;background:${color};"></div></div>
      </div>`;
    }).join('');

    const history = STATE.masteryHistory;
    const histSvg = renderHistoryChart(history);

    body.innerHTML = `
      <div class="card"><h3>Maîtrise par compétence</h3>${rows}</div>
      <div class="card"><h3>Historique des progrès</h3>${history.length ? histSvg : '<p class="empty">Aucune évaluation enregistrée pour l\'instant.</p>'}</div>
      <div class="card">
        <button class="tab" id="toggle-calc-explain" type="button" style="border:none;">▸ Comment ce score est-il calculé ?</button>
        <div id="calc-explain" style="display:none;margin-top:10px;">
          <p>Seules les évaluations diagnostiques (diagnostic initial, D1 à D6, remédiation) font progresser la maîtrise — pas les exercices d'entraînement des activités.</p>
          <p>Pour chaque compétence, seule la session d'évaluation la PLUS RÉCENTE qui l'a testée est prise en compte (pas une moyenne de tout l'historique) : la maîtrise peut donc stagner ou diminuer si une évaluation ultérieure révèle une difficulté.</p>
          <p>Le niveau atteint dépend à la fois du taux de réussite de cette session ET de la difficulté des questions réussies : réussir uniquement des questions faciles ne peut jamais, à lui seul, valoir le niveau 4 (transfert). Le diagnostic initial, en particulier, est plafonné au niveau 2 : c'est un état des lieux, pas une preuve de maîtrise autonome.</p>
          <p>Le score global est la moyenne pondérée des niveaux des compétences évaluées (C6 et C7, capacités terminales, comptent davantage), ramenée à un pourcentage. Les compétences non évaluées sont exclues de cette moyenne et affichées « non évalué » plutôt que comptées comme un échec.</p>
        </div>
      </div>
      <button class="reset-btn" id="btn-reset-all-2">Reprendre le parcours à zéro</button>
    `;
    body.querySelector('#toggle-calc-explain').addEventListener('click', (ev) => {
      const el = body.querySelector('#calc-explain');
      const show = el.style.display === 'none';
      el.style.display = show ? 'block' : 'none';
      ev.target.textContent = (show ? '▾' : '▸') + ' Comment ce score est-il calculé ?';
    });
    body.querySelector('#btn-reset-all-2').addEventListener('click', confirmResetAll);
  }

  function renderHistoryChart(history){
    const w = 640, h = 160, padX = 30, padY = 20;
    const pts = history.filter(p => p.globalPct !== null);
    if (!pts.length) return '<p class="empty">Pas encore de score global calculable.</p>';
    const x = (i) => padX + (w - 2 * padX) * (pts.length === 1 ? 0.5 : i / (pts.length - 1));
    const y = (v) => h - padY - (h - 2 * padY) * (v / 100);
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.globalPct).toFixed(1)}`).join(' ');
    const dots = pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.globalPct).toFixed(1)}" r="4" fill="var(--rust)"/>
      <text x="${x(i).toFixed(1)}" y="${(y(p.globalPct) - 10).toFixed(1)}" font-size="10" text-anchor="middle" fill="var(--ink)">${p.globalPct}%</text>
      <text x="${x(i).toFixed(1)}" y="${h - 4}" font-size="9" text-anchor="middle" fill="var(--ink-soft)" font-family="IBM Plex Mono, monospace">${escapeXml(p.label.slice(0, 10))}</text>`).join('');
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Historique des progrès">
      <line x1="${padX}" y1="${h - padY}" x2="${w - padX}" y2="${h - padY}" stroke="var(--line)"/>
      <path d="${path}" stroke="var(--moss)" stroke-width="2" fill="none"/>
      ${dots}
    </svg>`;
  }

  // ---------------------------------------------------------------- BOOT
  if (!location.hash) location.hash = '#/accueil';
  render();
})();
