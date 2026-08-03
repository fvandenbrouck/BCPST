/*
 * Registre unique de tous les modules du site, toutes matières confondues.
 * Source de vérité pour la page d'accueil (jauge globale, navigation par matière).
 * status: 'available' | 'soon'
 */
window.MODULES = [
  // ---------- SVT ----------
  {id:'ch5', subject:'svt', subjectLabel:'SVT', cat:'Géologie — Terminale (manuel)', title:"Ch.5 — La datation relative", pages:"p.122-141", status:'available', accent:'var(--rust)', href:'svt/ch05-datation-relative.html'},
  {id:'ch6', subject:'svt', subjectLabel:'SVT', cat:'Géologie — Terminale (manuel)', title:"Ch.6 — La datation absolue", pages:"p.144-161", status:'available', accent:'var(--rust)', href:'svt/ch06-datation-absolue.html'},
  {id:'ch7', subject:'svt', subjectLabel:'SVT', cat:'Géologie — Terminale (manuel)', title:"Ch.7 — Traces du passé mouvementé de la Terre", pages:"p.164-190", status:'available', accent:'var(--rust)', href:'svt/ch07-traces-passe-mouvemente.html'},
  {id:'ch8', subject:'svt', subjectLabel:'SVT', cat:'Biologie végétale — Terminale (manuel)', title:"Ch.8 — Organisation des plantes à fleurs", pages:"p.196-217", status:'available', accent:'var(--rust)', href:'svt/ch08-organisation-plantes-fleurs.html'},
  {id:'ch9', subject:'svt', subjectLabel:'SVT', cat:'Biologie végétale — Terminale (manuel)', title:"Ch.9 — La plante productrice de matière organique", pages:"p.220-241", status:'available', accent:'var(--rust)', href:'svt/ch09-plante-productrice-matiere-organique.html'},
  {id:'ch11', subject:'svt', subjectLabel:'SVT', cat:'Biologie végétale — Terminale (manuel)', title:"Ch.11 — La domestication des plantes", pages:"p.268-282", status:'available', accent:'var(--rust)', href:'svt/ch11-domestication-plantes.html'},
  {id:'ch17', subject:'svt', subjectLabel:'SVT', cat:'Physiologie — Terminale (manuel)', title:"Ch.17 — Cellule musculaire, ATP", pages:"p.422-447", status:'soon', accent:'var(--rust)', href:null},
  {id:'ch18', subject:'svt', subjectLabel:'SVT', cat:'Physiologie — Terminale (manuel)', title:"Ch.18 — Contrôle des flux de glucose", pages:"p.450-473", status:'soon', accent:'var(--rust)', href:null},
  {id:'p1', subject:'svt', subjectLabel:'SVT', cat:'Première (contenu original, sans manuel)', title:"Génétique de base (transmission, mutations, ADN)", pages:"pas de renvoi page", status:'soon', accent:'var(--ochre)', href:null},
  {id:'p2', subject:'svt', subjectLabel:'SVT', cat:'Première (contenu original, sans manuel)', title:"Géologie interne (dynamique de la Terre)", pages:"pas de renvoi page", status:'soon', accent:'var(--ochre)', href:null},
  {id:'ch1', subject:'svt', subjectLabel:'SVT', cat:'Bonus déjà exploré', title:"Ch.1 — L'origine du phénotype (méiose, brassage)", pages:"p.30-53", status:'soon', accent:'#8a8578', href:null},
  {id:'ch12', subject:'svt', subjectLabel:'SVT', cat:'Bonus tertiaire (hors recommandations, lié au carnet de terrain)', title:"Ch.12 — Le climat au Cénozoïque", pages:"p.292-315", status:'soon', accent:'#8a8578', href:null},
  {id:'ch14', subject:'svt', subjectLabel:'SVT', cat:'Bonus tertiaire (hors recommandations, lié au carnet de terrain)', title:"Ch.14 — Le changement climatique actuel : s'informer et agir", pages:"p.342-366", status:'soon', accent:'#8a8578', href:null},

  // ---------- Physique-Chimie ----------
  {id:'pc-boite-a-outils', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Boîte à outils', title:"Alphabet grec, puissances de 10, unités", pages:"Fiche 1 cahier PC", status:'soon', accent:'var(--ochre)', href:null},
  {id:'pc-analyse-dimensionnelle', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Notions transversales', title:"Analyse dimensionnelle", pages:"—", status:'soon', accent:'var(--ochre)', href:null},
  {id:'pc-nomenclature', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Notions transversales', title:"Nomenclature en chimie organique", pages:"—", status:'soon', accent:'var(--ochre)', href:null},
  {id:'pc-mecanique', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Révisions de Terminale', title:"Mouvement dans le champ de pesanteur", pages:"M.1, M.2", status:'soon', accent:'var(--ochre)', href:null},
  {id:'pc-condensateur', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Révisions de Terminale', title:"Charge et décharge d'un condensateur", pages:"S.3", status:'soon', accent:'var(--ochre)', href:null},
  {id:'pc-cinetique', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Révisions de Terminale', title:"Cinétique chimique", pages:"C.4", status:'soon', accent:'var(--ochre)', href:null},
  {id:'pc-premier-principe', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Révisions de Terminale', title:"Premier principe de la thermodynamique", pages:"E.1, E.2, E.3", status:'soon', accent:'var(--ochre)', href:null},
  {id:'pc-oxydoreduction', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Révisions de Terminale', title:"Oxydants/réducteurs, demi-équations", pages:"C.2", status:'soon', accent:'var(--ochre)', href:null},
  {id:'pc-acide-base', subject:'pc', subjectLabel:'Physique-Chimie', cat:'Révisions de Terminale', title:"Acides et bases, Henderson-Hasselbalch", pages:"C.2", status:'soon', accent:'var(--ochre)', href:null},

  // ---------- Mathématiques ----------
  {id:'ma-fractions-puissances', subject:'maths', subjectLabel:'Mathématiques', cat:'Calcul de base', title:"Fractions et puissances", pages:"Fiches 1, 2", status:'soon', accent:'var(--slate)', href:null},
  {id:'ma-litteral-racines', subject:'maths', subjectLabel:'Mathématiques', cat:'Calcul de base', title:"Calcul littéral, racines carrées", pages:"Fiches 3, 4", status:'soon', accent:'var(--slate)', href:null},
  {id:'ma-inegalites', subject:'maths', subjectLabel:'Mathématiques', cat:'Calcul de base', title:"Inégalités et encadrements", pages:"Fiche 27", status:'soon', accent:'var(--slate)', href:null},
  {id:'ma-trinome', subject:'maths', subjectLabel:'Mathématiques', cat:'Fonctions', title:"Trinôme du second degré", pages:"—", status:'soon', accent:'var(--slate)', href:null},
  {id:'ma-exp-log', subject:'maths', subjectLabel:'Mathématiques', cat:'Fonctions', title:"(In)équations exponentielle/logarithme", pages:"Fiche 7", status:'soon', accent:'var(--slate)', href:null},
  {id:'ma-fonctions-usuelles', subject:'maths', subjectLabel:'Mathématiques', cat:'Fonctions', title:"Étude des fonctions usuelles", pages:"—", status:'soon', accent:'var(--slate)', href:null},
  {id:'ma-derivees', subject:'maths', subjectLabel:'Mathématiques', cat:'Fonctions', title:"Calcul de dérivées", pages:"Fiche 11", status:'soon', accent:'var(--slate)', href:null}
];
