"use client";
import { useSyncExternalStore } from "react";
export type SceneState = {
  valveState: "closed" | "open";
  boilerState: "idle" | "active";
  animationMode: "running" | "paused" | "reduced";
  graphicsQuality: "high" | "low";
  sceneStatus: "loading" | "ready" | "fallback";
};
const initial: SceneState = {
  valveState: "closed",
  boilerState: "idle",
  animationMode: "running",
  graphicsQuality: "high",
  sceneStatus: "loading",
};
let state: SceneState = { ...initial };
const listeners = new Set<() => void>();
export const motion = {
  pageScroll: 0,
  flowProgress: 0,
  valveAt: 0.5,
  autoContinue: false,
  hidden: false,
};
export const sceneStore = {
  get: () => state,
  set: (patch: Partial<SceneState>) => {
    if (
      Object.entries(patch).every(
        ([k, v]) => state[k as keyof SceneState] === v,
      )
    )
      return;
    state = { ...state, ...patch };
    listeners.forEach((f) => f());
  },
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  open: () => {
    sceneStore.set({ valveState: "open" });
    if (state.animationMode === "reduced" || state.sceneStatus === "fallback") {
      motion.flowProgress = 1;
      sceneStore.set({ boilerState: "active" });
    } else motion.flowProgress = Math.max(motion.flowProgress, motion.valveAt);
  },
};
export function useSceneState() {
  return useSyncExternalStore(
    sceneStore.subscribe,
    sceneStore.get,
    () => initial,
  );
}
