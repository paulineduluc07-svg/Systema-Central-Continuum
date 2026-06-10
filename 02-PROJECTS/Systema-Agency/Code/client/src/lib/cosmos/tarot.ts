// tarot.ts — le cerveau de la CARTE TAROT DU JOUR 🃏
// -----------------------------------------------------------
// Un tirage par jour, le MÊME toute la journée : la date sert de graine
// à un petit générateur pseudo-aléatoire (mulberry32). Pas de stockage,
// pas de hasard qui change à chaque visite — et demain, nouvelle carte.
// -----------------------------------------------------------

import { ALL_TAROT_CARDS, type TarotCard } from "@/data/tarotCards";

export type Tirage = {
  carte: TarotCard;
  renversee: boolean;
  /** Le texte à afficher : upright ou reversed selon le tirage. */
  texte: string;
};

/** Petit PRNG déterministe : même graine → même suite de nombres. */
function mulberry32(graine: number): () => number {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** La carte du jour : déterministe pour une date donnée (78 cartes possibles). */
export function tirageDuJour(quand: Date = new Date()): Tirage {
  const graine =
    quand.getFullYear() * 10000 + (quand.getMonth() + 1) * 100 + quand.getDate();
  const alea = mulberry32(graine);
  alea(); // un tour à vide pour décorréler les graines voisines (dates consécutives)
  const carte = ALL_TAROT_CARDS[Math.floor(alea() * ALL_TAROT_CARDS.length)];
  const renversee = alea() < 0.35; // environ 1 tirage sur 3 sort renversé
  return { carte, renversee, texte: renversee ? carte.reversed : carte.upright };
}
