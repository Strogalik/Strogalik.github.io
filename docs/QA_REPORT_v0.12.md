# QA Report — TMS ASUB v0.12 stable

Дата: 20.08.2026

## Scope

v0.12 не добавляет новые product routes. Это corrective design/system pass поверх v0.11:

- compact mobile Fuel Registry card;
- desktop Fuel Registry status/control presentation;
- Fuel Anomalies status presentation;
- CSS cascade/layout-contract hardening;
- повторная проверка всего v0.11 ГСМ-блока.

## Исправленная первопричина

В `fuel-anomaly-row` существовал слишком широкий descendant selector:

`... .fuel-anomaly-row__status span { display:block; }`

Он мог переопределить `display:inline-flex` reusable status primitive из-за большей specificity. В таком состоянии flex-alignment свойства status component переставали работать так, как ожидалось.

Исправление:

- metadata time получил собственный класс `fuel-anomaly-row__time`;
- generic descendant override удалён;
- status primitive больше не зависит от HTML tag selector внутри page layout;
- соответствующее правило добавлено в Product Design Playbook / Master Spec.

## Design changes

### Fuel Registry — desktop

- длинный operational status теперь отображается как compact `status-text` (`semantic dot + label`), а не как широкая капсула;
- `Контроль` также использует semantic text вместо нескольких warning pills;
- стабильные ширины колонок не зависят от длины status content;
- status/control не клипятся `td { overflow:hidden }`.

### Fuel Registry — mobile

Старая композиция:

`time above identity → status pill → boxed amount band → rows → warning bubble`

Новая композиция:

`identity + status → liters / total → Цена / Время → Рейс / АЗС → semantic warning text`

Результат:

- карточка ниже;
- цена и время сканируются быстрее;
- warning не создаёт второй тяжёлый bubble;
- длинная АЗС переносится только внутри своей value-column;
- на <=360px status переходит под identity без horizontal overflow.

### Fuel Anomalies

- причины отклонений переведены из lozenge-group в semantic text;
- status + time имеют отдельные classes/layout responsibility;
- длинные причины/ТС остаются contained на mobile и desktop.

## Automated geometry QA

### Targeted v0.12 pass

Проверены:

- Fuel Registry;
- Fuel Anomalies;
- Fuel Approvals.

Viewports:

- 1920 expanded/collapsed sidebar;
- 1440 expanded/collapsed sidebar;
- 1280;
- 861;
- 860;
- 430;
- 390;
- 360;
- 340.

Всего: **33/33 cases PASS**.

Guards:

- root horizontal overflow;
- card/row child containment;
- long station/company strings;
- status component scrollWidth/clientWidth;
- status component final display keeps flex formatting context (`inline-flex` or browser blockified `flex`);
- table status/control clipping;
- mobile status fallback.

### Full v0.11 GСM regression pass on v0.12 CSS

Screens represented:

- Fuel Registry;
- Fuel Details;
- Fuel Anomalies;
- Fuel Approvals;
- New Fueling;
- Fuel Report.

Viewports: 1440 / 1280 / 860 / 430 / 390 / 360 / 340.

Result: **42/42 PASS**.

### Fuel Report status regression

Viewports: 1920 / 1440 / 1280 / 860 / 430 / 390 / 360 / 340.

Result: **8/8 PASS**. Long `На согласовании` status stays contained as semantic text.

### Drivers Report regression

Viewports: 1920 / 1440 / 1280 / 860 / 430 / 390 / 360 / 340.

Result: **8/8 PASS**.

## Source checks

- TS/TSX syntax parse: **45/45 PASS**.
- CSS parse: **11/11 PASS**.
- Old v0.7/v0.8 motion experiments were not reintroduced.

## Visual review

Manually reviewed representative Chromium renders:

- Fuel Registry — 1440 / 390;
- Fuel Anomalies — 1440 / 390;
- Fuel Approvals — 1440 / 390.

No unexpected object overflow, clipped status background, orphan status text or card escape was found in the final pass.

## Build limitation

This environment still does not contain project npm dependencies, so a full `npm run build` is not claimed as completed here. The source, CSS and browser-layout harnesses above were run locally in the execution environment.
