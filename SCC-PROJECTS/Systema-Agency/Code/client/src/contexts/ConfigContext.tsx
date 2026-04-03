import { createContext, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { AppConfig, DEFAULT_CONFIG, DEFAULT_ZONES, ZoneConfig } from '@/lib/types';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: AppConfig) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const REFERENCE_WIDTH = 1920;
const REFERENCE_HEIGHT = 1080;

/** Migrate a single zone's position from old "10%" format to pixel numbers */
function migrateZonePosition(zone: any): ZoneConfig {
  const pos = zone.position;
  if (pos && typeof pos.x === 'string') {
    const xPercent = parseFloat(pos.x) / 100;
    const yPercent = parseFloat(pos.y) / 100;
    return {
      ...zone,
      position: {
        x: Math.round(xPercent * REFERENCE_WIDTH),
        y: Math.round(yPercent * REFERENCE_HEIGHT),
      },
    };
  }
  return zone as ZoneConfig;
}

/** Ensure config has all required fields (migrate old configs) */
function migrateConfig(raw: any): AppConfig {
  const zones = raw.zones && raw.zones.length > 0
    ? raw.zones.map(migrateZonePosition)
    : DEFAULT_ZONES;

  return {
    ...DEFAULT_CONFIG,
    ...raw,
    zones,
    viewMode: raw.viewMode || 'vision-board',
    tabs: raw.tabs || DEFAULT_CONFIG.tabs,
    modules: raw.modules || DEFAULT_CONFIG.modules,
    theme: { ...DEFAULT_CONFIG.theme, ...raw.theme },
  };
}

/** Check if config needs migration (has old string positions) */
function needsMigration(raw: any): boolean {
  if (!raw.zones || raw.zones.length === 0) return true;
  return raw.zones.some((z: any) => z.position && typeof z.position.x === 'string');
}

function applyTheme(config: AppConfig) {
  document.documentElement.style.setProperty('--primary', config.theme.primary);
  document.documentElement.style.setProperty('--secondary', config.theme.secondary);
  document.documentElement.style.setProperty('--background', config.theme.background);
  document.documentElement.style.setProperty('--card', config.theme.card);
  document.documentElement.style.setProperty('--foreground', config.theme.text);
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  // Local fallback state (always kept in sync as backup)
  const [rawConfig, setLocalConfig] = usePersistedState<AppConfig>('rpg_app_config', DEFAULT_CONFIG);

  // Cloud state — load from server when authenticated
  const { data: serverPrefs, isLoading: serverLoading } = trpc.preferences.get.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const updatePrefsMutation = trpc.preferences.update.useMutation({
    onSuccess: () => utils.preferences.get.invalidate(),
  });

  // Compute effective config: server wins when available, local as fallback
  const config = useMemo(() => {
    if (isAuthenticated && serverPrefs?.tabConfig) {
      try {
        const parsed = JSON.parse(serverPrefs.tabConfig);
        return migrateConfig(parsed);
      } catch {
        // Corrupted server config — fall back to local
        return migrateConfig(rawConfig);
      }
    }
    return migrateConfig(rawConfig);
  }, [isAuthenticated, serverPrefs, rawConfig]);

  // On first login: if server has no config yet, push local config to cloud
  useEffect(() => {
    if (!isAuthenticated || serverLoading || !serverPrefs) return;
    if (serverPrefs.tabConfig) return; // already has cloud config
    // Push local config to server
    updatePrefsMutation.mutate({ tabConfig: JSON.stringify(rawConfig) });
  }, [isAuthenticated, serverLoading, serverPrefs]);

  // Migrate local config format if needed
  useEffect(() => {
    if (needsMigration(rawConfig)) {
      setLocalConfig(config);
    }
  }, []);

  const updateConfig = useCallback((newConfig: AppConfig) => {
    // Always update local storage as backup
    setLocalConfig(newConfig);
    // Sync to cloud if authenticated
    if (isAuthenticated) {
      updatePrefsMutation.mutate({ tabConfig: JSON.stringify(newConfig) });
    }
    applyTheme(newConfig);
  }, [isAuthenticated, updatePrefsMutation, setLocalConfig]);

  const resetConfig = useCallback(() => {
    updateConfig(DEFAULT_CONFIG);
  }, [updateConfig]);

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
