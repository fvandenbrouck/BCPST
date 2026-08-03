/*
 * Wrapper de stockage persistant, même contrat d'API que window.storage
 * (utilisé par le prototype initial dans un artifact Claude.ai) :
 *   await Storage.get(key)        -> {value: string} | null
 *   await Storage.set(key, value) -> void
 * Implémenté ici avec localStorage pour un déploiement autonome (GitHub Pages).
 */
(function(){
  const PREFIX = 'strates:';

  async function get(key){
    try{
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? null : { value: raw };
    }catch(e){ return null; }
  }

  async function set(key, value){
    try{ localStorage.setItem(PREFIX + key, value); }catch(e){}
  }

  window.Storage = { get, set };
})();
