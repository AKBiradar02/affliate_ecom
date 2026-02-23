import requests
import os
from bs4 import BeautifulSoup
import re


class EarnkaroConverter:
    """Service to convert product URLs to Earnkaro affiliate links and scrape product details"""

    def __init__(self):
        self.api_token = os.getenv("EARNKARO_API_TOKEN")
        self.base_url = "https://ekaro-api.affiliaters.in/api/converter/public"

        # WHY this User-Agent?
        # Many e-commerce sites block requests from Python's default "python-requests/x.x"
        # user agent. By mimicking a real Chrome browser on Windows, we avoid bot detection
        # and get the same HTML a normal user would see.
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-IN,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        }

    # ──────────────────────────────────────────────────────────────────────────
    # Earnkaro URL Conversion
    # ──────────────────────────────────────────────────────────────────────────

    def convert_url(self, product_url: str) -> dict:
        """
        Convert a regular product URL to an Earnkaro affiliate link.

        WHY: The Earnkaro API handles the affiliate tracking — we just POST
        the original URL and get back a short affiliate link.
        """
        try:
            payload = {
                "deal": product_url,
                "convert_option": "convert_only"
            }
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=10)
            return response.json()
        except requests.exceptions.Timeout:
            return {"error": 1, "message": "Request timeout. Please try again."}
        except requests.exceptions.RequestException as e:
            return {"error": 1, "message": f"Network error: {str(e)}"}
        except Exception as e:
            return {"error": 1, "message": f"Conversion failed: {str(e)}"}

    def convert_and_scrape(self, product_url: str) -> dict:
        """
        Use Earnkaro's convert_and_scrape option to get product details.

        WHY use this as a fallback?
        Sites like Ajio, Nykaa use Cloudflare bot protection which blocks
        direct requests from our server. Earnkaro's servers are whitelisted
        by these platforms (they're an official affiliate partner), so their
        scraped data bypasses the protection we can't get past.

        Returns dict with keys: title, image, price, description (if available)
        """
        try:
            payload = {
                "deal": product_url,
                "convert_option": "convert_and_scrape"
            }
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json"
            }
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=15)
            result = response.json()
            print(f"[SmartImport] Earnkaro scrape response: {result}")
            return result
        except Exception as e:
            print(f"[SmartImport] Earnkaro scrape error: {e}")
            return {}

    # ──────────────────────────────────────────────────────────────────────────
    # Product Detail Scraping (Main Entry Point)
    # ──────────────────────────────────────────────────────────────────────────

    def scrape_product_details(self, url: str) -> dict:
        """
        Scrape title, image, price, description and category from a product URL.

        WHY og: meta tags are the PRIMARY source now:
        Sites like Myntra, Amazon, Ajio, Nykaa use React/JavaScript to render
        the page in the browser. When our server makes a request with `requests`,
        it gets the HTML BEFORE JavaScript runs — so all the product data that
        normally lives in JS-rendered divs is missing.

        BUT — every e-commerce site embeds Open Graph (og:) meta tags in the
        raw HTML for social previews (WhatsApp, Twitter, etc.). These are:
          - <meta property="og:title" content="Product Name">
          - <meta property="og:image" content="https://...jpg">
          - <meta property="og:description" content="...">

        These are ALWAYS in the initial HTML, no JavaScript needed.
        So we use them first, then fall back to platform-specific CSS selectors
        for price (since og: doesn't include price).
        """
        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            soup = BeautifulSoup(response.content, "html.parser")

            # Step 1: Extract title, image, description from og: tags — works on ALL platforms
            details = self._extract_og_tags(soup)

            # Step 2: Extract price using platform-specific selectors
            # WHY separately? Because og: tags never include price — price is
            # always rendered dynamically or is in a specific element.
            if "flipkart.com" in url:
                details["price"] = self._get_price_flipkart(soup)
                if not details.get("imageUrl"):
                    details["imageUrl"] = self._get_image_flipkart(soup)
                if not details.get("title"):
                    details["title"] = self._get_title_flipkart(soup)
            elif "amazon.in" in url or "amazon.com" in url:
                details["price"] = self._get_price_amazon(soup)
                if not details.get("imageUrl"):
                    details["imageUrl"] = self._get_image_amazon(soup)
            elif "myntra.com" in url:
                details["price"] = self._get_price_myntra(soup)
            elif "ajio.com" in url:
                details["price"] = self._get_price_ajio(soup)
            elif "nykaa.com" in url or "nykaafashion.com" in url:
                # WHY both? nykaa.com is beauty, nykaafashion.com is fashion —
                # same company, same bot protection, same handler works for both.
                details["price"] = self._get_price_nykaa(soup)
                details["category"] = "Beauty & Daily Needs" if "nykaa.com" in url else "Fashion"
            elif "tatacliq.com" in url:
                details["price"] = self._get_price_tatacliq(soup)
            elif "snapdeal.com" in url:
                details["price"] = self._get_price_snapdeal(soup)
            elif "meesho.com" in url:
                details["price"] = self._get_price_meesho(soup)
                details["category"] = self._extract_category(url, soup)
            else:
                # Try Shopify JS price first (Libas, Rigo, many D2C brands use Shopify)
                # WHY? Shopify embeds product JSON in a <script> tag with price_formatted
                # which is always in the raw HTML — no JS execution needed.
                details["price"] = self._get_price_shopify_js(soup) or self._get_price_generic(soup)

            # Step 3: Fill category if not set
            if not details.get("category"):
                details["category"] = self._extract_category(url, soup)

            # Step 4: Ensure all keys exist
            details.setdefault("title", "")
            details.setdefault("imageUrl", "")
            details.setdefault("price", "")
            details.setdefault("description", "")
            details.setdefault("category", "General")

            print(f"[SmartImport] Platform: {self._detect_platform(url)}")
            print(f"[SmartImport] Title: {details['title'][:60] if details['title'] else 'NOT FOUND'}")
            print(f"[SmartImport] Image: {'✓' if details['imageUrl'] else 'NOT FOUND'}")
            print(f"[SmartImport] Price: {details['price'] or 'NOT FOUND'}")

            return details

        except Exception as e:
            print(f"[SmartImport] Scraping error: {e}")
            return {"title": "", "imageUrl": "", "price": "", "description": "", "category": "General"}

    # ──────────────────────────────────────────────────────────────────────────
    # og: Meta Tag Extractor — Works across ALL platforms
    # ──────────────────────────────────────────────────────────────────────────

    def _extract_og_tags(self, soup) -> dict:
        """
        Extract Open Graph meta tags — the most reliable cross-platform method.

        WHY og: tags are reliable:
        - Embedded in the initial HTML response (no JS needed)
        - Standardised format across all e-commerce platforms
        - Used for social sharing previews (WhatsApp, Twitter, Facebook)
        - Always contain high-quality product image and accurate title
        """
        def _og(prop):
            tag = soup.find("meta", property=prop)
            if tag:
                return tag.get("content", "").strip()
            return ""

        def _meta_name(name):
            tag = soup.find("meta", attrs={"name": name})
            if tag:
                return tag.get("content", "").strip()
            return ""

        title = _og("og:title") or _meta_name("title") or ""
        image = _og("og:image") or ""
        description = _og("og:description") or _meta_name("description") or ""

        # WHY truncate description to 200 chars?
        # og:description can be very long. The frontend only shows a short preview.
        return {
            "title": title,
            "imageUrl": image,
            "description": description[:200] if description else "",
            "price": "",
            "category": "",
        }

    def _detect_platform(self, url: str) -> str:
        platforms = ["flipkart", "amazon", "myntra", "ajio", "nykaa", "tatacliq", "snapdeal", "meesho"]
        for p in platforms:
            if p in url:
                return p.capitalize()
        return "Unknown"

    # ──────────────────────────────────────────────────────────────────────────
    # Price Extractors — Per Platform
    # WHY per-platform? Each site uses different HTML structure for prices.
    # We try specific known selectors first, then fall back to regex.
    # ──────────────────────────────────────────────────────────────────────────

    def _get_price_shopify_js(self, soup) -> str:
        """
        WHY Shopify JS extraction?
        Shopify stores (Libas, Rigo, many Indian D2C brands) embed product data
        in a <script> tag as a JS variable with price_formatted containing the rupee price.
        This is in the raw HTML (not JS-rendered), so we can extract it with regex.
        """
        scripts = soup.find_all("script")
        pattern = re.compile(r'price_formatted:\s*`(₹[\d,]+)`')
        for script in scripts:
            if script.string:
                match = pattern.search(script.string)
                if match:
                    return match.group(1)
        return ""

    def _get_price_generic(self, soup) -> str:
        """
        WHY regex as fallback?
        For unknown platforms, we scan ALL visible text for ₹ followed by digits.

        WHY the short-text filter?
        A real price like "₹1,449" is short (≤ 10 chars).
        Promo text like "Get 30% OFF on orders ₹999!" is long — we skip those
        by checking the full surrounding text node length (≤ 25 chars).
        """
        price_pattern = re.compile(r"₹[\d,]+")
        for text_node in soup.find_all(text=price_pattern):
            cleaned = text_node.strip()
            # Skip if the text node is a long promo sentence
            if len(cleaned) <= 25:
                match = price_pattern.search(cleaned)
                if match:
                    return match.group(0)
        return ""

    def _get_price_flipkart(self, soup) -> str:
        # WHY multiple selectors? Flipkart regularly changes their CSS class names.
        # We try the most recent known classes first, then fall back.
        selectors = [
            ("div", {"class": "Nx9bqj"}),
            ("div", {"class": "CxhGGd"}),
            ("div", {"class": "_30jeq3"}),
            ("div", {"class": "_25b18c"}),
        ]
        for tag, attrs in selectors:
            el = soup.find(tag, attrs)
            if el and "₹" in el.text:
                return el.text.strip()
        return self._get_price_generic(soup)

    def _get_title_flipkart(self, soup) -> str:
        selectors = [
            ("span", {"class": "VU-ZEz"}),
            ("span", {"class": "B_NuCI"}),
            ("h1", {"class": "yhB1nd"}),
        ]
        for tag, attrs in selectors:
            el = soup.find(tag, attrs)
            if el and el.text.strip():
                return el.text.strip()
        return ""

    def _get_image_flipkart(self, soup) -> str:
        selectors = [
            ("img", {"class": "_53J4C-"}),
            ("img", {"class": "_396cs4"}),
            ("img", {"class": "q6DClP"}),
        ]
        for tag, attrs in selectors:
            el = soup.find(tag, attrs)
            if el:
                src = el.get("src") or el.get("data-src", "")
                if src:
                    return src
        return ""

    def _get_price_amazon(self, soup) -> str:
        # WHY "a-price-whole"? Amazon splits price into whole + decimal parts.
        # We use the whole part as an approximation.
        el = soup.find("span", {"class": "a-price-whole"})
        if el:
            return f"₹{el.text.strip()}"
        return self._get_price_generic(soup)

    def _get_image_amazon(self, soup) -> str:
        el = soup.find("img", {"id": "landingImage"}) or soup.find("img", {"class": "a-dynamic-image"})
        return el.get("src", "") if el else ""

    def _get_price_myntra(self, soup) -> str:
        selectors = [
            ("span", {"class": "pdp-price"}),
            ("strong", {"class": "pdp-price"}),
            ("div", {"class": "pdp-price"}),
        ]
        for tag, attrs in selectors:
            el = soup.find(tag, attrs)
            if el and el.text.strip():
                return el.text.strip()
        return self._get_price_generic(soup)

    def _get_price_ajio(self, soup) -> str:
        el = soup.find("span", {"class": "prod-sp"}) or soup.find("div", {"class": "prod-sp"})
        if el:
            return el.text.strip()
        return self._get_price_generic(soup)

    def _get_price_nykaa(self, soup) -> str:
        selectors = [
            ("span", {"class": "css-1jczs19"}),
            ("span", {"class": "post-card__content-price-offer"}),
        ]
        for tag, attrs in selectors:
            el = soup.find(tag, attrs)
            if el and el.text.strip():
                return el.text.strip()
        return self._get_price_generic(soup)

    def _get_price_tatacliq(self, soup) -> str:
        el = soup.find("h3", {"class": "ProductDetailsMainCard__price"})
        if el:
            return el.text.strip()
        return self._get_price_generic(soup)

    def _get_price_snapdeal(self, soup) -> str:
        el = soup.find("span", {"itemprop": "price"}) or soup.find("span", {"class": "payBlkBig"})
        if el:
            return f"₹{el.text.strip()}"
        return self._get_price_generic(soup)

    def _get_price_meesho(self, soup) -> str:
        # WHY h5 tag? Meesho uses h5 with specific structure for price display.
        selectors = [
            ("h5", {}),
            ("span", {"class": re.compile(r".*price.*", re.I)}),
        ]
        for tag, attrs in selectors:
            el = soup.find(tag, attrs)
            if el and "₹" in el.text:
                return el.text.strip()
        return self._get_price_generic(soup)

    # ──────────────────────────────────────────────────────────────────────────
    # Category Extractor
    # ──────────────────────────────────────────────────────────────────────────

    def _extract_category(self, url: str, soup) -> str:
        """
        WHY keyword matching on URL?
        Category is rarely in og: tags or easy to scrape. But product URLs almost
        always have the category in the path (e.g. /mobiles/, /laptops/, /fashion/).
        This is reliable and fast.
        """
        category_keywords = {
            "mobile": "Electronics",
            "phone": "Electronics",
            "laptop": "Electronics",
            "electronics": "Electronics",
            "tv": "Electronics",
            "tablet": "Electronics",
            "fashion": "Fashion",
            "clothing": "Fashion",
            "shoes": "Fashion",
            "shirt": "Fashion",
            "saree": "Fashion",
            "kurta": "Fashion",
            "dress": "Fashion",
            "home": "Home & Kitchen",
            "kitchen": "Home & Kitchen",
            "furniture": "Home & Kitchen",
            "appliance": "Home & Kitchen",
            "beauty": "Beauty & Daily Needs",
            "skincare": "Beauty & Daily Needs",
            "makeup": "Beauty & Daily Needs",
            "haircare": "Beauty & Daily Needs",
            "sports": "Sports",
            "fitness": "Sports",
            "gym": "Sports",
            "books": "Books",
            "toys": "Toys & Games",
            "grocery": "Grocery",
            "grooming": "Grooming & Wellness",
            "wellness": "Grooming & Wellness",
        }
        url_lower = url.lower()
        for keyword, category in category_keywords.items():
            if keyword in url_lower:
                return category
        return "General"
