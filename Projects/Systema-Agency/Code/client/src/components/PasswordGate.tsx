import { useState, type ReactNode } from "react";

const STORAGE_KEY = "systema_auth_ok";
const PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? "systema2026";

interface PasswordGateProps {
  children: ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "1"
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (unlocked) return <>{children}</>;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #1a0533 100%)",
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* Stars background */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              background: "#fff",
              borderRadius: "50%",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.4 + Math.random() * 0.6,
            }}
          />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          padding: "48px 40px",
          background: "rgba(255,255,255,0.07)",
          border: "2px solid rgba(255,255,255,0.15)",
          borderRadius: "24px",
          boxShadow: "0 0 60px rgba(168,85,247,0.3), inset 0 0 30px rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          minWidth: "320px",
          animation: shake ? "shake 0.4s ease" : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>

        {/* Avatar */}
        <div style={{ fontSize: "56px", animation: "float 4s ease-in-out infinite" }}>
          🔮
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, margin: 0 }}>
            Systema Agency
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "6px 0 0" }}>
            Entre ton mot de passe pour continuer
          </p>
        </div>

        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          placeholder="••••••••"
          autoFocus
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "12px",
            border: `2px solid ${error ? "#ff6b9d" : "rgba(168,85,247,0.4)"}`,
            background: "rgba(0,0,0,0.3)",
            color: "#fff",
            fontSize: "18px",
            textAlign: "center",
            letterSpacing: "4px",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />

        {error && (
          <p style={{ color: "#ff6b9d", fontSize: "13px", margin: "-12px 0 0" }}>
            Mot de passe incorrect ✕
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
            transform: "translateY(0)",
            transition: "transform 0.1s, box-shadow 0.1s",
            fontFamily: "inherit",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(3px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 0 rgba(0,0,0,0.3)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 0 rgba(0,0,0,0.3)";
          }}
        >
          Entrer ✨
        </button>
      </form>
    </div>
  );
}
