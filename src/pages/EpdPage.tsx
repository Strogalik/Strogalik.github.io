import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEpd } from '../api/queries';
import { FilterButton } from '../components/CommonActions';
import { DocStatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

type Tab='all'|'attention'|'signature'|'errors'|'archive';
export function EpdPage() {
  const { data = [] } = useEpd(); const [tab,setTab]=useState<Tab>('all'); const [query,setQuery]=useState(''); const q=query.trim().toLocaleLowerCase('ru');
  const visible=useMemo(()=>data.filter(doc=>{if(tab==='attention'&&!['error','rejected','awaiting_signature'].includes(doc.status))return false;if(tab==='signature'&&doc.status!=='awaiting_signature')return false;if(tab==='errors'&&doc.status!=='error')return false;if(tab==='archive')return false;return !q||`${doc.number} ${doc.tripNumber} ${doc.counterparty} ${doc.type}`.toLocaleLowerCase('ru').includes(q)}),[data,tab,q]);
  const attention=data.filter(x=>['error','rejected','awaiting_signature'].includes(x.status)).length, signatures=data.filter(x=>x.status==='awaiting_signature').length, errors=data.filter(x=>x.status==='error').length;
  const tabs:[Tab,string,number?][]=[['all','Все',data.length],['attention','Требуют внимания',attention],['signature','Ожидают подписи',signatures],['errors','Ошибки',errors],['archive','Архив']];
  return <div className="page"><PageHeader kicker="Перевозочные документы" title="ЭПД" description="ЭТрН, ЭПЛ и ЭЗЗ — от подготовки до статуса оператора." actions={<Link to="/epd/new" className="btn btn--primary"><Icon name="plus"/>Создать ЭПД</Link>} />
    <div className="segmented-tabs" data-no-history-swipe>{tabs.map(([id,label,count])=><button type="button" key={id} className={tab===id?'is-active':''} onClick={()=>setTab(id)}>{label}{count!==undefined&&<span>{count}</span>}</button>)}</div>
    <div className="toolbar toolbar--compact"><label className="search-field"><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Номер документа, рейс, контрагент…" /></label><FilterButton kind="epd"/></div>
    <div className="registry-card desktop-table-wrap" data-no-history-swipe><table className="data-table data-table--epd"><thead><tr><th>Документ</th><th>Рейс</th><th>Контрагент</th><th>Статус</th><th>Подпись</th><th>Saby</th><th>Создан</th><th></th></tr></thead><tbody>{visible.map(doc => <tr key={doc.id}><td><Link to={`/epd/${doc.id}`} className="entity-link"><strong>{doc.number}</strong><span>{doc.type}</span></Link></td><td><Link to={`/trips/${doc.tripId}`} className="inline-link">{doc.tripNumber}</Link></td><td><strong className="table-main">{doc.counterparty}</strong></td><td><DocStatusPill status={doc.status}/></td><td><span className="table-main">{doc.signature}</span></td><td><span className={doc.status==='error'?'text-danger':'table-main'}>{doc.saby}</span></td><td><span className="table-muted">{doc.createdAt}</span></td><td><Link to={`/epd/${doc.id}`} className="table-arrow"><Icon name="chevron"/></Link></td></tr>)}</tbody></table></div>
    <div className="mobile-card-list">{visible.map(doc => <Link to={`/epd/${doc.id}`} className="mobile-doc-card" key={doc.id}><div className="mobile-doc-card__head"><div className="doc-row__icon"><Icon name="file"/></div><div><span>{doc.type}</span><strong>{doc.number}</strong></div><DocStatusPill status={doc.status}/></div><div className="mobile-doc-card__body"><span><b>Рейс</b><em>{doc.tripNumber}</em></span><span><b>Контрагент</b><em>{doc.counterparty}</em></span><span><b>Saby</b><em>{doc.saby}</em></span></div><div className="mobile-doc-card__foot"><span>{doc.createdAt}</span><Icon name="chevron"/></div></Link>)}</div>
  </div>;
}
