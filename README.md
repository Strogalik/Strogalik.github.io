# TMS ASUB · Logistics Frontend v0.16 stable interactions

Светлый multi-device frontend TMS ASUB: логистика, рейсы, ГСМ, ЭПД, ЭДО, отчётность, справочники, role-focused field flows и системное администрирование.

## Статус

**Phase 1 frontend screen scope complete.**

v0.16 продолжает complete screen-scope v0.15 и закрывает interaction debt: стабильные статусы в отчётах, role-specific mobile navigation, mobile-доступ к администрированию, фильтры/sheets/confirmations/context actions и активные tabs/details без возврата motion-экспериментов.

Полная карта маршрутов: `docs/SCREEN_MAP.md`.

Покрытие исходного ТЗ: `docs/TZ_COVERAGE.md`.

## Основные блоки

- Dashboard / рейсы / создание и карточка рейса;
- ГСМ: registry / create / detail / anomalies / approvals / analytics;
- ЭПД: registry / create / EPL detail / lifecycle states;
- ЭДО: registry / create / reconciliation / detail / approval flow;
- Reports: trips / drivers / fuel / EPD / EDO / finance;
- Notifications;
- Integrations / jobs / details;
- Directories: vehicles, drivers, counterparties, routes, cargo, gas stations, fuel types, fuel norms, reasons, document templates, approval routes;
- Driver field workspace;
- Mechanic technical-control workspace;
- Medical EPL workspace;
- Admin: users, access, roles, audit, certificates, alerts, EPD tariff, security policy;
- Login / 2FA / session-expired and safe 403/404 states;
- Workspace switcher.

Desktop и mobile проектируются как две полноценные композиции одной системы. Mobile не является уменьшенным desktop: data tables превращаются в task-focused cards, формы перестраиваются, а роли получают только необходимый контекст.

## Стек

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- собственная TMS Light UI система на CSS

`src/api/client.ts` переключает mock API и реальный HTTP client. Страницы не читают fixtures напрямую.

## Запуск

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
```

## Backend integration

1. Backend публикует OpenAPI schema.
2. DTO / typed client подключаются внутри API layer.
3. `VITE_API_MODE=real` переключает frontend на HTTP.
4. Query hooks сохраняют одинаковый интерфейс для страниц.
5. Mutations инвалидируют только связанные query keys.
6. Permissions всегда повторно проверяются backend.
7. Saby / КЭП / 1С secrets никогда не попадают во frontend DTO ради отображения.
8. Role-focused screens используют те же business entity IDs, а не отдельные клиентские копии сущностей.

Подробнее: `docs/API_CONTRACT.md`.

## Design source of truth

`docs/PRODUCT_DESIGN_PLAYBOOK.md` — главный документ для дизайна, Codex и frontend-разработки.

Он фиксирует Light TMS language, typography, mobile/desktop composition, status geometry, directory/report card family, forms, role surfaces, CSS layout contract, reachability и QA gate.

### Motion boundary

Навигация остаётся на утверждённой stable v0.6 базе. Экспериментальные route animations после неё удалены из mainline и не должны возвращаться без отдельного прототипа и ручного approval.

## v0.16 interaction completion pass

Добавлены/доведены до рабочего prototype-state:

- стабильная status-column в Fuel report;
- contextual mobile navigation для driver / mechanic / medical / admin;
- mobile profile с явным доступом к Administration / Workspaces / Notifications / Integrations;
- shared modal/sheet/confirmation layer с Escape, focus containment/restore и mobile composition;
- registry filters, period/export choices, context actions;
- Trip Details tabs/edit/create-document interactions;
- EPD/EDO sign/check/export/history/context interactions;
- EDO reconciliation assignment/link choices;
- mechanic/medical confirmation flows;
- auth SSO choice + 2FA resend;
- source-backed `/admin/security` для 2FA / SSO / session/access policy.

Все эти изменения продолжают approved Light TMS UI и stable v0.6 motion boundary.

## QA

Последний отчёт: `docs/QA_REPORT_v0.16.md`.

Final completion geometry pass: **192 / 192 cases PASS** across 340–1920px representative layouts, включая collapsed/expanded sidebar cases. TypeScript QA graph и CSS parser также PASS.

> В текущем execution environment npm registry не дал завершить установку зависимостей, поэтому реальный Vite production build не заявляется как пройденный. На developer machine обязательно выполнить `npm install && npm run build`.

