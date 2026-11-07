/*
 * Moteur de correction. Une seule fonction d'entrée, gradeQuestion(q, answer),
 * utilisée pour le diagnostic initial, les exercices d'activité et les
 * diagnostics de sortie. Testé unitairement dans tests/index.html.
 *
 * Retourne { fraction: 0..1, correct: boolean, correctSelected, incorrectSelected }.
 * - type 'single' / 'numeric' : fraction vaut 0 ou 1.
 * - type 'multi' (cases à cocher, plusieurs bonnes réponses) : le barème ne
 *   donne jamais le maximum si une proposition fausse est également cochée
 *   (cf. cahier des charges, partie 8) : fraction = max(0, (bonnes cochées -
 *   mauvaises cochées) / nombre de bonnes réponses). `correct` (crédit plein)
 *   exige une correspondance exacte avec l'ensemble des bonnes réponses.
 */
(function(){

  function gradeSingle(q, answer){
    const correct = Number(answer) === Number(q.correct);
    return { fraction: correct ? 1 : 0, correct };
  }

  function gradeMulti(q, answer){
    const chosen = Array.isArray(answer) ? answer.map(Number) : [];
    const correctSet = new Set(q.correct.map(Number));
    const chosenSet = new Set(chosen);
    let correctSelected = 0, incorrectSelected = 0;
    chosenSet.forEach(v => { if (correctSet.has(v)) correctSelected++; else incorrectSelected++; });
    const fraction = correctSet.size === 0 ? 0 : Math.max(0, (correctSelected - incorrectSelected) / correctSet.size);
    const correct = correctSelected === correctSet.size && incorrectSelected === 0 && chosenSet.size === correctSet.size;
    return { fraction, correct, correctSelected, incorrectSelected };
  }

  function numericTolOk(value, reponse, tolerance){
    if (!Number.isFinite(value)) return false;
    if (!tolerance || tolerance.type === 'abs'){
      const tol = tolerance ? tolerance.value : 0;
      return Math.abs(value - reponse) <= tol + 1e-9;
    }
    if (tolerance.type === 'pct'){
      const tol = Math.abs(reponse) * (tolerance.value / 100);
      return Math.abs(value - reponse) <= tol + 1e-9;
    }
    return value === reponse;
  }

  function gradeNumeric(q, answer){
    const value = typeof answer === 'number' ? answer : parseFloat(String(answer).replace(',', '.'));
    const correct = numericTolOk(value, q.reponse, q.tolerance);
    return { fraction: correct ? 1 : 0, correct };
  }

  function gradeQuestion(q, answer){
    if (q.type === 'single') return gradeSingle(q, answer);
    if (q.type === 'multi') return gradeMulti(q, answer);
    if (q.type === 'numeric') return gradeNumeric(q, answer);
    throw new Error('Type de question inconnu : ' + q.type);
  }

  window.GradingEngine = { gradeQuestion, gradeSingle, gradeMulti, gradeNumeric, numericTolOk };
})();
