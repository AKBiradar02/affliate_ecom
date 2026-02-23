from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
import logging
from amazon_creatorsapi import AmazonCreatorsApi, Country
from services.earnkaro_converter import EarnkaroConverter

# ─── Pydantic models ──────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    keywords: str
    category: Optional[str] = None


class AdvancedSearchRequest(BaseModel):
    keywords: str
    category: Optional[str] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    min_rating: Optional[int] = None
    brand: Optional[str] = None
    prime_only: Optional[bool] = False
    sort_by: Optional[str] = None
    page: Optional[int] = 1
    items_per_page: Optional[int] = 10


class EarnkaroConvertRequest(BaseModel):
    url: str


# ─── Setup ────────────────────────────────────────────────────────────────────

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AffiliStore Deals API", version="1.0.0")

# CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "https://affliate-ecom.vercel.app",
    "https://affliate-ecom-git-main-abhay-biradars-projects.vercel.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://affliate-ecom.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Amazon Creators API Configuration ───────────────────────────────────────

AMAZON_CREDENTIAL_ID = os.getenv("AMAZON_CREDENTIAL_ID", "")
AMAZON_CREDENTIAL_SECRET = os.getenv("AMAZON_CREDENTIAL_SECRET", "")
AMAZON_API_VERSION = os.getenv("AMAZON_API_VERSION", "2.2")
AMAZON_MARKETPLACE = os.getenv("AMAZON_MARKETPLACE", "www.amazon.in")
AMAZON_PARTNER_TAG = os.getenv("AMAZON_PARTNER_TAG", "")

# Initialize Creators API client
amazon_api = AmazonCreatorsApi(
    credential_id=AMAZON_CREDENTIAL_ID,
    credential_secret=AMAZON_CREDENTIAL_SECRET,
    version=AMAZON_API_VERSION,
    tag=AMAZON_PARTNER_TAG,
    country=Country.IN,
)

# ─── Categories ───────────────────────────────────────────────────────────────

CATEGORIES = {
    "Home & Kitchen": "HomeAndKitchen",
    "Fashion": "Fashion",
    "Electronics": "Electronics",
    "Sports": "SportingGoods",
    "Beauty & Daily Needs": "Beauty",
    "Grooming & Wellness": "HealthPersonalCare",
}

# ─── Cache ────────────────────────────────────────────────────────────────────

deals_cache: Dict[str, List] = {}
cache_timestamp: Dict[str, datetime] = {}
CACHE_DURATION = timedelta(hours=24)

search_cache: Dict[str, Dict] = {}
search_cache_timestamp: Dict[str, datetime] = {}
SEARCH_CACHE_DURATION = timedelta(hours=24)


def is_cache_valid(key: str, ts_dict: Dict) -> bool:
    if key not in ts_dict:
        return False
    return datetime.now() - ts_dict[key] < CACHE_DURATION


# ─── Item Parser ──────────────────────────────────────────────────────────────

def _parse_item(item) -> dict:
    """Extract fields from a Creators API item object."""
    title = ""
    try:
        title = item.item_info.title.display_value
    except Exception:
        pass

    image_url = None
    try:
        if item.images and item.images.primary:
            if item.images.primary.large:
                image_url = item.images.primary.large.url
            elif item.images.primary.medium:
                image_url = item.images.primary.medium.url
    except Exception:
        pass

    price = None
    original_price = None
    discount_percent = 0
    is_prime = False

    try:
        if item.offers and item.offers.listings:
            listing = item.offers.listings[0]
            if listing.price and listing.price.display_amount:
                price = listing.price.display_amount
            try:
                if listing.saving_basis and listing.saving_basis.display_amount:
                    original_price = listing.saving_basis.display_amount
                    curr = float(listing.price.amount)
                    orig = float(listing.saving_basis.amount)
                    if orig > 0:
                        discount_percent = int(((orig - curr) / orig) * 100)
            except Exception:
                pass
            try:
                is_prime = listing.delivery_info.is_prime_eligible or False
            except Exception:
                pass
    except Exception:
        pass

    description = ""
    try:
        if item.item_info and item.item_info.features:
            description = " ".join(
                [f.display_value for f in item.item_info.features.display_values[:2]]
            )
    except Exception:
        pass

    detail_url = ""
    try:
        detail_url = item.detail_page_url or ""
    except Exception:
        pass

    return {
        "asin": getattr(item, "asin", ""),
        "title": title,
        "description": description,
        "imageUrl": image_url,
        "price": price,
        "originalPrice": original_price,
        "discountPercent": discount_percent,
        "isPrime": is_prime,
        "detailPageURL": detail_url,
    }


def fetch_deals_from_amazon(category: str, max_items: int = 10) -> List[Dict]:
    """Fetch discounted deals for a category."""
    try:
        search_index = CATEGORIES.get(category, "All")
        result = amazon_api.search_items(
            keywords=f"{category} deals discount",
            search_index=search_index,
            item_count=max_items,
        )
        items = result.items if result and result.items else []
        deals = []
        for item in items:
            try:
                data = _parse_item(item)
                data["category"] = category
                if data["discountPercent"] > 0:
                    deals.append(data)
            except Exception as e:
                logger.error(f"Error parsing item: {e}")
        logger.info(f"Found {len(deals)} deals for {category}")
        return deals
    except Exception as e:
        logger.error(f"Error fetching deals for {category}: {e}")
        return []


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "online", "message": "AffiliStore Deals API", "version": "1.0.0"}


@app.get("/api/deals")
async def get_deals():
    """Get Amazon deals. Returns empty array on failure (frontend shows Coming Soon)."""
    try:
        result = amazon_api.search_items(
            keywords="deals offers",
            search_index="All",
            item_count=20,
        )
        items = result.items if result and result.items else []
        deals = []
        for item in items:
            try:
                data = _parse_item(item)
                deals.append({
                    "asin": data["asin"],
                    "title": data["title"],
                    "image_url": data["imageUrl"],
                    "price": data["price"],
                    "original_price": data["originalPrice"],
                    "discount_percent": data["discountPercent"],
                    "detail_url": data["detailPageURL"],
                })
            except Exception as e:
                logger.error(f"Error parsing deal item: {e}")
        logger.info(f"Fetched {len(deals)} deals")
        return {"deals": deals, "total": len(deals)}
    except Exception as e:
        logger.error(f"Error fetching deals: {e}")
        return {"deals": [], "total": 0}


@app.get("/api/deals/{category}")
async def get_category_deals(category: str, refresh: bool = False):
    """Get deals for a specific category with 24h caching."""
    if category not in CATEGORIES:
        raise HTTPException(status_code=404, detail=f"Category '{category}' not found")

    if not refresh and is_cache_valid(category, cache_timestamp):
        deals = deals_cache[category]
    else:
        deals = fetch_deals_from_amazon(category)
        deals_cache[category] = deals
        cache_timestamp[category] = datetime.now()

    return {
        "category": category,
        "total": len(deals),
        "deals": deals,
        "cached_at": cache_timestamp.get(category, datetime.now()).isoformat(),
        "cache_valid_until": (cache_timestamp.get(category, datetime.now()) + CACHE_DURATION).isoformat(),
    }


@app.get("/api/categories")
async def get_categories():
    return {"categories": list(CATEGORIES.keys())}


@app.post("/api/search")
async def search_products(request: SearchRequest):
    """Search Amazon products by keywords."""
    if not request.keywords:
        raise HTTPException(status_code=400, detail="Keywords are required")

    try:
        search_index = CATEGORIES.get(request.category, "All") if request.category else "All"
        result = amazon_api.search_items(
            keywords=request.keywords,
            search_index=search_index,
            item_count=10,
        )
        items = result.items if result and result.items else []
        products = []
        for item in items:
            try:
                data = _parse_item(item)
                products.append({
                    "title": data["title"],
                    "description": data["description"],
                    "imageUrl": data["imageUrl"],
                    "price": data["price"],
                    "detailPageURL": data["detailPageURL"],
                })
            except Exception as e:
                logger.error(f"Error parsing item: {e}")
        return {"products": products, "total": len(products)}
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/amazon/search-advanced")
async def search_amazon_advanced(request: AdvancedSearchRequest):
    """Advanced Amazon search with filters, sorting, and 24h caching."""
    if not request.keywords:
        raise HTTPException(status_code=400, detail="Keywords are required")

    cache_key = (
        f"{request.keywords}_{request.category}_{request.min_price}_"
        f"{request.max_price}_{request.min_rating}_{request.brand}_"
        f"{request.prime_only}_{request.sort_by}_{request.page}"
    )

    if is_cache_valid(cache_key, search_cache_timestamp):
        cached = search_cache[cache_key]
        cached["cached"] = True
        cached["cached_at"] = search_cache_timestamp[cache_key].isoformat()
        return cached

    try:
        search_index = CATEGORIES.get(request.category, "All") if request.category else "All"

        search_params = {
            "keywords": request.keywords,
            "search_index": search_index,
            "item_count": min(request.items_per_page, 10),
            "item_page": min(request.page, 10),
        }
        if request.sort_by and request.sort_by != "Relevance":
            search_params["sort_by"] = request.sort_by

        result = amazon_api.search_items(**search_params)
        items = result.items if result and result.items else []

        products = []
        for item in items:
            try:
                data = _parse_item(item)
                # Client-side filters (Creators API doesn't support all server-side filters)
                if request.min_price and data["price"]:
                    try:
                        price_val = float(data["price"].replace("₹", "").replace(",", ""))
                        if price_val < request.min_price / 100:
                            continue
                    except Exception:
                        pass
                if request.max_price and data["price"]:
                    try:
                        price_val = float(data["price"].replace("₹", "").replace(",", ""))
                        if price_val > request.max_price / 100:
                            continue
                    except Exception:
                        pass
                if request.prime_only and not data["isPrime"]:
                    continue
                products.append(data)
            except Exception as e:
                logger.error(f"Error parsing item: {e}")

        current_time = datetime.now()
        response_data = {
            "products": products,
            "total": len(products),
            "totalResults": len(products),
            "currentPage": request.page,
            "itemsPerPage": request.items_per_page,
            "hasMore": False,
            "cached": False,
            "timestamp": current_time.isoformat(),
            "cached_at": None,
        }

        search_cache[cache_key] = response_data
        search_cache_timestamp[cache_key] = current_time
        return response_data

    except Exception as e:
        logger.error(f"Advanced search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/refresh-cache")
async def refresh_cache():
    """Manually refresh all deals cache."""
    for category in CATEGORIES.keys():
        deals = fetch_deals_from_amazon(category)
        deals_cache[category] = deals
        cache_timestamp[category] = datetime.now()
    return {"status": "success", "message": "Cache refreshed", "timestamp": datetime.now().isoformat()}


# ─── Earnkaro Smart Import ────────────────────────────────────────────────────

@app.post("/api/earnkaro/convert")
async def convert_earnkaro_url(request: EarnkaroConvertRequest):
    """Convert product URL to Earnkaro affiliate link and scrape product details."""
    try:
        logger.info(f"Converting URL: {request.url}")
        converter = EarnkaroConverter()

        # Step 1: Convert the URL to an affiliate link
        conversion_result = converter.convert_url(request.url)
        if conversion_result.get("error"):
            raise HTTPException(status_code=400, detail=conversion_result.get("message", "Conversion failed"))

        # Step 2: Try direct scraping first (fast, uses og: meta tags)
        product_details = converter.scrape_product_details(request.url)

        # Step 3: If direct scraping got nothing (bot-protected site like Ajio),
        # fall back to Earnkaro's own scraping API — their servers are whitelisted
        # by affiliate partner platforms, bypassing Cloudflare/bot protection.
        if not product_details.get("title") and not product_details.get("imageUrl"):
            logger.info("Direct scrape failed, trying Earnkaro convert_and_scrape...")
            ek_data = converter.convert_and_scrape(request.url)
            # Earnkaro returns product info in different possible keys
            if ek_data and not ek_data.get("error"):
                product_details["title"] = (
                    ek_data.get("product_name") or
                    ek_data.get("title") or
                    ek_data.get("name") or
                    product_details.get("title", "")
                )
                product_details["imageUrl"] = (
                    ek_data.get("image") or
                    ek_data.get("imageUrl") or
                    ek_data.get("product_image") or
                    product_details.get("imageUrl", "")
                )
                product_details["price"] = (
                    ek_data.get("price") or
                    ek_data.get("selling_price") or
                    product_details.get("price", "")
                )

        return {
            "success": True,
            "affiliateUrl": conversion_result.get("data", ""),
            "title": product_details.get("title", ""),
            "imageUrl": product_details.get("imageUrl", ""),
            "price": product_details.get("price", ""),
            "description": product_details.get("description", ""),
            "category": product_details.get("category", ""),
            "platform": "Earnkaro",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Earnkaro conversion error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to convert URL: {e}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
