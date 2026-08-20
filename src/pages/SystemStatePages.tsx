import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';

function SystemState({ kicker, title, description, primaryTo, primaryLabel, secondaryTo, secondaryLabel, icon }:{
  kicker:string; title:string; description:string; primaryTo:string; primaryLabel:string; secondaryTo?:string; secondaryLabel?:string; icon:'warning'|'shield'|'clock';
}){
  return <div className="system-state-page">
    <article className="panel system-state-card">
      <span className="system-state-card__icon"><Icon name={icon}/></span>
      <span className="eyebrow">{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="system-state-card__actions">
        <Link className="btn btn--primary" to={primaryTo}>{primaryLabel}</Link>
        {secondaryTo && secondaryLabel && <Link className="btn btn--ghost" to={secondaryTo}>{secondaryLabel}</Link>}
      </div>
    </article>
  </div>;
}

export function SessionExpiredPage(){
  return <SystemState kicker="Безопасность" title="Сессия завершена" description="Войдите снова, чтобы продолжить работу. Несохранённые серверные операции не подтверждаются без новой авторизации." primaryTo="/login" primaryLabel="Войти снова" icon="clock"/>;
}

export function AccessDeniedPage(){
  return <SystemState kicker="Доступ" title="Недостаточно прав" description="Этот раздел не входит в вашу текущую роль или организационную область. Если доступ нужен для работы, обратитесь к администратору." primaryTo="/dashboard" primaryLabel="На главную" secondaryTo="/workspace" secondaryLabel="Рабочие режимы" icon="shield"/>;
}

export function NotFoundPage(){
  return <SystemState kicker="Навигация" title="Страница не найдена" description="Ссылка могла измениться или объект больше недоступен. Вернитесь в рабочий контур и продолжите оттуда." primaryTo="/dashboard" primaryLabel="На главную" secondaryTo="/workspace" secondaryLabel="Рабочие режимы" icon="warning"/>;
}
