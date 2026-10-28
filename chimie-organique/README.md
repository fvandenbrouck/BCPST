# Chimie organique — BCPST Trainer

Application de révision par rappel actif et répétition espacée pour le
chapitre **CC03 — Familles d'entités chimiques organiques et nomenclature**
(BCPST 1, Lycée Marcelin Berthelot, 2026-2027). Nouvelle page du site
[Strates](../index.html).

## Fonctionnement

L'application est une page unique (*single-page app*) en JavaScript natif,
sans backend ni base de données distante : tout le contenu pédagogique vit
dans `data/*.js`, toute la progression de l'étudiante est enregistrée dans
le `localStorage` du navigateur (clé `chimorg:*`), et les formules
chimiques sont des fichiers **SVG statiques pré-générés** (voir plus bas).

Elle propose :

- Un **tableau de bord** (page d'accueil) : nombre de questions disponibles,
  notions maîtrisées / à revoir, révisions dues aujourd'hui, pourcentage de
  réussite par module, historique des séances, export/import JSON de la
  progression.
- Une **bibliothèque de fiches** de référence (Modules A, B, C), consultable
  librement, sans notation.
- **Six modes d'entraînement** : flashcards, tableau à trous, reconnaissance
  de groupes caractéristiques, exercices de nomenclature, quiz rapide,
  reproduction de mémoire.
- Une **répétition espacée simplifiée** (`js/srs.js`) : planification des
  révisions à J+1, J+3, J+7, J+14, J+30, adaptée aux erreurs/réussites. Ce
  n'est pas un algorithme Anki complet — c'est assumé et documenté dans le
  code.

## Organisation du code

```
chimie-organique/
  index.html            Page unique (SPA), charge tous les scripts
  css/chimorg.css        Styles (thème clair/sombre, identité Strates)
  data/
    families.js          Module A — 16 familles fonctionnelles
    biomolecules.js       Module B — glucides, lipides, protides, acides nucléiques
    nomenclature.js        Module C — tables de référence + 28 exercices
    questions.js           Banque de QCM / reconnaissance / définitions / liaisons
  js/
    storage.js            Wrapper localStorage (clé `chimorg:`)
    srs.js                 Répétition espacée
    app.js                  Routeur (hash), thème, utilitaires partagés
    dashboard.js            Page d'accueil / tableau de bord
    fiches.js                Bibliothèque de fiches
    mode-*.js                 Les 6 modes d'entraînement (un fichier par mode)
  assets/mol/*.svg        Formules topologiques pré-générées (voir ci-dessous)
  tools/
    molecules.json          Manifeste chemfig/TikZ → SVG
    build_molecules.py       Script de génération des SVG (développement uniquement)
  tests/index.html          Suite de tests automatisés (exécutée dans le navigateur)
```

### Pourquoi des SVG statiques plutôt qu'un rendu en JavaScript ?

Les formules topologiques sont générées **une fois, en développement**, à
partir de code [chemfig](https://ctan.org/pkg/chemfig) (LaTeX/TikZ) — un
outil conçu spécifiquement pour les formules chimiques 2D — puis converties
en SVG et commitées dans `assets/mol/`. L'application elle-même ne fait
qu'afficher ces fichiers (`<img>`), ce qui garantit :

- Une qualité graphique fiable (traits, angles, étiquettes alignées) ;
- Un site **strictement statique**, compatible GitHub Pages, sans build
  côté client ni dépendance JavaScript de rendu chimique ;
- Des structures **vérifiables** : le code source chemfig de chaque
  molécule est lisible dans `tools/molecules.json` et peut être relu pour
  contrôler la connectivité des atomes.

Régénérer les SVG nécessite une distribution LaTeX (TeX Live / MacTeX) avec
le paquet `chemfig`, et `pdftocairo` (Poppler) — uniquement sur la machine
de développement, jamais côté utilisateur final. Voir `CONTRIBUTING.md`.

## Déploiement (GitHub Pages)

Aucune étape de build n'est nécessaire : l'intégralité du dossier
`chimie-organique/` (y compris `assets/mol/*.svg`, déjà générés) est prête
à être servie telle quelle. Elle fonctionne aussi bien à la racine d'un
dépôt qu'en sous-chemin (`https://utilisateur.github.io/depot/chimie-organique/`),
car tous les chemins (scripts, CSS, images) sont relatifs.

## Tests

`tests/index.html` exécute, dans le navigateur, une suite de tests qui
valide :

- L'intégrité des données (identifiants uniques, champs requis non vides,
  ≥ 100 questions distinctes, réponses de QCM dans les bornes, groupes de
  reconnaissance valides) ;
- L'existence effective de chaque fichier SVG référencé ;
- La logique de correction (tolérance typographique sans tolérer une
  erreur de numérotation ou un nom chimiquement incorrect) ;
- Le planificateur de répétition espacée (intervalles progressifs,
  calcul d'échéance « due »).

Ouvrir `tests/index.html` dans un navigateur (ou le servir avec n'importe
quel serveur statique) suffit à lancer la suite.

## Progression et vie privée

Toute la progression est locale au navigateur (`localStorage`). Le bouton
« Exporter ma progression » du tableau de bord télécharge un fichier JSON
que l'on peut réimporter sur un autre appareil via « Importer une
progression », afin de ne pas perdre l'historique en changeant de machine.

## Vérifications effectuées avant mise en ligne

- Exactitude des noms systématiques et des structures (vérifiés
  manuellement molécule par molécule, cf. `tools/molecules.json`) ;
- Correspondance structure ↔ réponse pour chaque exercice ;
- Groupes caractéristiques et leur représentation (mode 3) ;
- Système de score, répétition espacée et sauvegarde locale (suite de
  tests, `tests/index.html`) ;
- Rendu sur viewport mobile (375px) ;
- Fonctionnement sous un sous-chemin GitHub Pages (chemins relatifs
  uniquement, aucun chemin absolu `/...`).
