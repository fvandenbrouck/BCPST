/*
 * Persistance locale (localStorage, clé 'rmn:state'). Pas de compte, pas de
 * serveur : tout l'état de la session d'apprentissage vit dans le navigateur.
 * État par défaut documenté ci-dessous ; RmnStorage.load()/save() sont
 * synchrones et renvoient toujours un objet valide (jamais null/undefined),
 * y compris si le localStorage est indisponible (mode privé, quota dépassé).
 */
(function(){
  const KEY = 'rmn:state:v1';

  function defaultState(){
    return {
      version: 1,
      diagnosticInitial: { done: false, answers: {}, timestamp: null },
      activites: {},        // { A1: { exercices: { 'a1-ex1': {attempts, correct, hintsUsed} }, completed: bool } }
      diagnosticsSortie: {}, // { D1: { done, answers, timestamp, score } }
      remediation: {},       // { C1: [{timestamp, correct}] }
      evidence: [],           // [{competence, correct, difficulte, source, timestamp}]
      masteryHistory: [],     // [{label, date, globalPct, perCompetence:{C1:lvl,...}}]
      nav: { page: 'accueil' },     // dernière page visitée, pour reprise exacte
      resume: null             // { kind:'diagnostic-initial'|'activite'|'diagnostic-sortie', id, index, partialAnswers }
    };
  }

  function load(){
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // fusion défensive : toute clé manquante (ex. après mise à jour du code) reprend sa valeur par défaut
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      return defaultState();
    }
  }

  function save(state){
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* quota / navigation privée : silencieux */ }
  }

  function reset(){
    try { localStorage.removeItem(KEY); } catch (e) {}
    return defaultState();
  }

  window.RmnStorage = { load, save, reset, defaultState };
})();
