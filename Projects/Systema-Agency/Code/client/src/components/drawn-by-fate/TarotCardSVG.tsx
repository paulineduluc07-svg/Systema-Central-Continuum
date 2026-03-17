import { motion } from "framer-motion";
import type { TarotCard } from "@/data/tarotCards";

// ────────────────────────────────────────────────
// Card back design
// ────────────────────────────────────────────────
export function CardBack({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: { w: 80, h: 130 }, md: { w: 120, h: 196 }, lg: { w: 160, h: 260 } };
  const { w, h } = dims[size];
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 120 196"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="120" height="196" rx="8" fill="#0D0D0D" />
      <rect x="4" y="4" width="112" height="188" rx="6" stroke="#8B0000" strokeWidth="2" fill="none" />
      <rect x="8" y="8" width="104" height="180" rx="4" stroke="#CC0000" strokeWidth="0.5" fill="none" />
      {/* Central pentagram star */}
      <g transform="translate(60,98)">
        <polygon
          points="0,-38 8.9,-27.5 21.6,-27.5 12.7,-19 15.9,-6.6 7,-13.6 -1.9,-6.6 1.3,-19 -7.6,-27.5 5.1,-27.5"
          fill="none"
          stroke="#CC0000"
          strokeWidth="1.5"
        />
        {/* Outer star lines */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={Math.sin((angle * Math.PI) / 180) * 35}
            y2={-Math.cos((angle * Math.PI) / 180) * 35}
            stroke="#CC0000"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        <circle cx="0" cy="0" r="3" fill="#CC0000" />
        <circle cx="0" cy="0" r="20" stroke="#8B0000" strokeWidth="0.5" fill="none" opacity="0.5" />
        <circle cx="0" cy="0" r="38" stroke="#8B0000" strokeWidth="0.5" fill="none" opacity="0.3" />
      </g>
      {/* Corner ornaments */}
      {[
        [14, 14],
        [106, 14],
        [14, 182],
        [106, 182],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4" fill="#CC0000" opacity="0.6" />
          <circle cx={cx} cy={cy} r="7" stroke="#CC0000" strokeWidth="0.5" fill="none" opacity="0.3" />
        </g>
      ))}
      {/* Top/bottom decorative lines */}
      <line x1="20" y1="22" x2="100" y2="22" stroke="#8B0000" strokeWidth="0.5" opacity="0.5" />
      <line x1="20" y1="174" x2="100" y2="174" stroke="#8B0000" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

// ────────────────────────────────────────────────
// Major arcana symbols
// ────────────────────────────────────────────────
function MajorSymbol({ symbol }: { symbol: string }) {
  switch (symbol) {
    case "fool":
      return (
        <g>
          <circle cx="60" cy="70" r="16" stroke="#CC0000" strokeWidth="2" fill="none" />
          <line x1="60" y1="86" x2="60" y2="115" stroke="#CC0000" strokeWidth="2" />
          <line x1="44" y1="98" x2="76" y2="98" stroke="#CC0000" strokeWidth="2" />
          <line x1="60" y1="115" x2="44" y2="130" stroke="#CC0000" strokeWidth="1.5" />
          <line x1="60" y1="115" x2="76" y2="130" stroke="#CC0000" strokeWidth="1.5" />
          <line x1="80" y1="85" x2="95" y2="60" stroke="#CC0000" strokeWidth="1.5" />
          <circle cx="95" cy="57" r="4" fill="#CC0000" />
          <path d="M45 60 Q50 55 55 60 Q50 65 45 60Z" fill="#CC0000" opacity="0.7" />
        </g>
      );
    case "magician":
      return (
        <g>
          <text x="60" y="85" textAnchor="middle" fill="#CC0000" fontSize="28" fontFamily="serif">∞</text>
          <line x1="60" y1="92" x2="60" y2="130" stroke="#CC0000" strokeWidth="2.5" />
          <line x1="48" y1="108" x2="72" y2="108" stroke="#CC0000" strokeWidth="1.5" />
          <circle cx="52" cy="96" r="3" stroke="#CC0000" strokeWidth="1" fill="none" />
          <path d="M64 96 L68 91 L72 96 L68 101Z" stroke="#CC0000" strokeWidth="1" fill="none" />
          <text x="40" y="132" fill="#CC0000" fontSize="9" opacity="0.7">⚙</text>
          <text x="74" y="132" fill="#CC0000" fontSize="9" opacity="0.7">⚡</text>
        </g>
      );
    case "highpriestess":
      return (
        <g>
          <path d="M60 55 Q80 75 80 98 Q80 120 60 130 Q40 120 40 98 Q40 75 60 55Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M45 60 Q60 50 75 60" stroke="#CC0000" strokeWidth="2" fill="none" />
          <circle cx="60" cy="55" r="8" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <line x1="35" y1="95" x2="85" y2="95" stroke="#CC0000" strokeWidth="1" opacity="0.5" />
          <rect x="53" y="100" width="14" height="18" stroke="#CC0000" strokeWidth="1" fill="none" />
          <line x1="60" y1="100" x2="60" y2="118" stroke="#CC0000" strokeWidth="0.5" opacity="0.7" />
        </g>
      );
    case "empress":
      return (
        <g>
          <circle cx="60" cy="78" r="22" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M49 100 L60 88 L71 100" fill="#CC0000" opacity="0.5" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <line
              key={i}
              x1="60"
              y1="78"
              x2={60 + Math.cos((a * Math.PI) / 180) * 30}
              y2={78 + Math.sin((a * Math.PI) / 180) * 30}
              stroke="#CC0000"
              strokeWidth="0.8"
              opacity="0.4"
            />
          ))}
          <path d="M45 115 Q60 110 75 115 Q70 128 60 130 Q50 128 45 115Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        </g>
      );
    case "emperor":
      return (
        <g>
          <path d="M38 58 L60 46 L82 58 L82 68 L60 60 L38 68Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <rect x="42" y="68" width="36" height="52" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <line x1="42" y1="84" x2="78" y2="84" stroke="#CC0000" strokeWidth="0.8" opacity="0.5" />
          <line x1="60" y1="68" x2="60" y2="120" stroke="#CC0000" strokeWidth="0.8" opacity="0.5" />
          <circle cx="60" cy="78" r="5" fill="#CC0000" opacity="0.7" />
        </g>
      );
    case "hierophant":
      return (
        <g>
          <line x1="60" y1="48" x2="60" y2="130" stroke="#CC0000" strokeWidth="2.5" />
          <line x1="44" y1="68" x2="76" y2="68" stroke="#CC0000" strokeWidth="2" />
          <line x1="48" y1="82" x2="72" y2="82" stroke="#CC0000" strokeWidth="1.5" />
          <line x1="50" y1="95" x2="70" y2="95" stroke="#CC0000" strokeWidth="1" />
          <circle cx="60" cy="56" r="8" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M56 52 L64 52 L64 60 L56 60Z" fill="#CC0000" opacity="0.5" />
        </g>
      );
    case "lovers":
      return (
        <g>
          <path d="M60 130 L38 100 Q35 80 48 72 Q60 68 60 80 Q60 68 72 72 Q85 80 82 100Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <circle cx="47" cy="85" r="5" stroke="#CC0000" strokeWidth="1" fill="none" />
          <circle cx="73" cy="85" r="5" stroke="#CC0000" strokeWidth="1" fill="none" />
          <path d="M54 58 Q60 52 66 58 Q60 64 54 58Z" fill="#CC0000" />
          <line x1="60" y1="52" x2="60" y2="46" stroke="#CC0000" strokeWidth="1.5" />
          {[315, 330, 345, 0, 15, 30, 45].map((a, i) => (
            <line
              key={i}
              x1={60 + Math.cos((a * Math.PI) / 180) * 8}
              y1={46 + Math.sin((a * Math.PI) / 180) * 8}
              x2={60 + Math.cos((a * Math.PI) / 180) * 14}
              y2={46 + Math.sin((a * Math.PI) / 180) * 14}
              stroke="#CC0000"
              strokeWidth="1"
            />
          ))}
        </g>
      );
    case "chariot":
      return (
        <g>
          <rect x="38" y="78" width="44" height="38" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M38 78 L60 60 L82 78" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <circle cx="46" cy="116" r="8" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <circle cx="74" cy="116" r="8" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <line x1="46" y1="108" x2="46" y2="85" stroke="#CC0000" strokeWidth="1" opacity="0.6" />
          <line x1="74" y1="108" x2="74" y2="85" stroke="#CC0000" strokeWidth="1" opacity="0.6" />
          <circle cx="60" cy="69" r="6" fill="#CC0000" opacity="0.6" />
        </g>
      );
    case "strength":
      return (
        <g>
          <path d="M38 100 Q35 80 50 72 Q65 65 75 75 Q85 85 80 100 Q75 115 60 120 Q45 115 38 100Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <text x="60" y="78" textAnchor="middle" fill="#CC0000" fontSize="18" fontFamily="serif">∞</text>
          <path d="M48 90 Q60 82 72 90" stroke="#CC0000" strokeWidth="2" fill="none" />
          <path d="M48 102 Q60 110 72 102" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        </g>
      );
    case "hermit":
      return (
        <g>
          <line x1="55" y1="48" x2="55" y2="128" stroke="#CC0000" strokeWidth="2.5" />
          <line x1="55" y1="128" x2="43" y2="135" stroke="#CC0000" strokeWidth="2" />
          <path d="M58 55 L72 62 L72 78 L58 85 L44 78 L44 62Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <circle cx="65" cy="70" r="5" fill="#CC0000" opacity="0.8" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <line
              key={i}
              x1={65 + Math.cos((a * Math.PI) / 180) * 5}
              y1={70 + Math.sin((a * Math.PI) / 180) * 5}
              x2={65 + Math.cos((a * Math.PI) / 180) * 11}
              y2={70 + Math.sin((a * Math.PI) / 180) * 11}
              stroke="#CC0000"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="50" cy="65" r="11" stroke="#CC0000" strokeWidth="1" fill="none" opacity="0.4" />
        </g>
      );
    case "wheel":
      return (
        <g>
          <circle cx="60" cy="90" r="35" stroke="#CC0000" strokeWidth="2" fill="none" />
          <circle cx="60" cy="90" r="22" stroke="#CC0000" strokeWidth="1" fill="none" opacity="0.6" />
          <circle cx="60" cy="90" r="8" stroke="#CC0000" strokeWidth="1" fill="none" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <line
              key={i}
              x1={60 + Math.cos((a * Math.PI) / 180) * 8}
              y1={90 + Math.sin((a * Math.PI) / 180) * 8}
              x2={60 + Math.cos((a * Math.PI) / 180) * 22}
              y2={90 + Math.sin((a * Math.PI) / 180) * 22}
              stroke="#CC0000"
              strokeWidth="1.2"
            />
          ))}
          <circle cx="60" cy="90" r="3" fill="#CC0000" />
        </g>
      );
    case "justice":
      return (
        <g>
          <line x1="60" y1="48" x2="60" y2="132" stroke="#CC0000" strokeWidth="2" />
          <line x1="42" y1="85" x2="78" y2="85" stroke="#CC0000" strokeWidth="2" />
          <path d="M42 85 L35 110 Q42 118 50 110 Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M78 85 L85 110 Q78 118 70 110 Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M56 60 L64 60 L64 82 L56 82Z" fill="#CC0000" opacity="0.5" />
          <path d="M56 60 L54 48 L66 48 L64 60" stroke="#CC0000" strokeWidth="1" fill="none" />
        </g>
      );
    case "hangedman":
      return (
        <g>
          <line x1="35" y1="58" x2="85" y2="58" stroke="#CC0000" strokeWidth="2.5" />
          <line x1="35" y1="48" x2="35" y2="58" stroke="#CC0000" strokeWidth="2" />
          <line x1="85" y1="48" x2="85" y2="58" stroke="#CC0000" strokeWidth="2" />
          <line x1="60" y1="58" x2="60" y2="78" stroke="#CC0000" strokeWidth="1.5" />
          <circle cx="60" cy="85" r="8" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <line x1="60" y1="93" x2="50" y2="115" stroke="#CC0000" strokeWidth="1.5" />
          <line x1="60" y1="93" x2="70" y2="115" stroke="#CC0000" strokeWidth="1.5" />
          <line x1="52" y1="100" x2="65" y2="95" stroke="#CC0000" strokeWidth="1.2" />
          {[0, 45, 90, 135].map((a, i) => (
            <line
              key={i}
              x1={60 + Math.cos((a * Math.PI) / 180) * 16}
              y1={85 + Math.sin((a * Math.PI) / 180) * 16}
              x2={60 + Math.cos((a * Math.PI) / 180) * 22}
              y2={85 + Math.sin((a * Math.PI) / 180) * 22}
              stroke="#CC0000"
              strokeWidth="1"
              opacity="0.6"
            />
          ))}
        </g>
      );
    case "death":
      return (
        <g>
          <path d="M55 48 Q60 42 65 48 L80 105 Q75 112 70 108 L60 90 L50 108 Q45 112 40 105Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M38 120 Q60 112 82 120" stroke="#CC0000" strokeWidth="2" fill="none" />
          <path d="M45 125 Q48 115 55 118 Q50 130 45 125Z" fill="#CC0000" opacity="0.7" />
          <path d="M65 118 Q72 115 75 125 Q70 130 65 118Z" fill="#CC0000" opacity="0.7" />
          <circle cx="60" cy="62" r="10" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <line x1="54" y1="56" x2="66" y2="68" stroke="#CC0000" strokeWidth="1" opacity="0.5" />
          <line x1="66" y1="56" x2="54" y2="68" stroke="#CC0000" strokeWidth="1" opacity="0.5" />
        </g>
      );
    case "temperance":
      return (
        <g>
          <path d="M40 78 L40 115 Q40 122 46 122 Q52 122 52 115 L52 82" stroke="#CC0000" strokeWidth="2" fill="none" />
          <path d="M68 82 L68 115 Q68 122 74 122 Q80 122 80 115 L80 78" stroke="#CC0000" strokeWidth="2" fill="none" />
          <path d="M52 82 Q60 75 68 82" stroke="#CC0000" strokeWidth="2" fill="none" />
          <path d="M46 92 Q54 88 62 96 Q70 102 78 98" stroke="#CC0000" strokeWidth="1.5" fill="none" strokeDasharray="3,2" />
          <circle cx="60" cy="62" r="12" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          {[270, 330, 30, 90, 150, 210].map((a, i) => (
            <line
              key={i}
              x1={60 + Math.cos((a * Math.PI) / 180) * 12}
              y1={62 + Math.sin((a * Math.PI) / 180) * 12}
              x2={60 + Math.cos((a * Math.PI) / 180) * 18}
              y2={62 + Math.sin((a * Math.PI) / 180) * 18}
              stroke="#CC0000"
              strokeWidth="1"
            />
          ))}
        </g>
      );
    case "devil":
      return (
        <g>
          <path d="M38 95 Q38 68 60 62 Q82 68 82 95 Q82 122 60 130 Q38 122 38 95Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M48 62 L42 48 M72 62 L78 48" stroke="#CC0000" strokeWidth="2" />
          <path d="M42 48 L56 58 M78 48 L64 58" stroke="#CC0000" strokeWidth="1.5" />
          <circle cx="60" cy="88" r="12" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <line x1="54" y1="82" x2="66" y2="94" stroke="#CC0000" strokeWidth="1" />
          <line x1="66" y1="82" x2="54" y2="94" stroke="#CC0000" strokeWidth="1" />
          <line x1="60" y1="100" x2="50" y2="115" stroke="#CC0000" strokeWidth="1.5" opacity="0.6" />
          <line x1="60" y1="100" x2="70" y2="115" stroke="#CC0000" strokeWidth="1.5" opacity="0.6" />
        </g>
      );
    case "tower":
      return (
        <g>
          <rect x="46" y="72" width="28" height="52" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M46 72 L52 58 L60 62 L68 58 L74 72" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M38 55 Q60 45 85 65" stroke="#FFD700" strokeWidth="2.5" opacity="0.8" />
          <path d="M82 62 L78 75 L70 70Z" fill="#FFD700" opacity="0.7" />
          <circle cx="47" cy="95" r="3" fill="#CC0000" opacity="0.5" />
          <circle cx="73" cy="95" r="3" fill="#CC0000" opacity="0.5" />
          <circle cx="35" cy="68" r="4" fill="#CC0000" opacity="0.6" />
          <circle cx="88" cy="80" r="3" fill="#CC0000" opacity="0.6" />
        </g>
      );
    case "star":
      return (
        <g>
          <polygon
            points="60,48 63.8,59.6 76,59.6 66.1,66.6 69.9,78.2 60,71.2 50.1,78.2 53.9,66.6 44,59.6 56.2,59.6"
            stroke="#CC0000"
            strokeWidth="1.5"
            fill="none"
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <circle
              key={i}
              cx={60 + Math.cos((a * Math.PI) / 180) * 32}
              cy={90 + Math.sin((a * Math.PI) / 180) * 32}
              r="2"
              fill="#CC0000"
              opacity="0.5"
            />
          ))}
          <path d="M46 102 Q60 95 74 102" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M40 112 Q60 105 80 112" stroke="#CC0000" strokeWidth="1.2" fill="none" opacity="0.7" />
          <path d="M36 122 Q60 115 84 122" stroke="#CC0000" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="60" cy="90" r="5" fill="#CC0000" opacity="0.8" />
        </g>
      );
    case "moon":
      return (
        <g>
          <path d="M60 52 Q78 60 78 78 Q78 96 60 102 Q68 90 68 78 Q68 64 60 52Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="76" r="22" stroke="#CC0000" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M38 120 Q50 108 55 112 Q58 118 55 125" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M82 120 Q70 108 65 112 Q62 118 65 125" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M42 130 L78 130" stroke="#CC0000" strokeWidth="2" />
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((a, i) => (
            <line
              key={i}
              x1={60 + Math.cos((a * Math.PI) / 180) * 22}
              y1={76 + Math.sin((a * Math.PI) / 180) * 22}
              x2={60 + Math.cos((a * Math.PI) / 180) * 28}
              y2={76 + Math.sin((a * Math.PI) / 180) * 28}
              stroke="#CC0000"
              strokeWidth="0.8"
              opacity="0.4"
            />
          ))}
        </g>
      );
    case "sun":
      return (
        <g>
          <circle cx="60" cy="78" r="24" stroke="#CC0000" strokeWidth="2" fill="none" />
          <circle cx="60" cy="78" r="16" stroke="#CC0000" strokeWidth="1" fill="none" opacity="0.5" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
            <line
              key={i}
              x1={60 + Math.cos((a * Math.PI) / 180) * 26}
              y1={78 + Math.sin((a * Math.PI) / 180) * 26}
              x2={60 + Math.cos((a * Math.PI) / 180) * 36}
              y2={78 + Math.sin((a * Math.PI) / 180) * 36}
              stroke="#CC0000"
              strokeWidth={i % 2 === 0 ? 2 : 1}
            />
          ))}
          <circle cx="60" cy="78" r="8" fill="#CC0000" opacity="0.8" />
          <path d="M48 112 Q60 105 72 112 Q68 128 60 130 Q52 128 48 112Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        </g>
      );
    case "judgement":
      return (
        <g>
          <path d="M60 48 L60 68" stroke="#CC0000" strokeWidth="2" />
          <path d="M42 68 Q42 56 52 54 Q58 52 60 56 Q62 52 68 54 Q78 56 78 68 L78 88 L42 88Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M60 68 L60 90" stroke="#CC0000" strokeWidth="1.5" opacity="0.6" />
          <path d="M44 95 Q60 88 76 95 Q72 110 60 115 Q48 110 44 95Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M36 120 Q60 112 84 120" stroke="#CC0000" strokeWidth="2" fill="none" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <line
              key={i}
              x1={60 + Math.cos((a * Math.PI) / 180) * 6}
              y1={48 + Math.sin((a * Math.PI) / 180) * 6}
              x2={60 + Math.cos((a * Math.PI) / 180) * 14}
              y2={48 + Math.sin((a * Math.PI) / 180) * 14}
              stroke="#CC0000"
              strokeWidth="1.2"
            />
          ))}
        </g>
      );
    case "world":
      return (
        <g>
          <ellipse cx="60" cy="90" rx="28" ry="40" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="90" r="12" stroke="#CC0000" strokeWidth="1.5" fill="none" />
          <path d="M60 78 Q68 84 60 90 Q52 96 60 102" stroke="#CC0000" strokeWidth="2" fill="none" />
          {[0, 90, 180, 270].map((a, i) => (
            <circle
              key={i}
              cx={60 + Math.cos((a * Math.PI) / 180) * 35}
              cy={90 + Math.sin((a * Math.PI) / 180) * 46}
              r="5"
              stroke="#CC0000"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
          ))}
          <ellipse cx="60" cy="90" rx="40" ry="52" stroke="#CC0000" strokeWidth="0.5" fill="none" opacity="0.3" />
        </g>
      );
    default:
      return <circle cx="60" cy="90" r="28" stroke="#CC0000" strokeWidth="1.5" fill="none" />;
  }
}

// ────────────────────────────────────────────────
// Minor arcana symbols
// ────────────────────────────────────────────────
function MinorSymbol({ suit, number }: { suit: string; number: number }) {
  const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "Page", "Knight", "Queen", "King"];
  const label = roman[number] || "";

  const suitPath = {
    wands: (
      <g>
        <line x1="60" y1="55" x2="60" y2="115" stroke="#CC0000" strokeWidth="3" />
        <path d="M52 65 Q60 58 68 65" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        <path d="M50 82 Q60 74 70 82" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        <path d="M52 98 Q60 90 68 98" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        <circle cx="60" cy="52" r="5" fill="#CC0000" opacity="0.8" />
      </g>
    ),
    cups: (
      <g>
        <path d="M42 78 L42 112 Q42 122 60 122 Q78 122 78 112 L78 78 Q60 88 42 78Z" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        <path d="M42 78 Q60 68 78 78" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        <line x1="60" y1="122" x2="60" y2="130" stroke="#CC0000" strokeWidth="2" />
        <line x1="45" y1="130" x2="75" y2="130" stroke="#CC0000" strokeWidth="2" />
        <path d="M54 95 Q60 90 66 95" stroke="#CC0000" strokeWidth="1" fill="none" opacity="0.6" />
      </g>
    ),
    swords: (
      <g>
        <line x1="60" y1="46" x2="60" y2="120" stroke="#CC0000" strokeWidth="2.5" />
        <line x1="42" y1="86" x2="78" y2="86" stroke="#CC0000" strokeWidth="2" />
        <polygon points="60,46 54,58 66,58" fill="#CC0000" opacity="0.8" />
        <path d="M44 118 L52 110 L60 120 L68 110 L76 118" stroke="#CC0000" strokeWidth="1.5" fill="none" />
      </g>
    ),
    pentacles: (
      <g>
        <circle cx="60" cy="88" r="28" stroke="#CC0000" strokeWidth="1.5" fill="none" />
        <polygon
          points="60,62 65.8,79.8 84.6,79.8 70.4,90.8 75.2,108.6 60,97.6 44.8,108.6 49.6,90.8 35.4,79.8 54.2,79.8"
          stroke="#CC0000"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="60" cy="88" r="10" stroke="#CC0000" strokeWidth="0.8" fill="none" opacity="0.4" />
      </g>
    ),
  };

  return (
    <g>
      {suitPath[suit as keyof typeof suitPath] || null}
      <text x="60" y="145" textAnchor="middle" fill="#CC0000" fontSize="11" fontFamily="serif" opacity="0.8">
        {label}
      </text>
    </g>
  );
}

// ────────────────────────────────────────────────
// Full tarot card face
// ────────────────────────────────────────────────
export function CardFace({ card }: { card: TarotCard }) {
  return (
    <svg width="120" height="196" viewBox="0 0 120 196" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="196" rx="8" fill="#0D0D0D" />
      <rect x="4" y="4" width="112" height="188" rx="6" stroke="#CC0000" strokeWidth="2" fill="none" />
      {/* Card name at top */}
      <text x="60" y="22" textAnchor="middle" fill="#CC0000" fontSize="7" fontFamily="serif" letterSpacing="1">
        {card.arcana === "major" ? `${card.number} · ${card.name.toUpperCase()}` : card.name.toUpperCase()}
      </text>
      <line x1="12" y1="26" x2="108" y2="26" stroke="#CC0000" strokeWidth="0.5" opacity="0.4" />
      {/* Symbol area */}
      {card.arcana === "major" ? (
        <MajorSymbol symbol={card.symbol} />
      ) : (
        <MinorSymbol suit={card.suit!} number={card.number} />
      )}
      {/* Bottom line + name */}
      <line x1="12" y1="162" x2="108" y2="162" stroke="#CC0000" strokeWidth="0.5" opacity="0.4" />
      <text x="60" y="175" textAnchor="middle" fill="#CC0000" fontSize="7.5" fontFamily="serif" letterSpacing="0.5">
        {card.nameFr.toUpperCase()}
      </text>
      {/* Corner decorations */}
      {[[14, 14], [106, 14], [14, 182], [106, 182]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#CC0000" opacity="0.4" />
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────
// Flippable card component
// ────────────────────────────────────────────────
export function FlippableCard({
  card,
  isFlipped,
  isSelected,
  isSelectable,
  onClick,
  size = "md",
}: {
  card: TarotCard;
  isFlipped: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: { w: 80, h: 130 }, md: { w: 120, h: 196 }, lg: { w: 160, h: 260 } };
  const { w, h } = dims[size];

  return (
    <div
      style={{ width: w, height: h, perspective: "1000px", cursor: isSelectable ? "pointer" : "default" }}
      onClick={onClick}
    >
      <motion.div
        style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {/* Back face */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div
            style={{
              border: isSelected ? "2px solid #FFD700" : "none",
              borderRadius: 8,
              boxShadow: isSelected ? "0 0 16px #FFD70088" : "none",
              transform: isSelected ? "translateY(-8px)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <CardBack size={size} />
          </div>
        </div>
        {/* Front face */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardFace card={card} />
        </div>
      </motion.div>
    </div>
  );
}
