import{defineConfig}from'@playwright/test';
export default defineConfig({testDir:'.',testMatch:'b10.spec.ts',timeout:45000,workers:2,use:{baseURL:'http://127.0.0.1:3200',viewport:{width:1440,height:900},trace:'retain-on-failure',screenshot:'only-on-failure'},outputDir:'../qa/v6-b10/test-artifacts',reporter:[['list'],['json',{outputFile:'../qa/v6-b10/tests.json'}]]});
