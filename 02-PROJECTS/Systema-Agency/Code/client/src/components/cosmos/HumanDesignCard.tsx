// HumanDesignCard.tsx — la carte 🧬 Design Humain (look Sanctuary).
// Portrait (Type/Profil/Autorité/Définition) + météo du jour (centres éveillés)
// + portes du jour cliquables + tiroirs (9 centres, détail météo).

import { donneesHd } from "@/lib/cosmos/hd";
import { useState } from "react";
import { CosmosCard } from "./CosmosCard";

export function HumanDesignCard({ date }: { date: Date }) {
  const hd = donneesHd(date);
  const { portrait: p, meteo, centresDetail, portesDetail } = hd;
  const [porte, setPorte] = useState<number | null>(null);

  const detailPorte = porte != null ? portesDetail[porte] : null;

  return (
    <CosmosCard
      emoji={p.emoji}
      titre="Design Humain"
      tag="VIBE"
      iconBg="bg-gradient-to-tr from-pink-400 to-purple-500"
      footerLeft={`Définition ${p.definition}`}
      footerRight={`Autorité ${p.autorite}`}
      detailLabel="tes 9 centres (clique)"
      detail={
        <div className="space-y-1.5">
          {centresDetail.map((c) => (
            <div key={c.nom} className={c.eveille ? "rounded bg-[#fff6fb] p-1" : ""}>
              <p className="font-bold text-[#2c2523]">
                {c.nom} <span className="cosmos-pixel text-[9px] text-pink-600">· {c.statut}</span>
                {c.eveille && <span className="cosmos-pixel ml-1 text-[9px] text-purple-600">✨ éveillé</span>}
              </p>
              <p className="text-[10px]">{c.sens}</p>
            </div>
          ))}
        </div>
      }
    >
      {/* Type en vedette */}
      <div className="rounded-lg border-2 border-[#2c2523] bg-gradient-to-br from-pink-50 to-purple-50 p-2 shadow-[2px_2px_0_#262626]">
        <p className="text-sm font-bold text-[#2c2523]">
          {p.emoji} {p.type} ({p.profil})
        </p>
        <p className="text-[11px]">
          <span className="cosmos-pixel text-[10px] uppercase text-pink-700">Stratégie : </span>
          {p.strategie}. {p.phrase}
        </p>
      </div>

      {/* Météo du jour : centres éveillés */}
      <div className="rounded-lg border-2 border-pink-200 bg-[#fff6fb] p-2">
        <p className="cosmos-pixel text-[10px] text-pink-700">
          🌬️ Météo du jour : le ciel éveille {meteo.centresEveilles.length} de tes centres ouverts
        </p>
        {meteo.centresEveilles.map((c) => (
          <p key={c.titre} className="mt-1 text-[11px]">
            <span className="font-bold text-[#2c2523]">{c.emoji} {c.titre} — </span>
            {c.sens}
          </p>
        ))}
        {meteo.centresEveilles.length === 0 && (
          <p className="mt-1 text-[11px] italic text-[#9a8f8a]">aucun centre éveillé aujourd'hui 🌙</p>
        )}
      </div>

      {/* Portes du jour cliquables */}
      <div>
        <p className="cosmos-pixel mb-1 text-[10px] uppercase text-purple-700">Portes du jour (clique)</p>
        <div className="flex flex-wrap gap-1">
          {meteo.portesDuJour.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPorte(n === porte ? null : n)}
              className={
                "cosmos-pixel rounded border px-1.5 py-0.5 text-[11px] transition " +
                (n === porte
                  ? "border-purple-500 bg-purple-100 text-purple-900"
                  : "border-purple-200 bg-white/70 text-purple-800 hover:border-purple-400")
              }
            >
              {n}
            </button>
          ))}
        </div>
        {detailPorte && (
          <div className="mt-1.5 rounded border-l-4 border-purple-400 bg-[#faf0e6] p-1.5">
            <p className="text-[11px] font-bold text-[#2c2523]">
              Porte {porte} · {detailPorte.nom}
            </p>
            <p className="text-[10px]">{detailPorte.cle}</p>
            {detailPorte.aujourdhui.length > 0 && (
              <p className="cosmos-pixel mt-0.5 text-[9px] text-purple-700">
                aujourd'hui : {detailPorte.aujourdhui.map((x) => `${x.astre} ${detailPorte.nom ? "" : ""}${x.ligne}`).join(" · ")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Canaux formés aujourd'hui */}
      {meteo.canauxStr && (
        <p className="text-[10px] text-[#5b5552]">
          <span className="cosmos-pixel uppercase text-pink-700">Canaux formés : </span>
          {meteo.canauxStr}
        </p>
      )}
    </CosmosCard>
  );
}
