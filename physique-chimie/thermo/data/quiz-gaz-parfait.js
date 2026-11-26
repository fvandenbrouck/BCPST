/*
 * Questions du quizz de l'atelier 0 (loi des gaz parfaits). Rendu via
 * window.QuestionUI.renderPracticeExercise (js/ui-components.js) et corrigé
 * via window.GradingEngine (js/grading-engine.js) — même mécanique que les
 * exercices d'entraînement des modules IR et RMN : indices progressifs puis
 * explication, jamais la réponse donnée directement dans un indice.
 */
window.THERMO_QUIZ_GAZ_PARFAIT = [
  {
    id: 'gp-q1',
    type: 'single',
    enonce: "Un gaz enfermé dans une enceinte voit son volume doubler, à température constante. Que devient sa pression ?",
    options: ["Elle double", "Elle est divisée par deux", "Elle reste la même", "Elle est divisée par quatre"],
    correct: 1,
    indices: [
      "Quelle grandeur reste constante dans cette expérience ?",
      "Loi de Boyle-Mariotte : P·V = constante. Si V devient 2V, que doit devenir P pour que le produit ne change pas ?"
    ],
    explication: "À température constante, P·V = constante (loi de Boyle-Mariotte). Si V double, P doit être divisée par deux pour que le produit P·V reste inchangé."
  },
  {
    id: 'gp-q2',
    type: 'single',
    enonce: "On chauffe un gaz dans une enceinte à volume fixe (piston bloqué). Sa température absolue passe de 300 K à 600 K. Que devient sa pression ?",
    options: ["Elle double", "Elle est divisée par deux", "Elle reste la même", "Elle est multipliée par quatre"],
    correct: 0,
    indices: [
      "Le volume ne change pas ici : quelle loi relie P et T à volume constant ?",
      "Loi de Gay-Lussac : P/T = constante."
    ],
    explication: "À volume constant, P/T = constante (loi de Gay-Lussac). La température absolue double (300 K → 600 K), donc la pression double aussi."
  },
  {
    id: 'gp-q3',
    type: 'single',
    enonce: "Un gaz est maintenu à pression constante (piston libre, pression extérieure imposée fixe) et sa température absolue est divisée par deux. Que devient son volume ?",
    options: ["Il double", "Il est divisé par deux", "Il reste le même", "Il est divisé par quatre"],
    correct: 1,
    indices: [
      "Quelle grandeur est imposée de l'extérieur, ici, par le piston libre ?",
      "Loi de Charles : V/T = constante."
    ],
    explication: "À pression constante, V/T = constante (loi de Charles). Si la température absolue est divisée par deux, le volume l'est aussi."
  },
  {
    id: 'gp-q4',
    type: 'numeric',
    enonce: "Un gaz parfait occupe 2,0 L sous 1,0 bar à 300 K. On le comprime à 1,0 L, à la même température. Quelle est sa nouvelle pression, en bar ?",
    unite: 'bar',
    reponse: 2.0,
    tolerance: { type: 'pct', value: 5 },
    indices: [
      "La température ne change pas : laquelle des quatre lois s'applique ?",
      "P·V = constante (Boyle-Mariotte) : P₁V₁ = P₂V₂."
    ],
    explication: "À température fixée, P·V = constante (Boyle-Mariotte) : P₁V₁ = P₂V₂, donc P₂ = P₁V₁/V₂ = 1,0 × 2,0 / 1,0 = 2,0 bar."
  },
  {
    id: 'gp-q5',
    type: 'single',
    enonce: "Laquelle de ces expressions est l'équation d'état du gaz parfait ?",
    options: ["PV = nRT", "PT = nRV", "P = nRTV", "PV² = nRT"],
    correct: 0,
    indices: ["C'est la relation qui relie en une seule équation la pression, le volume, la quantité de matière et la température."],
    explication: "L'équation d'état du gaz parfait s'écrit PV = nRT, où R est la constante des gaz parfaits et n la quantité de matière, en mol."
  },
  {
    id: 'gp-q6',
    type: 'single',
    enonce: "Dans la simulation, tu changes à la fois le volume et la température du gaz, sans rien bloquer : P, V et T varient tous les trois librement. Quelle quantité reste malgré tout constante ?",
    options: ["P seule", "V seule", "T seule", "Le rapport PV/T"],
    correct: 3,
    indices: [
      "Ce n'est ni P, ni V, ni T pris isolément qui ne bougent pas.",
      "C'est la loi des gaz parfaits sous sa forme la plus générale."
    ],
    explication: "PV/T reste constant (égal à nR) quelles que soient les valeurs prises séparément par P, V et T : c'est la loi des gaz parfaits dans sa forme la plus générale, PV = nRT, qui contient les trois lois particulières (Boyle-Mariotte, Gay-Lussac, Charles) comme cas où l'une des trois grandeurs est bloquée."
  }
];
