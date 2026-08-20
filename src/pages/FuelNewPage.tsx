import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFueling, useDriversDirectory, useTrips, useVehiclesDirectory } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { rub } from '../lib/fuel';
import type { FuelPaymentMethod } from '../data/types';

export function FuelNewPage() {
  const navigate = useNavigate();
  const createFueling = useCreateFueling();
  const { data: trips = [] } = useTrips();
  const { data: vehicles = [] } = useVehiclesDirectory();
  const { data: drivers = [] } = useDriversDirectory();
  const [receiptFile, setReceiptFile] = useState('');
  const [form, setForm] = useState({
    dateTime:'18 авг, 11:05', vehicle:'КАМАЗ 54901 · А123ВС 77', driver:'Иван Петров', fuelType:'ДТ', liters:'', pricePerLiter:'', gasStation:'', address:'', receiptNumber:'', odometerKm:'', tripId:'trip-248', paymentMethod:'fuel_card' as FuelPaymentMethod, comment:'',
  });

  const trip = trips.find(item => item.id === form.tripId);
  const vehicle = vehicles.find(item => form.vehicle.includes(item.regNumber));
  const liters = Number(form.liters.replace(',', '.')) || 0;
  const price = Number(form.pricePerLiter.replace(',', '.')) || 0;
  const amount = liters * price;
  const checks = useMemo(() => ({
    tank: Boolean(vehicle && liters > vehicle.tankLiters),
    price: price > 84,
    odometer: Boolean(form.odometerKm && Number(form.odometerKm) < 90000),
  }), [vehicle, liters, price, form.odometerKm]);
  const hasWarning = checks.tank || checks.price || checks.odometer;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm(current => ({ ...current, [key]:value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!liters || !price || !form.vehicle || !form.driver || !form.tripId) return;
    const item = await createFueling.mutateAsync({
      dateTime:form.dateTime, vehicle:form.vehicle, driver:form.driver, fuelType:form.fuelType, liters, pricePerLiter:price, gasStation:form.gasStation || 'АЗС не указана', address:form.address || 'Адрес не указан', receiptNumber:form.receiptNumber || 'Без номера', receiptFile:receiptFile || 'receipt-upload.jpg', odometerKm:Number(form.odometerKm) || 0, tripId:form.tripId, tripNumber:trip?.number || '—', paymentMethod:form.paymentMethod, comment:form.comment,
    });
    navigate(`/fuel/${item.id}`);
  };

  return (
    <div className="page fuel-new-page">
      <PageHeader kicker="ГСМ · новая запись" title="Добавить заправку" description="Сначала обязательные данные, затем чек и дополнительные сведения. Сумма и базовые проверки считаются сразу." />
      <form className="fuel-form-layout" onSubmit={submit}>
        <div className="fuel-form-main">
          <section className="panel fuel-form-section">
            <div className="panel__header"><div><span className="eyebrow">01</span><h2>Основные данные</h2></div><span className="panel-meta">обязательные поля</span></div>
            <div className="fuel-form-grid">
              <label className="form-field"><span>Дата и время</span><input value={form.dateTime} onChange={e=>set('dateTime',e.target.value)} required/></label>
              <label className="form-field"><span>Рейс</span><select value={form.tripId} onChange={e=>set('tripId',e.target.value)}>{trips.filter(item=>item.status!=='cancelled').map(item=><option key={item.id} value={item.id}>{item.number} · {item.origin} → {item.destination}</option>)}</select></label>
              <label className="form-field"><span>ТС</span><select value={form.vehicle} onChange={e=>set('vehicle',e.target.value)}>{vehicles.map(item=><option key={item.id}>{item.brandModel} · {item.regNumber}</option>)}</select></label>
              <label className="form-field"><span>Водитель</span><select value={form.driver} onChange={e=>set('driver',e.target.value)}>{drivers.filter(item=>item.status!=='inactive').map(item=><option key={item.id}>{item.name}</option>)}</select></label>
              <label className="form-field"><span>Тип топлива</span><select value={form.fuelType} onChange={e=>set('fuelType',e.target.value)}><option>ДТ</option><option>АИ-92</option><option>АИ-95</option><option>АИ-98</option><option>Газ</option></select></label>
              <label className="form-field"><span>Одометр, км</span><input inputMode="numeric" value={form.odometerKm} onChange={e=>set('odometerKm',e.target.value)} placeholder="184 320"/></label>
            </div>
          </section>

          <section className="panel fuel-form-section">
            <div className="panel__header"><div><span className="eyebrow">02</span><h2>Топливо и стоимость</h2></div></div>
            <div className="fuel-form-grid fuel-form-grid--money">
              <label className="form-field"><span>Объём, литры</span><div className="input-with-unit"><input inputMode="decimal" value={form.liters} onChange={e=>set('liters',e.target.value)} placeholder="0,00" required/><em>л</em></div></label>
              <label className="form-field"><span>Цена за литр</span><div className="input-with-unit"><input inputMode="decimal" value={form.pricePerLiter} onChange={e=>set('pricePerLiter',e.target.value)} placeholder="0,00" required/><em>₽</em></div></label>
              <div className="form-field form-field--calculated"><span>Сумма чека</span><strong>{amount ? rub(amount) : '—'}</strong><small>литры × цена за литр</small></div>
            </div>
            {hasWarning && <div className="fuel-form-warning"><Icon name="warning"/><div><strong>Есть данные, которые потребуют проверки</strong><ul>{checks.tank && <li>Объём больше вместимости бака выбранного ТС.</li>}{checks.price && <li>Цена выше контрольного порога — запись попадёт на согласование.</li>}{checks.odometer && <li>Показание одометра выглядит ниже ожидаемого диапазона.</li>}</ul></div></div>}
          </section>

          <section className="panel fuel-form-section">
            <div className="panel__header"><div><span className="eyebrow">03</span><h2>АЗС и чек</h2></div></div>
            <div className="fuel-form-grid">
              <label className="form-field"><span>АЗС / сеть</span><input value={form.gasStation} onChange={e=>set('gasStation',e.target.value)} placeholder="Газпромнефть №214"/></label>
              <label className="form-field"><span>Номер чека</span><input value={form.receiptNumber} onChange={e=>set('receiptNumber',e.target.value)} placeholder="ЧК-819402"/></label>
              <label className="form-field fuel-form-field--wide"><span>Адрес</span><input value={form.address} onChange={e=>set('address',e.target.value)} placeholder="Регион, трасса, км или адрес АЗС"/></label>
              <label className="receipt-upload fuel-form-field--wide"><input type="file" accept="image/*,.pdf" onChange={e=>setReceiptFile(e.target.files?.[0]?.name || '')}/><span className="receipt-upload__icon"><Icon name="receipt"/></span><div><strong>{receiptFile || 'Добавить фото или скан чека'}</strong><small>{receiptFile ? 'Файл выбран. Можно заменить перед сохранением.' : 'Фото с телефона или файл PDF/JPG/PNG'}</small></div><span className="btn btn--secondary">Выбрать файл</span></label>
            </div>
          </section>

          <section className="panel fuel-form-section">
            <div className="panel__header"><div><span className="eyebrow">04</span><h2>Оплата и комментарий</h2></div></div>
            <div className="fuel-form-grid">
              <label className="form-field"><span>Способ оплаты</span><select value={form.paymentMethod} onChange={e=>set('paymentMethod',e.target.value as FuelPaymentMethod)}><option value="fuel_card">Топливная карта</option><option value="corporate_card">Корпоративная карта</option><option value="cash">Наличные</option><option value="other">Иной способ</option></select></label>
              <label className="form-field fuel-form-field--wide"><span>Комментарий</span><textarea value={form.comment} onChange={e=>set('comment',e.target.value)} placeholder="Причина отклонения, уточнение по чеку или другая важная информация" rows={4}/></label>
            </div>
          </section>
        </div>

        <aside className="fuel-form-side">
          <section className="panel fuel-form-summary">
            <span className="eyebrow">Перед сохранением</span><h2>Проверка записи</h2>
            <div className="fuel-form-summary__amount"><span>Итого</span><strong>{amount ? rub(amount) : '—'}</strong><small>{liters ? `${liters.toLocaleString('ru-RU')} л` : 'Укажите объём'} {price ? `× ${price.toLocaleString('ru-RU')} ₽` : ''}</small></div>
            <div className="fuel-form-summary__rows"><span><b>Рейс</b><em>{trip?.number || '—'}</em></span><span><b>ТС</b><em>{form.vehicle || '—'}</em></span><span><b>Водитель</b><em>{form.driver || '—'}</em></span><span><b>Чек</b><em>{receiptFile || 'не приложен'}</em></span></div>
            <div className={`fuel-form-summary__status ${hasWarning ? 'has-warning' : ''}`}><Icon name={hasWarning ? 'warning' : 'check'}/><div><strong>{hasWarning ? 'Будет направлено на проверку' : 'Базовые проверки пройдены'}</strong><span>{hasWarning ? 'Сохранение доступно, но запись не уйдёт в 1С до решения.' : 'Дополнительная серверная валидация выполнится после сохранения.'}</span></div></div>
            <button className="btn btn--primary btn--full" type="submit" disabled={createFueling.isPending || !liters || !price}>{createFueling.isPending ? 'Сохраняем…' : 'Сохранить заправку'}</button>
            <button className="btn btn--secondary btn--full" type="button" onClick={()=>navigate('/fuel')}>Отмена</button>
          </section>
        </aside>
      </form>
      <div className="fuel-form-mobile-submit"><button className="btn btn--primary btn--full" type="button" disabled={createFueling.isPending || !liters || !price} onClick={() => document.querySelector<HTMLFormElement>('.fuel-form-layout')?.requestSubmit()}>{createFueling.isPending ? 'Сохраняем…' : `Сохранить${amount ? ` · ${rub(amount)}` : ''}`}</button></div>
    </div>
  );
}
