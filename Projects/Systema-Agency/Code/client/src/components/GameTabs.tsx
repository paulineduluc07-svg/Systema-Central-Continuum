import { cn } from "@/lib/utils";
import { PenTool, Layout, FileText, Target, Package, Sparkles, Map } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  color: string; // Tailwind color class prefix e.g. "bg-pink-400" or hex color
  tabType?: "widgets" | "whiteboard";
  icon?: string;
}

interface GameTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

// Icon mapping for custom tabs
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "pen-tool": PenTool,
  "layout": Layout,
  "file": FileText,
  "target": Target,
  "package": Package,
  "sparkles": Sparkles,
  "map": Map,
};

export function GameTabs({ tabs, activeTab, onTabChange }: GameTabsProps) {
  return (
    <div className="flex w-full overflow-x-auto no-scrollbar gap-2 px-4 pt-2 pb-1 snap-x snap-mandatory">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHexColor = tab.color.startsWith('#');
        const IconComponent = tab.icon ? iconMap[tab.icon] : null;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-5 py-3 rounded-t-2xl font-display font-bold text-sm sm:text-base transition-all duration-200 flex-shrink-0 snap-start flex items-center gap-2",
              "border-t-2 border-x-2 border-white/50",
              isActive 
                ? "translate-y-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] pb-4" 
                : "translate-y-2 opacity-80 hover:translate-y-1 hover:opacity-100 pb-2",
              !isHexColor && tab.color,
              isActive ? "text-white" : "text-white/90"
            )}
            style={{
              marginBottom: isActive ? '-2px' : '0',
              ...(isHexColor ? { backgroundColor: tab.color } : {})
            }}
          >
            {IconComponent && <IconComponent className="w-4 h-4" />}
            {tab.label}
            {tab.tabType === "whiteboard" && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
      {/* Spacer to allow scrolling last item into view */}
      <div className="w-4 flex-shrink-0" />
    </div>
  );
}
