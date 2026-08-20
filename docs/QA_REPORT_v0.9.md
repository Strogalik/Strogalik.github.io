# QA Report — TMS ASUB Logistics v0.9 stable

## Baseline

v0.9 собран строго от approved stable v0.6. Экспериментальные route-transition/motion механики v0.7/v0.8 не переносились.

## Новые экраны

- `/notifications`
- `/integrations`
- `/integrations/:integrationId`
- `/integrations/jobs`
- `/directories`
- `/directories/vehicles`
- `/directories/drivers`
- `/directories/counterparties`
- `/directories/routes`

## Что проверялось

Для новых экранов проверялись:

- root horizontal overflow;
- выход panel/card за page wrapper;
- переполнение grid/flex children длинным контентом;
- поведение длинных названий организаций и контрагентов;
- containment status pills;
- desktop table wrappers;
- отдельная mobile-композиция вместо сжатой desktop-table;
- expanded и collapsed sidebar;
- responsive switching около основного breakpoint;
- читаемость mobile metadata rows;
- отсутствие секретов интеграций в UI fixtures.

## Viewport matrix

Основной page × viewport pass:

- 1440
- 1280
- 861
- 860
- 430
- 390
- 360
- 340 px

Пять репрезентативных surfaces × восемь размеров = **40 cases**.

Результат после refinement: **40/40 PASS**.

Отдельный desktop sidebar pass:

- 1920 expanded / collapsed
- 1440 expanded / collapsed
- 1280 expanded / collapsed

Пять репрезентативных surfaces × шесть состояний = **30 cases**.

Результат: **30/30 PASS**.

## Найденные и исправленные проблемы во время QA

До финального pass были найдены и устранены:

1. notification metadata могла создавать внутренний overflow из-за nowrap;
2. integration detail grid был слишком плотным около 861px;
3. directory hub grid был слишком плотным около 861px;
4. mobile definition label мог занимать лишнюю ширину на длинных русских подписях.

После исправлений соответствующие cases повторно прогнаны.

## Source validation

- TypeScript/TSX syntax harness: **37 files / 0 syntax errors**.
- CSS parser: **10 stylesheets / 0 parse errors**.
- grep-проверка: в source отсутствуют v0.7/v0.8 motion-lab механизмы (`viewTransition`, wheel-driven route navigation, route-surface dragging, rubber-band state).

## Ограничение окружения

Полный `npm install` в execution environment не завершился из-за сетевого timeout, а offline install не смог получить отсутствующий cached package `@tanstack/react-query`. Поэтому полноценный Vite production build здесь не заявляется как пройденный.

На локальной машине финальный check перед merge:

```bash
npm install
npm run build
npm run dev
```

После запуска вручную проверить основные новые routes на desktop и mobile.
