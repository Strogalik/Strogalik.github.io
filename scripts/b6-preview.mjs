// A separate loopback-only process; does not write or enable anything in .env.
import {spawn} from 'node:child_process';
const child=spawn(process.execPath,['scripts/start.mjs'],{stdio:'inherit',env:{...process.env,PORT:process.env.B6_PORT||'3206',TMS_HOST:'127.0.0.1',HOSTNAME:'127.0.0.1',TMS_FAQ_REVIEW:'1',TMS_DESIGN_REVIEW:'',LEADS_LEGAL_APPROVED:'false',LEADS_WEBHOOK_URL:'',LEADS_WEBHOOK_TOKEN:'',TMS_ANALYTICS_PROVIDER:'none',TMS_ANALYTICS_ENABLED:'false',TMS_ANALYTICS_OPERATOR_APPROVED:'false',TMS_ANALYTICS_PROFILE_REVIEWED:'false',TMS_METRIKA_ID:'',NEXT_PUBLIC_YANDEX_METRIKA_ID:''}});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??0));
