
const __mfCacheGlobalKey = "__mf_module_cache__";
globalThis[__mfCacheGlobalKey] ||= { share: {}, remote: {} };
globalThis[__mfCacheGlobalKey].share ||= {};
globalThis[__mfCacheGlobalKey].remote ||= {};
const __mfModuleCache = globalThis[__mfCacheGlobalKey];

const __mfImport = (src) =>
  globalThis.System && typeof globalThis.System.import === 'function'
    ? globalThis.System.import(src)
    : import(src);
(async () => {
  const { initHost } = await __mfImport("./assets/hostInit-6yT1diMS.js");
  const runtime = await initHost();
  const __mfRemotePreloads = [runtime.loadRemote("shop/CartPage"),runtime.loadRemote("shop/CatalogPage"),runtime.loadRemote("shop/OrdersPage"),runtime.loadRemote("shop/ProfilePage"),runtime.loadRemote("shop/ShopPage")];
  await Promise.all(__mfRemotePreloads);
})().then(() => __mfImport("./assets/index-C2WfndKi.js"));
