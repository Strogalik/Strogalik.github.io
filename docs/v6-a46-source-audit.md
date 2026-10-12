# Source audit · TMS V6-A4.6

2026-10-09T15:44:01.384885+00:00. awaiting_owner_approval; stageBStarted:false; publicDeploy:false.

Рабочая основа — существующий outputs/tms-site A4.5. Git metadata отсутствует; git status вернул «not a git repository». Git не создавался, reset/clean не выполнялись. Сохранён snapshot187 source/config/doc файлов с SHA256. Read-only comparison: все26 reference-файлов совпали с актуальной рабочей A4.5. Пакет отдельно проверен:71 хеш совпал; это проверка целостности материалов, не сайта.

Пользовательское задание прочитано из PROMPT_FOR_CODEX_TMS_V6_A4_6.txt. Context pack извлечён в work/, вне приложения/public. Прочитаны00_START_HERE,01_DECISIONS,A45_SOURCE_REVIEW,INDEX и спецификации02–04, просмотрены первые4референса. Прикладной AGENTS.md и установленная Next-документация CSS прочитаны. Предыдущие пакеты не трактовались как параллельные задания; patch-reference не распаковывался поверх проекта.

52 защищённых файла побайтно совпадают со snapshot: app/lib/content/public (без копирования бинарных шрифтов в snapshot), StoryExperience/StoryCopy/story-content/StoryAtmosphere/useHeroGlass,package.json,package-lock.json. Шесть тем/ссылки, V5,/demo,lead API и калькулятор не изменялись. Существующие локальные шрифты prepare-fonts сохранил. Исходные52файла установленного SDK совпадают с ранее проверенным npm tarball0.0.1; node_modules/shader не менялись.

Изменены только HeroStory/StoryBackdrop/session material, scoped review CSS, ширины тем/общая сетка, лёгкая CSS-шапка и версия review; плюс необходимые проверки и отчёты. Цвета CTA/hover, Hero-offer, футер и служебные маршруты сохранены. Формы проверены локально; реальные обращения не отправлялись. Персональные данные/внутренние материалы не добавлены в публичный контент.

Новые evidence:17unit,51browser,build/types/lint;156сцен,66фаз контраста,6pixel-pause,10replay,2per-message on/zero; DPR2 и hardwareChromium. Исторические отчёты сохранены и не выдаются за новые. Все ограничения явно перечислены в v6-a46-design-review.md.

Изменения перечислены в qa/v6-a46/patch-manifest.json: beforeSha256 — snapshot фактического проекта, afterSha256 — выдаваемые байты. Новые файлы имеют before:null. Удалений нет. ZIP проверяется CRC, исключениями и хешами. В review-пакете материалы только текущей итерации; внутренний handoff отсутствует.
