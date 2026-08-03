# Prompt — Construire le reste de la Phase 1 SVT (site Strates)

> Prompt prêt à coller tel quel en tout début d'une nouvelle session Claude Code, dans le dépôt `/Users/francoisvandenbrouck/Documents/FV/perso/alix/OnBoardingBCPST`.

---

Tu travailles sur **Strates**, un site de révisions BCPST1 statique (HTML/CSS/JS vanilla, sans framework ni build) pour une élève qui entre en BCPST1 sans avoir suivi la spécialité SVT en Terminale. Le dépôt est `/Users/francoisvandenbrouck/Documents/FV/perso/alix/OnBoardingBCPST`, poussé sur `https://github.com/fvandenbrouck/BCPST` (public) et déployé en continu sur `https://fvandenbrouck.github.io/BCPST/` (GitHub Pages actif, se redéploie automatiquement à chaque push sur `main`).

**Avant toute chose, lis dans cet ordre** :
1. `SYNTHESE_SESSION.md` — état réel du projet, décisions déjà prises, conventions à respecter. C'est la source de vérité la plus à jour.
2. `CAHIER_DES_CHARGES.md` §0 (principes non négociables), §2 (plan de construction SVT), §6 (identité visuelle) — le brief initial complet, stable.
3. `svt/ch05-datation-relative.html` et `svt/ch06-datation-absolue.html` — les deux modules déjà construits, à utiliser comme gabarit de référence exact (structure des données, ton, niveau de détail).

## Objectif de cette session

Construire **tous les modules SVT restants de la Phase 1**, dans l'ordre ci-dessous, un par un, en validant chaque module avant de passer au suivant. Ne pas commencer la Physique-Chimie ni les Mathématiques (Phases 2/3) : ce prompt ne couvre que la Phase 1 SVT.

| Ordre | Module | Chapitre manuel | Pages | Articulation à respecter |
|---|---|---|---|---|
| ✅ fait | Datation relative | Ch.5 | 122-141 | — |
| ✅ fait | Datation absolue | Ch.6 | 144-161 | — |
| 3 | Traces du passé mouvementé de la Terre | Ch.7 | 164-190 | Clôt le thème "passé géologique" ; le carnet de terrain du Chenaillet (`carnet-de-terrain/chenaillet.html`) référence déjà ce chapitre (tags `SVT-Ch7-U2`, `SVT-Ch7-U3`) — vérifier la cohérence des unités et ajouter le badge de renvoi "🏔️ Vu sur le terrain" une fois ce module construit (cf. §5 de `SYNTHESE_SESSION.md`) |
| 4 | Organisation des plantes à fleurs | Ch.8 | 196-217 | Ouvre le thème "plante domestiquée" ; le carnet du Lautaret y renvoie aussi (tags `SVT-Ch8-U1`) — même remarque sur le badge |
| 5 | La plante productrice de matière organique | Ch.9 | 220-241 | Lien direct avec BCPST1 (bilans d'énergie, cycle du carbone) et avec le thème E de physique-chimie |
| 6 | La domestication des plantes | Ch.11 | 268-282 | Dernier point Terminale explicitement cité par les recommandations sur ce thème |
| 7 | Cellule musculaire, ATP | Ch.17 | 422-447 | Ouvre "corps humain et santé" |
| 8 | Contrôle des flux de glucose | Ch.18 | 450-473 | Dernier point Terminale explicitement listé |
| 9-10 | Génétique de base + Géologie interne (modules "Première", sans manuel) | — | — | Contenu 100% original, pas de renvoi de page |
| 11 (bonus) | L'origine du phénotype (méiose, brassage) | Ch.1 | 30-53 | Priorité secondaire |
| 12 (bonus tertiaire) | Le climat au Cénozoïque | Ch.12 | 292-315 | Hors recommandations officielles, ajouté seulement parce que le carnet du Lautaret y renvoie. À construire uniquement après les modules 1-11, sans engagement de calendrier |
| 13 (bonus tertiaire) | Le changement climatique actuel | Ch.14 | 342-366 | Idem — même origine, même absence de priorité |

Le point qui restait ouvert sur `SVT-Ch12`/`SVT-Ch14` (tags du carnet de terrain sans module correspondant) est tranché : ces deux chapitres sont maintenant dans la feuille de route officielle (`CAHIER_DES_CHARGES.md` §2), en tout dernier rang. Ne pas les construire avant d'avoir terminé 1 à 11.

## Ce que chaque module doit contenir (gabarit à 4 onglets, inchangé)

- **Cours** : une fiche par unité du chapitre, rédaction 100% originale (jamais de texte recopié du manuel Belin Éducation ni d'aucune source protégée — renvois de page en index uniquement), tag `p.NN` par fiche.
- **Flashcards** : 10-12 cartes recto/verso, notion associée à chaque carte.
- **QCM** : 15-20 questions (≥10 connaissance, ≥5 raisonnement), chaque question de raisonnement a un `hint` qui donne une piste de méthode, **jamais la réponse**. Le moteur (`qcm-engine.js`) mélange déjà l'ordre d'affichage des options automatiquement — ne te soucie pas de la position de `correct` dans les données.
- **Carte mentale** : `mindmapModel` fourni comme carte de référence, jamais pré-remplie pour l'élève (elle construit d'abord de mémoire, puis compare).
- **Bridge Première → Terminale → BCPST1** : champ `bridge:{from, to}` obligatoire en tête de chaque module — d'où vient la notion, où elle est réinvestie en BCPST1.
- **Illustrations QCM (optionnel, `question.image`)** : à ajouter *seulement quand ça apporte une vraie plus-value* (jamais systématique). Deux sources possibles :
  - Photo d'objet réel : cherche sur Wikimedia Commons, vérifie la licence CC sur la page du fichier, utilise l'URL directe `upload.wikimedia.org/...`, renseigne `credit` avec l'attribution exacte.
  - Schéma de scénario fictif/abstrait (coupe géologique inventée, diagramme) : dessine un SVG original dans `assets/img/chXX/`, sans `credit` (contenu original). Utilise des couleurs hexadécimales en dur (un SVG chargé via `<img>` n'hérite pas des variables CSS de la page) — reprends la palette de `assets/css/strates.css` §6 du cahier des charges.

## Contrat de données exact (copier la structure de ch06, pas la réinventer)

```js
const MODULE = {
  id, chapNum, subjectLabel: "Géologie" | "Biologie végétale" | "Physiologie" | ...,
  accent: 'var(--rust)',   // SVT reste rouille
  title, pages, backHref: '../index.html',
  bridge: {from, to},
  fiches: [{unit, page, title, paragraphs:[...], bullets:[...]}],
  flashcards: [{id, recto, verso, notion}],
  qcmMeta: {
    order: ['connaissance','raisonnement'],
    labels: {connaissance:'Connaissance', raisonnement:'Raisonnement'},
    words: {connaissance:'connaissances', raisonnement:'raisonnement'}
  },
  diagnostic: {unitNames:{...}, bilanPage, exosPage, bacPage, nextStep},
  qcm: [{id, type, difficulty, notion, q, options, correct, hint?, image?}],
  mindmapModel: {label, children:[...]}
};
ModulePage.init(MODULE);
```

## Décisions déjà prises en session (ne pas les rouvrir)

- Stockage : `localStorage` via `Storage.get/set` (`assets/js/storage.js`), pas de `window.storage`.
- Manuel de référence : **Belin Éducation**, pas Hachette (déjà corrigé partout).
- Le moteur QCM mélange l'ordre des options tout seul — ne rééquilibre pas manuellement la position des bonnes réponses.
- `references/` est gitignoré : jamais poussé sur GitHub, mais consultable localement pour vérifier l'exactitude scientifique.
- GitHub Pages est déjà activé et se redéploie automatiquement — pas besoin de redemander confirmation avant de pousser un commit.

## Méthode de travail attendue

1. Un module à la fois. Pour chacun : écrire le fichier `svt/chXX-....html`, ajouter l'entrée correspondante dans `assets/js/modules-registry.js` (`status:'available'`, `href` renseigné), tester dans le navigateur (les 4 onglets, absence d'erreur console, score QCM juste), vider `localStorage` de test, puis committer.
2. Vérifie l'exactitude scientifique du contenu par tes connaissances générales (et par recherche web si besoin), jamais en recopiant une source protégée.
3. Ton toujours encourageant dans les diagnostics, jamais culpabilisant — reprends le style déjà rédigé dans `qcm-engine.js` (`buildDiagnostic`).
4. À la fin de la session (ou à intervalles réguliers si le fil devient long), **mets à jour `SYNTHESE_SESSION.md`** : modules construits, nouvelles décisions, points en attente — pour qu'une session future puisse reprendre sans perte d'information.
