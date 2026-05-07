import { useSyncedPreferences } from "@/hooks/useSyncedData";
import { cn } from "@/lib/utils";
import { Navbar } from "./Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useSyncedPreferences();

  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-[#f6bfdc] transition-colors", darkMode && "dark")}>
      <div className="absolute inset-0 bg-[url('/backgrounds/background_2560x1440.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 bg-pink-50/10 backdrop-saturate-125 dark:bg-black/25" />

      <Navbar />

      <div className="relative pt-24">
        {children}
      </div>
    </div>
  );
}
