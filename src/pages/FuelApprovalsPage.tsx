import { Link } from 'react-router-dom';
import { useApproveFueling, useFuelings, useRejectFueling } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SimpleStatusPill } from '../components/StatusPill';
import { fuelAnomalyLabel, rub } from '../lib/fuel';

export function FuelApprovalsPage() {
  const { data: fuelings = [] } = useFuelings();
  const approve = useApproveFueling();
  const reject = useRejectFueling();
  const pending = fuelings.filter(item => item.status === 'pending_approval');
  return (
    <div className="page fuel-approvals-page">
      <PageHeader kicker="ГСМ · решения" title="Согласование заправок" description="Только записи, где автоматические проверки нашли отклонение и требуется решение ответственного." actions={<Link to="/fuel" className="btn btn--secondary">К реестру</Link>} />
      <section className="fuel-approval-grid">
        {pending.map(item => <article className="fuel-approval-card" key={item.id}>
          <div className="fuel-approval-card__top"><div><span className="eyebrow">{item.tripNumber}</span><h2>{item.number}</h2><p>{item.vehicle} · {item.driver}</p></div><SimpleStatusPill label="Нужно решение" tone="warning"/></div>
          <div className="fuel-approval-card__amount"><div><span>Литры</span><strong>{item.liters.toLocaleString('ru-RU')} л</strong></div><div><span>Цена / л</span><strong>{item.pricePerLiter.toLocaleString('ru-RU')} ₽</strong></div><div><span>Сумма</span><strong>{rub(item.amount)}</strong></div></div>
          <div className="fuel-approval-card__reason"><span className="fuel-approval-card__reason-icon"><Icon name="warning"/></span><div><strong>{item.anomalies.map(type => fuelAnomalyLabel[type]).join(' · ')}</strong><p>{item.comment || 'Проверьте первичный документ и данные заправки перед подтверждением.'}</p></div></div>
          <div className="fuel-approval-card__meta"><span><b>АЗС</b><em>{item.gasStation}</em></span><span><b>Чек</b><em>{item.receiptNumber}</em></span><span><b>Время</b><em>{item.dateTime}</em></span></div>
          <div className="fuel-approval-card__actions"><Link to={`/fuel/${item.id}`} className="btn btn--secondary">Открыть карточку</Link><button className="btn btn--secondary fuel-reject-btn" disabled={reject.isPending || approve.isPending} onClick={() => reject.mutate(item.id)}>Отклонить</button><button className="btn btn--primary" disabled={approve.isPending || reject.isPending} onClick={() => approve.mutate(item.id)}><Icon name="check"/>Подтвердить</button></div>
        </article>)}
      </section>
      {pending.length === 0 && <section className="panel fuel-empty-state"><span><Icon name="check"/></span><h2>Очередь согласования пуста</h2><p>Все заправки проверены. Новые записи с отклонениями появятся здесь автоматически.</p><Link to="/fuel" className="btn btn--secondary">Вернуться в реестр</Link></section>}
    </div>
  );
}
