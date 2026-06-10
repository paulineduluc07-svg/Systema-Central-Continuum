// Cosmos.tsx — la PAGE du dashboard « météo cosmique & biologique ».
// Look « Sanctuary » : fond crème à pois, en-tête + cartes néo-brutalistes.
// MainLayout fournit la navbar (fixe, flotte au-dessus) ; ici on peint le fond
// crème plein écran en annulant son padding haut (-mt-24), puis on dégage la
// navbar avec pt-28.

import "../components/cosmos/cosmos.css";
import { useEffect, useState } from "react";
import { BriefingCard } from "@/components/cosmos/BriefingCard";
import { AstroCard } from "@/components/cosmos/AstroCard";
import { HumanDesignCard } from "@/components/cosmos/HumanDesignCard";
import { LuneCard } from "@/components/cosmos/LuneCard";
import { NumeroCard } from "@/components/cosmos/NumeroCard";
import { BiorythmesCard } from "@/components/cosmos/BiorythmesCard";
import { CycleCard } from "@/components/cosmos/CycleCard";
import { EnergieCard } from "@/components/cosmos/EnergieCard";
import { MatriceCard } from "@/components/cosmos/MatriceCard";
import { TarotCard } from "@/components/cosmos/TarotCard";

/** Aujourd'hui, mais VIVANT : si la page reste ouverte passé minuit (onglet
 *  qui dort, PWA en arrière-plan), la date se rafraîchit toute seule —
 *  vérification chaque minute + au retour sur l'onglet. Sans ça, toutes les
 *  cartes restaient figées sur le jour du premier affichage. */
function useAujourdhui(): Date {
  const [jour, setJour] = useState(() => new Date());
  useEffect(() => {
    const verifie = () =>
      setJour((avant) => {
        const maintenant = new Date();
        return maintenant.toDateString() === avant.toDateString() ? avant : maintenant;
      });
    const minuterie = setInterval(verifie, 60_000);
    document.addEventListener("visibilitychange", verifie);
    return () => {
      clearInterval(minuterie);
      document.removeEventListener("visibilitychange", verifie);
    };
  }, []);
  return jour;
}

export default function Cosmos() {
  const aujourdhui = useAujourdhui();
  const dateLisible = aujourdhui.toLocaleDateString("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="cosmos-root -mt-24 min-h-screen pb-16">
      <main className="mx-auto max-w-5xl px-4 pt-16 md:px-8">
        {/* Section : la grille de cartes */}
        <section>
          {/* Juste la date, discrète, en haut à droite */}
          <p className="cosmos-pixel mb-3 text-right text-sm capitalize text-pink-600">{dateLisible}</p>

          {/* Le briefing du jour, en tête */}
          <div className="mb-6">
            <BriefingCard date={aujourdhui} />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TarotCard date={aujourdhui} />
            <AstroCard date={aujourdhui} />
            <HumanDesignCard date={aujourdhui} />
            <LuneCard date={aujourdhui} />
            <NumeroCard date={aujourdhui} />
            <BiorythmesCard date={aujourdhui} />
            <CycleCard date={aujourdhui} />
            <EnergieCard date={aujourdhui} />
            <MatriceCard date={aujourdhui} />
          </div>
        </section>
      </main>
    </div>
  );
}
