import { FirebaseService } from './FirebaseService';

export const NotificationService = {
  isSupported: () => 'Notification' in window,
  
  requestPermission: async (): Promise<string> => {
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) return 'missing_config';
    if (!NotificationService.isSupported()) return 'Not supported';

    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        const { messaging, auth } = await import('../firebase');
        if (messaging && auth.currentUser) {
          const swUrl = `/firebase-messaging-sw.js?apiKey=${import.meta.env.VITE_FIREBASE_API_KEY}&authDomain=${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}&projectId=${import.meta.env.VITE_FIREBASE_PROJECT_ID}&storageBucket=${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}&messagingSenderId=${import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID}&appId=${import.meta.env.VITE_FIREBASE_APP_ID}`;
          
          let registration;
          if ('serviceWorker' in navigator) {
            registration = await navigator.serviceWorker.register(swUrl);
          }

          const { getToken } = await import('firebase/messaging');
          const token = await getToken(messaging, { 
            vapidKey,
            serviceWorkerRegistration: registration 
          });
          
          if (token) {
            await FirebaseService.updateUserFCMToken(auth.currentUser.uid, token);
          }
        }
      }
      return perm;
    } catch (e) {
      console.warn('Notification permission error', e);
      return 'error';
    }
  }
};
