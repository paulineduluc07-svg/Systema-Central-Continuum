// AgendaPanorama.tsx — la grande fenêtre « agenda · vue panorama » de la Home.
// Lit et écrit les MÊMES données que la page Agenda (module partagé
// lib/agendaWeek) : les 7 jours avec leurs événements (ajout ＋ / retrait ×),
// puis les 3 objectifs de la semaine — titre éditable, items cochables,
// ajout rapide d'items. Tout persiste (localStorage + Neon si connectée).
// Les agents MCP écrivent au même endroit (add_agenda_event, set_agenda_goals).

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  addDays,
  clone,
  DAYS,
  dateFromIso,
  dateToIso,
  formatWeekLabel,
  loadLocalWeek,
  mondayOf,
  normalizeWeekData,
  storageKey,
  type AccentKey,
  type DayKey,
  type WeekData,
} from "@/lib/agendaWeek";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { playClickSound } from "./clickSound";

const DAY_NAMES: Record<string, string> = {
  LUN: "lun", MAR: "mar", MER: "mer", JEU: "jeu", VEN: "ven", SAM: "sam", DIM: "dim",
};

// Couleur de pastille d'événement par accent (palette du mockup Dollhouse).
const EVENT_BG: Record<AccentKey, string> = {
  pink: "bg-[#ffccd5]",
  violet: "bg-[#dfb2f4]/50",
  lavender: "bg-[#e7d9fb]",
  cyan: "bg-[#c2e9fb]",
  mint: "bg-[#e6fcf5]",
};

// Thème de carte objectif par accent.
const GOAL_THEME: Record<AccentKey, { bg: string; title: string; item: string; check: string; divider: string; tagline: string }> = {
  pink: { bg: "bg-[#fff0f3]", title: "text-rose-600", item: "text-rose-950", check: "text-rose-600", divider: "border-rose-200", tagline: "text-rose-400" },
  mint: { bg: "bg-[#e6fcf5]", title: "text-teal-600", item: "text-teal-950", check: "text-teal-600", divider: "border-teal-200", tagline: "text-teal-400" },
  violet: { bg: "bg-[#f3f0fc]", title: "text-purple-600", item: "text-purple-950", check: "text-purple-600", divider: "border-purple-200", tagline: "text-purple-400" },
  lavender: { bg: "bg-[#f6efff]", title: "text-violet-600", item: "text-violet-950", check: "text-violet-600", divider: "border-violet-200", tagline: "text-violet-400" },
  cyan: { bg: "bg-[#eaf6fe]", title: "text-sky-600", item: "text-sky-950", check: "text-sky-600", divider: "border-sky-200", tagline: "text-sky-400" },
};

const GOAL_TAGLINES = ["vibe check • optimal", "cpu load • active", "oracle level • high"];

export function AgendaPanorama() {
  const currentWeekStart = dateToIso(mondayOf(new Date()));
  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const [weekData, setWeekData] = useState<WeekData>(() => loadLocalWeek(currentWeekStart));
  const [addingDay, setAddingDay] = useState<DayKey | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newItemTexts, setNewItemTexts] = useState<Record<number, string>>({});
  const { isAuthenticated } = useAuth();
  const saveMutation = trpc.agenda.save.useMutation();
  const agendaQuery = trpc.agenda.get.useQuery(
    { weekStart },
    { enabled: isAuthenticated, refetchOnWindowFocus: false },
  );

  // Changement de semaine : repartir de la version locale (le tRPC suit via sa clé weekStart).
  useEffect(() => {
    setWeekData(loadLocalWeek(weekStart));
    setAddingDay(null);
  }, [weekStart]);

  useEffect(() => {
    if (!isAuthenticated || !agendaQuery.isSuccess) return;
    if (!agendaQuery.data?.data) return;
    try {
      const parsed = normalizeWeekData(JSON.parse(agendaQuery.data.data), weekStart);
      setWeekData(parsed);
      window.localStorage.setItem(storageKey(weekStart), JSON.stringify(parsed));
    } catch {
      // semaine illisible — on garde la version locale
    }
  }, [agendaQuery.data, agendaQuery.isSuccess, isAuthenticated, weekStart]);

  // La même persistance que la page Agenda : état + localStorage + Neon.
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

  const toggleGoalItem = (goalIndex: number, itemIndex: number) => {
    playClickSound();
    persistWeek((current) => {
      const item = current.goals[goalIndex]?.items[itemIndex];
      if (item) item.done = !item.done;
      return current;
    });
  };

  const setGoalTitle = (goalIndex: number, title: string) => {
    persistWeek((current) => {
      if (current.goals[goalIndex]) current.goals[goalIndex].title = title;
      return current;
    });
  };

  const setGoalItemText = (goalIndex: number, itemIndex: number, text: string) => {
    persistWeek((current) => {
      const item = current.goals[goalIndex]?.items[itemIndex];
      if (item) {
        item.text = text;
        if (!text.trim()) item.done = false;
      }
      return current;
    });
  };

  // Retirer = vider le slot (le rendu filtre les textes vides, et addGoalItem réutilise les slots libres).
  const removeGoalItem = (goalIndex: number, itemIndex: number) => {
    playClickSound();
    persistWeek((current) => {
      const item = current.goals[goalIndex]?.items[itemIndex];
      if (item) {
        item.text = "";
        item.done = false;
      }
      return current;
    });
  };

  const addGoalItem = (goalIndex: number) => {
    const text = (newItemTexts[goalIndex] ?? "").trim();
    if (!text) return;
    playClickSound();
    persistWeek((current) => {
      const goal = current.goals[goalIndex];
      if (!goal) return current;
      const emptySlot = goal.items.find((item) => item.text.trim() === "");
      if (emptySlot) {
        emptySlot.text = text;
        emptySlot.done = false;
      } else {
        goal.items.push({ text, done: false });
      }
      return current;
    });
    setNewItemTexts((prev) => ({ ...prev, [goalIndex]: "" }));
  };

  const addEvent = (day: DayKey) => {
    const title = newEventTitle.trim();
    if (!title) {
      setAddingDay(null);
      return;
    }
    playClickSound();
    persistWeek((current) => {
      current.events[day].push({ time: "", title, color: "pink" });
      return current;
    });
    setNewEventTitle("");
    setAddingDay(null);
  };

  const removeEvent = (day: DayKey, eventIndex: number) => {
    playClickSound();
    persistWeek((current) => {
      current.events[day] = current.events[day].filter((_, index) => index !== eventIndex);
      return current;
    });
  };

  const shiftWeek = (days: number) => {
    playClickSound();
    setWeekStart((current) => dateToIso(addDays(dateFromIso(current), days)));
  };

  const monday = dateFromIso(weekStart);
  const todayIso = dateToIso(new Date());
  const isCurrentWeek = weekStart === currentWeekStart;

  return (
    <div className="mb-6 overflow-hidden rounded-none border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000] select-none">
      {/* Barre de titre */}
      <div className="flex items-center justify-between border-b-[3px] border-black bg-gradient-to-r from-[#e85d97] to-[#dfb2f4] px-3 py-1.5 text-white">
        <span className="home-pixel text-sm font-bold tracking-wider uppercase md:text-base">
          🗓️ agenda · vue panorama
        </span>
        {/* Navigation de semaine */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => shiftWeek(-7)}
            title="Semaine précédente"
            className="flex h-5 w-5 cursor-pointer items-center justify-center border-2 border-black bg-white font-mono text-[11px] font-black text-black hover:bg-zinc-100"
          >
            ‹
          </button>
          <span className="home-pixel hidden min-w-[110px] border-2 border-black bg-white px-1.5 text-center text-[10px] font-bold text-black uppercase sm:block">
            {formatWeekLabel(weekStart)}
          </span>
          <button
            onClick={() => shiftWeek(7)}
            title="Semaine suivante"
            className="flex h-5 w-5 cursor-pointer items-center justify-center border-2 border-black bg-white font-mono text-[11px] font-black text-black hover:bg-zinc-100"
          >
            ›
          </button>
          {!isCurrentWeek && (
            <button
              onClick={() => {
                playClickSound();
                setWeekStart(currentWeekStart);
              }}
              title="Revenir à la semaine courante"
              className="home-pixel cursor-pointer border-2 border-black bg-[#ffccd5] px-1.5 text-[10px] font-bold text-black uppercase hover:bg-[#ffb3c1]"
            >
              aujourd'hui
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Link href="/agenda">
            <span className="home-pixel cursor-pointer border-2 border-black bg-white px-1.5 text-[10px] font-bold text-black uppercase hover:bg-zinc-100">
              ouvrir →
            </span>
          </Link>
          <span className="flex h-4 w-4 items-center justify-center border-2 border-black bg-white font-mono text-[9px] font-black text-black">_</span>
          <span className="flex h-4 w-4 items-center justify-center border-2 border-black bg-white font-mono text-[9px] font-black text-black">□</span>
          <span className="flex h-4 w-4 items-center justify-center border-2 border-black bg-white font-mono text-[9px] font-black text-black">X</span>
        </div>
      </div>

      <div className="bg-white p-4">
        {/* RANGÉE 1 : les 7 jours */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {DAYS.map((day, index) => {
            const date = addDays(monday, index);
            const isToday = dateToIso(date) === todayIso;
            return (
              <div
                key={day}
                className={`group/day flex min-h-[95px] flex-col justify-between rounded-none border-2 border-black p-2 shadow-[2px_2px_0px_#000000] transition-all hover:translate-y-[-2px] ${
                  isToday ? "bg-[#ffccd5]" : "bg-white"
                }`}
              >
                <div>
                  <div className="mb-1.5 flex items-center justify-between border-b border-black pb-1">
                    <span className="font-mono text-[10px] font-black text-zinc-500 uppercase">{DAY_NAMES[day]}</span>
                    <span className="home-pixel text-xs font-bold text-black">#{date.getDate()}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {weekData.events[day].map((event, idx) =>
                      event.title.trim() === "" ? null : (
                        <div
                          key={idx}
                          title={event.time ? `${event.time} — ${event.title}` : event.title}
                          className={`group/event relative rounded-none border border-black px-1 py-0.5 text-center text-[8px] font-black tracking-wide text-black uppercase shadow-[1px_1px_0px_#000000] select-none md:text-[9.5px] ${EVENT_BG[event.color] ?? EVENT_BG.pink}`}
                        >
                          {event.title}
                          <button
                            onClick={() => removeEvent(day, idx)}
                            title="Retirer cet événement"
                            className="absolute -top-1.5 -right-1.5 hidden h-3.5 w-3.5 cursor-pointer items-center justify-center border border-black bg-red-200 text-[8px] font-black group-hover/event:flex hover:bg-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Ajout rapide d'un événement */}
                {addingDay === day ? (
                  <input
                    autoFocus
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    onBlur={() => addEvent(day)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addEvent(day);
                      if (e.key === "Escape") {
                        setNewEventTitle("");
                        setAddingDay(null);
                      }
                    }}
                    placeholder="quoi ?"
                    className="mt-1.5 w-full border border-black bg-white px-1 py-0.5 font-mono text-[9px] focus:outline-none"
                  />
                ) : (
                  <button
                    onClick={() => {
                      setAddingDay(day);
                      setNewEventTitle("");
                    }}
                    title={`Ajouter un événement ${DAY_NAMES[day]}`}
                    className="mt-1.5 hidden w-full cursor-pointer border border-dashed border-zinc-300 text-center font-mono text-[9px] text-zinc-400 group-hover/day:block hover:border-black hover:text-black"
                  >
                    ＋
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* RANGÉE 2 : objectifs de la semaine */}
        <div className="border-t-[3px] border-black pt-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2.5 w-2.5 shrink-0 rotate-45 bg-black"></div>
            <h3 className="home-bubble text-sm font-extrabold tracking-wider text-black uppercase">
              objectifs de la semaine
            </h3>
            <div className="flex-grow border-t-2 border-dashed border-zinc-200"></div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {weekData.goals.map((goal, goalIndex) => {
              const theme = GOAL_THEME[goal.accent] ?? GOAL_THEME.pink;
              const items = goal.items
                .map((item, itemIndex) => ({ ...item, itemIndex }))
                .filter((item) => item.text.trim() !== "");
              return (
                <div
                  key={goalIndex}
                  className={`flex flex-col justify-between rounded-none border-[3px] border-black p-4 shadow-[3px_3px_0px_#000000] ${theme.bg}`}
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between border-b-2 border-black/10 pb-2">
                      <input
                        type="text"
                        defaultValue={goal.title}
                        key={`${goalIndex}-${goal.title}`}
                        onBlur={(e) => {
                          if (e.target.value !== goal.title) setGoalTitle(goalIndex, e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        }}
                        placeholder={`objectif ${goalIndex + 1}`}
                        className={`home-bubble w-full bg-transparent text-sm font-black tracking-wide uppercase focus:outline-none ${theme.title}`}
                      />
                    </div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={`${item.itemIndex}-${item.text}`}
                          className={`group/item flex items-center gap-2.5 text-xs font-semibold select-none ${theme.item}`}
                        >
                          <div
                            onClick={() => toggleGoalItem(goalIndex, item.itemIndex)}
                            title={item.done ? "Décocher" : "Cocher"}
                            className="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-none border-2 border-black bg-white hover:opacity-80"
                          >
                            {item.done && <span className={`text-[10px] font-black ${theme.check}`}>✖</span>}
                          </div>
                          <input
                            type="text"
                            defaultValue={item.text}
                            onBlur={(e) => {
                              if (e.target.value !== item.text) setGoalItemText(goalIndex, item.itemIndex, e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            }}
                            className={`w-full bg-transparent focus:outline-none ${item.done ? "line-through opacity-50" : ""}`}
                          />
                          <button
                            onClick={() => removeGoalItem(goalIndex, item.itemIndex)}
                            title="Retirer cet item"
                            className="hidden h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center border border-black bg-red-200 text-[8px] font-black text-black group-hover/item:flex hover:bg-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Ajout rapide d'un item */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addGoalItem(goalIndex);
                      }}
                      className="mt-2 flex items-center gap-1"
                    >
                      <input
                        type="text"
                        value={newItemTexts[goalIndex] ?? ""}
                        onChange={(e) => setNewItemTexts((prev) => ({ ...prev, [goalIndex]: e.target.value }))}
                        placeholder="ajouter..."
                        className={`w-full border-b border-black/15 bg-transparent px-1 text-xs focus:border-black/50 focus:outline-none ${theme.item} placeholder:opacity-40`}
                      />
                      <button type="submit" className={`cursor-pointer text-sm ${theme.title}`} title="Ajouter l'item">
                        ＋
                      </button>
                    </form>
                  </div>
                  <div className={`mt-4 border-t pt-2 text-right ${theme.divider}`}>
                    <span className={`font-mono text-[8px] tracking-widest uppercase ${theme.tagline}`}>
                      {GOAL_TAGLINES[goalIndex] ?? "system • ok"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
