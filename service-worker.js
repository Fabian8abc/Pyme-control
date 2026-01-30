const CACHE_NAME = 'pymeflow-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;600;700&display=swap'
];

// 1. Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Guardando archivos en caché para modo offline...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Responder con caché si no hay internet (Estrategia: Cache first, falling back to network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si el archivo está en caché, lo devuelve. Si no, lo pide a internet.
      return response || fetch(event.request);
    })
  );
});

// 3. Limpiar cachés viejas si actualizamos la versión de la app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
