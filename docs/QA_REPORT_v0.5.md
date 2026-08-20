# QA Report · v0.5

## Scope

Проверены критические паттерны текущего релиза:

- Dashboard status donut;
- Dashboard metric cards with expanded/collapsed sidebar geometry;
- EDO registry desktop table;
- EDO mobile document cards;
- Reports Hub;
- EPD-style report detail layouts;
- long counterparty names;
- long status pills.

## Viewports

Desktop:

- 1920×1080;
- 1440×900;
- 1280×800.

Mobile:

- 430px;
- 390px;
- 360px;
- 340px.

## Automated containment checks

Static Chromium QA harness verified:

- `documentElement.scrollWidth === clientWidth` on tested screens;
- no unexpected horizontal page overflow;
- panel/card direct children stay inside parent bounds;
- status-ring strong/label bounds stay inside bounded inner content wrapper;
- EDO mobile rows keep `scrollWidth === clientWidth`;
- long counterparty values wrap in the flexible value column rather than breaking the field label.

Intentional horizontal scrollers (desktop table wrapper, segmented tabs, selected summary strips) are excluded from false-positive overflow checks.

## Source checks

- TS/TSX: 30 source files passed TypeScript syntax transpilation with zero diagnostics.
- Semantic QA harness with local TypeScript compiler passed with zero errors.
- CSS: all current stylesheets parsed with zero syntax errors.

## Known environment limitation

Full dependency install / Vite production build could not be completed in this environment because npm registry access timed out. Run locally:

```bash
npm install
npm run build
```

before deployment.

## Final rerun after last mobile metadata change

After replacing anonymous mobile metadata text with explicit flexible value cells, the targeted final matrix was rerun for Dashboard and EDO at 1920/1440/1280/430/390/360/340 where applicable: 11/11 cases passed root width, status-ring bounds, mobile-card width and metadata-row width checks.
