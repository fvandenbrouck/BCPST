# Module "Carnet de terrain" — Séjour au Monêtier-les-Bains

**Document complémentaire** au `CAHIER_DES_CHARGES_SITE_BCPST.md` (à placer dans le même dossier `references/` ou à la racine du dépôt). Il introduit un **quatrième type de module**, distinct du gabarit SVT/PC/Maths, décidé en amont dans la conversation de conception : pas de score, pas de bonne réponse unique, observation guidée + éclairage expert révélé après coup — sur le même principe que la comparaison "carte mentale de l'élève / carte modèle", jamais une correction binaire.

Les deux sites retenus sont les plus proches du Monêtier-les-Bains et les plus directement articulés avec des chapitres déjà construits ou prévus du site :

- **Le Chenaillet** (massif entre Cervières et Montgenèvre, ~30-40 min du Monêtier) → géologie, prolonge le Ch.7 du manuel SVT.
- **Le Jardin du Lautaret** (col du Lautaret, sur la commune du Monêtier-les-Bains même) → botanique alpine, prolonge le Ch.8 et les Ch.12/14 (climat).

---

## 1. Spécification technique

### 1.1 Où ça vit dans l'arborescence

```
/carnet-de-terrain/
├── index.html              # sélecteur de site (Chenaillet / Lautaret), même identité Strates
├── chenaillet.html
├── lautaret.html
/assets/js/carnet-engine.js  # moteur dédié, volontairement séparé de qcm-engine.js (pas de notion de score)
```

### 1.2 Modèle de données

Pas de score ni de tentative : juste une réponse libre horodatée, éventuellement modifiable.

```json
// clé de stockage : carnet:chenaillet  (et carnet:lautaret), personnelle, shared:false
{
  "entries": {
    "chen-01": { "response": "texte libre de l'élève", "revealed": true, "updatedAt": "2026-08-10T09:12:00" },
    "chen-02": { "response": "", "revealed": false, "updatedAt": null }
  }
}
```

Chaque point d'observation (déclaré en dur dans le code, pas dans le storage) a la forme suivante :

```js
{
  id: "chen-03",
  ordre: 3,                       // position sur l'itinéraire, affichage séquentiel façon carnet
  lieu: "Zone intermédiaire de montée, avant le Collet Vert",
  prompt: "…",                    // la consigne d'observation
  eclairage: "…",                 // texte révélé après coup, jamais avant une réponse
  tags: ["SVT-Ch7-U2", "SVT-Ch7-U3"]   // renvoi vers les modules existants, même logique que "notion" en QCM
}
```

### 1.3 Comportement UI

- Affichage séquentiel façon carnet (numéroté, dans l'ordre où on rencontre chaque point sur le terrain réel), pas une liste de questions type QCM.
- Champ de réponse libre (textarea), pas de validation/correction automatique.
- Bouton « 🔍 Éclairage » qui n'apparaît qu'une fois un texte saisi (même logique que le hint QCM : jamais accessible avant d'avoir cherché soi-même).
- Aucune contribution à la jauge en strates de maîtrise (registre différent — observation, pas rappel). Prévoir seulement un indicateur discret « X/N points renseignés » par site, purement informatif, pas une "note".
- **Badges de renvoi** à ajouter sur les pages de cours existantes ou à venir : Ch.7, Ch.8, Ch.12, Ch.14 (et en option Ch.4, cf. tag bonus ci-dessous) affichent un petit encart « 🏔️ Vu sur le terrain — carnet Monêtier-les-Bains » pointant vers l'entrée correspondante. Lien bidirectionnel léger, pas de fusion des gabarits.

### 1.4 Rappel droit d'auteur

Les textes d'éclairage ci-dessous sont rédigés originalement pour ce site à partir de faits géologiques et botaniques publics (noms de lieux, roches, altitudes, missions du jardin), vérifiés via recherche web au moment de la rédaction (sources listées en §4). Aucun texte de site tiers n'est recopié. Ne pas coller telles quelles des descriptions trouvées sur les sites de randonnée ou du jardin — reformuler si le contenu est modifié ou étendu.

---

## 2. Site 1 — Le Chenaillet (2650 m)

**Contexte à afficher en tête du site dans le carnet** (texte court, à adapter si besoin par Claude Code, pas à recopier tel quel d'une source externe — ceci est déjà une reformulation) :

> Le Chenaillet est un sommet des Hautes-Alpes, entre Cervières et Montgenèvre, accessible par un sentier de randonnée familiale (praticable dès 10 ans, sans difficulté technique). Il est célèbre en géologie parce qu'il porte, à plus de 2600 m d'altitude, les vestiges d'un ancien plancher océanique — l'« océan alpin » — vieux d'environ 150 millions d'années. C'est l'un des meilleurs endroits de France pour observer à l'œil nu une ophiolite, l'un des objets d'étude du Ch.7 du manuel.

| id | Lieu / moment | Consigne d'observation | Éclairage (révélé après) | Tags |
|---|---|---|---|---|
| chen-01 | Début de la montée, sur le sentier | Avant même de croiser les premières roches sombres, observe le paysage général et le type de terrain (alpages, éboulis, affleurements). Note la couleur dominante des roches que tu croises au tout début. | Les premiers mètres de la montée traversent souvent des terrains sédimentaires plus classiques. C'est en prenant de l'altitude qu'on entre progressivement dans le massif ophiolitique proprement dit — le contraste que tu vas observer plus haut n'en sera que plus net. | SVT-Ch7-U2 |
| chen-02 | Premiers affleurements sombres et verdâtres | Cherche une roche à la surface lisse, presque savonneuse au toucher, de couleur vert sombre à noirâtre. Décris sa texture avec tes mots. À ton avis, une roche aussi dense et sombre s'est-elle formée en surface ou en profondeur ? | Cette roche est de la **serpentinite** : elle provient de l'altération de péridotite, une roche du manteau terrestre. Sa présence en surface, ici, est déjà une anomalie en soi — le manteau n'affleure normalement jamais à l'air libre. | SVT-Ch7-U2 |
| chen-03 | Zone intermédiaire de la montée | Cherche une roche plus claire, à grain grossier (tu dois pouvoir distinguer des cristaux à l'œil nu), parfois traversée de fines veines. Compare son grain à celui de la serpentinite observée juste avant. | C'est du **gabbro**, une roche magmatique formée par refroidissement lent d'un magma en profondeur — d'où ses gros cristaux visibles. Dans une croûte océanique "normale", le gabbro se situe sous les basaltes de surface et au-dessus du manteau : ici, tu remontes littéralement une coupe de croûte océanique en montant la pente. | SVT-Ch7-U2 |
| chen-04 | Vers le Collet Vert / le sommet | Cherche des roches arrondies, en forme de coussins ou de boules empilées, à la croûte souvent rougeâtre. Essaie d'estimer leur taille (de quelques dizaines de cm à plus d'un mètre). D'après leur forme, dans quel milieu ce magma a-t-il pu refroidir ? | Ce sont des **pillow-lavas** (basaltes en coussins) : la forme arrondie et la croûte vitreuse rapidement figée sont la signature d'un magma refroidi au contact direct de l'eau de mer — la preuve la plus visuelle de l'origine sous-marine de ces roches. La teinte rougeâtre vient de l'oxydation du fer qu'elles contiennent. | SVT-Ch7-U2 |
| chen-05 | Au niveau des pillow-lavas | Observe si tu trouves, entre ou sous les coussins de lave, des roches plus fines, litées, parfois rougeâtres ou verdâtres, très différentes des roches magmatiques précédentes. | S'il y en a, ce sont probablement des **radiolarites** : des sédiments marins issus de l'accumulation de squelettes microscopiques d'organismes planctoniques (radiolaires), déposés lentement sur le plancher océanique. Elles complètent la coupe : manteau → gabbro → basaltes → sédiments marins, soit une coupe quasi complète de lithosphère océanique. | SVT-Ch7-U2, SVT-Ch7-U3 |
| chen-06 | Au sommet ou sur l'arête, table d'orientation | Regarde autour de toi : tu es entouré de sommets alpins, à des centaines de kilomètres de tout océan actuel. Comment expliquer que tu marches sur un ancien plancher océanique, ici, en pleine montagne ? Note ton hypothèse avant de lire l'éclairage. | C'est le phénomène d'**obduction** : lors de la collision qui a formé les Alpes, un morceau de lithosphère océanique a été arraché et charrié sur la croûte continentale au lieu de plonger dans le manteau (subduction). Le Chenaillet est un fragment fossile de cette ancienne mise en place, aujourd'hui soulevé avec le reste de la chaîne alpine. C'est exactement le mécanisme étudié dans l'unité "la mise en place des ophiolites alpines". | SVT-Ch7-U3 |
| chen-07 | En redescendant, sur un fragment de pillow-lava cassé | Observe une roche cassée par l'érosion : la cassure est-elle de la même couleur que la surface extérieure ? | Le contraste entre l'intérieur (souvent plus gris-vert, moins oxydé) et l'extérieur (rougeâtre) montre l'effet du temps : l'altération chimique au contact de l'air et de l'eau, depuis que ces roches sont exposées en surface, transforme progressivement leur composition — un aperçu concret de la notion d'érosion/altération des roches. | SVT-Ch7-U3 |
| chen-08 | Bilan de fin de sortie (à remplir plus tard, au calme) | En une ou deux phrases, résume dans tes mots ce qu'est une ophiolite et pourquoi le Chenaillet en est un bon exemple. Pas besoin d'être exhaustif : le but est de reformuler avec tes propres mots. | Pas d'éclairage "modèle" ici — c'est volontaire : cette dernière étape sert à toi de vérifier, seul, ce que tu as retenu. Tu peux comparer ta formulation avec le cours du Ch.7 une fois de retour. | SVT-Ch7-U2, SVT-Ch7-U3 |

---

## 3. Site 2 — Jardin du Lautaret (2100 m)

**Contexte à afficher en tête du site dans le carnet** :

> Le Jardin du Lautaret est un jardin botanique alpin de l'Université Grenoble Alpes et du CNRS, situé au col du Lautaret (2100 m), sur la commune du Monêtier-les-Bains, face aux glaciers de la Meije. Il rassemble près de 2000 espèces de plantes de montagne du monde entier, organisées par grandes régions (Himalaya, Andes, Caucase, Nouvelle-Zélande…), et sert aussi de station de recherche sur les effets du changement climatique en altitude. Ouvert en général de début juin à début septembre ; en dehors de ces dates, plusieurs observations restent possibles dans la flore naturelle du col lui-même.

| id | Lieu / moment | Consigne d'observation | Éclairage (révélé après) | Tags |
|---|---|---|---|---|
| laut-01 | Entrée du jardin, vue d'ensemble | Le jardin regroupe des plantes venues de massifs très différents (Alpes, Himalaya, Andes, Nouvelle-Zélande…) qui n'ont souvent aucun lien de parenté directe. Repère deux espèces de régions différentes qui te semblent pourtant se ressembler beaucoup dans leur forme générale. | C'est un exemple de **convergence évolutive** : des espèces sans lien de parenté proche, confrontées aux mêmes contraintes (froid, vent, altitude, saison de croissance très courte), développent indépendamment des formes similaires. C'est un bon contre-exemple à garder en tête pour la diversification du vivant : la ressemblance de forme ne signifie pas toujours une proche parenté. | SVT-Ch4 |
| laut-02 | Devant une plante en coussin compact | Cherche une plante formant un coussin dense et arrondi, presque comme une pierre couverte de mousse, avec des tiges très courtes et serrées. Touche-la (sans l'arracher) : que remarques-tu sur sa compacité ? | Cette forme "en coussin" limite la surface exposée au vent et au froid et crée un microclimat plus chaud et plus humide au cœur de la touffe, où la plante concentre son énergie de croissance sur un volume minimal. C'est une adaptation directe aux contraintes de l'étage alpin. | SVT-Ch8-U1 |
| laut-03 | Devant une plante à feuillage duveteux ou laineux | Trouve une plante dont les feuilles ou les tiges sont recouvertes d'un fin duvet blanchâtre (l'edelweiss en est l'exemple le plus connu, mais il y en a d'autres dans le jardin). À quoi ce duvet pourrait-il servir, à cette altitude ? | Ce duvet réfléchit une partie du rayonnement UV, souvent intense en altitude, et limite la perte d'eau par le vent tout en piégeant une fine couche d'air isolante contre le froid — plusieurs fonctions pour une seule adaptation morphologique. | SVT-Ch8-U1 |
| laut-04 | N'importe où dans le jardin, en comparant plusieurs espèces | Compare la taille des fleurs à la taille globale de plusieurs plantes basses que tu croises. Que remarques-tu sur la proportion fleur/plante ? | Beaucoup de plantes alpines investissent une part disproportionnée de leur énergie dans des fleurs grandes et colorées malgré une taille globale réduite : la saison de reproduction est très courte en altitude, et il faut attirer efficacement les rares pollinisateurs disponibles pendant cette fenêtre. | SVT-Ch8-U1 |
| laut-05 | Panneau d'information sur la recherche du jardin (s'il y en a un accessible) | Cherche une information sur ce que les chercheurs du jardin étudient concrètement (dates de floraison, migration d'espèces, effets du changement climatique…). Note ce que tu trouves. | Le Jardin du Lautaret héberge une station de recherche qui suit depuis des décennies des indicateurs comme la date de floraison ou la remontée en altitude de certaines espèces — des données directement utilisées pour documenter le changement climatique actuel en milieu de montagne, exactement le sujet du Ch.14. | SVT-Ch14 |
| laut-06 | Vue sur les glaciers de la Meije (si visible depuis le jardin) | Observe l'étendue de glace visible et, si tu peux comparer avec une photo ancienne trouvée sur place ou avec tes souvenirs d'un précédent passage, note ce qui te semble avoir changé. | Les glaciers alpins comme ceux de la Meije sont parmi les indicateurs les plus visibles du réchauffement récent : leur recul rapide depuis la fin du Petit Âge Glaciaire (XIXe siècle) illustre concrètement l'échelle de temps très courte du changement climatique actuel, à mettre en regard des variations climatiques bien plus lentes étudiées pour les époques géologiques passées. | SVT-Ch12, SVT-Ch14 |
| laut-07 | En sortant du jardin, sur les pentes naturelles alentour | En marchant sur le col, observe si la végétation change avec l'altitude ou l'exposition (versant au soleil / versant à l'ombre) sur une courte distance. | Cette zonation sur quelques dizaines de mètres de dénivelé illustre à petite échelle un principe général : la végétation de montagne est extrêmement sensible à des variations fines de température et d'ensoleillement, ce qui en fait un système d'alerte précoce très étudié pour le suivi du climat. | SVT-Ch8-U1, SVT-Ch14 |
| laut-08 | Bilan géologie/flore (pont entre les deux carnets) | Le jardin se situe à la rencontre de deux massifs très différents : les Écrins (roches cristallines) au sud et le Galibier (roches sédimentaires) au nord. Si tu as aussi fait le carnet du Chenaillet, cherche si tu observes une différence de couleur ou de texture du sol/des roches entre les deux côtés du col. | La diversité géologique locale contribue directement à la diversité floristique : un sol issu de roches cristallines et un sol issu de roches sédimentaires n'offrent pas les mêmes nutriments ni le même pH, ce qui favorise des cortèges de plantes différents. C'est un rappel utile que la biologie végétale et la géologie, souvent enseignées séparément, s'expliquent mutuellement sur le terrain — l'esprit même de la démarche BCPST. | SVT-Ch7, SVT-Ch8-U1 |
| laut-09 | Bilan de fin de visite (à remplir plus tard, au calme) | En une ou deux phrases, résume dans tes mots pourquoi les plantes alpines ont des formes si particulières comparées aux plantes de plaine. | Pas d'éclairage "modèle" ici, volontairement — même logique que pour le Chenaillet : reformule seul, puis compare avec le cours du Ch.8 une fois de retour. | SVT-Ch8-U1 |

---

## 4. Sources consultées pour la vérification factuelle (ne pas citer sur le site public, usage interne)

- Sentier géologique du Chenaillet — Office de tourisme de Montgenèvre.
- « Le massif du Chenaillet : une ancienne croûte océanique » — actugeologique.fr.
- Compte-rendu de sortie géologique au Chenaillet — Lycée Paul Héroult.
- Fiche pédagogique « Le Chenaillet, un objet géologique » — Académie de Lyon (SVT).
- Randonnée géologique au Chenaillet — Bureau des Guides de Serre Chevalier.
- Article Wikipédia « Mont Chenaillet ».
- Jardin du Lautaret — site officiel (jardindulautaret.com) et fiche OSUG (Observatoire des Sciences de l'Univers de Grenoble).
- Article Wikipédia « Jardin botanique alpin du Lautaret ».

---

## 5. Ce qu'il reste à trancher / à faire pour Claude Code

1. Vérifier l'itinéraire précis effectivement suivi par la famille (départ Cervières ou Montgenèvre pour le Chenaillet) et ajuster l'ordre des points chen-01 à chen-08 si nécessaire — l'ordre proposé suppose une montée progressive classique, mais peut être réordonné sans changer le contenu.
2. Vérifier les horaires d'ouverture du Jardin du Lautaret au moment du séjour (fermé hors saison estivale) ; si fermé, les points laut-02 à laut-04 et laut-07 restent utilisables sur la flore naturelle du col, laut-05 et une partie de laut-06 supposent l'accès au jardin ou à ses panneaux.
3. Implémenter `carnet-engine.js` en réutilisant `storage.js` déjà prévu pour les autres matières (même wrapper, nouvelle clé de stockage).
4. Ajouter les badges de renvoi sur les modules Ch.7, Ch.8, Ch.12, Ch.14 (et Ch.4 en option) une fois ces modules construits ou lors de leur prochaine mise à jour.
