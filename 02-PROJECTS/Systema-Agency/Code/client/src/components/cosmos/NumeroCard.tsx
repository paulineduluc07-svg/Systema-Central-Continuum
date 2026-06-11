// NumeroCard.tsx — la carte 🔢 Numérologie (look Sanctuary).

import { cheminDeVie } from "@shared/cosmos/numerologie";
import { CosmosCard } from "./CosmosCard";

export function NumeroCard({ date }: { date: Date }) {
  const num = cheminDeVie(date);

  return (
    <CosmosCard
      lectureSection="numero"
      lectureDate={date}
      emoji="🔢"
      titre="Numérologie"
      tag="CHIFFRE"
      footerLeft={`Chemin de vie ${num.nombre}`}
      footerRight={`Jour ${num.jour.nombre} · Mois ${num.mois.nombre} · An ${num.annee.nombre}`}
      detailLabel={`🌌 ton chemin de vie : ${num.nombre}`}
      detail={
        <>
          <p>{num.signification}</p>
          <p className="text-[11px] text-gray-500">{num.detail}</p>
          <p className="text-[11px]">
            <span className="font-bold">Année {num.annee.nombre} :</span> {num.annee.texte}
          </p>
          <p className="text-[11px]">
            <span className="font-bold">Mois {num.mois.nombre} :</span> {num.mois.texte}
          </p>
        </>
      }
    >
      {/* LE JOUR PERSO — la partie vivante, en vedette (boîte chunky) */}
      <div className="flex items-center gap-2.5 rounded-lg border-2 border-[#2c2523] bg-gradient-to-br from-pink-50 to-purple-50 p-2 shadow-[2px_2px_0_#262626]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#2c2523] bg-white shadow-[1.5px_1.5px_0_#262626]">
          <span className="cosmos-pixel text-xl leading-none text-pink-600">{num.jour.nombre}</span>
        </div>
        <div className="leading-tight">
          <p className="cosmos-pixel text-[10px] uppercase tracking-wide text-pink-700">
            Jour perso · {num.jour.titre}
          </p>
        </div>
      </div>

      {/* Année + Mois personnels */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded border-l-4 border-purple-400 bg-[#faf0e6] p-1.5">
          <p className="cosmos-pixel text-[9px] uppercase text-purple-700">Année {num.annee.nombre}</p>
          <p className="text-[10px] font-bold leading-tight">{num.annee.titre}</p>
        </div>
        <div className="rounded border-l-4 border-pink-400 bg-[#faf0e6] p-1.5">
          <p className="cosmos-pixel text-[9px] uppercase text-pink-700">Mois {num.mois.nombre}</p>
          <p className="text-[10px] font-bold leading-tight">{num.mois.titre}</p>
        </div>
      </div>

      {/* TON CYCLE DE 9 ANS — jauge chunky */}
      <div>
        <div className="cosmos-pixel mb-1 flex justify-between text-[9px] uppercase tracking-wide text-purple-700">
          <span>cycle de 9 ans</span>
          <span>année {num.annee.nombre} / 9</span>
        </div>
        <div className="h-3 overflow-hidden rounded border-2 border-[#2c2523] bg-gray-200 p-0.5">
          <div
            className="h-full rounded-sm bg-gradient-to-r from-pink-400 to-purple-500"
            style={{ width: `${Math.round((num.annee.nombre / 9) * 100)}%` }}
          />
        </div>
        <p className="mt-1 text-[9px] leading-snug text-gray-400">
          De l'année 1 (nouveau départ) à l'année 9 (clôture), puis le cycle recommence.
        </p>
      </div>
    </CosmosCard>
  );
}
