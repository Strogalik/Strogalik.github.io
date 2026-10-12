import {consentVersion,consentHash} from './consent';
import { leadSchema } from './validation';
import { formCopy } from '../content/site';
type Dependencies = { legalApproved?: boolean; webhookUrl?: string; token?: string; fetcher?: typeof fetch; timeoutMs?: number; rateLimit?: (contact: string) => boolean };
const reply = (message: string, status: number, extra = {}) => Response.json({ ok: false, message, ...extra }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function handleLead(request: Request, dependencies: Dependencies): Promise<Response> {
  const origin = request.headers.get('origin');
  if (origin) {
    let sameOrigin = origin === new URL(request.url).origin;
    // Next's internal request URL can use localhost behind a reverse proxy.
    // The browser's Host header identifies the actual origin; never use X-Forwarded-Host here.
    try { sameOrigin ||= new URL(origin).host === request.headers.get('host'); } catch { /* Invalid origin is denied. */ }
    if (!sameOrigin) return reply('Запрос с другого сайта отклонён.', 403);
  }
  if (!request.headers.get('content-type')?.includes('application/json')) return reply('Ожидается JSON.', 415);
  if (Number(request.headers.get('content-length') || 0) > 16_384) return reply('Слишком большой запрос.', 413);
  let data: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply('Пустой запрос.', 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const item = await reader.read(); if (item.done) break;
      size += item.value.byteLength;
      if (size > 16_384) { await reader.cancel(); return reply('Слишком большой запрос.', 413); }
      chunks.push(item.value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    data = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply('Не удалось прочитать заявку.', 400); }
  const parsed = leadSchema.safeParse(data);
  if (!parsed.success) return reply('Проверьте поля формы.', 400, { errors: parsed.error.flatten().fieldErrors });
  if (parsed.data.consentVersion!==consentVersion) return reply('Условия согласия обновились. Откройте согласие и обновите страницу перед отправкой.',409);
  if (parsed.data.website) return reply('Заявка отклонена. Попробуйте ещё раз.', 400);
  if (dependencies.rateLimit && !dependencies.rateLimit(parsed.data.contact)) return reply('Слишком много обращений. Попробуйте позже.', 429);
  if (!dependencies.legalApproved) return reply(formCopy.unavailable, 503);
  if (!dependencies.webhookUrl) return reply(formCopy.unavailable, 503);
  try {
    const url = new URL(dependencies.webhookUrl);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
      return reply(formCopy.unavailable, 503);
    }
    // Redirects are rejected so the bearer token cannot leak to another host.
    const result = await (dependencies.fetcher || fetch)(url, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(dependencies.timeoutMs ?? 8000),
      headers: { 'Content-Type': 'application/json', ...(dependencies.token ? { Authorization: `Bearer ${dependencies.token}` } : {}) },
      body: JSON.stringify({ ...parsed.data, website: undefined, consentReceipt:{version:consentVersion,sha256:consentHash,accepted:true,recordedAt:new Date().toISOString()}, receivedAt: new Date().toISOString(), source: 'tms-website' }),
    });
    if (!result.ok) return reply('Не удалось передать заявку. Попробуйте позже.', 502);
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return reply('Сервис приёма заявок не ответил. Попробуйте позже.', 502); }
}
