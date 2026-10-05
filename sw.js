/* =========================================================
   PUMALA - FINAL SERVICE WORKER
   PWA + Web Push Notification
   ========================================================= */

const CACHE_NAME = 'pumala-pwa-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* =========================
   INSTALL PWA
   ========================= */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

/* =========================
   ACTIVATE PWA
   ========================= */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* =========================
   CACHE / OFFLINE
   ========================= */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy).catch(() => {});
        });

        return response;
      })
      .catch(() =>
        caches.match(event.request).then(response =>
          response || caches.match('./index.html')
        )
      )
  );
});

/* =========================
   PUSH NOTIFICATION
   ========================= */
self.addEventListener('push', event => {
  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    try {
      data = {
        body: event.data ? event.data.text() : ''
      };
    } catch (e) {
      data = {};
    }
  }

  const title =
    data.title ||
    'PUMALA — Pesanan Baru';

  const body =
    data.body ||
    data.message ||
    'Ada pesanan baru masuk. Silakan buka PUMALA untuk melihat pesanan.';

  const options = {
    body: body,

    icon: data.icon || './icon-192.png',
    badge: data.badge || './icon-192.png',

    tag: data.tag || 'pumala-pesanan-baru',

    renotify: true,
    requireInteraction: true,

    vibrate: [300, 100, 300, 100, 500],

    data: {
      url: data.url || './',
      orderId: data.orderId || data.order_id || null,
      orderNo: data.orderNo || data.order_no || null
    },

    actions: [
      {
        action: 'open',
        title: 'Lihat Pesanan'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/* =========================
   KLIK NOTIFIKASI
   ========================= */
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const data = event.notification.data || {};
  const targetUrl = data.url || './';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {

      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }

      return null;
    })
  );
});

/* =========================
   NOTIFIKASI DITUTUP
   ========================= */
self.addEventListener('notificationclose', event => {});

/* =========================
   UPDATE SERVICE WORKER
   ========================= */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
