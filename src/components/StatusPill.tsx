import type { DocStatus, EdoStatus, FuelingStatus, IntegrationJobStatus, IntegrationStatus, TripStatus } from '../data/types';

const tripLabels: Record<TripStatus, string> = {
  planned: 'Запланирован', assigned: 'Назначен', in_transit: 'В пути', completed: 'Завершён', cancelled: 'Отменён',
};
const docLabels: Record<DocStatus, string> = {
  draft: 'Черновик', awaiting_signature: 'Ожидает подписи', sent: 'Отправлен', delivered: 'Доставлен', accepted: 'Принят', rejected: 'Отклонён', error: 'Ошибка',
};
const edoLabels: Record<EdoStatus, string> = {
  approval: 'На согласовании', awaiting_signature: 'Ожидает подписи', signed: 'Подписан', rejected: 'Отклонён',
};

const fuelLabels: Record<FuelingStatus, string> = {
  confirmed:'Подтверждено', pending_approval:'На согласовании', rejected:'Отклонено',
};

const integrationLabels: Record<IntegrationStatus, string> = {
  connected: 'Подключено', degraded: 'Есть ошибки', error: 'Ошибка', not_configured: 'Не настроено',
};
const jobLabels: Record<IntegrationJobStatus, string> = {
  queued: 'В очереди', processing: 'Выполняется', success: 'Успешно', error: 'Ошибка',
};

export function TripStatusPill({ status }: { status: TripStatus }) {
  const tone = status === 'completed' ? 'success' : status === 'cancelled' ? 'neutral' : status === 'in_transit' ? 'info' : 'soft';
  return <span className={`status-pill status-pill--${tone}`}>{tripLabels[status]}</span>;
}

export function DocStatusPill({ status }: { status: DocStatus }) {
  const tone = status === 'accepted' ? 'success' : status === 'error' || status === 'rejected' ? 'danger' : status === 'awaiting_signature' ? 'warning' : status === 'sent' || status === 'delivered' ? 'info' : 'soft';
  return <span className={`status-pill status-pill--${tone}`}>{docLabels[status]}</span>;
}

export function EdoStatusPill({ status }: { status: EdoStatus }) {
  const tone = status === 'signed' ? 'success' : status === 'rejected' ? 'danger' : status === 'awaiting_signature' ? 'warning' : 'info';
  return <span className={`status-pill status-pill--${tone}`}>{edoLabels[status]}</span>;
}


export function FuelStatusPill({ status }: { status: FuelingStatus }) {
  const tone = status === 'confirmed' ? 'success' : status === 'pending_approval' ? 'warning' : 'danger';
  return <span className={`status-pill status-pill--${tone}`}>{fuelLabels[status]}</span>;
}


export function FuelStatusText({ status }: { status: FuelingStatus }) {
  const tone = status === 'confirmed' ? 'success' : status === 'pending_approval' ? 'warning' : 'danger';
  return <span className={`status-text status-text--${tone}`}><i aria-hidden="true" />{fuelLabels[status]}</span>;
}

export function SemanticStatusText({ label, tone = 'soft' }: { label: string; tone?: 'success'|'warning'|'danger'|'info'|'soft'|'neutral' }) {
  return <span className={`status-text status-text--${tone}`}><i aria-hidden="true" />{label}</span>;
}

export function IntegrationStatusPill({ status }: { status: IntegrationStatus }) {
  const tone = status === 'connected' ? 'success' : status === 'degraded' ? 'warning' : status === 'error' ? 'danger' : 'neutral';
  return <span className={`status-pill status-pill--${tone}`}>{integrationLabels[status]}</span>;
}

export function JobStatusPill({ status }: { status: IntegrationJobStatus }) {
  const tone = status === 'success' ? 'success' : status === 'error' ? 'danger' : status === 'processing' ? 'info' : 'soft';
  return <span className={`status-pill status-pill--${tone}`}>{jobLabels[status]}</span>;
}

export function SimpleStatusPill({ label, tone = 'soft' }: { label: string; tone?: 'success'|'warning'|'danger'|'info'|'soft'|'neutral' }) {
  return <span className={`status-pill status-pill--${tone}`}>{label}</span>;
}
