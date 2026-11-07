/*
 * Composants d'interface partagés pour les questions (QCM choix unique,
 * cases à cocher, saisie numérique). Utilise des <input type=radio|checkbox>
 * natifs (accessibles au clavier, pas seulement distingués par la couleur :
 * cf. cahier des charges, partie 8) plutôt que des <div> cliquables.
 */
(function(){

  function escapeXml(s){
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function figureHtml(q){
    if (!q.figureMol) return '';
    return window.MoleculeView.figureHtml(q.figureMol, q.enonce.slice(0, 40) + '…');
  }

  function optionsHtml(q, name, type){
    return q.options.map((opt, i) => `
      <label class="q-opt-input">
        <input type="${type}" name="${name}" value="${i}">
        <span>${escapeXml(opt)}</span>
      </label>`).join('');
  }

  function readAnswer(form, q, name){
    if (q.type === 'single'){
      const el = form.querySelector(`input[name="${name}"]:checked`);
      return el ? Number(el.value) : null;
    }
    if (q.type === 'multi'){
      return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map(el => Number(el.value));
    }
    if (q.type === 'numeric'){
      const el = form.querySelector(`input[name="${name}"]`);
      const v = el.value.trim().replace(',', '.');
      return v === '' ? null : parseFloat(v);
    }
    return null;
  }

  function hasAnswer(answer, q){
    if (q.type === 'multi') return Array.isArray(answer) && answer.length > 0;
    return answer !== null && answer !== undefined && !(typeof answer === 'number' && isNaN(answer));
  }

  /* Un seul bloc de question, pour un formulaire de diagnostic (pas de retour immédiat). */
  function renderFormQuestion(q, index){
    const name = 'q-' + q.id;
    let inputHtml = '';
    if (q.type === 'single') inputHtml = optionsHtml(q, name, 'radio');
    else if (q.type === 'multi') inputHtml = optionsHtml(q, name, 'checkbox');
    else if (q.type === 'numeric') inputHtml = `<div class="form-row"><input type="text" inputmode="decimal" name="${name}" placeholder="Valeur numérique"><span class="m-meta">${escapeXml(q.unite || '')}</span></div>`;
    const tag = q.type === 'multi' ? '<span class="q-tag cat-b">Plusieurs réponses possibles</span>' : '';
    return `
      <div class="card q-block" data-qid="${q.id}">
        <div class="q-head"><p class="q-title">${index + 1}. ${escapeXml(q.enonce)}</p>${tag}</div>
        ${figureHtml(q)}
        <div class="q-form-body">${inputHtml}</div>
      </div>`;
  }

  /*
   * Rend un formulaire complet de diagnostic (toutes les questions, aucune
   * correction affichée). onSubmit(answers) reçoit { qid: answer }.
   */
  function renderDiagnosticForm(container, questions, onSubmit, submitLabel){
    const form = document.createElement('form');
    form.className = 'rmn-diag-form';
    form.innerHTML = questions.map((q, i) => renderFormQuestion(q, i)).join('') +
      `<div class="diag-submit-row">
         <p class="m-meta diag-missing-note" style="display:none;">Merci de répondre à toutes les questions avant de valider.</p>
         <button type="submit" class="btn primary">${submitLabel || 'Valider mes réponses'}</button>
       </div>`;
    container.innerHTML = '';
    container.appendChild(form);

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const answers = {};
      let missing = false;
      questions.forEach(q => {
        const a = readAnswer(form, q, 'q-' + q.id);
        answers[q.id] = a;
        if (!hasAnswer(a, q)) missing = true;
      });
      if (missing){
        form.querySelector('.diag-missing-note').style.display = 'block';
        return;
      }
      onSubmit(answers);
    });
    return form;
  }

  /*
   * Rend UN exercice en mode « entraînement » (approche socratique) :
   * mauvaise réponse -> indice -> nouvelle tentative -> (répété) -> explication.
   * onComplete({correct, attempts, hintsUsed}) est appelé quand l'étudiante
   * passe à la suite (bonne réponse, ou explication affichée après épuisement
   * des indices).
   */
  function renderPracticeExercise(container, ex, onComplete){
    let attempts = 0, hintsShown = 0, done = false;
    const name = 'ex-' + ex.id;

    function paint(){
      let inputHtml = '';
      if (ex.type === 'single') inputHtml = optionsHtml(ex, name, 'radio');
      else if (ex.type === 'multi') inputHtml = optionsHtml(ex, name, 'checkbox');
      else if (ex.type === 'numeric') inputHtml = `<div class="form-row"><input type="text" inputmode="decimal" name="${name}" placeholder="Valeur numérique"><span class="m-meta">${escapeXml(ex.unite || '')}</span></div>`;

      container.innerHTML = `
        <div class="card q-block">
          <div class="q-head"><p class="q-title">${escapeXml(ex.enonce)}</p></div>
          ${figureHtml(ex)}
          <div class="q-form-body">${inputHtml}</div>
          <div class="practice-feedback" aria-live="polite"></div>
          <div class="practice-actions">
            <button type="button" class="btn primary practice-check">Vérifier ma réponse</button>
            <button type="button" class="btn ghost practice-hint" ${(!ex.indices || ex.indices.length === 0) ? 'disabled' : ''}>💡 Indice</button>
          </div>
        </div>`;

      container.querySelector('.practice-check').addEventListener('click', onCheck);
      container.querySelector('.practice-hint').addEventListener('click', onHint);
    }

    function onHint(){
      if (!ex.indices || hintsShown >= ex.indices.length) return;
      const fb = container.querySelector('.practice-feedback');
      hintsShown++;
      const div = document.createElement('div');
      div.className = 'hint-box';
      div.textContent = '💡 ' + ex.indices[hintsShown - 1];
      fb.appendChild(div);
      if (hintsShown >= ex.indices.length) container.querySelector('.practice-hint').disabled = true;
    }

    function onCheck(){
      const form = container;
      const answer = readAnswer(form, ex, name);
      if (!hasAnswer(answer, ex)) return;
      attempts++;
      const result = window.GradingEngine.gradeQuestion(ex, answer);
      const fb = container.querySelector('.practice-feedback');

      if (result.correct){
        done = true;
        fb.innerHTML = `<div class="hint-box" style="border-color:var(--moss);background:#EAF0DF;">✓ Bonne réponse.</div>
          <div class="reco"><b>Explication</b><br>${escapeXml(ex.explication)}</div>`;
        container.querySelectorAll('input').forEach(i => i.disabled = true);
        container.querySelector('.practice-check').disabled = true;
        const next = document.createElement('button');
        next.type = 'button'; next.className = 'btn primary'; next.style.marginTop = '10px';
        next.textContent = 'Continuer →';
        next.addEventListener('click', () => onComplete({ correct: true, attempts, hintsUsed: hintsShown }));
        fb.appendChild(next);
      } else {
        const exhausted = !ex.indices || hintsShown >= ex.indices.length;
        if (exhausted || attempts >= 2){
          fb.innerHTML = `<div class="hint-box" style="border-color:var(--rust);background:#F6E4DA;">✗ Ce n'est pas la bonne réponse.</div>
            <div class="reco"><b>Explication</b><br>${escapeXml(ex.explication)}</div>`;
          container.querySelectorAll('input').forEach(i => i.disabled = true);
          container.querySelector('.practice-check').disabled = true;
          const next = document.createElement('button');
          next.type = 'button'; next.className = 'btn primary'; next.style.marginTop = '10px';
          next.textContent = 'Continuer →';
          next.addEventListener('click', () => onComplete({ correct: false, attempts, hintsUsed: hintsShown }));
          fb.appendChild(next);
        } else {
          let msg = `<div class="hint-box" style="border-color:var(--rust);background:#F6E4DA;">✗ Ce n'est pas la bonne réponse. Essaie encore.</div>`;
          fb.innerHTML = msg;
          if (ex.indices && hintsShown < ex.indices.length) onHint();
        }
      }
    }

    paint();
  }

  window.QuestionUI = { renderDiagnosticForm, renderPracticeExercise, readAnswer, hasAnswer, escapeXml };
})();
