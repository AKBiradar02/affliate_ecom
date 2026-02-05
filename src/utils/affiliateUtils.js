import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase.js"; // Fixed import

export const getAffiliateLinks = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};


const API_BASE = "https://us-central1-affiliate-ecom-694b2.cloudfunctions.net";

export const addAffiliateLink = async (productData) => {
  const password = localStorage.getItem("adminPassword");

  const res = await fetch(`${API_BASE}/addProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...productData, password }),
  });

  if (!res.ok) {
    throw new Error("Failed to add product");
  }

  return res.json();
};

export const deleteAffiliateLink = async (id) => {
  const password = localStorage.getItem("adminPassword");

  const res = await fetch(`${API_BASE}/deleteProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
};

export const addBlogPost = async (blogData) => {
  const password = localStorage.getItem("adminPassword");

  const res = await fetch(`${API_BASE}/addBlog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...blogData, password }),
  });

  if (!res.ok) {
    throw new Error("Failed to add blog");
  }

  return res.json();
};

export const redirectToAffiliate = (url) => {
  window.open(url, '_blank');
};
