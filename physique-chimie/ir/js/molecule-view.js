/*
 * Affichage des formules topologiques (SVG statiques pré-générés par
 * tools/build_molecules.py à partir de code chemfig/LaTeX — jamais dessinées
 * dynamiquement par du JavaScript, même principe que le module RMN). Pour le
 * module IR, chaque molécule de fiche existe en deux variantes pré-générées :
 * « plain » (structure seule, noire) et « highlight » (groupe fonctionnel
 * caractéristique coloré). Basculer entre les deux ne fait que changer le
 * `src` de l'<img>, sans recalcul de géométrie.
 */
(function(){
  const MOL_BASE = (window.IR_ASSET_BASE || '') + 'assets/mol/';

  function figureHtml(svgId, caption){
    return `<figure class="q-figure"><img src="${MOL_BASE}${svgId}.svg" alt="${escapeXml(caption || 'Formule topologique')}"><figcaption>${escapeXml(caption || '')}</figcaption></figure>`;
  }

  function renderStatic(container, svgId, caption){
    container.innerHTML = figureHtml(svgId, caption);
  }

  /*
   * Démonstration « groupe fonctionnel » : molConfig = {plain, highlight}.
   * Affiche par défaut la version groupe coloré, avec un bouton pour basculer
   * vers la structure seule.
   */
  function renderHighlightDemo(container, nom, molConfig, groupeLabel){
    const img = document.createElement('img');
    img.src = `${MOL_BASE}${molConfig.highlight || molConfig.plain}.svg`;
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

    if (molConfig.highlight){
      const btnHi = document.createElement('button');
      btnHi.type = 'button'; btnHi.className = 'eq-swatch-btn active';
      btnHi.innerHTML = `<span class="eq-swatch" style="background:var(--rust)"></span> ${escapeXml(groupeLabel || 'Groupe caractéristique')}`;
      btnHi.addEventListener('click', () => { img.src = `${MOL_BASE}${molConfig.highlight}.svg`; setActive(btnHi); });
      legendWrap.appendChild(btnHi);
    }

    const btnPlain = document.createElement('button');
    btnPlain.type = 'button'; btnPlain.className = 'eq-swatch-btn' + (molConfig.highlight ? '' : ' active');
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

  window.MoleculeView = { renderStatic, renderHighlightDemo, figureHtml };
})();
