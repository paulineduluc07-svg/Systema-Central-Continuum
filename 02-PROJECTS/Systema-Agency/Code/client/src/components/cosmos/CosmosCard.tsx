// CosmosCard.tsx — la COQUILLE réutilisable, look « Sanctuary » néo-brutaliste.
// Anatomie (calquée sur le template Flask) :
//   en-tête : boîte-icône chunky + titre + tag pixel  | divider pointillé
//   contenu : les chiffres/jauges de la carte
//   tiroir  : détail dépliable (style chunky)
//   footer  : 2 labels monospace roses (gauche / droite)

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { LectureDuJour, type CosmosSection } from "./LectureDuJour";

type CosmosCardProps = {
  emoji: string;
  titre: string;
  tag: string;
  /** Dégradé/fond de la boîte-icône (classes Tailwind). */
  iconBg?: string;
  children: ReactNode;
  /** Contenu du tiroir dépliable (optionnel). */
  detail?: ReactNode;
  detailLabel?: string;
  /** Les deux labels monospace du bas. */
  footerLeft?: string;
  footerRight?: string;
  /** Plafonne la hauteur et fait défiler le contenu dans la carte (défaut: true).
   *  Mettre false pour les cartes larges (ex: la Matrice). */
  capped?: boolean;
  className?: string;
  /** Section Cosmos pour l'encart « ✨ Lecture du jour » écrit par l'agent (optionnel). */
  lectureSection?: CosmosSection;
  /** Date du jour affiché — requise avec lectureSection. */
  lectureDate?: Date;
};

export function CosmosCard({
  emoji,
  titre,
  tag,
  iconBg = "bg-pink-100",
  children,
  detail,
  detailLabel = "voir le détail",
  footerLeft,
  footerRight,
  capped = true,
  className,
  lectureSection,
  lectureDate,
}: CosmosCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col justify-between rounded-2xl border-4 border-[#2c2523] bg-[#fcf8f2] p-5",
        "shadow-[6px_6px_0_0_#2c2523] transition-all hover:border-pink-400",
        capped && "max-h-[360px]",
        className,
      )}
    >
      <div className={cn(capped && "cosmos-scroll min-h-0 flex-1 overflow-y-auto pr-1.5")}>
        {/* En-tête : icône + titre + tag, souligné d'un pointillé */}
        <div className="mb-3 flex items-center justify-between border-b-2 border-dotted border-[#eadbc8] pb-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#2c2523] text-base shadow-[1.5px_1.5px_0_#262626]",
                iconBg,
              )}
            >
              {emoji}
            </div>
            <h4 className="text-sm font-bold tracking-tight text-[#2c2523]">{titre}</h4>
          </div>
          <span className="cosmos-pixel rounded border border-pink-200 bg-pink-50 px-1.5 py-0.5 text-xs text-pink-800">
            {tag}
          </span>
        </div>

        {/* Contenu principal */}
        <div className="space-y-2 text-xs font-medium text-[#5b5552]">{children}</div>

        {/* Lecture du jour écrite par l'agent (optionnel, s'efface si rien) */}
        {lectureSection && lectureDate && <LectureDuJour section={lectureSection} date={lectureDate} />}

        {/* Tiroir dépliable (optionnel) */}
        {detail && (
          <details className="cosmos-tiroir mt-3 text-xs font-medium text-[#5b5552]">
            <summary className="cosmos-pixel text-[10px] text-pink-600">{detailLabel}</summary>
            <div className="space-y-1.5 rounded-b-lg border-2 border-t-0 border-[#2c2523] bg-white px-2.5 py-2 leading-snug">
              {detail}
            </div>
          </details>
        )}
      </div>

      {/* Footer : 2 labels monospace roses */}
      {(footerLeft || footerRight) && (
        <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-pink-600 cosmos-pixel">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      )}
    </article>
  );
}
