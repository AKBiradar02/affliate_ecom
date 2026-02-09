from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
from amazon_creatorsapi import AmazonCreatorsApi
import logging
from services.earnkaro_converter import EarnkaroConverter

# Pydantic models
class SearchRequest(BaseModel):
    keywords: str
    category: Optional[str] = None


class AdvancedSearchRequest(BaseModel):
    """Request model for advanced Amazon search with filters"""
    keywords: str
    category: Optional[str] = None
    min_price: Optional[int] = None  # Price in paise (₹100 = 10000 paise)
    max_price: Optional[int] = None
    min_rating: Optional[int] = None  # 1-5 stars
    brand: Optional[str] = None
    prime_only: Optional[bool] = False
    sort_by: Optional[str] = None  # Relevance, Price:LowToHigh, etc.
    page: Optional[int] = 1
    items_per_page: Optional[int] = 10

class EarnkaroConvertRequest(BaseModel):
    url: str

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AffiliStore Deals API", version="1.0.0")

# CORS middleware
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    FRONTEND_URL, 
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://affliate-ecom.vercel.app",  # Production Vercel URL
    "https://affliate-ecom-git-main-abhay-biradars-projects.vercel.app",  # Vercel preview URL
]

# Allow all Vercel preview URLs
allow_origin_regex = r"https://affliate-ecom.*\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Amazon Creators API Configuration
AMAZON_CREDENTIAL_ID = os.getenv("AMAZON_CREDENTIAL_ID")
AMAZON_CREDENTIAL_SECRET = os.getenv("AMAZON_CREDENTIAL_SECRET")
AMAZON_API_VERSION = os.getenv("AMAZON_API_VERSION", "2.2")
AMAZON_MARKETPLACE = os.getenv("AMAZON_MARKETPLACE", "www.amazon.in")
AMAZON_PARTNER_TAG = os.getenv("AMAZON_PARTNER_TAG")

# Initialize Amazon Creators API
amazon_api = AmazonCreatorsApi(
    credential_id=AMAZON_CREDENTIAL_ID,
    credential_secret=AMAZON_CREDENTIAL_SECRET,
    version=AMAZON_API_VERSION,
    marketplace=AMAZON_MARKETPLACE,
    tag=AMAZON_PARTNER_TAG
)

# Categories mapping
CATEGORIES = {
    "Home & Kitchen": "HomeAndKitchen",
    "Fashion": "Fashion",
    "Electronics": "Electronics",
    "Sports": "SportingGoods",
    "Beauty & Daily Needs": "Beauty",
    "Grooming & Wellness": "HealthPersonalCare"
}

# In-memory cache
deals_cache: Dict[str, Dict] = {}
cache_timestamp: Dict[str, datetime] = {}
CACHE_DURATION = timedelta(hours=24)  # Amazon license allows 24-hour caching

# Amazon search cache (24-hour limit per license)
search_cache: Dict[str, Dict] = {}
search_cache_timestamp: Dict[str, datetime] = {}
SEARCH_CACHE_DURATION = timedelta(hours=24)


def is_cache_valid(category: str) -> bool:
    """Check if cache is still valid for a category"""
    if category not in cache_timestamp:
        return False
    return datetime.now() - cache_timestamp[category] < CACHE_DURATION


def is_search_cache_valid(cache_key: str) -> bool:
    """Check if search cache is still valid (24-hour limit per Amazon license)"""
    if cache_key not in search_cache_timestamp:
        return False
    return datetime.now() - search_cache_timestamp[cache_key] < SEARCH_CACHE_DURATION


def fetch_deals_from_amazon(category: str, max_items: int = 10) -> List[Dict]:
    """Fetch deals from Amazon PA-API"""
    try:
        logger.info(f"Fetching deals for category: {category}")
        
        # Search for deals with discount keywords
        search_terms = f"{category} deals offers discount"
        
        items = amazon_api.search_items(
            keywords=search_terms,
            search_index=CATEGORIES.get(category, "All"),
            item_count=max_items
        )
        
        deals = []
        if items and hasattr(items, 'items'):
            for item in items.items:
                try:
                    # Extract deal information
                    title = item.item_info.title.display_value if item.item_info and item.item_info.title else "No title"
                    
                    # Get pricing info
                    price = None
                    original_price = None
                    discount_percent = 0
                    
                    if item.offers and item.offers.listings:
                        listing = item.offers.listings[0]
                        if listing.price:
                            price = listing.price.display_amount
                        if listing.saving_basis:
                            original_price = listing.saving_basis.display_amount
                            # Calculate discount percentage
                            if listing.price and listing.saving_basis:
                                try:
                                    current = float(listing.price.amount)
                                    original = float(listing.saving_basis.amount)
                                    discount_percent = int(((original - current) / original) * 100)
                                except:
                                    pass
                    
                    # Get image
                    image_url = item.images.primary.large.url if item.images and item.images.primary else None
                    
                    # Get features
                    features = []
                    if item.item_info and item.item_info.features:
                        features = [f.display_value for f in item.item_info.features.display_values[:3]]
                    
                    deal = {
                        "asin": item.asin,
                        "title": title,
                        "price": price,
                        "original_price": original_price,
                        "discount_percent": discount_percent,
                        "image_url": image_url,
                        "features": features,
                        "detail_url": item.detail_page_url,
                        "category": category
                    }
                    
                    # Only include items with discounts
                    if discount_percent > 0:
                        deals.append(deal)
                        
                except Exception as e:
                    logger.error(f"Error processing item: {e}")
                    continue
        
        logger.info(f"Found {len(deals)} deals for {category}")
        return deals
        
    except Exception as e:
        logger.error(f"Error fetching deals for {category}: {e}")
        return []


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "AffiliStore Deals API",
        "version": "1.0.0"
    }


@app.get("/api/deals")
async def get_all_deals(refresh: bool = False):
    """Get deals from all categories"""
    all_deals = []
    
    for category in CATEGORIES.keys():
        # Check cache
        if not refresh and is_cache_valid(category):
            logger.info(f"Using cached deals for {category}")
            all_deals.extend(deals_cache[category])
        else:
            # Fetch fresh deals
            logger.info(f"Fetching fresh deals for {category}")
            deals = fetch_deals_from_amazon(category)
            deals_cache[category] = deals
            cache_timestamp[category] = datetime.now()
            all_deals.extend(deals)
    
    return {
        "total": len(all_deals),
        "deals": all_deals,
        "cached_at": {cat: ts.isoformat() for cat, ts in cache_timestamp.items()},
        "cache_valid_until": {
            cat: (ts + CACHE_DURATION).isoformat() 
            for cat, ts in cache_timestamp.items()
        }
    }


@app.get("/api/deals/{category}")
async def get_category_deals(category: str, refresh: bool = False):
    """Get deals for a specific category"""
    if category not in CATEGORIES:
        raise HTTPException(status_code=404, detail=f"Category '{category}' not found")
    
    # Check cache
    if not refresh and is_cache_valid(category):
        logger.info(f"Using cached deals for {category}")
        deals = deals_cache[category]
    else:
        # Fetch fresh deals
        logger.info(f"Fetching fresh deals for {category}")
        deals = fetch_deals_from_amazon(category)
        deals_cache[category] = deals
        cache_timestamp[category] = datetime.now()
    
    return {
        "category": category,
        "total": len(deals),
        "deals": deals,
        "cached_at": cache_timestamp[category].isoformat(),
        "cache_valid_until": (cache_timestamp[category] + CACHE_DURATION).isoformat()
    }


@app.get("/api/categories")
async def get_categories():
    """Get list of available categories"""
    return {
        "categories": list(CATEGORIES.keys())
    }


@app.post("/api/search")
async def search_products(request: SearchRequest):
    """Search Amazon products by keywords"""
    try:
        if not request.keywords:
            raise HTTPException(status_code=400, detail="Keywords are required")
        
        logger.info(f"Searching for: {request.keywords} in category: {request.category}")
        
        # Map category to search index
        search_index = CATEGORIES.get(request.category, "All")
        
        items = amazon_api.search_items(
            keywords=request.keywords,
            search_index=search_index,
            item_count=10
        )
        
        products = []
        if items and hasattr(items, 'items'):
            for item in items.items:
                try:
                    title = item.item_info.title.display_value if item.item_info and item.item_info.title else "No title"
                    
                    # Get image
                    image_url = None
                    if item.images and item.images.primary and item.images.primary.large:
                        image_url = item.images.primary.large.url
                    
                    # Get price
                    price = None
                    if item.offers and item.offers.listings:
                        listing = item.offers.listings[0]
                        if listing.price and listing.price.display_amount:
                            price = listing.price.display_amount
                    
                    # Get description from features
                    description = ""
                    if item.item_info and item.item_info.features:
                        description = " ".join(item.item_info.features.display_values[:2])
                    
                    products.append({
                        "title": title,
                        "description": description,
                        "imageUrl": image_url,
                        "price": price,
                        "detailPageURL": item.detail_page_url if hasattr(item, 'detail_page_url') else ""
                    })
                except Exception as e:
                    logger.error(f"Error processing item: {str(e)}")
                    continue
        
        return {
            "products": products,
            "total": len(products)
        }
    
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/amazon/search-advanced")
async def search_amazon_advanced(request: AdvancedSearchRequest):
    """
    Advanced Amazon product search with filters, sorting, and pagination
    
    Features:
    - Price range filtering (min_price, max_price)
    - Rating filtering (min_rating)
    - Brand filtering
    - Prime-only products
    - Sort options (price, reviews, newest)
    - Pagination (up to 100 results)
    - 24-hour caching per Amazon license
    """
    try:
        if not request.keywords:
            raise HTTPException(status_code=400, detail="Keywords are required")
        
        # Generate cache key from search parameters
        cache_key = f"{request.keywords}_{request.category}_{request.min_price}_{request.max_price}_{request.min_rating}_{request.brand}_{request.prime_only}_{request.sort_by}_{request.page}"
        
        # Check cache first (24-hour limit per Amazon license)
        if is_search_cache_valid(cache_key):
            logger.info(f"Returning cached results for: {cache_key}")
            cached_data = search_cache[cache_key]
            cached_data["cached"] = True
            cached_data["cached_at"] = search_cache_timestamp[cache_key].isoformat()
            return cached_data
        
        logger.info(f"Advanced search: {request.keywords}, filters: price={request.min_price}-{request.max_price}, rating={request.min_rating}, brand={request.brand}")
        
        # Build search parameters
        search_params = {
            "keywords": request.keywords,
            "item_count": min(request.items_per_page, 10),  # Max 10 per page
            "item_page": min(request.page, 10),  # Max 10 pages
        }
        
        # Add category/search index
        if request.category:
            search_params["search_index"] = CATEGORIES.get(request.category, "All")
        
        # Add price filters
        if request.min_price:
            search_params["min_price"] = request.min_price
        if request.max_price:
            search_params["max_price"] = request.max_price
        
        # Add rating filter
        if request.min_rating:
            search_params["min_reviews_rating"] = request.min_rating
        
        # Add brand filter
        if request.brand:
            search_params["brand"] = request.brand
        
        # Add delivery flags for Prime
        if request.prime_only:
            search_params["delivery_flags"] = ["Prime"]
        
        # Add sort option
        if request.sort_by and request.sort_by != "Relevance":
            search_params["sort_by"] = request.sort_by
        
        logger.info(f"Amazon API params: {search_params}")
        
        # Call Amazon API
        items = amazon_api.search_items(**search_params)
        
        products = []
        total_results = 0
        
        if items:
            # Get total result count
            if hasattr(items, 'search_result') and hasattr(items.search_result, 'total_result_count'):
                total_results = items.search_result.total_result_count
            
            # Process items
            if hasattr(items, 'items'):
                for item in items.items:
                    try:
                        # Title
                        title = item.item_info.title.display_value if item.item_info and item.item_info.title else "No title"
                        
                        # Image
                        image_url = None
                        if item.images and item.images.primary:
                            if item.images.primary.large:
                                image_url = item.images.primary.large.url
                            elif item.images.primary.medium:
                                image_url = item.images.primary.medium.url
                        
                        # Price and savings
                        price = None
                        original_price = None
                        savings_percent = None
                        is_prime = False
                        
                        if item.offers and item.offers.listings:
                            listing = item.offers.listings[0]
                            
                            # Current price
                            if listing.price and listing.price.display_amount:
                                price = listing.price.display_amount
                            
                            # Original price and savings
                            if listing.price and listing.price.savings:
                                if hasattr(listing.price.savings, 'display_amount'):
                                    original_price = listing.price.savings.display_amount
                                if hasattr(listing.price.savings, 'percentage'):
                                    savings_percent = listing.price.savings.percentage
                            
                            # Prime eligibility
                            if hasattr(listing, 'delivery_info') and listing.delivery_info:
                                is_prime = getattr(listing.delivery_info, 'is_prime_eligible', False)
                        
                        # Description from features
                        description = ""
                        if item.item_info and item.item_info.features:
                            description = " ".join(item.item_info.features.display_values[:2])
                        
                        products.append({
                            "asin": item.asin,
                            "title": title,
                            "description": description,
                            "imageUrl": image_url,
                            "price": price,
                            "originalPrice": original_price,
                            "savingsPercent": savings_percent,
                            "isPrime": is_prime,
                            "detailPageURL": item.detail_page_url if hasattr(item, 'detail_page_url') else ""
                        })
                    except Exception as e:
                        logger.error(f"Error processing item: {str(e)}")
                        continue
        
        # Prepare response with timestamp (required by Amazon license)
        current_time = datetime.now()
        response_data = {
            "products": products,
            "total": len(products),
            "totalResults": total_results,
            "currentPage": request.page,
            "itemsPerPage": request.items_per_page,
            "hasMore": (request.page * request.items_per_page) < total_results,
            "cached": False,
            "timestamp": current_time.isoformat(),
            "cached_at": None
        }
        
        # Store in cache (24-hour limit per Amazon license)
        search_cache[cache_key] = response_data
        search_cache_timestamp[cache_key] = current_time
        logger.info(f"Cached search results for: {cache_key}")
        
        return response_data
    
    except Exception as e:
        logger.error(f"Advanced search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/refresh-cache")
async def refresh_cache():
    """Manually refresh all deals cache"""
    logger.info("Manual cache refresh triggered")
    
    for category in CATEGORIES.keys():
        deals = fetch_deals_from_amazon(category)
        deals_cache[category] = deals
        cache_timestamp[category] = datetime.now()
    
    return {
        "status": "success",
        "message": "Cache refreshed for all categories",
        "timestamp": datetime.now().isoformat()
    }


# ============================================
# EARNKARO SMART IMPORT ENDPOINTS
# ============================================

@app.post("/api/earnkaro/convert")
async def convert_earnkaro_url(request: EarnkaroConvertRequest):
    """
    Convert product URL to Earnkaro affiliate link and scrape product details
    Separate from Amazon PA-API - only for Earnkaro (Flipkart, etc.)
    """
    try:
        logger.info(f"Converting URL: {request.url}")
        
        # Initialize converter
        converter = EarnkaroConverter()
        
        # Convert URL to affiliate link
        conversion_result = converter.convert_url(request.url)
        
        # Check for errors
        if conversion_result.get("error"):
            raise HTTPException(
                status_code=400,
                detail=conversion_result.get("message", "Conversion failed")
            )
        
        # Scrape product details from original URL
        product_details = converter.scrape_product_details(request.url)
        
        # Combine results
        return {
            "success": True,
            "affiliateUrl": conversion_result.get("data", ""),
            "title": product_details.get("title", ""),
            "imageUrl": product_details.get("imageUrl", ""),
            "price": product_details.get("price", ""),
            "description": product_details.get("description", ""),
            "category": product_details.get("category", ""),
            "platform": "Earnkaro"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Earnkaro conversion error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to convert URL: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
