/*
 * Jauge en strates + navigation par matière pour la page d'accueil (index.html).
 * Dépend de window.MODULES (modules-registry.js) et window.Storage (storage.js).
 * Le "score de maîtrise" d'un module repose sur la dernière tentative du bloc
 * d'évaluation pondéré (QCM SVT/PC, Entraînement calculatoire Maths...), qui
 * alimente toujours progress.qcmAttempts quel que soit le nom de l'onglet.
 */
(function(){
  function esc(s){ return (s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  async function loadModuleProgress(mod){
    const r = await Storage.get('progress:'+mod.id);
    if(!r) return {coursRead:false, attempted:false, weightedScore:null};
    let p;
    try{ p = JSON.parse(r.value); }catch(e){ return {coursRead:false, attempted:false, weightedScore:null}; }
    const attempts = p.qcmAttempts || [];
    const last = attempts.length ? attempts[attempts.length-1] : null;
    return {
      coursRead: !!p.coursRead,
      attempted: attempts.length>0,
      weightedScore: last && typeof last.weightedScore==='number' ? last.weightedScore : null
    };
  }

  function masteryLevel(status){
    if(!status.attempted) return status.coursRead ? 1 : 0; // 0 rien, 1 cours lu seulement
    if(status.weightedScore===null) return 1;
    if(status.weightedScore>=80) return 4; // maîtrisé
    if(status.weightedScore>=50) return 3; // en bonne voie
    return 2; // tenté, à consolider
  }

  async function init(container){
    let filter = 'all';
    const available = window.MODULES.filter(m=>m.status==='available');
    const statuses = {};
    await Promise.all(available.map(async m=>{ statuses[m.id] = await loadModuleProgress(m); }));

    function subjects(){
      const seen = [];
      window.MODULES.forEach(m=>{ if(!seen.find(s=>s.key===m.subject)) seen.push({key:m.subject, label:m.subjectLabel}); });
      return seen;
    }

    function renderStrata(){
      const levels = available.map(m=>masteryLevel(statuses[m.id]));
      const masteredCount = levels.filter(l=>l>=4).length;
      let html = `<div class="strata-wrap"><div class="strata">`;
      if(available.length===0){
        html += `<div class="stratum" style="background:transparent;"></div>`;
      } else {
        available.forEach((m,i)=>{
          const lvl = levels[i];
          const filled = lvl>=2;
          const bg = lvl>=4 ? m.accent : (lvl>=3 ? 'var(--ochre)' : (lvl>=2 ? 'var(--parchment-deep)' : 'transparent'));
          html += `<div class="stratum ${filled?'filled':''}" title="${esc(m.title)}" style="background:${bg}"></div>`;
        });
      }
      html += `</div><div class="strata-caption"><span>${available.length} module${available.length>1?'s':''} disponible${available.length>1?'s':''}</span><span>${masteredCount}/${available.length} maîtrisés</span></div></div>`;
      return html;
    }

    function renderFilters(){
      const subs = subjects();
      let html = `<div class="subject-filter">
        <button data-subject="all" class="${filter==='all'?'active':''}">Tout</button>`;
      subs.forEach(s=>{
        html += `<button data-subject="${s.key}" class="${filter===s.key?'active':''}">${esc(s.label)}</button>`;
      });
      html += `</div>`;
      return html;
    }

    function renderModules(){
      const list = window.MODULES.filter(m=> filter==='all' || m.subject===filter);
      const byCat = {};
      const order = [];
      list.forEach(m=>{
        if(!byCat[m.cat]){ byCat[m.cat]=[]; order.push(m.cat); }
        byCat[m.cat].push(m);
      });
      let html = '';
      order.forEach(cat=>{
        html += `<div class="category"><h2>${esc(cat)}</h2><div class="module-grid">`;
        byCat[cat].forEach(m=>{
          const isAvailable = m.status==='available';
          const tag = isAvailable ? 'a' : 'div';
          html += `<${tag} class="module-card ${isAvailable?'':'soon'}" style="--card-accent:${m.accent}" ${isAvailable?`href="${m.href}"`:''}>
            <div>
              <p class="m-title">${esc(m.title)}</p>
              <p class="m-meta">${esc(m.pages)}</p>
            </div>
            <span class="m-badge ${isAvailable?'active':''}">${isAvailable?'Disponible':'À venir'}</span>
          </${tag}>`;
        });
        html += `</div></div>`;
      });
      return html || `<p class="empty">Aucun module dans cette matière pour l'instant.</p>`;
    }

    function render(){
      container.innerHTML = renderStrata() + renderFilters() + `<div id="moduleList">${renderModules()}</div>`;
      container.querySelectorAll('[data-subject]').forEach(btn=>{
        btn.addEventListener('click', ()=>{ filter = btn.dataset.subject; render(); });
      });
    }

    render();
  }

  window.ProgressGauge = { init };
})();
