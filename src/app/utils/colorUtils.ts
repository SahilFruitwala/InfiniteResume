/**
 * Parses a hex color string to RGB components.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6 && cleaned.length !== 3) return null;

  const fullHex =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;

  const num = parseInt(fullHex, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates the relative luminance of a color per WCAG 2.0.
 * Returns a value between 0 (darkest) and 1 (lightest).
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Checks if a hex color is too dark for use on a dark background.
 * Returns true if the color's luminance is below the threshold,
 * meaning it would have poor contrast on a dark background.
 */
export function isColorTooDarkForDarkBg(
  hex: string,
  threshold = 0.15
): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true; // If we can't parse, assume it's too dark
  return relativeLuminance(rgb.r, rgb.g, rgb.b) < threshold;
}
