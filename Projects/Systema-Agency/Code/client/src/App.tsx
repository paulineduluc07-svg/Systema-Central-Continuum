import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
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

function Router() {
  return (
    <Suspense fallback={null}>
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
