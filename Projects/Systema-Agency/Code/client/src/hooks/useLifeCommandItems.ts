import { usePersistedState } from "./usePersistedState";
import { useCallback } from "react";

export type ItemType = "memo" | "idea" | "bookmark" | "document" | "photo" | "voice";

export type LifeCommandItem = {
  id: string;
  type: ItemType;
  content: string;
  createdAt: string;
  // AI-generated metadata (filled after categorization)
  title?: string;
  summary?: string;
  category?: string;
  keyConepts?: string[];
  importance?: string;
  suggestedAction?: string;
  // Status
  categorized: boolean;
};

export function useLifeCommandItems() {
  const [items, setItems] = usePersistedState<LifeCommandItem[]>("lc_items", []);

  const addItem = useCallback(
    (type: ItemType, content: string): LifeCommandItem => {
      const newItem: LifeCommandItem = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        content,
        createdAt: new Date().toISOString(),
        categorized: false,
      };
      setItems(prev => [newItem, ...prev]);
      return newItem;
    },
    [setItems]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<LifeCommandItem>) => {
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    [setItems]
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems(prev => prev.filter(item => item.id !== id));
    },
    [setItems]
  );

  const getItemsByCategory = useCallback(
    (category: string) => items.filter(item => item.category === category),
    [items]
  );

  const getItemsByType = useCallback(
    (type: ItemType) => items.filter(item => item.type === type),
    [items]
  );

  const getRecentItems = useCallback(
    (limit: number = 10) => items.slice(0, limit),
    [items]
  );

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    getItemsByCategory,
    getItemsByType,
    getRecentItems,
  };
}
