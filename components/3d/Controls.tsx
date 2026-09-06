"use client";
import { Pause, Play, ArrowUpRight, Check } from "lucide-react";
import { sceneStore, useSceneState, motion } from "./state";
export function ValveControls() {
  const s = useSceneState();
  return (
    <div className="valve-controls">
      <p
        className={`system-status ${s.valveState === "open" ? "is-active" : ""}`}
        role="status"
      >
        <span />
        {s.valveState === "open"
          ? "Вентиль открыт. Поток продолжается."
          : "Поток остановлен перед вентилем."}
      </p>
      <button
        className="button"
        onClick={sceneStore.open}
        disabled={s.valveState === "open"}
      >
        {s.valveState === "open" ? (
          <>
            Вентиль открыт <Check size={18} />
          </>
        ) : (
          <>
            Открыть вентиль <ArrowUpRight size={18} />
          </>
        )}
      </button>
      <p className="small muted">Можно также нажать на ручку в 3D.</p>
    </div>
  );
}
export function AnimationControls() {
  const s = useSceneState();
  return (
    <div className="animation-controls" aria-label="Анимация газовой трассы">
      <button
        onClick={() =>
          sceneStore.set({
            animationMode: s.animationMode === "running" ? "paused" : "running",
          })
        }
      >
        {s.animationMode === "running" ? (
          <Pause size={15} />
        ) : (
          <Play size={15} />
        )}
        <span>
          {s.animationMode === "running"
            ? "Пауза анимации"
            : "Продолжить анимацию"}
        </span>
      </button>
      <span className="control-divider" />
      <button
        onClick={() => {
          motion.autoContinue = true;
          sceneStore.open();
          sceneStore.set({ animationMode: "running" });
        }}
      >
        <span>Продолжить автоматически</span>
        <ArrowUpRight size={15} />
      </button>
    </div>
  );
}
export function BoilerStatus() {
  const s = useSceneState();
  return (
    <div className="boiler-status">
      <p
        className={`system-status ${s.boilerState === "active" ? "is-active" : ""}`}
        role="status"
      >
        <span />
        {s.boilerState === "active"
          ? "Тепло начинается здесь"
          : "Финальная точка — ваш дом"}
      </p>
      {s.valveState === "closed" && (
        <button
          className="text-link"
          onClick={() => {
            sceneStore.open();
          }}
        >
          Продолжить демонстрацию <Play size={15} />
        </button>
      )}
      {s.valveState === "open" && s.boilerState === "idle" && (
        <p className="small muted">Поток движется к котлу.</p>
      )}
    </div>
  );
}
