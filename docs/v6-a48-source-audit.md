# TMS V6-A4.8 · source audit

2026-10-10T03:25:52.700355+00:00. awaiting_owner_approval; stageBStarted:false; publicDeploy:false.

Актуальное задание: PROMPT_FOR_CODEX_TMS_V6_A4_8.txt + TMS_CODEX_V6_A4_8_MATERIAL_FINISH.zip. Прочитаны00_START_HERE,brief01–04,audit/A47_SOURCE_REVIEW,evidence/owner/VISUAL_INDEX и три ownerPNG, proposed tokens, compare/verify tools. Инструкции документов применены в границах пользовательского запроса. Evidence — частичная справочная A4.7, не заменитель рабочего сайта; ни один evidence source не перезаписывал workspace. Внутренний handoff не перенесён в public.

Существующий проект outputs/tms-site найден. AGENTS.md и установленная NextCSS guide прочитаны; package/lock проверены и не изменены. Git-репозитория нет (git status вернул not a git repository), поэтому commit/diff не выдумывается. Снимок актуальной A4.7: work/baseline-v6-a48,217файлов с SHA256; это локальная резервная копия, не архив для публикации. Сверка24частичных referenceфайлов:24совпадения. SHA/размер54файлов входного пакета проверены штатным verify_package.py.

Разрешённые production-правки: HeroStory, StoryBackdrop, hero-motion, scoped review CSS, footer-разметка и обозначение версии в ReviewV6. Добавлены QA scripts/tests и документация. Пять принятых файлов второго блока неизменны; 56 protected исходников/ресурсов совпадают с фактической базой. 156geometry pairs и312raster pairs идентичны. Шапка, Hero offer/grid, CTA/hover, контент, V5/demo/API/калькулятор сохранены; changed selectors ограничены материалом Hero/footer и controls.

SVGwash перенесён из windowBody на внешний bounded glassWindow. Удалены fullPaperrect/двеradialellipse/вложенныйradius. SDKsetContent использует этот же локальный слой, не произвольную страницу. AutoPolicy не изменена: CSS; SDK — диагностический. Пакет0.0.1 не обновлён: 52 файлов сверены с сохранённым npm tarball и совпадают. Новых зависимостей нет.

Внешние справочные ссылки пакета не используются как доказательство официальных Appleпараметров или текущего состояния API; параметры — локальные TMSпробы. Новые screenshot/runtimeданные отделены от исторических A4.7. Safari/actualzoom недоступны из-за lockscreen; старые SafariPASS не перенесены. Физического телефона нет. Все ограничения перечислены в design-review.

beforeSha256/afterSha256 и список изменённых файлов находятся в qa/v6-a48/patch-manifest.json и patchZIP. При несовпадении исходного hash нельзя вслепую применять patch поверх пользовательских изменений. Новые файлы имеют beforeSha256:null. ReviewZIP не является полным сайтом; рабочие исходники остаются на месте. Секреты, сырьевые fonts, node_modules,.next,внутренние handoff не включены.
