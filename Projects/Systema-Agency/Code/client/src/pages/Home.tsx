import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSyncedNotes, useSyncedPreferences } from "@/hooks/useSyncedData";
import { usePersistedState } from "@/hooks/usePersistedState";
import { AdminPanel } from "@/components/AdminPanel";
import {
  Cloud,
  CloudOff,
  LogIn,
  LogOut,
  Moon,
  Sun,
  Settings,
  Plus,
  X,
  Activity,
  Heart,
  DollarSign,
  Briefcase,
  BookOpen,
  Home as HomeIcon,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tab config ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "sante", label: "Sante", Icon: Heart, color: "#F472B6" },
  { id: "finance", label: "Finance", Icon: DollarSign, color: "#34D399" },
  { id: "carriere", label: "Carriere", Icon: Briefcase, color: "#60A5FA" },
  { id: "etude", label: "Etude", Icon: BookOpen, color: "#A78BFA" },
  { id: "maison", label: "Maison", Icon: HomeIcon, color: "#FBBF24" },
  { id: "ressources-ia", label: "Ressources IA", Icon: Sparkles, color: "#67E8F9" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Login modal ───────────────────────────────────────────────────────────────

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Connexion
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="ton@email.com"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-pink-400 dark:focus:border-pink-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-pink-400 dark:focus:border-pink-500 transition-colors"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Sticky note card ──────────────────────────────────────────────────────────

function StickyCard({
  content,
  onUpdate,
  onDelete,
}: {
  content: string;
  onUpdate: (v: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(content);

  const commit = () => {
    setEditing(false);
    if (value.trim() !== content) onUpdate(value.trim());
  };

  return (
    <div className="relative group bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-3 shadow-sm min-h-[90px] flex flex-col">
      <button
        onClick={onDelete}
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400"
      >
        <X className="w-3 h-3" />
      </button>
      {editing ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Escape" && commit()}
          className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 resize-none outline-none"
        />
      ) : (
        <p
          className="flex-1 text-sm text-gray-700 dark:text-gray-200 cursor-text whitespace-pre-wrap leading-relaxed"
          onClick={() => setEditing(true)}
        >
          {content || (
            <span className="text-gray-300 dark:text-gray-600 italic">
              Cliquer pour ecrire...
            </span>
          )}
        </p>
      )}
    </div>
  );
}

// ── Notes section ─────────────────────────────────────────────────────────────

function NotesSection({ tabId }: { tabId: string }) {
  const { notes, addNote, updateNote, deleteNote } = useSyncedNotes(tabId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Notes
        </h2>
        <button
          onClick={() => addNote("")}
          className="flex items-center gap-1 text-xs text-pink-500 hover:text-pink-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nouvelle note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Aucune note pour cet onglet
          </p>
          <button
            onClick={() => addNote("")}
            className="mt-2 text-xs text-pink-400 hover:text-pink-500 transition-colors"
          >
            Ajouter la premiere
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {notes.map((note) => (
            <StickyCard
              key={note.id}
              content={note.content}
              onUpdate={(v) => updateNote(note.id, v)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
          <button
            onClick={() => addNote("")}
            className="min-h-[90px] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:border-pink-300 hover:text-pink-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const { darkMode, setDarkMode } = useSyncedPreferences();
  const [activeTab, setActiveTab] = usePersistedState<TabId>("active_tab", "sante");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors", darkMode && "dark")}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Tabs */}
          <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 min-w-0">
            {TABS.map(({ id, label, Icon, color }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0",
                    isActive
                      ? "bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon
                    className="w-3.5 h-3.5 shrink-0"
                    style={isActive ? { color } : {}}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isAuthenticated ? (
              <Cloud className="w-3.5 h-3.5 text-green-400" title="Synchronise" />
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" title="Hors-ligne" />
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Deconnexion"
              >
                <LogOut className="w-4 h-4 text-red-400" />
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="p-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 transition-colors"
                title="Connexion"
              >
                <LogIn className="w-4 h-4 text-white" />
              </button>
            )}

            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "ressources-ia" ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Prompt Vault
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Bibliotheque de prompts IA
              </p>
            </div>
            <Link href="/prompt-vault">
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors">
                Ouvrir le Vault
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === "sante" && (
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-pink-100 dark:border-pink-900/20 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Suivi medicament
                  </p>
                  <p className="text-xs text-gray-400">Enregistrer une prise</p>
                </div>
                <Link href="/suivi">
                  <button className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-lg transition-colors shrink-0">
                    Ouvrir
                  </button>
                </Link>
              </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
              <NotesSection tabId={activeTab} />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
