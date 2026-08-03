# Synthèse de session — Strates (site de révisions BCPST1)

> **À lire en premier dans tout nouveau fil de discussion sur ce projet.**
> Ce fichier documente l'état réel du projet, les arbitrages pris en cours de route (au-delà du cahier des charges initial) et les consignes à respecter pour continuer sans rupture. Le cahier des charges complet et stable est dans [`CAHIER_DES_CHARGES.md`](CAHIER_DES_CHARGES.md) (copie verbatim du brief initial, ne pas le modifier). **Ce fichier-ci doit être mis à jour à la fin de chaque session de travail** (nouveaux modules construits, nouvelles décisions, nouveaux points en attente).

Dernière mise à jour : **2026-08-03**.

---

## 1. Contexte en une phrase

Site de révisions statique (HTML/CSS/JS vanilla, pas de framework, pas de build) pour une élève qui entre en BCPST1 sans avoir suivi la spécialité SVT en Terminale. Trois matières à terme (SVT, Physique-Chimie, Mathématiques), déployé en autonome sur GitHub Pages.

## 2. Décisions actées en session (au-delà du cahier des charges)

Le cahier des charges laissait plusieurs points ouverts. Voici comment ils ont été tranchés, avec l'utilisateur, le 2026-08-03 :

1. **Stockage persistant** : `localStorage` via [`assets/js/storage.js`](assets/js/storage.js), avec un contrat d'API volontairement identique à l'ancien `window.storage` (`await Storage.get(key)` → `{value}` ou `null`, `await Storage.set(key, value)`). Le site est déployé de façon autonome sur GitHub Pages, donc pas d'artifact Claude.ai ni de `window.storage` disponible.
2. **Sources de référence** (`references/`) : toutes jugées suffisantes par l'utilisateur. Pas de fichier `BCPST.pdf` séparé — son contenu est déjà couvert par `ensecsup111_annexes_1407948.pdf`, qui regroupe tous les programmes officiels BCPST1. Le dossier `references/` est **gitignoré** : jamais poussé sur GitHub, mais reste sur la machine locale pour que Claude Code puisse vérifier l'exactitude scientifique du contenu.
3. **Dépôt GitHub** : [`fvandenbrouck/BCPST`](https://github.com/fvandenbrouck/BCPST), **public**. Créé et poussé le 2026-08-03. `gh` CLI installé en session (`brew install gh`), authentifié par l'utilisateur via `gh auth login --web` (compte `fvandenbrouck`).
4. **GitHub Pages : ACTIVÉ le 2026-08-03**, sur demande explicite de l'utilisateur ("active le site et donne-moi le lien"), avant la fin de la Phase 1 SVT (contrairement au plan initial qui prévoyait d'attendre la fin de la Phase 1). Activé via `gh api repos/fvandenbrouck/BCPST/pages` (branche `main`, racine `/`). **URL publique : https://fvandenbrouck.github.io/BCPST/** — le site est donc visible publiquement dès maintenant, y compris les modules pas encore construits qui resteront simplement grisés ("À venir") sur la page d'accueil. Pas besoin de redemander confirmation pour republier après chaque nouveau commit sur `main` : GitHub Pages se redéploie automatiquement.
5. **QCM — mélange des options** : bug identifié le 2026-08-03 par l'utilisateur — dans les données rédigées à la main pour Ch.5 et Ch.6, la bonne réponse tombait presque systématiquement en position 2 (index 1). Corrigé **au niveau du moteur** ([`assets/js/qcm-engine.js`](assets/js/qcm-engine.js)) plutôt qu'en réécrivant les données : à chaque première tentative (et à chaque clic sur "Refaire le QCM"), l'ordre d'affichage des options de chaque question est mélangé aléatoirement (Fisher-Yates), indépendamment de l'ordre du tableau `options` dans les données du module. **Conséquence pour la suite : les auteurs de futurs modules (PC, Maths, prochains chapitres SVT) n'ont pas besoin de se soucier de la position de la bonne réponse dans les données — le moteur s'en charge automatiquement. Ne pas réintroduire de logique de mélange ou de rééquilibrage manuel dans les fichiers de module.**
6. **Manuel de référence : Belin Éducation, pas Hachette.** Correction de l'utilisateur le 2026-08-03 : le manuel réel est *Belin Éducation* (https://www.belin-education.com/svt-terminale), pas *Planète SVT Tle spécialité* (Hachette) comme indiqué par erreur dans le cahier des charges initial. Le sommaire déjà utilisé (photos calameo.com fournies en tout début de projet) reste valable tel quel pour les pages/chapitres — seul le nom de l'éditeur affiché a été corrigé (`index.html`, `assets/js/module-page.js`). Titre précis de l'édition Belin non communiqué : ne pas en inventer un, rester sur la formulation générique "manuel de SVT Terminale (Belin Éducation)".
7. **Illustrations dans les QCM** : demande de l'utilisateur le 2026-08-03 — ajouter des illustrations/schémas "lorsque cela apporte une plus-value". Implémenté comme un champ optionnel `question.image: {src, alt, credit?}` dans `assets/js/qcm-engine.js` (rendu en `<figure>` au-dessus de l'énoncé). Deux sources utilisées, à reproduire pour les futurs modules :
   - **Photos d'objets réels** : cherchées sur Wikimedia Commons (licence CC vérifiée sur la page du fichier avant usage), hotlinkées directement via l'URL `upload.wikimedia.org` (pas de téléchargement local), avec `credit` obligatoire au format "Photo : Auteur, Wikimedia Commons, licence". Exemples déjà utilisés : fossile d'ammonite (Ch.5 q9, CC BY 2.0, James St. John) et cristal de zircon (Ch.6 q10, CC BY-SA 3.0, Rob Lavinsky/iRocks.com).
   - **Schémas de scénarios fictifs ou abstraits** (coupes géologiques inventées pour une question, diagrammes isochrone/concordia) : dessinés à la main en SVG original, stockés dans `assets/img/chXX/*.svg`, référencés en `src` relatif, sans `credit` (contenu 100% original, pas de problème de droit d'auteur). Palette de couleurs reprise en dur (hex, pas de `var(--...)` — un SVG chargé via `<img src>` n'hérite pas des variables CSS de la page). Exemples : `assets/img/ch05/r1-coupe-faille.svg`, `r4-inclusion-recoupement.svg`, `assets/img/ch06/r2-isochrone.svg`, `r4-concordia-discordance.svg`.
   - Ne pas illustrer systématiquement toutes les questions : seulement quand un visuel apporte une réelle clarté (objet concret identifiable, ou scénario géométrique/graphique difficile à se représenter par le texte seul).
8. **GitHub Pages activé** (cf. décision #4) — mise à jour a posteriori : contrairement à ce que disait la première version de ce fichier, l'utilisateur a explicitement demandé l'activation immédiate le 2026-08-03 ("active le site et donne-moi le lien"), avant la fin de la Phase 1. C'est fait, cf. décision #4 ci-dessus qui a été mise à jour en conséquence. Ne pas re-proposer d'attendre la fin de Phase 1 pour ça.
9. **Quatrième type de module : "Carnet de terrain"** (2026-08-03), sur spécification complète fournie par l'utilisateur — voir [`CARNET_DE_TERRAIN.md`](CARNET_DE_TERRAIN.md) (copie verbatim, même traitement que `CAHIER_DES_CHARGES.md`). Contrairement aux modules SVT/PC/Maths : pas de score, pas de bonne réponse, observation libre horodatée + éclairage révélé après coup. Implémenté dans `carnet-de-terrain/` (`index.html` sélecteur + `chenaillet.html` + `lautaret.html`) et `assets/js/carnet-engine.js` (moteur volontairement séparé de `qcm-engine.js`, réutilise `storage.js` avec les clés `carnet:chenaillet` / `carnet:lautaret`). Accessible depuis la page d'accueil via une carte dédiée hors registre/jauge ("Avant la rentrée"), **volontairement exclu de `modules-registry.js`** et de la jauge en strates (ce n'est pas un module noté). Testé dans le navigateur : saisie, activation du bouton éclairage après texte, persistance après rechargement — OK sur les deux sites.
10. **Cahier des charges mis à jour par l'utilisateur (2026-08-03)** : deux ajouts propagés dans `CAHIER_DES_CHARGES.md` et `assets/js/modules-registry.js`.
    - **Pagination confirmée** : l'utilisateur a fourni une capture du sommaire réel (Ch.5, Unités 1-4, Bilan p.136, Exercices p.138, Objectif BAC p.141) qui correspond exactement au tableau §2 déjà utilisé. Seul le nom de l'éditeur était faux (cf. décision #6) — la pagination de Ch.6 à Ch.18 peut être utilisée sans réserve, à corriger au cas par cas si un écart apparaît en construisant un chapitre précis.
    - **Ch.12 (Le climat au Cénozoïque, p.292-315) et Ch.14 (Le changement climatique actuel, p.342-366)** ajoutés à la feuille de route SVT en rangs 12-13, marqués **"bonus tertiaire"** : hors périmètre des recommandations officielles Berthelot, ajoutés uniquement parce que le carnet de terrain du Jardin du Lautaret y fait référence. Aucun engagement de calendrier — à construire seulement après les modules 1 à 11. Déjà ajoutés à `modules-registry.js` avec `status:'soon'`. Ça résout le point qui restait ouvert au §5 (badges de renvoi Ch.12/Ch.14 sans module correspondant).

## 3. Architecture technique (résumé)

```
index.html                        page d'accueil : jauge en strates + navigation par matière
assets/css/strates.css            design system unique "Strates" (cf. cahier des charges §6)
assets/js/storage.js              Storage.get/set — wrapper localStorage
assets/js/modules-registry.js     registre UNIQUE de tous les modules (dispo + "à venir"), toutes matières
assets/js/progress-gauge.js       rendu jauge globale + liste modules + filtre par matière (page d'accueil)
assets/js/module-page.js          orchestrateur générique d'une page module (onglets, état, persistance)
assets/js/qcm-engine.js           moteur QCM : rendu, score pondéré, diagnostic 4 paliers, mélange des options
assets/js/flashcards-engine.js    moteur flashcards : recto/verso, notation, mode "à revoir"
assets/js/mindmap-engine.js       moteur carte mentale : construction libre + comparaison carte modèle
svt/chXX-....html                 une page HTML autonome par module SVT
physique-chimie/....html          (à venir, Phase 2)
maths/....html                    (à venir, Phase 3)
carnet-de-terrain/                4e type de module : observation de terrain, pas de score (cf. §5 et CARNET_DE_TERRAIN.md)
  ├── index.html                  sélecteur de site (Chenaillet / Lautaret)
  ├── chenaillet.html
  └── lautaret.html
assets/js/carnet-engine.js         moteur dédié au carnet de terrain, séparé de qcm-engine.js
assets/img/chXX/*.svg              schémas originaux utilisés comme illustrations QCM (cf. décision #7)
references/                       PDFs sources — GITIGNORÉ, jamais poussé sur GitHub
CAHIER_DES_CHARGES.md             brief initial, verbatim, stable
CARNET_DE_TERRAIN.md              spec du module carnet de terrain, verbatim, stable
SYNTHESE_SESSION.md               ce fichier
```

**Comment fonctionne une page module :** chaque fichier `svt/chXX-....html` définit un objet JS `MODULE` (données pures : fiches de cours, flashcards, questions QCM, carte mentale modèle) puis appelle `ModulePage.init(MODULE)`. Le contrat de données exact est documenté en commentaire de tête dans chaque fichier `*-engine.js`. Pour un exemple de référence complet, voir [`svt/ch06-datation-absolue.html`](svt/ch06-datation-absolue.html).

**Important pour Phase 2/3 (PC, Maths) :** le gabarit à 4 onglets change de contenu selon la matière (cf. cahier des charges §3.2 et §4.2) : PC remplace Flashcards par "Applications numériques" (réponse numérique + tolérance), Maths remplace QCM par "Entraînement calculatoire" et Flashcards par "Cartes-méthode", avec un vocabulaire technique/compréhension au lieu de connaissance/raisonnement. **Ces onglets alternatifs ne sont pas encore implémentés** — `module-page.js` et les moteurs actuels ne gèrent que le gabarit SVT. Il faudra étendre `module-page.js` (probablement un champ `MODULE.tabs` ou équivalent pour déclarer quel moteur brancher sur quel onglet) sans casser les modules SVT existants. Ne pas commencer cette généralisation avant d'attaquer réellement la Phase 2 — ça resterait de la spéculation prématurée tant qu'un seul gabarit PC n'a pas été construit concrètement.

## 4. Avancement — Phase 1 (SVT)

**Fait et testé dans le navigateur (rendu, QCM, flashcards, carte mentale, persistance) :**
- ✅ Ch.5 — La datation relative (module pilote, réintégré tel quel depuis le prototype `references/revisions-bcpst.html`)
- ✅ Ch.6 — La datation absolue (nouveau, contenu original : décroissance radioactive, système clos, couples Rb-Sr/K-Ar/U-Pb, isochrone, concordance/discordance — vérifié scientifiquement par connaissance générale, pas de source dédiée dans `references/` pour ce sujet précis)

**Reste à faire, dans l'ordre du cahier des charges §2 :**
3. Ch.7 — Traces du passé mouvementé de la Terre (p.164-190)
4. Ch.8 — Organisation des plantes à fleurs (p.196-217)
5. Ch.9 — La plante productrice de matière organique (p.220-241)
6. Ch.11 — La domestication des plantes (p.268-282)
7. Ch.17 — Cellule musculaire, ATP (p.422-447)
8. Ch.18 — Contrôle des flux de glucose (p.450-473)
9-10. Modules "Première" sans manuel (génétique de base ; géologie interne) — contenu 100% original, pas de renvoi de page
11 (bonus). Ch.1 — L'origine du phénotype (p.30-53)
12 (bonus tertiaire, priorité la plus basse). Ch.12 — Le climat au Cénozoïque (p.292-315)
13 (bonus tertiaire, priorité la plus basse). Ch.14 — Le changement climatique actuel (p.342-366)

Chaque nouvel id de module doit être ajouté à `assets/js/modules-registry.js` (passer `status` de `'soon'` à `'available'` et renseigner `href`) en plus de la création du fichier HTML — sinon il n'apparaît pas comme disponible sur la page d'accueil.

**Puis, dans l'ordre :** activer GitHub Pages (cf. décision #4 ci-dessus) → Phase 2 Physique-Chimie → Phase 3 Mathématiques. Détail complet des deux phases dans `CAHIER_DES_CHARGES.md` §3 et §4.

## 5. Carnet de terrain — fait, reste des finitions

L'idée d'"Observations" évoquée en cours de session a été précisée par l'utilisateur dans un document de spec complet ([`CARNET_DE_TERRAIN.md`](CARNET_DE_TERRAIN.md)) et **implémentée le 2026-08-03** (cf. décision #9). Deux sites : Le Chenaillet (8 points, géologie, prolonge Ch.7) et le Jardin du Lautaret (9 points, botanique alpine, prolonge Ch.8/Ch.12/Ch.14).

**Reste à faire**, repris du §5 de `CARNET_DE_TERRAIN.md` (rien de bloquant, mais à ne pas oublier) :
1. Vérifier avec l'utilisateur l'itinéraire précis du Chenaillet (départ Cervières ou Montgenèvre) et réordonner chen-01→08 si besoin — pas de changement de contenu, juste l'ordre `ordre` dans `chenaillet.html`.
2. Vérifier les horaires d'ouverture du Jardin du Lautaret au moment du séjour ; si fermé, laut-05 et une partie de laut-06 ne seront pas utilisables tels quels.
3. **Ajouter les badges de renvoi** "🏔️ Vu sur le terrain" sur les futurs modules Ch.7, Ch.8, Ch.12, Ch.14 (et Ch.4 en option, qui n'est même pas dans la feuille de route — cf. §4) une fois ces modules SVT construits (aucun des deux modules actuels, Ch.5/Ch.6, n'est concerné par ces tags). Lien bidirectionnel léger vers l'entrée du carnet correspondante — ne pas fusionner les gabarits.
4. Les tags `SVT-Ch4/Ch7/Ch8-U1/Ch12/Ch14` dans les données des points sont déjà là, prêts à être exploités pour ces badges quand les modules existeront. Ch.7, Ch.8, Ch.12, Ch.14 sont désormais tous dans la feuille de route officielle (§4) — Ch.12/Ch.14 en toute fin, priorité la plus basse (cf. décision #10). Ch.4 reste hors plan, jamais mentionné ailleurs que dans ce tag optionnel du carnet.

## 6. Conventions et consignes utiles pour la suite

- **Droit d'auteur** : ne jamais recopier le texte du manuel Belin Éducation ni d'autres sources protégées ; renvois de page en index uniquement (cahier des charges §0.1).
- **Ton des diagnostics** : toujours encourageant, jamais culpabilisant (§0.2) — les 4 paliers déjà rédigés dans `qcm-engine.js` (`buildDiagnostic`) servent de modèle de ton à reproduire pour les futurs modules.
- **Articulation Première → Terminale → BCPST1** : toujours présente en tête de module (bloc "Déjà vu / En BCPST1", champ `MODULE.bridge` dans le contrat de données).
- **Carte mentale** : jamais de modèle pré-rempli affiché par défaut, l'élève construit d'abord de mémoire (déjà respecté par `mindmap-engine.js`, ne pas changer ce comportement).
- **QCM** : ne pas se soucier manuellement de la position de la bonne réponse dans les données (`correct: <index>`) — le moteur mélange l'affichage automatiquement (cf. décision #5). Continuer de viser ≥10 questions connaissance + ≥5 raisonnement avec indice de méthode (jamais la réponse).
- **Actions sensibles** : avant de committer/pousser sur GitHub, ou de changer un réglage de dépôt (comme activer Pages), demander confirmation — sauf instruction déjà donnée explicitement en session (ex. décision #4 ci-dessus, qui autorise l'activation de Pages *à la fin de la Phase 1*, sans redemander à ce moment précis).
- **`references/`** ne doit jamais être poussé sur GitHub (gitignoré) — vérifier `git status` avant tout commit si des fichiers y ont été ajoutés/modifiés.
- **Tester dans le navigateur** avant de considérer un module terminé : ouvrir le fichier, tester les 4 onglets, vérifier l'absence d'erreur console, vérifier que le score QCM se calcule juste, puis vider `localStorage` (données de test) avant de committer.
- **Carnet de terrain** : ne jamais lui ajouter de score ni de correction automatique — c'est le principe fondateur de ce type de module (cf. §5, `CARNET_DE_TERRAIN.md` §1.3). Ne pas le fusionner avec `modules-registry.js`/`progress-gauge.js` (registre des modules notés) : il vit à part, lié depuis `index.html` par une simple carte de navigation.

## 7. État du dépôt au moment de la rédaction de ce fichier

- Dépôt distant : [github.com/fvandenbrouck/BCPST](https://github.com/fvandenbrouck/BCPST) (public), branche `main` trackée.
- **GitHub Pages actif : https://fvandenbrouck.github.io/BCPST/** (activé le 2026-08-03, cf. décision #4/#8).
- Commits poussés jusqu'ici : initialisation (Ch.5/Ch.6 + moteur), fix de mélange des QCM + doc de session, correction éditeur Belin + illustrations QCM, module carnet de terrain, prompt de reprise Phase 1 SVT. La mise à jour du cahier des charges (pagination confirmée, ajout Ch.12/Ch.14 bonus tertiaire dans `modules-registry.js`) est sur le point d'être committée dans la foulée de cette mise à jour. Si un nouveau fil de discussion trouve `git log` sans ce commit, c'est qu'il reste à faire — vérifier avec `git status` / `git log --oneline`.
