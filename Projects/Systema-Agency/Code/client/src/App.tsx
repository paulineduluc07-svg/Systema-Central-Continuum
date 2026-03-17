import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import { PasswordGate } from "./components/PasswordGate";
import Home from "./pages/Home";
import { SuiviPage } from "./pages/Suivi";
import DrawnByFateLanding from "./pages/drawn-by-fate/DrawnByFateLanding";
import DrawnByFateReading from "./pages/drawn-by-fate/DrawnByFateReading";
import DrawnByFateBook from "./pages/drawn-by-fate/DrawnByFateBook";
import DrawnByFateGuide from "./pages/drawn-by-fate/DrawnByFateGuide";
import DrawnByFateMonTirage from "./pages/drawn-by-fate/DrawnByFateMonTirage";
import PromptVault from "./pages/PromptVault";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/suivi"} component={SuiviPage} />
      {/* Drawn by Fate — Tarot site */}
      <Route path={"/drawn-by-fate"} component={DrawnByFateLanding} />
      <Route path={"/drawn-by-fate/reading"} component={DrawnByFateReading} />
      <Route path={"/drawn-by-fate/book"} component={DrawnByFateBook} />
      <Route path={"/drawn-by-fate/guide"} component={DrawnByFateGuide} />
      <Route path={"/drawn-by-fate/mon-tirage"} component={DrawnByFateMonTirage} />
      <Route path={"/prompt-vault"} component={PromptVault} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <PasswordGate>
        <ConfigProvider>
          <ThemeProvider
            defaultTheme="light"
            // switchable
          >
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </ConfigProvider>
      </PasswordGate>
    </ErrorBoundary>
  );
}

export default App;
