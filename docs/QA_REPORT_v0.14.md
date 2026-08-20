# TMS ASUB · QA Report v0.14 stable

## Scope

Новый блок: ГСМ-справочники.

Проверены:

- `/directories`;
- `/directories/gas-stations`;
- `/directories/gas-stations/:stationId`;
- `/directories/fuel-types`;
- `/directories/fuel-norms`;
- `/directories/fuel-norms/:normId`.

## Source / architecture checks

- 51 TS/TSX source files: TypeScript transpile syntax harness — PASS.
- Internal TypeScript graph check с временными external-module shims — PASS; отдельно исправлена неполная `NotificationCategory` map для `fuel`.
- 13 CSS files: CSS parser — PASS.
- Все новые business data читаются через API/query layer; прямого импорта mock fixtures в pages нет.
- HTTP API и mock API имеют одинаковые новые directory methods.
- Route order проверен: detail routes объявлены до generic `/directories/:directoryId`.
- Motion experiments после stable v0.6 в `src` не обнаружены.

## Geometry QA

Chromium geometry harness: **50/50 cases PASS**.

Viewports:

- 1920 desktop — expanded + collapsed sidebar;
- 1440 desktop — expanded + collapsed sidebar;
- 1280 desktop;
- 860 tablet boundary;
- 430 mobile;
- 390 mobile;
- 360 mobile;
- 340 narrow fallback.

Проверялись:

- root horizontal overflow;
- containment внутри directory-card / mobile-entity-card / panel;
- status-pill computed display и text containment;
- длинные названия АЗС;
- длинные адреса;
- длинные названия ТС;
- коэффициенты и их описания;
- primary norm value;
- desktop table intentional scrolling only;
- hub card family geometry;
- mobile action target для перехода в detail.

## Visual review

Отдельно отрендерены и просмотрены:

- Directories Hub — 1440;
- АЗС Registry — 390;
- АЗС Details — 390;
- Fuel Norm Details — 390.

После QA дополнительных overflow fixes не потребовалось: финальный harness прошёл без geometry failures.

## Build note

`npm install` в execution environment снова не завершился из-за network timeout. Поэтому полноценный `npm run build` не заявляется как пройденный. Source syntax, CSS parsing и Chromium geometry QA пройдены отдельно.
