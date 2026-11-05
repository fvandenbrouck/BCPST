/*
 * Les six activités du parcours d'apprentissage. Chaque exercice suit le
 * même schéma que les questions de diagnostic (type, options/réponse,
 * explication), complété par des indices progressifs (approche socratique,
 * cf. js/app.js : mauvaise réponse -> indice 1 -> nouvelle tentative ->
 * indice 2 -> explication complète).
 */
window.RMN_ACTIVITES = [
  // ===================== ACTIVITÉ 1 =====================
  {
    id: 'A1', n: 1, titre: "Équivalence chimique et intégration", competences: ['C1', 'C2'],
    objectif: "Identifier les groupes de protons chimiquement équivalents d'une molécule, en déduire le nombre de signaux attendus, et savoir associer une aire mesurée au nombre de protons qu'elle représente.",
    rappel: "Deux protons sont chimiquement équivalents s'ils occupent un environnement identique (symétrie de la molécule ou rotation libre autour d'une liaison simple). L'intégration mesure l'AIRE d'un signal, proportionnelle au nombre de protons qui en sont responsables — jamais sa hauteur ni son nombre de raies.",
    exercices: [
      {
        id: 'a1-ex1', competences: ['C1'], type: 'single',
        enonce: "Combien de signaux attend-on sur le spectre RMN ¹H du propan-2-ol (CH₃)₂CH–OH ?",
        figureMol: 'propan2ol-plain',
        options: ["3 signaux", "4 signaux", "1 signal"], correct: 0,
        indices: [
          "Repère d'abord les atomes de carbone porteurs d'hydrogène, puis regroupe ceux reliés par une symétrie de la molécule.",
          "Les deux CH₃ sont-ils dans des environnements identiques l'un par rapport à l'autre ? Et le OH forme-t-il un groupe à part ?"
        ],
        explication: "Les deux CH₃ sont équivalents par symétrie (molécule symétrique autour du CH central), le CH forme un groupe à part, et OH un troisième. Soit 3 groupes distincts → 3 signaux."
      },
      {
        id: 'a1-ex2', competences: ['C1'], type: 'multi',
        enonce: "Dans l'éthanoate d'éthyle CH₃–CO–O–CH₂–CH₃, quelles affirmations sur l'équivalence des protons sont correctes ? (plusieurs réponses)",
        figureMol: 'ethylacetate-plain',
        options: [
          "Les 3 protons d'un même CH₃ sont équivalents entre eux (rotation libre autour de la liaison C–C)",
          "Les deux groupes CH₃ de la molécule sont équivalents entre eux",
          "Le CH₂ forme un groupe de protons équivalents distinct des deux CH₃",
          "La molécule présente en tout 2 groupes de protons équivalents"
        ],
        correct: [0, 2],
        indices: [
          "Compare l'environnement proche de chaque CH₃ : l'un est lié au carbonyle, l'autre à un CH₂ lui-même lié à un oxygène. Sont-ils vraiment identiques ?",
          "Il y a bien 3 groupes distincts au total dans cette molécule (pas 2)."
        ],
        explication: "Les trois H d'un même CH₃ sont toujours équivalents entre eux. Mais les deux CH₃ de la molécule NE sont PAS équivalents l'un à l'autre : leurs environnements chimiques diffèrent (l'un est lié au carbonyle, l'autre au CH₂ de l'éthyle). Il y a donc 3 groupes distincts : CH₃(acétyle), CH₂, CH₃(éthyle)."
      },
      {
        id: 'a1-ex3', competences: ['C2'], type: 'numeric',
        enonce: "Le propan-2-ol (C₃H₈O, 8 H au total) donne un spectre à 3 signaux d'aires mesurées 24, 4 et 4 (unités arbitraires). Combien de protons sont responsables du signal d'aire 24 ?",
        unite: "protons", reponse: 6, tolerance: { type: 'abs', value: 0 },
        indices: [
          "La somme des aires (24+4+4=32) correspond aux 8 H de la molécule : quel est le facteur d'échelle aire → protons ?",
          "Facteur = 8/32 = 0,25 proton par unité d'aire."
        ],
        explication: "Facteur d'échelle = 8/(24+4+4) = 0,25. Le signal d'aire 24 correspond donc à 24×0,25 = 6 protons (les deux CH₃ équivalents, 6H au total)."
      },
      {
        id: 'a1-ex4', competences: ['C2'], type: 'single',
        enonce: "Un élève affirme : « Sur le spectre de la propanone, le signal à 2,17 ppm est une seule raie fine, donc il correspond à 1 seul proton. » Quelle est l'erreur de ce raisonnement ?",
        figureMol: 'propanone-all',
        options: [
          "Il confond l'aspect visuel d'un singulet (une seule raie) avec le nombre de protons : l'intégration (l'aire du signal) vaut ici 6H, pas 1H",
          "Il n'y a pas d'erreur : le raisonnement est juste",
          "L'erreur est que ce signal devrait en réalité être un triplet"
        ], correct: 0,
        indices: ["Combien de CH₃ porte la propanone, et combien d'hydrogènes portent-ils au total ?"],
        explication: "Un singulet n'a qu'une seule raie, mais cela ne dit rien sur son intégration : les deux CH₃ équivalents de la propanone (6H) donnent justement un singulet unique, d'aire 6 fois plus grande qu'un signal de 1H."
      }
    ]
  },

  // ===================== ACTIVITÉ 2 =====================
  {
    id: 'A2', n: 2, titre: "Déplacement chimique", competences: ['C3'],
    objectif: "Situer un signal sur l'échelle δ, associer un domaine de déplacement chimique à un environnement, comparer deux groupes de protons et repérer un groupe potentiellement déblindé.",
    rappel: "δ se mesure en ppm, axe gradué avec les valeurs élevées à gauche. Plus un groupe de protons est proche d'un atome ou groupe électroattracteur (O, halogène, C=O, cycle aromatique), plus il est déblindé (δ élevé).",
    exercices: [
      {
        id: 'a2-ex1', competences: ['C3'], type: 'numeric',
        enonce: "D'après la table de déplacements chimiques du cours, à partir de quelle valeur de δ (borne inférieure, en ppm) la zone des protons aromatiques commence-t-elle ?",
        unite: "ppm", reponse: 6.5, tolerance: { type: 'abs', value: 0.3 },
        indices: ["Reviens à la page Cours, section « Déplacement chimique », et regarde la plage indiquée pour les protons aromatiques."],
        explication: "La zone des protons aromatiques est indiquée entre 6,5 et 8,5 ppm environ."
      },
      {
        id: 'a2-ex2', competences: ['C3'], type: 'single',
        enonce: "Un CH₂ est directement lié à un atome de brome (fragment –CH₂–Br). Dans quelle gamme de δ attend-on ce signal ?",
        options: [
          "Vers 3-4 ppm, par analogie avec l'effet déblindant d'un atome électronégatif proche, comme pour un CH₂ lié à l'oxygène",
          "Vers 0,8-1,0 ppm, comme un CH₃ aliphatique isolé",
          "Vers 6,5-8,5 ppm, comme un proton aromatique"
        ], correct: 0,
        indices: ["Le brome est un atome électronégatif : quel effet a-t-il sur le blindage des protons voisins, par comparaison avec l'oxygène ?"],
        explication: "Un halogène électronégatif déblinde fortement les protons voisins, par un effet comparable (quoique légèrement différent en intensité) à celui d'un oxygène : le CH₂ du bromoéthane apparaît ainsi vers 3,4 ppm, une valeur bien plus élevée qu'un CH₂ purement aliphatique."
      },
      {
        id: 'a2-ex3', competences: ['C3'], type: 'single',
        enonce: "Entre le CH₃ de l'éthanol (voisin d'un CH₂–OH, δ≈1,24 ppm) et le CH₃ de la propanone (voisin d'un C=O, δ≈2,17 ppm), lequel est le plus déblindé ?",
        figureMol: 'propanone-plain',
        options: [
          "Le CH₃ de la propanone : il est directement lié au carbone du groupe carbonyle, fortement électroattracteur",
          "Le CH₃ de l'éthanol : l'oxygène de l'alcool est plus électronégatif que celui du carbonyle",
          "Les deux CH₃ ont rigoureusement le même déplacement chimique"
        ], correct: 0,
        indices: ["Lequel des deux CH₃ est le plus proche, en nombre de liaisons, d'un atome électroattracteur ?"],
        explication: "Le CH₃ de la propanone est lié directement au carbone du carbonyle (très électroattracteur), alors que le CH₃ de l'éthanol est séparé de l'oxygène par un CH₂ intermédiaire. Le CH₃ de la propanone est donc plus déblindé (δ plus élevé)."
      },
      {
        id: 'a2-ex4', competences: ['C3'], type: 'single',
        enonce: "L'éthanoate d'éthyle présente trois signaux : CH₃(acétyle) à 2,04 ppm, O–CH₂ à 4,12 ppm, CH₃(éthyle) à 1,26 ppm. Lequel de ces trois groupes est le plus déblindé ?",
        figureMol: 'ethylacetate-all',
        options: ["Le O–CH₂, à 4,12 ppm", "Le CH₃(acétyle), à 2,04 ppm", "Le CH₃(éthyle), à 1,26 ppm"], correct: 0,
        indices: ["Le groupe le plus déblindé est celui dont le δ est le plus élevé."],
        explication: "Le O–CH₂ est directement lié à l'oxygène de l'ester, ce qui le déblinde fortement (δ=4,12 ppm), davantage que le CH₃ lié au carbonyle (2,04 ppm) ou le CH₃ de l'éthyle, plus éloigné de tout groupe électroattracteur (1,26 ppm)."
      }
    ]
  },

  // ===================== ACTIVITÉ 3 =====================
  {
    id: 'A3', n: 3, titre: "Couplages simples", competences: ['C4'],
    objectif: "Appliquer la règle n+1 dans les conditions où elle est valable, identifier les multiplets du premier ordre, et distinguer les protons responsables d'un signal de ceux responsables de son dédoublement.",
    rappel: "Règle n+1 : n voisins équivalents entre eux, partageant la même constante J, donnent (n+1) raies. Les protons D'UN signal (son intégration) et les protons VOISINS (responsables de sa multiplicité) sont deux groupes différents.",
    exercices: [
      {
        id: 'a3-ex1', competences: ['C4'], type: 'single',
        enonce: "Un CH₂ est encadré, d'un seul côté, par un CH₃ (3H) ; de l'autre côté, il est lié à un atome ne portant aucun hydrogène (ex. un atome de brome). Quelle multiplicité attend-on pour ce CH₂ ?",
        options: ["Un quadruplet (4 raies)", "Un triplet (3 raies)", "Un quintuplet (5 raies)"], correct: 0,
        indices: ["Combien de voisins porteurs d'hydrogène ce CH₂ a-t-il au total ? Applique n+1."],
        explication: "Le CH₂ n'a qu'un seul voisin porteur de H : le CH₃ (3H). n=3, donc n+1=4 raies : un quadruplet (c'est le cas du CH₂ du bromoéthane)."
      },
      {
        id: 'a3-ex2', competences: ['C4'], type: 'single',
        enonce: "Un signal comporte 2 raies d'intensités égales. Quelle est sa multiplicité, et combien de protons voisins couplants cela indique-t-il ?",
        options: ["Un doublet : 1 proton voisin", "Un triplet : 2 protons voisins", "Un singulet : 0 proton voisin"], correct: 0,
        indices: ["Applique n+1 à l'envers : si (n+1)=2, combien vaut n ?"],
        explication: "2 raies = doublet, donc n+1=2, soit n=1 : un seul proton voisin couplant (typiquement un CH)."
      },
      {
        id: 'a3-ex3', competences: ['C4'], type: 'single',
        enonce: "Dans le fragment éthyle CH₃–CH₂–X (X ne portant pas de H), quelles sont les multiplicités respectives attendues pour le CH₃ et pour le CH₂ ?",
        options: ["Triplet pour CH₃, quadruplet pour CH₂", "Quadruplet pour CH₃, triplet pour CH₂", "Doublet pour CH₃, triplet pour CH₂"], correct: 0,
        indices: ["Le CH₃ a pour voisin les 2H du CH₂ ; le CH₂ a pour voisin les 3H du CH₃. Applique n+1 séparément à chacun."],
        explication: "Le CH₃ (3H) est voisin du CH₂ (2H) : n=2 → triplet. Le CH₂ (2H) est voisin du CH₃ (3H) : n=3 → quadruplet. C'est le motif « triplet-quadruplet couplés » caractéristique d'un fragment éthyle."
      },
      {
        id: 'a3-ex4', competences: ['C4'], type: 'single',
        enonce: "Pour le triplet du CH₃ de l'éthanol, quels protons sont responsables DE L'INTÉGRATION du signal, et lesquels sont responsables DE SA MULTIPLICITÉ (son dédoublement) ?",
        options: [
          "Les 3H du CH₃ lui-même sont responsables de l'intégration ; les 2H du CH₂ voisin sont responsables du dédoublement",
          "Les 2H du CH₂ voisin sont responsables de l'intégration ; les 3H du CH₃ sont responsables du dédoublement",
          "Les mêmes protons (les 3H du CH₃) sont responsables à la fois de l'intégration et du dédoublement"
        ], correct: 0,
        indices: ["L'intégration mesure toujours les protons DU signal observé. Le dédoublement provient toujours de protons VOISINS, non équivalents à ceux du signal."],
        explication: "Il faut toujours distinguer : le signal (son intégration) est dû aux protons qui résonnent à ce δ (ici les 3H du CH₃) ; sa multiplicité (dédoublement) est due aux protons NON équivalents portés par l'atome voisin (ici les 2H du CH₂)."
      }
    ]
  },

  // ===================== ACTIVITÉ 4 =====================
  {
    id: 'A4', n: 4, titre: "Couplages multiples et superpositions", competences: ['C5', 'C4'],
    objectif: "Identifier deux groupes de voisins non équivalents, appliquer successivement deux dédoublements avec des constantes J distinctes, et comprendre la superposition de raies lorsque J₁ ≈ J₂.",
    rappel: "Avec deux groupes de voisins non équivalents entre eux (m protons, J₁) et (p protons, J₂), le massif résulte de deux dédoublements successifs. Si J₁ = J₂, de nombreuses raies coïncident : le massif ressemble alors à un multiplet simple de (m+p+1) raies.",
    simulateurJ: true,
    exercices: [
      {
        id: 'a4-ex1', competences: ['C5'], type: 'single',
        enonce: "Dans le propan-1-ol CH₃–CH₂–CH₂–OH, quels sont les deux groupes de voisins non équivalents entre eux du CH₂ central ?",
        figureMol: 'propan1ol-plain',
        options: ["Le CH₃ (3H) et le CH₂–OH (2H)", "Le CH₃ (3H) et le OH (1H)", "Uniquement le CH₃ (3H)"], correct: 0,
        indices: ["Le CH₂ central est lié à deux atomes de carbone porteurs d'hydrogène : lesquels ?"],
        explication: "Le CH₂ central est encadré par le CH₃ (3H, constante J₁) d'un côté et le CH₂–OH (2H, constante J₂) de l'autre : ce sont deux groupes de voisins distincts, non équivalents entre eux."
      },
      {
        id: 'a4-ex2', competences: ['C5'], type: 'numeric',
        enonce: "Un proton est couplé à un premier groupe de 1H (constante J₁) puis à un second groupe de 2H (constante J₂), avec J₁ = J₂ (superposition totale, comme si l'on appliquait n+1 à l'ensemble des voisins). Combien de raies au total le massif observé comporte-t-il ? (Utilise le simulateur J₁/J₂ ci-dessous pour vérifier.)",
        unite: "raies", reponse: 4, tolerance: { type: 'abs', value: 0 },
        indices: ["Avec J₁=J₂, le nombre total de voisins « ressentis » est 1+2=3. Applique n+1 à ce total."],
        explication: "Avec J₁=J₂, tout se passe comme si le proton observé avait 1+2=3 voisins équivalents : n+1=4 raies, dans un rapport d'intensités 1:3:3:1 (ligne du triangle de Pascal pour n=3)."
      },
      {
        id: 'a4-ex3', competences: ['C5'], type: 'single',
        enonce: "Pourquoi des constantes J₁ et J₂ égales produisent-elles une superposition de raies, alors que des J₁ et J₂ très différentes donnent un massif plus étalé, aux raies bien séparées ?",
        options: [
          "Parce que l'écart entre les raies issues de chaque dédoublement dépend directement de la valeur de J : des J égaux placent les raies aux mêmes positions, des J différents les décalent",
          "Parce que le nombre de raies dépend lui-même de la valeur de J, et non du nombre de voisins",
          "Parce qu'un couplage n'est observable que si J₁ et J₂ sont égales"
        ], correct: 0,
        indices: ["La position de chaque raie, après un dédoublement, est décalée d'une quantité proportionnelle à J (en Hz). Que se passe-t-il si deux dédoublements utilisent le même J ?"],
        explication: "Chaque dédoublement déplace les raies d'un multiple de sa constante J. Si J₁=J₂, certaines raies des deux dédoublements tombent exactement à la même position (elles se superposent, leurs intensités s'additionnent) ; si J₁ et J₂ sont très différentes, les raies restent séparées et le massif comporte jusqu'à (m+1)×(p+1) raies distinctes."
      },
      {
        id: 'a4-ex4', competences: ['C5'], type: 'numeric',
        enonce: "Un groupe de protons est couplé à deux ensembles de voisins non équivalents, l'un de 2H, l'autre de 3H, avec des constantes J nettement différentes (aucune superposition). Combien de raies au maximum le massif peut-il théoriquement comporter ?",
        unite: "raies", reponse: 12, tolerance: { type: 'abs', value: 0 },
        indices: ["Sans superposition, chaque dédoublement multiplie le nombre de raies : (m+1) raies pour le premier groupe, chacune ensuite dédoublée en (p+1) par le second."],
        explication: "Sans aucune superposition, le nombre maximal de raies est (m+1)×(p+1) = (2+1)×(3+1) = 3×4 = 12 raies — un « doublet de quadruplets » ou « quadruplet de doublets » selon l'ordre des dédoublements."
      }
    ]
  },

  // ===================== ACTIVITÉ 5 =====================
  {
    id: 'A5', n: 5, titre: "Attribution d'un spectre RMN complet", competences: ['C6'],
    objectif: "Exploiter simultanément le déplacement chimique, l'intégration et la multiplicité pour attribuer la totalité des signaux d'un spectre, en remplissant un tableau d'attribution complet.",
    rappel: "Méthode (fiche détaillée accessible depuis cette page) : identifier les signaux, lire les intégrations, examiner les δ, analyser les multiplicités, construire les fragments, vérifier l'ensemble.",
    spectreId: 'ethylacetate',
    exercices: [
      {
        id: 'a5-ex1', competences: ['C6'], type: 'single',
        enonce: "Sur le spectre de l'éthanoate d'éthyle, un signal est un singulet à 2,04 ppm intégrant pour 3H. À quel groupe de protons l'attribuer ?",
        options: ["Le CH₃ lié au carbonyle (acétyle)", "Le CH₂ de l'éthyle", "Le CH₃ de l'éthyle"], correct: 0,
        indices: ["Un singulet indique l'absence de voisin porteur de H : quel CH₃ de la molécule est dans ce cas ?"],
        explication: "Le CH₃ lié au carbonyle n'a aucun voisin porteur d'hydrogène (le carbone du carbonyle n'en porte pas) : il apparaît donc en singulet, à un δ modéré (2,04 ppm) typique d'un CH₃ voisin d'un C=O."
      },
      {
        id: 'a5-ex2', competences: ['C6'], type: 'single',
        enonce: "Un second signal est un quadruplet à 4,12 ppm intégrant pour 2H. À quel groupe de protons l'attribuer ?",
        options: ["Le O–CH₂ de l'éthyle", "Le CH₃ de l'éthyle", "Le CH₃ de l'acétyle"], correct: 0,
        indices: ["Le δ élevé (4,12 ppm) signale un CH₂ proche de l'oxygène. Un quadruplet indique 3 voisins porteurs de H : lesquels ?"],
        explication: "Le CH₂ de l'éthyle, lié à l'oxygène de l'ester, est fortement déblindé (4,12 ppm) et couplé aux 3H du CH₃ de l'éthyle voisin : quadruplet, 2H."
      },
      {
        id: 'a5-ex3', competences: ['C6'], type: 'single',
        enonce: "Le troisième signal est un triplet à 1,26 ppm intégrant pour 3H. Quelle paire signal/attribution est cohérente, ET comment vérifier que ce triplet est bien couplé au quadruplet à 4,12 ppm (et non à un autre signal) ?",
        options: [
          "CH₃ de l'éthyle ; les deux signaux partagent la même constante de couplage J, signe qu'ils sont mutuellement couplés",
          "CH₃ de l'acétyle ; leurs δ sont proches, ce qui suffit à les relier",
          "O–CH₂ de l'éthyle ; leur intégration est identique"
        ], correct: 0,
        indices: ["Deux signaux mutuellement couplés doivent présenter exactement la même constante J (en Hz), pas seulement un δ proche."],
        explication: "Le CH₃ de l'éthyle (triplet, 1,26 ppm, 3H) est couplé au CH₂ de l'éthyle : on le vérifie en comparant les constantes J des deux multiplets, qui doivent être égales (≈7,1 Hz ici) — un critère plus fiable qu'une simple proximité de δ."
      },
      {
        id: 'a5-ex4', competences: ['C6'], type: 'single',
        enonce: "La somme des intégrations des trois signaux (3H + 2H + 3H = 8H) est-elle cohérente avec la formule brute C₄H₈O₂ de l'éthanoate d'éthyle ?",
        options: ["Oui : la formule brute comporte exactement 8 atomes d'hydrogène", "Non, il manque des protons non détectés", "Non, il y a trop de protons comptés"], correct: 0,
        indices: ["Compte les H dans la formule C₄H₈O₂."],
        explication: "C₄H₈O₂ comporte bien 8 atomes d'hydrogène, répartis en 3 groupes de 3H, 2H et 3H : l'attribution complète est cohérente avec la formule brute, dernière étape indispensable de la méthode."
      }
    ]
  },

  // ===================== ACTIVITÉ 6 =====================
  {
    id: 'A6', n: 6, titre: "Identifier une molécule inconnue", competences: ['C7'],
    objectif: "Confirmer ou départager des structures candidates à partir d'un spectre RMN complet, en mobilisant toutes les compétences précédentes, avec un éventuel appui sur l'infrarouge.",
    rappel: "Pour distinguer des isomères, comparer systématiquement le nombre de signaux, leurs intégrations, leurs multiplicités ET la présence ou l'absence de signaux échangeables (OH, NH).",
    exercices: [
      {
        id: 'a6-ex1', competences: ['C7'], type: 'single',
        enonce: "Un spectre présente 3 signaux : un doublet à 1,19 ppm (6H), un septuplet à 4,04 ppm (1H), un singulet large à 2,60 ppm (1H). Parmi le propan-1-ol, le propan-2-ol et le méthoxyéthane (tous trois C₃H₈O), laquelle de ces structures est compatible ?",
        options: ["Le propan-2-ol", "Le propan-1-ol", "Le méthoxyéthane"], correct: 0,
        indices: ["Un doublet de 6H évoque deux CH₃ équivalents couplés à un seul voisin : quelle structure comporte deux CH₃ symétriques autour d'un même CH ?"],
        explication: "Le doublet 6H (deux CH₃ équivalents, 1 seul voisin) couplé à un septuplet 1H (voisin de 6H équivalents) est la signature caractéristique du propan-2-ol : (CH₃)₂CH–OH. Le singulet large à 2,60 ppm confirme la présence d'un OH."
      },
      {
        id: 'a6-ex2', competences: ['C7'], type: 'single',
        enonce: "Pourquoi la structure du propan-1-ol (CH₃–CH₂–CH₂–OH) est-elle incompatible avec ce même spectre (doublet 6H + septuplet 1H + singulet 1H), bien que sa formule brute soit identique ?",
        figureMol: 'propan1ol-plain',
        options: [
          "Le propan-1-ol ne comporte pas deux CH₃ équivalents ni de CH central : son spectre attendu est très différent (triplet, multiplet, triplet, singulet)",
          "Le propan-1-ol a une formule brute différente, donc ne peut pas être comparé",
          "Le propan-1-ol ne possède pas de proton OH"
        ], correct: 0,
        indices: ["Décris les groupes de protons du propan-1-ol : CH₃, CH₂ central, CH₂–OH, OH. Combien de signaux, et de quelles multiplicités ?"],
        explication: "Le propan-1-ol comporte 4 groupes distincts (CH₃, CH₂ central, CH₂–OH, OH), donnant un triplet (3H), un massif proche d'un sextuplet (2H), un triplet (2H) et un singulet large (1H) — un profil entièrement différent du spectre donné, qui ne comporte que 3 signaux dont un massif de 6H."
      },
      {
        id: 'a6-ex3', competences: ['C7'], type: 'single',
        enonce: "Un autre spectre, de même formule C₃H₈O, ne présente AUCUN signal large caractéristique d'un proton échangeable et comporte un singulet à 3,33 ppm (3H). Quelle structure est compatible ?",
        figureMol: 'methoxyethane-plain',
        options: ["Le méthoxyéthane (éther)", "Le propan-1-ol (alcool)", "Le propan-2-ol (alcool)"], correct: 0,
        indices: ["L'absence de signal échangeable élimine toute structure comportant un OH."],
        explication: "L'absence de proton échangeable élimine les deux alcools. Le singulet à 3,33 ppm (3H) correspond à un OCH₃ sans voisin porteur de H : seul le méthoxyéthane est compatible."
      },
      {
        id: 'a6-ex4', competences: ['C7'], type: 'single',
        enonce: "Pour confirmer qu'un composé inconnu de formule C₃H₈O est bien un alcool et non un éther, un spectre infrarouge est enregistré : une large bande d'absorption est observée vers 3300 cm⁻¹. Que permet de conclure cette observation ?",
        options: [
          "Cette bande large est caractéristique d'une liaison O–H : le composé est un alcool, pas un éther (qui n'a pas de liaison O–H)",
          "Cette bande correspond à la liaison C–O, présente aussi bien dans les alcools que dans les éthers : elle ne permet aucune conclusion",
          "Cette bande indique la présence d'un groupe carbonyle C=O"
        ], correct: 0,
        indices: ["La RMN seule peut parfois laisser un doute entre deux candidats très proches ; l'IR apporte une information complémentaire sur les liaisons présentes, notamment O–H."],
        explication: "Une bande large vers 3200-3550 cm⁻¹ est la signature caractéristique d'une liaison O–H (alcool). Un éther comme le méthoxyéthane n'a pas de liaison O–H et ne présente pas cette bande : l'IR permet ici de confirmer sans ambiguïté la nature alcool de la structure, en complément de la RMN."
      }
    ]
  }
];
