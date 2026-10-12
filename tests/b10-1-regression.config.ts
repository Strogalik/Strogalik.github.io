import base from '../playwright.config';
import{resolve}from'node:path';
import {defineConfig} from '@playwright/test';
export default defineConfig({...base,testDir:'.',outputDir:'../qa/v6-b10-1/regression/public-artifacts',reporter:[['list'],['json',{outputFile:'../qa/v6-b10-1/regression/public.json'}]],webServer:{...base.webServer,command:'PORT=3100 LEADS_WEBHOOK_URL= LEADS_WEBHOOK_TOKEN= LEADS_LEGAL_APPROVED=false NEXT_PUBLIC_YANDEX_METRIKA_ID=123456789 node scripts/start.mjs',cwd:resolve(__dirname,'..'),url:'http://127.0.0.1:3100',reuseExistingServer:false,timeout:60000}});
