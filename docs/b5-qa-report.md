# TMS V6 B5 — фактически выполненные проверки

12.10.2026. Новый прогон текущего кода: **185 browser PASS / 0 FAIL / 0 skipped**, **28 unit PASS**, production build, TypeScript и ESLint PASS. Исторические 152/21 не переименованы в результаты B5.

Сохранён полный набор B4: формы и локальный HTTP upstream, маршруты/меню, кейсы и диалоги, калькулятор, FAQ, адаптивность, text200% + spacing, no-JS/reduced-motion/forced colors, redirects и закрытый preview. Все QA outputs направлены в qa/v6-b5, старые evidence не переписаны.

Дополнительно:

- 22 OFF-перехода: 15 страниц, 4 настоящих 404 и служебные redirects/review. Ни одного внешнего запроса, POST, tracker hint, cookie, optional storage, cache или service worker до действия. Исторический непустой ID не включает аналитику.
- Все 4 юридические страницы на 1920/1440/1024/768/430/390/360/320: реальные тексты/адрес/дата, focus и text200% + spacing, отсутствие horizontal overflow. No-JS и print доступны.
- Точные revised bytes/hash, все поля нового receipt, stale version409; после409 false checkbox, сохранённый DOM draft и отсутствие автоматического resubmit. Legal открывается в новой вкладке без потери ввода.
- Mocked AVAILABLE: no decision/legacy closed/denied/expired/stale/corrupt не загружают tag; явный grant даёт один init и только безопасные текущие пути. Предыдущие события не досылаются, query/hash/контакты/receipt/UTM не передаются в команды адаптера.
- Revoke/destruct/allowlist cleanup; повторный grant; поздний onload после revoke; cross-tab без потери формы; expiry по таймеру и после смены часов; новый ID/profile/OFF; blocked storage с памятью документа; offline config/adblock/timeout. Готовность счётчика не подменяется разрешением.
- 8 размеров AVAILABLE notice/settings, клавиатура Enter/Space, диалог скрывает notice; forced-colors/reduced-motion/no-blur + увеличенный текст на390. Отказ не мешает локально замоканной форме, согласия независимы.
- Настоящий development React StrictMode для PrivacyProvider/Settings в изолированном HTML-стенде: один tag/init. Next Link/route context и CSS в этом компонентном стенде заменены, полный Next navigation проверен отдельно production-тестом.
- 88 protected SHA и216/216 свежих пиксельных пар совпадают с B4. Реальные PNG просмотрены; геометрия и изображения доступны в галерее.

Все configured запросы перехвачены до внешней сети; ID синтетический. mocked-calls.json — команды нашего адаптера, не реальные сетевые пакеты Метрики. Это не live verification внешнего tag. Success заявки проверялся только на localhost test upstream или перехваченном endpoint.

Первичные сбои новых тестов разобраны: неоднозначный locator header/alert, ожидание завершения client navigation перед Back, превышение диапазона fastForward в test clock, CSS/Next Link в отдельном StrictMode bundle. Финальный набор не содержит skip/expected failure.

Native Safari: локальный /cookies открыт, актуальные дата/адрес/OFF видны в AX. Полный визуальный smoke/настоящий200% не завершены из-за смены пользователем активного Safari; PASS на них не заявляется. Физический телефон, VoiceOver, Playwright WebKit и Firefox: NOT RUN. Chromium mobile viewport и text200% не выдаются за телефон или настоящий browser zoom.

Отдельная извлечённая source-копия проверяется в clean-build.log, clean-types.log, clean-smoke.json и final-source-verification.json. Старые screenshots/отчёты не использованы вместо новых. L4, выбор сервиса/ID и production настройки остаются открыты.

Файлы доказательств: browser.log/test-results.json, unit.log/types.log/lint.log/build.log, off/routes.json, analytics/mocked-calls.json, preservation.json, source-preservation.json, legal-sync.json, npm-audit*.json. Свежий npm audit:5 high в dev-chain eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces; runtime audit --omit=dev:0. Это не заявление об эксплуатации runtime. Lock не менялся.
