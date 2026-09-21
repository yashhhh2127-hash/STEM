// STEM Learn Service Worker
const CACHE_NAME = 'stem-learn-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-192x192-maskable.png',
  '/icons/icon-512x512.png',
  '/icons/icon-512x512-maskable.png',
  '/icons/apple-touch-icon.png'
];

// 1. Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore unsupported schemes (chrome-extension, etc.)
  if (!url.protocol.startsWith('http')) return;

  // Handle SPA Navigation requests (HTML page loads)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Update cache with latest index.html if online
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback: serve cached index.html
          const cachedResponse = await caches.match('/index.html') || await caches.match('/');
          if (cachedResponse) return cachedResponse;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>STEM Learn - Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:48px 16px;background:#0f172a;color:#f8fafc;"><h1>You are offline</h1><p>Please check your internet connection and reload.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Handle static assets & hashed chunks (stale-while-revalidate / cache-first)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately, revalidate in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {
            // Revalidation failed (offline), which is totally fine
          });
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If asset fetch fails and offline, nothing more to do
          return new Response('', { status: 408, statusText: 'Request timed out / offline' });
        });
    })
  );
});

// 4. Message Event: Allow skipWaiting from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
