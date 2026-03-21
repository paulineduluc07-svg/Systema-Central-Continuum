"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AvatarStage } from "@/components/avatar/AvatarStage";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ToolList } from "@/components/sidebar/ToolList";
import { InfoCards } from "@/components/sidebar/InfoCards";

export default function Home() {
  return (
    <AppShell>
      <div className="flex gap-4 flex-1" style={{ minHeight: "calc(100vh - 120px)" }}>
        {/* Left sidebar: avatar + info */}
        <aside className="hidden lg:flex flex-col gap-3 w-60 shrink-0">
          <AvatarStage />
          <InfoCards />
        </aside>

        {/* Main: chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatPanel />
        </div>

        {/* Right sidebar: tools */}
        <aside className="hidden xl:flex flex-col gap-3 w-52 shrink-0">
          <ToolList />
        </aside>
      </div>
    </AppShell>
  );
}