import { useDriversReport } from '../api/queries';
import { Icon } from '../components/Icon';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { SimpleStatusPill } from '../components/StatusPill';
import { rub } from '../lib/fuel';
import { DateRangeButton } from '../components/CommonActions';

export function DriversReportPage() {
  const { data } = useDriversReport();
  if (!data) return null;
  return <div className="page report-detail-page drivers-report-page">
    <PageHeader kicker="Отчёты · водители" title="Эффективность водителей" description="Рейсы, пробег, ГСМ, отклонения и соблюдение сроков — без превращения рейтинга в непрозрачный балл." actions={<DateRangeButton/>} />
    <section className="metric-grid metric-grid--4"><MetricCard label="Водители" value={String(data.total)} meta="в выборке" icon="truck"/><MetricCard label="Средний рейтинг" value={`${data.averageRating}/100`} meta="настраиваемая формула" icon="chart"/><MetricCard label="Пробег" value={`${Math.round(data.totalMileage).toLocaleString('ru-RU')} км`} meta="по рейсам" icon="route"/><MetricCard label="ГСМ" value={`${Math.round(data.totalFuel).toLocaleString('ru-RU')} л`} meta="подтверждено и в работе" icon="fuel" tone="amber"/></section>
    <section className="panel drivers-ranking-panel"><div className="panel__header"><div><span className="eyebrow">Рейтинг</span><h2>Водители по эффективности</h2></div><span className="panel-meta">40% ГСМ · 30% сроки · 30% события</span></div><div className="drivers-ranking-list">{data.items.map((item,index)=><article className="driver-ranking-row" key={item.id}><span className="driver-ranking-row__place">{index+1}</span><div className="driver-ranking-row__identity"><strong>{item.name}</strong><span>{item.vehicle}</span></div><div className="driver-ranking-row__metric"><span>Рейсы</span><strong>{item.trips}</strong></div><div className="driver-ranking-row__metric"><span>Пробег</span><strong>{item.mileage.toLocaleString('ru-RU')} км</strong></div><div className="driver-ranking-row__metric"><span>ГСМ</span><strong>{rub(item.fuelCost)}</strong></div><div className="driver-ranking-row__metric"><span>Отклонение</span><strong className={item.maxVariance>10?'text-danger':''}>{item.maxVariance>0?'+':''}{item.maxVariance.toLocaleString('ru-RU')}%</strong></div><SimpleStatusPill label={`${item.rating}/100`} tone={item.rating>=90?'success':item.rating>=75?'warning':'danger'}/></article>)}</div></section>
  </div>;
}
