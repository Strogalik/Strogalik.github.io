# TMS V6 B10.1 · Mobile Calculator Studio

Публикация на GitHub Pages разрешена владельцем 13.10.2026. Текущая ветка содержит адаптацию B10.1 для https://strogalik.github.io/: `npm run build:pages`, автоматический deploy из `main`. Оригинальные WOFF2 включены. Калькулятор и навигация работают без сервера; отправка заявок недоступна, аналитика выключена. Подробности: `docs/github-pages.md`. Статусы ниже относятся к исходному архиву и истории разработки.

Работающий мобильный калькулятор поверх завершённой B10. Статус: `awaiting_owner_review`; `stageBStarted:true`; `faqPromotion:true`; `publicDeploy:false`.

Запуск: `npm ci`, `npm run build`, `PORT=3200 npm run start`. Preview: http://127.0.0.1:3200/#calculator. Для разработки: `npm run dev`.

До 900 CSS px — одна светлая оболочка, белая линза «Продажи / Команда», результат перед редактором, плавное раскрытие вниз и независимое «Как считаем». С 901 px сохранён desktop B10. Один набор данных и полей; закрытие/resize сохраняют значения и доступный фокус. Формулы, defaults, юридические правила и серверная доставка не менялись.

Проверки: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:unit`; при работающем preview — `npx playwright test --config tests/b10-1.playwright.config.ts`. Отчёт: `docs/b10-1-mobile-review.md`, source-audit: `docs/b10-1-source-audit.json`. Галерея before/after и записи: `qa/v6-b10-1/index.html` в отдельном review ZIP. Старые результаты ниже — история.

Чистый исходник не содержит env/секретов, node_modules, .next, внутренних пакетов и файлов шрифтов. Оригинальные локальные шрифты рабочей копии сохранены. В чистом ZIP существующий prepare-fonts использует закреплённые @fontsource fallback. Проверка извлечённого архива использует уже установленные закреплённые зависимости; новая сетевая установка отдельно не проверялась.

Safari на физическом устройстве, VoiceOver и настоящий browser zoom требуют ручной проверки владельца. CSS text 200% — отдельная проверка. Реальные заявки, аналитика и публичное размещение не включены.

---

История предыдущих итераций:

# TMS V6 B10 · Calculator Studio

Текущий рабочий проект, desktop-доводка калькулятора поверх B9. Статус: `awaiting_owner_review`; `stageBStarted:true`; `faqPromotion:true`; `publicDeploy:false`.

Локальный запуск: `npm ci`, `npm run build`, `PORT=3200 npm run start`. Главная: http://127.0.0.1:3200/#calculator. Для разработки: `npm run dev`.

B10 включается от 901 CSS px. Мобильная B9 сохраняется; одно состояние и один редактор. На desktop общий инструмент ограничен 1200 px, раскрытия растут вниз. Математика и юридическая/серверная логика неизменны. Никакие реальные отправки, аналитика или публичное размещение этой итерацией не включаются.

Проверки: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:unit`; при работающем локальном сервере — `npx playwright test --config tests/b10.playwright.config.ts`. Полный отчёт: `docs/b10-calculator-review.md`. Галерея, кадры и видео — в отдельном review ZIP (`qa/v6-b10/index.html`).

Чистый source не содержит секретов, env, зависимостей, сборки, внутреннего пакета и двоичных шрифтов. Рабочие авторские шрифты сохранены; в чистой копии существующий `prepare-fonts.mjs` использует закреплённый fallback из зависимостей. Внешние сервисы настраиваются владельцем отдельно.

---

# TMS V6 B9 — текущая локальная версия

Стабильные desktop-опоры сотрудничества, FAQ и калькулятора; цельная смена подписи кейса; короткие режимы «Продажи» / «Команда» и отдельное «Как считаем». Статус: `awaiting_owner_review`, `stageBStarted:true`, `faqPromotion:true`, `publicDeploy:false`.

Preview: http://127.0.0.1:3200/. Отчёт: [docs/b9-design-review.md](docs/b9-design-review.md). Новые сравнения и реальные видео: [qa/v6-b9/index.html](qa/v6-b9/index.html) в отдельном review ZIP. Source-audit: [docs/b9-source-audit.json](docs/b9-source-audit.json).

Чистый исходник: Node ≥20.9.0, `npm ci`, `npm run build`, `PORT=3200 npm run start`. Бинарные шрифты не включены: существующий prebuild восстановит закреплённые npm-гарнитуры. Оригинальные локальные шрифты рабочей копии сохранены; для точного фирменного отображения нужны разрешённые оригиналы. Проверка извлечённого ZIP использует установленные закреплённые зависимости, а не новую сетевую установку.

Проверки: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm test`; B9: `npx playwright test --config tests/b9.playwright.config.ts` при запущенном сервере 3200. Для FAQ сначала запустить `node scripts/b6-preview.mjs` из корня приложения, затем его существующий Playwright config. Снимки старых этапов не являются результатами B9.

Известный 1 px overflow защищённого Hero в экстремальном режиме и ограничения Safari/устройств описаны в отчёте. Публичный запуск, включение аналитики и реальные отправки не выполнены и не разрешены этим архивом.

Ниже — историческая документация.

---

# TMS V6 B8 — текущая локальная версия

B8 доводит desktop-переход кейсов на главной и публичный футер. Состояние: `awaiting_owner_review`, `stageBStarted:true`, `faqPromotion:true`, `publicDeploy:false`.

Локальный сайт: http://127.0.0.1:3200/. Свежий отчёт: [docs/b8-final-review.md](docs/b8-final-review.md), сравнения и видео: [qa/v6-b8/index.html](qa/v6-b8/index.html) в отдельном review ZIP.

Запуск чистых исходников: `npm ci`, затем `npm run build` и `PORT=3200 npm run start`. Требуется Node ≥20.9.0. Font binaries по заданию не включены; существующий prebuild восстановит закреплённые @fontsource fallback. Оригинальные локальные шрифты текущего проекта сохранены. Для точного фирменного отображения нужны разрешённые локальные файлы шрифтов.

Проверки: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npx playwright test`, `npx playwright test --config tests/b8.playwright.config.ts`. Browser B8 ожидает локальный сервер 3200. Результаты, ограничения Safari/устройств и известный Hero321/320 перечислены в отчёте. Публичный deploy, живые заявки и включение аналитики не разрешены; условия B5 остаются открытыми.

Ниже — документация предыдущих этапов для контекста; её старые результаты не являются проверками B8.

# TMS V6 B7 — текущая локальная версия

Preview: http://127.0.0.1:3200/ · FAQ: http://127.0.0.1:3200/#faq

**awaiting_owner_review**, stageBStarted:true, faqPromotion:true, publicDeploy:false. Аналитика и реальная доставка не активированы.

Принятый Spotlight FAQ перенесён на главную. Добавлены прерываемые переходы продуктов, кейсов, начала работы и внутренних раскрытий; мобильный калькулятор показывает результат перед редактором; cookies получили компактную оболочку. Hero, футер и юридическая/расчётная логика сохранены.

Актуальные результаты: [motion review](docs/b7-motion-review.md), [cookies preservation](docs/b7-cookie-preservation.md), [source audit](docs/b7-source-audit.json). Свежие before/after и видео: отдельный review ZIP → `qa/v6-b7/index.html`. Старые отчёты ниже не являются проверкой B7.

Чистый source: Node >=20.9; `npm ci`, `npm run build`, `npm run typecheck`; `PORT=3200 npm start`. Проверки: `npm run lint`, `npm run test:unit`, `npm test`, `npx playwright test --config tests/b7.playwright.config.ts` при работающем локальном сервере 3200. Для закрытого FAQ: `node scripts/b6-preview.mjs`, затем `npx playwright test --config tests/b6.playwright.config.ts`.

ZIP не содержит env, секретов, зависимостей, сборки, внутренних пакетов или бинарных шрифтов. Bootstrap и закреплённые npm-шрифты сохранены. В рабочем проекте исходные шрифты не заменялись; восстановленная из ZIP гарнитура может иметь другие метрики. Проверка извлечённой копии описана в отчёте, она не выдаётся за проверку чистой сетевой установки.

Не выполнять публичный deploy или включение аналитики/заявок на основании этого пакета. B5 юридические и инфраструктурные условия остаются в силе.

---

# TMS V6 B5 — текущая локальная версия

Preview: http://127.0.0.1:3200/ · [Настройки](http://127.0.0.1:3200/cookies) · [Отдельный документ](http://127.0.0.1:3200/analytics-consent).

**awaiting_owner_review**, stageBStarted:true, publicDeploy:false, analyticsLiveEnabled:false, launchReady:false.

Юридические документы синхронизированы с редакцией11.10.2026 и адресом владельца. Аналитический выбор/адаптер подготовлены, runtime выключен. Дизайн B4 сохранён. [Изменения](docs/b5-legal-change-log.md), [карта данных](docs/b5-consent-and-data-map.md), [readiness](docs/b5-analytics-readiness.md), [QA](docs/b5-qa-report.md), [source audit](docs/b5-source-audit.md), [preservation](docs/b5-design-preservation.md), [release checklist](docs/b5-release-checklist.md). Снимки и до/после: отдельный review ZIP → qa/v6-b5/index.html.

Чистый source: `npm ci`, `npm run build`, `npm run typecheck`; `PORT=3200 npm start`. Для проверок: `npm run lint`, `npm run test:unit`, `npm test` (нужен установленный Chromium Playwright). Analytics и leads по умолчанию OFF; env/секретов в архиве нет. Бинарные шрифты исключены по заданию; pinned bootstrap восстановит npm fallback. Рабочие оригинальные шрифты сохранены, fallback может визуально отличаться. Никакого разрешения на публичный запуск или реальный счётчик этот архив не даёт.

Ниже — историческая документация; результаты прошлых этапов не являются текущим QA.

---

# TMS V6 B4 — текущая локальная версия

Preview: http://127.0.0.1:3200/ . Статус **awaiting_owner_review**, stageBStarted:true, publicDeploy:false, launchReady:false.

В B4 доведены футер, FAQ и перенос калькулятора при увеличении текста. Принятые сцены сохранены:180/180 pixel comparisons. Build/types/lint,21 unit и152 browser tests PASS. Актуальные документы: [QA](docs/b4-qa-report.md), [source audit](docs/b4-source-audit.md), [preservation](docs/b4-design-preservation.md), [release gates](docs/b4-release-checklist.md). Снимки/видео — в отдельном review ZIP, qa/v6-b4/index.html.

Чистый source: npm ci; npm run build; npm run typecheck; PORT=3200 HOSTNAME=127.0.0.1 npm start. Оригинальные font binaries исключены; существующий prepare-fonts использует pinned @fontsource fallback. В рабочем проекте оригинальные шрифты сохранены. Env/секретов в архиве нет. Для публичного запуска сначала закрыть checklist; не включать legal gate без подтверждения владельца.

Ниже — историческая документация прошлых итераций; её результаты не являются проверками B4.

---

# TMS V6 · B3

Навигация, общий разбор кейсов, legal pages и cookie notice реализованы поверх принятой A4.8 / B1 / B2. **awaiting_owner_review**, stageBStarted:true. Stage B продолжается; публичный запуск blocked.

[Рабочий preview](http://127.0.0.1:3200/) · [Кейсы](http://127.0.0.1:3200/cases) · [Согласие](http://127.0.0.1:3200/consent)

Фактические проверки: build/types/lint PASS, unit 21/21, Chromium **136 PASS / 3 FAIL**. Прежние три footer FAIL исправлены. Оставшиеся три — существующее в B2 переполнение защищённого калькулятора при 320/360/390 + text200% + spacing. Реальная доставка и юридические L1–L4 не подтверждены; deploy не выполнялся.

Актуальные документы: [QA](docs/b3-qa-report.md), [маршруты](docs/b3-navigation-audit.md), [данные и юридические вопросы](docs/b3-data-and-legal-audit.md), [сохранность дизайна](docs/b3-design-preservation.md), [source audit](docs/b3-source-audit.md), [release checklist](docs/b3-release-checklist.md), [статус](docs/b3-status.json).

Поставка: TMS_V6_B3_source.zip — полный проект; TMS_V6_B3_patch.zip — фактическая дельта с before/after SHA-256; TMS_V6_B3_review.zip — отчёты, свежие PNG и видео, галерея qa/v6-b3/index.html. Три owner legal JSON публичны намеренно; внутренние handoff/proposed в поставку не входят.

Локальный запуск: Node >=20.9, `npm ci`, `npm run build`, `npm run start` (127.0.0.1:3000). Можно задать PORT=3200. Формы без конфигурации честно отвечают 503. Для тестов используется только localhost stub; секреты и legal gate не включать автоматически.

Чистый ZIP исключает все .env (включая .env.example), node_modules/.next/.git, QA raw data, внутренние пакеты, старое учебное приложение и файлы гарнитур. В рабочей папке оригинальные шрифты сохранены. Bootstrap извлечённой копии автоматически берёт закреплённые npm-шрифты и меняет её app/fonts.ts; метрики могут отличаться от оригинальных WOFF2. Извлечённая сборка/types и smoke 20 маршрутов проверены отдельно.

---

Ниже сохранена история B2/ранних этапов. Её статусы, требования аналитики/демо и результаты не являются текущей B3. Актуальны документы выше.

# TMS V6 · B2

Внутренние страницы и навигация доведены поверх принятой A4.8 / главной B1. Их оформление уже одобрено владельцем. **Stage B: partial; QA: 105/108 browser, 20/20 unit; публичный запуск blocked.** Три FAIL относятся к увеличенному тексту в защищённом футере; отдельный кандидат не применён без разрешения.

[Локальный preview](http://127.0.0.1:3200/) · [CRM](http://127.0.0.1:3200/products/crm) · [Индекс кейсов](http://127.0.0.1:3200/cases)

Актуальны: [отчёт B2](docs/b2-completion-review.md), [route matrix](docs/b2-route-matrix.md), [source audit](docs/b2-source-audit.md), [сохранность](docs/b2-design-preservation.md), [статусы](docs/b2-status.json), [условия запуска](docs/release-checklist.md). Before/after и логи находятся отдельно в TMS_V6_B2_review.zip.

Свежие архивы: TMS_V6_source.zip — полный проект; TMS_V6_B2_patch.zip — фактическая дельта; TMS_V6_B2_review.zip — доказательства. Source исключает все .env-файлы (включая .env.example), зависимости, build, QA, внутренние пакеты и шрифтовые бинарники. Для локальной сборки env не требуется. Без production configuration формы честно недоступны. См. b2-clean-source-check.json для проверки извлечённой копии.

Запуск: Node >=20.9, `npm ci`, `npm run build`, `npm run start` (127.0.0.1:3000). Bootstrap автоматически берёт закреплённые npm-шрифты, если оригинальных WOFF2 нет. В рабочем дереве оригиналы сохранены; npm fallback не является побитным эталоном принятого дизайна.

---

Ниже — исторические заметки B1/Stage B. Их статусы и результаты не относятся к B2. Старые ссылки на .env.example описывают рабочее дерево, не содержимое чистого архива.

# TMS V6 · текущая итерация B1

B1 локально обновляет только кейсы, начало работы и размещение калькулятора на главной. A4.8 остаётся утверждённой; новые секции — **awaiting_owner_approval**. Публичного deploy нет, весь этап B остаётся **partial**.

Просмотр на этом Mac: [главная](http://127.0.0.1:3200/), [кейсы](http://127.0.0.1:3200/#cases), [калькулятор](http://127.0.0.1:3200/#calculator), [начало работы](http://127.0.0.1:3200/#cooperation). Локальный сервер должен работать; loopback не открывается с телефона.

Актуальные [отчёт B1](docs/b1-design-review.md), [карта источников](docs/b1-source-map.md), [статус](docs/b1-status.json), [before/after](qa/v6-b1/index.html). Свежие проверки: build/types/lint PASS, unit 20/20, browser 52/53. Один оставшийся FAIL относится к замороженному футеру при сочетании текста 200% и spacing. Реальный Safari и zoom для B1 не проверены.

Выдача B1: `TMS_V6_B1_patch.zip` (изменения, не полный сайт) и `TMS_V6_B1_review.zip`. Старые `TMS_V6_source.zip` и Stage B review не обновлялись и не являются B1. Применение patch и контрольные суммы описаны в его manifest. Рабочие локальные шрифты сохранены, в архивы бинарники шрифтов не входят.

---

Ниже — сохранённая документация базового Stage B. Её прежние результаты проверок и архивы относятся к состоянию **до B1**; запуск, маршруты и внешние ограничения по-прежнему применимы.

# TMS V6 · этап B

Рабочий Next.js 16.3.8 / React 19.3.0 проект. Принятый дизайн A4.8 сохранён; главная, продуктовые страницы, кейсы, разработка, компания, партнёры и обработка данных собраны в обычных маршрутах. Публичного размещения не было.

Текущий статус: **partial** — реализация B готова к просмотру, но в замороженном футере есть воспроизводимое переполнение при сочетании текста 200% и увеличенных интервалов. Предложение без применения: `docs/proposed-accessibility-fix.patch`. Остальные условия запуска — `docs/release-checklist.md`.

## Запуск

Node.js >=20.9 (проверено на 24.14), npm; версии зафиксированы в package-lock.json.

```sh
npm ci
npm run build
npm run start
```

Обычный локальный адрес: http://127.0.0.1:3000 . Для разработки: `npm run dev`. Сервер по умолчанию слушает только loopback.

Чистый архив намеренно не содержит бинарников шрифтов. `prebuild`/`predev` восстановят рабочую конфигурацию из уже закреплённых пакетов @fontsource Inter/Montserrat. В текущем рабочем проекте оригинальные локальные WOFF2 сохранены. Не запускать `FONTS_FROM_NPM=1` в одобренном рабочем дереве ради проверки: это меняет app/fonts.ts. Чистую сборку проверять в отдельной директории.

## Страницы

`/`, `/products/crm`, `/products/oms`, `/products/crm-oms`, `/cases`, `/cases/b2b-wholesale`, `/cases/flooring-manufacturer`, `/cases/online-school`, `/custom-development`, `/about`, `/partners`, `/privacy`. `/products/brm` отвечает 308 на `/custom-development`. `/demo` сохранено как дополнительный учебный пример на синтетических данных.

Закрытый эталон: `node scripts/review-v6.mjs`, затем http://127.0.0.1:3200/review/v6 . Он включается явно и только на loopback. В обычном запуске маршрут отвечает 404. Public Hero всегда использует CSS, даже с `?glass=sdk`; SDK-сравнение остаётся внутри закрытого review.

## Формы и данные

До согласования юридического текста и настройки сервиса приёма форма честно возвращает 503. Не копируйте реальные секреты в клиентские NEXT_PUBLIC переменные. `.env.example` содержит только пустой шаблон. Внешняя аналитика отключена; noindex включён по умолчанию. Индексация требует одновременно явного `NEXT_PUBLIC_NOINDEX=false` и HTTPS origin.

Новый intent `consultation`: имя, контакт и согласие обязательны; компания и описание необязательны. Контекст продукта/кейса проверяется allowlist. Все четыре старых intent и их правила сохранены. Успех — только после положительного ответа delivery-path; тайм-аут не означает подтверждённую доставку. Тесты используют исключительно синтетические контакты `example.test` и изолированный localhost upstream.

Калькулятор не требует контактов. Базовые модели в `lib/calculator.ts` неизменны; расширения отдельно в `lib/calculator-extension.ts`. Сценарная выручка не прибыль, стоимость времени не фактическая экономия. Отрицательная дельта, дроби, запятая, пустые поля и overflow проверяются.

## Проверки

```sh
npm run typecheck
npm run lint
npm run test:unit
npm test
```

`npm test` проверяет новые маршруты, API через stub, доступность и неизменённое демо. Один тест сочетания 200% текста и spacing пока воспроизводимо падает на замороженном футере; это не скрыто и не помечено как PASS. `tests/review-v6.spec.ts` сохранён неизменным, включая исторический assertion старого V5 Hero. Для свежего отчёта review используется `playwright.stage-b-review.config.ts`; нужен второй сервер с выключенным review на 3201. 59 проверок проходят, один старый V5 assertion намеренно несовместим с утверждённым переходом к V6.

`docs/v6-stage-b-report.md`, `docs/design-freeze-report.md`, `docs/approved-component-map.json`, `docs/source-audit.md` описывают фактический результат. Скриншоты/записи/логи поставляются отдельно в TMS_V6_STAGE_B_review.zip. Исторические отчёты A4.8 не переписаны; актуальный статус B — отдельный JSON.

Полный чистый исходник: TMS_V6_source.zip. В нём нет node_modules, .next, env/секретов, внутренних материалов, приватного baseline, сырых QA и бинарников шрифтов. Лицензии — `docs/licenses/`.
