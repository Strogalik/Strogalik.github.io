import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGasStationDirectory } from '../api/queries';
import { Icon } from '../components/Icon';
import { SimpleStatusPill } from '../components/StatusPill';
import { MoreActionsButton } from '../components/CommonActions';

export function GasStationDetailsPage() {
  const { stationId = '' } = useParams();
  const navigate=useNavigate();
  const { data } = useGasStationDirectory(stationId);
  if (!data) return null;

  return (
    <div className="page fuel-directory-detail-page">
      <Link className="back-link" to="/directories/gas-stations">← АЗС</Link>
      <header className="detail-header">
        <div className="detail-header__title">
          <div className="page-kicker">Справочники · ГСМ</div>
          <div className="detail-title-line"><h1>{data.name}</h1><SimpleStatusPill label={data.status === 'active' ? 'Активна' : 'Неактивна'} tone={data.status === 'active' ? 'success' : 'neutral'}/></div>
          <p>{data.network} · {data.address}</p>
        </div>
        <div className="detail-header__actions"><MoreActionsButton title="Действия с АЗС" buttonLabel="Действия" actions={[{title:"Открыть реестр ГСМ",description:"Заправки и контроль",icon:"fuel",onClick:()=>navigate("/fuel")},{title:"Открыть аналитику ГСМ",description:"Расходы и отклонения",icon:"chart",onClick:()=>navigate("/reports/fuel")}]}/></div>
      </header>

      <section className="fuel-directory-detail-grid">
        <article className="panel gas-station-hero">
          <span className="gas-station-hero__icon"><Icon name="fuel"/></span>
          <div className="gas-station-hero__copy"><span className="eyebrow">Точка заправки</span><strong>{data.network}</strong><p>{data.address}</p></div>
          <div className="gas-station-hero__metric"><span>Связано заправок</span><strong>{data.linkedFuelings}</strong></div>
        </article>
        <article className="panel">
          <div className="panel__header"><div><span className="eyebrow">Реквизиты точки</span><h2>Адрес и координаты</h2></div></div>
          <div className="info-grid info-grid--doc fuel-directory-info-grid">
            <div><span>Сеть</span><strong>{data.network}</strong></div>
            <div><span>Статус</span><strong>{data.status === 'active' ? 'Используется в системе' : 'Не используется'}</strong></div>
            <div><span>Адрес</span><strong>{data.address}</strong></div>
            <div><span>Координаты</span><strong>{data.coordinates}</strong></div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel__header"><div><span className="eyebrow">Доступность</span><h2>Типы топлива</h2></div><span className="panel-meta">{data.fuelTypes.length} типа</span></div>
        <div className="fuel-type-chip-grid">{data.fuelTypes.map((fuel) => <div className="fuel-type-chip-card" key={fuel}><span className="fuel-type-chip-card__icon"><Icon name="fuel"/></span><div><strong>{fuel}</strong><span>Доступно на этой АЗС</span></div></div>)}</div>
      </section>

      <section className="panel directory-context-panel">
        <div><span className="eyebrow">Связность TMS</span><h2>АЗС используется в ГСМ-контуре</h2><p>Заправки сохраняют ссылку на точку, источник данных и историю изменений. На реальном backend эта карточка должна быть точкой перехода в связанные заправки и аналитику.</p></div>
        <Link className="btn btn--secondary" to="/fuel">Открыть ГСМ <Icon name="arrow"/></Link>
      </section>
    </div>
  );
}
