// TarotCard.tsx — la carte 🔮 Tarot du jour (look Sanctuary).
// Une carte tirée par jour, déterministe : la même toute la journée,
// une nouvelle demain. Renversée ≈ 1 fois sur 3 (l'emoji se retourne).

import { tirageDuJour } from "@/lib/cosmos/tarot";
import { CosmosCard } from "./CosmosCard";

// Le visuel de chaque carte (mêmes emojis que la Matrice pour les majeurs).
const EMOJIS: Record<string, string> = {
  fool: "🃏", magician: "🎩", highpriestess: "🌙", empress: "👑",
  emperor: "🏛️", hierophant: "🕊️", lovers: "❤️", chariot: "🏇",
  strength: "🦁", hermit: "🔦", wheel: "🎡", justice: "⚖️",
  hangedman: "🙃", death: "🦋", temperance: "🍵", devil: "🔥",
  tower: "⚡", star: "⭐", moon: "🌒", sun: "☀️", judgement: "📯",
  world: "🌍", wands: "🪄", cups: "🍷", swords: "🗡️", pentacles: "🪙",
};

const ENSEIGNES: Record<string, string> = {
  wands: "Bâtons", cups: "Coupes", swords: "Épées", pentacles: "Pentacles",
};

export function TarotCard({ date }: { date: Date }) {
  const { carte, renversee, texte } = tirageDuJour(date);
  const emoji = EMOJIS[carte.symbol] ?? "🔮";

  return (
    <CosmosCard
      emoji="🔮"
      titre="Tarot du jour"
      tag="TAROT"
      iconBg="bg-purple-100"
      footerLeft={
        carte.arcana === "major"
          ? "Arcane majeur"
          : `Arcane mineur · ${ENSEIGNES[carte.suit ?? ""] ?? ""}`
      }
      footerRight={renversee ? "Renversée" : "À l'endroit"}
      detailLabel="ce que la carte te dit"
      detail={<p>{texte}</p>}
    >
      {/* La carte elle-même : mini-carte chunky */}
      <div className="flex items-center gap-3 rounded-lg border-2 border-[#2c2523] bg-gradient-to-br from-purple-50 to-pink-50 p-2.5 shadow-[2px_2px_0_#262626]">
        <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md border-2 border-[#2c2523] bg-white text-2xl shadow-[1.5px_1.5px_0_#262626]">
          <span className={renversee ? "rotate-180" : undefined}>{emoji}</span>
        </div>
        <div className="leading-tight">
          <p className="cosmos-pixel text-[10px] uppercase tracking-wide text-purple-700">
            {carte.name}
          </p>
          <p className="text-base font-bold text-[#2c2523]">{carte.nameFr}</p>
          {renversee && (
            <p className="text-[10px] text-pink-600">🙃 tirée renversée aujourd'hui</p>
          )}
        </div>
      </div>

      {/* Les mots-clés de la carte */}
      <div className="flex flex-wrap gap-1">
        {carte.keywords.map((mot) => (
          <span
            key={mot}
            className="cosmos-pixel rounded border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[9px] text-purple-800"
          >
            {mot}
          </span>
        ))}
      </div>
    </CosmosCard>
  );
}
