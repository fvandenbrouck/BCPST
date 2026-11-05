/*
 * Méthode systématique d'analyse d'un spectre RMN ¹H — accessible en fiche
 * courte depuis toutes les activités (cf. js/app.js, showFicheMethode()).
 */
window.RMN_METHODE = {
  etapes: [
    {
      n: 1, titre: "Identifier les signaux",
      explication: "Compter les ensembles de raies nettement séparés sur le spectre. Repérer les zones où deux signaux pourraient se recouvrir (massif large, épaulement).",
      exemple: "Sur le spectre de l'éthanol, on distingue 3 signaux : un triplet vers 1,2 ppm, un quadruplet vers 3,7 ppm, un singulet large vers 2,6 ppm.",
      erreur: "Compter chaque raie d'un multiplet comme un signal à part entière, au lieu de regrouper les raies d'un même massif."
    },
    {
      n: 2, titre: "Exploiter les intégrations",
      explication: "Relever l'aire de chaque signal (donnée numériquement ou sous forme de courbe d'intégration en escalier) et la convertir en nombre relatif de protons, en ramenant au plus petit rapport entier cohérent avec la formule brute.",
      exemple: "Pour l'éthanol (C₂H₆O, 6 H), des aires dans le rapport 3 : 2 : 1 correspondent directement à 3H, 2H et 1H.",
      erreur: "Confondre l'aire d'un signal avec la hauteur de ses raies ou avec son nombre de raies."
    },
    {
      n: 3, titre: "Examiner les déplacements chimiques",
      explication: "Pour chaque signal, proposer un ou plusieurs environnements chimiques plausibles à l'aide de la table de déplacements chimiques (cf. page Cours).",
      exemple: "Un signal vers 3,7 ppm évoque un CH₂ porté par un carbone lié à l'oxygène plutôt qu'un CH₂ aliphatique isolé (attendu plutôt vers 1,2-1,8 ppm).",
      erreur: "Identifier un environnement chimique à partir du δ seul, sans vérifier sa cohérence avec l'intégration et la multiplicité."
    },
    {
      n: 4, titre: "Analyser les multiplicités",
      explication: "Pour chaque signal, compter le nombre de raies, en déduire le nombre de voisins non équivalents (règle n+1) et donc une hypothèse sur les groupes adjacents. Si deux constantes J distinctes sont nécessaires pour reconstituer le massif, chercher deux groupes de voisins différents (AmMpXq).",
      exemple: "Un quadruplet (4 raies) indique 3 voisins non équivalents, typiquement un CH₃ adjacent.",
      erreur: "Appliquer n+1 à des voisins non équivalents entre eux sans envisager un couplage multiple, ou l'appliquer en comptant les protons DU signal lui-même au lieu de ses voisins."
    },
    {
      n: 5, titre: "Construire les fragments moléculaires",
      explication: "Assembler les hypothèses précédentes en fragments cohérents : un triplet-quadruplet couplés l'un à l'autre, d'intégration 3H et 2H, évoque fortement un fragment éthyle CH₃–CH₂–.",
      exemple: "Triplet 3H vers 1,2 ppm + quadruplet 2H vers 3,7 ppm couplés ensemble (même J) → fragment CH₃–CH₂–O–.",
      erreur: "Assembler des signaux qui n'ont pas la même constante de couplage J (ils ne sont alors pas forcément voisins l'un de l'autre)."
    },
    {
      n: 6, titre: "Vérifier l'ensemble de la structure",
      explication: "Reconstituer la molécule complète à partir des fragments, vérifier que la somme des intégrations correspond à la formule brute, et écarter toute structure candidate incompatible avec l'un des signaux observés.",
      exemple: "Pour C₂H₆O avec les fragments CH₃–CH₂– et –OH : la seule structure cohérente est l'éthanol (l'éther diméthylique, isomère de même formule, ne comporte pas de OH ni de CH₂).",
      erreur: "S'arrêter à une structure compatible avec UN signal sans vérifier sa cohérence avec la totalité du spectre."
    }
  ],

  tableauAttributionColonnes: ["Signal", "δ (ppm)", "Intégration", "Multiplicité", "Attribution", "Justification"],

  ficheCourte: "1. Identifier les signaux. 2. Exploiter les intégrations. 3. Examiner les déplacements chimiques. 4. Analyser les multiplicités. 5. Construire les fragments moléculaires. 6. Vérifier l'ensemble de la structure."
};
