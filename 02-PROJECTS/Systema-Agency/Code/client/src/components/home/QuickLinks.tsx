// QuickLinks.tsx — la fenêtre rétro « raccourcis agence » : liens externes
// (Claude, Gemini, Google…) qui s'ouvrent dans un nouvel onglet.
// Éditables (ajouter / modifier / supprimer) et synchronisés au cloud via
// les préférences utilisateur (champ quickLinks).

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Check, ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { playClickSound } from "./clickSound";

type Shortcut = {
  id: string;
  label: string;
  emoji: string;
  url: string;
};

const DEFAULT_SHORTCUTS: Shortcut[] = [
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

const MAX_SHORTCUTS = 20;

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

// Renvoie la liste configurée (même vide), ou null si jamais configurée / illisible.
function parseShortcuts(raw: string | null | undefined): Shortcut[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
      .map((x) => ({
        id: typeof x.id === "string" ? x.id : makeId(),
        label: typeof x.label === "string" ? x.label : "",
        emoji: typeof x.emoji === "string" && x.emoji.trim() ? x.emoji : "🔗",
        url: typeof x.url === "string" ? x.url : "",
      }))
      .filter((s) => s.label && s.url);
  } catch {
    return null;
  }
}

export function QuickLinks() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: prefs } = trpc.preferences.get.useQuery(undefined, { enabled: isAuthenticated });

  const configured = parseShortcuts(prefs?.quickLinks);
  const shortcuts = configured ?? DEFAULT_SHORTCUTS;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Shortcut[]>([]);
  const [error, setError] = useState<string | null>(null);

  const saveMutation = trpc.preferences.update.useMutation({
    onSuccess: () => {
      void utils.preferences.get.invalidate();
      setEditing(false);
      setError(null);
    },
    onError: (e) => setError(e.message || "La sauvegarde a échoué. Réessaie."),
  });

  const open = (shortcut: Shortcut) => {
    playClickSound();
    window.open(shortcut.url, "_blank", "noopener,noreferrer");
  };

  const startEdit = () => {
    playClickSound();
    setDraft(shortcuts.map((s) => ({ ...s })));
    setError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError(null);
  };

  const updateRow = (id: string, patch: Partial<Shortcut>) => {
    setDraft((d) => d.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const deleteRow = (id: string) => {
    setDraft((d) => d.filter((s) => s.id !== id));
  };

  const addRow = () => {
    setDraft((d) => (d.length >= MAX_SHORTCUTS ? d : [...d, { id: makeId(), label: "", emoji: "⭐", url: "" }]));
  };

  const save = () => {
    const cleaned = draft
      .map((s) => ({
        id: s.id,
        label: s.label.trim(),
        emoji: s.emoji.trim() || "🔗",
        url: normalizeUrl(s.url),
      }))
      .filter((s) => s.label && s.url);
    saveMutation.mutate({ quickLinks: JSON.stringify(cleaned) });
  };

  return (
    <div className="retro-window w-full rounded-sm p-1">
      {/* Barre de titre de la fenêtre */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#b3c5f4] to-[#dfb2f4] px-2 py-1.5 font-mono text-xs font-semibold text-gray-800 select-none">
        <span className="flex items-center gap-1">
          <span className="text-[10px]">📁</span> raccourcis agence
        </span>
        <div className="flex items-center gap-1">
          {isAuthenticated && !editing && (
            <button
              onClick={startEdit}
              title="Modifier les raccourcis"
              className="flex h-3.5 w-3.5 cursor-pointer items-center justify-center border border-gray-400 bg-white text-gray-700 hover:bg-pink-100"
            >
              <Pencil className="h-2 w-2" />
            </button>
          )}
          <div className="flex h-3.5 w-3.5 items-center justify-center border border-gray-400 bg-white text-[8px] font-bold select-none">_</div>
          <div className="flex h-3.5 w-3.5 items-center justify-center border border-gray-400 bg-white text-[8px] font-bold select-none">□</div>
          <div className="flex h-3.5 w-3.5 items-center justify-center border border-gray-400 bg-red-100 text-[9px] font-bold select-none">×</div>
        </div>
      </div>

      {/* La liste de liens */}
      <div className="bg-white p-1">
        {!editing ? (
          <div className="flex flex-col gap-0.5">
            {shortcuts.map((shortcut) => (
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
        ) : (
          <div className="flex flex-col gap-1.5 p-1">
            {draft.map((s) => (
              <div key={s.id} className="flex items-center gap-1">
                <input
                  value={s.emoji}
                  onChange={(e) => updateRow(s.id, { emoji: e.target.value })}
                  maxLength={4}
                  aria-label="Emoji"
                  className="w-8 shrink-0 rounded-sm border border-gray-300 px-1 py-1 text-center text-sm focus:border-[#e85d97] focus:outline-none"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <input
                    value={s.label}
                    onChange={(e) => updateRow(s.id, { label: e.target.value })}
                    maxLength={40}
                    placeholder="nom"
                    className="w-full rounded-sm border border-gray-300 px-1.5 py-1 font-mono text-[11px] focus:border-[#e85d97] focus:outline-none"
                  />
                  <input
                    value={s.url}
                    onChange={(e) => updateRow(s.id, { url: e.target.value })}
                    placeholder="lien (https://…)"
                    className="w-full rounded-sm border border-gray-300 px-1.5 py-1 font-mono text-[10px] text-gray-600 focus:border-[#e85d97] focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => deleteRow(s.id)}
                  title="Supprimer"
                  className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-gray-300 text-gray-400 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}

            {draft.length < MAX_SHORTCUTS && (
              <button
                onClick={addRow}
                className="mt-0.5 flex w-full cursor-pointer items-center justify-center gap-1 rounded-sm border border-dashed border-pink-300 py-1.5 font-mono text-[10px] font-medium text-[#e85d97] hover:bg-pink-50"
              >
                <Plus className="h-3 w-3" /> ajouter un raccourci
              </button>
            )}

            {error && (
              <p className="rounded-sm bg-red-50 px-2 py-1 font-mono text-[10px] text-red-600">{error}</p>
            )}

            <div className="mt-1 flex gap-1">
              <button
                onClick={save}
                disabled={saveMutation.isPending}
                className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-sm border-2 border-black bg-[#ffccd5] py-1.5 font-mono text-[10px] font-bold text-black uppercase hover:bg-[#ffb3c1] disabled:opacity-50"
              >
                <Check className="h-3 w-3" /> {saveMutation.isPending ? "…" : "enregistrer"}
              </button>
              <button
                onClick={cancelEdit}
                disabled={saveMutation.isPending}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-sm border-2 border-black bg-white px-2 py-1.5 font-mono text-[10px] font-bold text-black uppercase hover:bg-gray-100 disabled:opacity-50"
              >
                <X className="h-3 w-3" /> annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
