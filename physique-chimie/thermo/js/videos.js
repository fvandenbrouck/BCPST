/*
 * Composant « Vidéo associée » et page #/videos. Lit uniquement
 * window.THERMO_VIDEOS (data/videos.js). Si `url` vaut null, le bouton est
 * visuellement inactif (aria-disabled, non focalisable, aucun <a href>) :
 * jamais de lien cassé ni de href="#".
 */
(function () {
  function escapeXml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function videoButton(video) {
    if (!video.url) {
      return `<span class="video-btn" aria-disabled="true" role="button">🎬 Vidéo bientôt disponible</span>`;
    }
    return `<a class="video-btn" href="${video.url}" target="_blank" rel="noopener noreferrer">▶ Regarder sur YouTube <span class="mono">(${escapeXml(video.duree)})</span></a>`;
  }

  function playlistButton() {
    const url = (window.THERMO_VIDEOS || {}).playlistUrl;
    if (!url) return `<span class="video-btn" aria-disabled="true" role="button">🎬 Playlist bientôt disponible</span>`;
    return `<a class="video-btn" href="${url}" target="_blank" rel="noopener noreferrer">▶ Voir la playlist complète</a>`;
  }

  function videosForAtelier(atelierId) {
    const V = window.THERMO_VIDEOS;
    if (!V) return [];
    return V.videos.filter(v => (v.ateliers || []).includes(atelierId)).sort((a, b) => a.ordre - b.ordre);
  }

  /* Encadré placé en tête d'un atelier, une carte par vidéo associée. */
  function videoBoxHtml(atelierId) {
    const vids = videosForAtelier(atelierId);
    if (!vids.length) return '';
    return vids.map(v => `
      <div class="video-box">
        <p class="mono" style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--slate);margin-bottom:4px;">Vidéo associée</p>
        <h4>${escapeXml(v.titre)}</h4>
        <p>${escapeXml(v.resume)}</p>
        ${videoButton(v)}
      </div>`).join('');
  }

  function pageVideosHtml() {
    const V = window.THERMO_VIDEOS;
    if (!V) return '<p class="empty">Aucune vidéo définie.</p>';
    const items = V.videos.slice().sort((a, b) => a.ordre - b.ordre).map(v => `
      <div class="video-item">
        <p class="v-ordre">Vidéo ${v.ordre}/${V.videos.length}</p>
        <h4>${escapeXml(v.titre)}</h4>
        <p class="m-meta">${escapeXml(v.resume)}</p>
        <p class="m-meta mono">${escapeXml(v.duree)}</p>
        ${v.chapitres && v.chapitres.length ? `<ul>${v.chapitres.map(c => `<li><a href="${v.url ? v.url + '?t=' + c.t : '#'}" ${v.url ? 'target="_blank" rel="noopener noreferrer"' : 'aria-disabled="true"'}>${escapeXml(c.titre)}</a></li>`).join('')}</ul>` : ''}
        ${videoButton(v)}
      </div>`).join('');
    return `
      <div class="card">
        <h3>Série de vidéos — Thermodynamique</h3>
        <p>Les vidéos de cours associées à ce module, dans l'ordre de visionnage conseillé.</p>
        ${playlistButton()}
      </div>
      <div class="video-list">${items}</div>`;
  }

  window.ThermoVideos = { videoBoxHtml, pageVideosHtml, videoButton, videosForAtelier };
})();
