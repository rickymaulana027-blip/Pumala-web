/* =========================================================
   PUMALA - Service Worker
   Web Push Notification
   ========================================================= */

const APP_URL = '/';

/* ---------------------------------------------------------
   INSTALL
   --------------------------------------------------------- */
self.addEventListener('install', event => {
  self.skipWaiting();
});

/* ---------------------------------------------------------
   ACTIVATE
   --------------------------------------------------------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.claim()
  );
});

/* ---------------------------------------------------------
   PUSH
   Menerima notifikasi dari server.
   Bagian ini tetap bekerja walaupun halaman kasir
   sedang ditutup.
   --------------------------------------------------------- */
self.addEventListener('push', event => {

  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {

    try {
      data = {
        body: event.data
          ? event.data.text()
          : ''
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

    icon:
      data.icon ||
      '/icon-192.png',

    badge:
      data.badge ||
      '/icon-192.png',

    tag:
      data.tag ||
      'pumala-pesanan-baru',

    renotify: true,

    requireInteraction: true,

    vibrate: [
      300,
      100,
      300,
      100,
      500
    ],

    data: {

      url:
        data.url ||
        APP_URL,

      orderId:
        data.orderId ||
        data.order_id ||
        null,

      orderNo:
        data.orderNo ||
        data.order_no ||
        null

    },

    actions: [
      {
        action: 'open',
        title: 'Lihat Pesanan'
      }
    ]

  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );

});

/* ---------------------------------------------------------
   NOTIFICATION CLICK
   --------------------------------------------------------- */
self.addEventListener(
  'notificationclick',
  event => {

    event.notification.close();

    const data =
      event.notification.data || {};

    const targetUrl =
      data.url ||
      APP_URL;

    event.waitUntil(

      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      })

      .then(clientList => {

        /*
         * Kalau PUMALA sudah terbuka,
         * fokus ke jendelanya.
         */
        for (const client of clientList) {

          if ('focus' in client) {
            return client.focus();
          }

        }

        /*
         * Kalau PUMALA belum terbuka,
         * buka PUMALA.
         */
        if (clients.openWindow) {
          return clients.openWindow(
            targetUrl
          );
        }

        return null;

      })

    );

  }
);

/* ---------------------------------------------------------
   NOTIFICATION CLOSE
   --------------------------------------------------------- */
self.addEventListener(
  'notificationclose',
  event => {

    // Tidak ada tindakan khusus.

  }
);

/* ---------------------------------------------------------
   MESSAGE
   --------------------------------------------------------- */
self.addEventListener(
  'message',
  event => {

    if (
      event.data ===
      'SKIP_WAITING'
    ) {

      self.skipWaiting();

    }

  }
);
