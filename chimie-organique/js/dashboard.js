/*
 * Page d'accueil : tableau de bord + 6 cartes de mode + bibliothèque de
 * fiches. cf. cahier des charges §7 — ne confond pas performance récente
 * (sessions, % de réussite) et mémorisation durable (niveau de maîtrise
 * issu de la répétition espacée, cf. js/srs.js).
 */
(function(){
  'use strict';
  const { esc } = ChimorgApp;

  const MODULE_LABEL = { A:'Module A — Familles', B:'Module B — Vivant', C:'Module C — Nomenclature' };

  function buildIdModuleMap(){
    const map = {};
    ChimorgApp.allQuestions().forEach(q=>{ map[q.id] = q.module; });
    ChimorgApp.buildDeck().forEach(c=>{ map[c.id] = c.module; });
    return map;
  }

  function computeStats(){
    const items = ChimorgApp.loadItems();
    const idModule = buildIdModuleMap();
    const ids = Object.keys(items);
    let mastered=0, enCours=0, dueToday=0;
    const byModule = { A:{correct:0,wrong:0}, B:{correct:0,wrong:0}, C:{correct:0,wrong:0} };
    ids.forEach(id=>{
      const r = items[id];
      if(!r || !r.shown) return;
      if(r.mastery>=4) mastered++;
      else if(r.mastery>=1) enCours++;
      if(ChimorgSRS.isDue(r)) dueToday++;
      const mod = idModule[id];
      if(mod && byModule[mod]){ byModule[mod].correct += r.correct; byModule[mod].wrong += r.wrong; }
    });
    return { mastered, enCours, dueToday, byModule, totalTracked: ids.length };
  }

  function pct(c,w){ const t=c+w; return t? Math.round(c/t*100) : null; }

  function renderDashboard(container){
    const totalQuestions = ChimorgApp.allQuestions().length;
    const deckSize = ChimorgApp.buildDeck().length;
    const stats = computeStats();
    const sessions = ChimorgApp.loadSessions().slice().reverse().slice(0,8);
    const profile = ChimorgProfile.getActiveProfile();

    const modeCards = [
      { href:'#/mode/flashcards', icon:'🗂️', title:'Flashcards interactives', desc:"Retourne la carte, autoévalue-toi (à revoir / difficile / maîtrisé).", accent:'var(--rust)' },
      { href:'#/mode/tableau', icon:'🧮', title:'Tableau à trous', desc:"Retrouve famille, groupe, structure, nom et préfixe/suffixe.", accent:'var(--ochre)' },
      { href:'#/mode/reconnaissance', icon:'🔬', title:'Reconnaissance de groupes', desc:"Identifie le ou les groupes caractéristiques d'une molécule.", accent:'var(--moss)' },
      { href:'#/mode/nomenclature', icon:'🏷️', title:'Exercices de nomenclature', desc:"Nomme une molécule à partir de sa formule topologique.", accent:'var(--slate)' },
      { href:'#/mode/quiz', icon:'⚡', title:'Quiz rapide', desc:"Séries de 5, 10 ou 20 questions mélangées, avec correction détaillée.", accent:'var(--rust-deep)' },
      { href:'#/mode/dessin', icon:'✏️', title:'Reproduction de mémoire', desc:"Dessine sur papier, puis vérifie la formule de référence.", accent:'var(--ink-soft)' }
    ];

    container.innerHTML = `
      <div class="hero">
        <p class="eyebrow">Chimie organique · BCPST 1${profile ? ' · '+esc(profile.name) : ''}</p>
        <h1>${profile ? 'Bonjour '+esc(profile.name)+' 👋' : 'Chimie organique — BCPST Trainer'}</h1>
        <p>CC03 — Familles d'entités chimiques organiques et nomenclature. Révise par rappel actif et répétition espacée, 10 à 20 minutes par jour.</p>
      </div>

      <div class="stat-grid">
        <div class="stat-tile"><div class="v">${totalQuestions}</div><div class="l">Questions disponibles</div></div>
        <div class="stat-tile"><div class="v">${stats.mastered}</div><div class="l">Notions maîtrisées</div></div>
        <div class="stat-tile"><div class="v">${stats.enCours}</div><div class="l">À revoir</div></div>
        <div class="stat-tile"><div class="v">${stats.dueToday}</div><div class="l">Révisions dues aujourd'hui</div></div>
      </div>

      <div class="cta-row">
        <a class="cta" href="#/mode/quiz?filter=due" style="--card-accent:var(--moss)">Révisions du jour <span class="badge">${stats.dueToday}</span></a>
        <a class="cta" href="#/mode/quiz?filter=errors" style="--card-accent:var(--rust)">Réviser mes erreurs <span class="badge ghost">↻</span></a>
      </div>

      <p class="section-title">Pourcentage de réussite par module</p>
      <div class="module-progress">
        ${['A','B','C'].map(m=>{
          const p = pct(stats.byModule[m].correct, stats.byModule[m].wrong);
          return `<div class="mp-row"><span class="mp-label">${esc(MODULE_LABEL[m])}</span>
            <span class="mp-bar"><span style="width:${p===null?0:p}%"></span></span>
            <span class="mp-pct">${p===null?'—':p+'%'}</span></div>`;
        }).join('')}
      </div>

      <p class="section-title">Modes d'entraînement</p>
      <div class="mode-grid">
        ${modeCards.map(m=>`
          <a class="mode-card" href="${m.href}" style="--card-accent:${m.accent}">
            <span class="mc-icon">${m.icon}</span>
            <p class="mc-title">${esc(m.title)}</p>
            <p class="mc-desc">${esc(m.desc)}</p>
          </a>`).join('')}
      </div>

      <a class="lib-link" href="#/fiches">📚 Bibliothèque de fiches de référence (Modules A, B, C)</a>

      <p class="section-title">Historique des dernières séances</p>
      ${sessions.length ? `<ul class="history-list">${sessions.map(s=>`
        <li><span>${esc(new Date(s.date).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'2-digit'}))} · ${esc(s.mode)}</span><span>${s.score}/${s.total} (${s.pct}%)</span></li>
      `).join('')}</ul>` : `<p class="empty">Aucune séance enregistrée pour l'instant — lance un quiz ou des exercices de nomenclature pour commencer l'historique.</p>`}

      <p class="section-title">Données</p>
      <div class="btn-row">
        <button class="btn" id="exportBtn">Exporter ma progression (JSON)</button>
        <button class="btn" id="importBtn">Importer une progression</button>
        <input type="file" id="importFile" accept="application/json" style="display:none;">
      </div>
      <p class="footer-note">${deckSize} flashcards générées à partir des fiches · ${totalQuestions} questions (Modules A, B, C) · Les renvois de page correspondent au CC03 (Lycée Marcelin Berthelot, 2026-2027).</p>
    `;

    document.getElementById('exportBtn').addEventListener('click', ()=>{
      const blob = new Blob([ChimorgApp.exportProgress()], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const who = profile ? ChimorgProfile.slugify(profile.name) : 'progression';
      a.href = url; a.download = 'chimie-organique-'+who+'.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    document.getElementById('importBtn').addEventListener('click', ()=> document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try{
          ChimorgApp.importProgress(reader.result);
          alert('Progression importée avec succès.');
          renderDashboard(container);
        }catch(err){ alert("Fichier invalide : impossible d'importer cette progression."); }
      };
      reader.readAsText(file);
    });
  }

  ChimorgApp.route('home', renderDashboard);
  window.ChimorgDashboard = { computeStats, buildIdModuleMap };
})();
