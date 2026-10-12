import {getAnalyticsConfig} from '@/lib/privacy/config.server';
export const dynamic='force-static';
// Read-only, same-origin public settings. No identifiers, receipt or request metadata.
export function GET(){return Response.json(getAnalyticsConfig(),{headers:{'Cache-Control':'no-store, max-age=0'}});}
