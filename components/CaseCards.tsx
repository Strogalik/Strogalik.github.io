import Link from 'next/link';
import { cases, type CaseStudy } from '@/content/cases';
export function CaseCards({ items = cases, compact = false }: { items?: CaseStudy[]; compact?: boolean }) {
  return <div className={`case-cards case-count-${items.length}`}>{items.map(item => <article className="case-card" key={item.slug}>
    <span className="data-label">{item.label} · {item.industry}</span><h3>{item.title}</h3><p>{compact ? item.previewSummary : item.summary}</p>
    <div className="case-metric"><strong>{item.primaryMetric.value}</strong><p>{item.primaryMetric.label}</p><span>{item.primaryMetric.period || item.primaryMetric.context}</span></div>
    <Link className="text-link" href={`/cases/${item.slug}`} data-event="case_open">Читать кейс <span aria-hidden="true">→</span><span className="sr-only">: {item.industry}</span></Link>
  </article>)}</div>;
}
