import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../api/queries';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import type { NotificationCategory, NotificationItem } from '../data/types';

const categoryLabels: Record<NotificationCategory, string> = {
  trips: 'Рейсы', epd: 'ЭПД', edo: 'ЭДО', integrations: 'Интеграции', finance: 'Финансы', fuel: 'ГСМ',
};

type Filter = 'all' | 'unread' | 'critical';

function NotificationRow({ item }: { item: NotificationItem }) {
  const tone = item.severity === 'critical' ? 'danger' : item.severity === 'warning' ? 'warning' : 'info';
  return (
    <Link to={item.href} className={`notification-row notification-row--${tone} ${item.unread ? 'is-unread' : ''}`}>
      <span className={`notification-row__icon notification-row__icon--${tone}`}><Icon name={item.severity === 'critical' ? 'warning' : item.category === 'trips' ? 'truck' : item.category === 'integrations' ? 'link' : 'file'} /></span>
      <span className="notification-row__content">
        <span className="notification-row__eyebrow">{categoryLabels[item.category]}</span>
        <strong>{item.title}</strong>
        <span>{item.meta}</span>
      </span>
      <span className="notification-row__time">{item.time}</span>
      <Icon name="chevron" className="notification-row__chevron" />
    </Link>
  );
}

export function NotificationsPage() {
  const { data = [] } = useNotifications();
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = useMemo(() => data.filter((item) => filter === 'all' || (filter === 'unread' && item.unread) || (filter === 'critical' && item.severity === 'critical')), [data, filter]);
  const unread = data.filter((item) => item.unread).length;
  const critical = data.filter((item) => item.severity === 'critical').length;

  return (
    <div className="page notifications-page">
      <PageHeader kicker="Центр внимания" title="Уведомления" description="Только события, которые помогают понять, что изменилось и где требуется действие." />
      <section className="attention-summary-grid">
        <article className="attention-summary-card"><span>Новые</span><strong>{unread}</strong><small>непрочитанных события</small></article>
        <article className="attention-summary-card attention-summary-card--danger"><span>Критичные</span><strong>{critical}</strong><small>требуют проверки</small></article>
        <article className="attention-summary-card"><span>Документы</span><strong>{data.filter((i) => i.category === 'epd' || i.category === 'edo').length}</strong><small>события ЭПД / ЭДО</small></article>
      </section>
      <div className="segmented-tabs notifications-tabs" role="tablist" aria-label="Фильтр уведомлений">
        <button className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>Все <span>{data.length}</span></button>
        <button className={filter === 'unread' ? 'is-active' : ''} onClick={() => setFilter('unread')}>Новые <span>{unread}</span></button>
        <button className={filter === 'critical' ? 'is-active' : ''} onClick={() => setFilter('critical')}>Критичные <span>{critical}</span></button>
      </div>
      <section className="panel notification-center-panel">
        <div className="panel__header"><div><span className="eyebrow">Операционный поток</span><h2>{filter === 'critical' ? 'Критичные события' : filter === 'unread' ? 'Новые события' : 'Последние события'}</h2></div><span className="panel-meta">{filtered.length} событий</span></div>
        <div className="notification-list">{filtered.map((item) => <NotificationRow key={item.id} item={item} />)}</div>
      </section>
    </div>
  );
}
