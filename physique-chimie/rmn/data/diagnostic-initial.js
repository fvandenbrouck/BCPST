/*
 * Diagnostic initial (12 questions, C1 à C7). Aucune correction affichée
 * pendant le diagnostic (cf. js/app.js) : seul un bilan par compétence est
 * donné une fois le diagnostic entièrement soumis.
 */
window.RMN_DIAGNOSTIC_INITIAL = [
  {
    id: 'di-01', competences: ['C1'], difficulte: 1, type: 'single',
    enonce: "Le propane CH₃–CH₂–CH₃ possède 8 atomes d'hydrogène. Combien de signaux distincts attend-on sur son spectre RMN ¹H ?",
    options: ["2 signaux", "3 signaux", "8 signaux"], correct: 0,
    explication: "Les deux CH₃ terminaux sont équivalents entre eux par symétrie de la molécule ; le CH₂ central forme un second groupe. Il y a donc 2 groupes de protons équivalents, donc 2 signaux."
  },
  {
    id: 'di-02', competences: ['C1', 'C2'], difficulte: 2, type: 'multi',
    enonce: "À propos de l'éthanoate d'éthyle CH₃–CO–O–CH₂–CH₃, quelles affirmations sont correctes ? (plusieurs réponses possibles)",
    options: [
      "La molécule présente 3 groupes de protons chimiquement équivalents",
      "Les deux groupes CH₃ sont chimiquement équivalents entre eux",
      "Le rapport des intégrations des trois signaux est 3 : 2 : 3",
      "Le groupe CH₂ est responsable d'un signal intégrant pour 3 protons"
    ],
    correct: [0, 2],
    explication: "Le CH₃ lié au carbonyle et le CH₃ de l'éthyle ont des environnements chimiques différents : ce ne sont PAS des protons équivalents entre eux, malgré leur formule identique. Il y a bien 3 groupes (3H + 2H + 3H), soit un rapport 3:2:3. Le CH₂ porte 2 protons, pas 3."
  },
  {
    id: 'di-03', competences: ['C2'], difficulte: 2, type: 'numeric',
    enonce: "Une molécule de 8 atomes d'hydrogène donne un spectre à 3 signaux dont les aires mesurées valent 15, 10 et 15 (unités arbitraires). Combien de protons sont responsables du signal d'aire 10 ?",
    unite: "protons", reponse: 2, tolerance: { type: 'abs', value: 0 },
    explication: "La somme des aires (15+10+15=40) correspond aux 8 H de la molécule, soit un facteur d'échelle de 8/40 = 0,2 H par unité d'aire. Le signal d'aire 10 correspond donc à 10×0,2 = 2 protons (et les deux autres à 3 protons chacun : 3+2+3=8)."
  },
  {
    id: 'di-04', competences: ['C3'], difficulte: 1, type: 'single',
    enonce: "Un signal RMN ¹H apparaît à δ = 7,2 ppm. Quel environnement chimique est le plus probable ?",
    options: ["Un proton aromatique", "Un proton aliphatique (CH₃ isolé)", "Un proton porté par un carbone lié à O"], correct: 0,
    explication: "La zone 6,5-8,5 ppm est caractéristique des protons aromatiques. Un CH₃ aliphatique isolé est attendu vers 0,8-1,8 ppm, un CH-O vers 3,3-4,5 ppm."
  },
  {
    id: 'di-05', competences: ['C3'], difficulte: 1, type: 'single',
    enonce: "Sur un spectre RMN ¹H tracé selon la convention usuelle, comment sont disposées les valeurs de δ sur l'axe horizontal ?",
    options: ["Les valeurs élevées de δ sont à gauche, les valeurs faibles à droite", "Les valeurs élevées de δ sont à droite, les valeurs faibles à gauche", "L'axe n'a pas de sens conventionnel, cela dépend du logiciel"], correct: 0,
    explication: "Par convention en RMN, l'axe des δ est orienté avec les valeurs élevées à gauche et 0 ppm (référence TMS) à l'extrême droite."
  },
  {
    id: 'di-06', competences: ['C4'], difficulte: 1, type: 'single',
    enonce: "Un signal se présente sous la forme d'un quadruplet (4 raies). D'après la règle n+1, combien de protons voisins non équivalents porte le groupe responsable de ce signal ?",
    options: ["3 protons voisins", "4 protons voisins", "2 protons voisins"], correct: 0,
    explication: "La règle n+1 donne (n+1) raies pour n voisins équivalents entre eux : 4 raies correspondent donc à n = 3 voisins (typiquement un CH₃)."
  },
  {
    id: 'di-07', competences: ['C4'], difficulte: 2, type: 'single',
    enonce: "Dans l'éthanol CH₃–CH₂–OH, quelle multiplicité attend-on pour le signal du CH₃ (en ignorant le couplage, généralement non résolu, avec le OH) ?",
    options: ["Un singulet", "Un doublet", "Un triplet", "Un quadruplet"], correct: 2,
    explication: "Le CH₃ a pour seuls voisins couplants les 2 H du CH₂ : n = 2, donc n+1 = 3 raies, soit un triplet."
  },
  {
    id: 'di-08', competences: ['C5'], difficulte: 3, type: 'single',
    enonce: "Un groupe de protons a deux groupes de voisins non équivalents entre eux : l'un de 2H (constante J₁), l'autre de 3H (constante J₂), avec J₁ ≈ J₂. Quel aspect de massif observe-t-on le plus probablement ?",
    options: [
      "Un massif à 6 raies, ressemblant à un sextuplet, par superposition quasi totale des raies prévues par chaque couplage",
      "Un massif de 3×4 = 12 raies parfaitement séparées",
      "Un singulet, car deux couplages différents s'annulent toujours"
    ], correct: 0,
    explication: "Quand J₁ ≈ J₂, les raies issues des deux dédoublements successifs tombent presque aux mêmes positions : le massif observé ressemble à un multiplet simple de (2+3+1)=6 raies, bien qu'il s'agisse en toute rigueur d'un doublet de quadruplets (ou l'inverse) aux raies superposées."
  },
  {
    id: 'di-09', competences: ['C5'], difficulte: 3, type: 'single',
    enonce: "Pourquoi ne peut-on pas, en toute rigueur, appliquer directement la règle n+1 « globale » à un groupe de protons voisin de deux groupes non équivalents entre eux ?",
    options: [
      "Parce que chaque groupe de voisins a sa propre constante de couplage : il faut appliquer deux dédoublements successifs, qui ne coïncident exactement que si les deux J sont égales",
      "Parce qu'il n'y a, par principe, jamais de couplage observable dans ce cas",
      "Parce que la règle n+1 ne s'applique qu'aux molécules cycliques"
    ], correct: 0,
    explication: "La règle n+1 simple suppose un unique groupe de n voisins équivalents partageant la même constante J. Avec deux groupes de voisins distincts (systèmes AmMpXq), il faut composer deux dédoublements, avec J₁ et J₂ a priori différentes."
  },
  {
    id: 'di-10', competences: ['C6'], difficulte: 2, type: 'single',
    enonce: "Le spectre de l'éthanol présente un triplet à 1,24 ppm (3H), un quadruplet à 3,70 ppm (2H) et un singulet large à 2,60 ppm (1H). Quel signal correspond au groupe CH₂ ?",
    options: ["Le quadruplet à 3,70 ppm", "Le triplet à 1,24 ppm", "Le singulet large à 2,60 ppm"], correct: 0,
    explication: "Le CH₂, porté par un carbone lié à l'oxygène, est attendu à un δ plus élevé (zone 3,3-4,5 ppm) qu'un CH₃ aliphatique isolé (0,8-1,8 ppm), et son intégration (2H) ainsi que sa multiplicité (quadruplet, couplé aux 3H du CH₃) confirment cette attribution."
  },
  {
    id: 'di-11', competences: ['C7'], difficulte: 3, type: 'single',
    enonce: "Deux structures isomères de formule C₃H₈O sont proposées : le propan-1-ol et le méthoxyéthane. Le spectre étudié ne présente AUCUN signal large caractéristique d'un proton échangeable, et comporte un singulet à 3,3 ppm intégrant pour 3H. Quelle structure est compatible avec ce spectre ?",
    options: ["Le méthoxyéthane (éther)", "Le propan-1-ol (alcool)", "Les deux structures sont également compatibles"], correct: 0,
    explication: "L'absence de signal échangeable élimine l'alcool (qui possède un OH). Le singulet à 3,3 ppm (3H) correspond à un OCH₃ sans voisin porteur de H, caractéristique du méthoxyéthane."
  },
  {
    id: 'di-12', competences: ['C6', 'C7'], difficulte: 2, type: 'single',
    enonce: "Pourquoi une multiplicité observée seule (par exemple « un triplet ») ne permet-elle jamais, à elle seule, d'identifier une molécule ?",
    options: [
      "Parce qu'un très grand nombre de groupes de protons, dans des molécules différentes, peuvent donner un triplet : seul le recoupement avec le δ, l'intégration et, si besoin, l'IR permet de conclure",
      "Parce que la multiplicité n'a, en réalité, aucun lien avec la structure moléculaire",
      "Parce qu'un triplet ne peut provenir que d'un groupement CH₃"
    ], correct: 0,
    explication: "La multiplicité renseigne uniquement sur le nombre de voisins couplants, une information partagée par de nombreux fragments moléculaires différents. L'identification fiable d'une structure exige de croiser systématiquement toutes les informations disponibles."
  }
];
