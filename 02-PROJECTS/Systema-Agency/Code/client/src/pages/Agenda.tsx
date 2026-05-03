import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type AccentKey = "pink" | "violet" | "lavender" | "cyan" | "mint";
type DayKey = "LUN" | "MAR" | "MER" | "JEU" | "VEN" | "SAM" | "DIM";

type AgendaEvent = {
  time: string;
  title: string;
  color: AccentKey;
};

type Goal = {
  title: string;
  accent: AccentKey;
  items: { text: string; done: boolean }[];
};

type Habit = {
  name: string;
  grid: (0 | 1 | 2)[];
  accent: AccentKey;
};

type WeekData = {
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

const DAYS: DayKey[] = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
const DAYS_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const DAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS = ["janv.", "fevr.", "mars", "avr.", "mai", "juin", "juil.", "aout", "sept.", "oct.", "nov.", "dec."];
const ACCENT_HUES: Record<AccentKey, number> = {
  pink: 345,
  violet: 305,
  lavender: 272,
  cyan: 205,
  mint: 155,
};
const ACCENT_ORDER: AccentKey[] = ["pink", "violet", "lavender", "cyan", "mint"];

const emptyEvents = (): Record<DayKey, AgendaEvent[]> => ({
  LUN: [],
  MAR: [],
  MER: [],
  JEU: [],
  VEN: [],
  SAM: [],
  DIM: [],
});

const defaultGoals = (): Goal[] => [
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

const defaultHabitsA = (): Habit[] => [
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "pink" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "lavender" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "violet" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "cyan" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "mint" },
];

const defaultHabitsB = (): Habit[] => [
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "cyan" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "pink" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "violet" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "lavender" },
  { name: "", grid: [0, 0, 0, 0, 0, 0, 0], accent: "mint" },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function dateToIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function mondayOf(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const day = next.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + delta);
  return next;
}

function formatDayLabel(date: Date) {
  const day = date.getDate();
  return day === 1 ? "1er" : String(day);
}

function formatWeekLabel(weekStart: string) {
  const start = dateFromIso(weekStart);
  const end = addDays(start, 6);
  const startMonth = MONTHS[start.getMonth()];
  const endMonth = MONTHS[end.getMonth()];
  const startLabel = startMonth === endMonth ? formatDayLabel(start) : `${formatDayLabel(start)} ${startMonth}`;
  return `${startLabel} - ${formatDayLabel(end)} ${endMonth}`;
}

function storageKey(weekStart: string) {
  return `systema_agenda_week_${weekStart}`;
}

function createDefaultWeek(weekStart: string): WeekData {
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

function normalizeWeekData(input: unknown, weekStart: string): WeekData {
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

function loadLocalWeek(weekStart: string) {
  if (typeof window === "undefined") return createDefaultWeek(weekStart);
  const raw = window.localStorage.getItem(storageKey(weekStart));
  if (!raw) return createDefaultWeek(weekStart);
  try {
    return normalizeWeekData(JSON.parse(raw), weekStart);
  } catch {
    return createDefaultWeek(weekStart);
  }
}

function nextAccent(accent: AccentKey) {
  const index = ACCENT_ORDER.indexOf(accent);
  return ACCENT_ORDER[(index + 1) % ACCENT_ORDER.length];
}

function EditableText({
  value,
  className,
  style,
  onCommit,
  ariaLabel,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
  onCommit: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <input
      type="text"
      aria-label={ariaLabel}
      value={value}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => onCommit(event.currentTarget.value)}
      onBlur={(event) => {
        const trimmed = event.currentTarget.value.trim();
        if (trimmed !== event.currentTarget.value) onCommit(trimmed);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      className={`min-w-0 cursor-text rounded border-0 bg-transparent px-1 py-0 outline-none caret-white placeholder:text-white/35 hover:bg-white/10 focus:bg-white/15 focus-visible:ring-1 focus-visible:ring-white/60 ${className ?? ""}`}
      style={style}
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-white/65">
      {children}
    </div>
  );
}

function ScriptTitle({ children, size = 42, hue = 350 }: { children: React.ReactNode; size?: number; hue?: number }) {
  return (
    <div
      className="font-handwriting font-bold leading-none text-white"
      style={{
        fontSize: size,
        textShadow: `0 0 24px oklch(86% 0.13 ${hue} / 0.55)`,
      }}
    >
      {children}
    </div>
  );
}

function AccentCycleButton({
  accent,
  onClick,
  label,
  size = 10,
}: {
  accent: AccentKey;
  onClick: () => void;
  label: string;
  size?: number;
}) {
  const hue = ACCENT_HUES[accent];
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="shrink-0 rounded-full border border-white/35"
      style={{
        width: size,
        height: size,
        background: `oklch(88% 0.12 ${hue})`,
        boxShadow: `0 0 10px oklch(86% 0.14 ${hue} / 0.75)`,
      }}
    />
  );
}

function AgendaCheckbox({
  checked,
  accent,
  onChange,
}: {
  checked: boolean;
  accent: AccentKey;
  onChange: (checked: boolean) => void;
}) {
  const hue = ACCENT_HUES[accent];
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[4px]"
      style={{
        border: `1.2px solid oklch(90% 0.08 ${hue} / 0.65)`,
        background: checked ? `oklch(84% 0.13 ${hue})` : "rgba(255,255,255,0.06)",
        boxShadow: checked ? `0 0 10px oklch(84% 0.14 ${hue} / 0.65)` : "none",
      }}
    >
      {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
    </button>
  );
}

function HabitBead({
  value,
  accent,
  onClick,
}: {
  value: 0 | 1 | 2;
  accent: AccentKey;
  onClick: () => void;
}) {
  const hue = ACCENT_HUES[accent];
  return (
    <button
      type="button"
      aria-label="Basculer l'habitude"
      aria-pressed={value > 0}
      onClick={onClick}
      className="h-[22px] w-[22px] rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60"
      style={{
        border: value === 0 ? "1px solid rgba(255,255,255,0.25)" : `1px solid oklch(92% 0.08 ${hue} / 0.78)`,
        opacity: value === 0 ? 0.7 : value === 2 ? 0.6 : 1,
        background:
          value === 0
            ? "transparent"
            : `radial-gradient(circle at 35% 30%, oklch(97% 0.06 ${hue}) 0%, oklch(82% 0.13 ${hue}) 76%)`,
        boxShadow:
          value === 0
            ? "none"
            : `0 0 12px oklch(86% 0.13 ${hue} / 0.68), inset 0 1px 2px rgba(255,255,255,0.58)`,
      }}
    />
  );
}

export default function AgendaPage() {
  const initialWeekStart = dateToIso(mondayOf(new Date()));
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [weekData, setWeekData] = useState<WeekData>(() => loadLocalWeek(initialWeekStart));
  const { isAuthenticated } = useAuth();
  const saveMutation = trpc.agenda.save.useMutation({
    onError: (error) => toast.error(`Sauvegarde Agenda impossible : ${error.message}`),
  });
  const agendaQuery = trpc.agenda.get.useQuery(
    { weekStart },
    {
      enabled: isAuthenticated,
      refetchOnWindowFocus: false,
    },
  );

  const weekDates = useMemo(() => {
    const start = dateFromIso(weekStart);
    return DAYS.map((_, index) => addDays(start, index));
  }, [weekStart]);
  const todayIso = dateToIso(new Date());
  const headerYear = weekDates[0].getFullYear() === weekDates[6].getFullYear()
    ? String(weekDates[0].getFullYear())
    : `${weekDates[0].getFullYear()} / ${weekDates[6].getFullYear()}`;

  useEffect(() => {
    setWeekData(loadLocalWeek(weekStart));
  }, [weekStart]);

  useEffect(() => {
    if (!isAuthenticated || !agendaQuery.isSuccess) return;
    if (!agendaQuery.data?.data) return;
    try {
      const parsed = normalizeWeekData(JSON.parse(agendaQuery.data.data), weekStart);
      setWeekData(parsed);
      window.localStorage.setItem(storageKey(weekStart), JSON.stringify(parsed));
    } catch {
      toast.error("La semaine Agenda sauvegardee est illisible.");
    }
  }, [agendaQuery.data, agendaQuery.isSuccess, isAuthenticated, weekStart]);

  const persistWeek = (updater: (current: WeekData) => WeekData) => {
    setWeekData((current) => {
      const next = updater(clone(current));
      window.localStorage.setItem(storageKey(weekStart), JSON.stringify(next));
      if (isAuthenticated) {
        saveMutation.mutate({ weekStart, data: JSON.stringify(next) });
      }
      return next;
    });
  };

  const shiftWeek = (days: number) => {
    setWeekStart((current) => dateToIso(addDays(dateFromIso(current), days)));
  };

  const updateEvent = (day: DayKey, eventIndex: number, patch: Partial<AgendaEvent>) => {
    persistWeek((current) => ({
      ...current,
      events: {
        ...current.events,
        [day]: current.events[day].map((event, index) => (index === eventIndex ? { ...event, ...patch } : event)),
      },
    }));
  };

  const addEvent = (day: DayKey) => {
    persistWeek((current) => ({
      ...current,
      events: {
        ...current.events,
        [day]: [...current.events[day], { time: "", title: "", color: "pink" }],
      },
    }));
  };

  const deleteEvent = (day: DayKey, eventIndex: number) => {
    persistWeek((current) => ({
      ...current,
      events: {
        ...current.events,
        [day]: current.events[day].filter((_, index) => index !== eventIndex),
      },
    }));
  };

  const updateGoal = (goalIndex: number, patch: Partial<Goal>) => {
    persistWeek((current) => ({
      ...current,
      goals: current.goals.map((goal, index) => (index === goalIndex ? { ...goal, ...patch } : goal)),
    }));
  };

  const updateGoalItem = (goalIndex: number, itemIndex: number, patch: Partial<Goal["items"][number]>) => {
    persistWeek((current) => ({
      ...current,
      goals: current.goals.map((goal, index) =>
        index === goalIndex
          ? {
              ...goal,
              items: goal.items.map((item, innerIndex) => (innerIndex === itemIndex ? { ...item, ...patch } : item)),
            }
          : goal,
      ),
    }));
  };

  const updateHabit = (group: "habitsA" | "habitsB", habitIndex: number, patch: Partial<Habit>) => {
    persistWeek((current) => ({
      ...current,
      [group]: current[group].map((habit, index) => (index === habitIndex ? { ...habit, ...patch } : habit)),
    }));
  };

  const updateHabitLabel = (group: "habitsA" | "habitsB", label: string) => {
    persistWeek((current) => ({
      ...current,
      habitLabels: {
        ...current.habitLabels,
        [group]: label,
      },
    }));
  };

  const cycleHabit = (group: "habitsA" | "habitsB", habitIndex: number, dayIndex: number) => {
    persistWeek((current) => ({
      ...current,
      [group]: current[group].map((habit, index) =>
        index === habitIndex
          ? {
              ...habit,
              grid: habit.grid.map((value, innerIndex) =>
                innerIndex === dayIndex ? (((value + 1) % 3) as 0 | 1 | 2) : value,
              ),
            }
          : habit,
      ),
    }));
  };

  return (
    <main
      className="-mt-20 min-h-screen overflow-x-auto text-white"
      style={{
        background:
          "radial-gradient(ellipse at top, oklch(30% 0.1 320) 0%, oklch(15% 0.05 280) 70%)",
      }}
    >
      <div className="min-w-[1180px] px-10 pb-10 pt-[104px]">
        <header className="relative mb-6 min-h-[86px]">
          <div>
            <Eyebrow>Systema · agenda</Eyebrow>
            <ScriptTitle size={62}>Cette semaine</ScriptTitle>
          </div>
          <div className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-8">
            <button
              type="button"
              aria-label="Semaine precedente"
              onClick={() => shiftWeek(-7)}
              className="grid h-8 w-8 place-items-center rounded-[10px] border border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="min-w-56 text-center">
              <EditableText
                value={weekData.weekLabel}
                ariaLabel="Libelle de semaine"
                onCommit={(value) => persistWeek((current) => ({ ...current, weekLabel: value }))}
                className="block w-full text-center font-handwriting text-[30px] leading-none text-[oklch(88%_0.18_350)] outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              />
              <Eyebrow>{headerYear}</Eyebrow>
            </div>
            <button
              type="button"
              aria-label="Semaine suivante"
              onClick={() => shiftWeek(7)}
              className="grid h-8 w-8 place-items-center rounded-[10px] border border-white/25 bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </header>

        <section className="mb-[22px] grid grid-cols-7 gap-2.5">
          {DAYS.map((day, dayIndex) => {
            const date = weekDates[dayIndex];
            const isToday = dateToIso(date) === todayIso;
            return (
              <div
                key={day}
                className="min-h-[180px] rounded-2xl p-2.5"
                style={{
                  background: isToday
                    ? "linear-gradient(160deg, oklch(84% 0.11 345 / 0.28) 0%, oklch(80% 0.09 305 / 0.16) 100%)"
                    : "linear-gradient(160deg, oklch(95% 0.04 320 / 0.10) 0%, oklch(95% 0.04 320 / 0.04) 100%)",
                  border: isToday
                    ? "1px solid oklch(92% 0.08 345 / 0.55)"
                    : "1px solid oklch(95% 0.04 320 / 0.2)",
                  backdropFilter: "blur(20px) saturate(140%)",
                  WebkitBackdropFilter: "blur(20px) saturate(140%)",
                  boxShadow: isToday
                    ? "0 18px 40px -16px oklch(84% 0.13 345 / 0.45), inset 0 1px 0 0 rgba(255,255,255,0.3)"
                    : "0 12px 28px -16px oklch(20% 0.05 320 / 0.5), inset 0 1px 0 0 rgba(255,255,255,0.2)",
                }}
              >
                <div className="mb-2.5 flex items-baseline justify-between">
                  <div className="font-handwriting text-[22px] leading-none text-white">{DAYS_FULL[dayIndex]}</div>
                  <div
                    className="font-mono text-sm font-semibold"
                    style={{ color: isToday ? "oklch(94% 0.08 345)" : "rgba(255,255,255,0.55)" }}
                  >
                    {date.getDate()}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {weekData.events[day].map((event, eventIndex) => {
                    const hue = ACCENT_HUES[event.color];
                    return (
                      <div
                        key={`${day}-${eventIndex}`}
                        className="group/event relative rounded-lg px-[7px] py-[5px] pr-7"
                        style={{
                          background: `oklch(86% 0.10 ${hue} / 0.30)`,
                          border: `1px solid oklch(92% 0.08 ${hue} / 0.55)`,
                          boxShadow: `0 8px 22px -16px oklch(86% 0.13 ${hue} / 0.65), inset 0 1px 0 rgba(255,255,255,0.24)`,
                        }}
                      >
                        <button
                          type="button"
                          aria-label="Supprimer l'evenement"
                          title="Supprimer"
                          onClick={() => deleteEvent(day, eventIndex)}
                          className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-white/10 text-white/55 opacity-70 transition hover:bg-white/25 hover:text-white group-hover/event:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="mb-0.5 flex items-center gap-1">
                          <AccentCycleButton
                            accent={event.color}
                            label="Changer la couleur de l'evenement"
                            onClick={() => updateEvent(day, eventIndex, { color: nextAccent(event.color) })}
                            size={7}
                          />
                          <EditableText
                            value={event.time}
                            ariaLabel="Heure de l'evenement"
                            onCommit={(value) => updateEvent(day, eventIndex, { time: value })}
                            className="w-16 font-mono text-[9px] outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                            style={{ color: `oklch(95% 0.07 ${hue})` }}
                          />
                        </div>
                        <EditableText
                          value={event.title}
                          ariaLabel="Titre de l'evenement"
                          onCommit={(value) => updateEvent(day, eventIndex, { title: value })}
                          className="block w-full text-[11px] leading-tight text-white outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                        />
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => addEvent(day)}
                    className="mt-0.5 rounded-md border border-dashed border-white/30 bg-transparent p-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/45 hover:bg-white/10 hover:text-white/70"
                  >
                    + Ajouter
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mb-[22px]">
          <Eyebrow>3 grands objectifs</Eyebrow>
          <div className="mt-3 grid grid-cols-3 gap-3.5">
            {weekData.goals.map((goal, goalIndex) => {
              const hue = ACCENT_HUES[goal.accent];
              const doneCount = goal.items.filter((item) => item.done).length;
              return (
                <div
                  key={goalIndex}
                  className="rounded-[22px] px-5 py-4"
                  style={{
                    background: `linear-gradient(135deg, oklch(90% 0.09 ${hue} / 0.16) 0%, oklch(78% 0.11 ${hue} / 0.09) 100%)`,
                    border: `1px solid oklch(92% 0.08 ${hue} / 0.38)`,
                    backdropFilter: "blur(20px) saturate(140%)",
                    WebkitBackdropFilter: "blur(20px) saturate(140%)",
                    boxShadow: `0 16px 40px -18px oklch(82% 0.13 ${hue} / 0.42), inset 0 1px 0 0 rgba(255,255,255,0.25)`,
                  }}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <AccentCycleButton
                      accent={goal.accent}
                      label="Changer la couleur de l'objectif"
                      onClick={() => updateGoal(goalIndex, { accent: nextAccent(goal.accent) })}
                      size={11}
                    />
                    <EditableText
                      value={goal.title}
                      ariaLabel="Titre de l'objectif"
                      onCommit={(value) => updateGoal(goalIndex, { title: value })}
                      className="w-full font-handwriting text-[30px] leading-none text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      style={{ textShadow: `0 0 18px oklch(86% 0.13 ${hue} / 0.55)` }}
                    />
                  </div>
                  <div
                    className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.18em]"
                    style={{ color: `oklch(92% 0.08 ${hue})` }}
                  >
                    {doneCount}/{goal.items.length} completes
                  </div>
                  <div className="flex flex-col gap-[7px]">
                    {goal.items.map((item, itemIndex) => (
                      <label
                        key={itemIndex}
                        className="flex cursor-pointer items-center gap-2.5 text-[13px]"
                        style={{
                          color: item.done ? "rgba(255,255,255,0.5)" : "white",
                          textDecoration: item.done ? "line-through" : "none",
                        }}
                      >
                        <AgendaCheckbox
                          checked={item.done}
                          accent={goal.accent}
                          onChange={(done) => updateGoalItem(goalIndex, itemIndex, { done })}
                        />
                        <EditableText
                          value={item.text}
                          ariaLabel="Element d'objectif"
                          onCommit={(value) => updateGoalItem(goalIndex, itemIndex, { text: value })}
                          className="min-w-0 flex-1 outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3.5">
          {[
            { key: "habitsA" as const, label: weekData.habitLabels.habitsA, data: weekData.habitsA },
            { key: "habitsB" as const, label: weekData.habitLabels.habitsB, data: weekData.habitsB },
          ].map(({ key, label, data }) => (
            <div
              key={key}
              className="rounded-[18px] px-[18px] py-4"
              style={{
                background: "linear-gradient(160deg, oklch(95% 0.04 320 / 0.10) 0%, oklch(95% 0.04 320 / 0.04) 100%)",
                border: "1px solid oklch(95% 0.04 320 / 0.2)",
                backdropFilter: "blur(20px) saturate(140%)",
                WebkitBackdropFilter: "blur(20px) saturate(140%)",
                boxShadow: "0 14px 32px -18px oklch(20% 0.05 320 / 0.55), inset 0 1px 0 0 rgba(255,255,255,0.22)",
              }}
            >
              <div className="mb-3 grid grid-cols-[1fr_repeat(7,24px)] items-end gap-1">
                <div className="flex min-w-0 items-baseline gap-1 font-handwriting text-2xl leading-none text-white">
                  <span>Habitudes -</span>
                  <EditableText
                    value={label}
                    ariaLabel="Titre du groupe d'habitudes"
                    onCommit={(value) => updateHabitLabel(key, value)}
                    className="w-full font-handwriting text-2xl leading-none text-white"
                  />
                </div>
                {DAY_LETTERS.map((dayLetter, index) => (
                  <div key={`${key}-letter-${index}`} className="text-center font-mono text-[9px] text-white/55">
                    {dayLetter}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2.5">
                {data.map((habit, habitIndex) => (
                  <div key={`${key}-${habitIndex}`} className="grid grid-cols-[1fr_repeat(7,24px)] items-center gap-1">
                    <div className="flex min-w-0 items-center gap-2 pr-3 text-[12.5px] text-white">
                      <AccentCycleButton
                        accent={habit.accent}
                        label="Changer la couleur de l'habitude"
                        onClick={() => updateHabit(key, habitIndex, { accent: nextAccent(habit.accent) })}
                        size={9}
                      />
                      <EditableText
                        value={habit.name}
                        ariaLabel="Nom de l'habitude"
                        onCommit={(value) => updateHabit(key, habitIndex, { name: value })}
                        className="min-w-0 flex-1 truncate outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                      />
                    </div>
                    {habit.grid.map((value, dayIndex) => (
                      <HabitBead
                        key={`${key}-${habitIndex}-${dayIndex}`}
                        value={value}
                        accent={habit.accent}
                        onClick={() => cycleHabit(key, habitIndex, dayIndex)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
