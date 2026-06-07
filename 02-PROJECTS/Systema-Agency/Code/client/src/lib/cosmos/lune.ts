// lune.ts — le cerveau de la PHASE LUNAIRE 🌙 (porté depuis lune.py)
// -----------------------------------------------------------
// Ce que ça fait : à partir de la date du jour, ça calcule la VRAIE phase
// de la lune (nouvelle lune, pleine lune, etc.) et son taux d'éclairage.
// Pas de donnée inventée : c'est de l'astronomie pour vrai.
//
// Le secret (le même qu'en Python) : la lune refait le même cycle
// (nouvelle → pleine → nouvelle) tous les ~29,53 jours. Si on connaît UNE
// date précise de nouvelle lune dans le passé, on sait où on en est aujourd'hui.
// -----------------------------------------------------------

// Une nouvelle lune de RÉFÉRENCE, connue et vérifiée :
// le 6 janvier 2000 à 18h14 UTC. (Date.UTC pour fixer l'heure universelle,
// sinon JS prendrait le fuseau de l'ordi et fausserait le calcul.)
const NOUVELLE_LUNE_REFERENCE = new Date(Date.UTC(2000, 0, 6, 18, 14)); // mois 0 = janvier en JS

// La durée moyenne d'un cycle lunaire complet, en jours (le "mois synodique").
// Valeur mesurée par les astronomes, toujours la même.
const MOIS_LUNAIRE = 29.53058867;

// Les 8 phases de la lune, dans l'ordre du cycle, avec leur emoji.
const PHASES: ReadonlyArray<readonly [string, string]> = [
  ["Nouvelle lune", "🌑"],
  ["Premier croissant", "🌒"],
  ["Premier quartier", "🌓"],
  ["Lune gibbeuse croissante", "🌔"],
  ["Pleine lune", "🌕"],
  ["Lune gibbeuse décroissante", "🌖"],
  ["Dernier quartier", "🌗"],
  ["Dernier croissant", "🌘"],
];

// Ce que chaque phase invite à FAIRE (court, doux) — pour le tiroir « détail ».
const SENS_PHASES: Record<string, string> = {
  "Nouvelle lune": "Repos et intention. Plante une graine, n'attends pas encore de récolte.",
  "Premier croissant": "L'élan naissant. Pose les premiers petits gestes vers ton intention.",
  "Premier quartier": "Un cap à franchir. Décide et agis malgré la résistance.",
  "Lune gibbeuse croissante": "Ajuste et raffine. Tu y es presque, peaufine les détails.",
  "Pleine lune": "Pleine lumière, émotions à vif. Récolte, célèbre, relâche ce qui est mûr.",
  "Lune gibbeuse décroissante": "Gratitude et partage. Transmets ce que tu as appris.",
  "Dernier quartier": "Le grand ménage. Lâche, pardonne, fais de la place.",
  "Dernier croissant": "Repli et récupération. Ralentis avant le prochain cycle.",
};

// Comment sont les ÉNERGIES quand la lune est dans cette phase (le climat).
const ENERGIE_PHASES: Record<string, string> = {
  "Nouvelle lune":
    "Énergie basse et tournée vers l'intérieur. Le ciel est sombre, le corps réclame du calme et du rêve. C'est un creux fertile : on sème en silence, on ne se juge pas d'être à plat.",
  "Premier croissant":
    "Un filet d'énergie revient, encore fragile. L'envie de bouger pointe sans être pressante. Bon climat pour des petits pas, pas pour des sprints.",
  "Premier quartier":
    "L'énergie pousse et rencontre des résistances. Tension motrice : envie d'agir mais des obstacles se dressent. Le moment de décider et de tenir le cap.",
  "Lune gibbeuse croissante":
    "Montée en puissance. L'énergie est presque pleine, concentrée, orientée résultat. Idéal pour peaufiner et avancer fort.",
  "Pleine lune":
    "Énergie au maximum, émotions à fleur de peau. Tout est amplifié — joie, sensibilité, sommeil parfois agité. On récolte et on relâche, on évite les décisions à chaud.",
  "Lune gibbeuse décroissante":
    "L'intensité retombe en douceur, place à la gratitude. Énergie encore présente mais plus posée. Bon climat pour partager, transmettre, faire le bilan.",
  "Dernier quartier":
    "Énergie en repli, envie de trier. Une légère friction qui pousse à lâcher ce qui pèse. On désencombre, on pardonne, on allège.",
  "Dernier croissant":
    "Énergie très basse, presque en veille. Le corps réclame du repos avant le redémarrage. On ralentit franchement, on se recharge.",
};

// Le "dictionnaire" que renvoie le cerveau — en TS on décrit sa forme (type).
export type Lune = {
  nom: string;
  emoji: string;
  eclairage: number; // taux d'éclairage en %
  jour: number; // âge de la lune en jours dans le cycle
  sens: string;
  energie: string;
  mouvement: "croissante" | "décroissante";
  fleche: "↑" | "↓";
};

/**
 * Calcule la phase de la lune pour une date donnée.
 * Sans argument, prend MAINTENANT. Renvoie tout ce qu'il faut pour l'afficher.
 */
export function phaseLunaire(quand: Date = new Date()): Lune {
  // 1) Jours écoulés depuis la nouvelle lune de référence.
  //    En JS, soustraire deux dates donne des millisecondes → on divise
  //    par le nombre de ms dans une journée (86400000) pour avoir des jours.
  const joursEcoules = (quand.getTime() - NOUVELLE_LUNE_REFERENCE.getTime()) / 86400000;

  // 2) Le modulo (%) garde le RESTE : l'âge de la lune DANS le cycle courant,
  //    entre 0 (nouvelle lune) et 29,53 (juste avant la prochaine).
  const age = joursEcoules % MOIS_LUNAIRE;

  // 3) On découpe le cycle en 8 tranches égales. Le "+ 0.5" arrondit à la
  //    bonne tranche. Math.floor coupe les décimales (comme int() en Python).
  const index = Math.floor((age / MOIS_LUNAIRE) * 8 + 0.5) % 8;
  const [nom, emoji] = PHASES[index];

  // 4) Le taux d'éclairage : 0 % à la nouvelle lune, 100 % à la pleine lune,
  //    en vague douce entre les deux (la courbe du cosinus).
  const eclairage = ((1 - Math.cos((2 * Math.PI * age) / MOIS_LUNAIRE)) / 2) * 100;

  // 5) Le MOUVEMENT : 1re moitié du cycle = la lumière MONTE (croissante),
  //    2e moitié = elle DESCEND (décroissante). Vrai astronomiquement.
  const croissante = age < MOIS_LUNAIRE / 2;

  return {
    nom,
    emoji,
    eclairage: Math.round(eclairage),
    jour: Math.round(age),
    sens: SENS_PHASES[nom] ?? "",
    energie: ENERGIE_PHASES[nom] ?? "",
    mouvement: croissante ? "croissante" : "décroissante",
    fleche: croissante ? "↑" : "↓",
  };
}
