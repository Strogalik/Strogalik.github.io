import { useEdo, useEpd, useFinanceReport, useFuelReport, useTrips } from '../api/queries';
import { PageHeader } from '../components/PageHeader';
import { ReportCard } from '../components/ReportCard';
import { Icon } from '../components/Icon';
import { DateRangeButton } from '../components/CommonActions';

const moneyShort = (value:number) => `${Math.round(value / 1000)} тыс. ₽`;

export function ReportsHubPage() {
  const { data: trips = [] } = useTrips();
  const { data: epd = [] } = useEpd();
  const { data: edo = [] } = useEdo();
  const { data: finance } = useFinanceReport();
  const { data: fuel } = useFuelReport();
  const delayed = trips.filter(item => item.risk === 'delay').length;
  const epdAttention = epd.filter(item => item.status === 'error' || item.status === 'awaiting_signature' || item.status === 'rejected').length;
  const edoAttention = edo.filter(item => item.status === 'awaiting_signature' || item.status === 'approval' || item.status === 'rejected').length;

  return (
    <div className="page reports-hub-page">
      <PageHeader kicker="Аналитика" title="Отчёты" description="Один центр для перевозок, документов и финансов — с переходом от показателя к конкретному рейсу или документу." actions={<DateRangeButton/>} />
      <section className="reports-grid">
        <ReportCard to="/reports/trips" icon="truck" title="Рейсы и транспорт" description="Статусы, выполнение, задержки и использование транспорта." value={`${trips.length} рейсов`} meta={delayed ? `${delayed} требует внимания` : 'без критических задержек'} />
        <ReportCard to="/reports/epd" icon="file" title="ЭПД" description="ЭПЛ, ЭТрН и ЭЗЗ: успешность, ошибки, подписи и Saby." value={`${epd.length} документов`} meta={`${epdAttention} требуют внимания`} tone="amber" />
        <ReportCard to="/reports/edo" icon="folder" title="ЭДО" description="Согласование, подписи, отказы и скорость документооборота." value={`${edo.length} документов`} meta={`${edoAttention} в работе`} tone="navy" />
        <ReportCard to="/reports/drivers" icon="user" title="Водители" description="Рейсы, пробег, ГСМ, сроки и рейтинг эффективности." value="Рейтинг" meta="по водителям" />
        <ReportCard to="/reports/fuel" icon="fuel" title="ГСМ" description="Объём, стоимость, расход, аномалии и отклонения от нормы." value={fuel ? `${Math.round(fuel.liters)} л` : '—'} meta={fuel ? `${fuel.anomalyCount} отклонения` : 'загрузка'} tone="amber" />
        <ReportCard to="/reports/finance" icon="wallet" title="Финансы" description="Выручка, затраты, прибыль, маржа и убыточные рейсы." value={finance ? moneyShort(finance.profit) : '—'} meta="операционная прибыль" tone="green" />
      </section>
      <section className="panel reports-principle-panel"><div className="reports-principle-icon"><Icon name="search"/></div><div><span className="eyebrow">Принцип TMS</span><h2>Не просто смотреть — сразу проваливаться в причину</h2><p>Любой риск или агрегат в отчётах должен вести к списку конкретных рейсов и документов. Отчёт — это рабочий инструмент, а не витрина графиков.</p></div></section>
    </div>
  );
}
