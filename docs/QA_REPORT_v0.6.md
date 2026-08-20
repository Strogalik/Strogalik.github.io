# QA Report · v0.6

## Scope

Targeted quality pass after EPD/EDO report feedback:

- repeated status-pill alignment in EPD/EDO attention rows;
- long vs short status text must not shift `Контрагент` / following columns;
- KPI label `Маржа, %` containment;
- mobile `check-card` state-icon optical size and containment;
- Dashboard status-ring containment regression check;
- inline chart expand control containment;
- expanded chart modal / full-screen mobile surface;
- desktop browser-history controls and touch edge-swipe implementation source review.

## Real Chromium layout matrix

A static Chromium QA harness loaded the **actual project CSS cascade** and measured DOM bounding boxes / scroll widths at:

### Desktop / tablet

- 1920×1080
- 1536×960
- 1440×900
- 1366×768
- 1280×800
- 1180×800
- 1024×768
- 861×800

### Mobile boundary / phones

- 860×800
- 430×932
- 390×844
- 360×800
- 340×720

**13/13 viewport cases passed.**

Programmatic assertions:

- no unexpected root horizontal overflow;
- all status pills stay inside their row;
- desktop report meta columns start at the same X coordinate for `Ожидает подписи` and `Ошибка`;
- desktop status pills are left-aligned inside a stable status track;
- metric label stays inside its card without character-level overflow;
- mobile state icon outer box is >= 40px and remains inside `check-card`;
- chart expand control remains inside `panel--chart`;
- `status-ring` inner text remains inside its bounded ring wrapper.

## Expanded chart QA

The expanded-chart surface was separately checked at:

- 1440×900
- 390×844
- 360×800
- 340×720

**4/4 cases passed** for:

- no root page overflow;
- expanded surface stays inside viewport;
- plot owns its intentional internal scroll area;
- expanded chart has a materially larger virtual plot width.

## Visual spot-check

Rendered Chromium screenshots were visually inspected at 1440 desktop and 390 mobile for the changed components. Status columns remain aligned; the mobile state icon has appropriate visual weight; `Маржа, %` does not produce an orphan character.

## Source checks

- TS/TSX: 30 source files passed TypeScript syntax transpilation with zero diagnostics.
- CSS: all 9 stylesheets parsed with zero CSS syntax errors.

## Navigation behavior

Implementation follows browser history rather than a separate app stack:

- desktop Back / Forward buttons call React Router history navigation;
- forward availability is reset correctly when a new PUSH discards the previous forward branch;
- iOS Safari native edge history swipe is not intercepted;
- macOS trackpad browser-history gesture is not intercepted;
- custom one-finger edge swipe is only a fallback for touch browsers without the native iOS Safari behavior;
- input/editor targets are excluded from the custom gesture.

## Environment limitation

`npm install` was attempted but npm registry access timed out in this execution environment, so a full Vite production build could not be run here. Before deployment run locally:

```bash
npm install
npm run build
```
