# TMS ASUB · Screen map — v0.16 stable interactions

v0.16 сохраняет весь согласованный frontend-scope текущего ТЗ: core logistics, ГСМ, ЭПД, ЭДО, отчётность, справочники, интеграции, полевой контур водителя, механик/медработник и системное администрирование.

## Auth / system entry

| Route | Screen | Desktop | Mobile |
|---|---|---|---|
| `/login` | Login | centered auth + brand context | single auth card |
| `/auth/2fa` | 2FA | focused verification card | focused verification card |
| `/auth/session-expired` | Session Expired | focused re-auth state | focused re-auth state |

## Core logistics

| Route | Screen | Desktop pattern | Mobile pattern |
|---|---|---|---|
| `/dashboard` | Executive Dashboard | KPI + chart + attention split | attention first + 2-col KPI + stacked analytics |
| `/trips` | Trips Registry | full data table | trip cards |
| `/trips/new` | Create Trip | structured form + context rail | one-column sections + full-width actions |
| `/trips/:tripId` | Trip Details | route hero + finance + related context | stacked route/context + related cards |
| `/epd` | EPD Registry | stable registry table | identity-left / status-right document cards |
| `/epd/new` | Create EPD | source-choice cards | stacked source choices |
| `/epd/:documentId` | EPL / EPD Details | document + readiness rail | stacked document + sticky primary action |
| `/edo` | EDO Registry | stable document table | document cards |
| `/edo/new` | Create EDO | structured form + approval context | one-column form |
| `/edo/reconciliation` | Incoming Reconciliation | issue queue + actions | stacked issue cards |
| `/edo/:documentId` | EDO Details | document + approval flow | stacked blocks + vertical approval timeline |

## ГСМ

| Route | Screen | Desktop pattern | Mobile pattern |
|---|---|---|---|
| `/fuel` | Fuel Registry | KPI + status tabs + table | KPI + compact fueling cards |
| `/fuel/new` | New Fueling | structured form + sticky summary | one-column 16px form + sticky submit |
| `/fuel/:fuelingId` | Fueling Details | control hero + info/receipt split | stacked control + receipt/accounting |
| `/fuel/anomalies` | Fuel Anomalies | action-first anomaly rows | stacked anomaly rows/cards |
| `/fuel/approvals` | Fuel Approvals | decision cards | one-column decision cards |

## Reporting

| Route | Screen |
|---|---|
| `/reports` | Reports Hub |
| `/reports/trips` | Trips & Transport Report |
| `/reports/drivers` | Driver Efficiency Report |
| `/reports/fuel` | Fuel / ГСМ Report |
| `/reports/epd` | EPD Report |
| `/reports/edo` | EDO Report |
| `/reports/finance` | Finance & Profitability Report |

Reports use the approved sequence: KPI → distribution/trend → attention list → drill-down. Charts are never the only carrier of a critical value.

## Notifications / integrations

| Route | Screen | Desktop pattern | Mobile pattern |
|---|---|---|---|
| `/notifications` | Notification Center | summary + scan-friendly event list | stacked event rows |
| `/integrations` | Integrations Hub | system health cards | stacked integration cards |
| `/integrations/:integrationId` | Integration Details | safe connection facts + health/log | stacked facts/health |
| `/integrations/jobs` | Integration Jobs | diagnostic table | compact operation cards |

## Directories

`/directories/:directoryId` renders the appropriate registry from the shared registry system.

| Route | Screen |
|---|---|
| `/directories` | Directories Hub |
| `/directories/vehicles` | Vehicles Registry |
| `/directories/drivers` | Drivers Registry |
| `/directories/counterparties` | Counterparties Registry |
| `/directories/routes` | Routes Registry |
| `/directories/cargo` | Cargo / Services Registry |
| `/directories/gas-stations` | Gas Stations Registry |
| `/directories/gas-stations/:stationId` | Gas Station Details |
| `/directories/fuel-types` | Fuel Types Registry |
| `/directories/fuel-norms` | Fuel Norms Registry |
| `/directories/fuel-norms/:normId` | Fuel Norm Details |
| `/directories/reasons` | Downtime / cancellation / deviation reasons |
| `/directories/document-templates` | EDO Document Templates |
| `/directories/approval-routes` | Approval Routes |

Registry is scan-first; long context moves to a detail surface instead of increasing every row height.

## Driver field flow

| Route | Screen | Desktop pattern | Mobile pattern |
|---|---|---|---|
| `/driver` | Driver Today | concise role workspace | current trip first + focused task navigation |
| `/driver/trips` | My Trips | role-filtered table | assigned trip cards |
| `/driver/trips/:tripId` | Driver Trip | route + assignment/docs | stacked route/docs/progress |
| `/driver/documents` | My Documents | transportation document table | identity/status cards |
| `/driver/fuel/new` | Driver Fueling / Receipt | structured capture | trip/vehicle context + receipt capture + 16px inputs |

Driver surface intentionally excludes management-only profitability and system-admin context.

## Mechanic flow — v0.15

| Route | Screen | Desktop pattern | Mobile pattern |
|---|---|---|---|
| `/mechanic` | Technical Control Queue | KPI + scan-friendly control rows | stacked vehicle/control cards |
| `/mechanic/technical-control/:inspectionId` | Technical Inspection | vehicle facts + control form/action rail | focused inspection + full-width actions |

Mechanic sees vehicle, odometer, fuel and technical-control context only; unrelated finance/document administration is not surfaced.

## Medical flow — v0.15

| Route | Screen | Desktop pattern | Mobile pattern |
|---|---|---|---|
| `/medical` | Medical Check Queue | focused EPL queue | driver/EPL cards |
| `/medical/epl/:documentId` | Medical Mark | driver/vehicle/trip + decision panel | focused check + full-width decision actions |

Medical surfaces intentionally avoid unrelated financial information.

## Workspace / role entry

| Route | Screen |
|---|---|
| `/workspace` | Role / workspace switcher |

The avatar/profile surface links to `/workspace`, from which driver, mechanic, medical and admin role-surfaces are reachable on desktop and mobile.

## Administration / RBAC / security — v0.15

| Route | Screen | Key responsibility |
|---|---|---|
| `/admin` | Administration Hub | system settings navigation |
| `/admin/users` | Users | accounts, status, 2FA, org scope |
| `/admin/users/:userId/access` | User Access | role/scope/permissions |
| `/admin/roles` | Roles & Permissions | module/organization/object permissions |
| `/admin/audit` | Audit Log | immutable read-only critical event trail |
| `/admin/certificates` | Certificates | owner/expiry/fingerprint/scope; no private key |
| `/admin/alerts` | Alert Rules | thresholds and channels |
| `/admin/epd-tariff` | EPD Package / Tariff | usage, forecast, 80/95% thresholds |

Existing `/integrations*` pages are also part of the administrator workflow. Secrets are never rendered merely for configuration UI.

## Mobile shell reachability

- bottom navigation: Обзор / Рейсы / ЭПД / ЭДО / Отчёты;
- topbar quick actions: ГСМ / Справочники / Уведомления;
- avatar/profile: `/workspace`, then role-focused workspaces;
- driver routes have their own contextual 4-item bottom navigation;
- every mobile-adapted screen must have a visible route path; manual URL entry does not count as reachability.

## System / error states

| Route | Screen |
|---|---|
| `/403` | Access denied |
| `*` | Not found / safe return |

## Completion boundary

v0.15 has no planned missing screen block from the agreed Phase 1 frontend specification. Future screens are product expansion, not completion debt: additional telematics/WMS/AI capabilities are added only when the business/API scope is explicitly approved.

Motion remains on the stable v0.6 behavior. Rejected route-animation experiments are not part of this map.


## v0.16 interaction/reachability layer

No new business domain is invented; existing screens receive complete interaction paths.

- Global search → sheet with entity deep-links.
- Organization/branch → scoped choice overlay.
- Profile → Workspaces / Administration / Notifications / Integrations.
- Registry filters → scoped sheets.
- Trip details → active tabs, edit sheet, create-document choice, context actions.
- EPL/EDO → validation/sign/export/history/context actions.
- Fuel detail → receipt preview + contextual actions.
- EDO reconciliation → assignee/link choices.
- Mechanic/medical decisions → confirmation dialogs.
- Admin users/roles/access → invite/create/matrix/save/block interactions.
- Auth → SSO choice and 2FA resend state.

### Mobile role navigation

- main office shell: Dashboard / Trips / EPD / EDO / Reports;
- driver: Today / Trips / Documents / Fuel;
- mechanic: Control / Vehicles / Fuel / Workspaces;
- medical: Checks / EPL / Workspaces;
- admin: Main / Users / Roles / Audit.

`/workspace` also contains an `Основной контур` entry for Руководитель / логист / бухгалтер, making explicit why those office roles use the shared main shell instead of duplicated role routes.
