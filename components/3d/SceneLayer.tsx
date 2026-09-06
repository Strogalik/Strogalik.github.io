"use client";
import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { useSceneState, sceneStore } from "./state";
const Scene = dynamic(() => import("./Scene"), { ssr: false });
class ImportBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    sceneStore.set({ sceneStatus: "fallback" });
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function SceneLayer() {
  const state = useSceneState();
  return (
    <>
      <div
        className={`scene-layer ${state.sceneStatus === "fallback" ? "scene-unavailable" : ""}`}
        aria-hidden="true"
        data-scene-status={state.sceneStatus}
        data-valve-state={state.valveState}
        data-boiler-state={state.boilerState}
        data-animation-mode={state.animationMode}
      >
        <ImportBoundary>
          <Scene />
        </ImportBoundary>
      </div>
      {state.sceneStatus === "fallback" && (
        <div className="fallback-notice" role="status">
          Статичный вид трассы · интерактивные кнопки доступны
          <button className="text-link" onClick={() => location.reload()}>
            Повторить загрузку 3D
          </button>
        </div>
      )}
      <style>{`body:has([data-scene-status="fallback"]) .pipe-fallback {display:block} body:has([data-scene-status="loading"]) .scene-loading {display:flex}`}</style>
    </>
  );
}
