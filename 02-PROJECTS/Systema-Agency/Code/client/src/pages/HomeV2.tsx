import {
  BookOpen,
  CalendarDays,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  ExternalLink,
  Globe2,
  Loader2,
  Plus,
  Sparkles,
  StickyNote,
  Sun,
  X,
} from "lucide-react";
import React, { type ComponentType, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";

// ─── Types ───────────────────────────────────────────────────────────────────

type HomeShortcut = { id: string; label: string; url: string; color?: string };
type HomeNewsItem = {
  id: string;
  category: string;
  title: string;
  meta?: string;
  hot?: boolean;
  color?: string;
  url?: string;
};
type HomeProject = {
  id: string;
  name: string;
  detail?: string;
  progress: number;
  due?: string;
  color?: string;
  status?: "active" | "planned" | "queued";
};
type HomeData = {
  shortcuts: HomeShortcut[];
  news: HomeNewsItem[];
  projects: HomeProject[];
};

// ─── Constants ───────────────────────────────────────────────────────────────

const SHORTCUT_COLORS = ["#ff2d8a", "#a78bfa", "#67e8f9", "#fbbf24", "#10b981", "#f97316"];

const pageNav = [
  { label: "Notes", href: "/notes", icon: StickyNote, color: "#a78bfa" },
  { label: "Agenda", href: "/agenda", icon: CalendarDays, color: "#67e8f9" },
  { label: "Prompts", href: "/prompt-vault", icon: BookOpen, color: "#fbbf24" },
];

// ─── Weather helpers ──────────────────────────────────────────────────────────

type WeatherIcon = ComponentType<{ className?: string }>;

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Ciel dégagé",
  1: "Généralement dégagé",
  2: "Partiellement nuageux",
  3: "Couvert",
  45: "Brouillard",
  48: "Brouillard givrant",
  51: "Bruine légère",
  53: "Bruine",
  55: "Bruine forte",
  61: "Pluie légère",
  63: "Pluie",
  65: "Pluie forte",
  71: "Neige légère",
  73: "Neige",
  75: "Neige forte",
  77: "Grains de neige",
  80: "Averses légères",
  81: "Averses",
  82: "Averses fortes",
  85: "Averses de neige",
  86: "Averses de neige fortes",
  95: "Orage",
  96: "Orage avec grêle",
  99: "Orage violent",
};

const WMO_ICONS: Record<number, WeatherIcon> = {
  0: Sun,
  1: Sun,
  2: CloudSun,
  3: Cloud,
  45: Cloud,
  48: Cloud,
  51: CloudRain,
  53: CloudRain,
  55: CloudRain,
  61: CloudRain,
  63: CloudRain,
  65: CloudRain,
  71: CloudSnow,
  73: CloudSnow,
  75: CloudSnow,
  77: CloudSnow,
  80: CloudRain,
  81: CloudRain,
  82: CloudRain,
  85: CloudSnow,
  86: CloudSnow,
  95: CloudLightning,
  96: CloudLightning,
  99: CloudLightning,
};

function getWmoInfo(code: number) {
  const label = WMO_DESCRIPTIONS[code] ?? "Conditions inconnues";
  const icon = WMO_ICONS[code] ?? Cloud;
  return { label, icon };
}

type WeatherData = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
};

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code");
  url.searchParams.set("temperature_unit", "celsius");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = (await res.json()) as {
    current: { temperature_2m: number; apparent_temperature: number; weather_code: number };
  };
  return {
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    weatherCode: data.current.weather_code,
  };
}

function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function load(lat: number, lon: number) {
      fetchWeather(lat, lon)
        .then((w) => { if (!cancelled) { setWeather(w); setLoading(false); } })
        .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude),
        () => load(45.5017, -73.5673), // Montréal fallback
        { timeout: 4000 },
      );
    } else {
      load(45.5017, -73.5673);
    }

    return () => { cancelled = true; };
  }, []);

  return { weather, loading, error };
}

// ─── Base components ──────────────────────────────────────────────────────────

function HoloBubble({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={`animate-systema-holo flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff4fcb_0%,#a78bfa_35%,#67e8f9_65%,#fde047_100%)] bg-[length:200%_200%] text-[#241026] shadow-[0_7px_22px_rgba(167,139,250,.38),inset_0_1px_0_rgba(255,255,255,.7)] ${className}`}
      title={title}
    >
      {children}
    </span>
  );
}

function DashboardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative min-h-0 overflow-hidden rounded-[18px] border border-white/90 bg-white/70 p-5 text-[#1f0a18] shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_8px_28px_rgba(255,45,138,.07),0_2px_6px_rgba(255,45,138,.04)] backdrop-blur-[18px] backdrop-saturate-150 ${className}`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[.1em] text-[#1f0a18]/60">
      {children}
    </div>
  );
}

function SegmentedProgress({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex h-2 flex-1 gap-0.5">
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="min-w-0 flex-1 rounded-[1px]"
          style={{
            background: index < (value / 100) * 18 ? color : "rgba(255,45,138,.08)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Shortcuts Card ───────────────────────────────────────────────────────────

function ShortcutsCard({
  shortcuts,
  onSave,
  saving,
}: {
  shortcuts: HomeShortcut[];
  onSave: (s: HomeShortcut[]) => void;
  saving: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const labelRef = useRef<HTMLInputElement>(null);

  function openForm() {
    setAdding(true);
    setNewLabel("");
    setNewUrl("");
    setTimeout(() => labelRef.current?.focus(), 50);
  }

  function cancelForm() {
    setAdding(false);
    setNewLabel("");
    setNewUrl("");
  }

  function addShortcut() {
    const label = newLabel.trim();
    let url = newUrl.trim();
    if (!label || !url) return;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    const color = SHORTCUT_COLORS[shortcuts.length % SHORTCUT_COLORS.length];
    const next = [...shortcuts, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, label, url, color }];
    onSave(next);
    cancelForm();
  }

  function removeShortcut(id: string) {
    onSave(shortcuts.filter((s) => s.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") addShortcut();
    if (e.key === "Escape") cancelForm();
  }

  return (
    <DashboardCard className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Eyebrow>Accès web</Eyebrow>
          <h2 className="mt-1 font-['Fraunces'] text-[25px] font-medium italic leading-none text-[#1f0a18]">
            Accès rapides
          </h2>
        </div>
        <Globe2 className="h-5 w-5 text-[#ff2d8a]" />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
        {shortcuts.map((shortcut) => (
          <a
            key={shortcut.id}
            href={shortcut.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full flex-col items-center gap-1.5 rounded-xl border border-white/70 bg-white/35 px-2 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.7)] transition hover:bg-white/55"
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-[12px] text-white shadow-[0_3px_0_rgba(0,0,0,.12),0_8px_18px_rgba(255,45,138,.12),inset_0_1px_0_rgba(255,255,255,.45)]"
              style={{
                background: `linear-gradient(135deg, ${shortcut.color ?? "#ff2d8a"}, ${shortcut.color ?? "#ff2d8a"}cc)`,
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </span>
            <span className="max-w-full truncate text-[11px] font-semibold text-[#1f0a18]/65">
              {shortcut.label}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); removeShortcut(shortcut.id); }}
              className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-[#ff2d8a]/10 text-[#ff2d8a] transition hover:bg-[#ff2d8a]/25 group-hover:flex"
              title="Supprimer"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </a>
        ))}

        {shortcuts.length < 12 && !adding && (
          <button
            onClick={openForm}
            className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed border-[#ff2d8a]/30 bg-[#ff2d8a]/04 px-2 py-3 text-center transition hover:border-[#ff2d8a]/50 hover:bg-[#ff2d8a]/08"
            type="button"
            disabled={saving}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#ff2d8a]/25 text-[#ff2d8a]">
              <Plus className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-semibold text-[#ff2d8a]/60">Ajouter</span>
          </button>
        )}
      </div>

      {adding && (
        <div className="mt-3 rounded-xl border border-[#ff2d8a]/20 bg-white/50 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.8)]">
          <div className="flex flex-col gap-2">
            <input
              ref={labelRef}
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nom du raccourci"
              className="w-full rounded-lg border border-[#ff2d8a]/20 bg-white/70 px-3 py-1.5 text-[12px] text-[#1f0a18] placeholder-[#1f0a18]/30 outline-none focus:border-[#ff2d8a]/50 focus:ring-1 focus:ring-[#ff2d8a]/20"
            />
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://..."
              className="w-full rounded-lg border border-[#ff2d8a]/20 bg-white/70 px-3 py-1.5 text-[12px] text-[#1f0a18] placeholder-[#1f0a18]/30 outline-none focus:border-[#ff2d8a]/50 focus:ring-1 focus:ring-[#ff2d8a]/20"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelForm}
                className="rounded-lg px-3 py-1 text-[11px] font-semibold text-[#1f0a18]/45 transition hover:text-[#1f0a18]/70"
                type="button"
              >
                Annuler
              </button>
              <button
                onClick={addShortcut}
                disabled={!newLabel.trim() || !newUrl.trim() || saving}
                className="rounded-lg bg-[#ff2d8a] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_2px_0_rgba(255,45,138,.5)] transition disabled:opacity-40 hover:enabled:brightness-110"
                type="button"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}

// ─── Weather Card ─────────────────────────────────────────────────────────────

function WeatherMiniCard() {
  const { weather, loading, error } = useWeather();

  const info = weather ? getWmoInfo(weather.weatherCode) : null;
  const WeatherIcon = info?.icon ?? CloudSun;

  return (
    <DashboardCard>
      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          <Eyebrow>Météo</Eyebrow>
          {loading && (
            <div className="mt-2 flex items-center gap-2 text-[#1f0a18]/40">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Chargement…</span>
            </div>
          )}
          {error && !loading && (
            <div className="mt-1 font-['Fraunces'] text-[18px] font-medium italic leading-tight text-[#1f0a18]/50">
              Indisponible
            </div>
          )}
          {weather && !loading && (
            <>
              <div className="mt-1 font-['Fraunces'] text-[34px] font-medium italic leading-none text-[#1f0a18]">
                {weather.temperature}°C
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-[#1f0a18]/50">
                {info?.label}
              </div>
              <div className="mt-0.5 text-[10px] font-medium text-[#1f0a18]/35">
                Ressenti {weather.apparentTemperature}°C
              </div>
            </>
          )}
        </div>

        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/80 shadow-[0_5px_18px_rgba(255,45,138,.18)]"
          style={{ background: loading || error ? "rgba(255,255,255,0.55)" : "#ff2d8a" }}
        >
          <WeatherIcon
            className="h-7 w-7"
            style={{ color: loading || error ? "#ff2d8a" : "white" }}
          />
        </div>
      </div>
    </DashboardCard>
  );
}

// ─── News Card ────────────────────────────────────────────────────────────────

function NewsItem({ item }: { item: HomeNewsItem }) {
  const baseClass =
    "grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 border-t border-[#ff2d8a]/10 py-4 first:border-t-0 first:pt-1";

  const badge = (
    <span
      className="h-fit rounded-md px-2 py-1 text-center text-[10px] font-bold uppercase tracking-[.08em]"
      style={{
        background: item.hot ? (item.color ?? "#ff2d8a") : `${item.color ?? "#ff2d8a"}22`,
        color: item.hot ? "#fff" : (item.color ?? "#ff2d8a"),
        boxShadow: item.hot ? `0 2px 0 ${item.color ?? "#ff2d8a"}a6` : undefined,
      }}
    >
      {item.category}
    </span>
  );

  const body = (
    <div className="min-w-0">
      <h3 className="text-[15px] font-semibold leading-snug text-[#1f0a18]">{item.title}</h3>
      {item.meta && (
        <p className="mt-1 text-[11px] font-medium text-[#1f0a18]/38">{item.meta}</p>
      )}
    </div>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} -mx-1 cursor-pointer rounded-xl px-1 transition-colors hover:bg-[#ff2d8a]/[0.05]`}
      >
        {badge}
        {body}
      </a>
    );
  }

  return (
    <article className={baseClass}>
      {badge}
      {body}
    </article>
  );
}

function NewsCard({ news }: { news: HomeNewsItem[] }) {
  return (
    <DashboardCard className="flex flex-col lg:h-[85vh]">
      <div className="mb-4 flex shrink-0 items-baseline justify-between gap-4">
        <div>
          <Eyebrow>News du jour</Eyebrow>
          <h2 className="mt-1 font-['Fraunces'] text-[28px] font-medium italic leading-none text-[#1f0a18]">
            Ce qui bouge
          </h2>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <Sparkles className="h-6 w-6 text-[#ff2d8a]/30" />
          <p className="text-[12px] font-medium text-[#1f0a18]/30">
            Aucune news pour le moment.
          </p>
          <p className="text-[11px] text-[#1f0a18]/22">
            Les news du jour apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
          {news.map((item) => (
            <NewsItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

// ─── Projects Card ────────────────────────────────────────────────────────────

function ProjectsCard({ projects }: { projects: HomeProject[] }) {
  return (
    <DashboardCard className="flex flex-col lg:h-[85vh]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <Eyebrow>Projets en cours</Eyebrow>
          <h2 className="mt-1 font-['Fraunces'] text-[28px] font-medium italic leading-none text-[#1f0a18]">
            Priorités actives
          </h2>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <Sparkles className="h-6 w-6 text-[#ff2d8a]/30" />
          <p className="text-[12px] font-medium text-[#1f0a18]/30">
            Aucun projet pour le moment.
          </p>
          <p className="text-[11px] text-[#1f0a18]/22">
            Les projets actifs apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-white/85 bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.75)]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px]"
                      style={{ background: project.color ?? "#ff2d8a" }}
                    />
                    <h3 className="truncate text-[15px] font-bold leading-tight text-[#1f0a18]">
                      {project.name}
                    </h3>
                  </div>
                  {project.detail && (
                    <p className="mt-1 pl-[18px] text-xs font-medium text-[#1f0a18]/48">
                      {project.detail}
                    </p>
                  )}
                </div>
                {project.due && (
                  <span className="shrink-0 rounded-full bg-[#ff2d8a]/10 px-2.5 py-1 font-['VT323'] text-[17px] leading-none text-[#ff2d8a]">
                    {project.due}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <SegmentedProgress value={project.progress} color={project.color ?? "#ff2d8a"} />
                <span className="min-w-10 text-right font-['VT323'] text-[22px] leading-none text-[#ff2d8a]">
                  {project.progress}%
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

// ─── Quote Card ───────────────────────────────────────────────────────────────

function QuoteCard() {
  return (
    <DashboardCard className="bg-[linear-gradient(135deg,#ff2d8a_0%,#ff8fbf_58%,#a78bfa_100%)] text-white">
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/85">
          <Sparkles className="h-3.5 w-3.5" />
          Citation du jour
        </div>
        <p className="font-['Fraunces'] text-[15px] italic leading-snug">
          La discipline est le pont entre les objectifs et leur accomplissement.
        </p>
        <p className="mt-2 text-[11px] font-semibold text-white/90">Jim Rohn</p>
      </div>
      <div className="pointer-events-none absolute -bottom-14 right-0 font-['Fraunces'] text-[170px] italic leading-none text-white/15">
        "
      </div>
    </DashboardCard>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HomeV2() {
  const homeQuery = trpc.home.get.useQuery(undefined, {
    retry: 1,
    staleTime: 30_000,
  });
  const utils = trpc.useUtils();
  const saveMutation = trpc.home.save.useMutation({
    onSuccess: () => utils.home.get.invalidate(),
  });

  const homeData: HomeData = homeQuery.data ?? { shortcuts: [], news: [], projects: [] };

  const handleSaveShortcuts = useCallback(
    (shortcuts: HomeShortcut[]) => {
      saveMutation.mutate({ ...homeData, shortcuts });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homeData, saveMutation],
  );

  return (
    <main
      className="min-h-screen overflow-y-auto bg-[linear-gradient(135deg,#fff5fa_0%,#ffeaf3_48%,#f5e8ff_100%)] px-4 pb-8 pt-8 font-['Inter_Tight'] text-[#1f0a18] sm:px-6 lg:px-8"
      aria-label="Systema Agency — dashboard d'accueil"
    >
      <div className="pointer-events-none absolute right-[-120px] top-[-90px] h-96 w-96 rounded-full bg-[#ff2d8a]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-130px] left-[-110px] h-[420px] w-[420px] rounded-full bg-[#a78bfa]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-5">
        <header className="flex items-start gap-10">
          <div className="flex items-center gap-4">
            <img
              src="/logo-systema-agency.png"
              alt="Systema Agency"
              className="w-[170px] sm:w-[210px] mix-blend-multiply"
            />
          </div>

          <nav className="flex flex-wrap items-center justify-end gap-3 pt-2" aria-label="Navigation rapide">
            {pageNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}>
                  <HoloBubble className="h-10 w-10 cursor-pointer transition hover:-translate-y-0.5 hover:scale-105 sm:h-12 sm:w-12" title={item.label}>
                    <Icon className="h-5 w-5" />
                  </HoloBubble>
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.15fr_1.25fr] lg:items-start">
          <div className="flex flex-col gap-4">
            <ShortcutsCard
              shortcuts={homeData.shortcuts}
              onSave={handleSaveShortcuts}
              saving={saveMutation.isPending}
            />
            <WeatherMiniCard />
            <QuoteCard />
          </div>
          <NewsCard news={homeData.news} />
          <ProjectsCard projects={homeData.projects} />
        </div>
      </div>
    </main>
  );
}
