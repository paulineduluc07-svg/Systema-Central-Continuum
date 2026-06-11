// CycleCard.tsx — la carte 🩸 Cycle menstruel (look Sanctuary).
// Mémorise le « Jour 1 » dans les préférences synchronisées (Neon) si connectée,
// sinon en local. Tant qu'aucun Jour 1 → état « en attente ». Vrai pas toc.

import { calculCycle } from "@shared/cosmos/cycle";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useCallback, useState } from "react";
import { CosmosCard } from "./CosmosCard";

const LOCAL_KEY = "cosmos_cycle_jour1";

function isoAujourdhui(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function CycleCard({ date }: { date: Date }) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: prefs } = trpc.preferences.get.useQuery(undefined, { enabled: isAuthenticated });
  const updateMut = trpc.preferences.update.useMutation({
    onSuccess: () => utils.preferences.get.invalidate(),
  });

  const [localJour1, setLocalJour1] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(LOCAL_KEY);
  });

  const jour1Iso = isAuthenticated ? prefs?.cycleJour1 ?? null : localJour1;

  const enregistrerJour1 = useCallback(async () => {
    const iso = isoAujourdhui(new Date());
    if (isAuthenticated) {
      await updateMut.mutateAsync({ cycleJour1: iso });
    } else {
      localStorage.setItem(LOCAL_KEY, iso);
      setLocalJour1(iso);
    }
  }, [isAuthenticated, updateMut]);

  const cycle = jour1Iso ? calculCycle(parseIso(jour1Iso), date) : null;

  // ── État « en attente » ──
  if (!cycle) {
    return (
      <CosmosCard emoji="🩸" titre="Mon Cycle" tag="FLUX" iconBg="bg-pink-100" footerLeft="En attente" footerRight="Jour 1 ?">
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="text-4xl">⏳</span>
          <p className="text-sm font-bold text-[#2c2523]">En attente de ton Jour 1</p>
          <p className="text-[11px] leading-snug text-[#5b5552]">
            Le jour où tes règles arrivent, clique le bouton : ça devient ton ancre <b>réelle</b> et la
            carte calcule ta phase en vrai. Aucune donnée inventée d'ici là. 🌙
          </p>
          <button
            type="button"
            onClick={enregistrerJour1}
            disabled={updateMut.isPending}
            className="cosmos-btn rounded-lg border-2 border-[#2c2523] bg-gradient-to-r from-pink-400 to-purple-500 px-3 py-2 text-sm font-bold text-white shadow-[3px_3px_0_#2c2523] disabled:opacity-60"
          >
            🩸 mes règles ont commencé aujourd'hui
          </button>
        </div>
      </CosmosCard>
    );
  }

  // ── État actif ──
  return (
    <CosmosCard
      lectureSection="cycle"
      lectureDate={date}
      emoji={cycle.phase.emoji}
      titre={cycle.phase.titre}
      tag="FLUX"
      iconBg="bg-pink-100"
      footerLeft={`Jour ${cycle.jour} / ${cycle.duree}`}
      footerRight={`Règles dans ${cycle.joursAvantRegles} j`}
      detailLabel="que faire de cette phase ?"
      detail={
        <>
          <p>{cycle.phase.conseil}</p>
          <button
            type="button"
            onClick={enregistrerJour1}
            disabled={updateMut.isPending}
            className="cosmos-pixel mt-1 text-[10px] text-pink-600 underline disabled:opacity-60"
          >
            mes règles ont recommencé aujourd'hui ? mettre à jour
          </button>
        </>
      }
    >
      {/* Jour du cycle + énergie */}
      <div className="flex items-baseline justify-between">
        <span className="cosmos-pixel text-sm text-gray-500">Jour du cycle</span>
        <span className="cosmos-pixel text-xl text-pink-600">{cycle.jour}</span>
      </div>

      {/* Jauge de progression dans le cycle */}
      <div className="h-3 overflow-hidden rounded border-2 border-[#2c2523] bg-gray-200 p-0.5">
        <div
          className="h-full rounded-sm bg-gradient-to-r from-pink-400 to-purple-500 transition-[width] duration-500"
          style={{ width: `${cycle.position}%` }}
        />
      </div>

      <p className="cosmos-pixel text-[10px] uppercase text-purple-700">
        énergie : {cycle.phase.energie}
      </p>
    </CosmosCard>
  );
}
