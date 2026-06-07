// EnergieCard.tsx — la carte 📅 Énergie des prochains jours (look Sanctuary).
// Réutilise prochainsJours() : aujourd'hui + 5 jours, chacun dans une boîte chunky.

import { prochainsJours } from "@/lib/cosmos/numerologie";
import { CosmosCard } from "./CosmosCard";

export function EnergieCard({ date }: { date: Date }) {
  const jours = prochainsJours(5, date);

  return (
    <CosmosCard
      emoji="📅"
      titre="Énergie des prochains jours"
      tag="À VENIR"
      iconBg="bg-purple-100"
      footerLeft="Jours personnels"
      footerRight="Cycle de 9 jours"
    >
      <div className="space-y-1.5">
        {jours.map((j, i) => (
          <div
            key={i}
            className={
              "flex items-center gap-2.5 rounded-lg border-2 p-1.5 " +
              (j.aujourdhui
                ? "border-pink-400 bg-gradient-to-br from-pink-50 to-purple-50 shadow-[2px_2px_0_#262626]"
                : "border-[#eadbc8] bg-white/70")
            }
          >
            <div
              className={
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-[#2c2523] shadow-[1.5px_1.5px_0_#262626] " +
                (j.aujourdhui
                  ? "bg-gradient-to-br from-pink-400 to-purple-500"
                  : "bg-white")
              }
            >
              <span
                className={
                  "cosmos-pixel text-base leading-none " +
                  (j.aujourdhui ? "text-white" : "text-pink-600")
                }
              >
                {j.nombre}
              </span>
            </div>
            <div className="leading-tight">
              <p className="cosmos-pixel text-[10px] uppercase tracking-wide text-pink-700">
                {j.aujourdhui ? "Auj." : `${j.label} ${j.jourMois}`} · {j.titre}
              </p>
              <p className="text-[11px] leading-snug">{j.texte}</p>
            </div>
          </div>
        ))}
      </div>
    </CosmosCard>
  );
}
