import type { AdminRoleItem, AdminUserItem, AlertRuleItem, ApprovalRouteDirectoryItem, AuditEventItem, CargoDirectoryItem, CertificateItem, DocumentTemplateDirectoryItem, EpdTariffInfo, MedicalCheckItem, ReasonDirectoryItem, TechnicalInspectionItem } from './types';

export const cargoDirectory: CargoDirectoryItem[] = [
  { id:'cargo-1', name:'Строительные материалы', unit:'кг', category:'Материалы', specialConditions:'Сухой кузов, без температурного режима', status:'active' },
  { id:'cargo-2', name:'Паллетированный груз', unit:'пал.', category:'Сборные грузы', specialConditions:'Фиксация паллет и контроль целостности упаковки', status:'active' },
  { id:'cargo-3', name:'Промышленное оборудование', unit:'шт.', category:'Оборудование', specialConditions:'Крепление по схеме грузоотправителя', status:'active' },
  { id:'cargo-4', name:'Сухие смеси', unit:'кг', category:'Материалы', specialConditions:'Защита от влаги', status:'active' },
  { id:'cargo-5', name:'Тара возвратная', unit:'шт.', category:'Тара', specialConditions:'Учёт возвратных мест', status:'inactive' },
];

export const approvalRoutesDirectory: ApprovalRouteDirectoryItem[] = [
  { id:'approval-1', name:'УПД · стандарт', documentType:'УПД', steps:['Автор','Бухгалтер','Подписант','Отправитель'], organization:'ООО «TMS Demo»', status:'active' },
  { id:'approval-2', name:'Акт · перевозка', documentType:'Акт', steps:['Автор','Руководитель направления','Подписант'], organization:'ООО «TMS Demo»', status:'active' },
  { id:'approval-3', name:'Договор · расширенный', documentType:'Договор', steps:['Автор','Юрист','Бухгалтер','Подписант'], organization:'ООО «TMS Demo»', status:'active' },
  { id:'approval-4', name:'Счёт · быстрый', documentType:'Счёт', steps:['Автор','Бухгалтер'], organization:'Филиал Москва', status:'draft' },
];

export const reasonsDirectory: ReasonDirectoryItem[] = [
  { id:'reason-1', category:'idle', label:'Ожидание погрузки', requiresComment:false, status:'active' },
  { id:'reason-2', category:'idle', label:'Очередь на разгрузке', requiresComment:false, status:'active' },
  { id:'reason-3', category:'cancel', label:'Отмена заказчиком', requiresComment:true, status:'active' },
  { id:'reason-4', category:'deviation', label:'Отклонение маршрута по согласованию', requiresComment:true, status:'active' },
  { id:'reason-5', category:'error', label:'Ошибка реквизитов документа', requiresComment:true, status:'active' },
];

export const documentTemplatesDirectory: DocumentTemplateDirectoryItem[] = [
  { id:'tpl-1', name:'УПД по завершённому рейсу', type:'УПД', approvalRoute:'УПД · стандарт', updatedAt:'12.08.2026', status:'active' },
  { id:'tpl-2', name:'Акт оказанных услуг', type:'Акт', approvalRoute:'Акт · перевозка', updatedAt:'10.08.2026', status:'active' },
  { id:'tpl-3', name:'Счёт на перевозку', type:'Счёт', approvalRoute:'Счёт · быстрый', updatedAt:'09.08.2026', status:'active' },
  { id:'tpl-4', name:'Дополнительное соглашение', type:'Договор', approvalRoute:'Договор · расширенный', updatedAt:'04.08.2026', status:'draft' },
];

export const technicalInspections: TechnicalInspectionItem[] = [
  { id:'tech-1', vehicleId:'veh-1', vehicle:'КАМАЗ 54901', regNumber:'А123ВС 77', odometerKm:184320, fuelLiters:518, tankLiters:800, inspectedAt:'сегодня, 07:52', inspector:'Андрей Соколов', status:'ready', note:'Технических замечаний нет.', linkedTrip:'TR-0248' },
  { id:'tech-2', vehicleId:'veh-4', vehicle:'Volvo FH', regNumber:'Е901ТК 77', odometerKm:326810, fuelLiters:402, tankLiters:900, inspectedAt:'сегодня, 06:48', inspector:'Андрей Соколов', status:'attention', note:'Проверить давление задней оси после возвращения.', linkedTrip:'TR-0244' },
  { id:'tech-3', vehicleId:'veh-3', vehicle:'MAN TGS 18.400', regNumber:'С455ОР 62', odometerKm:242118, fuelLiters:615, tankLiters:760, inspectedAt:'сегодня, 08:15', inspector:'Мария Коваль', status:'ready', note:'Готов к выпуску.', linkedTrip:'TR-0246' },
  { id:'tech-4', vehicleId:'veh-5', vehicle:'КАМАЗ 65207', regNumber:'М821АР 77', odometerKm:208442, fuelLiters:188, tankLiters:500, inspectedAt:'вчера, 18:02', inspector:'Мария Коваль', status:'blocked', note:'Неисправность светового оборудования. Выпуск запрещён.' },
];

export const medicalChecks: MedicalCheckItem[] = [
  { id:'med-1', epdId:'epl-2341', documentNumber:'ЭПЛ №2341', tripId:'trip-248', tripNumber:'TR-0248', driver:'Иван Петров', vehicle:'КАМАЗ · А123ВС 77', plannedAt:'сегодня, 08:30', status:'awaiting' },
  { id:'med-2', epdId:'epl-2338', documentNumber:'ЭПЛ №2338', tripId:'trip-246', tripNumber:'TR-0246', driver:'Денис Савин', vehicle:'MAN TGS · С455ОР 62', plannedAt:'сегодня, 15:00', status:'awaiting' },
  { id:'med-3', epdId:'epl-2339', documentNumber:'ЭПЛ №2339', tripId:'trip-244', tripNumber:'TR-0244', driver:'Сергей Мельников', vehicle:'Volvo FH · Е901ТК 77', plannedAt:'сегодня, 07:10', status:'passed', checkedAt:'сегодня, 06:42', medicalWorker:'Елена Крылова' },
];

export const adminUsers: AdminUserItem[] = [
  { id:'user-1', name:'Александр Крылов', email:'a.krylov@tms.demo', role:'Руководитель', organization:'ООО «TMS Demo»', branch:'Москва', twoFactor:true, status:'active', lastSeen:'сейчас' },
  { id:'user-2', name:'Ольга Миронова', email:'o.mironova@tms.demo', role:'Бухгалтер', organization:'ООО «TMS Demo»', branch:'Москва', twoFactor:true, status:'active', lastSeen:'12 мин назад' },
  { id:'user-3', name:'Максим Ким', email:'m.kim@tms.demo', role:'Диспетчер / логист', organization:'ООО «TMS Demo»', branch:'Москва', twoFactor:false, status:'active', lastSeen:'3 мин назад' },
  { id:'user-4', name:'Андрей Соколов', email:'a.sokolov@tms.demo', role:'Механик', organization:'ООО «TMS Demo»', branch:'Москва', twoFactor:false, status:'active', lastSeen:'35 мин назад' },
  { id:'user-5', name:'Елена Крылова', email:'e.krylova@tms.demo', role:'Медработник', organization:'ООО «TMS Demo»', branch:'Москва', twoFactor:false, status:'active', lastSeen:'1 ч назад' },
  { id:'user-6', name:'Ирина Павлова', email:'i.pavlova@tms.demo', role:'Администратор', organization:'ООО «TMS Demo»', branch:'Все', twoFactor:true, status:'active', lastSeen:'5 мин назад' },
];

export const adminRoles: AdminRoleItem[] = [
  { id:'role-logistic', name:'Диспетчер / логист', users:4, scope:'Организация / филиал', description:'Рейсы, ЭПД, ЭДО и оперативные статусы в своей зоне ответственности.', permissions:['trips.read','trips.write','epd.write','edo.write'] , status:'system' },
  { id:'role-accounting', name:'Бухгалтер', users:2, scope:'Организация', description:'ЭДО, ГСМ, первичные документы, финансовые данные и экспорт.', permissions:['edo.write','fuel.read','finance.read','exports.create'], status:'system' },
  { id:'role-executive', name:'Руководитель', users:2, scope:'Организация', description:'Аналитика, финансы, отчёты, риски и критические уведомления.', permissions:['analytics.read','finance.read','alerts.manage'], status:'system' },
  { id:'role-admin', name:'Администратор', users:1, scope:'Все организации', description:'Пользователи, роли, справочники, интеграции и безопасность.', permissions:['users.manage','roles.manage','integrations.manage','security.manage'], status:'system' },
  { id:'role-support', name:'Операционная поддержка', users:1, scope:'Только просмотр', description:'Диагностика очередей и просмотр журналов без изменения бизнес-данных.', permissions:['integrations.read','audit.read'], status:'custom' },
];

export const auditEvents: AuditEventItem[] = [
  { id:'audit-1', at:'сегодня, 10:42:18', actor:'service:saby-sync', action:'Получение статуса', object:'ЭТрН №8123', result:'success', ip:'10.18.4.21', details:'Внешний статус обновлён: принят.' },
  { id:'audit-2', at:'сегодня, 10:41:03', actor:'Максим Ким', action:'Отправка документа', object:'ЭПЛ №2339', result:'warning', ip:'10.18.2.44', details:'Saby вернул безопасную ошибку валидации.' },
  { id:'audit-3', at:'сегодня, 10:35:44', actor:'Ольга Миронова', action:'Подписание', object:'УПД №251', result:'success', ip:'10.18.1.92', details:'Подпись зарегистрирована, закрытый ключ не хранится в TMS.' },
  { id:'audit-4', at:'сегодня, 09:58:12', actor:'Ирина Павлова', action:'Изменение роли', object:'user-3 · Максим Ким', result:'success', ip:'10.18.1.18', details:'Добавлено право edo.write для филиала Москва.' },
  { id:'audit-5', at:'сегодня, 08:11:28', actor:'unknown', action:'Вход', object:'account:o.mironova', result:'denied', ip:'185.42.17.••', details:'Неуспешная попытка входа. Секретные данные не журналируются.' },
];

export const certificates: CertificateItem[] = [
  { id:'cert-1', owner:'ООО «TMS Demo» · генеральный директор', fingerprint:'A8:31:••:••:9F:22', scope:'УПД, акты, ЭПД', expiresAt:'18.11.2026', daysLeft:90, status:'valid' },
  { id:'cert-2', owner:'Ольга Миронова', fingerprint:'2C:90:••:••:11:B7', scope:'ЭДО', expiresAt:'19.09.2026', daysLeft:30, status:'expiring' },
  { id:'cert-3', owner:'ООО «TMS Demo» · транспорт', fingerprint:'D1:74:••:••:A0:4C', scope:'ЭПД', expiresAt:'03.10.2026', daysLeft:44, status:'valid' },
];

export const alertRules: AlertRuleItem[] = [
  { id:'alert-1', title:'Расход ГСМ выше нормы', module:'ГСМ', threshold:'> 15%', channels:['Интерфейс','Email'], enabled:true },
  { id:'alert-2', title:'Задержка рейса', module:'Рейсы', threshold:'> 30 мин', channels:['Интерфейс','Telegram'], enabled:true },
  { id:'alert-3', title:'ЭПД / ЭДО отклонён', module:'Документы', threshold:'событие', channels:['Интерфейс','Email'], enabled:true },
  { id:'alert-4', title:'Лимит пакета ЭПД', module:'ЭПД', threshold:'80% / 95%', channels:['Интерфейс','Email'], enabled:true },
  { id:'alert-5', title:'Низкая рентабельность', module:'Финансы', threshold:'< 18%', channels:['Интерфейс'], enabled:true },
];

export const epdTariff: EpdTariffInfo = { packageName:'Saby ЭПД · 5 000 документов', included:5000, used:3728, unitPrice:7.90, period:'август 2026', projected:4610 };
