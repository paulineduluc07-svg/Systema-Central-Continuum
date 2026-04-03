import { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { X, Plus, Trash2, RotateCcw, Save, Layout, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "widgets" | "whiteboard";

interface CustomTab {
  id: number;
  tabId: string;
  label: string;
  color: string;
  icon: string;
  tabType: TabType;
  sortOrder: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { config, updateConfig, resetConfig } = useConfig();
  const { isAuthenticated } = useAuth();
  const [localConfig, setLocalConfig] = useState(config);
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
  const [pendingChanges, setPendingChanges] = useState(false);

  // Fetch custom tabs from server
  const { data: serverTabs, refetch: refetchTabs } = trpc.customTabs.list.useQuery(
    undefined,
    { enabled: isAuthenticated && isOpen }
  );

  // Mutations
  const createTabMutation = trpc.customTabs.create.useMutation();
  const updateTabMutation = trpc.customTabs.update.useMutation();
  const deleteTabMutation = trpc.customTabs.delete.useMutation();

  // Sync server tabs with local state
  useEffect(() => {
    if (serverTabs) {
      setCustomTabs(serverTabs.map(t => ({
        ...t,
        tabType: t.tabType as TabType,
      })));
    }
  }, [serverTabs]);

  if (!isOpen) return null;

  const handleSave = async () => {
    // Save local config (theme, default tabs)
    updateConfig(localConfig);

    // Save custom tabs to server if authenticated
    if (isAuthenticated) {
      try {
        // Process deletions
        const deletedTabs = customTabs.filter(t => t.isDeleted && !t.isNew);
        for (const tab of deletedTabs) {
          await deleteTabMutation.mutateAsync({ id: tab.id });
        }

        // Process new tabs
        const newTabs = customTabs.filter(t => t.isNew && !t.isDeleted);
        for (const tab of newTabs) {
          await createTabMutation.mutateAsync({
            tabId: tab.tabId,
            label: tab.label,
            color: tab.color,
            icon: tab.icon,
            tabType: tab.tabType,
            sortOrder: tab.sortOrder,
          });
        }

        // Process updates (existing tabs that are not deleted)
        const updatedTabs = customTabs.filter(t => !t.isNew && !t.isDeleted);
        for (const tab of updatedTabs) {
          await updateTabMutation.mutateAsync({
            id: tab.id,
            label: tab.label,
            color: tab.color,
            icon: tab.icon,
            sortOrder: tab.sortOrder,
          });
        }

        await refetchTabs();
        toast.success("Paramètres sauvegardés !");
      } catch (error) {
        toast.error("Erreur lors de la sauvegarde");
        console.error(error);
      }
    }

    onClose();
  };

  const handleColorChange = (key: keyof typeof config.theme, value: string) => {
    setLocalConfig({
      ...localConfig,
      theme: { ...localConfig.theme, [key]: value }
    });
  };

  // Default tabs management
  const addTab = () => {
    const newId = `tab-${Date.now()}`;
    setLocalConfig({
      ...localConfig,
      tabs: [...localConfig.tabs, { id: newId, label: "New Tab", color: "bg-gray-500" }]
    });
  };

  const removeTab = (id: string) => {
    setLocalConfig({
      ...localConfig,
      tabs: localConfig.tabs.filter(t => t.id !== id)
    });
  };

  const updateTab = (id: string, field: string, value: string) => {
    setLocalConfig({
      ...localConfig,
      tabs: localConfig.tabs.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  // Custom tabs management (cloud-synced)
  const addCustomTab = (type: TabType) => {
    const newTabId = `custom-${Date.now()}`;
    const newTab: CustomTab = {
      id: Date.now(), // Temporary ID
      tabId: newTabId,
      label: type === "whiteboard" ? "Nouveau Canvas" : "Nouvel Onglet",
      color: "#FF69B4",
      icon: type === "whiteboard" ? "pen-tool" : "layout",
      tabType: type,
      sortOrder: customTabs.length,
      isNew: true,
    };
    setCustomTabs([...customTabs, newTab]);
    setPendingChanges(true);
  };

  const removeCustomTab = (tabId: string) => {
    setCustomTabs(customTabs.map(t => 
      t.tabId === tabId ? { ...t, isDeleted: true } : t
    ));
    setPendingChanges(true);
  };

  const updateCustomTab = (tabId: string, field: keyof CustomTab, value: string) => {
    setCustomTabs(customTabs.map(t => 
      t.tabId === tabId ? { ...t, [field]: value } : t
    ));
    setPendingChanges(true);
  };

  const visibleCustomTabs = customTabs.filter(t => !t.isDeleted);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-gray-800 dark:border-gray-600 flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b-2 border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="font-display font-bold text-2xl text-gray-800 dark:text-gray-100">Paramètres</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Custom Tabs Section (Cloud-synced) */}
          {isAuthenticated && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  ✨ Mes Espaces Personnalisés
                </h3>
              </div>
              
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => addCustomTab("whiteboard")}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <PenTool className="w-4 h-4" /> Tableau Blanc
                </button>
                <button 
                  onClick={() => addCustomTab("widgets")}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Layout className="w-4 h-4" /> Widgets
                </button>
              </div>

              <div className="space-y-3">
                {visibleCustomTabs.map((tab) => (
                  <div key={tab.tabId} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div 
                      className="w-4 h-10 rounded-lg" 
                      style={{ backgroundColor: tab.color }}
                    />
                    <div className="flex-1 space-y-1">
                      <input 
                        value={tab.label}
                        onChange={(e) => updateCustomTab(tab.tabId, 'label', e.target.value)}
                        className="w-full bg-transparent font-bold text-gray-700 dark:text-gray-200 outline-none border-b border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                        placeholder="Nom de l'onglet"
                      />
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          tab.tabType === "whiteboard" 
                            ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" 
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        )}>
                          {tab.tabType === "whiteboard" ? "Canvas" : "Widgets"}
                        </span>
                        <input 
                          type="color" 
                          value={tab.color}
                          onChange={(e) => updateCustomTab(tab.tabId, 'color', e.target.value)}
                          className="w-6 h-6 rounded cursor-pointer border border-gray-200 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeCustomTab(tab.tabId)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {visibleCustomTabs.length === 0 && (
                  <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                    Créez votre premier espace personnalisé !
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Theme Section */}
          <section>
            <h3 className="font-display font-bold text-lg text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2">
              🎨 Couleurs du Thème
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Primaire (Rose)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={localConfig.theme.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600 p-1"
                  />
                  <input 
                    type="text" 
                    value={localConfig.theme.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-2 font-mono text-sm uppercase bg-transparent dark:text-gray-200"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Secondaire (Jaune)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={localConfig.theme.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600 p-1"
                  />
                  <input 
                    type="text" 
                    value={localConfig.theme.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-2 font-mono text-sm uppercase bg-transparent dark:text-gray-200"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Arrière-plan</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={localConfig.theme.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600 p-1"
                  />
                  <input 
                    type="text" 
                    value={localConfig.theme.background}
                    onChange={(e) => handleColorChange('background', e.target.value)}
                    className="flex-1 border-2 border-gray-200 dark:border-gray-600 rounded-lg px-2 font-mono text-sm uppercase bg-transparent dark:text-gray-200"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Default Tabs Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display font-bold text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
                📑 Onglets par Défaut
              </h3>
              <button 
                onClick={addTab}
                className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            </div>
            
            <div className="space-y-3">
              {localConfig.tabs.map((tab) => (
                <div key={tab.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className={cn("w-4 h-10 rounded-lg", tab.color)}></div>
                  <div className="flex-1 space-y-1">
                    <input 
                      value={tab.label}
                      onChange={(e) => updateTab(tab.id, 'label', e.target.value)}
                      className="w-full bg-transparent font-bold text-gray-700 dark:text-gray-200 outline-none border-b border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                      placeholder="Nom de l'onglet"
                    />
                    <select 
                      value={tab.color}
                      onChange={(e) => updateTab(tab.id, 'color', e.target.value)}
                      className="text-xs bg-transparent text-gray-500 dark:text-gray-400 outline-none"
                    >
                      <option value="bg-pink-500">Rose</option>
                      <option value="bg-yellow-500">Jaune</option>
                      <option value="bg-orange-500">Orange</option>
                      <option value="bg-cyan-500">Cyan</option>
                      <option value="bg-purple-500">Violet</option>
                      <option value="bg-green-500">Vert</option>
                      <option value="bg-red-500">Rouge</option>
                      <option value="bg-blue-500">Bleu</option>
                      <option value="bg-gray-500">Gris</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => removeTab(tab.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Reset Button */}
          <section className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => {
                if(confirm("Réinitialiser tous les paramètres ?")) {
                  resetConfig();
                  setLocalConfig(config);
                  onClose();
                }
              }}
              className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Réinitialiser
            </button>
          </section>

          {/* Data Management Section */}
          <section className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-display font-bold text-lg text-gray-600 dark:text-gray-300 mb-4">💾 Gestion des Données</h3>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", "rpg_dashboard_config.json");
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
                className="flex-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                Exporter
              </button>
              <label className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-center cursor-pointer">
                Importer
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedConfig = JSON.parse(event.target?.result as string);
                        updateConfig(importedConfig);
                        setLocalConfig(importedConfig);
                        toast.success("Configuration importée !");
                      } catch (err) {
                        toast.error("Fichier de configuration invalide");
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky bottom-0 rounded-b-3xl flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 bg-gray-800 dark:bg-pink-600 text-white font-bold rounded-xl hover:bg-black dark:hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-300 dark:shadow-pink-900/30"
          >
            <Save className="w-5 h-5" /> Sauvegarder
          </button>
        </div>

      </div>
    </div>
  );
}
