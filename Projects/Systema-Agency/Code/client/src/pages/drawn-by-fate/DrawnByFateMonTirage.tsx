import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FateLayout, FateTitle, FateDivider } from "@/components/drawn-by-fate/FateLayout";
import { FlippableCard } from "@/components/drawn-by-fate/TarotCardSVG";
import { ALL_TAROT_CARDS, type TarotCard } from "@/data/tarotCards";
import { trpc } from "@/lib/trpc";

// ─── Spread definitions ───────────────────────────────────────────────────
type SpreadPosition = { id: number; label: string; description: string };
type Spread = {
  id: string;
  name: string;
  subtitle: string;
  positions: SpreadPosition[];
  layout: "single" | "line" | "horseshoe" | "celtic";
};

const SPREADS: Spread[] = [
  {
    id: "one",
    name: "1 Carte",
    subtitle: "Le message du jour",
    positions: [
      { id: 1, label: "Le Message", description: "Le conseil du destin pour aujourd'hui" },
    ],
    layout: "single",
  },
  {
    id: "three",
    name: "3 Cartes",
    subtitle: "Passé · Présent · Futur",
    positions: [
      { id: 1, label: "Le Passé", description: "Ce qui a conduit à la situation actuelle" },
      { id: 2, label: "Le Présent", description: "L'énergie du moment présent" },
      { id: 3, label: "Le Futur", description: "La direction probable si rien ne change" },
    ],
    layout: "line",
  },
  {
    id: "horseshoe",
    name: "Fer à Cheval",
    subtitle: "7 cartes · Vision globale",
    positions: [
      { id: 1, label: "Le Passé lointain", description: "Les influences profondes du passé" },
      { id: 2, label: "Le Passé récent", description: "Les événements récents qui ont un impact" },
      { id: 3, label: "Le Présent", description: "La situation actuelle" },
      { id: 4, label: "Les Obstacles", description: "Ce qui freine ou complique la situation" },
      { id: 5, label: "L'Environnement", description: "Les influences extérieures" },
      { id: 6, label: "Ce que vous ne voyez pas", description: "Les aspects cachés de la situation" },
      { id: 7, label: "Le Résultat probable", description: "L'évolution si la situation continue ainsi" },
    ],
    layout: "horseshoe",
  },
  {
    id: "celtic",
    name: "Croix Celtique",
    subtitle: "10 cartes · Lecture complète",
    positions: [
      { id: 1, label: "Le Présent", description: "La situation centrale, ce qui vous occupe maintenant" },
      { id: 2, label: "Le Challenge", description: "Ce qui croise ou s'oppose à la situation" },
      { id: 3, label: "Le Passé", description: "Ce qui est en train de passer, ce qui s'achève" },
      { id: 4, label: "Le Futur proche", description: "Ce qui arrive dans un futur immédiat" },
      { id: 5, label: "L'Objectif conscient", description: "Ce que vous espérez ou ce que vous visez" },
      { id: 6, label: "L'Inconscient", description: "Les forces inconscientes qui influencent la situation" },
      { id: 7, label: "Le Conseil", description: "Ce que vous devriez faire ou considérer" },
      { id: 8, label: "Les Influences extérieures", description: "L'environnement et les autres personnes impliquées" },
      { id: 9, label: "Peurs et Espoirs", description: "Vos craintes et vos espoirs les plus profonds" },
      { id: 10, label: "Le Résultat final", description: "L'aboutissement probable de la situation" },
    ],
    layout: "celtic",
  },
];

// ─── Card Selector ────────────────────────────────────────────────────────
function CardSelector({
  position,
  selected,
  onSelect,
  usedCardIds,
}: {
  position: SpreadPosition;
  selected: TarotCard | null;
  onSelect: (card: TarotCard | null) => void;
  usedCardIds: Set<number>;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = ALL_TAROT_CARDS.filter((c) => {
    if (usedCardIds.has(c.id) && c.id !== selected?.id) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return c.nameFr.toLowerCase().includes(s) || c.name.toLowerCase().includes(s);
  });

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: selected ? "#1a0505" : "#080404",
          border: `1px solid ${selected ? "#CC0000" : "#CC000033"}`,
          borderRadius: 6,
          color: selected ? "#F0EAE0" : "#5a3030",
          fontSize: 13,
          fontFamily: "Georgia, serif",
          fontStyle: selected ? "normal" : "italic",
          padding: "10px 14px",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.2s",
        }}
      >
        <span>{selected ? selected.nameFr : "Choisir une carte..."}</span>
        <span style={{ color: "#CC000088", fontSize: 10 }}>▼</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.85, originY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "#0D0808",
              border: "1px solid #CC000055",
              borderRadius: 6,
              zIndex: 300,
              maxHeight: 260,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "8px 10px", borderBottom: "1px solid #CC000022" }}>
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une carte..."
                style={{
                  width: "100%",
                  background: "#080404",
                  border: "1px solid #CC000033",
                  borderRadius: 4,
                  color: "#F0EAE0",
                  fontSize: 12,
                  fontFamily: "Georgia, serif",
                  padding: "6px 10px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ overflowY: "auto", maxHeight: 200 }}>
              {selected && (
                <button
                  onClick={() => { onSelect(null); setOpen(false); setSearch(""); }}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid #CC000022",
                    color: "#5a3030",
                    fontSize: 12,
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    padding: "9px 14px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  — Effacer la sélection
                </button>
              )}
              {filtered.map((card) => (
                <button
                  key={card.id}
                  onClick={() => { onSelect(card); setOpen(false); setSearch(""); }}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid #CC000011",
                    color: "#C0A898",
                    fontSize: 13,
                    fontFamily: "Georgia, serif",
                    padding: "9px 14px",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1a0000")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span>{card.nameFr}</span>
                  <span style={{ fontSize: 10, color: "#5a3030" }}>{card.arcana === "major" ? "Majeure" : card.suit}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p style={{ color: "#5a3030", fontSize: 12, fontStyle: "italic", padding: "12px 14px" }}>
                  Aucune carte trouvée
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Spread layout visual ─────────────────────────────────────────────────
function SpreadLayout({
  spread,
  selectedCards,
  onSelect,
}: {
  spread: Spread;
  selectedCards: (TarotCard | null)[];
  onSelect: (posIndex: number, card: TarotCard | null) => void;
}) {
  const usedCardIds = new Set<number>(
    selectedCards.filter(Boolean).map((c) => c!.id)
  );

  if (spread.layout === "single") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <PositionCard
          position={spread.positions[0]}
          card={selectedCards[0]}
          usedCardIds={usedCardIds}
          onSelect={(c) => onSelect(0, c)}
        />
      </div>
    );
  }

  if (spread.layout === "line") {
    return (
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {spread.positions.map((pos, i) => (
          <PositionCard
            key={pos.id}
            position={pos}
            card={selectedCards[i]}
            usedCardIds={usedCardIds}
            onSelect={(c) => onSelect(i, c)}
          />
        ))}
      </div>
    );
  }

  if (spread.layout === "horseshoe") {
    // 7 positions in an arc: 1 2 3 at bottom, 4 5 at middle, 6 7 at top
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {[5, 6].map((i) => (
            <PositionCard key={spread.positions[i].id} position={spread.positions[i]} card={selectedCards[i]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(i, c)} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {[2, 3, 4].map((i) => (
            <PositionCard key={spread.positions[i].id} position={spread.positions[i]} card={selectedCards[i]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(i, c)} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {[0, 1].map((i) => (
            <PositionCard key={spread.positions[i].id} position={spread.positions[i]} card={selectedCards[i]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(i, c)} />
          ))}
        </div>
      </div>
    );
  }

  // Celtic Cross layout — 10 cards
  // Cross part (positions 0-5) + Staff part (positions 6-9, bottom to top)
  return (
    <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
      {/* Cross */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
        {/* Top - position 4 (Objectif) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PositionCard position={spread.positions[4]} card={selectedCards[4]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(4, c)} />
        </div>
        {/* Middle row: Left (2 Passé) — Center cross (0 Présent + 1 Challenge) — Right (3 Futur) */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <PositionCard position={spread.positions[2]} card={selectedCards[2]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(2, c)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
            <PositionCard position={spread.positions[0]} card={selectedCards[0]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(0, c)} />
            <PositionCard position={spread.positions[1]} card={selectedCards[1]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(1, c)} />
          </div>
          <PositionCard position={spread.positions[3]} card={selectedCards[3]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(3, c)} />
        </div>
        {/* Bottom - position 5 (Inconscient) */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PositionCard position={spread.positions[5]} card={selectedCards[5]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(5, c)} />
        </div>
      </div>

      {/* Staff - positions 6-9 from bottom to top */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
        {[9, 8, 7, 6].map((i) => (
          <PositionCard key={spread.positions[i].id} position={spread.positions[i]} card={selectedCards[i]} usedCardIds={usedCardIds} onSelect={(c) => onSelect(i, c)} />
        ))}
      </div>
    </div>
  );
}

function PositionCard({
  position,
  card,
  usedCardIds,
  onSelect,
}: {
  position: SpreadPosition;
  card: TarotCard | null;
  usedCardIds: Set<number>;
  onSelect: (card: TarotCard | null) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 140 }}>
      <div style={{ fontSize: 10, color: "#8B0000", letterSpacing: 2, textTransform: "uppercase", textAlign: "center" }}>
        {position.id}. {position.label}
      </div>
      {card ? (
        <div onClick={() => onSelect(null)} style={{ cursor: "pointer" }} title="Cliquer pour changer">
          <FlippableCard card={card} isFlipped size="sm" />
        </div>
      ) : (
        <div
          style={{
            width: 70,
            height: 112,
            border: "1px dashed #CC000033",
            borderRadius: 6,
            background: "#0A0505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3a1818",
            fontSize: 22,
          }}
        >
          ✦
        </div>
      )}
      <CardSelector
        position={position}
        selected={card}
        onSelect={onSelect}
        usedCardIds={usedCardIds}
      />
      <p style={{ fontSize: 10, color: "#3a1818", fontStyle: "italic", textAlign: "center", lineHeight: 1.4 }}>
        {position.description}
      </p>
    </div>
  );
}

// ─── Reading result ───────────────────────────────────────────────────────
function ReadingResult({
  spread,
  cards,
  reading,
}: {
  spread: Spread;
  cards: TarotCard[];
  reading: { cardReadings: { cardName: string; interpretation: string }[]; overallReading: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <FateDivider />
      <h2
        style={{
          textAlign: "center",
          color: "#CC0000",
          fontFamily: "Georgia, serif",
          fontSize: 18,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        ✦ Interprétation du Tirage ✦
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reading.cardReadings.map((cr, i) => {
          const pos = spread.positions[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              style={{
                background: "#0D0808",
                border: "1px solid #CC000033",
                borderRadius: 8,
                padding: 18,
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0 }}>
                  <FlippableCard card={cards[i]} isFlipped size="sm" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#5a3030", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>
                    Position {pos?.id} — {pos?.label}
                  </p>
                  <p style={{ color: "#CC0000", fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>
                    {cards[i]?.nameFr}
                  </p>
                  <p style={{ color: "#C0A898", fontSize: 14, lineHeight: 1.7, fontStyle: "italic" }}>
                    {cr.interpretation}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reading.cardReadings.length * 0.15 + 0.3 }}
        style={{
          background: "#0D0808",
          border: "1px solid #CC000055",
          borderRadius: 8,
          padding: 24,
          marginTop: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent, #CC0000, transparent)",
          }}
        />
        <h3 style={{ color: "#CC0000", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
          ✦ Message global du destin
        </h3>
        <p style={{ color: "#D4C4B8", fontSize: 15, lineHeight: 1.8, fontStyle: "italic" }}>
          {reading.overallReading}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function DrawnByFateMonTirage() {
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [selectedCards, setSelectedCards] = useState<(TarotCard | null)[]>([]);
  const [reading, setReading] = useState<{
    cardReadings: { cardName: string; interpretation: string }[];
    overallReading: string;
  } | null>(null);
  const [question, setQuestion] = useState("");
  const readingRef = useRef<HTMLDivElement>(null);

  const tarotMutation = trpc.tarot.getReading.useMutation();

  function selectSpread(spread: Spread) {
    setSelectedSpread(spread);
    setSelectedCards(new Array(spread.positions.length).fill(null));
    setReading(null);
  }

  function handleCardSelect(posIndex: number, card: TarotCard | null) {
    setSelectedCards((prev) => {
      const next = [...prev];
      next[posIndex] = card;
      return next;
    });
    setReading(null);
  }

  const allCardsSelected = selectedSpread !== null && selectedCards.every(Boolean);

  async function handleInterpret() {
    if (!allCardsSelected || !selectedSpread) return;

    const cards = selectedCards as TarotCard[];
    const positionLabels = selectedSpread.positions.map((p) => p.label).join(", ");

    try {
      const result = await tarotMutation.mutateAsync({
        question: question.trim() || undefined,
        subject: `Tirage ${selectedSpread.name} — Positions : ${positionLabels}`,
        cards: cards.map((c, i) => ({
          name: c.name,
          nameFr: `${c.nameFr} (position: ${selectedSpread.positions[i].label})`,
          upright: c.upright,
          keywords: c.keywords,
        })),
      });
      setReading(result);
      setTimeout(() => {
        readingRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 600);
    } catch {
      setReading({
        cardReadings: cards.map((c, i) => ({
          cardName: c.nameFr,
          interpretation: `En position "${selectedSpread.positions[i].label}", la carte ${c.nameFr} porte ce message : ${c.upright}`,
        })),
        overallReading:
          "Les cartes ont parlé. Méditez sur chaque position et laissez les symboles vous guider vers votre vérité intérieure.",
      });
    }
  }

  return (
    <FateLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px 80px" }}>
        <FateTitle subtitle="Entrez vos propres cartes et recevez une interprétation">
          Mon Tirage
        </FateTitle>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: "center",
            color: "#8B6B60",
            fontSize: 14,
            fontStyle: "italic",
            lineHeight: 1.7,
            maxWidth: 540,
            margin: "0 auto 36px",
          }}
        >
          Vous avez tiré des cartes chez vous ? Sélectionnez votre type de tirage,
          entrez les cartes que vous avez obtenues, et laissez le destin vous révéler leur message.
        </motion.p>

        {/* ── Spread selector ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ marginBottom: 36 }}
        >
          <p style={{ color: "#8B0000", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>
            ✦ Choisissez votre type de tirage
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {SPREADS.map((spread) => (
              <button
                key={spread.id}
                onClick={() => selectSpread(spread)}
                style={{
                  background: selectedSpread?.id === spread.id ? "#1a0000" : "#0A0505",
                  border: `1px solid ${selectedSpread?.id === spread.id ? "#CC0000" : "#CC000033"}`,
                  borderRadius: 8,
                  padding: "14px 20px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  minWidth: 140,
                  boxShadow: selectedSpread?.id === spread.id ? "0 0 16px #CC000033" : "none",
                }}
                onMouseEnter={(e) => {
                  if (selectedSpread?.id !== spread.id) {
                    (e.currentTarget as HTMLElement).style.borderColor = "#CC000066";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSpread?.id !== spread.id) {
                    (e.currentTarget as HTMLElement).style.borderColor = "#CC000033";
                  }
                }}
              >
                <p style={{ color: selectedSpread?.id === spread.id ? "#CC0000" : "#C0A898", fontFamily: "Georgia, serif", fontSize: 15, marginBottom: 4 }}>
                  {spread.name}
                </p>
                <p style={{ color: "#5a3030", fontSize: 11, fontStyle: "italic" }}>{spread.subtitle}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Question input (optional) ───────────────────── */}
        <AnimatePresence>
          {selectedSpread && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom: 28, overflow: "hidden" }}
            >
              <div
                style={{
                  background: "#0D0808",
                  border: "1px solid #CC000033",
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <p style={{ color: "#8B0000", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                  ✦ Question ou intention (optionnel)
                </p>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Sur quoi porte votre tirage ?"
                  style={{
                    width: "100%",
                    background: "#080404",
                    border: "1px solid #CC000033",
                    borderRadius: 6,
                    color: "#F0EAE0",
                    fontSize: 14,
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    padding: "10px 14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#CC0000")}
                  onBlur={(e) => (e.target.style.borderColor = "#CC000033")}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Card placement ───────────────────────────────── */}
        <AnimatePresence>
          {selectedSpread && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FateDivider />
              <p style={{ color: "#8B0000", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>
                ✦ Placez vos cartes — {selectedSpread.name}
              </p>

              <div style={{ overflowX: "auto", paddingBottom: 12 }}>
                <SpreadLayout
                  spread={selectedSpread}
                  selectedCards={selectedCards}
                  onSelect={handleCardSelect}
                />
              </div>

              {/* Progress */}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <p style={{ color: "#5a3030", fontSize: 12, fontStyle: "italic" }}>
                  {selectedCards.filter(Boolean).length} / {selectedSpread.positions.length} cartes placées
                </p>
              </div>

              {/* Interpret button */}
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button
                  onClick={handleInterpret}
                  disabled={!allCardsSelected || tarotMutation.isPending}
                  style={{
                    background: allCardsSelected ? "#8B0000" : "#1a0000",
                    color: allCardsSelected ? "#F0EAE0" : "#4a2020",
                    border: `1px solid ${allCardsSelected ? "#CC0000" : "#CC000022"}`,
                    borderRadius: 4,
                    padding: "12px 40px",
                    fontFamily: "Georgia, serif",
                    fontSize: 13,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    cursor: allCardsSelected ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    boxShadow: allCardsSelected ? "0 0 20px #CC000044" : "none",
                  }}
                  onMouseEnter={(e) => allCardsSelected && ((e.currentTarget as HTMLElement).style.background = "#CC0000")}
                  onMouseLeave={(e) => allCardsSelected && ((e.currentTarget as HTMLElement).style.background = "#8B0000")}
                >
                  {tarotMutation.isPending ? "✦ Consultation en cours..." : "✦ Interpréter mon tirage ✦"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading ─────────────────────────────────────── */}
        {tarotMutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: 28, display: "inline-block", color: "#CC0000" }}
            >
              ✦
            </motion.div>
            <p style={{ color: "#8B0000", fontStyle: "italic", marginTop: 12, letterSpacing: 2, fontSize: 13 }}>
              Le destin consulte les astres...
            </p>
          </motion.div>
        )}

        {/* ── Reading result ───────────────────────────────── */}
        <div ref={readingRef} style={{ marginTop: 20 }}>
          {reading && selectedSpread && (
            <ReadingResult
              spread={selectedSpread}
              cards={selectedCards as TarotCard[]}
              reading={reading}
            />
          )}
        </div>

        {/* ── Reset ───────────────────────────────────────── */}
        {reading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ textAlign: "center", marginTop: 40 }}
          >
            <FateDivider />
            <button
              onClick={() => {
                setReading(null);
                setSelectedCards(new Array(selectedSpread!.positions.length).fill(null));
              }}
              style={{
                background: "transparent",
                border: "1px solid #CC000044",
                borderRadius: 4,
                color: "#8B0000",
                fontFamily: "Georgia, serif",
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                padding: "10px 30px",
                cursor: "pointer",
                transition: "all 0.2s",
                marginTop: 16,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#CC0000";
                (e.currentTarget as HTMLElement).style.borderColor = "#CC0000";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#8B0000";
                (e.currentTarget as HTMLElement).style.borderColor = "#CC000044";
              }}
            >
              ✦ Nouveau tirage
            </button>
          </motion.div>
        )}
      </div>
    </FateLayout>
  );
}
