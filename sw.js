const CACHE = 'salon-v8';
const FILES = [
  './', './index.html', './common.css', './common.js', './art.js', './manifest.json', './icon.svg',
  './merge/', './merge/index.html', './merge/style.css', './merge/app.js', './merge/data.js', './merge/icons.js', './merge/local.js',
  './sort/', './sort/index.html', './sort/sort.css', './sort/sort.js',
  './blocks/', './blocks/index.html', './blocks/blocks.css', './blocks/blocks.js',
  './diner/', './diner/index.html', './diner/diner.css', './diner/diner.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(FILES.map(f => c.add(f)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Red primero, caché de respaldo.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
