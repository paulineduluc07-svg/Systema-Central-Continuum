import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CalendarDays,
  Cloud,
  CloudOff,
  LogIn,
  LogOut,
  StickyNote,
} from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LoginModal } from "./LoginModal";

function HoloBubble({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={`animate-systema-holo flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#88eefb_0%,#77d8ff_38%,#8d7dff_70%,#ff7bd8_100%)] bg-[length:200%_200%] text-[#221133] shadow-[0_8px_18px_rgba(55,170,255,.28),inset_0_1px_0_rgba(255,255,255,.75)] ${className}`}
      title={title}
    >
      {children}
    </span>
  );
}

const PASTILLES: Array<{
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/prompt-vault", label: "Prompt Vault", icon: BookOpen },
];

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-3 z-40 flex justify-center px-4">
      <nav
        className="pointer-events-auto relative flex h-14 w-full max-w-[1400px] items-center justify-between rounded-full px-4 shadow-[0_10px_30px_rgba(120,40,90,0.18)]"
        style={{
          backgroundImage: "url(/backgrounds/navbar.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Navigation principale"
      >
        <Link href="/">
          <span className="z-10 flex shrink-0 cursor-pointer items-center transition-transform hover:scale-105">
            <img
              src="/logo-systema-agency.png"
              alt="Systema Agency"
              className="h-[62px] w-auto -translate-x-[2px] translate-y-[4px] object-contain"
              draggable={false}
            />
          </span>
        </Link>

        <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5">
          {PASTILLES.map((p) => {
            const Icon = p.icon;
            const active = location === p.href;
            return (
              <Link key={p.href} href={p.href}>
                <span
                  className="cursor-pointer"
                  title={p.label}
                  aria-label={p.label}
                  aria-current={active ? "page" : undefined}
                >
                  <HoloBubble
                    className={cn(
                      "h-9 w-9 transition hover:-translate-y-0.5 hover:scale-105",
                      active && "ring-2 ring-white/80 ring-offset-1 ring-offset-pink-200/60",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </HoloBubble>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="z-10 flex shrink-0 items-center gap-1.5 rounded-full border border-white/40 bg-white/30 px-2 py-1 backdrop-blur-sm">
          {isAuthenticated ? (
            <span title="Synchronisé" className="flex">
              <Cloud className="h-4 w-4 text-emerald-700" />
            </span>
          ) : (
            <span title="Mode local" className="flex">
              <CloudOff className="h-4 w-4 text-[#7a3b53]" />
            </span>
          )}

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="rounded-full p-1 text-[#5a1f37] transition-colors hover:bg-white/50"
              title="Déconnexion"
              type="button"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="rounded-full p-1 text-[#5a1f37] transition-colors hover:bg-white/50"
              title="Connexion"
              type="button"
            >
              <LogIn className="h-4 w-4" />
            </button>
          )}
        </div>
      </nav>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </header>
  );
}
