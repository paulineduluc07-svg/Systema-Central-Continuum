import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import { reportFrontendError, setupGlobalErrorMonitoring } from "./lib/observability";
import "./index.css";

const queryClient = new QueryClient();

const setupAnalyticsScript = () => {
  if (typeof document === "undefined") return;

  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();

  if (!endpoint || !websiteId) return;
  if (document.querySelector('script[data-systema-analytics="umami"]')) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = `${endpoint.replace(/\/+$/, "")}/umami`;
  script.dataset.websiteId = websiteId;
  script.dataset.systemaAnalytics = "umami";
  document.body.appendChild(script);
};

const redirectToLoginIfUnauthorized = (error: unknown): boolean => {
  if (!(error instanceof TRPCClientError)) return false;
  if (typeof window === "undefined") return false;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return false;

  const loginUrl = getLoginUrl();
  // Don't redirect if no login route is configured (offline/local mode)
  if (!loginUrl) return false;

  window.location.href = loginUrl;
  return true;
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    const redirected = redirectToLoginIfUnauthorized(error);
    if (!redirected) {
      reportFrontendError("trpc.query", error, {
        queryKey: event.query.queryKey,
      });
    }
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    const redirected = redirectToLoginIfUnauthorized(error);
    if (!redirected) {
      reportFrontendError("trpc.mutation", error, {
        mutationKey: event.mutation.options.mutationKey,
      });
    }
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

setupAnalyticsScript();
setupGlobalErrorMonitoring();

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
