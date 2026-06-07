// matrice.ts — le cerveau de la MATRICE DE LA DESTINÉE 🔮 (porté depuis matrice.py)
// -----------------------------------------------------------
// Méthode de Natalia Ladini : depuis la date de naissance, on dispose les 22
// arcanes du tarot sur un OCTOGRAMME (étoile à 8 branches) + un centre.
// Tout vient de la date (9 février 1990) : additions + réduction à 22.
// -----------------------------------------------------------

const JOUR = 9;
const MOIS = 2;
const ANNEE = 1990;

// Coordonnées (x, y) des 8 points de l'octogramme, dans l'ordre des âges (0→70),
// puis on reboucle sur le point gauche (80 = 0).
const POINTS_XY: ReadonlyArray<readonly [number, number]> = [
  [35, 175], [78, 83], [170, 40], [262, 83], [305, 175],
  [262, 267], [170, 310], [78, 267], [35, 175],
];

// La ligne d'âge : le contour = la vie de 0 à 80 ans, sens horaire depuis la gauche.
const LIGNE_AGE: ReadonlyArray<readonly [number, number, string]> = [
  [0, 10, "gauche"], [10, 20, "hg"], [20, 30, "haut"], [30, 40, "hd"],
  [40, 50, "droite"], [50, 60, "bd"], [60, 70, "bas"], [70, 80, "bg"],
];

// Les 22 arcanes majeurs : nom, emoji, sens court.
const ARCANES: Record<number, readonly [string, string, string]> = {
  1: ["Le Bateleur", "🎩", "Initiative, potentiel, nouveaux départs."],
  2: ["La Papesse", "🌙", "Intuition, savoir caché, patience."],
  3: ["L'Impératrice", "👑", "Création, abondance, féminité fertile."],
  4: ["L'Empereur", "🏛️", "Structure, autorité, stabilité."],
  5: ["Le Pape", "🕊️", "Transmission, valeurs, guidance."],
  6: ["L'Amoureux", "❤️", "Choix du cœur, lien, harmonie."],
  7: ["Le Chariot", "🏇", "Victoire, élan, volonté qui avance."],
  8: ["La Justice", "⚖️", "Équilibre, vérité, responsabilité."],
  9: ["L'Ermite", "🔦", "Introspection, sagesse, quête intérieure."],
  10: ["La Roue de Fortune", "🎡", "Cycles, chance, tournants de la vie."],
  11: ["La Force", "🦁", "Courage doux, maîtrise, énergie vitale."],
  12: ["Le Pendu", "🙃", "Lâcher-prise, nouveau regard, pause féconde."],
  13: ["L'Arcane sans nom", "🦋", "Transformation, fin et renaissance."],
  14: ["Tempérance", "🍵", "Harmonie, modération, guérison douce."],
  15: ["Le Diable", "🔥", "Désir, attachements, puissance brute."],
  16: ["La Maison-Dieu", "⚡", "Rupture libératrice, révélation soudaine."],
  17: ["L'Étoile", "⭐", "Espoir, inspiration, guérison, foi."],
  18: ["La Lune", "🌒", "Inconscient, rêves, émotions profondes."],
  19: ["Le Soleil", "☀️", "Joie, rayonnement, réussite, clarté."],
  20: ["Le Jugement", "📯", "Éveil, appel, renaissance, vocation."],
  21: ["Le Monde", "🌍", "Accomplissement, plénitude, ouverture."],
  22: ["Le Mat", "🃏", "Liberté, foi, voyage de l'âme, élan neuf."],
};

const PALETTE = [
  "#E86AA6", "#B06AB3", "#7C6AB0", "#6A8FB0", "#5FB0A0",
  "#E0A458", "#E07A5F", "#C45BAA", "#8E6AC0", "#D98CB3", "#9B7EDE",
];

// Le sens de chaque POSITION sur l'octogramme : [titre, sous-titre].
const POSITIONS: Record<string, readonly [string, string]> = {
  centre: ["Cœur", "ton énergie centrale — ce qui te porte partout"],
  gauche: ["Portrait personnel", "jour de naissance — qui tu es au quotidien"],
  haut: ["Talents innés", "mois de naissance — tes dons de départ"],
  droite: ["Rapport au matériel", "année de naissance — argent & ressources"],
  bas: ["Mission de vie", "ce que tu viens transformer (karma)"],
  hg: ["Ciel — don à déployer", "carré karmique (haut-gauche)"],
  hd: ["Ciel — énergie à incarner", "carré karmique (haut-droite)"],
  bd: ["Terre — karma matériel", "carré karmique (bas-droite)"],
  bg: ["Terre — karma affectif", "carré karmique (bas-gauche)"],
};

/** Ramène un nombre dans 1–22 (22 reste valide = Le Mat). */
function reduire(n: number): number {
  while (n > 22) {
    let s = 0;
    for (const c of String(n)) s += Number(c);
    n = s;
  }
  return n;
}

export type Noeud = {
  num: number;
  nom: string;
  emoji: string;
  sens: string;
  couleur: string;
  posTitre: string;
  posSous: string;
};

function noeud(cle: string, nombre: number): Noeud {
  const [nom, emoji, sens] = ARCANES[nombre];
  const [titre, sous] = POSITIONS[cle];
  return {
    num: nombre,
    nom,
    emoji,
    sens,
    couleur: PALETTE[(nombre - 1) % PALETTE.length],
    posTitre: titre,
    posSous: sous,
  };
}

export type Arc = { num: number; nom: string; emoji: string; sens: string; couleur: string };

function arcInfo(num: number): Arc {
  const [nom, emoji, sens] = ARCANES[num];
  return { num, nom, emoji, sens, couleur: PALETTE[(num - 1) % PALETTE.length] };
}

/** Arcane à une position FINE entre deux points, par moitiés successives. */
function subdiv(gauche: number, droite: number, offset: number, portee: number): number {
  if (offset <= 0) return gauche;
  const moitie = portee / 2.0;
  const milieu = reduire(gauche + droite);
  if (Math.abs(offset - moitie) < 1e-6) return milieu;
  if (offset < moitie) return subdiv(gauche, milieu, offset, moitie);
  return subdiv(milieu, droite, offset - moitie, moitie);
}

/** L'arcane qui gouverne un âge donné (0–80) sur la ligne fine. */
function valAge(ancres: number[], age: number): number {
  age = age % 80;
  const d = Math.floor(age / 10);
  return subdiv(ancres[d], ancres[d + 1], age - d * 10, 10.0);
}

/** Cale l'âge sur le marqueur fin juste en-dessous (pas de 1,25 an). */
function arcPourAge(ancres: number[], age: number): number {
  const cale = Math.floor(age / 1.25) * 1.25;
  return valAge(ancres, cale);
}

/** La coordonnée (x, y) d'un âge le long du contour de l'octogramme. */
function posAge(age: number): [number, number] {
  age = age % 80;
  const d = Math.floor(age / 10);
  const frac = (age - d * 10) / 10.0;
  const [x0, y0] = POINTS_XY[d];
  const [x1, y1] = POINTS_XY[d + 1];
  return [
    Math.round((x0 + frac * (x1 - x0)) * 10) / 10,
    Math.round((y0 + frac * (y1 - y0)) * 10) / 10,
  ];
}

export type Periode = {
  de: number;
  a: number;
  cle: string;
  num: number;
  nom: string;
  emoji: string;
  couleur: string;
  actuel: boolean;
};

export type AnneeFine = Arc & { age: number; x: number; y: number };
export type Dot = { age: number; x: number; y: number; num: number; couleur: string };

export type Matrice = {
  noeuds: Record<string, Noeud>;
  age: number;
  periodes: Periode[];
  periodeActuelle: string | null;
  annee: AnneeFine;
  prochaines: AnneeFine[];
  dots: Dot[];
  points: ReadonlyArray<readonly [number, number]>;
};

/** Calcule les 9 nœuds de la Matrice de la Destinée + la ligne d'âge. */
export function matrice(quand: Date = new Date()): Matrice {
  // Les 4 points cardinaux (carré « droit ») :
  const a = reduire(JOUR); // gauche = jour
  const b = MOIS; // haut = mois (1–12)
  let sommeAnnee = 0;
  for (const x of String(ANNEE)) sommeAnnee += Number(x);
  const c = reduire(sommeAnnee); // droite = somme année
  const d = reduire(a + b + c); // bas = synthèse
  const e = reduire(a + b + c + d); // centre = cœur

  // Les 4 diagonales (carré « karmique ») :
  const f = reduire(a + b); // haut-gauche
  const g = reduire(b + c); // haut-droite
  const h = reduire(c + d); // bas-droite
  const i = reduire(d + a); // bas-gauche

  const noeuds: Record<string, Noeud> = {
    centre: noeud("centre", e),
    gauche: noeud("gauche", a),
    haut: noeud("haut", b),
    droite: noeud("droite", c),
    bas: noeud("bas", d),
    hg: noeud("hg", f),
    hd: noeud("hd", g),
    bd: noeud("bd", h),
    bg: noeud("bg", i),
  };

  // Âge aujourd'hui (−1 si l'anniversaire n'est pas encore passé).
  const an = quand.getFullYear();
  const mo = quand.getMonth() + 1;
  const jo = quand.getDate();
  const avantAnniv = mo < MOIS || (mo === MOIS && jo < JOUR);
  const age = an - ANNEE - (avantAnniv ? 1 : 0);

  // Les périodes de vie (décennies) + l'arcane qui les gouverne.
  const periodes: Periode[] = [];
  let periodeActuelle: string | null = null;
  for (const [de, aFin, cle] of LIGNE_AGE) {
    const n = noeuds[cle];
    const estActuel = de <= age && age < aFin;
    if (estActuel) periodeActuelle = cle;
    periodes.push({
      de, a: aFin, cle, num: n.num, nom: n.nom, emoji: n.emoji, couleur: n.couleur, actuel: estActuel,
    });
  }

  // La ligne d'âge fine. Ancres = arcanes des 8 points, ordre des âges + boucle.
  const ancres = ["gauche", "hg", "haut", "hd", "droite", "bd", "bas", "bg"].map((k) => noeuds[k].num);
  ancres.push(ancres[0]); // 80 ans = retour au point gauche (0)

  const [ax, ay] = posAge(age);
  const annee: AnneeFine = { ...arcInfo(arcPourAge(ancres, age)), age, x: ax, y: ay };

  // Les 10 prochaines années (avec position sur le contour).
  const prochaines: AnneeFine[] = [];
  for (let k = 0; k < 10; k++) {
    const aAge = age + k;
    const [x, y] = posAge(aAge);
    prochaines.push({ ...arcInfo(arcPourAge(ancres, aAge)), age: aAge, x, y });
  }

  // Les petits points de la ligne fine (tous les 2,5 ans) pour le visuel.
  const dots: Dot[] = [];
  for (let k = 0; k < 32; k++) {
    const aAge = k * 2.5;
    const [x, y] = posAge(aAge);
    const info = arcInfo(valAge(ancres, aAge));
    dots.push({ age: aAge, x, y, num: info.num, couleur: info.couleur });
  }

  return {
    noeuds,
    age,
    periodes,
    periodeActuelle,
    annee,
    prochaines,
    dots,
    points: POINTS_XY,
  };
}
