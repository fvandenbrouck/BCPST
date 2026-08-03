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
4. **GitHub Pages : PAS ENCORE ACTIVÉ.** Consigne explicite de l'utilisateur : activer Settings → Pages (branche `main`) **à la fin de la Phase 1 SVT** (tous les modules du tableau §2 du cahier des charges construits), pas avant. → Ne pas l'activer avant cette étape sans redemander confirmation.
5. **QCM — mélange des options** : bug identifié le 2026-08-03 par l'utilisateur — dans les données rédigées à la main pour Ch.5 et Ch.6, la bonne réponse tombait presque systématiquement en position 2 (index 1). Corrigé **au niveau du moteur** ([`assets/js/qcm-engine.js`](assets/js/qcm-engine.js)) plutôt qu'en réécrivant les données : à chaque première tentative (et à chaque clic sur "Refaire le QCM"), l'ordre d'affichage des options de chaque question est mélangé aléatoirement (Fisher-Yates), indépendamment de l'ordre du tableau `options` dans les données du module. **Conséquence pour la suite : les auteurs de futurs modules (PC, Maths, prochains chapitres SVT) n'ont pas besoin de se soucier de la position de la bonne réponse dans les données — le moteur s'en charge automatiquement. Ne pas réintroduire de logique de mélange ou de rééquilibrage manuel dans les fichiers de module.**

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
references/                       PDFs sources — GITIGNORÉ, jamais poussé sur GitHub
CAHIER_DES_CHARGES.md             brief initial, verbatim, stable
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

Chaque nouvel id de module doit être ajouté à `assets/js/modules-registry.js` (passer `status` de `'soon'` à `'available'` et renseigner `href`) en plus de la création du fichier HTML — sinon il n'apparaît pas comme disponible sur la page d'accueil.

**Puis, dans l'ordre :** activer GitHub Pages (cf. décision #4 ci-dessus) → Phase 2 Physique-Chimie → Phase 3 Mathématiques. Détail complet des deux phases dans `CAHIER_DES_CHARGES.md` §3 et §4.

## 5. Idée en attente d'arbitrage — Observations de terrain (Monêtier-les-Bains)

Proposition de l'utilisateur (2026-08-03) : une sous-partie "Observations" liée à un séjour à Monêtier-les-Bains (Hautes-Alpes, massif des Écrins) avant la rentrée, pour de l'observation de terrain (flore, paysages).

**Pas encore validée ni construite.** Piste de réflexion évoquée par Claude : un module volontairement différent du gabarit à 4 onglets habituel (pas de QCM à réponse unique, mais des consignes d'observation façon carnet de terrain — étagement de la végétation alpine, indices géologiques du paysage type superposition/recoupement en écho à Ch.5-6, éventuellement les sources thermales du Monêtier comme accroche). Points à trancher avec l'utilisateur avant tout développement :
- Forme exacte : checklist cochable ? champ de notes/photos libres ? les deux ?
- Reste-t-on dans le gabarit à 4 onglets (avec un 5e onglet "Observations" en option) ou est-ce un type de module à part entière, avec son propre registre dans `modules-registry.js` (subject `'svt'` mais catégorie distincte, ex. "Terrain — avant la rentrée") ?
- Lien explicite à faire avec les modules Ch.5/Ch.6 déjà construits (les principes de terrain vus en cours peuvent être un guide d'observation directement réutilisable).

## 6. Conventions et consignes utiles pour la suite

- **Droit d'auteur** : ne jamais recopier le texte du manuel Hachette ni d'autres sources protégées ; renvois de page en index uniquement (cahier des charges §0.1).
- **Ton des diagnostics** : toujours encourageant, jamais culpabilisant (§0.2) — les 4 paliers déjà rédigés dans `qcm-engine.js` (`buildDiagnostic`) servent de modèle de ton à reproduire pour les futurs modules.
- **Articulation Première → Terminale → BCPST1** : toujours présente en tête de module (bloc "Déjà vu / En BCPST1", champ `MODULE.bridge` dans le contrat de données).
- **Carte mentale** : jamais de modèle pré-rempli affiché par défaut, l'élève construit d'abord de mémoire (déjà respecté par `mindmap-engine.js`, ne pas changer ce comportement).
- **QCM** : ne pas se soucier manuellement de la position de la bonne réponse dans les données (`correct: <index>`) — le moteur mélange l'affichage automatiquement (cf. décision #5). Continuer de viser ≥10 questions connaissance + ≥5 raisonnement avec indice de méthode (jamais la réponse).
- **Actions sensibles** : avant de committer/pousser sur GitHub, ou de changer un réglage de dépôt (comme activer Pages), demander confirmation — sauf instruction déjà donnée explicitement en session (ex. décision #4 ci-dessus, qui autorise l'activation de Pages *à la fin de la Phase 1*, sans redemander à ce moment précis).
- **`references/`** ne doit jamais être poussé sur GitHub (gitignoré) — vérifier `git status` avant tout commit si des fichiers y ont été ajoutés/modifiés.
- **Tester dans le navigateur** avant de considérer un module terminé : ouvrir le fichier, tester les 4 onglets, vérifier l'absence d'erreur console, vérifier que le score QCM se calcule juste, puis vider `localStorage` (données de test) avant de committer.

## 7. État du dépôt au moment de la rédaction de ce fichier

- Dépôt distant : [github.com/fvandenbrouck/BCPST](https://github.com/fvandenbrouck/BCPST) (public), branche `main` trackée.
- Dernier commit **poussé** au moment d'écrire ces lignes : `Initialise le site Strates : moteur commun + modules SVT Ch.5-6` (contient Ch.5, Ch.6, **sans** le fix de mélange des options QCM).
- Ce fichier, `CAHIER_DES_CHARGES.md` et le fix de mélange des QCM (`assets/js/qcm-engine.js`, `assets/js/module-page.js`) sont sur le point d'être committés et poussés dans la foulée de la rédaction de cette synthèse. Si un nouveau fil de discussion trouve `git log` sans ce commit, c'est qu'il reste à faire — vérifier avec `git status` / `git log --oneline`.
