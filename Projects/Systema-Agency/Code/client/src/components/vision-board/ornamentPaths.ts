/**
 * SVG path data for ornamental decorations.
 * Used by OrnamentalFrame to draw the glamour-style borders.
 */

// Small heart shape — used at corners
export const HEART_PATH =
  "M12,21.35 L10.55,20.03 C5.4,15.36 2,12.27 2,8.5 C2,5.41 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.08 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.41 22,8.5 C22,12.27 18.6,15.36 13.45,20.03 L12,21.35 Z";

// Arabesque vine swirl — corner ornament (top-left orientation)
export const VINE_SWIRL_TL =
  "M5,45 C5,30 15,20 25,15 C30,13 28,8 22,10 C16,12 18,20 25,18 C32,16 35,10 30,5 Q25,0 15,5 C5,10 0,25 5,45";

// Mirror for top-right
export const VINE_SWIRL_TR =
  "M-5,45 C-5,30 -15,20 -25,15 C-30,13 -28,8 -22,10 C-16,12 -18,20 -25,18 C-32,16 -35,10 -30,5 Q-25,0 -15,5 C-5,10 0,25 -5,45";

// Small 5-petal flower
export const FLOWER_PATH =
  "M0,-6 C2,-6 3,-3 0,0 C-3,-3 -2,-6 0,-6 M0,-6 C1,-7 4,-5 2,-2 C0,-4 -1,-7 0,-6 M2,-2 C5,-2 5,2 2,2 C4,0 5,-2 2,-2 M2,2 C3,5 0,6 -2,2 C1,4 3,5 2,2 M-2,2 C-5,2 -5,-2 -2,-2 C-4,0 -5,2 -2,2";

// Small dot positions — returns array of {x, y, size} for each corner
export function getCornerDots(width: number, height: number, padding: number = 12) {
  return [
    // top edge dots
    { x: width * 0.25, y: padding - 2, size: 2.5 },
    { x: width * 0.5, y: padding - 4, size: 3 },
    { x: width * 0.75, y: padding - 2, size: 2.5 },
    // bottom edge dots
    { x: width * 0.25, y: height - padding + 2, size: 2.5 },
    { x: width * 0.5, y: height - padding + 4, size: 3 },
    { x: width * 0.75, y: height - padding + 2, size: 2.5 },
    // side dots
    { x: padding - 2, y: height * 0.5, size: 2.5 },
    { x: width - padding + 2, y: height * 0.5, size: 2.5 },
  ];
}

// Curved connector line between two points
export function getCurvedConnector(
  x1: number, y1: number,
  x2: number, y2: number,
  curvature: number = 0.3
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * curvature;
  const cy = my + dx * curvature;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}
