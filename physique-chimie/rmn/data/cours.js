/*
 * Contenu du cours ("L'essentiel du cours"). Conforme au programme officiel
 * BCPST1 2021, section C.1.3 (spectroscopie RMN du proton) : déplacement
 * chimique, intégration, multiplicité des signaux, couplages du premier
 * ordre AmXp et AmMpXq. Ne couvre pas la RMN ¹³C, la RMN 2D, ni la théorie
 * physique de la résonance (hors programme BCPST1).
 */
window.RMN_COURS = {

  quatreInfos: [
    { info: "Nombre de signaux", interpretation: "Nombre de groupes de protons chimiquement équivalents dans la molécule." },
    { info: "Déplacement chimique δ", interpretation: "Environnement électronique et chimique du groupe de protons (table de référence)." },
    { info: "Intégration", interpretation: "Nombre relatif de protons responsables du signal (aire du signal, pas sa hauteur)." },
    { info: "Multiplicité", interpretation: "Couplages entre protons non équivalents portés par des atomes voisins." }
  ],
  croisementNote: "Ces quatre informations ne s'interprètent jamais isolément : c'est leur recoupement — par exemple un δ compatible ET une intégration cohérente ET une multiplicité qui correspond au nombre de voisins attendu — qui permet d'attribuer un signal avec certitude. Une seule information, prise seule, ne suffit presque jamais à conclure.",

  equivalence: {
    intro: "Deux protons sont chimiquement équivalents s'ils occupent un environnement chimique identique dans la molécule — en pratique, s'ils peuvent être échangés par une opération de symétrie de la molécule ou par une rotation libre autour d'une liaison simple. Des protons chimiquement équivalents donnent un seul et même signal.",
    regle: "Pour compter les groupes de protons équivalents : repérer les atomes de carbone porteurs d'hydrogènes, regrouper ceux reliés par une symétrie de la molécule (ex. les deux CH₃ d'un propan-2-ol) ou par rotation libre (les 3 H d'un même CH₃ sont toujours équivalents entre eux), puis compter le nombre de groupes distincts obtenus.",
    exemples: [
      { spectreId: 'propanone', note: "1 seul groupe de protons équivalents (les deux CH₃, reliés par la symétrie de la molécule) → 1 seul signal attendu." },
      { spectreId: 'ethanol', note: "3 groupes distincts (CH₃, CH₂, OH) → 3 signaux attendus." },
      { spectreId: 'propane', note: "2 groupes distincts : les deux CH₃ terminaux (équivalents entre eux par symétrie) et le CH₂ central → 2 signaux attendus, alors que la molécule compte 8 atomes d'hydrogène." },
      { spectreId: 'propan2ol', note: "3 groupes distincts : les deux CH₃ (équivalents par symétrie), le CH, et OH → 3 signaux attendus." },
      { spectreId: 'ethylacetate', note: "3 groupes distincts : CH₃ lié au carbonyle, CH₂ et CH₃ de l'éthyle — bien que ce soient deux groupes CH₃, ils ne sont PAS équivalents entre eux car leurs environnements chimiques diffèrent → 3 signaux attendus." }
    ]
  },

  deplacementChimique: {
    intro: "Le déplacement chimique δ, exprimé en ppm (partie par million), situe un signal sur une échelle qui ne dépend pas du champ magnétique de l'appareil. Par convention, l'axe est gradué avec les valeurs élevées de δ à GAUCHE et les valeurs faibles à DROITE (0 ppm, référence TMS, à l'extrême droite).",
    plages: [
      { domaine: "Protons aliphatiques (C sp³, loin de tout groupe électroattracteur)", min: 0.8, max: 1.8, exemple: "CH₃, CH₂, CH d'une chaîne carbonée simple" },
      { domaine: "Protons voisins d'un carbonyle (C=O)", min: 2.0, max: 2.7, exemple: "CH₃ d'une cétone ou d'un ester (côté acyle)" },
      { domaine: "Protons portés par un carbone lié à O (C–O–H ou C–O–C)", min: 3.3, max: 4.5, exemple: "CH₂ d'un alcool, CH₂ d'un ester (côté alkyle)" },
      { domaine: "Protons alcéniques (C=C–H)", min: 4.5, max: 6.5, exemple: "=CH₂, =CH–" },
      { domaine: "Protons aromatiques", min: 6.5, max: 8.5, exemple: "cycle benzénique" },
      { domaine: "Protons aldéhydiques (–CHO)", min: 9.0, max: 10.0, exemple: "CHO d'un aldéhyde" }
    ],
    limites: "Ces plages sont indicatives : elles se chevauchent parfois (un CH₂ très activé peut dépasser 4,5 ppm) et doivent toujours être confrontées à l'intégration et à la multiplicité plutôt qu'utilisées seules.",
    echangeables: "Les protons portés par O ou N (OH, NH) ont une position très variable (souvent entre 1 et 5 ppm pour OH, davantage pour les acides carboxyliques), un aspect de signal souvent large et mal défini, et ne présentent généralement pas de couplage observable avec leurs voisins (échange rapide avec les traces d'eau ou d'autres molécules du même type) : ils ne doivent jamais être utilisés comme repère de δ fiable."
  },

  integration: {
    intro: "L'intégration mesure l'AIRE d'un signal (la surface sous la courbe), proportionnelle au nombre de protons responsables de ce signal — PAS la hauteur des raies qui le composent, et PAS le nombre de raies de son multiplet (ces deux grandeurs n'ont rien à voir avec le nombre de protons).",
    pieges: [
      "Un singulet de 6H (ex. les deux CH₃ de la propanone) peut avoir une aire plus grande qu'un triplet de 2H, même si visuellement le singulet n'a qu'une seule raie fine et haute : c'est l'aire totale qui compte, pas l'aspect d'une raie individuelle.",
      "Un multiplet à 4 raies (quadruplet) n'a pas automatiquement 4 fois plus de protons qu'un singulet : le nombre de raies dépend du nombre de VOISINS, l'intégration dépend du nombre de protons DU SIGNAL lui-même."
    ],
    exemples: [
      { spectreId: 'ethanol', note: "Rapport des intégrations CH₃ : CH₂ : OH = 3 : 2 : 1 (dans cet ordre de grandeur)." },
      { spectreId: 'propan2ol', note: "Rapport des intégrations (2×CH₃) : CH : OH = 6 : 1 : 1." },
      { spectreId: 'ethylacetate', note: "Rapport 3 : 2 : 3 entre les trois signaux (CH₃ acétyle, CH₂, CH₃ éthyle)." }
    ]
  },

  multiplicite: {
    intro: "Un signal peut être composé de plusieurs raies rapprochées : c'est un multiplet. Il provient du couplage scalaire (through-bond) entre les protons responsables du signal et des protons NON équivalents portés par des atomes voisins (le plus souvent à 2 ou 3 liaisons).",
    regleN1: "Règle n+1 : un groupe de protons possédant n protons voisins NON équivalents et porteurs d'un couplage identique donne un multiplet de (n+1) raies, d'intensités relatives données par le triangle de Pascal.",
    conditionsN1: [
      "Les n voisins doivent être équivalents entre eux (même constante de couplage J avec le groupe observé) ; sinon, voir les couplages AmMpXq (deux groupes de voisins distincts).",
      "Le couplage est dit « du premier ordre » : il faut que l'écart de déplacement chimique entre les groupes couplés soit grand devant J (sinon les spectres se déforment, hors-programme BCPST1).",
      "Les protons chimiquement équivalents entre eux (au sein d'un même groupe) ne se dédoublent PAS mutuellement : un CH₃ isolé reste un massif simple du fait de ses propres protons, quelle que soit sa multiplicité due aux voisins."
    ],
    multipletsSimples: [
      { cle: 's', nom: 'Singulet', n: 0, exemple: "CH₃ de la propanone (aucun voisin porteur de H)" },
      { cle: 'd', nom: 'Doublet', n: 1, exemple: "CH₃ du propan-2-ol (1 voisin : le CH)" },
      { cle: 't', nom: 'Triplet', n: 2, exemple: "CH₃ de l'éthanol (2 voisins : le CH₂)" },
      { cle: 'q', nom: 'Quadruplet', n: 3, exemple: "CH₂ de l'éthanol (3 voisins : le CH₃)" },
      { cle: 'sept', nom: 'Septuplet', n: 6, exemple: "CH du propan-2-ol (6 voisins : les deux CH₃ équivalents)" }
    ],
    couplagesMultiples: {
      intro: "Lorsqu'un groupe de protons a deux groupes de voisins NON équivalents entre eux (noté AmMpXq), chaque couplage se traduit par un dédoublement successif, avec sa propre constante J. Le multiplet final résulte de la combinaison des deux dédoublements.",
      cas: [
        "Si J₁ et J₂ sont très différentes : on observe un massif à (m+1)×(p+1) raies bien séparées (ex. un « doublet de triplets »).",
        "Si J₁ ≈ J₂ : certaines raies, prévues à des positions voisines, se superposent presque exactement. Le massif observé ressemble alors à un multiplet simple à (m+p+1) raies, comme si l'on appliquait la règle n+1 globale aux (m+p) voisins — c'est une approximation visuelle, pas une nouvelle règle physique.",
        "Si J₁ et J₂ sont proches sans être rigoureusement égales, certaines raies se chevauchent partiellement : le massif observé peut présenter des raies d'intensité irrégulière, parfois difficile à dénombrer précisément."
      ],
      exempleTexte: "Exemple : le CH₂ central du propan-1-ol est voisin du CH₃ (3H, J≈7,0 Hz) et du CH₂–OH (2H, J≈7,0 Hz). Les deux constantes étant très proches, le massif observé ressemble à un sextuplet (3+2+1 = 6 raies), alors qu'il s'agit en toute rigueur d'un doublet de quintuplets (ou l'inverse) aux raies superposées."
    }
  },

  pieges: [
    { titre: "Protons OH et NH échangeables", texte: "Leur position δ est variable, leur forme souvent un singulet large sans couplage observable avec les voisins (l'échange rapide avec le solvant ou des traces d'eau moyenne le couplage) : ne jamais s'appuyer uniquement sur eux pour une attribution." },
    { titre: "Pas de dédoublement mutuel au sein d'un groupe équivalent", texte: "Les protons chimiquement équivalents entre eux ne se couplent pas de façon observable (même s'ils sont magnétiquement proches) : un groupe CH₃ isolé ne « voit » jamais ses propres 3 H comme des voisins couplants." },
    { titre: "Signaux qui se recouvrent", texte: "Deux signaux voisins en δ peuvent se superposer partiellement ou totalement sur le spectre réel : le nombre de signaux apparemment visibles peut alors être inférieur au nombre de groupes chimiquement équivalents réellement présents." },
    { titre: "Signal, raie, multiplet : trois mots différents", texte: "Un signal correspond à UN groupe de protons équivalents. Un multiplet est l'ensemble des raies de ce signal. Une raie est une seule composante fine du multiplet. Confondre ces notions est une source fréquente d'erreur d'intégration." },
    { titre: "Limites de la règle n+1", texte: "La règle n+1 suppose des voisins équivalents entre eux avec un couplage identique ; elle ne s'applique pas directement dès qu'il y a deux groupes de voisins avec des J différentes (cf. AmMpXq), et elle suppose un couplage du premier ordre (Δδ ≫ J)." },
    { titre: "Une multiplicité seule n'identifie jamais une molécule", texte: "Un triplet peut appartenir à une infinité de molécules différentes. Seul le recoupement de toutes les informations (δ, intégration, multiplicité, et éventuellement l'IR) permet une identification fiable." }
  ]
};
