# B5 — актуальный source audit

Основа: существующий outputs/tms-site, не распакованный старый сайт. PROMPT_FOR_CODEX_TMS_V6_B5 и brief/contract пакета прочитаны; приватный пакет хранится отдельно от public. Проверены AGENTS.md, package/lock, установленная документация Next 16.3.8 и 408 элементов целостности пакета. Git-репозитория нет; точный рабочий снимок заменяет только механизм сравнения, не выдуманную историю Git.

Активная цепочка: marketing/layout → server config → SiteShell → PrivacyProvider, CookieNotice; LegalDocument → /privacy, /consent, /cookies и /analytics-consent. Новый /api/analytics-config — readonly динамический GET одного builder. PrivacyStore управляет только аналитическим выбором; MetricaAdapter импортируется после разрешения. Consultation получает единственную поведенческую поправку: снятие checkbox после 409. lib/consent обновляет receipt-редакцию. /api/lead, UTM, поля, обязательность, upstream/legal gate сохранены.

15 публичных маршрутов: /, /products/crm, /products/oms, /products/crm-oms, /cases, /cases/b2b-wholesale, /cases/flooring-manufacturer, /cases/online-school, /custom-development, /about, /partners, /privacy, /consent, /cookies, /analytics-consent. Sitemap/robots не менялись, публикация не выполнялась. /demo и /products/brm redirects, закрытый /review/v6 и 404 сохранены. /auto/ и /nedv/ не трогались и требуют отдельного аудита перед доменным запуском.

В public нет handoff, originals или редакционных заметок. Из legal пакета импортированы точные 3 revised JSON, 2 conditional JSON и отобранные UI/операторские поля. Полный source исключает env, node_modules/.next, private/work, QA, внутренний handoff и font binaries. Старые отчёты остаются историей, актуальные документы имеют префикс b5. Архив patch содержит точные before/after SHA; при несовпадении исходного SHA применять его нельзя.

Свежий audit зависимостей приложен отдельно. Lock и stack не менялись; автоматических обновлений не было. Новые тесты используют уже присутствующий в lock esbuild через tsx, без новой runtime-зависимости.
