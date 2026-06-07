// BiorythmesCard.tsx — la carte 🌊 Biorythmes (look Sanctuary).

import { biorythmes, type Biorythme } from "@/lib/cosmos/biorythmes";
import { CosmosCard } from "./CosmosCard";

const META = [
  { nom: "physique", emoji: "💪", label: "Physique", couleur: "#ff7bd8" },
  { nom: "emotionnel", emoji: "💗", label: "Émotionnel", couleur: "#8d7dff" },
  { nom: "intellectuel", emoji: "🧠", label: "Intellectuel", couleur: "#5bc8ff" },
] as const;

function texteCritique(c: number | null): string {
  return c ? `critique dans ${c} j` : "stable";
}

function Jauge({ label, couleur, bio }: { label: string; couleur: string; bio: Biorythme }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="cosmos-pixel text-[11px] uppercase tracking-wide text-[#2c2523]">{label}</span>
        <span className="cosmos-pixel text-sm text-pink-600">
          {bio.pourcentage}% {bio.tendance}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded border-2 border-[#2c2523] bg-gray-200 p-0.5">
        <div
          className="h-full rounded-sm transition-[width] duration-500"
          style={{ width: `${bio.pourcentage}%`, backgroundColor: couleur }}
        />
      </div>
    </div>
  );
}

export function BiorythmesCard({ date }: { date: Date }) {
  const bio = biorythmes(date);
  const { w, h, mid, todayX } = bio.svg;

  return (
    <CosmosCard
      emoji="🌊"
      titre="Biorythmes Actuels"
      tag="WAVE"
      iconBg="bg-gradient-to-tr from-pink-400 to-purple-500"
      footerLeft="Flots biologiques"
      footerRight="23 · 28 · 33 jours"
      detailLabel="voir la lecture & les jours critiques"
      detail={
        <>
          {META.map((m) => {
            const c = bio.cycles[m.nom];
            return (
              <p key={m.nom}>
                <span className="font-bold text-[#2c2523]">
                  {m.emoji} {m.label} —{" "}
                </span>
                {c.lecture} ({texteCritique(c.critique)})
              </p>
            );
          })}
        </>
      }
    >
      <div className="space-y-2.5">
        {META.map((m) => (
          <Jauge key={m.nom} label={m.label} couleur={m.couleur} bio={bio.cycles[m.nom]} />
        ))}
      </div>

      {/* Mini-graphe SVG dans une boîte bordée chunky */}
      <div className="mt-3 rounded-lg border-2 border-[#2c2523] bg-white p-2">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full" preserveAspectRatio="none" aria-hidden>
          <line x1={0} y1={mid} x2={w} y2={mid} stroke="#eadbc8" strokeWidth={1} />
          <line x1={todayX} y1={0} x2={todayX} y2={h} stroke="#2c2523" strokeWidth={1} strokeDasharray="3 3" />
          {META.map((m) => (
            <polyline
              key={m.nom}
              points={bio.cycles[m.nom].serie}
              fill="none"
              stroke={m.couleur}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <p className="cosmos-pixel mt-1 text-center text-[9px] text-gray-400">
          3 dernières → 3 prochaines semaines
        </p>
      </div>
    </CosmosCard>
  );
}
