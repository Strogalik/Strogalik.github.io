# QA Report · TMS ASUB v0.16 stable interactions

## Scope

v0.16 starts from the v0.15 complete screen set and keeps the stable v0.6 motion/navigation boundary. This pass focuses on:

- Fuel report status alignment;
- role-aware mobile navigation;
- mobile Administration reachability;
- modal/sheet/confirmation/context-action completeness;
- Trip detail tabs and actions;
- EDO reconciliation choices;
- mechanic/medical decisions;
- auth/SSO/2FA interactions;
- no inert visible buttons.

## Source checks

- TypeScript QA graph: PASS with `tsc -p /mnt/data/tsconfig_v016_qa.json`; current `src` contains 77 TS/TSX files.
- Imported CSS files: 15; parser errors: 0.
- Static literal `Link/NavLink to="..."` route audit: 78 links checked, 0 unresolved router paths.
- Inert-button source audit: no visible `<button>` remains without an event handler or submit semantics in project TSX.
- Global quick-search fueling deep-link corrected to existing mock entity `fuel-8841`.
- Rejected v0.7/v0.8 route-motion experiments were not reintroduced.

## Fuel report regression

`report-entity-list fuel-report-list` now owns a stable status track:

`identity | status | amount | deviation | disclosure`.

Checks use rows with different warning lengths (`На согласовании`, `Требует проверки цены`). Desktop assertions verify:

- identical left edge for status text across rows;
- minimum 18px visual gap before the Sum column;
- status remains `inline-flex/flex` in final computed CSS;
- no internal clipping.

Mobile intentionally stacks the status below identity and preserves left alignment.

Result: PASS at `1920 / 1440 / 1280 / 1024 / 861 / 860 / 430 / 390 / 360 / 340`.

## Role navigation / reachability

Checked mobile shells at `430 / 390 / 360 / 340`:

- main: 5 items;
- driver: 4 items;
- mechanic: 4 items;
- medical: 3 items;
- admin: 4 items.

Mobile profile sheet contains a visible `Администрирование` action plus Workspaces, Notifications and Integrations.

Office roles (executive/logist/accountant) intentionally remain in the shared main shell; specialized field/system modes get contextual bottom navigation.

## Overlay/modal geometry

Representative filter sheet and profile sheet checked at `1440 / 430 / 390 / 360 / 340`:

- no root horizontal overflow;
- sheet contained inside viewport;
- footer buttons stay reachable;
- long labels wrap inside their own tracks.

Shared `Overlay` also implements:

- Escape close;
- body scroll lock;
- keyboard focus containment;
- focus restore to the invoking control;
- backdrop close;
- accessible dialog title/description linkage.

## Full geometry regression

The existing comprehensive v0.15 representative harness was rerun with all v0.16 CSS imported.

Widths:

`1920 / 1536 / 1440 / 1366 / 1280 / 1024 / 861 / 860 / 430 / 390 / 360 / 340`.

Expanded/collapsed sidebar cases remain included on large desktop.

Final result: **192 / 192 geometry cases PASS**.

Assertions include root overflow, panel/card containment, long content, status primitives, mechanic/medical/admin surfaces, structured forms and intermediate bridge widths.

Additional v0.16 interaction harness: **40 / 40 cases PASS**.

Admin security policy regression: **4 / 4 focused widths PASS** (`1440 / 860 / 390 / 340`).

## Visual review

Manual screenshots reviewed at 1440 and 390 for:

- Fuel report status/amount alignment;
- filter sheet;
- mobile profile Administration entry.

The report status column is visually left-aligned and no longer crowds the Sum column. Mobile sheets follow the approved Light TMS composition.

## Known environment limitation

`npm install` timed out against the package registry in the execution environment, so a real installed-dependency `npm run build` is not claimed as passed here.

On a developer machine run:

```bash
npm install
npm run typecheck
npm run build
npm run dev
```
