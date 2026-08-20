# QA Report — TMS ASUB v0.11 stable

## Scope

Новый блок:

- Fuel Registry;
- Fueling Details;
- New Fueling;
- Fuel Anomalies;
- Fuel Approvals;
- Fuel Report;
- Driver Efficiency Report;
- mobile topbar reachability для ГСМ.

## Automated geometry pass

ГСМ-экраны проверены static Chromium harness на:

- 1440;
- 1280;
- 860;
- 430;
- 390;
- 360;
- 340 px.

6 representative surfaces × 7 viewport sizes = **42/42 PASS**.

Проверялись:

- root horizontal overflow;
- bounding boxes элементов относительно viewport;
- panel/card containment;
- long АЗС/ТС/driver strings;
- status/anomaly pills;
- form controls;
- sticky/mobile actions;
- intentional horizontal scrollers как исключение.

## Driver report pass

Driver Efficiency Report дополнительно проверен на:

- 1920;
- 1440;
- 1280;
- 860;
- 430;
- 390;
- 360;
- 340 px.

**8/8 PASS** после исправления mobile `panel-meta` wrapping.

## Visual geometry pass

Fuel Registry / New Fueling / Fueling Details:

- desktop 1440;
- mobile 390.

6 representative visual cases = **6/6 PASS** по geometry/containment.

Driver report отдельно визуально просмотрен на 1440 и 390 после final fix.

## Typography regression check

В новом `fuel-pass.css` удалены 10–11px supporting labels, которые могли бы нарушить утверждённый readability scale. Итоговые правила:

- desktop supporting text >= 12px;
- mobile supporting text >= 13px для новых surfaces;
- mobile form inputs = 16px;
- narrow mobile action text не уменьшается до 11px.

## Source checks

- **44/44 TS/TSX** files: syntax transpile PASS.
- **11/11 CSS** files: parser PASS.

## Build limitation

Полноценный `npm install` в текущем execution environment не завершился из-за network timeout npm registry. Поэтому `npm run build` не заявляется как проверенный здесь. На локальной машине после распаковки требуется:

```bash
npm install
npm run build
```

## Motion regression guard

v0.11 продолжает stable v0.6 navigation baseline. Новые motion experiments не добавлялись.
