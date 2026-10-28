/*
 * Mode 4 — Exercices de nomenclature (cahier des charges §4, mode 4).
 * 3 niveaux (chaînes simples / ramifications+fonctions simples /
 * polyfonctionnelles). Tolère les différences typographiques (espaces,
 * tirets, accents) mais pas une erreur de numérotation ou un nom
 * chimiquement incorrect : la comparaison se fait sur le texte normalisé,
 * où seuls espaces/tirets/accents/apostrophes sont ignorés — les chiffres
 * (numérotation) restent significatifs. Indice progressif, explication de
 * la démarche après validation.
 */
(function(){
  'use strict';
  const { esc, molFigure, molFormula } = ChimorgApp;

  const normalize = ChimorgApp.normalizeAnswer;

  function render(container){
    const all = window.CHIMORG_NOMENCLATURE.exercises;
    const state = { level:1, order:[], index:0, hintsShown:0, submitted:false, value:'', score:0 };

    function pool(){ return all.filter(e=>e.level===state.level); }
    function shuffle(n){
      const arr = Array.from({length:n}, (_,i)=>i);
      for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
      return arr;
    }
    function resetLevel(lvl){
      state.level = lvl; state.order = shuffle(pool().length); state.index=0; state.hintsShown=0;
      state.submitted=false; state.value=''; state.score=0;
    }
    resetLevel(1);

    function draw(){
      const items = pool();
      if(state.index >= items.length){
        container.innerHTML = `
          <a class="back-link" href="#/home">← Retour à l'accueil</a>
          <div class="result-banner"><div class="score">${state.score}/${items.length}</div>
            <p>Série « niveau ${state.level} » terminée.</p></div>
          <div class="diff-toggle">${[1,2,3].map(l=>`<button data-lvl="${l}" class="${state.level===l?'active':''}">Niveau ${l}</button>`).join('')}</div>
          <button class="btn primary block" id="restartBtn" style="margin-top:10px;">Recommencer ce niveau</button>`;
        ChimorgApp.logSession('Nomenclature niveau '+state.level, state.score, items.length);
        wireLevelButtons();
        container.querySelector('#restartBtn').addEventListener('click', ()=>{ resetLevel(state.level); draw(); });
        return;
      }
      const ex = items[state.order[state.index]];
      let html = `
        <a class="back-link" href="#/home">← Retour à l'accueil</a>
        <div class="module-head"><h1>Exercices de nomenclature</h1></div>
        <div class="diff-toggle">${[1,2,3].map(l=>`<button data-lvl="${l}" class="${state.level===l?'active':''}">Niveau ${l}</button>`).join('')}</div>
        <p class="progress-tag">Molécule ${state.index+1}/${items.length} · niveau ${state.level}</p>
        ${ex.img ? molFigure(ex.img, 'molécule à nommer') : molFormula(ex.formula)}
        <p class="q-title">Donne le nom systématique de cette molécule${ex.formula?' (formule semi-développée)':''}.</p>`;

      if(!state.submitted){
        html += `<input type="text" class="answer-input" id="answerInput" placeholder="ex. but-2-ène" value="${esc(state.value)}" autocomplete="off" autocapitalize="off" spellcheck="false">`;
        if(ex.hints && state.hintsShown < ex.hints.length){
          html += `<button class="hint-btn" id="hintBtn">💡 Indice (${state.hintsShown+1}/${ex.hints.length})</button>`;
        }
        for(let i=0;i<state.hintsShown;i++) html += `<div class="hint-box">${esc(ex.hints[i])}</div>`;
        html += `<button class="btn primary block" id="submitBtn">Valider</button>`;
      } else {
        const ok = normalize(state.value) === normalize(ex.name);
        html += `<div class="answer-feedback ${ok?'ok':'ko'}">
          <b>${ok ? 'Exact !' : 'Pas tout à fait.'}</b><br>
          Nom attendu : <b>${esc(ex.name)}</b>${ok?'':` (ta réponse : « ${esc(state.value)||'—'} »)`}<br><br>
          <b>Démarche :</b> ${esc(ex.explanation)}
        </div>`;
        html += `<button class="btn primary block" id="nextBtn">Molécule suivante</button>`;
      }
      container.innerHTML = html;
      wireLevelButtons();

      const input = container.querySelector('#answerInput');
      if(input){
        input.addEventListener('input', ()=>{ state.value = input.value; });
        input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); submit(ex); } });
        input.focus();
      }
      const hintBtn = container.querySelector('#hintBtn');
      if(hintBtn) hintBtn.addEventListener('click', ()=>{ state.hintsShown++; draw(); });
      const submitBtn = container.querySelector('#submitBtn');
      if(submitBtn) submitBtn.addEventListener('click', ()=> submit(ex));
      const nextBtn = container.querySelector('#nextBtn');
      if(nextBtn) nextBtn.addEventListener('click', ()=>{
        state.index++; state.hintsShown=0; state.submitted=false; state.value=''; draw();
      });
    }

    function submit(ex){
      state.submitted = true;
      const ok = normalize(state.value) === normalize(ex.name);
      if(ok) state.score++;
      ChimorgApp.reviewItem('no:'+ex.id, ok?'good':'again');
      draw();
    }

    function wireLevelButtons(){
      container.querySelectorAll('[data-lvl]').forEach(b=>{
        b.addEventListener('click', ()=>{ resetLevel(parseInt(b.dataset.lvl,10)); draw(); });
      });
    }

    draw();
  }

  ChimorgApp.route('mode/nomenclature', render);
})();
