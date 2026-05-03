import {
  Activity,
  BookOpen,
  CalendarDays,
  Cloud,
  CloudRain,
  CloudSun,
  ExternalLink,
  FileText,
  Globe2,
  Newspaper,
  PiggyBank,
  Sparkles,
  StickyNote,
  Sun,
} from "lucide-react";
import { Link } from "wouter";

const newsItems = [
  {
    category: "Brief",
    title: "Le résumé du matin pourra être déposé ici par Cowork à 8 h.",
    meta: "Systema · en attente de connexion",
    hot: true,
    color: "#ff2d8a",
  },
  {
    category: "Tech",
    title: "Surveiller les nouveautés IA utiles pour automatiser Systema et Kim.",
    meta: "Veille IA · priorité haute",
    color: "#a78bfa",
  },
  {
    category: "Business",
    title: "Garder les opportunités, idées de revenus et signaux marché dans un flux lisible.",
    meta: "Agence · suivi quotidien",
    color: "#10b981",
  },
  {
    category: "Perso",
    title: "Ajouter les nouvelles importantes sans mélanger le dashboard avec les notes volantes.",
    meta: "Organisation · repère",
    color: "#fbbf24",
  },
  {
    category: "Design",
    title: "Réserver cette zone aux inspirations utiles, pas aux distractions.",
    meta: "Créatif · sélection courte",
    color: "#67e8f9",
  },
];

const projects = [
  {
    name: "Systema Agency — Dashboard accueil",
    detail: "Implémenter la V4 modifiée",
    progress: 68,
    due: "cette passe",
    color: "#ff2d8a",
    status: "active",
  },
  {
    name: "Prompt Vault — images",
    detail: "Préparer les visuels liés aux prompts",
    progress: 32,
    due: "à planifier",
    color: "#a78bfa",
    status: "planned",
  },
  {
    name: "Budget & finances",
    detail: "Nouvelle page paiements et budget",
    progress: 18,
    due: "plus tard",
    color: "#fbbf24",
    status: "planned",
  },
  {
    name: "Kim dans Systema",
    detail: "Modifier et archiver avec confirmation",
    progress: 45,
    due: "prochaine passe",
    color: "#67e8f9",
    status: "active",
  },
  {
    name: "Notes volantes mobile",
    detail: "Masonry + bottom sheet",
    progress: 26,
    due: "à faire",
    color: "#10b981",
    status: "queued",
  },
];

const pageNav = [
  { label: "Kim", href: "/kim", icon: Sparkles, color: "#ff2d8a" },
  { label: "Notes", href: "/notes", icon: StickyNote, color: "#a78bfa" },
  { label: "Agenda", href: "/agenda", icon: CalendarDays, color: "#67e8f9" },
  { label: "Prompts", href: "/prompt-vault", icon: BookOpen, color: "#fbbf24" },
  { label: "Suivi", href: "/suivi", icon: Activity, color: "#10b981" },
];

const webShortcuts = [
  { label: "Site web", note: "à configurer", icon: Globe2, color: "#ff2d8a" },
  { label: "Espace client", note: "à configurer", icon: ExternalLink, color: "#a78bfa" },
  { label: "Factures", note: "à configurer", icon: FileText, color: "#67e8f9" },
  { label: "Budget", note: "à configurer", icon: PiggyBank, color: "#fbbf24" },
  { label: "Veille", note: "à configurer", icon: Newspaper, color: "#10b981" },
  { label: "Ressource", note: "à configurer", icon: BookOpen, color: "#f97316" },
];

const weatherStates = [
  { label: "Soleil", icon: Sun, active: true },
  { label: "Nuage", icon: Cloud },
  { label: "Pluie", icon: CloudRain },
];

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

function ShortcutsCard() {
  return (
    <DashboardCard className="lg:[grid-area:shortcuts]">
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
        {webShortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <button
              key={shortcut.label}
              className="group flex w-full cursor-default flex-col items-center gap-1.5 rounded-xl border border-white/70 bg-white/35 px-2 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.7)] transition hover:bg-white/55"
              type="button"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-[12px] text-white shadow-[0_3px_0_rgba(0,0,0,.12),0_8px_18px_rgba(255,45,138,.12),inset_0_1px_0_rgba(255,255,255,.45)]"
                style={{
                  background: `linear-gradient(135deg, ${shortcut.color}, ${shortcut.color}cc)`,
                }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="max-w-full truncate text-[11px] font-semibold text-[#1f0a18]/65">
                {shortcut.label}
              </span>
              <span className="max-w-full truncate text-[9px] font-semibold text-[#1f0a18]/35">
                {shortcut.note}
              </span>
            </button>
          );
        })}
      </div>
    </DashboardCard>
  );
}

function WeatherMiniCard() {
  return (
    <DashboardCard className="lg:[grid-area:weather]">
      <div className="flex h-full items-center justify-between gap-4">
        <div>
          <Eyebrow>Météo</Eyebrow>
          <div className="mt-1 font-['Fraunces'] text-[22px] font-medium italic leading-tight">
            Aujourd'hui
          </div>
          <div className="mt-2 text-xs font-medium text-[#1f0a18]/55">
            Widget simple, prêt pour la vraie météo.
          </div>
        </div>
        <div className="flex gap-2">
          {weatherStates.map((state) => {
            const Icon = state.icon;
            return (
              <div
                key={state.label}
                className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                  state.active
                    ? "border-white/80 bg-[#ff2d8a] text-white shadow-[0_5px_18px_rgba(255,45,138,.28)]"
                    : "border-white/80 bg-white/55 text-[#ff2d8a]"
                }`}
                title={state.label}
              >
                <Icon className="h-5 w-5" />
              </div>
            );
          })}
        </div>
      </div>
    </DashboardCard>
  );
}

function NewsCard() {
  return (
    <DashboardCard className="lg:[grid-area:news]">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <Eyebrow>News du jour</Eyebrow>
          <h2 className="mt-1 font-['Fraunces'] text-[28px] font-medium italic leading-none text-[#1f0a18]">
            Ce qui bouge
          </h2>
        </div>
        <button className="text-xs font-bold text-[#ff2d8a]">Tout voir</button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
        {newsItems.map((item, index) => (
          <article
            key={item.title}
            className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 border-t border-[#ff2d8a]/10 py-4 first:border-t-0 first:pt-1"
          >
            <span
              className={`h-fit rounded-md px-2 py-1 text-center text-[10px] font-bold uppercase tracking-[.08em] ${
                item.hot ? "text-white shadow-[0_2px_0_rgba(255,45,138,.65)]" : ""
              }`}
              style={{
                background: item.hot ? item.color : `${item.color}22`,
                color: item.hot ? "#fff" : item.color,
              }}
            >
              {item.category}
            </span>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold leading-snug text-[#1f0a18]">
                {item.title}
              </h3>
              <p className="mt-1 text-[11px] font-medium text-[#1f0a18]/38">{item.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </DashboardCard>
  );
}

function ProjectsCard() {
  return (
    <DashboardCard className="lg:[grid-area:projects]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <Eyebrow>Projets en cours</Eyebrow>
          <h2 className="mt-1 font-['Fraunces'] text-[28px] font-medium italic leading-none text-[#1f0a18]">
            Priorités actives
          </h2>
        </div>
        <button className="rounded-full bg-[#ff2d8a] px-4 py-2 text-xs font-bold text-white shadow-[0_2px_0_rgba(255,45,138,.75),0_8px_18px_rgba(255,45,138,.28)]">
          Nouveau
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {projects.map((project) => (
          <article
            key={project.name}
            className="rounded-2xl border border-white/85 bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.75)]"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px]"
                    style={{ background: project.color }}
                  />
                  <h3 className="truncate text-[15px] font-bold leading-tight text-[#1f0a18]">
                    {project.name}
                  </h3>
                </div>
                <p className="mt-1 pl-[18px] text-xs font-medium text-[#1f0a18]/48">
                  {project.detail}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#ff2d8a]/10 px-2.5 py-1 font-['VT323'] text-[17px] leading-none text-[#ff2d8a]">
                {project.due}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <SegmentedProgress value={project.progress} color={project.color} />
              <span className="min-w-10 text-right font-['VT323'] text-[22px] leading-none text-[#ff2d8a]">
                {project.progress}%
              </span>
            </div>
          </article>
        ))}
      </div>
    </DashboardCard>
  );
}

function QuoteCard() {
  return (
    <DashboardCard className="bg-[linear-gradient(135deg,#ff2d8a_0%,#ff8fbf_58%,#a78bfa_100%)] text-white lg:[grid-area:quote]">
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-white/85">
          <Sparkles className="h-3.5 w-3.5" />
          Inspiration du jour
        </div>
        <p className="font-['Fraunces'] text-[15px] italic leading-snug">
          Le design, c'est comment ça fonctionne.
        </p>
        <p className="mt-2 text-[11px] font-semibold text-white/90">Steve Jobs</p>
      </div>
      <div className="pointer-events-none absolute -bottom-14 right-0 font-['Fraunces'] text-[170px] italic leading-none text-white/15">
        "
      </div>
    </DashboardCard>
  );
}

export default function HomeV2() {
  return (
    <main
      className="min-h-screen overflow-y-auto bg-[linear-gradient(135deg,#fff5fa_0%,#ffeaf3_48%,#f5e8ff_100%)] px-4 pb-8 pt-8 font-['Inter_Tight'] text-[#1f0a18] sm:px-6 lg:px-8"
      aria-label="Systema Agency — dashboard d'accueil"
    >
      <div className="pointer-events-none absolute right-[-120px] top-[-90px] h-96 w-96 rounded-full bg-[#ff2d8a]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-130px] left-[-110px] h-[420px] w-[420px] rounded-full bg-[#a78bfa]/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-5">
        <header className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              aria-label="Systema Agency"
              className="rotate-[-3deg] font-['Pacifico'] text-[44px] leading-[0.9] text-[#ff2d8a] drop-shadow-[0_8px_18px_rgba(255,45,138,.2)] sm:text-[54px]"
            >
              <span className="block">Systema</span>
              <span className="block pl-5">Agency</span>
            </div>
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
            <HoloBubble className="h-10 w-10 sm:h-12 sm:w-12" title="Météo">
              <CloudSun className="h-5 w-5" />
            </HoloBubble>
          </nav>
        </header>

        <div
          className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.15fr_1.25fr] lg:grid-rows-[auto_minmax(96px,0.55fr)_minmax(118px,0.65fr)] lg:[grid-template-areas:'shortcuts_news_projects'_'weather_news_projects'_'quote_news_projects']"
        >
          <ShortcutsCard />
          <WeatherMiniCard />
          <NewsCard />
          <ProjectsCard />
          <QuoteCard />
        </div>
      </div>
    </main>
  );
}
