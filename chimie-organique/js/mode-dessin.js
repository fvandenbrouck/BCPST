/*
 * Mode 6 — Reproduction de mémoire (cahier des charges §4, mode 6).
 * Pas de reconnaissance automatique de dessin : l'étudiante dessine sur
 * papier puis clique pour afficher la formule de référence et s'autoévalue
 * (même échelle à 3 niveaux que les flashcards, pour nourrir la même
 * répétition espacée).
 */
(function(){
  'use strict';
  const { esc, molFigure } = ChimorgApp;

  function buildPrompts(){
    const prompts = [];
    (window.CHIMORG_FAMILIES||[]).forEach(f=>{
      prompts.push({
        id:'dessin:fam:'+f.id,
        prompt:`Dessine le groupe caractéristique de la famille « ${f.name} ».`,
        img:f.img, caption:`${f.exampleName} — groupe : ${f.groupeCaracteristique}`
      });
    });
    const extra = [
      { id:'dessin:bio:acide-amine', prompt:"Dessine la structure générale d'un acide α-aminé.", img:'assets/mol/bio-acide-amine-general.svg', caption:'H2N–CH(R)–COOH' },
      { id:'dessin:bio:peptide', prompt:"Dessine une liaison peptidique entre deux acides aminés.", img:'assets/mol/bio-dipeptide.svg', caption:'Dipeptide Gly-Ala' },
      { id:'dessin:bio:triglyceride', prompt:"Dessine le squelette général d'un triglycéride (glycérol + 3 acides gras).", img:'assets/mol/bio-triglyceride.svg', caption:'Triglycéride' },
      { id:'dessin:bio:nucleotide', prompt:"Schématise la composition d'un nucléotide (3 blocs).", img:'assets/mol/bio-nucleotide-schema.svg', caption:'Phosphate — Pentose — Base azotée' }
    ];
    return prompts.concat(extra);
  }

  function render(container){
    const prompts = buildPrompts();
    const state = { order: shuffle(prompts.length), index:0, revealed:false };
    function shuffle(n){ const a=Array.from({length:n},(_,i)=>i); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

    function draw(){
      const p = prompts[state.order[state.index]];
      let html = `
        <a class="back-link" href="#/home">← Retour à l'accueil</a>
        <div class="module-head"><h1>Reproduction de mémoire</h1><p class="mol-caption" style="text-align:left;">Dessine sur papier, puis vérifie.</p></div>
        <p class="progress-tag">Consigne ${state.index+1}/${prompts.length}</p>
        <p class="dessin-prompt">${esc(p.prompt)}</p>`;

      if(!state.revealed){
        html += `<button class="btn primary block" id="revealBtn">Afficher la réponse</button>`;
      } else {
        html += molFigure(p.img, p.caption) + `<p class="mol-caption">${esc(p.caption)}</p>`;
        html += `<p style="text-align:center;margin:14px 0 6px;font-size:13.5px;color:var(--ink-soft);">As-tu bien reproduit cette structure ?</p>
          <div class="flash-actions">
            <button class="btn again" data-rate="again">À revoir</button>
            <button class="btn good" data-rate="good">Difficile</button>
            <button class="btn easy" data-rate="easy">Maîtrisé</button>
          </div>`;
      }
      container.innerHTML = html;

      const revealBtn = container.querySelector('#revealBtn');
      if(revealBtn) revealBtn.addEventListener('click', ()=>{ state.revealed = true; draw(); });
      container.querySelectorAll('[data-rate]').forEach(b=>{
        b.addEventListener('click', ()=>{
          ChimorgApp.reviewItem(p.id, b.dataset.rate);
          state.index = (state.index+1) % prompts.length;
          if(state.index===0) state.order = shuffle(prompts.length);
          state.revealed = false;
          draw();
        });
      });
    }
    draw();
  }

  ChimorgApp.route('mode/dessin', render);
})();
