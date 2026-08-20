export type DistributionTone = 'blue' | 'powder' | 'green' | 'amber' | 'red' | 'navy' | 'gray';

export interface DistributionItem {
  label: string;
  value: number;
  total: number;
  tone?: DistributionTone;
  meta?: string;
}

export function DistributionList({ items }: { items: DistributionItem[] }) {
  return (
    <div className="distribution-list">
      {items.map((item) => {
        const percent = item.total > 0 ? Math.max(4, Math.min(100, (item.value / item.total) * 100)) : 0;
        return (
          <div className="distribution-row" key={item.label}>
            <div className="distribution-row__head">
              <div><i className={`distribution-dot distribution-dot--${item.tone ?? 'blue'}`}/><span>{item.label}</span></div>
              <strong>{item.value}</strong>
            </div>
            <div className="distribution-track"><i className={`distribution-fill distribution-fill--${item.tone ?? 'blue'}`} style={{ width: `${percent}%` }}/></div>
            {item.meta && <small>{item.meta}</small>}
          </div>
        );
      })}
    </div>
  );
}
