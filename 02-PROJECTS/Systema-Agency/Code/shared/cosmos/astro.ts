// astro.ts — le cerveau de l'ASTROLOGIE 🌌 (porté depuis astro.py)
// -----------------------------------------------------------
// Même chose qu'en Python, mais le moteur NASA skyfield est remplacé par
// `astronomy-engine` (JS pur). Pour coller à skyfield (epoch="date"), on tourne
// le vecteur géocentrique J2000 vers l'ÉCLIPTIQUE DE LA DATE (Rotation_EQJ_ECT).
//   1) transits du jour : signe de chaque astre aujourd'hui
//   2) thème natal : Soleil / Lune / Ascendant à la naissance
//   3) aspects : l'angle réel entre chaque planète du jour et tes 3 piliers
// -----------------------------------------------------------

import * as astronomyEngine from "astronomy-engine";
import type { AstroTime } from "astronomy-engine";

// Interop CJS/ESM : Vite, vitest et Node moderne chargent la build ESM du paquet
// (exports nommés) ; le runtime Vercel charge la build CJS (tout sur `default`).
// On déstructure depuis celui des deux qui existe — sinon ça crashe en prod (vu le 2026-06-11).
const { Body, GeoVector, Rotation_EQJ_ECT, RotateVector, SiderealTime, MakeTime } =
  (astronomyEngine as { default?: typeof astronomyEngine }).default ?? astronomyEngine;
type Body = import("astronomy-engine").Body;

// Naissance : 9 février 1990, 14h45 à Montpellier → 13h45 UTC. 43.61°N, 3.88°E.
const ANNEE = 1990;
const MOIS = 2;
const JOUR = 9;
const HEURE_UTC = 13;
const MINUTE_UTC = 45;
const LATITUDE = 43.6109;
const LONGITUDE = 3.8772;

const SIGNES: ReadonlyArray<readonly [string, string]> = [
  ["Bélier", "♈"], ["Taureau", "♉"], ["Gémeaux", "♊"], ["Cancer", "♋"],
  ["Lion", "♌"], ["Vierge", "♍"], ["Balance", "♎"], ["Scorpion", "♏"],
  ["Sagittaire", "♐"], ["Capricorne", "♑"], ["Verseau", "♒"], ["Poissons", "♓"],
];

// Astres du jour : nom, symbole, corps astronomy-engine.
const ASTRES_DU_JOUR: ReadonlyArray<readonly [string, string, Body]> = [
  ["Soleil", "☀️", Body.Sun],
  ["Lune", "🌙", Body.Moon],
  ["Mercure", "☿", Body.Mercury],
  ["Vénus", "♀", Body.Venus],
  ["Mars", "♂", Body.Mars],
  ["Jupiter", "♃", Body.Jupiter],
  ["Saturne", "♄", Body.Saturn],
];

// Les 5 grands aspects : nom, angle, orbe, emoji, famille.
const ASPECTS: ReadonlyArray<readonly [string, number, number, string, string]> = [
  ["conjonction", 0, 8, "🔆", "intense"],
  ["sextile", 60, 6, "🌱", "fluide"],
  ["carré", 90, 7, "⚡", "tendu"],
  ["trigone", 120, 8, "✨", "fluide"],
  ["opposition", 180, 8, "⚖️", "tendu"],
];

const DOMAINES: Record<string, string> = {
  Soleil: "Ta vitalité et ton identité",
  Lune: "Tes émotions et ton humeur",
  Mercure: "Ton mental et ta parole",
  Vénus: "Ton cœur, tes plaisirs et tes liens",
  Mars: "Ton énergie et ton élan",
  Jupiter: "Tes opportunités et ton envie de voir grand",
  Saturne: "Ta discipline et ton sérieux",
};

const TONS: Record<string, string> = {
  conjonction: "se fondent dans {ancre} : c'est amplifié, pile dans ton thème — utilise-le à fond.",
  sextile: "t'ouvrent une porte facile du côté de {ancre} : l'occasion est là si tu fais le premier petit pas.",
  carré: "entrent en tension avec {ancre} : une friction qui te pousse à ajuster, pas à fuir.",
  trigone: "coulent en harmonie avec {ancre} : fluide et naturel, profites-en sans forcer.",
  opposition: "tirent à l'opposé de {ancre} : journée de contrastes, cherche l'équilibre.",
};

const CONSEILS: Record<string, string> = {
  Soleil: "Montre qui tu es.",
  Lune: "Écoute ton ressenti.",
  Mercure: "Écris, code, parle vrai.",
  Vénus: "Soigne tes liens et ce qui te fait du bien.",
  Mars: "Concentre ton énergie sur une seule cible.",
  Jupiter: "Ose voir un peu plus grand.",
  Saturne: "Pose une brique solide, sans te juger.",
};

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const norm360 = (x: number) => ((x % 360) + 360) % 360;

export type Signe = { signe: string; emoji: string; degre: number };

/** Longitude écliptique DE LA DATE d'un astre (comme skyfield epoch="date"). */
function longitudeEcl(body: Body, time: AstroTime): number {
  const vec = GeoVector(body, time, true); // géocentrique J2000 + aberration
  const rot = Rotation_EQJ_ECT(time); // J2000 → écliptique vraie de la date
  const ecl = RotateVector(rot, vec);
  return norm360(deg(Math.atan2(ecl.y, ecl.x)));
}

/** Position (0–360°) → signe + degré dans le signe. */
function longitudeVersSigne(longitude: number): Signe {
  const index = Math.floor(longitude / 30) % 12;
  const [nom, emoji] = SIGNES[index];
  return { signe: nom, emoji, degre: Math.round(longitude % 30) };
}

/** Inclinaison de l'axe terrestre (≈ 23.44°), comme la formule Python. */
function obliquite(time: AstroTime): number {
  const T = time.tt / 36525.0; // tt = jours TT depuis J2000
  return 23.439291 - 0.0130042 * T;
}

/** L'Ascendant : le signe qui se lève à l'est (heure + lieu). */
function ascendant(time: AstroTime): number {
  const gst = SiderealTime(time); // heures sidérales (Greenwich)
  const ramc = norm360(gst * 15 + LONGITUDE);
  const eps = rad(obliquite(time));
  const phi = rad(LATITUDE);
  const ra = rad(ramc);
  return norm360(deg(Math.atan2(Math.cos(ra), -(Math.sin(ra) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)))));
}

type AspectInfo = { aspect: string; tonEmoji: string; famille: string; angle: number; ecart: number };

/** L'angle entre une planète et un pilier natal (None si rien de marqué). */
function aspect(lonPlanete: number, lonAncre: number): AspectInfo | null {
  let sep = Math.abs(lonPlanete - lonAncre) % 360;
  if (sep > 180) sep = 360 - sep;
  let meilleur: AspectInfo | null = null;
  for (const [nom, angle, orbe, emoji, famille] of ASPECTS) {
    const ecart = Math.abs(sep - angle);
    if (ecart <= orbe && (meilleur === null || ecart < meilleur.ecart)) {
      meilleur = { aspect: nom, tonEmoji: emoji, famille, angle: Math.round(sep), ecart };
    }
  }
  return meilleur;
}

export type AspectLigne = {
  astre: string; symbole: string; signe: string; emoji: string;
  aspect: string; tonEmoji: string; famille: string; angle: number; texte: string;
};
export type GroupeAncre = {
  ancre: string; ancreEmoji: string; ancreSigne: string; ancreSens: string; aspects: AspectLigne[];
};
export type Astro = {
  aujourdhui: Array<{ astre: string; symbole: string } & Signe>;
  natal: { soleil: Signe; lune: Signe; ascendant: Signe };
  transitsPerso: GroupeAncre[];
  tonJour: { label: string; emoji: string; couleur: string };
};

export function astro(quand: Date = new Date()): Astro {
  const t = MakeTime(quand);
  const tNaissance = MakeTime(new Date(Date.UTC(ANNEE, MOIS - 1, JOUR, HEURE_UTC, MINUTE_UTC)));

  // Les 3 piliers natals (longitudes réelles).
  const lonSoleilNatal = longitudeEcl(Body.Sun, tNaissance);
  const lonLuneNatal = longitudeEcl(Body.Moon, tNaissance);
  const lonAscNatal = ascendant(tNaissance);

  const natal = {
    soleil: longitudeVersSigne(lonSoleilNatal),
    lune: longitudeVersSigne(lonLuneNatal),
    ascendant: longitudeVersSigne(lonAscNatal),
  };

  // Transits du jour.
  const aujourdhui: Array<{ astre: string; symbole: string } & Signe> = [];
  const positionsJour: Array<{ nom: string; symbole: string; signe: Signe; lon: number }> = [];
  for (const [nom, symbole, body] of ASTRES_DU_JOUR) {
    const lon = longitudeEcl(body, t);
    const signe = longitudeVersSigne(lon);
    aujourdhui.push({ astre: nom, symbole, ...signe });
    positionsJour.push({ nom, symbole, signe, lon });
  }

  // Les 3 ancres.
  const ancres: Array<{ nom: string; emoji: string; signe: string; sens: string; phrase: string; lon: number }> = [
    { nom: "Soleil", emoji: "☀️", signe: natal.soleil.signe, sens: "qui tu es", phrase: `ton Soleil ${natal.soleil.signe}`, lon: lonSoleilNatal },
    { nom: "Lune", emoji: "🌙", signe: natal.lune.signe, sens: "ce que tu ressens", phrase: `ta Lune ${natal.lune.signe}`, lon: lonLuneNatal },
    { nom: "Ascendant", emoji: "⬆️", signe: natal.ascendant.signe, sens: "ton abord du monde", phrase: `ton Ascendant ${natal.ascendant.signe}`, lon: lonAscNatal },
  ];

  const transitsPerso: GroupeAncre[] = [];
  const compteur: Record<string, number> = { fluide: 0, tendu: 0, intense: 0 };
  for (const a of ancres) {
    const aspects: Array<AspectLigne & { ecart: number }> = [];
    for (const p of positionsJour) {
      const asp = aspect(p.lon, a.lon);
      if (asp) {
        const texte = `${DOMAINES[p.nom]} ${TONS[asp.aspect].replace("{ancre}", a.phrase)} ${CONSEILS[p.nom]}`;
        aspects.push({
          astre: p.nom, symbole: p.symbole, signe: p.signe.signe, emoji: p.signe.emoji,
          aspect: asp.aspect, tonEmoji: asp.tonEmoji, famille: asp.famille, angle: asp.angle,
          texte, ecart: asp.ecart,
        });
        compteur[asp.famille] += 1;
      }
    }
    aspects.sort((x, y) => x.ecart - y.ecart);
    transitsPerso.push({
      ancre: a.nom, ancreEmoji: a.emoji, ancreSigne: a.signe, ancreSens: a.sens,
      aspects: aspects.map(({ ecart: _e, ...rest }) => rest),
    });
  }

  // Le ton du jour global.
  let tonJour: { label: string; emoji: string; couleur: string };
  if (compteur.fluide === 0 && compteur.tendu === 0 && compteur.intense === 0) {
    tonJour = { label: "ciel calme", emoji: "🌫️", couleur: "gris" };
  } else if (compteur.tendu > compteur.fluide) {
    tonJour = { label: "journée à friction", emoji: "⚡", couleur: "orange" };
  } else if (compteur.fluide > compteur.tendu) {
    tonJour = { label: "journée fluide", emoji: "✨", couleur: "vert" };
  } else {
    tonJour = { label: "journée contrastée", emoji: "⚖️", couleur: "rose" };
  }

  return { aujourdhui, natal, transitsPerso, tonJour };
}
