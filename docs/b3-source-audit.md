# B3 — source audit

Рабочий проект: outputs/tms-site, Next 16.3.8, npm package-lock, стек не обновлялся. Применимые AGENTS.md и документация установленного Next прочитаны. Пакет B3 извлечён отдельно в work/handoff-v6-b3; baseline B2 не распакован поверх сайта. Исходные пользовательские файлы и шрифты сохранены в snapshot; .env не читались для публикации и не включены в архивы.

Runtime: app/layout → SiteShell → ConsultationProvider → CaseExplorerProvider → принятая шапка/страница/футер + CookieNotice. Главная использует B1Sections/StoryExperience; продукты и кейсы — существующий internal shell; документы — LegalDocument. app/api/lead → lead-handler → validation + consent receipt. app/demo/route — только allowlist 307. Полный граф локальных импортов и App Router entries: b3-source-route-graph.json.

Удалены production DemoShell/DemoWorkspace/DemoSession/Demo/CaseDemo, demo.seed/scenarios, demo-state/navigation/case-demo, прежняя app/demo/page и Analytics-компонент. Прежний учебный код сохранён только в отдельном work/b3-before, вне source ZIP. В действующих продуктах/кейсах удалены учебные блоки; sitemap обновлён. Старые неиспользуемые маркетинговые Header/Sections ещё содержат legacy ссылки /demo, но не входят в активный graph; это не учебное приложение, а исторический неиспользуемый код. В active public JS проверены отсутствие учебных seed/исполняемого workspace и счётчика.

Публичная legal-часть — только три отобранных owner JSON, без handoff/proposed/research/source-index. Кейсы/оговорки неизменны; CRM/OMS подписка, связка продажа→исполнение, custom отдельно, Builder концепция. Результаты индивидуального внедрения не стали обещанием тарифа.

Из source ZIP исключены все .env, .git, зависимости, .next, QA/raw traces, внутренние материалы и font binaries. Сохранён bootstrap закреплённых @fontsource пакетов: извлечённая копия меняет только app/fonts.ts при отсутствии оригинальных шрифтов. Это воспроизводимая функциональная сборка, не обещание пиксельного совпадения fallback-шрифтов с локальными оригиналами.

Свежие dependency audit и отдельная извлечённая сборка описаны в b3-qa-report.md и b3-clean-source-check.json. Исторические B2/Stage-B отчёты в docs не являются результатами B3.
