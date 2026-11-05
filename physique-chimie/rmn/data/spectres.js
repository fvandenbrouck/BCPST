/*
 * Banque de spectres RMN ¹H utilisés par le cours, la méthode et les activités.
 *
 * STATUT DES DONNÉES — lire avant toute modification :
 * Ce module n'intègre pas d'image brute de spectre expérimental extraite d'une
 * base externe (droits de reproduction non vérifiables de façon fiable dans ce
 * contexte). Les valeurs de déplacement chimique, de multiplicité et de
 * constante de couplage indiquées ci-dessous sont des VALEURS DE RÉFÉRENCE
 * CARACTÉRISTIQUES, bien établies dans la littérature et les tables usuelles de
 * RMN ¹H (solvant CDCl₃, ordres de grandeur conformes à Pretsch/Bühlmann/
 * Badertscher "Structure Determination of Organic Compounds", aux tables de
 * déplacements chimiques de H. J. Reich (Univ. of Wisconsin, notes de cours
 * publiques) et aux données tabulées de la SDBS — AIST, https://sdbs.db.aist.go.jp/ ;
 * la structure de chaque molécule est vérifiable dans tools/molecules.json).
 * Chaque spectre est donc affiché comme une RECONSTRUCTION PÉDAGOGIQUE
 * (statut 'reconstruction'), jamais présenté comme un tracé expérimental brut
 * — conformément aux règles d'usage de ces bases. La visionneuse (js/spectrum-viewer.js)
 * calcule la position des raies de chaque multiplet à partir de ces valeurs
 * (couplage au premier ordre), elle ne les recopie pas depuis une image.
 *
 * Schéma d'un signal :
 *   id, label (texte court), color (clé de palette), deltaPpm (centre),
 *   integrationH (nombre de protons), multiplicite ('s','d','t','q','quint','sext','sept'),
 *   J (liste des constantes de couplage en Hz, 1 ou 2 valeurs pour un système AmMpXq),
 *   echangeable (bool, protons OH/NH), attribution (texte explicatif).
 */
window.RMN_SPECTRES = [
  {
    id: 'ethanol', nom: "Éthanol", formule: "CH₃–CH₂–OH", formuleBrute: "C₂H₆O",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'ethanol-plain', all: 'ethanol-all', groups: { ch3: 'ethanol-grp-ch3', ch2: 'ethanol-grp-ch2', oh: 'ethanol-grp-oh' } },
    signaux: [
      { id: 'et-ch3', label: 'CH₃', color: 'rust', deltaPpm: 1.24, integrationH: 3, multiplicite: 't', J: [7.1], attribution: "CH₃, couplé aux 2 H du CH₂ voisin (n+1 = 3, triplet)." },
      { id: 'et-ch2', label: 'CH₂', color: 'moss', deltaPpm: 3.70, integrationH: 2, multiplicite: 'q', J: [7.1], attribution: "CH₂, couplé aux 3 H du CH₃ voisin (n+1 = 4, quadruplet). Le couplage avec OH n'est en pratique presque jamais résolu." },
      { id: 'et-oh', label: 'OH', color: 'slate', deltaPpm: 2.60, integrationH: 1, multiplicite: 's', J: [], echangeable: true, attribution: "OH, proton échangeable : position (1 à 5 ppm) et forme (souvent un singulet large) très variables selon la concentration, la température et les traces d'eau." }
    ]
  },
  {
    id: 'propane', nom: "Propane", formule: "CH₃–CH₂–CH₃", formuleBrute: "C₃H₈",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'propane-plain', all: 'propane-all', groups: { ch3: 'propane-grp-ch3', ch2: 'propane-grp-ch2' } },
    signaux: [
      { id: 'pp-ch3', label: '2×CH₃', color: 'rust', deltaPpm: 0.90, integrationH: 6, multiplicite: 't', J: [7.3], attribution: "Les deux CH₃, équivalents par symétrie, couplés aux 2 H du CH₂ central (triplet)." },
      { id: 'pp-ch2', label: 'CH₂', color: 'moss', deltaPpm: 1.30, integrationH: 2, multiplicite: 'sept', J: [7.3], attribution: "CH₂ central, couplé aux 6 H des deux CH₃ voisins, véritablement équivalents entre eux (même J) : n+1 = 7, un septuplet (comme pour le CH du propan-2-ol, pour la même raison structurale)." }
    ]
  },
  {
    id: 'propan2ol', nom: "Propan-2-ol", formule: "(CH₃)₂CH–OH", formuleBrute: "C₃H₈O",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'propan2ol-plain', all: 'propan2ol-all', groups: { ch3: 'propan2ol-grp-ch3', ch: 'propan2ol-grp-ch', oh: 'propan2ol-grp-oh' } },
    signaux: [
      { id: 'p2-ch3', label: '2×CH₃', color: 'rust', deltaPpm: 1.19, integrationH: 6, multiplicite: 'd', J: [6.2], attribution: "Les deux CH₃, chimiquement équivalents (molécule symétrique), couplés à l'unique CH voisin (n+1 = 2, doublet)." },
      { id: 'p2-ch', label: 'CH', color: 'moss', deltaPpm: 4.04, integrationH: 1, multiplicite: 'sept', J: [6.2], attribution: "CH, couplé aux 6 H équivalents des deux CH₃ voisins (n+1 = 7, septuplet)." },
      { id: 'p2-oh', label: 'OH', color: 'slate', deltaPpm: 2.60, integrationH: 1, multiplicite: 's', J: [], echangeable: true, attribution: "OH, proton échangeable, singulet large de position variable." }
    ]
  },
  {
    id: 'propanone', nom: "Propanone (acétone)", formule: "CH₃–CO–CH₃", formuleBrute: "C₃H₆O",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'propanone-plain', all: 'propanone-all' },
    signaux: [
      { id: 'pr-ch3', label: '2×CH₃', color: 'rust', deltaPpm: 2.17, integrationH: 6, multiplicite: 's', J: [], attribution: "Les deux CH₃, équivalents, n'ont aucun voisin portant un H (carbone central = carbonyle, sans H) : singulet." }
    ]
  },
  {
    id: 'bromoethane', nom: "Bromoéthane", formule: "CH₃–CH₂–Br", formuleBrute: "C₂H₅Br",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'bromoethane-plain' },
    signaux: [
      { id: 'br-ch3', label: 'CH₃', color: 'rust', deltaPpm: 1.68, integrationH: 3, multiplicite: 't', J: [7.3], attribution: "CH₃, couplé aux 2 H du CH₂ voisin (triplet)." },
      { id: 'br-ch2', label: 'CH₂', color: 'moss', deltaPpm: 3.42, integrationH: 2, multiplicite: 'q', J: [7.3], attribution: "CH₂, déblindé par le brome voisin, couplé aux 3 H du CH₃ (quadruplet)." }
    ]
  },
  {
    id: 'ethylacetate', nom: "Éthanoate d'éthyle", formule: "CH₃–CO–O–CH₂–CH₃", formuleBrute: "C₄H₈O₂",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'ethylacetate-plain', all: 'ethylacetate-all', groups: { ch3a: 'ethylacetate-grp-ch3a', ch2: 'ethylacetate-grp-ch2', ch3b: 'ethylacetate-grp-ch3b' } },
    signaux: [
      { id: 'ea-ch3a', label: 'CH₃ (acétyle)', color: 'rust', deltaPpm: 2.04, integrationH: 3, multiplicite: 's', J: [], attribution: "CH₃ lié au carbonyle : aucun voisin porteur de H de ce côté, singulet." },
      { id: 'ea-ch2', label: 'O–CH₂', color: 'moss', deltaPpm: 4.12, integrationH: 2, multiplicite: 'q', J: [7.1], attribution: "CH₂ de l'éthyle, déblindé par l'oxygène voisin, couplé au CH₃ de l'éthyle (quadruplet)." },
      { id: 'ea-ch3b', label: 'CH₃ (éthyle)', color: 'ochre', deltaPpm: 1.26, integrationH: 3, multiplicite: 't', J: [7.1], attribution: "CH₃ de l'éthyle, couplé au CH₂ voisin (triplet)." }
    ]
  },
  {
    id: 'butan2one', nom: "Butan-2-one", formule: "CH₃–CO–CH₂–CH₃", formuleBrute: "C₄H₈O",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'butan2one-plain' },
    signaux: [
      { id: 'bk-ch3a', label: 'CH₃ (acétyle)', color: 'rust', deltaPpm: 2.12, integrationH: 3, multiplicite: 's', J: [], attribution: "CH₃ lié au carbonyle, sans voisin porteur de H : singulet. À comparer avec l'éthanoate d'éthyle : même type de groupe, δ très voisin." },
      { id: 'bk-ch2', label: 'CH₂', color: 'moss', deltaPpm: 2.45, integrationH: 2, multiplicite: 'q', J: [7.3], attribution: "CH₂ couplé au CH₃ de l'éthyle voisin (quadruplet)." },
      { id: 'bk-ch3b', label: 'CH₃ (éthyle)', color: 'ochre', deltaPpm: 1.05, integrationH: 3, multiplicite: 't', J: [7.3], attribution: "CH₃ de l'éthyle, couplé au CH₂ voisin (triplet)." }
    ]
  },
  {
    id: 'propan1ol', nom: "Propan-1-ol", formule: "CH₃–CH₂–CH₂–OH", formuleBrute: "C₃H₈O",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'propan1ol-plain' },
    signaux: [
      { id: 'p1-ch3', label: 'CH₃', color: 'rust', deltaPpm: 0.92, integrationH: 3, multiplicite: 't', J: [7.4], attribution: "CH₃, couplé aux 2 H du CH₂ central (triplet)." },
      { id: 'p1-ch2b', label: 'CH₂ (central)', color: 'moss', deltaPpm: 1.57, integrationH: 2, multiplicite: 'sext', J: [7.0], attribution: "CH₂ central, encadré par deux groupes voisins de constantes J voisines (CH₃, 3H, et CH₂–OH, 2H) : l'approximation n+1 globale (3+2=5 voisins) donne un sextuplet." },
      { id: 'p1-ch2oh', label: 'CH₂–OH', color: 'ochre', deltaPpm: 3.57, integrationH: 2, multiplicite: 't', J: [6.6], attribution: "CH₂ porté par l'oxygène, déblindé, couplé au CH₂ central (triplet)." },
      { id: 'p1-oh', label: 'OH', color: 'slate', deltaPpm: 2.30, integrationH: 1, multiplicite: 's', J: [], echangeable: true, attribution: "OH, proton échangeable, singulet large de position variable." }
    ]
  },
  {
    id: 'methoxyethane', nom: "Méthoxyéthane", formule: "CH₃–O–CH₂–CH₃", formuleBrute: "C₃H₈O",
    conditions: "CDCl₃, ≈400 MHz, 25 °C — valeurs de référence usuelles",
    statut: 'reconstruction',
    mol: { plain: 'methoxyethane-plain' },
    signaux: [
      { id: 'me-och3', label: 'O–CH₃', color: 'rust', deltaPpm: 3.33, integrationH: 3, multiplicite: 's', J: [], attribution: "OCH₃ : aucun proton sur l'atome voisin (l'oxygène ne porte pas de H ici), singulet." },
      { id: 'me-och2', label: 'O–CH₂', color: 'moss', deltaPpm: 3.39, integrationH: 2, multiplicite: 'q', J: [7.0], attribution: "OCH₂, couplé au CH₃ de l'éthyle (quadruplet). Isomère de constitution du propan-1-ol et du propan-2-ol (formule C₃H₈O) : absence d'OH, signature caractéristique d'un éther." },
      { id: 'me-ch3', label: 'CH₃ (éthyle)', color: 'ochre', deltaPpm: 1.16, integrationH: 3, multiplicite: 't', J: [7.0], attribution: "CH₃ de l'éthyle, couplé au CH₂ voisin (triplet)." }
    ]
  }
];

window.RMN_SPECTRE_BY_ID = function(id){
  return window.RMN_SPECTRES.find(s => s.id === id) || null;
};

/* Nombre de raies attendu pour une multiplicité simple du premier ordre (règle n+1). */
window.RMN_MULTIPLICITE_INFO = {
  s:    { nom: 'Singulet',   n: 0, abrev: 's' },
  d:    { nom: 'Doublet',    n: 1, abrev: 'd' },
  t:    { nom: 'Triplet',    n: 2, abrev: 't' },
  q:    { nom: 'Quadruplet', n: 3, abrev: 'q' },
  quint:{ nom: 'Quintuplet', n: 4, abrev: 'quint' },
  sext: { nom: 'Sextuplet',  n: 5, abrev: 'sext' },
  sept: { nom: 'Septuplet',  n: 6, abrev: 'sept' },
  m:    { nom: 'Multiplet complexe', n: null, abrev: 'm' }
};
