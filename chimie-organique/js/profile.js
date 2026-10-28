/*
 * Profils étudiants (multi-session sur un même appareil/ordinateur partagé).
 * L'identification par prénom est OBLIGATOIRE : tant qu'aucun profil n'est
 * actif, js/app.js affiche cette porte d'entrée à la place de toute route
 * et bloque l'accès au reste de l'application (cf. renderRoute()).
 *
 * Les profils eux-mêmes (liste des prénoms connus sur cet appareil, profil
 * actif) sont des clés globales ; toute donnée de progression est ensuite
 * isolée par profil via ChimorgStorage.*Scoped (voir js/storage.js).
 */
(function(){
  'use strict';
  function esc(s){ return (s==null?'':s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  function slugify(name){
    return (name||'').toString().trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g,'')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }

  function getProfiles(){ return ChimorgStorage.get('profiles', []); }
  function saveProfiles(list){ ChimorgStorage.set('profiles', list); }
  function findProfile(slug){ return getProfiles().find(p=>p.slug===slug) || null; }

  function getActiveProfile(){
    const slug = ChimorgStorage.get('activeProfile', null);
    if(!slug) return null;
    const p = findProfile(slug);
    if(p) ChimorgStorage.setScope(slug);
    return p;
  }

  function activateProfile(slug){
    ChimorgStorage.set('activeProfile', slug);
    ChimorgStorage.setScope(slug);
  }

  function clearActiveProfile(){
    ChimorgStorage.set('activeProfile', null);
    ChimorgStorage.setScope(null);
  }

  // Crée un profil s'il n'existe pas encore (par prénom, insensible aux
  // accents/majuscules), sinon réutilise le profil existant pour éviter les
  // doublons (ex. "Alix" et "alix" partagent le même profil "alix").
  function createOrGetProfile(rawName){
    const name = (rawName||'').toString().trim();
    const slug = slugify(name);
    if(!slug) return null;
    const profiles = getProfiles();
    let profile = profiles.find(p=>p.slug===slug);
    const firstProfileEver = profiles.length === 0;
    if(!profile){
      profile = { name, slug, createdAt: new Date().toISOString() };
      profiles.push(profile);
      saveProfiles(profiles);
      // Migration ponctuelle : si des données de progression existaient déjà
      // sous l'ancien schéma non scopé (tests avant l'ajout des profils), on
      // les rattache au tout premier profil créé plutôt que de les perdre.
      if(firstProfileEver){
        const oldItems = ChimorgStorage.get('items', null);
        const oldSessions = ChimorgStorage.get('sessions', null);
        if(oldItems || oldSessions){
          ChimorgStorage.setScope(slug);
          if(oldItems) ChimorgStorage.setScoped('items', oldItems);
          if(oldSessions) ChimorgStorage.setScoped('sessions', oldSessions);
          ChimorgStorage.remove('items');
          ChimorgStorage.remove('sessions');
        }
      }
    }
    return profile;
  }

  function renderGate(container, onDone){
    let error = '';
    function draw(){
      const profiles = getProfiles().slice().sort((a,b)=>a.name.localeCompare(b.name,'fr'));
      container.innerHTML = `
        <div class="hero">
          <p class="eyebrow">Chimie organique · BCPST 1</p>
          <h1>Qui es-tu ?</h1>
          <p>L'identification par prénom est nécessaire pour suivre ta progression séparément des autres élèves qui utilisent cet ordinateur.</p>
        </div>
        ${profiles.length ? `
          <p class="section-title">Profils déjà utilisés sur cet appareil</p>
          <div class="mode-grid" id="profileList">
            ${profiles.map(p=>`<button class="mode-card" data-slug="${esc(p.slug)}" style="--card-accent:var(--moss);text-align:left;">
              <span class="mc-icon">🙋</span><p class="mc-title">${esc(p.name)}</p><p class="mc-desc">Continuer avec ce profil</p>
            </button>`).join('')}
          </div>` : ''}
        <p class="section-title">${profiles.length ? 'Ou nouveau prénom' : 'Ton prénom'}</p>
        <div class="card">
          <input type="text" class="answer-input" id="nameInput" placeholder="ex. Alix" autocomplete="off" maxlength="40">
          ${error ? `<p class="mol-caption" style="color:var(--bad);text-align:left;">${esc(error)}</p>` : ''}
          <button class="btn primary block" id="startBtn" style="margin-top:8px;">Commencer</button>
        </div>
        <p class="footer-note">Ton prénom reste uniquement sur cet appareil (localStorage), il ne quitte jamais ton navigateur.</p>
      `;
      container.querySelectorAll('[data-slug]').forEach(b=>{
        b.addEventListener('click', ()=>{ activateProfile(b.dataset.slug); onDone(); });
      });
      const input = container.querySelector('#nameInput');
      const startBtn = container.querySelector('#startBtn');
      function submit(){
        const profile = createOrGetProfile(input.value);
        if(!profile){ error = 'Merci de saisir un prénom (lettres uniquement).'; draw(); return; }
        activateProfile(profile.slug);
        onDone();
      }
      startBtn.addEventListener('click', submit);
      input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); submit(); } });
      input.focus();
    }
    draw();
  }

  window.ChimorgProfile = { slugify, getProfiles, findProfile, getActiveProfile, activateProfile, clearActiveProfile, createOrGetProfile, renderGate };
})();
