import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FateLayout, FateDivider } from "@/components/drawn-by-fate/FateLayout";
import { FlippableCard, CardBack } from "@/components/drawn-by-fate/TarotCardSVG";
import { ALL_TAROT_CARDS, SUBJECTS, shuffleDeck, type TarotCard } from "@/data/tarotCards";
import { trpc } from "@/lib/trpc";

// ─── Parse URL search params ──────────────────────────────────────────────
function useSearchParams() {
  if (typeof window === "undefined") return { q: "", s: "" };
  const params = new URLSearchParams(window.location.search);
  return { q: params.get("q") || "", s: params.get("s") || "" };
}

// ─── Card count selector ──────────────────────────────────────────────────
function CountSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: value === n ? "#8B0000" : "transparent",
            border: `1px solid ${value === n ? "#CC0000" : "#CC000033"}`,
            color: value === n ? "#F0EAE0" : "#8B0000",
            fontSize: 16,
            fontFamily: "Georgia, serif",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: value === n ? "0 0 12px #CC000055" : "none",
          }}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// ─── Reading result display ───────────────────────────────────────────────
function ReadingResult({
  cards,
  reading,
}: {
  cards: TarotCard[];
  reading: { cardReadings: { cardName: string; interpretation: string }[]; overallReading: string } | null;
}) {
  if (!reading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ maxWidth: 680, margin: "0 auto" }}
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
        ✦ La Révélation ✦
      </h2>

      {/* Individual card readings */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {reading.cardReadings.map((cr, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            style={{
              background: "#0D0808",
              border: "1px solid #CC000033",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0 }}>
                <FlippableCard card={cards[i]} isFlipped size="sm" />
              </div>
              <div>
                <p
                  style={{
                    color: "#CC0000",
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {cards[i]?.nameFr}
                </p>
                <p
                  style={{
                    color: "#C0A898",
                    fontSize: 14,
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  {cr.interpretation}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall reading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reading.cardReadings.length * 0.2 + 0.3 }}
        style={{
          background: "#0D0808",
          border: "1px solid #CC000055",
          borderRadius: 8,
          padding: 24,
          marginTop: 24,
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
        <h3
          style={{
            color: "#CC0000",
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          ✦ Message global du destin
        </h3>
        <p
          style={{
            color: "#D4C4B8",
            fontSize: 15,
            lineHeight: 1.8,
            fontStyle: "italic",
          }}
        >
          {reading.overallReading}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main reading page ────────────────────────────────────────────────────
export default function DrawnByFateReading() {
  const [, navigate] = useLocation();
  const { q: question, s: subjectValue } = useSearchParams();
  const subjectLabel = SUBJECTS.find((s) => s.value === subjectValue)?.label || "";

  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [count, setCount] = useState(3);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [reading, setReading] = useState<{
    cardReadings: { cardName: string; interpretation: string }[];
    overallReading: string;
  } | null>(null);
  const [isShuffling, setIsShuffling] = useState(true);
  const readingRef = useRef<HTMLDivElement>(null);

  const tarotMutation = trpc.tarot.getReading.useMutation();

  // Shuffle on mount
  useEffect(() => {
    const shuffled = shuffleDeck(ALL_TAROT_CARDS).slice(0, 15);
    setTimeout(() => {
      setDeck(shuffled);
      setIsShuffling(false);
    }, 800);
  }, []);

  function toggleCard(index: number) {
    if (revealed) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else if (next.size < count) {
        next.add(index);
      }
      return next;
    });
  }

  async function handleReveal() {
    if (selected.size !== count) return;
    setRevealed(true);

    const chosenCards = [...selected].map((i) => deck[i]);
    try {
      const result = await tarotMutation.mutateAsync({
        question,
        subject: subjectValue,
        cards: chosenCards.map((c) => ({
          name: c.name,
          nameFr: c.nameFr,
          upright: c.upright,
          keywords: c.keywords,
        })),
      });
      setReading(result);
      setTimeout(() => {
        readingRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    } catch {
      setReading({
        cardReadings: chosenCards.map((c) => ({
          cardName: c.nameFr,
          interpretation: `La carte ${c.nameFr} porte le message de : ${c.upright}. Méditez sur ses mots avec soin.`,
        })),
        overallReading:
          "Les cartes ont parlé. Leur message vous appartient — lisez-le avec le cœur ouvert et laissez le destin vous guider.",
      });
    }
  }

  const selectedCards = [...selected].map((i) => deck[i]);

  return (
    <FateLayout>
      <div style={{ padding: "20px 24px 60px", maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 38px)",
              fontFamily: "Georgia, serif",
              color: "#CC0000",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textShadow: "0 0 20px #CC000066",
              margin: "0 0 8px",
            }}
          >
            ✦ Drawn by Fate ✦
          </h1>
          {(question || subjectLabel) && (
            <p style={{ color: "#8B6B60", fontStyle: "italic", fontSize: 14 }}>
              {question && `"${question}"`}
              {question && subjectLabel && " · "}
              {subjectLabel && `Sujet : ${subjectLabel}`}
            </p>
          )}
          <button
            onClick={() => navigate("/drawn-by-fate")}
            style={{
              background: "transparent",
              border: "none",
              color: "#5a3030",
              fontFamily: "Georgia, serif",
              fontSize: 11,
              letterSpacing: 2,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            ← Recommencer
          </button>
        </motion.div>

        {/* Shuffle loading */}
        <AnimatePresence>
          {isShuffling && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "60px 0" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: 36, display: "inline-block", color: "#CC0000" }}
              >
                ✦
              </motion.div>
              <p style={{ color: "#8B0000", fontStyle: "italic", marginTop: 12, letterSpacing: 2, fontSize: 13 }}>
                Le destin mélange les cartes...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card count selector */}
        {!isShuffling && !revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", marginBottom: 28 }}
          >
            <p style={{ color: "#8B6B60", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Combien de cartes veux-tu tirer ?
            </p>
            <CountSelector value={count} onChange={(n) => { setCount(n); setSelected(new Set()); }} />
            <p style={{ color: "#5a3030", fontSize: 12, marginTop: 10, fontStyle: "italic" }}>
              {selected.size === 0
                ? `Choisis ${count} carte${count > 1 ? "s" : ""} parmi celles ci-dessous`
                : `${selected.size} / ${count} carte${count > 1 ? "s" : ""} sélectionnée${selected.size > 1 ? "s" : ""}`}
            </p>
          </motion.div>
        )}

        {/* Card grid */}
        {!isShuffling && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            {deck.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <FlippableCard
                  card={card}
                  isFlipped={revealed && selected.has(i)}
                  isSelected={selected.has(i)}
                  isSelectable={!revealed}
                  onClick={() => toggleCard(i)}
                  size="sm"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Reveal button */}
        {!isShuffling && !revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            <button
              onClick={handleReveal}
              disabled={selected.size !== count}
              style={{
                background: selected.size === count ? "#8B0000" : "#1a0000",
                color: selected.size === count ? "#F0EAE0" : "#4a2020",
                border: `1px solid ${selected.size === count ? "#CC0000" : "#CC000022"}`,
                borderRadius: 4,
                padding: "12px 40px",
                fontFamily: "Georgia, serif",
                fontSize: 13,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: selected.size === count ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: selected.size === count ? "0 0 20px #CC000044" : "none",
              }}
              onMouseEnter={(e) => selected.size === count && ((e.currentTarget as HTMLElement).style.background = "#CC0000")}
              onMouseLeave={(e) => selected.size === count && ((e.currentTarget as HTMLElement).style.background = "#8B0000")}
            >
              ✦ Révéler les cartes ✦
            </button>
          </motion.div>
        )}

        {/* Loading state */}
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

        {/* Reading result */}
        <div ref={readingRef}>
          {reading && <ReadingResult cards={selectedCards} reading={reading} />}
        </div>

        {/* New reading button */}
        {reading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ textAlign: "center", marginTop: 40 }}
          >
            <FateDivider />
            <button
              onClick={() => navigate("/drawn-by-fate")}
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
              ✦ Nouvelle lecture
            </button>
          </motion.div>
        )}
      </div>
    </FateLayout>
  );
}
