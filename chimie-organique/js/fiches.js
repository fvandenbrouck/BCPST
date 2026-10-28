/*
 * Bibliothèque de fiches de référence (Modules A, B, C). Lecture seule,
 * sans notation : sert de support de cours consultable à tout moment,
 * séparé des modes d'entraînement notés.
 */
(function(){
  'use strict';
  const { esc, molFigure } = ChimorgApp;

  function familyCard(f){
    return `
      <div class="fiche-card">
        <h3>${esc(f.name)}</h3>
        <p class="fc-meta">${esc(f.sourcePage)} · ${f.suffix ? 'suffixe '+esc(f.suffix) : 'pas de suffixe dédié'}</p>
        <div class="fiche-grid">
          <div>
            ${molFigure(f.img, f.exampleName)}
            <p class="mol-caption">${esc(f.exampleName)}</p>
            ${f.img2 ? molFigure(f.img2, f.exampleName2) + `<p class="mol-caption">${esc(f.exampleName2)}</p>` : ''}
          </div>
          <div>
            <div class="fiche-field"><b>Groupe caractéristique</b><span>${esc(f.groupeCaracteristique)}</span></div>
            <div class="fiche-field"><b>Formule générique</b><span class="mono">${esc(f.formuleGenerique)}</span></div>
            <div class="fiche-field"><b>Nom systématique (exemple)</b><span>${esc(f.systematicName)}</span></div>
            <div class="fiche-field"><b>Nomenclature</b><span>${f.suffix ? 'Suffixe : '+esc(f.suffix) : 'Aucun suffixe au programme'}${f.prefix ? ' · Préfixe : '+esc(f.prefix) : ''}</span></div>
            <div class="fiche-field"><b>Particularités / confusions fréquentes</b><p>${esc(f.confusions)}</p></div>
          </div>
        </div>
      </div>`;
  }

  function bioCard(n){
    return `
      <div class="fiche-card">
        <h3>${esc(n.term)}</h3>
        <div class="fiche-grid">
          <div>
            ${n.img ? molFigure(n.img, n.term) : ''}
            ${n.example ? `<p class="mol-caption">${esc(n.example)}</p>` : ''}
          </div>
          <div>
            <div class="fiche-field"><b>Définition</b><p>${esc(n.def)}</p></div>
            ${n.groupesCaracteristiques ? `<div class="fiche-field"><b>Groupe(s) caractéristique(s) impliqué(s)</b><p>${n.groupesCaracteristiques.map(g=>`<span class="pill">${esc(g)}</span>`).join('')}</p></div>` : ''}
            ${n.confusions ? `<div class="fiche-field"><b>Particularités / confusions fréquentes</b><p>${esc(n.confusions)}</p></div>` : ''}
          </div>
        </div>
      </div>`;
  }

  function nomenclatureReference(){
    const ref = window.CHIMORG_NOMENCLATURE.reference;
    return `
      <div class="fiche-card">
        <h3>Racines (nombre de carbones)</h3>
        <table class="trous-table"><thead><tr><th>n</th><th>Racine</th></tr></thead><tbody>
          ${ref.racines.map(r=>`<tr><td>${r.n}</td><td>${esc(r.racine)}</td></tr>`).join('')}
        </tbody></table>
      </div>
      <div class="fiche-card">
        <h3>Suffixes d'insaturation</h3>
        <table class="trous-table"><thead><tr><th>Suffixe</th><th>Signification</th></tr></thead><tbody>
          ${ref.suffixesInsaturation.map(s=>`<tr><td class="mono">${esc(s.code)}</td><td>${esc(s.sens)}</td></tr>`).join('')}
        </tbody></table>
      </div>
      <div class="fiche-card">
        <h3>Groupes alkyles courants</h3>
        <table class="trous-table"><thead><tr><th>Groupe</th><th>Nom</th><th>Abréviation</th></tr></thead><tbody>
          ${ref.groupesAlkyles.map(g=>`<tr><td class="mono">${esc(g.groupe)}</td><td>${esc(g.nom)}</td><td class="mono">${esc(g.abrev)}</td></tr>`).join('')}
        </tbody></table>
      </div>
      <div class="fiche-card">
        <h3>Priorité des classes fonctionnelles (p.20)</h3>
        <p>Ordre décroissant : la première ligne l'emporte toujours sur les suivantes pour désigner le <b>suffixe</b> de la chaîne principale.</p>
        <table class="trous-table"><thead><tr><th>Classe</th><th>Formule</th><th>Suffixe</th><th>Préfixe</th></tr></thead><tbody>
          ${ref.prioriteSuffixes.map(p=>`<tr><td>${esc(p.classe)}</td><td class="mono">${esc(p.formule)}</td><td>${p.suffixe?esc(p.suffixe):'—'}</td><td>${p.prefixe?esc(p.prefixe):'—'}</td></tr>`).join('')}
        </tbody></table>
        ${ref.prioriteSuffixes.filter(p=>p.remarque).map(p=>`<p class="fc-meta">* ${esc(p.classe)} : ${esc(p.remarque)}</p>`).join('')}
      </div>
      <div class="fiche-card">
        <h3>Choix de la chaîne principale</h3>
        <ul>${ref.choixChainePrincipale.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>
      </div>
      <div class="fiche-card">
        <h3>Règles de numérotation</h3>
        <ul>${ref.reglesNumerotation.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>
      </div>`;
  }

  function render(container){
    let filter = 'all';
    function body(){
      let html = '';
      if(filter==='all' || filter==='A'){
        html += `<p class="section-title">Module A — Familles fonctionnelles</p>`;
        html += window.CHIMORG_FAMILIES.map(familyCard).join('');
      }
      if(filter==='all' || filter==='B'){
        html += `<p class="section-title">Module B — Molécules de la chimie du vivant</p>`;
        const B = window.CHIMORG_BIOMOLECULES;
        Object.keys(B).forEach(k=>{
          html += `<div class="card"><h3>${esc(B[k].label)}</h3><p>${esc(B[k].intro)}</p></div>`;
          html += B[k].notions.map(bioCard).join('');
        });
      }
      if(filter==='all' || filter==='C'){
        html += `<p class="section-title">Module C — Nomenclature systématique</p>`;
        html += nomenclatureReference();
      }
      return html;
    }
    function draw(){
      container.innerHTML = `
        <a class="back-link" href="#/home">← Retour à l'accueil</a>
        <div class="module-head"><h1>Bibliothèque de fiches</h1><p class="mol-caption" style="text-align:left;">Support de cours consultable librement, sans notation.</p></div>
        <div class="fiche-filters">
          <button data-f="all" class="${filter==='all'?'active':''}">Tout</button>
          <button data-f="A" class="${filter==='A'?'active':''}">Module A</button>
          <button data-f="B" class="${filter==='B'?'active':''}">Module B</button>
          <button data-f="C" class="${filter==='C'?'active':''}">Module C</button>
        </div>
        <div id="ficheBody">${body()}</div>
      `;
      container.querySelectorAll('.fiche-filters button').forEach(b=>{
        b.addEventListener('click', ()=>{ filter = b.dataset.f; draw(); window.scrollTo(0,0); });
      });
    }
    draw();
  }

  ChimorgApp.route('fiches', render);
})();
