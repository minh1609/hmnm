import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyClmCNiFmAOZT3KSe8sqZOTQV5lFR1-j7M',
    authDomain: 'pet1609-cf0d7.firebaseapp.com',
    projectId: 'pet1609-cf0d7',
    storageBucket: 'pet1609-cf0d7.firebasestorage.app',
    messagingSenderId: '628143755763',
    appId: '1:628143755763:web:997d3b8c16095d4b61c286',
    measurementId: 'G-TZ6WH7J1HS',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
export const auth = getAuth(app);
