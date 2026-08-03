/*
 * Moteur "Carnet de terrain" : quatrième type de module, volontairement séparé de
 * qcm-engine.js — pas de score, pas de bonne réponse, observation libre horodatée
 * + éclairage révélé après coup (jamais avant d'avoir cherché soi-même). Aucune
 * contribution à la jauge en strates de maîtrise (cf. CARNET_DE_TERRAIN.md §1.3).
 *
 * Contrat attendu sur l'objet SITE :
 *   SITE.id, SITE.title, SITE.altitude, SITE.contexte (HTML autorisé, texte original)
 *   SITE.points: [{id, ordre, lieu, prompt, eclairage, tags}]
 */
(function(){
  function esc(s){ return (s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  async function loadCarnet(id){
    const r = await Storage.get('carnet:'+id);
    try{ return r ? JSON.parse(r.value) : {entries:{}}; }
    catch(e){ return {entries:{}}; }
  }
  async function saveCarnet(id, data){ await Storage.set('carnet:'+id, JSON.stringify(data)); }

  function countFilled(site, data){
    return site.points.filter(p => (data.entries[p.id].response||'').trim().length>0).length;
  }

  function renderPoint(point, entry){
    const hasText = (entry.response||'').trim().length>0;
    let h = `<div class="carnet-point">
      <div class="carnet-point-head">
        <span class="carnet-num">${point.ordre}</span>
        <p class="carnet-lieu">${esc(point.lieu)}</p>
      </div>
      <p class="carnet-prompt">${esc(point.prompt)}</p>
      <textarea class="carnet-textarea" data-id="${point.id}" placeholder="Tes observations, ton hypothèse...">${esc(entry.response||'')}</textarea>`;
    if(!entry.revealed){
      h += `<button class="hint-btn carnet-reveal" data-id="${point.id}" ${hasText?'':'disabled'}>🔍 Éclairage</button>`;
    } else {
      h += `<div class="hint-box carnet-eclairage"><b>Éclairage :</b> ${point.eclairage}</div>`;
    }
    h += `</div>`;
    return h;
  }

  async function init(SITE){
    const data = await loadCarnet(SITE.id);
    SITE.points.forEach(p=>{
      if(!data.entries[p.id]) data.entries[p.id] = {response:'', revealed:false, updatedAt:null};
    });

    const app = document.getElementById('app');
    const ordered = [...SITE.points].sort((a,b)=>a.ordre-b.ordre);

    function updateCounter(){
      const el = app.querySelector('.carnet-counter');
      if(el) el.textContent = `${countFilled(SITE, data)}/${SITE.points.length} points renseignés`;
    }

    function render(){
      let html = `
      <a class="back-link" href="index.html">← Retour au carnet de terrain</a>
      <div class="module-head">
        <p class="m-tag">🏔️ Carnet de terrain</p>
        <h1>${esc(SITE.title)}</h1>
        <p class="m-pages">${esc(SITE.altitude||'')}</p>
        <div class="m-bridge" style="--card-accent:var(--moss)">${SITE.contexte}</div>
      </div>
      <p class="flash-progress carnet-counter">${countFilled(SITE, data)}/${SITE.points.length} points renseignés</p>
      <div id="carnetList">`;
      ordered.forEach(p=>{ html += renderPoint(p, data.entries[p.id]); });
      html += `</div>`;
      app.innerHTML = html;

      app.querySelectorAll('.carnet-textarea').forEach(t=>{
        t.addEventListener('input', ()=>{
          const id = t.dataset.id;
          data.entries[id].response = t.value;
          data.entries[id].updatedAt = new Date().toISOString();
          const btn = app.querySelector(`.carnet-reveal[data-id="${id}"]`);
          if(btn) btn.disabled = t.value.trim().length===0;
        });
        t.addEventListener('blur', async ()=>{ await saveCarnet(SITE.id, data); updateCounter(); });
      });
      app.querySelectorAll('.carnet-reveal').forEach(b=>{
        b.addEventListener('click', async ()=>{
          data.entries[b.dataset.id].revealed = true;
          await saveCarnet(SITE.id, data);
          render();
        });
      });
    }

    render();
  }

  window.CarnetEngine = { init };
})();
