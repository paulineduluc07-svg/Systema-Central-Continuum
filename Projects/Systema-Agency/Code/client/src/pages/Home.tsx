import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useSyncedTasks, useSyncedPreferences } from "@/hooks/useSyncedData";
import { useDataMigration } from "@/hooks/useDataMigration";
import { usePersistedState } from "@/hooks/usePersistedState";
import { useConfig } from "@/contexts/ConfigContext";
import { AdminPanel } from "@/components/AdminPanel";
import { NotesWidget } from "@/components/widgets/NotesWidget";
import { ExportDialog } from "@/components/ExportDialog";
import { LifeCommandChat, type AvatarState } from "@/components/LifeCommandChat";
import { VisionBoard } from "@/components/vision-board/VisionBoard";
import {
  Check,
  Settings,
  Plus,
  Moon,
  Sun,
  Download,
  LogIn,
  LogOut,
  Cloud,
  CloudOff,
  Loader2,
  MessageCircle,
  Activity,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getLoginUrl } from "@/const";

// Types
interface Quest {
  id: number;
  title: string;
  completed: boolean;
}

interface Note {
  id: number;
  content: string;
}

export default function Home() {
  const { config, updateConfig } = useConfig();
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { isMigrating } = useDataMigration();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Active zone = active tab for data continuity
  const [activeZoneId, setActiveZoneId] = usePersistedState<string>(
    "active_zone",
    config.zones?.[0]?.id || "carriere"
  );

  // Life-Command Chat & Avatar state
  const [isChatOpen, setIsChatOpen] = usePersistedState<boolean>("lc_chat_open", false);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");

  // Synced preferences — force dark mode for vision board
  const { darkMode, setDarkMode } = useSyncedPreferences();

  // Synced tasks for the active zone
  const { tasks, addTask, toggleTask, updateTaskTitle, deleteTask } =
    useSyncedTasks(activeZoneId);

  // Force dark mode on mount for vision board
  useEffect(() => {
    if (!darkMode) setDarkMode(true);
  }, []);

  // Apply dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ─── Zone position management ──────────────────────────────
  // Called by VisionBoard only on drag end (not every frame — perf handled internally)
  const handleZonePositionChange = useCallback(
    (zoneId: string, x: number, y: number) => {
      const updatedZones = (config.zones || []).map((z) =>
        z.id === zoneId ? { ...z, position: { x, y } } : z
      );
      updateConfig({ ...config, zones: updatedZones });
    },
    [config, updateConfig]
  );

  const handleZoneDragEnd = useCallback(
    (_zoneId: string) => {
      // Position already flushed via handleZonePositionChange
    },
    []
  );

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  // Render zone content (tasks + notes for any zone)
  const renderZoneContent = useCallback(
    (zoneId: string) => {
      return (
        <div className="h-full flex flex-col gap-3 p-1">
          {/* Tasks section */}
          <div className="flex-1 min-h-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-pink-500">
                Tâches
              </span>
              <span className="bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                {tasks.filter((q) => q.completed).length}/{tasks.length}
              </span>
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-1">
              {tasks.length === 0 && (
                <div className="text-center py-3 text-gray-400 text-xs italic">
                  Aucune tâche
                </div>
              )}
              {tasks.map((quest) => (
                <div
                  key={quest.id}
                  className="flex items-start gap-2 p-1.5 rounded-lg bg-pink-50 border border-pink-200/60 group relative"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(quest.id);
                    }}
                    className={cn(
                      "mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0",
                      quest.completed
                        ? "bg-green-500 border-green-600 text-white"
                        : "bg-white border-pink-300"
                    )}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </button>
                  <span
                    className={cn(
                      "text-[11px] leading-tight text-gray-700 flex-1",
                      quest.completed && "line-through text-gray-400"
                    )}
                  >
                    {quest.title}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addTask("Nouvelle tâche");
              }}
              className="mt-2 w-full flex items-center justify-center gap-1 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-500 text-xs transition-colors border border-pink-200/50"
            >
              <Plus className="w-3 h-3" />
              Ajouter
            </button>
          </div>

          {/* Notes section */}
          <div className="border-t border-pink-200/50 pt-2">
            <span className="text-xs font-semibold text-pink-500 mb-1 block">
              Notes
            </span>
            <NotesWidget contextId={zoneId} />
          </div>
        </div>
      );
    },
    [tasks, addTask, toggleTask, updateTaskTitle, deleteTask]
  );

  // PDF Export (kept for compatibility)
  const handleExport = (
    selectedTabs: string[],
    includeTasks: boolean,
    includeNotes: boolean
  ) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc.setFontSize(22);
    doc.setTextColor(255, 105, 180);
    doc.text("Systema.agency - Rapport Journalier", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date : ${today}`, 14, 30);

    let yPos = 40;

    const tabsToExport = config.tabs.filter((tab) =>
      selectedTabs.includes(tab.id)
    );

    tabsToExport.forEach((tab) => {
      const storedQuests = localStorage.getItem(`rpg_quests_${tab.id}`);
      const tabQuests: Quest[] = storedQuests ? JSON.parse(storedQuests) : [];

      const storedNotes = localStorage.getItem(`rpg_notes_${tab.id}`);
      const tabNotes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];

      const hasTasks = includeTasks && tabQuests.length > 0;
      const hasNotes = includeNotes && tabNotes.length > 0;

      if (!hasTasks && !hasNotes) return;

      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text(tab.label, 14, yPos);
      yPos += 10;

      if (hasTasks) {
        const tasksData = tabQuests.map((q) => [
          q.title,
          q.completed ? "Terminé" : "À faire",
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [["Tâche", "Statut"]],
          body: tasksData,
          theme: "striped",
          headStyles: { fillColor: [255, 105, 180] },
          styles: { fontSize: 10 },
          margin: { left: 14 },
        });

        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 10;
      }

      if (hasNotes) {
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Notes :", 14, yPos);
        yPos += 7;

        tabNotes.forEach((note) => {
          doc.setFontSize(10);
          doc.setTextColor(50);
          const splitText = doc.splitTextToSize(`• ${note.content}`, 180);
          doc.text(splitText, 14, yPos);
          yPos += splitText.length * 5 + 2;
        });
        yPos += 10;
      }

      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`Rapport_Systema_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Vision Board — Main View */}
      <VisionBoard
        zones={config.zones || []}
        avatarState={avatarState}
        isChatOpen={isChatOpen}
        onChatToggle={() => setIsChatOpen(!isChatOpen)}
        darkMode={darkMode}
        renderZoneContent={renderZoneContent}
        onZonePositionChange={handleZonePositionChange}
        onZoneDragEnd={handleZoneDragEnd}
      />

      {/* Floating Toolbar — Top Right */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {/* Sync indicator */}
        <div className="shrink-0">
          {isMigrating ? (
            <div
              className="flex items-center gap-1 text-blue-400 text-xs"
              title="Migration en cours..."
            >
              <Loader2 className="w-3 h-3 animate-spin" />
            </div>
          ) : isAuthenticated ? (
            <div
              className="flex items-center gap-1 text-green-400 text-xs"
              title="Synchronisé"
            >
              <Cloud className="w-3 h-3" />
            </div>
          ) : (
            <div
              className="flex items-center gap-1 text-gray-500 text-xs"
              title="Mode hors-ligne"
            >
              <CloudOff className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Chat toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cn(
            "p-2 rounded-full border shadow-sm hover:scale-105 transition-all backdrop-blur-sm",
            isChatOpen
              ? "bg-pink-500 border-pink-500 text-white"
              : "bg-white/80 border-gray-200 text-pink-500 hover:bg-pink-50"
          )}
          title="Life-Command Chat"
        >
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* Export */}
        <button
          onClick={() => setIsExportOpen(true)}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:scale-105 transition-all"
          title="Exporter le rapport PDF"
        >
          <Download className="w-4 h-4 text-blue-500" />
        </button>

        {/* Dark/Light toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:scale-105 transition-all"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-yellow-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* Auth */}
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:scale-105 transition-all"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4 text-red-400" />
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="p-2 bg-pink-500/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-105 transition-all"
            title="Connexion"
          >
            <LogIn className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Prompt Vault */}
        <Link href="/prompt-vault">
          <button
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-cyan-200 shadow-sm hover:scale-105 transition-all"
            title="Prompt Vault"
          >
            <span className="text-sm leading-none">⬡</span>
          </button>
        </Link>

        {/* Suivi */}
        <Link href="/suivi">
          <button
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 shadow-sm hover:scale-105 transition-all"
            title="Suivi de prise"
          >
            <Activity className="w-4 h-4 text-orange-400" />
          </button>
        </Link>

        {/* Settings */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm hover:scale-105 transition-all"
        >
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Life-Command Chat Panel */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[380px] h-[520px]">
          <LifeCommandChat
            className="w-full h-full"
            onAvatarStateChange={setAvatarState}
            isOpen={isChatOpen}
            onToggle={() => setIsChatOpen(false)}
          />
        </div>
      )}

      {/* Modals */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}
