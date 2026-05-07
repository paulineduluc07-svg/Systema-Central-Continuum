import { useSyncedPreferences } from "@/hooks/useSyncedData";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { Navbar } from "./Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useSyncedPreferences();
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-[#f6bfdc] transition-colors", darkMode && "dark")}>
      <div className="absolute inset-0 bg-[url('/backgrounds/background-05-06.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 bg-pink-50/10 backdrop-saturate-125 dark:bg-black/25" />

      {!isHome && <Navbar />}

      <div className={cn("relative", !isHome && "pt-20")}>
        {children}
      </div>
    </div>
  );
}
