# B1 — карта исходников и источников

## Реальный проект до правки

Рабочая директория: `outputs/tms-site`. На начало B1 Git-репозитория здесь и в родительской рабочей директории не было; git status недоступен. Git не создавался, reset/clean не выполнялись. Сохранён отдельный private B-before с 263 файлами и SHA256 manifest; A4.8 original seal не перезаписывался.

Поиск исходных заголовков вывел на `components/site-v6/Sections.tsx`: `CasesSection` («Задачи, которые уже решали»), `Cooperation` («Сначала разберём вашу задачу») и `CalculatorSection`. Стили — `components/site-v6/sections.module.css`; подключение — `components/site-v6/Home.tsx`. Сам калькулятор — `components/site-v6/Calculator.tsx`.

Старые общие Sections и sections.module.css сохранены для текущих внутренних маршрутов. На главной заменено только подключение трёх секций.

## Изменённые области

| Файл | Роль |
|---|---|
| `components/site-v6/B1Sections.tsx` | Новый выбор кейса, предметные SVG, подробности, начало работы, обёртка калькулятора |
| `components/site-v6/b1.module.css` | Изолированная композиция B1, адаптивность и диалог |
| `components/site-v6/Home.tsx` | Подключение новых секций вместо старых трёх |
| `components/site-v6/Calculator.tsx` | Только optional className и data-hooks для размещения/аудита; формулы и поведение не менялись |
| `tests/b1.spec.ts` | Матрица размеров и состояний, диалог/история/focus/no-JS/fallback |
| `tests/site.spec.ts` | Два assertions прежних article заменены на существующие details выбора кейса |
| `tests/visual.spec.ts` | Новая директория артефактов B1 вместо исторической B |
| `playwright.config.ts` | Включение B1-тестов и текущего отчёта |
| `scripts/*b1*.mjs` | Capture, сравнение, геометрия и read-only аудит смежных страниц |
| `docs/b1-*`, `README.md`, `docs/source-audit.md` | Актуальная документация; прежние отчёты остаются историей |

## Откуда взят публичный контент

Авторитетные полные истории — существующий `content/cases.public.json`, подключённый через `content/cases.ts`. Оба файла сохранены побайтово. Диалог отображает поля title, summary, clientContext, challenge, work, processChange, results, primaryMetric.context, measurementNote, disclaimer, implementationScopeNote.

Предлагаемая короткая подача сверена с `content/cases.presentation.proposed.json` из B1-пакета. Она не заменяет cases.public.json и не публикует source pointers. Числа школы и оптовика остаются в подробностях; срок школы не придуман. «До 15 минут» не превращено в среднее, норматив или обещание SaaS. Тексты начала работы сверены с предлагаемым слоем пакета. В public не копировались архив, source map, owner screenshots, документы или персональные данные.

Визуальный принцип сопоставлен с owner reference и разделом [Take a closer look на Apple MacBook Pro](https://www.apple.com/macbook-pro/): вертикальный выбор, один открытый пункт, единый связанный образ и детали по запросу. Страница прочитана через web-инструмент; интерактивный Apple UI в браузере не тестировался. Не заимствованы Apple-изображения, шрифты, бренд или обещания. Три SVG написаны в коде TMS; это предметные образы без фиктивных записей и людей.

## Что сохранено

A4.8 protected source, глобальные стили, CSS-auto/SDK, четыре локальных шрифта, все app-маршруты, формы, API и защита, кейсовые данные, demo и калькуляторная математика сохранены. `package.json` и lockfile не менялись; новых зависимостей нет. Проверка хешей против B-before — `b1-preservation.json`. Original A4.8 policy check — отдельный `qa/v6-b1/a48-lock.json`; его integration changes включают прежний Stage B, поэтому это не список только B1-изменений.

Сценарий no-JS использует реальные details/summary и ссылки. Нативная summary сообщает expanded семантику браузеру; фиктивные tabs не применяются. Системные focus и action стили берутся из принятого компонента, без изменения его CSS.

Полный список файлов patch и before/after SHA256 находится в `PATCH_MANIFEST.json` архива. Внутренние snapshots и материал задания в выдачу не входят.
