// biorythmes.ts — le cerveau des BIORYTHMES 🌊 (porté depuis biorythmes.py)
// -----------------------------------------------------------
// À partir de la date de naissance, calcule où en sont les 3 cycles aujourd'hui :
//   - physique     → 23 jours
//   - émotionnel   → 28 jours
//   - intellectuel → 33 jours
// Chaque cycle est une vague (sinus) qui monte et descend depuis la naissance.
// -----------------------------------------------------------

const NAISSANCE = { annee: 1990, mois: 2, jour: 9 };

const CYCLES = {
  physique: 23,
  emotionnel: 28,
  intellectuel: 33,
} as const;

type CycleNom = keyof typeof CYCLES;

// Fenêtre du mini-graphe : -3 j (passé proche) à +21 j (futur proche).
const FENETRE_AVANT = 3;
const FENETRE_APRES = 21;

// Dimensions du dessin SVG.
const SVG_W = 300;
const SVG_H = 70;

/** Hauteur brute de la vague (-1 à 1) à un jour donné. */
function valeur(jours: number, periode: number): number {
  return Math.sin((2 * Math.PI * jours) / periode);
}

/** Transforme -1..1 en 0..100 %. */
function pct(v: number): number {
  return Math.round(((v + 1) / 2) * 100);
}

/** Petite lecture du jour selon la hauteur de la vague. */
function lecture(p: number): string {
  if (p >= 75) return "pic — profites-en à fond";
  if (p >= 55) return "en hausse, belle énergie";
  if (p > 45) return "neutre, jour de transition";
  if (p >= 25) return "en baisse, ménage-toi";
  return "creux — repos conseillé";
}

/** La vague monte (↗), descend (↘) ou est à un sommet/creux (→) ?
 *  La pente d'un sinus est un cosinus. */
function tendance(jours: number, periode: number): "↗" | "↘" | "→" {
  const pente = Math.cos((2 * Math.PI * jours) / periode);
  if (pente > 0.05) return "↗";
  if (pente < -0.05) return "↘";
  return "→";
}

/** Le prochain JOUR CRITIQUE : quand la vague traverse le milieu (change de signe). */
function prochainCritique(jours: number, periode: number): number | null {
  let precedente = valeur(jours, periode);
  for (let delta = 1; delta <= FENETRE_APRES; delta++) {
    const actuelle = valeur(jours + delta, periode);
    if (precedente === 0 || precedente * actuelle < 0) {
      return delta;
    }
    precedente = actuelle;
  }
  return null;
}

/** Les points "x,y" de la vague pour <polyline> (y inversé : haut = 100 %). */
function serieSvg(jours: number, periode: number): string {
  const total = FENETRE_AVANT + FENETRE_APRES;
  const points: string[] = [];
  for (let i = 0; i <= total; i++) {
    const d = jours - FENETRE_AVANT + i;
    const x = (i / total) * SVG_W;
    const p = pct(valeur(d, periode));
    const y = SVG_H - (p / 100) * SVG_H;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

export type Biorythme = {
  pourcentage: number;
  lecture: string;
  tendance: "↗" | "↘" | "→";
  critique: number | null;
  serie: string;
};

export type Biorythmes = {
  joursVecus: number;
  cycles: Record<CycleNom, Biorythme>;
  svg: { w: number; h: number; mid: number; todayX: number };
};

/** Calcule les 3 biorythmes pour une date donnée (par défaut : aujourd'hui). */
export function biorythmes(quand: Date = new Date()): Biorythmes {
  // Jours vécus depuis la naissance, comptés en jours calendaires.
  // On passe par des dates UTC à minuit pour éviter les décalages de fuseau/heure d'été.
  const naissanceUTC = Date.UTC(NAISSANCE.annee, NAISSANCE.mois - 1, NAISSANCE.jour);
  const quandUTC = Date.UTC(quand.getFullYear(), quand.getMonth(), quand.getDate());
  const joursVecus = Math.round((quandUTC - naissanceUTC) / 86400000);

  const cycles = {} as Record<CycleNom, Biorythme>;
  for (const nom of Object.keys(CYCLES) as CycleNom[]) {
    const periode = CYCLES[nom];
    const p = pct(valeur(joursVecus, periode));
    cycles[nom] = {
      pourcentage: p,
      lecture: lecture(p),
      tendance: tendance(joursVecus, periode),
      critique: prochainCritique(joursVecus, periode),
      serie: serieSvg(joursVecus, periode),
    };
  }

  const total = FENETRE_AVANT + FENETRE_APRES;
  const todayX = Math.round((FENETRE_AVANT / total) * SVG_W * 10) / 10;

  return {
    joursVecus,
    cycles,
    svg: { w: SVG_W, h: SVG_H, mid: SVG_H / 2, todayX },
  };
}
