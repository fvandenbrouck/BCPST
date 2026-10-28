/*
 * Enregistrement de la progression dans localStorage (cahier des charges
 * §2 : aucune base de données distante). Toutes les clés sont préfixées
 * `chimorg:` pour rester isolées du reste du site Strates.
 *
 * Multi-session : un même ordinateur peut être utilisé par plusieurs
 * étudiants (salle de classe). Les clés "globales" (liste des profils,
 * profil actif, thème) restent partagées, mais toute donnée de
 * progression (réponses, répétition espacée, historique des séances) est
 * isolée par profil via get/setScoped, sous la clé
 * `chimorg:p:<slug-du-prénom>:<key>`. Voir js/profile.js pour la gestion
 * des profils eux-mêmes.
 */
(function(){
  'use strict';
  const PREFIX = 'chimorg:';
  let activeScope = null; // slug du profil actif, ou null si aucun

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

  function setScope(slug){ activeScope = slug || null; }
  function getScope(){ return activeScope; }
  function scopedKey(key){
    if(!activeScope) throw new Error('ChimorgStorage: aucun profil actif pour la clé scopée « '+key+' »');
    return 'p:'+activeScope+':'+key;
  }
  function getScoped(key, fallback){ return get(scopedKey(key), fallback); }
  function setScoped(key, value){ set(scopedKey(key), value); }
  function removeScoped(key){ remove(scopedKey(key)); }

  window.ChimorgStorage = {
    get, set, remove, allKeys, PREFIX,
    setScope, getScope, getScoped, setScoped, removeScoped
  };
})();
