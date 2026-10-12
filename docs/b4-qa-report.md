# TMS V6 B4 — фактическая проверка

Дата: 2026-10-11. Текущий проект доработан на месте. Публичного deploy и реальных заявок не было.

## Реализация

Футер выделен в PublicFooter и собственную CSS Module: единая сетка, общая ось бренда/реквизитов и контактов/первой юридической ссылки. На tablet подпись бренда сохраняется. Все шесть ссылок, email, домен и реквизиты прежние. FAQ сохраняет четыре текста и native details/summary; Paper-панели и локальный SVG плюс/минус, несколько открытых ответов, клавиатура и no-JS. Калькулятор использует тот же индикатор без FAQ-карточек.

## Выполнено

- Production build, TypeScript, ESLint, 21 unit test: PASS. Финальный browser.log/test-results.json: **152 PASS / 0 FAIL / 0 skipped**, полная матрица текущего этапа.
- 14 страниц; 112 переходов меню (14 × 4 якоря × desktop/mobile), закрытие меню и отступ под шапкой; 13 внутренних страниц на 21 ширине.
- Все три прежних FAIL при 320/360/390 с text200% + spacing теперь PASS, без skip/expected failure и без overflow-x:hidden.
- Footer: один resize-сеанс на каждый normal/spacing/text200/combined; 400–1440 с шагом20, 12 основных размеров и пары600/601,700/701,900/901,1100/1101,1120/1121. Оси, подпись, все текстовые фрагменты и scrollWidth проверены:69 ширин ×4 режима =276 замеров.
- Матрица viewport: 1920×1080,1728×960,1512×780,1440×760,1366×650,1024×768,768×1024,430×932,390×844,360×800,320×740,844×390.
- FAQ все4 раскрытия, multi-open, Enter/Space, focus, resize и reduced-motion; no-JS FAQ и статичный калькулятор. Сброс native marker проверен стилями и глазами, а не regex текста.
- Обе модели калькулятора: четыре режима увеличения/spacing ×6ширин; отрицательное изменение, большие значения, ошибки/исправление, дополнительные поля и сохранение state.
- CaseExplorer, direct href, modified click, Back/Forward, copy/fallback, case→form; context темы/продукта/кейса, false checkbox, legal новая вкладка, pending/retry/timeout/abort. Подтверждённый success проверен только localhost HTTP upstream.
- /demo allowlist307, закрытый /review/v6, исключение старого renderer/seed. На4 настоящих404 один header/main/footer; ошибка не воспроизведена, код404 не менялся.
- 14 чистых контекстов: нет внешних запросов, POST, Set-Cookie, необязательных storage/cache/service worker. Сборка с непустым историческим ID аналитики не загружает Метрику. Notice закрывается только явным действием; исходный ключ сохранён.
- Forced-colors/no-blur/reduced-motion проверки; записи footer-resize.webm и faq.webm. Обычные viewport-снимки не заменены fullPage.
- Native Safari после финальных CSS-правок: FAQ несколько открытых ответов, клавиатурный Enter, футер, меню→кейсы и дополнительные допущения калькулятора. Настоящий200% выбран в меню Safari и подтверждён скриншотом; затем100% восстановлен, закрыто только тестовое окно.

## Причины reflow

На исходном B3 scrollWidth при combined составлял390/394/394. Исправлены auto-minimum полей/режимов/результатов калькулятора. Замер всей страницы также доказал вклад intrinsic-width B1-секций, пустого header badge и skip-link. Добавлены узкие wrapping/min-size правила на публичном wrapper; B1-файлы и механика сцен не менялись. На промежуточных desktop ширинах1121/1260 при крупном тексте длинный пункт меню также выходил за край: разрешён перенос в nav. Новые правила не изменили180 обычных защищённых снимков.

## Ограничения

Native Safari — ограниченный ручной smoke, не вся Chromium-матрица. Playwright WebKit и Firefox отсутствуют в локальном browser cache: NOT RUN. Физический телефон и VoiceOver: NOT RUN; AX tree не считается screen-reader тестом. Реальная доставка/receipt-хранилище/Beget/CRM и внешние /auto/, /nedv/ не проверялись. Юридические L1–L6 открыты. npm audit: 5 high в dev-chain; runtime audit --omit=dev:0. Зависимости и lock не менялись.

Первичные неуспешные прогоны новых тестов разобраны: SVG path нулевой ширины проверяется по display-state; no-JS noscript — по отображаемому innerText; skip-link — по переходу Tab к первому действию main. Это уточнения новых тестов, а не удаление старых FAIL. Диагностический reflow-candidate.log от устаревшего процесса не используется как доказательство финальной геометрии.

Чистый source отдельно установлен через npm ci, собран с исходным font bootstrap, проверен TypeScript и на20 маршрутах:0 remote requests/0 page errors. После финальной упаковки проверяется совпадение SHA с извлечённым проектом; единственное ожидаемое отличие — app/fonts.ts после bootstrap.

См. index.html, browser.log, test-results.json, supplement.json, footer/*.json, calculator/*.json, preservation.json и отдельную проверку source ZIP.
