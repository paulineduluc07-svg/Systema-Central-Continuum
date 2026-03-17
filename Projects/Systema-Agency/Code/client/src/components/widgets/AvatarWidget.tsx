import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Prête pour le service ?",
  "N'oublie pas le briefing de 17h !",
  "Les stocks sont à jour ?",
  "Objectif satisfaction client : 5/5 !",
  "Tu gères comme une cheffe, Paw !",
];

export function AvatarWidget() {
  const [message, setMessage] = useState(MESSAGES[0]);

  // Change message every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setMessage(randomMsg);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[400px] flex items-center justify-center">
      {/* Speech Bubble */}
      <div className="absolute top-10 right-4 z-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-lg border-2 border-pink-200 max-w-[200px]">
          <p className="font-display font-bold text-pink-600 text-sm leading-tight">
            {message}
          </p>
        </div>
      </div>

      {/* Animated Avatar */}
      <div className="relative z-10 w-full h-full flex items-end justify-center">
        <img 
          src="/app-icon.png" 
          alt="Avatar" 
          className="h-full object-contain drop-shadow-2xl animate-breathe"
          style={{ 
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)"
          }}
        />
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 w-64 h-64 bg-pink-400/20 blur-[80px] rounded-full z-0" />
    </div>
  );
}
