/*
 * Moteur carte mentale générique : construction libre de mémoire (jamais de modèle
 * pré-rempli) + comparaison optionnelle avec une carte modèle. Factorisé depuis le
 * module pilote. Contrat attendu : module.mindmapModel: {label, children:[...]}
 */
(function(){
  function esc(s){ return (s+'').replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  function render(target, mod, state, persist){
    const nodes = state.mindmap.nodes;
    const byParent = {};
    nodes.forEach(n=>{ (byParent[n.parentId]=byParent[n.parentId]||[]).push(n); });

    function renderNode(n){
      const kids = byParent[n.id]||[];
      let h = `<div class="node ${n.id==='root'?'root':''}">
        <span>${esc(n.label)}</span>
        ${n.id!=='root' ? `<button class="node-del" data-del="${n.id}">✕</button>` : ''}
      </div>`;
      if(kids.length){
        h += `<div class="children">${kids.map(renderNode).join('')}</div>`;
      }
      return h;
    }
    function renderModelNode(n){
      let h = `<div class="node">${esc(n.label)}</div>`;
      if(n.children && n.children.length){
        h += `<div class="children">${n.children.map(renderModelNode).join('')}</div>`;
      }
      return h;
    }

    const options = nodes.map(n=>`<option value="${n.id}">${esc(n.label)}</option>`).join('');

    let html = `
    <div class="card">
      <p style="font-size:13.5px;color:var(--ink-soft);margin:0 0 10px;">Construis ta carte <b>de mémoire</b>, sans relire le cours. Ajoute une branche, choisis à quel nœud existant la rattacher.</p>
      <div class="form-row">
        <input type="text" id="nodeLabel" placeholder="Nom de la notion...">
        <select id="nodeParent">${options}</select>
      </div>
      <button class="btn primary" id="addNode" style="width:100%;">+ Ajouter cette branche</button>
    </div>
    <div class="tree">${renderNode(nodes.find(n=>n.id==='root'))}</div>
    <div class="map-toolbar">
      <button class="btn ghost" id="toggleModel">${state.showModel?'Masquer la carte modèle':'Comparer avec une carte modèle'}</button>
    </div>`;
    if(state.showModel){
      html += `<div class="card"><p class="map-panel-title">Carte modèle (pour te corriger, pas pour copier avant)</p>
        <div class="tree">${renderModelNode(mod.mindmapModel)}</div>
      </div>`;
    }
    target.innerHTML = html;

    target.querySelector('#addNode').addEventListener('click', async ()=>{
      const label = target.querySelector('#nodeLabel').value.trim();
      const parentId = target.querySelector('#nodeParent').value;
      if(!label) return;
      state.mindmap.nodes.push({id:'n'+Date.now(), label, parentId});
      await persist();
      render(target, mod, state, persist);
    });
    target.querySelectorAll('[data-del]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const idToDelete = b.dataset.del;
        const toRemove = new Set([idToDelete]);
        let changed=true;
        while(changed){
          changed=false;
          state.mindmap.nodes.forEach(n=>{ if(toRemove.has(n.parentId) && !toRemove.has(n.id)){ toRemove.add(n.id); changed=true; } });
        }
        state.mindmap.nodes = state.mindmap.nodes.filter(n=>!toRemove.has(n.id));
        await persist();
        render(target, mod, state, persist);
      });
    });
    target.querySelector('#toggleModel').addEventListener('click', ()=>{ state.showModel=!state.showModel; render(target, mod, state, persist); });
  }

  window.MindmapEngine = { render };
})();
