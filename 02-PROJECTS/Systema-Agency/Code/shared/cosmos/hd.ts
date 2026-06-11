// hd.ts — le cerveau du HUMAN DESIGN 🧬 (porté depuis human_design.py)
// -----------------------------------------------------------
// Vraie astro (astronomy-engine) + logique de "circuit" :
//   1) 13 astres → PORTE (1–64), calculé 2 fois : Personnalité (naissance) et
//      Design (Soleil 88° en arrière).
//   2) Les portes allument des CANAUX → des CENTRES (9 organes).
//   3) Les centres définis donnent le Type, l'Autorité, la Définition, le Profil.
// -----------------------------------------------------------

import * as astronomyEngine from "astronomy-engine";
import type { AstroTime } from "astronomy-engine";

// Interop CJS/ESM : Vite, vitest et Node moderne chargent la build ESM du paquet
// (exports nommés) ; le runtime Vercel charge la build CJS (tout sur `default`).
// On déstructure depuis celui des deux qui existe — sinon ça crashe en prod (vu le 2026-06-11).
const { Body, GeoVector, Rotation_EQJ_ECT, RotateVector, MakeTime } =
  (astronomyEngine as { default?: typeof astronomyEngine }).default ?? astronomyEngine;
type Body = import("astronomy-engine").Body;

// Naissance : 9 février 1990, 14h45 à Montpellier → 13h45 UTC.
const ANNEE = 1990;
const MOIS = 2;
const JOUR = 9;
const HEURE_UTC = 13;
const MINUTE_UTC = 45;

// Le cadran des 64 portes (le "mandala") — l'ordre n'est pas numérique.
const ORDRE_DES_PORTES = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36,
  25, 17, 21, 51, 42, 3, 27, 24, 2, 23,
  8, 20, 16, 35, 45, 12, 15, 52, 39, 53,
  62, 56, 31, 33, 7, 4, 29, 59, 40, 64,
  47, 6, 46, 18, 48, 57, 32, 50, 28, 44,
  1, 43, 14, 34, 9, 5, 26, 11, 10, 58,
  38, 54, 61, 60,
];
const DEBUT_DU_CADRAN = 302.0;
const TAILLE_PORTE = 360 / 64;
const TAILLE_LIGNE = TAILLE_PORTE / 6;

// Les 36 canaux : porte A, porte B, centre A, centre B.
const CANAUX: ReadonlyArray<readonly [number, number, string, string]> = [
  [1, 8, "G", "Gorge"], [2, 14, "G", "Sacral"],
  [3, 60, "Sacral", "Racine"], [4, 63, "Ajna", "Tête"],
  [5, 15, "Sacral", "G"], [6, 59, "Plexus solaire", "Sacral"],
  [7, 31, "G", "Gorge"], [9, 52, "Sacral", "Racine"],
  [10, 20, "G", "Gorge"], [10, 34, "G", "Sacral"],
  [10, 57, "G", "Rate"], [11, 56, "Ajna", "Gorge"],
  [12, 22, "Gorge", "Plexus solaire"], [13, 33, "G", "Gorge"],
  [16, 48, "Gorge", "Rate"], [17, 62, "Ajna", "Gorge"],
  [18, 58, "Rate", "Racine"], [19, 49, "Racine", "Plexus solaire"],
  [20, 34, "Gorge", "Sacral"], [20, 57, "Gorge", "Rate"],
  [21, 45, "Cœur", "Gorge"], [23, 43, "Gorge", "Ajna"],
  [24, 61, "Ajna", "Tête"], [25, 51, "G", "Cœur"],
  [26, 44, "Cœur", "Rate"], [27, 50, "Sacral", "Rate"],
  [28, 38, "Rate", "Racine"], [29, 46, "Sacral", "G"],
  [30, 41, "Plexus solaire", "Racine"], [32, 54, "Rate", "Racine"],
  [34, 57, "Sacral", "Rate"], [35, 36, "Gorge", "Plexus solaire"],
  [37, 40, "Plexus solaire", "Cœur"], [39, 55, "Racine", "Plexus solaire"],
  [42, 53, "Sacral", "Racine"], [47, 64, "Ajna", "Tête"],
];

const MOTEURS = new Set(["Sacral", "Plexus solaire", "Cœur", "Racine"]);

const PORTES_INFOS: Record<number, { nom: string; cle: string }> = {
  1: { nom: "Le Créatif", cle: "l'expression de soi, la créativité brute" },
  2: { nom: "Le Réceptif", cle: "la direction, savoir où l'on va" },
  3: { nom: "L'Ordonnancement", cle: "l'ordre qui naît du chaos des débuts" },
  4: { nom: "La Formulation", cle: "les réponses, la logique mentale" },
  5: { nom: "Les Rythmes Fixes", cle: "l'attente, les routines naturelles" },
  6: { nom: "Le Conflit", cle: "la friction, l'intimité émotionnelle" },
  7: { nom: "Le Rôle du Soi", cle: "le leadership discret, guider" },
  8: { nom: "La Contribution", cle: "apporter sa part, montrer l'exemple" },
  9: { nom: "Le Focus", cle: "le pouvoir du détail, la concentration" },
  10: { nom: "Le Comportement du Soi", cle: "l'amour de soi, être pleinement soi-même" },
  11: { nom: "Les Idées", cle: "le flot d'idées à partager" },
  12: { nom: "La Prudence", cle: "l'articulation, parler au bon moment" },
  13: { nom: "L'Écoutant", cle: "recueillir les histoires, le témoin" },
  14: { nom: "Le Pouvoir des Compétences", cle: "la force de travail, diriger les ressources" },
  15: { nom: "Les Extrêmes", cle: "l'humilité, l'amour de l'humanité, le flux" },
  16: { nom: "Les Talents", cle: "l'enthousiasme, la maîtrise par la répétition" },
  17: { nom: "Les Opinions", cle: "les idées logiques, anticiper" },
  18: { nom: "La Correction", cle: "le sens de ce qui peut être amélioré" },
  19: { nom: "Le Besoin", cle: "la sensibilité aux besoins, l'approche" },
  20: { nom: "Le Présent", cle: "l'instant, le « maintenant », l'action consciente" },
  21: { nom: "Le Chasseur", cle: "le contrôle, gérer les ressources" },
  22: { nom: "La Grâce", cle: "l'ouverture, le charme émotionnel" },
  23: { nom: "L'Assimilation", cle: "traduire l'insight en mots clairs" },
  24: { nom: "La Rationalisation", cle: "revenir, donner un sens" },
  25: { nom: "L'Esprit du Soi", cle: "l'amour universel, l'innocence" },
  26: { nom: "Le Transmetteur", cle: "la volonté, convaincre, l'ego" },
  27: { nom: "Le Soin", cle: "nourrir, prendre soin des autres" },
  28: { nom: "Le Joueur", cle: "le risque, donner un sens à la vie" },
  29: { nom: "Le Oui", cle: "l'engagement, la persévérance" },
  30: { nom: "Le Désir", cle: "les feux du désir, les rêves" },
  31: { nom: "Le Leadership", cle: "l'influence, mener par la voix" },
  32: { nom: "La Continuité", cle: "l'instinct de durer, la peur de l'échec" },
  33: { nom: "La Retraite", cle: "le retrait, la mémoire, l'intimité" },
  34: { nom: "Le Pouvoir", cle: "la force pure, l'énergie qui agit" },
  35: { nom: "Le Changement", cle: "le progrès, l'expérience, « j'ai déjà tout fait »" },
  36: { nom: "La Crise", cle: "la nouveauté émotionnelle, les turbulences" },
  37: { nom: "La Famille", cle: "l'amitié, les liens, les ententes" },
  38: { nom: "Le Combattant", cle: "lutter pour ce qui a du sens" },
  39: { nom: "La Provocation", cle: "provoquer pour révéler l'esprit" },
  40: { nom: "La Solitude", cle: "le besoin d'être seul après l'effort" },
  41: { nom: "La Contraction", cle: "le fantasme, le début de toute expérience" },
  42: { nom: "La Croissance", cle: "mener les cycles à terme, la maturation" },
  43: { nom: "L'Insight", cle: "la connaissance intérieure, le « eurêka »" },
  44: { nom: "La Vigilance", cle: "le flair, reconnaître les patterns" },
  45: { nom: "Le Roi / La Reine", cle: "rassembler, diriger la tribu" },
  46: { nom: "L'Amour du Corps", cle: "la détermination, la sérendipité" },
  47: { nom: "La Réalisation", cle: "donner un sens à la confusion" },
  48: { nom: "La Profondeur", cle: "le puits du talent, la solution" },
  49: { nom: "Les Principes", cle: "la révolution, les principes, rejeter/accepter" },
  50: { nom: "Les Valeurs", cle: "les lois, la responsabilité, le gardien" },
  51: { nom: "Le Choc", cle: "l'éveil par le choc, l'audace" },
  52: { nom: "L'Immobilité", cle: "la concentration tranquille, l'inaction" },
  53: { nom: "Les Débuts", cle: "lancer les cycles, le démarrage" },
  54: { nom: "L'Ambition", cle: "la drive, l'ascension, la transformation" },
  55: { nom: "L'Abondance", cle: "l'esprit, les humeurs, la liberté émotionnelle" },
  56: { nom: "Le Voyageur", cle: "la stimulation, raconter, chercher" },
  57: { nom: "L'Intuition", cle: "la clarté intuitive de l'instant" },
  58: { nom: "La Vitalité", cle: "la joie de vivre, l'envie d'améliorer" },
  59: { nom: "L'Intimité", cle: "la sexualité, briser les barrières" },
  60: { nom: "L'Acceptation", cle: "la limitation comme tremplin de mutation" },
  61: { nom: "Le Mystère", cle: "la vérité intérieure, le besoin de savoir" },
  62: { nom: "Les Détails", cle: "l'organisation, nommer les choses" },
  63: { nom: "Le Doute", cle: "le questionnement logique, vérifier" },
  64: { nom: "La Confusion", cle: "le flot d'images mentales à clarifier" },
};

const TYPE_INFOS: Record<string, { emoji: string; strategie: string; nonSoi: string; signature: string; phrase: string }> = {
  "Générateur": { emoji: "🔋", strategie: "Répondre", nonSoi: "Frustration", signature: "Satisfaction", phrase: "Ton énergie est faite pour répondre à la vie, pas pour la forcer." },
  "Générateur Manifesteur": { emoji: "⚡", strategie: "Répondre, puis informer", nonSoi: "Frustration & colère", signature: "Satisfaction", phrase: "Multi-passionnée : réponds à ce qui t'allume, puis informe avant de bondir." },
  "Projecteur": { emoji: "👁️", strategie: "Attendre l'invitation", nonSoi: "Amertume", signature: "Succès", phrase: "Ton don, c'est de voir et de guider. Garde ton énergie pour ce qui t'invite et te reconnaît vraiment." },
  "Manifesteur": { emoji: "🔥", strategie: "Informer avant d'agir", nonSoi: "Colère", signature: "Paix", phrase: "Tu es faite pour initier. Informe ton entourage, puis lance." },
  "Réflecteur": { emoji: "🌙", strategie: "Attendre un cycle lunaire", nonSoi: "Déception", signature: "Surprise", phrase: "Miroir rare de ton environnement : laisse une lune entière éclairer tes grandes décisions." },
};

const CENTRE_SENS: Record<string, { emoji: string; titre: string; sens: string }> = {
  "Tête": { emoji: "💡", titre: "Tête", sens: "inspiration et grandes questions qui montent" },
  "Ajna": { emoji: "🧠", titre: "Ajna", sens: "mental plus affûté, les idées se structurent" },
  "Gorge": { emoji: "🗣️", titre: "Gorge", sens: "plus d'élan à t'exprimer et à communiquer" },
  "G": { emoji: "🧭", titre: "G / Identité", sens: "direction et sens de soi plus clairs aujourd'hui" },
  "Cœur": { emoji: "💪", titre: "Cœur / Ego", sens: "volonté et envie de prouver plus fortes" },
  "Sacral": { emoji: "🟠", titre: "Sacral", sens: "énergie empruntée — surfe-la sans t'engager comme si c'était permanent" },
  "Plexus solaire": { emoji: "❤️", titre: "Plexus solaire", sens: "émotions plus vives — vague à surfer, pas à subir" },
  "Rate": { emoji: "🛡️", titre: "Rate", sens: "intuition et instinct du moment plus présents" },
  "Racine": { emoji: "⚡", titre: "Racine", sens: "pression et carburant pour agir, à doser" },
};

const CENTRE_INFOS: Record<string, { role: string; defini: string; ouvert: string }> = {
  "Tête": { role: "Inspiration & pression mentale", defini: "Une façon stable de t'inspirer et de te poser des questions.", ouvert: "Tu absorbes les questions et la pression mentale des autres — tout n'a pas à être résolu." },
  "Ajna": { role: "Conceptualisation & certitude", defini: "Une manière de penser et de conceptualiser constante, à toi.", ouvert: "Mental flexible : tu vois tous les angles, sans avoir à être sûre en permanence." },
  "Gorge": { role: "Communication & manifestation", defini: "Une voix et une expression fiables, bien à toi.", ouvert: "Tu adaptes ta façon de parler ; attention à t'exprimer juste pour attirer l'attention." },
  "G": { role: "Identité, amour & direction", defini: "Une identité et une direction stables, un cap intérieur.", ouvert: "Identité fluide : ta direction dépend du bon environnement et des bonnes personnes." },
  "Cœur": { role: "Volonté & valeur", defini: "Une volonté constante ; tu peux promettre et tenir.", ouvert: "Rien à prouver : évite les promesses faites sous pression pour prouver ta valeur." },
  "Sacral": { role: "Énergie de vie & travail", defini: "Un moteur d'énergie vitale renouvelable.", ouvert: "Énergie empruntée et non fiable : tu sais quand tu en as assez donné — ne te brûle pas." },
  "Plexus solaire": { role: "Émotions & sensibilité", defini: "Tes propres vagues émotionnelles, vécues de l'intérieur.", ouvert: "Tu absorbes et amplifies les émotions des autres ; évite de décider à chaud." },
  "Rate": { role: "Intuition, instinct & bien-être", defini: "Une intuition fiable dans l'instant et un radar de santé intégré.", ouvert: "Tu captes le bien-être ambiant ; attention à t'accrocher à ce qui n'est pas bon pour toi." },
  "Racine": { role: "Pression, stress & élan d'agir", defini: "Tu gères la pression à ton rythme, comme un carburant maîtrisé.", ouvert: "Tu absorbes le stress ambiant ; la hâte d'« en finir » vient souvent des autres." },
};

const norm360 = (x: number) => ((x % 360) + 360) % 360;
const deg = (r: number) => (r * 180) / Math.PI;

/** Longitude écliptique DE LA DATE d'un astre (comme skyfield epoch="date"). */
function longitudeEcl(body: Body, time: AstroTime): number {
  const vec = GeoVector(body, time, true);
  const rot = Rotation_EQJ_ECT(time);
  const ecl = RotateVector(rot, vec);
  return norm360(deg(Math.atan2(ecl.y, ecl.x)));
}

/** Position dans le ciel (degrés) → [porte, ligne]. */
function longitudeVersPorte(longitude: number): [number, number] {
  const distance = norm360(longitude - DEBUT_DU_CADRAN);
  const porte = ORDRE_DES_PORTES[Math.floor(distance / TAILLE_PORTE)];
  const ligne = Math.floor((distance % TAILLE_PORTE) / TAILLE_LIGNE) + 1;
  return [porte, ligne];
}

/** Position du Nœud Nord lunaire moyen (formule de Meeus). */
function longitudeNoeudMoyen(time: AstroTime): number {
  const T = time.tt / 36525.0; // tt = jours TT depuis J2000
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000.0;
  return norm360(omega);
}

type Activation = [string, number, number]; // [astre, porte, ligne]

/** Les 13 positions (astre, porte, ligne) pour un instant donné. */
function calculDes13(time: AstroTime): Activation[] {
  const lonSoleil = longitudeEcl(Body.Sun, time);
  const lonNoeud = longitudeNoeudMoyen(time);
  const sources: Array<[string, number]> = [
    ["Soleil", lonSoleil],
    ["Terre", norm360(lonSoleil + 180)],
    ["Nœud Nord", lonNoeud],
    ["Nœud Sud", norm360(lonNoeud + 180)],
    ["Lune", longitudeEcl(Body.Moon, time)],
    ["Mercure", longitudeEcl(Body.Mercury, time)],
    ["Vénus", longitudeEcl(Body.Venus, time)],
    ["Mars", longitudeEcl(Body.Mars, time)],
    ["Jupiter", longitudeEcl(Body.Jupiter, time)],
    ["Saturne", longitudeEcl(Body.Saturn, time)],
    ["Uranus", longitudeEcl(Body.Uranus, time)],
    ["Neptune", longitudeEcl(Body.Neptune, time)],
    ["Pluton", longitudeEcl(Body.Pluto, time)],
  ];
  return sources.map(([nom, lon]) => {
    const [porte, ligne] = longitudeVersPorte(lon);
    return [nom, porte, ligne] as Activation;
  });
}

/** Trouve l'instant où le Soleil était 88° EN ARRIÈRE de sa position natale. */
function heureDuDesign(tNaissance: AstroTime): AstroTime {
  const cible = norm360(longitudeEcl(Body.Sun, tNaissance) - 88.0);
  let t = tNaissance.AddDays(-88.0);
  for (let i = 0; i < 60; i++) {
    const ecart = norm360(longitudeEcl(Body.Sun, t) - cible + 180) - 180;
    if (Math.abs(ecart) < 1e-7) break;
    t = t.AddDays(-ecart / 0.9856);
  }
  return t;
}

/** Portes allumées → centres définis + groupes de centres reliés (composantes). */
function analyserCircuit(portes: Set<number>): { centres: Set<string>; composantes: Set<string>[] } {
  const centres = new Set<string>();
  const voisins = new Map<string, Set<string>>();
  for (const [a, b, ca, cb] of CANAUX) {
    if (portes.has(a) && portes.has(b)) {
      centres.add(ca);
      centres.add(cb);
      if (!voisins.has(ca)) voisins.set(ca, new Set());
      if (!voisins.has(cb)) voisins.set(cb, new Set());
      voisins.get(ca)!.add(cb);
      voisins.get(cb)!.add(ca);
    }
  }
  const composantes: Set<string>[] = [];
  const vus = new Set<string>();
  for (const depart of Array.from(centres)) {
    if (vus.has(depart)) continue;
    const groupe = new Set<string>();
    const pile = [depart];
    while (pile.length) {
      const c = pile.pop()!;
      if (vus.has(c)) continue;
      vus.add(c);
      groupe.add(c);
      for (const v of Array.from(voisins.get(c) ?? [])) pile.push(v);
    }
    composantes.push(groupe);
  }
  return { centres, composantes };
}

function determinerType(centres: Set<string>, composantes: Set<string>[]): string {
  if (centres.size === 0) return "Réflecteur";
  const sacralDefini = centres.has("Sacral");
  let moteurRelieGorge = false;
  if (centres.has("Gorge")) {
    const groupeGorge = composantes.find((g) => g.has("Gorge"))!;
    moteurRelieGorge = Array.from(groupeGorge).some((c) => MOTEURS.has(c));
  }
  if (sacralDefini) return moteurRelieGorge ? "Générateur Manifesteur" : "Générateur";
  return moteurRelieGorge ? "Manifesteur" : "Projecteur";
}

function determinerAutorite(centres: Set<string>, type_: string): string {
  if (centres.has("Plexus solaire")) return "Émotionnelle";
  if (centres.has("Sacral")) return "Sacrale";
  if (centres.has("Rate")) return "Splénique";
  if (centres.has("Cœur")) return "Ego";
  if (centres.has("G")) return "Self-projetée";
  return type_ === "Réflecteur" ? "Lunaire" : "Mentale (environnement)";
}

function determinerDefinition(composantes: Set<string>[]): string {
  const noms: Record<number, string> = { 0: "Aucune", 1: "Unique", 2: "Split", 3: "Triple Split", 4: "Quadruple Split" };
  return noms[composantes.length] ?? `${composantes.length} groupes`;
}

export type Portrait = {
  type: string; emoji: string; profil: string; strategie: string;
  autorite: string; definition: string; nonSoi: string; signature: string;
  phrase: string; centres: string[];
};

function portrait(personnalite: Activation[], design: Activation[]): Portrait {
  const portes = new Set<number>();
  for (const [, p] of personnalite) portes.add(p);
  for (const [, p] of design) portes.add(p);
  const { centres, composantes } = analyserCircuit(portes);
  const type_ = determinerType(centres, composantes);
  const infos = TYPE_INFOS[type_];
  return {
    type: type_,
    emoji: infos.emoji,
    profil: `${personnalite[0][2]}/${design[0][2]}`, // ligne Soleil perso / design
    strategie: infos.strategie,
    autorite: determinerAutorite(centres, type_),
    definition: determinerDefinition(composantes),
    nonSoi: infos.nonSoi,
    signature: infos.signature,
    phrase: infos.phrase,
    centres: Array.from(centres).sort(),
  };
}

export type CanalJour = { canal: string; centres: string[]; centresEveilles: string[] };
export type Meteo = {
  portesDuJour: number[];
  portesDuJourStr: string;
  canauxDuJour: CanalJour[];
  canauxStr: string;
  centresEveilles: Array<{ emoji: string; titre: string; sens: string }>;
  nbCanaux: number;
};
export type CentreDetail = { nom: string; role: string; statut: string; sens: string; eveille: boolean };
export type TableNatale = { astre: string; pPorte: number; pLigne: number; dPorte: number; dLigne: number };
export type PorteDetail = {
  nom: string; cle: string;
  aujourdhui: Array<{ astre: string; ligne: number }>;
  natal: Array<{ astre: string; cote: string; ligne: number }>;
};

export type DonneesHd = {
  portrait: Portrait;
  meteo: Meteo;
  portesDetail: Record<number, PorteDetail>;
  tableNatale: TableNatale[];
  centresDetail: CentreDetail[];
};

/** UNE seule passe qui calcule TOUT ce que la carte affiche. */
export function donneesHd(quand: Date = new Date()): DonneesHd {
  const t = MakeTime(quand);
  const tNaissance = MakeTime(new Date(Date.UTC(ANNEE, MOIS - 1, JOUR, HEURE_UTC, MINUTE_UTC)));
  const tDesign = heureDuDesign(tNaissance);

  const perso = calculDes13(tNaissance);
  const design = calculDes13(tDesign);
  const dujour = calculDes13(t);

  // 1) Le portrait.
  const portrait_ = portrait(perso, design);

  // 2) La météo du jour : transits qui complètent un canal avec ton design.
  const fixes = new Set<number>();
  for (const [, p] of perso) fixes.add(p);
  for (const [, p] of design) fixes.add(p);
  const { centres: centresNatals } = analyserCircuit(fixes);
  const portesDuJourSet = new Set<number>();
  for (const [, p] of dujour) portesDuJourSet.add(p);
  const combine = new Set<number>(Array.from(fixes).concat(Array.from(portesDuJourSet)));

  const canauxDuJour: CanalJour[] = [];
  const centresAllumes = new Set<string>();
  for (const [a, b, ca, cb] of CANAUX) {
    if (
      combine.has(a) && combine.has(b) &&
      !(fixes.has(a) && fixes.has(b)) &&
      (portesDuJourSet.has(a) || portesDuJourSet.has(b))
    ) {
      const eveille = [ca, cb].filter((c) => !centresNatals.has(c));
      for (const c of eveille) centresAllumes.add(c);
      canauxDuJour.push({ canal: `${a}-${b}`, centres: [ca, cb], centresEveilles: eveille });
    }
  }

  const portesDuJour = Array.from(portesDuJourSet).sort((x, y) => x - y);
  const meteo: Meteo = {
    portesDuJour,
    portesDuJourStr: portesDuJour.join(" · "),
    canauxDuJour,
    canauxStr: canauxDuJour.map((c) => c.canal).join(" · "),
    centresEveilles: Object.keys(CENTRE_SENS).filter((c) => centresAllumes.has(c)).map((c) => CENTRE_SENS[c]),
    nbCanaux: canauxDuJour.length,
  };

  // 3) Le détail de chaque porte (statique + qui l'occupe aujourd'hui + natal).
  const portesDetail: Record<number, PorteDetail> = {};
  for (const [num, info] of Object.entries(PORTES_INFOS)) {
    portesDetail[Number(num)] = { nom: info.nom, cle: info.cle, aujourdhui: [], natal: [] };
  }
  for (const [nom, p, l] of dujour) portesDetail[p].aujourdhui.push({ astre: nom, ligne: l });
  for (const [nom, p, l] of perso) portesDetail[p].natal.push({ astre: nom, cote: "Personnalité", ligne: l });
  for (const [nom, p, l] of design) portesDetail[p].natal.push({ astre: nom, cote: "Design", ligne: l });

  // 4) La charte natale complète : les 26 activations côte à côte.
  const tableNatale: TableNatale[] = perso.map(([astre, pp, pl], i) => ({
    astre, pPorte: pp, pLigne: pl, dPorte: design[i][1], dLigne: design[i][2],
  }));

  // 5) L'état des 9 centres.
  const centresDetail: CentreDetail[] = Object.entries(CENTRE_INFOS).map(([nom, info]) => {
    const defini = centresNatals.has(nom);
    return {
      nom, role: info.role,
      statut: defini ? "Défini" : "Ouvert",
      sens: defini ? info.defini : info.ouvert,
      eveille: centresAllumes.has(nom),
    };
  });

  return { portrait: portrait_, meteo, portesDetail, tableNatale, centresDetail };
}
