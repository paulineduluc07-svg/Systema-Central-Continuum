// BriefingCard.tsx — le 🔮 Briefing du jour (look Sanctuary, en tête de page).
// Lit toutes les cartes (lune, biorythmes, numéro, astro, cycle) et compose
// un résumé de ~5 phrases. Le cycle vient des préférences (Neon) si dispo.

import { phaseLunaire } from "@/lib/cosmos/lune";
import { biorythmes } from "@/lib/cosmos/biorythmes";
import { cheminDeVie } from "@/lib/cosmos/numerologie";
import { astro } from "@/lib/cosmos/astro";
import { calculCycle } from "@/lib/cosmos/cycle";
import { briefing } from "@/lib/cosmos/synthese";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function BriefingCard({ date }: { date: Date }) {
  const { isAuthenticated } = useAuth();
  const { data: prefs } = trpc.preferences.get.useQuery(undefined, { enabled: isAuthenticated });

  const jour1Iso = isAuthenticated
    ? prefs?.cycleJour1 ?? null
    : typeof window !== "undefined"
      ? localStorage.getItem("cosmos_cycle_jour1")
      : null;
  const cycle = jour1Iso ? calculCycle(parseIso(jour1Iso), date) : null;

  const b = briefing(
    phaseLunaire(date),
    biorythmes(date),
    cheminDeVie(date),
    astro(date),
    cycle,
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border-4 border-[#2c2523] bg-gradient-to-br from-[#fce7f3] via-[#f3e8ff] to-[#e7e9ff] p-6 shadow-[6px_6px_0_0_#2c2523]">
      <div className="cosmos-pixel absolute right-5 top-3 text-xs tracking-wide text-pink-500">
        ORACLE SANCTUARY-V2
      </div>

      <div className="flex flex-col items-start gap-5 md:flex-row">
        {/* Avatar de l'oracle */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-4 border-pink-400 bg-white text-4xl shadow-[2px_2px_0_#262626]">
          ✨
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="cosmos-pixel text-base font-bold uppercase tracking-wide text-pink-600">
              Ton briefing du jour
            </h3>
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-pink-500" />
          </div>

          {/* Les phrases de synthèse */}
          <div className="space-y-2 rounded-r border-l-4 border-pink-400 bg-white/70 p-4 text-[15px] leading-relaxed text-[#3a3330]">
            {b.phrases.map((phrase, i) => (
              <p key={i}>{phrase}</p>
            ))}
          </div>

          <p className="cosmos-pixel text-right text-[10px] text-gray-400">
            Résumé calculé à partir de tes cartes — vrai, pas toc.
          </p>
        </div>
      </div>
    </section>
  );
}
