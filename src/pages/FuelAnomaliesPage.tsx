import { Link } from 'react-router-dom';
import { useFuelings } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { FuelStatusText, SemanticStatusText } from '../components/StatusPill';
import { fuelAnomalyLabel, rub } from '../lib/fuel';

const descriptions = {
  duplicate:'Повторная заправка того же ТС в коротком интервале. Проверьте, не создана ли запись дважды.',
  price:'Цена за литр заметно выше контрольного уровня. Нужна проверка чека и АЗС.',
  tank:'Введённый объём конфликтует с вместимостью бака или расчётным остатком топлива.',
  odometer:'Показание одометра расходится с последней зафиксированной точкой.',
  norm:'Фактический расход топлива выше нормы ТС и требует объяснения.',
} as const;

export function FuelAnomaliesPage() {
  const { data: fuelings = [] } = useFuelings();
  const anomalies = fuelings.filter(item => item.anomalies.length);
  return (
    <div className="page fuel-anomalies-page">
      <PageHeader kicker="ГСМ · контроль" title="Аномалии заправок" description="Сначала самые рискованные отклонения: система показывает причину и сразу ведёт к конкретной записи." actions={<Link to="/fuel" className="btn btn--secondary">К реестру</Link>} />
      <section className="fuel-anomaly-summary">
        <article><span>Всего отклонений</span><strong>{anomalies.reduce((sum,item)=>sum+item.anomalies.length,0)}</strong><small>по {anomalies.length} заправкам</small></article>
        <article><span>На согласовании</span><strong>{anomalies.filter(item=>item.status==='pending_approval').length}</strong><small>требуют решения</small></article>
        <article><span>Отклонено</span><strong>{anomalies.filter(item=>item.status==='rejected').length}</strong><small>не попадут в учёт</small></article>
      </section>
      <section className="fuel-anomaly-list">
        {anomalies.map(item => <Link to={`/fuel/${item.id}`} className="fuel-anomaly-row" key={item.id}>
          <span className="fuel-anomaly-row__icon"><Icon name="warning"/></span>
          <div className="fuel-anomaly-row__main"><div className="fuel-anomaly-row__title"><strong>{item.number}</strong><span>{item.tripNumber} · {item.vehicle}</span></div><div className="fuel-anomaly-row__flags">{item.anomalies.map(type => <SemanticStatusText key={type} label={fuelAnomalyLabel[type]} tone="warning"/>)}</div><p>{descriptions[item.anomalies[0]]}</p></div>
          <div className="fuel-anomaly-row__metrics"><span><b>Сумма</b><strong>{rub(item.amount)}</strong></span><span><b>Отклонение</b><strong className={item.variancePct > 10 ? 'text-danger' : ''}>{item.variancePct > 0 ? '+' : ''}{item.variancePct.toLocaleString('ru-RU')}%</strong></span></div>
          <div className="fuel-anomaly-row__status"><FuelStatusText status={item.status}/><span className="fuel-anomaly-row__time">{item.dateTime}</span></div><Icon name="chevron"/>
        </Link>)}
      </section>
    </div>
  );
}
