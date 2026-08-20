import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEdo } from '../api/queries';
import { FilterButton } from '../components/CommonActions';
import { EdoStatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
const money = (value:number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits:0 }).format(value) + ' ₽';
type Tab='all'|'signature'|'approval'|'rejected'|'archive';
export function EdoPage() {
  const { data = [] } = useEdo(); const [tab,setTab]=useState<Tab>('all'); const [query,setQuery]=useState(''); const q=query.trim().toLocaleLowerCase('ru');
  const awaiting=data.filter(x=>x.status==='awaiting_signature').length, approval=data.filter(x=>x.status==='approval').length, rejected=data.filter(x=>x.status==='rejected').length;
  const visible=useMemo(()=>data.filter(doc=>{if(tab==='signature'&&doc.status!=='awaiting_signature')return false;if(tab==='approval'&&doc.status!=='approval')return false;if(tab==='rejected'&&doc.status!=='rejected')return false;if(tab==='archive')return false;return !q||`${doc.number} ${doc.tripNumber} ${doc.counterparty} ${doc.type}`.toLocaleLowerCase('ru').includes(q)}),[data,tab,q]);
  const tabs:[Tab,string,number?][]=[['all','Все',data.length],['signature','Ожидают подписи',awaiting],['approval','На согласовании',approval],['rejected','Отклонены',rejected],['archive','Архив']];
  return <div className="page"><PageHeader kicker="Документы с контрагентами" title="ЭДО" description="Входящие и исходящие документы, согласование, подпись и связь с рейсами." actions={<div className="header-action-group"><Link to="/edo/reconciliation" className="btn btn--ghost">Сопоставление</Link><Link to="/edo/new" className="btn btn--primary"><Icon name="plus"/>Создать документ</Link></div>} />
    <div className="segmented-tabs" data-no-history-swipe>{tabs.map(([id,label,count])=><button type="button" key={id} className={tab===id?'is-active':''} onClick={()=>setTab(id)}>{label}{count!==undefined&&<span>{count}</span>}</button>)}</div>
    <div className="toolbar toolbar--compact"><label className="search-field"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Номер, ИНН, контрагент, рейс…" /></label><FilterButton kind="edo"/></div>
    <div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--edo"><thead><tr><th>Документ</th><th>Рейс</th><th>Контрагент</th><th>Сумма</th><th>Статус</th><th>Согласование</th><th>Создан</th><th></th></tr></thead><tbody>{visible.map(doc => <tr key={doc.id}><td><Link to={`/edo/${doc.id}`} className="entity-link"><strong>{doc.number}</strong><span>{doc.type}</span></Link></td><td><Link to={`/trips/${doc.tripId}`} className="inline-link">{doc.tripNumber}</Link></td><td><strong className="table-main">{doc.counterparty}</strong></td><td><span className="table-main">{money(doc.amount)}</span></td><td><EdoStatusPill status={doc.status}/></td><td><span className="table-main">{doc.approval}</span></td><td><span className="table-muted">{doc.createdAt}</span></td><td><Link to={`/edo/${doc.id}`} className="table-arrow"><Icon name="chevron"/></Link></td></tr>)}</tbody></table></div>
    <div className="mobile-card-list">{visible.map(doc => <Link to={`/edo/${doc.id}`} className="mobile-doc-card" key={doc.id}><div className="mobile-doc-card__head"><div className="doc-row__icon"><Icon name="folder"/></div><div><span>{doc.type}</span><strong>{doc.number}</strong></div><EdoStatusPill status={doc.status}/></div><div className="mobile-doc-card__body"><span><b>Рейс</b><em>{doc.tripNumber}</em></span><span><b>Контрагент</b><em>{doc.counterparty}</em></span><span><b>Сумма</b><em>{money(doc.amount)}</em></span><span><b>Согласование</b><em>{doc.approval}</em></span></div><div className="mobile-doc-card__foot"><span>{doc.createdAt}</span><Icon name="chevron"/></div></Link>)}</div>
  </div>;
}
