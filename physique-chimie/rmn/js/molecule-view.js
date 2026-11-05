/*
 * Affichage des formules topologiques (SVG statiques pré-générés par
 * tools/build_molecules.py à partir de code chemfig/LaTeX — jamais dessinées
 * dynamiquement par du JavaScript, cf. CONTRIBUTING du projet). Ce module se
 * contente de choisir quel fichier SVG afficher et de gérer la légende
 * interactive de groupes de protons équivalents (bascule d'<img src>, aucune
 * géométrie recalculée côté client).
 */
(function(){
  const MOL_BASE = (window.RMN_ASSET_BASE || '') + 'assets/mol/';

  function figureHtml(svgId, caption){
    return `<figure class="q-figure"><img src="${MOL_BASE}${svgId}.svg" alt="${escapeXml(caption || 'Formule topologique')}"><figcaption>${escapeXml(caption || '')}</figcaption></figure>`;
  }

  /* Affiche une molécule statique simple (pas d'interaction). */
  function renderStatic(container, svgId, caption){
    container.innerHTML = figureHtml(svgId, caption);
  }

  /*
   * Démonstration d'équivalence interactive : molConfig = {plain, all, groups:{key:svgId}},
   * legend = [{key, label, color}]. Affiche l'image 'all' par défaut, avec une
   * légende de groupes cliquables qui basculent vers l'image groups[key]
   * (seul ce groupe reste coloré) ; un bouton « Tous les groupes » revient à
   * l'image 'all', un bouton « Structure seule » affiche la version 'plain'.
   */
  function renderEquivalenceDemo(container, nom, molConfig, legend){
    const img = document.createElement('img');
    img.src = `${MOL_BASE}${molConfig.all || molConfig.plain}.svg`;
    img.alt = nom;
    img.className = 'eq-mol-img';

    const figWrap = document.createElement('div');
    figWrap.className = 'eq-mol-figure';
    figWrap.appendChild(img);

    const legendWrap = document.createElement('div');
    legendWrap.className = 'eq-mol-legend';

    function setActive(btn){
      legendWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
    }

    const btnAll = document.createElement('button');
    btnAll.type = 'button'; btnAll.className = 'eq-swatch-btn active';
    btnAll.innerHTML = `<span class="eq-swatch" style="background:var(--ink-soft)"></span> Tous les groupes`;
    btnAll.addEventListener('click', () => { img.src = `${MOL_BASE}${molConfig.all || molConfig.plain}.svg`; setActive(btnAll); });
    legendWrap.appendChild(btnAll);

    (legend || []).forEach(item => {
      const svgId = molConfig.groups ? molConfig.groups[item.key] : null;
      if (!svgId) return;
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'eq-swatch-btn';
      btn.innerHTML = `<span class="eq-swatch" style="background:var(--${item.color})"></span> ${escapeXml(item.label)}`;
      btn.addEventListener('click', () => { img.src = `${MOL_BASE}${svgId}.svg`; setActive(btn); });
      legendWrap.appendChild(btn);
    });

    const btnPlain = document.createElement('button');
    btnPlain.type = 'button'; btnPlain.className = 'eq-swatch-btn';
    btnPlain.innerHTML = `<span class="eq-swatch" style="background:var(--paper);border:1px solid var(--line)"></span> Structure seule`;
    btnPlain.addEventListener('click', () => { img.src = `${MOL_BASE}${molConfig.plain}.svg`; setActive(btnPlain); });
    legendWrap.appendChild(btnPlain);

    container.innerHTML = '';
    container.appendChild(figWrap);
    container.appendChild(legendWrap);
  }

  function escapeXml(s){
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.MoleculeView = { renderStatic, renderEquivalenceDemo, figureHtml };
})();
