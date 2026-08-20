import { useMemo, useState } from 'react';
import { FilterButton } from '../components/CommonActions';
import { PageHeader } from '../components/PageHeader';
import { SemanticStatusText } from '../components/StatusPill';
import { useAuditEvents } from '../api/queries';

export function AdminAuditPage(){
  const data=useAuditEvents().data??[];
  const [query,setQuery]=useState('');
  const q=query.trim().toLocaleLowerCase('ru');
  const visible=useMemo(()=>data.filter(x=>!q||`${x.actor} ${x.action} ${x.object} ${x.details} ${x.ip}`.toLocaleLowerCase('ru').includes(q)),[data,q]);
  return <div className="page"><PageHeader kicker="Безопасность" title="Журнал аудита" description="Read-only след критичных действий. Обычный пользователь не может редактировать или удалять записи."/>
    <div className="toolbar compact-toolbar"><label className="search-field"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Пользователь, объект или действие"/></label><FilterButton kind="audit"/></div>
    <div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--audit"><thead><tr><th>Дата и время</th><th>Пользователь / сервис</th><th>Действие</th><th>Объект</th><th>IP</th><th>Результат</th></tr></thead><tbody>{visible.map(x=><tr key={x.id}><td><span className="table-muted">{x.at}</span></td><td><strong className="table-main">{x.actor}</strong></td><td><span className="table-main">{x.action}</span></td><td><span className="table-main">{x.object}</span><small className="audit-detail">{x.details}</small></td><td><span className="table-muted">{x.ip}</span></td><td><SemanticStatusText label={x.result==='success'?'Успешно':x.result==='warning'?'С предупреждением':'Отказано'} tone={x.result==='success'?'success':x.result==='warning'?'warning':'danger'}/></td></tr>)}</tbody></table></div>
    <div className="mobile-card-list audit-mobile-list">{visible.map(x=><article className="mobile-entity-card" key={x.id}><div className="mobile-entity-card__head"><div><span>{x.at}</span><strong>{x.action}</strong></div><SemanticStatusText label={x.result==='success'?'Успешно':x.result==='warning'?'Проверить':'Отказано'} tone={x.result==='success'?'success':x.result==='warning'?'warning':'danger'}/></div><div className="mobile-entity-card__rows"><span><b>Кто</b><em>{x.actor}</em></span><span><b>Объект</b><em>{x.object}</em></span><span><b>IP</b><em>{x.ip}</em></span></div><p className="mobile-card-note">{x.details}</p></article>)}</div>
  </div>
}
