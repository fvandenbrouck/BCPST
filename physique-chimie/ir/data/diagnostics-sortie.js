/*
 * Diagnostics de sortie D1 à D6 : un diagnostic indépendant après chaque
 * activité, portant sur des situations différentes de celles utilisées
 * pendant l'activité correspondante (transfert des apprentissages). Les
 * indices disponibles diminuent progressivement de D1 à D6.
 */
window.IR_DIAGNOSTICS_SORTIE = {

  D1: {
    activite: 'A1', titre: "Diagnostic D1 — après l'activité 1", competences: ['C1', 'C2'],
    questions: [
      { id: 'd1-1', competences: ['C1'], difficulte: 1, type: 'single',
        enonce: "Sur un spectre tracé en ABSORBANCE, où se situent les bandes d'absorption ?",
        options: ["Vers des valeurs d'absorbance plus élevées (maxima locaux)", "Vers A = 0", "Les bandes n'apparaissent pas en absorbance"], correct: 0,
        indices: ["$A=-\\log_{10}(T)$ : que devient A quand T diminue (absorption) ?"],
        explication: "Quand l'absorption augmente, T diminue, donc $A=-\\log_{10}(T)$ augmente : les bandes apparaissent comme des pics (maxima)." },
      { id: 'd1-2', competences: ['C1'], difficulte: 2, type: 'numeric',
        enonce: "Une bande correspond à λ = 4,0 µm (1 µm = 10⁻⁴ cm). Calcule le nombre d'onde correspondant, en cm⁻¹.",
        unite: "cm⁻¹", reponse: 2500, tolerance: { type: 'abs', value: 50 },
        indices: ["$\\sigma = 1/\\lambda$."],
        explication: "$\\sigma = 1/(4{,}0\\times10^{-4}) = 2500\\,\\text{cm}^{-1}$." },
      { id: 'd1-3', competences: ['C2'], difficulte: 1, type: 'single',
        enonce: "Bande A : transmittance minimale 30 %. Bande B : transmittance minimale 85 %. Laquelle est la plus intense ?",
        options: ["La bande A", "La bande B", "Elles sont identiques"], correct: 0,
        indices: [],
        explication: "Plus la transmittance minimale est basse, plus l'absorption est forte : la bande A est la plus intense." },
      { id: 'd1-4', competences: ['C2'], difficulte: 2, type: 'single',
        enonce: "Bande A : s'étend de 3250 à 3500 cm⁻¹. Bande B : s'étend de 1710 à 1725 cm⁻¹. Laquelle est la plus large ?",
        options: ["La bande A (250 cm⁻¹ d'étendue)", "La bande B (15 cm⁻¹ d'étendue)", "Les deux bandes sont également larges"], correct: 0,
        indices: [],
        explication: "250 cm⁻¹ d'étendue (bande A) est nettement plus large que 15 cm⁻¹ (bande B)." },
      { id: 'd1-5', competences: ['C1', 'C2'], difficulte: 2, type: 'single',
        enonce: "Un spectre en absorbance présente deux pics, à 1715 cm⁻¹ et 3350 cm⁻¹. Si on le retrace en transmittance, que deviennent ces pics ?",
        options: ["Deux creux, aux mêmes positions en nombre d'onde", "Deux pics, mais décalés en position", "Un seul creux, les deux pics fusionnant"], correct: 0,
        indices: [],
        explication: "Transmittance et absorbance décrivent les mêmes absorptions, à la même position en nombre d'onde : un pic d'absorbance devient un creux de transmittance." },
      { id: 'd1-6', competences: ['C1', 'C2'], difficulte: 2, type: 'numeric',
        enonce: "La transmittance minimale mesurée pour une bande vaut 25 %. Calcule l'absorbance correspondante (arrondie à 0,01 près).",
        unite: "(sans unité)", reponse: 0.60, tolerance: { type: 'abs', value: 0.03 },
        indices: ["$A=-\\log_{10}(T)$, avec T=0,25 (fraction, pas pourcentage)."],
        explication: "$A = -\\log_{10}(0{,}25) \\approx 0{,}60$." }
    ]
  },

  D2: {
    activite: 'A2', titre: "Diagnostic D2 — après l'activité 2", competences: ['C2', 'C3'],
    questions: [
      { id: 'd2-1', competences: ['C3'], difficulte: 1, type: 'single',
        enonce: "Une bande moyenne, relativement étroite, apparaît entre 3300 et 3500 cm⁻¹, nettement moins large qu'une bande O–H d'alcool typique. Quelle liaison est la plus probable ?",
        options: ["N–H (amine)", "O–H (acide carboxylique)", "C–H aliphatique"], correct: 0,
        indices: ["Compare la largeur annoncée à celle d'un O–H d'alcool (large) et d'un N–H (plus étroit)."],
        explication: "Une bande dans cette zone, plus étroite qu'un O–H d'alcool, est caractéristique d'un N–H d'amine." },
      { id: 'd2-2', competences: ['C3'], difficulte: 2, type: 'single',
        enonce: "Un spectre présente deux bandes faibles rapprochées, vers 2720 et 2820 cm⁻¹. À quelle liaison les associer ?",
        options: ["Le doublet C–H aldéhydique", "Une bande C=O dédoublée", "Un artefact sans signification chimique"], correct: 0,
        indices: [],
        explication: "Ce doublet discret vers 2720-2820 cm⁻¹ est la signature caractéristique du C–H aldéhydique." },
      { id: 'd2-3', competences: ['C3'], difficulte: 2, type: 'multi',
        enonce: "Un spectre présente des bandes à 3350 cm⁻¹ (moyenne, moins large qu'un O–H d'alcool) et à 2950 cm⁻¹. Quelles liaisons identifier ? (plusieurs réponses)",
        options: ["N–H", "C–H aliphatique", "C=O", "O–H d'acide carboxylique"], correct: [0, 1],
        indices: [],
        explication: "3350 cm⁻¹ (moyenne, relativement étroite) correspond à N–H ; 2950 cm⁻¹ correspond aux C–H aliphatiques. Ni C=O ni O–H d'acide ne sont présents dans ce relevé." },
      { id: 'd2-4', competences: ['C3', 'C5'], difficulte: 2, type: 'single',
        enonce: "Un spectre présente À LA FOIS une bande O–H très large (2500-3300 cm⁻¹) ET une bande C=O vers 1715 cm⁻¹. Que permet de conclure le croisement de ces deux bandes ?",
        options: ["La molécule est très probablement un acide carboxylique", "La molécule est un simple alcool", "Ces deux bandes sont incompatibles entre elles et indiquent une erreur de mesure"], correct: 0,
        indices: [],
        explication: "C'est la combinaison O–H exceptionnellement large ET C=O qui signe spécifiquement un acide carboxylique." },
      { id: 'd2-5', competences: ['C3', 'C5'], difficulte: 2, type: 'single',
        enonce: "Un spectre présente une bande N–H moyenne (3300-3500 cm⁻¹) ET un C=O vers 1660 cm⁻¹ (plus bas qu'une cétone usuelle). Que permet de conclure ce croisement ?",
        options: ["La molécule est très probablement un amide", "La molécule est une simple amine", "La molécule est un acide carboxylique"], correct: 0,
        indices: [],
        explication: "N–H associé à un C=O anormalement bas est la signature typique d'un amide." },
      { id: 'd2-6', competences: ['C2', 'C3'], difficulte: 2, type: 'single',
        enonce: "Laquelle de ces deux bandes correspond le plus probablement à un C=O : une bande à 1650 cm⁻¹ d'intensité faible, ou une bande à 1715 cm⁻¹ d'intensité forte ?",
        options: ["La bande à 1715 cm⁻¹, forte (un C=O est généralement une bande forte)", "La bande à 1650 cm⁻¹, faible", "L'intensité ne permet pas de trancher entre les deux"], correct: 0,
        indices: [],
        explication: "Un C=O est généralement une bande forte ; une bande faible vers 1650 cm⁻¹ évoque plutôt un C=C (alcène ou aromatique), généralement plus faible." }
    ]
  },

  D3: {
    activite: 'A3', titre: "Diagnostic D3 — après l'activité 3", competences: ['C3', 'C4'],
    questions: [
      { id: 'd3-1', competences: ['C4'], difficulte: 2, type: 'single',
        enonce: "Spectre P : O–H entre 3200 et 3600 cm⁻¹, pas de C=O. Spectre Q : O–H entre 2600 et 3300 cm⁻¹, C=O vers 1715 cm⁻¹. Lequel est un alcool ?",
        options: ["Le spectre P", "Le spectre Q", "Les deux spectres correspondent à un alcool"], correct: 0,
        indices: [], explication: "Le spectre P, sans C=O et avec une bande O–H de largeur usuelle, correspond à un alcool ; le spectre Q, avec C=O et O–H très large, correspond à un acide." },
      { id: 'd3-2', competences: ['C4'], difficulte: 2, type: 'single',
        enonce: "Deux spectres ont un C=O à une position très voisine. Le premier présente en plus une bande C–O intense ; le second n'en présente aucune. Lequel est probablement un ester ?",
        options: ["Le premier (avec la bande C–O intense)", "Le second (sans bande C–O)", "Aucun des deux ne peut être un ester"], correct: 0,
        indices: [], explication: "La bande C–O intense supplémentaire est le critère qui distingue un ester d'une simple cétone de C=O voisin." },
      { id: 'd3-3', competences: ['C4', 'C5'], difficulte: 3, type: 'single',
        enonce: "Un spectre présente un C=O vers 1730 cm⁻¹ et, de façon discrète, un doublet faible vers 2720-2820 cm⁻¹. Quelle famille est la plus cohérente ?",
        options: ["Un aldéhyde", "Une cétone", "Un ester"], correct: 0,
        indices: [], explication: "Le doublet C–H aldéhydique, même discret, est un indice fort en faveur d'un aldéhyde ; une cétone ou un ester n'en présentent pas." },
      { id: 'd3-4', competences: ['C3'], difficulte: 2, type: 'single',
        enonce: "Un spectre présente un doublet N–H moyen (3300-3500 cm⁻¹) et aucune bande C=O. Quelle famille est compatible ?",
        options: ["Une amine", "Un amide", "Un acide carboxylique"], correct: 0,
        indices: [], explication: "Un amide et un acide carboxylique présentent tous deux un C=O, absent ici : seule l'amine reste compatible." },
      { id: 'd3-5', competences: ['C5'], difficulte: 3, type: 'single',
        enonce: "Un spectre présente un C=O vers 1715 cm⁻¹, mais la région 2700-2850 cm⁻¹ est de mauvaise qualité (bruit important), rendant impossible de confirmer ou d'exclure un éventuel doublet aldéhydique. Que peut-on conclure avec certitude ?",
        options: [
          "Seulement qu'il s'agit d'une fonction carbonylée simple (cétone ou aldéhyde) ; impossible de trancher entre les deux sans information supplémentaire fiable",
          "Qu'il s'agit certainement d'une cétone, puisque le doublet n'est pas visible",
          "Qu'il s'agit certainement d'un aldéhyde, le bruit cachant le doublet"
        ], correct: 0,
        indices: [], explication: "Une zone de mauvaise qualité ne permet ni de confirmer ni d'exclure une bande : la situation reste indécidable entre cétone et aldéhyde sur ce seul critère." },
      { id: 'd3-6', competences: ['C4'], difficulte: 2, type: 'single',
        enonce: "Un spectre présente un N–H et un C=O vers 1660 cm⁻¹ (nettement plus bas qu'un C=O d'ester typique à 1740 cm⁻¹). Pourquoi cette structure ne peut-elle pas être un ester ?",
        options: ["Un ester n'a pas de N–H, et son C=O est attendu à une position plus élevée (1735-1750 cm⁻¹)", "Un ester a toujours un C=O très bas, vers 1660 cm⁻¹", "Un ester possède toujours un N–H"], correct: 0,
        indices: [], explication: "Un ester ne porte pas de N–H et son C=O est attendu plus haut : ce spectre est incompatible avec un ester, mais cohérent avec un amide." }
    ]
  },

  D4: {
    activite: 'A4', titre: "Diagnostic D4 — après l'activité 4", competences: ['C4', 'C5'],
    questions: [
      { id: 'd4-1', competences: ['C4', 'C5'], difficulte: 3, type: 'single',
        enonce: "Un spectre comporte : une bande O–H très large (2500-3300 cm⁻¹), un C=O vers 1715 cm⁻¹, et une bande C–O vers 1250 cm⁻¹. Quelle fonction ce spectre désigne-t-il ?",
        options: ["Un acide carboxylique", "Un ester", "Un alcool"], correct: 0,
        indices: [], explication: "L'O–H exceptionnellement large, associé au C=O, signe l'acide carboxylique ; la bande C–O complète cette identification (elle appartient aussi au groupe acide, pas seulement à l'ester)." },
      { id: 'd4-2', competences: ['C4', 'C5'], difficulte: 3, type: 'single',
        enonce: "Un spectre comporte : une bande N–H (3300-3500 cm⁻¹), des C–H aliphatiques, et un C=O vers 1660 cm⁻¹. Quelle fonction ce spectre désigne-t-il ?",
        options: ["Un amide", "Une cétone", "Un alcool"], correct: 0,
        indices: [], explication: "N–H + C=O décalé vers les basses valeurs : signature de l'amide." },
      { id: 'd4-3', competences: ['C5'], difficulte: 3, type: 'single',
        enonce: "Un spectre est d'abord supposé être un ester, mais ne présente AUCUNE bande C–O intense entre 1000 et 1300 cm⁻¹. Que penser de cette hypothèse ?",
        options: ["Elle est affaiblie, voire incompatible : la bande C–O intense est un élément attendu et caractéristique d'un ester", "Elle est confirmée : un ester n'a pas besoin de bande C–O", "L'absence de cette bande n'a aucune importance pour trancher"], correct: 0,
        indices: [], explication: "L'absence d'une bande normalement attendue et caractéristique (ici C–O pour un ester) affaiblit fortement, voire exclut, l'hypothèse correspondante." },
      { id: 'd4-4', competences: ['C4', 'C5'], difficulte: 3, type: 'single',
        enonce: "Un spectre présente uniquement un C=O vers 1715 cm⁻¹ et des C–H aliphatiques (pas d'O–H, pas de N–H, pas de C–O intense). Quelle famille retenir ?",
        options: ["Une cétone", "Un ester", "Un amide"], correct: 0,
        indices: [], explication: "Par élimination (ester exigerait C–O intense, amide exigerait N–H), la cétone est la seule hypothèse cohérente avec l'ensemble des bandes." },
      { id: 'd4-5', competences: ['C5'], difficulte: 2, type: 'single',
        enonce: "Un élève affirme : « Il y a une bande vers 1250 cm⁻¹, donc c'est forcément un ester. » Que penser de cette affirmation ?",
        options: [
          "Elle est trop affirmative : la zone 1000-1300 cm⁻¹ (C–O) est partagée par plusieurs fonctions (alcool, acide, ester) ; il faut croiser d'autres bandes (notamment le C=O) avant de conclure",
          "Elle est juste : seule la fonction ester possède une bande C–O",
          "Elle est fausse : aucune fonction n'absorbe vers 1250 cm⁻¹"
        ], correct: 0,
        indices: [], explication: "La bande C–O, à elle seule, est partagée par plusieurs fonctions (alcool, acide, ester) : il faut toujours la croiser avec d'autres bandes avant de conclure." },
      { id: 'd4-6', competences: ['C1'], difficulte: 2, type: 'numeric',
        enonce: "Dans le cadre de l'analyse d'un spectre complexe, une bande est repérée à λ = 7,0 µm (1 µm = 10⁻⁴ cm). Calcule le nombre d'onde correspondant, en cm⁻¹.",
        unite: "cm⁻¹", reponse: 1429, tolerance: { type: 'abs', value: 40 },
        indices: [], explication: "$\\sigma = 1/(7{,}0\\times10^{-4}) \\approx 1429\\,\\text{cm}^{-1}$." }
    ]
  },

  D5: {
    activite: 'A5', titre: "Diagnostic D5 — après l'activité 5", competences: ['C5', 'C6'],
    spectreId: 'propanamide',
    questions: [
      { id: 'd5-1', competences: ['C6'], difficulte: 3, type: 'single',
        enonce: "Quel indice confirmerait le plus fortement la présence d'une fonction amide dans une molécule inconnue ?",
        options: ["Une bande N–H ET un C=O nettement plus bas (≈1630-1700 cm⁻¹) qu'une cétone, un ester ou un acide", "La seule présence de C–H aliphatiques", "Une bande C–O intense vers 1240 cm⁻¹"], correct: 0,
        indices: [], explication: "C'est la combinaison N–H + C=O décalé vers les basses valeurs qui signe spécifiquement l'amide." },
      { id: 'd5-2', competences: ['C6'], difficulte: 3, type: 'single',
        enonce: "L'absence de toute bande entre 2500 et 3300 cm⁻¹ (hormis les C–H usuels vers 2900 cm⁻¹) permet d'exclure avec le plus de confiance laquelle de ces structures : un acide carboxylique, une cétone, ou un alcène ?",
        options: ["Un acide carboxylique", "Une cétone", "Un alcène"], correct: 0,
        indices: [], explication: "Seul l'acide carboxylique possède nécessairement une bande O–H exceptionnellement large dans cette zone : son absence permet de l'exclure." },
      { id: 'd5-3', competences: ['C6'], difficulte: 3, type: 'single',
        enonce: "Un spectre présente : pas de bande O–H ni N–H, pas de C=O, des bandes C–H aliphatiques, et une bande faible vers 1650 cm⁻¹. Parmi alcool, cétone et alcène, laquelle reste compatible après élimination méthodique ?",
        options: ["L'alcène", "L'alcool", "La cétone"], correct: 0,
        indices: [], explication: "L'alcool est exclu (pas d'O–H), la cétone est exclue (pas de C=O) : la bande faible vers 1650 cm⁻¹, cohérente avec un C=C, désigne l'alcène." },
      { id: 'd5-4', competences: ['C6'], difficulte: 3, type: 'single',
        enonce: "Un spectre présente un C=O vers 1740 cm⁻¹ et des C–H, mais la zone 1000-1300 cm⁻¹ n'a pas pu être enregistrée (instrument limité). Comment classer l'hypothèse « ester » : compatible, incompatible, ou indécidable ?",
        options: [
          "Indécidable : la bande C–O, nécessaire pour confirmer ou exclure l'ester, n'a pas pu être observée",
          "Incompatible : sans la bande C–O visible, l'ester est exclu",
          "Compatible avec certitude : le C=O à cette position suffit à lui seul"
        ], correct: 0,
        indices: [], explication: "Une zone non enregistrée ne permet ni de confirmer ni d'exclure une bande attendue : l'hypothèse reste indécidable, pas automatiquement exclue." },
      { id: 'd5-5', competences: ['C5', 'C6'], difficulte: 3, type: 'single',
        enonce: "Un spectre présente une bande N–H ET une bande O–H très large qui se chevauchent partiellement entre 3000 et 3300 cm⁻¹. Quel est l'effet de ce recouvrement sur l'analyse ?",
        options: [
          "Il complique l'identification précise de chaque bande individuelle, sans empêcher de repérer que DEUX contributions au moins sont présentes dans cette zone",
          "Il fait disparaître complètement les deux bandes",
          "Il prouve qu'une seule des deux liaisons est réellement présente"
        ], correct: 0,
        indices: [], explication: "Un recouvrement rend l'attribution précise plus délicate, mais les contributions sous-jacentes restent présentes et peuvent souvent être suspectées par la forme globale de la bande." },
      { id: 'd5-6', competences: ['C6'], difficulte: 3, type: 'single',
        enonce: "Un spectre présente un C=O vers 1715 cm⁻¹ et AUCUNE bande C–O intense. Peut-on totalement exclure la structure « ester » malgré le C=O à cette position ?",
        options: [
          "Oui : un ester typique présente systématiquement une bande C–O intense, dont l'absence totale est un indice négatif fort",
          "Non : la bande C–O n'a jamais d'importance pour identifier un ester",
          "Impossible à dire, le C=O seul suffisant toujours à confirmer un ester"
        ], correct: 0,
        indices: [], explication: "L'absence d'une bande normalement intense et attendue (ici C–O pour un ester) constitue un indice négatif suffisamment fort pour exclure raisonnablement cette hypothèse." }
    ]
  },

  D6: {
    activite: 'A6', titre: "Diagnostic final D6 — synthèse", competences: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'],
    questions: [
      { id: 'd6-1', competences: ['C7'], difficulte: 4, type: 'single',
        enonce: "Un spectre présente : une bande O–H très large (2500-3300 cm⁻¹), un C=O vers 1715 cm⁻¹, et une bande C–O vers 1250 cm⁻¹. Parmi un alcool, un ester et un acide carboxylique, laquelle de ces structures est seule compatible avec la TOTALITÉ de ce spectre ?",
        options: ["L'acide carboxylique", "L'alcool", "L'ester"], correct: 0,
        indices: [], explication: "L'alcool est exclu (pas de C=O). L'ester présenterait un C=O plus élevé (1735-1750) et pas d'O–H aussi large. Seul l'acide carboxylique réunit la totalité des indices." },
      { id: 'd6-2', competences: ['C7'], difficulte: 4, type: 'single',
        enonce: "Deux structures candidates de C=O très voisin sont proposées : une cétone et un amide. Le spectre étudié présente, en plus du C=O (vers 1660 cm⁻¹, nettement plus bas qu'une cétone usuelle), une bande N–H. Laquelle retenir ?",
        options: ["L'amide", "La cétone", "Impossible de choisir sans spectre RMN"], correct: 0,
        indices: [], explication: "La bande N–H, absente d'une cétone, et la position anormalement basse du C=O désignent sans ambiguïté l'amide." },
      { id: 'd6-3', competences: ['C6', 'C7'], difficulte: 4, type: 'single',
        enonce: "Pourquoi la structure « éthanoate d'éthyle » (ester) est-elle incompatible avec un spectre présentant un C=O vers 1715 cm⁻¹ mais AUCUNE bande C–O intense entre 1000 et 1300 cm⁻¹ ?",
        options: [
          "Parce qu'un ester possède nécessairement une bande C–O intense, caractéristique et difficile à manquer, en plus de son C=O",
          "Parce qu'un ester n'a jamais de bande C=O",
          "Parce que 1715 cm⁻¹ est une position impossible pour un ester, quelle que soit la présence d'autres bandes"
        ], correct: 0,
        indices: [], explication: "La bande C–O intense est une composante essentielle et attendue de la signature d'un ester : son absence totale rend cette hypothèse incompatible, orientant plutôt vers une cétone." },
      { id: 'd6-4', competences: ['C1', 'C2'], difficulte: 3, type: 'numeric',
        enonce: "Pour finaliser une identification, la transmittance minimale de la bande C=O est mesurée à 12 %. Calcule l'absorbance correspondante (arrondie à 0,01 près).",
        unite: "(sans unité)", reponse: 0.92, tolerance: { type: 'abs', value: 0.03 },
        indices: [], explication: "$A = -\\log_{10}(0{,}12) \\approx 0{,}92$." },
      { id: 'd6-5', competences: ['C7'], difficulte: 4, type: 'single',
        enonce: "Un spectre IR révèle un C=O vers 1715 cm⁻¹, sans O–H ni N–H, sans C–O intense (cétone probable, par élimination). Un spectre RMN complémentaire montre DEUX signaux, un triplet et un quadruplet couplés, sans signal vers 9-10 ppm. Quelle structure est la plus cohérente ?",
        options: [
          "Une cétone non symétrique comme le butan-2-one : le motif triplet-quadruplet confirme un fragment éthyle, et l'absence de signal vers 9-10 ppm exclut un aldéhyde",
          "Un aldéhyde : le triplet-quadruplet est typique du groupe CHO",
          "Un ester : la RMN seule suffit à l'affirmer, sans tenir compte de l'IR"
        ], correct: 0,
        indices: [], explication: "L'IR oriente vers une cétone (C=O isolé) ; la RMN confirme un fragment éthyle (triplet-quadruplet) et exclut l'aldéhyde (pas de signal déblindé caractéristique) — cohérent avec une cétone asymétrique comme le butan-2-one." },
      { id: 'd6-6', competences: ['C6', 'C7'], difficulte: 4, type: 'single',
        enonce: "Pourquoi est-il nécessaire de croiser systématiquement plusieurs bandes (et parfois la RMN) pour identifier une molécule inconnue, plutôt que de se fier à une seule bande IR ?",
        options: [
          "Parce qu'une bande isolée (même très caractéristique, comme un C=O) est compatible avec plusieurs fonctions différentes : seul le recoupement de plusieurs indices, voire d'une autre technique, réduit suffisamment les possibilités pour conclure de façon fiable",
          "Parce qu'une seule bande suffit toujours, les autres techniques ne servant qu'à décorer le raisonnement",
          "Parce que la réglementation impose d'utiliser au moins deux techniques spectroscopiques"
        ], correct: 0,
        indices: [], explication: "C'est le principe même de l'identification spectroscopique : aucune bande isolée n'est suffisante à elle seule, car elle est partagée par plusieurs structures possibles. Leur recoupement systématique, complété si besoin par la RMN, permet une identification fiable." }
    ]
  }
};

/*
 * Banque de remédiation : une question alternative par compétence, utilisée
 * lorsque la compétence est jugée fragile après un diagnostic, avant une
 * nouvelle évaluation.
 */
window.IR_REMEDIATION = {
  C1: [
    { id: 'rem-c1-1', type: 'single',
      enonce: "Une bande correspond à λ = 10 µm. Quel est, approximativement, le nombre d'onde correspondant ?",
      options: ["1000 cm⁻¹", "10 cm⁻¹", "10000 cm⁻¹"], correct: 0,
      explication: "$\\sigma = 1/\\lambda = 1/(10\\times10^{-4}\\,\\text{cm}) = 1000\\,\\text{cm}^{-1}$." }
  ],
  C2: [
    { id: 'rem-c2-1', type: 'single',
      enonce: "Une bande descend à T=10 % ; une autre ne descend qu'à T=90 %. Laquelle est la plus intense ?",
      options: ["Celle qui descend à 10 %", "Celle qui descend à 90 %", "Elles sont identiques"], correct: 0,
      explication: "Plus T minimal est bas, plus l'absorption est forte." }
  ],
  C3: [
    { id: 'rem-c3-1', type: 'single',
      enonce: "Une bande forte et large apparaît entre 3200 et 3600 cm⁻¹. Quelle liaison est la plus probable ?",
      options: ["O–H d'alcool", "C–H aliphatique", "C=O"], correct: 0,
      explication: "Cette zone, pour une bande large, est celle de l'O–H d'alcool." }
  ],
  C4: [
    { id: 'rem-c4-1', type: 'single',
      enonce: "Un spectre présente un C=O et une bande C–O intense associée. Quelle fonction est la plus probable ?",
      options: ["Un ester", "Un alcool", "Une amine"], correct: 0,
      explication: "C=O + C–O intense est la signature typique d'un ester." }
  ],
  C5: [
    { id: 'rem-c5-1', type: 'single',
      enonce: "Pourquoi une seule bande, même intense, ne permet-elle généralement pas de conclure seule sur une fonction ?",
      options: ["Car une même bande peut appartenir à plusieurs fonctions différentes : il faut la croiser avec d'autres bandes", "Car les bandes isolées n'existent jamais", "Car une bande intense est toujours fausse"], correct: 0,
      explication: "Il faut toujours croiser plusieurs bandes avant de conclure." }
  ],
  C6: [
    { id: 'rem-c6-1', type: 'single',
      enonce: "L'absence totale d'une bande normalement intense et attendue pour une fonction donnée permet généralement de :",
      options: ["Exclure raisonnablement cette fonction", "Confirmer cette fonction", "Ne rien conclure du tout, jamais"], correct: 0,
      explication: "Un indice négatif fiable (bande normalement forte et absente) permet d'exclure une hypothèse." }
  ],
  C7: [
    { id: 'rem-c7-1', type: 'single',
      enonce: "Pour identifier une molécule inconnue de façon fiable, quelle démarche privilégier ?",
      options: ["Croiser systématiquement toutes les bandes disponibles, et s'appuyer si besoin sur une autre technique (RMN)", "Se fier à la première bande repérée", "Se fier uniquement à la formule brute"], correct: 0,
      explication: "Seule une démarche systématique et complète permet une identification fiable." }
  ]
};
