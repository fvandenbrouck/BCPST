/*
 * Coquille applicative : thème clair/sombre, routeur par hash, utilitaires
 * partagés (figure moléculaire, banque de questions unifiée, paquet de
 * flashcards généré depuis les données), tableau de bord.
 *
 * Toutes les données de progression sont stockées sous une unique clé
 * `items` (ChimorgStorage), indexée par un identifiant préfixé par type
 * (q:, fc:, no:) afin de calculer des statistiques globales cohérentes
 * (maîtrise, échéances de révision) quel que soit le mode d'entraînement
 * utilisé pour réviser un item donné.
 */
(function(){
  'use strict';
  function esc(s){ return (s==null?'':s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  // Tolérance typographique pour la correction des réponses saisies (modes
  // 2 et 4, et questions de type "nomenclature" du quiz) : espaces, tirets,
  // apostrophes et accents sont ignorés, mais pas les chiffres (numérotation)
  // ni les lettres elles-mêmes — une erreur de numérotation ou un nom
  // chimiquement incorrect reste donc détecté.
  function normalizeAnswer(s){
    return (s||'').toString().trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g,'')
      .replace(/['’]/g,'')
      .replace(/[-\s]+/g,'');
  }

  // ---------------------------------------------------------------- thème
  function applyTheme(mode){
    const root = document.documentElement;
    if(mode === 'light' || mode === 'dark') root.setAttribute('data-theme', mode);
    else root.removeAttribute('data-theme');
  }
  function currentThemePref(){ return ChimorgStorage.get('theme', 'auto'); }
  function cycleTheme(){
    const order = ['auto','light','dark'];
    const next = order[(order.indexOf(currentThemePref())+1) % order.length];
    ChimorgStorage.set('theme', next);
    applyTheme(next === 'auto' ? null : next);
    return next;
  }
  applyTheme(currentThemePref() === 'auto' ? null : currentThemePref());

  // ------------------------------------------------------------ figure SVG
  function molFigure(path, alt, opts){
    opts = opts || {};
    const cls = opts.small ? 'mol-card small' : 'mol-card';
    return `<div class="${cls}"><img src="${esc(path)}" alt="${esc(alt||'formule topologique')}" loading="lazy"></div>`;
  }

  // ------------------------------------------------- formule semi-développée
  // Pour les exercices qui donnent la molécule comme texte (ex. CH3-CH2-OH)
  // plutôt que comme structure topologique dessinée (cf. data/nomenclature.js).
  function molFormula(text, opts){
    opts = opts || {};
    const cls = opts.small ? 'mol-card formula small' : 'mol-card formula';
    return `<div class="${cls}"><span class="formula-text">${esc(text)}</span></div>`;
  }

  // ------------------------------------------------------- banque unifiée
  function nomenclatureAsQuestions(){
    const ex = (window.CHIMORG_NOMENCLATURE && window.CHIMORG_NOMENCLATURE.exercises) || [];
    return ex.map(e => ({
      id:'no:'+e.id, module:'C', theme:'nomenclature-n'+e.level, difficulty:e.level, type:'nomenclature',
      question: e.formula ? "Donne le nom systématique de cette molécule (formule semi-développée)." : "Donne le nom systématique de cette molécule.",
      structure:e.img||null, formula:e.formula||null, answer:e.name, explanation:e.explanation, hints:e.hints,
      sourcePage:'p.16-23', tags:['nomenclature']
    }));
  }
  function allQuestions(){
    return (window.CHIMORG_QUESTIONS||[]).map(q=>Object.assign({},q,{id:'q:'+q.id}))
      .concat(nomenclatureAsQuestions());
  }

  // --------------------------------------------------- paquet flashcards
  function buildDeck(){
    const cards = [];
    (window.CHIMORG_FAMILIES||[]).forEach(f=>{
      cards.push({ id:'fc:fam:'+f.id+':f2g', module:'A', theme:f.id,
        recto:`Quel est le groupe caractéristique de la famille « ${f.name} » ?`,
        verso:`${f.groupeCaracteristique}\n${f.formuleGenerique}` });
      cards.push({ id:'fc:fam:'+f.id+':g2f', module:'A', theme:f.id,
        recto:`Quelle famille possède le groupe caractéristique :\n${f.groupeCaracteristique} ?`,
        verso:f.name });
      cards.push({ id:'fc:fam:'+f.id+':s2n', module:'A', theme:f.id,
        recto:"Donne le nom systématique de cette molécule.", rectoImg:f.img,
        verso:f.systematicName });
      cards.push({ id:'fc:fam:'+f.id+':n2s', module:'A', theme:f.id,
        recto:`Reconnais/dessine mentalement la structure de : ${f.systematicName}`,
        verso:f.exampleName, versoImg:f.img });
    });
    const B = window.CHIMORG_BIOMOLECULES || {};
    Object.keys(B).forEach(themeKey=>{
      (B[themeKey].notions||[]).forEach(n=>{
        cards.push({ id:'fc:bio:'+n.id+':t2d', module:'B', theme:themeKey,
          recto:n.term, verso:n.def });
        cards.push({ id:'fc:bio:'+n.id+':d2t', module:'B', theme:themeKey,
          recto:n.def, verso:n.term });
        if(n.img){
          cards.push({ id:'fc:bio:'+n.id+':ex', module:'B', theme:themeKey,
            recto:"Identifie cette notion à partir de l'exemple représenté.", rectoImg:n.img,
            verso:`${n.term} — ${n.example||''}` });
        }
      });
    });
    ((window.CHIMORG_NOMENCLATURE && window.CHIMORG_NOMENCLATURE.exercises) || []).forEach(e=>{
      cards.push({ id:'fc:no:'+e.id+':s2n', module:'C', theme:'nomenclature-n'+e.level,
        recto:"Donne le nom systématique de cette molécule.", rectoImg:e.img||null, rectoFormula:e.formula||null, verso:e.name });
      cards.push({ id:'fc:no:'+e.id+':n2s', module:'C', theme:'nomenclature-n'+e.level,
        recto:`Reconnais/dessine mentalement la structure de : ${e.name}`, verso:e.explanation, versoImg:e.img||null, versoFormula:e.formula||null });
    });
    return cards;
  }

  // ------------------------------------------------------------ progress
  // Scopée par profil actif (cf. js/profile.js) : chaque étudiant a sa
  // propre progression sur un même appareil partagé.
  function loadItems(){ return ChimorgStorage.getScoped('items', {}); }
  function saveItems(items){ ChimorgStorage.setScoped('items', items); }
  function getRecord(items, id){ return items[id] || null; }
  function reviewItem(id, rating){
    const items = loadItems();
    items[id] = ChimorgSRS.review(items[id], rating);
    saveItems(items);
    return items[id];
  }
  function loadSessions(){ return ChimorgStorage.getScoped('sessions', []); }
  function logSession(mode, score, total){
    const sessions = loadSessions();
    sessions.push({ date:new Date().toISOString(), mode, score, total, pct: total? Math.round(score/total*100):0 });
    while(sessions.length > 40) sessions.shift();
    ChimorgStorage.setScoped('sessions', sessions);
  }

  function exportProgress(){
    const profile = window.ChimorgProfile.getActiveProfile();
    return JSON.stringify({
      exportedAt:new Date().toISOString(),
      profile: profile ? profile.name : null,
      items:loadItems(),
      sessions:loadSessions(),
      theme:ChimorgStorage.get('theme','auto')
    }, null, 2);
  }
  function importProgress(json){
    const data = JSON.parse(json);
    if(data.items) saveItems(data.items);
    if(data.sessions) ChimorgStorage.setScoped('sessions', data.sessions);
    if(data.theme) ChimorgStorage.set('theme', data.theme);
  }

  // --------------------------------------------------------------- router
  const routes = {};
  function route(name, renderFn){ routes[name] = renderFn; }
  function parseHash(){
    let h = location.hash.replace(/^#\/?/, '');
    if(!h) h = 'home';
    const [path, qs] = h.split('?');
    const query = {};
    if(qs) qs.split('&').forEach(kv=>{ const [k,v]=kv.split('='); if(k) query[decodeURIComponent(k)] = decodeURIComponent(v||''); });
    return { path, query };
  }
  function navigate(hash){ location.hash = hash; }
  function renderRoute(){
    const app = document.getElementById('app');
    // Identification obligatoire (cf. js/profile.js) : tant qu'aucun profil
    // n'est actif, on affiche la porte d'entrée à la place de toute route,
    // y compris la bibliothèque de fiches et l'accueil.
    const profile = window.ChimorgProfile.getActiveProfile();
    if(!profile){
      window.scrollTo(0,0);
      window.ChimorgProfile.renderGate(app, renderRoute);
      renderTopbar();
      return;
    }
    const { path, query } = parseHash();
    const fn = routes[path] || routes['home'];
    window.scrollTo(0,0);
    fn(app, query);
    renderTopbar();
  }
  window.addEventListener('hashchange', renderRoute);

  function renderTopbar(){
    const bar = document.getElementById('topbar');
    if(!bar) return;
    const pref = currentThemePref();
    const icon = pref==='dark' ? '🌙' : pref==='light' ? '☀️' : '🌓';
    const profile = window.ChimorgProfile.getActiveProfile();
    bar.innerHTML = `
      <a class="brand" href="#/home"><span style="font-size:20px;">🧪</span><b>Chimie organique</b></a>
      <div class="actions">
        ${profile ? `<button class="icon-btn" id="profileBtn" title="Changer d'étudiant" aria-label="Changer d'étudiant" style="width:auto;border-radius:20px;padding:0 12px;font-size:12.5px;font-family:'IBM Plex Mono',monospace;gap:6px;display:flex;align-items:center;">🙋 ${esc(profile.name)}</button>` : ''}
        <button class="icon-btn" id="themeBtn" title="Thème : ${esc(pref)}" aria-label="Changer de thème">${icon}</button>
      </div>`;
    document.getElementById('themeBtn').addEventListener('click', ()=>{ cycleTheme(); renderTopbar(); });
    const profileBtn = document.getElementById('profileBtn');
    if(profileBtn) profileBtn.addEventListener('click', ()=>{
      // Non destructif : la progression du profil reste enregistrée, on
      // revient simplement à la porte d'identification (pas de confirm()
      // natif, peu fiable selon le contexte du navigateur).
      window.ChimorgProfile.clearActiveProfile();
      navigate('#/home');
      renderRoute();
    });
  }

  window.ChimorgApp = {
    esc, normalizeAnswer, molFigure, molFormula, allQuestions, buildDeck,
    loadItems, saveItems, getRecord, reviewItem, loadSessions, logSession,
    exportProgress, importProgress,
    route, navigate, renderRoute, parseHash, renderTopbar
  };
})();
