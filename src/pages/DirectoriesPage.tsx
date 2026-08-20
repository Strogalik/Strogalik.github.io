import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

const groups = [
  { to:'/directories/vehicles', icon:'truck' as const, title:'Транспорт', description:'Госномер, VIN, модель, грузоподъёмность, бак и нормы расхода.', meta:'5 ТС' },
  { to:'/directories/drivers', icon:'user' as const, title:'Водители', description:'Сотрудники, контакты, статус, привязанные ТС и готовность к ЭПД.', meta:'5 водителей' },
  { to:'/directories/counterparties', icon:'building' as const, title:'Контрагенты', description:'ИНН, КПП, адреса, договоры и состояние ЭДО.', meta:'5 контрагентов' },
  { to:'/directories/routes', icon:'route' as const, title:'Маршруты и точки', description:'Направления, расстояния, плановое время и точки маршрута.', meta:'5 маршрутов' },
  { to:'/directories/gas-stations', icon:'fuel' as const, title:'АЗС', description:'Сети, адреса, координаты и доступные виды топлива.', meta:'6 АЗС' },
  { to:'/directories/fuel-types', icon:'receipt' as const, title:'Типы топлива', description:'Управляемый список видов топлива для заправок, ТС и аналитики.', meta:'5 типов' },
  { to:'/directories/fuel-norms', icon:'chart' as const, title:'Нормы расхода', description:'Базовые нормы по ТС и коэффициенты условий эксплуатации.', meta:'5 норм' },
  { to:'/directories/cargo', icon:'package' as const, title:'Грузы и услуги', description:'Номенклатура груза и правила перевозки для рейсов и документов.', meta:'5 позиций' },
  { to:'/directories/document-templates', icon:'folder' as const, title:'Шаблоны документов', description:'Шаблоны ЭДО и связанные маршруты согласования.', meta:'4 шаблона' },
  { to:'/directories/approval-routes', icon:'route' as const, title:'Маршруты согласования', description:'Автор, согласующие, подписант и отправитель.', meta:'4 маршрута' },
  { to:'/directories/reasons', icon:'warning' as const, title:'Причины отклонений', description:'Простои, отмены, отклонения и ошибки для контроля и аналитики.', meta:'5 причин' },
];


export function DirectoriesPage() {
  return (
    <div className="page directories-page">
      <PageHeader kicker="Базовые сущности" title="Справочники" description="Единые данные, на которых строятся рейсы, документы, расчёты и интеграции." />
      <section className="directory-grid">
        {groups.map((item) => <Link to={item.to} className="directory-card" key={item.to}><span className="directory-card__icon"><Icon name={item.icon}/></span><div className="directory-card__copy"><span className="eyebrow">Справочник</span><h2>{item.title}</h2><p>{item.description}</p></div><div className="directory-card__metric"><strong>{item.meta}</strong><span>в системе</span></div><span className="directory-card__arrow"><Icon name="arrow"/></span></Link>)}
      </section>
    </div>
  );
}
