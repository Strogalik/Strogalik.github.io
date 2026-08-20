# QA Report · TMS ASUB v0.15 complete

## Scope

Final completion pass over new screens added after v0.14:

- create trip / EPD / EDO;
- EDO reconciliation;
- mechanic technical-control flow;
- medical EPL check flow;
- role/workspace hub;
- admin users/access/roles/audit/certificates/alerts/EPD tariff;
- remaining directory registries: cargo, reasons, templates, approval routes;
- auth / 2FA.

Stable v0.6 navigation/motion boundary was preserved. No v0.7/v0.8 route-transition experiments were reintroduced.

## Source / type checks

- TypeScript QA graph: PASS (`tsc -p /mnt/data/tsconfig_v015_qa.json`); current `src` contains 73 TS/TSX files.
- CSS parser: PASS, no parse errors across 14 imported CSS files.
- New pages consume API/query hooks rather than importing mock fixtures directly.
- New reusable status presentations preserve their own layout context; no new broad descendant selector was introduced to overwrite `status-pill` / `status-text` display behavior.

## Chromium geometry QA

Representative screen families were rendered in a static Chromium geometry harness:

- structured create form;
- EDO reconciliation;
- mechanic queue;
- mechanic detail;
- medical queue;
- admin hub;
- roles / permissions;
- audit table/cards;
- certificates;
- EPD tariff;
- workspace switcher;
- auth surface;
- 403 / session-expired / not-found system-state family.

Widths tested:

`1920 / 1536 / 1440 / 1366 / 1280 / 1024 / 861 / 860 / 430 / 390 / 360 / 340`.

Additional collapsed-sidebar cases were checked at `1920 / 1440 / 1280`.

Final result: **192 / 192 geometry cases PASS**.

Assertions include:

- no unintended root horizontal overflow;
- panels/cards contain their children;
- `min-width: 0` / wrapping behavior for long identity/value strings;
- status primitives do not clip their own text;
- semantic statuses stay in their allocated track;
- mobile controls/forms stay inside wrapper;
- mobile action layout does not depend on desktop sidebar width;
- table overflow is intentional only inside table scroll containers.

## Regression found and fixed during QA

At the 861px bridge width, the desktop shell still occupied sidebar space while mechanic/medical content was already too narrow for the full desktop row pattern. A dedicated intermediate `861–1024` component/layout bridge was added.

Rule added to the Playbook: **component collapse breakpoint must be based on available content width, not assumed to be identical to the global shell/mobile breakpoint.**

## Visual review

Representative 1440px and 390px renders were manually inspected for:

- mechanic queue/detail;
- medical queue;
- admin hub;
- roles;
- audit;
- certificates;
- tariff;
- workspace;
- create form.

Review focus: hierarchy, density, long content, mobile bottom-nav overlap, semantic statuses and family consistency with the approved Light TMS UI.

## Known verification limitation

The execution environment could not complete dependency installation from the npm registry, so a real `npm run build` with installed project dependencies is **not claimed as passed** here. Source-level TypeScript graph checking, CSS parsing and Chromium layout geometry passed.

On a developer machine, final release check remains:

```bash
npm install
npm run build
npm run dev
```
