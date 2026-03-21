"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { TopNav } from "./TopNav";
import { useAuth } from "@/hooks/useAuth";

// Load 3D scene client-side only (Canvas cannot run on server)
const GalaxyScene = dynamic(
  () => import("@/components/scene/GalaxyScene").then((m) => ({ default: m.GalaxyScene })),
  { ssr: false }
);

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      {/* 3D galaxy scene — fixed fullscreen background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "linear-gradient(160deg, #050714, #13182f)" }}
      >
        <GalaxyScene className="w-full h-full" />
      </div>

      {/* UI overlay */}
      <div className="relative z-10 max-w-[1280px] mx-auto p-4 min-h-screen flex flex-col gap-4">
        <TopNav isAuthenticated={isAuthenticated} onLogout={logout} />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </>
  );
}
