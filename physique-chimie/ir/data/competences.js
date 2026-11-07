/*
 * Référentiel des sept compétences travaillées par le module IR. Même
 * principe que le module RMN (cf. physique-chimie/rmn/data/competences.js) :
 * échelle de maîtrise à 5 niveaux (0 à 4), calculée par js/mastery-engine.js.
 * Espace de noms distinct (IR_*) pour ne jamais mélanger les scores RMN/IR.
 */
window.IR_COMPETENCES = [
  {
    id: 'C1', titre: "Comprendre les grandeurs spectrales",
    description: "Lire les axes d'un spectre IR, distinguer transmittance et absorbance, utiliser le nombre d'onde.",
    poids: 1
  },
  {
    id: 'C2', titre: "Lire les bandes d'absorption",
    description: "Localiser et caractériser une bande par sa position, son intensité et sa largeur.",
    poids: 1
  },
  {
    id: 'C3', titre: "Reconnaître les liaisons caractéristiques",
    description: "Associer les bandes principales aux liaisons O–H, N–H, C–H, C=O, C=C et C–O.",
    poids: 1
  },
  {
    id: 'C4', titre: "Identifier les fonctions organiques",
    description: "Reconnaître notamment alcools, acides carboxyliques, aldéhydes, cétones, esters et amides.",
    poids: 1
  },
  {
    id: 'C5', titre: "Interpréter des spectres complexes",
    description: "Croiser plusieurs bandes, reconnaître les recouvrements et comprendre les limites d'une attribution.",
    poids: 1.1
  },
  {
    id: 'C6', titre: "Exploiter les indices positifs et négatifs",
    description: "Confirmer ou exclure des fonctions et des structures candidates.",
    poids: 1.3
  },
  {
    id: 'C7', titre: "Réaliser une identification complète",
    description: "Départager des molécules candidates et construire une conclusion spectroscopique argumentée.",
    poids: 1.3
  }
];

window.IR_NIVEAUX = [
  { niveau: 0, label: "Non acquis",
    critere: "Erreurs sur les situations les plus simples de la compétence, y compris avec aide." },
  { niveau: 1, label: "Connaissances élémentaires",
    critere: "Restitue une règle ou une définition mais l'applique de façon instable." },
  { niveau: 2, label: "Application guidée",
    critere: "Résout correctement des situations usuelles avec des indices ou un cadre fourni." },
  { niveau: 3, label: "Maîtrise autonome",
    critere: "Résout sans aide des situations usuelles de difficulté standard BCPST1." },
  { niveau: 4, label: "Transfert",
    critere: "Résout sans aide des situations inédites ou complexes mobilisant plusieurs compétences." }
];

window.IR_NIVEAU_LABEL = function(n){
  if (n === null || n === undefined) return "Non évalué";
  const found = window.IR_NIVEAUX.find(x => x.niveau === n);
  return found ? found.label : "Non évalué";
};
