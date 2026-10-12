import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir:'./tests',testMatch:['site.spec.ts','form.spec.ts','upstream.spec.ts','visual.spec.ts','stage-b.spec.ts','b1.spec.ts','b2.spec.ts','b2-motion.spec.ts','b3.spec.ts','b4.spec.ts','b5.spec.ts','b5-analytics.spec.ts'],timeout:30_000,fullyParallel:true,workers:3,
 reporter:[['list'],['html',{open:'never',outputFolder:'qa/v6-b5/playwright-report'}],['json',{outputFile:'qa/v6-b5/test-results.json'}]],
 use:{baseURL:'http://127.0.0.1:3100',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}}],
 webServer:{command:'PORT=3100 LEADS_WEBHOOK_URL= LEADS_WEBHOOK_TOKEN= LEADS_LEGAL_APPROVED=false NEXT_PUBLIC_YANDEX_METRIKA_ID=123456789 npm run start',url:'http://127.0.0.1:3100',reuseExistingServer:!process.env.CI,timeout:60_000},
});
