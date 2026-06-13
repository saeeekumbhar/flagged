import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCoUBvwt9OATx1zxVUKSukCOl1szdkMQWs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "flagged-6cc81.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "flagged-6cc81",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "flagged-6cc81.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "435661819450",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:435661819450:web:bde2c536f456972ea5ef03"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const functions = getFunctions(app);

// Use local emulator if in development
if (import.meta.env.DEV) {
  import('firebase/functions').then(({ connectFunctionsEmulator }) => {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    console.log("Connected to Firebase Functions Emulator");
  });
}

let messaging: any = null;
isMessagingSupported().then(supported => {
  if (supported) {
    messaging = getMessaging(app);
  }
});
export { messaging };

let analytics: any = null;
isAnalyticsSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
export { analytics };

export const logAnalyticsEvent = async (eventName: string, params?: any) => {
  try {
    const { logEvent } = await import('firebase/analytics');
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch (e) {
    console.warn('Analytics logging failed', e);
  }
};
