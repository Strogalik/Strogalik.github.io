'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {consentVersion} from '@/lib/consent';
import { currentUTM } from '@/lib/utm';
import type { AnalyticsEvent } from '@/lib/analytics';
import copy from '@/content/site-copy.ru.json';
import { formCopy } from '@/content/site';

type Options = { intent: 'saas'|'custom'|'partner'|'builder_interest'; productSlug?: string; caseSlug?: string };
const LeadContext = createContext<(options: Options) => void>(() => {});
export function LeadButton({ children, className = 'button', intent = 'saas', productSlug, caseSlug }: { children: ReactNode; className?: string; intent?: Options['intent']; productSlug?: string; caseSlug?: string; event?: AnalyticsEvent }) {
  const open = useContext(LeadContext);
  return <button className={className} onClick={() => { open({intent,productSlug,caseSlug}); }} type="button">{children}</button>;
}
export function LeadProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [options, setOptions] = useState<Options>({intent:'saas'});
  const [version, setVersion] = useState(0);
  const trigger = useRef<HTMLElement | null>(null);
  function open(value: Options) {
    trigger.current = document.activeElement as HTMLElement;
    setOptions(value); setVersion(v => v + 1);
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
  }
  function close() {
    dialog.current?.close(); document.body.style.overflow = '';
    trigger.current?.focus();
  }
  function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab' || !dialog.current) return;
    const controls = [...dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])')].filter(element => element.getClientRects().length > 0);
    const first = controls[0]; const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.current.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  useEffect(() => () => { document.body.style.overflow = ''; }, []);
  return <LeadContext.Provider value={open}>
    {children}
    <dialog ref={dialog} className="lead-dialog" aria-labelledby="lead-title" onKeyDown={trapFocus} onCancel={close} onClose={() => { document.body.style.overflow = ''; }} onClick={event => { if (event.target === dialog.current) close(); }}>
      <div className="dialog-inner">
        <button className="close-button" onClick={close} aria-label="Закрыть форму" type="button">×</button>
        <span className="eyebrow">Обсудить бизнес</span>
        <h2 id="lead-title">{copy.leadForm.headings[options.intent]}</h2>
        <p>{formCopy.intro}</p>
        <LeadForm key={version} options={options} />
      </div>
    </dialog>
  </LeadContext.Provider>;
}

function LeadForm({ options }: { options: Options }) {
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const submitting = useRef(false);
  useEffect(() => { if (state === 'success') resultRef.current?.focus(); }, [state]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (submitting.current) return;
    submitting.current = true;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setErrors({}); setState('sending'); setMessage('');
    try {
      const { leadSchema } = await import('@/lib/validation');
      const parsed = leadSchema.safeParse({ ...values, consentVersion, consent: values.consent === 'on', ...options, context: options.intent, page: location.pathname, utm: (values.consent === 'on' ? currentUTM(location.search) : {}) });
      if (!parsed.success) {
        const fields = parsed.error.flatten().fieldErrors; setErrors(fields); setState('idle');
        const first = Object.keys(fields)[0]; (form.elements.namedItem(first) as HTMLElement)?.focus();
        return;
      }
      if (process.env.NEXT_PUBLIC_STATIC_HOSTING === 'true') { setState('error'); setMessage(formCopy.unavailable); return; }
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(12_000) });
      const body = await response.json();
      if (!response.ok || body.ok !== true) { setState('error'); setMessage(body.message || formCopy.unavailable); return; }
      setState('success');
    } catch { setState('error'); setMessage('Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.'); }
    finally { submitting.current = false; }
  }
  if (state === 'success') return <div className="form-success" role="status" tabIndex={-1} ref={resultRef}><h3>{formCopy.success}</h3><p>{formCopy.successText}</p></div>;
  return <form onSubmit={submit} noValidate>
    <div className="form-pair">
      <Field name="name" label={formCopy.name} autoComplete="name" errors={errors} maxLength={100} />
      <Field name="company" label={formCopy.company} autoComplete="organization" errors={errors} maxLength={160} />
    </div>
    <Field name="contact" label={formCopy.contact} autoComplete="email" errors={errors} maxLength={160} />
    <label htmlFor="lead-message">{formCopy.message}</label>
    <textarea id="lead-message" name="message" rows={3} maxLength={2000} required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'error-message' : undefined} />
    {errors.message && <span id="error-message" className="field-error">{errors.message[0]}</span>}
    <div className="honeypot" aria-hidden="true"><label htmlFor="lead-website">Ваш сайт</label><input id="lead-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <label className="consent"><input type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'error-consent' : undefined} /><span>{formCopy.consent} <Link href="/privacy" target="_blank">Обработка данных</Link></span></label>
    {errors.consent && <span id="error-consent" className="field-error">{errors.consent[0]}</span>}
    <button className="button full" disabled={state === 'sending'} type="submit">{state === 'sending' ? formCopy.submitting : formCopy.submit}</button>
    {state === 'error' && <p role="alert" className="form-error">{message}</p>}
  </form>;
}
function Field({ name, label, errors, ...props }: { name: string; label: string; errors: Record<string, string[] | undefined>; autoComplete: string; maxLength: number }) {
  return <div className="field"><label htmlFor={`lead-${name}`}>{label}</label><input id={`lead-${name}`} name={name} required aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined} {...props} />{errors[name] && <span id={`error-${name}`} className="field-error">{errors[name]?.[0]}</span>}</div>;
}
