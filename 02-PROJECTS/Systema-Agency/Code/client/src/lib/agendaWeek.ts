// agendaWeek.ts — le MODÈLE partagé de la semaine Agenda.
// Extrait de pages/Agenda.tsx pour que la page Home (panorama) et la page
// Agenda lisent et écrivent exactement les mêmes données (même clé locale,
// même normalisation, même format tRPC).

export type AccentKey = "pink" | "violet" | "lavender" | "cyan" | "mint";
export type DayKey = "LUN" | "MAR" | "MER" | "JEU" | "VEN" | "SAM" | "DIM";

export type AgendaEvent = {
  time: string;
  title: string;
  color: AccentKey;
};

export type Goal = {
  title: string;
  accent: AccentKey;
  items: { text: string; done: boolean }[];
};

export type Habit = {
  name: string;
  grid: (0 | 1 | 2)[];
  accent: AccentKey;
};

export type WeekData = {
  weekLabel: string;
  events: Record<DayKey, AgendaEvent[]>;
  goals: Goal[];
  habitsA: Habit[];
  habitsB: Habit[];
  habitLabels: {
    habitsA: string;
    habitsB: string;
  };
};

export const DAYS: DayKey[] = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
export const MONTHS = ["janv.", "fevr.", "mars", "avr.", "mai", "juin", "juil.", "aout", "sept.", "oct.", "nov.", "dec."];

export const emptyEvents = (): Record<DayKey, AgendaEvent[]> => ({
  LUN: [],
  MAR: [],
  MER: [],
  JEU: [],
  VEN: [],
  SAM: [],
  DIM: [],
});

export const defaultGoals = (): Goal[] => [
  {
    title: "",
    accent: "pink",
    items: [
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
    ],
  },
  {
    title: "",
    accent: "mint",
    items: [
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
    ],
  },
  {
    title: "",
    accent: "violet",
    items: [
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
      { text: "", done: false },
    ],
  },
];

export const defaultHabitsA = (): Habit[] => [
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "pink" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "lavender" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "violet" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "cyan" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "mint" },
];

export const defaultHabitsB = (): Habit[] => [
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "cyan" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "pink" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "violet" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "lavender" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "mint" },
];

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function dateToIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function mondayOf(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const day = next.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + delta);
  return next;
}

export function formatDayLabel(date: Date) {
  const day = date.getDate();
  return day === 1 ? "1er" : String(day);
}

export function formatWeekLabel(weekStart: string) {
  const start = dateFromIso(weekStart);
  const end = addDays(start, 6);
  const startMonth = MONTHS[start.getMonth()];
  const endMonth = MONTHS[end.getMonth()];
  const startLabel = startMonth === endMonth ? formatDayLabel(start) : `${formatDayLabel(start)} ${startMonth}`;
  return `${startLabel} - ${formatDayLabel(end)} ${endMonth}`;
}

export function storageKey(weekStart: string) {
  return `systema_agenda_week_${weekStart}`;
}

export function createDefaultWeek(weekStart: string): WeekData {
  return {
    weekLabel: formatWeekLabel(weekStart),
    events: emptyEvents(),
    goals: defaultGoals(),
    habitsA: defaultHabitsA(),
    habitsB: defaultHabitsB(),
    habitLabels: {
      habitsA: "",
      habitsB: "",
    },
  };
}

export function normalizeWeekData(input: unknown, weekStart: string): WeekData {
  const fallback = createDefaultWeek(weekStart);
  if (!input || typeof input !== "object") return fallback;
  const value = input as Partial<WeekData>;
  return {
    weekLabel: typeof value.weekLabel === "string" ? value.weekLabel : fallback.weekLabel,
    events: { ...fallback.events, ...(value.events ?? {}) },
    goals: Array.isArray(value.goals) ? value.goals.slice(0, 3) : fallback.goals,
    habitsA: Array.isArray(value.habitsA) ? value.habitsA : fallback.habitsA,
    habitsB: Array.isArray(value.habitsB) ? value.habitsB : fallback.habitsB,
    habitLabels:
      value.habitLabels && typeof value.habitLabels === "object"
        ? {
            habitsA: typeof value.habitLabels.habitsA === "string" ? value.habitLabels.habitsA : fallback.habitLabels.habitsA,
            habitsB: typeof value.habitLabels.habitsB === "string" ? value.habitLabels.habitsB : fallback.habitLabels.habitsB,
          }
        : fallback.habitLabels,
  };
}

export function loadLocalWeek(weekStart: string) {
  if (typeof window === "undefined") return createDefaultWeek(weekStart);
  const raw = window.localStorage.getItem(storageKey(weekStart));
  if (!raw) return createDefaultWeek(weekStart);
  try {
    return normalizeWeekData(JSON.parse(raw), weekStart);
  } catch {
    return createDefaultWeek(weekStart);
  }
}
