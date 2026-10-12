import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: '.', testMatch: ['b10-1.spec.ts', 'pages-smoke.spec.ts'],
  timeout: 45000, workers: 2,
  use: {baseURL: process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3202', viewport: {width:1440,height:900}, screenshot:'only-on-failure'},
  outputDir: '../qa/pages/artifacts', reporter: [['list'],['json',{outputFile:'../qa/pages/results.json'}]],
});
