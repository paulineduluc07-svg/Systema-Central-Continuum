import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";

// Types
interface Task {
  id: number;
  tabId: string;
  title: string;
  completed: boolean;
  sortOrder: number;
}

interface Note {
  id: number;
  tabId: string;
  content: string;
  sortOrder: number;
}

// Hook for synced tasks
export function useSyncedTasks(tabId: string) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  
  // Query tasks from server
  const { data: serverTasks, isLoading, refetch } = trpc.tasks.list.useQuery(
    { tabId },
    { enabled: isAuthenticated }
  );

  // Mutations
  const createMutation = trpc.tasks.create.useMutation({
    onSuccess: () => utils.tasks.list.invalidate({ tabId }),
  });
  
  const updateMutation = trpc.tasks.update.useMutation({
    onSuccess: () => utils.tasks.list.invalidate({ tabId }),
  });
  
  const deleteMutation = trpc.tasks.delete.useMutation({
    onSuccess: () => utils.tasks.list.invalidate({ tabId }),
  });

  // Local state for offline/non-authenticated mode
  const [localTasks, setLocalTasks] = useState<Task[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`rpg_quests_${tabId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((t: any, i: number) => ({
          id: parseInt(t.id) || i,
          tabId,
          title: t.title,
          completed: t.completed,
          sortOrder: i,
        }));
      } catch { return []; }
    }
    return [];
  });

  // Use server data if authenticated, otherwise local
  const tasks = isAuthenticated && serverTasks ? serverTasks : localTasks;

  const addTask = useCallback(async (title: string) => {
    if (isAuthenticated) {
      await createMutation.mutateAsync({ tabId, title, sortOrder: tasks.length });
    } else {
      const newTask: Task = {
        id: Date.now(),
        tabId,
        title,
        completed: false,
        sortOrder: localTasks.length,
      };
      const updated = [...localTasks, newTask];
      setLocalTasks(updated);
      localStorage.setItem(`rpg_quests_${tabId}`, JSON.stringify(updated.map(t => ({
        id: t.id.toString(),
        title: t.title,
        completed: t.completed,
      }))));
    }
  }, [isAuthenticated, tabId, tasks.length, localTasks, createMutation]);

  const toggleTask = useCallback(async (id: number) => {
    if (isAuthenticated) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateMutation.mutateAsync({ id, completed: !task.completed });
      }
    } else {
      const updated = localTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      setLocalTasks(updated);
      localStorage.setItem(`rpg_quests_${tabId}`, JSON.stringify(updated.map(t => ({
        id: t.id.toString(),
        title: t.title,
        completed: t.completed,
      }))));
    }
  }, [isAuthenticated, tasks, localTasks, tabId, updateMutation]);

  const updateTaskTitle = useCallback(async (id: number, title: string) => {
    if (isAuthenticated) {
      await updateMutation.mutateAsync({ id, title });
    } else {
      const updated = localTasks.map(t => t.id === id ? { ...t, title } : t);
      setLocalTasks(updated);
      localStorage.setItem(`rpg_quests_${tabId}`, JSON.stringify(updated.map(t => ({
        id: t.id.toString(),
        title: t.title,
        completed: t.completed,
      }))));
    }
  }, [isAuthenticated, localTasks, tabId, updateMutation]);

  const deleteTask = useCallback(async (id: number) => {
    if (isAuthenticated) {
      await deleteMutation.mutateAsync({ id });
    } else {
      const updated = localTasks.filter(t => t.id !== id);
      setLocalTasks(updated);
      localStorage.setItem(`rpg_quests_${tabId}`, JSON.stringify(updated.map(t => ({
        id: t.id.toString(),
        title: t.title,
        completed: t.completed,
      }))));
    }
  }, [isAuthenticated, localTasks, tabId, deleteMutation]);

  return {
    tasks,
    isLoading,
    addTask,
    toggleTask,
    updateTaskTitle,
    deleteTask,
    refetch,
  };
}

// Hook for synced notes
export function useSyncedNotes(tabId: string) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: serverNotes, isLoading, refetch } = trpc.notes.list.useQuery(
    { tabId },
    { enabled: isAuthenticated }
  );

  const createMutation = trpc.notes.create.useMutation({
    onSuccess: () => utils.notes.list.invalidate({ tabId }),
  });
  
  const updateMutation = trpc.notes.update.useMutation({
    onSuccess: () => utils.notes.list.invalidate({ tabId }),
  });
  
  const deleteMutation = trpc.notes.delete.useMutation({
    onSuccess: () => utils.notes.list.invalidate({ tabId }),
  });

  const [localNotes, setLocalNotes] = useState<Note[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(`rpg_notes_${tabId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((n: any, i: number) => ({
          id: parseInt(n.id) || i,
          tabId,
          content: n.content,
          sortOrder: i,
        }));
      } catch { return []; }
    }
    return [];
  });

  const notes = isAuthenticated && serverNotes ? serverNotes : localNotes;

  const addNote = useCallback(async (content: string) => {
    if (isAuthenticated) {
      await createMutation.mutateAsync({ tabId, content, sortOrder: notes.length });
    } else {
      const newNote: Note = {
        id: Date.now(),
        tabId,
        content,
        sortOrder: localNotes.length,
      };
      const updated = [...localNotes, newNote];
      setLocalNotes(updated);
      localStorage.setItem(`rpg_notes_${tabId}`, JSON.stringify(updated.map(n => ({
        id: n.id.toString(),
        content: n.content,
      }))));
    }
  }, [isAuthenticated, tabId, notes.length, localNotes, createMutation]);

  const updateNote = useCallback(async (id: number, content: string) => {
    if (isAuthenticated) {
      await updateMutation.mutateAsync({ id, content });
    } else {
      const updated = localNotes.map(n => n.id === id ? { ...n, content } : n);
      setLocalNotes(updated);
      localStorage.setItem(`rpg_notes_${tabId}`, JSON.stringify(updated.map(n => ({
        id: n.id.toString(),
        content: n.content,
      }))));
    }
  }, [isAuthenticated, localNotes, tabId, updateMutation]);

  const deleteNote = useCallback(async (id: number) => {
    if (isAuthenticated) {
      await deleteMutation.mutateAsync({ id });
    } else {
      const updated = localNotes.filter(n => n.id !== id);
      setLocalNotes(updated);
      localStorage.setItem(`rpg_notes_${tabId}`, JSON.stringify(updated.map(n => ({
        id: n.id.toString(),
        content: n.content,
      }))));
    }
  }, [isAuthenticated, localNotes, tabId, deleteMutation]);

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
    refetch,
  };
}

// Hook for synced preferences
export function useSyncedPreferences() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: serverPrefs, isLoading } = trpc.preferences.get.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const updateMutation = trpc.preferences.update.useMutation({
    onSuccess: () => utils.preferences.get.invalidate(),
  });

  const [localDarkMode, setLocalDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('app_dark_mode');
    return stored === 'true';
  });

  const darkMode = isAuthenticated && serverPrefs ? serverPrefs.darkMode : localDarkMode;

  const setDarkMode = useCallback(async (value: boolean) => {
    if (isAuthenticated) {
      await updateMutation.mutateAsync({ darkMode: value });
    } else {
      setLocalDarkMode(value);
      localStorage.setItem('app_dark_mode', value.toString());
    }
  }, [isAuthenticated, updateMutation]);

  return {
    darkMode,
    setDarkMode,
    isLoading,
  };
}
