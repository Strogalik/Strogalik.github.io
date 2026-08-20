import { useEffect, useId, useState } from 'react';
import { Icon } from './Icon';

export interface ChartPoint { label: string; revenue: number; costs: number; }

function geometry(values: number[], width = 560, height = 250, padX = 18, padTop = 18, padBottom = 42) {
  const max = Math.max(...values) * 1.08;
  const min = Math.min(...values) * 0.88;
  const plotHeight = height - padTop - padBottom;
  return values.map((value, index) => {
    const x = padX + (index * (width - padX * 2)) / Math.max(values.length - 1, 1);
    const y = padTop + ((max - value) / Math.max(max - min, 1)) * plotHeight;
    return { x, y };
  });
}

function ChartSvg({ data, secondary, expanded, label, gradientId }: { data: ChartPoint[]; secondary: boolean; expanded?: boolean; label: string; gradientId: string }) {
  const width = 560;
  const height = expanded ? 330 : 250;
  const padX = 18;
  const padTop = 18;
  const padBottom = 42;
  const baseline = height - padBottom;
  const revenuePoints = geometry(data.map(d => d.revenue), width, height, padX, padTop, padBottom);
  const costsPoints = geometry(data.map(d => d.costs), width, height, padX, padTop, padBottom);
  const revenue = revenuePoints.map(({x,y}) => `${x},${y}`).join(' ');
  const costs = costsPoints.map(({x,y}) => `${x},${y}`).join(' ');
  const area = `${padX},${baseline} ${revenue} ${width-padX},${baseline}`;
  const gridYs = [0.2, 0.4, 0.6, 0.8].map(ratio => padTop + (baseline - padTop) * ratio);

  return (
    <svg className={`line-chart ${expanded ? 'line-chart--expanded' : ''}`} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F52BA" stopOpacity=".22" />
          <stop offset="1" stopColor="#0F52BA" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridYs.map(y => <line key={y} x1={padX} y1={y} x2={width-padX} y2={y} className="chart-grid" />)}
      <polygon points={area} fill={`url(#${gradientId})`} />
      <polyline points={revenue} className="chart-line chart-line--primary" />
      {secondary && <polyline points={costs} className="chart-line chart-line--secondary" />}
      {data.map((item, i) => {
        const x = padX + (i * (width - padX * 2))/Math.max(data.length-1, 1);
        return <text key={item.label} x={x} y={height - 11} textAnchor={i === 0 ? 'start' : i === data.length-1 ? 'end' : 'middle'} className="chart-label">{item.label}</text>;
      })}
    </svg>
  );
}

export function LineChart({ data, secondary = true, title = 'График' }: { data: ChartPoint[]; secondary?: boolean; title?: string }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [expanded]);

  return (
    <>
      <div className="chart-wrap chart-wrap--expandable">
        <ChartSvg data={data} secondary={secondary} label={title} gradientId={`chartFill-${id}`} />
        <button className="chart-expand" type="button" onClick={() => setExpanded(true)} aria-label={`Развернуть график «${title}»`} title="Развернуть график"><Icon name="expand" /></button>
      </div>
      {expanded && (
        <div className="chart-dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => { if (event.target === event.currentTarget) setExpanded(false); }}>
          <div className="chart-dialog__surface">
            <div className="chart-dialog__header"><div><span className="eyebrow">Детальный просмотр</span><h2>{title}</h2></div><button className="icon-btn chart-dialog__close" type="button" onClick={() => setExpanded(false)} aria-label="Закрыть"><Icon name="close" /></button></div>
            <div className="chart-dialog__plot"><ChartSvg data={data} secondary={secondary} expanded label={title} gradientId={`chartFill-expanded-${id}`} /></div>
          </div>
        </div>
      )}
    </>
  );
}
