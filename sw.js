self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}
  event.waitUntil(self.registration.showNotification(data.title || '🔔 PUMALA — Pesanan Baru', {
    body: data.body || 'Ada pesanan online baru.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'pumala-order',
    renotify: true,
    vibrate: [300,100,300,100,500],
    data: { url: data.url || '/' }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil((async()=>{
    const clients = await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clients){ if('focus' in client){ await client.focus(); return; } }
    if(self.clients.openWindow) await self.clients.openWindow(url);
  })());
});
