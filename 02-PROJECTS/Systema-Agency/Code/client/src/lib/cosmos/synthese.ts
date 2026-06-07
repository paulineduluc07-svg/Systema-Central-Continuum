// synthese.ts — le cerveau du BRIEFING DU JOUR 🔮 (porté depuis synthese.py)
// -----------------------------------------------------------
// Il ne calcule RIEN de neuf : il reçoit ce que les autres cerveaux ont trouvé
// (lune, biorythmes, numéro, astro, cycle) et en tire la goutte la plus
// pertinente de chacun, pour composer un petit résumé en quelques phrases.
// 100 % vrai, zéro toc.
// -----------------------------------------------------------

import type { Lune } from "./lune";
import type { Biorythmes } from "./biorythmes";
import type { Numero } from "./numerologie";
import type { Astro } from "./astro";
import type { Cycle } from "./cycle";

type CycleNom = "physique" | "emotionnel" | "intellectuel";
const BIO: Array<[CycleNom, string]> = [
  ["physique", "physique"],
  ["emotionnel", "émotionnel"],
  ["intellectuel", "intellectuel"],
];

function quand(jours: number): string {
  if (jours === 0) return "aujourd'hui";
  if (jours === 1) return "demain";
  return `dans ${jours} j`;
}

export type Briefing = {
  phrases: string[];
  ton: { label: string; emoji: string; couleur: string };
};

export function briefing(
  lune: Lune,
  bio: Biorythmes,
  numero: Numero,
  astro: Astro,
  cycle?: Cycle | null,
): Briefing {
  const phrases: string[] = [];

  // 1) NUMÉRO — l'énergie d'action du jour (le « quoi faire »).
  const j = numero.jour;
  phrases.push(`🔢 ${j.texte} (ton jour personnel ${j.nombre} — « ${j.titre} »).`);

  // 2) LUNE — le climat énergétique du moment.
  phrases.push(`${lune.emoji} Lune ${lune.nom.toLowerCase()} (${lune.mouvement}) : ${lune.sens}`);

  // 3) BIORYTHMES — le cycle au top, celui en retrait, + alerte bascule ≤ 2 j.
  const haut = BIO.reduce((a, b) => (bio.cycles[b[0]].pourcentage > bio.cycles[a[0]].pourcentage ? b : a));
  const bas = BIO.reduce((a, b) => (bio.cycles[b[0]].pourcentage < bio.cycles[a[0]].pourcentage ? b : a));
  let phraseBio = `🌊 Corps : ton ${haut[1]} mène (${bio.cycles[haut[0]].pourcentage} %), ton ${bas[1]} est en retrait (${bio.cycles[bas[0]].pourcentage} %).`;
  const proches = BIO
    .filter(([cle]) => bio.cycles[cle].critique !== null && (bio.cycles[cle].critique as number) <= 2)
    .map(([cle, lbl]) => `${lbl} (${quand(bio.cycles[cle].critique as number)})`);
  if (proches.length) phraseBio += ` ⚠️ Bascule à surveiller : ${proches.join(", ")}.`;
  phrases.push(phraseBio);

  // 4) ASTRO — le ton du jour + le signe où passe la Lune.
  const ton = astro.tonJour;
  let phraseAstro = `${ton.emoji} Ton du ciel : ${ton.label}`;
  const luneSigne = astro.aujourdhui.find((p) => p.astre === "Lune");
  if (luneSigne) phraseAstro += `, la Lune passe en ${luneSigne.signe} ${luneSigne.emoji}`;
  phrases.push(phraseAstro + ".");

  // 5) CYCLE — seulement s'il est branché (sinon on n'invente rien).
  if (cycle && cycle.actif) {
    phrases.push(`🩸 Cycle : ${cycle.phase.nom} — ${cycle.phase.conseil}`);
  }

  // 6) ZOOM ARRIÈRE — le mois et l'année personnels.
  phrases.push(
    `🌌 Vue large : tu traverses un mois « ${numero.mois.titre} » dans une année « ${numero.annee.titre} ».`,
  );

  return { phrases, ton };
}
