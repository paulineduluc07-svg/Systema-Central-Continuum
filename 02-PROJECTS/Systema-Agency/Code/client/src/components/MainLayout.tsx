import { useSyncedPreferences } from "@/hooks/useSyncedData";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { Navbar } from "./Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useSyncedPreferences();
  const [location] = useLocation();
  const isHome = location === "/";

  return (
    <div className={cn("relative min-h-screen overflow-hidden transition-colors", darkMode && "dark")}>
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,#ffd6e8_0%,#e8dff7_30%,#c6c2dd_58%,#9f98b6_78%,#8e879f_100%)] dark:bg-[radial-gradient(circle_at_12%_18%,#35142d_0%,#23192e_35%,#171828_70%,#11111c_100%)]" />
      <div className="absolute -left-16 top-12 h-52 w-52 rounded-full bg-[#ffd7d4]/55 blur-3xl dark:bg-[#78408c]/35" />
      <div className="absolute right-10 top-14 h-40 w-40 rounded-full bg-[#ffe6b8]/40 blur-3xl dark:bg-[#8f6d35]/30" />
      <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-[#fff2d8]/40 blur-3xl dark:bg-[#5f3e77]/25" />

      {!isHome && <Navbar />}

      {/* Main Content */}
      <div className={cn("relative", !isHome && "pt-20")}>
        {children}
      </div>
    </div>
  );
}
