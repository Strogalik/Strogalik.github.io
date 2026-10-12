import {defineConfig,devices} from '@playwright/test';
export default defineConfig({testDir:'.',testMatch:'b6-faq.spec.ts',timeout:30_000,fullyParallel:true,workers:3,
 reporter:[['list'],['json',{outputFile:'../qa/v6-b6/test-results.json'}],['html',{open:'never',outputFolder:'../qa/v6-b6/playwright-report'}]],
 use:{baseURL:'http://127.0.0.1:3206',trace:'retain-on-failure',screenshot:'only-on-failure'},outputDir:'../qa/v6-b6/test-artifacts',
 projects:[{name:'chromium',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:900}}}],
 webServer:{command:'node scripts/b6-preview.mjs',url:'http://127.0.0.1:3206/review/faq',reuseExistingServer:true,timeout:60_000}});
