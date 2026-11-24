/*
 * Routeur et orchestration de l'application Thermodynamique. Navigation par
 * hash (#/accueil, #/atelier/1 à #/atelier/4, #/videos). Chaque atelier est
 * un module indépendant enregistré dans window.ThermoAteliers[id], avec une
 * fonction render(body, ctx) — ctx expose l'état partagé, la persistance et
 * les utilitaires communs (physique, diagramme, vidéos).
 */
(function () {
  let STATE = window.ThermoStorage.load();
  const root = document.getElementById('app');

  function persist() { window.ThermoStorage.save(STATE); }
  function escapeXml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function go(hash) { location.hash = hash; }

  const ctx = {
    get STATE() { return STATE; },
    persist, escapeXml, go,
    Physics: window.ThermoPhysics,
    Clapeyron: window.ClapeyronDiagram,
    Videos: window.ThermoVideos
  };

  const ATELIERS = [
    { id: 'atelier-1', n: 1, titre: 'Piston, gaz et chemins' },
    { id: 'atelier-2', n: 2, titre: 'Tracer son chemin de A à B' },
    { id: 'atelier-3', n: 3, titre: 'Frontières et bilan' },
    { id: 'atelier-4', n: 4, titre: 'Gaz microscopique' }
  ];

  function topNav(current) {
    const items = [['/accueil', 'Accueil']]
      .concat(ATELIERS.map(a => ['/atelier/' + a.n, 'Atelier ' + a.n]))
      .concat([['/videos', 'Vidéos']]);
    return `<div class="tabs">${items.map(([h, l]) => `<a href="#${h}" class="tab${current === h ? ' active' : ''}">${l}</a>`).join('')}</div>`;
  }

  function parseHash() {
    const h = (location.hash || '#/accueil').slice(1);
    return h.split('/').filter(Boolean);
  }

  function render() {
    const parts = parseHash();
    const page = '/' + (parts[0] || 'accueil');
    STATE.nav.page = page;
    persist();

    root.innerHTML = '';
    const nav = document.createElement('div');
    nav.innerHTML = topNav(page === '/atelier' ? '/atelier/' + parts[1] : page);
    root.appendChild(nav);

    const body = document.createElement('div');
    body.className = 'page-body';
    root.appendChild(body);

    if (page === '/accueil') renderAccueil(body);
    else if (page === '/atelier') renderAtelier(body, parts[1]);
    else if (page === '/videos') body.innerHTML = window.ThermoVideos.pageVideosHtml();
    else renderAccueil(body);

    if (window.MathRender) window.MathRender.render(root);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);

  function renderAccueil(body) {
    const cards = ATELIERS.map(a => `
      <a class="module-card" style="--card-accent:var(--ochre)" href="#/atelier/${a.n}">
        <div><p class="m-title">Atelier ${a.n} — ${escapeXml(a.titre)}</p></div>
        <span class="m-badge">Ouvrir</span>
      </a>`).join('');
    body.innerHTML = `
      <div class="card">
        <h3>Thermodynamique : travail, transfert thermique et bilans</h3>
        <p>Ce module accompagne une série de vidéos de cours : il sert à manipuler, prédire et comparer — pas à remplacer le cours. Quatre ateliers, de la manipulation d'un piston à une simulation microscopique de gaz.</p>
        <p class="m-meta">Programme BCPST1, thème E — système thermodynamique, gaz parfait, premier principe, enthalpie (codes E.1, E.2).</p>
      </div>
      <div class="module-grid">${cards}</div>
      <div class="card">
        <p>Ce module prolonge le module de révision <a href="../premier-principe.html">Premier principe de la thermodynamique</a> (programme de Terminale) : si les notions de système fermé, de travail des forces de pression ou du premier principe ΔU = W + Q ne sont pas encore solides, commencer par ce module de révision avant les ateliers ci-dessus.</p>
      </div>
      <button class="reset-btn" id="btn-reset-all">Reprendre le parcours à zéro</button>
    `;
    body.querySelector('#btn-reset-all').addEventListener('click', confirmResetAll);
  }

  function confirmResetAll() {
    if (!window.confirm('Effacer toute la progression enregistrée localement pour le module Thermodynamique ? Cette action est irréversible.')) return;
    STATE = window.ThermoStorage.reset();
    persist();
    go('/accueil');
    render();
  }

  function renderAtelier(body, nStr) {
    const def = ATELIERS.find(a => String(a.n) === String(nStr));
    if (!def) { body.innerHTML = '<p class="empty">Atelier introuvable.</p>'; return; }
    const mod = window.ThermoAteliers && window.ThermoAteliers[def.id];
    if (!mod) {
      body.innerHTML = `
        <div class="card">
          <h3>Atelier ${def.n} — ${escapeXml(def.titre)}</h3>
          <p class="m-meta">Cet atelier est en cours de construction.</p>
        </div>`;
      return;
    }
    body.innerHTML = window.ThermoVideos.videoBoxHtml(def.id);
    const mount = document.createElement('div');
    body.appendChild(mount);
    mod.render(mount, ctx);
  }

  if (!location.hash) location.hash = '#/accueil';
  render();
})();
