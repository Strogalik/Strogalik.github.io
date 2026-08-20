# QA Report — TMS ASUB Logistics v0.10 stable

## Scope

Этот pass намеренно узкий: унификация Directories Hub с Reports Hub и мобильная достижимость `Справочников` / `Уведомлений`. Остальной визуальный язык и поведение stable v0.6+ не менялись.

## Исправлено

### 1. Hub-card consistency

До v0.10 desktop-карточки отличались:

- `report-card`: min-height 210px, padding 22px, icon 52px, arrow 42px;
- `directory-card`: min-height 172px, padding 20px, icon 50px, arrow 38px.

В v0.10 `directory-card` приведён к той же геометрии и композиции, что `report-card`:

- min-height 210px;
- grid `52px minmax(0,1fr) auto`;
- padding 22px;
- radius 22px;
- icon 52×52 / radius 16px;
- arrow 42×42 / radius 13px;
- одинаковые hover / shadow правила;
- supporting metric вынесен в нижнюю строку карточки.

### 2. Mobile navigation reachability

- `Справочники` получили отдельную topbar quick-action на mobile;
- bell в topbar теперь является ссылкой на `/notifications`, а не декоративной кнопкой;
- bottom navigation остаётся из пяти основных разделов и не перегружается;
- для ширины <=360px добавлена отдельная компактная геометрия topbar action controls.

## Автоматические проверки

- TS/TSX syntax harness: **36/36 PASS**;
- CSS parser: **10/10 PASS**;
- targeted static UI invariants: **32/32 PASS**;
- key `report-card` / `directory-card` desktop geometry values совпадают;
- mobile quick links имеют route + responsive visibility rule;
- bottom navigation по-прежнему содержит пять primary destinations;
- v0.7/v0.8 View Transition / wheel gesture experiments отсутствуют.

## Проверенные edge cases

- длинные названия справочников используют `minmax(0,1fr)`;
- supporting metric остаётся в своей grid-column;
- на <=340px arrow может скрыться без потери основного действия карточки;
- mobile topbar на <=360px уменьшает quick-action tiles до 38px и ограничивает product subtitle;
- notification icon остаётся доступной одновременно на desktop и mobile.

## Ограничение среды

`npm install` в текущем execution environment снова не завершился из-за сетевого timeout, поэтому полный Vite production build здесь не заявляется как пройденный. Headless Chromium также блокирует локальные URL политикой окружения. Изменения проверены TypeScript syntax harness, CSS parser и source/layout invariants. Финальный интерактивный smoke-test рекомендуется запустить локально через `npm run dev`.
