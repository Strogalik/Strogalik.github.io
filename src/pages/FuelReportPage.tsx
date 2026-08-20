import { Link } from 'react-router-dom';
import { useFuelReport } from '../api/queries';
import { DistributionList } from '../components/DistributionList';
import { Icon } from '../components/Icon';
import { LineChart } from '../components/LineChart';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { FuelStatusText } from '../components/StatusPill';
import { rub } from '../lib/fuel';
import { DateRangeButton, ExportButton } from '../components/CommonActions';

export function FuelReportPage() {
  const { data } = useFuelReport();
  if (!data) return null;
  const totalVehicleAmount = data.byVehicle.reduce((sum,item)=>sum+item.amount,0);
  const distribution = data.byVehicle.slice(0,5).map((item,index)=>({ label:item.vehicle.split(' · ')[0], value:Math.round(item.amount/1000), total:Math.max(1,Math.round(totalVehicleAmount/1000)), tone:(['blue','powder','navy','green','gray'] as const)[index] }));
  return <div className="page report-detail-page fuel-report-page">
    <PageHeader kicker="Отчёты · ГСМ" title="Топливо и отклонения" description="Затраты, расход, цена и аномалии — с переходом к конкретной заправке и рейсу." actions={<div className="action-group"><DateRangeButton/><ExportButton/></div>} />
    <section className="metric-grid metric-grid--4"><MetricCard label="Объём" value={`${Math.round(data.liters).toLocaleString('ru-RU')} л`} meta="за период" icon="fuel"/><MetricCard label="Затраты" value={rub(data.cost)} meta={`${data.averagePrice.toFixed(1)} ₽ / л`} icon="wallet" tone="navy"/><MetricCard label="Расход" value={`${data.weightedConsumption.toFixed(1)} л`} meta={`норма ${data.weightedNorm.toFixed(1)} л / 100 км`} icon="chart"/><MetricCard label="Аномалии" value={String(data.anomalyCount)} meta={`${data.pendingCount} ждут решения`} icon="warning" tone="amber"/></section>
    <section className="report-two-col fuel-report-main"><article className="panel panel--chart"><div className="panel__header"><div><span className="eyebrow">Динамика</span><h2>Затраты на ГСМ</h2></div><span className="panel-meta">тыс. ₽</span></div><LineChart data={data.series} secondary={false} title="Затраты на ГСМ"/></article><article className="panel"><div className="panel__header"><div><span className="eyebrow">Структура</span><h2>По транспорту</h2></div></div><DistributionList items={distribution}/></article></section>
    <section className="panel"><div className="panel__header"><div><span className="eyebrow eyebrow--danger">Контроль</span><h2>Заправки, требующие внимания</h2></div><Link className="text-link" to="/fuel/anomalies">Все аномалии <Icon name="arrow"/></Link></div><div className="report-entity-list fuel-report-list">{data.anomalies.map(item=><Link to={`/fuel/${item.id}`} key={item.id}><div><strong>{item.number}</strong><span>{item.tripNumber} · {item.vehicle}</span></div><FuelStatusText status={item.status}/><div className="report-entity-list__meta"><span>Сумма</span><strong>{rub(item.amount)}</strong></div><div className="report-entity-list__meta"><span>Отклонение</span><strong className={item.variancePct>10?'text-danger':''}>{item.variancePct>0?'+':''}{item.variancePct.toLocaleString('ru-RU')}%</strong></div><Icon name="chevron"/></Link>)}</div></section>
  </div>;
}
