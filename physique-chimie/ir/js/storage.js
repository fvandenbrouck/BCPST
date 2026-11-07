/*
 * Persistance locale (localStorage, clé 'ir:state'). Espace de noms distinct
 * du module RMN (voir physique-chimie/rmn/js/storage.js, clé 'rmn:state') :
 * les deux modules ne partagent jamais leurs scores de maîtrise ni leur
 * progression, même ouverts dans le même navigateur.
 */
(function(){
  const KEY = 'ir:state:v1';

  function defaultState(){
    return {
      version: 1,
      diagnosticInitial: { done: false, answers: {}, timestamp: null },
      activites: {},
      diagnosticsSortie: {},
      remediation: {},
      evidence: [],
      masteryHistory: [],
      nav: { page: 'accueil' },
      resume: null
    };
  }

  function load(){
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      return defaultState();
    }
  }

  function save(state){
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function reset(){
    try { localStorage.removeItem(KEY); } catch (e) {}
    return defaultState();
  }

  window.IrStorage = { load, save, reset, defaultState };
})();
