importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Konfigurasi Firebase (Sesuaikan jika diperlukan)
firebase.initializeApp({
  apiKey: "AIzaSyDRhtV_93D6m6IurrvUQvG10ye6FR7c8LE", 
  authDomain: "pumala-23.firebaseapp.com",
  projectId: "pumala-23",
  storageBucket: "pumala-23.firebasestorage.app",
  messagingSenderId: "255115476195",
  appId: "1:255115476195:web:1eec2931f502c8c5c0d9d6"
});

const messaging = firebase.messaging();

// Menangani notifikasi yang masuk saat halaman/aplikasi sedang di latar belakang
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Pesan latar belakang diterima: ', payload);

  const notificationTitle = payload.notification?.title || 'Pesanan Baru!';
  const notificationOptions = {
    body: payload.notification?.body || 'Ada pesanan masuk di PUMALA.',
    icon: '/icon.png', // Ganti sesuai path ikon aplikasi Anda jika ada
    badge: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
