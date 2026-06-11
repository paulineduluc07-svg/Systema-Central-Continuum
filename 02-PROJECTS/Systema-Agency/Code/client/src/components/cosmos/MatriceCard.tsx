// MatriceCard.tsx — la carte 🔮 Matrice de la Destinée (look Sanctuary).
// Octogramme cliquable (nœuds bordés noir, carrés colorés, labels d'âge 0–70),
// marqueur doré déplaçable via les 10 prochaines années.
// La boîte de détail suit le DERNIER élément cliqué (un nœud OU une année).

import { matrice } from "@shared/cosmos/matrice";
import { useState } from "react";
import { CosmosCard } from "./CosmosCard";

// Position des 9 nœuds sur le dessin (8 du contour + centre).
const NOEUDS_XY: Array<{ cle: string; x: number; y: number }> = [
  { cle: "gauche", x: 35, y: 175 },
  { cle: "hg", x: 78, y: 83 },
  { cle: "haut", x: 170, y: 40 },
  { cle: "hd", x: 262, y: 83 },
  { cle: "droite", x: 305, y: 175 },
  { cle: "bd", x: 262, y: 267 },
  { cle: "bas", x: 170, y: 310 },
  { cle: "bg", x: 78, y: 267 },
  { cle: "centre", x: 170, y: 175 },
];

// Les étiquettes d'âge le long du contour (0 → 70).
const AGE_LABELS: Array<{ age: number; x: number; y: number }> = [
  { age: 0, x: 14, y: 179 },
  { age: 10, x: 50, y: 64 },
  { age: 20, x: 170, y: 22 },
  { age: 30, x: 290, y: 64 },
  { age: 40, x: 326, y: 179 },
  { age: 50, x: 290, y: 290 },
  { age: 60, x: 170, y: 338 },
  { age: 70, x: 50, y: 290 },
];

// Les 5 positions « clés » (le carré droit + le centre), pour le tiroir.
const POINTS_CLES = ["centre", "gauche", "haut", "droite", "bas"];

export function MatriceCard({ date }: { date: Date }) {
  const m = matrice(date);
  // anneeIdx = position du marqueur doré (l'année pointée).
  const [anneeIdx, setAnneeIdx] = useState<number>(0);
  // focus = ce qu'affiche la boîte de détail : "annee" ou la clé d'un nœud.
  const [focus, setFocus] = useState<string>("annee");

  const marqueur = m.prochaines[anneeIdx];

  // Ce que la boîte de détail montre, selon le dernier clic.
  const detail =
    focus === "annee"
      ? {
          surtitre: `À ${marqueur.age} ans`,
          soustitre: "ton année sur la ligne du temps",
          emoji: marqueur.emoji,
          num: marqueur.num,
          nom: marqueur.nom,
          sens: marqueur.sens,
        }
      : {
          surtitre: m.noeuds[focus].posTitre,
          soustitre: m.noeuds[focus].posSous,
          emoji: m.noeuds[focus].emoji,
          num: m.noeuds[focus].num,
          nom: m.noeuds[focus].nom,
          sens: m.noeuds[focus].sens,
        };

  return (
    <CosmosCard
      lectureSection="matrice"
      lectureDate={date}
      emoji="🔮"
      titre="Matrice de la Destinée"
      tag="DESTIN"
      iconBg="bg-gradient-to-tr from-pink-400 to-purple-500"
      className="md:col-span-2 lg:col-span-2"
      footerLeft={`${m.age} ans`}
      footerRight={`Période ${m.noeuds[m.periodeActuelle ?? "centre"].nom}`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {/* ─── L'octogramme ─── */}
        <svg viewBox="0 0 340 360" className="w-full" role="img" aria-label="Octogramme de la matrice">
          {/* Les deux carrés colorés superposés */}
          <polygon points="35,175 170,40 305,175 170,310" fill="rgba(255,102,178,0.06)" stroke="#FF66B2" strokeWidth={2.5} />
          <polygon points="78,83 262,83 262,267 78,267" fill="none" stroke="#a78bfa" strokeWidth={2.5} />

          {/* Étiquettes d'âge */}
          {AGE_LABELS.map((a) => (
            <text key={a.age} x={a.x} y={a.y} textAnchor="middle" fontSize={11} fill="#a99bc7" className="cosmos-pixel">
              {a.age}
            </text>
          ))}

          {/* Ligne d'âge fine : petits points le long du contour */}
          {m.dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.5} fill={d.couleur} opacity={0.5} />
          ))}

          {/* Marqueur doré (année choisie) + anneau pointillé + âge */}
          <circle cx={marqueur.x} cy={marqueur.y} r={14} fill="none" stroke="#caa12e" strokeWidth={1.5} strokeDasharray="4 3" />
          <circle cx={marqueur.x} cy={marqueur.y} r={8} fill="#ffd75e" stroke="#2c2523" strokeWidth={2}>
            <title>{`${marqueur.age} ans — ${marqueur.nom}`}</title>
          </circle>
          <text x={marqueur.x} y={marqueur.y - 20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2c2523">
            {marqueur.age}
          </text>

          {/* Les 9 nœuds cliquables (bordés noir) */}
          {NOEUDS_XY.map(({ cle, x, y }) => {
            const n = m.noeuds[cle];
            const actif = cle === focus;
            return (
              <g key={cle} onClick={() => setFocus(cle)} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r={cle === "centre" ? 26 : 22}
                  fill={n.couleur}
                  stroke="#2c2523"
                  strokeWidth={actif ? 4 : 2.5}
                />
                <text x={x} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={700} fill="#fff">
                  {n.num}
                </text>
              </g>
            );
          })}
        </svg>

        {/* ─── Panneau latéral ─── */}
        <div className="flex flex-col justify-start gap-3">
          <p className="text-xs leading-snug text-[#5b5552]">
            Clique un nœud de l'étoile ✨ — ou une année ci-dessous — pour voir son arcane. Tout est
            calculé depuis ta naissance, du <span className="font-bold">vrai</span> pas du toc. 🌙
          </p>

          {/* La boîte de détail (suit le dernier clic : nœud OU année) */}
          <div className="rounded-lg border-l-4 border-pink-400 bg-[#fff6fb] p-3">
            <p className="cosmos-pixel text-[10px] uppercase tracking-wide text-pink-700">{detail.surtitre}</p>
            <p className="mb-1 text-[10px] text-gray-400">{detail.soustitre}</p>
            <p className="text-sm font-bold text-[#2c2523]">
              {detail.emoji} Arcane {detail.num} — {detail.nom}
            </p>
            <p className="mt-1 text-[11px] text-[#5b5552]">{detail.sens}</p>
          </div>

          {/* Les 10 prochaines années cliquables (dans un tiroir pour gagner de la place) */}
          <details className="cosmos-tiroir">
            <summary className="cosmos-pixel text-[10px] uppercase tracking-wide text-[#caa12e]">
              tes 10 prochaines années — clique pour explorer
            </summary>
            <div className="flex flex-wrap gap-1 rounded-b-lg border-2 border-t-0 border-[#2c2523] bg-[#fffaf0] p-2">
              {m.prochaines.map((y, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAnneeIdx(i);
                    setFocus("annee");
                  }}
                  title={y.nom}
                  className={
                    "flex items-center gap-1 rounded border px-1.5 py-1 transition " +
                    (focus === "annee" && i === anneeIdx
                      ? "border-[#caa12e] bg-[#fff6da]"
                      : "border-[#f0e8fb] bg-white/70 hover:border-[#caa12e]")
                  }
                >
                  <span className="cosmos-pixel text-[10px] text-gray-500">{y.age}</span>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: y.couleur }} />
                  <span className="cosmos-pixel text-[11px] font-bold text-[#2c2523]">{y.num}</span>
                </button>
              ))}
            </div>
          </details>

          {/* Tiroir : tes 5 points clés */}
          <details className="cosmos-tiroir text-xs font-medium text-[#5b5552]">
            <summary className="cosmos-pixel text-[10px] text-pink-600">tes 5 points clés</summary>
            <div className="space-y-1.5 rounded-b-lg border-2 border-t-0 border-[#2c2523] bg-white px-2.5 py-2 leading-snug">
              {POINTS_CLES.map((cle) => {
                const n = m.noeuds[cle];
                return (
                  <p key={cle}>
                    <span className="font-bold text-[#2c2523]">
                      {n.emoji} {n.num} {n.nom}
                    </span>{" "}
                    <span className="text-gray-400">· {n.posTitre}</span>
                  </p>
                );
              })}
            </div>
          </details>

          {/* Tiroir : tes périodes de vie */}
          <details className="cosmos-tiroir text-xs font-medium text-[#5b5552]">
            <summary className="cosmos-pixel text-[10px] text-pink-600">tes périodes de vie · {m.age} ans</summary>
            <div className="space-y-1 rounded-b-lg border-2 border-t-0 border-[#2c2523] bg-white px-2.5 py-2 leading-snug">
              {m.periodes.map((p) => (
                <p key={p.cle} className={p.actuel ? "font-bold text-[#2c2523]" : ""}>
                  {p.emoji} {p.de}–{p.a} ans — {p.nom}
                  {p.actuel && <span className="ml-1 cosmos-pixel text-[10px] text-pink-600">← tu es ici</span>}
                </p>
              ))}
            </div>
          </details>
        </div>
      </div>
    </CosmosCard>
  );
}
