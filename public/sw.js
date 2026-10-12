// AQ Coaching High-Performance Offline Service Worker
const CACHE_NAME = 'aq-coaching-v3-ultra-hd';

const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/images/icon-1024.png',
  '/images/icon-512.png',
  '/images/icon-maskable-512.png',
  '/images/icon-192.png',
  '/images/icon-180.png',
  '/pwa-512x512.png',
  '/pwa-192x192.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.png',
  '/favicon.ico',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Precache critical assets
      for (const asset of CRITICAL_ASSETS) {
        try {
          const res = await fetch(asset, { cache: 'no-cache' });
          if (res && res.status === 200) {
            await cache.put(asset, res);
          }
        } catch (e) {
          // Non-critical if individual asset fails during dev
        }
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignore internal Vite HMR web sockets and Dev APIs
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.includes('@vite') ||
    url.pathname.includes('@fs') ||
    url.pathname.includes('node_modules') ||
    url.protocol === 'ws:' ||
    url.protocol === 'wss:'
  ) {
    return;
  }

  // 1. NAVIGATION REQUESTS (Opening the app from home screen / address bar)
  // STALE-WHILE-REVALIDATE WITH ZERO-LATENCY CACHE RETURN
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedApp = (await cache.match('/index.html')) || (await cache.match('/'));

        // Background update attempt
        const networkPromise = fetch(event.request)
          .then(async (networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              const text = await clone.text();
              // Verify this is genuine application HTML and NOT Cloud Run cold start proxy
              if (text.includes('root') && (text.includes('Fitness') || text.includes('التدريب') || text.includes('المنصة'))) {
                cache.put('/index.html', networkResponse.clone());
                cache.put('/', networkResponse.clone());
              }
            }
            return networkResponse;
          })
          .catch(() => null);

        // If app is cached, open INSTANTLY in 0ms!
        if (cachedApp) {
          networkPromise; // continue in background
          return cachedApp;
        }

        // First launch before cache exists: wait for network
        const netResult = await networkPromise;
        if (netResult) return netResult;

        // Offline fallback
        return (await cache.match('/index.html')) || new Response('Offline', { status: 503 });
      })()
    );
    return;
  }

  // 2. STATIC ASSETS (Images, Icons, CSS, JS, Fonts)
  // CACHE-FIRST FOR MAXIMUM SPEED AND QUALITY
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) {
        return cached;
      }

      try {
        const response = await fetch(event.request);
        if (response && response.status === 200) {
          // Cache successful responses for assets
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        // Fallback for image icons if network fails
        if (url.pathname.includes('/images/') || url.pathname.includes('icon')) {
          const fallbackIcon = await cache.match('/images/icon-512.png');
          if (fallbackIcon) return fallbackIcon;
        }
        throw err;
      }
    })()
  );
});
