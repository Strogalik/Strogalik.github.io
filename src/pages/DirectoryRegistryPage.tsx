import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useApprovalRoutesDirectory,
  useCargoDirectory,
  useCounterpartiesDirectory,
  useDocumentTemplatesDirectory,
  useDriversDirectory,
  useFuelNormsDirectory,
  useFuelTypesDirectory,
  useGasStationsDirectory,
  useReasonsDirectory,
  useRoutesDirectory,
  useVehiclesDirectory,
} from '../api/queries';
import { FilterButton } from '../components/CommonActions';
import { Icon } from '../components/Icon';
import { Overlay } from '../components/Overlay';
import { PageHeader } from '../components/PageHeader';
import { SimpleStatusPill } from '../components/StatusPill';
import type {
  ApprovalRouteDirectoryItem,
  CargoDirectoryItem,
  CounterpartyDirectoryItem,
  DocumentTemplateDirectoryItem,
  DriverDirectoryItem,
  FuelNormDirectoryItem,
  FuelTypeDirectoryItem,
  GasStationDirectoryItem,
  ReasonDirectoryItem,
  RouteDirectoryItem,
  VehicleDirectoryItem,
} from '../data/types';

const formatKg = (value:number) => `${new Intl.NumberFormat('ru-RU').format(value)} кг`;

export function DirectoryRegistryPage() {
  const { directoryId = 'vehicles' } = useParams();
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const { data: vehicles = [] } = useVehiclesDirectory();
  const { data: drivers = [] } = useDriversDirectory();
  const { data: counterparties = [] } = useCounterpartiesDirectory();
  const { data: routes = [] } = useRoutesDirectory();
  const { data: gasStations = [] } = useGasStationsDirectory();
  const { data: fuelTypes = [] } = useFuelTypesDirectory();
  const { data: fuelNorms = [] } = useFuelNormsDirectory();
  const { data: cargo = [] } = useCargoDirectory();
  const { data: approvalRoutes = [] } = useApprovalRoutesDirectory();
  const { data: reasons = [] } = useReasonsDirectory();
  const { data: templates = [] } = useDocumentTemplatesDirectory();
  const q = query.trim().toLocaleLowerCase('ru');

  const config = useMemo(() => {
    if (directoryId === 'drivers') return { kicker:'Команда', title:'Водители', description:'Контакты, рабочий статус, привязанные ТС и реквизиты для перевозочных документов.', placeholder:'ФИО, табельный номер, телефон…' };
    if (directoryId === 'counterparties') return { kicker:'Партнёры', title:'Контрагенты', description:'Юридические реквизиты, договоры и готовность к электронному документообороту.', placeholder:'Название, ИНН, КПП…' };
    if (directoryId === 'routes') return { kicker:'Логистика', title:'Маршруты и точки', description:'Основные направления, плановые расстояния, время и точки погрузки/разгрузки.', placeholder:'Город или название маршрута…' };
    if (directoryId === 'gas-stations') return { kicker:'ГСМ · инфраструктура', title:'АЗС', description:'Сети, адреса, координаты и доступные виды топлива для заправок и контроля.', placeholder:'АЗС, сеть или адрес…' };
    if (directoryId === 'fuel-types') return { kicker:'ГСМ · настройки', title:'Типы топлива', description:'Управляемый список видов топлива, который используется в ТС, заправках и отчётности.', placeholder:'Название или код топлива…' };
    if (directoryId === 'fuel-norms') return { kicker:'ГСМ · контроль', title:'Нормы расхода', description:'Базовые нормы по ТС и коэффициенты условий эксплуатации для контроля отклонений.', placeholder:'ТС, госномер или вид топлива…' };
    if (directoryId === 'cargo') return { kicker:'Номенклатура', title:'Грузы и услуги', description:'Повторно используемые позиции груза и правила перевозки для рейсов и документов.', placeholder:'Название, категория или условия…' };
    if (directoryId === 'approval-routes') return { kicker:'ЭДО · согласование', title:'Маршруты согласования', description:'Последовательность ролей для согласования, подписания и отправки документов.', placeholder:'Название маршрута или тип документа…' };
    if (directoryId === 'reasons') return { kicker:'Контроль', title:'Причины отклонений', description:'Причины простоев, отмен, отклонений и ошибок, используемые в журнале событий и аналитике.', placeholder:'Причина или категория…' };
    if (directoryId === 'document-templates') return { kicker:'ЭДО · шаблоны', title:'Шаблоны документов', description:'Управляемые шаблоны документов и связанные маршруты согласования.', placeholder:'Шаблон, тип или маршрут…' };
    return { kicker:'Автопарк', title:'Транспорт', description:'ТС, технические параметры и нормы, которые используются в рейсах и расчётах.', placeholder:'Госномер, VIN, модель…' };
  }, [directoryId]);

  return (
    <div className="page directory-registry-page">
      <PageHeader kicker={config.kicker} title={config.title} description={config.description} actions={<button type="button" className="btn btn--primary" onClick={()=>setAddOpen(true)}><Icon name="plus"/>Добавить</button>} />
      <div className="toolbar toolbar--compact"><label className="search-field"><Icon name="search"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={config.placeholder}/></label><FilterButton kind="directory"/></div>
      {directoryId === 'vehicles' && <VehiclesRegistry data={vehicles.filter((item) => !q || `${item.regNumber} ${item.vin} ${item.brandModel}`.toLocaleLowerCase('ru').includes(q))}/>} 
      {directoryId === 'drivers' && <DriversRegistry data={drivers.filter((item) => !q || `${item.name} ${item.personnelNumber} ${item.phone}`.toLocaleLowerCase('ru').includes(q))}/>} 
      {directoryId === 'counterparties' && <CounterpartiesRegistry data={counterparties.filter((item) => !q || `${item.name} ${item.inn} ${item.kpp}`.toLocaleLowerCase('ru').includes(q))}/>} 
      {directoryId === 'routes' && <RoutesRegistry data={routes.filter((item) => !q || `${item.name} ${item.origin} ${item.destination}`.toLocaleLowerCase('ru').includes(q))}/>} 
      {directoryId === 'gas-stations' && <GasStationsRegistry data={gasStations.filter((item) => !q || `${item.name} ${item.network} ${item.address} ${item.fuelTypes.join(' ')}`.toLocaleLowerCase('ru').includes(q))}/>} 
      {directoryId === 'fuel-types' && <FuelTypesRegistry data={fuelTypes.filter((item) => !q || `${item.name} ${item.code}`.toLocaleLowerCase('ru').includes(q))}/>} 
      {directoryId === 'fuel-norms' && <FuelNormsRegistry data={fuelNorms.filter((item) => !q || `${item.vehicle} ${item.fuelType}`.toLocaleLowerCase('ru').includes(q))}/>} 
      {directoryId === 'cargo' && <CargoRegistry data={cargo.filter((item) => !q || `${item.name} ${item.category} ${item.specialConditions}`.toLocaleLowerCase('ru').includes(q))}/>}
      {directoryId === 'approval-routes' && <ApprovalRoutesRegistry data={approvalRoutes.filter((item) => !q || `${item.name} ${item.documentType} ${item.organization}`.toLocaleLowerCase('ru').includes(q))}/>}
      {directoryId === 'reasons' && <ReasonsRegistry data={reasons.filter((item) => !q || `${item.label} ${item.category}`.toLocaleLowerCase('ru').includes(q))}/>}
      {directoryId === 'document-templates' && <TemplatesRegistry data={templates.filter((item) => !q || `${item.name} ${item.type} ${item.approvalRoute}`.toLocaleLowerCase('ru').includes(q))}/>}
      <Overlay open={addOpen} onClose={()=>setAddOpen(false)} title={`Добавить · ${config.title}`} description="Форма показывает минимальный frontend-контракт. Полный набор обязательных полей задаст API конкретного справочника." kicker="Новая запись" presentation="sheet" footer={<><button type="button" className="btn btn--ghost" onClick={()=>setAddOpen(false)}>Отмена</button><button type="button" className="btn btn--primary" onClick={()=>setAddOpen(false)}>Сохранить</button></>}>
        <div className="overlay-form-grid"><label className="is-full"><span>Название / идентификатор</span><input placeholder={config.placeholder}/></label><label><span>Статус</span><select defaultValue="Активно"><option>Активно</option><option>Черновик</option><option>Неактивно</option></select></label><label><span>Организация</span><select defaultValue="Основная организация"><option>Основная организация</option><option>Филиал · Москва</option><option>Филиал · Казань</option></select></label><label className="is-full"><span>Комментарий</span><textarea placeholder="Дополнительные сведения при необходимости"/></label></div>
      </Overlay>
    </div>
  );
}

function VehiclesRegistry({ data }: { data: VehicleDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--directory"><thead><tr><th>ТС</th><th>VIN</th><th>Тип</th><th>Грузоподъёмность</th><th>Топливо</th><th>Бак</th><th>Норма</th><th>Статус</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><strong className="table-main">{item.regNumber}</strong><span className="table-muted table-subline">{item.brandModel}</span></td><td><span className="table-muted">{item.vin}</span></td><td><span className="table-main">{item.type}</span></td><td><span className="table-main">{formatKg(item.capacityKg)}</span></td><td><span className="table-main">{item.fuelType}</span></td><td><span className="table-main">{item.tankLiters} л</span></td><td><span className="table-main">{item.consumptionNorm} л/100 км</span></td><td><SimpleStatusPill label={item.status === 'active' ? 'В работе' : item.status === 'service' ? 'ТО / сервис' : 'Неактивно'} tone={item.status === 'active' ? 'success' : item.status === 'service' ? 'warning' : 'neutral'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map((item) => <article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>{item.brandModel}</span><strong>{item.regNumber}</strong></div><SimpleStatusPill label={item.status === 'active' ? 'В работе' : item.status === 'service' ? 'ТО / сервис' : 'Неактивно'} tone={item.status === 'active' ? 'success' : item.status === 'service' ? 'warning' : 'neutral'}/></div><div className="mobile-entity-card__rows"><span><b>VIN</b><em>{item.vin}</em></span><span><b>Тип</b><em>{item.type}</em></span><span><b>Топливо</b><em>{item.fuelType} · {item.tankLiters} л</em></span><span><b>Норма</b><em>{item.consumptionNorm} л/100 км</em></span></div></article>)}</MobileEntityCards></>;
}

function DriversRegistry({ data }: { data: DriverDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--directory"><thead><tr><th>Водитель</th><th>Табельный №</th><th>Телефон</th><th>ТС</th><th>ЭПД</th><th>Статус</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><strong className="table-main">{item.name}</strong></td><td><span className="table-muted">{item.personnelNumber}</span></td><td><span className="table-main">{item.phone}</span></td><td><span className="table-main">{item.vehicle}</span></td><td><SimpleStatusPill label={item.epdReady ? 'Готов' : 'Нужно проверить'} tone={item.epdReady ? 'success' : 'warning'}/></td><td><SimpleStatusPill label={item.status === 'on_trip' ? 'В рейсе' : item.status === 'active' ? 'Доступен' : 'Неактивен'} tone={item.status === 'on_trip' ? 'info' : item.status === 'active' ? 'success' : 'neutral'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map((item) => <article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>{item.personnelNumber}</span><strong>{item.name}</strong></div><SimpleStatusPill label={item.status === 'on_trip' ? 'В рейсе' : item.status === 'active' ? 'Доступен' : 'Неактивен'} tone={item.status === 'on_trip' ? 'info' : item.status === 'active' ? 'success' : 'neutral'}/></div><div className="mobile-entity-card__rows"><span><b>Телефон</b><em>{item.phone}</em></span><span><b>ТС</b><em>{item.vehicle}</em></span><span><b>ЭПД</b><em>{item.epdReady ? 'Данные готовы' : 'Требует проверки'}</em></span></div></article>)}</MobileEntityCards></>;
}

function CounterpartiesRegistry({ data }: { data: CounterpartyDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--directory"><thead><tr><th>Контрагент</th><th>ИНН</th><th>КПП</th><th>Адрес</th><th>Договоры</th><th>ЭДО</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><strong className="table-main">{item.name}</strong></td><td><span className="table-main">{item.inn}</span></td><td><span className="table-main">{item.kpp}</span></td><td><span className="table-main directory-address">{item.address}</span></td><td><span className="table-main">{item.contracts}</span></td><td><SimpleStatusPill label={item.edoStatus === 'connected' ? 'Подключён' : item.edoStatus === 'roaming' ? 'Роуминг' : 'Проверить'} tone={item.edoStatus === 'connected' ? 'success' : item.edoStatus === 'roaming' ? 'info' : 'warning'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map((item) => <article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>ИНН {item.inn}</span><strong>{item.name}</strong></div><SimpleStatusPill label={item.edoStatus === 'connected' ? 'ЭДО' : item.edoStatus === 'roaming' ? 'Роуминг' : 'Проверить'} tone={item.edoStatus === 'connected' ? 'success' : item.edoStatus === 'roaming' ? 'info' : 'warning'}/></div><div className="mobile-entity-card__rows"><span><b>КПП</b><em>{item.kpp}</em></span><span><b>Адрес</b><em>{item.address}</em></span><span><b>Договоры</b><em>{item.contracts}</em></span></div></article>)}</MobileEntityCards></>;
}

function RoutesRegistry({ data }: { data: RouteDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--directory"><thead><tr><th>Маршрут</th><th>Откуда</th><th>Куда</th><th>Расстояние</th><th>Плановое время</th><th>Точки</th><th>Статус</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><strong className="table-main">{item.name}</strong></td><td><span className="table-main">{item.origin}</span></td><td><span className="table-main">{item.destination}</span></td><td><span className="table-main">{item.distanceKm} км</span></td><td><span className="table-main">{item.plannedDuration}</span></td><td><span className="table-main">{item.points}</span></td><td><SimpleStatusPill label={item.status === 'active' ? 'Активен' : 'Черновик'} tone={item.status === 'active' ? 'success' : 'soft'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map((item) => <article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>{item.distanceKm} км · {item.points} точки</span><strong>{item.name}</strong></div><SimpleStatusPill label={item.status === 'active' ? 'Активен' : 'Черновик'} tone={item.status === 'active' ? 'success' : 'soft'}/></div><div className="mobile-entity-card__rows"><span><b>Откуда</b><em>{item.origin}</em></span><span><b>Куда</b><em>{item.destination}</em></span><span><b>Время</b><em>{item.plannedDuration}</em></span></div></article>)}</MobileEntityCards></>;
}

function GasStationsRegistry({ data }: { data: GasStationDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--directory data-table--gas-stations"><thead><tr><th>АЗС</th><th>Сеть</th><th>Адрес</th><th>Координаты</th><th>Топливо</th><th>Заправки</th><th>Статус</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><Link className="table-entity-link" to={`/directories/gas-stations/${item.id}`}>{item.name}</Link></td><td><span className="table-main">{item.network}</span></td><td><span className="table-main directory-address">{item.address}</span></td><td><span className="table-muted">{item.coordinates}</span></td><td><span className="fuel-type-list-inline">{item.fuelTypes.join(' · ')}</span></td><td><span className="table-main">{item.linkedFuelings}</span></td><td><SimpleStatusPill label={item.status === 'active' ? 'Активна' : 'Неактивна'} tone={item.status === 'active' ? 'success' : 'neutral'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map((item) => <Link className="mobile-entity-card mobile-entity-card--link" to={`/directories/gas-stations/${item.id}`} key={item.id}><div className="mobile-entity-card__head"><div><span>{item.network}</span><strong>{item.name}</strong></div><SimpleStatusPill label={item.status === 'active' ? 'Активна' : 'Неактивна'} tone={item.status === 'active' ? 'success' : 'neutral'}/></div><div className="mobile-entity-card__rows"><span><b>Адрес</b><em>{item.address}</em></span><span><b>Топливо</b><em>{item.fuelTypes.join(' · ')}</em></span><span><b>Заправки</b><em>{item.linkedFuelings}</em></span></div><span className="mobile-entity-card__open">Открыть <Icon name="chevron"/></span></Link>)}</MobileEntityCards></>;
}

function FuelTypesRegistry({ data }: { data: FuelTypeDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--directory data-table--fuel-types"><thead><tr><th>Тип топлива</th><th>Код</th><th>Единица</th><th>АЗС</th><th>Статус</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><strong className="table-main">{item.name}</strong></td><td><span className="directory-code">{item.code}</span></td><td><span className="table-main">{item.unit}</span></td><td><span className="table-main">{item.stationCount}</span></td><td><SimpleStatusPill label={item.status === 'active' ? 'Используется' : 'Отключён'} tone={item.status === 'active' ? 'success' : 'neutral'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map((item) => <article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>{item.code}</span><strong>{item.name}</strong></div><SimpleStatusPill label={item.status === 'active' ? 'Активен' : 'Отключён'} tone={item.status === 'active' ? 'success' : 'neutral'}/></div><div className="mobile-entity-card__rows"><span><b>Единица</b><em>{item.unit}</em></span><span><b>Доступен на АЗС</b><em>{item.stationCount}</em></span></div></article>)}</MobileEntityCards></>;
}

function FuelNormsRegistry({ data }: { data: FuelNormDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--directory data-table--fuel-norms"><thead><tr><th>ТС</th><th>Топливо</th><th>Базовая норма</th><th>Коэффициенты</th><th>Действует с</th><th>Статус</th></tr></thead><tbody>{data.map((item) => <tr key={item.id}><td><Link className="table-entity-link" to={`/directories/fuel-norms/${item.id}`}>{item.vehicle}</Link></td><td><span className="table-main">{item.fuelType}</span></td><td><strong className="table-main">{item.baseNorm.toLocaleString('ru-RU')} л / 100 км</strong></td><td><span className="table-main">{item.coefficients.length}</span></td><td><span className="table-muted">{item.effectiveFrom}</span></td><td><SimpleStatusPill label={item.status === 'active' ? 'Действует' : 'Черновик'} tone={item.status === 'active' ? 'success' : 'soft'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map((item) => <Link className="mobile-entity-card mobile-entity-card--link" to={`/directories/fuel-norms/${item.id}`} key={item.id}><div className="mobile-entity-card__head"><div><span>{item.fuelType} · с {item.effectiveFrom}</span><strong>{item.vehicle}</strong></div><SimpleStatusPill label={item.status === 'active' ? 'Действует' : 'Черновик'} tone={item.status === 'active' ? 'success' : 'soft'}/></div><div className="fuel-norm-mobile-value"><span>Базовая норма</span><strong>{item.baseNorm.toLocaleString('ru-RU')} <small>л / 100 км</small></strong></div><div className="mobile-entity-card__rows"><span><b>Коэффициенты</b><em>{item.coefficients.length}</em></span></div><span className="mobile-entity-card__open">Открыть <Icon name="chevron"/></span></Link>)}</MobileEntityCards></>;
}


function CargoRegistry({ data }: { data: CargoDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap"><table className="data-table data-table--directory"><thead><tr><th>Позиция</th><th>Категория</th><th>Единица</th><th>Особые условия</th><th>Статус</th></tr></thead><tbody>{data.map(item=><tr key={item.id}><td><strong className="table-main">{item.name}</strong></td><td><span className="table-main">{item.category}</span></td><td><span className="table-main">{item.unit}</span></td><td><span className="table-main directory-address">{item.specialConditions}</span></td><td><SimpleStatusPill label={item.status==='active'?'Используется':'Неактивно'} tone={item.status==='active'?'success':'neutral'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map(item=><article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>{item.category}</span><strong>{item.name}</strong></div><SimpleStatusPill label={item.status==='active'?'Активно':'Неактивно'} tone={item.status==='active'?'success':'neutral'}/></div><div className="mobile-entity-card__rows"><span><b>Единица</b><em>{item.unit}</em></span><span><b>Условия</b><em>{item.specialConditions}</em></span></div></article>)}</MobileEntityCards></>;
}
function ApprovalRoutesRegistry({ data }: { data: ApprovalRouteDirectoryItem[] }) {
  return <><div className="registry-card desktop-table-wrap"><table className="data-table data-table--directory"><thead><tr><th>Маршрут</th><th>Документ</th><th>Организация</th><th>Шаги</th><th>Статус</th></tr></thead><tbody>{data.map(item=><tr key={item.id}><td><strong className="table-main">{item.name}</strong></td><td><span className="table-main">{item.documentType}</span></td><td><span className="table-main">{item.organization}</span></td><td><span className="table-main">{item.steps.join(' → ')}</span></td><td><SimpleStatusPill label={item.status==='active'?'Активен':'Черновик'} tone={item.status==='active'?'success':'soft'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map(item=><article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>{item.documentType}</span><strong>{item.name}</strong></div><SimpleStatusPill label={item.status==='active'?'Активен':'Черновик'} tone={item.status==='active'?'success':'soft'}/></div><div className="mobile-entity-card__rows"><span><b>Организация</b><em>{item.organization}</em></span><span><b>Шаги</b><em>{item.steps.join(' → ')}</em></span></div></article>)}</MobileEntityCards></>;
}
function ReasonsRegistry({ data }: { data: ReasonDirectoryItem[] }) { const labels={idle:'Простой',cancel:'Отмена',deviation:'Отклонение',error:'Ошибка'}; return <><div className="registry-card desktop-table-wrap"><table className="data-table data-table--directory"><thead><tr><th>Причина</th><th>Категория</th><th>Комментарий</th><th>Статус</th></tr></thead><tbody>{data.map(item=><tr key={item.id}><td><strong className="table-main">{item.label}</strong></td><td><span className="table-main">{labels[item.category]}</span></td><td><span className="table-main">{item.requiresComment?'Обязателен':'Не обязателен'}</span></td><td><SimpleStatusPill label={item.status==='active'?'Активна':'Отключена'} tone={item.status==='active'?'success':'neutral'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map(item=><article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>{labels[item.category]}</span><strong>{item.label}</strong></div><SimpleStatusPill label={item.status==='active'?'Активна':'Отключена'} tone={item.status==='active'?'success':'neutral'}/></div><div className="mobile-entity-card__rows"><span><b>Комментарий</b><em>{item.requiresComment?'Обязателен':'Не обязателен'}</em></span></div></article>)}</MobileEntityCards></>; }
function TemplatesRegistry({ data }: { data: DocumentTemplateDirectoryItem[] }) { return <><div className="registry-card desktop-table-wrap"><table className="data-table data-table--directory"><thead><tr><th>Шаблон</th><th>Тип</th><th>Маршрут согласования</th><th>Обновлён</th><th>Статус</th></tr></thead><tbody>{data.map(item=><tr key={item.id}><td><strong className="table-main">{item.name}</strong></td><td><span className="table-main">{item.type}</span></td><td><span className="table-main">{item.approvalRoute}</span></td><td><span className="table-muted">{item.updatedAt}</span></td><td><SimpleStatusPill label={item.status==='active'?'Активен':'Черновик'} tone={item.status==='active'?'success':'soft'}/></td></tr>)}</tbody></table></div><MobileEntityCards>{data.map(item=><article className="mobile-entity-card" key={item.id}><div className="mobile-entity-card__head"><div><span>{item.type}</span><strong>{item.name}</strong></div><SimpleStatusPill label={item.status==='active'?'Активен':'Черновик'} tone={item.status==='active'?'success':'soft'}/></div><div className="mobile-entity-card__rows"><span><b>Согласование</b><em>{item.approvalRoute}</em></span><span><b>Обновлён</b><em>{item.updatedAt}</em></span></div></article>)}</MobileEntityCards></>; }

function MobileEntityCards({ children }: { children: ReactNode }) {
  return <div className="mobile-card-list mobile-directory-list">{children}</div>;
}
