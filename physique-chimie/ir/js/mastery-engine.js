/*
 * Moteur de calcul de la maîtrise. Modèle documenté (et affiché à l'étudiante
 * depuis la page « Tableau de maîtrise », section « Comment ce score est-il
 * calculé ? ») :
 *
 * 1. Chaque question de diagnostic corrigée (diagnostic initial, D1 à D6, ou
 *    remédiation) ajoute une « preuve » : {competence, correct, difficulte,
 *    source, timestamp}. Les exercices d'activité NE produisent PAS de
 *    preuve : réussir un exercice d'entraînement ne suffit jamais, à lui
 *    seul, à faire progresser la maîtrise (principe pédagogique du cahier
 *    des charges) — seule l'évaluation diagnostique qui suit en apporte la
 *    preuve.
 * 2. Pour chaque compétence, seule la SESSION D'ÉVALUATION LA PLUS RÉCENTE
 *    ayant testé cette compétence est prise en compte (pas une moyenne de
 *    tout l'historique) : la maîtrise peut donc stagner ou diminuer si une
 *    évaluation ultérieure révèle une difficulté, conformément au cahier des
 *    charges. Les sessions plus anciennes restent visibles dans l'historique
 *    des progrès, mais ne comptent plus dans le niveau actuel.
 * 3. Dans cette session, on calcule : le taux de réussite (acc), et la
 *    difficulté maximale parmi les questions réussies (maxDiffCorrect).
 *       acc = 0                      -> niveau 0 (non acquis)
 *       0 < acc < 0,5                -> niveau 1 (connaissances élémentaires)
 *       0,5 <= acc < 1                -> niveau 2, ou niveau 3 si maxDiffCorrect >= 3
 *       acc = 1 (sans faute)          -> niveau 3, ou niveau 4 si maxDiffCorrect >= 3
 *    Une réussite parfaite mais uniquement sur des questions faciles
 *    (difficulté 1-2) ne peut donc jamais, à elle seule, valoir le niveau 4 —
 *    conformément au cahier des charges ("la réussite répétée à des
 *    questions élémentaires ne doit pas suffire pour atteindre un niveau 4").
 * 4. Le DIAGNOSTIC INITIAL est un état des lieux, pas une preuve de maîtrise
 *    autonome : le niveau qu'il peut attribuer est plafonné à 2 ("application
 *    guidée"), quel que soit le score obtenu. Seuls les diagnostics de
 *    sortie (D1-D6) ou une remédiation réussie peuvent valider les niveaux 3
 *    et 4.
 * 5. Score global = moyenne pondérée des niveaux des compétences ÉVALUÉES
 *    (poids définis dans data/competences.js, C6/C7 pondérées plus fort),
 *    ramenée à un pourcentage (niveau 4 = 100% pour cette compétence). Les
 *    compétences "non évaluées" ne sont pas comptées dans la moyenne (elles
 *    sont affichées séparément), pour ne jamais confondre absence de donnée
 *    et échec.
 */
(function(){

  function sessionLevel(acc, maxDiffCorrect){
    if (acc <= 0) return 0;
    if (acc < 0.5) return 1;
    if (acc < 1) return maxDiffCorrect >= 3 ? 3 : 2;
    return maxDiffCorrect >= 3 ? 4 : 3;
  }

  function addEvidence(state, records){
    const ts = Date.now();
    records.forEach(r => {
      state.evidence.push({
        competence: r.competence, correct: !!r.correct,
        difficulte: r.difficulte || 1, source: r.source, timestamp: ts
      });
    });
    return ts;
  }

  /* Niveau actuel de chaque compétence (null = non évalué). */
  function computeLevels(state){
    const levels = {};
    window.IR_COMPETENCES.forEach(c => { levels[c.id] = null; });
    window.IR_COMPETENCES.forEach(c => {
      const evid = state.evidence.filter(e => e.competence === c.id).sort((a, b) => b.timestamp - a.timestamp);
      if (evid.length === 0) return;
      const latestTs = evid[0].timestamp;
      const latestSource = evid[0].source;
      const session = evid.filter(e => e.timestamp === latestTs && e.source === latestSource);
      const correctCount = session.filter(e => e.correct).length;
      const acc = correctCount / session.length;
      const maxDiffCorrect = session.filter(e => e.correct).reduce((m, e) => Math.max(m, e.difficulte), 0);
      let level = sessionLevel(acc, maxDiffCorrect);
      if (latestSource === 'initial') level = Math.min(level, 2);
      levels[c.id] = level;
    });
    return levels;
  }

  /* Score global pondéré (0-100), calculé uniquement sur les compétences évaluées. */
  function computeGlobalPct(levels){
    let num = 0, den = 0, evaluated = 0;
    window.IR_COMPETENCES.forEach(c => {
      const lvl = levels[c.id];
      if (lvl === null || lvl === undefined) return;
      evaluated++;
      num += lvl * c.poids;
      den += 4 * c.poids;
    });
    return { pct: den > 0 ? Math.round((num / den) * 100) : null, evaluated, total: window.IR_COMPETENCES.length };
  }

  /* Avancement du parcours : proportion des 6 activités marquées terminées (tous exercices tentés). */
  function computeAvancement(state){
    const total = 6;
    let done = 0;
    for (let n = 1; n <= 6; n++){
      const a = state.activites['A' + n];
      if (a && a.completed) done++;
    }
    return Math.round((done / total) * 100);
  }

  function pushHistoryPoint(state, label){
    const levels = computeLevels(state);
    const { pct } = computeGlobalPct(levels);
    state.masteryHistory.push({ label, date: new Date().toISOString(), globalPct: pct, perCompetence: levels });
  }

  window.MasteryEngine = { addEvidence, computeLevels, computeGlobalPct, computeAvancement, pushHistoryPoint, sessionLevel };
})();
