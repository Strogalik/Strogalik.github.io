# B5 — готовность необязательной аналитики

**Default OFF.** Владелец ещё не выбрал сервис, ID и не разрешил внешнюю передачу. Яндекс Метрика — подготовленный кандидат, не действующая интеграция. В рабочем preview нет счётчика и разрешающих кнопок. Старый NEXT_PUBLIC_YANDEX_METRIKA_ID игнорируется механизмом включения.

## Единая конфигурация

lib/privacy/config.server.ts вызывает Node-only builder. Marketing layout и /analytics-consent используют runtime connection(), чтобы документы и shell получали серверную конфигурацию текущего запроса. /api/analytics-config читает тот же builder и возвращает только безопасный профиль. Этот новый GET необходим для проверки перед grant и обновления уже открытой страницы; он не собирает данные.

Для будущего включения требуются одновременно TMS_ANALYTICS_PROVIDER=yandex_metrica, TMS_ANALYTICS_ENABLED=true, TMS_ANALYTICS_OPERATOR_APPROVED=true, TMS_ANALYTICS_PROFILE_REVIEWED=true, положительный TMS_METRIKA_ID и TMS_ANALYTICS_REVIEWED_PROFILE_DIGEST, совпадающий с profileDigest(ID). Digest SHA256 включает ID, сервис/получателя/адрес/ссылки/категории/версию/хеш согласия/срок/функции. Отсутствие или расхождение любого условия даёт OFF. Это описание механизма, не разрешение его включить. Env-файлы и секреты не менялись.

Изменённая серверная конфигурация применяется при новом документе, проверке перед grant, focus/visibility и опросе раз в 30 секунд для configured страницы. При получении OFF/нового профиля счётчик останавливается сразу. Ошибка получения конфигурации также закрывает gate. Изменение внешней настройки не может быть узнано уже открытой вкладкой мгновенно без запроса; здесь нет заявления об удалённом мгновенном push. Срок пользовательского выбора дополнительно проверяется перед каждым hit.

## Ограниченный адаптер

Нет tag/pixel/noscript/preconnect/dns-prefetch/beacon и отложенной очереди до grant. Lazy chunk и один tag на документ; StrictMode не дублирует init. При обычном полном переходе через HTML-ссылку новый документ может заново загрузить tag при действующем выборе; внутри одного документа повторное разрешение использует уже загруженный tag.

init: defer:true, webvisor:false, clickmap:false, trackLinks:false, accurateTrackBounce:false, ecommerce:false, trackHash:false, childIframe:false, disableYtm:true, sendTitle:false. triggerEvent:true нужен для наблюдаемого завершения init. Статусы выбора и загрузки разделены: grant не выдаётся за готовый счётчик при adblock/timeout. Разрешены только 15 фиксированных публичных путей, не произвольные slug, query, hash или поля обращения. До grant история не сохраняется и не досылается.

Revoke: generation invalidation, disableYaCounter<ID>=true, ym(id,'destruct'), очистка только документированного allowlist, без общего clear storage. Поздний onload не инициализирует счётчик. Нельзя гарантировать отмену уже ушедшего HTTP-запроса или удаление уже принятых сервисом данных.

Первичные технические источники: [init](https://yandex.ru/support/metrica/ru/code/counter-initialize), [SPA/destruct](https://yandex.ru/support/metrica/ru/code/counter-spa-setup), [opt-out](https://yandex.ru/support/metrica/ru/general/user-opt-out), [файлы хранения](https://yandex.ru/support/metrica/ru/general/cookie-usage). Сроки и получатель отображаются до выбора; отдельный условный документ /analytics-consent.

## Что остаётся перед отдельным включением

Решение владельца о сервисе и ID; проверка договора/получателя/категорий/сроков/профиля; отдельно разрешённая live network/storage проверка настоящего tag на отсутствие запрещённых данных и функций; доказуемое хранение согласий; проверка /auto/ и /nedv/ как отдельных приложений. Test double подтверждает только наш gate и команды адаптера, не реальную телеметрию закрытого внешнего скрипта. При изменении профиля нужны новая редакция/digest и новый выбор посетителя. Реклама, Вебвизор и контактный matching не входят в этот профиль.
