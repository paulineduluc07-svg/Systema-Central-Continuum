import { useSyncedNotes, useSyncedTasks } from "@/hooks/useSyncedData";
import { getCustomTabIcon, normalizeTabColor } from "@/lib/customTabIcons";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useAuth } from "@/_core/hooks/useAuth";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useParams } from "wouter";

function getTabIdParam(value: string | undefined) {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function CustomTabPage() {
  const params = useParams<{ tabId?: string }>();
  const tabId = getTabIdParam(params.tabId);
  const { isAuthenticated } = useAuth();
  const customTabsQuery = trpc.customTabs.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
  });

  const tab = useMemo(() => {
    return customTabsQuery.data?.find((item) => item.tabId === tabId);
  }, [customTabsQuery.data, tabId]);

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center px-4 py-10">
        <section className="w-full rounded-3xl border border-white/35 bg-white/55 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
          <h1 className="font-display text-3xl font-bold text-[#321d46] dark:text-white">Connexion requise</h1>
          <p className="mt-3 text-sm text-[#6f5f92] dark:text-white/70">
            Connecte-toi pour afficher les onglets synchronises avec Systema.
          </p>
        </section>
      </main>
    );
  }

  if (customTabsQuery.isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-full border border-white/30 bg-white/50 px-5 py-3 text-sm font-medium text-[#4b365f] shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/30 dark:text-white">
          <Loader2 className="h-4 w-4 animate-spin" />
          Chargement de l'onglet
        </div>
      </main>
    );
  }

  if (!tab) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center px-4 py-10">
        <section className="w-full rounded-3xl border border-white/35 bg-white/55 p-8 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/30">
          <h1 className="font-display text-3xl font-bold text-[#321d46] dark:text-white">Onglet introuvable</h1>
          <p className="mt-3 text-sm text-[#6f5f92] dark:text-white/70">
            Aucun onglet personnalise ne correspond a <span className="font-mono">{tabId}</span>.
          </p>
        </section>
      </main>
    );
  }

  const Icon = getCustomTabIcon(tab.icon);
  const accent = normalizeTabColor(tab.color);

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-6 overflow-hidden rounded-3xl border border-white/35 bg-white/50 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/45 shadow-lg"
              style={{ backgroundColor: `${accent}26`, color: accent }}
            >
              <Icon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-bold text-[#321d46] dark:text-white sm:text-4xl">
                {tab.label}
              </h1>
              <p className="mt-1 truncate text-xs font-medium uppercase tracking-[0.18em] text-[#7a628e] dark:text-white/60">
                {tab.tabType === "widgets" ? "Espace widgets" : "Whiteboard"} / {tab.tabId}
              </p>
            </div>
          </div>
          <div
            className="h-2 rounded-full sm:h-12 sm:w-2"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />
        </div>
      </section>

      {tab.tabType === "widgets" ? (
        <WidgetsTabContent tabId={tab.tabId} accent={accent} />
      ) : (
        <WhiteboardPlaceholder accent={accent} />
      )}
    </main>
  );
}

function WidgetsTabContent({ tabId, accent }: { tabId: string; accent: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <TasksPanel tabId={tabId} accent={accent} />
      <NotesPanel tabId={tabId} accent={accent} />
    </div>
  );
}

function TasksPanel({ tabId, accent }: { tabId: string; accent: string }) {
  const { tasks, isLoading, addTask, toggleTask, updateTaskTitle, deleteTask } = useSyncedTasks(tabId);
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await addTask(trimmed);
    setTitle("");
  };

  return (
    <section className="rounded-3xl border border-white/35 bg-white/55 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/25 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-[#321d46] dark:text-white">Taches</h2>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-[#6f5f92] dark:bg-white/10 dark:text-white/65">
          {tasks.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Nouvelle tache"
          className="min-w-0 flex-1 rounded-2xl border border-white/45 bg-white/65 px-4 py-2 text-sm text-[#321d46] outline-none transition focus:border-white focus:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white"
        />
        <button
          type="submit"
          aria-label="Ajouter une tache"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition hover:brightness-105 disabled:opacity-50"
          style={{ backgroundColor: accent }}
          disabled={!title.trim()}
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {isLoading ? (
        <LoadingLine />
      ) : (
        <div className="space-y-2">
          {tasks.length === 0 && <EmptyState text="Aucune tache dans cet onglet." />}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-2xl border border-white/35 bg-white/55 px-3 py-2 dark:border-white/10 dark:bg-white/10"
            >
              <button
                type="button"
                onClick={() => void toggleTask(task.id)}
                aria-label={task.completed ? "Marquer incomplete" : "Completer la tache"}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
                  task.completed ? "border-transparent text-white" : "border-[#bfa7d8] bg-white/50 text-transparent"
                )}
                style={task.completed ? { backgroundColor: accent } : undefined}
              >
                <Check className="h-4 w-4" />
              </button>
              <input
                defaultValue={task.title}
                onBlur={(event) => {
                  const next = event.target.value.trim();
                  if (next && next !== task.title) void updateTaskTitle(task.id, next);
                }}
                className={cn(
                  "min-w-0 flex-1 bg-transparent text-sm outline-none",
                  task.completed ? "text-[#7a628e] line-through dark:text-white/45" : "text-[#321d46] dark:text-white"
                )}
              />
              <button
                type="button"
                onClick={() => void deleteTask(task.id)}
                aria-label="Supprimer la tache"
                className="rounded-full p-1.5 text-[#7a628e] opacity-80 transition hover:bg-white/60 hover:text-red-500 dark:text-white/55 dark:hover:bg-white/10 md:opacity-0 md:group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function NotesPanel({ tabId, accent }: { tabId: string; accent: string }) {
  const { notes, isLoading, addNote, updateNote, deleteNote } = useSyncedNotes(tabId);
  const [content, setContent] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    await addNote(trimmed);
    setContent("");
  };

  return (
    <section className="rounded-3xl border border-white/35 bg-white/55 p-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/25 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-[#321d46] dark:text-white">Notes</h2>
        <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-[#6f5f92] dark:bg-white/10 dark:text-white/65">
          {notes.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 grid gap-2">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Nouvelle note"
          rows={3}
          className="min-h-24 resize-y rounded-2xl border border-white/45 bg-white/65 px-4 py-3 text-sm text-[#321d46] outline-none transition focus:border-white focus:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white"
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 disabled:opacity-50"
          style={{ backgroundColor: accent }}
          disabled={!content.trim()}
        >
          <Plus className="h-4 w-4" />
          Ajouter une note
        </button>
      </form>

      {isLoading ? (
        <LoadingLine />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {notes.length === 0 && <EmptyState text="Aucune note dans cet onglet." />}
          {notes.map((note) => (
            <div
              key={note.id}
              className="group rounded-2xl border border-white/35 bg-white/55 p-3 dark:border-white/10 dark:bg-white/10"
            >
              <textarea
                defaultValue={note.content}
                rows={5}
                onBlur={(event) => {
                  const next = event.target.value.trim();
                  if (next !== note.content) void updateNote(note.id, next);
                }}
                className="min-h-28 w-full resize-y bg-transparent text-sm leading-relaxed text-[#321d46] outline-none dark:text-white"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => void deleteNote(note.id)}
                  className="rounded-full p-1.5 text-[#7a628e] transition hover:bg-white/60 hover:text-red-500 dark:text-white/55 dark:hover:bg-white/10"
                  aria-label="Supprimer la note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function WhiteboardPlaceholder({ accent }: { accent: string }) {
  return (
    <section className="flex min-h-[420px] items-center justify-center rounded-3xl border border-white/35 bg-white/45 p-6 text-center shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
      <div>
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ backgroundColor: accent }}
        >
          <Plus className="h-6 w-6" />
        </div>
        <h2 className="font-display text-3xl font-bold text-[#321d46] dark:text-white">Whiteboard bientot disponible</h2>
        <p className="mt-2 max-w-md text-sm text-[#6f5f92] dark:text-white/65">
          Cet onglet existe deja. Le rendu complet du whiteboard sera ajoute dans une passe separee.
        </p>
      </div>
    </section>
  );
}

function LoadingLine() {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/45 px-4 py-3 text-sm text-[#6f5f92] dark:bg-white/10 dark:text-white/65">
      <Loader2 className="h-4 w-4 animate-spin" />
      Chargement
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cdb9df] bg-white/35 px-4 py-6 text-center text-sm text-[#7a628e] dark:border-white/10 dark:bg-white/5 dark:text-white/55">
      {text}
    </div>
  );
}
