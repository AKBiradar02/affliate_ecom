from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
from amazon_paapi import AmazonApi
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AffiliStore Deals API", version="1.0.0")

# CORS middleware
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Amazon PA-API Configuration
AMAZON_ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY")
AMAZON_SECRET_KEY = os.getenv("AMAZON_SECRET_KEY")
AMAZON_PARTNER_TAG = os.getenv("AMAZON_PARTNER_TAG")
AMAZON_REGION = os.getenv("AMAZON_REGION", "IN")

# Initialize Amazon API
amazon_api = AmazonApi(
    key=AMAZON_ACCESS_KEY,
    secret=AMAZON_SECRET_KEY,
    tag=AMAZON_PARTNER_TAG,
    country=AMAZON_REGION
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
CACHE_DURATION = timedelta(hours=int(os.getenv("CACHE_DURATION_HOURS", "1")))


def is_cache_valid(category: str) -> bool:
    """Check if cache is still valid for a category"""
    if category not in cache_timestamp:
        return False
    return datetime.now() - cache_timestamp[category] < CACHE_DURATION


def fetch_deals_from_amazon(category: str, max_items: int = 20) -> List[Dict]:
    """Fetch deals from Amazon PA-API"""
    try:
        logger.info(f"Fetching deals for category: {category}")
        
        # Search for deals with discount keywords
        search_terms = f"{category} deals offers discount"
        
        items = amazon_api.search_items(
            keywords=search_terms,
            search_index=CATEGORIES.get(category, "All"),
            item_count=max_items,
            resources=[
                "Images.Primary.Large",
                "ItemInfo.Title",
                "ItemInfo.Features",
                "Offers.Listings.Price",
                "Offers.Listings.SavingBasis",
                "ItemInfo.ProductInfo"
            ]
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


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
