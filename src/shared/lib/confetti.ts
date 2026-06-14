import confetti from 'canvas-confetti';

// Brand palette — mirrors the accent tokens in index.css (lavender ladder +
// success green) so the celebration reads as part of the app, not a stock burst.
const COLORS = ['#5e6ad2', '#828fff', '#27a644', '#ffffff'];

/** Two diagonal "party popper" cannons firing inward from the bottom corners.
 * One-shot, ~1.5s. No-ops when the user prefers reduced motion. */
export function fireOwnedCelebration() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const end = Date.now() + 1500;

  const frame = () => {
    // Bottom-left cannon, angled up-right.
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      startVelocity: 55,
      origin: { x: 0, y: 1 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    // Bottom-right cannon, angled up-left.
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      startVelocity: 55,
      origin: { x: 1, y: 1 },
      colors: COLORS,
      disableForReducedMotion: true,
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  };

  frame();
}
