import { createRateLimiter } from '@/lib/rate-limit';
import { handleLead } from '@/lib/lead-handler';
const rateLimit = createRateLimiter();
export const runtime = 'nodejs';
export async function POST(request: Request) {
  return handleLead(request, { rateLimit, legalApproved: process.env.LEADS_LEGAL_APPROVED === 'true', webhookUrl: process.env.LEADS_WEBHOOK_URL, token: process.env.LEADS_WEBHOOK_TOKEN });
}
