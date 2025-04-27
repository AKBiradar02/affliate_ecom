import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAg38GM8gzIKMQR1vs2aW6TgejZrmH7vk8",
  authDomain: "affiliate-ecom-694b2.firebaseapp.com",
  projectId: "affiliate-ecom-694b2",
  storageBucket: "affiliate-ecom-694b2.firebasestorage.app",
  messagingSenderId: "938022426554",
  appId: "1:938022426554:web:033da5df06172b8c08ef83",
  measurementId: "G-WXHMWNDVK1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
