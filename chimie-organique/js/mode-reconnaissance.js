/*
 * Mode 3 — Reconnaissance des groupes caractéristiques (cahier des charges
 * §4, mode 3). Sélection multiple, aucune réponse partielle acceptée comme
 * juste. Après validation : la structure reste affichée, accompagnée d'une
 * liste codée par couleur ET par texte (jamais la couleur seule) indiquant
 * les groupes corrects, manqués ou erronés.
 */
(function(){
  'use strict';
  const { esc, molFigure } = ChimorgApp;

  function sameSet(a,b){
    if(a.length!==b.length) return false;
    const sa = [...a].sort(), sb=[...b].sort();
    return sa.every((v,i)=>v===sb[i]);
  }

  function render(container){
    const pool = ChimorgApp.allQuestions().filter(q=>q.type==='recognition');
    const groups = window.CHIMORG_RECOGNITION_GROUPS;
    const state = { order: shuffledIndexes(pool.length), index:0, selected:new Set(), submitted:false, score:0, answered:0 };

    function shuffledIndexes(n){
      const arr = Array.from({length:n}, (_,i)=>i);
      for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
      return arr;
    }

    function draw(){
      if(state.index >= pool.length){
        container.innerHTML = `
          <a class="back-link" href="#/home">← Retour à l'accueil</a>
          <div class="result-banner"><div class="score">${state.score}/${pool.length}</div>
            <p>Série de reconnaissance terminée.</p></div>
          <button class="btn primary block" id="restartBtn">Recommencer la série</button>`;
        ChimorgApp.logSession('Reconnaissance des groupes', state.score, pool.length);
        container.querySelector('#restartBtn').addEventListener('click', ()=>{
          state.order = shuffledIndexes(pool.length); state.index=0; state.selected=new Set();
          state.submitted=false; state.score=0; draw();
        });
        return;
      }
      const q = pool[state.order[state.index]];
      let html = `
        <a class="back-link" href="#/home">← Retour à l'accueil</a>
        <div class="module-head"><h1>Reconnaissance de groupes</h1></div>
        <p class="progress-tag">Molécule ${state.index+1}/${pool.length}</p>
        <p class="q-title">${esc(q.question)}</p>
        ${molFigure(q.structure, 'molécule à analyser')}
        <div class="check-list" style="margin-top:14px;">`;

      groups.forEach(g=>{
        const checked = state.selected.has(g);
        let cls = '';
        if(state.submitted){
          const isCorrect = q.answer.includes(g);
          if(isCorrect && checked) cls = 'correct';
          else if(isCorrect && !checked) cls = 'missed';
          else if(!isCorrect && checked) cls = 'incorrect';
        }
        html += `<label class="check-opt ${cls}"><input type="checkbox" data-g="${esc(g)}" ${checked?'checked':''} ${state.submitted?'disabled':''}> ${esc(g)}${state.submitted && cls==='correct' ? ' ✓' : ''}${state.submitted && cls==='missed' ? ' (manqué)' : ''}${state.submitted && cls==='incorrect' ? ' (incorrect)' : ''}</label>`;
      });
      html += `</div>`;

      if(!state.submitted){
        html += `<button class="btn primary block" id="submitBtn" ${state.selected.size===0?'disabled':''}>Valider</button>`;
      } else {
        const ok = sameSet([...state.selected], q.answer);
        html += `<div class="answer-feedback ${ok?'ok':'ko'}"><b>${ok?'Exact !':'Pas tout à fait.'}</b><br>${esc(q.explanation)}</div>`;
        html += `<button class="btn primary block" id="nextBtn">Molécule suivante</button>`;
      }
      container.innerHTML = html;

      container.querySelectorAll('[data-g]').forEach(cb=>{
        cb.addEventListener('change', ()=>{
          if(cb.checked) state.selected.add(cb.dataset.g); else state.selected.delete(cb.dataset.g);
          const submitBtn = container.querySelector('#submitBtn');
          if(submitBtn) submitBtn.disabled = state.selected.size===0;
        });
      });
      const submitBtn = container.querySelector('#submitBtn');
      if(submitBtn) submitBtn.addEventListener('click', ()=>{
        state.submitted = true;
        const ok = sameSet([...state.selected], q.answer);
        if(ok) state.score++;
        ChimorgApp.reviewItem(q.id, ok?'good':'again');
        draw();
      });
      const nextBtn = container.querySelector('#nextBtn');
      if(nextBtn) nextBtn.addEventListener('click', ()=>{
        state.index++; state.selected = new Set(); state.submitted = false; draw();
      });
    }

    draw();
  }

  ChimorgApp.route('mode/reconnaissance', render);
})();
