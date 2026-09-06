# Asset manifest

| Local asset                                        | Source                                                                     | Purpose / rights                                                                                              |
| -------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `public/assets/rusgaz-mark.png`                    | User-supplied official logo                                                | Unmodified file. Header, drawer, footer, favicon. User supplied for this company site.                        |
| `public/assets/gas.webp`                           | https://static.tildacdn.com/tild3863-3862-4431-b234-623635313733/photo.jpg | Gas-supply illustration from rusgaz.su; rights need confirmation for production.                              |
| `public/assets/excavator.webp`                     | https://static.tildacdn.com/tild3932-3339-4539-b939-623332333564/photo.jpg | Excavator illustration from rusgaz.su; rights need confirmation for production.                               |
| `public/assets/water.webp`                         | https://static.tildacdn.com/tild3738-6530-4264-b233-363762323333/photo.jpg | Water/sewer illustration from rusgaz.su; rights need confirmation for production.                             |
| Inter Variable (Latin + Cyrillic, bundled by Next) | npm `@fontsource-variable/inter`                                           | SIL Open Font License; package license included in dependencies. Self-hosted output, no Google Fonts request. |
| Three.js pipe, saddle, collars, valve, boiler      | Procedural geometry in `components/3d`                                     | Original code, no external models, textures or GLB downloads.                                                 |
| Icons                                              | lucide-react                                                               | ISC license via package.                                                                                      |

No screenshot containing personal data is copied into this repository. The route reference was used only to understand the spatial path. No AI-generated replacement logo, stock case studies, external HDRs or remote runtime image hotlinks are used.

`public/assets/fallback-{hero,curve,valve,boiler}.png` are locally captured posters of the actual procedural WebGL scene, used only when the scene fails. They are not substituted for WebGL on mobile. Regenerate with `node scripts/capture-posters.mjs` after changing the models.
