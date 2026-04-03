import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const MIGRATION_KEY = "data_migration_completed";

interface LocalTask {
  id: string;
  title: string;
  completed: boolean;
}

interface LocalNote {
  id: string;
  content: string;
}

// Get all localStorage keys that match our patterns
function getLocalStorageKeys(pattern: RegExp): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && pattern.test(key)) {
      keys.push(key);
    }
  }
  return keys;
}

// Extract tabId from key like "rpg_quests_missions" -> "missions"
function extractTabId(key: string, prefix: string): string {
  return key.replace(prefix, "");
}

export function useDataMigration() {
  const { isAuthenticated, user } = useAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const utils = trpc.useUtils();

  // Check if user has cloud data
  const { data: cloudStatus, isLoading: checkingCloud } = trpc.migration.hasCloudData.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Mutations for importing data
  const importTasksMutation = trpc.migration.importTasks.useMutation();
  const importNotesMutation = trpc.migration.importNotes.useMutation();
  const importPrefsMutation = trpc.migration.importPreferences.useMutation();

  // Check if migration was already done for this user
  const wasMigrationDone = useCallback(() => {
    if (!user?.id) return false;
    const migrationData = localStorage.getItem(MIGRATION_KEY);
    if (!migrationData) return false;
    try {
      const parsed = JSON.parse(migrationData);
      return parsed.userId === user.id;
    } catch {
      return false;
    }
  }, [user?.id]);

  // Mark migration as complete
  const markMigrationComplete = useCallback(() => {
    if (!user?.id) return;
    localStorage.setItem(MIGRATION_KEY, JSON.stringify({
      userId: user.id,
      completedAt: new Date().toISOString(),
    }));
    setMigrationComplete(true);
  }, [user?.id]);

  // Collect all local data
  const collectLocalData = useCallback(() => {
    const tasks: Array<{ tabId: string; title: string; completed: boolean; sortOrder: number }> = [];
    const notes: Array<{ tabId: string; content: string; sortOrder: number }> = [];

    // Collect tasks
    const taskKeys = getLocalStorageKeys(/^rpg_quests_/);
    for (const key of taskKeys) {
      const tabId = extractTabId(key, "rpg_quests_");
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const localTasks: LocalTask[] = JSON.parse(stored);
          localTasks.forEach((t, i) => {
            tasks.push({
              tabId,
              title: t.title,
              completed: t.completed,
              sortOrder: i,
            });
          });
        } catch { /* ignore parse errors */ }
      }
    }

    // Collect notes
    const noteKeys = getLocalStorageKeys(/^rpg_notes_/);
    for (const key of noteKeys) {
      const tabId = extractTabId(key, "rpg_notes_");
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const localNotes: LocalNote[] = JSON.parse(stored);
          localNotes.forEach((n, i) => {
            notes.push({
              tabId,
              content: n.content,
              sortOrder: i,
            });
          });
        } catch { /* ignore parse errors */ }
      }
    }

    // Collect preferences
    const darkMode = localStorage.getItem("app_dark_mode") === "true";
    
    // Collect widget orders for all tabs
    const widgetOrderKeys = getLocalStorageKeys(/^widget_order_/);
    const widgetOrders: Record<string, string[]> = {};
    for (const key of widgetOrderKeys) {
      const tabId = extractTabId(key, "widget_order_");
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          widgetOrders[tabId] = JSON.parse(stored);
        } catch { /* ignore */ }
      }
    }

    return {
      tasks,
      notes,
      preferences: {
        darkMode,
        widgetOrder: Object.keys(widgetOrders).length > 0 ? JSON.stringify(widgetOrders) : undefined,
      },
      hasData: tasks.length > 0 || notes.length > 0,
    };
  }, []);

  // Clear local data after successful migration
  const clearLocalData = useCallback(() => {
    const taskKeys = getLocalStorageKeys(/^rpg_quests_/);
    const noteKeys = getLocalStorageKeys(/^rpg_notes_/);
    
    taskKeys.forEach(key => localStorage.removeItem(key));
    noteKeys.forEach(key => localStorage.removeItem(key));
  }, []);

  // Perform migration
  const migrateData = useCallback(async () => {
    if (!isAuthenticated || isMigrating) return;

    setIsMigrating(true);

    try {
      const localData = collectLocalData();

      if (!localData.hasData) {
        markMigrationComplete();
        setIsMigrating(false);
        return;
      }

      let tasksImported = 0;
      let notesImported = 0;

      // Import tasks
      if (localData.tasks.length > 0) {
        const result = await importTasksMutation.mutateAsync({ tasks: localData.tasks });
        tasksImported = result.imported;
      }

      // Import notes
      if (localData.notes.length > 0) {
        const result = await importNotesMutation.mutateAsync({ notes: localData.notes });
        notesImported = result.imported;
      }

      // Import preferences
      if (localData.preferences.darkMode !== undefined || localData.preferences.widgetOrder) {
        await importPrefsMutation.mutateAsync(localData.preferences);
      }

      // Clear local data after successful migration
      clearLocalData();

      // Mark as complete
      markMigrationComplete();

      // Invalidate queries to refresh data
      await utils.tasks.listAll.invalidate();
      await utils.notes.listAll.invalidate();
      await utils.preferences.get.invalidate();

      // Show success message
      toast.success(`Migration réussie !`, {
        description: `${tasksImported} tâches et ${notesImported} notes importées vers le cloud.`,
      });

    } catch (error) {
      console.error("Migration failed:", error);
      toast.error("Erreur lors de la migration", {
        description: "Vos données locales sont conservées. Réessayez plus tard.",
      });
    } finally {
      setIsMigrating(false);
    }
  }, [
    isAuthenticated,
    isMigrating,
    collectLocalData,
    importTasksMutation,
    importNotesMutation,
    importPrefsMutation,
    clearLocalData,
    markMigrationComplete,
    utils,
  ]);

  // Auto-trigger migration on first login
  useEffect(() => {
    if (!isAuthenticated || checkingCloud || !cloudStatus) return;
    if (wasMigrationDone()) return;
    if (cloudStatus.hasData) {
      // User already has cloud data, skip migration
      markMigrationComplete();
      return;
    }

    // Check if there's local data to migrate
    const localData = collectLocalData();
    if (localData.hasData) {
      migrateData();
    } else {
      markMigrationComplete();
    }
  }, [isAuthenticated, checkingCloud, cloudStatus, wasMigrationDone, collectLocalData, migrateData, markMigrationComplete]);

  return {
    isMigrating,
    migrationComplete,
    migrateData, // Manual trigger if needed
  };
}
