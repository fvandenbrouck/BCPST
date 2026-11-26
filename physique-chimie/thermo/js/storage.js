/*
 * Persistance locale (localStorage, clé 'thermo:state:v1'). Espace de noms
 * distinct des modules RMN/IR : aucune donnée ni score n'est partagé.
 */
(function () {
  const KEY = 'thermo:state:v1';

  function defaultState() {
    return {
      version: 1,
      nav: { page: 'accueil' },
      atelier0: {},
      atelier1: {},
      atelier2: { cheminsRetenus: [] },
      atelier3: {},
      atelier4: {}
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    return defaultState();
  }

  window.ThermoStorage = { load, save, reset, defaultState };
})();
