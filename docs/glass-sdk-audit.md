# Glass-HQ SDK · аудит TMS A4.5

Проверено 9 октября 2026. Область аудита: происхождение пакета, dist/types, используемые DOM/GPU lifecycle API и поведение двух поверхностей в TMS. Это не полный security-аудит всего shader/renderer и транзитивного дерева.

## Происхождение и точная версия

- Registry: `@glass-sdk/liquid-glass@0.0.1`, версия зафиксирована без диапазона.
- [Tarball](https://registry.npmjs.org/@glass-sdk/liquid-glass/-/liquid-glass-0.0.1.tgz); размер 78242 bytes, 52 файла / 250680 bytes unpacked.
- dist.integrity: `sha512-W1mb866h4BQX2QxgTiWDNOHtKlTVbwH0JIormffT8qQtH9adi1vvV6ddxILiLnyTAiBOerk8a2ER5RlJN8Fo7Q==`.
- SHA512 фактического tarball совпал с registry/lockfile. Все файлы установленного SDK побайтно совпали с tarball.
- Repository metadata: [Glass-HQ/liquid-glass](https://github.com/Glass-HQ/liquid-glass), directory packages/liquid-glass.
- Registry gitHead: `d21aee46853a1df01af61533ea6ac8b95887fbce`.
- Контрольный [commit 8795d30](https://github.com/Glass-HQ/liquid-glass/commit/8795d30e2519e7e33b26e19281b9ad26b5eed229) **не совпадает** с tarball. Совпадение номера 0.0.1 не является совпадением исходников.

Установленные dist/types сверены с DOM contract: createGlassScene, setContent, addSurface→cleanup, dispose; diagnostics surfaces/maps/mapTime/error. Дополнительно прочитан /gpu: getMaterialRenderer/disposeMaterialRenderer — публичный API, использованный для освобождения GPU после последней сцены. clearMaterialMapCache взят из /dom. Никаких выдуманных onReady/fallback/paused/quality props.

## WebKit mismatch

В npm dist отсутствуют `wanted`/stale geometry guard, WebKit-specific skip settle, releaseContent/willChange и merge fast path из контрольной правки. В соответствующих местах опубликованного dist остаются прямой `content.style.filter=''`, прежняя цепочка composite и settle. Эти наблюдения сверены с raw pinned src/dom/index.ts и diff commit. Последний main не подменяет installed package. Safari warning и цифры чужого menu-demo не используются как TMS performance evidence.

## Зависимости и сборка

Next 16.3.8, React/ReactDOM 19.3.0 и TypeScript 5.9.3 сохранены; moduleResolution=bundler, skipLibCheck=true уже были в проекте. SDK peers React/ReactDOM>=19 соблюдены, runtime проверен отдельно.

Установка: npm --save-exact, --ignore-scripts. Добавлено 24 записи package-lock. Прямые транзитивные зависимости SDK: vgpu ^0.5.0 → 0.5.0, @lisse/core ^0.7.2 → 0.7.2, @base-ui/react ^1.8.0 → 1.9.0. Версии ранее существовавших зависимостей не изменились. У @types/react/csstype изменился флаг dev→devOptional, у debug/ms снят dev из-за runtime дерева. Полный список resolved/integrity — qa/v6-a45/package-audit.json и lockfile. В дереве vgpu есть Node/MCP/WebGPU tooling; install scripts не запускались, devDependencies upstream не копировались.

CSS SDK импортирован один раз в HeroStory закрытой ветки. Его правило `.lg-surface:not([style*="clip-path"]){visibility:hidden}` переопределено **локально с достаточным приоритетом**: fallback и SSR сразу видимы. Inline visibility повествования сохраняет свой приоритет. Маленькие defaults controls и outline:none не применяются к текущим TMS controls — SDK controls не использованы.

Динамические imports только после review mount, policy, secure context и успешного adapter probe. CSS mode не импортирует GPU JS. Сеть проверена: главная V5 не запрашивает GPU chunks. Только sampled local SVG, ни формы, ни персональных данных в сцене; diagnostics хранятся локально в ограниченном latest sample, наружу не отправляются.

## Бюджет и измерение

Одна сцена / две addSurface / maxSurfaces=2. Дополнительный скрытый SVG внутри SDK — его map warmer, не третье сообщение и не второй TMS controller. Нет controller на каждом tick и нет GPU на теме. P1 deferred.

Дополнительные сетевые JS chunks режима sdk относительно css:

| Файл | Bytes | gzip bytes |
|---|---:|---:|
| 742.f578c4ef4622be15.js | 173766 | 56888 |
| 740.40b16107f4c91fda.js | 69905 | 25203 |
| 810.b39d79e19658362e.js | 233 | 168 |
| 220.64a347996a7327f0.js | 3245 | 1608 |

Итого 247149 / 83867 bytes. Gzip рассчитан локально на файлах production build, это не сетевой brotli размер. Сумма всех chunks: 1132788→1386294 bytes; 349239→435165 gzip. Raw tarball 78242 bytes нельзя считать runtime bundle cost.

Hardware Chromium 153.0.8010.12, Apple/metal-3, isFallbackAdapter=false. Cold 86.8ms; mapTime 23.0ms. Прогретые интервалы rAF и raw long tasks — sdk/audit.json. MapTime не FPS. Наблюдаемая умеренная рефракция подтверждена контрольным обнулением displacement на том же фоне; foreground filter=none, DOM bounds совпали. SDK contrast min 7.12:1. Статус `verified_chromium_desktop`, не cross-browser PASS.

## Отказы и lifecycle

CSS auto на непроверенных engine/mobile, обязательный CSS для reduced-transparency/forced-colors/more contrast; forced sdk не обходит эти условия. navigator.gpu недостаточно: вызывается requestAdapter, null/reject/timeout обрабатываются. Общий timeout старта 10s. Поздние continuations после unmount/timeout не регистрируют surfaces; поздний lease освобождается. Cleanup удаляет обе регистрации и scene; при нуле lease через 2s clears maps/disposes material renderer. Root ownership предотвращает два controller на один узел; StrictMode-последовательность отдельно unit-tested.

Offscreen rootMargin 200px + 750ms, background — немедленное снятие controller. При уходе далеко: 2 созданных устройства / 2 destroy; после возврата одна TMS сцена, два сообщения, прежний playback. Реальный device-lost не инжектировался; диагностическая ошибка renderer проверена с отказом тестового requestDevice. У upstream нет обещанного TMS onDeviceLost.

## Лицензия и воспроизводимость

MIT Copyright (c) 2026 Glass HQ. Полный notice сохранён в docs/licenses/glass-sdk-MIT.txt и поставляемых архивах. Сам npm tarball/dist не перепакован в source patch; воспроизводимая установка идёт по package-lock. Внешний контекст-пакет, reference images и upstream monorepo не включены в сайт.

Актуальные проверки: qa/v6-a45. Применённые инструкции: текущий AGENTS.md и локальные Next guides lazy-loading / CSS; приложенный пакет прочитан как задание и ограничения, не исполнялся как код сайта. Внутренняя verify_package.py прочитана, затем проверила 26 хешей пакета; это отдельно от website tests.
