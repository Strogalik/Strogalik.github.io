# TMS V6-A4.7 · source audit

2026-10-10T01:44:33.577871+00:00. awaiting_owner_approval; stageBStarted:false; publicDeploy:false.

Рабочий проект: outputs/tms-site. Приложенный A4.7 PASTEL_SAFARI — задание/референсы, не исходники сайта. Прочитаны START_HERE, brief01–06, A46_SOURCE_REVIEW, предложенные materials/motion, owner Safari/Chromium и принятые screenshots решений. Они интерпретированы в пределах прямого пользовательского запроса. В публичные assets внутренний пакет не переносился. Предыдущие архивы не разворачивались поверх проекта.

Фактическая A4.6 совпала с предоставленной частичной картой compare_a46; это не полный checksum всей истории. До правок сохранены 200 source/config/doc файлов и SHA256; свежие before screenshots сделаны с работающей A4.6. Git отсутствует, поэтому commit/diff не выдумывается. Пользовательские изменения не удалялись.

Изучены локальные Next CSS docs, installed SDK DOM types, interaction SurfaceAnimator и runtime geometry sampling / addAnimator / dispose. Установленный npm 0.0.1 не подменяется main. Свежая сверка 52 файлов с ранее сохранённым tarball: все совпадают (`qa/v6-a47/sdk-files.json`). Исторический аудит происхождения SDK доступен отдельно; его прежние runtime результаты не выдаются за A4.7. Внешние Apple/Telegram ссылки не использовались как доказательство точного воспроизведения их текущего UI; параметры движения — локальные TMS-пробы.

52 protected файла (app/lib/content/public, пять файлов второго раздела, package/lock) совпадают с actual baseline; `qa/v6-a47/frozen-audit.json`. Header/grid/CTA selectors не менялись, кроме текста версии review. На 156 геометриях второго блока нет различий; raster исключения перечислены в отчёте, не скрыты. HeroStory/useHeroGlass/session/StoryBackdrop/ReviewV6/scopedCSS и новый hero-motion — разрешённая область изменений. No external analytic/request delivery; gate loopback-only сохранён.

Автоматическая политика изменена на CSS вследствие нового материала и минимального optical gain. SDK остаётся только диагностикой: реальный GPU, два surfaces/maps, bounded lifecycle и публичный before-sampling animator. Положительный оптический эффект не заявляется. Футер полностью CSS.

Состав patch, beforeSha256 и afterSha256 — qa/v6-a47/patch-manifest.json. Перед применением проверять исходные хеши; при несовпадении не перезаписывать новые пользовательские изменения. Новые файлы имеют beforeSha256:null. Env/секреты/зависимости/бинарные шрифты/сборка/внутренние исходные пакеты исключены. Рабочий сайт продолжает использовать имеющиеся локальные шрифты.
