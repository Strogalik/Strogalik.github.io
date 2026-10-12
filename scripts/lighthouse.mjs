import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('qa/v5/lighthouse', { recursive: true });
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
try {
  const summary = {};
  for (const [name, path, desktop] of [['home-mobile', '/', false], ['home-desktop', '/', true], ['crm-mobile', '/products/crm', false], ['demo-mobile', '/demo', false]]) {
    const result = await lighthouse(`http://127.0.0.1:3100${path}`, {
      port: chrome.port, output: ['html', 'json'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      ...(desktop ? { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 } } : {}),
    });
    await writeFile(`qa/v5/lighthouse/${name}.html`, result.report[0]);
    await writeFile(`qa/v5/lighthouse/${name}.json`, result.report[1]);
    summary[name] = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]));
    summary[name].metrics = Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift'].map(key => [key, result.lhr.audits[key].displayValue]));
    summary[name].failures = Object.values(result.lhr.audits).filter(a => a.score !== null && a.score < .9 && a.scoreDisplayMode !== 'informative').map(a => ({ id: a.id, title: a.title, score: a.score, detail: a.displayValue }));
  }
  await writeFile('qa/v5/lighthouse/summary.json', JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally { await chrome.kill(); }
