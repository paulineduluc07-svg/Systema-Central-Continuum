import { create } from "zustand";

export type AvatarAnimation = "idle" | "wave" | "walk" | "sit" | "dance";

interface SceneState {
  avatarAnimation: AvatarAnimation;
  setAvatarAnimation: (anim: AvatarAnimation) => void;
  isSceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  avatarAnimation: "idle",
  setAvatarAnimation: (avatarAnimation) => set({ avatarAnimation }),
  isSceneReady: false,
  setSceneReady: (isSceneReady) => set({ isSceneReady }),
}));
