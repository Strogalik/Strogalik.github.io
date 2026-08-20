import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFueling } from '../api/queries';
import { FuelStatusPill, SimpleStatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { fuelAnomalyLabel, paymentLabel, rub, num } from '../lib/fuel';
import { MoreActionsButton } from '../components/CommonActions';
import { Overlay } from '../components/Overlay';

export function FuelDetailsPage() {
  const { fuelingId = '' } = useParams();
  const navigate=useNavigate();
  const { data } = useFueling(fuelingId);
  const [receiptOpen,setReceiptOpen]=useState(false);
  if (!data) return null;
  const varianceTone = data.variancePct > 10 ? 'danger' : data.variancePct > 5 ? 'warning' : 'success';
  return (
    <div className="page fuel-detail-page">
      <Link className="back-link" to="/fuel">← Заправки</Link>
      <header className="detail-header fuel-detail-header">
        <div className="detail-header__title"><div className="page-kicker">ГСМ · карточка заправки</div><div className="detail-title-line"><h1>{data.number}</h1><FuelStatusPill status={data.status}/></div><p>{data.dateTime} · {data.gasStation}</p></div>
        <div className="detail-header__actions"><button type="button" className="btn btn--secondary" onClick={()=>setReceiptOpen(true)}><Icon name="receipt"/>Чек</button><MoreActionsButton title="Действия с заправкой" buttonLabel="Действия" actions={[{title:"Открыть связанный рейс",description:data.tripNumber,icon:"truck",onClick:()=>navigate(`/trips/${data.tripId}`)},{title:"Открыть контроль ГСМ",description:"Аномалии и решения",icon:"warning",onClick:()=>navigate("/fuel/anomalies")}]}/></div>
      </header>

      {data.anomalies.length > 0 && <section className="fuel-warning-banner"><span className="fuel-warning-banner__icon"><Icon name="warning"/></span><div><span className="eyebrow eyebrow--danger">Требует внимания</span><h2>{data.anomalies.map(type => fuelAnomalyLabel[type]).join(' · ')}</h2><p>Запись сохранена, но перед передачей в учёт нужно проверить отклонение и подтвердить решение.</p></div>{data.status === 'pending_approval' && <Link to="/fuel/approvals" className="btn btn--secondary">Перейти к согласованию</Link>}</section>}

      <section className="fuel-hero-grid">
        <article className="panel fuel-amount-hero"><div className="fuel-amount-hero__icon"><Icon name="fuel"/></div><div><span>Заправлено</span><strong>{num(data.liters, 1)} л</strong><small>{data.fuelType} · {num(data.pricePerLiter, 2)} ₽ / л</small></div><div className="fuel-amount-hero__total"><span>Сумма</span><strong>{rub(data.amount)}</strong></div></article>
        <article className="panel fuel-control-card"><div className="panel__header"><div><span className="eyebrow">Расход</span><h2>Факт против нормы</h2></div><SimpleStatusPill label={`${data.variancePct > 0 ? '+' : ''}${num(data.variancePct,1)}%`} tone={varianceTone}/></div><div className="fuel-consumption-comparison"><div><span>Фактический</span><strong>{num(data.actualConsumption,1)}</strong><small>л / 100 км</small></div><i></i><div><span>Норма ТС</span><strong>{num(data.normConsumption,1)}</strong><small>л / 100 км</small></div></div></article>
      </section>

      <section className="fuel-detail-grid">
        <article className="panel"><div className="panel__header"><div><span className="eyebrow">Основное</span><h2>Данные заправки</h2></div></div><div className="info-grid info-grid--doc fuel-info-grid">
          <div><span>ТС</span><strong>{data.vehicle}</strong></div><div><span>Водитель</span><strong>{data.driver}</strong></div>
          <div><span>Рейс</span><Link to={`/trips/${data.tripId}`}>{data.tripNumber}</Link></div><div><span>Одометр</span><strong>{data.odometerKm.toLocaleString('ru-RU')} км</strong></div>
          <div><span>АЗС</span><strong>{data.gasStation}</strong></div><div><span>Адрес</span><strong>{data.address}</strong></div>
          <div><span>Способ оплаты</span><strong>{paymentLabel[data.paymentMethod]}</strong></div><div><span>Источник</span><strong>{data.source === 'fuel_card' ? 'Топливная система' : 'Ручной ввод'}</strong></div>
        </div></article>
        <article className="panel fuel-receipt-card"><div className="panel__header"><div><span className="eyebrow">Первичный документ</span><h2>Кассовый чек</h2></div><SimpleStatusPill label="Файл сохранён" tone="success"/></div><div className="receipt-preview"><div className="receipt-preview__paper"><Icon name="receipt"/><strong>{data.gasStation}</strong><span>Чек {data.receiptNumber}</span><i></i><span>{num(data.liters,1)} л × {num(data.pricePerLiter,2)} ₽</span><b>{rub(data.amount)}</b><small>{data.receiptFile}</small></div></div></article>
      </section>

      <section className="panel fuel-accounting-panel"><div className="panel__header"><div><span className="eyebrow">Учёт и интеграции</span><h2>Готовность к передаче</h2></div></div><div className="fuel-accounting-steps"><div className="is-done"><span><Icon name="check"/></span><div><strong>Запись сохранена</strong><small>Оригинал чека и данные зафиксированы</small></div></div><div className={data.status === 'confirmed' ? 'is-done' : 'is-waiting'}><span><Icon name={data.status === 'confirmed' ? 'check' : 'clock'}/></span><div><strong>{data.status === 'confirmed' ? 'Контроль пройден' : 'Ожидает согласования'}</strong><small>{data.status === 'confirmed' ? 'Критичных отклонений нет' : 'Перед выгрузкой нужно решение ответственного'}</small></div></div><div className={data.oneCStatus === 'exported' ? 'is-done' : 'is-waiting'}><span><Icon name={data.oneCStatus === 'exported' ? 'check' : 'link'}/></span><div><strong>{data.oneCStatus === 'exported' ? 'Передано в 1С' : data.oneCStatus === 'ready' ? 'Готово к 1С' : 'Передача заблокирована'}</strong><small>Связь с бухгалтерским учётом сохраняется в карточке</small></div></div></div></section>

      {data.comment && <section className="panel fuel-comment-panel"><span className="eyebrow">Комментарий</span><p>{data.comment}</p></section>}
      <Overlay open={receiptOpen} onClose={()=>setReceiptOpen(false)} title={`Чек ${data.receiptNumber}`} description={`${data.gasStation} · ${data.dateTime}`} kicker="Первичный документ" size="sm"><div className="receipt-modal-preview"><Icon name="receipt"/><strong>{data.receiptFile}</strong><span>{num(data.liters,1)} л · {rub(data.amount)}</span><small>В production файл будет загружаться по временной защищённой ссылке backend.</small></div></Overlay>
    </div>
  );
}
