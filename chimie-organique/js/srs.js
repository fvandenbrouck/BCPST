/*
 * Répétition espacée simplifiée (cahier des charges §6).
 * Ce N'EST PAS un algorithme Anki complet (pas de facteur de facilité
 * variable ni de file de cartes "learning"/"review" séparée) : c'est une
 * planification progressive à intervalles fixes J+1, J+3, J+7, J+14, J+30,
 * reculée en cas d'erreur et accélérée en cas de maîtrise répétée.
 *
 * Un "record" est conservé par item (question ou carte) :
 *   { shown, correct, wrong, lastReview, nextReview, mastery, streak }
 *   mastery ∈ [0..4] : 0 non vu, 1 découverte, 2 en cours, 3 en bonne voie,
 *   4 maîtrisé. streak = nombre de réussites consécutives.
 */
(function(){
  'use strict';
  const INTERVALS = [1, 3, 7, 14, 30]; // jours

  // Dates en heure locale (YYYY-MM-DD), jamais via toISOString() : cette
  // dernière convertit en UTC et peut décaler la date d'un jour selon le
  // fuseau horaire local au voisinage de minuit (bug constaté en tests).
  function fmt(d){
    const p = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
  }
  function today(){ return fmt(new Date()); }
  function addDays(dateStr, n){
    const [y,m,day] = dateStr.split('-').map(Number);
    const d = new Date(y, m-1, day);
    d.setDate(d.getDate() + n);
    return fmt(d);
  }

  function emptyRecord(){
    return { shown:0, correct:0, wrong:0, lastReview:null, nextReview:null, mastery:0, streak:0 };
  }

  // rating : 'again' (à revoir / erreur) | 'good' (difficile / correct) | 'easy' (maîtrisé)
  function review(record, rating){
    record = record ? Object.assign({}, record) : emptyRecord();
    record.shown += 1;
    const t = today();
    record.lastReview = t;
    if(rating === 'again'){
      record.wrong += 1;
      record.streak = 0;
      record.mastery = Math.max(0, record.mastery - 1);
      record.nextReview = addDays(t, 1);
    } else {
      record.correct += 1;
      record.streak += 1;
      const idx = rating === 'easy' ? record.streak : Math.max(0, record.streak - 1);
      const interval = INTERVALS[Math.min(idx, INTERVALS.length - 1)];
      record.mastery = Math.min(4, record.mastery + 1);
      record.nextReview = addDays(t, interval);
    }
    return record;
  }

  function isDue(record){
    if(!record || !record.nextReview) return true;
    return record.nextReview <= today();
  }

  function masteryLabel(level){
    return ['Non vu','Découverte','En cours','En bonne voie','Maîtrisé'][level] || 'Non vu';
  }

  window.ChimorgSRS = { review, isDue, today, addDays, emptyRecord, masteryLabel, INTERVALS };
})();
