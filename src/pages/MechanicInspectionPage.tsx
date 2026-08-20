import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SemanticStatusText } from '../components/StatusPill';
import { useTechnicalInspection } from '../api/queries';
import { ConfirmActionButton } from '../components/CommonActions';

export function MechanicInspectionPage(){
  const {inspectionId='tech-1'}=useParams();
  const {data}=useTechnicalInspection(inspectionId);
  if(!data)return <div className="page"><PageHeader title="Технический контроль"/></div>;
  const tone=data.status==='ready'?'success':data.status==='attention'?'warning':'danger';
  const label=data.status==='ready'?'Готов к выпуску':data.status==='attention'?'Есть замечание':'Выпуск запрещён';
  const fuelPct=Math.round((data.fuelLiters/data.tankLiters)*100);
  return <div className="page"><PageHeader kicker="ТС и выпуск" title={`${data.vehicle} · ${data.regNumber}`} description={data.linkedTrip?`Связанный рейс ${data.linkedTrip}`:'ТС сейчас не привязано к активному рейсу'} actions={<Link to="/mechanic" className="btn btn--ghost"><Icon name="back"/>К очереди</Link>}/><div className="detail-grid"><section className="panel detail-main"><div className="detail-hero"><div className="detail-hero__icon"><Icon name="truck"/></div><div><span className="eyebrow">Техническое состояние</span><h2>{data.regNumber}</h2><SemanticStatusText label={label} tone={tone}/></div></div><div className="detail-facts-grid"><span><b>Одометр</b><strong>{data.odometerKm.toLocaleString('ru-RU')} км</strong></span><span><b>Топливо</b><strong>{data.fuelLiters} л · {fuelPct}%</strong></span><span><b>Последний контроль</b><strong>{data.inspectedAt}</strong></span><span><b>Механик</b><strong>{data.inspector}</strong></span></div><div className="fuel-level" aria-label={`Уровень топлива ${fuelPct}%`}><span style={{width:`${fuelPct}%`}}/></div><article className={`inspection-note inspection-note--${tone}`}><Icon name={tone==='danger'?'warning':'wrench'}/><div><b>Комментарий</b><p>{data.note}</p></div></article></section><aside className="panel action-rail"><span className="eyebrow">Новая отметка</span><h2>Результат осмотра</h2><label><span>Одометр, км</span><input type="number" defaultValue={data.odometerKm}/></label><label><span>Остаток топлива, л</span><input type="number" defaultValue={data.fuelLiters}/></label><label><span>Комментарий</span><textarea rows={4} defaultValue={data.note}/></label><div className="action-stack"><ConfirmActionButton icon="check" title="Разрешить выпуск?" description="ТС будет отмечено как допущенное к выпуску. Backend должен повторно проверить права и сохранить неизменяемую историю действия." confirmLabel="Разрешить выпуск">Разрешить выпуск</ConfirmActionButton><ConfirmActionButton className="btn btn--danger" icon="warning" title="Запретить выпуск?" description="ТС будет заблокировано для выпуска до повторного технического контроля. Укажите причину в комментарии." confirmLabel="Запретить выпуск" danger>Запретить выпуск</ConfirmActionButton></div></aside></div></div>;
}
