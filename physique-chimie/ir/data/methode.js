/*
 * Méthode systématique d'analyse d'un spectre IR — accessible en fiche
 * courte depuis toutes les activités (cf. js/app.js, showFicheMethode()).
 */
window.IR_METHODE = {
  etapes: [
    {
      n: 1, titre: "Identifier les axes",
      explication: "Déterminer si l'ordonnée représente la transmittance ou l'absorbance, repérer le sens de variation du nombre d'onde (valeurs élevées à gauche par convention), et noter les unités employées (cm⁻¹).",
      exemple: "Un spectre en transmittance affiche des CREUX au niveau des absorptions ; en absorbance, ce sont des PICS pour les mêmes absorptions.",
      erreur: "Confondre les deux représentations, ou lire l'axe des nombres d'onde de droite à gauche."
    },
    {
      n: 2, titre: "Repérer les principales bandes",
      explication: "Relever la position, la largeur, l'intensité et un éventuel recouvrement de chaque bande significative. Commencer par les bandes les plus diagnostiques (O–H, N–H, C=O) plutôt que de chercher immédiatement à tout attribuer.",
      exemple: "Sur le spectre de l'acide éthanoïque, la bande O–H exceptionnellement large (2500-3300 cm⁻¹) est la plus diagnostique, avant même d'examiner le C=O.",
      erreur: "Vouloir attribuer systématiquement toutes les bandes, y compris celles de la région de l'empreinte digitale, dès cette étape."
    },
    {
      n: 3, titre: "Examiner la région des grandes valeurs de nombre d'onde",
      explication: "Chercher les bandes O–H, N–H et C–H au-dessus de 2800 cm⁻¹ environ, et utiliser leur position et leur forme (large ou étroite) pour proposer des hypothèses.",
      exemple: "Une bande très large entre 2500 et 3300 cm⁻¹ oriente fortement vers un acide carboxylique plutôt qu'un alcool.",
      erreur: "Négliger la LARGEUR d'une bande O–H/N–H, qui est pourtant l'indice le plus discriminant à ce stade."
    },
    {
      n: 4, titre: "Rechercher les bandes de groupes fonctionnels",
      explication: "Examiner la région des carbonyles C=O (1650-1800 cm⁻¹), les bandes C=C, et les bandes C–O utiles à la distinction des fonctions, à l'aide d'une table de nombres d'onde.",
      exemple: "Un C=O vers 1740 cm⁻¹ accompagné d'une bande C–O intense évoque un ester ; un C=O vers 1660 cm⁻¹ accompagné d'un N–H évoque un amide.",
      erreur: "S'arrêter à la seule présence d'un C=O sans examiner sa position précise ni les bandes associées."
    },
    {
      n: 5, titre: "Croiser les indices",
      explication: "Rechercher les combinaisons cohérentes de bandes. Pour chaque hypothèse de fonction, distinguer les indices qui la soutiennent, les indices manquants, et les indices qui pourraient la contredire.",
      exemple: "O–H très large + C=O : acide carboxylique plausible. C=O intense + bandes C–O : ester plausible. C=O + bandes N–H : amide possible.",
      erreur: "Retenir la première hypothèse compatible avec une seule bande, sans vérifier sa cohérence avec l'ensemble du spectre."
    },
    {
      n: 6, titre: "Conclure",
      explication: "Vérifier la compatibilité du spectre avec chaque structure candidate, et classer chacune comme compatible, incompatible, ou indécidable avec les seules données IR.",
      exemple: "Deux structures candidates peuvent rester toutes deux compatibles avec un spectre IR : l'IR identifie des liaisons et des groupes, pas toujours une structure unique.",
      erreur: "Affirmer une identification structurale unique alors que les données IR seules ne permettent pas de trancher entre plusieurs candidats compatibles."
    }
  ],

  tableauAttributionColonnes: ["Bande", "Nombre d'onde", "Intensité", "Largeur", "Attribution probable", "Conséquence structurale"],

  ficheCourte: "1. Identifier les axes. 2. Repérer les principales bandes. 3. Examiner les grandes valeurs de nombre d'onde (O–H, N–H, C–H). 4. Rechercher les bandes de groupes fonctionnels (C=O, C=C, C–O). 5. Croiser les indices. 6. Conclure (compatible / incompatible / indécidable)."
};
