# QA · TMS V6 Stage B · 11 октября 2026

Финальный рабочий код: build/typecheck/lint PASS; unit 20/20 PASS. Логи `qa/v6-stage-b/{build-final,types-final,lint-final,unit-final}.log`. Node 24.14, Next 16.3.8, Chromium 153.0.8010.12 на macOS. Публичного размещения и реальной отправки заявок не было.

## Автоматические проверки

`npm test`: **36 PASS / 1 FAIL**, 42.3s, production-final.log/test-results.json. FAIL `tests/site.spec.ts:50`: комбинированное увеличение текста 200% и spacing на 1440px расширяет footer до 1475px. Воспроизводится в закрытом эталоне. Не скрыто retry/skip/обновлением snapshot. Предложение отдельно, без применения.

Frozen review suite: **59 PASS / 1 FAIL**, 1.3m, review-suite.log. FAIL `tests/review-v6.spec.ts:54` требует старую V5-главную и отсутствие data-v6-review; это намеренно несовместимо с одобренным B. Замороженный файл оставлен неизменным. Соответствующая актуальная функциональность (калькулятор/маршруты/demo) проверяется suite B. Прежние 17/60 не выдаются за текущий результат.

Проверены маршруты, case-slug, refresh/Back, BRM redirect, 404, sitemap/robots, noindex, /demo и его три сценария, keyboard/mobile-menu/anchor, dialog/focus/Escape, noJS/reduced-motion, forced colors/no-blur, axe, две модели калькулятора и дополнительные поля: zero/fraction/comma/blank/negative/overflow, сохранение при смене режима. Устаревшие V5 selectors и screenshot assertions адаптированы к B с сохранением security/calculator/demo coverage.

Формы: новая consultation с четырьмя контекстами, optional fields, allowlist; четыре прежних intent сохранены и проверены unit HTTP-тестами. Browser integration проходит полный localhost путь UI → API → stub: 204 success, upstream 500, 8s timeout, retry, pending/double-submit. Отдельно no-config/legal 503; ложного успеха нет. Origin/honeypot/размер/лимиты/запрет redirect с токеном остаются в серверной реализации.

## Визуальный и ручной контроль

Полная 26-размерная матрица и методики сравнений — design-freeze-report.md. Свежие before/after, все шесть тем/раскрытия и новые страницы desktop/mobile находятся в review-архиве. Реальные PNG просмотрены, в том числе новые кейсы/длинная mobile-страница, формы и общая композиция. Header/Hero и 4 состояния CTA совпали; тема-workspace 310 исходных + 2 supplemental exact; footer geometry 26/26, pixels 25/26. Неполное пиксельное совпадение footer 601px не скрыто.

Native Safari действительно открыт через системный UI. Проверены Hero, pause/replay, тема разработки/раскрытие, якоря, калькулятор времени, CRM, пустая форма/валидация и Escape. После исправления реальный фокус вернулся на CTA. Реальный page zoom применён и возвращён; точный процент UI не прочитан, поэтому native 200% NOT VERIFIED. Скриншоты Safari просмотрены в ходе UI-сессии; отдельные файловые Safari PNG/видео не сохранены. Файловые screenshot/video артефакты review — Chromium, не Safari.

NOT RUN: полная native Safari viewport-матрица, Playwright WebKit/Firefox (бинарники отсутствуют), физический iPhone/Android, скринридер. CSS-эмуляция mobile/200%/media не выдаётся за физическое устройство или browser zoom. Hidden-tab проверка — симуляция API; offscreen — реальный IntersectionObserver.

## Изоляция и упаковка

Public-runtime scan: 13 public chunks, 0 обнаруженных diagnostic/private-маркеров и 0 внешних запросов в проверенной сессии. Закрытый review не исключён из всего build: он остаётся gated-маршрутом. `/auto/` и `/nedv/` внешнего сайта ответили HTTP 200; размещение не менялось.

Чистый source ZIP извлекается в отдельный `work/stage-b-clean/tms-site`. Установка `npm ci --offline`, build, typecheck и unit **20/20 PASS**. В браузере чистой копии проверены главная/CRM/кейс на 1440/390: 200, без runtime-ошибок и горизонтального overflow. Итог проверки записан в `clean-package-result.json`, логи `clean-install.log`, `clean-build.log`, `clean-types.log`, `clean-unit.log`. В рабочем дереве font bootstrap ничего не подменял. Итоговые ZIP имеют CRC-проверку и SHA256 manifests.

Статус **partial**, а не all-pass: дефект frozen-footer, одна историческая несовместимость suite и явно перечисленные NOT RUN. Юридический текст/доставка/hosting — launch blockers, не неудача локального stub.
