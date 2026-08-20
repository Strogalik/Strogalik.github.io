# TMS ASUB · Logistics — Master Spec v3

## Product principle

TMS — task-first multi-device product. Не desktop-first и не mobile-first в смысле копирования layouts. Одна система, одни сущности и API, но намеренно спроектированные UX-композиции под desktop, tablet и mobile.

## Phase 1

Основной vertical slice:

- рейсы;
- перевозочные документы ЭПД: ЭПЛ, ЭТрН, ЭЗЗ;
- ЭДО, привязанное к рейсам и контрагентам;
- отчётность руководителя и бухгалтера;
- базовые связи с Saby и 1С/ERP;
- минимум справочников, без которого контур не работает.

ГСМ в первом визуальном спринте присутствует в контексте финансов/рейса, полный workflow переносится на следующий спринт.

## Core UX idea

Рейс — центральная сущность. Из него пользователь должен видеть ТС, водителя, маршрут, груз, документы, деньги, файлы и историю без повторного поиска по модулям.

## Visual direction

- Light TMS UI.
- Canvas `#F3F5F9`.
- Surfaces `#FFFFFF`.
- Deep Navy `#000926` — sidebar и special emphasis, а не фон рабочего экрана.
- Sapphire `#0F52BA` — brand/action color.
- Powder `#A6C5D7`, Ice `#D6E6F3` — supporting layers.
- Montserrat primary, Inter for dense data.
- Карточки 16–24px radius, очень мягкая тень, no heavy grid.

## Multi-device rule

Desktop использует таблицы, широкие summary-зоны, split layout и одновременный контекст.
Mobile использует cards, sticky actions, bottom navigation, stacked content и focused flows.
Нельзя сжимать desktop table до телефона и нельзя растягивать mobile cards на 1920px.

## Reference sprint

До масштабирования продукта нужно визуально утвердить:

1. Executive Dashboard
2. Trips Registry
3. Trip Details
4. EPD Registry
5. EPL Details
6. EDO Details
7. Finance Report

Только после этого масштабировать ЭПД/ЭДО, directories, notifications, integrations и полный ГСМ.


## UI quality rules added in v0.2

- Desktop and mobile share visual language but are composed independently.
- No routine operational text should rely on 7–10 px font sizes.
- Default body is 14 px; dense data may use 13 px; captions/table headers use 12 px.
- Desktop sidebar must support a compact icon-only state to free workspace for tables and documents.
- Mobile cards/panels must stay inside the page wrapper; long legal names and document statuses must wrap or truncate intentionally.
- Approval flows on mobile use vertical timelines rather than horizontal overflow.
- Data tables with status pills must define stable column sizing and internal horizontal scrolling when the viewport is too narrow.

## v0.5 product rules

The canonical design/frontend rules are now stored in `PRODUCT_DESIGN_PLAYBOOK.md`.
Every new screen must pass its containment, typography, multi-device and QA rules before delivery.

The next expansion block after the reference sprint is deliberately limited to EDO Registry + Reports Hub + Trips/EPD/EDO reports. This completes the core logistics/document/reporting flow before moving to notifications, integrations and directories.

## v0.6 interaction / alignment rules

- Content-sized status pills must live inside a stable column-sized slot in repeated desktop rows; status length must never move later fields.
- Mobile state/check cards use visually legible status icons (~42px outer box in the current design system).
- KPI labels must use intentional compact product copy instead of character-level wrapping; current finance KPI uses `Маржа, %`.
- Every meaningful line chart provides an expanded inspection mode; mobile expansion becomes a full-screen data surface.
- Browser history is part of product navigation: desktop Back/Forward controls, native iOS/macOS gestures preserved, optional edge-swipe fallback only where native behavior is absent.
- New components must pass the geometry assertions documented in `QA_REPORT_v0.6.md`.

## v0.9 stable expansion — approved baseline only

v0.9 продолжает **только stable v0.6**. Любые route-transition, wheel-driven trackpad animations, View Transition experiments и rubber-band navigation из экспериментальных веток после v0.6 считаются отклонёнными и не являются частью продукта или design system.

Добавлены production-style surfaces:

- Notification Center;
- Integrations Hub;
- Integration Details;
- Integration Jobs;
- Directories Hub;
- Vehicles Registry;
- Drivers Registry;
- Counterparties Registry;
- Routes Registry.

Все новые страницы используют существующий API/query layer. Demo fixtures не должны читаться непосредственно из React pages.

### Research gate перед новым UX-паттерном

Если следующий экран требует нового паттерна, которого ещё нет в TMS Design System:

1. сначала проверить Apple HIG / accessibility guidance для UX-принципа;
2. затем проверить официальную документацию React и используемой библиотеки для корректной реализации;
3. затем посмотреть зрелые fleet / logistics / ERP аналоги и developer discussions;
4. адаптировать принцип под TMS, не копировать чужой визуальный язык;
5. до merge проверить длинные реальные строки, desktop/mobile layouts и geometry containment.

Если существующий TMS-паттерн уже решает задачу, новый паттерн не придумывать.

### Motion boundary

Навигация и motion остаются ровно на уровне stable v0.6. Новые анимации переходов между routes не добавлять без отдельного изолированного прототипа и явного согласования. Motion-эксперименты не должны попадать в основную ветку продукта.


## v0.12 stable expansion

Полный ГСМ workflow больше не является будущим блоком — он реализован как следующий vertical slice поверх утверждённой stable v0.6 design/navigation базы:

- `/fuel` registry;
- `/fuel/new` structured fueling form;
- `/fuel/:fuelingId` detail;
- `/fuel/anomalies`;
- `/fuel/approvals`;
- `/reports/fuel`;
- `/reports/drivers`.

Новые экраны обязаны использовать общий API/query layer и coherent mock data. Mobile reachability для ГСМ обеспечивается topbar quick action без расширения 5-item bottom navigation.

### CSS / status implementation rule — v0.12

Новый reusable primitive нельзя стилизовать через широкий descendant selector по HTML-тегу.
Например, `.row span { display:block }` запрещён, если внутри строки могут появляться `status-pill`,
`status-text` или другие reusable span-components. Metadata получает отдельный BEM/class selector.

Перед использованием `justify-content` / `justify-self` проверять final computed layout mode в Chromium QA.
Status-компонент должен сохранять flex formatting context и не клипаться родительской ячейкой.

Для dense operational registries длинные статусы/контроль допускается показывать как compact
semantic text (`dot + label`) вместо lozenge. Pill оставлять там, где форма капсулы реально помогает
группировке и не съедает полезную ширину.

Mobile fuel card canonical pattern после v0.12:

`identity + compact status → liters/amount → price/time metadata → trip/station → semantic anomaly text`.

Не возвращать отдельный boxed price band и второй большой warning bubble без UX-причины.

### Stable rule

Не возвращать motion experiments после v0.6. Следующие product screens продолжают текущую Light TMS design system и проходят geometry QA до упаковки.


## v0.13 stable expansion — Driver field flow

Следующий законченный vertical slice реализован поверх утверждённой stable v0.6 navigation/design базы:

- `/driver` — полевой home / текущая смена;
- `/driver/trips` — назначенные рейсы;
- `/driver/trips/:tripId` — driver-focused рейс;
- `/driver/documents` — собственные перевозочные документы;
- `/driver/fuel/new` — ввод заправки и загрузка чека.

Driver flow использует task-first information hierarchy: маршрут, ТС, груз, документы, прогресс, заправка и следующий action. Управленческие финансы и backoffice-интеграционные детали не выводятся без role reason.

### Mobile driver navigation

Внутри `/driver/*` используется отдельная 4-item bottom navigation: Сегодня / Рейсы / Документы / Заправка. Это contextual role navigation внутри одного frontend, а не отдельное приложение. На desktop те же routes остаются usable для поддержки и тестирования.

### Data architecture

Все driver screens получают данные через API/query hooks. Нельзя импортировать mock fixtures напрямую в pages или создавать вторую независимую client-side копию рейсов/документов.

### Research / implementation gate

Новый UX-паттерн сначала сверяется с Apple HIG/accessibility, затем с официальной документацией React/используемых библиотек, после чего проверяются зрелые operations/fleet аналоги и edge cases. Существующий TMS-паттерн переиспользуется, если он уже решает задачу.

### QA boundary

Перед delivery проверяются desktop 1920/1440/1280 и mobile 430/390/360/340, long strings, status containment, fixed/sticky actions, touch targets и reachability. Motion experiments после stable v0.6 по-прежнему запрещены в mainline.


## v0.14 stable expansion — Fuel directories

Следующий законченный блок добавляет справочники, которые прямо участвуют в ГСМ-контуре:

- `/directories/gas-stations`;
- `/directories/gas-stations/:stationId`;
- `/directories/fuel-types`;
- `/directories/fuel-norms`;
- `/directories/fuel-norms/:normId`.

Source model: АЗС хранит сеть/адрес/координаты/доступные виды топлива; виды топлива администрируются отдельно; нормы связаны с ТС и коэффициентами условий эксплуатации.

Design rule: registry — scan first, details — context second. Не увеличивать строки таблицы ради длинного вспомогательного текста. Long content должен жить в detail view.

React/API rule: page-local state разрешён для search/filter UI, но directory entities приходят только через query/API layer. Backend остаётся source of truth для применимой нормы и коэффициентов.

Motion experiments после stable v0.6 по-прежнему не возвращать.

## v0.15 — Phase 1 frontend completion baseline

Current implementation now covers the agreed screen families from the specification:

- auth / 2FA;
- executive and operational dashboard;
- trips: registry / create / detail;
- fuel: registry / create / detail / anomalies / approvals / reporting;
- EPD: registry / create / detail/lifecycle states;
- EDO: registry / create / reconciliation / detail/approval;
- analytics: fuel / trips / drivers / EPD / EDO / finance;
- notifications;
- integrations / jobs / safe integration details;
- all current base directories required by the functional specification;
- driver field flow;
- mechanic technical-control flow;
- medical EPL flow;
- admin users / RBAC / audit / certificates / alert thresholds / EPD tariff;
- role/workspace entry.

### Completion does not mean feature invention

Do not add unapproved AI, telematics, WMS or operator features simply to create more screens. A new product surface requires an explicit business scenario and an API/data source.

### Mandatory implementation research gate

For any genuinely new UX pattern:

1. check Apple HIG/accessibility principles for hierarchy, controls, layout and readability;
2. check official React / React Router / chosen library documentation for implementation behavior;
3. use mature operations/fleet products and engineering discussions only as secondary pattern evidence;
4. adapt the pattern to TMS Light UI rather than copying another product;
5. run long-content + multi-viewport geometry QA before delivery.

### Stable motion boundary

The mainline keeps stable v0.6 navigation behavior. Rejected motion/trackpad experiments after it must not be copied back into production branches.


## v0.16 stable interaction baseline

Phase 1 screen coverage остаётся complete. v0.16 закрывает interaction completeness поверх существующих экранов.

Обязательные правила:

- visible action cannot be inert;
- filters/selections use scoped sheet/dialog patterns;
- destructive/legal actions require explicit confirmation;
- deterministic drill-down uses direct navigation instead of unnecessary modal;
- report status owns a stable left-aligned column and never shifts adjacent metrics;
- driver/mechanic/medical/admin mobile modes have contextual navigation; office roles remain in the main permission-filtered product shell;
- mobile profile surfaces Administration when permission allows;
- shared overlay handles Escape, focus containment/restore and background scroll lock;
- no rejected motion experiments are reintroduced.

New interaction state follows React single-source-of-truth discipline: store IDs/enums/open state, derive views from query data, keep backend as source of truth for business mutations.
