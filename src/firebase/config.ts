import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCtbDdM4NMpfe67x3pQEAGIynr-RUTaW7M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "medi-c3916.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "medi-c3916",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "medi-c3916.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1063273414039",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1063273414039:web:0c3153f7ba659ce780d8d2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C0K4QK6B0J"
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with Offline Persistence Cache enabled
let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
} catch (e) {
  // Fallback if already initialized
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const storage = getStorage(app);

export default app;
