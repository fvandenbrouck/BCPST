/*
 * Module B — Familles d'entités chimiques intervenant dans la chimie du
 * vivant (CC03 §II, p.9-15). Organisé par thème (glucides, lipides,
 * protides, acides nucléiques), en insistant sur la relation structure ↔
 * groupe(s) caractéristique(s) ↔ type de liaison, conformément au cahier
 * des charges.
 *
 * Simplifications assumées et signalées explicitement (plutôt que
 * d'inventer une précision que le cours n'exige pas, cf. §9 du cahier des
 * charges) :
 *  - la configuration stéréochimique précise (Haworth détaillé, anomérie
 *    α/β) n'est pas développée : le programme demande seulement de
 *    reconnaître le cycle osidique et la liaison glycosidique ;
 *  - les bases azotées sont représentées schématiquement (pentose/base),
 *    à l'image du schéma de synthèse du cours p.15, plutôt que par leur
 *    structure hétérocyclique complète (hors capacités exigibles de ce
 *    chapitre).
 */
(function(){
  'use strict';

  const B = {
    glucides: {
      label:'Glucides',
      intro:"Les glucides (sucres, oses) sont des composés organiques formés essentiellement de carbone, d'hydrogène et d'oxygène, contenant un groupe carbonyle (aldéhyde ou cétone) et au moins deux groupes hydroxyle. Formule générale des oses : Cn(H2O)n.",
      sourcePage:'p.8-9',
      notions:[
        { id:'bio-ose', term:'Ose (monosaccharide)',
          def:"Unité de base des glucides, non hydrolysable, comprenant entre 3 et 7 atomes de carbone.",
          img:'assets/mol/bio-glucose.svg',
          example:'Glucose — aldohexose (fonction aldéhyde + 5 hydroxyles)',
          groupesCaracteristiques:['Carbonyle (aldéhyde ici, en C1)','Hydroxyle (plusieurs, un par carbone restant)'],
          confusions:"Un ose porte à la fois un groupe carbonyle ET plusieurs hydroxyles : c'est une molécule polyfonctionnelle, pas un simple alcool."
        },
        { id:'bio-diholoside', term:'Diholoside (disaccharide)',
          def:"Glucide formé par deux monosaccharides liés entre eux par une liaison osidique (glycosidique), avec perte d'une molécule d'eau.",
          img:'assets/mol/bio-maltose-schema.svg',
          example:'Maltose = glucose + glucose (liaison glycosidique)',
          groupesCaracteristiques:['Liaison osidique (fonction acétal entre les deux unités)'],
          confusions:"La liaison osidique relie l'hydroxyle anomérique d'un ose à un hydroxyle d'un second ose : c'est une fonction acétal mixte, pas une simple liaison éther."
        },
        { id:'bio-polysaccharide', term:'Polysaccharide (polyoside)',
          def:"Longue chaîne de monosaccharides liés entre eux par des liaisons osidiques successives.",
          img:'assets/mol/bio-amylose-schema.svg',
          example:'Amylose (amidon), glycogène, cellulose',
          groupesCaracteristiques:['Liaisons osidiques répétées (motif entre parenthèses, indice n)'],
          confusions:"Ne pas confondre amidon (réserve végétale), glycogène (réserve animale) et cellulose (paroi végétale) : tous trois sont des polymères de glucose, mais reliés par des liaisons glycosidiques d'orientations différentes (non détaillé à ce niveau)."
        }
      ]
    },
    lipides: {
      label:'Lipides',
      intro:"Les lipides sont des molécules amphiphiles qui constituent la matière grasse des êtres vivants : source d'énergie, stockage de nutriments, formation des membranes cellulaires.",
      sourcePage:'p.10-11',
      notions:[
        { id:'bio-acide-gras-sature', term:'Acide gras saturé',
          def:"Acide carboxylique à longue chaîne hydrocarbonée linéaire, sans liaison double C=C.",
          img:'assets/mol/bio-acide-gras-sature.svg',
          example:'Acide palmitique — CH3–(CH2)14–COOH',
          groupesCaracteristiques:['Carboxyle (–COOH)'],
          confusions:"« Saturé » fait référence à l'absence de liaison double dans la chaîne carbonée, pas à une quelconque saturation en eau."
        },
        { id:'bio-acide-gras-insature', term:'Acide gras insaturé',
          def:"Acide carboxylique à longue chaîne portant une ou plusieurs liaisons doubles C=C (mono- ou polyinsaturé).",
          img:'assets/mol/bio-acide-gras-insature.svg',
          example:'Acide oléique — CH3–(CH2)7–CH=CH–(CH2)7–COOH',
          groupesCaracteristiques:['Carboxyle (–COOH)','Liaison(s) double(s) C=C'],
          confusions:"La liaison double n'est pas un groupe caractéristique au sens des hétéroatomes (cf. remarque Module A), mais elle conditionne fortement les propriétés physiques de l'acide gras."
        },
        { id:'bio-triglyceride', term:'Triglycéride',
          def:"Triester formé par une molécule de glycérol (propan-1,2,3-triol) et trois acides gras, avec élimination de trois molécules d'eau.",
          img:'assets/mol/bio-triglyceride.svg',
          example:'Glycérol + 3 acides gras → triglycéride + 3 H2O',
          groupesCaracteristiques:['Ester (×3)'],
          confusions:"Les trois acides gras estérifiés peuvent être identiques ou différents ; ne pas confondre triglycéride (3 esters) et phosphoglycéride (2 esters + 1 phosphate)."
        },
        { id:'bio-phosphoglyceride', term:'Phosphoglycéride (glycérophospholipide)',
          def:"Lipide amphiphile constitué d'un glycérol estérifié par deux acides gras (queue hydrophobe) et lié à un groupement phosphate portant une tête polaire (hydrophile).",
          img:'assets/mol/bio-phosphoglyceride.svg',
          example:'Phosphatidyléthanolamine (2 esters + phosphate + éthanolamine)',
          groupesCaracteristiques:['Ester (×2)','Anhydride phosphorique / liaison phosphoester','Amine (tête polaire, selon le phosphoglycéride)'],
          confusions:"Composant principal des membranes biologiques, grâce à son caractère amphiphile : ne pas confondre la « tête » polaire (hydrophile) et les « queues » apolaires (hydrophobes, issues des acides gras)."
        },
        { id:'bio-amphiphile', term:'Molécule amphiphile',
          def:"Molécule possédant à la fois une partie hydrophile (qui aime l'eau) et une partie hydrophobe (qui n'aime pas l'eau).",
          img:'assets/mol/bio-amphiphile.svg',
          example:'Phosphoglycérides, savons',
          groupesCaracteristiques:['Tête polaire hydrophile + longue chaîne carbonée hydrophobe'],
          confusions:"C'est cette dualité qui explique la formation spontanée de membranes (bicouches) et de micelles en milieu aqueux."
        }
      ]
    },
    protides: {
      label:'Protides',
      intro:"Les protides désignent l'ensemble des acides aminés, des protéines et des peptides : ces molécules jouent un rôle primordial dans la structure, le métabolisme et la physiologie des cellules des êtres vivants.",
      sourcePage:'p.12-13',
      notions:[
        { id:'bio-acide-amine', term:'Acide α-aminé',
          def:"Composé polyfonctionnel possédant à la fois un groupe carboxyle (–COOH) et un groupe amino (–NH2) portés par le même carbone, dit carbone α.",
          img:'assets/mol/bio-acide-amine-general.svg',
          example:'Structure générale : H2N–CH(R)–COOH',
          groupesCaracteristiques:['Carboxyle (–COOH)','Amino (–NH2)'],
          confusions:"Le qualificatif « α » précise la position du groupe amine par rapport au carboxyle (sur le carbone directement voisin) ; il existe aussi, plus rarement, des amines β, γ ou δ."
        },
        { id:'bio-alanine', term:'Exemple — Alanine',
          def:"Acide α-aminé dont le groupe R est un simple méthyle (–CH3).",
          img:'assets/mol/bio-alanine.svg',
          example:'Acide 2-aminopropanoïque',
          groupesCaracteristiques:['Carboxyle','Amino'],
          confusions:null
        },
        { id:'bio-serine', term:'Exemple — Sérine',
          def:"Acide α-aminé dont le groupe R porte un hydroxyle supplémentaire (–CH2OH).",
          img:'assets/mol/bio-serine.svg',
          example:'R = –CH2OH',
          groupesCaracteristiques:['Carboxyle','Amino','Hydroxyle (sur le groupe R)'],
          confusions:null
        },
        { id:'bio-cysteine', term:'Exemple — Cystéine',
          def:"Acide α-aminé dont le groupe R porte un groupe thiol (–CH2SH).",
          img:'assets/mol/bio-cysteine.svg',
          example:'R = –CH2SH',
          groupesCaracteristiques:['Carboxyle','Amino','Thiol (sur le groupe R)'],
          confusions:"La cystéine est l'un des rares acides aminés dont le groupe R porte un hétéroatome de soufre — important pour la formation de ponts disulfure dans les protéines."
        },
        { id:'bio-peptide', term:'Peptide / liaison peptidique',
          def:"Enchaînement de deux acides aminés ou plus, reliés entre eux par une liaison peptidique : réaction entre le groupe carboxyle d'un acide aminé et le groupe amine du suivant, avec élimination d'une molécule d'eau.",
          img:'assets/mol/bio-dipeptide.svg',
          example:'Dipeptide Gly-Ala (glycylalanine)',
          groupesCaracteristiques:['Amide (liaison C(=O)–NH, dite « peptidique »)'],
          confusions:"La liaison peptidique EST une liaison amide : même groupe caractéristique, mais le mot « peptidique » précise qu'elle relie deux acides aminés."
        }
      ]
    },
    acidesNucleiques: {
      label:'Acides nucléiques',
      intro:"Les acides nucléiques sont des polymères formés d'un très grand nombre de nucléotides (nucléosides monophosphates) liés entre eux par des liaisons phosphodiester. Il existe deux types d'acides nucléiques : l'ADN (acide désoxyribonucléique) et l'ARN (acide ribonucléique).",
      sourcePage:'p.14-15',
      notions:[
        { id:'bio-nucleoside', term:'Nucléoside',
          def:"Association d'une base azotée et d'un sucre de type ribose (ARN) ou désoxyribose (ADN), reliés par une liaison osidique.",
          img:'assets/mol/bio-nucleoside-schema.svg',
          example:'Base + sucre = Nucléoside (ex. adénosine = adénine + ribose)',
          groupesCaracteristiques:['Liaison osidique (base–sucre)'],
          confusions:"Un nucléoside n'a PAS de groupement phosphate : c'est ce qui le distingue du nucléotide."
        },
        { id:'bio-nucleotide', term:'Nucléotide',
          def:"Association d'un nucléoside et d'un (ou plusieurs) groupement(s) phosphate, liés en position 5' du sucre.",
          img:'assets/mol/bio-nucleotide-schema.svg',
          example:'Nucléoside + x phosphate(s) = Nucléotide (ex. AMP, ADP, ATP)',
          groupesCaracteristiques:['Liaison osidique (base–sucre)','Liaison(s) phosphoester / anhydride phosphorique (phosphates)'],
          confusions:"Le nombre de phosphates distingue nucléoside monophosphate, diphosphate et triphosphate (ex. AMP, ADP, ATP) — les liaisons entre phosphates successifs sont des anhydrides phosphoriques (Module A)."
        },
        { id:'bio-acide-nucleique', term:'Acide nucléique (polymère)',
          def:"Polymère de nucléotides liés entre eux par des liaisons phosphodiester, formant un (ARN) ou deux (ADN) brin(s).",
          img:'assets/mol/bio-nucleotide-schema.svg',
          example:'ADN : bases A, T, G, C — ARN : bases A, U, G, C',
          groupesCaracteristiques:['Liaisons phosphodiester successives'],
          confusions:"Les bases puriques (adénine, guanine) et pyrimidiques (cytosine, thymine, uracile) ne sont pas détaillées structuralement dans ce trainer (hors capacités exigibles) : seule l'organisation Base–Sucre–Phosphate est à maîtriser à ce niveau."
        }
      ]
    }
  };

  window.CHIMORG_BIOMOLECULES = B;
})();
