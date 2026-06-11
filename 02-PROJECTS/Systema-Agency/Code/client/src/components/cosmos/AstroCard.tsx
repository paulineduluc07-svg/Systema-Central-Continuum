// AstroCard.tsx — la carte ⭐ Transits du jour (look Sanctuary).
// Transits + « comment le ciel te parle » coloré par le ton du jour + aspects.

import { astro } from "@shared/cosmos/astro";
import { CosmosCard } from "./CosmosCard";

// Couleur du ton du jour → classes de la boîte + du badge.
const TON_STYLES: Record<string, { box: string; badge: string }> = {
  vert: { box: "border-green-200 bg-[#f1fbf4]", badge: "bg-green-100 text-green-800 border-green-300" },
  orange: { box: "border-amber-200 bg-[#fff8ee]", badge: "bg-amber-100 text-amber-800 border-amber-300" },
  gris: { box: "border-gray-200 bg-gray-50", badge: "bg-gray-100 text-gray-700 border-gray-300" },
  rose: { box: "border-pink-200 bg-[#fff6fb]", badge: "bg-pink-100 text-pink-800 border-pink-300" },
};

// Couleur du liseré gauche d'un aspect, selon sa famille.
const FAMILLE_BORDER: Record<string, string> = {
  fluide: "border-green-300",
  tendu: "border-amber-400",
  intense: "border-pink-400",
};

export function AstroCard({ date }: { date: Date }) {
  const a = astro(date);
  const ton = TON_STYLES[a.tonJour.couleur] ?? TON_STYLES.rose;
  const soleil = a.aujourdhui[0];
  const lune = a.aujourdhui[1];

  return (
    <CosmosCard
      lectureSection="astro"
      lectureDate={date}
      emoji="☀️"
      titre="Transits du Jour"
      tag="ASTRO"
      iconBg="bg-pink-100"
      footerLeft={a.natal.soleil.signe}
      footerRight={`Asc. ${a.natal.ascendant.signe}`}
      detailLabel="c'est quoi ces symboles ?"
      detail={
        <>
          <p>🔆 <b>conjonction</b> — collé : ça s'amplifie <span className="text-pink-500">(intense)</span></p>
          <p>✨ <b>trigone</b> — 120° : harmonie qui coule <span className="text-green-600">(fluide)</span></p>
          <p>🌱 <b>sextile</b> — 60° : une porte facile <span className="text-green-600">(fluide)</span></p>
          <p>⚡ <b>carré</b> — 90° : tension utile <span className="text-amber-600">(tendu)</span></p>
          <p>⚖️ <b>opposition</b> — 180° : contraste, équilibre <span className="text-amber-600">(tendu)</span></p>
        </>
      }
    >
      {/* Soleil & Lune du jour, en vedette */}
      <p className="rounded border-l-4 border-pink-500 bg-[#faf0e6] p-1.5 font-bold">
        ☀️ Soleil en {soleil.signe} {soleil.emoji} · 🌙 Lune en {lune.signe} {lune.emoji}
      </p>

      {/* Tous les transits, en petit */}
      <div className="flex flex-wrap gap-1">
        {a.aujourdhui.map((x) => (
          <span key={x.astre} className="rounded border border-[#eadbc8] bg-white/70 px-1.5 py-0.5 text-[10px]">
            {x.symbole} {x.emoji} {x.degre}°
          </span>
        ))}
      </div>

      {/* Comment le ciel TE parle (coloré par le ton du jour) */}
      <div className={`mt-1 rounded-lg border-2 p-2 ${ton.box}`}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="cosmos-pixel text-[10px] text-pink-700">
            🌬️ comment le ciel te parle, {a.natal.soleil.signe}
          </p>
          <span className={`cosmos-pixel whitespace-nowrap rounded border px-1.5 py-0.5 text-[9px] ${ton.badge}`}>
            {a.tonJour.emoji} {a.tonJour.label}
          </span>
        </div>

        {a.transitsPerso.map((g) => (
          <div key={g.ancre} className="mb-2 last:mb-0">
            <p className="border-b border-dotted border-[#eadbc8] pb-0.5 text-[11px] font-bold text-[#2c2523]">
              {g.ancreEmoji} {g.ancre} {g.ancreSigne}
              <span className="font-normal italic text-[#9a8f8a]"> — {g.ancreSens}</span>
            </p>
            {g.aspects.length === 0 ? (
              <p className="pl-2 italic text-[#9a8f8a]">rien de marqué aujourd'hui 🌙</p>
            ) : (
              g.aspects.map((x, i) => (
                <div key={i} className={`mb-1.5 border-l-4 pl-2 last:mb-0 ${FAMILLE_BORDER[x.famille] ?? "border-pink-400"}`}>
                  <p className="font-bold text-[#2c2523]">
                    {x.tonEmoji} {x.symbole} {x.astre} en {x.signe} {x.emoji}{" "}
                    <span className="font-normal text-pink-500">— {x.aspect} ({x.angle}°)</span>
                  </p>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </CosmosCard>
  );
}
