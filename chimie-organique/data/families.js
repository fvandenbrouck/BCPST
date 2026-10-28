/*
 * Module A — Familles fonctionnelles (CC03 §I, p.3-4).
 * Chaque fiche reprend fidèlement le tableau du cours : famille, groupe
 * caractéristique, exemple (molécule + formule topologique), nom
 * systématique, et — seulement quand le cours le prévoit (tableau p.20) —
 * le préfixe/suffixe de nomenclature. Conformément à la consigne du cours
 * ("ne pas inventer de suffixe"), les familles sans suffixe dédié au
 * programme (dérivés halogénés, éther, hémiacétal, acétal, anhydride
 * phosphorique) l'indiquent explicitement au lieu d'en fabriquer un.
 *
 * Chaque `img` pointe vers une formule topologique statique (SVG), générée
 * à partir de code chemfig/LaTeX vérifié — voir tools/molecules.json et
 * tools/build_molecules.py (et CONTRIBUTING.md pour régénérer ou ajouter
 * une molécule).
 */
(function(){
  'use strict';

  const F = [
    {
      id:'alcane', name:'Alcane', group:'sans-heteroatome',
      groupeCaracteristique:'Aucun (hydrocarbure sans liaison multiple)',
      formuleGenerique:'CnH2n+2 — uniquement liaisons C–C et C–H simples',
      exampleName:'Butane (gaz domestique)',
      img:'assets/mol/fam-alcane.svg',
      systematicName:'butane',
      suffix:'-ane', prefix:null,
      suffixNote:"Suffixe de base de tous les hydrocarbures saturés acycliques.",
      confusions:"Les liaisons C–C multiples (double, triple) sont des « fonctionnalités particulières » mais ne sont pas des groupes caractéristiques : un alcène ou un alcyne reste un hydrocarbure, pas une « famille fonctionnelle » au sens des hétéroatomes.",
      sourcePage:'p.3'
    },
    {
      id:'alcene', name:'Alcène', group:'sans-heteroatome',
      groupeCaracteristique:'Liaison double C=C',
      formuleGenerique:'CnH2n (une double liaison) — hydrocarbure possédant une ou plusieurs liaisons doubles',
      exampleName:'Hex-1-ène (précurseur de lubrifiants)',
      img:'assets/mol/fam-alcene.svg',
      systematicName:'hex-1-ène',
      suffix:'-ène', prefix:null,
      suffixNote:"Premier suffixe d'insaturation (indice = position de la liaison double).",
      confusions:"Ne pas confondre avec un alcane ramifié : repérer la double barre entre deux sommets du trait.",
      sourcePage:'p.3'
    },
    {
      id:'alcyne', name:'Alcyne', group:'sans-heteroatome',
      groupeCaracteristique:'Liaison triple C≡C',
      formuleGenerique:'CnH2n-2 (une triple liaison)',
      exampleName:'Éthyne — acétylène (chalumeaux oxy-coupeurs)',
      img:'assets/mol/fam-alcyne.svg',
      systematicName:'éthyne',
      suffix:'-yne', prefix:null,
      suffixNote:"Premier suffixe d'insaturation (indice = position de la liaison triple).",
      confusions:"Trois traits parallèles = triple liaison, à ne pas confondre avec deux doubles liaisons consécutives (diène).",
      sourcePage:'p.3'
    },
    {
      id:'halogene', name:'Dérivés halogénés', group:'heteroatome',
      groupeCaracteristique:'–F, –Cl, –Br, –I (halogène)',
      formuleGenerique:'R–X avec X = F, Cl, Br ou I',
      exampleName:'1-chlorobutane (vermifuge)',
      img:'assets/mol/fam-halogene.svg',
      systematicName:'1-chlorobutane',
      suffix:null, prefix:'fluoro-, chloro-, bromo-, iodo-',
      suffixNote:"Le programme ne prévoit pas de suffixe pour les dérivés halogénés : l'halogène est toujours désigné par un préfixe (jamais de suffixe à inventer).",
      confusions:"Famille sans groupe caractéristique « suffixable » : contrairement à l'alcool ou l'amine, elle ne peut jamais donner le nom de la chaîne principale par un suffixe.",
      sourcePage:'p.3'
    },
    {
      id:'alcool', name:'Alcool', group:'heteroatome',
      groupeCaracteristique:'–OH (hydroxyle)',
      formuleGenerique:'R–OH',
      exampleName:'Éthanol (alcool du vin)',
      img:'assets/mol/fam-alcool.svg',
      systematicName:'éthanol',
      suffix:'-ol', prefix:'hydroxy-',
      suffixNote:"Suffixe -ol (2e suffixe, groupe caractéristique) ou préfixe hydroxy- si un groupe plus prioritaire est présent.",
      confusions:"Un seul –OH sur un carbone = alcool. Si ce même carbone porte aussi un –OR, ce n'est plus un alcool mais un hémiacétal.",
      sourcePage:'p.3'
    },
    {
      id:'aldehyde', name:'Aldéhyde', group:'heteroatome',
      groupeCaracteristique:'>C=O en bout de chaîne (carbonyle)',
      formuleGenerique:'R–CHO',
      exampleName:'Méthanal — formol (conservation des tissus, arômes)',
      img:'assets/mol/fam-aldehyde.svg',
      systematicName:'méthanal',
      suffix:'-al', prefix:'oxo- (formyl- en préfixe terminal)',
      suffixNote:"Suffixe -al, toujours porté par le carbone n°1 de la chaîne principale.",
      confusions:"Le carbonyle de l'aldéhyde est obligatoirement en bout de chaîne (lié à un seul autre carbone) ; à l'intérieur de la chaîne, c'est une cétone.",
      sourcePage:'p.3'
    },
    {
      id:'cetone', name:'Cétone', group:'heteroatome',
      groupeCaracteristique:">C=O à l'intérieur de la chaîne (carbonyle)",
      formuleGenerique:"R–CO–R' (R et R' ≠ H)",
      exampleName:'Acétone (solvant)',
      img:'assets/mol/fam-cetone.svg',
      systematicName:'propan-2-one',
      suffix:'-one', prefix:'oxo-',
      suffixNote:"Suffixe -one, précédé de l'indice de position du carbone carbonylé.",
      confusions:"Contrairement à l'aldéhyde, le carbone du groupe carbonyle est relié à deux autres atomes de carbone.",
      sourcePage:'p.3'
    },
    {
      id:'acide-carboxylique', name:'Acide carboxylique', group:'heteroatome',
      groupeCaracteristique:'–COOH (carboxyle)',
      formuleGenerique:'R–COOH',
      exampleName:'Acide acétique — acide éthanoïque (acide du vinaigre)',
      img:'assets/mol/fam-acide-carboxylique.svg',
      systematicName:'acide éthanoïque',
      suffix:'-oïque (acide ... -oïque)', prefix:'carboxy-',
      suffixNote:"Groupe le plus prioritaire de tout le programme : s'il est présent, c'est toujours lui le suffixe de la chaîne principale.",
      confusions:"Ne pas confondre le carboxyle (–COOH, un seul groupe) avec l'ester (–COOR, R≠H) : l'acide porte un H sur l'oxygène, l'ester porte une chaîne carbonée.",
      sourcePage:'p.3'
    },
    {
      id:'amine', name:'Amine', group:'heteroatome',
      groupeCaracteristique:'–NH2 (amino) — les H peuvent être remplacés par des chaînes carbonées',
      formuleGenerique:'R–NH2, R2NH ou R3N (amine primaire, secondaire, tertiaire)',
      exampleName:'Butan-1-amine (précurseur de pesticide et de médicaments)',
      exampleName2:'Triéthylamine (solvant)',
      img:'assets/mol/fam-amine.svg',
      img2:'assets/mol/fam-amine-2.svg',
      systematicName:'butan-1-amine',
      suffix:'-amine', prefix:'amino-',
      suffixNote:"Groupe le moins prioritaire du tableau p.20 : presque toujours cité en préfixe (amino-) dès qu'une autre fonction est présente.",
      confusions:"Classement en 3 classes selon le degré de substitution de l'azote (primaire/secondaire/tertiaire) — ne pas confondre avec le degré de ramification de la chaîne carbonée elle-même.",
      sourcePage:'p.4-5'
    },
    {
      id:'amide', name:'Amide', group:'heteroatome',
      groupeCaracteristique:'–CONH2 (amido) — les H peuvent être remplacés par des chaînes carbonées',
      formuleGenerique:'R–CO–NH2, R–CO–NHR\' ou R–CO–NR\'R" ',
      exampleName:'Isovaléramide (présent dans la valériane, anxiolytique)',
      exampleName2:'Diméthylformamide (solvant et réactif)',
      img:'assets/mol/fam-amide.svg',
      img2:'assets/mol/fam-amide-2.svg',
      systematicName:'3-méthylbutanamide',
      suffix:'-amide', prefix:'carbamoyl-',
      suffixNote:"Suffixe -amide ; classement en amides N-substitués selon le nombre de groupes acyles/alkyles sur l'azote, comme pour les amines.",
      confusions:"Ne pas confondre amine et amide : l'amide porte un carbonyle C=O directement lié à l'azote, l'amine non.",
      sourcePage:'p.4-5'
    },
    {
      id:'ester', name:'Ester', group:'heteroatome',
      groupeCaracteristique:'–COOR, R≠H (ester)',
      formuleGenerique:"R–CO–O–R' (R' ≠ H)",
      exampleName:"Acétate d'isoamyle (odeur de banane)",
      img:'assets/mol/fam-ester.svg',
      systematicName:"éthanoate de 3-méthylbutyle",
      suffix:'-oate de ... -yle', prefix:'alcoxycarbonyl-',
      suffixNote:"Nom en deux mots : « ...oate » (issu de l'acide) + « de ...yle » (chaîne alcool).",
      confusions:"Le carbone carbonylé de l'ester est doublement lié à un O et simplement lié à un second O qui porte une chaîne carbonée (R' ≠ H) — sans chaîne sur ce second O, ce serait un acide carboxylique.",
      sourcePage:'p.4'
    },
    {
      id:'ether', name:'Éther', group:'heteroatome',
      groupeCaracteristique:"R–O–R' (alcoxy)",
      formuleGenerique:"R–O–R'",
      exampleName:'Éther diéthylique (solvant)',
      img:'assets/mol/fam-ether.svg',
      systematicName:'éthoxyéthane',
      suffix:null, prefix:'alcoxy- (ex. méthoxy-, éthoxy-)',
      suffixNote:"Pas de suffixe au programme : un éther se nomme comme une chaîne alcane substituée par un groupe alcoxy- en préfixe.",
      confusions:"L'oxygène de l'éther est à l'intérieur de la chaîne, lié à deux carbones, sans H ni liaison double — à ne pas confondre avec l'alcool (–OH, un seul carbone voisin).",
      sourcePage:'p.4'
    },
    {
      id:'thiol', name:'Thiol', group:'heteroatome',
      groupeCaracteristique:'–SH (sulfhydryle)',
      formuleGenerique:'R–SH',
      exampleName:'Méthanethiol',
      img:'assets/mol/fam-thiol.svg',
      systematicName:'méthanethiol',
      suffix:'-thiol', prefix:'sulfanyl-',
      suffixNote:"Analogue soufré de l'alcool : suffixe -thiol (et non -ol).",
      confusions:"Analogue de l'alcool avec S à la place de O : ne pas nommer -ol un composé soufré.",
      sourcePage:'p.4'
    },
    {
      id:'hemiacetal', name:'Hémiacétal', group:'heteroatome',
      groupeCaracteristique:'Un même carbone porte à la fois –OH et –OR',
      formuleGenerique:'R–CH(OH)(OR\')',
      exampleName:'1-éthoxybutan-1-ol',
      img:'assets/mol/fam-hemiacetal.svg',
      systematicName:'1-éthoxybutan-1-ol',
      suffix:null, prefix:null,
      suffixNote:"Famille hors tableau de suffixes du programme : le cours ne prévoit pas de nomenclature systématique dédiée aux hémiacétals en BCPST1 ; on se limite à les identifier et à les nommer par leur structure (alcool + éther sur le même carbone).",
      confusions:"Un hémiacétal porte OH **et** OR sur le même carbone (contre deux OR pour l'acétal, ou un seul OH pour l'alcool simple).",
      sourcePage:'p.4'
    },
    {
      id:'acetal', name:'Acétal', group:'heteroatome',
      groupeCaracteristique:"Un même carbone porte à la fois –OR1 et –OR2",
      formuleGenerique:"R–CH(OR1)(OR2)",
      exampleName:'1,1-diéthoxybutane',
      img:'assets/mol/fam-acetal.svg',
      systematicName:'1,1-diéthoxybutane',
      suffix:null, prefix:null,
      suffixNote:"Comme pour l'hémiacétal, aucun suffixe n'est prévu par le programme de BCPST1 : on se limite à l'identification structurale.",
      confusions:"Deux groupes –OR sur le même carbone, sans –OH restant : un acétal est souvent formé par réaction d'un hémiacétal avec un second alcool.",
      sourcePage:'p.4'
    },
    {
      id:'anhydride-phosphorique', name:'Anhydride phosphorique', group:'heteroatome',
      groupeCaracteristique:'–O–P(=O)(OH)–O–P(=O)(OH)–O– (liaison phosphoanhydride)',
      formuleGenerique:'R–O–PO(OH)–O–PO(OH)–O–R\'',
      exampleName:"Groupe diphosphate (ex. dans l'ATP, adénosine triphosphate)",
      img:'assets/mol/fam-anhydride-phosphorique.svg',
      systematicName:"groupe anhydride phosphorique (diphosphate)",
      suffix:null, prefix:null,
      suffixNote:"Groupe spécifique à la chimie du vivant (ATP, ADP...), hors nomenclature systématique du programme : on apprend à le reconnaître, pas à le nommer de façon systématique.",
      confusions:"Chaque atome de phosphore porte une liaison double P=O et un –OH, reliés entre eux par un pont –O– : c'est cette liaison P–O–P qui définit l'anhydride (à l'image d'un anhydride d'acide carboxylique, mais avec le phosphore).",
      sourcePage:'p.4, p.14-15 (ATP)'
    }
  ];

  window.CHIMORG_FAMILIES = F;
})();
