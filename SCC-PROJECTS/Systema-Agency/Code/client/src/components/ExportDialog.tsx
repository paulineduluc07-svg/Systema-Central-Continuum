import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useConfig } from "@/contexts/ConfigContext";
import { Download } from "lucide-react";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (selectedTabs: string[], includeTasks: boolean, includeNotes: boolean) => void;
}

export function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const { config } = useConfig();
  const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);

  // Initialiser avec tous les onglets sélectionnés à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setSelectedTabs(config.tabs.map(tab => tab.id));
    }
  }, [isOpen, config.tabs]);

  const handleTabToggle = (tabId: string) => {
    setSelectedTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTabs.length === config.tabs.length) {
      setSelectedTabs([]);
    } else {
      setSelectedTabs(config.tabs.map(tab => tab.id));
    }
  };

  const handleExport = () => {
    onExport(selectedTabs, includeTasks, includeNotes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1a1a19] border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Download className="w-5 h-5 text-pink-500" />
            Exporter le Rapport
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Personnalisez le contenu de votre rapport PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Section Contenu */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-200">Contenu à inclure</h4>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-tasks" 
                  checked={includeTasks} 
                  onCheckedChange={(checked) => setIncludeTasks(checked as boolean)}
                />
                <Label htmlFor="include-tasks" className="text-gray-700 dark:text-gray-300">Tâches</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-notes" 
                  checked={includeNotes} 
                  onCheckedChange={(checked) => setIncludeNotes(checked as boolean)}
                />
                <Label htmlFor="include-notes" className="text-gray-700 dark:text-gray-300">Notes</Label>
              </div>
            </div>
          </div>

          {/* Section Onglets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-200">Onglets à exporter</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSelectAll}
                className="h-auto p-0 text-xs text-pink-500 hover:text-pink-600 hover:bg-transparent"
              >
                {selectedTabs.length === config.tabs.length ? "Tout désélectionner" : "Tout sélectionner"}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {config.tabs.map((tab) => (
                <div key={tab.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tab-${tab.id}`} 
                    checked={selectedTabs.includes(tab.id)}
                    onCheckedChange={() => handleTabToggle(tab.id)}
                  />
                  <Label htmlFor={`tab-${tab.id}`} className="text-gray-700 dark:text-gray-300 truncate">
                    {tab.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="dark:bg-transparent dark:text-gray-300 dark:border-gray-700">
            Annuler
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={selectedTabs.length === 0 || (!includeTasks && !includeNotes)}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Générer le PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
