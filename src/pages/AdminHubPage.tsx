import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
const cards=[
 {to:'/admin/users',icon:'users' as const,title:'Пользователи',desc:'Учётные записи, статус, 2FA и организационная область.',meta:'6 пользователей'},
 {to:'/admin/roles',icon:'shield' as const,title:'Роли и права',desc:'Разрешения по модулям, организациям, филиалам и объектам.',meta:'5 ролей'},
 {to:'/admin/audit',icon:'book' as const,title:'Аудит',desc:'Неизменяемый журнал критичных действий и интеграционных событий.',meta:'read-only'},
 {to:'/admin/certificates',icon:'key' as const,title:'Сертификаты',desc:'Владелец, срок действия, отпечаток и область применения без закрытых ключей.',meta:'3 сертификата'},
 {to:'/admin/alerts',icon:'bell' as const,title:'Алерты',desc:'Пороговые значения и каналы критических уведомлений.',meta:'5 правил'},
 {to:'/admin/epd-tariff',icon:'file' as const,title:'Тариф ЭПД',desc:'Использование пакета, прогноз и контроль порогов 80 / 95%.',meta:'74,6% пакета'},
 {to:'/admin/security',icon:'shield' as const,title:'Безопасность',desc:'2FA, SSO, session policy и принцип минимальных привилегий.',meta:'Политика доступа'},
];
export function AdminHubPage(){return <div className="page"><PageHeader kicker="Система" title="Администрирование" description="Настройки доступа, безопасности и системных правил. Секреты и закрытые ключи в frontend не отображаются."/><section className="directory-grid admin-grid">{cards.map(x=><Link className="directory-card" to={x.to} key={x.to}><span className="directory-card__icon"><Icon name={x.icon}/></span><div className="directory-card__copy"><span className="eyebrow">Настройка</span><h2>{x.title}</h2><p>{x.desc}</p></div><div className="directory-card__metric"><strong>{x.meta}</strong><span>в системе</span></div><span className="directory-card__arrow"><Icon name="arrow"/></span></Link>)}</section></div>}
