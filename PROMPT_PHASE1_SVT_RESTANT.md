# Prompt — Poursuivre le site Strates (Phase 1 SVT)

> Prompt prêt à coller tel quel en tout début d'une nouvelle session Claude Code, dans le dépôt `/Users/francoisvandenbrouck/Documents/FV/perso/alix/OnBoardingBCPST`.

---

Tu travailles sur **Strates**, un site de révisions BCPST1 statique (HTML/CSS/JS vanilla, sans framework ni build) pour une élève qui entre en BCPST1 sans avoir suivi la spécialité SVT en Terminale. Le dépôt est `/Users/francoisvandenbrouck/Documents/FV/perso/alix/OnBoardingBCPST`, poussé sur `https://github.com/fvandenbrouck/BCPST` (public) et déployé en continu sur `https://fvandenbrouck.github.io/BCPST/` (GitHub Pages actif, se redéploie automatiquement à chaque push sur `main`).

**Avant toute chose, lis dans cet ordre** :
1. **[`SYNTHESE_SESSION.md`](SYNTHESE_SESSION.md), en entier, en commençant par son §0** ("État actuel en un coup d'œil"). C'est la source de vérité la plus à jour : état du dépôt, décisions prises en session, conventions techniques, ce qui reste à faire. Ne pas se fier à ce prompt-ci pour ces détails s'ils divergent de `SYNTHESE_SESSION.md` — ce fichier est mis à jour à chaque session, pas forcément ce prompt.
2. [`CAHIER_DES_CHARGES.md`](CAHIER_DES_CHARGES.md) §0 (principes non négociables), §2 (plan de construction SVT), §6 (identité visuelle) — le brief initial complet, stable, jamais modifié.
3. **[`svt/ch17-cellule-musculaire-atp.html`](svt/ch17-cellule-musculaire-atp.html)** — le module SVT le plus récent, à utiliser comme gabarit de référence exact (structure des données, ton, niveau de détail, boilerplate KaTeX en tête de fichier). C'est l'exemple le plus complet et le plus à jour des conventions accumulées au fil des modules précédents.

## Objectif de cette session

Continuer à construire les modules SVT restants de la Phase 1, **un par un**, dans l'ordre indiqué au §4 de `SYNTHESE_SESSION.md`, en testant et en committant chaque module avant de passer au suivant. Au moment de la rédaction de ce prompt, **7 modules sur 13 sont faits** (Ch.5, Ch.6, Ch.7, Ch.8, Ch.9, Ch.11, Ch.17) ; le prochain est **Ch.18 — Contrôle des flux de glucose (p.450-473)**, dernier chapitre du thème "corps humain et santé" cité par les recommandations. Vérifier ce constat dans `SYNTHESE_SESSION.md` §0/§4 avant de commencer, au cas où il aurait changé depuis.

Ne pas commencer la Physique-Chimie ni les Mathématiques (Phases 2/3) sauf demande explicite de l'utilisateur — ce prompt couvre la suite de la Phase 1 SVT.

## Méthode de travail (identique à chaque module déjà construit)

1. Rédiger le contenu du chapitre (cours en 4 unités, 10-12 flashcards, 15-20 QCM, carte mentale modèle, bridge Première→Terminale→BCPST1) en respectant exactement le contrat de données et les conventions déjà en place — copier la structure d'un module existant (`ch17` recommandé) plutôt que la réinventer.
2. Choisir 1 à 3 illustrations *seulement si elles apportent une vraie plus-value* : photo réelle sous licence CC (Wikimedia Commons, avec `credit`) pour un objet concret, ou schéma SVG original (`assets/img/chXX/*.svg`) pour un scénario abstrait/fictif — **vérifier visuellement le rendu du SVG avant de l'intégrer** (chevauchements de texte déjà rencontrés plusieurs fois ; prévoir un espacement vertical généreux entre chaque bloc de labels).
3. Ajouter l'entrée du module dans `assets/js/modules-registry.js` (`status:'available'`, `href` renseigné).
4. Tester dans le navigateur : les 4 onglets s'affichent, aucune erreur console, le QCM se score correctement (répondre "juste" à toutes les questions doit donner 100%), puis vider `localStorage` (données de test) avant de committer.
5. Committer et pousser, puis **vérifier que le déploiement GitHub Pages a réussi avant de répondre à l'utilisateur** (méthode exacte donnée dans `SYNTHESE_SESSION.md` §7 — boucle `until` sur `gh api .../pages/builds/latest` lancée en arrière-plan). Ne jamais se contenter du push local : l'utilisateur a déjà signalé une fois "ne rien voir" alors que c'était juste un cache navigateur — la vérification du build évite de perdre du temps sur ce genre de fausse alerte.
6. Mettre à jour `SYNTHESE_SESSION.md` (§4 avancement, §7 état du dépôt, et une nouvelle décision numérotée en §2 si quelque chose de nouveau a été tranché).

## Rappels non négociables (détaillés dans `SYNTHESE_SESSION.md` §6)

- Jamais de texte recopié du manuel Belin Éducation ni d'aucune source protégée — renvois de page en index uniquement.
- Ton toujours encourageant dans les diagnostics QCM, jamais culpabilisant.
- Carte mentale : jamais de modèle pré-rempli affiché par défaut.
- QCM : ne pas se soucier de la position de la bonne réponse dans les données — le moteur mélange l'affichage automatiquement.
- Formules mathématiques : toujours en LaTeX (`$...$`), jamais en texte brut — inclure le boilerplate KaTeX en tête de chaque nouveau fichier de module (voir `ch17` pour l'exemple exact).
- `references/` ne doit jamais être poussé sur GitHub (gitignoré).

## Points en attente, non bloquants (détail au §5 de `SYNTHESE_SESSION.md`)

Deux questions factuelles sur le carnet de terrain restent ouvertes (itinéraire précis du Chenaillet, horaires d'ouverture du Jardin du Lautaret) — à poser à l'utilisateur si l'occasion se présente, mais elles ne bloquent en rien la construction des modules SVT restants.
