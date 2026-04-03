import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FurniturePiece {
  id: string;
  label: string;
  /** Path to GLB in /public/models/ — empty string = procedural placeholder */
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  visible: boolean;
}

const DEFAULT_FURNITURE: FurniturePiece[] = [
  {
    id: "couch",
    label: "Couch",
    modelPath: "",
    position: [3.5, -1.5, -4],
    rotation: [0, -0.6, 0],
    scale: 1.2,
    visible: true,
  },
  {
    id: "rug",
    label: "Rug",
    modelPath: "",
    position: [0, -2.05, -3],
    scale: 1,
    visible: true,
  },
  {
    id: "lamp",
    label: "Floor Lamp",
    modelPath: "",
    position: [-4, -1, -5],
    scale: 1,
    visible: true,
  },
];

interface RoomState {
  furniture: FurniturePiece[];
  toggleFurniture: (id: string) => void;
  resetRoom: () => void;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      furniture: DEFAULT_FURNITURE,
      toggleFurniture: (id) =>
        set((s) => ({
          furniture: s.furniture.map((f) =>
            f.id === id ? { ...f, visible: !f.visible } : f
          ),
        })),
      resetRoom: () => set({ furniture: DEFAULT_FURNITURE }),
    }),
    { name: "kim-room" }
  )
);