import { useAuth } from "@/_core/hooks/useAuth";
import { getCustomTabIcon, normalizeTabColor } from "@/lib/customTabIcons";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Cloud, CloudOff, LogIn, LogOut, BookOpen, Activity, Menu, X, Sparkles, StickyNote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { LoginModal } from "./LoginModal";

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const customTabsQuery = trpc.customTabs.list.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
  });

  const navLinks = [
    { href: "/kim", label: "Kim", icon: Sparkles },
    { href: "/notes", label: "Notes", icon: StickyNote },
    { href: "/prompt-vault", label: "Prompt Vault", icon: BookOpen },
    { href: "/suivi", label: "Suivi", icon: Activity },
  ];
  const customLinks = (customTabsQuery.data ?? []).map((tab) => ({
    href: `/tab/${encodeURIComponent(tab.tabId)}`,
    label: tab.label,
    icon: getCustomTabIcon(tab.icon),
    color: normalizeTabColor(tab.color),
    id: tab.id,
  }));

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-center px-4 pointer-events-none">
      <nav className="relative flex w-full max-w-7xl items-center justify-between rounded-full border border-white/30 bg-white/20 px-4 py-2 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/20 pointer-events-auto">
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="cursor-pointer text-xl font-bold tracking-tight text-white drop-shadow-sm">
              Systema Agency
            </span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={cn(
                  "cursor-pointer text-sm font-medium transition-colors hover:text-white",
                  location === link.href ? "text-white underline decoration-white/50 underline-offset-4" : "text-white/70"
                )}>
                  {link.label}
                </span>
              </Link>
            ))}
            {customLinks.map((link) => {
              const Icon = link.icon;
              const active = location === link.href;
              return (
                <Link key={link.id} href={link.href}>
                  <span
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-medium transition-colors hover:bg-white/20 hover:text-white",
                      active
                        ? "border-white/50 bg-white/20 text-white"
                        : "border-white/15 bg-white/5 text-white/75"
                    )}
                    style={{ boxShadow: active ? `inset 0 -2px 0 ${link.color}` : undefined }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: link.color }} />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2 py-1">
            {isAuthenticated ? (
              <span title="Synchronisé" className="flex">
                <Cloud className="h-4 w-4 text-emerald-300" />
              </span>
            ) : (
              <span title="Mode local" className="flex">
                <CloudOff className="h-4 w-4 text-white/65" />
              </span>
            )}

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="rounded-full p-1 text-white/85 transition-colors hover:bg-white/20"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="rounded-full p-1 text-white/85 transition-colors hover:bg-white/20"
                title="Connexion"
              >
                <LogIn className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            className="rounded-full border border-white/20 bg-white/10 p-1.5 text-white/85 transition-colors hover:bg-white/20 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute left-2 right-2 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-white/40 bg-white/70 p-2 shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-black/70 md:hidden"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <span
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-slate-900/10 text-slate-900 dark:bg-white/20 dark:text-white"
                        : "text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </span>
                </Link>
              );
            })}
            {customLinks.map((link) => {
              const Icon = link.icon;
              const active = location === link.href;
              return (
                <Link key={link.id} href={link.href}>
                  <span
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-slate-900/10 text-slate-900 dark:bg-white/20 dark:text-white"
                        : "text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" style={{ color: link.color }} />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </header>
  );
}
