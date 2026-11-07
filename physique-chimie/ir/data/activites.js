/*
 * Les six activités du parcours d'apprentissage. Même schéma que le module
 * RMN (cf. physique-chimie/rmn/data/activites.js) : indices progressifs,
 * approche socratique (mauvaise réponse -> indice -> nouvelle tentative ->
 * explication complète), gérée par js/ui-components.js.
 *
 * NOTE D'IMPLÉMENTATION : le prompt d'origine a été tronqué au milieu de la
 * liste d'exercices de l'activité 5 ; les exercices de l'activité 5 (à
 * partir du 2e) et la totalité de l'activité 6 ont été complétés en miroir
 * de la structure du module RMN (même format, mêmes principes pédagogiques),
 * conformément aux objectifs et compétences explicitement donnés pour ces
 * deux activités.
 */
window.IR_ACTIVITES = [
  // ===================== ACTIVITÉ 1 =====================
  {
    id: 'A1', n: 1, titre: "Lire un spectre IR", competences: ['C1', 'C2'],
    objectif: "Lire les axes d'un spectre IR, distinguer transmittance et absorbance, déterminer la position des bandes, reconnaître leur largeur et leur intensité.",
    rappel: "Nombre d'onde $\\sigma = 1/\\lambda$ (cm⁻¹), axe gradué avec les valeurs élevées à gauche. En transmittance, une absorption forte donne un creux ; en absorbance, la même absorption donne un pic.",
    exercices: [
      {
        id: 'a1-ex1', competences: ['C1', 'C2'], type: 'single',
        enonce: "Sur un spectre tracé en transmittance, où se situent les creux d'absorption ?",
        options: ["Vers des valeurs de transmittance plus basses (minima locaux)", "Vers 100 %, l'absorption maximisant la transmittance", "Les creux n'existent pas en transmittance, seulement en absorbance"], correct: 0,
        indices: ["La transmittance T=I/I₀ diminue quand l'échantillon absorbe davantage de rayonnement."],
        explication: "Une absorption importante réduit I par rapport à I₀ : T diminue, ce qui se traduit par un creux sur le tracé."
      },
      {
        id: 'a1-ex2', competences: ['C1'], type: 'numeric',
        enonce: "Une bande d'absorption correspond à λ = 6,0 µm (1 µm = 10⁻⁴ cm). Calcule le nombre d'onde correspondant, en cm⁻¹.",
        unite: "cm⁻¹", reponse: 1667, tolerance: { type: 'abs', value: 40 },
        indices: ["Utilise $\\sigma = 1/\\lambda$, avec λ converti en cm."],
        explication: "$\\sigma = 1/(6{,}0\\times10^{-4}\\,\\text{cm}) \\approx 1667\\,\\text{cm}^{-1}$."
      },
      {
        id: 'a1-ex3', competences: ['C1'], type: 'single',
        enonce: "Le même spectre est désormais tracé en absorbance plutôt qu'en transmittance. Que devient un creux de transmittance ?",
        options: ["Un pic (maximum local), à la même position en nombre d'onde", "Un creux, à la même position", "Il disparaît, l'absorbance n'enregistrant pas cette information"], correct: 0,
        indices: ["$A=-\\log_{10}(T)$ : quand T diminue (creux), que fait $-\\log_{10}(T)$ ?"],
        explication: "Quand T diminue, $-\\log_{10}(T)$ augmente : un creux de transmittance devient un pic (maximum) d'absorbance, à la même position en nombre d'onde."
      },
      {
        id: 'a1-ex4', competences: ['C2'], type: 'single',
        enonce: "Bande A : la transmittance descend jusqu'à 20 %. Bande B : elle ne descend qu'à 70 %. Laquelle est la plus intense ?",
        options: ["La bande A", "La bande B", "Les deux bandes ont la même intensité"], correct: 0,
        indices: ["Plus la transmittance minimale est basse, plus l'absorption — donc l'intensité de la bande — est forte."],
        explication: "La bande A, dont la transmittance descend le plus bas, correspond à l'absorption la plus intense."
      },
      {
        id: 'a1-ex5', competences: ['C1', 'C2'], type: 'single',
        enonce: "Une bande est centrée à 1715 cm⁻¹. Se situe-t-elle dans la région des groupes caractéristiques (au-dessus de 1500 cm⁻¹) ou dans la région de l'empreinte digitale (en dessous de 1500 cm⁻¹) ?",
        options: ["Dans la région des groupes caractéristiques (1715 > 1500)", "Dans la région de l'empreinte digitale", "Exactement à la frontière entre les deux régions"], correct: 0,
        indices: [],
        explication: "1715 cm⁻¹ est supérieur à 1500 cm⁻¹ : cette bande (ici un C=O) appartient à la région des groupes caractéristiques."
      }
    ]
  },

  // ===================== ACTIVITÉ 2 =====================
  {
    id: 'A2', n: 2, titre: "Reconnaître les liaisons caractéristiques", competences: ['C2', 'C3'],
    objectif: "Reconnaître les liaisons O–H, N–H, C–H, C=O, C=C et C–O à l'aide des tables, et distinguer bandes fortes, faibles, larges et étroites.",
    rappel: "Table de référence (page Cours) : O–H alcool 3200-3600, O–H acide 2500-3300 (très large), N–H ≈3300-3500, C–H aliphatique 2850-3000, C=O 1650-1800, C=C 1450-1680, C–O 1000-1300 cm⁻¹.",
    spectreId: 'ethanol',
    exercices: [
      {
        id: 'a2-ex1', competences: ['C3'], type: 'single',
        enonce: "Le spectre de l'éthanol présente une bande large et intense à 3350 cm⁻¹. À quelle liaison l'associer ?",
        figureMol: 'ethanol-plain',
        options: ["O–H d'alcool", "C=O", "C–H aliphatique"], correct: 0,
        indices: ["Consulte la table de déplacements : quelle liaison absorbe, large et intense, entre 3200 et 3600 cm⁻¹ ?"],
        explication: "3350 cm⁻¹, bande large, correspond à l'O–H d'un alcool engagé dans des liaisons hydrogène."
      },
      {
        id: 'a2-ex2', competences: ['C3'], type: 'single',
        enonce: "Toujours sur le spectre de l'éthanol, une bande forte apparaît à 1050 cm⁻¹. Quelle liaison l'explique le mieux ?",
        figureMol: 'ethanol-plain',
        options: ["C–O", "C=O", "N–H"], correct: 0,
        indices: ["1050 cm⁻¹ appartient à la zone 1000-1300 cm⁻¹ de la table."],
        explication: "La zone 1000-1300 cm⁻¹, pour une bande forte, est celle de la liaison C–O — cohérent avec la structure d'un alcool."
      },
      {
        id: 'a2-ex3', competences: ['C2', 'C3'], type: 'single',
        enonce: "Un élève attribue la bande à 2950 cm⁻¹ du spectre de l'éthanol à une liaison O–H. Quelle est l'erreur ?",
        options: ["2950 cm⁻¹ appartient à la zone des C–H aliphatiques (2850-3000 cm⁻¹), pas à celle de O–H (3200-3600 cm⁻¹)", "Il n'y a pas d'erreur : 2950 cm⁻¹ est bien dans la zone O–H", "L'erreur est que cette bande ne devrait pas du tout apparaître sur le spectre"], correct: 0,
        indices: ["Compare 2950 cm⁻¹ aux deux zones (O–H : 3200-3600 ; C–H : 2850-3000)."],
        explication: "2950 cm⁻¹ est dans la zone 2850-3000 cm⁻¹, celle des C–H aliphatiques, nettement distincte de la zone O–H (3200-3600 cm⁻¹)."
      },
      {
        id: 'a2-ex4', competences: ['C3'], type: 'single',
        enonce: "Entre l'éthanol (bande O–H entre 3200 et 3600 cm⁻¹) et l'acide éthanoïque (bande O–H entre 2500 et 3300 cm⁻¹), lequel a la bande O–H la plus large ?",
        options: ["L'acide éthanoïque", "L'éthanol", "Les deux bandes ont la même largeur"], correct: 0,
        indices: ["Compare l'étendue de chaque intervalle : 2500-3300 (800 cm⁻¹) contre 3200-3600 (400 cm⁻¹)."],
        explication: "L'intervalle 2500-3300 cm⁻¹ de l'acide éthanoïque est environ deux fois plus étendu que celui de l'éthanol : sa bande O–H est exceptionnellement plus large."
      }
    ]
  },

  // ===================== ACTIVITÉ 3 =====================
  {
    id: 'A3', n: 3, titre: "Reconnaître les fonctions organiques", competences: ['C3', 'C4'],
    objectif: "Identifier les principales fonctions organiques et distinguer les signatures des alcools, acides, cétones, aldéhydes, esters et amides.",
    rappel: "Un C=O seul (sans O–H, N–H ni C–O intense supplémentaire) oriente vers une cétone ; avec C–O intense, vers un ester ; avec O–H très large, vers un acide ; avec N–H et un C=O plus bas, vers un amide.",
    exercices: [
      {
        id: 'a3-ex1', competences: ['C4'], type: 'single',
        enonce: "Un spectre présente une seule bande significative : un C=O intense vers 1715 cm⁻¹, sans O–H ni N–H ni bande C–O intense. Quelle famille est la plus probable ?",
        figureMol: 'propanone-plain',
        options: ["Une cétone", "Un alcool", "Une amine"], correct: 0,
        indices: ["Un alcool n'a pas de C=O ; une amine non plus. Quelle famille se caractérise justement par un C=O isolé ?"],
        explication: "Un C=O seul, sans aucun autre indice associé, oriente vers une cétone (par élimination des autres fonctions carbonylées qui s'accompagnent d'autres bandes)."
      },
      {
        id: 'a3-ex2', competences: ['C4'], type: 'single',
        enonce: "Spectre X : bande O–H entre 3200 et 3600 cm⁻¹, pas de C=O. Spectre Y : bande O–H entre 2500 et 3300 cm⁻¹, avec un C=O vers 1715 cm⁻¹. Lequel correspond à un acide carboxylique ?",
        options: ["Le spectre Y", "Le spectre X", "Les deux spectres correspondent à un acide carboxylique"], correct: 0,
        indices: ["Un acide carboxylique possède à la fois une bande O–H exceptionnellement large ET une bande C=O."],
        explication: "Seul le spectre Y présente la combinaison caractéristique d'un acide : O–H très large (2500-3300 cm⁻¹) ET C=O. Le spectre X, sans C=O, correspond à un simple alcool."
      },
      {
        id: 'a3-ex3', competences: ['C4'], type: 'single',
        enonce: "Le butan-2-one présente un C=O vers 1715 cm⁻¹ et aucune bande C–O intense. L'éthanoate d'éthyle présente un C=O vers 1740 cm⁻¹ ET une bande C–O intense vers 1240 cm⁻¹. Lequel est l'ester ?",
        figureMol: 'ethylacetate-plain',
        options: ["L'éthanoate d'éthyle", "Le butan-2-one", "Les deux sont des esters"], correct: 0,
        indices: ["Un C=O seul ne distingue pas un ester d'une cétone : quelle bande supplémentaire signe spécifiquement l'ester ?"],
        explication: "La présence d'une bande C–O intense en plus du C=O est la signature qui distingue un ester (éthanoate d'éthyle) d'une simple cétone (butan-2-one), dont le C=O est pourtant à une position très voisine."
      },
      {
        id: 'a3-ex4', competences: ['C3', 'C4'], type: 'single',
        enonce: "D'après la structure du propanamide (CH₃–CH₂–CO–NH₂), quelles bandes attend-on sur son spectre IR ?",
        figureMol: 'propanamide-plain',
        options: [
          "Une bande N–H ET un C=O nettement plus bas (≈1630-1700 cm⁻¹) que celui d'une cétone ou d'un ester",
          "Une bande O–H très large et un C=O vers 1715 cm⁻¹, comme un acide carboxylique",
          "Aucune bande caractéristique, l'amide n'absorbant pas en IR"
        ], correct: 0,
        indices: ["Le groupe caractéristique de l'amide est –CO–NH₂ : quelles liaisons porte-t-il ?"],
        explication: "Le propanamide porte un N–H (amide) et un C=O dont la position (≈1660 cm⁻¹) est nettement plus basse que celle d'une cétone, d'un ester ou d'un acide — une signature utile pour le distinguer des autres carbonyles."
      }
    ]
  },

  // ===================== ACTIVITÉ 4 =====================
  {
    id: 'A4', n: 4, titre: "Analyser des spectres présentant plusieurs bandes", competences: ['C4', 'C5'],
    objectif: "Croiser plusieurs bandes, comprendre les superpositions, repérer les indices insuffisants ou contradictoires, et interpréter les effets des liaisons hydrogène.",
    rappel: "Un spectre réel comporte presque toujours plusieurs bandes simultanément (C–H, C=O, C–O...) : il faut les examiner ENSEMBLE, sans se focaliser sur une seule, et éviter toute conclusion affirmative reposant sur un indice unique.",
    exercices: [
      {
        id: 'a4-ex1', competences: ['C4'], type: 'single',
        enonce: "L'éthanoate d'éthyle présente, en plus du C=O (1740 cm⁻¹) et de la bande C–O (1240 cm⁻¹), des bandes C–H aliphatiques vers 2970 cm⁻¹. Ces bandes C–H remettent-elles en cause l'identification de la fonction ester ?",
        figureMol: 'ethylacetate-plain',
        options: ["Non : les bandes C–H sont présentes dans presque toutes les molécules organiques et ne sont pas spécifiques d'une fonction particulière", "Oui : leur présence exclut toute fonction ester", "Oui : elles indiquent qu'il s'agit en réalité d'un alcool"], correct: 0,
        indices: ["Les C–H aliphatiques sont-ils spécifiques d'une fonction organique en particulier ?"],
        explication: "Les bandes C–H aliphatiques sont quasi systématiques dans les molécules organiques : elles ne remettent pas en cause une identification basée sur des bandes plus spécifiques (ici C=O + C–O)."
      },
      {
        id: 'a4-ex2', competences: ['C5'], type: 'single',
        enonce: "Un spectre présente simultanément : une bande N–H moyenne (3300-3500 cm⁻¹), des C–H aliphatiques, et un C=O vers 1660 cm⁻¹ (nettement plus bas qu'une cétone usuelle). Quelle fonction ce croisement d'indices désigne-t-il ?",
        figureMol: 'propanamide-plain',
        options: ["Un amide", "Une cétone simple", "Un alcool"], correct: 0,
        indices: ["Quelle fonction associe à la fois un N–H ET un C=O anormalement bas par rapport à une cétone ?"],
        explication: "La combinaison N–H + C=O décalé vers les basses valeurs (≈1660 cm⁻¹) est la signature caractéristique d'un amide."
      },
      {
        id: 'a4-ex3', competences: ['C5'], type: 'single',
        enonce: "Un spectre présente un C=O vers 1715 cm⁻¹, sans O–H, sans N–H, et sans bande C–O intense supplémentaire. Parmi cétone, ester et amide, laquelle de ces hypothèses reste la plus cohérente avec l'ENSEMBLE de ces indices ?",
        options: ["La cétone, par élimination des autres hypothèses (l'ester nécessiterait une bande C–O intense, l'amide un N–H)", "L'ester, car tout C=O évoque en priorité un ester", "L'amide, car le C=O est toujours associé à un amide"], correct: 0,
        indices: ["Pour chaque hypothèse, vérifie si un indice attendu est bien présent ou, au contraire, manquant."],
        explication: "L'ester exigerait une bande C–O intense (absente ici), l'amide un N–H (absent également) : seule l'hypothèse cétone reste pleinement cohérente avec l'ensemble des indices observés."
      },
      {
        id: 'a4-ex4', competences: ['C5'], type: 'single',
        enonce: "Un élève affirme : « Il y a une bande vers 1650 cm⁻¹, donc c'est forcément un alcène. » Que penser de cette affirmation ?",
        options: [
          "Elle est trop affirmative : 1650 cm⁻¹ peut aussi correspondre à un C=O d'amide ou à des bandes C=C aromatiques ; il faut croiser d'autres indices avant de conclure",
          "Elle est juste : 1650 cm⁻¹ n'appartient qu'aux alcènes",
          "Elle est fausse : aucune liaison n'absorbe vers 1650 cm⁻¹"
        ], correct: 0,
        indices: ["Consulte la table : quelles autres liaisons peuvent absorber près de 1650 cm⁻¹ ?"],
        explication: "La zone proche de 1650 cm⁻¹ est partagée par plusieurs groupes (C=C d'alcène, C=O d'amide, C=C aromatique) : une seule bande, sans autre indice, ne permet jamais de conclure avec certitude."
      }
    ]
  },

  // ===================== ACTIVITÉ 5 =====================
  {
    id: 'A5', n: 5, titre: "Confirmer ou exclure une structure", competences: ['C5', 'C6'],
    objectif: "Construire un raisonnement d'identification, utiliser les indices positifs et négatifs, et éliminer méthodiquement les structures incompatibles.",
    rappel: "Un indice POSITIF (présence d'une bande attendue) renforce une hypothèse ; un indice NÉGATIF (absence d'une bande attendue) permet souvent d'EXCLURE une hypothèse — à condition que cette bande soit normalement intense et donc difficile à manquer si elle existait.",
    spectreId: 'aceticacid',
    exercices: [
      {
        id: 'a5-ex1', competences: ['C6'], type: 'single',
        enonce: "Quel indice confirmerait le plus fortement la présence d'une fonction ester dans une molécule inconnue ?",
        options: [
          "Un C=O vers 1735-1750 cm⁻¹ ET une bande C–O intense vers 1000-1300 cm⁻¹",
          "La seule présence de bandes C–H aliphatiques",
          "L'absence de toute bande au-dessus de 3000 cm⁻¹"
        ], correct: 0,
        indices: ["Un seul indice isolé suffit rarement : cherche la combinaison la plus spécifique de l'ester."],
        explication: "C'est la combinaison C=O (à une position légèrement plus élevée qu'une cétone) ET C–O intense qui confirme le plus solidement une fonction ester."
      },
      {
        id: 'a5-ex2', competences: ['C6'], type: 'single',
        enonce: "L'absence de toute bande entre 1650 et 1800 cm⁻¹ permet d'exclure avec le plus de confiance laquelle de ces structures candidates : un ester, un alcène, ou une amine ?",
        options: ["Un ester", "Un alcène", "Une amine"], correct: 0,
        indices: ["Laquelle de ces trois structures possède nécessairement une bande C=O dans cette zone, si elle était présente ?"],
        explication: "Un ester possède nécessairement un C=O intense dans la zone 1650-1800 cm⁻¹ : son absence permet de l'exclure avec confiance. L'alcène (C=C, zone différente) et l'amine (pas de C=O du tout) ne sont pas concernés par cette bande."
      },
      {
        id: 'a5-ex3', competences: ['C6'], type: 'single',
        enonce: "Un spectre présente : pas de bande O–H ni N–H, un C=O vers 1715 cm⁻¹, pas de bande C–O intense supplémentaire. Parmi alcool, acide carboxylique et cétone, élimine méthodiquement les structures incompatibles : laquelle reste compatible ?",
        options: ["La cétone", "L'alcool", "L'acide carboxylique"], correct: 0,
        indices: ["L'alcool n'a pas de C=O : incompatible. L'acide carboxylique nécessiterait une bande O–H très large : incompatible. Que reste-t-il ?"],
        explication: "L'alcool est exclu (pas de C=O attendu) et l'acide carboxylique est exclu (bande O–H très large attendue mais absente) : seule la cétone reste compatible avec ce spectre."
      },
      {
        id: 'a5-ex4', competences: ['C6'], type: 'single',
        enonce: "Un spectre présente un C=O vers 1715 cm⁻¹ et des C–H aliphatiques, sans autre bande visible. Le doublet C–H aldéhydique (souvent faible) n'est pas repéré. Comment classer la structure candidate « aldéhyde » : compatible, incompatible, ou indécidable ?",
        options: [
          "Indécidable : le doublet C–H aldéhydique est souvent faible et peut être présent sans être clairement visible sur le spectre",
          "Incompatible : l'absence du doublet exclut définitivement un aldéhyde",
          "Compatible avec certitude : le C=O suffit à confirmer un aldéhyde"
        ], correct: 0,
        indices: ["Le doublet C–H aldéhydique est-il toujours facile à repérer, même quand il existe ?"],
        explication: "Une bande faible, difficile à distinguer, ne peut pas être utilisée comme preuve d'absence définitive : la structure aldéhyde reste indécidable sur ce seul critère, ni confirmée ni formellement exclue."
      }
    ]
  },

  // ===================== ACTIVITÉ 6 =====================
  {
    id: 'A6', n: 6, titre: "Réaliser une identification complète", competences: ['C7'],
    objectif: "Départager des molécules candidates et construire une conclusion spectroscopique argumentée, en mobilisant toutes les compétences précédentes, avec un éventuel appui sur la RMN.",
    rappel: "Pour conclure, vérifier systématiquement la cohérence de CHAQUE bande du spectre avec la structure retenue, et écarter explicitement les structures incompatibles plutôt que de se contenter d'un indice favorable isolé.",
    exercices: [
      {
        id: 'a6-ex1', competences: ['C7'], type: 'single',
        enonce: "Un spectre présente : une bande N–H vers 3300-3500 cm⁻¹, des C–H aliphatiques, et un C=O vers 1660 cm⁻¹ (nettement plus bas qu'une cétone). Parmi cétone, amide et amine, quelle structure est compatible avec la TOTALITÉ de ces bandes ?",
        figureMol: 'propanamide-plain',
        options: ["Un amide", "Une amine", "Une cétone"], correct: 0,
        indices: ["La cétone n'a pas de N–H. L'amine n'a pas de C=O. Quelle structure possède les deux ?"],
        explication: "Seul l'amide possède à la fois un N–H ET un C=O décalé vers les basses valeurs : c'est la seule structure compatible avec la totalité du spectre."
      },
      {
        id: 'a6-ex2', competences: ['C7'], type: 'single',
        enonce: "Deux structures candidates de C=O très voisin (≈1715-1740 cm⁻¹) sont proposées : un ester et une cétone. Le spectre étudié présente, en plus du C=O, une bande C–O intense vers 1240 cm⁻¹. Laquelle retenir ?",
        options: ["L'ester", "La cétone", "Impossible de choisir sans spectre RMN"], correct: 0,
        indices: ["Quelle bande supplémentaire, parmi celles données, est spécifique de l'ester et absente d'une simple cétone ?"],
        explication: "La bande C–O intense supplémentaire est la signature qui permet de trancher en faveur de l'ester plutôt que de la cétone, dont le C=O serait pourtant à une position très proche."
      },
      {
        id: 'a6-ex3', competences: ['C7'], type: 'single',
        enonce: "Pourquoi la structure « acide propanoïque » est-elle incompatible avec un spectre ne présentant AUCUNE bande entre 2500 et 3300 cm⁻¹ ?",
        options: [
          "Parce qu'un acide carboxylique possède nécessairement une bande O–H exceptionnellement large dans cette zone, qui serait difficile à manquer si elle existait",
          "Parce qu'un acide carboxylique n'a jamais de bande C=O",
          "Parce que cette zone ne concerne que les composés inorganiques"
        ], correct: 0,
        indices: ["La bande O–H d'un acide carboxylique est-elle discrète ou, au contraire, très large et difficile à manquer ?"],
        explication: "La bande O–H d'un acide carboxylique est si large et caractéristique (2500-3300 cm⁻¹) que son absence totale permet raisonnablement d'exclure cette structure."
      },
      {
        id: 'a6-ex4', competences: ['C7'], type: 'single',
        enonce: "Un spectre IR révèle un C=O vers 1715 cm⁻¹, sans O–H ni N–H (cétone ou aldéhyde probable). Un spectre RMN complémentaire montre un UNIQUE singulet intégrant pour 6H vers 2,1 ppm, et aucun signal vers 9-10 ppm. Quelle structure est la plus cohérente avec l'ensemble de ces données ?",
        options: [
          "Une cétone symétrique comme la propanone : le singulet de 6H confirme deux CH₃ équivalents, et l'absence de signal vers 9-10 ppm exclut un proton aldéhydique",
          "Un aldéhyde : le singulet de 6H est typique d'un groupe CHO",
          "Un acide carboxylique : le C=O à lui seul suffit à l'affirmer"
        ], correct: 0,
        indices: ["Un proton aldéhydique en RMN apparaît typiquement très déblindé, vers 9-10 ppm : ce signal est-il présent ici ?"],
        explication: "L'IR seul laissait un doute entre cétone et aldéhyde. La RMN tranche : l'absence de signal vers 9-10 ppm élimine l'aldéhyde, et le singulet 6H confirme deux groupes CH₃ équivalents — cohérent avec une cétone symétrique comme la propanone. C'est un exemple direct de la capacité exigible du programme : confirmer une structure à partir de données IR ET RMN combinées."
      }
    ]
  }
];
