import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// Add a new product to Firestore
export const saveAffiliateLink = async (title, description, imageUrl, affiliateUrl) => {
  const newLink = {
    title,
    description,
    imageUrl,
    affiliateUrl,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, 'products'), newLink);
  return { id: docRef.id, ...newLink };
};

// Get all products from Firestore, sorted by newest first
export const getAffiliateLinks = async () => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Delete a product from Firestore
export const deleteAffiliateLink = async (id) => {
  await deleteDoc(doc(db, 'products', id));
};

// Helper function for redirecting to Amazon with affiliate link
export const redirectToAffiliate = (id) => {
  const links = getAffiliateLinks();
  const link = links.find(link => link.id === id);
  
  if (link) {
    // Optionally track click before redirect
    trackClick(id);
    window.location.href = link.affiliateUrl;
  }
  return null;
};

// Helper function to track clicks (can be expanded with analytics)
const trackClick = (id) => {
  const links = getAffiliateLinks();
  const linkIndex = links.findIndex(link => link.id === id);
  
  if (linkIndex !== -1) {
    const clickData = JSON.parse(localStorage.getItem('clickData') || '{}');
    clickData[id] = (clickData[id] || 0) + 1;
    localStorage.setItem('clickData', JSON.stringify(clickData));
  }
}; 