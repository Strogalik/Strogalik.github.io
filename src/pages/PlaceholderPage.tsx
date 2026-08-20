import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';

export function PlaceholderPage({ title, description }: { title:string; description:string }) {
  return <div className="page"><PageHeader kicker="TMS ASUB · Logistics" title={title} description={description}/><div className="placeholder-panel"><div><Icon name="check"/></div><h2>Архитектура готова для следующего спринта</h2><p>Этот раздел намеренно не размножен до визуального утверждения семи референсных экранов.</p></div></div>;
}
