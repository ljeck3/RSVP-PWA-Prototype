const CACHE_NAME = "rsvp-v1";

const REPO = "RSVP-PWA-Prototype"; 
const IS_GITHUB_PAGES = location.hostname.endsWith("github.io");
const BASE = IS_GITHUB_PAGES ? `/${REPO}` : "";

const ASSETS_TO_CACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/party.html`,
  `${BASE}/main.js`,
  `${BASE}/materialize.js`,
  `${BASE}/materialize.min.js`,
  // Add actual assets below:
  // `${BASE}/css/styles.css`,
  // `${BASE}/images/logo.png`,
  // etc...
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service worker: Deleting old cache", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching...", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
