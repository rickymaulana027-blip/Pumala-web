importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Ganti dengan Config Firebase Project Anda
const firebaseConfig = {
  apiKey: "API_KEY_FIREBASE_ANDA",
  authDomain: "PROJECT_ID_ANDA.firebaseapp.com",
  projectId: "PROJECT_ID_ANDA",
  storageBucket: "PROJECT_ID_ANDA.appspot.com",
  messagingSenderId: "SENDER_ID_ANDA",
  appId: "APP_ID_ANDA"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Menangani Notifikasi Melayang saat HP Layar Terkunci / App Tertutup
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification.title || "🛒 Pesanan Baru Masuk!";
  const options = {
    body: payload.notification.body || "Ada pesanan baru di pumala.my.id",
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [500, 200, 500],
    data: {
      url: 'https://pumala.my.id'
    }
  };

  self.registration.showNotification(title, options);
});

// Buka Dashboard saat Notifikasi diklik
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
