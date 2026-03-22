"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ToolList } from "@/components/sidebar/ToolList";
import { InfoCards } from "@/components/sidebar/InfoCards";
import { TabBar, type Tab } from "@/components/ui/TabBar";
import { MemoryPanel } from "@/components/memory/MemoryPanel";
import { ProfilePanel } from "@/components/profile/ProfilePanel";
import { ActivitiesPanel } from "@/components/activities/ActivitiesPanel";
import { DiaryPanel } from "@/components/diary/DiaryPanel";
import { WardrobePanel } from "@/components/wardrobe/WardrobePanel";

const TABS: Tab[] = [
  { id: "chat",       label: "Chat"       },
  { id: "memory",     label: "Memory"     },
  { id: "profile",    label: "Profile"    },
  { id: "activities", label: "Activities" },
  { id: "diary",      label: "Diary"      },
  { id: "wardrobe",   label: "Wardrobe"   },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat");
  const [wardrobeOpen, setWardrobeOpen] = useState(false);

  return (
    <AppShell>
      <div className="flex-1 flex flex-col gap-4">
        {/* Tab content */}
        <div className="flex-1" style={{ minHeight: "calc(100vh - 180px)" }}>
          {activeTab === "chat" && (
            <div className="flex gap-4 h-full">
              {/* Left sidebar — info cards (avatar now lives in 3D scene) */}
              <aside className="hidden lg:flex flex-col gap-3 w-60 shrink-0">
                <InfoCards />
              </aside>
              {/* Main chat panel */}
              <div className="flex-1 flex flex-col min-w-0">
                <ChatPanel />
              </div>
              {/* Right sidebar — tools */}
              <aside className="hidden xl:flex flex-col gap-3 w-52 shrink-0">
                <ToolList />
              </aside>
            </div>
          )}
          {activeTab === "memory"     && <MemoryPanel />}
          {activeTab === "profile"    && <ProfilePanel />}
          {activeTab === "activities" && <ActivitiesPanel />}
          {activeTab === "diary"      && <DiaryPanel />}
          {activeTab === "wardrobe"   && (
            <div className="flex justify-end">
              <button
                onClick={() => setWardrobeOpen(true)}
                className="px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 text-sm font-medium hover:bg-pink-500/30 transition-colors"
              >
                👗 Open Wardrobe
              </button>
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "wardrobe") setWardrobeOpen(true);
        }} />
      </div>

      {/* Wardrobe slide-in panel */}
      <WardrobePanel open={wardrobeOpen} onClose={() => setWardrobeOpen(false)} />
    </AppShell>
  );
}