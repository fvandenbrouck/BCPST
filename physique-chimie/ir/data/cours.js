/*
 * Contenu du cours ("Essentiels du cours"). Conforme au programme officiel
 * BCPST1 2021, section C.1.3 (spectroscopie infrarouge) : nature des
 * transitions, nombre d'onde, transmittance/absorbance, identification des
 * liaisons et groupes caractéristiques à l'aide de tables. Ne couvre pas
 * l'analyse mathématique des modes normaux ni la spectroscopie 2D (hors
 * programme BCPST1).
 */
window.IR_COURS = {

  principe: {
    intro: "Une molécule peut absorber un rayonnement infrarouge : cette absorption est associée à une transition entre niveaux d'énergie vibrationnels des liaisons chimiques. Chaque liaison, ou groupe de liaisons, vibre à une fréquence qui dépend notamment de la nature des atomes impliqués et de la force de la liaison — c'est ce qui rend certaines bandes caractéristiques d'une liaison ou d'un groupe fonctionnel, indépendamment du reste de la molécule.",
    vibrations: "Deux grands types de vibrations sont à connaître qualitativement : les vibrations d'ÉLONGATION (la distance entre deux atomes liés varie périodiquement, le long de l'axe de la liaison) et les vibrations de DÉFORMATION (l'angle entre liaisons varie périodiquement). Le spectre IR enregistré en BCPST1 renseigne essentiellement sur les vibrations d'élongation des liaisons et groupes caractéristiques.",
    limite: "Le spectre IR permet essentiellement de caractériser certaines liaisons et certains groupes fonctionnels présents dans une molécule — il ne fournit pas, à lui seul, une structure moléculaire complète et univoque."
  },

  nombreOnde: {
    intro: "Le nombre d'onde $\\sigma = 1/\\lambda$ (en cm⁻¹) est la grandeur utilisée en abscisse d'un spectre IR, plutôt que la longueur d'onde $\\lambda$ ou la fréquence.",
    energie: "L'énergie du photon absorbé est liée au nombre d'onde par $E = hc\\sigma$ : un nombre d'onde élevé correspond donc à un photon plus énergétique.",
    domaine: "Le spectre IR moyen, utilisé pour la caractérisation des liaisons et groupes organiques, s'étend approximativement de 400 à 4000 cm⁻¹."
  },

  transmittanceAbsorbance: {
    intro: "La transmittance $T = I/I_0$ compare l'intensité transmise $I$ à l'intensité incidente $I_0$ ; c'est une fraction (ou un pourcentage) comprise entre 0 et 1 (ou 0 et 100 %).",
    absorbance: "L'absorbance est définie par $A = -\\log_{10}(T)$, avec $T$ exprimée comme une fraction (sans unité) dans cette formule — une transmittance donnée en pourcentage doit être convertie avant tout calcul d'absorbance.",
    lectures: "Un même spectre peut être tracé en transmittance ou en absorbance : en transmittance, une absorption importante apparaît comme un CREUX (un minimum local) ; en absorbance, la même absorption apparaît comme un MAXIMUM (un pic). Les deux représentations décrivent exactement les mêmes absorptions, seule l'orientation visuelle diffère.",
    piege: "Une diminution prononcée de la transmittance correspond à une absorption importante — ce n'est pas l'inverse. Confondre les deux représentations est une erreur fréquente et pénalisante."
  },

  bandesPrincipales: {
    intro: "Les valeurs indiquées ci-dessous sont des ordres de grandeur, pas des valeurs absolues : la position exacte d'une bande dépend de l'environnement chimique, des liaisons hydrogène, de la conjugaison et des conditions expérimentales.",
    // table affichée directement depuis window.IR_TABLE_BANDES (data/spectres.js)
  },

  groupesFonctionnels: [
    {
      famille: "Alcool", spectreId: 'ethanol',
      bandesCles: "O–H large et intense (3200-3600 cm⁻¹), C–O forte (1000-1300 cm⁻¹).",
      pieges: "L'O–H d'alcool est large (liaisons hydrogène) ; ne pas le confondre avec l'O–H, bien plus large encore, d'un acide carboxylique.",
      distinction: "Absence de bande C=O : élément clé pour écarter un acide carboxylique ou un ester."
    },
    {
      famille: "Acide carboxylique", spectreId: 'aceticacid',
      bandesCles: "O–H exceptionnellement large (2500-3300 cm⁻¹, recouvre souvent les C–H), C=O forte (1700-1725 cm⁻¹), C–O forte (1210-1320 cm⁻¹).",
      pieges: "La largeur extrême de la bande O–H est le critère le plus fiable pour distinguer un acide d'un alcool — leur bande C=O (absente chez l'alcool) le confirme.",
      distinction: "Présence conjointe d'un O–H très large ET d'un C=O : aucune autre fonction ne présente cette combinaison."
    },
    {
      famille: "Aldéhyde", spectreId: 'propanal',
      bandesCles: "C=O forte (1720-1740 cm⁻¹), doublet C–H aldéhydique discret vers 2720 et 2820 cm⁻¹.",
      pieges: "Le doublet C–H aldéhydique est souvent faible et peut passer inaperçu ; son absence ne permet pas, à elle seule, d'exclure un aldéhyde avec certitude absolue, mais sa présence est un indice très fort en sa faveur.",
      distinction: "C=O présent sans O–H ni N–H : famille carbonylée (aldéhyde, cétone, ester ou amide) ; le doublet C–H aldéhydique, quand il est visible, orientera vers l'aldéhyde."
    },
    {
      famille: "Cétone", spectreId: 'propanone',
      bandesCles: "C=O forte (1705-1725 cm⁻¹), aucune autre bande caractéristique associée.",
      pieges: "Un C=O seul, sans O–H, N–H, ni bande C–O intense supplémentaire, ne doit pas être automatiquement qualifié de cétone : c'est la combinaison « C=O seul, sans autre indice » qui oriente vers cette famille, par élimination des autres carbonyles.",
      distinction: "Absence de bande C–O intense (contrairement à l'ester) et absence de N–H (contrairement à l'amide)."
    },
    {
      famille: "Ester", spectreId: 'ethylacetate',
      bandesCles: "C=O forte et légèrement plus élevée qu'une cétone (1735-1750 cm⁻¹), bande(s) C–O intense(s) (1000-1300 cm⁻¹).",
      pieges: "Le C=O seul ne distingue pas un ester d'une cétone ; c'est la présence d'une bande C–O intense supplémentaire qui conforte l'hypothèse ester.",
      distinction: "Présence conjointe de C=O ET de C–O intense : signature typique d'un ester, à comparer avec une cétone de C=O voisin (ex. butan-2-one) qui n'a pas cette bande C–O intense."
    },
    {
      famille: "Amine", spectreId: 'ethanamine',
      bandesCles: "N–H (amine primaire, souvent un doublet) vers 3300-3500 cm⁻¹, généralement plus étroit qu'un O–H d'alcool.",
      pieges: "Ne pas confondre le N–H d'amine avec un O–H d'alcool : l'allure (moins large) et l'absence de bande C=O aident à trancher.",
      distinction: "N–H présent, C=O absent."
    },
    {
      famille: "Amide", spectreId: 'propanamide',
      bandesCles: "N–H vers 3100-3500 cm⁻¹, C=O nettement plus bas (1630-1700 cm⁻¹) que les autres carbonyles.",
      pieges: "Le C=O d'amide, plus bas en nombre d'onde que celui d'une cétone, d'un ester ou d'un acide, est un indice souvent négligé mais très diagnostique.",
      distinction: "Présence conjointe de N–H ET d'un C=O nettement décalé vers les basses valeurs : signature typique de l'amide."
    },
    {
      famille: "Alcène", spectreId: 'propene',
      bandesCles: "C=C faible à moyenne (1620-1680 cm⁻¹), =C–H juste au-dessus de 3000 cm⁻¹.",
      pieges: "La bande C=C est souvent faible, parfois difficile à distinguer du bruit ou d'autres bandes voisines.",
      distinction: "Bande C=C nettement plus faible que la bande C=O d'un carbonyle — ne pas les confondre malgré leur proximité en nombre d'onde."
    },
    {
      famille: "Composé aromatique", spectreId: 'benzene',
      bandesCles: "Plusieurs bandes C=C faibles à moyennes entre 1450 et 1600 cm⁻¹, C–H aromatique juste au-dessus de 3000 cm⁻¹.",
      pieges: "Ces bandes, multiples et de faible intensité, sont davantage un faisceau d'indices qu'une bande unique facilement identifiable.",
      distinction: "Motif de plusieurs bandes rapprochées entre 1450 et 1600 cm⁻¹, plutôt qu'une bande isolée."
    }
  ],
  noteFamillesSupplementaires: "Les fonctions thiol, hémiacétal, acétal et les groupes phosphorés du programme ne présentent pas, pour la plupart, de bande IR suffisamment spécifique et intense pour être identifiées de façon fiable par la seule spectroscopie IR : elles ne sont donc pas développées ici au même niveau de détail, conformément au programme.",

  empreinteDigitale: {
    intro: "On distingue usuellement, au-dessus de 1500 cm⁻¹, la RÉGION DES GROUPES CARACTÉRISTIQUES (bandes bien identifiées : O–H, N–H, C–H, C=O, C=C), et en dessous de 1500 cm⁻¹, la RÉGION DE L'EMPREINTE DIGITALE.",
    empreinte: "Cette seconde région comporte de nombreuses vibrations couplées, donnant un motif complexe propre à chaque molécule — utile notamment pour comparer deux spectres, mais dont l'attribution exhaustive n'est pas exigible.",
    piege: "Attention : certaines bandes très utiles, en particulier la bande C–O (1000-1300 cm⁻¹), se trouvent dans cette région. Elle ne doit donc jamais être négligée ou qualifiée de « sans intérêt »."
  },

  pieges: [
    { titre: "Confondre absorbance et transmittance", texte: "Un creux en transmittance correspond à un pic en absorbance : il s'agit de la même absorption, lue sur deux échelles différentes." },
    { titre: "Lire l'axe des nombres d'onde dans le mauvais sens", texte: "Par convention, l'axe est gradué avec les valeurs élevées de nombre d'onde à gauche (4000 cm⁻¹) et les valeurs faibles à droite (400 cm⁻¹)." },
    { titre: "Identifier une molécule à partir d'une seule bande", texte: "Une bande, prise isolément, est compatible avec de nombreuses structures différentes : seul le recoupement de plusieurs bandes permet de conclure." },
    { titre: "Confondre O–H d'alcool et O–H d'acide carboxylique", texte: "La bande O–H d'un acide carboxylique est exceptionnellement plus large (souvent 2500-3300 cm⁻¹) que celle d'un alcool (3200-3600 cm⁻¹)." },
    { titre: "Conclure qu'un carbonyle est forcément une cétone", texte: "Un C=O peut appartenir à un aldéhyde, une cétone, un ester, un amide ou un acide carboxylique : il faut toujours croiser d'autres indices (O–H, N–H, C–O, position précise du C=O)." },
    { titre: "Ignorer les recouvrements de bandes", texte: "Deux bandes voisines peuvent se superposer partiellement, en particulier l'O–H d'acide qui recouvre souvent la zone C–H." },
    { titre: "Oublier les effets des liaisons hydrogène", texte: "Les liaisons hydrogène élargissent et déplacent notablement certaines bandes (O–H en particulier), par rapport à une liaison isolée en phase gazeuse." },
    { titre: "Traiter l'absence d'une bande faible comme une preuve absolue d'absence de fonction", texte: "Une bande faible (ex. doublet C–H aldéhydique, C=C d'alcène) peut être présente mais difficile à distinguer : son absence apparente n'est pas une preuve définitive." },
    { titre: "Affirmer que l'IR identifie toujours une structure de façon univoque", texte: "L'IR identifie principalement des liaisons et des groupes fonctionnels. Plusieurs structures candidates peuvent rester compatibles avec un même spectre IR ; la RMN ou d'autres données sont parfois nécessaires pour trancher." }
  ]
};
