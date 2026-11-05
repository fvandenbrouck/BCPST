/*
 * Diagnostics de sortie D1 à D6 : un diagnostic indépendant après chaque
 * activité, portant sur des molécules/situations différentes de celles
 * utilisées pendant l'activité correspondante (transfert des apprentissages,
 * pas restitution). Les indices disponibles diminuent progressivement de D1 à
 * D6 (cf. tableau de progression cognitive du cahier des charges).
 *
 * window.RMN_DIAGNOSTICS_SORTIE = { D1: {activite:'A1', questions:[...]}, ... }
 */
window.RMN_DIAGNOSTICS_SORTIE = {

  D1: {
    activite: 'A1', titre: "Diagnostic D1 — après l'activité 1", competences: ['C1', 'C2'],
    questions: [
      { id: 'd1-1', competences: ['C1'], difficulte: 1, type: 'single',
        enonce: "Combien de signaux attend-on sur le spectre RMN ¹H du butan-2-one CH₃–CO–CH₂–CH₃ ?",
        figureMol: 'butan2one-plain',
        options: ["3 signaux", "4 signaux", "2 signaux"], correct: 0,
        indices: ["Les deux CH₃ de cette molécule sont-ils dans le même environnement ?"],
        explication: "Les deux CH₃ ne sont PAS équivalents (l'un lié au carbonyle, l'autre à un CH₂) : 3 groupes distincts (CH₃, CH₂, CH₃) → 3 signaux." },
      { id: 'd1-2', competences: ['C1'], difficulte: 2, type: 'multi',
        enonce: "À propos du propane CH₃–CH₂–CH₃, quelles affirmations sont correctes ? (plusieurs réponses)",
        options: ["La molécule présente 2 groupes de protons équivalents", "Les deux CH₃ terminaux sont équivalents entre eux", "Le CH₂ a le même environnement chimique que les CH₃", "Le spectre comporte 3 signaux distincts"],
        correct: [0, 1],
        indices: ["Un groupe CH₂ central, encadré symétriquement par deux CH₃ identiques, est-il dans le même environnement que ces CH₃ ?"],
        explication: "Le propane a 2 groupes équivalents : les deux CH₃ terminaux (équivalents par symétrie) et le CH₂ central (environnement différent) → 2 signaux, pas 3." },
      { id: 'd1-3', competences: ['C2'], difficulte: 2, type: 'numeric',
        enonce: "L'éthanol (6 H au total) donne un spectre à 3 signaux d'aires mesurées 30, 20 et 10. Combien de protons sont responsables du signal d'aire 20 ?",
        unite: "protons", reponse: 2, tolerance: { type: 'abs', value: 0 },
        indices: ["Facteur d'échelle = 6/(30+20+10)."],
        explication: "Facteur = 6/60 = 0,1. Le signal d'aire 20 correspond à 20×0,1 = 2 protons (CH₂)." },
      { id: 'd1-4', competences: ['C2'], difficulte: 2, type: 'single',
        enonce: "Sur un spectre, un triplet présente des raies hautes et fines ; juste à côté, un singulet présente une seule raie plus large et plus basse, mais de même aire totale que le triplet. Lequel des deux signaux correspond au plus grand nombre de protons ?",
        options: ["Impossible à dire à partir des hauteurs : il faut comparer les aires, qui peuvent être égales malgré des hauteurs très différentes", "Le triplet, car ses raies sont hautes", "Le singulet, car sa raie est large"], correct: 0,
        indices: [],
        explication: "La hauteur d'une raie ne renseigne pas directement sur l'intégration : seule l'aire totale du signal (triplet : somme de 3 raies ; singulet : une seule raie) donne le nombre de protons." },
      { id: 'd1-5', competences: ['C1', 'C2'], difficulte: 2, type: 'single',
        enonce: "Le bromoéthane CH₃–CH₂–Br (5 H au total) donne 2 signaux. Quel rapport d'intégration CH₃ : CH₂ attend-on ?",
        figureMol: 'bromoethane-plain',
        options: ["3 : 2", "2 : 3", "1 : 1"], correct: 0,
        indices: [],
        explication: "Le CH₃ porte 3 protons, le CH₂ en porte 2 : le rapport des intégrations est donc 3:2." }
    ]
  },

  D2: {
    activite: 'A2', titre: "Diagnostic D2 — après l'activité 2", competences: ['C3'],
    questions: [
      { id: 'd2-1', competences: ['C3'], difficulte: 1, type: 'numeric',
        enonce: "D'après la table du cours, à partir de quelle valeur de δ (borne inférieure, en ppm) la zone des protons aldéhydiques commence-t-elle ?",
        unite: "ppm", reponse: 9.0, tolerance: { type: 'abs', value: 0.3 },
        indices: ["Reviens à la page Cours si besoin."],
        explication: "La zone des protons aldéhydiques (–CHO) est indiquée entre 9,0 et 10,0 ppm." },
      { id: 'd2-2', competences: ['C3'], difficulte: 2, type: 'single',
        enonce: "Dans le bromoéthane, quel groupe est le plus déblindé : le CH₃ ou le CH₂ ?",
        figureMol: 'bromoethane-plain',
        options: ["Le CH₂, directement lié à l'atome de brome électronégatif", "Le CH₃, plus riche en hydrogènes", "Les deux groupes ont le même δ"], correct: 0,
        indices: ["Lequel des deux groupes est le plus proche de l'atome électronégatif ?"],
        explication: "Le CH₂, directement lié au brome, est beaucoup plus déblindé (δ≈3,4 ppm) que le CH₃ (δ≈1,7 ppm), plus éloigné de l'halogène." },
      { id: 'd2-3', competences: ['C3'], difficulte: 2, type: 'single',
        enonce: "Un signal apparaît en singulet à δ=9,8 ppm, intégrant pour 1H. Quel environnement est le plus probable ?",
        options: ["Un proton aldéhydique (–CHO)", "Un proton aromatique", "Un proton aliphatique isolé"], correct: 0,
        indices: [],
        explication: "La zone 9,0-10,0 ppm, pour un signal de 1H, est caractéristique d'un proton aldéhydique." },
      { id: 'd2-4', competences: ['C3'], difficulte: 2, type: 'single',
        enonce: "Un signal à 4,12 ppm se présente sous forme de quadruplet (2H). Quel groupe est le plus probable ?",
        options: ["Un O–CH₂ d'un ester", "Un CH₃ aromatique", "Un CH₂ aliphatique isolé, loin de tout groupe électroattracteur"], correct: 0,
        indices: [],
        explication: "Le δ élevé (zone 3,3-4,5 ppm) et l'intégration (2H) orientent vers un CH₂ lié à l'oxygène, cohérent avec un O–CH₂ d'ester ; un CH₂ aliphatique isolé serait attendu bien en-dessous de 2 ppm." },
      { id: 'd2-5', competences: ['C3'], difficulte: 3, type: 'single',
        enonce: "Dans le propan-1-ol CH₃–CH₂–CH₂–OH, lequel des deux groupes CH₂ est le plus déblindé : le CH₂ central ou le CH₂–OH ?",
        figureMol: 'propan1ol-plain',
        options: ["Le CH₂–OH, directement lié à l'oxygène", "Le CH₂ central, plus proche du CH₃", "Les deux CH₂ ont rigoureusement le même δ"], correct: 0,
        indices: [],
        explication: "Le CH₂–OH, directement lié à l'oxygène électronégatif, est nettement plus déblindé (δ≈3,57 ppm) que le CH₂ central, plus éloigné de l'oxygène (δ≈1,57 ppm)." }
    ]
  },

  D3: {
    activite: 'A3', titre: "Diagnostic D3 — après l'activité 3", competences: ['C4'],
    questions: [
      { id: 'd3-1', competences: ['C4'], difficulte: 2, type: 'single',
        enonce: "Dans le propan-2-ol (CH₃)₂CH–OH, quelle multiplicité attend-on pour le signal des deux CH₃ (équivalents) ?",
        figureMol: 'propan2ol-plain',
        options: ["Un doublet", "Un triplet", "Un septuplet"], correct: 0,
        indices: ["Les deux CH₃ n'ont qu'un seul voisin porteur de H : lequel ?"],
        explication: "Les deux CH₃ ont pour unique voisin le CH (1H) : n=1, donc n+1=2 raies, un doublet." },
      { id: 'd3-2', competences: ['C4'], difficulte: 2, type: 'single',
        enonce: "Toujours dans le propan-2-ol, quelle multiplicité attend-on pour le CH ?",
        figureMol: 'propan2ol-plain',
        options: ["Un septuplet", "Un doublet", "Un quadruplet"], correct: 0,
        indices: ["Le CH est voisin des deux CH₃, équivalents entre eux : combien de protons cela représente-t-il au total ?"],
        explication: "Le CH est voisin de 6 protons équivalents (les deux CH₃) : n=6, donc n+1=7 raies, un septuplet." },
      { id: 'd3-3', competences: ['C4'], difficulte: 2, type: 'numeric',
        enonce: "Un signal possède 4 voisins non équivalents entre eux partageant tous la même constante de couplage J. Combien de raies ce signal comporte-t-il ?",
        unite: "raies", reponse: 5, tolerance: { type: 'abs', value: 0 },
        indices: [],
        explication: "n+1 = 4+1 = 5 raies (un quintuplet)." },
      { id: 'd3-4', competences: ['C4'], difficulte: 2, type: 'single',
        enonce: "Dans le bromoéthane CH₃–CH₂–Br, quelles sont les multiplicités respectives attendues pour le CH₃ et pour le CH₂ ?",
        figureMol: 'bromoethane-plain',
        options: ["Triplet pour CH₃, quadruplet pour CH₂", "Quadruplet pour CH₃, triplet pour CH₂", "Singulet pour CH₃, triplet pour CH₂"], correct: 0,
        indices: [],
        explication: "Le CH₃ (3H) est voisin du CH₂ (2H, n=2) : triplet. Le CH₂ (2H) est voisin du CH₃ (3H, n=3) : quadruplet." },
      { id: 'd3-5', competences: ['C4'], difficulte: 3, type: 'single',
        enonce: "Pour le quadruplet du CH₂ du bromoéthane, quels protons sont responsables de son intégration (2H), et lesquels de sa multiplicité (4 raies) ?",
        figureMol: 'bromoethane-plain',
        options: ["Les 2H du CH₂ lui-même pour l'intégration ; les 3H du CH₃ voisin pour la multiplicité", "Les 3H du CH₃ pour l'intégration ; les 2H du CH₂ pour la multiplicité", "Les mêmes protons pour les deux aspects"], correct: 0,
        indices: [],
        explication: "L'intégration provient toujours des protons DU signal (ici les 2H du CH₂) ; la multiplicité provient des protons VOISINS non équivalents (ici les 3H du CH₃)." }
    ]
  },

  D4: {
    activite: 'A4', titre: "Diagnostic D4 — après l'activité 4", competences: ['C5', 'C4'],
    questions: [
      { id: 'd4-1', competences: ['C5'], difficulte: 3, type: 'single',
        enonce: "Dans le 1-bromopropane CH₃–CH₂–CH₂–Br, quels sont les deux groupes de voisins non équivalents entre eux du CH₂ central ?",
        options: ["Le CH₃ (3H) et le CH₂–Br (2H)", "Le CH₃ (3H) et le Br seul", "Uniquement le CH₂–Br (2H)"], correct: 0,
        indices: [],
        explication: "Le CH₂ central est encadré par le CH₃ (3H) et le CH₂–Br (2H), deux groupes distincts non équivalents entre eux." },
      { id: 'd4-2', competences: ['C5'], difficulte: 3, type: 'numeric',
        enonce: "Un proton est couplé à un groupe de 1H (J₁) et à un groupe de 1H (J₂), avec J₁ très différente de J₂ (aucune superposition). Combien de raies comporte le massif observé ?",
        unite: "raies", reponse: 4, tolerance: { type: 'abs', value: 0 },
        indices: [],
        explication: "Sans superposition : (1+1)×(1+1) = 2×2 = 4 raies (un « doublet de doublets »)." },
      { id: 'd4-3', competences: ['C5'], difficulte: 3, type: 'single',
        enonce: "Le CH₂ central du propan-1-ol, voisin d'un CH₃ (3H, J≈7,0 Hz) et d'un CH₂–OH (2H, J≈7,0 Hz), apparaît comme un massif à 6 raies ressemblant à un sextuplet. Pourquoi, en toute rigueur, ne s'agit-il pas d'une simple application de n+1 ?",
        options: ["Parce que ce sont deux groupes de voisins distincts (non équivalents entre eux) : le sextuplet apparent résulte d'une coïncidence due à J₁≈J₂, pas d'un unique groupe de 5 voisins équivalents", "Parce que la règle n+1 ne s'applique jamais aux CH₂", "Parce qu'il y a en réalité 7 voisins et non 5"], correct: 0,
        indices: [],
        explication: "n+1 suppose un UNIQUE groupe de voisins équivalents. Ici, il y a deux groupes distincts (3H et 2H) dont les constantes de couplage sont proches : le massif à 6 raies est une coïncidence de superposition, pas une application directe de n+1." },
      { id: 'd4-4', competences: ['C4', 'C5'], difficulte: 2, type: 'single',
        enonce: "Si deux constantes J₁ et J₂ sont rigoureusement égales, combien de raies distinctes observe-t-on pour un couplage avec un groupe de 2H (J₁) et un groupe de 1H (J₂) ?",
        options: ["4 raies (comme pour un groupe unique de 3 voisins équivalents, n+1=4)", "6 raies (3×2, aucune superposition)", "1 seule raie (les couplages s'annulent)"], correct: 0,
        indices: [],
        explication: "Avec J₁=J₂, tout se passe comme pour un groupe unique de 2+1=3 voisins équivalents : n+1 = 4 raies, dans un rapport 1:3:3:1." },
      { id: 'd4-5', competences: ['C5'], difficulte: 3, type: 'numeric',
        enonce: "Un groupe de protons est couplé à deux ensembles de voisins non équivalents, chacun de 2H, avec des constantes J nettement différentes (aucune superposition). Combien de raies au maximum ce massif comporte-t-il ?",
        unite: "raies", reponse: 9, tolerance: { type: 'abs', value: 0 },
        indices: [],
        explication: "(2+1)×(2+1) = 3×3 = 9 raies au maximum, sans aucune superposition." }
    ]
  },

  D5: {
    activite: 'A5', titre: "Diagnostic D5 — après l'activité 5", competences: ['C6'],
    spectreId: 'butan2one',
    questions: [
      { id: 'd5-1', competences: ['C6'], difficulte: 2, type: 'single',
        enonce: "Sur le spectre du butan-2-one, un singulet à 2,12 ppm intègre pour 3H. À quel groupe l'attribuer ?",
        options: ["Le CH₃ lié au carbonyle", "Le CH₂", "Le CH₃ de l'éthyle"], correct: 0,
        indices: [],
        explication: "Un singulet signale l'absence de voisin porteur de H : seul le CH₃ directement lié au carbonyle est dans ce cas." },
      { id: 'd5-2', competences: ['C6'], difficulte: 2, type: 'single',
        enonce: "Un quadruplet à 2,45 ppm intègre pour 2H. À quel groupe l'attribuer ?",
        options: ["Le CH₂, couplé au CH₃ de l'éthyle voisin", "Le CH₃ lié au carbonyle", "Le CH₃ de l'éthyle"], correct: 0,
        indices: [],
        explication: "Le CH₂ (2H), voisin du CH₃ de l'éthyle (3H), apparaît en quadruplet, à un δ modéré car il n'est pas directement lié à un hétéroatome." },
      { id: 'd5-3', competences: ['C6'], difficulte: 3, type: 'single',
        enonce: "Un triplet à 1,05 ppm intègre pour 3H. Comment confirmer qu'il est bien couplé au quadruplet à 2,45 ppm ?",
        options: ["Leurs constantes de couplage J doivent être égales", "Leurs δ doivent être proches", "Leurs intégrations doivent être identiques"], correct: 0,
        indices: [],
        explication: "Deux signaux mutuellement couplés partagent la même constante J, critère plus fiable qu'une simple proximité de δ ou une égalité d'intégration." },
      { id: 'd5-4', competences: ['C6'], difficulte: 2, type: 'single',
        enonce: "La somme des intégrations relevées (3H+2H+3H=8H) est-elle cohérente avec la formule brute C₄H₈O du butan-2-one ?",
        options: ["Oui, cohérente", "Non, il manque des protons", "Non, il y a trop de protons"], correct: 0,
        indices: [],
        explication: "C₄H₈O comporte 8 atomes d'hydrogène : l'attribution est cohérente." },
      { id: 'd5-5', competences: ['C6'], difficulte: 3, type: 'single',
        enonce: "Le CH₃ lié au carbonyle du butan-2-one (2,12 ppm) a un δ très proche de celui du CH₃ acétyle de l'éthanoate d'éthyle (2,04 ppm, vu en activité 5). Comment expliquer cette proximité ?",
        options: ["Les deux CH₃ partagent le même type d'environnement chimique : directement liés à un groupe carbonyle", "C'est une coïncidence sans lien avec la structure", "Les deux molécules ont la même formule brute"], correct: 0,
        indices: [],
        explication: "Le déplacement chimique dépend avant tout du type d'environnement local : un CH₃ directement lié à un carbonyle a un δ caractéristique voisin, que la molécule soit une cétone ou un ester." }
    ]
  },

  D6: {
    activite: 'A6', titre: "Diagnostic final D6 — synthèse", competences: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'],
    questions: [
      { id: 'd6-1', competences: ['C6', 'C7'], difficulte: 4, type: 'single',
        enonce: "Deux structures candidates, l'éthanoate d'éthyle (ester) et le butan-2-one (cétone), donnent toutes deux un spectre RMN avec un singulet 3H, un quadruplet 2H et un triplet 3H couplé au quadruplet. Quelle observation RMN permet, à elle seule, de les distinguer ?",
        options: [
          "Le déplacement chimique du quadruplet : ≈4,1 ppm s'il est lié à l'oxygène de l'ester, ≈2,4 ppm s'il est lié directement au carbonyle de la cétone",
          "L'intégration du quadruplet, différente dans les deux cas",
          "Il est impossible de les distinguer sans spectre infrarouge"
        ], correct: 0,
        indices: [],
        explication: "Dans l'ester, le CH₂ est lié à l'oxygène (δ≈4,1 ppm) ; dans la cétone, le CH₂ est lié directement au carbone du carbonyle (δ≈2,4 ppm) : l'intégration est la même (2H) dans les deux cas, mais le δ diffère nettement." },
      { id: 'd6-2', competences: ['C7'], difficulte: 4, type: 'single',
        enonce: "Un spectre infrarouge révèle une bande d'absorption C=O à 1740 cm⁻¹ (plutôt que vers 1715 cm⁻¹). Quelle structure est la plus cohérente avec cette observation ?",
        options: ["Un ester (bande C=O typiquement plus élevée qu'une cétone)", "Une cétone (bande C=O typiquement plus élevée qu'un ester)", "Cette information ne permet aucune distinction"], correct: 0,
        indices: [],
        explication: "Les esters absorbent typiquement un peu plus haut en nombre d'onde (≈1735-1750 cm⁻¹) que les cétones (≈1705-1725 cm⁻¹), en cohérence avec la structure électronique du groupe C=O dans chaque famille." },
      { id: 'd6-3', competences: ['C1', 'C3', 'C6', 'C7'], difficulte: 4, type: 'single',
        enonce: "Un spectre inconnu de formule C₃H₈O présente 3 signaux dont un singulet large sans couplage visible, un massif complexe (2H), et un triplet (2H) nettement déblindé (δ>3,5 ppm). Parmi le propan-1-ol, le propan-2-ol et le méthoxyéthane, laquelle est compatible ?",
        options: ["Le propan-1-ol", "Le propan-2-ol", "Le méthoxyéthane"], correct: 0,
        indices: [],
        explication: "La présence d'un signal échangeable élimine le méthoxyéthane (éther, sans OH). Le propan-2-ol ne présente pas de triplet 2H déblindé (il a un septuplet 1H et un doublet 6H). Seul le propan-1-ol présente ce profil : CH₃ (triplet), CH₂ central (massif), CH₂–OH (triplet déblindé), OH (singulet large)." },
      { id: 'd6-4', competences: ['C5'], difficulte: 4, type: 'numeric',
        enonce: "Un groupe de protons est couplé à un ensemble de 2H (J₁) et un ensemble de 2H (J₂), avec J₁ clairement différente de J₂. Combien de raies au maximum ce massif comporte-t-il, en l'absence de toute superposition ?",
        unite: "raies", reponse: 9, tolerance: { type: 'abs', value: 0 },
        indices: [],
        explication: "(2+1)×(2+1) = 9 raies au maximum." },
      { id: 'd6-5', competences: ['C7'], difficulte: 4, type: 'single',
        enonce: "Pourquoi est-il nécessaire de croiser systématiquement le déplacement chimique, l'intégration, la multiplicité et, si besoin, l'infrarouge pour identifier une molécule inconnue, plutôt que de se fier à une seule de ces informations ?",
        options: [
          "Parce que chaque information, prise seule, est compatible avec de nombreuses structures différentes : seul leur recoupement réduit suffisamment les possibilités pour conclure de façon fiable",
          "Parce que le déplacement chimique seul suffit toujours, les autres informations ne servent qu'à vérifier",
          "Parce que la réglementation scientifique impose d'utiliser au moins quatre critères"
        ], correct: 0,
        indices: [],
        explication: "C'est le principe même de l'attribution spectrale : aucune information prise isolément (un δ, une intégration, une multiplicité) n'est suffisante, car elle est partagée par de nombreuses structures possibles. C'est leur recoupement systématique qui permet une identification fiable." }
    ]
  }
};

/*
 * Banque de remédiation : une ou deux questions alternatives par compétence,
 * utilisées lorsque la compétence est jugée fragile après un diagnostic,
 * avant une nouvelle évaluation (jamais la même question que le diagnostic
 * initial).
 */
window.RMN_REMEDIATION = {
  C1: [
    { id: 'rem-c1-1', type: 'single',
      enonce: "Le méthoxyéthane CH₃–O–CH₂–CH₃ possède 8 H. Combien de signaux attend-on ?",
      figureMol: 'methoxyethane-plain',
      options: ["3 signaux", "2 signaux", "8 signaux"], correct: 0,
      explication: "Trois groupes distincts : OCH₃, OCH₂, CH₃ (aucun n'est équivalent à un autre) → 3 signaux." }
  ],
  C2: [
    { id: 'rem-c2-1', type: 'numeric',
      enonce: "Un spectre à 2 signaux d'aires 40 et 60 correspond à une molécule de 10 H au total. Combien de protons pour le signal d'aire 40 ?",
      unite: "protons", reponse: 4, tolerance: { type: 'abs', value: 0 },
      explication: "Facteur = 10/100 = 0,1 ; 40×0,1 = 4 protons." }
  ],
  C3: [
    { id: 'rem-c3-1', type: 'single',
      enonce: "Un signal apparaît à δ=0,9 ppm. Quel environnement est le plus probable ?",
      options: ["Un CH₃ aliphatique, loin de tout groupe électroattracteur", "Un proton aromatique", "Un proton d'alcool (OH)"], correct: 0,
      explication: "La zone 0,8-1,8 ppm est celle des protons aliphatiques simples." }
  ],
  C4: [
    { id: 'rem-c4-1', type: 'single',
      enonce: "Un signal comporte 3 raies (triplet). Combien de protons voisins non équivalents cela indique-t-il ?",
      options: ["2 protons voisins", "3 protons voisins", "1 proton voisin"], correct: 0,
      explication: "n+1=3 donne n=2." }
  ],
  C5: [
    { id: 'rem-c5-1', type: 'single',
      enonce: "Pourquoi un groupe de protons voisin de deux groupes non équivalents entre eux ne suit-il pas automatiquement la règle n+1 simple ?",
      options: ["Car il faut composer deux dédoublements avec des constantes J a priori différentes", "Car la règle n+1 ne s'applique jamais à plus d'un voisin", "Car ces protons ne couplent jamais entre eux"], correct: 0,
      explication: "La règle n+1 simple suppose un seul groupe de voisins équivalents partageant la même J." }
  ],
  C6: [
    { id: 'rem-c6-1', type: 'single',
      enonce: "Pour attribuer un signal d'un spectre, quelles informations faut-il combiner au minimum ?",
      options: ["Le déplacement chimique, l'intégration et la multiplicité", "Le déplacement chimique seul", "La multiplicité seule"], correct: 0,
      explication: "Une attribution fiable exploite toujours simultanément ces trois informations." }
  ],
  C7: [
    { id: 'rem-c7-1', type: 'single',
      enonce: "Pour distinguer deux structures isomères très proches, quelle démarche est la plus fiable ?",
      options: ["Comparer systématiquement tous les signaux prévus (δ, intégration, multiplicité) et, si besoin, s'appuyer sur un spectre IR complémentaire", "Se fier uniquement au nombre de signaux", "Se fier uniquement à la formule brute"], correct: 0,
      explication: "Seule une comparaison systématique et complète permet de trancher entre deux structures proches." }
  ]
};
