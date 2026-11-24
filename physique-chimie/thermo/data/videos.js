/*
 * Catalogue des vidéos pédagogiques associées au module. SEUL fichier à
 * modifier pour renseigner un lien : remplacer un `url: null` par l'adresse
 * YouTube de la vidéo correspondante (cf. README.md, section « Ajouter un
 * lien de vidéo »). `chapitres` est réservé à de futurs repères horodatés
 * ({t:125, titre:"…"}) ; laissé vide pour l'instant.
 */
window.THERMO_VIDEOS = {
  playlistUrl: null,
  videos: [
    { id: 'v1', ordre: 1, titre: "Le travail des forces de pression", resume: "Piston lâché contre l'atmosphère, piston piloté, travail dans le diagramme de Clapeyron.", duree: "≈ 19 min", url: null, ateliers: ['atelier-1'], chapitres: [] },
    { id: 'v2', ordre: 2, titre: "La méthode : système, frontières, bilan", resume: "Représenter le système, interroger les frontières, écrire le premier principe.", duree: "≈ 17 min", url: null, ateliers: ['atelier-3'], chapitres: [] },
    { id: 'v3', ordre: 3, titre: "Échauffements : monobare et isochore", resume: "Chauffer un gaz à pression constante ou à volume constant, relation de Mayer.", duree: "≈ 14 min", url: null, ateliers: ['atelier-1'], chapitres: [] },
    { id: 'v4', ordre: 4, titre: "Détentes et chemins", resume: "Un même état initial et un même état final, des chemins différents.", duree: "≈ 20 min", url: null, ateliers: ['atelier-2'], chapitres: [] },
    { id: 'v5', ordre: 5, titre: "Adiabatiques et cycle", resume: "Joule–Gay-Lussac, adiabatique réversible, un cycle moteur.", duree: "≈ 15 min", url: null, ateliers: ['atelier-2'], chapitres: [] }
  ]
};
