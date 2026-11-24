# Thermodynamique : travail, transfert thermique et bilans — BCPST1

Application web interactive, nouvelle page du site [Strates](../../index.html),
pour une étudiante de BCPST1 préparant le thème E du programme officiel
(système thermodynamique, gaz parfait, premier principe, enthalpie — codes
**E.1, E.2**). Elle accompagne une série de vidéos de cours enregistrées par
l'enseignant : elle sert à **manipuler, prédire et comparer**, pas à
remplacer le cours.

Elle **prolonge** le module de révision de Terminale
[`physique-chimie/premier-principe.html`](../premier-principe.html) (gabarit
Cours/QCM/Applications/Carte mentale) sans le dupliquer : ce dernier pointe
vers ce module en fin de page, pour qui veut aller au niveau BCPST1.

## Vocabulaire

Le mot « chaleur » n'est jamais utilisé : conformément au vocabulaire du
programme, on écrit systématiquement « transfert thermique » (le symbole `Q`
reste `Q`).

## Hypothèses physiques (valables dans tout le module)

- Système fermé {gaz + piston}, cylindre horizontal, frottements négligés,
  ΔU du piston négligée, ΔE_c = 0 entre deux états de repos.
- Convention de signe : W et Q comptés positivement quand le système les
  reçoit. Premier principe : ΔU = W + Q.
- Gaz parfait, monoatomique par défaut (C_v = 3nR/2), diatomique en option
  (C_v = 5nR/2). Relation de Mayer : C_p − C_v = nR.
- Pas d'entropie, pas de diagramme (T, s). La loi de Laplace (P·V^γ =
  constante) n'est **jamais démontrée** : elle apparaît uniquement dans un
  encadré « formule fournie ».
- Évolution **brutale** (monobare) : la pression du gaz n'est pas définie
  pendant le mouvement du piston. Le diagramme de Clapeyron n'affiche alors
  jamais de chemin, seulement l'état initial, l'état final, la droite
  P = P_a et l'aire du rectangle −P_a·ΔV.
- Évolution **quasi-statique** : P est définie à chaque instant,
  W = −∫P dV est l'aire sous la courbe.
- ΔH = Q seulement si P_i = P_f = P_a ; affiché uniquement dans ce cas, avec
  la condition rappelée.
- Valeurs par défaut : P₀ = 1,00·10⁵ Pa, V₀ = 1,00 L, T₀ = 300 K, d'où
  nR = P₀V₀/T₀ = 1/3 J/K et nRT₀ = 100 J.

## Organisation du code

```
physique-chimie/thermo/
  index.html              Page unique (SPA), routeur à hash, lien « ← Retour à Strates »
  css/thermo.css          Styles propres, réutilisent assets/css/strates.css (accent ocre, PC)
  js/
    physics.js              Fonctions pures de thermodynamique, sans DOM (toute la physique)
    storage.js               Persistance locale, clé thermo:state:v1 (distincte des autres modules)
    clapeyron.js               Diagramme de Clapeyron en SVG responsive (viewBox), générique
    videos.js                   Composant « Vidéo associée » et page « Vidéos »
    app.js                        Routeur (hash) et orchestration
    atelier-1.js, …, atelier-4.js  Un fichier par atelier, enregistré dans window.ThermoAteliers
  data/videos.js           Catalogue des vidéos pédagogiques (seul fichier à modifier pour un lien)
  tests/index.html          Suite de tests exécutée dans le navigateur, comme ir/tests/
```

Scripts classiques (pas de module ES, pas de framework, pas de bundler),
avec `?v=1` en paramètre de cache. Formules en KaTeX via CDN (`$...$` et
`$$...$$`), rendu via `window.MathRender.render(container)` après chaque
injection de HTML. Aucun appel réseau autre que polices et KaTeX ; aucune
API, aucune donnée personnelle, aucune statistique. Pas de PWA.

### `js/physics.js` — le moteur physique

Fonctions pures (aucun accès au DOM), toutes testées numériquement dans
`tests/index.html` : loi des gaz parfaits, détente isotherme quasi-statique,
évolutions brutales monobares (Q imposé ou thermostat), segments
quasi-statiques (isobare, isochore, adiabatique réversible avec loi de
Laplace fournie), détente de Joule–Gay-Lussac, chemin libre par sommation de
travaux élémentaires (méthode des trapèzes). C'est le seul fichier qui
« sait » faire de la thermodynamique — tous les ateliers l'appellent, aucun
ne recalcule une formule par lui-même.

### `js/clapeyron.js` — le diagramme

Composant de dessin pur : il place des éléments déclaratifs (`point`,
`segment`, `curve`, `hline`, `rect`) dans un repère (V, P) à origine P = 0,
sans connaître la physique sous-jacente. Réutilisé à l'identique par les
ateliers 1 et 2.

### Les 4 ateliers

1. **Piston, gaz et chemins** — état initial réglable, choix du gaz,
   évolution brutale (Q imposé ou thermostat) ou quasi-statique
   (isotherme/isobare/isochore/adiabatique réversible), bilan écrit en LaTeX.
2. **Tracer son chemin de A à B** — cinq chemins quasi-statiques prédéfinis
   (A = P₀,V₀,T₀ ; B = P₀/2,2V₀,T₀) + un chemin libre à main levée (pointer
   events sur le diagramme, calcul par trapèzes). Tableau comparatif
   cumulatif : W et Q dépendent du chemin, ΔU jamais.
3. **Frontières et bilan** — explorateur système/frontières (mobile ?
   diatherme ? perméable à la matière ? conducteur électrique pour un fil),
   classification isolé/fermé/ouvert, forme dynamique du premier principe,
   puis 3 exercices guidés corrigés.
4. **Gaz microscopique** — simulation 2D qualitative (canvas, ~150 disques
   durs, collisions élastiques), curseurs agitation/volume, pression mesurée
   par les chocs comparée à la tendance P ∝ T/V, option d'interaction
   attractive simplifiée (Lennard-Jones). À côté de l'animation, un
   histogramme des vitesses individuelles (canvas) se met à jour en temps
   réel, avec la moyenne ⟨v⟩ (ligne) et une bande ⟨v⟩ ± σ (écart-type) pour
   visualiser la dispersion des vitesses. Son axe des vitesses est fixe
   (0 à 9, cohérent avec la plage du curseur agitation) plutôt que
   recalculé à chaque image, pour que la moyenne et l'écart-type se
   déplacent visiblement quand on manipule le curseur. L'atelier 4 est le seul à avoir
   une boucle `requestAnimationFrame` : son `render()` retourne une fonction
   `destroy()` que `js/app.js` appelle avant de changer de page, pour éviter
   toute double boucle.

Chaque atelier commence par un encadré « pont » (ce que l'étudiante a vu au
lycée → ce qu'elle retrouvera en BCPST1) et suit la pédagogie
prédire/observer/expliquer : avant de lancer une simulation, elle prédit
(signe de W, de Q…), puis compare au résultat calculé.

## Vidéos pédagogiques

`data/videos.js` définit la playlist et le catalogue. **C'est le seul
fichier à modifier pour renseigner un lien** :

```js
window.THERMO_VIDEOS = {
  playlistUrl: null,
  videos: [
    { id: 'v1', ordre: 1, titre: "...", resume: "...", duree: "...", url: null, ateliers: ['atelier-1'], chapitres: [] },
    // ...
  ]
};
```

### Ajouter un lien de vidéo

1. Ouvrir `data/videos.js`.
2. Remplacer le `url: null` de la vidéo concernée par son adresse, par
   exemple `url: "https://youtu.be/XXXXXXXXXXX"`.
3. Enregistrer et pousser sur GitHub : le site se met à jour sans autre
   modification.

Une adresse qui ne commence pas par `https://www.youtube.com/` ou
`https://youtu.be/` fait échouer `tests/index.html` (voir la section
« VIDÉOS » de la suite de tests). Si `url` vaut `null`, le composant affiche
un bouton visuellement inactif (« Vidéo bientôt disponible »,
`aria-disabled="true"`, non focalisable, aucun `href`) ; si `url` est
renseignée, un bouton « Regarder sur YouTube » (`target="_blank"`,
`rel="noopener noreferrer"`) apparaît. Aucune vidéo n'est jamais intégrée en
iframe. Le champ `chapitres` (vide pour l'instant) servira plus tard à des
repères horodatés (`{t:125, titre:"…"}`), ajoutant `?t=<secondes>` à
l'adresse de la vidéo.

## Tests

`tests/index.html` exécute, dans le navigateur, le code réel de l'application
(`js/physics.js` et le composant vidéos) : tous les cas numériques du cahier
des charges (détente isotherme, détentes/compressions brutales, chauffages
isochore/isobare, segments adiabatiques avec vérification numérique
−∫P dV ≈ C_v·ΔT, cohérence ΔU = W + Q, indépendance de ΔU au chemin dans
l'atelier 2) ainsi que l'intégrité du catalogue de vidéos. **79/79 tests
réussis** lors de la dernière exécution.

## Instructions pour lancer localement l'application

Aucune étape de build n'est nécessaire. Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

puis ouvrir `http://localhost:8000/physique-chimie/thermo/index.html`
(ou, depuis un téléphone sur le même réseau Wi-Fi,
`http://<IP-locale-de-l'ordinateur>:8000/physique-chimie/thermo/index.html`).
Lancer les tests : ouvrir `tests/index.html` de la même façon.
