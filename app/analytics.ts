export type MetrikaGoal =
  | "telegram_click"
  | "avito_click"
  | "hero_cta_click"
  | "pricing_cta_click"
  | "final_cta_click"
  | "pricing_category_change";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export function reachGoal(goal: MetrikaGoal, params?: Record<string, string>) {
  const counterId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);

  if (!counterId || typeof window === "undefined" || typeof window.ym !== "function") {
    return;
  }

  window.ym(counterId, "reachGoal", goal, params);
}

export function trackTelegram(placement: string, contextualGoal?: MetrikaGoal) {
  if (contextualGoal) reachGoal(contextualGoal, { placement });
  reachGoal("telegram_click", { placement });
}

export function trackAvito(placement: string, contextualGoal?: MetrikaGoal) {
  if (contextualGoal) reachGoal(contextualGoal, { placement });
  reachGoal("avito_click", { placement });
}
