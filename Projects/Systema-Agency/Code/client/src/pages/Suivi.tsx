// client/src/pages/Suivi.tsx
// Suivi de prise — version simplifiée
// Préserve le design original exact (Pacifico, inline styles, gradients)

import { useState } from "react";
import { motion } from "framer-motion";

// ── Constantes ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "suivi_paw_v1";

const DOSES = [30, 40, 50, 60] as const;
type Dose = (typeof DOSES)[number];

interface Category {
  id: string;
  label: string;
  color: string;
  bg: string;
  light: string;
  subs: string[];
}

const CATS: Category[] = [
  {
    id: "energie",
    label: "Énergie & Motivation",
    color: "#FF8E53",
    bg: "#FFF3EE",
    light: "#FFF8F4",
    subs: [
      "Boost pour commencer ma journée",
      "Boost pour commencer mes tâches",
      "Maintenir mon élan",
      "Faire plus / faire mieux",
      "Motivation pour aller travailler",
      "Boost pour performer au travail",
      "Contrer la fatigue du shift",
      "Boost pour finir ma journée",
    ],
  },
  {
    id: "courage",
    label: "Courage & Évitement",
    color: "#C77DFF",
    bg: "#F5EEFF",
    light: "#FAF5FF",
    subs: [
      "Faire un appel difficile",
      "Affronter une tâche que je repousse",
      "Sortir de la procrastination",
      "Gérer une confrontation",
      "Boost de confiance",
    ],
  },
  {
    id: "brouillard",
    label: "Brouillard & Détresse",
    color: "#778DA9",
    bg: "#EEF1F5",
    light: "#F5F7FA",
    subs: [
      "Tentative de sortir du brouillard mental",
      "Tentative de sortir d'une montée d'anxiété",
      "Tentative de sortir d'une anxiété installée",
      "Tentative de sortir d'une montée de tristesse",
      "Tentative de sortir d'une tristesse installée",
    ],
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface SuiviEntry {
  id: number;
  timestamp: string;
  date: string;
  prise: string;
  dose: Dose;
  reasons: string[];
  note: string;
}

type Screen = "home" | "log" | "history" | "insights";

// ── Utilitaires ───────────────────────────────────────────────────────────────

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString("fr-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function isToday(ts: string): boolean {
  return fmtDate(ts) === fmtDate(new Date().toISOString());
}

function nowTime(): string {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function nowDate(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

function loadEntries(): SuiviEntry[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? (JSON.parse(s) as SuiviEntry[]) : [];
  } catch {
    return [];
  }
}

// ── Sous-composants ───────────────────────────────────────────────────────────

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: "#CCC",
        fontSize: 22,
        cursor: "pointer",
        marginBottom: 22,
        display: "block",
        padding: 0,
      }}
    >
      ←
    </button>
  );
}

function Dots({ cur, tot }: { cur: number; tot: number }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 26 }}>
      {Array.from({ length: tot }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 6,
            width: i + 1 === cur ? 22 : 6,
            borderRadius: 50,
            background: i + 1 === cur ? "#FF8E53" : "#E5E5E5",
            transition: "all .25s",
          }}
        />
      ))}
    </div>
  );
}

function Btn({
  onClick,
  disabled = false,
  children,
  grad = "linear-gradient(135deg,#FF6B6B,#FF8E53)",
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  grad?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "19px",
        borderRadius: 50,
        background: disabled ? "#EBEBEB" : grad,
        border: "none",
        color: disabled ? "#CCC" : "#fff",
        fontSize: 16,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        marginTop: 8,
        fontFamily: "sans-serif",
      }}
    >
      {children}
    </button>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

export function SuiviPage() {
  const [entries, setEntries] = useState<SuiviEntry[]>(loadEntries);
  const [screen, setScreen] = useState<Screen>("home");
  const [step, setStep] = useState(1);
  const [dose, setDose] = useState<Dose | null>(null);
  const [time, setTime] = useState(nowTime);
  const [date, setDate] = useState(nowDate);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [showData, setShowData] = useState(false);
  const [importTxt, setImportTxt] = useState("");

  function save(arr: SuiviEntry[]) {
    setEntries(arr);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {
      // localStorage peut être plein ou désactivé
    }
  }

  function reset() {
    setStep(1);
    setDose(null);
    setOpenCat(null);
    setReasons([]);
    setNote("");
    setTime(nowTime());
    setDate(nowDate());
  }

  function toggleR(catId: string, sub: string) {
    const k = `${catId}||${sub}`;
    setReasons((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  }

  function submit() {
    if (!dose) return;
    save([
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date,
        prise: time,
        dose,
        reasons,
        note,
      },
      ...entries,
    ]);
    setStep(4);
  }

  function exportData() {
    return JSON.stringify(entries, null, 2);
  }

  function importData() {
    try {
      const arr = JSON.parse(importTxt) as SuiviEntry[];
      if (Array.isArray(arr)) {
        save(arr);
        setShowData(false);
        setImportTxt("");
        alert(`Importé ! ${arr.length} entrées.`);
      }
    } catch {
      alert("Format invalide.");
    }
  }

  function ins() {
    if (!entries.length) return null;
    const rc: Record<string, number> = {};
    entries.forEach((e) => e.reasons?.forEach((r) => (rc[r] = (rc[r] || 0) + 1)));
    const top = Object.entries(rc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const avg = entries.reduce((a, e) => a + (e.dose || 0), 0) / entries.length;
    return { top, avg };
  }

  const PG: React.CSSProperties = { minHeight: "100vh", padding: "50px 20px 48px" };

  // ── Modal données ─────────────────────────────────────────────────────────

  if (showData)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ ...PG, background: "#F8F5F2" }}
      >
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <Back
            onClick={() => {
              setShowData(false);
              setImportTxt("");
            }}
          />
          <h2
            className="font-calligraphic"
            style={{ fontSize: 26, color: "#1a1a2e", margin: "0 0 6px" }}
          >
            Données
          </h2>
          <p style={{ color: "#888", fontSize: 14, margin: "0 0 24px" }}>
            Copie tes données pour les sauvegarder, ou colle-les pour restaurer.
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#BBB",
              textTransform: "uppercase",
              letterSpacing: 1,
              margin: "0 0 8px",
            }}
          >
            Exporter
          </p>
          <textarea
            readOnly
            value={exportData()}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            style={{
              width: "100%",
              height: 120,
              borderRadius: 14,
              border: "2px solid #E5E5E5",
              padding: "12px",
              fontSize: 12,
              resize: "none",
              background: "#fff",
              color: "#555",
              lineHeight: 1.5,
              marginBottom: 20,
              fontFamily: "sans-serif",
            }}
          />
          <button
            onClick={() => {
              try {
                navigator.clipboard.writeText(exportData());
                alert("Copié !");
              } catch {
                alert("Sélectionne le texte manuellement.");
              }
            }}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 50,
              background: "linear-gradient(135deg,#FF6B6B,#FF8E53)",
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            Copier tout
          </button>
          <p
            style={{
              fontSize: 12,
              color: "#BBB",
              textTransform: "uppercase",
              letterSpacing: 1,
              margin: "0 0 8px",
            }}
          >
            Importer (restaurer)
          </p>
          <textarea
            value={importTxt}
            onChange={(e) => setImportTxt(e.target.value)}
            placeholder="Colle tes données ici..."
            style={{
              width: "100%",
              height: 100,
              borderRadius: 14,
              border: "2px solid #E5E5E5",
              padding: "12px",
              fontSize: 12,
              resize: "none",
              background: "#fff",
              color: "#333",
              lineHeight: 1.5,
              marginBottom: 8,
              fontFamily: "sans-serif",
            }}
          />
          <Btn
            onClick={importData}
            disabled={!importTxt}
            grad="linear-gradient(135deg,#457B9D,#2D6A4F)"
          >
            Restaurer
          </Btn>
          <p
            style={{ fontSize: 12, color: "#E63946", margin: "12px 0 0", textAlign: "center" }}
          >
            ⚠️ Restaurer remplace toutes tes entrées actuelles
          </p>
        </div>
      </motion.div>
    );

  // ── Home ──────────────────────────────────────────────────────────────────

  if (screen === "home") {
    const today = entries.filter((e) => isToday(e.timestamp));
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg,#FFECD2 0%,#FCB69F 42%,#E8C5E5 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "58px 20px 40px",
        }}
      >
        <div style={{ maxWidth: 400, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                background: "rgba(255,255,255,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#FF6B6B,#FCB69F)",
                }}
              />
            </div>
            <h1
              className="font-calligraphic"
              style={{ fontSize: 40, color: "#1a1a2e", margin: 0 }}
            >
              Suivi
            </h1>
            <p style={{ color: "#9a7a6a", marginTop: 7, fontSize: 14 }}>
              Comprendre les besoins derrière la prise
            </p>
          </div>

          {today.length > 0 && (
            <div
              style={{
                background: "rgba(255,255,255,0.6)",
                borderRadius: 20,
                padding: "14px 18px",
                marginBottom: 14,
              }}
            >
              <p
                style={{
                  margin: "0 0 7px",
                  fontSize: 11,
                  color: "#BBB",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Aujourd'hui
              </p>
              {today.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>
                    {e.dose}mg{" "}
                    <span style={{ fontWeight: 400, color: "#999" }}>à {e.prise}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <button
              onClick={() => {
                reset();
                setScreen("log");
              }}
              style={{
                padding: "22px",
                borderRadius: 22,
                background: "linear-gradient(135deg,#FF6B6B,#FF8E53)",
                border: "none",
                color: "#fff",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 28px rgba(255,107,107,0.28)",
              }}
            >
              Enregistrer une prise
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
              <button
                onClick={() => setScreen("history")}
                style={{
                  padding: "16px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.65)",
                  border: "none",
                  color: "#555",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Historique
              </button>
              <button
                onClick={() => setScreen("insights")}
                style={{
                  padding: "16px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.65)",
                  border: "none",
                  color: "#555",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Patterns
              </button>
            </div>
            <button
              onClick={() => setShowData(true)}
              style={{
                padding: "13px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.4)",
                border: "none",
                color: "#AA8",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              💾 Sauvegarder / Restaurer données
            </button>
          </div>
          <p
            style={{ textAlign: "center", color: "#BBA", fontSize: 12, marginTop: 20 }}
          >
            {entries.length} entrée{entries.length !== 1 ? "s" : ""}
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Log ───────────────────────────────────────────────────────────────────

  if (screen === "log") {
    // Étape 1 — Dose + Date + Heure
    if (step === 1)
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ ...PG, background: "linear-gradient(160deg,#FFECD2,#FCB69F)" }}
        >
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <Back onClick={() => setScreen("home")} />
            <Dots cur={1} tot={3} />
            <h2
              className="font-calligraphic"
              style={{ fontSize: 30, color: "#1a1a2e", margin: "0 0 6px" }}
            >
              Quelle dose ?
            </h2>
            <p style={{ color: "#BB9980", fontSize: 14, margin: "0 0 24px" }}>
              Date et heure de prise
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 13,
                marginBottom: 20,
              }}
            >
              {DOSES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDose(d)}
                  style={{
                    padding: "28px 10px",
                    borderRadius: 22,
                    border: `2.5px solid ${dose === d ? "#FF6B6B" : "#E5DDD5"}`,
                    background: dose === d ? "#FF6B6B" : "#fff",
                    color: dose === d ? "#fff" : "#666",
                    fontSize: 22,
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                >
                  {d}
                  <span style={{ fontSize: 13, fontWeight: 400 }}> mg</span>
                </button>
              ))}
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.6)",
                borderRadius: 18,
                padding: "15px 18px",
                marginBottom: 12,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  color: "#BBB",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  border: "none",
                  background: "transparent",
                  width: "100%",
                  outline: "none",
                }}
              />
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.6)",
                borderRadius: 18,
                padding: "15px 18px",
                marginBottom: 20,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  color: "#BBB",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  display: "block",
                  marginBottom: 5,
                }}
              >
                Heure de prise
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  border: "none",
                  background: "transparent",
                  width: "100%",
                  outline: "none",
                }}
              />
            </div>
            <Btn onClick={() => setStep(2)} disabled={!dose}>
              Continuer →
            </Btn>
          </div>
        </motion.div>
      );

    // Étape 2 — Raisons
    if (step === 2)
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ ...PG, background: "#FAF8F5" }}
        >
          <div style={{ maxWidth: 440, margin: "0 auto" }}>
            <Back onClick={() => setStep(1)} />
            <Dots cur={2} tot={3} />
            <h2
              className="font-calligraphic"
              style={{ fontSize: 27, color: "#1a1a2e", margin: "0 0 6px" }}
            >
              Qu'est-ce qui amène cette prise ?
            </h2>
            <p style={{ color: "#BBB", fontSize: 14, margin: "0 0 20px" }}>
              Ouvre une catégorie, coche ce qui résonne
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
              {CATS.map((cat) => {
                const isOpen = openCat === cat.id;
                const cnt = reasons.filter((r) => r.startsWith(cat.id + "||")).length;
                return (
                  <div
                    key={cat.id}
                    style={{
                      borderRadius: 18,
                      overflow: "hidden",
                      border: `2px solid ${isOpen ? cat.color : "#EDEAE6"}`,
                      background: isOpen ? cat.light : "#fff",
                      transition: "border-color .2s",
                    }}
                  >
                    <button
                      onClick={() => setOpenCat(isOpen ? null : cat.id)}
                      style={{
                        width: "100%",
                        padding: "15px 17px",
                        background: "none",
                        border: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            background: cat.color,
                          }}
                        />
                        <span
                          style={{ fontSize: 15, fontWeight: 700, color: cat.color }}
                        >
                          {cat.label}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {cnt > 0 && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#fff",
                              background: cat.color,
                              borderRadius: 50,
                              padding: "2px 8px",
                            }}
                          >
                            {cnt}
                          </span>
                        )}
                        <span
                          style={{
                            color: "#CCC",
                            fontSize: 17,
                            display: "inline-block",
                            transform: isOpen ? "rotate(90deg)" : "rotate(0)",
                            transition: ".2s",
                          }}
                        >
                          ›
                        </span>
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "2px 17px 13px" }}>
                        {cat.subs.map((sub, i) => {
                          const k = `${cat.id}||${sub}`;
                          const on = reasons.includes(k);
                          return (
                            <button
                              key={sub}
                              onClick={() => toggleR(cat.id, sub)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 11,
                                width: "100%",
                                padding: "11px 0",
                                background: "none",
                                border: "none",
                                borderBottom:
                                  i < cat.subs.length - 1 ? "1px solid #F0ECE8" : "none",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                            >
                              <div
                                style={{
                                  width: 17,
                                  height: 17,
                                  borderRadius: 5,
                                  border: `2px solid ${on ? cat.color : "#D8D3CE"}`,
                                  background: on ? cat.color : "transparent",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {on && (
                                  <div
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      background: "#fff",
                                    }}
                                  />
                                )}
                              </div>
                              <span
                                style={{
                                  fontSize: 14,
                                  color: on ? cat.color : "#666",
                                  fontWeight: on ? 600 : 400,
                                }}
                              >
                                {sub}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Btn onClick={() => setStep(3)}>
              {reasons.length > 0 ? `Continuer (${reasons.length}) →` : "Passer →"}
            </Btn>
          </div>
        </motion.div>
      );

    // Étape 3 — Note
    if (step === 3)
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ ...PG, background: "linear-gradient(160deg,#F0F4FF,#E8EEFF)" }}
        >
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <Back onClick={() => setStep(2)} />
            <Dots cur={3} tot={3} />
            <h2
              className="font-calligraphic"
              style={{ fontSize: 27, color: "#1a1a2e", margin: "0 0 6px" }}
            >
              Une note ?
            </h2>
            <p style={{ color: "#BBB", fontSize: 14, margin: "0 0 16px" }}>
              Contexte, pression du moment — optionnel
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: journée chargée au resto, conflit, Alessandro difficile ce matin…"
              style={{
                width: "100%",
                height: 120,
                borderRadius: 18,
                border: "2px solid #E5E5E5",
                padding: "14px",
                fontSize: 14,
                resize: "none",
                lineHeight: 1.65,
                outline: "none",
                background: "#fff",
                color: "#333",
                fontFamily: "sans-serif",
              }}
            />
            <div
              style={{
                background: "rgba(255,255,255,0.88)",
                borderRadius: 18,
                padding: "13px 16px",
                marginTop: 12,
                marginBottom: 6,
              }}
            >
              <p
                style={{
                  margin: "0 0 3px",
                  fontSize: 11,
                  color: "#BBB",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Résumé
              </p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#333" }}>
                {dose}mg · {date} à {time}
                {reasons.length > 0 && ` · ${reasons.length} raison${reasons.length > 1 ? "s" : ""}`}
              </p>
            </div>
            <Btn onClick={submit} grad="linear-gradient(135deg,#457B9D,#2D6A4F)">
              Enregistrer ✓
            </Btn>
          </div>
        </motion.div>
      );

    // Étape 4 — Confirmation
    if (step === 4)
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg,#FFECD2,#FCB69F 42%,#E8C5E5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 22,
                background: "rgba(255,255,255,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 22px",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#FF6B6B,#E8C5E5)",
                }}
              />
            </div>
            <h2
              className="font-calligraphic"
              style={{ fontSize: 32, color: "#1a1a2e", margin: "0 0 10px" }}
            >
              Enregistré
            </h2>
            <p
              style={{
                color: "#9a7a6a",
                fontSize: 15,
                maxWidth: 260,
                margin: "0 auto 34px",
                lineHeight: 1.6,
              }}
            >
              Ta prise a été enregistrée.
            </p>
            <button
              onClick={() => setScreen("home")}
              style={{
                padding: "17px 44px",
                borderRadius: 50,
                background: "linear-gradient(135deg,#FF6B6B,#FF8E53)",
                border: "none",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Retour
            </button>
          </div>
        </motion.div>
      );
  }

  // ── Historique ────────────────────────────────────────────────────────────

  if (screen === "history")
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ ...PG, background: "#F8F5F2" }}
      >
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Back onClick={() => setScreen("home")} />
            <h2
              className="font-calligraphic"
              style={{ margin: 0, fontSize: 26, color: "#1a1a2e" }}
            >
              Historique
            </h2>
          </div>
          {entries.length === 0 ? (
            <p style={{ color: "#CCC", textAlign: "center", marginTop: 60 }}>
              Aucune entrée pour l'instant
            </p>
          ) : (
            entries.map((e) => {
              const eR = (e.reasons || [])
                .map((r) => {
                  const [cid, sub] = r.split("||");
                  const cat = CATS.find((c) => c.id === cid);
                  return cat ? { sub, color: cat.color, bg: cat.bg } : null;
                })
                .filter((x): x is { sub: string; color: string; bg: string } => x !== null);
              return (
                <div
                  key={e.id}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "16px 18px",
                    marginBottom: 11,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 21, fontWeight: 800, color: "#FF6B6B" }}>
                        {e.dose}mg
                      </span>
                      <span style={{ fontSize: 14, color: "#BBB", marginLeft: 7 }}>
                        à {e.prise}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: "#CCC" }}>
                      {e.date ? e.date : fmtDate(e.timestamp)}
                    </span>
                  </div>
                  {eR.length > 0 && (
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}
                    >
                      {eR.slice(0, 4).map((r, i) => (
                        <span
                          key={i}
                          style={{
                            padding: "4px 11px",
                            borderRadius: 50,
                            background: r.bg,
                            color: r.color,
                            fontSize: 12,
                          }}
                        >
                          {r.sub}
                        </span>
                      ))}
                      {eR.length > 4 && (
                        <span
                          style={{
                            padding: "4px 11px",
                            borderRadius: 50,
                            background: "#F5F5F5",
                            color: "#AAA",
                            fontSize: 12,
                          }}
                        >
                          +{eR.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                  {e.note && (
                    <p style={{ margin: "7px 0 0", fontSize: 13, color: "#888", fontStyle: "italic" }}>
                      "{e.note}"
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    );

  // ── Patterns / Insights ───────────────────────────────────────────────────

  if (screen === "insights") {
    const data = ins();
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ ...PG, background: "linear-gradient(160deg,#F5EEFF,#EEF4F8)" }}
      >
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Back onClick={() => setScreen("home")} />
            <h2
              className="font-calligraphic"
              style={{ margin: 0, fontSize: 26, color: "#1a1a2e" }}
            >
              Patterns
            </h2>
          </div>
          {!data ? (
            <p style={{ color: "#CCC", textAlign: "center", marginTop: 60 }}>
              Pas encore assez de données.
            </p>
          ) : (
            <>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 22,
                  padding: 20,
                  marginBottom: 12,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 3px",
                    fontSize: 11,
                    color: "#CCC",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Raisons les plus fréquentes
                </p>
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#C77DFF" }}>
                  Ce qui amène vraiment la prise
                </p>
                {data.top.map(([key, count]) => {
                  const [cid, sub] = key.split("||");
                  const cat = CATS.find((c) => c.id === cid);
                  if (!cat) return null;
                  return (
                    <div
                      key={key}
                      style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: cat.color,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, color: "#333", fontWeight: 600 }}>
                          {sub}
                        </p>
                        <p style={{ margin: "1px 0 3px", fontSize: 11, color: cat.color }}>
                          {cat.label}
                        </p>
                        <div
                          style={{
                            height: 5,
                            background: "#F0F0F0",
                            borderRadius: 50,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background: cat.color,
                              width: `${(count / entries.length) * 100}%`,
                              borderRadius: 50,
                            }}
                          />
                        </div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#CCC" }}>
                        {count}x
                      </span>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 11,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 18,
                    textAlign: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#FF6B6B" }}>
                    {data.avg.toFixed(0)}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#BBB" }}>mg moyen</p>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 18,
                    textAlign: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#4ECDC4" }}>
                    {entries.length}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#BBB" }}>
                    entrées total
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  return null;
}
