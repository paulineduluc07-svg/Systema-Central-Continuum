// LuneCard.tsx — la carte 🌙 (look Sanctuary).

import { phaseLunaire } from "@shared/cosmos/lune";
import { CosmosCard } from "./CosmosCard";

export function LuneCard({ date }: { date: Date }) {
  const lune = phaseLunaire(date);

  return (
    <CosmosCard
      lectureSection="lune"
      lectureDate={date}
      emoji={lune.emoji}
      titre={lune.nom}
      tag="LUNE"
      footerLeft={`${lune.fleche} Lune ${lune.mouvement}`}
      footerRight={`Jour ${lune.jour} / 29,5`}
      detailLabel="que faire de cette énergie ?"
      detail={
        <>
          <p>🌱 {lune.sens}</p>
          <p className="cosmos-pixel text-[10px] text-gray-500">
            Jour {lune.jour} du cycle (sur ~29,5)
          </p>
        </>
      }
    >
      {/* Luminosité + jauge chunky */}
      <div className="flex items-center justify-between">
        <span className="cosmos-pixel text-sm text-gray-500">Luminosité</span>
        <span className="cosmos-pixel text-xl text-pink-600">{lune.eclairage}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded border-2 border-[#2c2523] bg-gray-200 p-0.5">
        <div
          className="h-full rounded-sm bg-gradient-to-r from-pink-400 to-purple-500 transition-[width] duration-500"
          style={{ width: `${lune.eclairage}%` }}
        />
      </div>

    </CosmosCard>
  );
}
