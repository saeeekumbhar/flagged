importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Default config from process.env replacement or manual config
// We can't easily use Vite env vars in a public/ static file, so we expect the app
// to initialize it properly or we inject it during build.
// Since we are creating a generic sw, we will initialize with placeholder 
// that can be configured by the user later if they actually deploy to Firebase.

firebase.initializeApp({
  apiKey: "AIzaSyCoUBvwt9OATx1zxVUKSukCOl1szdkMQWs",
  authDomain: "flagged-6cc81.firebaseapp.com",
  projectId: "flagged-6cc81",
  storageBucket: "flagged-6cc81.firebasestorage.app",
  messagingSenderId: "435661819450",
  appId: "1:435661819450:web:bde2c536f456972ea5ef03"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'FLAGGED Update';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/title_logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
