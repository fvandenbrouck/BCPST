/*
 * Mode 1 — Flashcards interactives (cahier des charges §4, mode 1).
 * Directions variées générées par ChimorgApp.buildDeck() : famille→groupe,
 * groupe→famille, nom→structure, structure→nom, définition→notion,
 * notion→définition. Autoévaluation à 3 niveaux + répétition espacée.
 */
(function(){
  'use strict';
  const { esc, molFigure, molFormula } = ChimorgApp;
  const MODULE_LABEL = { A:'Module A — Familles', B:'Module B — Vivant', C:'Module C — Nomenclature' };

  function render(container){
    const fullDeck = ChimorgApp.buildDeck();
    const state = { modules:{A:true,B:true,C:true}, onlyDue:false, index:0, flipped:false };

    function deck(){
      const items = ChimorgApp.loadItems();
      let d = fullDeck.filter(c => state.modules[c.module]);
      if(state.onlyDue) d = d.filter(c => { const r = items[c.id]; return !r || !r.shown || ChimorgSRS.isDue(r); });
      return d;
    }
    function masteredCount(d){
      const items = ChimorgApp.loadItems();
      return d.filter(c => items[c.id] && items[c.id].mastery>=4).length;
    }

    function draw(){
      const d = deck();
      if(state.index >= d.length) state.index = 0;
      const card = d[state.index];
      let html = `
        <a class="back-link" href="#/home">← Retour à l'accueil</a>
        <div class="module-head"><h1>Flashcards interactives</h1></div>
        <div class="flash-select">
          ${['A','B','C'].map(m=>`<label><input type="checkbox" data-mod="${m}" ${state.modules[m]?'checked':''}> ${esc(MODULE_LABEL[m])}</label>`).join('')}
          <label><input type="checkbox" id="onlyDue" ${state.onlyDue?'checked':''}> Cartes à revoir uniquement</label>
        </div>`;

      if(d.length === 0){
        html += `<p class="empty">Aucune carte ne correspond à cette sélection.</p>`;
        container.innerHTML = html;
        wireFilters();
        return;
      }

      const mastered = masteredCount(d);
      html += `<p class="flash-progress">Carte ${state.index+1}/${d.length} · ${mastered}/${d.length} maîtrisées${state.onlyDue?' · mode « à revoir »':''}</p>`;
      html += `<div class="flashcard" id="flashcard">
        <span class="side-label">${state.flipped ? 'Réponse' : 'Question'}</span>`;
      if(!state.flipped){
        if(card.rectoImg) html += molFigure(card.rectoImg, 'formule');
        else if(card.rectoFormula) html += molFormula(card.rectoFormula, {small:true});
        html += `<div class="fc-text">${esc(card.recto).replace(/\n/g,'<br>')}</div>`;
      } else {
        if(card.versoImg) html += molFigure(card.versoImg, 'formule');
        else if(card.versoFormula) html += molFormula(card.versoFormula, {small:true});
        html += `<div class="fc-text">${esc(card.verso).replace(/\n/g,'<br>')}</div>`;
      }
      html += `</div>`;
      if(!state.flipped){
        html += `<button class="btn primary block" id="flipBtn">Retourner la carte</button>`;
      } else {
        html += `<div class="flash-actions">
          <button class="btn again" data-rate="again">À revoir</button>
          <button class="btn good" data-rate="good">Difficile</button>
          <button class="btn easy" data-rate="easy">Maîtrisé</button>
        </div>`;
      }
      container.innerHTML = html;

      const flipBtn = container.querySelector('#flipBtn');
      if(flipBtn) flipBtn.addEventListener('click', ()=>{ state.flipped = true; draw(); });
      container.querySelectorAll('[data-rate]').forEach(b=>{
        b.addEventListener('click', ()=>{
          ChimorgApp.reviewItem(card.id, b.dataset.rate);
          state.flipped = false;
          state.index++;
          draw();
        });
      });
      wireFilters();
    }

    function wireFilters(){
      container.querySelectorAll('[data-mod]').forEach(cb=>{
        cb.addEventListener('change', ()=>{ state.modules[cb.dataset.mod] = cb.checked; state.index=0; state.flipped=false; draw(); });
      });
      const onlyDue = container.querySelector('#onlyDue');
      if(onlyDue) onlyDue.addEventListener('change', ()=>{ state.onlyDue = onlyDue.checked; state.index=0; state.flipped=false; draw(); });
    }

    draw();
  }

  ChimorgApp.route('mode/flashcards', render);
})();
