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
import { QuickLinks } from "@/components/home/QuickLinks";
import { Tamagotchi } from "@/components/home/Tamagotchi";
import { useSyncedTasks } from "@/hooks/useSyncedData";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Heart, Monitor } from "lucide-react";
import { useState } from "react";

// Le post-it jaune « priorités célestes » — branché aux tâches synchronisées
// (onglet dédié "home-priorites" : marche connecté comme en local).
function PostItPriorites() {
  const { tasks, toggleTask, addTask } = useSyncedTasks("home-priorites");
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
          <label
            key={task.id}
            className="flex cursor-pointer items-center gap-2.5 text-xs font-semibold text-yellow-900/90 hover:text-black"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                playClickSound();
                void toggleTask(task.id);
              }}
              className="accent-[#e85d97]"
            />
            <span className={task.completed ? "line-through opacity-50" : ""}>{task.title}</span>
          </label>
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

// La fenêtre Windows 95 « new message! » (déco interactive).
function NewMessageWindow() {
  const [showMessage, setShowMessage] = useState(true);

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
              <div className="space-y-1">
                <p className="font-mono text-xs font-bold tracking-wide text-gray-800 uppercase">system notification :</p>
                <p className="font-mono text-xs font-extrabold text-[#e85d97]">(1) new message received</p>
                <p className="home-serif mt-2 text-xs leading-relaxed text-gray-500 italic">
                  Le sanctuaire de l'esprit est ouvert. Préparez-vous à recevoir la guidance du jour...
                </p>
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

          {/* COLONNE CENTRE : l'oracle « clarté & esthétique » */}
          <main className="flex w-full flex-col lg:col-span-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="relative overflow-hidden rounded-none border-[6px] border-black bg-white p-10 shadow-[6px_6px_0px_#FFB7C5] transition-all duration-300">
                <div className="absolute top-2 right-4 animate-pulse text-lg text-pink-400 select-none">✨</div>
                <div className="absolute bottom-6 left-2 rotate-12 text-sm text-rose-300 select-none">🦋</div>

                <div className="mb-8 text-center">
                  <h2 className="home-bubble text-3xl leading-none font-bold tracking-tight text-black lowercase md:text-4xl">
                    clarté & esthétique
                  </h2>
                </div>

                <div className="mx-auto max-w-2xl space-y-6">
                  <p className="home-serif text-justify text-sm leading-relaxed text-gray-800 italic md:text-base">
                    Dans la quête infinie de l'harmonie, chaque détail trouve sa raison d'être. Même dans un récit
                    poétique ou un texte long, on utilise des{" "}
                    <span className="border-b-2 border-[#FFB7C5] pb-0.5 font-extrabold text-black not-italic">lettrines</span>{" "}
                    ornementées pour guider le regard, offrant une respiration visuelle au milieu du tumulte numérique.
                  </p>
                  <p className="home-serif text-justify text-sm leading-relaxed text-gray-800 italic md:text-base">
                    C'est un havre pour l'esprit fatigué des écrans, qui se retrouve parfois réduit à l'état de veille
                    critique avec seulement un faible{" "}
                    <span className="rounded-sm bg-[#FFB7C5]/30 px-1.5 py-0.5 font-black text-[#FF69B4] not-italic">(1% physique)</span>{" "}
                    d'énergie disponible. Face à cette limite, la pureté du design et la sobriété des espaces vides
                    redonnent vie à l'imagination, créant un sanctuaire intemporel habillé de pastel et de poésie.
                  </p>
                </div>

                <div className="mt-12 border-t border-gray-100 pt-6 text-center select-none">
                  <span className="home-pixel animate-pulse text-xs tracking-widest text-[#FF69B4] uppercase md:text-sm">
                    ⋆ COSMIC FREQUENCY ⋆
                  </span>
                </div>
              </div>
            </motion.div>
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

        {/* BANDEAU MÉTRIQUE DU BAS */}
        <div className="mt-12 space-y-6">
          <div className="flex flex-col items-center justify-around gap-6 border-[3px] border-black bg-gradient-to-r from-[#ffe5ec] via-[#f0f4ff] to-[#e8fff5] p-4 shadow-[4px_4px_0px_#000000] md:flex-row md:p-6">
            <div className="flex items-center gap-3.5 text-left">
              <div className="flex items-center justify-center rounded-sm border-2 border-black bg-white p-2 shadow-[2px_2px_0px_#000]">
                <Monitor className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h4 className="home-bubble text-xs font-extrabold tracking-wider text-black uppercase">fast processing</h4>
                <p className="font-mono text-[9px] tracking-widest text-gray-500 uppercase">cognitive core</p>
              </div>
            </div>
            <div className="hidden h-1.5 w-1.5 rounded-full bg-black md:block" />
            <div className="flex items-center gap-3.5 text-left">
              <div className="flex animate-pulse items-center justify-center rounded-sm border-2 border-black bg-white p-2 shadow-[2px_2px_0px_#000]">
                <Heart className="h-5 w-5 fill-pink-500/20 text-pink-500" />
              </div>
              <div>
                <h4 className="home-bubble text-xs font-extrabold tracking-wider text-black uppercase">cognitive balance</h4>
                <p className="font-mono text-[9px] tracking-widest text-gray-400 uppercase">mindful state</p>
              </div>
            </div>
            <div className="hidden h-1.5 w-1.5 rounded-full bg-black md:block" />
            <div className="flex items-center gap-3.5 text-left">
              <div className="flex items-center justify-center rounded-sm border-2 border-black bg-white p-2 shadow-[2px_2px_0px_#000]">
                <Globe className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="home-bubble text-xs font-extrabold tracking-wider text-black uppercase">secure data</h4>
                <p className="font-mono text-[9px] tracking-widest text-gray-400 uppercase">encyclical storage</p>
              </div>
            </div>
          </div>

          <footer className="pt-4 pb-4 text-center font-mono text-[10px] text-gray-400 select-none">
            <p>© 2006-2026 systema agency • celestial oracle • good vibes only</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
