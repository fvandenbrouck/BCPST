/*
 * Rendu des formules mathématiques (LaTeX) via KaTeX.
 * Les pages qui l'utilisent chargent KaTeX (CSS + JS + auto-render) en <head>,
 * de façon bloquante, pour garantir que window.renderMathInElement existe déjà
 * quand les moteurs (module-page.js, qcm-engine.js, flashcards-engine.js,
 * mindmap-engine.js) s'exécutent.
 *
 * Convention d'écriture dans les données de module : $...$ pour une formule en
 * ligne, $$...$$ pour une formule isolée. Toujours rappelé après chaque
 * réinjection de innerHTML, puisque KaTeX ne retypographie pas automatiquement
 * le contenu inséré dynamiquement.
 */
(function(){
  function render(container){
    if(!container || !window.renderMathInElement) return;
    renderMathInElement(container, {
      delimiters: [
        {left:'$$', right:'$$', display:true},
        {left:'$', right:'$', display:false}
      ],
      throwOnError:false
    });
  }
  window.MathRender = { render };
})();
