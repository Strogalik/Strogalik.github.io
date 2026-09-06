# Verification — 2026-09-06

## Automated checks

- Strict TypeScript, ESLint, production static export: passed.
- Vitest: 6 domain and transport tests passed.
- Playwright against the production static export: 8 end-to-end scenarios passed, including real WebGL canvas, DOM controls and 3D-handle click, valve opening and persistent state while scrolling backwards, boiler activation, desktop and mobile navigation, calculation validation, truthful demo receipt, transient error/retry without losing data, static service page, reduced motion, midpage reload and emergency fallback. Real `WEBGL_lose_context` loss was also tested: the fallback appeared and the valve/lead dialog remained usable.
- axe-core: no WCAG A/AA rule violations in the checked desktop homepage and calculation dialog. This is automated coverage, not a complete accessibility certification.
- Responsive checks: 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560 and 915 × 412 landscape; no horizontal overflow. Text enlargement to 200% at 390 px passed.
- The arc-length-sampled route audit found no pipe intersections with measured text/button rectangles at 390, 768 and 1440 px. `?routeQA` exposes only numeric geometry samples to the local QA script.
- Local visual review covered desktop hero, valve, boiler, mobile hero, valve, boiler, menu and form; source logo is preserved. Static emergency posters come from the actual models.

## Design-reference checks

Read Next.js static-export and lazy-loading documentation bundled with the installed version and verified its public static-export guide: https://nextjs.org/docs/app/guides/static-exports.

Consulted current Apple HIG references for typography, accessibility and motion: https://developer.apple.com/design/human-interface-guidelines/typography, https://developer.apple.com/design/human-interface-guidelines/accessibility, https://developer.apple.com/design/human-interface-guidelines/motion. Applied readable type, restrained hierarchy, comfortable controls, visible focus, text enlargement and reduced-motion behavior. No iOS visual imitation.

## Limits

- Device sizes are browser emulation; no claim of testing physical iPhones/Android hardware.
- Software WebGL was used in automated Chromium checks, supplemented by the in-app browser's real WebGL rendering.
- Forms are demonstration-only; CMS, PostgreSQL, lead persistence and CRM are not connected.
- Production legal copy, source photo rights and large-format logo/source imagery require customer confirmation.
- Public-deployment results are reported with the final delivery after GitHub Actions and public checks finish.
