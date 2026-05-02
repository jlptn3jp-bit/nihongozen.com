self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  clients.claim();
});
self.addEventListener('fetch', event => {
  // Basic cache strategy
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
