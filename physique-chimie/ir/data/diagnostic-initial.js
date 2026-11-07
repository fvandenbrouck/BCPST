/*
 * Diagnostic initial (14 questions, C1 à C7). Aucune correction affichée
 * pendant le diagnostic (cf. js/app.js) : seul un bilan par compétence est
 * donné une fois le diagnostic entièrement soumis.
 */
window.IR_DIAGNOSTIC_INITIAL = [
  {
    id: 'di-01', competences: ['C1'], difficulte: 1, type: 'single',
    enonce: "Le nombre d'onde $\\sigma$, utilisé en abscisse d'un spectre IR, est défini par :",
    options: ["$\\sigma = 1/\\lambda$, exprimé en cm⁻¹", "$\\sigma = \\lambda$, exprimé en cm", "$\\sigma = hc/\\lambda$, exprimé en joules"], correct: 0,
    explication: "Le nombre d'onde est l'inverse de la longueur d'onde, exprimé en cm⁻¹."
  },
  {
    id: 'di-02', competences: ['C1'], difficulte: 1, type: 'single',
    enonce: "Sur un spectre IR tracé selon la convention usuelle, comment est orienté l'axe des nombres d'onde ?",
    options: ["Les valeurs élevées (ex. 4000 cm⁻¹) à gauche, les valeurs faibles (ex. 400 cm⁻¹) à droite", "Les valeurs faibles à gauche, les valeurs élevées à droite", "L'axe n'a pas de sens conventionnel"], correct: 0,
    explication: "Par convention, l'axe des nombres d'onde est gradué avec les valeurs élevées à gauche."
  },
  {
    id: 'di-03', competences: ['C1'], difficulte: 2, type: 'numeric',
    enonce: "Une bande d'absorption correspond à une longueur d'onde λ = 5,0 µm (1 µm = 10⁻⁴ cm). Calcule le nombre d'onde correspondant, en cm⁻¹.",
    unite: "cm⁻¹", reponse: 2000, tolerance: { type: 'abs', value: 50 },
    explication: "$\\sigma = 1/\\lambda = 1/(5{,}0\\times10^{-4}\\,\\text{cm}) = 2000\\,\\text{cm}^{-1}$."
  },
  {
    id: 'di-04', competences: ['C2'], difficulte: 1, type: 'single',
    enonce: "Sur un spectre en TRANSMITTANCE, à quoi correspond une absorption importante ?",
    options: ["À un creux prononcé (minimum local de transmittance)", "À un pic prononcé (maximum local de transmittance)", "À une ligne plate, sans variation"], correct: 0,
    explication: "En transmittance, une absorption importante se traduit par une forte baisse de I/I₀, donc un creux."
  },
  {
    id: 'di-05', competences: ['C2'], difficulte: 2, type: 'single',
    enonce: "Une bande descend jusqu'à une transmittance de 15 % ; une autre, voisine, ne descend qu'à 80 %. Laquelle correspond à l'absorption la plus intense ?",
    options: ["Celle qui descend à 15 %", "Celle qui descend à 80 %", "Les deux bandes ont la même intensité"], correct: 0,
    explication: "Plus la transmittance minimale est basse, plus l'absorption (donc l'intensité de la bande) est forte."
  },
  {
    id: 'di-06', competences: ['C3'], difficulte: 1, type: 'single',
    enonce: "Une bande large et intense est observée entre 3200 et 3600 cm⁻¹. Quelle liaison est la plus probable ?",
    options: ["O–H d'un alcool", "C=O", "C–H aliphatique"], correct: 0,
    explication: "La zone 3200-3600 cm⁻¹, pour une bande large, est caractéristique d'un O–H d'alcool engagé dans des liaisons hydrogène."
  },
  {
    id: 'di-07', competences: ['C3'], difficulte: 2, type: 'multi',
    enonce: "Parmi les bandes suivantes, lesquelles se situent dans la zone usuelle des C–H aliphatiques (2850-3000 cm⁻¹) ? (plusieurs réponses possibles)",
    options: ["2920 cm⁻¹", "2960 cm⁻¹", "1715 cm⁻¹", "3400 cm⁻¹"], correct: [0, 1],
    explication: "2920 et 2960 cm⁻¹ sont dans la zone 2850-3000 cm⁻¹ des C–H aliphatiques ; 1715 cm⁻¹ appartient à la zone C=O, 3400 cm⁻¹ à la zone O–H/N–H."
  },
  {
    id: 'di-08', competences: ['C4'], difficulte: 2, type: 'single',
    enonce: "Deux spectres présentent chacun une bande O–H : l'un entre 3200 et 3600 cm⁻¹, l'autre, beaucoup plus large, entre 2500 et 3300 cm⁻¹. Lequel correspond à un acide carboxylique ?",
    options: ["Celui dont la bande O–H est la plus large (2500-3300 cm⁻¹)", "Celui dont la bande O–H est la moins large (3200-3600 cm⁻¹)", "Impossible à déterminer à partir de cette seule information"], correct: 0,
    explication: "La bande O–H d'un acide carboxylique est exceptionnellement plus large que celle d'un alcool."
  },
  {
    id: 'di-09', competences: ['C4'], difficulte: 2, type: 'single',
    enonce: "Deux spectres présentent un C=O à une position très voisine (≈1715-1740 cm⁻¹). L'un présente en plus une bande C–O intense vers 1240 cm⁻¹, l'autre non. Lequel est le plus probablement un ester ?",
    options: ["Celui qui présente la bande C–O intense supplémentaire", "Celui qui n'a que le C=O", "Aucun des deux ne peut être un ester sans bande O–H"], correct: 0,
    explication: "La présence conjointe de C=O et d'une bande C–O intense est la signature typique d'un ester ; un C=O seul oriente plutôt vers une cétone."
  },
  {
    id: 'di-10', competences: ['C5'], difficulte: 2, type: 'single',
    enonce: "Un spectre présente à la fois une bande O–H très large (2500-3300 cm⁻¹) et une bande C=O vers 1715 cm⁻¹. Quelle fonction est la plus cohérente avec cette combinaison ?",
    options: ["Un acide carboxylique", "Un alcool simple", "Une amine"], correct: 0,
    explication: "C'est la combinaison O–H très large + C=O qui signe un acide carboxylique ; un alcool simple n'a pas de C=O, une amine n'a pas de C=O ni cet O–H particulier."
  },
  {
    id: 'di-11', competences: ['C5'], difficulte: 3, type: 'single',
    enonce: "Pourquoi la bande O–H d'un acide carboxylique, qui recouvre souvent la zone des C–H (2850-3000 cm⁻¹), complique-t-elle l'analyse du spectre ?",
    options: ["Parce que les bandes O–H et C–H, en se superposant, rendent plus difficile l'identification précise de chaque contribution", "Parce que les bandes C–H disparaissent complètement dans ce cas", "Parce que cela signifie que la molécule ne contient pas de carbone"], correct: 0,
    explication: "Un recouvrement de bandes rend l'identification de chaque contribution individuelle plus délicate, sans faire disparaître les bandes sous-jacentes."
  },
  {
    id: 'di-12', competences: ['C6'], difficulte: 2, type: 'single',
    enonce: "Un spectre ne présente AUCUNE bande C=O. Laquelle de ces structures candidates peut-on exclure avec le plus de certitude ?",
    options: ["Un ester", "Un alcool", "Une amine"], correct: 0,
    explication: "Un ester possède nécessairement une bande C=O intense ; son absence permet de l'exclure. Un alcool et une amine n'ont pas de C=O par nature, leur compatibilité n'est donc pas affectée par cette absence."
  },
  {
    id: 'di-13', competences: ['C7'], difficulte: 3, type: 'single',
    enonce: "Un spectre présente une bande N–H moyenne vers 3300-3500 cm⁻¹, des bandes C–H aliphatiques, et AUCUNE bande C=O. Parmi une amine, un amide et un acide carboxylique, laquelle de ces structures est compatible ?",
    options: ["Une amine", "Un amide", "Un acide carboxylique"], correct: 0,
    explication: "L'amide et l'acide carboxylique possèdent tous deux une bande C=O caractéristique, absente ici. Seule l'amine, qui n'a pas de C=O, reste compatible avec ce spectre."
  },
  {
    id: 'di-14', competences: ['C7'], difficulte: 3, type: 'single',
    enonce: "Pourquoi un spectre IR ne permet-il pas toujours de distinguer, à lui seul, deux structures candidates ?",
    options: [
      "Parce que l'IR identifie principalement des liaisons et des groupes fonctionnels, qui peuvent être communs à plusieurs structures différentes",
      "Parce que l'IR ne fonctionne que pour les molécules inorganiques",
      "Parce qu'un spectre IR ne comporte jamais plus d'une bande"
    ], correct: 0,
    explication: "L'IR renseigne sur la présence de liaisons et de groupes fonctionnels, une information parfois partagée par plusieurs structures candidates : il faut alors d'autres données (RMN, par exemple) pour trancher."
  }
];
