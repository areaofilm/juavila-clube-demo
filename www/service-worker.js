const CACHE_NAME = "juavila-clube-v3";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./admin.html",
  "./styles.css",
  "./data.js",
  "./app.js",
  "./admin.js",
  "./manifest.json",
  "./privacy.html",
  "./terms.html",
  "./assets/ideia-de-app.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match("./index.html"));
    }),
  );
});
