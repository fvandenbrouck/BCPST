/*
 * Thermodynamique — fonctions pures (aucun accès au DOM). Système fermé
 * {gaz + piston}, cylindre horizontal, frottements négligés. Convention de
 * signe : W et Q comptés positivement quand le système les reçoit,
 * ΔU = W + Q. Toutes les grandeurs sont en unités SI (Pa, m³, K, J) ; les
 * couches UI (js/app.js, js/atelier-*.js) convertissent vers/depuis litres,
 * bars, etc.
 */
(function () {
  const P0 = 1.00e5; // Pa
  const V0 = 1.00e-3; // m³ (1,00 L)
  const T0 = 300; // K
  const NR = P0 * V0 / T0; // J/K (= nR, ≈ 1/3 J/K)

  const CV_MONO = 1.5 * NR; // C_v = 3nR/2
  const CV_DI = 2.5 * NR; // C_v = 5nR/2
  function cpOf(cv) { return cv + NR; } // relation de Mayer : C_p − C_v = nR
  function gammaOf(cv) { return cpOf(cv) / cv; }
  const GAMMA_MONO = gammaOf(CV_MONO); // 5/3
  const GAMMA_DI = gammaOf(CV_DI); // 7/5

  // ---------------------------------------------------------------- GAZ PARFAIT
  function pressionDe(V, T) { return NR * T / V; }
  function volumeDe(P, T) { return NR * T / P; }
  function temperatureDe(P, V) { return P * V / NR; }

  // ---------------------------------------------------------------- ISOTHERME QUASI-STATIQUE
  function isotherme(Vi, Vf, T) {
    const Pi = pressionDe(Vi, T), Pf = pressionDe(Vf, T);
    const W = -NR * T * Math.log(Vf / Vi);
    const Q = -W; // dU = 0 pour un gaz parfait à température constante
    return { Pi, Vi, Ti: T, Pf, Vf, Tf: T, W, Q, dU: 0, dH: null };
  }

  // ---------------------------------------------------------------- ÉVOLUTION BRUTALE MONOBARE
  // Transfert thermique Q imposé par l'extérieur (ou thermostat, cf. ci-dessous).
  // Pendant le mouvement la pression du gaz n'est pas définie : seuls les états
  // initial et final existent, avec P_f = P_a (pression extérieure imposée).
  function brutalMonobareQImpose(Pi, Vi, Ti, Pa, Q, Cv) {
    const Tf = (Cv * Ti + Pa * Vi + Q) / (Cv + NR);
    const Vf = volumeDe(Pa, Tf);
    const W = -Pa * (Vf - Vi);
    const dU = Cv * (Tf - Ti);
    const dH = Math.abs(Pi - Pa) < 1e-6 * Pa ? Q : null; // licite seulement si P_i = P_f = P_a
    return { Pi, Vi, Ti, Pf: Pa, Vf, Tf, W, Q, dU, dH };
  }

  // Thermostat à la température Teq (le gaz revient, en fin d'évolution, à Teq).
  function brutalThermostat(Pi, Vi, Ti, Pa, Teq, Cv) {
    const Tf = Teq;
    const Vf = volumeDe(Pa, Tf);
    const W = -Pa * (Vf - Vi);
    const dU = Cv * (Tf - Ti);
    const Q = dU - W;
    const dH = Math.abs(Pi - Pa) < 1e-6 * Pa ? Q : null;
    return { Pi, Vi, Ti, Pf: Pa, Vf, Tf, W, Q, dU, dH };
  }

  // ---------------------------------------------------------------- SEGMENTS QUASI-STATIQUES (atelier 2)
  function segmentIsotherme(Vi, Vf, T) { return isotherme(Vi, Vf, T); }

  function segmentIsobare(Pi, Vi, Ti, Vf, Cv) {
    const Pf = Pi;
    const Tf = temperatureDe(Pf, Vf);
    const W = -Pi * (Vf - Vi);
    const dU = Cv * (Tf - Ti);
    const Q = dU - W;
    return { Pi, Vi, Ti, Pf, Vf, Tf, W, Q, dU, dH: Q };
  }

  function segmentIsochore(Pi, Vi, Ti, Pf, Cv) {
    const Vf = Vi;
    const Tf = temperatureDe(Pf, Vf);
    const dU = Cv * (Tf - Ti);
    return { Pi, Vi, Ti, Pf, Vf, Tf, W: 0, Q: dU, dU, dH: null };
  }

  // P·V^γ = constante, jamais démontrée (formule fournie) : loi de Laplace.
  function segmentAdiabatiqueReversibleVersV(Pi, Vi, Ti, Vf, gamma, Cv) {
    const Pf = Pi * Math.pow(Vi / Vf, gamma);
    const Tf = temperatureDe(Pf, Vf);
    const dU = Cv * (Tf - Ti);
    return { Pi, Vi, Ti, Pf, Vf, Tf, W: dU, Q: 0, dU, dH: null };
  }

  function segmentAdiabatiqueReversibleVersP(Pi, Vi, Ti, Pf, gamma, Cv) {
    const Vf = Vi * Math.pow(Pi / Pf, 1 / gamma);
    const Tf = temperatureDe(Pf, Vf);
    const dU = Cv * (Tf - Ti);
    return { Pi, Vi, Ti, Pf, Vf, Tf, W: dU, Q: 0, dU, dH: null };
  }

  // Intégrale numérique (trapèzes) de -P dV le long de l'adiabatique P = Pi(Vi/V)^γ,
  // pour vérifier W = C_v ΔT indépendamment du premier principe.
  function integraleAdiabatique(Pi, Vi, Vf, gamma, steps) {
    steps = steps || 4000;
    let W = 0;
    const dV = (Vf - Vi) / steps;
    let Va = Vi, Pa = Pi;
    for (let i = 0; i < steps; i++) {
      const Vb = Vi + (i + 1) * dV;
      const Pb = Pi * Math.pow(Vi / Vb, gamma);
      W += -0.5 * (Pa + Pb) * (Vb - Va);
      Va = Vb; Pa = Pb;
    }
    return W;
  }

  // ---------------------------------------------------------------- ISOCHORE / ISOBARE PILOTÉS PAR Q (atelier 1)
  function isochoreFromQ(Pi, Vi, Ti, Q, Cv) {
    const Tf = Ti + Q / Cv;
    const Pf = pressionDe(Vi, Tf);
    return { Pi, Vi, Ti, Pf, Vf: Vi, Tf, W: 0, Q, dU: Q, dH: null };
  }

  function isobareFromQ(Pi, Vi, Ti, Q, Cv) {
    const Cp = cpOf(Cv);
    const Tf = Ti + Q / Cp;
    const Vf = volumeDe(Pi, Tf);
    const W = -Pi * (Vf - Vi);
    const dU = Cv * (Tf - Ti);
    return { Pi, Vi, Ti, Pf: Pi, Vf, Tf, W, Q, dU, dH: Q };
  }

  // ---------------------------------------------------------------- DÉTENTE DE JOULE–GAY-LUSSAC
  // Détente dans le vide, système isolé : aucun travail, aucun transfert
  // thermique, gaz parfait -> température inchangée.
  function jouleGayLussac(Pi, Vi, Ti, Vf) {
    const Pf = pressionDe(Vf, Ti);
    return { Pi, Vi, Ti, Pf, Vf, Tf: Ti, W: 0, Q: 0, dU: 0, dH: null };
  }

  // ---------------------------------------------------------------- CHEMIN LIBRE (atelier 2)
  // points : [{P, V}, ...] en unités SI, dans l'ordre de parcours. Travail
  // élémentaire de chaque segment par la méthode des trapèzes (-∫P dV),
  // transfert thermique déduit du premier principe sur le segment.
  function cheminLibre(points, Cv) {
    const segments = [];
    let W = 0, Q = 0, dU = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      const Ta = temperatureDe(a.P, a.V), Tb = temperatureDe(b.P, b.V);
      const Wseg = -0.5 * (a.P + b.P) * (b.V - a.V);
      const dUseg = Cv * (Tb - Ta);
      const Qseg = dUseg - Wseg;
      segments.push({ Pi: a.P, Vi: a.V, Ti: Ta, Pf: b.P, Vf: b.V, Tf: Tb, W: Wseg, Q: Qseg, dU: dUseg });
      W += Wseg; Q += Qseg; dU += dUseg;
    }
    return { segments, W, Q, dU };
  }

  window.ThermoPhysics = {
    P0, V0, T0, NR,
    CV_MONO, CV_DI, GAMMA_MONO, GAMMA_DI,
    cpOf, gammaOf,
    pressionDe, volumeDe, temperatureDe,
    isotherme,
    brutalMonobareQImpose, brutalThermostat,
    segmentIsotherme, segmentIsobare, segmentIsochore,
    segmentAdiabatiqueReversibleVersV, segmentAdiabatiqueReversibleVersP,
    integraleAdiabatique,
    isochoreFromQ, isobareFromQ,
    jouleGayLussac,
    cheminLibre
  };
})();
