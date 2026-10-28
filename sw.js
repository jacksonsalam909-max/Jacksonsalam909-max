// SHIJA Hospitals - PWA Service Worker v6 - Keep as it is (won't crash)
const CACHE_NAME = "shija-v6";
const FILES_TO_CACHE = [
  "/",
  "/login.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/logoc.png",
  "/shija.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache one by one, ignore failures - so it never crashes
      for (let url of FILES_TO_CACHE) {
        try { await cache.add(url); console.log("Cached", url); }
        catch (e) { console.log("Skip", url); }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
});
