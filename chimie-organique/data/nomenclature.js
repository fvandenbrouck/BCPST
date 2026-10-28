/*
 * Module C — Nomenclature systématique (CC03 §III, p.16-23).
 * reference : tables du cours (racines, groupes alkyles, priorité des
 * suffixes, règles de numérotation) utilisées par la bibliothèque de fiches.
 * exercises : banque d'exercices de nomenclature (mode 4), 3 niveaux de
 * difficulté, chaque entrée porte sa structure (SVG pré-généré, cf. tools/), son nom
 * systématique vérifié et une explication pas à pas (chaîne principale,
 * numérotation, substituants, suffixe) + des indices progressifs.
 */
(function(){
  'use strict';

  const reference = {
    racines:[
      {n:1,racine:'Méth-'},{n:2,racine:'Éth-'},{n:3,racine:'Prop-'},{n:4,racine:'But-'},
      {n:5,racine:'Pent-'},{n:6,racine:'Hex-'},{n:7,racine:'Hept-'},{n:8,racine:'Oct-'},
      {n:9,racine:'Non-'},{n:10,racine:'Déc-'}
    ],
    suffixesInsaturation:[
      {code:'-ane', sens:'aucune liaison multiple'},
      {code:'-ène', sens:'une (ou plusieurs) liaison double'},
      {code:'-yne', sens:'une (ou plusieurs) liaison triple'}
    ],
    groupesAlkyles:[
      {groupe:'CH3–', nom:'méthyl(e)', abrev:'Me'},
      {groupe:'CH3–CH2–', nom:'éthyl(e)', abrev:'Et'},
      {groupe:'CH3–CH2–CH2–', nom:'propyl(e)', abrev:'Pr'},
      {groupe:'CH3–CH2–CH2–CH2–', nom:'butyl(e)', abrev:'Bu'},
      {groupe:'C6H5–', nom:'phényl(e)', abrev:'Ph'},
      {groupe:'C6H5–CH2–', nom:'benzyl(e)', abrev:'Bz'},
      {groupe:'(CH3)2CH–', nom:'isopropyl(e) — (1-méthyléthyl)', abrev:'iPr'},
      {groupe:'(CH3)2CH–CH2–', nom:'isobutyl(e) — (2-méthylpropyl)', abrev:'iBu'},
      {groupe:'(CH3)3C–', nom:'tertiobutyl(e) — (1,1-diméthyléthyl)', abrev:'tBu'}
    ],
    // Tableau de priorité des classes fonctionnelles (p.20) : plus on est haut
    // dans la liste, plus la fonction est prioritaire pour être désignée par
    // le SUFFIXE de la chaîne principale ; les autres groupes présents
    // passent alors en préfixe.
    prioriteSuffixes:[
      {classe:'Acide carboxylique', formule:'R–COOH', suffixe:'-oïque (acide ...-oïque)', prefixe:'carboxy-'},
      {classe:"Anhydride d'acide", formule:"R–CO–O–CO–R'", suffixe:null, prefixe:null, remarque:"nommé « anhydride ...-oïque » ; absent des 16 familles de ce trainer (programme : anhydride *phosphorique*, pas d'acide carboxylique)"},
      {classe:'Ester', formule:"R–CO–O–R'", suffixe:'-oate de ...-yle', prefixe:'alcoxycarbonyl-'},
      {classe:"Halogénure d'acyle", formule:'R–CO–X', suffixe:'-oyle (chlorure/bromure d\'...-oyle)', prefixe:'halogénocarbonyl-'},
      {classe:'Amide', formule:'R–CO–NH2', suffixe:'-amide', prefixe:'carbamoyl-'},
      {classe:'Nitrile', formule:'R–C≡N', suffixe:'-nitrile', prefixe:'cyano-'},
      {classe:'Aldéhyde', formule:'R–CHO', suffixe:'-al', prefixe:'formyl- (oxo- en interne)'},
      {classe:'Cétone', formule:"R–CO–R'", suffixe:'-one', prefixe:'oxo-'},
      {classe:'Alcool', formule:'R–OH', suffixe:'-ol', prefixe:'hydroxy-'},
      {classe:'Thiol', formule:'R–SH', suffixe:'-thiol', prefixe:'sulfanyl-'},
      {classe:'Amine', formule:'R–NH2', suffixe:'-amine', prefixe:'amino-'}
    ],
    reglesNumerotation:[
      "1) Le plus petit numéro possible pour le groupe caractéristique principal (celui désigné par le suffixe).",
      "2) À égalité, le plus petit numéro possible pour les liaisons multiples (insaturations).",
      "3) À égalité, le plus petit numéro possible pour les substituants (préfixes)."
    ],
    choixChainePrincipale:[
      "1) Elle porte le groupe caractéristique principal (celui qui a la priorité la plus haute parmi les groupes présents).",
      "2) À égalité, elle porte le plus grand nombre de liaisons multiples C–C.",
      "3) À égalité, elle possède l'enchaînement carboné de longueur maximale."
    ]
  };

  // ---- Banque d'exercices de nomenclature (mode 4) ---------------------
  // Chaque structure est vérifiée manuellement : chaîne choisie, sens de
  // numérotation et nom conformes aux règles ci-dessus et au tableau p.20.
  const exercises = [
    // ---------------- Niveau 1 : chaînes simples, alcanes/alcènes/alcynes
    { id:'no-1', level:1, name:'pentane',
      img:'assets/mol/no-1.svg',
      explanation:"Chaîne de 5 carbones sans ramification ni liaison multiple : racine pent- + suffixe -ane.",
      hints:["Compte le nombre de carbones de la chaîne.","Aucune ramification, aucune liaison double/triple.","Racine pour 5 carbones : voir le tableau des racines."] },
    { id:'no-2', level:1, name:'2-méthylbutane',
      img:'assets/mol/no-2.svg',
      explanation:"Chaîne principale de 4 carbones (but-) portant un méthyle. Numérotée depuis l'extrémité la plus proche de la ramification : le méthyle est en position 2.",
      hints:["La chaîne principale la plus longue a 4 carbones.","Un seul substituant : un groupe méthyle.","Numérote depuis l'extrémité qui donne le plus petit indice au méthyle."] },
    { id:'no-3', level:1, name:'but-1-ène',
      img:'assets/mol/no-3.svg',
      explanation:"4 carbones, liaison double entre C1 et C2 : but-1-ène.",
      hints:["4 carbones, repère la double liaison.","Numérote pour donner le plus petit indice à la double liaison.","Suffixe -ène, indice de la liaison double en 1."] },
    { id:'no-4', level:1, name:'but-2-ène',
      img:'assets/mol/no-4.svg',
      explanation:"4 carbones, liaison double entre C2 et C3 (symétrique, indice 2 dans les deux sens).",
      hints:["4 carbones, la double liaison est au centre de la chaîne.","Les deux numérotations donnent le même indice : 2.","Suffixe -ène, indice 2."] },
    { id:'no-5', level:1, name:'pent-1-yne',
      img:'assets/mol/no-5.svg',
      explanation:"5 carbones, triple liaison entre C1 et C2 : pent-1-yne.",
      hints:["5 carbones, repère la triple liaison (3 traits).","Numérote pour donner le plus petit indice à la triple liaison.","Suffixe -yne, indice 1."] },
    { id:'no-6', level:1, name:'3-méthylpent-1-ène',
      img:'assets/mol/no-6.svg',
      explanation:"Chaîne principale de 5 carbones avec une double liaison en 1 (priorité à l'insaturation sur le substituant) et un méthyle en 3.",
      hints:["5 carbones, une double liaison et un méthyle.","La double liaison doit avoir le plus petit indice possible : 1.","Place le méthyle sur le carbone central : indice 3."] },
    { id:'no-7', level:1, name:'cyclohexane',
      img:'assets/mol/no-7.svg',
      explanation:"Cycle saturé à 6 carbones, aucune ramification : cyclo- + hex- + -ane.",
      hints:["Compte les sommets du cycle.","Aucune liaison double, aucun substituant.","Préfixe cyclo- devant la racine habituelle."] },
    { id:'no-8', level:1, name:'méthylcyclopentane',
      img:'assets/mol/no-8.svg',
      explanation:"Cycle à 5 carbones portant un unique substituant méthyle : aucun indice n'est nécessaire (une seule position possible).",
      hints:["Compte les sommets du cycle : 5.","Un seul substituant sur le cycle.","Avec un seul substituant, pas besoin d'indice de position."] },
    { id:'no-9', level:1, name:'3-éthylhexane',
      img:'assets/mol/no-9.svg',
      explanation:"Chaîne principale de 6 carbones (la plus longue) portant un groupe éthyle. Numérotée pour donner le plus petit indice (3 plutôt que 4) à la ramification.",
      hints:["Cherche la chaîne continue la plus longue : 6 carbones.","Un seul substituant : un groupe éthyle (2 carbones).","Numérote dans le sens qui donne le plus petit indice au substituant."] },
    { id:'no-10', level:1, name:'1,2-diméthylcyclohexane',
      img:'assets/mol/no-10.svg',
      explanation:"Cycle à 6 carbones portant deux méthyles sur des sommets adjacents : indices 1 et 2 (plus petite somme possible).",
      hints:["Cycle à 6 carbones, deux substituants identiques adjacents.","Utilise le préfixe multiplicatif di-.","Numérote pour obtenir la plus petite paire d'indices : 1,2."] },

    // ---------------- Niveau 2 : ramifications, substituants, fonctions simples
    { id:'no-11', level:2, name:'2-chlorobutane',
      img:'assets/mol/no-11.svg',
      explanation:"4 carbones, un chlore en position 2 (plus petit indice possible : 2 plutôt que 3).",
      hints:["4 carbones, un seul substituant : un halogène.","Le chlore n'a pas de suffixe : il reste en préfixe chloro-.","Numérote pour donner le plus petit indice au chlore."] },
    { id:'no-12', level:2, name:'2-méthylpropan-1-ol',
      img:'assets/mol/no-12.svg',
      explanation:"La fonction alcool est prioritaire : le carbone qui porte –OH devient C1. Chaîne de 3 carbones (propan-), méthyle en 2, -ol en 1.",
      hints:["Repère le groupe –OH : c'est la fonction principale.","Le carbone portant –OH est numéroté 1.","Chaîne de 3 carbones + un méthyle en 2."] },
    { id:'no-13', level:2, name:'pentan-2-ol',
      img:'assets/mol/no-13.svg',
      explanation:"5 carbones, –OH en position 2 (plus petit indice possible : 2 plutôt que 4).",
      hints:["5 carbones, une seule fonction : alcool.","Numérote pour donner le plus petit indice au –OH.","Suffixe -ol, indice 2."] },
    { id:'no-14', level:2, name:'butan-2-amine',
      img:'assets/mol/no-14.svg',
      explanation:"4 carbones, –NH2 en position 2 (plus petit indice possible : 2 plutôt que 3).",
      hints:["4 carbones, une seule fonction : amine.","Numérote pour donner le plus petit indice au –NH2.","Suffixe -amine, indice 2."] },
    { id:'no-15', level:2, name:'3-méthylbutan-1-amine',
      img:'assets/mol/no-15.svg',
      explanation:"Le groupe –NH2 terminal impose C1. Chaîne de 4 carbones, méthyle en 3.",
      hints:["Le –NH2 est en bout de chaîne : c'est le carbone 1.","Compte la chaîne principale : 4 carbones.","Place le méthyle sur l'avant-dernier carbone : indice 3."] },
    { id:'no-16', level:2, name:'2-méthylpropanal',
      img:'assets/mol/no-16.svg',
      explanation:"Le carbone de l'aldéhyde est toujours C1. Chaîne de 3 carbones, méthyle en 2.",
      hints:["Le carbonyle d'aldéhyde est toujours en bout de chaîne : C1.","Chaîne principale : 3 carbones.","Un méthyle sur le carbone central : indice 2."] },
    { id:'no-17', level:2, name:'3-méthylbutan-2-one',
      img:'assets/mol/no-17.svg',
      explanation:"Chaîne de 4 carbones ; le carbonyle de cétone est numéroté le plus bas possible : position 2. Méthyle en 3.",
      hints:["4 carbones, repère le groupe carbonyle à l'intérieur de la chaîne (cétone).","Numérote pour donner le plus petit indice possible au carbonyle : 2.","Place le méthyle restant : indice 3."] },
    { id:'no-18', level:2, name:'acide 2-méthylpropanoïque',
      img:'assets/mol/no-18.svg',
      explanation:"Le carbone du –COOH est toujours C1 (fonction la plus prioritaire). Chaîne de 3 carbones, méthyle en 2.",
      hints:["Le –COOH impose toujours le numéro 1.","Compte la chaîne principale : 3 carbones.","Un méthyle sur le carbone central : indice 2."] },
    { id:'no-19', level:2, name:'1-bromo-2-méthylpropane',
      img:'assets/mol/no-19.svg',
      explanation:"Aucune fonction prioritaire (seulement un halogène, sans suffixe) : on numérote pour donner le plus petit jeu d'indices à l'ensemble des substituants {1,2} plutôt que {2,3}.",
      hints:["Pas de suffixe possible ici (halogène = préfixe seul).","Deux substituants : brome et méthyle.","Numérote pour obtenir le plus petit jeu d'indices possible."] },
    { id:'no-20', level:2, name:'2,2-diméthylpropan-1-ol',
      img:'assets/mol/no-20.svg',
      explanation:"Chaîne principale de 3 carbones (propan-1-ol) : le carbone 2 porte deux méthyles supplémentaires identiques, d'où le préfixe multiplicatif 2,2-diméthyl-.",
      hints:["Le –OH impose le numéro 1 : propan-1-ol pour la chaîne de 3 carbones.","Le carbone 2 (central) porte deux méthyles supplémentaires.","Deux substituants identiques sur le même carbone : préfixe di- et indice répété 2,2-."] },

    // ---------------- Niveau 3 : molécules polyfonctionnelles
    { id:'no-21', level:3, name:'3-hydroxybutanal',
      img:'assets/mol/no-21.svg',
      explanation:"L'aldéhyde (plus prioritaire que l'alcool) impose C1. Chaîne de 4 carbones, hydroxy- en préfixe sur le carbone 3.",
      hints:["Deux fonctions : aldéhyde et alcool — laquelle est prioritaire ?","L'aldéhyde donne le suffixe et impose le numéro 1.","L'alcool, moins prioritaire, passe en préfixe hydroxy- avec son indice."] },
    { id:'no-22', level:3, name:'4-hydroxybutanal',
      img:'assets/mol/no-22.svg',
      explanation:"L'aldéhyde impose C1. L'alcool, en bout de chaîne opposé, est en position 4 et passe en préfixe hydroxy-.",
      hints:["Repère les deux fonctions : aldéhyde (prioritaire) et alcool.","L'aldéhyde est toujours en position 1.","L'alcool est à l'autre bout de la chaîne : indice 4."] },
    { id:'no-23', level:3, name:'acide 3-oxobutanoïque',
      img:'assets/mol/no-23.svg',
      explanation:"L'acide carboxylique, le plus prioritaire de tout le programme, impose C1 et donne le suffixe -oïque. La cétone, moins prioritaire, passe en préfixe oxo- (indice 3).",
      hints:["Deux fonctions : acide carboxylique et cétone — laquelle gagne ?","L'acide carboxylique est toujours prioritaire : il impose C1 et le suffixe.","La cétone devient un préfixe oxo- avec son indice."] },
    { id:'no-24', level:3, name:'acide 2-aminopropanoïque',
      img:'assets/mol/no-24.svg',
      explanation:"L'acide carboxylique impose C1. L'amine, très peu prioritaire, passe en préfixe amino- (indice 2). C'est le nom systématique de l'alanine.",
      hints:["Deux fonctions : acide carboxylique et amine.","L'acide carboxylique impose toujours C1 et le suffixe -oïque.","L'amine devient un préfixe amino- avec son indice. (Indice : c'est un acide α-aminé du module B !)"] },
    { id:'no-25', level:3, name:'3-aminobutan-1-ol',
      img:'assets/mol/no-25.svg',
      explanation:"Entre alcool et amine, l'alcool est prioritaire : il impose C1 et le suffixe -ol. L'amine passe en préfixe amino- (indice 3).",
      hints:["Deux fonctions : alcool et amine — laquelle est prioritaire ?","L'alcool est prioritaire sur l'amine (tableau p.20).","L'amine devient un préfixe amino- avec son indice 3."] },
    { id:'no-26', level:3, name:'4-chlorobutan-2-one',
      img:'assets/mol/no-26.svg',
      explanation:"La cétone est la seule fonction à suffixe ; elle impose le sens de numérotation (indice 2, plus petit que 3 dans l'autre sens). Le chlore reste en préfixe.",
      hints:["Une seule fonction à suffixe : la cétone.","Numérote pour donner le plus petit indice possible à la cétone : 2.","Le chlore, sans suffixe, reste en préfixe avec son indice 4."] },
    { id:'no-27', level:3, name:'5-chloropent-2-en-1-ol',
      img:'assets/mol/no-27.svg',
      explanation:"L'alcool impose C1. La double liaison est alors en position 2, et le chlore à l'autre extrémité en position 5.",
      hints:["Trois éléments à placer : alcool, double liaison, chlore.","L'alcool (seule fonction à suffixe) impose le numéro 1.","Numérote ensuite la double liaison (2) puis le chlore (5) dans le même sens."] },
    { id:'no-28', level:3, name:'acide 4-oxopentanoïque',
      img:'assets/mol/no-28.svg',
      explanation:"L'acide carboxylique impose C1 et le suffixe -oïque. La cétone, en position 4, passe en préfixe oxo-.",
      hints:["Deux fonctions : acide carboxylique et cétone.","L'acide carboxylique impose toujours C1.","Compte jusqu'à la cétone depuis le carboxyle : indice 4."] }
  ];

  window.CHIMORG_NOMENCLATURE = { reference, exercises };
})();
