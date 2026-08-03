# Site de révisions BCPST1 — Cahier des charges & prompt de mise en œuvre pour Claude Code

**Élève concernée :** entre en BCPST1 (Lycée Marcelin Berthelot), n'a pas suivi la spécialité SVT en Terminale.
**Dépôt local à utiliser comme racine de travail :** `/Users/francoisvandenbrouck/Documents/FV/perso/alix/OnBoardingBCPST`
**Dépôt GitHub cible :** `https://github.com/fvandenbrouck/` (dépôt BCPST à créer, déploiement recommandé via GitHub Pages)

Ce document est conçu pour être donné tel quel à Claude Code (ou collé en tête de session) comme fil conducteur. Il reprend et complète la synthèse d'un premier projet Claude.ai qui avait produit un prototype fonctionnel (`revisions-bcpst.html`) sur un module pilote de SVT. **Si ce fichier existe sur la machine, le placer à la racine du dépôt de travail avant de commencer** — il contient déjà le moteur (QCM pondéré, flashcards, carte mentale, stockage) à réutiliser/factoriser plutôt qu'à réécrire.

Toutes les sources PDF citées ci-dessous (recommandations estivales, programmes officiels, cahier de calcul, sommaire du manuel SVT) doivent être copiées dans un sous-dossier `references/` du dépôt pour que Claude Code puisse les consulter directement plutôt que de se fier à ce résumé.

---

## 0. Principes transverses non négociables

Ces règles s'appliquent à **toutes** les matières et à tous les modules construits, présents et futurs.

### 0.1 Droit d'auteur

- Le manuel *Planète SVT Terminale spécialité* (Hachette) est une œuvre protégée : **jamais** de reproduction de son texte, de ses énoncés, de ses schémas. Seuls des renvois "page X / chapitre Y" (pur index) sont autorisés.
- Les programmes officiels (BO, annexes du Ministère) ne sont pas soumis à la même contrainte de propriété qu'un manuel commercial, mais on n'en recopie pas non plus de longs passages : ils servent de **référentiel de notions et de vocabulaire**, reformulé et illustré par du contenu pédagogique original écrit pour ce site.
- Le cahier de calcul BCPST (Lycée Berthelot / adaptation d'un cahier collectif CPGE) est un document pédagogique existant : on **cite ses numéros de fiche comme index** (comme pour le manuel SVT), mais les exercices proposés sur le site sont rédigés spécifiquement pour le site, pas recopiés du cahier.
- Aucune image, aucun schéma scanné d'un ouvrage tiers n'est jamais intégré au site.

### 0.2 Pédagogie

- Toujours articuler explicitement **Première → Terminale → BCPST1** : chaque module doit indiquer d'où vient la notion (déjà vue au lycée, à quel niveau) et où elle va (dans quel thème du programme BCPST1 elle sera réinvestie). C'est la valeur ajoutée principale du site par rapport à une simple fiche de révision.
- Rappel actif et production active priment sur la lecture passive (cf. carte mentale progressive du module pilote : jamais de modèle pré-rempli, l'élève construit puis compare).
- Ton toujours encourageant dans les diagnostics, jamais culpabilisant ; un score faible déclenche une stratégie de consolidation numérotée, jamais un jugement.

### 0.3 Technique

- Stockage persistant via `window.storage` (API déjà utilisée dans le prototype), en **données personnelles** (`shared:false`) pour tout ce qui est progression individuelle.
- Pas de `localStorage`/`sessionStorage` (non supportés dans les artifacts Claude, et de toute façon le site sera déployé en HTML statique sur GitHub Pages — vérifier à ce moment-là si `window.storage` reste disponible hors du contexte artifact Claude.ai ; **si le site est déployé de façon autonome hors Claude.ai, il faudra remplacer ce mécanisme par une persistance IndexedDB/localStorage classique côté navigateur**, à trancher explicitement en tout début de développement par Claude Code — c'est la première décision technique à prendre avant d'écrire le moindre module).
- Aucun appel à l'API Anthropic par défaut dans les QCM (latence, confidentialité, prévisibilité pédagogique) : le diagnostic reste un système à règles pondérées par la difficulté, comme spécifié en §3.

---

## 1. Architecture du dépôt

Le prototype initial était un fichier HTML unique (~800 lignes). Avec l'ajout de ~20 modules SVT, ~10 modules Physique-Chimie et une dizaine de modules Maths, un fichier unique deviendrait ingérable. **Restructurer dès la reprise du projet** :

```
/OnBoardingBCPST
├── index.html                  # Page d'accueil : jauge en strates, navigation par matière
├── assets/
│   ├── css/strates.css         # Design system commun (cf. §6)
│   ├── js/storage.js           # Wrapper autour de window.storage (ou fallback local)
│   ├── js/qcm-engine.js        # Moteur QCM pondéré + diagnostic 4 paliers (factorisé, réutilisé par les 3 matières)
│   ├── js/flashcards-engine.js
│   ├── js/mindmap-engine.js    # SVT + PC uniquement (cf. §4.4)
│   └── js/progress-gauge.js
├── svt/
│   ├── ch05-datation-relative.html   # Module pilote existant, à réintégrer tel quel dans la nouvelle arborescence
│   ├── ch06-datation-absolue.html
│   ├── ... (un fichier par module, cf. §2)
├── physique-chimie/
│   ├── analyse-dimensionnelle.html
│   ├── nomenclature-organique.html
│   ├── revision-mecanique-champ-pesanteur.html
│   ├── revision-condensateur.html
│   ├── revision-cinetique-chimique.html
│   ├── revision-premier-principe.html
│   ├── revision-oxydoreduction.html
│   ├── revision-acide-base.html
├── maths/
│   ├── calcul-fractions-puissances.html
│   ├── calcul-litteral-racines.html
│   ├── trinome-second-degre.html
│   ├── fonctions-usuelles.html
│   ├── inequations-exp-log.html
└── references/                 # PDFs sources, jamais servis publiquement (à exclure du déploiement Pages via .gitignore ou dossier hors racine publiée)
```

Chaque page de module reste un artefact HTML autonome au sens fonctionnel (peut s'ouvrir seul), mais importe les scripts communs pour ne pas dupliquer le moteur QCM/flashcards/stockage dans chaque fichier.

---

## 2. Partie 1 — SVT : suite des modules (rappel + priorisation)

Le gabarit à 4 onglets (Cours / Flashcards / QCM / Carte mentale) et toutes les spécifications techniques du module pilote (Ch.5 — La datation relative) sont **validés et ne changent pas**. Rappel des règles clés à répliquer sur chaque nouveau module SVT :

- 1 fiche de cours par unité du chapitre, rédaction 100 % originale, tag de renvoi de page.
- 10-12 flashcards, notées À revoir / Correct / Facile.
- 15-20 questions QCM (≥10 connaissances, ≥5 raisonnement avec indice de méthode jamais la réponse), score pondéré par difficulté, diagnostic à 4 paliers, comparaison à la tentative précédente.
- Carte mentale progressive construite de mémoire + carte modèle en comparaison (jamais en remplacement).

Ordre de construction recommandé (issu du croisement recommandations Berthelot × sommaire manuel, déjà établi) :

| Ordre | Module | Chapitre manuel | Pages | Notes d'articulation |
|---|---|---|---|---|
| 1 | *(fait)* Datation relative | Ch.5 | 122-141 | pilote |
| 2 | Datation absolue | Ch.6 | 144-161 | prolonge directement Ch.5 ; vocabulaire radiochronomètres réutilisé en PC (isotopes, décroissance — lien possible avec le module Maths sur exponentielle/logarithme) |
| 3 | Traces du passé mouvementé de la Terre | Ch.7 | 164-190 | clôt le thème "passé géologique" |
| 4 | Organisation des plantes à fleurs | Ch.8 | 196-217 | ouvre le thème "plante domestiquée", prioritaire dans les recommandations Terminale |
| 5 | La plante productrice de matière organique | Ch.9 | 220-241 | lien direct avec le programme BCPST1 SVT (bilans d'énergie, cycle du carbone) et avec le thème E de physique-chimie (bilans d'énergie) |
| 6 | La domestication des plantes | Ch.11 | 268-282 | dernier point Terminale explicitement cité par les recommandations sur ce thème |
| 7 | Cellule musculaire, ATP | Ch.17 | 422-447 | ouvre "corps humain et santé" |
| 8 | Contrôle des flux de glucose | Ch.18 | 450-473 | dernier point Terminale explicitement listé |
| 9-10 | Modules "Première" sans manuel (génétique de base ; géologie interne) | — | — | contenu 100 % original, pas de renvoi de page — cf. gabarit §2 de la synthèse initiale, inchangé |
| 11 (bonus) | Origine du phénotype (méiose, brassage) | Ch.1 | 30-53 | priorité secondaire, déjà exploré en tout début de projet |

Construire dans cet ordre, un module à la fois, en validant chaque module (relecture rapide du cours + test du QCM) avant de passer au suivant.

---

## 3. Partie 2 — Physique-Chimie

### 3.1 Cadrage à partir des recommandations Berthelot

Les enseignants de sciences physiques insistent sur trois points précis, à traiter en **prérequis transversal** avant les modules disciplinaires :

1. Maîtrise du calcul littéral et des outils mathématiques du secondaire (renvoi direct vers les modules Maths, §4).
2. Manipulation des grandeurs, unités, puissances de 10 (fiche 1 du cahier d'entraînement PC dédié — présent dans `references/`).
3. Alphabet grec (nom + tracé des minuscules/majuscules).

**Ajouter un module "Boîte à outils" en tête de la section Physique-Chimie**, distinct des modules disciplinaires, contenant :

- une fiche mémo interactive de l'alphabet grec (flashcards recto lettre / verso nom-prononciation-usage typique en physique) ;
- un mini-module puissances de 10 / unités / notation scientifique, articulé avec la fiche 1 du cahier PC.

Le programme de BCPST1 en physique-chimie s'appuie explicitement sur le programme de spécialité de **Première** (et non uniquement Terminale) : chaque module doit donc, quand c'est pertinent, rappeler la notion de Première avant de la prolonger avec les apports de Terminale, avant d'indiquer où elle est reprise en BCPST1.

### 3.2 Gabarit adapté pour la Physique-Chimie

Le gabarit à 4 onglets SVT ne convient pas tel quel : la physique-chimie mobilise moins de vocabulaire à mémoriser (flashcards) et davantage de calcul et d'application numérique. Gabarit retenu :

| Onglet | Contenu | Différence vs SVT |
|---|---|---|
| **Cours** | Fiches originales par notion, mêmes règles qu'en SVT | inchangé |
| **QCM** | Connaissances + raisonnement, même moteur pondéré à 4 paliers | inchangé dans le mécanisme |
| **Applications numériques** *(remplace Flashcards)* | Exercices courts à réponse numérique saisie par l'élève, avec tolérance (`±x %` ou `±x unités`), correction affichant la méthode pas à pas | nouveau — remplace les flashcards, peu adaptées à cette matière |
| **Carte mentale** | Conservée pour les modules à forte structure conceptuelle (nomenclature, cinétique) ; **facultative/allégée** pour les modules très calculatoires (analyse dimensionnelle, applications directes de lois) | conservée mais non systématique |

Chaque question d'"Applications numériques" a un champ `tolerance` et un champ `methode` (indice de démarche, jamais le résultat, sur le même principe que le `hint` du QCM SVT). Le score de cet onglet alimente aussi le diagnostic à 4 paliers, sur le même barème pondéré par difficulté que le QCM.

**Renvoi de référence** : pas de manuel papier disponible pour cette matière. Utiliser comme "page" de renvoi le **code du programme officiel BCPST1** (ex. `S.3`, `C.4.1`, `M.1`, `E.2`) plutôt qu'un numéro de page — affiché en badge monospace (IBM Plex Mono), cohérent avec l'esprit "carnet de terrain" de l'identité Strates. Ce code figure dans les documents `BCPST.pdf` / `ensecsup111_annexes_1407948.pdf` du dossier `references/`.

### 3.3 Modules à construire

**a) Analyse dimensionnelle** (cours + QCM/applications numériques)

- Notions : grandeur, unité, dimension, équation aux dimensions, homogénéité d'une formule, système international, usage de l'analyse dimensionnelle pour retrouver ou vérifier une loi physique.
- Articulation : notion nouvelle en tant que telle en BCPST1 (capacité transversale "conduire une analyse dimensionnelle", présente dans toutes les parties du programme), mais s'appuie entièrement sur la maîtrise des puissances de 10 et du calcul littéral déjà demandée par les recommandations (fiche 1 PC + fiches Maths).
- QCM : mélanger "retrouver la dimension d'une grandeur dérivée à partir d'une loi connue" (raisonnement) et "convertir/vérifier l'homogénéité d'une expression" (connaissance/application directe).
- Un fichier source déjà présent dans `references/` (cours d'analyse dimensionnelle, Lycée Louis-le-Grand) peut servir de base de compréhension pour Claude Code — **ne jamais en recopier le texte**, seulement s'en inspirer pour vérifier l'exactitude scientifique du contenu original écrit.

**b) Nomenclature en chimie organique** (cours + QCM/applications, carte mentale conseillée)

- Point d'appui explicite demandé par l'utilisateur : le programme de **Terminale** spécialité PC. Articulation à respecter :
  - Première : formules brutes/semi-développées, squelette carboné saturé, groupes caractéristiques de base (alcool, aldéhyde, cétone, acide carboxylique), lien nom ↔ formule semi-développée pour une molécule à un seul groupe caractéristique.
  - Terminale : extension à esters, amines, amides, halogénoalcanes, squelettes insaturés et cycliques, formule topologique, isomérie de constitution.
  - BCPST1 : élargissement supplémentaire (thiol, hémiacétal/acétal, anhydride phosphorique) + nomenclature des familles de la chimie du vivant (oses/glucides, lipides, acides aminés/peptides/protéines, nucléosides/nucléotides/acides nucléiques) — ce dernier point crée un pont naturel avec les modules SVT de biologie moléculaire et végétale déjà construits ou prévus (à mentionner explicitement dans le cours comme lien inter-matières, cohérent avec l'esprit du programme BCPST qui encourage ces croisements).
- QCM/applications : reconnaître et nommer une famille fonctionnelle à partir d'une formule (connaissance), construire ou identifier des isomères de constitution (raisonnement).
- Carte mentale conseillée ici (structure taxonomique naturelle : familles fonctionnelles → sous-familles → exemples).

**c) Six modules "Révisions de Terminale" (QCM/applications numériques ciblés, cours de rappel court)**

Chacun de ces modules est plus court que les modules a) et b) : un cours de rappel condensé (pas de fiche par unité), puis un bloc de QCM + applications numériques. Objectif : réactiver une notion déjà vue en Terminale avant que le cours de BCPST1 ne la prolonge dès les premières semaines.

| Module | Rappel Terminale | Prolongement direct en BCPST1 |
|---|---|---|
| Mouvement dans le champ de pesanteur (coordonnées cartésiennes) | 2nde loi de Newton, vecteur accélération, résolution des équations horaires en repère cartésien, mouvement de projectile | Thème M — mouvements et interactions (M.1, M.2), second semestre |
| Charge et décharge d'un condensateur | Circuit RC, équation différentielle du premier ordre, constante de temps τ | Thème S — dynamique d'un circuit électrique du premier ordre (S.3) |
| Cinétique chimique | Vitesse volumique de disparition/apparition, temps de demi-réaction, facteurs cinétiques, catalyse | Thème C — lois de vitesse d'ordre 0/1/2, loi d'Arrhenius, mécanismes réactionnels (C.4) |
| Premier principe de la thermodynamique | Transformations exo/endothermiques, énergie de réaction, notions de travail et transfert thermique | Thème E — bilans d'énergie pour un système thermodynamique (E.1, E.2), puis machines thermiques (E.3) |
| Oxydants/réducteurs et demi-équations électroniques | Couple oxydant/réducteur, écriture d'une demi-équation électronique, équilibrage d'une réaction d'oxydoréduction | Thème C — transformations chimiques, réactions d'oxydoréduction en solution (C.2) |
| Acides et bases : domaines de prédominance, relation de Henderson-Hasselbalch | Couple acide/base, pKa, diagramme de prédominance, dosage acido-basique | Thème C — réactions acide-base, titrages (C.2) ; réinvesti en biologie (régulation du pH, tampons physiologiques) — lien possible avec les modules SVT "corps humain et santé" |

Pour chacun, produire au moins 8-10 questions mêlant connaissance directe (définir, écrire une demi-équation, lire un diagramme) et raisonnement (exploiter une courbe de titrage, déterminer un ordre de réaction à partir de données, calculer une composition à l'équilibre par Henderson-Hasselbalch).

---

## 4. Partie 3 — Mathématiques

### 4.1 Cadrage à partir des recommandations Berthelot et du cahier de calcul

Contrairement à la SVT et à la physique-chimie, il existe déjà une ressource de référence indexable : le **cahier de calcul BCPST** (`Cahiers_de_calculs_BCPST.pdf`, présent dans `references/`), organisé en fiches numérotées, avec un système de pictogrammes horloge (1 à 4) indiquant la difficulté/longueur de chaque exercice. **Reprendre ce système de 1 à 4 horloges comme indicateur de difficulté**, en cohérence avec l'esprit du document source, plutôt que le triplet 1/2/3 utilisé en SVT/PC — c'est un signal déjà familier pour l'élève.

Fiches explicitement demandées par les recommandations, à utiliser comme **renvoi de référence** (badge "Fiche n°X", même logique que les pages du manuel SVT ou les codes de programme en PC) :

- Fiche 1 — Fractions
- Fiche 2 — Puissances
- Fiche 3 — Développer/factoriser/identités remarquables (calcul littéral)
- Fiche 4 — Racines carrées
- Fiche 27 (exercices 1-2) — Inégalités et encadrements
- Fiche 7 (exercices 1 à 5 et 9) — (In)équations exponentielle/logarithme
- Fiche 11 (exercices 1 à 4) — Calcul de dérivées
- Trinôme du second degré (forme canonique, racines, signe) — pas de fiche unique identifiée dans le sommaire fourni ; vérifier dans le PDF si une fiche dédiée existe, sinon traiter comme module sans renvoi de fiche (comme les modules SVT "Première" sans manuel).
- Étude des fonctions usuelles (exponentielle, logarithme, carrée, inverse, racine) : définition, dérivée, variations, allure graphique.

Articulation Terminale → BCPST1 : le programme officiel de mathématiques BCPST1 (présent dans `BCPST.pdf` / `ensecsup111_annexes_1407948.pdf`, section "Mathématiques – BCPST1") s'inscrit explicitement dans la continuité de la spécialité Première et de l'option mathématiques complémentaires de Terminale, et démarre notamment par un chapitre "Analyse 1 — Suites" puis "Analyse 2 — Fonctions réelles usuelles" qui consolide et enrichit le registre de fonctions déjà connu. Chaque module Maths du site doit donc se terminer par une phrase de type "en BCPST1, ce point sera repris et enrichi dans le chapitre [Analyse X]".

### 4.2 Gabarit adapté pour les Mathématiques

Le gabarit SVT (Cours/Flashcards/QCM/Carte mentale) ne correspond pas non plus tel quel à cette matière, où l'entraînement calculatoire prime. Gabarit retenu :

| Onglet | Contenu | Différence vs SVT |
|---|---|---|
| **Cours** | Fiche courte rappelant définitions, propriétés et méthode(s) types | plus court qu'en SVT, centré sur la méthode |
| **Entraînement calculatoire** *(remplace QCM comme onglet principal)* | Série d'exercices à réponse exacte saisie (valeur, expression factorisée, intervalle…), difficulté 1-4 horloges, correction détaillée pas à pas | nouveau — c'est le cœur du module, cohérent avec la logique du cahier de calcul |
| **Cartes-méthode** *(remplace Flashcards)* | Recto = situation/type de calcul ("je vois une inéquation avec un logarithme"), verso = méthode à appliquer, pas une définition isolée | flashcards réinterprétées comme aide-mémoire de méthode plutôt que de vocabulaire |
| **QCM conceptuel** *(court, 6-10 questions)* | Questions sur le "pourquoi"/"quand" (quand peut-on utiliser telle identité remarquable, quel est le domaine de définition, quel est le signe d'un trinôme selon le discriminant…) | remplace le QCM connaissance/raisonnement de la SVT par une distinction **technique vs compréhension** : `type: 'technique'` (exécution correcte d'un calcul) vs `type: 'comprehension'` (choix de méthode, interprétation), même moteur de score pondéré et même diagnostic à 4 paliers, juste les deux catégories renommées pour coller à la matière |
| **Carte mentale** | **Non systématique** ; à réserver aux modules où une structure conceptuelle le justifie (ex. étude de fonctions : domaine → dérivée → variations → allure), à omettre pour les modules purement techniques (fractions, puissances) | facultative, décision au cas par cas |

### 4.3 Modules à construire

Prioriser dans l'ordre des recommandations :

| Module | Fiches de référence | Contenu |
|---|---|---|
| Calcul sur les fractions et puissances | Fiches 1, 2 | opérations, simplifications, priorités |
| Calcul littéral, racines carrées, identités remarquables | Fiches 3, 4 | développer/factoriser, manipuler des expressions avec lettres (compétence également requise en physique-chimie — le mentionner comme pont explicite) |
| Inégalités et encadrements | Fiche 27 (ex. 1-2) | résolution d'inéquations, encadrement d'une expression |
| Trinôme du second degré | — (pas de fiche identifiée, à vérifier) | forme canonique, discriminant, signe, racines |
| (In)équations exponentielle/logarithme | Fiche 7 (ex. 1-5, 9) | résolution, changement de variable |
| Étude des fonctions usuelles | — | exponentielle, logarithme, carrée, inverse, racine : domaine, dérivée, variations, allure graphique |
| Calcul de dérivées | Fiche 11 (ex. 1-4) | dérivées usuelles et composées, sur les fonctions ci-dessus |

---

## 5. Décisions actées sur les questions ouvertes (résolution des points en suspens de la synthèse initiale)

1. **Manuel papier Maths/PC** : aucun disponible. Référence adoptée = fiches numérotées du cahier de calcul pour les Maths, codes du programme officiel BCPST1 pour la Physique-Chimie (cf. §3.2 et §4.1).
2. **Gabarit à 4 onglets** : conservé comme squelette commun (toujours 4 onglets, toujours un système de score pondéré + diagnostic 4 paliers), mais le **contenu** de deux onglets est adapté par matière (cf. tableaux §3.2 et §4.2) plutôt que de dupliquer trois gabarits totalement différents — cela garde un seul moteur technique (`qcm-engine.js`) à maintenir.
3. **Distinction connaissance/raisonnement** : conservée pour la Physique-Chimie (pertinente telle quelle) ; renommée **technique/compréhension** pour les Mathématiques (même mécanique de pondération, vocabulaire adapté à la matière).
4. **Identité visuelle "Strates"** : reste le fil rouge unique du site (palette, typographies, jauge en strates, motif carnet de terrain). Chaque matière reçoit une teinte d'accent secondaire déjà présente dans la palette existante pour faciliter le repérage, sans introduire de nouveau système : SVT garde rouille `#A6512B` (déjà utilisé), Physique-Chimie utilise ocre `#C89B3C`, Mathématiques utilise ardoise `#4C5B66`. Un simple bandeau de couleur en tête de chaque module suffit — pas de refonte graphique par matière.

---

## 6. Identité visuelle — rappel synthétique pour Claude Code

- Palette : encre `#262319`, parchemin `#F4EEDF` (fond), papier `#FBF8F0` (cartes), rouille `#A6512B`/`#7E3A1D` (accent SVT), mousse `#5F6F42` (secondaire), ardoise `#4C5B66` (accent Maths), ocre `#C89B3C` (accent PC / highlight indices, commun aux 3 matières).
- Typographies : Fraunces (titres), Inter (corps/UI), IBM Plex Mono (données, badges de renvoi, numéros de page/fiche/code de programme).
- Jauge en strates sur la page d'accueil, désormais calculée sur l'ensemble des modules des 3 matières (prévoir un filtre par matière en plus de la vue globale).

---

## 7. Plan de déploiement

1. **Décision technique préalable** (avant tout code) : confirmer si le site sera hébergé dans Claude.ai (artifact, `window.storage` disponible) ou déployé de façon autonome sur GitHub Pages (dans ce cas `window.storage` n'existe pas côté navigateur public — prévoir un remplacement par `localStorage`/IndexedDB, avec le même contrat d'API pour ne pas casser le reste du code). Trancher ce point avec l'utilisateur avant d'écrire `storage.js`.
2. Initialiser le dépôt Git dans `/Users/francoisvandenbrouck/Documents/FV/perso/alix/OnBoardingBCPST`, créer le dépôt distant `fvandenbrouck/BCPST` (ou nom équivalent), premier commit avec l'arborescence de `§1` et le module pilote SVT réintégré.
3. Construire dans l'ordre : **Phase 1** SVT (modules du tableau `§2`, un par un, avec relecture) → **Phase 2** Physique-Chimie (boîte à outils, puis analyse dimensionnelle et nomenclature, puis les 6 modules de révision Terminale) → **Phase 3** Mathématiques (dans l'ordre du tableau `§4.3`).
4. Après chaque module, vérifier : absence de tout contenu recopié d'une source protégée, cohérence du renvoi (page/fiche/code), fonctionnement du stockage persistant, exactitude scientifique du contenu (recouper avec les documents `references/` sans les citer).
5. Déployer via GitHub Pages une fois la Phase 1 terminée (premher jalon utilisable), puis mettre à jour au fil des phases suivantes.

---

## 8. Sources disponibles dans `references/` (à copier depuis le Projet Claude.ai)

- `Rentree_2026_BCPST_1re_annee_Recommandations_estivales.pdf` — lettre de rentrée, base de toute la priorisation.
- `BCPST.pdf` et `ensecsup111_annexes_1407948.pdf` — programme officiel complet BCPST1/2 (SVT, Physique-Chimie, Mathématiques).
- `Terminale_PC.pdf`, `Premiere_PC.pdf` — programmes officiels de spécialité physique-chimie.
- `Annexe_programme_specialite_mathematiques_terminale.pdf`, `Annexe_programme_specialite_mathematiques_premiere.pdf` — programmes officiels de spécialité mathématiques.
- `spe252annexe1159114pdf82881.pdf`, `spe648annexe1063542pdf82878.pdf` — programme officiel SVT de première.
- `Cahiers_de_calculs_BCPST.pdf` — cahier de calcul, source des renvois "fiche n°X" en mathématiques.
- `Exercices_entrainement_PC_Rentree_BCPST1.pdf` — fiche 1 du cahier d'entraînement PC (grandeurs, unités, puissances de 10).
- `1819anadim.pdf` — cours d'analyse dimensionnelle (Lycée Louis-le-Grand), à consulter pour vérifier l'exactitude scientifique du module correspondant, jamais à recopier.
- Sommaire complet du manuel SVT *Planète SVT Terminale spécialité* (Hachette, 2020) — déjà transcrit dans la synthèse initiale du projet, à reporter dans un fichier `references/sommaire-manuel-svt.md` si utile pour Claude Code.

---

*Fin du cahier des charges. Toute question de conception non tranchée ici (par exemple l'existence d'une fiche dédiée au trinôme du second degré dans le cahier de calcul) doit être vérifiée directement dans les sources de `references/` avant de faire une hypothèse.*

---

## Note de provenance

Ce fichier est la copie verbatim du cahier des charges fourni par l'utilisateur en tout début de projet (message initial de la session du 2026-08-03). Il ne doit pas être modifié au fil de l'avancement — c'est le référentiel stable. Les décisions prises en session (y compris celles qui répondent aux questions laissées ouvertes ci-dessus, comme le choix `localStorage` ou le nom du dépôt GitHub) sont documentées séparément dans `SYNTHESE_SESSION.md`, à consulter en complément pour avoir l'état réel et à jour du projet.
