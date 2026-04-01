import { useAuth } from "@/_core/hooks/useAuth";
import { useIsFetching, useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

type SyncStatusPhase = "local" | "syncing" | "synced" | "error";

type SyncStatus = {
  phase: SyncStatusPhase;
  label: string;
  detail: string;
};

function formatTime(timestamp: number | null): string {
  if (!timestamp) return "Jamais";
  return new Date(timestamp).toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getLatestSuccessTimestamp(queryClient: ReturnType<typeof useQueryClient>): number | null {
  let latest = 0;

  for (const query of queryClient.getQueryCache().getAll()) {
    const dataUpdatedAt = query.state.dataUpdatedAt ?? 0;
    if (query.state.status === "success" && dataUpdatedAt > latest) {
      latest = dataUpdatedAt;
    }
  }

  for (const mutation of queryClient.getMutationCache().getAll()) {
    const mutationState = mutation.state as {
      status?: string;
      dataUpdatedAt?: number;
      submittedAt?: number;
    };
    if (mutationState.status !== "success") continue;
    const completedAt = mutationState.dataUpdatedAt ?? mutationState.submittedAt ?? 0;
    if (completedAt > latest) {
      latest = completedAt;
    }
  }

  return latest > 0 ? latest : null;
}

function getLatestErrorTimestamp(queryClient: ReturnType<typeof useQueryClient>): number | null {
  let latest = 0;

  for (const query of queryClient.getQueryCache().getAll()) {
    const queryState = query.state as { status?: string; errorUpdatedAt?: number };
    if (queryState.status !== "error") continue;
    const updatedAt = queryState.errorUpdatedAt ?? 0;
    if (updatedAt > latest) {
      latest = updatedAt;
    }
  }

  for (const mutation of queryClient.getMutationCache().getAll()) {
    const mutationState = mutation.state as {
      status?: string;
      submittedAt?: number;
      errorUpdatedAt?: number;
    };
    if (mutationState.status !== "error") continue;
    const updatedAt = mutationState.errorUpdatedAt ?? mutationState.submittedAt ?? 0;
    if (updatedAt > latest) {
      latest = updatedAt;
    }
  }

  return latest > 0 ? latest : null;
}

export function useGlobalSyncStatus(): SyncStatus {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const activeFetches = useIsFetching();
  const activeMutations = useIsMutating();
  const [cacheRevision, setCacheRevision] = useState(0);

  useEffect(() => {
    const unsubscribeQueryCache = queryClient.getQueryCache().subscribe(() => {
      setCacheRevision((current) => current + 1);
    });
    const unsubscribeMutationCache = queryClient.getMutationCache().subscribe(() => {
      setCacheRevision((current) => current + 1);
    });

    return () => {
      unsubscribeQueryCache();
      unsubscribeMutationCache();
    };
  }, [queryClient]);

  return useMemo(() => {
    if (!isAuthenticated) {
      return {
        phase: "local",
        label: "Mode local",
        detail: "Aucune sync cloud",
      };
    }

    if (activeFetches > 0 || activeMutations > 0) {
      return {
        phase: "syncing",
        label: "Synchronisation",
        detail: "Mise a jour en cours...",
      };
    }

    const latestSuccessAt = getLatestSuccessTimestamp(queryClient);
    const latestErrorAt = getLatestErrorTimestamp(queryClient);
    const hasBlockingError = latestErrorAt !== null && (latestSuccessAt === null || latestErrorAt > latestSuccessAt);

    if (hasBlockingError) {
      return {
        phase: "error",
        label: "Erreur de sync",
        detail: `Dernier echec: ${formatTime(latestErrorAt)}`,
      };
    }

    return {
      phase: "synced",
      label: "Cloud synchronise",
      detail: `Derniere sync: ${formatTime(latestSuccessAt)}`,
    };
  }, [activeFetches, activeMutations, cacheRevision, isAuthenticated, queryClient]);
}

