import {spawn} from 'node:child_process';
// Explicit opt-in, loopback-only review. No real delivery or tracking configuration.
const child=spawn('npm',['run','start'],{stdio:'inherit',env:{...process.env,TMS_DESIGN_REVIEW:'1',TMS_HOST:'127.0.0.1',PORT:process.env.TMS_REVIEW_PORT||'3200',LEADS_WEBHOOK_URL:'',LEADS_WEBHOOK_TOKEN:'',LEADS_LEGAL_APPROVED:'false',NEXT_PUBLIC_YANDEX_METRIKA_ID:''}});
for(const s of ['SIGINT','SIGTERM'])process.on(s,()=>child.kill(s));
child.on('exit',c=>process.exit(c??1));
