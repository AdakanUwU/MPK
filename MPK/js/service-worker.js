self.addEventListener('install', (event) => {
  console.log('Service Worker: zainstalowany');
  event.waitUntil(
    caches.open('static-v1').then((cache) => cache.addAll(['../index.html', '../css/style.css']))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});