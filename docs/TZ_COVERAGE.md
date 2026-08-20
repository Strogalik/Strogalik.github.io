# TMS ASUB · Coverage matrix vs initial functional specification — v0.16

Этот файл нужен как контроль, чтобы frontend не «забывал» разделы исходного ТЗ при дальнейшем развитии.

| Раздел исходного ТЗ | Frontend coverage |
|---|---|
| Роли: водитель | `/driver`, `/driver/trips`, `/driver/trips/:id`, `/driver/documents`, `/driver/fuel/new` |
| Роли: диспетчер/логист | `/dashboard`, `/trips*`, `/epd*`, `/edo*`, reports |
| Роли: механик | `/mechanic`, `/mechanic/vehicles`, `/mechanic/fuel`, `/mechanic/technical-control/:id`; contextual mobile nav |
| Роли: медработник | `/medical`, `/medical/documents`, `/medical/epl/:documentId`; contextual mobile nav |
| Роли: бухгалтер | `/edo*`, `/fuel*`, `/reports/finance`, `/reports/fuel`, integrations |
| Роли: руководитель | `/dashboard`, all reports, notifications |
| Роли: администратор | `/admin*`, `/integrations*`, `/directories*`; contextual mobile nav + Administration entry in mobile profile |
| ТС | `/directories/vehicles`, mechanic surfaces, trip/fuel context |
| Водители | `/directories/drivers`, trips, driver workspace, reports |
| Контрагенты | `/directories/counterparties`, trip/EDO/EPD context |
| Маршруты/точки | `/directories/routes`, trip create/detail |
| Номенклатура грузов/услуг | `/directories/cargo` |
| АЗС | `/directories/gas-stations`, `/directories/gas-stations/:id` |
| Типы топлива | `/directories/fuel-types` |
| Нормы расхода | `/directories/fuel-norms`, `/directories/fuel-norms/:id` |
| Причины простоев/отмен/отклонений | `/directories/reasons` |
| Шаблоны ЭДО | `/directories/document-templates` |
| Маршруты согласования | `/directories/approval-routes`, EDO details/create |
| Управление рейсами | `/trips`, `/trips/new`, `/trips/:id` |
| ГСМ / ввод заправки | `/fuel`, `/fuel/new`, `/fuel/:id`, `/driver/fuel/new` |
| Проверки ГСМ | `/fuel/anomalies`, `/fuel/approvals`, fueling detail |
| Аналитика ГСМ | `/reports/fuel` |
| ЭПД: ЭТрН/ЭПЛ/ЭЗЗ | `/epd`, `/epd/new`, `/epd/:id` |
| ЭПЛ / медосмотр / техконтроль | EPL detail + `/mechanic*` + `/medical*` |
| Saby / статусы / ошибки | EPD detail, `/integrations/saby`, `/integrations/jobs` |
| ЭДО: входящие/исходящие | `/edo`, `/edo/new`, `/edo/:id` |
| ЭДО: согласование | EDO detail approval flow, approval-route directory |
| Неопознанные входящие | `/edo/reconciliation` |
| Архив / поиск ЭДО | registry tab/search pattern in `/edo` |
| 1С/ERP / интеграционный контур | `/integrations`, `/integrations/:id`, `/integrations/jobs` |
| GPS/ГЛОНАСС / топливные системы | integration surface prepared; detailed provider-specific flows intentionally not invented without API scope |
| Рейсы и транспорт analytics | `/reports/trips` |
| Водители analytics | `/reports/drivers` |
| ЭПД analytics | `/reports/epd` |
| ЭДО analytics | `/reports/edo` |
| Финансы / рентабельность | `/reports/finance` |
| Руководитель / summary | `/dashboard` |
| Уведомления / алерты | `/notifications`, `/admin/alerts` |
| Login / 2FA | `/login`, `/auth/2fa` |
| Security policy / SSO / session | `/admin/security` |
| RBAC | `/admin/users`, `/admin/users/:id/access`, `/admin/roles`, `/admin/security` |
| Сертификаты | `/admin/certificates` |
| Аудит | `/admin/audit` |
| EPD package thresholds 80/95 | `/admin/epd-tariff` |
| Session / access / safe error states | `/auth/session-expired`, `/403`, catch-all not-found |

## Intentionally not invented

Исходное ТЗ допускает интеграции с GPS/ГЛОНАСС, топливными картами и WMS при наличии технической возможности. v0.16 показывает integration health/queue and prepared architecture, но не придумывает provider-specific maps, WMS screens или data flows без подтверждённого API.

Собственный оператор ЭДО/ЭПД и прямая передача в ГИС ЭПД в обход оператора также не входят в текущую frontend реализацию, потому что исходное ТЗ относит их за границы проекта.


## v0.16 interaction audit

The screen coverage above is also checked for reachability and actionable controls:

- office roles (dispatcher/logist, accountant, executive) remain in the shared main shell and are intended to be permission-filtered by backend role/scope;
- specialized driver/mechanic/medical/admin contexts receive role-aware mobile bottom navigation;
- filters, entity selection, reconciliation and scoped edits use sheets/dialogs;
- critical technical/medical/signature actions require confirmation;
- mobile profile exposes Administration, notifications, integrations and workspaces;
- report status columns are fixed-position tracks so long labels cannot shift financial metrics.
