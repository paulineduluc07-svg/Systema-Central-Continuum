import { Link } from "wouter";
import { motion } from "framer-motion";

function Star({ x, y, size = 20, filled = false, delay = 0 }: {
  x: number | string; y: number; size?: number; filled?: boolean; delay?: number;
}) {
  return (
    <motion.svg
      style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      initial={{ opacity: 0.3, scale: 0.9 }}
      animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 3 + delay, repeat: Infinity, delay }}
    >
      <polygon
        points="12,2 14.4,9.2 22,9.2 16,13.8 18.4,21 12,16.4 5.6,21 8,13.8 2,9.2 9.6,9.2"
        fill={filled ? "#CC0000" : "none"}
        stroke="#CC0000"
        strokeWidth="1.5"
      />
    </motion.svg>
  );
}

function FateNav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(10,0,0,0.92)",
        borderBottom: "1px solid #CC000040",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
      }}
    >
      <Link href="/">
        <span style={{ color: "#CC0000", fontFamily: "serif", fontSize: 18, fontWeight: "bold", letterSpacing: 2, cursor: "pointer" }}>
          DRAWN BY FATE
        </span>
      </Link>
      <div style={{ display: "flex", gap: 24 }}>
        {[
          { href: "/", label: "Oracle" },
          { href: "/mon-tirage", label: "Mon Tirage" },
          { href: "/book", label: "Le Livre" },
          { href: "/guide", label: "Les Cartes" },
        ].map(({ href, label }) => (
          <Link key={href} href={href}>
            <span
              style={{
                color: "#CC000099",
                fontFamily: "serif",
                fontSize: 13,
                letterSpacing: 1.5,
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#CC0000")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#CC000099")}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function FateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#F0EAE0",
        fontFamily: "Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FateNav />
      <Star x={40} y={80} size={14} delay={0} />
      <Star x={120} y={200} size={10} filled delay={0.5} />
      <Star x={85} y={350} size={12} delay={1} />
      <Star x={-5} y={450} size={16} filled delay={1.5} />
      <Star x={55} y={580} size={10} delay={2} />
      <Star x="calc(100vw - 60px)" y={100} size={14} delay={0.3} />
      <Star x="calc(100vw - 40px)" y={280} size={10} filled delay={0.8} />
      <Star x="calc(100vw - 80px)" y={420} size={18} delay={1.2} />
      <Star x="calc(100vw - 30px)" y={580} size={12} filled delay={1.8} />
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, #1a000022 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, paddingTop: 64 }}>
        {children}
      </div>
    </div>
  );
}

export function FateTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px 20px" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", display: "inline-block" }}
      >
        <motion.span
          style={{ position: "absolute", left: -40, top: -10, fontSize: 22, color: "#CC0000" }}
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ✦
        </motion.span>
        <motion.span
          style={{ position: "absolute", right: -40, top: -10, fontSize: 22, color: "#CC0000" }}
          animate={{ rotate: [0, -15, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        >
          ✦
        </motion.span>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: "bold",
            color: "#CC0000",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 0 20px #CC000066, 0 0 40px #CC000033",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {children}
        </h1>
      </motion.div>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            color: "#8B0000",
            fontStyle: "italic",
            fontSize: 14,
            letterSpacing: "0.1em",
            marginTop: 8,
          }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, #CC0000, transparent)",
          maxWidth: 400,
          margin: "16px auto 0",
        }}
      />
    </div>
  );
}

export function FateDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #CC000044)" }} />
      <span style={{ color: "#CC0000", fontSize: 14 }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #CC000044, transparent)" }} />
    </div>
  );
}
