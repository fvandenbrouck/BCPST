/*
 * Mode 5 — Quiz rapide (cahier des charges §4, mode 5). Mélange QCM,
 * reconnaissance de groupes, définitions, nomenclature et liaisons
 * biologiques. Séries de 5/10/20 questions, score + % + liste des erreurs
 * expliquées + reprise des seules questions ratées. Also sert les CTA
 * « Révisions du jour » et « Réviser mes erreurs » du tableau de bord via
 * ?filter=due / ?filter=errors.
 */
(function(){
  'use strict';
  const { esc, molFigure, molFormula } = ChimorgApp;

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
    return a;
  }
  const normalize = ChimorgApp.normalizeAnswer;
  function sameSet(a,b){
    if(a.length!==b.length) return false;
    const sa=[...a].sort(), sb=[...b].sort();
    return sa.every((v,i)=>v===sb[i]);
  }

  function render(container, query){
    const all = ChimorgApp.allQuestions();
    const byId = {}; all.forEach(q=>byId[q.id]=q);

    if(query.filter === 'due' || query.filter === 'errors'){
      const items = ChimorgApp.loadItems();
      let ids;
      if(query.filter === 'due') ids = Object.keys(items).filter(id=>items[id].shown>0 && ChimorgSRS.isDue(items[id]));
      else ids = Object.keys(items).filter(id=>items[id].wrong>0);
      const pool = ids.map(id=>byId[id]).filter(Boolean);
      if(pool.length===0){
        container.innerHTML = `
          <a class="back-link" href="#/home">← Retour à l'accueil</a>
          <div class="card"><h3>${query.filter==='due' ? 'Révisions du jour' : 'Réviser mes erreurs'}</h3>
          <p class="empty">${query.filter==='due' ? "Aucune révision due aujourd'hui — bravo, tu es à jour !" : "Aucune erreur enregistrée pour l'instant : tu n'as encore rien raté, bravo !"}</p>
          <a class="btn primary" href="#/mode/quiz">Lancer un quiz classique</a></div>`;
        return;
      }
      startQuiz(container, shuffle(pool).slice(0, Math.min(20,pool.length)), query.filter==='due'?'Révisions du jour':'Réviser mes erreurs');
      return;
    }

    container.innerHTML = `
      <a class="back-link" href="#/home">← Retour à l'accueil</a>
      <div class="module-head"><h1>Quiz rapide</h1><p class="mol-caption" style="text-align:left;">QCM, reconnaissance, définitions, nomenclature et liaisons biologiques mélangés.</p></div>
      <div class="btn-row">
        <button class="btn primary" data-n="5">5 questions</button>
        <button class="btn primary" data-n="10">10 questions</button>
        <button class="btn primary" data-n="20">20 questions</button>
      </div>`;
    container.querySelectorAll('[data-n]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const n = parseInt(b.dataset.n,10);
        startQuiz(container, shuffle(all).slice(0, Math.min(n, all.length)), 'Quiz rapide');
      });
    });
  }

  function startQuiz(container, pool, label){
    const state = { pool, index:0, submitted:false, selected:null, selectedSet:new Set(), textValue:'', results:[] };
    draw();

    function draw(){
      if(state.index >= state.pool.length){
        const score = state.results.filter(r=>r.ok).length;
        const wrong = state.results.filter(r=>!r.ok);
        ChimorgApp.logSession(label, score, state.pool.length);
        let html = `
          <a class="back-link" href="#/home">← Retour à l'accueil</a>
          <div class="result-banner"><div class="score">${score}/${state.pool.length}</div>
            <p>${Math.round(score/state.pool.length*100)}% de réussite — ${esc(label)}</p></div>`;
        if(wrong.length){
          html += `<p class="section-title">Questions à revoir</p>`;
          wrong.forEach(r=>{
            html += `<div class="card"><p class="q-title">${esc(r.q.question)}</p>
              <p class="mol-caption" style="text-align:left;">Ta réponse : ${esc(r.given)}</p>
              <p>Réponse attendue : <b>${esc(r.correctText)}</b></p>
              <p>${esc(r.q.explanation)}</p></div>`;
          });
          html += `<button class="btn primary block" id="retryWrong">Refaire uniquement les questions ratées (${wrong.length})</button>`;
        }
        html += `<button class="btn block" id="newQuiz" style="margin-top:10px;">Nouveau quiz</button>`;
        container.innerHTML = html;
        const retryBtn = container.querySelector('#retryWrong');
        if(retryBtn) retryBtn.addEventListener('click', ()=> startQuiz(container, wrong.map(r=>r.q), label+' (reprise des erreurs)'));
        container.querySelector('#newQuiz').addEventListener('click', ()=> ChimorgApp.renderRoute());
        return;
      }

      const q = state.pool[state.index];
      let html = `
        <a class="back-link" href="#/home">← Retour à l'accueil</a>
        <div class="module-head"><h1>${esc(label)}</h1></div>
        <p class="progress-tag">Question ${state.index+1}/${state.pool.length} · <span class="q-tag">${typeLabel(q.type)}</span></p>
        <p class="q-title">${esc(q.question)}</p>`;
      if(q.structure) html += molFigure(q.structure, 'molécule');
      else if(q.formula) html += molFormula(q.formula);

      if(q.type === 'recognition'){
        html += renderRecognition(q, state);
      } else if(q.type === 'nomenclature'){
        html += renderNomenclature(q, state);
      } else {
        html += renderQcm(q, state);
      }
      container.innerHTML = html;
      wire(q, state);
    }

    function typeLabel(t){
      return { qcm:'QCM', recognition:'Reconnaissance', definition:'Définition', nomenclature:'Nomenclature', liaison:'Liaison biologique' }[t] || t;
    }

    function renderQcm(q, st){
      let html = '';
      (q.options||[]).forEach((opt,i)=>{
        let cls = 'q-opt';
        if(st.submitted){
          if(i===q.answer) cls += ' correct';
          else if(i===st.selected) cls += ' incorrect';
        } else if(st.selected===i) cls += ' selected';
        html += `<button class="${cls}" data-opt="${i}" ${st.submitted?'disabled':''}>${esc(opt)}</button>`;
      });
      if(!st.submitted) html += `<button class="btn primary block" id="submitBtn" ${st.selected===null?'disabled':''}>Valider</button>`;
      else html += feedbackBlock(q, st.selected===q.answer, q.options[q.answer]) + `<button class="btn primary block" id="nextBtn">Question suivante</button>`;
      return html;
    }

    function renderRecognition(q, st){
      const groups = window.CHIMORG_RECOGNITION_GROUPS;
      let html = '<div class="check-list">';
      groups.forEach(g=>{
        const checked = st.selectedSet.has(g);
        let cls='';
        if(st.submitted){
          const isCorrect = q.answer.includes(g);
          if(isCorrect && checked) cls='correct'; else if(isCorrect && !checked) cls='missed'; else if(!isCorrect && checked) cls='incorrect';
        }
        html += `<label class="check-opt ${cls}"><input type="checkbox" data-g="${esc(g)}" ${checked?'checked':''} ${st.submitted?'disabled':''}> ${esc(g)}</label>`;
      });
      html += '</div>';
      if(!st.submitted) html += `<button class="btn primary block" id="submitBtn" ${st.selectedSet.size===0?'disabled':''}>Valider</button>`;
      else html += feedbackBlock(q, sameSet([...st.selectedSet], q.answer), q.answer.join(', ')) + `<button class="btn primary block" id="nextBtn">Question suivante</button>`;
      return html;
    }

    function renderNomenclature(q, st){
      let html = '';
      if(!st.submitted) html += `<input type="text" class="answer-input" id="answerInput" value="${esc(st.textValue)}" placeholder="nom systématique" autocomplete="off" spellcheck="false">
        <button class="btn primary block" id="submitBtn">Valider</button>`;
      else html += feedbackBlock(q, normalize(st.textValue)===normalize(q.answer), q.answer) + `<button class="btn primary block" id="nextBtn">Question suivante</button>`;
      return html;
    }

    function feedbackBlock(q, ok, correctText){
      return `<div class="answer-feedback ${ok?'ok':'ko'}"><b>${ok?'Exact !':'Pas tout à fait.'}</b> ${esc(q.explanation)}</div>`;
    }

    function wire(q, st){
      container.querySelectorAll('[data-opt]').forEach(b=>{
        b.addEventListener('click', ()=>{ st.selected = parseInt(b.dataset.opt,10); draw(); });
      });
      container.querySelectorAll('[data-g]').forEach(cb=>{
        cb.addEventListener('change', ()=>{
          if(cb.checked) st.selectedSet.add(cb.dataset.g); else st.selectedSet.delete(cb.dataset.g);
          draw();
        });
      });
      const input = container.querySelector('#answerInput');
      if(input){
        input.addEventListener('input', ()=>{ st.textValue = input.value; });
        input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); submit(q, st); } });
        input.focus();
      }
      const submitBtn = container.querySelector('#submitBtn');
      if(submitBtn) submitBtn.addEventListener('click', ()=> submit(q, st));
      const nextBtn = container.querySelector('#nextBtn');
      if(nextBtn) nextBtn.addEventListener('click', ()=>{
        st.index++; st.submitted=false; st.selected=null; st.selectedSet=new Set(); st.textValue=''; draw();
      });
    }

    function submit(q, st){
      st.submitted = true;
      let ok, given, correctText;
      if(q.type === 'recognition'){
        ok = sameSet([...st.selectedSet], q.answer); given = [...st.selectedSet].join(', ')||'(aucune sélection)'; correctText = q.answer.join(', ');
      } else if(q.type === 'nomenclature'){
        ok = normalize(st.textValue)===normalize(q.answer); given = st.textValue||'—'; correctText = q.answer;
      } else {
        ok = st.selected===q.answer; given = q.options[st.selected]||'—'; correctText = q.options[q.answer];
      }
      ChimorgApp.reviewItem(q.id, ok?'good':'again');
      st.results.push({ q, ok, given, correctText });
      draw();
    }
  }

  ChimorgApp.route('mode/quiz', render);
})();
