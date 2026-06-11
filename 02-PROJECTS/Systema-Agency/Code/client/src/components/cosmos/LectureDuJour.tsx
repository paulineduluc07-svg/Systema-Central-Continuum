// LectureDuJour.tsx — l'encart « ✨ Lecture du jour » des cartes Cosmos.
// La SEULE voix interprétative des cartes : les textes en conserve ont été retirés,
// c'est l'agent (via MCP set_cosmos_reading) qui écrit la lecture, profonde et datée.
// Pas de lecture pour la journée → on le dit honnêtement, sans texte de remplissage.
// La requête tRPC est partagée entre toutes les cartes (même clé → même cache).

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export type CosmosSection =
  | "astro"
  | "humanDesign"
  | "lune"
  | "numero"
  | "biorythmes"
  | "cycle"
  | "energie"
  | "matrice"
  | "synthese";

function isoLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function LectureDuJour({ section, date }: { section: CosmosSection; date: Date }) {
  const { isAuthenticated } = useAuth();
  const { data } = trpc.cosmosReadings.get.useQuery(
    { date: isoLocal(date) },
    { enabled: isAuthenticated, staleTime: 5 * 60 * 1000 },
  );

  const lecture = data?.sections?.[section];

  if (!lecture?.texte) {
    return (
      <div className="mt-3 rounded-lg border-2 border-dashed border-[#eadbc8] bg-white/50 p-2.5">
        <p className="cosmos-pixel text-[10px] uppercase tracking-wider text-[#9a8f8a]">
          🌫️ lecture pas encore calculée pour cette journée
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-lg border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 p-2.5 shadow-[2px_2px_0_#262626]">
      <p className="cosmos-pixel mb-1 text-[10px] uppercase tracking-wider text-purple-700">
        ✨ Lecture du jour{lecture.titre ? ` — ${lecture.titre}` : ""}
      </p>
      <p className="whitespace-pre-line text-xs font-medium leading-snug text-[#2c2523]">{lecture.texte}</p>
    </div>
  );
}
