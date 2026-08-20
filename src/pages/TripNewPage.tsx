import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { useCounterpartiesDirectory, useDriversDirectory, useRoutesDirectory, useVehiclesDirectory } from '../api/queries';

export function TripNewPage() {
  const counterparties = useCounterpartiesDirectory().data ?? [];
  const drivers = useDriversDirectory().data ?? [];
  const vehicles = useVehiclesDirectory().data ?? [];
  const routes = useRoutesDirectory().data ?? [];
  const navigate=useNavigate(); const [saved,setSaved]=useState(false);
  return <div className="page form-page">
    <PageHeader kicker="Новый рейс" title="Создать рейс" description="Соберите перевозку один раз — эти данные дальше используются в ЭПД, ЭДО, ГСМ и отчётности." actions={<Link to="/trips" className="btn btn--ghost"><Icon name="back"/>К реестру</Link>}/>
    <div className="form-layout">
      <form className="panel structured-form" onSubmit={e=>e.preventDefault()}>
        <section className="form-section"><div className="form-section__head"><span>01</span><div><h2>Основное</h2><p>Заказчик, маршрут и плановое время.</p></div></div><div className="form-grid"><label><span>Заказчик</span><select defaultValue={counterparties[0]?.name}>{counterparties.map(x=><option key={x.id}>{x.name}</option>)}</select></label><label><span>Маршрут</span><select defaultValue={routes[0]?.name}>{routes.map(x=><option key={x.id}>{x.name}</option>)}</select></label><label><span>Плановая дата и время</span><input type="datetime-local" defaultValue="2026-08-20T09:30"/></label><label><span>Грузополучатель</span><input defaultValue="ООО «Волга Склад»"/></label></div></section>
        <section className="form-section"><div className="form-section__head"><span>02</span><div><h2>Транспорт и водитель</h2><p>Назначение можно изменить до выхода на линию.</p></div></div><div className="form-grid"><label><span>ТС</span><select>{vehicles.map(x=><option key={x.id}>{x.brandModel} · {x.regNumber}</option>)}</select></label><label><span>Водитель</span><select>{drivers.map(x=><option key={x.id}>{x.name}</option>)}</select></label><label><span>Прицеп</span><input placeholder="Не назначен"/></label><label><span>Плановый пробег, км</span><input type="number" defaultValue="824"/></label></div></section>
        <section className="form-section"><div className="form-section__head"><span>03</span><div><h2>Груз и финансы</h2><p>Минимум данных, необходимых для контроля рейса.</p></div></div><div className="form-grid"><label className="form-span-2"><span>Груз</span><input defaultValue="Строительные материалы"/></label><label><span>Вес, кг</span><input type="number" defaultValue="12400"/></label><label><span>Объём, м³</span><input type="number" defaultValue="28"/></label><label><span>Плановая выручка, ₽</span><input type="number" defaultValue="125000"/></label><label><span>Плановые затраты, ₽</span><input type="number" defaultValue="78000"/></label><label className="form-span-2"><span>Особые условия</span><textarea rows={3} placeholder="Крепление, температурный режим, контакт на точке…"/></label></div></section>
        <div className="form-actions"><button className="btn btn--ghost" type="button" onClick={()=>setSaved(true)}>{saved?'Черновик сохранён':'Сохранить черновик'}</button><button className="btn btn--primary" type="button" onClick={()=>navigate('/trips/trip-248')}><Icon name="check"/>Создать рейс</button></div>
      </form>
      <aside className="panel form-summary"><span className="eyebrow">После создания</span><h2>Единый контекст рейса</h2><div className="summary-flow"><span><Icon name="truck"/><b>Рейс</b></span><i>→</i><span><Icon name="file"/><b>ЭПД</b></span><i>→</i><span><Icon name="folder"/><b>ЭДО</b></span><i>→</i><span><Icon name="chart"/><b>Отчёты</b></span></div><p>Не дублируем данные в документах вручную: документные формы должны предзаполняться из рейса.</p></aside>
    </div>
  </div>;
}
