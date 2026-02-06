import requests
import os
from bs4 import BeautifulSoup
import re

class EarnkaroConverter:
    """Service to convert product URLs to Earnkaro affiliate links"""
    
    def __init__(self):
        self.api_token = os.getenv("EARNKARO_API_TOKEN")
        self.base_url = "https://ekaro-api.affiliaters.in/api/converter/public"
    
    def convert_url(self, product_url: str) -> dict:
        """
        Convert regular product URL to Earnkaro affiliate link
        
        Args:
            product_url: Original product URL (e.g., Flipkart, Amazon, etc.)
            
        Returns:
            dict with 'success', 'data' (converted URL), or 'error'
        """
        try:
            payload = {
                "deal": product_url,
                "convert_option": "convert_only"
            }
            
            headers = {
                'Authorization': f'Bearer {self.api_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=10)
            result = response.json()
            
            return result
            
        except requests.exceptions.Timeout:
            return {"error": 1, "message": "Request timeout. Please try again."}
        except requests.exceptions.RequestException as e:
            return {"error": 1, "message": f"Network error: {str(e)}"}
        except Exception as e:
            return {"error": 1, "message": f"Conversion failed: {str(e)}"}
    
    def scrape_product_details(self, url: str) -> dict:
        """
        Scrape product details from the original URL
        
        Args:
            url: Product URL to scrape
            
        Returns:
            dict with title, image, price, description, category
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Initialize result
            details = {
                "title": "",
                "imageUrl": "",
                "price": "",
                "description": "",
                "category": ""
            }
            
            # Detect platform and scrape accordingly
            if "flipkart.com" in url:
                details = self._scrape_flipkart(soup, url)
            elif "amazon.in" in url or "amazon.com" in url:
                details = self._scrape_amazon(soup, url)
            else:
                # Generic scraping
                details = self._scrape_generic(soup, url)
            
            return details
            
        except Exception as e:
            print(f"Scraping error: {str(e)}")
            return {
                "title": "",
                "imageUrl": "",
                "price": "",
                "description": "",
                "category": ""
            }
    
    def _scrape_flipkart(self, soup, url) -> dict:
        """Scrape Flipkart product details with multiple fallback selectors"""
        details = {}
        
        # Title - try multiple selectors
        title_selectors = [
            ('span', {'class': 'VU-ZEz'}),  # New Flipkart class
            ('span', {'class': 'B_NuCI'}),
            ('h1', {'class': 'yhB1nd'}),
            ('h1', {'class': '_35KyD6'}),
            ('meta', {'property': 'og:title'}),
        ]
        
        title = ""
        for tag_name, attrs in title_selectors:
            title_tag = soup.find(tag_name, attrs)
            if title_tag:
                if tag_name == 'meta':
                    title = title_tag.get('content', '')
                else:
                    title = title_tag.text.strip()
                if title:
                    break
        
        details['title'] = title
        print(f"Flipkart Title: {title[:50] if title else 'NOT FOUND'}")
        
        # Image - try multiple selectors
        img_selectors = [
            ('img', {'class': '_53J4C-'}),  # New Flipkart class
            ('img', {'class': '_396cs4'}),
            ('img', {'class': '_2r_T1I'}),
            ('img', {'class': 'q6DClP'}),
            ('meta', {'property': 'og:image'}),
        ]
        
        image_url = ""
        for tag_name, attrs in img_selectors:
            img_tag = soup.find(tag_name, attrs)
            if img_tag:
                if tag_name == 'meta':
                    image_url = img_tag.get('content', '')
                else:
                    image_url = img_tag.get('src', '') or img_tag.get('data-src', '')
                if image_url:
                    break
        
        details['imageUrl'] = image_url
        print(f"Flipkart Image: {image_url[:50] if image_url else 'NOT FOUND'}")
        
        # Price - try multiple selectors and patterns
        price_selectors = [
            ('div', {'class': 'Nx9bqj'}),  # New Flipkart class
            ('div', {'class': 'CxhGGd'}),  # Another new class
            ('div', {'class': '_30jeq3'}),
            ('div', {'class': '_25b18c'}),
            ('div', {'class': '_16Jk6d'}),
        ]
        
        price = ""
        for tag_name, attrs in price_selectors:
            price_tag = soup.find(tag_name, attrs)
            if price_tag:
                price = price_tag.text.strip()
                if price and '₹' in price:
                    break
        
        # If still no price, try regex search in page
        if not price:
            price_pattern = re.compile(r'₹[\d,]+')
            price_matches = soup.find_all(text=price_pattern)
            if price_matches:
                price = price_matches[0].strip()
        
        details['price'] = price
        print(f"Flipkart Price: {price if price else 'NOT FOUND'}")
        
        # Description - try multiple selectors
        desc_selectors = [
            ('div', {'class': '_1mXcCf'}),
            ('div', {'class': '_3eAQiD'}),
            ('div', {'class': 'yN+eNk'}),
            ('meta', {'name': 'description'}),
        ]
        
        description = ""
        for tag_name, attrs in desc_selectors:
            desc_tag = soup.find(tag_name, attrs)
            if desc_tag:
                if tag_name == 'meta':
                    description = desc_tag.get('content', '')
                else:
                    description = desc_tag.text.strip()
                if description:
                    break
        
        details['description'] = description[:200] if description else ""
        print(f"Flipkart Description: {description[:50] if description else 'NOT FOUND'}")
        
        # Category - extract from URL or breadcrumbs
        category = self._extract_category(url, soup)
        details['category'] = category
        print(f"Flipkart Category: {category if category else 'NOT FOUND'}")
        
        return details
    
    def _extract_category(self, url, soup):
        """Extract category from URL or page breadcrumbs"""
        # Try to get from breadcrumbs first
        breadcrumb = soup.find('div', {'class': '_2whKao'})
        if breadcrumb:
            links = breadcrumb.find_all('a')
            if len(links) > 1:
                return links[1].text.strip()
        
        # Fallback: extract from URL
        category_keywords = {
            'mobile': 'Electronics',
            'laptop': 'Electronics',
            'electronics': 'Electronics',
            'fashion': 'Fashion',
            'clothing': 'Fashion',
            'shoes': 'Fashion',
            'home': 'Home & Kitchen',
            'kitchen': 'Home & Kitchen',
            'furniture': 'Home & Kitchen',
            'beauty': 'Beauty & Daily Needs',
            'sports': 'Sports',
            'fitness': 'Sports',
            'books': 'Books',
            'toys': 'Toys & Games',
            'grocery': 'Grocery',
        }
        
        url_lower = url.lower()
        for keyword, category in category_keywords.items():
            if keyword in url_lower:
                return category
        
        return "General"
    
    def _scrape_amazon(self, soup) -> dict:
        """Scrape Amazon product details"""
        details = {}
        
        # Title
        title_tag = soup.find('span', {'id': 'productTitle'})
        details['title'] = title_tag.text.strip() if title_tag else ""
        
        # Image
        img_tag = soup.find('img', {'id': 'landingImage'}) or soup.find('img', {'class': 'a-dynamic-image'})
        details['imageUrl'] = img_tag['src'] if img_tag and 'src' in img_tag.attrs else ""
        
        # Price
        price_tag = soup.find('span', {'class': 'a-price-whole'})
        details['price'] = f"₹{price_tag.text.strip()}" if price_tag else ""
        
        # Description
        desc_tag = soup.find('div', {'id': 'feature-bullets'})
        details['description'] = desc_tag.text.strip()[:200] if desc_tag else ""
        
        return details
    
    def _scrape_generic(self, soup) -> dict:
        """Generic scraping for unknown platforms"""
        details = {}
        
        # Try to find title from meta tags or h1
        title_tag = soup.find('meta', {'property': 'og:title'}) or soup.find('h1')
        details['title'] = title_tag.get('content', '') if title_tag and title_tag.name == 'meta' else (title_tag.text.strip() if title_tag else "")
        
        # Try to find image from meta tags
        img_tag = soup.find('meta', {'property': 'og:image'})
        details['imageUrl'] = img_tag.get('content', '') if img_tag else ""
        
        # Try to find price
        price_pattern = re.compile(r'₹[\d,]+')
        price_match = soup.find(text=price_pattern)
        details['price'] = price_match.strip() if price_match else ""
        
        # Try to find description
        desc_tag = soup.find('meta', {'name': 'description'}) or soup.find('meta', {'property': 'og:description'})
        details['description'] = desc_tag.get('content', '')[:200] if desc_tag else ""
        
        return details
