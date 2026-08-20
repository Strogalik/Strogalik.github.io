import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
const modes=[
 {to:'/dashboard',icon:'dashboard' as const,title:'Основной контур',desc:'Руководитель, логист и бухгалтер: обзор, рейсы, ЭПД/ЭДО и отчёты по своим правам.',meta:'Офис'},
 {to:'/driver',icon:'truck' as const,title:'Водитель',desc:'Рейсы, свои документы и заправка с чеком.',meta:'Полевой режим'},
 {to:'/mechanic',icon:'wrench' as const,title:'Механик',desc:'ТС, одометр, топливо и технический контроль.',meta:'Выпуск на линию'},
 {to:'/medical',icon:'pulse' as const,title:'Медработник',desc:'Медицинские отметки в ЭПЛ перед выездом.',meta:'ЭПЛ'},
 {to:'/admin',icon:'settings' as const,title:'Администратор',desc:'Пользователи, роли, аудит, сертификаты и системные настройки.',meta:'Система'},
];
export function WorkspacesPage(){return <div className="page"><PageHeader kicker="Профиль и роли" title="Рабочие режимы" description="Один TMS, но разная плотность интерфейса под конкретную задачу и права пользователя."/><section className="directory-grid workspace-mode-grid">{modes.map(x=><Link className="directory-card" to={x.to} key={x.to}><span className="directory-card__icon"><Icon name={x.icon}/></span><div className="directory-card__copy"><span className="eyebrow">Роль</span><h2>{x.title}</h2><p>{x.desc}</p></div><div className="directory-card__metric"><strong>{x.meta}</strong><span>открыть</span></div><span className="directory-card__arrow"><Icon name="arrow"/></span></Link>)}</section></div>}
