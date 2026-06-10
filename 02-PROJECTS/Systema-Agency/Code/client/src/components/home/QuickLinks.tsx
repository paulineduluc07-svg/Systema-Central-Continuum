// QuickLinks.tsx — la fenêtre rétro « raccourcis agence » : liens externes
// (Claude, Gemini, Google…) qui s'ouvrent dans un nouvel onglet.

import { ChevronRight } from "lucide-react";
import { playClickSound } from "./clickSound";

type Shortcut = {
  id: string;
  label: string;
  emoji: string;
  url: string;
};

const SHORTCUTS: Shortcut[] = [
  { id: "claude", label: "Claude", emoji: "🤖", url: "https://claude.ai" },
  { id: "gemini", label: "Gemini", emoji: "✨", url: "https://gemini.google.com" },
  { id: "notebooklm", label: "NotebookLM", emoji: "📚", url: "https://notebooklm.google" },
  { id: "drive", label: "Mon Drive", emoji: "📁", url: "https://drive.google.com" },
  { id: "gmail", label: "Gmail", emoji: "✉️", url: "https://mail.google.com" },
  { id: "youtube", label: "YouTube", emoji: "📺", url: "https://youtube.com" },
  { id: "keep", label: "Google Keep", emoji: "📝", url: "https://keep.google.com" },
  { id: "tarot", label: "Tarot", emoji: "🔮", url: "https://www.evatarot.net" },
  { id: "google", label: "Google", emoji: "🌐", url: "https://google.com" },
];

export function QuickLinks() {
  const open = (shortcut: Shortcut) => {
    playClickSound();
    window.open(shortcut.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="retro-window w-full rounded-sm p-1">
      {/* Barre de titre de la fenêtre */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#b3c5f4] to-[#dfb2f4] px-2 py-1.5 font-mono text-xs font-semibold text-gray-800 select-none">
        <span className="flex items-center gap-1">
          <span className="text-[10px]">📁</span> raccourcis agence
        </span>
        <div className="flex gap-1">
          <div className="flex h-3.5 w-3.5 items-center justify-center border border-gray-400 bg-white text-[8px] font-bold select-none">_</div>
          <div className="flex h-3.5 w-3.5 items-center justify-center border border-gray-400 bg-white text-[8px] font-bold select-none">□</div>
          <div className="flex h-3.5 w-3.5 items-center justify-center border border-gray-400 bg-red-100 text-[9px] font-bold select-none">×</div>
        </div>
      </div>

      {/* La liste de liens */}
      <div className="bg-white p-1">
        <div className="flex flex-col gap-0.5">
          {SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut.id}
              onClick={() => open(shortcut)}
              className="group flex w-full cursor-pointer items-center justify-between rounded-sm bg-white px-2.5 py-1.5 text-left text-gray-700 transition-all select-none hover:bg-pink-50 hover:text-[#e85d97]"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm drop-shadow-sm transition-transform duration-100 select-none group-hover:scale-110">
                  {shortcut.emoji}
                </span>
                <span className="font-mono text-[11px] font-medium tracking-wide">{shortcut.label}</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#e85d97]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
