// cycle.ts — le cerveau du CYCLE MENSTRUEL 🩸 (porté depuis cycle.py)
// -----------------------------------------------------------
// Différence avec les autres cartes : l'ancre (le « Jour 1 ») change chaque mois.
// On ne peut pas l'écrire en dur → la carte la mémorise (dans Neon ici, au lieu
// du fichier cycle.json du Python). Tant qu'il n'y a pas de Jour 1 → en attente.
// Le calcul ne démarre QUE quand tu cliques « mes règles ont commencé ». Vrai pas toc.
// -----------------------------------------------------------

const DUREE_CYCLE = 28; // longueur moyenne d'un cycle, en jours

// Les 4 phases : [nom, début, fin, emoji, titre, conseil, énergie].
const PHASES: ReadonlyArray<readonly [string, number, number, string, string, string, string]> = [
  ["menstruelle", 1, 5, "🩸", "Phase menstruelle",
    "Ton corps se repose et se renouvelle. Cocon, chaleur, douceur — écoute la fatigue sans culpabiliser.",
    "basse, introspective"],
  ["folliculaire", 6, 13, "🌱", "Phase folliculaire",
    "L'énergie remonte, l'envie de faire revient. Idéal pour lancer des projets, apprendre, bouger.",
    "montante, créative"],
  ["ovulatoire", 14, 16, "🌸", "Phase ovulatoire",
    "Ton pic d'énergie et de magnétisme. Sociale, rayonnante — ose ce qui demande du cran.",
    "haute, rayonnante"],
  ["lutéale", 17, 28, "🍵", "Phase lutéale",
    "L'énergie redescend en pente douce. Tri, finition, ancrage — ralentis vers la fin, prépare le nid.",
    "déclinante, nidification"],
];

export type Phase = { nom: string; emoji: string; titre: string; conseil: string; energie: string };
export type CycleActif = {
  actif: true;
  jour: number;
  duree: number;
  phase: Phase;
  joursAvantRegles: number;
  position: number;
  jour1: string;
};
export type CycleAttente = { actif: false };
export type Cycle = CycleActif | CycleAttente;

const modpos = (n: number, m: number) => ((n % m) + m) % m;

/** Nombre de jours calendaires entre deux dates (via UTC minuit). */
function joursEntre(jour1: Date, aujourd: Date): number {
  const a = Date.UTC(jour1.getFullYear(), jour1.getMonth(), jour1.getDate());
  const b = Date.UTC(aujourd.getFullYear(), aujourd.getMonth(), aujourd.getDate());
  return Math.round((b - a) / 86400000);
}

/** Le calcul pur : Jour 1 + aujourd'hui → phase, jour du cycle, etc. */
export function calculCycle(jour1: Date, aujourd: Date = new Date()): CycleActif {
  const ecart = joursEntre(jour1, aujourd);
  const jourCycle = modpos(ecart, DUREE_CYCLE) + 1; // repart à 1 après chaque tour

  let phase: Phase = {
    nom: PHASES[0][0], emoji: PHASES[0][3], titre: PHASES[0][4],
    conseil: PHASES[0][5], energie: PHASES[0][6],
  };
  for (const [nom, debut, fin, emoji, titre, conseil, energie] of PHASES) {
    if (jourCycle >= debut && jourCycle <= fin) {
      phase = { nom, emoji, titre, conseil, energie };
      break;
    }
  }

  const joursAvantRegles = DUREE_CYCLE - jourCycle + 1;
  const position = Math.round(((jourCycle - 1) / DUREE_CYCLE) * 100);

  const jour1Iso = `${jour1.getFullYear()}-${String(jour1.getMonth() + 1).padStart(2, "0")}-${String(jour1.getDate()).padStart(2, "0")}`;

  return { actif: true, jour: jourCycle, duree: DUREE_CYCLE, phase, joursAvantRegles, position, jour1: jour1Iso };
}
