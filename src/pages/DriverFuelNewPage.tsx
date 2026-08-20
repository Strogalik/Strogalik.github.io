import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateFueling, useDriverProfile, useDriverTrips } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import type { FuelPaymentMethod } from '../data/types';

const fmt = (value:number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value);

export function DriverFuelNewPage() {
  const navigate = useNavigate();
  const create = useCreateFueling();
  const { data: profile } = useDriverProfile();
  const { data: trips = [] } = useDriverTrips();
  const trip = trips.find(item => item.status === 'in_transit' || item.status === 'assigned') ?? trips[0];
  const [liters, setLiters] = useState('');
  const [price, setPrice] = useState('');
  const [gasStation, setGasStation] = useState('');
  const [odometer, setOdometer] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [receiptFile, setReceiptFile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<FuelPaymentMethod>('fuel_card');
  const [comment, setComment] = useState('');
  const amount = useMemo(() => (Number(liters.replace(',', '.')) || 0) * (Number(price.replace(',', '.')) || 0), [liters, price]);
  const canSubmit = Boolean(trip && profile && Number(liters.replace(',', '.')) > 0 && Number(price.replace(',', '.')) > 0 && gasStation.trim() && Number(odometer) > 0);

  const submit = async () => {
    if (!canSubmit || !trip || !profile) return;
    const item = await create.mutateAsync({
      dateTime:'18 авг, сейчас', vehicle:profile.vehicle, driver:profile.name, fuelType:'ДТ', liters:Number(liters.replace(',', '.')), pricePerLiter:Number(price.replace(',', '.')),
      gasStation:gasStation.trim(), address:'Указано водителем', receiptNumber:receiptNumber.trim() || 'Без номера', receiptFile:receiptFile || 'driver-receipt.jpg', odometerKm:Number(odometer),
      tripId:trip.id, tripNumber:trip.number, paymentMethod, comment:comment.trim() || undefined,
    });
    navigate(`/fuel/${item.id}`);
  };

  return (
    <div className="page driver-page driver-fuel-new-page">
      <PageHeader kicker="Полевой режим · ГСМ" title="Добавить заправку" description="Сначала чек и основные данные. Остальное система свяжет с вашим текущим рейсом." actions={<Link to={trip ? `/driver/trips/${trip.id}` : '/driver'} className="btn btn--secondary">Отмена</Link>} />

      <section className="driver-fuel-form-layout">
        <div className="driver-fuel-form-main">
          <article className="panel driver-assigned-context"><div className="driver-assigned-context__icon"><Icon name="truck"/></div><div><span>Текущий рейс</span><strong>{trip?.number ?? 'Нет активного рейса'}</strong><small>{trip ? `${trip.origin} → ${trip.destination}` : 'Обратитесь к диспетчеру'}</small></div><div><span>ТС</span><strong>{profile?.vehicle ?? '—'}</strong></div></article>

          <article className="panel driver-receipt-upload">
            <div className="panel__header"><div><span className="eyebrow">Чек</span><h2>Добавьте фото</h2></div></div>
            <label className={`driver-camera-surface ${receiptFile ? 'has-file' : ''}`}><input type="file" accept="image/*,.pdf" capture="environment" onChange={event => setReceiptFile(event.target.files?.[0]?.name ?? '')}/><span><Icon name={receiptFile ? 'check' : 'receipt'}/></span><div><strong>{receiptFile || 'Сфотографировать чек'}</strong><small>{receiptFile ? 'Файл добавлен. Можно заменить.' : 'Камера, фото или файл PDF/JPG/PNG'}</small></div><Icon name="chevron"/></label>
          </article>

          <article className="panel driver-fuel-fields">
            <div className="panel__header"><div><span className="eyebrow">Заправка</span><h2>Основные данные</h2></div></div>
            <div className="driver-form-grid">
              <label><span>Литры *</span><input inputMode="decimal" value={liters} onChange={event => setLiters(event.target.value)} placeholder="Например, 240"/></label>
              <label><span>Цена за литр *</span><input inputMode="decimal" value={price} onChange={event => setPrice(event.target.value)} placeholder="Например, 64,90"/></label>
              <label className="driver-form-grid__wide"><span>АЗС *</span><input value={gasStation} onChange={event => setGasStation(event.target.value)} placeholder="Название или номер АЗС"/></label>
              <label><span>Одометр *</span><input inputMode="numeric" value={odometer} onChange={event => setOdometer(event.target.value)} placeholder="184320"/></label>
              <label><span>Номер чека</span><input value={receiptNumber} onChange={event => setReceiptNumber(event.target.value)} placeholder="ЧК-819402"/></label>
              <label><span>Способ оплаты</span><select value={paymentMethod} onChange={event => setPaymentMethod(event.target.value as FuelPaymentMethod)}><option value="fuel_card">Топливная карта</option><option value="corporate_card">Корпоративная карта</option><option value="cash">Наличные</option><option value="other">Иной</option></select></label>
              <label className="driver-form-grid__wide"><span>Комментарий</span><textarea value={comment} onChange={event => setComment(event.target.value)} rows={3} placeholder="Если есть важное пояснение"/></label>
            </div>
          </article>
        </div>

        <aside className="panel driver-fuel-summary-card">
          <span className="eyebrow">Проверка</span><h2>Перед отправкой</h2>
          <div className="driver-fuel-total"><span>Сумма</span><strong>{amount ? `${fmt(amount)} ₽` : '—'}</strong><small>{liters || '0'} л × {price || '0'} ₽</small></div>
          <div className="driver-fuel-summary-list"><span><b>Рейс</b><strong>{trip?.number ?? '—'}</strong></span><span><b>ТС</b><strong>{profile?.vehicle ?? '—'}</strong></span><span><b>Чек</b><strong>{receiptFile ? 'Добавлен' : 'Не добавлен'}</strong></span></div>
          <div className="driver-fuel-note"><Icon name="warning"/><span>После отправки система проверит дубль, цену, объём бака и отклонение расхода.</span></div>
          <button className="btn btn--primary btn--full" type="button" disabled={!canSubmit || create.isPending} onClick={submit}>{create.isPending ? 'Сохраняем…' : 'Сохранить заправку'}</button>
        </aside>
      </section>
      <div className="driver-mobile-submit"><button className="btn btn--primary btn--full" type="button" disabled={!canSubmit || create.isPending} onClick={submit}>{create.isPending ? 'Сохраняем…' : 'Сохранить заправку'}</button></div>
    </div>
  );
}
