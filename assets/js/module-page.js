/*
 * Orchestrateur de page module : onglets Cours / [Flashcards|Applications numériques] / QCM /
 * [Carte mentale], état, chargement/sauvegarde de la progression, wiring des moteurs factorisés.
 * Chaque fichier svt/chXX-....html ou physique-chimie/....html définit son objet MODULE puis
 * appelle ModulePage.init(MODULE).
 *
 * Contrat attendu sur MODULE (voir svt/ch05-datation-relative.html pour un exemple SVT complet,
 * physique-chimie/analyse-dimensionnelle.html pour un exemple PC complet) :
 *   id, chapNum, subjectLabel, title, pages, noManual?, bridge:{from,to}, backHref,
 *   fiches:[{unit,page,title,paragraphs,bullets,terrainBadge?,badge?}],
 *   qcm, qcmMeta, diagnostic,
 *   flashcards?, applications?, mindmapModel?
 *
 * Le 2e onglet est déterminé par détection de champ, pas par un indicateur de matière explicite :
 * `mod.flashcards` → onglet "Flashcards" (SVT) ; sinon `mod.applications` → onglet "Applications
 * numériques" (PC, cf. applications-engine.js et cahier des charges §3.2). Le 4e onglet "Carte
 * mentale" n'est affiché que si `mod.mindmapModel` est fourni — facultatif pour les modules très
 * calculatoires (cf. cahier des charges §3.2, ex. analyse dimensionnelle).
 *
 * Une fiche renvoie normalement à une page du manuel (`page`). Pour un contenu sans
 * renvoi de page (ex. un zoom interdisciplinaire vers un programme officiel, ou une capacité
 * transversale en PC), fournir `badge` (chaîne libre, ex. "PC Term." ou "Capacité transversale")
 * à la place de `page` : il s'affiche alors tel quel dans le même badge monospace, sans préfixe "p.".
 *
 * `mod.noManual` (optionnel, ex. modules "Première" sans manuel Terminale dédié, ou modules PC
 * sans manuel papier cf. cahier des charges §3.2) : supprime le préfixe "Manuel Belin Éducation,"
 * de l'en-tête, `mod.pages` s'affiche alors seul, tel quel.
 *
 * state.progress (persisté sous `progress:<modId>`) :
 *   flashcards: {[cardId]: {rating, lastSeen, interval, ease, dueDate}}  — cf. flashcards-engine.js
 *   qcmAttempts: [{date, score, total, weightedScore}]
 *   appsAttempts: [{date, score, total, weightedScore}]  — cf. applications-engine.js
 *   selfExplanations: {[questionId]: string}  — notes d'autoexplication libres, jamais notées, cf. qcm-engine.js
 * state.selfExpOpen (éphémère, non persisté) : {[questionId]: bool} — pli/déplie la note d'autoexplication.
 * state.appAnswers/appSubmitted/appHintsShown (éphémère) : cf. applications-engine.js.
 */
(function(){
  function esc(s){ return (s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  async function loadProgress(modId){
    const r = await Storage.get('progress:'+modId);
    let p;
    try{ p = r ? JSON.parse(r.value) : {flashcards:{}, qcmAttempts:[]}; }
    catch(e){ p = {flashcards:{}, qcmAttempts:[]}; }
    if(!p.selfExplanations) p.selfExplanations = {};
    if(!p.appsAttempts) p.appsAttempts = [];
    return p;
  }
  async function saveProgress(modId, data){ await Storage.set('progress:'+modId, JSON.stringify(data)); }
  async function loadMindmap(mod){
    const r = await Storage.get('mindmap:'+mod.id);
    try{ return r ? JSON.parse(r.value) : {nodes:[{id:'root', label:mod.title, parentId:null}]}; }
    catch(e){ return {nodes:[{id:'root', label:mod.title, parentId:null}]}; }
  }
  async function saveMindmap(mod, data){ await Storage.set('mindmap:'+mod.id, JSON.stringify(data)); }

  function renderCours(target, mod, state, persist){
    let html = '';
    mod.fiches.forEach(f=>{
      html += `<div class="card">
        <h3>${esc(f.unit)} — ${esc(f.title)} <span class="page-tag">${f.badge ? esc(f.badge) : 'p.'+f.page}</span></h3>
        ${f.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}
        <ul>${f.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>
        ${f.terrainBadge ? `<a class="terrain-badge" href="${f.terrainBadge.href}">🏔️ Vu sur le terrain — ${esc(f.terrainBadge.label)}</a>` : ''}
      </div>`;
    });
    html += `<button class="btn primary" id="markRead">${state.progress.coursRead ? '✓ Cours marqué comme lu' : 'Marquer le cours comme lu'}</button>`;
    target.innerHTML = html;
    MathRender.render(target);
    target.querySelector('#markRead').addEventListener('click', async ()=>{
      state.progress.coursRead = true;
      await persist();
      renderCours(target, mod, state, persist);
    });
  }

  async function init(mod){
    const state = {
      tab:'cours', loading:true,
      progress:{flashcards:{}, qcmAttempts:[], appsAttempts:[], selfExplanations:{}},
      mindmap:{nodes:[{id:'root', label:mod.title, parentId:null}]},
      flashIndex:0, flashFlipped:false, flashOnlyDue:false,
      qcmAnswers:{}, qcmSubmitted:false, qcmOptionOrder:{}, hintsShown:{}, selfExpOpen:{}, showModel:false,
      appAnswers:{}, appSubmitted:false, appHintsShown:{}
    };
    const persist = async ()=>{ await saveProgress(mod.id, state.progress); };
    const persistMindmap = async ()=>{ await saveMindmap(mod, state.mindmap); };

    const app = document.getElementById('app');

    function tabList(){
      const tabs = [{key:'cours', label:'Cours'}];
      if(mod.flashcards) tabs.push({key:'flash', label:'Flashcards'});
      else if(mod.applications) tabs.push({key:'apps', label:'Applications numériques'});
      tabs.push({key:'qcm', label:'QCM'});
      if(mod.mindmapModel) tabs.push({key:'carte', label:'Carte mentale'});
      return tabs;
    }

    function renderShell(){
      const tabs = tabList();
      if(!tabs.some(t=>t.key===state.tab)) state.tab = 'cours';
      let html = `
      <a class="back-link" href="${mod.backHref || '../index.html'}">← Retour à l'accueil</a>
      <div class="module-head">
        <p class="m-tag">${esc(mod.chapNum)} · ${esc(mod.subjectLabel)}</p>
        <h1>${esc(mod.title)}</h1>
        <p class="m-pages">${mod.noManual ? esc(mod.pages) : 'Manuel Belin Éducation, ' + esc(mod.pages)}</p>
        ${mod.bridge ? `<div class="m-bridge" style="--card-accent:${mod.accent||'var(--rust)'}"><b>Déjà vu :</b> ${esc(mod.bridge.from)}<br><b>En BCPST1 :</b> ${esc(mod.bridge.to)}</div>` : ''}
      </div>
      <div class="tabs">
        ${tabs.map(t=>`<button class="tab ${state.tab===t.key?'active':''}" data-tab="${t.key}">${esc(t.label)}</button>`).join('')}
      </div>
      <div id="tabContent"></div>`;
      app.innerHTML = html;
      MathRender.render(app);
      app.querySelectorAll('.tab').forEach(t=>{
        t.addEventListener('click', ()=>{ state.tab = t.dataset.tab; renderShell(); });
      });
      const tabContent = document.getElementById('tabContent');
      if(state.tab==='cours') renderCours(tabContent, mod, state, persist);
      else if(state.tab==='flash') FlashcardsEngine.render(tabContent, mod, state, persist);
      else if(state.tab==='apps') ApplicationsEngine.render(tabContent, mod, state, persist);
      else if(state.tab==='qcm') QcmEngine.render(tabContent, mod, state, persist);
      else MindmapEngine.render(tabContent, mod, state, persistMindmap);
    }

    state.progress = await loadProgress(mod.id);
    state.mindmap = await loadMindmap(mod);
    state.loading = false;
    renderShell();
  }

  window.ModulePage = { init };
})();
