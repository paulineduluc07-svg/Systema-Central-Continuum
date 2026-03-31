import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ConfigProvider } from "./contexts/ConfigContext";

const Home = lazy(() => import("./pages/Home"));
const SuiviPage = lazy(async () => {
  const module = await import("./pages/Suivi");
  return { default: module.SuiviPage };
});
const PromptVault = lazy(() => import("./pages/PromptVault"));

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#faf7ff] flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-[#eadff9] bg-white/90 shadow-sm p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2ecff]">
          <Loader2 className="h-6 w-6 animate-spin text-[#7a4fe0]" />
        </div>
        <p className="text-sm font-medium text-[#2b223f]">Chargement de la page…</p>
        <p className="mt-1 text-xs text-[#6f5f92]">Systema Agency prépare ton espace.</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/suivi"} component={SuiviPage} />
        <Route path={"/prompt-vault"} component={PromptVault} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
