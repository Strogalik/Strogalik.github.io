import { Link, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SemanticStatusText } from '../components/StatusPill';
import { useMedicalCheck } from '../api/queries';
import { ConfirmActionButton } from '../components/CommonActions';

export function MedicalCheckPage(){
  const {documentId='epl-2341'}=useParams();
  const {data}=useMedicalCheck(documentId);
  if(!data)return <div className="page"><PageHeader title="Медосмотр"/></div>;
  const tone=data.status==='passed'?'success':data.status==='not_passed'?'danger':'warning';
  const label=data.status==='passed'?'Пройден':data.status==='not_passed'?'Не пройден':'Ожидает осмотра';
  return <div className="page"><PageHeader kicker="Медицинская отметка ЭПЛ" title={data.documentNumber} description={`${data.tripNumber} · выезд ${data.plannedAt}`} actions={<Link to="/medical" className="btn btn--ghost"><Icon name="back"/>К очереди</Link>}/><div className="medical-check-layout"><section className="panel medical-person"><div className="medical-person__icon"><Icon name="pulse"/></div><span className="eyebrow">Водитель</span><h2>{data.driver}</h2><p>{data.vehicle}</p><SemanticStatusText label={label} tone={tone}/><div className="detail-facts-grid detail-facts-grid--single"><span><b>Рейс</b><strong>{data.tripNumber}</strong></span><span><b>Плановый выезд</b><strong>{data.plannedAt}</strong></span>{data.checkedAt&&<span><b>Осмотр</b><strong>{data.checkedAt}</strong></span>}{data.medicalWorker&&<span><b>Медработник</b><strong>{data.medicalWorker}</strong></span>}</div></section><section className="panel medical-form"><span className="eyebrow">Новая отметка</span><h2>Результат осмотра</h2><div className="form-grid"><label><span>Дата и время</span><input type="datetime-local" defaultValue="2026-08-20T08:05"/></label><label><span>Комментарий</span><input placeholder="При необходимости"/></label></div><div className="medical-decision-grid"><ConfirmActionButton className="decision-button decision-button--success" icon="check" title="Допустить водителя?" description="Медицинская отметка будет зафиксирована в ЭПЛ. Юридически значимую подпись выполняет backend-сценарий." confirmLabel="Допустить"><span><b>Допустить</b><small>Медосмотр пройден</small></span></ConfirmActionButton><ConfirmActionButton className="decision-button decision-button--danger" icon="warning" title="Не допустить водителя?" description="ЭПЛ останется неготовым к выпуску. Причина должна быть сохранена в журнале действий." confirmLabel="Не допустить" danger><span><b>Не допустить</b><small>Нужна причина</small></span></ConfirmActionButton></div><p className="form-disclaimer">На frontend хранится только UI-состояние. Подписание и юридически значимая фиксация результата выполняются backend-сценарием.</p></section></div></div>;
}
