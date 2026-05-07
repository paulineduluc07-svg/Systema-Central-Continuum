import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  ExternalLink,
  Loader2,
  Plus,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import React, { type ComponentType, useCallback, useEffect, useRef, useState } from "react";
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

const DEFAULT_SHORTCUTS: HomeShortcut[] = [
  { id: "default-claude", label: "Claude", url: "https://claude.ai", color: "#ff2d8a" },
  { id: "default-chatgpt", label: "chatgpt", url: "https://chatgpt.com", color: "#a78bfa" },
  { id: "default-google", label: "google das...", url: "https://google.com", color: "#67e8f9" },
  { id: "default-gmail", label: "Gmail", url: "https://mail.google.com", color: "#fbbf24" },
  { id: "default-notebook", label: "Notebooklm", url: "https://notebooklm.google.com", color: "#10b981" },
  { id: "default-youtube", label: "Youtube", url: "https://youtube.com", color: "#f97316" },
  { id: "default-drive", label: "Mon drive", url: "https://drive.google.com", color: "#ff2d8a" },
  { id: "default-gemini", label: "Gemini", url: "https://gemini.google.com", color: "#a78bfa" },
  { id: "default-canva", label: "canva", url: "https://canva.com", color: "#67e8f9" },
  { id: "default-keep", label: "Google keep", url: "https://keep.google.com", color: "#fbbf24" },
  { id: "default-tarot", label: "Tarot", url: "https://google.com/search?q=tarot", color: "#10b981" },
  { id: "default-drawn", label: "Drawn by P...", url: "https://google.com", color: "#f97316" },
];

const DEFAULT_NEWS: HomeNewsItem[] = [
  {
    id: "default-news-1",
    category: "IA",
    title: "orchestration qui permettent aux agents IA d’agir vraiment dans le monde",
    meta: "Pour toi : direct pour Anima Ingenium — exactement les patterns que tu construis avec Kim",
    color: "#a78bfa",
  },
  {
    id: "default-news-2",
    category: "Productivité IA",
    title: "Your AI Keeps Keeping You | Pourquoi les LLMs perdent le contexte et comment leur donner une mémoire persistante | Techniques concrètes de prompt engineering pour une IA qui se souvient de toi",
    meta: "Pour toi : CENTRAL pour Anima Ingenium — la mémoire persistante c’est exactement le problème Kim/Hermes",
    color: "#8b5cf6",
  },
  {
    id: "default-news-3",
    category: "Deep Tech/IA",
    title: "World Models, Architectures & Next Phase of AI | Le débat LeCun vs Xing — JEPA vs GLP, abstraire vs reconstruire | L’analyse la plus complète de l’état des world",
    color: "#4f6cf7",
  },
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

function DashboardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative min-h-0 overflow-hidden rounded-[22px] border border-white/65 bg-pink-100/58 p-7 text-[#170711] shadow-[inset_0_1px_0_rgba(255,255,255,.82),0_24px_55px_rgba(98,18,78,.12)] backdrop-blur-[12px] backdrop-saturate-150 ${className}`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[.1em] text-[#170711]/48">
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
    <DashboardCard className="flex min-h-[640px] flex-col px-7 pb-8 pt-[86px] lg:h-[640px]">
      <img
        src="/homepage/1.png"
        alt=""
        className="pointer-events-none absolute left-4 top-0 h-20 w-20 object-contain"
      />

      <div className="grid grid-cols-3 gap-x-5 gap-y-5 sm:grid-cols-3">
        {shortcuts.map((shortcut) => (
          <a
            key={shortcut.id}
            href={shortcut.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full flex-col items-center gap-2 text-center transition hover:-translate-y-0.5"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-[9px] text-white shadow-[0_4px_0_rgba(0,0,0,.09),0_10px_20px_rgba(255,45,138,.16),inset_0_1px_0_rgba(255,255,255,.42)]"
              style={{
                background: `linear-gradient(135deg, ${shortcut.color ?? "#ff2d8a"}, ${shortcut.color ?? "#ff2d8a"}cc)`,
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </span>
            <span className="max-w-[58px] break-words text-[9px] font-semibold leading-tight text-[#1f0a18]/78">
              {shortcut.label}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); removeShortcut(shortcut.id); }}
              className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[#ff2d8a] transition hover:bg-white group-hover:flex"
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
            className="flex w-full flex-col items-center gap-2 text-center transition hover:-translate-y-0.5"
            type="button"
            disabled={saving}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#ff2d8a]/25 bg-white/40 text-[#ff2d8a] shadow-[inset_0_1px_0_rgba(255,255,255,.7)]">
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
    "grid grid-cols-[82px_minmax(0,1fr)] items-start gap-3 border-t border-[#ff2d8a]/10 py-3 first:border-t-0 first:pt-0";

  const badge = (
    <span
      className="h-fit rounded-xl px-3 py-2 text-center text-[9px] font-bold uppercase tracking-[.05em] text-white"
      style={{
        background: item.color ?? "#8b5cf6",
        boxShadow: `0 3px 0 ${item.color ?? "#8b5cf6"}80`,
      }}
    >
      {item.category}
    </span>
  );

  const body = (
    <div className="min-w-0">
      <h3 className="text-[12px] font-extrabold leading-[1.32] text-[#150710]">{item.title}</h3>
      {item.meta && (
        <p className="mt-2 text-[9px] font-medium leading-snug text-[#1f0a18]/36">{item.meta}</p>
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
    <DashboardCard className="flex min-h-[640px] flex-col px-6 pb-8 pt-[78px] lg:h-[640px]">
      <img
        src="/homepage/2.png"
        alt=""
        className="pointer-events-none absolute left-5 top-2 h-16 w-16 object-contain"
      />

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
    <DashboardCard className="flex min-h-[640px] flex-col px-7 py-9 lg:h-[640px]">
      <img
        src="/homepage/4.png"
        alt=""
        className="pointer-events-none absolute -right-5 top-1 h-24 w-24 object-contain"
      />
      <img
        src="/homepage/3.png"
        alt=""
        className="pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 object-contain"
      />

      <div className="mb-14 flex items-center justify-between gap-4">
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
        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-white/75 bg-white/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.7)]"
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

  const storedHomeData = homeQuery.data ?? { shortcuts: [], news: [], projects: [] };
  const homeData: HomeData = {
    shortcuts: storedHomeData.shortcuts.length > 0 ? storedHomeData.shortcuts : DEFAULT_SHORTCUTS,
    news: storedHomeData.news.length > 0 ? storedHomeData.news : DEFAULT_NEWS,
    projects: storedHomeData.projects,
  };

  const handleSaveShortcuts = useCallback(
    (shortcuts: HomeShortcut[]) => {
      saveMutation.mutate({ ...homeData, shortcuts });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homeData, saveMutation],
  );

  return (
    <main
      className="overflow-y-auto px-4 pb-6 pt-8 font-['Inter_Tight'] text-[#1f0a18] sm:px-6 lg:px-8"
      aria-label="Systema Agency — dashboard d'accueil"
    >
      <h1 className="sr-only">Systema Agency</h1>
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col gap-5">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
          <ShortcutsCard
            shortcuts={homeData.shortcuts}
            onSave={handleSaveShortcuts}
            saving={saveMutation.isPending}
          />
          <NewsCard news={homeData.news} />
          <ProjectsCard projects={homeData.projects} />
        </div>
      </div>
    </main>
  );
}
