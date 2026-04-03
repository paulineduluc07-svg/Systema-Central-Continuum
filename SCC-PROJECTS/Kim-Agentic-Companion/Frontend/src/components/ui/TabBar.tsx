import clsx from "clsx";

export interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex gap-1 p-1 bg-[rgba(7,10,24,0.45)] border border-[rgba(179,188,251,0.2)] rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            "flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-gradient-to-r from-[#ff5f7c] to-[#ff9f74] text-white"
              : "text-[#a8aed3] hover:text-[#f4f3ff] hover:bg-white/5"
          )}
        >
          {tab.icon && <span className="mr-1">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}