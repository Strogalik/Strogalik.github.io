import { Icon } from './Icon';

export function MetricCard({ label, value, meta, icon, tone = 'blue' }: { label:string; value:string; meta?:string; icon:'truck'|'wallet'|'chart'|'file'|'folder'|'warning'|'check'|'fuel'|'receipt'|'route'; tone?:'blue'|'green'|'navy'|'amber' }) {
  return (
    <article className="metric-card">
      <div className={`metric-card__icon metric-card__icon--${tone}`}><Icon name={icon} /></div>
      <div className="metric-card__content">
        <span className="metric-card__label">{label}</span>
        <strong className="metric-card__value">{value}</strong>
        {meta && <span className="metric-card__meta">{meta}</span>}
      </div>
    </article>
  );
}
