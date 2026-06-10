// OracleBriefing.tsx — le 🔮 Briefing du jour, au centre de la Home.
// Déménagé depuis la page Cosmos : mêmes cerveaux (lune, biorythmes, numéro,
// astro, cycle via préférences), nouveau costume Dollhouse Y2K.

import { useAuth } from "@/_core/hooks/useAuth";
import { useAujourdhui } from "@/hooks/useAujourdhui";
import { astro } from "@/lib/cosmos/astro";
import { biorythmes } from "@/lib/cosmos/biorythmes";
import { calculCycle } from "@/lib/cosmos/cycle";
import { phaseLunaire } from "@/lib/cosmos/lune";
import { cheminDeVie } from "@/lib/cosmos/numerologie";
import { briefing } from "@/lib/cosmos/synthese";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function OracleBriefing() {
  const date = useAujourdhui();
  const { isAuthenticated } = useAuth();
  const { data: prefs } = trpc.preferences.get.useQuery(undefined, { enabled: isAuthenticated });

  const jour1Iso = isAuthenticated
    ? prefs?.cycleJour1 ?? null
    : typeof window !== "undefined"
      ? localStorage.getItem("cosmos_cycle_jour1")
      : null;
  const cycle = jour1Iso ? calculCycle(parseIso(jour1Iso), date) : null;

  const b = briefing(phaseLunaire(date), biorythmes(date), cheminDeVie(date), astro(date), cycle);

  const dateLisible = date.toLocaleDateString("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="relative overflow-hidden rounded-none border-[6px] border-black bg-white p-8 shadow-[6px_6px_0px_#FFB7C5] transition-all duration-300 md:p-10">
        <div className="absolute top-2 right-4 animate-pulse text-lg text-pink-400 select-none">✨</div>
        <div className="absolute bottom-6 left-2 rotate-12 text-sm text-rose-300 select-none">🦋</div>

        <div className="mb-6 text-center">
          <h2 className="home-bubble text-3xl leading-none font-bold tracking-tight text-black lowercase md:text-4xl">
            briefing du jour
          </h2>
          <p className="home-pixel mt-2 text-sm text-pink-500 capitalize">{dateLisible} · {b.ton.emoji} {b.ton.label}</p>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {b.phrases.map((phrase, i) => (
            <p key={i} className="home-serif border-l-4 border-[#FFB7C5] pl-3 text-sm leading-relaxed text-gray-800 md:text-base">
              {phrase}
            </p>
          ))}
        </div>

        <div className="mt-8 border-t border-gray-100 pt-5 text-center select-none">
          <span className="home-pixel animate-pulse text-xs tracking-widest text-[#FF69B4] uppercase md:text-sm">
            ⋆ COSMIC FREQUENCY ⋆
          </span>
          <p className="mt-1 font-mono text-[9px] text-gray-400">résumé calculé à partir de tes cartes cosmos — vrai, pas toc</p>
        </div>
      </div>
    </motion.div>
  );
}
