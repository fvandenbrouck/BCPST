/*
 * Mode 2 — Tableau à trous (cahier des charges §4, mode 2).
 * Colonnes : Famille | Groupe caractéristique | Exemple structural |
 * Nom systématique | Préfixe/suffixe. 3 niveaux de difficulté (nombre de
 * colonnes masquées), correction ligne par ligne avec tolérance
 * typographique simple.
 */
(function(){
  'use strict';
  const { esc, molFigure } = ChimorgApp;

  const COLS = [
    { key:'famille', label:'Famille', get:f=>f.name },
    { key:'groupe', label:'Groupe caractéristique', get:f=>f.groupeCaracteristique },
    { key:'structure', label:'Exemple structural', get:f=>f.img, isImg:true },
    { key:'nom', label:'Nom systématique', get:f=>f.systematicName },
    { key:'suffixe', label:'Préfixe/suffixe', get:f=>f.suffix ? f.suffix : (f.prefix ? f.prefix : 'aucun au programme') }
  ];
  const LEVELS = {
    facile: { label:'Facile (1 colonne)', hidden:['nom'] },
    intermediaire: { label:'Intermédiaire (2 colonnes)', hidden:['nom','suffixe'] },
    difficile: { label:'Difficile (structures seules)', hidden:['famille','groupe','nom','suffixe'] }
  };

  const normalize = ChimorgApp.normalizeAnswer;

  function render(container){
    const families = window.CHIMORG_FAMILIES;
    const state = { level:'facile', answers:{}, corrected:false };

    function hiddenCols(){ return LEVELS[state.level].hidden; }

    function draw(){
      const hidden = hiddenCols();
      let html = `
        <a class="back-link" href="#/home">← Retour à l'accueil</a>
        <div class="module-head"><h1>Tableau à trous</h1><p class="mol-caption" style="text-align:left;">Module A — familles fonctionnelles</p></div>
        <div class="diff-toggle">
          ${Object.keys(LEVELS).map(k=>`<button data-lvl="${k}" class="${state.level===k?'active':''}">${esc(LEVELS[k].label)}</button>`).join('')}
        </div>
        <div style="overflow-x:auto;">
        <table class="trous-table"><thead><tr>${COLS.map(c=>`<th>${esc(c.label)}</th>`).join('')}</tr></thead><tbody>`;

      families.forEach(f=>{
        const key = f.id;
        const result = state.corrected ? checkRow(f) : null;
        const rowClass = result ? (result.allOk ? 'row-correct' : 'row-wrong') : '';
        html += `<tr class="${rowClass}">`;
        COLS.forEach(c=>{
          if(c.isImg){
            html += `<td class="cell-mol">${molFigure(f.img, f.exampleName, {small:true})}</td>`;
            return;
          }
          const isHidden = hidden.includes(c.key);
          if(!isHidden){
            html += `<td>${esc(c.get(f))}</td>`;
          } else if(!state.corrected){
            const val = (state.answers[key] && state.answers[key][c.key]) || '';
            html += `<td class="hidden-cell"><input type="text" data-row="${key}" data-col="${c.key}" value="${esc(val)}" placeholder="?"></td>`;
          } else {
            const ok = result.cols[c.key];
            html += `<td class="${ok?'':'row-wrong'}">${ok?'✓ ':'✗ '}${esc(c.get(f))}${ok?'':` <span class="mol-caption">(ta réponse : ${esc((state.answers[key]&&state.answers[key][c.key])||'—')})</span>`}</td>`;
          }
        });
        html += `</tr>`;
      });

      html += `</tbody></table></div>`;
      if(!state.corrected){
        html += `<button class="btn primary block" id="correctBtn" style="margin-top:14px;">Corriger ligne par ligne</button>`;
      } else {
        html += `<button class="btn block" id="retryBtn" style="margin-top:14px;">Recommencer</button>`;
      }
      container.innerHTML = html;

      container.querySelectorAll('[data-lvl]').forEach(b=>{
        b.addEventListener('click', ()=>{ state.level = b.dataset.lvl; state.answers={}; state.corrected=false; draw(); });
      });
      container.querySelectorAll('input[data-row]').forEach(inp=>{
        inp.addEventListener('input', ()=>{
          const r = inp.dataset.row, c = inp.dataset.col;
          state.answers[r] = state.answers[r] || {};
          state.answers[r][c] = inp.value;
        });
      });
      const correctBtn = container.querySelector('#correctBtn');
      if(correctBtn) correctBtn.addEventListener('click', ()=>{ state.corrected = true; draw(); window.scrollTo(0,0); });
      const retryBtn = container.querySelector('#retryBtn');
      if(retryBtn) retryBtn.addEventListener('click', ()=>{ state.answers={}; state.corrected=false; draw(); });
    }

    function checkRow(f){
      const hidden = hiddenCols();
      const cols = {};
      let allOk = true;
      hidden.forEach(key=>{
        const col = COLS.find(c=>c.key===key);
        const expected = normalize(col.get(f));
        const given = normalize((state.answers[f.id] && state.answers[f.id][key]) || '');
        const ok = given.length>0 && (given===expected || expected.indexOf(given)===0 && given.length>=Math.max(3,expected.length-2));
        cols[key] = ok;
        if(!ok) allOk = false;
      });
      return { cols, allOk };
    }

    draw();
  }

  ChimorgApp.route('mode/tableau', render);
})();
