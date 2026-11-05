/*
 * Référentiel des sept compétences travaillées par le module RMN du proton.
 * Chaque compétence est notée sur une échelle de maîtrise à 5 niveaux (0 à 4),
 * cf. js/mastery-engine.js pour le calcul à partir des résultats d'évaluation.
 */
window.RMN_COMPETENCES = [
  {
    id: 'C1', titre: "Équivalence chimique",
    description: "Identifier les groupes de protons chimiquement équivalents et prévoir le nombre de signaux d'un spectre.",
    poids: 1
  },
  {
    id: 'C2', titre: "Intégration",
    description: "Associer les aires relatives des signaux aux nombres de protons responsables.",
    poids: 1
  },
  {
    id: 'C3', titre: "Déplacement chimique",
    description: "Exploiter les valeurs de δ et les tables de référence pour caractériser un environnement chimique.",
    poids: 1
  },
  {
    id: 'C4', titre: "Couplages simples",
    description: "Prévoir et interpréter les multiplicités du premier ordre dans un système AmXp (règle n+1).",
    poids: 1
  },
  {
    id: 'C5', titre: "Couplages multiples",
    description: "Analyser les multiplicités dans les systèmes AmMpXq, avec deux constantes de couplage distinctes et d'éventuelles superpositions de raies.",
    poids: 1.1
  },
  {
    id: 'C6', titre: "Attribution spectrale",
    description: "Exploiter simultanément déplacement, intégration et multiplicité pour attribuer tous les signaux d'un spectre.",
    poids: 1.3
  },
  {
    id: 'C7', titre: "Identification moléculaire",
    description: "Confirmer ou départager des structures candidates à partir de données spectroscopiques RMN, éventuellement complétées par l'infrarouge.",
    poids: 1.3
  }
];

/*
 * Niveaux de maîtrise d'une compétence (0 à 4). "non évalué" (niveau null)
 * est un état à part, affiché distinctement d'un niveau 0 réel.
 */
window.RMN_NIVEAUX = [
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

window.RMN_NIVEAU_LABEL = function(n){
  if (n === null || n === undefined) return "Non évalué";
  const found = window.RMN_NIVEAUX.find(x => x.niveau === n);
  return found ? found.label : "Non évalué";
};
