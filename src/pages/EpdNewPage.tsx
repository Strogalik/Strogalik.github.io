import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { useTrips } from '../api/queries';

export function EpdNewPage(){
 const trips=useTrips().data??[]; const navigate=useNavigate();
 return <div className="page form-page"><PageHeader kicker="Перевозочный документ" title="Создать ЭПД" description="Предпочтительно создавать документ из рейса — система уже знает транспорт, водителя, маршрут и груз." actions={<Link to="/epd" className="btn btn--ghost"><Icon name="back"/>К ЭПД</Link>}/>
 <section className="create-choice-grid"><article className="panel create-choice is-primary"><div className="create-choice__icon"><Icon name="route"/></div><span className="eyebrow">Рекомендуется</span><h2>Из рейса</h2><p>Предзаполним ТС, водителя, стороны, груз, маршрут и даты.</p><label><span>Рейс</span><select>{trips.map(t=><option key={t.id}>{t.number} · {t.origin} → {t.destination}</option>)}</select></label><div className="choice-docs"><label><input type="radio" name="epd-type" defaultChecked/> ЭПЛ</label><label><input type="radio" name="epd-type"/> ЭТрН</label><label><input type="radio" name="epd-type"/> ЭЗЗ</label></div><button type="button" className="btn btn--primary" onClick={()=>navigate('/epd/epl-2341')}><Icon name="plus"/>Создать из рейса</button></article>
 <article className="panel create-choice"><div className="create-choice__icon"><Icon name="file"/></div><span className="eyebrow">Ручной сценарий</span><h2>Вручную</h2><p>Используйте только когда документ ещё не связан с рейсом. Связь можно добавить позже.</p><div className="info-note"><Icon name="warning"/><span>Перед отправкой система всё равно проверит обязательные реквизиты и подписанта.</span></div><button type="button" className="btn btn--ghost" onClick={()=>navigate('/epd/epl-2338')}><Icon name="plus"/>Пустой документ</button></article></section></div>;
}
