import { Link } from 'react-router-dom';
import { useFinanceReport } from '../api/queries';
import { Icon } from '../components/Icon';
import { LineChart } from '../components/LineChart';
import { MetricCard } from '../components/MetricCard';
import { PageHeader } from '../components/PageHeader';
import { DateRangeButton, ExportButton } from '../components/CommonActions';

const money = (value:number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits:0 }).format(value) + ' ₽';

export function FinanceReportPage() {
  const { data } = useFinanceReport();
  if (!data) return null;
  return (
    <div className="page">
      <PageHeader kicker="Отчёты · Финансы" title="Финансы и рентабельность" description="План, факт и проблемные рейсы — с переходом до первичного документа." actions={<div className="action-group"><DateRangeButton/><ExportButton/></div>} />
      <section className="metric-grid metric-grid--4"><MetricCard label="Выручка" value={money(data.revenue)} meta="+8,4% к прошлому периоду" icon="wallet"/><MetricCard label="Затраты" value={money(data.costs)} meta="65,8% от выручки" icon="chart" tone="navy"/><MetricCard label="Прибыль" value={money(data.profit)} meta="операционный результат" icon="wallet" tone="green"/><MetricCard label="Маржа, %" value={`${data.margin.toFixed(1)}%`} meta="цель ≥ 30%" icon="chart" tone="green"/></section>
      <section className="finance-report-grid"><article className="panel panel--chart"><div className="panel__header"><div><span className="eyebrow">Динамика</span><h2>Выручка и затраты</h2></div><div className="legend"><span><i className="legend__dot legend__dot--blue"/>Выручка</span><span><i className="legend__dot legend__dot--ice"/>Затраты</span></div></div><LineChart data={data.series} title="Выручка и затраты"/></article><article className="panel cost-structure"><div className="panel__header"><div><span className="eyebrow">Затраты</span><h2>Структура</h2></div></div><div className="cost-ring"><div><strong>315</strong><span>тыс. ₽</span></div></div><div className="cost-list"><div><i style={{background:'#0F52BA'}}/><span>ГСМ</span><strong>42%</strong></div><div><i style={{background:'#6A8CC8'}}/><span>Оплата водителям</span><strong>28%</strong></div><div><i style={{background:'#A6C5D7'}}/><span>Платные дороги</span><strong>16%</strong></div><div><i style={{background:'#D6E6F3'}}/><span>Прочее</span><strong>14%</strong></div></div></article></section>
      <section className="panel"><div className="panel__header"><div><span className="eyebrow eyebrow--danger">Риски</span><h2>Рейсы с низкой рентабельностью</h2></div><Link className="text-link" to="/trips">Все рейсы <Icon name="arrow"/></Link></div><div className="profitability-list">{data.items.filter(item=>item.margin<33).map(item=><Link to={`/trips/${item.id}`} key={item.id}><div><strong>{item.number}</strong><span>{item.origin} → {item.destination}</span></div><div><span>Выручка</span><strong>{money(item.revenue)}</strong></div><div><span>Затраты</span><strong>{money(item.costs)}</strong></div><div><span>Маржа</span><strong className={item.margin<25?'text-danger':'text-warning'}>{item.margin.toFixed(1)}%</strong></div><Icon name="chevron"/></Link>)}</div></section>
    </div>
  );
}
