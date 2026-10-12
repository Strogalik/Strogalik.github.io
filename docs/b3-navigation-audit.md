# B3 — маршруты и действия

Одна карта шапки сохранена без изменения её исходного тела: Решение → /#solution; Продукты → /#products; Кейсы → /#cases; Сотрудничество → /#cooperation. Свежая Chromium-проверка: 14 страниц × 4 перехода × 2 ширины = 112 переходов. Проверены закрытие меню, положение заголовка под измеренной шапкой, focus, Escape, повторные открытия и Back. Без JS прямые страницы/ссылки работают; нативное details-меню при same-page hash не обязано автоматически закрываться — это прежнее ограничение, не объявленное исправленным.

| Вход | Назначение |
|---|---|
| Обе темы CRM | Подробнее о CRM → /products/crm |
| Обе темы OMS | Подробнее об OMS → /products/oms |
| Обе темы разработки | О разработке → /custom-development |
| CTA темы | Существующая форма, context + productSlug + topicId из allowlist |
| Разбор проекта — обычный клик | Общий CaseExplorer на главной, продукте и /cases |
| Прямой URL / modified click / no-JS | Полная /cases/<slug> |
| CTA полного разбора | Закрытие case/history → восстановление → форма с caseSlug/context |
| Копирование | Canonical URL текущего origin, без UTM/маркеров |
| /demo?case=<valid> | 307 на /cases/<slug>, case приоритетнее product |
| /demo?product=<valid> | 307 на /products/<slug> |
| /demo без валидного allowlist | 307 /#products; остальные query отброшены |
| /demo/workspace | 404 |
| /products/brm | Сохранён redirect на /products/oms |
| /review/v6 | Закрыт по умолчанию, 404 |
| Футер tmsasub.store | / текущего origin |

Сохранены /, /products/crm, /products/oms, /products/crm-oms, /custom-development, /about, /partners, /cases и три истории b2b-wholesale/flooring-manufacturer/online-school. Добавлены /consent, /cookies; /privacy показывает owner source. Sitemap исключает /demo и включает документы. /auto и /nedv — внешний хостинг, B3 его не меняет и не подтверждает.

Три кейса проверены с главной и каталога на desktop/mobile. Продукты показывают существующие релевантные карточки: CRM — оптовик; OMS/связка — производитель. Не добавлены вымышленные карточки ради формального сочетания 3×3. School доступна на главной, в каталоге и прямой странице. Общий explorer использует тот же неизменённый content/cases.public.json через content/cases.ts.

Case→form: один открытый dialog, Escape/Back, Forward повторно открывает известную case entry, быстрый двойной CTA, cancel/error/success с возвратом к входу. Cleanup завершён через popstate + кадр браузера, фиксированного таймера нет. Scroll-проверка допускает максимум 2 CSS px округления; focus проверяется строго. Форма не восстанавливает введённые данные после закрытия/Forward и не хранит их.

Доказательства: tests/b3.spec.ts, b1.spec.ts, b2.spec.ts, upstream.spec.ts; qa/v6-b3/test-results.json, navigation/, states/, videos/.
