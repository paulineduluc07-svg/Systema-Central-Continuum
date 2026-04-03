import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FateLayout, FateTitle, FateDivider } from "@/components/FateLayout";
import { SUBJECTS } from "@/data/tarotCards";

export default function Landing() {
  const [, navigate] = useLocation();
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);

  function goToReading(q: string, s: string) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (s) params.set("s", s);
    navigate(`/reading?${params.toString()}`);
  }

  function handleQuestionEnter(e: React.KeyboardEvent) {
    if (e.key === "Enter" && question.trim()) {
      goToReading(question, "");
    }
  }

  function handleSubjectSelect(value: string) {
    setSubject(value);
    setSubjectOpen(false);
    goToReading(question, value);
  }

  function handleSkip() {
    goToReading("", "");
  }

  const selectedSubjectLabel = SUBJECTS.find((s) => s.value === subject)?.label;

  return (
    <FateLayout>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 24px 60px" }}>
        <FateTitle subtitle="Laisse le destin parler à travers les cartes">
          Drawn by Fate
        </FateTitle>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            textAlign: "center",
            color: "#8B6B60",
            fontSize: 14,
            fontStyle: "italic",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "24px auto 36px",
          }}
        >
          Concentre ton esprit sur ce qui t'habite. Pose une question, choisis un sujet,
          ou laisse simplement le destin choisir pour toi.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            background: "#0D0808",
            border: "1px solid #CC000033",
            borderRadius: 8,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <p style={{ color: "#8B0000", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            ✦ Pose ta question (optionnel)
          </p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleQuestionEnter}
            placeholder="Que me réserve l'avenir en amour ?"
            rows={3}
            style={{
              width: "100%",
              background: "#080404",
              border: "1px solid #CC000055",
              borderRadius: 6,
              color: "#F0EAE0",
              fontSize: 15,
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              padding: "12px 14px",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#CC0000")}
            onBlur={(e) => (e.target.style.borderColor = "#CC000055")}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              onClick={() => question.trim() && goToReading(question, "")}
              disabled={!question.trim()}
              style={{
                background: question.trim() ? "#8B0000" : "#2a0000",
                color: question.trim() ? "#F0EAE0" : "#5a3030",
                border: "1px solid #CC000055",
                borderRadius: 4,
                padding: "8px 22px",
                fontFamily: "Georgia, serif",
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: question.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Révéler
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: "center", margin: "4px 0" }}
        >
          <span style={{ color: "#5a3030", fontSize: 13, fontStyle: "italic", letterSpacing: 4 }}>— ou —</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            background: "#0D0808",
            border: "1px solid #CC000033",
            borderRadius: 8,
            padding: 24,
            marginTop: 20,
          }}
        >
          <p style={{ color: "#8B0000", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            ✦ Choisis un sujet (optionnel)
          </p>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setSubjectOpen(!subjectOpen)}
              style={{
                width: "100%",
                background: "#080404",
                border: "1px solid #CC000055",
                borderRadius: 6,
                color: selectedSubjectLabel ? "#F0EAE0" : "#5a3030",
                fontSize: 15,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                padding: "12px 14px",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{selectedSubjectLabel || "Sélectionne un sujet..."}</span>
              <motion.span
                animate={{ rotate: subjectOpen ? 180 : 0 }}
                style={{ color: "#CC0000", fontSize: 12 }}
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {subjectOpen && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.8, originY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.8 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "#0D0808",
                    border: "1px solid #CC000055",
                    borderRadius: 6,
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  {SUBJECTS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSubjectSelect(s.value)}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid #CC000022",
                        color: "#C0A898",
                        fontSize: 14,
                        fontFamily: "Georgia, serif",
                        padding: "11px 16px",
                        textAlign: "left",
                        cursor: "pointer",
                        letterSpacing: 1,
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#1a0000";
                        (e.currentTarget as HTMLElement).style.color = "#F0EAE0";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#C0A898";
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          style={{ textAlign: "center", marginTop: 32 }}
        >
          <FateDivider />
          <button
            onClick={handleSkip}
            style={{
              background: "transparent",
              border: "1px solid #CC000033",
              borderRadius: 4,
              color: "#5a3030",
              fontFamily: "Georgia, serif",
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "8px 28px",
              cursor: "pointer",
              transition: "all 0.2s",
              marginTop: 12,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#CC0000";
              (e.currentTarget as HTMLElement).style.borderColor = "#CC000066";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#5a3030";
              (e.currentTarget as HTMLElement).style.borderColor = "#CC000033";
            }}
          >
            Passer → Laisser le destin choisir
          </button>
          <p style={{ color: "#3a2020", fontSize: 11, marginTop: 8, fontStyle: "italic" }}>
            (Les cartes seront tirées sans question ni sujet)
          </p>
        </motion.div>
      </div>
    </FateLayout>
  );
}
