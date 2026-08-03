/*
 * Moteur QCM générique : rendu, score pondéré par difficulté, diagnostic à 4 paliers,
 * indices de méthode, comparaison à la tentative précédente.
 * Factorisé depuis le module pilote (Ch.5 — Datation relative) pour être réutilisé
 * par tous les modules SVT (et, plus tard, adapté aux onglets d'évaluation PC/Maths).
 *
 * Contrat attendu sur l'objet module :
 *   module.qcm: [{id, type, difficulty, notion, q, options, correct, hint?, image?}]
 *   image (optionnel) : {src, alt, credit?} — illustration affichée au-dessus de la
 *     question quand elle apporte une réelle plus-value (photo d'un objet réel,
 *     schéma d'un scénario fictif décrit dans l'énoncé...). `credit` est affiché en
 *     petit sous l'image (obligatoire pour toute photo externe sous licence CC ;
 *     omis pour les schémas originaux dessinés pour le site).
 *   module.qcmMeta: {
 *     order: [typeA, typeB],                       // ex. ['connaissance','raisonnement']
 *     labels: {[type]: 'Connaissance'},             // libellé du badge par question
 *     words:  {[type]: 'connaissances'}             // forme utilisée dans les phrases de diagnostic
 *   }
 *   module.diagnostic: {
 *     unitNames: {[notion]: 'Unité X — ... (p.NN)'},
 *     bilanPage, exosPage, bacPage,
 *     nextStep: "Enchaîne sur le chapitre suivant ..."
 *   }
 */
(function(){
  function esc(s){ return (s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  // Mélange l'ordre d'affichage des options de chaque question, pour que la bonne
  // réponse ne se retrouve pas systématiquement à la même position (indépendant de
  // l'ordre dans lequel les options sont écrites dans les données du module).
  function ensureOptionOrder(mod, state){
    if(!state.qcmOptionOrder) state.qcmOptionOrder = {};
    mod.qcm.forEach(q=>{
      if(state.qcmOptionOrder[q.id]) return;
      const idx = q.options.map((_,i)=>i);
      for(let i=idx.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [idx[i],idx[j]] = [idx[j],idx[i]];
      }
      state.qcmOptionOrder[q.id] = idx;
    });
  }

  function questionBlock(mod, q, i, submitted, state){
    const meta = mod.qcmMeta;
    const isB = q.type === meta.order[1];
    const order = state.qcmOptionOrder[q.id];
    let h = `<div class="q-block">
      <div class="q-head">
        <p class="q-title">${i+1}. ${esc(q.q)}</p>
        <span class="q-tag ${isB?'cat-b':'cat-a'}">${esc(meta.labels[q.type])}</span>
      </div>`;
    if(q.image){
      h += `<figure class="q-figure">
        <img src="${q.image.src}" alt="${esc(q.image.alt)}" loading="lazy">
        ${q.image.credit ? `<figcaption>${esc(q.image.credit)}</figcaption>` : ''}
      </figure>`;
    }
    if(q.hint && !submitted){
      h += `<button class="hint-btn" data-hint="${q.id}">${state.hintsShown[q.id] ? "Masquer l'indice" : '💡 Voir un indice'}</button>`;
      if(state.hintsShown[q.id]) h += `<div class="hint-box">${esc(q.hint)}</div>`;
    }
    if(!submitted){
      h += order.map(oi=>`<button class="q-opt ${state.qcmAnswers[q.id]===oi?'selected':''}" data-qid="${q.id}" data-oi="${oi}">${esc(q.options[oi])}</button>`).join('');
    } else {
      h += order.map(oi=>{
        let cls='q-opt';
        if(oi===q.correct) cls+=' correct';
        else if(state.qcmAnswers[q.id]===oi) cls+=' incorrect';
        return `<div class="${cls}">${esc(q.options[oi])}</div>`;
      }).join('');
      if(q.hint) h += `<div class="hint-box"><b>Piste de raisonnement :</b> ${esc(q.hint)}</div>`;
    }
    h += `</div>`;
    return h;
  }

  function buildDiagnostic(mod, pctA, pctB, wrongNotions, prevAttempt, pctGlobal){
    const meta = mod.qcmMeta, d = mod.diagnostic;
    const wordA = meta.words[meta.order[0]], wordB = meta.words[meta.order[1]];
    let appreciation, steps;

    if(pctA < 0.5){
      appreciation = `Les bases de ce module demandent encore un peu de travail — c'est tout à fait normal pour un premier passage sur une notion. Rien d'inquiétant, tu as le temps de consolider avant la rentrée.`;
      steps = [
        `Relis les fiches de cours ci-dessus (${mod.pages})`,
        `Relis le <b>Bilan p.${d.bilanPage}</b> — apprends les mots-clés par cœur`,
        `Refais toutes les cartes, même celles déjà réussies`,
        `Reviens sur ce QCM dans un jour ou deux`
      ];
    } else if(pctB < 0.5){
      appreciation = `Les ${wordA} sont bien installées, c'est l'essentiel et ça se travaille vite. Ce qui coince, c'est de les mobiliser face à une situation nouvelle — c'est exactement la compétence que la prépa va muscler, donc pas d'inquiétude à avoir, juste un axe de travail clair.`;
      steps = [
        `Relis les indices des questions de ${wordB} ci-dessous, un par un`,
        `Reprends chaque notion sur un exemple différent`,
        `Fais l'<b>Objectif BAC p.${d.bacPage}</b> : c'est exactement ce type d'exercice qui entraîne à combiner plusieurs notions`,
        `Retente ce QCM`
      ];
    } else if(pctA < 0.8 || pctB < 0.8){
      appreciation = `Bon niveau général, la logique du module est comprise. Il reste quelques détails à fixer pour être à l'aise à coup sûr.`;
      steps = [
        `Relis le <b>Bilan p.${d.bilanPage}</b> pour combler les derniers trous`,
        `Fais les <b>exercices du manuel p.${d.exosPage}</b>`,
        `Retente ce QCM pour viser la maîtrise complète`
      ];
    } else {
      appreciation = `Module maîtrisé, sur les ${wordA} comme sur le ${wordB}. Belle régularité — c'est le niveau attendu en entrée de BCPST.`;
      steps = [
        `Fais l'<b>Objectif BAC p.${d.bacPage}</b> pour t'entraîner à la vitesse d'examen`,
        `Ajoute les dernières branches à ta carte mentale, de mémoire`,
        d.nextStep || `Enchaîne sur le module suivant dès qu'il sera prêt.`
      ];
    }

    let trend = '';
    if(prevAttempt && typeof prevAttempt.weightedScore === 'number'){
      const delta = pctGlobal - prevAttempt.weightedScore;
      if(delta >= 5) trend = `Tu progresses par rapport à ta dernière tentative (+${delta} points) — la répétition espacée fait son effet.`;
      else if(delta <= -5) trend = `Score un peu plus bas que la dernière fois : c'est normal d'osciller d'une session à l'autre, la mémorisation se construit par passages répétés, pas en ligne droite.`;
    }

    return {appreciation, steps, trend};
  }

  function render(target, mod, state, persist){
    const meta = mod.qcmMeta, d = mod.diagnostic;
    ensureOptionOrder(mod, state);
    let html = '';

    if(!state.qcmSubmitted){
      const catA = mod.qcm.filter(q=>q.type===meta.order[0]);
      const catB = mod.qcm.filter(q=>q.type===meta.order[1]);
      html += `<p class="flash-progress">${catA.length} questions de ${meta.words[meta.order[0]]} · ${catB.length} questions de ${meta.words[meta.order[1]]} (indice disponible)</p>`;
      mod.qcm.forEach((q,i)=>{ html += questionBlock(mod, q, i, false, state); });
      const answered = Object.keys(state.qcmAnswers).length;
      html += `<button class="btn primary" id="submitQcm" ${answered<mod.qcm.length?'disabled':''} style="width:100%;">
        Valider (${answered}/${mod.qcm.length} répondues)</button>`;
    } else {
      const catA = mod.qcm.filter(q=>q.type===meta.order[0]);
      const catB = mod.qcm.filter(q=>q.type===meta.order[1]);
      const rawScoreOf = qs => qs.reduce((acc,q)=> acc + (state.qcmAnswers[q.id]===q.correct?1:0), 0);
      const weightSum = qs => qs.reduce((acc,q)=> acc + q.difficulty, 0);
      const weightedScoreOf = qs => qs.reduce((acc,q)=> acc + (state.qcmAnswers[q.id]===q.correct ? q.difficulty : 0), 0);

      const scoreA = rawScoreOf(catA), scoreB = rawScoreOf(catB);
      const total = mod.qcm.length, score = scoreA + scoreB;
      const pctA = weightedScoreOf(catA)/weightSum(catA);
      const pctB = weightedScoreOf(catB)/weightSum(catB);
      const pctGlobal = Math.round((weightedScoreOf(catA)+weightedScoreOf(catB)) / (weightSum(catA)+weightSum(catB)) * 100);
      const wrongNotions = mod.qcm.filter(q=>state.qcmAnswers[q.id]!==q.correct).map(q=>q.notion);
      const uniqueWrong = [...new Set(wrongNotions)];

      const attempts = state.progress.qcmAttempts;
      const prevAttempt = attempts.length>1 ? attempts[attempts.length-2] : null;
      const {appreciation, steps, trend} = buildDiagnostic(mod, pctA, pctB, uniqueWrong, prevAttempt, pctGlobal);

      html += `<div class="qcm-result">
        <div class="score">${pctGlobal}%</div>
        <p style="margin:2px 0 0;font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--ink-soft);">${score}/${total} bonnes réponses (score pondéré par la difficulté)</p>
        <p style="margin:4px 0 0;font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--ink-soft);">${esc(meta.labels[meta.order[0]])} ${Math.round(pctA*100)}% · ${esc(meta.labels[meta.order[1]])} ${Math.round(pctB*100)}%</p>
        <div class="reco">${appreciation}</div>
        <div class="reco" style="margin-top:8px;"><b>Stratégie de consolidation :</b><ol style="margin:6px 0 0;padding-left:18px;">${steps.map(s=>`<li style="margin-bottom:4px;">${s}</li>`).join('')}</ol></div>
        ${trend ? `<div class="reco" style="margin-top:8px;">${esc(trend)}</div>` : ''}
        ${uniqueWrong.length ? `<div class="reco" style="margin-top:8px;"><b>Notions à retravailler en priorité :</b><ul style="margin:6px 0 0;padding-left:18px;">${uniqueWrong.map(n=>`<li>${esc(d.unitNames[n]||n)}</li>`).join('')}</ul></div>` : ''}
      </div>`;

      mod.qcm.forEach((q,i)=>{ html += questionBlock(mod, q, i, true, state); });
      html += `<button class="btn primary" id="retryQcm" style="width:100%;">Refaire le QCM</button>`;
    }

    target.innerHTML = html;

    target.querySelectorAll('[data-hint]').forEach(b=>{
      b.addEventListener('click', ()=>{
        state.hintsShown[b.dataset.hint] = !state.hintsShown[b.dataset.hint];
        render(target, mod, state, persist);
      });
    });

    if(!state.qcmSubmitted){
      target.querySelectorAll('.q-opt').forEach(b=>{
        b.addEventListener('click', ()=>{
          state.qcmAnswers[b.dataset.qid] = parseInt(b.dataset.oi);
          render(target, mod, state, persist);
        });
      });
      const submitBtn = target.querySelector('#submitQcm');
      if(submitBtn) submitBtn.addEventListener('click', async ()=>{
        state.qcmSubmitted = true;
        let score=0, wSum=0, wScore=0;
        mod.qcm.forEach(q=>{
          wSum += q.difficulty;
          if(state.qcmAnswers[q.id]===q.correct){ score++; wScore += q.difficulty; }
        });
        const weightedScore = Math.round(wScore/wSum*100);
        state.progress.qcmAttempts.push({date:new Date().toISOString(), score, total:mod.qcm.length, weightedScore});
        await persist();
        render(target, mod, state, persist);
      });
    } else {
      target.querySelector('#retryQcm').addEventListener('click', ()=>{
        state.qcmAnswers={}; state.qcmSubmitted=false; state.hintsShown={}; state.qcmOptionOrder={};
        render(target, mod, state, persist);
      });
    }
  }

  window.QcmEngine = { render };
})();
