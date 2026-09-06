# Content audit and map — 2026-09-06

Source: https://rusgaz.su/, visually inspected including the service popup. The old page's product popups contain English template text and empty price placeholders; these are omitted. No old repository frontend was restored.

| Source                                      | New location                                                          |
| ------------------------------------------- | --------------------------------------------------------------------- |
| Home hero, gasification                     | `/`, hero and `#services`; `/services/gazifikaciya/`                  |
| About and advantages                        | `#process`, `#scope`, `#expertise`                                    |
| `/#rabot`, catalogue                        | `#services` and `#directions`; all ten service routes                 |
| Gas-network design                          | `/services/proektirovanie/`                                           |
| Gas-network construction                    | `/services/gazovye-seti/`                                             |
| Trenchless laying (source typo: «проводов») | `/services/bestransheynaya-prokladka/`                                |
| Excavator rental                            | `/services/arenda-ekskavatorov/`                                      |
| Water and sewer                             | `/services/vodoprovod-kanalizaciya/`                                  |
| Heat networks                               | `/services/teplovye-seti/`                                            |
| Chimneys and ventilation                    | `/services/dymohody-ventkanaly/`                                      |
| Heating                                     | `/services/otoplenie/`                                                |
| PE pipe welding                             | `/services/svarka-pe-trub/`                                           |
| Consultation popup                          | Calculation dialog + truthful demo transport                          |
| `/#canan`, contacts                         | `#contacts`, all three phones, source address                         |
| https://rusgaz.su/konf                      | Source returns Tilda 404. `/documents/` provides factual company details and the existing data-policy document link; no legal policy is invented. |
| Personal-data policy in source footer       | Preserved exact Google Drive document link                            |
| Partners logo strip                         | Omitted pending identification and current relationship verification  |

No verified case-study records were found. Photos are described as source-site illustrations of service areas, never attributed to invented projects. FAQ is a cautious editorial synthesis of the published service/consultation information; technical, price and legal promises are excluded.

The source uses hash navigation, not a set of stable service paths. Production redirect mapping: `/#rabot` → `/#services`, `/#canan` → `/#contacts`, source catalogue product hash → corresponding service page. GitHub Pages cannot redirect a separate domain or server-side hash fragments; production-domain redirects are a later hosting task.
