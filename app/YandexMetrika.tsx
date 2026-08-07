"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export function YandexMetrika() {
  const counterId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);

  useEffect(() => {
    if (!counterId || document.querySelector("script[data-yandex-metrika]")) return;

    const ym = function (...args: unknown[]) {
      (ym.a ||= []).push(args);
    } as ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };

    ym.l = Date.now();
    window.ym = window.ym ?? ym;

    const script = document.createElement("script");
    script.async = true;
    script.dataset.yandexMetrika = "true";
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    document.head.appendChild(script);

    window.ym(counterId, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }, [counterId]);

  return null;
}
