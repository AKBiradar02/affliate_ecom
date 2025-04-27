// Helper function to save affiliate links to localStorage
export const saveAffiliateLink = (title, description, imageUrl, affiliateUrl) => {
  const links = getAffiliateLinks();
  const newLink = {
    id: Date.now().toString(),
    title,
    description,
    imageUrl,
    affiliateUrl,
    createdAt: new Date().toISOString(),
  };
  
  links.push(newLink);
  localStorage.setItem('affiliateLinks', JSON.stringify(links));
  return newLink;
};

// Helper function to get all affiliate links from localStorage
export const getAffiliateLinks = () => {
  const links = localStorage.getItem('affiliateLinks');
  return links ? JSON.parse(links) : [];
};

// Helper function to delete an affiliate link
export const deleteAffiliateLink = (id) => {
  const links = getAffiliateLinks();
  const updatedLinks = links.filter(link => link.id !== id);
  localStorage.setItem('affiliateLinks', JSON.stringify(updatedLinks));
  return updatedLinks;
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