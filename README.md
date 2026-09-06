# РусГаз

Presentation frontend for https://strogalik.github.io/.

Next.js App Router, React, strict TypeScript, Tailwind tokens, Radix dialogs, Three.js + React Three Fiber + Drei, GSAP/ScrollTrigger. One fixed WebGL canvas follows measured document anchors. Native browser scroll is retained.

## Local development

`npm ci`, then `npm run dev`.

`npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

`npx playwright install chromium`, then `npm run test:e2e` while the development server is available. Set `TEST_BASE_URL` to a static preview or public URL for the same browser checks.

Production static files are in `out/`. GitHub Actions builds and publishes `main` to GitHub Pages; no basePath is applied to this user-site repository.

## Deliberate boundaries

Forms validate locally and never submit personal data. The success state explicitly says that the demonstration did not deliver a lead. `?formTest=error` exercises a transient error followed by successful retry; `?graphics=fallback` exercises the emergency visual mode. Reduced-motion users receive a static WebGL scene and an accessible action to open the valve.

No CMS/backend is installed in this static build. See `docs/backend-next-step.md` for the domain/transport ports and migration path.

See `docs/content-map.md`, `docs/verification-needed.md`, and `docs/asset-manifest.md` for provenance and confirmation items. The supplied route screenshot and all of its personal data are intentionally absent from source and assets.
