import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// Save product without image
export const saveAffiliateLink = async (title, description, affiliateUrl, category) => {
  const newLink = {
    title,
    description,
    affiliateUrl,
    category,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, 'products'), newLink);
  return { id: docRef.id, ...newLink };
};

export const getAffiliateLinks = async () => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteAffiliateLink = async (id) => {
  await deleteDoc(doc(db, 'products', id));
};

export const redirectToAffiliate = (affiliateUrl) => {
  window.location.href = affiliateUrl;
};

export const trackClick = (id) => {
  const clickData = JSON.parse(localStorage.getItem('clickData') || '{}');
  clickData[id] = (clickData[id] || 0) + 1;
  localStorage.setItem('clickData', JSON.stringify(clickData));
};
