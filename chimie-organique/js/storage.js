/*
 * Enregistrement de la progression dans localStorage (cahier des charges
 * §2 : aucune base de données distante). Toutes les clés sont préfixées
 * `chimorg:` pour rester isolées du reste du site Strates.
 */
(function(){
  'use strict';
  const PREFIX = 'chimorg:';

  function get(key, fallback){
    try{
      const raw = localStorage.getItem(PREFIX + key);
      if(raw === null) return fallback;
      return JSON.parse(raw);
    }catch(e){ return fallback; }
  }
  function set(key, value){
    try{ localStorage.setItem(PREFIX + key, JSON.stringify(value)); }catch(e){}
  }
  function remove(key){ try{ localStorage.removeItem(PREFIX + key); }catch(e){} }

  function allKeys(){
    const out = [];
    try{
      for(let i=0;i<localStorage.length;i++){
        const k = localStorage.key(i);
        if(k && k.indexOf(PREFIX)===0) out.push(k.slice(PREFIX.length));
      }
    }catch(e){}
    return out;
  }

  window.ChimorgStorage = { get, set, remove, allKeys, PREFIX };
})();
