import { Link } from 'react-router-dom';
import { useDriverDocuments } from '../api/queries';
import { DocStatusPill } from '../components/StatusPill';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

export function DriverDocumentsPage() {
  const { data: documents = [] } = useDriverDocuments();
  return (
    <div className="page driver-page driver-documents-page">
      <PageHeader kicker="Полевой режим" title="Мои документы" description="Перевозочные документы, связанные с вашими рейсами." actions={<Link to="/driver" className="btn btn--secondary">Мой день</Link>} />

      <div className="driver-doc-summary"><article><span className="driver-doc-summary__icon"><Icon name="file"/></span><div><span>Всего</span><strong>{documents.length}</strong></div></article><article><span className="driver-doc-summary__icon is-warning"><Icon name="signature"/></span><div><span>Нужно действие</span><strong>{documents.filter(item => item.status === 'awaiting_signature' || item.status === 'error').length}</strong></div></article></div>

      <div className="registry-card desktop-table-wrap driver-doc-table" data-no-history-swipe><table className="data-table"><thead><tr><th>Документ</th><th>Рейс</th><th>Контрагент</th><th>Подпись</th><th>Saby</th><th>Статус</th><th></th></tr></thead><tbody>{documents.map(doc => <tr key={doc.id}><td><Link className="entity-link" to={`/epd/${doc.id}`}><strong>{doc.number}</strong><span>{doc.type} · {doc.createdAt}</span></Link></td><td><Link className="inline-link" to={`/driver/trips/${doc.tripId}`}>{doc.tripNumber}</Link></td><td><strong className="table-main">{doc.counterparty}</strong></td><td><span className="table-main">{doc.signature}</span></td><td><span className="table-main">{doc.saby}</span></td><td><DocStatusPill status={doc.status}/></td><td><Link to={`/epd/${doc.id}`} className="table-arrow"><Icon name="chevron"/></Link></td></tr>)}</tbody></table></div>

      <section className="mobile-card-list driver-document-cards">{documents.map(doc => <Link to={`/epd/${doc.id}`} className="driver-document-card" key={doc.id}>
        <div className="driver-document-card__head"><span className="driver-document-card__icon"><Icon name="file"/></span><div><span>{doc.type}</span><strong>{doc.number}</strong></div><DocStatusPill status={doc.status}/></div>
        <div className="driver-document-card__rows"><span><b>Рейс</b><strong>{doc.tripNumber}</strong></span><span><b>Контрагент</b><strong>{doc.counterparty}</strong></span><span><b>Подпись</b><strong>{doc.signature}</strong></span><span><b>Saby</b><strong>{doc.saby}</strong></span></div>
        <div className="driver-document-card__foot"><span>{doc.createdAt}</span><span>Открыть <Icon name="chevron"/></span></div>
      </Link>)}</section>
    </div>
  );
}
