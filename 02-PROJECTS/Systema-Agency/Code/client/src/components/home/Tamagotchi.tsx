// Tamagotchi.tsx — le petit compagnon pixel de la page Home (pur jouet déco).
// Ses stats baissent doucement avec le temps ; on peut le nourrir, jouer, dormir.

import { useEffect, useState } from "react";

type PetState = "idle" | "eating" | "sleeping" | "happy" | "sad";

export function Tamagotchi() {
  const [hunger, setHunger] = useState(60);
  const [happiness, setHappiness] = useState(80);
  const [energy, setEnergy] = useState(70);
  const [petState, setPetState] = useState<PetState>("idle");
  const [text, setText] = useState("welcome babe! thanks 4 stopping by! xoxo");
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Les stats déclinent lentement pour rendre le pet vivant.
  useEffect(() => {
    const timer = setInterval(() => {
      setHunger((h) => Math.max(0, h - 3));
      setHappiness((ha) => Math.max(0, ha - 2));
      setEnergy((e) => (petState === "sleeping" ? Math.min(100, e + 12) : Math.max(0, e - 1)));
    }, 10000);
    return () => clearInterval(timer);
  }, [petState]);

  useEffect(() => {
    if (hunger < 30) {
      setText("im starving!! feed me a pixel candy please! 🍧");
      setPetState("sad");
    } else if (happiness < 30) {
      setText("im bored.. play some music or stroke my head! ⋆");
      setPetState("sad");
    } else if (energy < 20) {
      setText("so sleepy zzz... let me take a quick nap ☁");
      setPetState("sleeping");
    }
  }, [hunger, happiness, energy]);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // silencieux
    }
  };

  const feedPet = () => {
    setPetState("eating");
    setHunger((h) => Math.min(100, h + 25));
    setHappiness((ha) => Math.min(100, ha + 5));
    setText("yumm! that glitter cookie was delicious! 🍪");
    playBeep();
    setTimeout(() => setPetState("idle"), 3000);
  };

  const playWithPet = () => {
    if (energy < 15) {
      setText("too tired to play, need sleep... ๑ zzz");
      return;
    }
    setPetState("happy");
    setHappiness((ha) => Math.min(100, ha + 30));
    setEnergy((e) => Math.max(0, e - 15));
    setText("wheee! ur the best bff ever! ★★★");
    playBeep();
    setTimeout(() => setPetState("idle"), 3000);
  };

  const toggleSleep = () => {
    if (petState === "sleeping") {
      setPetState("idle");
      setText("good morning bright star! ☼ lets hang out");
    } else {
      setPetState("sleeping");
      setText("shhh... sleeping sweet dreams ☄ zZz");
    }
    playBeep();
  };

  // Le rendu SVG du pet selon son humeur.
  const renderPet = () => {
    switch (petState) {
      case "eating":
        return (
          <svg viewBox="0 0 100 100" className="h-20 w-20 animate-bounce">
            <circle cx="50" cy="55" r="22" fill="#3f3f3f" />
            <rect x="36" y="15" width="8" height="25" rx="3" fill="#3f3f3f" />
            <rect x="56" y="15" width="8" height="25" rx="3" fill="#3f3f3f" />
            <rect x="42" y="48" width="4" height="4" fill="#a8ffb2" />
            <rect x="54" y="48" width="4" height="4" fill="#a8ffb2" />
            <path d="M 46 56 Q 50 58 54 56" stroke="#a8ffb2" strokeWidth="2" fill="none" />
            <circle cx="28" cy="65" r="6" fill="#3f3f3f" />
            <circle cx="28" cy="65" r="4" fill="#a8ffb2" />
          </svg>
        );
      case "sleeping":
        return (
          <svg viewBox="0 0 100 100" className="h-20 w-20 opacity-80">
            <circle cx="50" cy="58" r="22" fill="#1f1f1f" />
            <rect x="33" y="40" width="8" height="22" rx="3" fill="#1f1f1f" transform="rotate(-30, 33, 40)" />
            <rect x="59" y="40" width="8" height="22" rx="3" fill="#1f1f1f" transform="rotate(30, 59, 40)" />
            <line x1="40" y1="58" x2="46" y2="58" stroke="#a8ffb2" strokeWidth="2" />
            <line x1="54" y1="58" x2="60" y2="58" stroke="#a8ffb2" strokeWidth="2" />
            <text x="68" y="32" className="home-pixel animate-pulse fill-[#a8ffb2] text-[10px]">zZZ</text>
          </svg>
        );
      case "happy":
        return (
          <svg viewBox="0 0 100 100" className="h-20 w-20 scale-110 animate-pulse">
            <circle cx="50" cy="45" r="24" fill="#3f3f3f" />
            <rect x="34" y="5" width="8" height="25" rx="3" fill="#3f3f3f" />
            <rect x="58" y="5" width="8" height="25" rx="3" fill="#3f3f3f" />
            <rect x="35" y="46" width="4" height="4" fill="#ff7da7" />
            <rect x="61" y="46" width="4" height="4" fill="#ff7da7" />
            <path d="M 40 43 L 44 39 L 48 43" stroke="#a8ffb2" strokeWidth="2.5" fill="none" />
            <path d="M 52 43 L 56 39 L 60 43" stroke="#a8ffb2" strokeWidth="2.5" fill="none" />
            <path d="M 46 52 Q 50 56 54 52" stroke="#a8ffb2" strokeWidth="2.5" fill="none" />
          </svg>
        );
      case "sad":
        return (
          <svg viewBox="0 0 100 100" className="h-20 w-20">
            <circle cx="50" cy="55" r="22" fill="#555555" />
            <rect x="36" y="20" width="8" height="23" rx="3" fill="#555555" />
            <rect x="56" y="20" width="8" height="23" rx="3" fill="#555555" />
            <circle cx="38" cy="62" r="3" fill="#a8ffb2" className="animate-bounce" />
            <line x1="41" y1="50" x2="45" y2="54" stroke="#a8ffb2" strokeWidth="2" />
            <line x1="45" y1="50" x2="41" y2="54" stroke="#a8ffb2" strokeWidth="2" />
            <line x1="55" y1="50" x2="59" y2="54" stroke="#a8ffb2" strokeWidth="2" />
            <line x1="59" y1="50" x2="55" y2="54" stroke="#a8ffb2" strokeWidth="2" />
            <path d="M 46 62 Q 50 58 54 62" stroke="#a8ffb2" strokeWidth="2" fill="none" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className="h-20 w-20">
            <circle cx="50" cy="55" r="22" fill="#3f3f3f" />
            <rect x="36" y="15" width="8" height="25" rx="3" fill="#3f3f3f" />
            <rect x="56" y="15" width="8" height="25" rx="3" fill="#3f3f3f" />
            <rect x="42" y="48" width="4" height="4" fill="#a8ffb2" />
            <rect x="54" y="48" width="4" height="4" fill="#a8ffb2" />
            <rect x="49" y="54" width="2" height="2" fill="#a8ffb2" />
            <path d="M 47 56 Q 50 58 53 56" stroke="#a8ffb2" strokeWidth="1.5" fill="none" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Bulle de dialogue */}
      <div className="relative mb-3 max-w-[190px] rounded-lg border-2 border-black bg-white p-2 text-center font-mono text-xs leading-tight shadow-sm">
        <span className="text-gray-800">{text}</span>
        <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-black"></div>
        <div className="absolute -bottom-1.5 left-1/2 h-0 w-0 -translate-x-1/2 border-x-6 border-t-6 border-x-transparent border-t-white"></div>
      </div>

      {/* Le corps en œuf */}
      <div className="relative z-10 flex h-52 w-44 flex-col items-center justify-between rounded-[50%_50%_45%_45%] border-4 border-black bg-gradient-to-b from-[#fca5cb] to-[#e85d97] p-5 shadow-[inset_0_-8px_15px_rgba(0,0,0,0.3),_0_8px_0_rgba(0,0,0,0.15)]">
        <div className="absolute top-4 left-6 h-4 w-8 rotate-[-25deg] rounded-full bg-white/45"></div>
        <div className="absolute -top-6 -z-10 flex h-10 w-10 items-center justify-center rounded-full border-[5px] border-gray-400">
          <div className="h-6 w-6 rounded-full border-[3px] border-dashed border-gray-500"></div>
        </div>
        <div className="absolute top-1/2 right-1 animate-pulse text-[10px]">🌸</div>
        <div className="absolute top-[40%] left-1 rotate-12 text-[9px]">⭐</div>

        {/* Écran LCD */}
        <div className="scanlines relative flex h-24 w-32 flex-col justify-between overflow-hidden rounded-lg border-4 border-[#3a2233] bg-[#1e1e1e] p-2 shadow-inner">
          <div className="home-pixel flex items-center justify-between border-b border-[#a8ffb2]/20 pb-1 text-[8px] text-[#a8ffb2] opacity-90">
            <span>🍭H:{hunger}%</span>
            <span>💖P:{happiness}%</span>
            <span>⚡E:{energy}%</span>
          </div>
          <div className="flex flex-1 items-center justify-center py-1">{renderPet()}</div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="home-pixel absolute right-1 bottom-1 cursor-pointer text-[7px] text-[#a8ffb2] uppercase opacity-70 transition-all hover:opacity-100"
          >
            {soundEnabled ? "🔔 sound" : "🔕 mute"}
          </button>
        </div>

        {/* Les 3 boutons classiques */}
        <div className="flex w-28 justify-between px-1 pb-1">
          <div className="flex flex-col items-center">
            <button
              onClick={feedPet}
              className="h-7 w-7 cursor-pointer rounded-full border-2 border-black bg-yellow-300 shadow-[0_3px_0_#9d7010] transition-all active:translate-y-[2px] active:bg-yellow-400 active:shadow-none"
              title="Donner un cookie pixel"
            ></button>
            <span className="home-pixel mt-1 w-full text-center text-[7.5px] font-semibold text-black uppercase">Feed</span>
          </div>
          <div className="flex -translate-y-1 flex-col items-center">
            <button
              onClick={playWithPet}
              className="h-7 w-7 cursor-pointer rounded-full border-2 border-black bg-blue-300 shadow-[0_3px_0_#1f3caa] transition-all active:translate-y-[2px] active:bg-blue-400 active:shadow-none"
              title="Jouer"
            ></button>
            <span className="home-pixel mt-1 w-full text-center text-[7.5px] font-semibold text-black uppercase">Play</span>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={toggleSleep}
              className="h-7 w-7 cursor-pointer rounded-full border-2 border-black bg-purple-300 shadow-[0_3px_0_#7a21aa] transition-all active:translate-y-[2px] active:bg-purple-400 active:shadow-none"
              title="Dodo / réveil"
            ></button>
            <span className="home-pixel mt-1 w-full text-center text-[7.5px] font-semibold text-black uppercase">Nap</span>
          </div>
        </div>
      </div>
    </div>
  );
}
