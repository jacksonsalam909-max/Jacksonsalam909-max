// SHIJA Hospitals - PWA Service Worker v5 - Final Fix
const CACHE_NAME = "shija-v5";
const FILES_TO_CACHE = [
  "/",
  "/login.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/logoc.png",
  "/shija.jpg"
];

// Install - cache files
self.addEventListener("install", (event) => {
  console.log("SW Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate - clean old caches
self.addEventListener("activate", (event) => {
  console.log("SW Activate");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        // Cache new resources
        if (event.request.method === "GET" && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      if (event.request.destination === "document") {
        return caches.match("/login.html");
      }
    })
  );
});
