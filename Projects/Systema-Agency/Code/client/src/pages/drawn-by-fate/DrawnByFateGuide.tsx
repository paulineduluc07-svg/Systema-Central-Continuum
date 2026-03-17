import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FateLayout, FateTitle, FateDivider } from "@/components/drawn-by-fate/FateLayout";
import { CardFace } from "@/components/drawn-by-fate/TarotCardSVG";
import { MAJOR_ARCANA, MINOR_ARCANA, type TarotCard } from "@/data/tarotCards";

const SUIT_LABELS: Record<string, string> = {
  wands: "Bâtons",
  cups: "Coupes",
  swords: "Épées",
  pentacles: "Pentacles",
};

function CardModal({ card, onClose }: { card: TarotCard; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0A0505",
          border: "1px solid #CC000055",
          borderRadius: 12,
          padding: 32,
          maxWidth: 500,
          width: "100%",
          display: "flex",
          gap: 28,
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <CardFace card={card} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#8B0000", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>
            {card.arcana === "major" ? `Arcane Majeure · ${card.number}` : `Arcane Mineure · ${SUIT_LABELS[card.suit!] || card.suit}`}
          </p>
          <h2 style={{ color: "#F0EAE0", fontFamily: "Georgia, serif", fontSize: 20, marginBottom: 4, fontWeight: "normal" }}>
            {card.nameFr}
          </h2>
          <p style={{ color: "#8B6B60", fontSize: 12, fontStyle: "italic", marginBottom: 16 }}>
            {card.name}
          </p>
          <FateDivider />
          <div style={{ marginTop: 12 }}>
            <p style={{ color: "#CC0000", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
              ✦ À l'endroit
            </p>
            <p style={{ color: "#C0A898", fontSize: 14, lineHeight: 1.7, fontStyle: "italic", marginBottom: 14 }}>
              {card.upright}
            </p>
            <p style={{ color: "#8B0000", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
              ↓ Renversée
            </p>
            <p style={{ color: "#9A8070", fontSize: 14, lineHeight: 1.7, fontStyle: "italic", marginBottom: 14 }}>
              {card.reversed}
            </p>
            <p style={{ color: "#5a3030", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
              Mots-clés
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {card.keywords.map((kw) => (
                <span
                  key={kw}
                  style={{
                    background: "#1a0000",
                    border: "1px solid #CC000033",
                    borderRadius: 20,
                    color: "#8B6B60",
                    fontSize: 11,
                    padding: "3px 10px",
                    fontStyle: "italic",
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            background: "transparent",
            border: "none",
            color: "#5a3030",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}

function CardGrid({ cards, title }: { cards: TarotCard[]; title: string }) {
  const [selected, setSelected] = useState<TarotCard | null>(null);

  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          color: "#CC0000",
          fontFamily: "Georgia, serif",
          fontSize: 16,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 20,
          fontWeight: "normal",
        }}
      >
        ✦ {title}
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(card)}
            style={{ cursor: "pointer" }}
          >
            <CardFace card={card} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <CardModal card={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

export default function DrawnByFateGuide() {
  const [activeTab, setActiveTab] = useState<"major" | "wands" | "cups" | "swords" | "pentacles">("major");

  const suits = ["wands", "cups", "swords", "pentacles"] as const;
  const tabs = [
    { key: "major" as const, label: "Arcanes Majeures" },
    ...suits.map((s) => ({ key: s, label: SUIT_LABELS[s] })),
  ];

  const minorBySuit = (suit: typeof suits[number]) =>
    MINOR_ARCANA.filter((c) => c.suit === suit);

  return (
    <FateLayout>
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "20px 24px 80px" }}>
        <FateTitle subtitle="Découvre chaque carte et sa signification">
          Guide des Cartes
        </FateTitle>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            margin: "24px 0 36px",
          }}
        >
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                background: activeTab === key ? "#8B0000" : "transparent",
                border: `1px solid ${activeTab === key ? "#CC0000" : "#CC000033"}`,
                borderRadius: 4,
                color: activeTab === key ? "#F0EAE0" : "#8B0000",
                fontFamily: "Georgia, serif",
                fontSize: 12,
                letterSpacing: 1.5,
                padding: "8px 16px",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s",
                boxShadow: activeTab === key ? "0 0 10px #CC000033" : "none",
              }}
              onMouseEnter={(e) => activeTab !== key && ((e.currentTarget as HTMLElement).style.color = "#CC0000")}
              onMouseLeave={(e) => activeTab !== key && ((e.currentTarget as HTMLElement).style.color = "#8B0000")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "major" ? (
              <CardGrid cards={MAJOR_ARCANA} title="Les 22 Arcanes Majeures" />
            ) : (
              <CardGrid cards={minorBySuit(activeTab)} title={`Les ${SUIT_LABELS[activeTab]}`} />
            )}
          </motion.div>
        </AnimatePresence>

        <p style={{ textAlign: "center", color: "#3a2020", fontSize: 12, fontStyle: "italic" }}>
          Clique sur une carte pour découvrir sa signification complète
        </p>
      </div>
    </FateLayout>
  );
}
