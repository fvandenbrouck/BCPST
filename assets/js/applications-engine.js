/*
 * Moteur "Applications numériques" (Physique-Chimie, remplace Flashcards, cf. cahier des
 * charges §3.2) : exercices à réponse numérique saisie par l'élève, tolérance, indice de
 * méthode (jamais le résultat), correction détaillée pas à pas après validation.
 *
 * Contrat attendu sur l'objet module :
 *   module.applications: [{
 *     id, difficulty, notion, statement, unit?,
 *     answer,                                  // valeur numérique correcte
 *     tolerance: {type:'pct'|'abs', value},     // ±value% ou ±value dans l'unité de la réponse
 *     methode,                                  // indice de démarche, jamais le résultat
 *     correction: [string, ...]                 // étapes de la correction, affichées après validation
 *   }]
 *
 * Validation groupée (comme le QCM) : l'élève renseigne toutes les réponses puis valide en une
 * fois. Score pondéré par difficulté sur le même principe que qcm-engine.js, mais restitué sous
 * une forme plus légère (pas de diagnostic à 4 paliers ni de stratégie de consolidation détaillée
 * — cf. SYNTHESE_SESSION.md pour la justification de cette simplification volontaire).
 *
 * state.progress.appsAttempts: [{date, score, total, weightedScore}]
 */
(function(){
  function escHtml(s){ return (s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  function parseNum(raw){
    if(raw===undefined || raw===null || raw==='') return NaN;
    return parseFloat((raw+'').trim().replace(',', '.'));
  }

  function withinTolerance(userVal, ex){
    if(isNaN(userVal)) return false;
    const tol = ex.tolerance;
    if(tol.type === 'pct') return Math.abs(userVal - ex.answer) <= Math.abs(ex.answer) * tol.value/100;
    return Math.abs(userVal - ex.answer) <= tol.value;
  }

  function toleranceLabel(ex){
    return ex.tolerance.type === 'pct' ? `± ${ex.tolerance.value} %` : `± ${ex.tolerance.value}${ex.unit ? ' '+ex.unit : ''}`;
  }

  function exerciseBlock(mod, ex, i, submitted, state){
    let h = `<div class="q-block">
      <div class="q-head">
        <p class="q-title">${i+1}. ${escHtml(ex.statement)}</p>
        <span class="q-tag ${ex.difficulty>=3?'cat-b':'cat-a'}">Difficulté ${ex.difficulty}</span>
      </div>`;
    if(ex.methode && !submitted){
      h += `<button class="hint-btn" data-apphint="${ex.id}">${state.appHintsShown[ex.id] ? "Masquer la méthode" : '💡 Voir un indice de méthode'}</button>`;
      if(state.appHintsShown[ex.id]) h += `<div class="hint-box">${escHtml(ex.methode)}</div>`;
    }
    if(!submitted){
      h += `<div class="form-row">
        <input type="text" inputmode="decimal" class="app-input" data-appid="${ex.id}"
          placeholder="Réponse numérique" value="${state.appAnswers[ex.id] !== undefined ? escHtml(state.appAnswers[ex.id]) : ''}">
        <span class="page-tag" style="align-self:center;">${escHtml(ex.unit || 'sans unité')} · tolérance ${toleranceLabel(ex)}</span>
      </div>`;
    } else {
      const userRaw = state.appAnswers[ex.id];
      const userVal = parseNum(userRaw);
      const ok = withinTolerance(userVal, ex);
      h += `<div class="q-opt ${ok?'correct':'incorrect'}" style="cursor:default;">
        Ta réponse : ${userRaw!==undefined && userRaw!=='' ? escHtml(userRaw) : '(vide)'} ${escHtml(ex.unit||'')}
        ${ok ? ' — dans la tolérance ✓' : ` — attendu ${ex.answer}${ex.unit?' '+ex.unit:''} (tolérance ${toleranceLabel(ex)})`}
      </div>`;
      if(ex.methode) h += `<div class="hint-box"><b>Méthode :</b> ${escHtml(ex.methode)}</div>`;
      if(ex.correction && ex.correction.length){
        h += `<div class="reco" style="margin-top:8px;"><b>Correction pas à pas :</b><ol style="margin:6px 0 0;padding-left:18px;">${ex.correction.map(s=>`<li style="margin-bottom:4px;">${s}</li>`).join('')}</ol></div>`;
      }
    }
    h += `</div>`;
    return h;
  }

  function appreciationFor(pct){
    if(pct < 0.5) return "Ces applications demandent encore un peu d'entraînement — relis la méthode de chaque exercice avant de refaire les calculs, rien d'inquiétant à ce stade.";
    if(pct < 0.8) return "Bon niveau général : la méthode est comprise, il reste quelques applications numériques à fiabiliser.";
    return "Applications numériques maîtrisées — belle rigueur dans les calculs et le choix de la méthode.";
  }

  function render(target, mod, state, persist){
    let html = '';
    const exs = mod.applications;

    if(!state.appSubmitted){
      html += `<p class="flash-progress">${exs.length} exercices à réponse numérique (indice de méthode disponible)</p>`;
      exs.forEach((ex,i)=>{ html += exerciseBlock(mod, ex, i, false, state); });
      const answered = exs.filter(ex => state.appAnswers[ex.id] !== undefined && state.appAnswers[ex.id] !== '').length;
      html += `<button class="btn primary" id="submitApps" ${answered<exs.length?'disabled':''} style="width:100%;">
        Valider (${answered}/${exs.length} répondues)</button>`;
    } else {
      const weightSum = exs.reduce((acc,ex)=>acc+ex.difficulty, 0);
      let wScore = 0, score = 0;
      exs.forEach(ex=>{
        const ok = withinTolerance(parseNum(state.appAnswers[ex.id]), ex);
        if(ok){ score++; wScore += ex.difficulty; }
      });
      const pct = wScore/weightSum;
      const pctGlobal = Math.round(pct*100);

      const attempts = state.progress.appsAttempts;
      const prevAttempt = attempts.length>1 ? attempts[attempts.length-2] : null;
      let trend = '';
      if(prevAttempt && typeof prevAttempt.weightedScore === 'number'){
        const delta = pctGlobal - prevAttempt.weightedScore;
        if(delta >= 5) trend = `Tu progresses par rapport à ta dernière tentative (+${delta} points).`;
        else if(delta <= -5) trend = `Score un peu plus bas que la dernière fois : normal d'osciller d'une session à l'autre.`;
      }

      html += `<div class="qcm-result">
        <div class="score">${pctGlobal}%</div>
        <p style="margin:2px 0 0;font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--ink-soft);">${score}/${exs.length} réponses dans la tolérance (score pondéré par la difficulté)</p>
        <div class="reco">${appreciationFor(pct)}</div>
        ${trend ? `<div class="reco" style="margin-top:8px;">${trend}</div>` : ''}
      </div>`;
      exs.forEach((ex,i)=>{ html += exerciseBlock(mod, ex, i, true, state); });
      html += `<button class="btn primary" id="retryApps" style="width:100%;">Refaire ces applications</button>`;
    }

    target.innerHTML = html;
    MathRender.render(target);

    target.querySelectorAll('[data-apphint]').forEach(b=>{
      b.addEventListener('click', ()=>{
        state.appHintsShown[b.dataset.apphint] = !state.appHintsShown[b.dataset.apphint];
        render(target, mod, state, persist);
      });
    });

    if(!state.appSubmitted){
      target.querySelectorAll('.app-input').forEach(inp=>{
        inp.addEventListener('input', ()=>{
          state.appAnswers[inp.dataset.appid] = inp.value;
          const exs2 = mod.applications;
          const answered = exs2.filter(ex => state.appAnswers[ex.id] !== undefined && state.appAnswers[ex.id] !== '').length;
          const btn = target.querySelector('#submitApps');
          if(btn){ btn.disabled = answered < exs2.length; btn.textContent = `Valider (${answered}/${exs2.length} répondues)`; }
        });
      });
      const submitBtn = target.querySelector('#submitApps');
      if(submitBtn) submitBtn.addEventListener('click', async ()=>{
        state.appSubmitted = true;
        const weightSum = exs.reduce((acc,ex)=>acc+ex.difficulty, 0);
        let wScore = 0, score = 0;
        exs.forEach(ex=>{
          const ok = withinTolerance(parseNum(state.appAnswers[ex.id]), ex);
          if(ok){ score++; wScore += ex.difficulty; }
        });
        const weightedScore = Math.round(wScore/weightSum*100);
        state.progress.appsAttempts.push({date:new Date().toISOString(), score, total:exs.length, weightedScore});
        await persist();
        render(target, mod, state, persist);
      });
    } else {
      target.querySelector('#retryApps').addEventListener('click', ()=>{
        state.appAnswers={}; state.appSubmitted=false; state.appHintsShown={};
        render(target, mod, state, persist);
      });
    }
  }

  window.ApplicationsEngine = { render };
})();
