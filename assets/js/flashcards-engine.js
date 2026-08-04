/*
 * Moteur flashcards générique : recto/verso, notation À revoir/Correct/Facile,
 * mode "réviser seulement les cartes à revoir". Factorisé depuis le module pilote.
 * Contrat attendu : module.flashcards: [{id, recto, verso, notion}]
 *
 * Répétition espacée (SM-2 simplifié) : chaque note stocke aussi {interval, ease, dueDate}
 * (dueDate au format 'YYYY-MM-DD', date locale). Le mode "à revoir" affiche les cartes
 * jamais notées + les cartes dont dueDate est aujourd'hui ou passée. Une carte ancienne
 * sans dueDate (enregistrée avant l'ajout de ce mécanisme) reste visible par défaut.
 */
(function(){
  function esc(s){ return (s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  function todayStr(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function dueDateAfter(days){
    const d = new Date(); d.setDate(d.getDate()+days);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function isDue(rec, today){
    if(!rec) return true;
    if(!rec.dueDate) return true;
    return rec.dueDate <= today;
  }
  function scheduleNext(prev, rating){
    let interval = prev?.interval || 0;
    let ease = prev?.ease || 2.5;
    if(rating==='again'){ interval = 0; ease = Math.max(1.3, ease-0.2); }
    else if(rating==='good'){ interval = interval===0 ? 1 : interval===1 ? 6 : Math.round(interval*ease); }
    else if(rating==='easy'){ ease += 0.15; interval = interval===0 ? 4 : Math.round(interval*ease*1.3); }
    return { interval, ease, dueDate: dueDateAfter(interval) };
  }

  function deck(mod, state){
    const today = todayStr();
    return state.flashOnlyDue
      ? mod.flashcards.filter(f => isDue(state.progress.flashcards[f.id], today))
      : mod.flashcards;
  }
  function masteredCount(mod, state){
    return Object.values(state.progress.flashcards).filter(v=>(v.interval||0)>=6).length;
  }

  function render(target, mod, state, persist){
    const d = deck(mod, state);
    if(d.length===0){
      target.innerHTML = `<p class="empty">Aucune carte "à revoir" pour l'instant — bien joué. <button class="btn ghost" id="allCards">Revoir tout le paquet</button></p>`;
      target.querySelector('#allCards').addEventListener('click', ()=>{ state.flashOnlyDue=false; state.flashIndex=0; render(target, mod, state, persist); });
      return;
    }
    if(state.flashIndex >= d.length) state.flashIndex = 0;
    const card = d[state.flashIndex];
    const mastered = masteredCount(mod, state);

    let html = `
    <p class="flash-progress">Carte ${state.flashIndex+1}/${d.length} · ${mastered}/${mod.flashcards.length} maîtrisées
      ${state.flashOnlyDue ? ' · mode "à revoir"' : ''}
    </p>
    <div class="flashcard" id="flashcard">
      <span class="side-label">${state.flashFlipped ? 'Définition' : 'Notion'}</span>
      ${esc(state.flashFlipped ? card.verso : card.recto)}
    </div>`;
    if(!state.flashFlipped){
      html += `<button class="btn primary" id="flipBtn" style="width:100%;">Retourner la carte</button>`;
    } else {
      html += `<div class="flash-actions">
        <button class="btn again" data-rate="again">À revoir</button>
        <button class="btn good" data-rate="good">Correct</button>
        <button class="btn easy" data-rate="easy">Facile</button>
      </div>`;
    }
    html += `<div style="margin-top:14px;">
      <button class="btn ghost" id="toggleDue">${state.flashOnlyDue ? 'Voir tout le paquet' : 'Réviser seulement les cartes "à revoir"'}</button>
    </div>`;

    target.innerHTML = html;
    MathRender.render(target);
    const flipBtn = target.querySelector('#flipBtn');
    if(flipBtn) flipBtn.addEventListener('click', ()=>{ state.flashFlipped=true; render(target, mod, state, persist); });
    target.querySelectorAll('[data-rate]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const prev = state.progress.flashcards[card.id];
        const sched = scheduleNext(prev, b.dataset.rate);
        state.progress.flashcards[card.id] = {rating:b.dataset.rate, lastSeen:new Date().toISOString(), ...sched};
        await persist();
        state.flashFlipped=false;
        state.flashIndex++;
        render(target, mod, state, persist);
      });
    });
    target.querySelector('#toggleDue').addEventListener('click', ()=>{
      state.flashOnlyDue = !state.flashOnlyDue; state.flashIndex=0; state.flashFlipped=false;
      render(target, mod, state, persist);
    });
  }

  window.FlashcardsEngine = { render, masteredCount };
})();
