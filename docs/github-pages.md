# GitHub Pages release — B10.1

The owner requested publication on 2026-10-13. This supersedes the historical no-deployment notes in the source-release reports.

Source: `TMS_V6_B10_1_source.zip`, supplemented with the original Inter/Montserrat WOFF2 assets from the supplied working project. The older `TMS_website_production (1).zip` is not the B10.1 release.

`npm run build:pages` creates `out/` for https://strogalik.github.io/. GitHub Actions builds and deploys pushes to `main`. The normal standalone build remains available with `npm run build` for future server hosting.

The export temporarily excludes the POST lead endpoint, request-dependent demo redirect and private review routes, restoring their source after building. Public demo/BRM links have static redirects. Analytics configuration is exported with analytics disabled. Form validation remains usable; a valid submission shows the existing unavailable state without sending contact data to a static host. The form offers tmsasub@yandex.ru as an alternative. Real lead delivery requires a configured backend.

The presentation remains noindex. Historical reports, including device/zoom limitations and the known extreme-mode one-pixel Hero overflow, remain unchanged.

Local export verification: build, TypeScript and lint passed; all 70 unit tests passed. All 47 browser checks passed against the actual static output: the 44 existing B10.1 calculator scenarios plus 3 hosting checks covering public routes/assets, unavailable lead delivery without POST requests, legacy redirects and excluded private review routes. These checks do not claim physical Safari/device coverage.
