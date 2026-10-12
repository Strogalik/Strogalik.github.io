# TMS V6 B3 — фактически выполненные проверки

11 октября 2026. Статус **awaiting_owner_review**, stageBStarted:true. Локальная реализация выполнена, Stage B продолжается. QA частичный; публичный запуск не выполнялся.

## Результат

| Проверка | Итог |
|---|---|
| Рабочая production-сборка | PASS |
| TypeScript / lint | PASS / PASS |
| Unit | 21 PASS, 0 FAIL |
| Chromium, финальный полный прогон | **136 PASS / 3 FAIL**, 139 всего, без skipped/flaky/expected failures |
| Прежние три B2 footer overflow | PASS на всех трёх независимых маршрутах |
| 14 страниц × 4 header перехода × desktop/mobile | 112 переходов PASS |
| Шесть тем, ссылки и payload контекста | PASS desktop/mobile, также no-JS ссылки |
| Три кейса: explorer, история, focus, fallback | PASS; продуктовые входы проверены для существующих релевантных карточек |
| Три explorer → форма → реальный localhost stub | PASS: caseSlug/custom, серверный receipt, positive delivery, возврат focus |
| Ошибка/timeout/retry/pending/двойной submit/abort формы | PASS; только синтетика и localhost |
| /demo 307 allowlist + попытки external next / подмаршрут | PASS |
| Legal body/date/hash, consent new tab, checkbox false | PASS |
| Axe новых документов/notice; keyboard/no-JS/reduced-motion/forced colors | PASS в проверенных сценариях |
| Чистая сеть/storage на 14 страницах с непустым старым tracker env | PASS, 0 внешних запросов/авто POST/Set-Cookie/storage/caches/service workers |
| Отдельно извлечённый source: npm ci / build / types | PASS |
| Извлечённая копия: 20 маршрутов, fonts и JS errors | PASS, 0 внешних запросов и pageerror |

Логи: qa/v6-b3/build.log, types.log, lint.log, unit.log, browser-final.log, test-results.json, supplement.json, clean-*.log/json. Итоговый JSON содержит фактическое время прогона. Первоначальные ошибки селекторов и промежуточные результаты сохранены отдельно как история, а не итоговые PASS.

## Три оставшихся FAIL

При совместном **CSS text200% + spacing** на главной: ширина 320 → scrollWidth 390; 360 → 394; 390 → 394. Отдельно собрана неизменённая B2 из снимка до правок, получены те же значения и переполняющиеся элементы калькулятора. B3 не меняла его код/CSS; заданием разрешено локальное исправление футера, а принятые калькулятор/шапка защищены. Поэтому исходные assertions сохранены, FAIL не подавлены.

Это не три прежних footer FAIL: старые проверки /, /products/crm, /cases/flooring-manufacturer при 1440 text200%+spacing теперь проходят. В новом наборе частично завершившиеся три notice-теста дополнены независимой проверкой самой панели на 320/360/390: границы внутри viewport, кнопка доступна с клавиатуры, Enter закрывает, записан только closed. Заголовок notice дополнительно проверяется геометрически. Текстовая область панели на узком экране прокручивается, без наложения на кнопку.

## Геометрия и сохранность

12 размеров: 1920×1080, 1728×960, 1512×780, 1440×760, 1366×650, 1024×768, 768×1024, 430×932, 390×844, 360×800, 320×740, 844×390. Внутренние страницы дополнительно проверены на 21 размере, включая соседние breakpoint. Свежие **48/48** защищённых сцен совпали в собственных границах; **144/144** геометрии тем совпали, изменения текста вторичных ссылок показаны в diff bounds. Верхняя геометрия футера **12/12** совпала. В первоначальном raster-сравнении верх футера **11/12** совпал; 1440 имеет локальную разницу текста контактов при одинаковой геометрии. Это открытая оговорка, не скрытая маска.

Оригинальный A4.8 lock не переписан: raw FAIL на 9 прямых исключениях B3 (story logic и удалённый учебный код); integrity/dependencies PASS, неожиданных locked changes нет. Четыре старых B1 raster delta остаются историческими. Подробности: b3-design-preservation.md/json.

Реально просмотрены PNG рабочего preview: уведомление 320/desktop, before/after футера, mobile explorer/form/legal, длинная открытая тема, Safari и clean-source consent. Галерея qa/v6-b3/index.html показывает одинаковые viewport и записи взаимодействий.

## Браузеры и доступность

Native macOS Safari: ограниченный ручной smoke каталога → explorer → форма, Escape/focus, скрытие/возврат notice, checkbox false. Через меню Safari выбран **настоящий browser zoom 200%**, проверены notice, /consent и legal → /#products через мобильное меню; скриншоты приложены. Это не CSS-имитация zoom. Финальная небольшая правка notice для <=700px повторно проверена в Chromium; Safari smoke не покрывает всю матрицу.

Firefox и Playwright WebKit: **NOT RUN**, в локальном кэше установлены только Chromium и ffmpeg. Физический телефон и screen reader/VoiceOver: **NOT RUN**. AX inspection не выдан за screen reader. Виртуальная экранная клавиатура телефона/safe-area реального iOS устройства не проверена; реализована обработка visualViewport, но это не доказательство на устройстве.

No-JS сохраняет legal/case/product content, постоянные ссылки и /demo redirect. Форма сообщает, что требует JS; не обещает отправку без него. Нативное details-меню без JS может оставаться открытым после same-page hash — прежнее ограничение, не заявленное исправленным. No-blur защищённого материала проверяется существующим b2-motion набором; новый notice не использует backdrop/GPU glass.

## Зависимости и выпуск

Свежий npm audit текущего неизменённого lockfile сообщил **5 high записей в одной dev/lint цепочке** eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces (GHSA-vfj7-8cjw-p6xm). Стек автоматически не обновлялся ради отчёта; исходный JSON приложен. Это отдельный вопрос обслуживания зависимостей, не доказанная уязвимость маршрута сайта.

Исходники проверены после извлечения без env/dependencies/build/font binaries. Bootstrap использует закреплённые @fontsource; изменяет app/fonts.ts только в извлечённой копии. Функциональный smoke PASS, визуальное побитное совпадение fallback с оригинальными WOFF2 не заявлено. Workspace original fonts/lockfile сохранены.

L1–L4 остаются открыты: implied consent в политике; email/company вне перечня отдельного согласия; широкие положения об аналитике; фактические Beget/CRM/production delivery. Полные пояснения в b3-data-and-legal-audit.md. Gate и секреты не изменены, production отправок/публичного deploy не было. Внешние /auto/ и /nedv/ B3 не меняла и заново не аудировала.
