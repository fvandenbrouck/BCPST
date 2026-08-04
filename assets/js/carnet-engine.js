/*
 * Moteur "Carnet de terrain" : quatrième type de module, volontairement séparé de
 * qcm-engine.js — pas de score, pas de bonne réponse, observation libre horodatée
 * + éclairage révélé après coup (jamais avant d'avoir cherché soi-même). Aucune
 * contribution à la jauge en strates de maîtrise (cf. CARNET_DE_TERRAIN.md §1.3).
 *
 * Contrat attendu sur l'objet SITE :
 *   SITE.id, SITE.title, SITE.altitude, SITE.contexte (HTML autorisé, texte original)
 *   SITE.points: [{id, ordre, lieu, prompt, eclairage, tags}]
 *
 * Mode "chasse au trésor" (optionnel, opt-in via SITE.treasureHunt === true) :
 * habillage narratif au-dessus du même principe fondateur (pas de correction binaire).
 *   SITE.mission: HTML, texte d'accroche affiché en tête (le "fil rouge" de la chasse).
 *   point.indice: chaîne courte (mot-clé), optionnelle — devient un "indice collecté"
 *     affiché dans une frise en tête de page une fois le point révélé. Les points sans
 *     `indice` (mise en contexte, bilan final) n'apparaissent pas dans la frise.
 *   point.final: true sur le dernier point — change le libellé du bouton de révélation
 *     ("🎁 Ouvrir le trésor final" au lieu de "🗝️ Débloquer l'indice") et sa mise en forme.
 * Tous les points restent accessibles dès le départ, dans n'importe quel ordre : sur le
 * terrain, sans réseau, il n'y a aucune dépendance à un ordre de validation — seul le texte
 * (mission, libellé du point final) suggère de garder la dernière énigme pour le retour, au
 * calme. Ce choix est volontaire (cf. SYNTHESE_SESSION.md pour le contexte) : un verrouillage
 * séquentiel technique a été essayé puis retiré, car il aurait bloqué l'usage réel sans
 * connexion pendant la randonnée.
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
  function countRevealed(site, data){
    return site.points.filter(p => data.entries[p.id].revealed).length;
  }

  function renderPoint(point, entry){
    const hasText = (entry.response||'').trim().length>0;
    let h = `<div class="carnet-point${point.final?' carnet-point-final':''}">
      <div class="carnet-point-head">
        <span class="carnet-num">${point.final ? '🎁' : point.ordre}</span>
        <p class="carnet-lieu">${esc(point.lieu)}</p>
      </div>
      <p class="carnet-prompt">${esc(point.prompt)}</p>
      <textarea class="carnet-textarea" data-id="${point.id}" placeholder="Tes observations, ton hypothèse...">${esc(entry.response||'')}</textarea>`;
    if(!entry.revealed){
      const label = point.final ? '🎁 Ouvrir le trésor final' : (point.indice ? '🗝️ Débloquer l\'indice' : '🔍 Éclairage');
      h += `<button class="hint-btn carnet-reveal" data-id="${point.id}" ${hasText?'':'disabled'}>${label}</button>`;
    } else {
      h += `<div class="hint-box carnet-eclairage"><b>${point.final ? 'Trésor ouvert :' : 'Éclairage :'}</b> ${point.eclairage}</div>`;
    }
    h += `</div>`;
    return h;
  }

  function renderTracker(site, data){
    const collectible = site.points.filter(p => p.indice);
    if(!collectible.length) return '';
    const chips = collectible.map(p=>{
      const found = data.entries[p.id].revealed;
      return `<span class="treasure-chip${found?' found':''}">${found ? esc(p.indice) : '?'}</span>`;
    }).join('');
    return `<div class="treasure-tracker">
      <p class="treasure-tracker-label">🗝️ Indices trouvés</p>
      <div class="treasure-chips">${chips}</div>
    </div>`;
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
      const allRevealed = SITE.treasureHunt && countRevealed(SITE, data)===SITE.points.length;
      let html = `
      <a class="back-link" href="index.html">← Retour au carnet de terrain</a>
      <div class="module-head">
        <p class="m-tag">🏔️ Carnet de terrain</p>
        <h1>${esc(SITE.title)}</h1>
        <p class="m-pages">${esc(SITE.altitude||'')}</p>
        <div class="m-bridge" style="--card-accent:var(--moss)">${SITE.contexte}</div>
      </div>`;
      if(SITE.treasureHunt && SITE.mission){
        html += `<div class="treasure-mission">
          <p class="treasure-mission-label">🗺️ Ta mission</p>
          ${SITE.mission}
        </div>`;
      }
      if(allRevealed){
        html += `<div class="treasure-complete">🏆 Chasse au trésor terminée ! Tu as reconstitué toute l'histoire du Chenaillet, indice après indice.</div>`;
      }
      html += renderTracker(SITE, data);
      html += `<p class="flash-progress carnet-counter">${countFilled(SITE, data)}/${SITE.points.length} points renseignés</p>
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
