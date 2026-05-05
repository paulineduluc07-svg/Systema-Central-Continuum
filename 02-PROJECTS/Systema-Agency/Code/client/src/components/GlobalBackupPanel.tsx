import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BACKUP_SCHEMA_VERSION } from "@shared/const";
import { Database, Download, Loader2, Upload, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const TASKS_PREFIX = "rpg_quests_";
const NOTES_PREFIX = "rpg_notes_";
const PROMPT_VAULT_KEY = "prompt_vault_state_v1";

type BackupTask = {
  tabId: string;
  title: string;
  completed: boolean;
  sortOrder: number;
};

type BackupNote = {
  tabId: string;
  content: string;
  sortOrder: number;
};

type BackupData = {
  tasks: BackupTask[];
  notes: BackupNote[];
  promptVault: unknown | null;
};

type BackupFile = {
  version: number;
  exportedAt: string;
  source: "local" | "cloud";
  data: BackupData;
};

function parseBackupImportFile(raw: string): BackupFile {
  const parsed = JSON.parse(raw) as Partial<BackupFile>;

  if (!parsed || typeof parsed !== "object" || !parsed.data) {
    throw new Error("Format de sauvegarde invalide: objet racine ou champ data manquant.");
  }

  if (!Number.isInteger(parsed.version)) {
    throw new Error("Format de sauvegarde invalide: champ version manquant.");
  }

  if (parsed.version !== BACKUP_SCHEMA_VERSION) {
    throw new Error(
      `Version de sauvegarde non supportee (${parsed.version}). Version attendue: ${BACKUP_SCHEMA_VERSION}.`,
    );
  }

  return {
    version: parsed.version,
    exportedAt:
      typeof parsed.exportedAt === "string" ? parsed.exportedAt : new Date().toISOString(),
    source: parsed.source === "local" ? "local" : "cloud",
    data: normalizeBackupData(parsed.data),
  };
}

function toBackupErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof SyntaxError) {
    return "JSON invalide. Verifie la structure du backup avant de restaurer.";
  }

  if (error instanceof Error) {
    const trimmed = error.message.trim();
    if (!trimmed) return fallbackMessage;

    if (
      trimmed.startsWith("[") ||
      trimmed.includes("invalid_type") ||
      trimmed.includes("TRPCClientError")
    ) {
      return "Backup invalide ou incomplet. Verifie la version et la structure des donnees.";
    }

    return trimmed;
  }

  return fallbackMessage;
}

function normalizeBackupData(raw: unknown): BackupData {
  const input = raw && typeof raw === "object" ? (raw as Partial<BackupData>) : {};
  const tasks = Array.isArray(input.tasks) ? input.tasks : [];
  const notes = Array.isArray(input.notes) ? input.notes : [];
  const promptVault = input.promptVault ?? null;

  const normalizedTasks: BackupTask[] = tasks
    .map((task) => {
      if (!task || typeof task !== "object") return null;
      const item = task as Partial<BackupTask>;
      if (!item.tabId || !item.title) return null;
      return {
        tabId: String(item.tabId),
        title: String(item.title),
        completed: Boolean(item.completed),
        sortOrder: Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : 0,
      };
    })
    .filter((task): task is BackupTask => task !== null);

  const normalizedNotes: BackupNote[] = notes
    .map((note) => {
      if (!note || typeof note !== "object") return null;
      const item = note as Partial<BackupNote>;
      if (!item.tabId || item.content === undefined) return null;
      return {
        tabId: String(item.tabId),
        content: String(item.content),
        sortOrder: Number.isFinite(item.sortOrder) ? Number(item.sortOrder) : 0,
      };
    })
    .filter((note): note is BackupNote => note !== null);

  return {
    tasks: normalizedTasks,
    notes: normalizedNotes,
    promptVault,
  };
}

function readLocalBackup(): BackupData {
  if (typeof window === "undefined") {
    return { tasks: [], notes: [], promptVault: null };
  }

  const tasks: BackupTask[] = [];
  const notes: BackupNote[] = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (!key) continue;

    if (key.startsWith(TASKS_PREFIX)) {
      const tabId = key.slice(TASKS_PREFIX.length);
      try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<{
          title?: unknown;
          completed?: unknown;
        }>;
        parsed.forEach((entry, sortOrder) => {
          if (!entry?.title) return;
          tasks.push({
            tabId,
            title: String(entry.title),
            completed: Boolean(entry.completed),
            sortOrder,
          });
        });
      } catch {
        // ignore invalid local payload
      }
    }

    if (key.startsWith(NOTES_PREFIX)) {
      const tabId = key.slice(NOTES_PREFIX.length);
      try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<{
          content?: unknown;
        }>;
        parsed.forEach((entry, sortOrder) => {
          if (entry?.content === undefined) return;
          notes.push({
            tabId,
            content: String(entry.content),
            sortOrder,
          });
        });
      } catch {
        // ignore invalid local payload
      }
    }
  }

  let promptVault: unknown | null = null;
  try {
    const raw = localStorage.getItem(PROMPT_VAULT_KEY);
    promptVault = raw ? JSON.parse(raw) : null;
  } catch {
    promptVault = null;
  }

  return {
    tasks,
    notes,
    promptVault,
  };
}

function writeLocalBackup(data: BackupData): void {
  if (typeof window === "undefined") return;

  const taskKeysToDelete: string[] = [];
  const noteKeysToDelete: string[] = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (!key) continue;
    if (key.startsWith(TASKS_PREFIX)) taskKeysToDelete.push(key);
    if (key.startsWith(NOTES_PREFIX)) noteKeysToDelete.push(key);
  }
  taskKeysToDelete.forEach((key) => localStorage.removeItem(key));
  noteKeysToDelete.forEach((key) => localStorage.removeItem(key));

  const tasksByTab = new Map<string, BackupTask[]>();
  data.tasks.forEach((task) => {
    const bucket = tasksByTab.get(task.tabId) ?? [];
    bucket.push(task);
    tasksByTab.set(task.tabId, bucket);
  });
  tasksByTab.forEach((items, tabId) => {
    const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
    const compact = sorted.map((task, index) => ({
      id: `${index + 1}`,
      title: task.title,
      completed: task.completed,
    }));
    localStorage.setItem(`${TASKS_PREFIX}${tabId}`, JSON.stringify(compact));
  });

  const notesByTab = new Map<string, BackupNote[]>();
  data.notes.forEach((note) => {
    const bucket = notesByTab.get(note.tabId) ?? [];
    bucket.push(note);
    notesByTab.set(note.tabId, bucket);
  });
  notesByTab.forEach((items, tabId) => {
    const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
    const compact = sorted.map((note, index) => ({
      id: `${index + 1}`,
      content: note.content,
    }));
    localStorage.setItem(`${NOTES_PREFIX}${tabId}`, JSON.stringify(compact));
  });

  if (data.promptVault === null) {
    localStorage.removeItem(PROMPT_VAULT_KEY);
  } else {
    localStorage.setItem(PROMPT_VAULT_KEY, JSON.stringify(data.promptVault));
  }
}

export function GlobalBackupPanel() {
  const { isAuthenticated } = useAuth();
  const backupExportQuery = trpc.backup.export.useQuery(undefined, {
    enabled: false,
    refetchOnWindowFocus: false,
  });
  const backupImportMutation = trpc.backup.import.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [payloadText, setPayloadText] = useState("");
  const [importText, setImportText] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const sourceLabel = useMemo(
    () => (isAuthenticated ? "cloud (compte connecté)" : "local (navigateur)"),
    [isAuthenticated],
  );

  const openModal = () => {
    setIsOpen(true);
    setPayloadText("");
    setImportText("");
  };

  const closeModal = () => {
    if (isExporting || isImporting) return;
    setIsOpen(false);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (isAuthenticated) {
        const response = await backupExportQuery.refetch();
        if (!response.data) {
          throw response.error ?? new Error("Impossible d'exporter les données cloud.");
        }
        const cloudData = normalizeBackupData(response.data.data);
        const payload: BackupFile = {
          version: response.data.version,
          exportedAt: response.data.exportedAt,
          source: "cloud",
          data: cloudData,
        };
        setPayloadText(JSON.stringify(payload, null, 2));
      } else {
        const backupFile: BackupFile = {
          version: BACKUP_SCHEMA_VERSION,
          exportedAt: new Date().toISOString(),
          source: "local",
          data: readLocalBackup(),
        };
        setPayloadText(JSON.stringify(backupFile, null, 2));
      }

      toast.success("Export global généré.");
    } catch (error) {
      const message = toBackupErrorMessage(error, "Erreur pendant l'export global.");
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    if (!payloadText) return;
    try {
      await navigator.clipboard.writeText(payloadText);
      toast.success("Export copié dans le presse-papiers.");
    } catch {
      toast.error("Impossible de copier automatiquement.");
    }
  };

  const handleImport = async () => {
    try {
      if (!importText.trim()) return;
      const parsed = parseBackupImportFile(importText);
      const confirmed = window.confirm(
        "Restaurer va remplacer les données actuelles (tâches, notes, prompt vault). Continuer ?",
      );
      if (!confirmed) return;

      setIsImporting(true);
      if (isAuthenticated) {
        await backupImportMutation.mutateAsync({
          version: parsed.version,
          data: parsed.data,
        });
      } else {
        writeLocalBackup(parsed.data);
      }

      toast.success("Import global appliqué.");
      window.location.reload();
    } catch (error) {
      const message = toBackupErrorMessage(error, "Erreur pendant l'import global.");
      toast.error(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/20 px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/30"
      >
        <Database className="h-3.5 w-3.5" />
        Export/Import global
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11061d]/55 px-4 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-3xl border border-white/45 bg-white/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#2b1740]">Sauvegarde globale</h3>
                <p className="text-xs text-[#6d5b87]">
                  Source active: <span className="font-semibold">{sourceLabel}</span>
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full p-1.5 text-[#8f7da9] transition-colors hover:bg-white/70 hover:text-[#3b2751]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#e7d8f5] bg-white/80 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6d5b87]">
                  Export
                </p>
                <textarea
                  readOnly
                  value={payloadText}
                  className="h-52 w-full resize-none rounded-xl border border-[#eadff9] bg-white/95 p-3 font-mono text-[11px] text-[#2b1740] outline-none"
                  placeholder="Clique sur Générer export pour produire la sauvegarde complète."
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleExport}
                    disabled={isExporting || isImporting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7f4a5d] via-[#a56b7d] to-[#d8a1a8] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    Générer export
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!payloadText || isExporting || isImporting}
                    className="rounded-xl border border-[#d8c5ef] bg-white px-3 py-2 text-xs font-semibold text-[#5e4a78] disabled:opacity-50"
                  >
                    Copier
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e7d8f5] bg-white/80 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6d5b87]">
                  Import
                </p>
                <textarea
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                  className="h-52 w-full resize-none rounded-xl border border-[#eadff9] bg-white/95 p-3 font-mono text-[11px] text-[#2b1740] outline-none"
                  placeholder="Colle ici ton JSON de sauvegarde globale."
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleImport}
                    disabled={!importText.trim() || isExporting || isImporting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4f657f] via-[#5e7a9f] to-[#88a9d8] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {isImporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Restaurer
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-[#9a4f5d]">
                  Attention: l'import remplace les données existantes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
