// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBGEXGTew8kXBixMQlEhvyljvMQUBiqOL0",
  authDomain: "familjekalender-reis.firebaseapp.com",
  projectId: "familjekalender-reis",
  storageBucket: "familjekalender-reis.firebasestorage.app",
  messagingSenderId: "197443174169",
  appId: "1:197443174169:web:3c0731c8b267f2b019cf88"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload);
  const notificationTitle = payload.notification?.title || 'Vardagspusslet';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/Familj/vardagspusslet.png',
    badge: '/Familj/vardagspusslet.png',
    data: payload.data || {},
    tag: payload.data?.eventId || 'vardagspusslet',
    requireInteraction: false
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click handler — open the app when notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || 'https://terrazzospec.github.io/Familj/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('terrazzospec.github.io/Familj') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
