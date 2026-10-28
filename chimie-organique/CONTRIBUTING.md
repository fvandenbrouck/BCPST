# Compléter la base de questions / ajouter des molécules

Ce document explique comment enrichir l'application **sans toucher au code
de l'interface** (cf. cahier des charges), en modifiant uniquement les
fichiers de `data/` et, si une nouvelle molécule est nécessaire,
`tools/molecules.json`.

## 1. Ajouter une question (QCM, reconnaissance, définition, liaison)

Ouvrir `data/questions.js` et ajouter un objet dans le tableau approprié
(`qcm`, `recognition`, `liaisons` ou `definitions`), en respectant le
schéma commun :

```js
{ id:'qcm-46', module:'A', theme:'alcool', difficulty:1, type:'qcm',
  question:"…",
  options:["…","…","…","…"], answer: 2,   // index de la bonne réponse
  explanation:"…",
  sourcePage:'p.3', tags:['alcool'] }
```

Pour une question de type `recognition` (mode 3), `answer` est un tableau
de libellés qui doivent être **exactement** ceux de `RECOGNITION_GROUPS` en
tête de fichier (ou `'Aucun groupe caractéristique'`), et `structure`
pointe vers un SVG existant (voir partie 2 s'il faut en créer un nouveau).

L'identifiant (`id`) doit être unique dans tout le fichier : la suite de
tests (`tests/index.html`) le vérifie automatiquement, ainsi que la validité
des index de réponse et des libellés de groupes.

## 2. Ajouter une molécule (nouveau SVG)

Les formules topologiques sont pré-générées avec
[chemfig](https://ctan.org/pkg/chemfig) (LaTeX) plutôt que dessinées à la
main, pour garantir un rendu propre et des structures vérifiables.

### Prérequis (une seule fois, sur la machine de développement)

- Une distribution LaTeX avec le paquet `chemfig` (TeX Live complet ou
  MacTeX).
- `pdftocairo` (fourni par Poppler : `brew install poppler` sur macOS).
- Python 3 (déjà nécessaire pour rien d'autre : le script ne dépend que de
  la bibliothèque standard).

### Étapes

1. Ouvrir `tools/molecules.json` et ajouter une entrée :
   ```json
   { "id": "fam-mon-exemple", "chemfig": "-[:30]-[:-30]OH" }
   ```
   L'`id` devient le nom du fichier généré (`assets/mol/fam-mon-exemple.svg`).
   Pour un schéma non-structural (boîtes reliées, type Base/Pentose/
   Phosphate), utiliser `"tikz"` au lieu de `"chemfig"` avec du code
   `tikzpicture` brut (voir les entrées `bio-*-schema` existantes).

2. Régénérer tous les SVG :
   ```bash
   python3 tools/build_molecules.py
   ```
   Le script compile un unique document LaTeX (une molécule par
   `preview`), puis découpe chaque page en un fichier SVG indépendant dans
   `assets/mol/`, avec les couleurs remplacées par `currentColor`.

3. Référencer le nouveau fichier depuis `data/families.js`,
   `data/nomenclature.js`, `data/biomolecules.js` ou `data/questions.js`
   via son chemin : `img:'assets/mol/fam-mon-exemple.svg'`.

4. **Vérifier visuellement** le rendu (ouvrir la page concernée dans un
   navigateur) avant de considérer la molécule comme prête : le script ne
   vérifie pas que la structure dessinée correspond chimiquement à ce que
   l'on voulait écrire, seulement qu'il ne produit pas d'erreur LaTeX.

### Repères de syntaxe chemfig utiles

- Chaîne simple : `-[:30]-[:-30]-[:30]` (angles alternés pour un
  zig-zag standard).
- Liaison double / triple : `=[:30]…` / `~[:30]…`.
- Ramification : `-[:30](-[:90]OH)-[:-30]…` (la parenthèse ouvre une
  branche, qui repart ensuite sur la chaîne principale).
- Cycle à *n* sommets : `*n(------)` (*n* tirets pour fermer le cycle),
  substituant sur un sommet : `*6(-(-[:90]CH_3)-----)`.
- Un hétéroatome s'écrit toujours explicitement (`OH`, `NH_2`, `Cl`, `SH`…,
  le `_` produit un indice) ; un sommet sans texte reste un carbone
  implicite, conformément à la convention des formules topologiques du
  cours (p.5).

En cas de doute sur une structure, mieux vaut s'appuyer sur une molécule
déjà présente dans `tools/molecules.json` et l'adapter, plutôt que de
repartir de zéro.

## 3. Ajouter une fiche de famille (Module A) ou une notion (Module B)

Suivre le même schéma que les entrées existantes de `data/families.js` /
`data/biomolecules.js`. Ne jamais inventer un suffixe de nomenclature qui
n'apparaît pas dans le tableau de priorité (`data/nomenclature.js`,
`reference.prioriteSuffixes`) : si le programme n'en prévoit pas pour une
famille donnée (dérivés halogénés, éther, hémiacétal, acétal, anhydride
phosphorique), le champ `suffix` doit rester `null` et `suffixNote` doit
l'expliquer — ne pas en fabriquer un pour « faire complet ».

## 4. Ajouter un exercice de nomenclature (Module C)

Ajouter une entrée dans `data/nomenclature.js` (`exercises`), avec un
niveau (`level: 1|2|3`), le nom systématique **vérifié à la main** selon
les règles de `reference` (priorité des suffixes, règles de numérotation),
une explication pas-à-pas, 2-3 indices progressifs, et la molécule à
nommer sous l'une de ces deux formes (mutuellement exclusives) :

- `img:'assets/mol/no-xx.svg'` — une structure topologique dessinée (voir
  partie 2 ci-dessus) ;
- `formula:'CH3–CH2–OH'` — une formule semi-développée donnée directement
  en texte (aucun SVG à générer ; utiliser le tiret long « – » entre les
  groupes et les indices unicode ₂₃… pour les atomes d'hydrogène, comme
  dans les entrées `no-29` et suivantes).

Les flashcards et le quiz rapide réutilisent automatiquement cette entrée,
quelle que soit la forme choisie — aucune autre modification n'est
nécessaire.

Toute modification de `data/*.js` est automatiquement reflétée dans :
tableau de bord (comptage), flashcards (générées depuis les données), quiz
rapide (pioche dans la banque fusionnée), et bibliothèque de fiches.
