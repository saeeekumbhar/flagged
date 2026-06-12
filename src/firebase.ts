import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoUBvwt9OATx1zxVUKSukCOl1szdkMQWs",
  authDomain: "flagged-6cc81.firebaseapp.com",
  projectId: "flagged-6cc81",
  storageBucket: "flagged-6cc81.firebasestorage.app",
  messagingSenderId: "435661819450",
  appId: "1:435661819450:web:bde2c536f456972ea5ef03"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
