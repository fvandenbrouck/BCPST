/*
 * Banque de spectres IR utilisés par le cours, la méthode et les activités.
 *
 * STATUT DES DONNÉES — lire avant toute modification (même principe que le
 * module RMN, cf. physique-chimie/rmn/data/spectres.js) :
 * Aucune image de spectre expérimental brut extraite d'une base externe n'est
 * reproduite ici. Les positions de bande, intensités et largeurs indiquées
 * sont des VALEURS DE RÉFÉRENCE CARACTÉRISTIQUES, bien établies dans la
 * littérature et les tables usuelles de spectroscopie IR (ordres de grandeur
 * conformes à Pretsch/Bühlmann/Badertscher "Structure Determination of
 * Organic Compounds", aux tables de corrélation IR usuelles de chimie
 * organique, et aux données de la base SDBS — AIST, https://sdbs.db.aist.go.jp/).
 * Chaque spectre est affiché comme une RECONSTRUCTION PÉDAGOGIQUE (statut
 * 'reconstruction'), jamais présentée comme un tracé expérimental brut. La
 * visionneuse (js/spectrum-viewer.js) calcule la courbe (bosses gaussiennes
 * combinées) à partir de ces valeurs ; elle ne recopie pas une image.
 *
 * Schéma d'une bande :
 *   id, label, color (clé de palette), centre (cm-1), largeurBande (demi-largeur
 *   en cm-1, pour le tracé), intensite ('forte'|'moyenne'|'faible'),
 *   largeur ('large'|'moyenne'|'etroite'), attribution (texte).
 */
window.IR_SPECTRES = [
  {
    id: 'ethanol', nom: "Éthanol", formule: "CH₃–CH₂–OH", formuleBrute: "C₂H₆O", famille: "alcool",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'ethanol-plain', highlight: 'ethanol-highlight-oh' },
    bandes: [
      { id: 'et-oh', label: 'O–H (alcool, liaison H)', color: 'slate', centre: 3350, largeurBande: 140, intensite: 'forte', largeur: 'large', attribution: "Élongation O–H, très large du fait des liaisons hydrogène intermoléculaires." },
      { id: 'et-ch', label: 'C–H aliphatique', color: 'rust', centre: 2950, largeurBande: 50, intensite: 'moyenne', largeur: 'moyenne', attribution: "Élongation C–H des groupes CH₃ et CH₂." },
      { id: 'et-co', label: 'C–O', color: 'moss', centre: 1050, largeurBande: 40, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C–O, caractéristique d'un alcool." }
    ]
  },
  {
    id: 'aceticacid', nom: "Acide éthanoïque", formule: "CH₃–COOH", formuleBrute: "C₂H₄O₂", famille: "acide carboxylique",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'aceticacid-plain', highlight: 'aceticacid-highlight' },
    bandes: [
      { id: 'ac-oh', label: 'O–H (acide)', color: 'slate', centre: 2950, largeurBande: 260, intensite: 'forte', largeur: 'large', attribution: "Élongation O–H d'acide carboxylique, exceptionnellement large (2500-3300 cm⁻¹), recouvre souvent les bandes C–H." },
      { id: 'ac-co', label: 'C=O (acide)', color: 'rust', centre: 1715, largeurBande: 30, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C=O d'acide carboxylique." },
      { id: 'ac-cof', label: 'C–O (acide)', color: 'moss', centre: 1250, largeurBande: 35, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C–O, complète l'identification de la fonction acide avec la bande O–H très large." }
    ]
  },
  {
    id: 'propanal', nom: "Propanal", formule: "CH₃–CH₂–CHO", formuleBrute: "C₃H₆O", famille: "aldéhyde",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'propanal-plain', highlight: 'propanal-highlight' },
    bandes: [
      { id: 'pa-ch2', label: 'C–H aldéhydique (doublet)', color: 'slate', centre: 2770, largeurBande: 60, intensite: 'faible', largeur: 'etroite', attribution: "Doublet caractéristique vers 2720 et 2820 cm⁻¹ (représenté ici de façon groupée), souvent discret mais très diagnostique d'un aldéhyde." },
      { id: 'pa-ch', label: 'C–H aliphatique', color: 'rust', centre: 2950, largeurBande: 50, intensite: 'moyenne', largeur: 'moyenne', attribution: "Élongation C–H des groupes CH₃ et CH₂." },
      { id: 'pa-co', label: 'C=O (aldéhyde)', color: 'moss', centre: 1730, largeurBande: 30, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C=O d'aldéhyde, légèrement plus élevée que celle d'une cétone comparable." }
    ]
  },
  {
    id: 'propanone', nom: "Propanone (acétone)", formule: "CH₃–CO–CH₃", formuleBrute: "C₃H₆O", famille: "cétone",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'propanone-plain', highlight: 'propanone-highlight-co' },
    bandes: [
      { id: 'pr-ch', label: 'C–H aliphatique', color: 'rust', centre: 2950, largeurBande: 50, intensite: 'moyenne', largeur: 'moyenne', attribution: "Élongation C–H des groupes CH₃." },
      { id: 'pr-co', label: 'C=O (cétone)', color: 'moss', centre: 1715, largeurBande: 30, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C=O de cétone. Aucune bande O–H ni N–H associée : élément distinctif par rapport à un acide ou un amide." }
    ]
  },
  {
    id: 'ethylacetate', nom: "Éthanoate d'éthyle", formule: "CH₃–CO–O–CH₂–CH₃", formuleBrute: "C₄H₈O₂", famille: "ester",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'ethylacetate-plain', highlight: 'ethylacetate-highlight-co' },
    bandes: [
      { id: 'ea-ch', label: 'C–H aliphatique', color: 'rust', centre: 2970, largeurBande: 50, intensite: 'moyenne', largeur: 'moyenne', attribution: "Élongation C–H des groupes CH₃ et CH₂." },
      { id: 'ea-co', label: 'C=O (ester)', color: 'moss', centre: 1740, largeurBande: 25, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C=O d'ester, typiquement un peu plus élevée que celle d'une cétone." },
      { id: 'ea-co2', label: 'C–O (ester)', color: 'slate', centre: 1240, largeurBande: 45, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C–O, souvent accompagnée d'une seconde bande C–O vers 1050 cm⁻¹ : la présence conjointe de C=O et de deux bandes C–O est caractéristique d'un ester, par opposition à une cétone." }
    ]
  },
  {
    id: 'butan2one', nom: "Butan-2-one", formule: "CH₃–CO–CH₂–CH₃", formuleBrute: "C₄H₈O", famille: "cétone",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'butan2one-plain', highlight: 'butan2one-highlight-co' },
    bandes: [
      { id: 'bk-ch', label: 'C–H aliphatique', color: 'rust', centre: 2960, largeurBande: 50, intensite: 'moyenne', largeur: 'moyenne', attribution: "Élongation C–H des groupes CH₃ et CH₂." },
      { id: 'bk-co', label: 'C=O (cétone)', color: 'moss', centre: 1715, largeurBande: 30, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C=O de cétone, à comparer avec l'éthanoate d'éthyle : δ très proche, mais absence ici de bande C–O intense caractéristique d'un ester." }
    ]
  },
  {
    id: 'ethanamine', nom: "Éthanamine", formule: "CH₃–CH₂–NH₂", formuleBrute: "C₂H₇N", famille: "amine",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'ethanamine-plain', highlight: 'ethanamine-highlight-nh2' },
    bandes: [
      { id: 'ea2-nh', label: 'N–H (amine primaire, doublet)', color: 'slate', centre: 3350, largeurBande: 90, intensite: 'moyenne', largeur: 'moyenne', attribution: "Deux bandes N–H rapprochées (élongations symétrique et antisymétrique), caractéristiques d'une amine primaire — plus étroites qu'un O–H d'alcool, et sans bande C=O associée." },
      { id: 'ea2-ch', label: 'C–H aliphatique', color: 'rust', centre: 2950, largeurBande: 50, intensite: 'moyenne', largeur: 'moyenne', attribution: "Élongation C–H des groupes CH₃ et CH₂." }
    ]
  },
  {
    id: 'propanamide', nom: "Propanamide", formule: "CH₃–CH₂–CO–NH₂", formuleBrute: "C₃H₇NO", famille: "amide",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'propanamide-plain', highlight: 'propanamide-highlight' },
    bandes: [
      { id: 'pm-nh', label: 'N–H (amide, doublet)', color: 'slate', centre: 3300, largeurBande: 110, intensite: 'moyenne', largeur: 'moyenne', attribution: "Bandes N–H d'amide primaire, dans une zone proche de celle d'un alcool mais typiquement moins large et accompagnée d'une bande C=O décalée." },
      { id: 'pm-ch', label: 'C–H aliphatique', color: 'rust', centre: 2950, largeurBande: 50, intensite: 'moyenne', largeur: 'moyenne', attribution: "Élongation C–H des groupes CH₃ et CH₂." },
      { id: 'pm-co', label: 'C=O (amide)', color: 'moss', centre: 1660, largeurBande: 30, intensite: 'forte', largeur: 'moyenne', attribution: "Élongation C=O d'amide, nettement plus basse (≈1630-1700 cm⁻¹) que celle d'une cétone, d'un ester ou d'un acide — signature utile pour distinguer l'amide des autres carbonyles." }
    ]
  },
  {
    id: 'propene', nom: "Propène", formule: "CH₂=CH–CH₃", formuleBrute: "C₃H₆", famille: "alcène",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'propene-plain', highlight: 'propene-highlight-cc' },
    bandes: [
      { id: 'pe-cc', label: 'C=C (alcène)', color: 'rust', centre: 1650, largeurBande: 25, intensite: 'faible', largeur: 'moyenne', attribution: "Élongation C=C, généralement faible à moyenne — bien plus faible que la bande C=O d'un carbonyle." },
      { id: 'pe-ch', label: '=C–H (alcénique)', color: 'moss', centre: 3050, largeurBande: 25, intensite: 'faible', largeur: 'moyenne', attribution: "Élongation C–H sur carbone sp², juste au-dessus de la zone des C–H aliphatiques (<3000 cm⁻¹)." }
    ]
  },
  {
    id: 'benzene', nom: "Benzène (aromatique)", formule: "C₆H₆", formuleBrute: "C₆H₆", famille: "aromatique",
    conditions: "Film liquide — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'benzene-plain' },
    bandes: [
      { id: 'bz-cc', label: 'C=C (aromatique)', color: 'rust', centre: 1500, largeurBande: 60, intensite: 'faible', largeur: 'moyenne', attribution: "Plusieurs bandes de faible à moyenne intensité entre 1450 et 1600 cm⁻¹, caractéristiques du squelette aromatique." },
      { id: 'bz-ch', label: 'C–H aromatique', color: 'moss', centre: 3050, largeurBande: 25, intensite: 'faible', largeur: 'moyenne', attribution: "Élongation C–H sur carbone aromatique, juste au-dessus de la zone des C–H aliphatiques." }
    ]
  }
];

window.IR_SPECTRE_BY_ID = function(id){
  return window.IR_SPECTRES.find(s => s.id === id) || null;
};

/* Table de corrélation affichée sur la page Cours. */
window.IR_TABLE_BANDES = [
  { groupe: "O–H alcool (liaison H)", domaine: [3200, 3600], aspect: "Large, généralement intense" },
  { groupe: "O–H acide carboxylique", domaine: [2500, 3300], aspect: "Très large, parfois chevauchante avec C–H" },
  { groupe: "N–H", domaine: [3300, 3500], aspect: "Généralement plus étroite que O–H lié" },
  { groupe: "C–H aliphatique", domaine: [2850, 3000], aspect: "Plusieurs bandes possibles" },
  { groupe: "C–H aldéhydique", domaine: [2720, 2820], aspect: "Souvent deux bandes faibles à moyennes" },
  { groupe: "C=O", domaine: [1650, 1800], aspect: "Généralement forte" },
  { groupe: "C=C alcénique / aromatique", domaine: [1450, 1680], aspect: "Souvent moyenne ou faible" },
  { groupe: "C–O", domaine: [1000, 1300], aspect: "Souvent forte" }
];
