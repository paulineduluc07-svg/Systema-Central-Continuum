export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
}

export interface TabConfig {
  id: string;
  label: string;
  color: string; // Tailwind color class or hex
}

export interface ZoneConfig {
  id: string;
  label: string;
  color: string;
  icon: string;
  position: { x: number; y: number }; // World-space pixel coordinates
}

export interface ModuleConfig {
  id: string;
  type: 'quests' | 'stats' | 'inventory' | 'skills' | 'map';
  title: string;
  tabId: string; // Which tab this module belongs to
  order: number;
}

export interface AppConfig {
  theme: ThemeConfig;
  tabs: TabConfig[];
  zones: ZoneConfig[];
  modules: ModuleConfig[];
  viewMode: 'tabs' | 'vision-board';
}

// Default zone positions in world-space pixels (reference: 1920×1080)
export const DEFAULT_ZONES: ZoneConfig[] = [
  { id: 'restaurant',  label: 'Restaurant',     color: '#FF69B4', icon: 'utensils',     position: { x: 200,  y: 120 } },
  { id: 'carriere',    label: 'Carrière',       color: '#FF69B4', icon: 'briefcase',    position: { x: 580,  y: 60 } },
  { id: 'systema',     label: 'Systema Agency', color: '#FF69B4', icon: 'sparkles',     position: { x: 960,  y: 90 } },
  { id: 'finance',     label: 'Finance',        color: '#FF69B4', icon: 'wallet',       position: { x: 1440, y: 60 } },
  { id: 'sante',       label: 'Santé',          color: '#FF69B4', icon: 'heart-pulse',  position: { x: 1630, y: 380 } },
  { id: 'etude',       label: 'Étude',          color: '#FF69B4', icon: 'book-open',    position: { x: 200,  y: 650 } },
  { id: 'maison',      label: 'Maison',         color: '#FF69B4', icon: 'home',         position: { x: 960,  y: 780 } },
];

export const DEFAULT_CONFIG: AppConfig = {
  theme: {
    primary: '#FF69B4',
    secondary: '#FFD700',
    background: '#000000',
    card: '#0A0A0A',
    text: '#E0E0E0',
  },
  tabs: [
    { id: 'missions', label: 'Pilotage', color: 'bg-pink-500' },
    { id: 'inventory', label: 'Ressources', color: 'bg-yellow-500' },
    { id: 'maison', label: 'Maison', color: 'bg-orange-500' },
    { id: 'map', label: 'Plan', color: 'bg-cyan-500' },
  ],
  zones: DEFAULT_ZONES,
  modules: [
    { id: 'quest-log', type: 'quests', title: 'Tâches Prioritaires', tabId: 'missions', order: 0 },
    { id: 'stats-panel', type: 'stats', title: 'Indicateurs', tabId: 'missions', order: 1 },
    { id: 'inventory-grid', type: 'inventory', title: 'Outils & Ressources', tabId: 'inventory', order: 0 },
    { id: 'skills-list', type: 'skills', title: 'Performance & KPIs', tabId: 'skills', order: 0 },
    { id: 'world-map', type: 'map', title: 'Plan de Salle', tabId: 'map', order: 0 },
  ],
  viewMode: 'vision-board',
};
