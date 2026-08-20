import { Link } from 'react-router-dom';
import { useEpd } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { DocStatusPill } from '../components/StatusPill';

export function MedicalDocumentsPage() {
  const { data = [] } = useEpd();
  const docs = data.filter((doc) => doc.type === 'ЭПЛ');
  return <div className="page">
    <PageHeader kicker="Медицинский контур" title="ЭПЛ" description="Путевые листы, где требуется или уже зафиксирована медицинская отметка." actions={<Link to="/medical" className="btn btn--ghost"><Icon name="back"/>К осмотрам</Link>}/>
    <div className="registry-card desktop-table-wrap" data-no-history-swipe>
      <table className="data-table data-table--epd"><thead><tr><th>Документ</th><th>Рейс</th><th>Водитель</th><th>ТС</th><th>Статус</th><th></th></tr></thead><tbody>{docs.map(doc=><tr key={doc.id}><td><strong className="table-main">{doc.number}</strong><span className="table-muted">{doc.type}</span></td><td><span className="table-main">{doc.tripNumber}</span></td><td><span className="table-main">{doc.driver}</span></td><td><span className="table-main">{doc.vehicle}</span></td><td><DocStatusPill status={doc.status}/></td><td><Link className="table-arrow" to={`/medical/epl/${doc.id}`}><Icon name="chevron"/></Link></td></tr>)}</tbody></table>
    </div>
    <div className="mobile-card-list">{docs.map(doc=><Link className="mobile-doc-card" to={`/medical/epl/${doc.id}`} key={doc.id}><div className="mobile-doc-card__head"><div className="doc-row__icon"><Icon name="file"/></div><div><span>ЭПЛ · {doc.tripNumber}</span><strong>{doc.number}</strong></div><DocStatusPill status={doc.status}/></div><div className="mobile-doc-card__body"><span><b>Водитель</b><em>{doc.driver}</em></span><span><b>ТС</b><em>{doc.vehicle}</em></span><span><b>Saby</b><em>{doc.saby}</em></span></div><div className="mobile-doc-card__foot"><span>{doc.createdAt}</span><Icon name="chevron"/></div></Link>)}</div>
  </div>;
}
