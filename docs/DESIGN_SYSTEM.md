# TMS Light UI — Design system notes

## Identity

Header/Sidebar lockup: original TMS SVG + `TMS ASUB` + contextual product label `Логистика`.

## Surfaces

- app background — cool light gray;
- cards — white;
- navigation — Deep Navy;
- interaction — Sapphire/bright blue;
- semantic colors only for meaning/status.

## Responsive philosophy

### Desktop >= 861
- persistent sidebar;
- topbar search/org;
- tables;
- split/detail layouts;
- dense contextual information.

### Mobile <= 860
- top brand bar;
- bottom navigation;
- table -> cards;
- action -> sticky CTA;
- multi-column -> stacked / scrollable summary;
- no horizontal desktop tables as primary UX.

## Density

Цель — сложная система, которой легко пользоваться. Не минимизировать количество данных ценой потери контекста; вместо этого строить иерархию: headline -> decision data -> details.


## Typography quality pass v0.2

The product uses a readable 12/13/14/16/20 px operational scale rather than 8–11 px microcopy.
- 14 px: default UI/body text
- 13 px: compact controls and dense entity text
- 12 px: captions, table headers, metadata (minimum routine UI size)
- 11 px: status pills / tertiary labels only where space is constrained
- 16–20 px: card/section headings
- 30–38 px: page titles

Montserrat remains the brand/display face. Inter is used for tables, metadata and dense numeric/technical content.
Desktop sidebar can be collapsed to an icon rail to increase workspace width. Mobile layouts are intentionally recomposed instead of shrinking desktop tables.


## KPI tiles quality pass v0.3

KPI cards use a single left-aligned scan line for label, value and supporting text. Icons are secondary visual anchors and live in the top-right corner of the tile instead of consuming a permanent first column. This keeps the metric readable when the desktop sidebar is expanded and makes open/collapsed sidebar states visually consistent.

The pattern deliberately follows the information hierarchy common in operational dashboards: metric first, decoration second. Fleet products such as Motive and Samsara prioritize numbers/labels in dashboard tiles rather than leading every KPI with a large icon.

## Mobile typography quality pass v0.3

Mobile is optimized for comfortable reading, including older users and people with reduced visual acuity:
- 16 px: normal body/reading text baseline;
- 15–16 px: form/control text;
- 14 px: operational secondary text;
- 13 px: metadata/captions/status text (routine minimum);
- 17–20 px: section headings;
- 29–30 px: page titles.

The UI uses rem-based semantic tokens where possible and allows vertical growth instead of shrinking text to preserve a dense layout. Inputs use 16 px on mobile to remain comfortably readable and avoid browser zoom behavior on focus.

## Containment and QA rules v0.5

- Grid columns with unpredictable text use `minmax(0, 1fr)`.
- Reusable panel/card children use `min-width: 0` and `max-width: 100%`.
- Donut/ring labels live in a bounded inner wrapper, not unbounded absolute text.
- Status pills are content-sized with symmetric 10px horizontal padding.
- Mobile document cards use `[icon] [identity] [status]` at normal phone widths and stack the status only when the viewport becomes too narrow.
- Complex inner cards can use container queries because a card can be narrow on a wide viewport.
- Visual QA must check both expanded/collapsed desktop sidebar and 430/390/360 mobile sizes.

See `PRODUCT_DESIGN_PLAYBOOK.md` for the complete ruleset.

## Interaction / alignment quality pass v0.6

- Repeated desktop document rows use a fixed status slot: the pill stays content-sized, but the following columns never move when status text length changes.
- Status pills are left-aligned inside that slot; `Ошибка` and `Ожидает подписи` therefore preserve the same `Контрагент` / `Saby` column positions.
- Mobile check/status cards use a ~42px state-icon container so meaningful state markers have enough optical weight.
- KPI copy must not be rescued with character-level wrapping. Prefer precise compact copy such as `Маржа, %` over orphan-letter wrapping of `Маржинальность`.
- Line charts support an explicit expanded mode. On mobile the expanded chart becomes a full-screen data surface with a larger virtual plot width.
- Desktop topbar includes Back / Forward history controls. iOS/macOS native browser-history gestures remain untouched; a custom edge-swipe fallback is only for touch browsers without that native behavior.
