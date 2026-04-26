import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Cloud, CloudOff, LogIn, LogOut, BookOpen, Activity } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LoginModal } from "./LoginModal";

export function Navbar() {
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const navLinks = [
    { href: "/prompt-vault", label: "Prompt Vault", icon: BookOpen },
    { href: "/suivi", label: "Suivi", icon: Activity },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-center px-4">
      <nav className="flex w-full max-w-7xl items-center justify-between rounded-full border border-white/30 bg-white/20 px-4 py-2 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/20">
        <div className="flex items-center gap-6">
          <Link href="/">
            <span className="cursor-pointer text-xl font-bold tracking-tight text-white drop-shadow-sm">
              Systema Agency
            </span>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2 py-1">
            {isAuthenticated ? (
              <Cloud className="h-4 w-4 text-emerald-300" title="Synchronisé" />
            ) : (
              <CloudOff className="h-4 w-4 text-white/65" title="Mode local" />
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
        </div>
      </nav>

      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </header>
  );
}
