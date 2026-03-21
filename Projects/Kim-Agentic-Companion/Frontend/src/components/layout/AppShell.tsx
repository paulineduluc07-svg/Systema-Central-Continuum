"use client";

import type { ReactNode } from "react";
import { CosmosBackground } from "./CosmosBackground";
import { TopNav } from "./TopNav";
import { useAuth } from "@/hooks/useAuth";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      <CosmosBackground />
      <div className="relative z-10 max-w-[1280px] mx-auto p-4 min-h-screen flex flex-col gap-4">
        <TopNav isAuthenticated={isAuthenticated} onLogout={logout} />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </>
  );
}