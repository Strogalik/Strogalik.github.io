import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFuelNormDirectory } from '../api/queries';
import { Icon } from '../components/Icon';
import { SimpleStatusPill } from '../components/StatusPill';
import { MoreActionsButton } from '../components/CommonActions';

export function FuelNormDetailsPage() {
  const { normId = '' } = useParams();
  const navigate=useNavigate();
  const { data } = useFuelNormDirectory(normId);
  if (!data) return null;

  return (
    <div className="page fuel-directory-detail-page">
      <Link className="back-link" to="/directories/fuel-norms">← Нормы расхода</Link>
      <header className="detail-header">
        <div className="detail-header__title">
          <div className="page-kicker">Справочники · ГСМ</div>
          <div className="detail-title-line"><h1>Норма расхода</h1><SimpleStatusPill label={data.status === 'active' ? 'Действует' : 'Черновик'} tone={data.status === 'active' ? 'success' : 'soft'}/></div>
          <p>{data.vehicle}</p>
        </div>
        <div className="detail-header__actions"><MoreActionsButton title="Действия с нормой" buttonLabel="Действия" actions={[{title:"Открыть отклонения ГСМ",description:"Проверить применение нормы",icon:"warning",onClick:()=>navigate("/fuel/anomalies")},{title:"Открыть отчёт ГСМ",description:"Сравнить факт и норматив",icon:"chart",onClick:()=>navigate("/reports/fuel")}]}/></div>
      </header>

      <section className="fuel-norm-hero-grid">
        <article className="panel fuel-norm-hero">
          <span className="eyebrow">Базовая норма</span>
          <div className="fuel-norm-hero__value"><strong>{data.baseNorm.toLocaleString('ru-RU')}</strong><span>л / 100 км</span></div>
          <p>Основное значение для контроля фактического расхода по выбранному ТС.</p>
        </article>
        <article className="panel">
          <div className="panel__header"><div><span className="eyebrow">Параметры</span><h2>Связь с транспортом</h2></div></div>
          <div className="info-grid info-grid--doc fuel-directory-info-grid">
            <div><span>ТС</span><strong>{data.vehicle}</strong></div>
            <div><span>Топливо</span><strong>{data.fuelType}</strong></div>
            <div><span>Действует с</span><strong>{data.effectiveFrom}</strong></div>
            <div><span>Коэффициентов</span><strong>{data.coefficients.length}</strong></div>
          </div>
        </article>
      </section>

      <section className="panel fuel-coefficients-panel">
        <div className="panel__header"><div><span className="eyebrow">Условия эксплуатации</span><h2>Коэффициенты</h2></div><span className="panel-meta">Настраиваемые значения</span></div>
        <div className="fuel-coefficient-list">
          {data.coefficients.map((item) => <article className="fuel-coefficient-card" key={item.id}><div className="fuel-coefficient-card__head"><span className="fuel-coefficient-card__icon"><Icon name="chart"/></span><div><strong>{item.label}</strong><span>{item.description}</span></div><em>+{item.valuePct}%</em></div></article>)}
        </div>
      </section>

      <section className="panel directory-context-panel">
        <div><span className="eyebrow">Контроль ГСМ</span><h2>Норма участвует в проверках заправок</h2><p>Frontend показывает базовое значение и коэффициенты раздельно. Итоговый норматив и правила применения должен подтверждать backend, чтобы расчёт не расходился между реестром, отчётами и карточкой рейса.</p></div>
        <Link className="btn btn--secondary" to="/fuel/anomalies">Открыть отклонения <Icon name="arrow"/></Link>
      </section>
    </div>
  );
}
