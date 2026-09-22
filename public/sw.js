// STEM Learn Service Worker - Auto-Updating System
const CACHE_VERSION = 'stem-learn-v2.2-auto';
const CACHE_NAME = CACHE_VERSION;

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

// 1. Install Event: Cache shell and immediately take over
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      // Instantly activate without waiting for current tabs to close
      return self.skipWaiting();
    })
  );
});

// 2. Activate Event: Clean up outdated caches and claim all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Clearing outdated cache:', name);
            return caches.delete(name);
          })
      );
    }).then(async () => {
      // Instantly claim all existing clients / open tabs
      await self.clients.claim();
      // Notify all open windows/tabs of the new version
      const allClients = await self.clients.matchAll({ type: 'window' });
      for (const client of allClients) {
        client.postMessage({ type: 'SW_ACTIVATED', version: CACHE_VERSION });
      }
    })
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

  // Never cache API or authentication requests in SW
  if (url.pathname.startsWith('/api/')) return;

  // Handle SPA Navigation requests (HTML page loads): Network-First with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match('/index.html') || await caches.match('/');
          if (cachedResponse) return cachedResponse;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>STEM Learn - Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:48px 16px;background:#0f172a;color:#f8fafc;"><h1>STEM Learn</h1><p>You are currently offline. Please reconnect to access the latest lessons.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Handle static assets & hashed chunks (stale-while-revalidate)
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
            // Revalidation offline, cache used safely
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
          return new Response('', { status: 408, statusText: 'Request timed out / offline' });
        });
    })
  );
});

// 4. Message Event: Allow skipWaiting from client & version check
self.addEventListener('message', (event) => {
  if (event.data) {
    if (event.data.type === 'SKIP_WAITING' || event.data === 'skipWaiting') {
      self.skipWaiting();
    }
    if (event.data.type === 'GET_VERSION') {
      event.ports[0]?.postMessage({ version: CACHE_VERSION });
    }
  }
});
