# RMN du proton — BCPST1

Application web interactive d'apprentissage de la RMN du proton, nouvelle page
du site [Strates](../../index.html), pour une étudiante de BCPST1 préparant le
chapitre C.1.3 du programme officiel (spectroscopie de résonance magnétique
nucléaire du proton — [programme officiel BCPST1 2021](https://www.concours-agro-veto.fr/sites/default/files/media/2025-10/se-preparer_programmes-cpge-bcpst-physique-chimie.pdf),
section C.1.3, p.14).

Capacité exigible visée : *« Confirmer ou attribuer la structure d'une entité
à partir de données spectroscopiques infrarouge et/ou de résonance magnétique
nucléaire du proton et de tables de nombres d'onde ou de déplacements
chimiques caractéristiques. »* Le module ne couvre pas la RMN ¹³C, la RMN 2D,
ni la théorie physique de la résonance magnétique (hors programme BCPST1).

## Fonctionnement

Page unique (SPA) en JavaScript natif, sans build, sans backend, sans compte
utilisateur : toute la progression vit dans le `localStorage` du navigateur
(clé `rmn:state:v1`). Même philosophie que [chimie-organique](../../chimie-organique/README.md),
en plus léger (pas de système multi-profil : un seul parcours par navigateur).

Quatre composantes, accessibles à tout moment par la barre de navigation :

- **L'essentiel du cours** — les quatre informations d'un spectre, équivalence
  chimique (avec légende interactive de groupes colorés sur 5 molécules),
  échelle δ interactive, intégration, multiplicité (galerie de multiplets
  simples + couplages AmMpXq), pièges fréquents.
- **Méthode** — analyse en 6 étapes, avec exemple et erreur fréquente pour
  chacune ; accessible en fiche flottante depuis n'importe quelle page
  (bouton « 📋 Méthode », en bas à droite) sans perdre sa progression en cours.
- **Diagnostic initial** (12 questions, C1 à C7) puis **Parcours
  d'apprentissage** : 6 activités (3-5 exercices chacune), chacune suivie d'un
  **diagnostic de sortie indépendant** (D1 à D6, 5 questions chacun, situations
  inédites). Une remédiation ciblée est proposée automatiquement si une
  compétence reste fragile (taux de réussite < 60 % sur le diagnostic), suivie
  d'une nouvelle vérification.
- **Tableau de maîtrise** — toujours visible en haut de l'écran pendant tout le
  parcours (barre de maîtrise brun→vert + avancement du parcours), détaillé sur
  sa propre page (7 barres de compétences, historique des progrès, calcul
  transparent et consultable).

Au rechargement de la page, l'étudiante retrouve exactement son état
(dernière page, exercice en cours au sein d'une activité, tous les résultats).
Un bouton « Reprendre le parcours à zéro » (accueil + tableau de maîtrise)
efface tout après confirmation explicite dans une boîte de dialogue dédiée.

## Organisation du code

```
physique-chimie/rmn/
  index.html              Page unique (SPA), charge toutes les données et tous les scripts
  css/rmn.css              Styles spécifiques (réutilise assets/css/strates.css)
  data/
    competences.js          Référentiel des 7 compétences C1-C7 + niveaux 0-4
    spectres.js              Banque de spectres (9 molécules, valeurs de référence documentées)
    cours.js                  Contenu du cours
    methode.js                 Méthode en 6 étapes
    diagnostic-initial.js       12 questions, C1 à C7
    activites.js                 6 activités × 3-5 exercices, avec indices et explications
    diagnostics-sortie.js         D1 à D6 (5 questions chacun) + banque de remédiation
  js/
    storage.js                   Persistance locale (localStorage, synchrone)
    grading-engine.js             Moteur de correction (choix unique, cases à cocher, numérique)
    mastery-engine.js              Moteur de calcul de la maîtrise (voir plus bas)
    multiplet-svg.js                Construction et rendu des diagrammes de multiplets (Pascal, J1/J2)
    delta-scale.js                   Échelle δ interactive
    spectrum-viewer.js                Visionneuse de spectre simulé (axe, multiplets, intégration, zoom)
    molecule-view.js                   Affichage des formules (SVG statiques) + légende d'équivalence
    ui-components.js                    Rendu des questions (formulaire diagnostic / exercice socratique)
    app.js                               Routeur (hash) et orchestration de toutes les pages
  assets/mol/*.svg          Formules topologiques pré-générées (chemfig → SVG, voir ci-dessous)
  tools/
    molecules.json            Manifeste chemfig de chaque molécule (25 entrées)
    build_molecules.py         Script de génération des SVG (développement uniquement)
  tests/index.html           Suite de tests automatisés (exécutée dans le navigateur)
```

### Formules chimiques : SVG statiques pré-générés (chemfig), jamais dessinées en JS

Comme pour `chimie-organique`, les structures moléculaires sont écrites en
[chemfig](https://ctan.org/pkg/chemfig) (LaTeX), compilées une fois en
développement par `tools/build_molecules.py`, puis commitées comme fichiers
SVG statiques dans `assets/mol/`. L'application ne fait qu'afficher ces
fichiers (`<img>`) — aucun rendu procédural de structure chimique côté client.

Pour la démonstration d'équivalence (page Cours, et légendes interactives),
chaque molécule concernée (propanone, éthanol, propane, propan-2-ol,
éthanoate d'éthyle) existe en plusieurs variantes **pré-générées** : une
version « structure seule » (`-plain`), une version « tous les groupes »
colorés (`-all`), et une version par groupe (`-grp-xxx`, un seul groupe
coloré, les autres en noir). Cliquer sur la légende ne fait que **changer le
`src` de l'`<img>`** entre ces fichiers déjà prêts (`js/molecule-view.js`) :
aucune géométrie n'est recalculée ni redessinée dynamiquement.

Régénérer les SVG nécessite une distribution LaTeX avec le paquet `chemfig`
(testé avec TeX Live) et `pdftocairo` (Poppler) :

```bash
python3 tools/build_molecules.py
```

### Pourquoi les multiplets et les spectres sont-ils dessinés en JavaScript ?

Contrairement aux structures chimiques, les diagrammes de multiplets
(`js/multiplet-svg.js`) et le tracé des spectres (`js/spectrum-viewer.js`) ne
sont pas des formules chimiques mais des **graphiques de données** calculés à
partir de valeurs numériques (nombre de voisins, constantes J, δ) — au même
titre qu'un graphique dans un tableur. Ils sont donc générés dynamiquement, ce
qui permet notamment le simulateur interactif J₁/J₂ (activité 4) : aucune
géométrie moléculaire n'y est représentée.

## Modèle d'évaluation et calcul de la maîtrise

Le détail est documenté dans `js/mastery-engine.js` (commentaire d'en-tête) et
affiché à l'étudiante elle-même, en clair, sur la page **Tableau de
maîtrise** (bouton « Comment ce score est-il calculé ? »). Résumé :

1. **Seules les évaluations diagnostiques produisent une preuve de maîtrise**
   (diagnostic initial, D1 à D6, remédiation) — jamais les exercices
   d'entraînement des activités. Réussir une activité ne fait donc jamais, à
   lui seul, progresser la barre de maîtrise : c'est le principe pédagogique
   central demandé par le cahier des charges.
2. Pour chaque compétence, seule la **session d'évaluation la plus récente**
   l'ayant testée est prise en compte (pas une moyenne de tout l'historique) :
   la maîtrise peut donc **stagner ou diminuer** si une évaluation ultérieure
   révèle une difficulté.
3. Le niveau (0 à 4) dépend à la fois du **taux de réussite** de cette session
   et de la **difficulté des questions réussies** : réussir uniquement des
   questions faciles ne peut jamais, à lui seul, valoir le niveau 4.
4. Le **diagnostic initial** est un état des lieux, pas une preuve de maîtrise
   autonome : le niveau qu'il peut attribuer est **plafonné à 2**, quel que
   soit le score. Seuls un diagnostic de sortie (D1-D6) ou une remédiation
   réussie peuvent valider les niveaux 3 et 4.
5. Le **score global** est la moyenne pondérée des niveaux des compétences
   *évaluées* (poids définis dans `data/competences.js` : C6 et C7, capacités
   terminales, pèsent davantage), ramenée à un pourcentage. Les compétences
   non évaluées sont exclues de cette moyenne et affichées « non évalué »
   plutôt que comptées comme un échec.
6. **Avancement du parcours** (proportion d'activités terminées) et
   **maîtrise démontrée** (ce calcul) sont deux indicateurs strictement
   séparés, affichés l'un sous l'autre en permanence ; seule la maîtrise
   détermine la couleur (interpolation continue brun → vert) de la barre
   principale.

Le **moteur de correction** (`js/grading-engine.js`) applique, pour les
questions à cases à cocher (plusieurs bonnes réponses), un barème qui
n'attribue jamais le crédit plein si une proposition fausse est également
cochée (`fraction = max(0, (bonnes cochées − mauvaises cochées) / bonnes
réponses)`), conformément au cahier des charges. Les réponses numériques
utilisent une tolérance explicite (absolue ou relative) uniquement lorsqu'elle
est pertinente ; un nombre entier de protons ou de raies exige une réponse
exacte.

## Sources scientifiques et spectres utilisés

Aucune image de spectre expérimental brut extraite d'une base externe n'est
reproduite dans ce module (droits de reproduction non vérifiables de façon
fiable dans ce contexte, cf. conditions d'usage de SDBS/nmrshiftdb2). Les 9
spectres de `data/spectres.js` (éthanol, propane, propan-2-ol, propanone,
bromoéthane, éthanoate d'éthyle, butan-2-one, propan-1-ol, méthoxyéthane)
sont des **reconstructions pédagogiques** (clairement étiquetées `statut:
'reconstruction'` dans les données et affichées comme telles dans l'interface),
tracées par `js/spectrum-viewer.js` à partir de valeurs de déplacement
chimique, d'intégration et de constantes de couplage qui sont des **valeurs de
référence caractéristiques**, bien établies dans la littérature et conformes
aux ordres de grandeur usuels (solvant CDCl₃) donnés par :

- Pretsch, Bühlmann, Badertscher, *Structure Determination of Organic
  Compounds* (tables de données spectroscopiques de référence).
- H. J. Reich, *NMR Chemistry Shift Tables* (University of Wisconsin,
  notes de cours publiques).
- SDBS — Spectral Database for Organic Compounds, National Institute of
  Advanced Industrial Science and Technology (AIST), <https://sdbs.db.aist.go.jp/>
  (valeurs tabulées de référence).
- Chemistry LibreTexts, <https://chem.libretexts.org/> (vérification croisée
  des ordres de grandeur).

Les structures chimiques correspondantes sont vérifiables dans
`tools/molecules.json` (code source chemfig lisible, relecture possible
molécule par molécule).

## Instructions pour lancer localement l'application

Aucune étape de build n'est nécessaire. Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

puis ouvrir `http://localhost:8000/physique-chimie/rmn/index.html` (ou
l'ouvrir directement comme fichier local : tous les chemins sont relatifs).
Lancer les tests : ouvrir `tests/index.html` de la même façon.

## Résultats des tests réalisés

`tests/index.html` exécute, dans le navigateur, **156 tests** sur le code réel
de l'application (pas une réimplémentation) : intégrité des données (7
compétences, ≥10 questions au diagnostic initial couvrant les 7 compétences,
3-5 exercices par activité, ≥5 questions par diagnostic de sortie, aucune
réutilisation d'identifiant entre activités/diagnostics, remédiation pour
chaque compétence, cohérence des spectres), logique du moteur de correction
(choix unique, cases à cocher avec pénalité de propositions fausses,
tolérances numériques, exactitude exigée sur les comptages entiers), moteur de
multiplets (triangle de Pascal, superposition de raies quand J₁=J₂, résolution
complète quand J₁≠J₂), et moteur de maîtrise (plafond du diagnostic initial,
niveau 4 seulement sur preuve de difficulté suffisante, maîtrise qui diminue
après un échec ultérieur, « non évalué » jamais confondu avec « niveau 0 »,
les activités seules ne font jamais progresser la maîtrise). **156/156
réussis** lors de la dernière exécution.

Vérifications manuelles effectuées dans le navigateur avant mise en ligne
(voir aussi la liste de critères du cahier des charges, partie 15) :

- Diagnostic initial complet (12 questions, tous types de réponse) : soumission,
  calcul correct par compétence, bilan rédigé généré automatiquement.
- Parcours complet d'une activité (y compris mauvaise réponse → indice →
  nouvelle tentative → explication), persistance de la progression après
  rechargement en plein milieu d'un exercice.
- Diagnostic de sortie déclenchant une remédiation ciblée sur une compétence
  fragile, puis vérification de la mise à jour du niveau de maîtrise
  correspondant (y compris un cas de **diminution** d'une compétence après un
  diagnostic ultérieur en échec, pendant qu'une autre progresse).
- Simulateur interactif J₁/J₂ (activité 4) : superposition de raies quand
  J₁=J₂, résolution complète quand J₁≠J₂.
- Visionneuse de spectre (activité 5, diagnostic D5) : axe orienté
  correctement (δ élevé à gauche), zoom sur un signal au clic, dézoom.
- Légende interactive d'équivalence chimique (page Cours) sur les 5 molécules
  concernées.
- Rendu correct en largeur mobile (375 px) et desktop.
- Aucun chemin absolu : le module fonctionne aussi bien à la racine qu'en
  sous-chemin GitHub Pages.
