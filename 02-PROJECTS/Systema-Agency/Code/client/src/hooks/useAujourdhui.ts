// useAujourdhui.ts — la date du jour, mais VIVANTE.
// Si la page reste ouverte passé minuit (onglet qui dort, PWA en arrière-plan),
// la date se rafraîchit toute seule — vérification chaque minute + au retour
// sur l'onglet. Partagé par le Cosmos et le briefing de la Home.

import { useEffect, useState } from "react";

export function useAujourdhui(): Date {
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
