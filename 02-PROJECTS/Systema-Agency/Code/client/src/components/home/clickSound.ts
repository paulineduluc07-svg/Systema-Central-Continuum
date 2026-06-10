// clickSound.ts — le petit « bip » Y2K joué sur les clics de la page Home.

export function playClickSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(800, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.1);
  } catch {
    // pas de son disponible — tant pis, on reste silencieux
  }
}
