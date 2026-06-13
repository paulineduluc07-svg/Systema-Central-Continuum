// Home.tsx — la PAGE D'ACCUEIL « Dollhouse Y2K » de Systema.
// Portée depuis le handoff design_handoff_home_dollhouse (AI Studio).
// MainLayout fournit la navbar commune ; ici on peint le fond rose plein
// écran en annulant son padding haut (-mt-24), puis on dégage la navbar
// avec pt-28 (même recette que le Cosmos).
//
// Données RÉELLES : agenda panorama + objectifs (lib/agendaWeek, partagé avec
// la page Agenda) et post-it « priorités célestes » (tâches synchronisées).
// Pur décor assumé : flip phone, papillons, oracle, music player, tamagotchi.

import "../components/home/home.css";
import { AgendaPanorama } from "@/components/home/AgendaPanorama";
import { playClickSound } from "@/components/home/clickSound";
import { MusicPlayer } from "@/components/home/MusicPlayer";
import { OracleBriefing } from "@/components/home/OracleBriefing";
import { QuickLinks } from "@/components/home/QuickLinks";
import { Tamagotchi } from "@/components/home/Tamagotchi";
import { useSyncedNotes, useSyncedTasks } from "@/hooks/useSyncedData";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// Le post-it jaune « priorités célestes » — branché aux tâches synchronisées
// (onglet dédié "home-priorites" : marche connecté comme en local).
function PostItPriorites() {
  const { tasks, toggleTask, addTask, updateTaskTitle, deleteTask } = useSyncedTasks("home-priorites");
  const [newTask, setNewTask] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTask.trim();
    if (!title) return;
    playClickSound();
    void addTask(title);
    setNewTask("");
  };

  return (
    <div
      className="relative w-full rotate-1 overflow-hidden border-2 border-black bg-[#FEF9C3] p-5 shadow-[4px_4px_0px_#000000] transition-all hover:scale-[1.01]"
      style={{ borderRadius: "2px 2px 30px 2px" }}
    >
      {/* Le coin plié du papier */}
      <div className="absolute right-0 bottom-0 h-6 w-6 translate-x-3 translate-y-3 rotate-[-45deg] border-t-2 border-l-2 border-black bg-[#FEF08A]"></div>

      <div className="mb-3 flex items-center gap-2 border-b border-yellow-700/20 pb-1.5 selection:bg-yellow-200">
        <span className="text-sm">📌</span>
        <span className="home-bubble text-xs font-bold tracking-wide text-yellow-900 uppercase">priorités célestes</span>
      </div>

      <div className="home-cursive space-y-2 select-none">
        {tasks.length === 0 && (
          <p className="text-xs text-yellow-800/60">rien d'urgent — ajoute une priorité ⤵</p>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group/task flex items-center gap-2.5 text-xs font-semibold text-yellow-900/90"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                playClickSound();
                void toggleTask(task.id);
              }}
              title={task.completed ? "Décocher" : "Cocher"}
              className="cursor-pointer accent-[#e85d97]"
            />
            <input
              type="text"
              defaultValue={task.title}
              onBlur={(e) => {
                if (e.target.value.trim() && e.target.value !== task.title) void updateTaskTitle(task.id, e.target.value.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className={`w-full bg-transparent focus:outline-none ${task.completed ? "line-through opacity-50" : ""}`}
            />
            <button
              onClick={() => {
                playClickSound();
                void deleteTask(task.id);
              }}
              title="Supprimer cette priorité"
              className="hidden h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center border border-black bg-red-200 text-[8px] font-black text-black group-hover/task:flex hover:bg-red-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Ajout rapide */}
      <form onSubmit={handleAdd} className="mt-3 flex gap-1 border-t border-yellow-700/20 pt-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="noter qqch..."
          className="home-cursive w-full border-b border-yellow-700/30 bg-transparent px-1 text-xs text-yellow-900 placeholder:text-yellow-800/40 focus:border-yellow-900 focus:outline-none"
        />
        <button type="submit" className="text-xs text-yellow-900/70 hover:text-black" title="Ajouter">
          ＋
        </button>
      </form>
    </div>
  );
}

// La fenêtre « new message! » — le COURRIER de la Home.
// Affiche la note la plus récente du tab « home-courrier » : c'est là qu'un
// agent MCP dépose chaque jour le résumé des courriels importants
// (tool existant create_note avec tabId "home-courrier").
function NewMessageWindow() {
  const { notes } = useSyncedNotes("home-courrier");
  const [showMessage, setShowMessage] = useState(true);

  // La plus récente = l'id le plus grand (les notes s'ajoutent en fin).
  const dernierMessage = notes.length > 0 ? notes.reduce((a, b) => (b.id > a.id ? b : a)) : null;

  const handleOk = () => {
    playClickSound();
    setShowMessage(false);
    setTimeout(() => setShowMessage(true), 60000);
  };

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="retro-window flex min-h-[300px] w-full flex-col justify-between rounded-sm p-1 shadow-md"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-[#e85d97] to-[#dfb2f4] px-2 py-1 text-xs font-semibold text-white select-none">
            <span className="flex items-center gap-1 font-mono tracking-wide">💌 new message!</span>
            <button
              onClick={() => setShowMessage(false)}
              className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center border border-black/40 bg-red-200 text-[9px] font-bold text-black select-none hover:bg-red-300"
            >
              ×
            </button>
          </div>
          <div className="flex flex-grow flex-col justify-between gap-4 bg-white p-4 text-left">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 animate-bounce text-3xl drop-shadow-sm select-none">💖</span>
              <div className="min-w-0 space-y-1">
                <p className="font-mono text-xs font-bold tracking-wide text-gray-800 uppercase">courrier du jour :</p>
                {dernierMessage ? (
                  <>
                    <p className="font-mono text-xs font-extrabold text-[#e85d97]">(1) new message received</p>
                    <p className="mt-2 max-h-44 overflow-y-auto text-xs leading-relaxed whitespace-pre-wrap text-gray-700">
                      {dernierMessage.content}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-mono text-xs font-extrabold text-[#e85d97]">(0) new message</p>
                    <p className="home-serif mt-2 text-xs leading-relaxed text-gray-500 italic">
                      La boîte est vide pour l'instant — ton agent courrier déposera ici le résumé quotidien de tes
                      emails importants...
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={handleOk} className="retro-button cursor-pointer px-5 py-1 font-mono text-xs font-bold uppercase">
                ok
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  return (
    <div className="home-root relative -mt-24 min-h-screen overflow-x-hidden px-4 pt-28 pb-6 selection:bg-pink-300 selection:text-black">
      {/* DÉCOS FLOTTANTES (non bloquantes) */}
      <div className="animate-float-phone pointer-events-none absolute top-[28%] right-[11%] z-30 select-none lg:right-[22%]">
        {/* Le flip phone rose Y2K */}
        <svg viewBox="0 0 100 160" className="h-[134px] w-[84px] drop-shadow-xl md:h-36 md:w-24">
          <rect x="25" y="10" width="50" height="70" rx="10" fill="#ff9ec7" stroke="#000000" strokeWidth="2.5" />
          <rect x="31" y="16" width="38" height="42" rx="4" fill="#000000" stroke="#000000" strokeWidth="1.5" />
          <rect x="33" y="18" width="34" height="38" rx="2" fill="#ff70a6" />
          <text x="50" y="31" fontSize="6.5" fill="#ffffff" fontWeight="bold" textAnchor="middle" fontFamily="monospace">ur cute</text>
          <text x="50" y="44" fontSize="8" fill="#ffffff" textAnchor="middle">✨💖✨</text>
          <circle cx="50" cy="67" r="2.5" fill="#555555" stroke="#000" strokeWidth="1" />
          <rect x="32" y="77" width="36" height="8" rx="2" fill="#e85d97" stroke="#000000" strokeWidth="2" />
          <rect x="23" y="82" width="54" height="68" rx="10" fill="#e85d97" stroke="#000000" strokeWidth="2.5" />
          <rect x="27" y="86" width="46" height="60" rx="6" fill="#ffb7c5" stroke="#000000" strokeWidth="2" />
          <circle cx="50" cy="98" r="7" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
          <circle cx="50" cy="98" r="3" fill="#ff70a6" />
          <rect x="32" y="110" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="46" y="110" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="60" y="110" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="32" y="118" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="46" y="118" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="60" y="118" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="32" y="126" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="46" y="126" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <rect x="60" y="126" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <circle cx="36" cy="138" r="2.5" fill="#ff70a6" stroke="#000" strokeWidth="1" />
          <rect x="46" y="135" width="8" height="5" rx="1" fill="#ffffff" stroke="#000" strokeWidth="1" />
          <circle cx="64" cy="138" r="2.5" fill="#ff70a6" stroke="#000" strokeWidth="1" />
          <path d="M 23 98 Q 15 105 18 115" fill="none" stroke="#000" strokeWidth="1.5" />
          <path d="M 18 115 L 14 121 L 18 123 L 22 119 Z" fill="#ff70a6" stroke="#000" strokeWidth="1" />
        </svg>
      </div>

      <div className="animate-butterfly pointer-events-none absolute top-[4%] right-[25%] text-xl select-none">🦋</div>
      <div className="animate-butterfly-alt pointer-events-none absolute bottom-[20%] left-[8%] text-2xl select-none">🦋</div>
      <div className="animate-sparkle pointer-events-none absolute top-[48%] left-[24%] text-sm select-none">⭐</div>
      <div className="animate-sparkle pointer-events-none absolute right-[20%] bottom-[40%] text-lg select-none">✨</div>
      <div className="pointer-events-none absolute top-[20%] left-[6%] text-pink-400 opacity-60 select-none">💖</div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* L'agenda panorama (vraies données de la semaine) */}
        <AgendaPanorama />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* COLONNE GAUCHE : post-it + raccourcis */}
          <aside className="flex w-full flex-col gap-6 lg:col-span-3">
            <PostItPriorites />
            <QuickLinks />
          </aside>

          {/* COLONNE CENTRE : le briefing du jour (déménagé du Cosmos) */}
          <main className="flex w-full flex-col lg:col-span-6">
            <OracleBriefing />
          </main>

          {/* COLONNE DROITE : new message + music player + tamagotchi */}
          <aside className="flex w-full flex-col gap-6 lg:col-span-3">
            <NewMessageWindow />
            <MusicPlayer />
            <div className="mt-2">
              <Tamagotchi />
            </div>
          </aside>
        </div>

        <footer className="mt-12 pt-4 pb-4 text-center font-mono text-[10px] text-gray-400 select-none">
          <p>© 2006-2026 systema agency • celestial oracle • good vibes only</p>
        </footer>
      </div>
    </div>
  );
}
