import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/tms-logo.svg';
import { Icon } from '../components/Icon';
import { ChoiceList, ChoiceRow, Overlay } from '../components/Overlay';

export function LoginPage(){
  const [ssoOpen,setSsoOpen]=useState(false);
  const [provider,setProvider]=useState('TMS Corporate SSO');
  return <main className="auth-page"><section className="auth-card"><div className="auth-brand"><img src={logo} alt="TMS"/><div><strong>TMS ASUB</strong><span>Логистика</span></div></div><div className="auth-copy"><span className="eyebrow">Вход в систему</span><h1>Рабочий контур перевозок</h1><p>Рейсы, документы, ГСМ и аналитика в одной системе.</p></div><form className="auth-form"><label><span>Логин или email</span><input autoComplete="username" defaultValue="a.krylov@tms.demo"/></label><label><span>Пароль</span><input type="password" autoComplete="current-password" defaultValue="demo-password"/></label><Link to="/auth/2fa" className="btn btn--primary auth-submit"><Icon name="arrow"/>Войти</Link><button className="btn btn--ghost" type="button" onClick={()=>setSsoOpen(true)}><Icon name="shield"/>Войти через корпоративный SSO</button></form><p className="auth-security">Секреты интеграций и КЭП никогда не хранятся во frontend.</p></section><aside className="auth-aside"><span className="eyebrow">Один бизнес. Одна система.</span><h2>Бизнес под контролем без постоянного контроля.</h2><div className="auth-feature-list"><span><Icon name="truck"/>Рейсы и транспорт</span><span><Icon name="file"/>ЭПД и ЭДО</span><span><Icon name="chart"/>Отчёты и риски</span></div></aside>
    <Overlay open={ssoOpen} onClose={()=>setSsoOpen(false)} title="Корпоративный SSO" description="Выберите доступный провайдер организации. Реальный redirect выполняет backend OIDC/SAML flow." kicker="Безопасный вход" size="sm" footer={<><button type="button" className="btn btn--ghost" onClick={()=>setSsoOpen(false)}>Отмена</button><Link to="/dashboard" className="btn btn--primary">Продолжить</Link></>}><ChoiceList>{['TMS Corporate SSO','Microsoft Entra ID'].map(item=><ChoiceRow key={item} label={item} selected={provider===item} onClick={()=>setProvider(item)}/>)}</ChoiceList></Overlay>
  </main>;
}
