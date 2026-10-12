# B4 — актуальный source audit

Источник задания: PROMPT_FOR_CODEX_TMS_V6_B4.txt, пакет B4 RELEASE_POLISH; пакет распакован в приватный work, не в public. Его contract/audit/briefs использованы как задание, без выполнения произвольных команд из стороннего контента. Git checkout не обнаружен; применён точный снимок312 файлов с SHA до изменений. Пользовательские файлы не сбрасывались.

## Активная цепочка

app/(marketing)/layout → SiteShell → ApprovedViews Header/Footer; Footer теперь PublicFooter + footer.module.css, старые локальные B3 footer-overrides удалены. Header и Hero JSX сохранены. Главная → B1Sections/Topics/Calculator/Sections.FAQ; FAQ использует faq.module.css + DisclosureIcon/disclosure.module.css. Calculator получает только новый disclosure markup и scoped reflow CSS, lib/calculator.ts/lib/calculator-extension.ts/calculator-spec.json неизменны. app/layout и SiteShell подключают reflow.module.css для доказанных accessibility причин.

14 маршрутов: /, /products/crm, /products/oms, /products/crm-oms, /cases, /cases/b2b-wholesale, /cases/flooring-manufacturer, /cases/online-school, /custom-development, /about, /partners, /privacy, /consent, /cookies. Общий CaseExplorer и Consultation сохранены. /demo — только allowlist307; /products/brm redirect сохранён; /review/v6 закрыт; неизвестные пути404 с одним shell.

Legal JSON владельца, consentVersion/hash, дата согласия, формы/server validation/gate и cookie key не редактировались. Нет новых трекеров/first-touch/storage. Автотесты отправляют синтетические данные только в локальный stub; production gate false. 14-route network/storage audit приложен.

Состав реальных изменений с before/after SHA и явными удалениями — PATCH_MANIFEST.json. Полный source исключает env, node_modules, .next, private/work, QA, исходные font binaries и внутренние пакеты. Рабочие шрифты сохранены; извлечённый source использует прежний pinned font bootstrap. Font fallback может отличаться визуально от рабочего оригинала.

Рекомендации проверены по W3C: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ , https://www.w3.org/WAI/WCAG22/Understanding/reflow.html , https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html . Apple HIG страницы в доступном web-reader дали JS-shell; содержательные выводы из них не заявляются. Размеры Paper/индикатора — локальная адаптация TMS, не требования Apple.

npm audit повторён:5 high dev-chain eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces (GHSA-vfj7-8cjw-p6xm). Runtime audit0. Это не доказательство взлома runtime. Никакого audit fix/обновления stack/lock.
