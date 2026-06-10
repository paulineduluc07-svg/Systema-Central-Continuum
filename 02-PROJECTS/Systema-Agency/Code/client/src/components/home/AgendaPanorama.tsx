// AgendaPanorama.tsx — la grande fenêtre « agenda · vue panorama » de la Home.
// Lit et écrit les MÊMES données que la page Agenda (module partagé
// lib/agendaWeek) : les 7 jours avec leurs événements, puis les 3 objectifs
// de la semaine avec leurs items cochables (le coche persiste).

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  addDays,
  clone,
  DAYS,
  dateFromIso,
  dateToIso,
  loadLocalWeek,
  mondayOf,
  normalizeWeekData,
  storageKey,
  type AccentKey,
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
  const weekStart = dateToIso(mondayOf(new Date()));
  const [weekData, setWeekData] = useState<WeekData>(() => loadLocalWeek(weekStart));
  const { isAuthenticated } = useAuth();
  const saveMutation = trpc.agenda.save.useMutation();
  const agendaQuery = trpc.agenda.get.useQuery(
    { weekStart },
    { enabled: isAuthenticated, refetchOnWindowFocus: false },
  );

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

  const toggleGoalItem = (goalIndex: number, itemIndex: number) => {
    playClickSound();
    setWeekData((current) => {
      const next = clone(current);
      const item = next.goals[goalIndex]?.items[itemIndex];
      if (item) item.done = !item.done;
      window.localStorage.setItem(storageKey(weekStart), JSON.stringify(next));
      if (isAuthenticated) {
        saveMutation.mutate({ weekStart, data: JSON.stringify(next) });
      }
      return next;
    });
  };

  const monday = dateFromIso(weekStart);
  const todayIso = dateToIso(new Date());
  const hasAnyEvent = DAYS.some((day) => weekData.events[day].some((e) => e.title.trim() !== ""));

  return (
    <div className="mb-6 overflow-hidden rounded-none border-[3px] border-black bg-white shadow-[4px_4px_0px_#000000] select-none">
      {/* Barre de titre */}
      <div className="flex items-center justify-between border-b-[3px] border-black bg-gradient-to-r from-[#e85d97] to-[#dfb2f4] px-3 py-1.5 text-white">
        <span className="home-pixel text-sm font-bold tracking-wider uppercase md:text-base">
          🗓️ agenda · vue panorama
        </span>
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
            const events = weekData.events[day].filter((e) => e.title.trim() !== "");
            return (
              <div
                key={day}
                className={`flex min-h-[95px] flex-col justify-between rounded-none border-2 border-black p-2 shadow-[2px_2px_0px_#000000] transition-all hover:translate-y-[-2px] ${
                  isToday ? "bg-[#ffccd5]" : "bg-white"
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between border-b border-black pb-1">
                  <span className="font-mono text-[10px] font-black text-zinc-500 uppercase">{DAY_NAMES[day]}</span>
                  <span className="home-pixel text-xs font-bold text-black">#{date.getDate()}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {events.map((event, idx) => (
                    <div
                      key={idx}
                      title={event.time ? `${event.time} — ${event.title}` : event.title}
                      className={`rounded-none border border-black px-1 py-0.5 text-center text-[8px] font-black tracking-wide text-black uppercase shadow-[1px_1px_0px_#000000] select-none md:text-[9.5px] ${EVENT_BG[event.color] ?? EVENT_BG.pink}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {!hasAnyEvent && (
          <p className="home-pixel -mt-4 mb-4 text-center text-xs text-zinc-400">
            semaine vide pour l'instant — remplis-la dans l'agenda ✨
          </p>
        )}

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
                      <span className={`home-bubble text-sm font-black tracking-wide uppercase ${theme.title}`}>
                        {goal.title.trim() || `objectif ${goalIndex + 1}`}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {items.length === 0 && (
                        <p className="home-pixel text-xs text-zinc-400">rien ici — ajoute tes items dans l'agenda</p>
                      )}
                      {items.map((item) => (
                        <div
                          key={item.itemIndex}
                          onClick={() => toggleGoalItem(goalIndex, item.itemIndex)}
                          className={`flex cursor-pointer items-center gap-2.5 text-xs font-semibold select-none hover:opacity-80 ${theme.item}`}
                        >
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-none border-2 border-black bg-white">
                            {item.done && <span className={`text-[10px] font-black ${theme.check}`}>✖</span>}
                          </div>
                          <span className={item.done ? "line-through opacity-50" : ""}>{item.text}</span>
                        </div>
                      ))}
                    </div>
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
