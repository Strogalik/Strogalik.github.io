import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { Icon } from './Icon';

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  kicker?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm'|'md'|'lg';
  presentation?: 'dialog'|'sheet';
};

export function Overlay({ open, onClose, title, description, kicker, children, footer, size='md', presentation='dialog' }: OverlayProps) {
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;
      const card = cardRef.current;
      if (!card) return;
      const focusable = Array.from(card.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])')).filter(el => !el.hasAttribute('hidden'));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return <div className="overlay-root" role="presentation" onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
    <section ref={cardRef} className={`overlay-card overlay-card--${size} overlay-card--${presentation}`} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descId : undefined}>
      <header className="overlay-card__header"><div>{kicker && <span className="eyebrow">{kicker}</span>}<h2 id={titleId}>{title}</h2>{description && <p id={descId}>{description}</p>}</div><button ref={closeRef} className="icon-btn overlay-card__close" type="button" onClick={onClose} aria-label="Закрыть"><Icon name="close"/></button></header>
      <div className="overlay-card__body">{children}</div>
      {footer && <footer className="overlay-card__footer">{footer}</footer>}
    </section>
  </div>;
}

export function ActionList({ children }: { children: ReactNode }) { return <div className="action-list">{children}</div>; }
export function ActionListButton({ icon, title, description, danger=false, onClick }: { icon?: Parameters<typeof Icon>[0]['name']; title:string; description?:string; danger?:boolean; onClick?:()=>void }) {
  return <button type="button" className={`action-list__item ${danger?'is-danger':''}`} onClick={onClick}>{icon && <span className="action-list__icon"><Icon name={icon}/></span>}<span className="action-list__copy"><strong>{title}</strong>{description && <small>{description}</small>}</span><Icon name="chevron"/></button>;
}

export function ChoiceList({ children }: { children: ReactNode }) { return <div className="choice-list">{children}</div>; }
export function ChoiceRow({ label, description, selected=false, onClick }: { label:string; description?:string; selected?:boolean; onClick?:()=>void }) {
  return <button type="button" className={`choice-row ${selected?'is-selected':''}`} onClick={onClick}><span><strong>{label}</strong>{description && <small>{description}</small>}</span><i aria-hidden="true">{selected ? <Icon name="check"/> : null}</i></button>;
}
