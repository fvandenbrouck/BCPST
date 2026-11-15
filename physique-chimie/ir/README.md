# Spectroscopie infrarouge — BCPST1

Application web interactive d'apprentissage de la spectroscopie infrarouge
(IR), nouvelle page du site [Strates](../../index.html), pour une étudiante
de BCPST1 préparant le chapitre C.1.3 du programme officiel ([programme
officiel BCPST1 2021](https://www.concours-agro-veto.fr/sites/default/files/media/2025-10/se-preparer_programmes-cpge-bcpst-physique-chimie.pdf),
section C.1.3, p.14). Capacité exigible visée : *« Confirmer ou attribuer la
structure d'une entité chimique à partir de données spectroscopiques IR et/ou
de RMN. »*

Même architecture, même modèle pédagogique et même moteur d'évaluation que le
module [RMN du proton](../rmn/README.md), développé juste avant et explicitement
réutilisé comme référence pour ce module (navigation, persistance, moteurs de
correction/maîtrise, jauges, thème visuel). Les deux modules sont des pages
distinctes et strictement indépendantes : **aucune donnée ni aucun score de
maîtrise n'est partagé entre eux** (clés `localStorage` séparées : `rmn:state:v1`
contre `ir:state:v1`).

## Fonctionnement

Page unique (SPA) en JavaScript natif, sans build, sans backend, sans compte
utilisateur. Quatre composantes, accessibles à tout moment par la barre de
navigation (**Accueil | Essentiels du cours | Méthode | Diagnostic initial |
Activités | Tableau de maîtrise**) :

- **Essentiels du cours** — principe de la spectroscopie IR, nombre d'onde
  (formules rendues en KaTeX), transmittance/absorbance avec une démonstration
  interactive (bascule sur un vrai tracé, pas juste une image), table de
  corrélation des bandes avec échelle interactive, neuf fiches de groupes
  fonctionnels (chacune avec une formule topologique où le groupe
  caractéristique peut être mis en évidence), région de l'empreinte digitale,
  pièges fréquents.
- **Méthode** en 6 étapes, consultable en fiche flottante depuis n'importe
  quelle page sans perdre sa progression.
- **Diagnostic initial** (14 questions, C1 à C7, aucune correction affichée
  pendant le test) puis **activités** : 6 activités (4-5 exercices
  socratiques chacune), chacune suivie d'un **diagnostic de sortie
  indépendant** (D1-D6, 6 questions chacun, situations inédites). Une fois
  toutes les réponses soumises, chaque diagnostic affiche automatiquement un
  **bilan écrit** (taux de réussite qualifié, compétences solides/fragiles,
  évolution par rapport à la mesure précédente, recommandation — généré
  localement, sans appel réseau ni clé API) puis la **correction détaillée**
  de chaque question, avec **remédiation automatique** ciblée sur les
  compétences fragiles.
- **Tableau de maîtrise** : barre brun→vert à interpolation continue, toujours
  visible, strictement distincte de l'avancement du parcours ; 7 barres de
  compétence ; historique des progrès ; calcul transparent et explicable.

Au rechargement de la page, l'étudiante retrouve exactement son état
d'avancement (page courante, exercice en cours au sein d'une activité, tous
les résultats). Un bouton « Reprendre le parcours à zéro » efface
uniquement la progression IR, après confirmation explicite.

## Note sur la complétude du prompt d'origine

Le prompt fourni pour ce module s'est interrompu au milieu de la liste
d'exercices de l'activité 5 (« Confirmer ou exclure une structure »). Les
exercices restants de l'activité 5 et la totalité de l'activité 6 (« Réaliser
une identification complète », compétence C7) ont été complétés en miroir
strict de la structure, des objectifs et des compétences explicitement
donnés pour ces deux activités, et selon le même principe pédagogique que le
reste du prompt et que le module RMN (indices positifs/négatifs, élimination
méthodique, synthèse finale combinant IR et RMN). De même, les parties
« évaluations », « tableau de maîtrise » et « architecture technique » (non
visibles après la coupure) suivent directement les mêmes règles que celles,
explicitement données, du module RMN.

## Organisation du code

```
physique-chimie/ir/
  index.html              Page unique (SPA), charge toutes les données et tous les scripts
  css/ir.css                Styles spécifiques (réutilise assets/css/strates.css)
  data/
    competences.js           Référentiel des 7 compétences C1-C7 + niveaux 0-4
    spectres.js                Banque de spectres (10 molécules, valeurs de référence documentées)
    cours.js                     Contenu du cours
    methode.js                     Méthode en 6 étapes
    diagnostic-initial.js            14 questions, C1 à C7
    activites.js                       6 activités × 4-5 exercices, avec indices et explications
    diagnostics-sortie.js                D1 à D6 (6 questions chacun) + banque de remédiation
  js/
    storage.js                            Persistance locale (clé ir:state, distincte du module RMN)
    grading-engine.js                       Moteur de correction — identique au module RMN (code générique, copié tel quel)
    mastery-engine.js                         Moteur de calcul de la maîtrise — même algorithme que RMN, espace de noms IR_*
    ir-scale.js                                 Échelle interactive des nombres d'onde
    spectrum-viewer.js                            Visionneuse de spectre (bascule transmittance/absorbance, zoom)
    molecule-view.js                                Affichage des formules (SVG statiques) + bascule structure/groupe coloré
    ui-components.js                                  Rendu des questions — identique au module RMN (code générique, copié tel quel)
    app.js                                              Routeur (hash) et orchestration de toutes les pages
  assets/mol/*.svg          Formules topologiques pré-générées (chemfig → SVG, voir ci-dessous)
  tools/
    molecules.json            Manifeste chemfig de chaque molécule (19 entrées)
    build_molecules.py         Script de génération des SVG (développement uniquement)
  tests/index.html           Suite de tests automatisés (exécutée dans le navigateur)
```

### Formules chimiques : SVG statiques pré-générés (chemfig), jamais dessinées en JS

Même principe que le module RMN : les structures sont écrites en
[chemfig](https://ctan.org/pkg/chemfig) (LaTeX), compilées une fois en
développement par `tools/build_molecules.py`, puis commitées comme fichiers
SVG statiques dans `assets/mol/`. Pour les neuf fiches de groupes
fonctionnels, chaque molécule existe en deux variantes pré-générées : une
version « structure seule » (`-plain`) et une version « groupe mis en
évidence » (`-highlight`, le groupe caractéristique coloré). Basculer entre
les deux ne fait que changer le `src` de l'`<img>` (`js/molecule-view.js`) :
aucune géométrie n'est recalculée côté client.

### Pourquoi le spectre et l'échelle sont-ils dessinés en JavaScript ?

Comme pour le module RMN, le tracé du spectre (`js/spectrum-viewer.js`) et
l'échelle des nombres d'onde (`js/ir-scale.js`) ne sont pas des formules
chimiques mais des graphiques de données, calculés à partir de valeurs
numériques (position, intensité, largeur de chaque bande, combinées en
bosses gaussiennes). Ils sont donc générés dynamiquement — ce qui permet
notamment la bascule interactive transmittance/absorbance et le zoom sur une
bande, sans qu'aucune structure moléculaire n'y soit représentée.

## Modèle d'évaluation et calcul de la maîtrise

Identique, algorithme pour algorithme, au module RMN (cf.
[physique-chimie/rmn/README.md](../rmn/README.md#modèle-dévaluation-et-calcul-de-la-maîtrise)
et le commentaire d'en-tête de `js/mastery-engine.js`). Résumé :

1. Seules les évaluations diagnostiques (diagnostic initial, D1-D6,
   remédiation) produisent une preuve de maîtrise — jamais les exercices
   d'entraînement des activités.
2. Pour chaque compétence, seule la session d'évaluation la plus récente
   compte : la maîtrise peut stagner ou diminuer après un diagnostic en échec.
3. Le niveau dépend du taux de réussite ET de la difficulté des questions
   réussies ; réussir uniquement du facile ne peut jamais valoir le niveau 4.
4. Le diagnostic initial est plafonné au niveau 2 (état des lieux, pas preuve
   d'autonomie).
5. Score global = moyenne pondérée des compétences évaluées (C6/C7 pèsent
   davantage), compétences non évaluées exclues de la moyenne.

Le moteur de correction (`js/grading-engine.js`, code strictement identique à
celui du module RMN) applique, pour les cases à cocher à plusieurs bonnes
réponses, un barème qui n'attribue jamais le crédit plein si une proposition
fausse est également cochée ; les réponses numériques utilisent une tolérance
explicite, sauf pour les comptages entiers qui exigent une réponse exacte.

## Sources scientifiques et spectres utilisés

Aucune image de spectre expérimental brut extraite d'une base externe n'est
reproduite ici. Les 10 spectres de `data/spectres.js` (éthanol, acide
éthanoïque, propanal, propanone, éthanoate d'éthyle, butan-2-one,
éthanamine, propanamide, propène, benzène) sont des **reconstructions
pédagogiques** (statut `'reconstruction'`, affiché comme tel dans
l'interface), tracées par `js/spectrum-viewer.js` à partir de valeurs de
position, d'intensité et de largeur de bande qui sont des **valeurs de
référence caractéristiques**, bien établies dans la littérature et conformes
aux ordres de grandeur usuels (phase liquide) donnés par :

- Pretsch, Bühlmann, Badertscher, *Structure Determination of Organic
  Compounds* (tables de corrélation IR de référence).
- Tables de corrélation IR usuelles de chimie organique (nombres d'onde
  caractéristiques O–H, N–H, C–H, C=O, C=C, C–O).
- SDBS — Spectral Database for Organic Compounds, National Institute of
  Advanced Industrial Science and Technology (AIST),
  <https://sdbs.db.aist.go.jp/> (valeurs tabulées de référence).
- Chemistry LibreTexts, <https://chem.libretexts.org/> (vérification croisée
  des ordres de grandeur, notamment pour la distinction cétone/ester/amide).

Les structures chimiques correspondantes sont vérifiables dans
`tools/molecules.json` (code source chemfig lisible, relecture possible
molécule par molécule).

## Instructions pour lancer localement l'application

Aucune étape de build n'est nécessaire. Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

puis ouvrir `http://localhost:8000/physique-chimie/ir/index.html`. Lancer les
tests : ouvrir `tests/index.html` de la même façon.

## Résultats des tests réalisés

`tests/index.html` exécute, dans le navigateur, **196 tests** sur le code réel
de l'application : intégrité des données (7 compétences, ≥12 questions au
diagnostic initial couvrant les 7 compétences, ≥4 exercices par activité, ≥6
questions par diagnostic de sortie, aucune réutilisation d'identifiant entre
activités/diagnostics, remédiation pour chaque compétence, nombres d'onde des
bandes plausibles), logique du moteur de correction (identique au module
RMN : choix unique, cases à cocher avec pénalité de propositions fausses,
tolérances numériques), et moteur de maîtrise (plafond du diagnostic initial,
niveau 4 seulement sur preuve de difficulté suffisante, maîtrise qui diminue
après un échec ultérieur, « non évalué » jamais confondu avec « niveau 0 »,
les activités seules ne font jamais progresser la maîtrise). **196/196
réussis** lors de la dernière exécution.

Vérifications manuelles effectuées dans le navigateur avant mise en ligne :

- Rendu KaTeX des formules ($\sigma=1/\lambda$, $A=-\log_{10}(T)$, etc.)
  sur la page Cours.
- Bascule transmittance/absorbance sur un vrai tracé interactif (creux ↔
  pics, même position en nombre d'onde) ; zoom sur une bande au clic.
- Neuf fiches de groupes fonctionnels avec bascule structure seule / groupe
  coloré.
- Diagnostic initial complet (14 questions, tous types de réponse) :
  soumission, calcul correct par compétence, bilan écrit généré
  automatiquement (taux qualifié, forces/faiblesses, recommandation), puis
  correction détaillée de chaque question affichée automatiquement (y
  compris pour chaque diagnostic de sortie D1-D6), maîtrise plafonnée à 50 %
  (niveau 2/4) comme attendu.
- Évolution d'une compétence d'un diagnostic à l'autre : vérifié qu'une
  compétence en progrès est annoncée comme telle dans le bilan, et qu'une
  compétence dont le niveau diminue après un diagnostic ultérieur est
  signalée (« le niveau a diminué depuis la dernière évaluation »).
- Parcours complet d'une activité (mauvaise réponse → indice → nouvelle
  tentative → explication), persistance exacte après rechargement en plein
  milieu d'un exercice.
- Diagnostic de sortie déclenchant une remédiation ciblée sur une compétence
  volontairement affaiblie, avec mise à jour correcte du niveau correspondant.
- Les clés `localStorage` des modules RMN et IR restent strictement
  indépendantes (`rmn:state:v1` / `ir:state:v1`).
- Rendu correct en largeur mobile (375 px) et desktop.
- Aucun chemin absolu : le module fonctionne aussi bien à la racine qu'en
  sous-chemin GitHub Pages.
