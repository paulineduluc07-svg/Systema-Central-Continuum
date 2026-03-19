import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import Home from "./pages/Home";
import { SuiviPage } from "./pages/Suivi";
import DrawnByFateLanding from "./pages/drawn-by-fate/DrawnByFateLanding";
import DrawnByFateReading from "./pages/drawn-by-fate/DrawnByFateReading";
import DrawnByFateBook from "./pages/drawn-by-fate/DrawnByFateBook";
import DrawnByFateGuide from "./pages/drawn-by-fate/DrawnByFateGuide";
import DrawnByFateMonTirage from "./pages/drawn-by-fate/DrawnByFateMonTirage";
import PromptVault from "./pages/PromptVault";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/suivi"} component={SuiviPage} />
      <Route path={"/drawn-by-fate"} component={DrawnByFateLanding} />
      <Route path={"/drawn-by-fate/reading"} component={DrawnByFateReading} />
      <Route path={"/drawn-by-fate/book"} component={DrawnByFateBook} />
      <Route path={"/drawn-by-fate/guide"} component={DrawnByFateGuide} />
      <Route path={"/drawn-by-fate/mon-tirage"} component={DrawnByFateMonTirage} />
      <Route path={"/prompt-vault"} component={PromptVault} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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