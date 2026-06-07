// numerologie.ts — le cerveau de la NUMÉROLOGIE 🔢 (porté depuis numerologie.py)
// -----------------------------------------------------------
// DEUX choses :
//   1) Le "chemin de vie" — un chiffre 1–9 (ou maître 11/22/33) tiré de la
//      date de naissance. CONSTANT toute la vie.
//   2) La "météo numérologique" — année / mois / jour personnels, qui croisent
//      la naissance avec la date du jour. VIVANTE : ça change chaque jour.
// -----------------------------------------------------------

// Date de naissance (9 février 1990). On garde les composantes séparées pour
// reconstruire des dates en heure locale sans surprise de fuseau.
const NAISSANCE = { annee: 1990, mois: 2, jour: 9 };

const SIGNIFICATIONS: Record<number, string> = {
  1: "L'indépendance et l'initiative. Tu es faite pour ouvrir des chemins.",
  2: "La sensibilité et l'harmonie. Ta force, c'est la douceur et le lien.",
  3: "La créativité et l'expression. Joie, couleurs, mots — tu es faite pour créer.",
  4: "La structure et la solidité. Tu bâtis des choses qui durent.",
  5: "La liberté et le mouvement. Le changement est ton oxygène.",
  6: "L'amour et le soin. Tu veilles sur les autres et sur la beauté.",
  7: "L'introspection et la sagesse. Tu cherches le sens sous la surface.",
  8: "La puissance et l'abondance. Tu sais transformer une idée en réel.",
  9: "La compassion et l'idéal. Tu portes une vision plus grande que toi.",
  11: "Nombre maître : l'intuition et l'inspiration. Un phare pour les autres.",
  22: "Nombre maître : la bâtisseuse de rêves. Rendre le grand concret.",
  33: "Nombre maître : l'amour qui enseigne. Élever et guérir par le cœur.",
};

const DETAILS: Record<number, string> = {
  1: "Force : initiative, autonomie. Défi : éviter l'ego et l'isolement.",
  2: "Force : diplomatie, intuition. Défi : ne pas t'oublier pour les autres.",
  3: "Force : créativité, communication, joie. Défi : canaliser ta dispersion.",
  4: "Force : rigueur, fiabilité. Défi : assouplir ton besoin de contrôle.",
  5: "Force : liberté, adaptabilité. Défi : éviter l'instabilité et l'excès.",
  6: "Force : amour, responsabilité. Défi : ne pas te sacrifier ni trop materner.",
  7: "Force : analyse, profondeur. Défi : sortir de ta tête et faire confiance.",
  8: "Force : ambition, sens du concret. Défi : équilibrer matériel et cœur.",
  9: "Force : compassion, vision large. Défi : lâcher le passé, accepter les fins.",
  11: "Maître-nombre : intuition et inspiration. Défi : gérer l'hypersensibilité.",
  22: "Maître-nombre : bâtir grand et concret. Défi : ne pas crouler sous l'ampleur.",
  33: "Maître-nombre : guérir et enseigner par l'amour. Défi : ne pas tout porter.",
};

const ANNEE_TITRES: Record<number, string> = {
  1: "Nouveau cycle", 2: "Patience & liens", 3: "Création & joie",
  4: "Fondations", 5: "Changement", 6: "Amour & responsabilités",
  7: "Introspection", 8: "Puissance & abondance", 9: "Bilan & lâcher-prise",
};
const ANNEE_TEXTES: Record<number, string> = {
  1: "Une année de départ. Tu sèmes ce que tu récolteras 9 ans. Ose initier, lance TON projet.",
  2: "Année de patience et de coopération. Les choses mûrissent en coulisses — cultive les liens, ne force pas.",
  3: "Année d'expression et de visibilité. Crée, montre, socialise — ta joie est ton aimant cette année.",
  4: "Année de travail et de structure. On pose les briques solides. Discipline maintenant = liberté plus tard.",
  5: "Année de mouvement et d'imprévu. Voyages, virages, opportunités — reste souple, dis oui au neuf.",
  6: "Année du cœur et du foyer. Amour, famille, responsabilités, beauté. Prends soin sans t'oublier.",
  7: "Année d'introspection. Moins de course, plus de sens. Étudie, ressource-toi, écoute ton intérieur.",
  8: "Année de récolte matérielle. Argent, pouvoir, ambition concrète. Assume ta valeur, vois grand.",
  9: "Année de clôture. On termine, on range, on lâche ce qui est fini pour faire de la place au prochain cycle.",
};

const MOIS_TITRES: Record<number, string> = {
  1: "Élan", 2: "Douceur", 3: "Éclat", 4: "Rigueur", 5: "Bougeotte",
  6: "Tendresse", 7: "Retrait", 8: "Ambition", 9: "Clôture",
};
const MOIS_TEXTES: Record<number, string> = {
  1: "Mois pour démarrer : lance les nouveautés, prends les devants.",
  2: "Mois de patience et de collaboration : sois diplomate, laisse infuser.",
  3: "Mois créatif et social : exprime-toi, amuse-toi, rayonne.",
  4: "Mois d'organisation : range, planifie, construis du concret.",
  5: "Mois de changement : bouge, explore, accueille l'imprévu.",
  6: "Mois du cœur : famille, amour, soin de toi et des tiens.",
  7: "Mois de recul : ralentis, réfléchis, ressource-toi.",
  8: "Mois d'action et de résultats : négocie, ose, vise concret.",
  9: "Mois de bilan : termine, nettoie, prépare le prochain cycle.",
};

const JOUR_TITRES: Record<number, string> = {
  1: "Initier", 2: "Coopérer", 3: "Créer", 4: "Bâtir", 5: "Bouger",
  6: "Aimer", 7: "Réfléchir", 8: "Réussir", 9: "Boucler",
};
const JOUR_TEXTES: Record<number, string> = {
  1: "Jour pour foncer : prends une initiative, ouvre une porte.",
  2: "Jour pour relier : écoute, coopère, sois douce avec toi.",
  3: "Jour pour créer et t'exprimer : couleurs, mots, partages.",
  4: "Jour pour structurer : avance tes tâches, mets de l'ordre.",
  5: "Jour pour varier : sors de la routine, reste flexible.",
  6: "Jour pour le cœur : prends soin, savoure, rends service.",
  7: "Jour pour le calme : pause, lecture, écoute intérieure.",
  8: "Jour pour agir fort : décisions, argent, ambition.",
  9: "Jour pour clore : finis, range, laisse partir le superflu.",
};

// Étiquettes des jours de la semaine, indexées comme Python (lundi = 0).
const JOURS_SEMAINE = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

/** Additionne les chiffres d'un nombre. Ex: 30 → 3 + 0 = 3. */
function sommeDesChiffres(valeur: number): number {
  let total = 0;
  for (const chiffre of String(valeur)) {
    total += Number(chiffre);
  }
  return total;
}

/** Réduit un nombre à un seul chiffre (en gardant 11/22/33 si demandé). */
function reduire(valeur: number, garderMaitres = true): number {
  while (valeur > 9 && (!garderMaitres || ![11, 22, 33].includes(valeur))) {
    valeur = sommeDesChiffres(valeur);
  }
  return valeur;
}

export type Echelle = { nombre: number; titre: string; texte: string };

/** Année, mois et jour personnels pour une date donnée (la partie vivante). */
export function meteoPerso(quand: Date = new Date()): {
  annee: Echelle;
  mois: Echelle;
  jour: Echelle;
} {
  // On lit les composantes en heure LOCALE (comme date.today() côté Python).
  const an = quand.getFullYear();
  const mo = quand.getMonth() + 1; // getMonth() = 0–11
  const jo = quand.getDate();

  const baseAnnee =
    sommeDesChiffres(NAISSANCE.mois) + sommeDesChiffres(NAISSANCE.jour) + sommeDesChiffres(an);
  const nAnnee = reduire(baseAnnee, false);
  const nMois = reduire(nAnnee + sommeDesChiffres(mo), false);
  const nJour = reduire(nMois + sommeDesChiffres(jo), false);

  return {
    annee: { nombre: nAnnee, titre: ANNEE_TITRES[nAnnee], texte: ANNEE_TEXTES[nAnnee] },
    mois: { nombre: nMois, titre: MOIS_TITRES[nMois], texte: MOIS_TEXTES[nMois] },
    jour: { nombre: nJour, titre: JOUR_TITRES[nJour], texte: JOUR_TEXTES[nJour] },
  };
}

export type ProchainJour = {
  label: string;
  jourMois: number;
  nombre: number;
  titre: string;
  texte: string;
  aujourdhui: boolean;
};

/** Aujourd'hui + les n prochains jours, avec leur jour personnel. */
export function prochainsJours(n = 5, depuis: Date = new Date()): ProchainJour[] {
  const liste: ProchainJour[] = [];
  for (let i = 0; i <= n; i++) {
    // On part de "depuis" et on avance de i jours (en heure locale).
    const d = new Date(depuis.getFullYear(), depuis.getMonth(), depuis.getDate());
    d.setDate(d.getDate() + i);
    const info = meteoPerso(d).jour;
    // weekday : Python compte lundi=0 ; JS getDay() compte dimanche=0. On convertit.
    const weekdayPy = (d.getDay() + 6) % 7;
    liste.push({
      label: i === 0 ? "auj." : JOURS_SEMAINE[weekdayPy],
      jourMois: d.getDate(),
      nombre: info.nombre,
      titre: info.titre,
      texte: info.texte,
      aujourdhui: i === 0,
    });
  }
  return liste;
}

export type Numero = {
  nombre: number;
  signification: string;
  detail: string;
  annee: Echelle;
  mois: Echelle;
  jour: Echelle;
  prochains: ProchainJour[];
};

/** Le chemin de vie (constant) + la météo numérologique du jour. */
export function cheminDeVie(quand: Date = new Date()): Numero {
  // "19900209" → somme des chiffres → réduction (en gardant les maîtres).
  const chiffres = `${NAISSANCE.annee}${String(NAISSANCE.mois).padStart(2, "0")}${String(NAISSANCE.jour).padStart(2, "0")}`;
  let somme = 0;
  for (const c of chiffres) somme += Number(c);
  const nombre = reduire(somme);

  const meteo = meteoPerso(quand);
  return {
    nombre,
    signification: SIGNIFICATIONS[nombre] ?? "",
    detail: DETAILS[nombre] ?? "",
    annee: meteo.annee,
    mois: meteo.mois,
    jour: meteo.jour,
    prochains: prochainsJours(5, quand),
  };
}
