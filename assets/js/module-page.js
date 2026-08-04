/*
 * Orchestrateur de page module : onglets Cours / Flashcards / QCM / Carte mentale,
 * état, chargement/sauvegarde de la progression, wiring des moteurs factorisés.
 * Chaque fichier svt/chXX-....html définit son objet MODULE puis appelle
 * ModulePage.init(MODULE).
 *
 * Contrat attendu sur MODULE (voir svt/ch05-datation-relative.html pour un exemple complet) :
 *   id, chapNum, subjectLabel, title, pages, noManual?, bridge:{from,to}, backHref,
 *   fiches:[{unit,page,title,paragraphs,bullets,terrainBadge?,badge?}],
 *   flashcards, qcm, qcmMeta, diagnostic, mindmapModel
 *
 * Une fiche renvoie normalement à une page du manuel (`page`). Pour un contenu sans
 * renvoi de page (ex. un zoom interdisciplinaire vers un programme officiel), fournir
 * `badge` (chaîne libre, ex. "PC Term.") à la place de `page` : il s'affiche alors tel
 * quel dans le même badge monospace, sans préfixe "p.".
 *
 * `mod.noManual` (optionnel, ex. modules "Première" sans manuel Terminale dédié) :
 * supprime le préfixe "Manuel Belin Éducation," de l'en-tête, `mod.pages` s'affiche
 * alors seul, tel quel.
 */
(function(){
  function esc(s){ return (s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  async function loadProgress(modId){
    const r = await Storage.get('progress:'+modId);
    try{ return r ? JSON.parse(r.value) : {flashcards:{}, qcmAttempts:[]}; }
    catch(e){ return {flashcards:{}, qcmAttempts:[]}; }
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
      progress:{flashcards:{}, qcmAttempts:[]},
      mindmap:{nodes:[{id:'root', label:mod.title, parentId:null}]},
      flashIndex:0, flashFlipped:false, flashOnlyDue:false,
      qcmAnswers:{}, qcmSubmitted:false, qcmOptionOrder:{}, hintsShown:{}, showModel:false
    };
    const persist = async ()=>{ await saveProgress(mod.id, state.progress); };
    const persistMindmap = async ()=>{ await saveMindmap(mod, state.mindmap); };

    const app = document.getElementById('app');

    function renderShell(){
      let html = `
      <a class="back-link" href="${mod.backHref || '../index.html'}">← Retour à l'accueil</a>
      <div class="module-head">
        <p class="m-tag">${esc(mod.chapNum)} · ${esc(mod.subjectLabel)}</p>
        <h1>${esc(mod.title)}</h1>
        <p class="m-pages">${mod.noManual ? esc(mod.pages) : 'Manuel Belin Éducation, ' + esc(mod.pages)}</p>
        ${mod.bridge ? `<div class="m-bridge" style="--card-accent:${mod.accent||'var(--rust)'}"><b>Déjà vu :</b> ${esc(mod.bridge.from)}<br><b>En BCPST1 :</b> ${esc(mod.bridge.to)}</div>` : ''}
      </div>
      <div class="tabs">
        <button class="tab ${state.tab==='cours'?'active':''}" data-tab="cours">Cours</button>
        <button class="tab ${state.tab==='flash'?'active':''}" data-tab="flash">Flashcards</button>
        <button class="tab ${state.tab==='qcm'?'active':''}" data-tab="qcm">QCM</button>
        <button class="tab ${state.tab==='carte'?'active':''}" data-tab="carte">Carte mentale</button>
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
