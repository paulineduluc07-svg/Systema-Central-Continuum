import { memo } from "react";
import { cn } from "@/lib/utils";
import { HEART_PATH, VINE_SWIRL_TL, VINE_SWIRL_TR, getCornerDots } from "./ornamentPaths";

interface OrnamentalFrameProps {
  children: React.ReactNode;
  title: string;
  color?: string;
  width?: number;
  height?: number;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const OrnamentalFrame = memo(function OrnamentalFrame({
  children,
  title,
  color = "#FF69B4",
  width = 280,
  height = 220,
  isActive = false,
  className,
  onClick,
}: OrnamentalFrameProps) {
  const dots = getCornerDots(width, height);
  const goldColor = "#FFD700";

  return (
    <div
      className={cn(
        "relative cursor-pointer group transition-all duration-500",
        isActive && "animate-shimmer-pink",
        className
      )}
      style={{ width, height }}
      onClick={onClick}
    >
      {/* SVG Ornamental Border */}
      <svg
        className="absolute inset-0 pointer-events-none"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main border frame with rounded corners */}
        <rect
          x="8"
          y="8"
          width={width - 16}
          height={height - 16}
          rx="16"
          ry="16"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Top-left corner ornament */}
        <g transform="translate(4, 4) scale(0.5)" opacity="0.7">
          <path d={VINE_SWIRL_TL} stroke={color} strokeWidth="1.5" fill="none" />
          <g transform="translate(5, 5) scale(0.5)">
            <path d={HEART_PATH} fill={color} opacity="0.8" />
          </g>
        </g>

        {/* Top-right corner ornament */}
        <g transform={`translate(${width - 4}, 4) scale(0.5)`} opacity="0.7">
          <path d={VINE_SWIRL_TR} stroke={color} strokeWidth="1.5" fill="none" />
          <g transform="translate(-5, 5) scale(0.5)">
            <path d={HEART_PATH} fill={color} opacity="0.8" />
          </g>
        </g>

        {/* Bottom-left corner ornament */}
        <g transform={`translate(4, ${height - 4}) scale(0.5, -0.5)`} opacity="0.7">
          <path d={VINE_SWIRL_TL} stroke={color} strokeWidth="1.5" fill="none" />
          <g transform="translate(5, 5) scale(0.5)">
            <path d={HEART_PATH} fill={color} opacity="0.8" />
          </g>
        </g>

        {/* Bottom-right corner ornament */}
        <g transform={`translate(${width - 4}, ${height - 4}) scale(-0.5, -0.5)`} opacity="0.7">
          <path d={VINE_SWIRL_TL} stroke={color} strokeWidth="1.5" fill="none" />
          <g transform="translate(5, 5) scale(0.5)">
            <path d={HEART_PATH} fill={color} opacity="0.8" />
          </g>
        </g>

        {/* Decorative dots along edges */}
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.size}
            fill={i % 2 === 0 ? color : goldColor}
            opacity={0.5}
          />
        ))}

        {/* Small hearts between dots - top */}
        <g transform={`translate(${width * 0.15}, 2) scale(0.3)`} opacity="0.5">
          <path d={HEART_PATH} fill={color} />
        </g>
        <g transform={`translate(${width * 0.85}, 2) scale(0.3)`} opacity="0.5">
          <path d={HEART_PATH} fill={color} />
        </g>

        {/* Small hearts - bottom */}
        <g transform={`translate(${width * 0.15}, ${height - 10}) scale(0.3)`} opacity="0.5">
          <path d={HEART_PATH} fill={color} />
        </g>
        <g transform={`translate(${width * 0.85}, ${height - 10}) scale(0.3)`} opacity="0.5">
          <path d={HEART_PATH} fill={color} />
        </g>

        {/* Side small flowers / stars */}
        <g transform={`translate(2, ${height * 0.3}) scale(0.4)`} opacity="0.4">
          <text fill={color} fontSize="16" textAnchor="middle">✿</text>
        </g>
        <g transform={`translate(${width - 2}, ${height * 0.7}) scale(0.4)`} opacity="0.4">
          <text fill={color} fontSize="16" textAnchor="middle">✿</text>
        </g>
      </svg>

      {/* Title */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <h3
          className={cn(
            "text-xl px-4 whitespace-nowrap transition-all duration-300",
            isActive
              ? "drop-shadow-[0_0_12px_rgba(255,105,180,0.7)] scale-110"
              : "drop-shadow-[0_0_6px_rgba(255,105,180,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(255,105,180,0.5)]"
          )}
          style={{
            fontFamily: "var(--font-calligraphic)",
            color,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Content area */}
      <div className="absolute inset-0 pt-6 px-5 pb-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
});
