import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Sound Wave landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="ru"/i);
  assert.match(html, /Студия звукозаписи Sound Wave в Москве/);
  assert.match(html, /Студия звукозаписи/);
  assert.match(html, /Первый час/);
  assert.match(html, /490 ₽/);
  assert.match(html, /https:\/\/t\.me\/soundwavemsk/);
  assert.match(html, /"@type":"LocalBusiness"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Starter Project/i);
});

test("keeps editable business data and analytics configuration centralized", async () => {
  const [config, metrika, packageJson, envExample] = await Promise.all([
    readFile(new URL("../app/site-config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/YandexMetrika.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);

  assert.match(config, /Первый час/);
  assert.match(config, /890 ₽\/час/);
  assert.match(config, /7743459164/);
  assert.match(config, /studio-hero\.webp/);
  assert.match(metrika, /NEXT_PUBLIC_YANDEX_METRIKA_ID/);
  assert.match(envExample, /NEXT_PUBLIC_SITE_URL/);
  assert.match(packageJson, /"name": "sound-wave-studio"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
