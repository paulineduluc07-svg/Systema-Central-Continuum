import { useAuth } from "@/_core/hooks/useAuth";
import { AdminPanel } from "@/components/AdminPanel";
import { GlobalBackupPanel } from "@/components/GlobalBackupPanel";
import { useDataMigration } from "@/hooks/useDataMigration";
import { useSyncedNotes, useSyncedPreferences, useSyncedTasks } from "@/hooks/useSyncedData";
import { cn } from "@/lib/utils";
import {
  Activity,
  Check,
  Cloud,
  CloudOff,
  Loader2,
  LogIn,
  LogOut,
  Moon,
  Plus,
  Settings,
  Sparkles,
  StickyNote,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

type CalendarCell = number | null;

const WEEK_DAYS = ["L", "M", "M", "J", "V", "S", "D"];

function buildCalendarCells(date: Date): CalendarCell[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthStartOffset = (firstDayOfMonth + 6) % 7; // Monday-based index
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = Array.from({ length: 42 }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells[monthStartOffset + day - 1] = day;
  }
  return cells;
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const { login, loginError, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      await login(email, password);
      onClose();
    } catch {
      setLocalError("Email ou mot de passe incorrect");
    }
  };

  const errorMsg = localError || (loginError ? "Email ou mot de passe incorrect" : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11061d]/55 backdrop-blur-md px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white/85 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#2a1738]">Connexion</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8f7da9] transition-colors hover:bg-white/70 hover:text-[#3b2751]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[#6d5b87]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="ton@email.com"
              className="w-full rounded-xl border border-[#e7d8f5] bg-white/90 px-3 py-2 text-sm text-[#2b1740] outline-none transition-colors focus:border-[#d38ce6]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-[#6d5b87]">Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#e7d8f5] bg-white/90 px-3 py-2 text-sm text-[#2b1740] outline-none transition-colors focus:border-[#d38ce6]"
            />
          </label>

          {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7f4a5d] via-[#a56b7d] to-[#d8a1a8] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

function MissionItem({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}: {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-start gap-2 rounded-2xl border px-3 py-2.5",
        completed
          ? "border-[#d8e9db] bg-[#ebf6ed]/95"
          : "border-[#f1d8da] bg-[#f9ecec]/90",
      )}
    >
      <button
        onClick={() => onToggle(id)}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          completed
            ? "border-[#47a66b] bg-[#47a66b] text-white"
            : "border-[#be6b7d] text-[#be6b7d] hover:bg-[#ffe9ed]",
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <p
        className={cn(
          "flex-1 text-[0.96rem] leading-snug text-[#2f1f37]",
          completed && "line-through opacity-70",
        )}
      >
        {title}
      </p>
      <button
        onClick={() => onDelete(id)}
        className="rounded-full p-1 text-[#b795a5] opacity-0 transition-all hover:bg-white/80 hover:text-[#8e5367] group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function NoteCard({
  content,
  onUpdate,
  onDelete,
}: {
  content: string;
  onUpdate: (value: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(content);

  const commit = () => {
    setEditing(false);
    if (value.trim() !== content) {
      onUpdate(value.trim());
    }
  };

  return (
    <div className="group relative min-h-[108px] rounded-2xl border border-white/60 bg-gradient-to-br from-[#fff4e5]/90 via-[#ffefdc]/85 to-[#ffe5cf]/80 p-3 shadow-sm">
      <button
        onClick={onDelete}
        className="absolute right-2 top-2 rounded-full p-1 text-[#b69366] opacity-0 transition-opacity hover:bg-white/70 hover:text-[#8a6043] group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {editing ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              commit();
            }
          }}
          className="h-full w-full resize-none bg-transparent text-sm leading-relaxed text-[#4b2f2c] outline-none"
        />
      ) : (
        <p
          className="whitespace-pre-wrap text-sm leading-relaxed text-[#4b2f2c]"
          onClick={() => setEditing(true)}
        >
          {content || <span className="italic text-[#c39a82]">Cliquer pour écrire...</span>}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, logout, user } = useAuth();
  useDataMigration();
  const { darkMode, setDarkMode } = useSyncedPreferences();
  const { tasks, addTask, toggleTask, deleteTask } = useSyncedTasks("tableau-blanc");
  const { notes, addNote, updateNote, deleteNote } = useSyncedNotes("tableau-blanc");

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const timeText = useMemo(
    () => now.toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit", hour12: false }),
    [now],
  );
  const dateText = useMemo(
    () =>
      capitalize(
        now.toLocaleDateString("fr-CA", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      ),
    [now],
  );
  const monthTitle = useMemo(
    () =>
      capitalize(
        now.toLocaleDateString("fr-CA", {
          month: "long",
          year: "numeric",
        }),
      ),
    [now],
  );
  const calendarCells = useMemo(() => buildCalendarCells(now), [now]);
  const today = now.getDate();
  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0]?.trim() ||
    "Paw";

  const missions = tasks.slice(0, 6);
  const visibleNotes = notes.slice(0, 6);

  const handleAddTask = async () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    await addTask(title);
    setNewTaskTitle("");
  };

  return (
    <div className={cn("relative min-h-screen overflow-hidden transition-colors", darkMode && "dark")}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,#ffd6e8_0%,#e8dff7_30%,#c6c2dd_58%,#9f98b6_78%,#8e879f_100%)] dark:bg-[radial-gradient(circle_at_12%_18%,#35142d_0%,#23192e_35%,#171828_70%,#11111c_100%)]" />
      <div className="absolute -left-16 top-12 h-52 w-52 rounded-full bg-[#ffd7d4]/55 blur-3xl dark:bg-[#78408c]/35" />
      <div className="absolute right-10 top-14 h-40 w-40 rounded-full bg-[#ffe6b8]/40 blur-3xl dark:bg-[#8f6d35]/30" />
      <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-[#fff2d8]/40 blur-3xl dark:bg-[#5f3e77]/25" />

      <main className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 md:pt-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-4xl font-semibold tracking-tight text-white/90 drop-shadow-sm">En-tête</p>
          <div className="flex items-center gap-1.5 rounded-full border border-white/35 bg-white/20 px-2 py-1 backdrop-blur-md">
            {isAuthenticated ? (
              <Cloud className="h-4 w-4 text-emerald-300" />
            ) : (
              <CloudOff className="h-4 w-4 text-white/65" />
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full p-1 text-white/85 transition-colors hover:bg-white/20"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="rounded-full p-1 text-white/85 transition-colors hover:bg-white/20"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="rounded-full p-1 text-white/85 transition-colors hover:bg-white/20"
                title="Connexion"
              >
                <LogIn className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="rounded-full p-1 text-white/85 transition-colors hover:bg-white/20"
              title="Paramètres"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        <section className="rounded-[2rem] border border-white/50 bg-[linear-gradient(130deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.65)_40%,rgba(252,241,247,0.62)_100%)] p-5 shadow-[0_20px_60px_rgba(68,35,77,0.25)] backdrop-blur-xl dark:border-[#f0d7ff3d] dark:bg-[linear-gradient(130deg,rgba(33,20,50,0.78)_0%,rgba(24,16,35,0.74)_48%,rgba(28,16,39,0.8)_100%)] sm:p-7">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#241534] dark:text-[#f8eaff] sm:text-5xl">
                Bonjour, {displayName} <span className="align-middle text-2xl sm:text-4xl">🌸</span>
              </h1>
              <p className="mt-2 text-base text-[#3e2e4d] dark:text-[#d9c7ec]">
                Date: {dateText}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/prompt-vault">
                <button className="rounded-full border border-white/55 bg-[linear-gradient(135deg,#6a3144_0%,#9d5b6a_42%,#d8a5aa_100%)] px-6 py-2.5 text-base font-semibold text-white shadow-[0_8px_24px_rgba(97,44,60,0.35)] transition-transform hover:scale-[1.02]">
                  Syncer Gmail
                </button>
              </Link>
              <Link href="/suivi">
                <button className="rounded-full border border-white/55 bg-[linear-gradient(135deg,#7d354b_0%,#b26f81_45%,#e5b7be_100%)] px-6 py-2.5 text-base font-semibold text-white shadow-[0_8px_24px_rgba(97,44,60,0.35)] transition-transform hover:scale-[1.02]">
                  Générer mes tâches
                </button>
              </Link>
            </div>
          </div>

          <h2 className="mb-4 text-3xl font-semibold text-[#1f1127] dark:text-[#f4e7ff]">Missions du jour</h2>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div className="rounded-3xl border border-white/65 bg-white/72 p-4 backdrop-blur-md dark:border-[#ffffff1f] dark:bg-[#241a32b3]">
              <div className="mb-3 flex gap-2">
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void handleAddTask();
                    }
                  }}
                  placeholder="+ Ajouter une tâche..."
                  className="w-full rounded-full border border-[#e8d8e8] bg-white/90 px-4 py-2 text-[1.05rem] text-[#2f1d3a] outline-none transition-colors focus:border-[#c98ecf] dark:border-[#ffffff2a] dark:bg-[#291e39c4] dark:text-[#f7edff]"
                />
                <button
                  onClick={() => void handleAddTask()}
                  className="shrink-0 rounded-full bg-[#8b495e] p-2 text-white transition-colors hover:bg-[#6f3849]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <p className="mb-3 text-sm text-[#745d85] dark:text-[#bfa8d0]">De case à case à cocher</p>

              <div className="space-y-2.5">
                {missions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#d7c4db] bg-white/60 px-4 py-6 text-center text-sm text-[#836d90] dark:border-[#ffffff33] dark:bg-[#ffffff0f] dark:text-[#cfbfde]">
                    Aucune mission encore. Ajoute ta première tâche.
                  </div>
                ) : (
                  missions.map((task) => (
                    <MissionItem
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      completed={task.completed}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-[linear-gradient(145deg,#cc8a95_0%,#a16069_38%,#6b2f3f_100%)] p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              <p className="text-center text-2xl font-medium text-white/85">Ma journée</p>
              <p className="mt-2 text-center text-[2.9rem] font-semibold tracking-wide drop-shadow-sm sm:text-[3.6rem]">
                {timeText}
              </p>
              <p className="mt-2 text-center text-sm text-white/85">
                Objectif: focus, clarté, progression.
              </p>
            </div>

            <div className="rounded-3xl border border-white/65 bg-white/74 p-4 backdrop-blur-md dark:border-[#ffffff1f] dark:bg-[#241a32bf]">
              <p className="mb-3 text-center text-[2.1rem] font-medium text-[#201228] dark:text-[#f7e8ff]">
                {monthTitle}
              </p>
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#6f5f84] dark:text-[#bda7ce]">
                {WEEK_DAYS.map((day, idx) => (
                  <span key={`${day}-${idx}`}>{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm text-[#2f1d3a] dark:text-[#f5e6ff]">
                {calendarCells.map((cell, index) => {
                  const isToday = cell === today;
                  return (
                    <span
                      key={index}
                      className={cn(
                        "inline-flex h-8 items-center justify-center rounded-full",
                        cell === null && "opacity-0",
                        isToday &&
                          "bg-[radial-gradient(circle_at_30%_25%,#ffd2cc_0%,#c77d86_65%,#8e4757_100%)] text-white shadow-md",
                      )}
                    >
                      {cell ?? "-"}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/65 bg-white/68 p-4 backdrop-blur-md dark:border-[#ffffff1f] dark:bg-[#231a30bf]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[#2a1739] dark:text-[#f6e8ff]">Tableau blanc</p>
                <p className="text-sm text-[#7a648a] dark:text-[#c6b2d6]">
                  Notes rapides synchronisées, toujours prêtes.
                </p>
              </div>
              <button
                onClick={() => addNote("")}
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-[linear-gradient(135deg,#8d495f_0%,#bb7688_45%,#deabb4_100%)] px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <StickyNote className="h-4 w-4" />
                Nouvelle note
              </button>
            </div>

            {visibleNotes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#dcc7df] bg-white/60 px-4 py-7 text-center text-sm text-[#836d90] dark:border-[#ffffff35] dark:bg-[#ffffff10] dark:text-[#cfbfde]">
                Aucun mémo pour le moment. Ajoute une note pour démarrer.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    content={note.content}
                    onUpdate={(value) => updateNote(note.id, value)}
                    onDelete={() => deleteNote(note.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#6e5b82] dark:text-[#beaad0]">
            <Sparkles className="h-4 w-4" />
            <span>
              {isAuthenticated
                ? "Synchronisation cloud active."
                : "Mode local actif — connecte-toi pour synchroniser."}
            </span>
            <span className="mx-1 opacity-50">•</span>
            <GlobalBackupPanel />
            <span className="opacity-50">•</span>
            <Link href="/prompt-vault">
              <span className="cursor-pointer font-medium text-[#7d3f58] underline decoration-dotted underline-offset-4 dark:text-[#f0b7ca]">
                Ouvrir Prompt Vault
              </span>
            </Link>
            <span className="opacity-50">/</span>
            <Link href="/suivi">
              <span className="cursor-pointer font-medium text-[#7d3f58] underline decoration-dotted underline-offset-4 dark:text-[#f0b7ca]">
                Ouvrir Suivi
              </span>
            </Link>
          </div>
        </section>
      </main>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
