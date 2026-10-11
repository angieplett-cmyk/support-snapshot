/* Support Snapshot service worker: precaches the app for full offline use. No data is sent anywhere. */
const CACHE="support-snapshot-577e1e5915";
const FILES=["./", "./index.html", "./manifest.webmanifest", "./icons/apple-touch-icon-180.png", "./icons/favicon-32.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-192.png", "./icons/maskable-512.png"];
/* Versions before 1.1.1 had a Reload button that could post to a stale worker. If one of those is installed, take over right away (their page reloads itself on controllerchange). */
const LEGACY=["support-snapshot-a028a5e2c9","support-snapshot-f156da2b3e"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:"reload"})))).then(()=>caches.keys()).then(ks=>{if(ks.some(k=>LEGACY.includes(k)))return self.skipWaiting()}))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("support-snapshot-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data&&e.data.type==="SKIP_WAITING")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(req.mode==="navigate"){e.respondWith(caches.match("./index.html",{ignoreSearch:true}).then(r=>r||fetch(req)));return}
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)));
});
