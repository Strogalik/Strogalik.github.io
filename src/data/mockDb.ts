import type { CounterpartyDirectoryItem, DriverDirectoryItem, EdoDocument, EpdDocument, Fueling, FuelNormDirectoryItem, FuelTypeDirectoryItem, GasStationDirectoryItem, Integration, IntegrationJob, NotificationItem, RouteDirectoryItem, Trip, VehicleDirectoryItem } from './types';

export const trips: Trip[] = [
  {
    id: 'trip-248', number: 'TR-0248', status: 'in_transit', origin: 'Москва', destination: 'Казань',
    counterparty: 'ООО «ТрансЛогистика»', customer: 'ООО «ТрансЛогистика»', consignee: 'ООО «Волга Склад»',
    vehicle: 'КАМАЗ · А123ВС 77', driver: 'Иван Петров', cargo: 'Строительные материалы', weightKg: 12400,
    plannedAt: '18 авг, 08:30', actualAt: '18 авг, 08:47', plannedMileageKm: 824, actualMileageKm: 412,
    revenue: 125000, costs: 78400, margin: 37.3, documentsReady: 4, documentsTotal: 5, risk: 'documents',
  },
  { id:'trip-247', number:'TR-0247', status:'planned', origin:'Тула', destination:'Москва', counterparty:'ООО «СтройРесурс»', customer:'ООО «СтройРесурс»', consignee:'СК «Горизонт»', vehicle:'ГАЗон NEXT · В712КМ 71', driver:'Алексей Орлов', cargo:'Сухие смеси', weightKg:7800, plannedAt:'18 авг, 13:20', plannedMileageKm:196, revenue:46000, costs:27100, margin:41.1, documentsReady:3, documentsTotal:4 },
  { id:'trip-246', number:'TR-0246', status:'assigned', origin:'Рязань', destination:'Коломна', counterparty:'АО «ПромСнаб»', customer:'АО «ПромСнаб»', consignee:'АО «ПромСнаб»', vehicle:'MAN TGS · С455ОР 62', driver:'Денис Савин', cargo:'Паллетированный груз', weightKg:16800, plannedAt:'18 авг, 15:00', plannedMileageKm:112, revenue:52000, costs:32600, margin:37.3, documentsReady:4, documentsTotal:4 },
  { id:'trip-245', number:'TR-0245', status:'completed', origin:'Москва', destination:'Ярославль', counterparty:'ООО «СеверТорг»', customer:'ООО «СеверТорг»', consignee:'ООО «СеверТорг»', vehicle:'КАМАЗ · М821АР 77', driver:'Павел Кузнецов', cargo:'Сборный груз', weightKg:10300, plannedAt:'17 авг, 09:00', actualAt:'17 авг, 09:05', plannedMileageKm:278, actualMileageKm:281, revenue:67000, costs:45100, margin:32.7, documentsReady:5, documentsTotal:5 },
  { id:'trip-244', number:'TR-0244', status:'in_transit', origin:'Москва', destination:'Нижний Новгород', counterparty:'ООО «Логистик Плюс»', customer:'ООО «Логистик Плюс»', consignee:'ООО «НН Склад»', vehicle:'Volvo FH · Е901ТК 77', driver:'Сергей Мельников', cargo:'Оборудование', weightKg:9200, plannedAt:'18 авг, 07:10', actualAt:'18 авг, 07:12', plannedMileageKm:421, actualMileageKm:310, revenue:89000, costs:70300, margin:21.0, documentsReady:5, documentsTotal:5, risk:'delay' },
  { id:'trip-243', number:'TR-0243', status:'completed', origin:'Калуга', destination:'Москва', counterparty:'ООО «Форвард»', customer:'ООО «Форвард»', consignee:'РЦ «Юг»', vehicle:'Mercedes Actros · Т144РС 40', driver:'Михаил Волков', cargo:'Тара', weightKg:5400, plannedAt:'17 авг, 14:30', actualAt:'17 авг, 14:20', plannedMileageKm:188, actualMileageKm:185, revenue:42000, costs:25100, margin:40.2, documentsReady:4, documentsTotal:4 },
  { id:'trip-242', number:'TR-0242', status:'cancelled', origin:'Москва', destination:'Тверь', counterparty:'АО «РегионКомплект»', customer:'АО «РегионКомплект»', consignee:'АО «РегионКомплект»', vehicle:'—', driver:'—', cargo:'Комплектующие', weightKg:6100, plannedAt:'17 авг, 16:10', plannedMileageKm:182, revenue:0, costs:4200, margin:0, documentsReady:1, documentsTotal:3 },
  { id:'trip-241', number:'TR-0241', status:'completed', origin:'Москва', destination:'Владимир', counterparty:'ООО «Вектор»', customer:'ООО «Вектор»', consignee:'ООО «Вектор»', vehicle:'Scania R · К510УМ 77', driver:'Роман Егоров', cargo:'Оборудование', weightKg:14100, plannedAt:'16 авг, 11:00', actualAt:'16 авг, 11:10', plannedMileageKm:191, actualMileageKm:194, revenue:58000, costs:39200, margin:32.4, documentsReady:5, documentsTotal:5 },
];

export const epdDocuments: EpdDocument[] = [
  { id:'epl-2341', number:'ЭПЛ №2341', type:'ЭПЛ', tripId:'trip-248', tripNumber:'TR-0248', counterparty:'ООО «ТрансЛогистика»', status:'awaiting_signature', signature:'1 из 2', saby:'Не отправлен', createdAt:'18 авг, 08:40', driver:'Иван Петров', vehicle:'КАМАЗ · А123ВС 77' },
  { id:'etrn-8123', number:'ЭТрН №8123', type:'ЭТрН', tripId:'trip-248', tripNumber:'TR-0248', counterparty:'ООО «ТрансЛогистика»', status:'accepted', signature:'Подписан', saby:'Принят', createdAt:'18 авг, 08:32', driver:'Иван Петров', vehicle:'КАМАЗ · А123ВС 77' },
  { id:'ezz-5301', number:'ЭЗЗ №5301', type:'ЭЗЗ', tripId:'trip-247', tripNumber:'TR-0247', counterparty:'ООО «СтройРесурс»', status:'sent', signature:'Подписан', saby:'Отправлен', createdAt:'18 авг, 09:15', driver:'Алексей Орлов', vehicle:'ГАЗон NEXT · В712КМ 71' },
  { id:'epl-2339', number:'ЭПЛ №2339', type:'ЭПЛ', tripId:'trip-244', tripNumber:'TR-0244', counterparty:'ООО «Логистик Плюс»', status:'error', signature:'Подписан', saby:'Ошибка', createdAt:'18 авг, 07:00', driver:'Сергей Мельников', vehicle:'Volvo FH · Е901ТК 77' },
  { id:'etrn-8120', number:'ЭТрН №8120', type:'ЭТрН', tripId:'trip-245', tripNumber:'TR-0245', counterparty:'ООО «СеверТорг»', status:'accepted', signature:'Подписан', saby:'Принят', createdAt:'17 авг, 08:45', driver:'Павел Кузнецов', vehicle:'КАМАЗ · М821АР 77' },
  { id:'epl-2338', number:'ЭПЛ №2338', type:'ЭПЛ', tripId:'trip-246', tripNumber:'TR-0246', counterparty:'АО «ПромСнаб»', status:'draft', signature:'Нет', saby:'—', createdAt:'18 авг, 10:20', driver:'Денис Савин', vehicle:'MAN TGS · С455ОР 62' },
];

export const edoDocuments: EdoDocument[] = [
  { id:'edo-251', number:'УПД №251', type:'УПД', tripId:'trip-248', tripNumber:'TR-0248', counterparty:'ООО «ТрансЛогистика»', amount:125000, status:'awaiting_signature', approval:'2 из 3', createdAt:'18 авг, 10:12' },
  { id:'edo-250', number:'Акт №250', type:'Акт', tripId:'trip-245', tripNumber:'TR-0245', counterparty:'ООО «СеверТорг»', amount:67000, status:'signed', approval:'3 из 3', createdAt:'17 авг, 17:40' },
  { id:'edo-249', number:'Счёт №249', type:'Счёт', tripId:'trip-244', tripNumber:'TR-0244', counterparty:'ООО «Логистик Плюс»', amount:89000, status:'approval', approval:'1 из 3', createdAt:'18 авг, 09:32' },
  { id:'edo-248', number:'УПД №248', type:'УПД', tripId:'trip-243', tripNumber:'TR-0243', counterparty:'ООО «Форвард»', amount:42000, status:'signed', approval:'3 из 3', createdAt:'17 авг, 16:18' },
  { id:'edo-247', number:'Акт №247', type:'Акт', tripId:'trip-247', tripNumber:'TR-0247', counterparty:'ООО «СтройРесурс»', amount:46000, status:'approval', approval:'2 из 3', createdAt:'18 авг, 08:54' },
  { id:'edo-246', number:'Счёт №246', type:'Счёт', tripId:'trip-246', tripNumber:'TR-0246', counterparty:'АО «ПромСнаб»', amount:52000, status:'awaiting_signature', approval:'2 из 3', createdAt:'18 авг, 08:10' },
  { id:'edo-245', number:'УПД №245', type:'УПД', tripId:'trip-241', tripNumber:'TR-0241', counterparty:'ООО «Вектор»', amount:58000, status:'signed', approval:'3 из 3', createdAt:'16 авг, 18:06' },
  { id:'edo-244', number:'Акт №244', type:'Акт', tripId:'trip-242', tripNumber:'TR-0242', counterparty:'АО «РегионКомплект»', amount:0, status:'rejected', approval:'Отклонён', createdAt:'17 авг, 15:48' },
];

export const fuelings: Fueling[] = [
  { id:'fuel-8841', number:'ГСМ-8841', dateTime:'18 авг, 09:18', vehicle:'КАМАЗ · А123ВС 77', driver:'Иван Петров', fuelType:'ДТ', liters:242.70, pricePerLiter:64.90, amount:15751.23, gasStation:'Газпромнефть №214', address:'Московская обл., М-7, 42 км', receiptNumber:'ЧК-819402', receiptFile:'receipt-8841.jpg', odometerKm:184320, tripId:'trip-248', tripNumber:'TR-0248', paymentMethod:'fuel_card', status:'confirmed', anomalies:[], actualConsumption:31.8, normConsumption:31.5, variancePct:1.0, source:'manual', oneCStatus:'exported', comment:'Заправка перед выездом на М-7.' },
  { id:'fuel-8840', number:'ГСМ-8840', dateTime:'18 авг, 08:02', vehicle:'Volvo FH · Е901ТК 77', driver:'Сергей Мельников', fuelType:'ДТ', liters:360.00, pricePerLiter:66.20, amount:23832.00, gasStation:'Лукойл №517', address:'Москва, МКАД 19 км', receiptNumber:'ЧК-104812', receiptFile:'receipt-8840.jpg', odometerKm:326810, tripId:'trip-244', tripNumber:'TR-0244', paymentMethod:'corporate_card', status:'pending_approval', anomalies:['norm'], actualConsumption:36.4, normConsumption:29.9, variancePct:21.7, source:'manual', oneCStatus:'blocked', comment:'Расход выше нормы, требуется проверка маршрута и простоя.' },
  { id:'fuel-8839', number:'ГСМ-8839', dateTime:'18 авг, 07:41', vehicle:'Volvo FH · Е901ТК 77', driver:'Сергей Мельников', fuelType:'ДТ', liters:92.00, pricePerLiter:66.10, amount:6081.20, gasStation:'Лукойл №517', address:'Москва, МКАД 19 км', receiptNumber:'ЧК-104779', receiptFile:'receipt-8839.jpg', odometerKm:326806, tripId:'trip-244', tripNumber:'TR-0244', paymentMethod:'corporate_card', status:'pending_approval', anomalies:['duplicate'], actualConsumption:36.4, normConsumption:29.9, variancePct:21.7, source:'manual', oneCStatus:'blocked' },
  { id:'fuel-8838', number:'ГСМ-8838', dateTime:'17 авг, 15:22', vehicle:'КАМАЗ · М821АР 77', driver:'Павел Кузнецов', fuelType:'ДТ', liters:158.40, pricePerLiter:63.80, amount:10105.92, gasStation:'Роснефть №118', address:'Ярославская обл., М-8, 248 км', receiptNumber:'ЧК-550138', receiptFile:'receipt-8838.jpg', odometerKm:208442, tripId:'trip-245', tripNumber:'TR-0245', paymentMethod:'fuel_card', status:'confirmed', anomalies:[], actualConsumption:26.8, normConsumption:27.2, variancePct:-1.5, source:'fuel_card', oneCStatus:'exported' },
  { id:'fuel-8837', number:'ГСМ-8837', dateTime:'17 авг, 12:16', vehicle:'Mercedes Actros · Т144РС 40', driver:'Михаил Волков', fuelType:'ДТ', liters:126.20, pricePerLiter:65.10, amount:8215.62, gasStation:'Газпромнефть №083', address:'Калужская обл., Киевское ш., 124 км', receiptNumber:'ЧК-771402', receiptFile:'receipt-8837.jpg', odometerKm:412088, tripId:'trip-243', tripNumber:'TR-0243', paymentMethod:'fuel_card', status:'confirmed', anomalies:[], actualConsumption:28.3, normConsumption:29.0, variancePct:-2.4, source:'fuel_card', oneCStatus:'exported' },
  { id:'fuel-8836', number:'ГСМ-8836', dateTime:'17 авг, 10:44', vehicle:'Scania R · К510УМ 77', driver:'Роман Егоров', fuelType:'ДТ', liters:190.00, pricePerLiter:91.50, amount:17385.00, gasStation:'АЗС «Трасса» №44', address:'Владимирская обл., М-7, 132 км', receiptNumber:'ЧК-220611', receiptFile:'receipt-8836.jpg', odometerKm:287531, tripId:'trip-241', tripNumber:'TR-0241', paymentMethod:'cash', status:'pending_approval', anomalies:['price'], actualConsumption:30.1, normConsumption:29.4, variancePct:2.4, source:'manual', oneCStatus:'blocked', comment:'Цена существенно выше среднего значения по региону.' },
  { id:'fuel-8835', number:'ГСМ-8835', dateTime:'16 авг, 18:03', vehicle:'MAN TGS · С455ОР 62', driver:'Денис Савин', fuelType:'ДТ', liters:620.00, pricePerLiter:64.30, amount:39866.00, gasStation:'Газпромнефть №147', address:'Рязань, Куйбышевское ш., 25', receiptNumber:'ЧК-338801', receiptFile:'receipt-8835.jpg', odometerKm:367120, tripId:'trip-246', tripNumber:'TR-0246', paymentMethod:'corporate_card', status:'rejected', anomalies:['tank'], actualConsumption:30.8, normConsumption:30.8, variancePct:0, source:'manual', oneCStatus:'blocked', comment:'Объём превышает допустимый остаток в баке — запись отклонена.' },
  { id:'fuel-8834', number:'ГСМ-8834', dateTime:'16 авг, 11:18', vehicle:'ГАЗон NEXT · В712КМ 71', driver:'Алексей Орлов', fuelType:'ДТ', liters:76.50, pricePerLiter:63.90, amount:4888.35, gasStation:'Роснефть №092', address:'Тульская обл., М-2, 176 км', receiptNumber:'ЧК-116731', receiptFile:'receipt-8834.jpg', odometerKm:98215, tripId:'trip-247', tripNumber:'TR-0247', paymentMethod:'fuel_card', status:'confirmed', anomalies:[], actualConsumption:18.1, normConsumption:18.4, variancePct:-1.6, source:'fuel_card', oneCStatus:'ready' },
];

export const dashboardSeries = [
  { label:'12 авг', revenue:302, costs:201 },
  { label:'13 авг', revenue:341, costs:226 },
  { label:'14 авг', revenue:318, costs:219 },
  { label:'15 авг', revenue:396, costs:251 },
  { label:'16 авг', revenue:428, costs:278 },
  { label:'17 авг', revenue:452, costs:292 },
  { label:'18 авг', revenue:479, costs:315 },
];


export const notifications: NotificationItem[] = [
  { id:'n-fuel-1', severity:'warning', category:'fuel', title:'ГСМ-8840 — расход выше нормы на 21,7%', meta:'Рейс TR-0244 · Volvo FH · требуется согласование', time:'8 мин назад', href:'/fuel/fuel-8840', unread:true },
  { id:'n1', severity:'critical', category:'epd', title:'ЭПЛ №2339 — ошибка обмена с Saby', meta:'Рейс TR-0244 · документ не отправлен · требуется исправление', time:'12 мин назад', href:'/epd/epl-2339', unread:true },
  { id:'n2', severity:'warning', category:'trips', title:'TR-0244 идёт с задержкой 46 минут', meta:'Москва → Нижний Новгород · Сергей Мельников', time:'24 мин назад', href:'/trips/trip-244', unread:true },
  { id:'n3', severity:'warning', category:'edo', title:'УПД №251 ожидает подписи', meta:'ООО «ТрансЛогистика» · согласовано 2 из 3', time:'41 мин назад', href:'/edo/edo-251', unread:true },
  { id:'n4', severity:'critical', category:'finance', title:'Маржа по рейсу TR-0244 ниже порога', meta:'21,0% при контрольном значении 25%', time:'1 ч назад', href:'/trips/trip-244', unread:false },
  { id:'n5', severity:'info', category:'integrations', title:'Обмен с 1С завершён', meta:'Синхронизировано 8 рейсов и 6 документов', time:'2 ч назад', href:'/integrations/1c', unread:false },
  { id:'n6', severity:'warning', category:'epd', title:'ЭПЛ №2341 ожидает вторую подпись', meta:'Рейс TR-0248 · Иван Петров', time:'2 ч назад', href:'/epd/epl-2341', unread:false },
  { id:'n7', severity:'info', category:'trips', title:'Рейс TR-0245 завершён', meta:'Москва → Ярославль · документы собраны полностью', time:'вчера, 18:20', href:'/trips/trip-245', unread:false },
];

export const integrations: Integration[] = [
  { id:'saby', name:'Saby', subtitle:'ЭПД и ЭДО', status:'degraded', lastSync:'сегодня, 10:42', queue:4, errors:1, environment:'Продакшн', organization:'ООО «TMS Demo»', safeId:'org_••••3184', description:'Передача ЭПД, ЭДО-документов, статусов, квитанций и внешних идентификаторов.' },
  { id:'1c', name:'1С / ERP', subtitle:'Учёт и первичные документы', status:'connected', lastSync:'сегодня, 10:38', queue:0, errors:0, environment:'Продакшн', organization:'ООО «TMS Demo»', safeId:'node_••••0842', description:'Справочники, рейсы, услуги перевозки, затраты, подтверждённые заправки и документы учёта.' },
  { id:'telematics', name:'GPS / ГЛОНАСС', subtitle:'Телематика транспорта', status:'not_configured', lastSync:'—', queue:0, errors:0, environment:'Не настроено', organization:'ООО «TMS Demo»', safeId:'—', description:'Координаты, пробег, статусы движения, простои и события маршрута.' },
  { id:'fuel-cards', name:'Топливные карты', subtitle:'Транзакции ГСМ', status:'not_configured', lastSync:'—', queue:0, errors:0, environment:'Не настроено', organization:'ООО «TMS Demo»', safeId:'—', description:'Транзакции заправок, АЗС, литры и суммы с сохранением источника данных.' },
];

export const integrationJobs: IntegrationJob[] = [
  { id:'job-9831', system:'Saby', operation:'Отправка ЭПЛ', entity:'ЭПЛ №2339', status:'error', externalId:'saby_••••9012', createdAt:'сегодня, 10:41', attempts:3 },
  { id:'job-9830', system:'Saby', operation:'Получение статуса', entity:'ЭТрН №8123', status:'processing', externalId:'saby_••••8234', createdAt:'сегодня, 10:40', attempts:1 },
  { id:'job-9829', system:'Saby', operation:'Отправка УПД', entity:'УПД №251', status:'queued', externalId:'—', createdAt:'сегодня, 10:39', attempts:0 },
  { id:'job-9828', system:'1С/ERP', operation:'Выгрузка рейса', entity:'TR-0245', status:'success', externalId:'1c_••••7710', createdAt:'сегодня, 10:38', attempts:1 },
  { id:'job-9827', system:'1С/ERP', operation:'Синхронизация контрагента', entity:'ООО «СеверТорг»', status:'success', externalId:'1c_••••7702', createdAt:'сегодня, 10:37', attempts:1 },
  { id:'job-9826', system:'Saby', operation:'Получение квитанции', entity:'ЭТрН №8120', status:'success', externalId:'saby_••••8109', createdAt:'сегодня, 10:35', attempts:1 },
];

export const vehiclesDirectory: VehicleDirectoryItem[] = [
  { id:'veh-1', regNumber:'А123ВС 77', vin:'XTC53205L0•••4812', brandModel:'КАМАЗ 54901', type:'Тягач', capacityKg:20000, fuelType:'ДТ', tankLiters:800, consumptionNorm:31.5, status:'active' },
  { id:'veh-2', regNumber:'В712КМ 71', vin:'X96A21R23M•••1940', brandModel:'ГАЗон NEXT', type:'Грузовой', capacityKg:8700, fuelType:'ДТ', tankLiters:210, consumptionNorm:18.4, status:'active' },
  { id:'veh-3', regNumber:'С455ОР 62', vin:'WMA06XZZ9K•••6804', brandModel:'MAN TGS 18.400', type:'Тягач', capacityKg:21000, fuelType:'ДТ', tankLiters:760, consumptionNorm:30.8, status:'active' },
  { id:'veh-4', regNumber:'Е901ТК 77', vin:'YV2RT40A8J•••2251', brandModel:'Volvo FH', type:'Тягач', capacityKg:22000, fuelType:'ДТ', tankLiters:900, consumptionNorm:29.9, status:'service' },
  { id:'veh-5', regNumber:'М821АР 77', vin:'XTC65207K9•••4410', brandModel:'КАМАЗ 65207', type:'Грузовой', capacityKg:14500, fuelType:'ДТ', tankLiters:500, consumptionNorm:27.2, status:'active' },
];

export const driversDirectory: DriverDirectoryItem[] = [
  { id:'drv-1', name:'Иван Петров', personnelNumber:'В-0142', phone:'+7 999 320-14-82', status:'on_trip', vehicle:'КАМАЗ · А123ВС 77', epdReady:true },
  { id:'drv-2', name:'Алексей Орлов', personnelNumber:'В-0108', phone:'+7 999 417-20-63', status:'active', vehicle:'ГАЗон NEXT · В712КМ 71', epdReady:true },
  { id:'drv-3', name:'Денис Савин', personnelNumber:'В-0097', phone:'+7 999 208-45-10', status:'active', vehicle:'MAN TGS · С455ОР 62', epdReady:true },
  { id:'drv-4', name:'Сергей Мельников', personnelNumber:'В-0119', phone:'+7 999 761-03-41', status:'on_trip', vehicle:'Volvo FH · Е901ТК 77', epdReady:true },
  { id:'drv-5', name:'Павел Кузнецов', personnelNumber:'В-0088', phone:'+7 999 683-19-27', status:'inactive', vehicle:'КАМАЗ · М821АР 77', epdReady:false },
];

export const counterpartiesDirectory: CounterpartyDirectoryItem[] = [
  { id:'cp-1', name:'ООО «ТрансЛогистика»', inn:'7708421930', kpp:'770801001', address:'Москва, ул. Складочная, 18', contracts:3, edoStatus:'connected' },
  { id:'cp-2', name:'ООО «СтройРесурс»', inn:'7107048241', kpp:'710701001', address:'Тула, Новомосковское ш., 12', contracts:2, edoStatus:'connected' },
  { id:'cp-3', name:'АО «ПромСнаб»', inn:'6234091774', kpp:'623401001', address:'Рязань, Промышленная, 7', contracts:4, edoStatus:'roaming' },
  { id:'cp-4', name:'ООО «Логистик Плюс»', inn:'5260428128', kpp:'526001001', address:'Нижний Новгород, Московское ш., 52', contracts:2, edoStatus:'attention' },
  { id:'cp-5', name:'ООО «СеверТорг»', inn:'7604351820', kpp:'760401001', address:'Ярославль, Полушкина Роща, 16', contracts:1, edoStatus:'connected' },
];

export const routesDirectory: RouteDirectoryItem[] = [
  { id:'route-1', name:'Москва → Казань', origin:'Москва', destination:'Казань', distanceKm:824, plannedDuration:'12 ч 20 мин', points:2, status:'active' },
  { id:'route-2', name:'Тула → Москва', origin:'Тула', destination:'Москва', distanceKm:196, plannedDuration:'3 ч 10 мин', points:2, status:'active' },
  { id:'route-3', name:'Рязань → Коломна', origin:'Рязань', destination:'Коломна', distanceKm:112, plannedDuration:'2 ч 05 мин', points:3, status:'active' },
  { id:'route-4', name:'Москва → Нижний Новгород', origin:'Москва', destination:'Нижний Новгород', distanceKm:421, plannedDuration:'6 ч 45 мин', points:2, status:'active' },
  { id:'route-5', name:'Москва → Владимир', origin:'Москва', destination:'Владимир', distanceKm:191, plannedDuration:'3 ч 05 мин', points:2, status:'draft' },
];

export const gasStationsDirectory: GasStationDirectoryItem[] = [
  { id:'station-214', name:'Газпромнефть №214', network:'Газпромнефть', address:'Московская обл., М-7, 42 км', coordinates:'55.9274, 38.1582', fuelTypes:['ДТ','АИ-95'], status:'active', linkedFuelings:18 },
  { id:'station-517', name:'Лукойл №517', network:'Лукойл', address:'Москва, МКАД 19 км', coordinates:'55.6118, 37.7164', fuelTypes:['ДТ','АИ-92','АИ-95'], status:'active', linkedFuelings:27 },
  { id:'station-118', name:'Роснефть №118', network:'Роснефть', address:'Ярославская обл., М-8, 248 км', coordinates:'57.5139, 39.8765', fuelTypes:['ДТ','АИ-95'], status:'active', linkedFuelings:11 },
  { id:'station-083', name:'Газпромнефть №083', network:'Газпромнефть', address:'Калужская обл., Киевское ш., 124 км', coordinates:'55.0325, 36.7461', fuelTypes:['ДТ','АИ-92','АИ-95'], status:'active', linkedFuelings:9 },
  { id:'station-044', name:'АЗС «Трасса» №44', network:'Трасса', address:'Владимирская обл., М-7, 132 км', coordinates:'56.1318, 40.4013', fuelTypes:['ДТ','АИ-95','Газ'], status:'active', linkedFuelings:6 },
  { id:'station-092', name:'Роснефть №092', network:'Роснефть', address:'Тульская обл., М-2, 176 км', coordinates:'54.3553, 37.6934', fuelTypes:['ДТ','АИ-92'], status:'inactive', linkedFuelings:4 },
];

export const fuelTypesDirectory: FuelTypeDirectoryItem[] = [
  { id:'fueltype-dt', code:'DT', name:'Дизельное топливо', unit:'л', stationCount:6, status:'active' },
  { id:'fueltype-ai92', code:'AI92', name:'АИ-92', unit:'л', stationCount:4, status:'active' },
  { id:'fueltype-ai95', code:'AI95', name:'АИ-95', unit:'л', stationCount:5, status:'active' },
  { id:'fueltype-ai98', code:'AI98', name:'АИ-98', unit:'л', stationCount:0, status:'inactive' },
  { id:'fueltype-gas', code:'GAS', name:'Газ', unit:'л', stationCount:1, status:'active' },
];

export const fuelNormsDirectory: FuelNormDirectoryItem[] = [
  { id:'norm-kamaz-54901', vehicleId:'veh-1', vehicle:'КАМАЗ 54901 · А123ВС 77', fuelType:'ДТ', baseNorm:31.5, effectiveFrom:'01.01.2026', status:'active', coefficients:[
    { id:'winter', label:'Зимний период', valuePct:10, description:'Применяется при активном зимнем коэффициенте.' },
    { id:'city', label:'Городской режим', valuePct:5, description:'Для маршрутов с повышенной долей городского движения.' },
  ] },
  { id:'norm-gazon-next', vehicleId:'veh-2', vehicle:'ГАЗон NEXT · В712КМ 71', fuelType:'ДТ', baseNorm:18.4, effectiveFrom:'01.01.2026', status:'active', coefficients:[
    { id:'winter', label:'Зимний период', valuePct:10, description:'Применяется при активном зимнем коэффициенте.' },
  ] },
  { id:'norm-man-tgs', vehicleId:'veh-3', vehicle:'MAN TGS 18.400 · С455ОР 62', fuelType:'ДТ', baseNorm:30.8, effectiveFrom:'01.02.2026', status:'active', coefficients:[
    { id:'winter', label:'Зимний период', valuePct:8, description:'Сезонная корректировка нормы.' },
    { id:'city', label:'Городской режим', valuePct:4, description:'Используется для городских участков.' },
  ] },
  { id:'norm-volvo-fh', vehicleId:'veh-4', vehicle:'Volvo FH · Е901ТК 77', fuelType:'ДТ', baseNorm:29.9, effectiveFrom:'15.01.2026', status:'active', coefficients:[
    { id:'winter', label:'Зимний период', valuePct:9, description:'Сезонная корректировка нормы.' },
    { id:'idle', label:'Повышенный простой', valuePct:3, description:'Настраиваемый коэффициент для длительной работы на холостом ходу.' },
  ] },
  { id:'norm-kamaz-65207', vehicleId:'veh-5', vehicle:'КАМАЗ 65207 · М821АР 77', fuelType:'ДТ', baseNorm:27.2, effectiveFrom:'01.01.2026', status:'draft', coefficients:[
    { id:'winter', label:'Зимний период', valuePct:10, description:'Будет применяться после публикации нормы.' },
  ] },
];
