// Empire Plaza Delivery Partner - Progressive Web App Service Worker
const CACHE_NAME = 'ep-delivery-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Pass all API and authentication calls straight through to the network
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  // Stale-while-revalidate for static assets, network-first for pages
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
