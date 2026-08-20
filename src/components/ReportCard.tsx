import { Link } from 'react-router-dom';
import { Icon } from './Icon';

type ReportIcon = 'truck' | 'file' | 'folder' | 'wallet' | 'fuel' | 'user';

export function ReportCard({ to, icon, title, description, value, meta, tone = 'blue' }: { to:string; icon:ReportIcon; title:string; description:string; value:string; meta:string; tone?:'blue'|'green'|'navy'|'amber' }) {
  return (
    <Link to={to} className="report-card">
      <div className={`report-card__icon report-card__icon--${tone}`}><Icon name={icon}/></div>
      <div className="report-card__copy"><span className="eyebrow">Отчёт</span><h2>{title}</h2><p>{description}</p></div>
      <div className="report-card__metric"><strong>{value}</strong><span>{meta}</span></div>
      <div className="report-card__arrow"><Icon name="arrow"/></div>
    </Link>
  );
}
