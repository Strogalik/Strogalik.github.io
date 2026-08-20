# TMS ASUB · Product Design & Frontend Playbook
## Рабочее ТЗ для ChatGPT / Codex / дизайн- и frontend-команды

Версия: 0.16

Этот документ фиксирует правила, к которым мы пришли после нескольких итераций реального интерфейса TMS ASUB. Он важнее случайных решений отдельного экрана. Любой новый экран должен продолжать эти правила, а не заново изобретать визуальный язык.

---

## 1. Роль исполнителя

Работать одновременно как:

- Head of Product Design;
- UX Architect;
- Senior UI Designer;
- Head of Frontend;
- Senior React / TypeScript Developer.

Цель — не «нарисовать экран», а создать понятный multi-device рабочий продукт, который можно подключить к реальному backend без переделки UI.

---

## 2. Продуктовая модель

TMS ASUB — единый рабочий контур логистики, а не набор независимых админок.

Центральная сущность первой версии — рейс.

Связность должна ощущаться в интерфейсе:

`рейс → ТС → водитель → маршрут → груз → ЭПД → ЭДО → финансы → отчёты → события`.

Если система уже знает связь, пользователь не должен заново искать сущность в другом модуле.

---

## 3. Multi-device, а не desktop-first/mobile-first

TMS — task-first multi-device product.

Одна дизайн-система, одна терминология, одни API и сущности.
Но desktop и mobile проектируются как отдельные композиции под одну задачу.

### Desktop

Использовать пространство для:

- таблиц;
- split layouts;
- нескольких связанных сущностей одновременно;
- аналитики;
- фильтров;
- быстрых переходов между контекстами.

### Mobile

Использовать:

- карточки вместо широких таблиц;
- вертикальный поток;
- status справа от identity, если это безопасно;
- bottom navigation;
- sticky actions;
- focused forms;
- drawers/bottom sheets для secondary actions.

Нельзя растягивать мобильные карточки на desktop и нельзя уменьшать desktop-table до телефона.

---

## 4. Визуальное направление

Продолжать светлый дизайн мобильного TMS.

### Основные свойства

- холодный светлый canvas;
- белые surfaces;
- Deep Navy — sidebar / strong emphasis;
- Sapphire — actions / active state;
- большие чистые радиусы;
- мягкая тень;
- минимум визуального шума;
- status pills компактные, но читаемые;
- иконка вторична по отношению к данным;
- много воздуха без потери информационной плотности.

Продукт должен ощущаться как сложная система, которой легко пользоваться.

---

## 5. Typography

### Desktop

- body: 14px;
- dense operational data: 13px;
- captions / table headers / metadata: 12px;
- routine status: 12–13px;
- section heading: 16–20px;
- page title: 30–38px.

### Mobile

Проектировать с учётом людей старшего возраста и пользователей со сниженным зрением.

- normal body: 16px;
- controls / inputs: 15–16px;
- secondary operational data: 14px;
- routine metadata/status: не меньше 13px;
- section headings: 17–20px;
- page title: 29–30px.

Нельзя спасать плохую композицию уменьшением текста.
Лучше увеличить высоту компонента или перестроить layout.

---

## 6. KPI / Metric cards

Правило:

**метрика важнее иконки**.

Иконка не должна занимать отдельную широкую колонку и сдвигать value/text вправо.

Базовая композиция:

- label слева сверху;
- value под label;
- supporting text ниже;
- небольшая secondary icon в правом верхнем углу.

Карточка должна одинаково хорошо работать при открытом и свернутом desktop sidebar.

Не использовать `white-space: nowrap` для больших денежных значений, если это способно сломать сетку.

Metric card не раскрывается просто ради увеличения числа: KPI и так должен быть читаем без interaction. Делать карточку кликабельной только когда есть полезный drill-down route/details.

---

## 7. Status pills

Status pill — content-sized component.

Правила:

- одинаковый horizontal padding слева и справа;
- текущий стандарт TMS: 10px;
- ширина зависит от текста;
- текст не прижимается к краям;
- pill не растягивается на всю ячейку;
- pill не должен сжимать соседние table columns;
- для desktop table колонка получает достаточную ширину;
- на mobile длинный status может перейти на следующую строку согласно breakpoint rule.

Нельзя создавать разные paddings для `Принят`, `Отправлен`, `Ошибка`, `Ожидает подписи`.

### Status в повторяющихся desktop rows

Если после status идут другие колонки, ширина самого pill **не должна определять позицию следующей колонки**.

Правило TMS:

- pill остаётся content-sized;
- status живёт внутри отдельного стабильного grid-track/column;
- pill выравнивается по левому краю этого track;
- `Ошибка` и `Ожидает подписи` начинаются в одной колонке, но их разная длина не двигает `Контрагент`, `Saby`, `Сумма` и другие данные;
- нельзя использовать `max-content` как ширину status-column в каждой независимой строке, если ниже строки должны визуально совпадать.

Смысл: **content-sized badge внутри column-sized slot**.

### Dense operational status: text instead of pill

Pill не является обязательной формой для каждого статуса. В плотных operational rows длинная
капсула может съедать ширину, даже если технически помещается.

Для реестров, где важнее быстро сканировать строку, допустим и предпочтителен `status-text`:

- короткая semantic dot + текст;
- смысл читается из текста, цвет только усиливает сигнал;
- нет background-lozenge вокруг длинного статуса;
- статус не должен менять геометрию соседних колонок;
- на mobile status-text может перейти под identity только на узком breakpoint.

Текущий approved пример: ГСМ registry/control. Детальные экраны и короткие статусы могут
оставаться pill, если lozenge реально помогает визуальной группировке.

---

## 8. Mobile card header pattern

Предпочтительная схема для документов:

`[icon] [identity] [status]`

Identity содержит type + document number.
Status находится справа, потому что это один из главных параметров для сканирования списка.

На очень узком экране status переносится под identity.

Это лучше постоянного status под названием, потому что:

- уменьшает высоту списка;
- status находится в одинаковом месте;
- быстрее сравнивать карточки;
- information hierarchy яснее.

Но compactness никогда не важнее устойчивости. Если длинный status начинает давить identity — layout должен перестроиться.

---

## 9. Tables

Desktop tables:

- no vertical borders;
- мягкие horizontal separators;
- комфортная высота строки;
- stable column widths для status-heavy таблиц;
- horizontal wrapper при нехватке места;
- row click → details;
- secondary action → trailing icon/menu;
- legal/company names получают `min-width:0` и intentional truncation/wrapping.

Главное QA-правило:

**ни один status pill, company name, money value или date не может визуально залезать в соседнюю колонку**.

---

## 10. Panels / cards containment

Каждый reusable layout child обязан быть безопасным внутри CSS grid/flex.

Для потенциально длинного контента использовать:

- `min-width: 0`;
- `max-width: 100%`;
- `box-sizing: border-box`;
- `minmax(0, 1fr)` вместо голого `1fr`, если внутри может быть длинный текст;
- `overflow-wrap` там, где перенос допустим.

Не лечить архитектурную проблему одним `overflow:hidden`, если контент должен оставаться видимым.

### CSS layout contract / cascade safety

Перед использованием alignment-property проверить **final computed layout mode**, а не только
то, что было задумано в одном CSS-файле.

Обязательные правила:

- `justify-content` использовать только когда элемент реально создаёт flex/grid formatting context;
- `justify-self` не считать универсальным способом выравнивания: сначала проверить тип родительского layout;
- не писать широкие descendant rules вроде `.row span { display:block }`, если внутри row могут жить reusable primitives (`status-pill`, `status-text`, button-like span и т.д.);
- metadata получает собственный class (`__time`, `__meta`, `__label`), а не стилизуется через любой `span`;
- reusable primitive не должен терять свой display-mode из-за более специфичного page selector;
- после изменения CSS проверять `getComputedStyle()` для критичных primitives, а не только bounding box.

Отдельно: `inline-flex` как grid/flex item может быть blockified браузером до computed `flex` — это
нормально, внутренний flex formatting context сохраняется. Ошибка — когда более специфичный selector
реально заменяет его на `display:block` и flex-properties перестают работать.

---

## 11. Container-aware layouts

Не все проблемы определяются шириной viewport.

Карточка может быть узкой даже на 1920px из-за grid layout.

Для внутренних сложных композиций (например, donut + legend) использовать container queries либо гибкую grid-архитектуру.

Пример правила:

- широкая card → visualization слева, legend справа;
- узкая card → visualization сверху, legend снизу.

---

## 12. Charts / donuts

### Inline + expanded mode

На mobile график не должен превращаться в декоративную миниатюру. Базовый режим остаётся компактным для быстрого сканирования, но каждый содержательный chart получает явное действие `Развернуть`.

В expanded режиме:

- desktop — большой modal surface;
- mobile — full-screen data surface;
- plot может иметь увеличенную virtual width и intentional horizontal pan, если иначе точки становятся слишком плотными;
- pinch/browser zoom не блокируется;
- критические числа не должны быть доступны только после раскрытия;
- `Escape` и отдельная кнопка закрытия обязательны.

Число и подпись внутри ring/donut должны иметь собственный bounded inner wrapper.

Нельзя просто положить текст поверх псевдоэлемента и надеяться, что он поместится после font scaling.

Inner content должен иметь:

- фиксированную безопасную область;
- flex centering;
- явный line-height;
- no accidental margins;
- проверку на mobile typography scale.

---

## 13. Mobile state / check cards

Если карточка показывает важное состояние (`пройден`, `ожидается`, `ошибка`), state icon должен иметь достаточный optical weight.

Текущий mobile стандарт для таких карточек:

- icon container около 40–42px;
- glyph около 20–24px внутри;
- иконка не должна выглядеть маленькой точкой в карточке с большим количеством воздуха;
- state определяется не только цветом: рядом всегда остаётся текстовое описание.

## 14. Approval flows

Desktop:

- горизонтальный flow допустим, если он реально помещается;
- каждый шаг имеет одинаковую структуру.

Mobile:

- предпочтителен вертикальный timeline;
- не использовать horizontal scroll для ключевого workflow;
- long names должны переноситься внутри шага.

---

## 15. Sidebar

Desktop sidebar collapsible.

Expanded:

- logo;
- product label;
- icon + text navigation;
- user profile.

Collapsed:

- icon rail;
- tooltip/title для навигации;
- больше workspace для таблиц и документов.

Свернутый sidebar не должен менять визуальную иерархию самих content cards.

---

## 16. Reports

Отчёт — не декоративный dashboard.

Каждый aggregate должен отвечать:

1. что происходит;
2. что требует внимания;
3. куда перейти, чтобы устранить причину.

Любая risk metric должна иметь drill-down до рейса или документа.

Не перегружать страницу десятками графиков. Сначала KPI → распределение → action list.

---

## 17. Что больше НЕ делать

Из прошлых итераций запрещено повторять:

- microcopy 7–10px как обычный рабочий текст;
- крупная иконка отдельной колонкой внутри KPI, которая сдвигает все данные;
- status pills без одинакового padding;
- status, который визуально залезает в соседнюю ячейку;
- cards, выходящие за mobile wrapper;
- горизонтальный approval-flow на телефоне;
- long labels, выталкивающие проценты за cost card;
- зависимость layout только от viewport, когда сама card может быть узкой;
- уменьшение шрифта как основной метод исправления overflow;
- `1fr` без `minmax(0,1fr)` в grids с непредсказуемым текстом;
- fixed `nowrap` для данных без проверки реального available width;
- случайные разные paddings у status badges;
- generic descendant selectors (`.row span { ... }`), которые переопределяют display reusable components;
- попытка чинить длинный operational status всё более широкой капсулой, когда лучше compact status text;
- новый экран без mobile QA;
- новый экран без проверки expanded/collapsed sidebar.
- кастомные route-transition анимации, wheel-driven parallax/rubber-band и любые новые motion-паттерны без отдельного согласования;

---

## 18. Navigation history / gestures

TMS поддерживает несколько способов вернуться назад, но жесты не заменяют явную навигацию.

### Desktop

- в topbar есть Back / Forward controls;
- browser history остаётся source of truth;
- `Alt+←/→` и системные browser shortcuts не блокируются;
- macOS two-finger trackpad history gesture не перехватывается кастомным JS.

### Mobile

- detail pages сохраняют явный back-link;
- iOS Safari edge-swipe остаётся нативным и не дублируется;
- для touch browsers без нативного edge history допускается fallback: swipe от левого края назад / от правого вперёд;
- fallback запускается только с edge-zone и только при явно горизонтальном жесте;
- не перехватывать inputs, editors и intentional horizontal scrollers.

Главный принцип: **native gesture first, explicit control always available where контекст требует возврата**.

## 19. Frontend architecture

- React;
- TypeScript;
- Vite;
- React Router;
- TanStack Query;
- REST/OpenAPI-ready API layer;
- mock data только через API layer;
- CSS design tokens + component/page styles.

Компонент не должен знать, mock backend используется или real backend.

---

## 20. QA gate — обязательный перед новым ZIP

Каждый экран проверить минимум на:

### Desktop

- 1920×1080 expanded sidebar;
- 1920×1080 collapsed sidebar;
- 1440×900 expanded sidebar;
- 1440×900 collapsed sidebar;
- 1280×800.

### Mobile

- 430px;
- 390px;
- 360px;
- дополнительная проверка 320–350px для graceful fallback.

### На каждом размере проверить

- horizontal overflow страницы;
- overflow каждой card/panel;
- status pills;
- длинные company names;
- money values;
- tables;
- nested grids;
- headings;
- touch target sizes;
- font readability;
- sticky/fixed navigation;
- expanded/collapsed sidebar;
- empty/loading state, если экран data-driven.

### Programmatic guard

При QA в браузере собирать элементы, у которых:

- `scrollWidth > clientWidth`;
- bounding rect выходит за page/panel;
- document root имеет horizontal overflow.

Исключения разрешены только для intentional horizontal scrollers (desktop table wrapper, tabs/finance strip, если предусмотрено дизайном).

Дополнительно для повторяющихся document rows проверять:

- X-coordinate начала `Контрагент`/следующей meta-column одинаков у строк с коротким и длинным status;
- status pill contained внутри своей row/column;
- mobile state icon >= 40px outer box для текущего TMS pattern;
- KPI label не имеет orphan-letter wrapping;
- chart expand control находится внутри panel и expanded surface не создаёт root overflow;
- каждый `.status-pill` / `.status-text`: computed display сохраняет flex formatting context (`inline-flex` или browser-blockified `flex`), текст не шире доступного компонента;
- selector-specificity не превращает reusable status component в обычный `block`;
- новые list/card variants проверяются с длинными АЗС, юрлицами, временем, суммой и длинным warning text.

---

## 21. Definition of visual done

Экран считается готовым, только если:

- понятно, что происходит;
- понятно, что требует действия;
- понятен следующий шаг;
- нет случайного overflow;
- mobile — не уменьшенный desktop;
- desktop — не растянутая mobile card list;
- typography соответствует TMS scale;
- дизайн совпадает с текущим Light TMS language;
- все status/layout rules соблюдены;
- экран выглядит частью уже существующего продукта.

---

## 22. Политика дальнейшего расширения

Текущий Phase 1 screen-scope закрыт в v0.15. Следующий экран появляется только из нового подтверждённого бизнес-сценария, новой интеграции или расширения модели данных.

Не добавлять UI «на будущее» только ради количества. Для каждого нового блока сначала определить пользователя, задачу, source data/API, затем применить Research Gate и полный visual/geometry QA.

Если новый блок можно собрать из уже утверждённых TMS patterns, переиспользовать их вместо создания ещё одной вариации card/table/status/navigation.


---

## 23. Research gate перед новым UX-паттерном

Если появляется новый тип экрана, interaction или layout, не импровизировать вслепую. Порядок работы:

1. Сначала проверить Apple Human Interface Guidelines по соответствующему паттерну: navigation, lists/tables, search, notifications, accessibility, disclosure, progress и т.д.
2. Затем проверить официальную документацию React и используемой библиотеки/браузерного API.
3. После этого посмотреть реальные аналоги fleet / ERP / operations software и профильные обсуждения разработчиков, чтобы увидеть практические edge cases.
4. Решение принять в контексте TMS, а не копировать чужой UI буквально.
5. Перед merge прогнать desktop + mobile containment QA и длинные realistic strings.

Форумы и чужие примеры — источник edge cases, но не source of truth для архитектуры или accessibility.

### Approved motion boundary

Текущая утверждённая база — поведение stable v0.6. Новые route-transition animations не входят в дизайн-систему и не добавляются без отдельного визуального прототипа и ручного approval.


## 24. Hub cards и мобильная достижимость экранов

### Hub cards

Карточки верхнего уровня, которые ведут в крупный раздел продукта, должны принадлежать одной визуальной семье.

Для `Reports Hub` и `Directories Hub` использовать одинаковую базовую геометрию:

- desktop min-height 210px;
- icon tile 52px;
- padding 22px;
- radius 22px;
- одинаковая hover-механика;
- одинаковый arrow tile 42px;
- структура `icon → copy → supporting metric → arrow`.

Различаться должны смысл и содержимое, а не размеры карточки. Нельзя создавать новый hub-card с почти тем же назначением, но случайно другой высотой, padding или icon scale.

### Mobile navigation reachability

Адаптированный мобильный экран считается незавершённым, если на него нельзя попасть из мобильной навигации.

TMS использует:

- 5 основных пунктов в bottom navigation;
- вторичные, но важные направления — через topbar quick actions;
- `Справочники` доступны через иконку книги в mobile topbar;
- `Уведомления` доступны через кликабельную иконку bell в mobile topbar.

Перед релизом каждого нового mobile-route проверять не только layout, но и **reachability**: минимум один очевидный путь из текущего shell без ручного ввода URL.

---

## 25. ГСМ pattern — approved in v0.12

ГСМ проектируется как operational workflow, а не как один большой отчёт.

Порядок пользователя:

`registry → конкретная заправка → причина отклонения → решение → отчёт`.

### Registry

- desktop: полноценная data table;
- mobile: отдельная компактная fueling card, не уменьшенная таблица;
- сумма и литры — primary line; цена и время — короткая metadata line (`Цена: …`, `Время: …`);
- рейс/АЗС остаются в structured rows;
- anomaly на mobile показывается semantic colored text, а не вторым большим warning-bubble;
- в dense desktop registry контроль и длинный статус могут использовать `status-text` вместо pill;
- status presentation никогда не двигает соседние data-columns.

### Fueling form

- формы группируются по смыслу, а не по структуре DTO;
- mobile inputs минимум 16px;
- labels/supporting text не уменьшаются ради того, чтобы форма стала ниже;
- сумма показывается сразу, но backend повторно вычисляет и валидирует её;
- чек является отдельным понятным upload surface;
- предупреждения появляются рядом с контекстом, но не заменяют backend validation.

### Anomalies / approvals

- сначала причина и действие, затем технические детали;
- нельзя красить всю карточку в danger: semantic color используется локально;
- approve/reject всегда имеют явную сущность и сумму рядом;
- длинные названия АЗС, ТС и комментарии обязаны переноситься внутри своей колонки.

### Analytics

- KPI → trend/distribution → attention list → drill-down;
- график не должен быть единственным способом узнать значение;
- mobile может упростить композицию, но не прятать critical KPI;
- отчёт по водителям не должен превращать рейтинг в непрозрачное число: рядом должна быть понятна формула/входные факторы.

### Mobile reachability

ГСМ — важный secondary module. На mobile он доступен через topbar quick action. Bottom navigation остаётся из пяти основных направлений и не сжимается ради шестого пункта.

### Typography guard for new modules

- desktop supporting text / labels: не ниже 12px;
- mobile supporting text: целиться в 13px+;
- mobile body: 16px там, где пользователь читает/вводит данные;
- нельзя чинить overflow уменьшением кегля до 10–11px.

## 26. Driver field flow — approved in v0.13

Полевой режим водителя — не уменьшенная копия кабинета логиста. Это role-focused task surface внутри того же TMS.

Основной путь:

`сегодня → назначенный рейс → документы → заправка/чек`.

### Information hierarchy

Водителю показывать только то, что помогает выполнить текущую работу:

- статус и маршрут рейса;
- время/точки;
- ТС;
- груз и ключевые условия;
- собственные перевозочные документы;
- связанные заправки;
- следующий необходимый action.

Не переносить в driver flow управленческие KPI, маржинальность, финансовую аналитику и служебные интеграционные детали, если они не нужны роли для действия.

### Driver navigation

Внутри `/driver/*` mobile bottom navigation переключается на четыре top-level driver tasks:

- Сегодня;
- Рейсы;
- Документы;
- Заправка.

Это context navigation, а не шестой/седьмой пункт глобальной mobile navigation. При выходе из driver mode возвращается основная навигация TMS.

Driver mode обязан быть достижим минимум через profile/avatar surface. Нельзя создавать хорошо адаптированный role-route, доступный только ручным URL.

### Mobile cards

- identity/status/primary action должны читаться без раскрытия;
- secondary operational facts идут ниже структурированными rows;
- длинные юрлица/АЗС/груз переносятся внутри value-track и не двигают label;
- если status не помещается безопасно справа от identity, он переносится под identity согласно breakpoint, а не уменьшается шрифт;
- карточка может стать выше — overflow и микрошрифт запрещены.

### Receipt / fueling capture

Ввод заправки в driver mode начинается с понятного текущего контекста рейса/ТС и явного upload surface для фото/файла чека.

- inputs на mobile 16px;
- tap targets в ключевой навигации/действиях целиться минимум в 44px;
- сумма может считаться локально для immediate feedback, но backend повторно валидирует исходные данные;
- не добавлять AI/OCR/autofill, пока такого backend capability нет в согласованном API;
- upload surface не должен исчезать или сжиматься при длинном filename.

### React / data rule

Driver pages не импортируют mock fixtures. Они получают данные только через query hooks (`useDriverProfile`, `useDriverTrips`, `useDriverTrip`, `useDriverDocuments`, `useDriverFuelings`) и тот же API abstraction, что остальные модули.

Не создавать отдельную независимую копию сущности рейса/документа только ради driver UI. Разные role-surfaces отображают одни и те же business entities с разной информационной плотностью.

### Motion boundary

Driver mode не является поводом возвращать отклонённые navigation animations. Navigation/motion остаётся на stable v0.6 behavior.

---

## 27. Final QA additions for role-focused flows

Перед ZIP для role/mobile flow дополнительно проверять:

- route reachable из shell;
- правильная active tab state на всех nested routes;
- каждый mobile bottom-nav item имеет usable touch area;
- fixed/sticky action bars не перекрывают последний content block;
- long route/customer/cargo/station/document strings на 430/390/360/340;
- content не прыгает по горизонтали при смене status length;
- camera/file input surface не выходит за wrapper;
- desktop версия role-flow остаётся usable для support/testing и не выглядит растянутой мобильной карточкой;
- query hooks не дублируют state в локальных массивах;
- no hidden finance/admin data в driver-facing UI без role reason.

---

## 28. Historical delivery boundary after v0.13

Готовы: core logistics, EPD, EDO, reports, notifications, integrations, base directories, полный первый ГСМ workflow и driver-focused field flow.

Следующая очередь после проверки v0.13:

1. fuel directories: АЗС / типы топлива / нормы расхода;
2. mechanic-focused vehicle/technical-control flow;
3. medical EПЛ flow;
4. admin RBAC / audit;
5. только после этого — дальнейшее расширение integrations/telematics, если потребуется бизнес-сценарием.

Approved motion boundary остаётся stable v0.6. Никаких новых route-transition experiments в основной ветке.


## 29. Directory registries and details — v0.14

Справочник не должен превращаться в огромную форму внутри одной строки. Повторяющийся registry показывает только данные, нужные для сканирования и выбора; расширенный контекст открывается в detail view.

Правила:

- desktop registry использует устойчивые колонки и короткие подписи;
- mobile registry использует карточку с identity/status сверху и 2–4 ключевыми facts ниже;
- detail route обязателен, когда сущность содержит контекст, который перегружает list row;
- длинный адрес, название сети, ТС и описание коэффициента должны переноситься внутри собственного `minmax(0,1fr)` / `min-width:0` контейнера;
- status остаётся коротким content-sized pill только если не влияет на геометрию соседних данных;
- primary numeric value (например норма л/100 км) визуально отделяется от metadata, а не теряется в списке labels;
- touch/action targets на mobile — минимум 44px для основных действий;
- новый адаптированный directory route считается готовым только если доступен через `/directories`, а сам `/directories` уже доступен из mobile topbar;
- search query может жить локально в page state, но dataset и business entity должны приходить через query/API layer; не создавать вторую копию directory data внутри component state.

### Research note

При проектировании v0.14 использован принцип: list/table — для быстрого сканирования и навигации, detail — для расширенного содержания; accessibility и размер controls остаются частью базового QA. Реализация React сохраняет single source of truth: remote data живут в query layer, локальный state — только UI/search state.

### Stable boundary

Motion остаётся на утверждённой stable-базе. v0.14 не добавляет route transitions, trackpad/wheel gestures или новые motion primitives.

---

## 30. v0.15 completion baseline — all agreed Phase 1 screens

v0.15 фиксирует завершение согласованного frontend screen-scope. Дальнейшие экраны считаются расширением продукта, а не закрытием текущего долга.

Добавлены и приняты как часть системы:

- создание рейса;
- создание ЭПД;
- создание ЭДО;
- reconciliation входящих ЭДО;
- mechanic technical-control workspace;
- medical EPL workspace;
- role/workspace entry;
- admin users / access / roles / audit / certificates / alert rules / EPD tariff;
- cargo / reasons / EDO templates / approval routes;
- login / 2FA.

### Completion rule

Нельзя считать модуль законченным только потому, что его detail-screen существует. Проверяется полный путь:

`entry/navigation → registry/queue → create/action where applicable → detail/decision → return/drill-down`.

Если screen адаптирован на mobile, он также должен быть достижим из mobile shell/workspace без ручного URL.

---

## 31. Create-form pattern

Create-screen не повторяет backend DTO один к одному. Поля группируются по mental model пользователя и рабочему процессу.

### Desktop

- основная форма занимает главный content track;
- secondary context / outcome может находиться в правом rail;
- rail не должен сжимать form controls до нечитабельной ширины;
- на узком desktop/tablet композиция должна перейти в stacked layout до возникновения overflow.

### Mobile

- одна основная колонка;
- field font-size целиться в 16px;
- labels/supporting text не уменьшаются для экономии высоты;
- primary action full-width или sticky только если не перекрывает content;
- textarea/select/input обязаны иметь `min-width:0`, `max-width:100%`, `box-sizing:border-box`;
- длинное выбранное значение не должно расширять page root.

### Business rule

Derived UI values допустимы для immediate feedback, но backend остаётся source of truth для критичных расчётов, validation, permissions и workflow transitions.

---

## 32. Role-focused workspaces

Один TMS может иметь разные рабочие поверхности, но не отдельные независимые frontend-продукты.

### Driver

Task-first field UI: рейс → документы → заправка.

### Mechanic

Показывать:

- ТС;
- технический контроль;
- одометр;
- топливный контекст;
- решение о допуске/выпуске.

Не показывать unrelated management finance или document-admin context.

### Medical worker

Показывать только сведения, необходимые для медицинской отметки ЭПЛ:

- водитель;
- ЭПЛ / рейс;
- ТС;
- время выезда;
- медицинское решение.

Финансы и лишние операционные показатели скрываются по role reason, а не визуально маскируются.

### Workspace entry

Profile/avatar ведёт на `/workspace`. Role-workspace считается mobile-ready только если из этого экрана роль открывается явным action target минимум 44px по высоте/ширине основной интерактивной зоны.

---

## 33. Admin / RBAC / security UI rules

Security interface должен быть спокойным и ясным, а не «хакерским» или визуально тревожным.

### Users / roles

- frontend может скрывать недоступное действие, но backend повторно проверяет permission;
- user access хранит scope отдельно от display labels;
- permission matrix/role cards должны быть сканируемыми, без десятков случайных цветов;
- 2FA — operational state, а не декоративный badge.

### Audit

- audit UI read-only;
- обычный пользователь не видит edit/delete affordances;
- row содержит actor, action, object, timestamp, result и безопасный technical context;
- длинный technical detail не растягивает остальные table columns; на mobile уходит в отдельный supporting block.

### Certificates

Frontend показывает только безопасные сведения:

- owner;
- expiration;
- status;
- fingerprint;
- scope.

Никогда не выводить private key, secret, raw credential или полное sensitive payload даже «только администратору».

### Alert rules

Threshold и channels являются отдельными понятиями. Нельзя связывать визуальный switch канала с изменением самого текста/порога правила.

### EPD tariff

Показывать usage, absolute count, forecast и пороги 80/95. Critical threshold не должен сообщаться только цветом — текстовое/числовое значение обязательно.

---

## 34. Intermediate-width / content-width rule

**Нельзя предполагать, что breakpoint компонента обязан совпадать с breakpoint всего shell.**

Пример из QA v0.15: при 861–1024px desktop sidebar всё ещё занимает часть viewport, поэтому доступная ширина workspace меньше nominal viewport width. Некоторые mechanic/medical rows уже должны перейти в compact/stacked pattern, хотя global mobile shell ещё не включился.

Правило:

1. оценивать фактическую ширину content track;
2. использовать component-specific media/container breakpoints там, где desktop row перестаёт быть устойчивым;
3. не ждать root breakpoint, если до него уже происходит compression/overflow;
4. не чинить ситуацию уменьшением font-size;
5. проверять expanded и collapsed sidebar отдельно.

Это обязательный regression case для всех следующих data-heavy components.

---

## 35. Lists, tables and detail hierarchy

Для productivity UI использовать стабильную иерархию:

- registry/list/table — быстрый scan, выбор и сравнение;
- detail — длинный контекст, история и связанные сущности;
- create/action — focused input/decision;
- dashboard/report — aggregate + drill-down.

Если строка списка требует абзац текста, нескольких nested cards или десяти metadata fields, это признак, что часть контекста должна переехать в detail-screen.

На desktop multicolumn table оправдан, когда пользователь сравнивает атрибуты. На mobile не переносить такую таблицу один к одному: использовать identity + status + ключевые facts.

---

## 36. React state/data discipline — completion baseline

Для каждого piece of data один понятный owner/source.

- remote business entities → API/query layer;
- local search/filter/input UI → local component/form state;
- derived values → вычислять при render, если не требуется отдельный persisted state;
- не дублировать целую entity в нескольких `useState`, если достаточно ID/reference;
- role-focused projection не является новой business entity;
- mock mode и real API mode должны сохранять одинаковый page-facing query contract.

Это уменьшает риск расхождения рейса/документа/пользователя между registry, details, reports и role-workspace.

---

## 37. Accessibility baseline

TMS используется в том числе взрослыми пользователями и людьми со сниженным зрением, поэтому readability является функциональным требованием.

- mobile body/input: ориентир 16–17px, если плотность не требует approved exception;
- supporting mobile text: 13px+;
- избегать Thin/Light для важной информации;
- важные touch controls целиться в 44px;
- не кодировать status только цветом;
- icon-only control получает accessible name;
- layout должен выдерживать увеличение текста и длинные локализованные значения без root overflow;
- critical workflow имеет альтернативу gesture-only interaction.

---

## 38. Final visual QA gate — mandatory

Перед каждой будущей delivery запускать минимум:

### Viewports

`1920 / 1536 / 1440 / 1366 / 1280 / 1024 / 861 / 860 / 430 / 390 / 360 / 340`.

Expanded/collapsed sidebar минимум на:

`1920 / 1440 / 1280`.

### Geometry assertions

- `documentElement.scrollWidth <= clientWidth`, кроме намеренно локального scroller;
- panel/card children не выходят за bounding box;
- grid/flex child с длинным text track имеет `min-width:0`;
- status-pill сохраняет свой flex formatting context;
- status text/pill не двигает соседние data columns;
- mobile fixed/sticky navigation не лишает пользователя доступа к последнему content block;
- form control не расширяет wrapper своим value/placeholder;
- SVG/icon не выходит из icon container;
- intermediate shell width проверяется отдельно, не только desktop/mobile extremes.

### Content stress

Проверять:

- длинное юридическое лицо;
- длинный адрес;
- длинный маршрут;
- длинное название груза;
- длинный status;
- большие суммы;
- timestamps;
- certificate fingerprint;
- audit technical detail;
- filename / receipt attachment.

### Navigation / reachability

- desktop route доступен из sidebar/hub/row action;
- mobile route доступен из bottom/topbar/workspace/context link;
- create/action page имеет явный путь назад;
- detail page имеет путь к source registry/entity;
- no dead-end route.

### Stable motion boundary

Route-transition / wheel-driven / view-transition experiments после v0.6 **не возвращать**. Если motion снова исследуется — только отдельная branch/lab, не mainline.

---

## 39. Current completion state — v0.15

Текущий Phase 1 frontend screen scope закрыт.

Будущие направления — только после отдельного подтверждения продуктового/API scope:

- расширенная telematics/GPS карта;
- WMS-specific flows;
- дополнительные 1С workflows;
- новые виды ЭПД/экспедиторских документов;
- AI surfaces;
- отдельные enterprise configuration flows.

Не придумывать эти экраны заранее только ради количества.


---

## 40. v0.16 interaction completeness baseline

v0.16 не меняет утверждённый визуальный язык и не возвращает motion-эксперименты. Цель версии — чтобы каждый видимый control имел понятную функцию и чтобы mobile navigation отражала контекст роли.

### Report status alignment

В повторяющихся report rows semantic status получает **собственный стабильный grid track**.

Обязательные правила:

- `status-text` выравнивается по левому краю status-column;
- длинный warning не может подвинуть `Сумма`, `Отклонение` или следующую метрику;
- между status-track и следующей data-column сохраняется явный column gap;
- разные строки имеют одинаковую X-позицию начала status;
- на mobile status может перейти под identity, но остаётся left-aligned;
- QA сравнивает bounding boxes нескольких строк с разной длиной status.

Approved pattern: `identity | status slot | amount | secondary metric | disclosure`.

### Role-aware mobile navigation

В TMS нет отдельных приложений по ролям, но специализированные полевые/системные режимы получают contextual bottom navigation:

- Driver: `Сегодня / Рейсы / Документы / Заправка`;
- Mechanic: `Контроль / ТС / ГСМ / Режимы`;
- Medical: `Осмотры / ЭПЛ / Режимы`;
- Admin: `Главная / Люди / Роли / Аудит`.

Руководитель, диспетчер/логист и бухгалтер используют **основной рабочий контур** и его navigation, отфильтрованный реальными permissions backend. Для них не создавать искусственные дубли страниц только ради другой нижней панели.

Mobile profile обязан давать явный доступ минимум к:

- Рабочим режимам;
- Администрированию (если есть permission);
- Уведомлениям;
- Интеграциям.

Экран, который адаптирован под mobile, но не имеет reachable navigation path, считается незавершённым.

### Interaction completeness rule

**В production/prototype delivery не допускается видимая кнопка без результата.**

Выбор паттерна:

- deterministic navigation → обычный route/link, без modal;
- короткое подтверждение потенциально значимого действия → confirmation dialog;
- выбор/фильтр/короткая форма в контексте текущего экрана → sheet;
- небольшой набор secondary context commands → compact actions overlay/menu;
- сложное многошаговое редактирование → отдельная page, а не modal-app внутри app;
- раскрытие большого графика/контента → focused overlay только если чтение реально улучшается.

Не показывать modal «просто потому что есть кнопка». Модальность используется только для узкой задачи/выбора/подтверждения. Не стекать modal поверх modal.

### Overlay accessibility contract

Каждый modal/sheet:

- имеет task-specific title;
- имеет явное закрытие;
- закрывается Escape на keyboard devices;
- удерживает keyboard focus внутри открытого dialog;
- после закрытия возвращает focus в control-источник;
- блокирует background scrolling;
- primary/destructive decision требует понятного label;
- на compact mobile использует bottom-sheet/full-width composition, а не узкий desktop popover;
- critical workflow не зависит только от gesture.

### React interaction-state rule

Для modal/selection/tabs хранить минимальный state:

- boolean `open` для одного независимого overlay;
- ID/type выбранной сущности вместо копии всей entity;
- enum/string для active tab/filter;
- derived visible rows вычислять из query data + UI state;
- не копировать server entity в несколько локальных states;
- mutation/backend contract остаётся source of truth для бизнес-результата.

### Interaction QA additions

Перед delivery дополнительно проверять:

1. audit всех `<button>`/action controls на отсутствие inert behavior;
2. literal route links на существующий router path;
3. mobile role navigation для main/driver/mechanic/medical/admin;
4. profile → Administration reachability на `430/390/360/340`;
5. modal/sheet containment и footer controls на desktop/mobile;
6. status alignment в report rows минимум с коротким и длинным warning;
7. focus/Escape lifecycle для shared Overlay;
8. отсутствие custom route motion после stable v0.6.
