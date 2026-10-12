# B5 — сохранение B4

До правок сохранены 325 файлов текущего проекта с SHA256 в приватном work/b5-before. Сверка с предоставленным B4 не выявила расхождений. Git checkout отсутствует; reset/clean не применялись.

88 защищённых файлов scope-lock совпадают по SHA. Package/lock, 6 файлов шрифтов/лицензий, Header/Hero/Footer, FAQ, Calculator, шесть тем, CaseExplorer, продуктовые данные, CTA, reflow и маршрутизация не изменены. Новые контролы локальны в privacy.module.css и не добавляют библиотек, палитры или footer-ссылок.

216/216 свежих до/после сравнений пиксельно идентичны: 12 размеров × (Hero/header, cases, calculator, cooperation, FAQ, footer и 12 closed/open состояний тем). Размеры: 1920×1080, 1728×960, 1512×780, 1440×760, 1366×650, 1024×768, 768×1024, 430×932, 390×844, 360×800, 320×740, 844×390. Одинаковые viewport/state, закрытый notice; section-boundary crops без масок. Геометрия тем также совпадает. Старый baseline не перезаписан.

Юридические страницы и разрешённый notice-контент намеренно изменены и показаны отдельно, без включения в protected pixel PASS. AVAILABLE — только синтетический стенд. Исходные fonts в рабочем проекте сохранены; source ZIP по заданию содержит bootstrap без бинарных шрифтов. Его npm fallback может визуально отличаться, поэтому он не используется как новый дизайн-baseline.

Доказательства review: source-preservation.json, preservation.json, before/, after/, before-legal/, after-legal/, available/ и index.html.
