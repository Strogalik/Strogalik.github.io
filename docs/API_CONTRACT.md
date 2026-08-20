# Draft API contract for backend

Ниже — frontend needs, а не навязанный окончательный naming backend-команде.

## Dashboard

`GET /api/v1/dashboard`

Нужно вернуть KPI, risk counters и короткие alert items со ссылкой/entity reference для drill-down.

## Trips

`GET /api/v1/trips`

Filters: period, status, counterparty, vehicle, driver, route, search.

`GET /api/v1/trips/{tripId}`

Карточка должна включать/позволять получить связанные документы, финансовый summary и timeline.

`POST /api/v1/trips`
`PATCH /api/v1/trips/{tripId}`

## EPD

`GET /api/v1/epd-documents`
`GET /api/v1/epd-documents/{documentId}`
`POST /api/v1/epd-documents`
`POST /api/v1/epd-documents/{documentId}/validate`
`POST /api/v1/epd-documents/{documentId}/sign`
`POST /api/v1/epd-documents/{documentId}/send`

Send должен быть asynchronous: backend быстро возвращает queued/processing state, а UI обновляет status отдельно.

## EDO

`GET /api/v1/edo-documents`

Filters: period, direction, status, counterparty, trip, type, amount, search.

`GET /api/v1/edo-documents/{documentId}`
`POST /api/v1/edo-documents/{documentId}/approve`
`POST /api/v1/edo-documents/{documentId}/sign`

## Reports

`GET /api/v1/reports/finance`
`GET /api/v1/reports/trips`
`GET /api/v1/reports/epd`
`GET /api/v1/reports/edo`

Current frontend screens expect summary KPIs, distribution rows and an action/attention list containing entity IDs for drill-down.

Агрегаты обязаны содержать dimension identifiers, чтобы frontend мог сделать drill-down до конкретных рейсов/документов.

## Standard error

Recommended shape:

```json
{
  "code": "EPD_VALIDATION_ERROR",
  "message": "Документ не прошёл проверку",
  "fieldErrors": {},
  "traceId": "..."
}
```

Не отдавать raw stack traces конечному пользователю.

## Notifications

`GET /api/v1/notifications`

Frontend needs: severity, category, title, compact context, time, unread state and entity/deep-link reference.

A notification must point to the source entity whenever the user can resolve the issue there.

## Integrations

`GET /api/v1/integrations`
`GET /api/v1/integrations/{integrationId}`
`GET /api/v1/integration-jobs`

Integration summary needs only safe UI data:

- status;
- environment;
- last successful/attempted sync;
- queue count;
- error count;
- organization;
- masked/safe external identifier.

Never return secrets to the browser merely for display. Raw tokens, private keys and credentials are not frontend DTO fields.

Integration jobs need operation, entity reference, status, safe external ID, created time and attempt count.

## Directories

`GET /api/v1/directories/vehicles`
`GET /api/v1/directories/drivers`
`GET /api/v1/directories/counterparties`
`GET /api/v1/directories/routes`

List endpoints should support server-side search/filter/pagination when datasets grow. Current mock frontend uses the same DTO shape but filters locally only for the prototype.

## Fuel / ГСМ — v0.11

`GET /api/v1/fuelings`

Filters: period, vehicle, driver, trip, gas station, fuel type, status, anomaly, search.

`GET /api/v1/fuelings/{fuelingId}`

Карточка должна вернуть связанную сущность рейса/ТС/водителя, данные чека, контрольные результаты, status согласования и состояние передачи в учёт.

`POST /api/v1/fuelings`

Frontend отправляет исходные данные пользователя. Backend остаётся source of truth для суммы, duplicate/price/tank/odometer/norm checks и итогового workflow status.

`POST /api/v1/fuelings/{fuelingId}/approve`
`POST /api/v1/fuelings/{fuelingId}/reject`

После mutation frontend инвалидирует registry, detail и fuel-report queries, а не вручную синхронизирует несколько локальных копий одной сущности.

Recommended create fields:

- occurredAt;
- tripId;
- vehicleId;
- driverId;
- fuelType;
- liters;
- pricePerLiter;
- odometer;
- gasStation;
- receiptNumber;
- receipt/file reference;
- paymentMethod;
- comment.

## Reporting expansion — v0.11

`GET /api/v1/reports/fuel`
`GET /api/v1/reports/drivers`

Fuel report needs at minimum:

- liters;
- total cost;
- average price;
- actual consumption and norm;
- anomaly/pending counts;
- series by period;
- breakdown by vehicle/driver/route/station where available;
- entity IDs for drill-down.

Drivers report needs per driver:

- trips;
- mileage;
- fuel consumption/cost;
- variance from norm;
- timing/delay indicators;
- configurable efficiency rating inputs and result.


## Driver field API — v0.13

Driver UI использует role-focused read models, но не отдельные дублирующие business entities. Trip/document/fueling IDs должны совпадать с основными сущностями системы.

`GET /api/v1/driver/profile`

Возвращает только безопасный профиль текущего водителя, необходимый полевому UI: имя, role label, связанное ТС/смена при наличии и compact operational context.

`GET /api/v1/driver/trips`

Назначенные текущему пользователю рейсы. Backend определяет доступ по authenticated user/driver binding; frontend не должен передавать произвольный driverId ради обхода permissions.

`GET /api/v1/driver/trips/{tripId}`

Driver-specific projection рейса:

- status;
- route/points;
- planned/actual times;
- assigned vehicle/trailer;
- cargo/customer/consignee fields, разрешённые роли;
- linked driver documents;
- progress/events;
- linked fuelings.

Не включать management-only profitability/revenue fields без отдельной role requirement.

`GET /api/v1/driver/documents`

Собственные/назначенные водителю перевозочные документы. Нужны ID документа, type/number, trip reference, status, signature state, safe Saby state и compact counterparty/context.

`GET /api/v1/driver/fuelings`

Заправки текущего водителя/назначенных рейсов, необходимые для field-history и trip context.

Для создания заправки driver mode использует общий:

`POST /api/v1/fuelings`

Backend обязан повторно проверить user/driver/vehicle/trip relationship, сумму, нормы и контрольные правила. Frontend-local calculation — только immediate UX feedback.

### Receipt upload

Рекомендуемый production contract — отдельный upload endpoint/presigned workflow либо file parameter в согласованном API. Фото/скан не хранить base64-строкой в React state дольше, чем требуется preview/upload. Backend возвращает file reference, который затем связывается с fueling.

### Driver permissions

Frontend route/navigation filtering — только UX. Backend обязан ограничивать driver endpoints текущей authenticated role/organizational scope и не возвращать финансовые/служебные поля, не нужные водителю.


## Fuel directories — v0.14

`GET /api/v1/directories/gas-stations`
`GET /api/v1/directories/gas-stations/{stationId}`

АЗС DTO: id, name, network, address, coordinates, available fuel types, active state. Список может возвращать compact usage count для UI, но source-of-truth по заправкам остаётся в fueling domain.

`GET /api/v1/directories/fuel-types`

Fuel type DTO: id/code, display name, unit, active state. Типы топлива администрируются отдельно и переиспользуются транспортом, заправками и аналитикой.

`GET /api/v1/directories/fuel-norms`
`GET /api/v1/directories/fuel-norms/{normId}`

Fuel norm DTO: vehicleId, fuelType, baseNorm, effectiveFrom, status, coefficients. Backend остаётся source of truth для расчёта применимой нормы и коэффициентов; frontend показывает значения и контекст, но не дублирует нормативную формулу в нескольких screens.

Для всех directory list endpoints production API должен поддержать server-side search/filter/pagination при росте объёма.

## v0.15 completion contracts

### Create trip

`POST /api/v1/trips`

Frontend needs a create DTO containing IDs/references for counterparty, route, vehicle, driver and cargo plus planned timing/mileage and financial plan fields. Backend returns the created trip and is source of truth for validation/permissions.

### Create EPD

`POST /api/v1/epd-documents`

Recommended create modes:

- from trip (`tripId`, `documentType`);
- manual/template-based according to approved backend capability.

The backend performs mandatory-field validation, participant/signature rules and assigns the document lifecycle state.

### Create EDO / reconciliation

`POST /api/v1/edo-documents`

`GET /api/v1/edo-reconciliation`

`POST /api/v1/edo-reconciliation/{itemId}/resolve`

A reconciliation item needs safe incoming-document identity, issue type, counterparty candidates / current match, related trip/order candidates and responsible user where applicable.

### Additional directories

`GET /api/v1/directories/cargo`
`GET /api/v1/directories/reasons`
`GET /api/v1/directories/document-templates`
`GET /api/v1/directories/approval-routes`

These endpoints follow the same search/filter/pagination conventions as other directories.

### Mechanic / technical control

`GET /api/v1/mechanic/technical-control`
`GET /api/v1/mechanic/technical-control/{inspectionId}`
`POST /api/v1/mechanic/technical-control/{inspectionId}/decision`

Mechanic projection contains only the operational data required for inspection: vehicle, driver/trip reference when applicable, odometer, fuel context, current technical state, notes and planned departure time.

Decision DTO should express a business decision (`allowed` / `blocked` or backend equivalent) plus required notes/measurements. Frontend must not infer final release authorization from presentation state alone.

### Medical / EPL checks

`GET /api/v1/medical/checks`
`GET /api/v1/medical/checks/{documentId}`
`POST /api/v1/medical/checks/{documentId}/decision`

Medical projection contains driver, EPL/trip, vehicle, planned departure and only the medical workflow fields approved by the customer. Do not include unrelated financial information.

### Admin users / RBAC

`GET /api/v1/admin/users`
`GET /api/v1/admin/users/{userId}`
`PATCH /api/v1/admin/users/{userId}`
`GET /api/v1/admin/roles`
`PATCH /api/v1/admin/users/{userId}/access`

Access contract separates:

- role/permission identifiers;
- organization/branch/object scope;
- display labels.

Frontend visibility is UX only. Backend authorization remains mandatory for every protected action.

### Audit

`GET /api/v1/admin/audit`

Read-only response needs timestamp, actor/service account, action, object/entity reference, safe before/after summary where permitted, IP when available and result. No frontend endpoint for deleting/editing audit records is expected.

### Certificates

`GET /api/v1/admin/certificates`

Browser DTO may contain:

- certificate ID;
- owner;
- expiry;
- status;
- fingerprint;
- scope.

It must **not** contain private keys or raw signing credentials.

### Alert rules

`GET /api/v1/admin/alerts`
`PATCH /api/v1/admin/alerts/{ruleId}`

Threshold/settings and delivery channels should be independently editable fields in the contract.

### EPD tariff/package

`GET /api/v1/admin/epd-tariff`

Needs included quantity, used quantity, projected quantity, period, overage unit price and configured warning/critical thresholds.

### Auth

Expected production integration is backend/auth-provider specific. UI currently models:

`POST /api/v1/auth/login`
`POST /api/v1/auth/2fa/verify`

SSO/OIDC/SAML flows should redirect/hand off according to the backend identity architecture. Passwords, second-factor secrets and provider credentials must never be stored in application client state beyond the minimum browser/auth flow requirement.


## v0.16 interaction-facing API conventions

UI overlays do not create a second business data model. Production endpoints should support the controls already present in the frontend.

### Registry filter/query convention

List endpoints should accept relevant optional query parameters such as `search`, `status`, `periodFrom`, `periodTo`, entity IDs and pagination. The exact naming may follow backend conventions, but one screen must not require ad-hoc incompatible filter shapes for the same entity family.

### Export

Report/document export actions should return a generated file or an asynchronous export job/reference. Frontend only selects format (`PDF/XLSX/CSV`) and does not rebuild authoritative report data client-side.

### Confirmed business actions

Technical release, medical decision, signing, approvals/rejections and access changes need explicit mutation endpoints and server-side permission/business validation. Confirmation dialogs are UX only, not authorization.

### Reconciliation

EDO reconciliation needs assignee/link mutations that accept stable entity IDs. Frontend stores selection IDs in UI state rather than cloning the full document/counterparty object.

### Role navigation

Backend session/profile response should expose permissions/role scopes sufficient for frontend route/navigation filtering. Client-side navigation visibility is never the security boundary.


### Security policy

`GET /api/v1/admin/security-policy`
`PATCH /api/v1/admin/security-policy`

Frontend needs safe configuration only: 2FA policy flags, SSO enabled/provider display name, session timeout and lockout policy. Never return client secrets, tokens, passwords or private keys. Every policy mutation must be permission-checked and audited by backend.
