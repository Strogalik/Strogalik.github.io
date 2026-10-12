import {legacyDemoTarget} from '@/lib/demo-redirect';
export function GET(request:Request){return new Response(null,{status:307,headers:{Location:legacyDemoTarget(new URL(request.url).searchParams),'Cache-Control':'no-store'}});}
