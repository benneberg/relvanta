from fastapi import FastAPI, APIRouter, HTTPException, Header, Cookie, Response, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

# Import models
from models import (
    Product, Service, Lab, Page, Redirect, ClientAccess,
    User, UserSession, Role, Visibility, Status, LabStatus,
    ProductListResponse, ServiceListResponse, LabListResponse
)

# Import Firebase configuration
from firebase_config import initialize_firebase, verify_firebase_token


ROOT_DIR = Path(__file__).parent
if os.getenv("PYTHON_ENV") != "production":
    load_dotenv(ROOT_DIR / ".env")

# Initialize Firebase Admin SDK
initialize_firebase()

# MongoDB connection
mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME")

if not mongo_url or not db_name:
    raise RuntimeError("❌ MONGO_URL and DB_NAME must be set")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app without a prefix
app = FastAPI(title="Relvanta Platform API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============================================================================
# COOKIE / CORS CONFIG (deployment-friendly)
# ============================================================================

# For Vercel (frontend) + Fly (API) on subdomains, set:
#   COOKIE_DOMAIN=.relvanta.com
# so the session cookie is available to both relvanta.com and api.relvanta.com.
COOKIE_DOMAIN = os.environ.get("COOKIE_DOMAIN") or None

# In local dev over http, you typically want COOKIE_SECURE=false.
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "true").strip().lower() in (
    "1",
    "true",
    "yes",
)

# If you need cookies across different *sites* (e.g. Vercel preview domains),
# you may need SameSite=None + Secure=true. For relvanta.com <-> api.relvanta.com
# SameSite=Lax is typically sufficient.
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "lax").strip().lower()


# ============================================================================
# AUTHENTICATION UTILITIES
# ============================================================================

async def get_current_user(
    authorization: Optional[str] = Header(None),
    session_token: Optional[str] = Cookie(None)
) -> Optional[User]:
    """
    Authenticator helper - checks session_token from cookies first, 
    then Authorization header as fallback.
    """
    token = session_token or (authorization.replace("Bearer ", "") if authorization else None)
    
    if not token:
        return None
    
    # Find session in database
    session_doc = await db.user_sessions.find_one(
        {"session_token": token},
        {"_id": 0}  # Exclude MongoDB's _id
    )
    
    if not session_doc:
        return None
    
    # Check expiry (handle timezone-aware comparison)
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        # Session expired
        await db.user_sessions.delete_one({"session_token": token})
        return None
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}  # Exclude MongoDB's _id
    )
    
    if not user_doc:
        return None
    
    return User(**user_doc)


async def require_auth(
    authorization: Optional[str] = Header(None),
    session_token: Optional[str] = Cookie(None)
) -> User:
    """Require authentication, raise 401 if not authenticated."""
    user = await get_current_user(authorization, session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@api_router.post("/auth/session")
async def create_session(
    response: Response,
    request: Request
):
    """
    Create session from Firebase ID token.
    Called by frontend after Firebase authentication.
    
    Expects Authorization header: Bearer <firebase_id_token>
    """
    # Get Firebase ID token from Authorization header
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Missing or invalid Authorization header")
    
    firebase_token = auth_header.replace("Bearer ", "")
    
    # Verify Firebase token
    decoded_token = verify_firebase_token(firebase_token)
    
    if not decoded_token:
        raise HTTPException(status_code=401, detail="Invalid or expired Firebase token")
    
    # Extract user info from Firebase token
    firebase_uid = decoded_token.get("uid")
    email = decoded_token.get("email")
    name = decoded_token.get("name") or email.split("@")[0]
    picture = decoded_token.get("picture")
    
    if not firebase_uid or not email:
        raise HTTPException(status_code=400, detail="Invalid token claims")
    
    # Check if user exists
    existing_user = await db.users.find_one(
        {"email": email},
        {"_id": 0}
    )
    
    if existing_user:
        # Update existing user
        user_id = existing_user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": name,
                "picture": picture,
                "firebase_uid": firebase_uid,  # Store Firebase UID
                "updated_at": datetime.now(timezone.utc)
            }}
        )
    else:
        # Create new user with custom user_id (not MongoDB _id)
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "firebase_uid": firebase_uid,  # Store Firebase UID
            "email": email,
            "name": name,
            "picture": picture,
            "role": Role.CLIENT.value,  # Default role
            "organization_slug": None,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })
    
    # Create session with timezone-aware expiry (7 days)
    session_token = f"sess_{uuid.uuid4().hex}"
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "firebase_uid": firebase_uid,  # Link to Firebase user
        "expires_at": expires_at,
        "created_at": datetime.now(timezone.utc)
    })
    
    # Set httpOnly cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        domain=COOKIE_DOMAIN,
        path="/",
        max_age=7 * 24 * 60 * 60  # 7 days in seconds
    )
    
    # Return user data
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return User(**user_doc)


@api_router.get("/auth/me")
async def get_current_user_endpoint(
    authorization: Optional[str] = Header(None),
    session_token: Optional[str] = Cookie(None)
):
    """
    Get current authenticated user.
    Used by frontend to check auth state.
    """
    user = await get_current_user(authorization, session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@api_router.post("/auth/logout")
async def logout(
    response: Response,
    authorization: Optional[str] = Header(None),
    session_token: Optional[str] = Cookie(None)
):
    """Logout user and clear session."""
    token = session_token or (authorization.replace("Bearer ", "") if authorization else None)
    
    if token:
        # Delete session from database
        await db.user_sessions.delete_one({"session_token": token})
    
    # Clear cookie
    response.delete_cookie(
        key="session_token",
        path="/",
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        domain=COOKIE_DOMAIN,
    )
    
    return {"message": "Logged out successfully"}


# ============================================================================
# CONTENT ENDPOINTS - PRODUCTS
# ============================================================================

@api_router.get("/content/products", response_model=ProductListResponse)
async def list_products(
    visibility: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 100
):
    """
    List products with optional filters.
    Public endpoint - returns only public products unless authenticated.
    """
    query = {}
    
    if visibility:
        query["visibility"] = visibility
    else:
        # Default to public only
        query["visibility"] = Visibility.PUBLIC.value
    
    if status:
        query["status"] = status
    
    if category:
        query["category"] = category
    
    # Query database
    products_cursor = db.products.find(query, {"_id": 0}).limit(limit)
    products_list = await products_cursor.to_list(length=limit)
    
    # Sort by order, then status, then name
    def sort_key(p):
        status_order = {"live": 0, "beta": 1, "pilot": 2, "idea": 3, "deprecated": 4, "archived": 5}
        return (
            p.get("order", 999),
            status_order.get(p.get("status", "idea"), 999),
            p.get("name", "")
        )
    
    products_list.sort(key=sort_key)
    
    return ProductListResponse(
        products=[Product(**p) for p in products_list],
        total=len(products_list)
    )


@api_router.get("/content/products/{slug}", response_model=Product)
async def get_product(slug: str):
    """Get a single product by slug."""
    product_doc = await db.products.find_one(
        {"slug": slug},
        {"_id": 0}
    )
    
    if not product_doc:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return Product(**product_doc)


# ============================================================================
# CONTENT ENDPOINTS - SERVICES
# ============================================================================

@api_router.get("/content/services", response_model=ServiceListResponse)
async def list_services(
    visibility: Optional[str] = None,
    engagement_type: Optional[str] = None,
    limit: int = 100
):
    """List services with optional filters."""
    query = {}
    
    if visibility:
        query["visibility"] = visibility
    else:
        query["visibility"] = Visibility.PUBLIC.value
    
    if engagement_type:
        query["engagement_type"] = engagement_type
    
    services_cursor = db.services.find(query, {"_id": 0}).limit(limit)
    services_list = await services_cursor.to_list(length=limit)
    
    return ServiceListResponse(
        services=[Service(**s) for s in services_list],
        total=len(services_list)
    )


@api_router.get("/content/services/{slug}", response_model=Service)
async def get_service(slug: str):
    """Get a single service by slug."""
    service_doc = await db.services.find_one(
        {"slug": slug},
        {"_id": 0}
    )
    
    if not service_doc:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return Service(**service_doc)


# ============================================================================
# CONTENT ENDPOINTS - LABS (Protected)
# ============================================================================

@api_router.get("/content/labs", response_model=LabListResponse)
async def list_labs(
    status: Optional[str] = None,
    limit: int = 100,
    authorization: Optional[str] = Header(None),
    session_token: Optional[str] = Cookie(None)
):
    """
    List labs (requires authentication).
    Labs are experimental content requiring explicit access.
    """
    user = await require_auth(authorization, session_token)
    
    query = {"visibility": Visibility.LABS.value}
    
    if status:
        query["status"] = status
    
    labs_cursor = db.labs.find(query, {"_id": 0}).limit(limit)
    labs_list = await labs_cursor.to_list(length=limit)
    
    return LabListResponse(
        labs=[Lab(**l) for l in labs_list],
        total=len(labs_list)
    )


@api_router.get("/content/labs/{slug}", response_model=Lab)
async def get_lab(
    slug: str,
    authorization: Optional[str] = Header(None),
    session_token: Optional[str] = Cookie(None)
):
    """Get a single lab by slug (requires authentication)."""
    user = await require_auth(authorization, session_token)
    
    lab_doc = await db.labs.find_one(
        {"slug": slug},
        {"_id": 0}
    )
    
    if not lab_doc:
        raise HTTPException(status_code=404, detail="Lab not found")
    
    return Lab(**lab_doc)


# ============================================================================
# CONTENT ENDPOINTS - PAGES
# ============================================================================

@api_router.get("/content/pages/{slug}", response_model=Page)
async def get_page(slug: str):
    """Get a single page by slug."""
    page_doc = await db.pages.find_one(
        {"slug": slug},
        {"_id": 0}
    )
    
    if not page_doc:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return Page(**page_doc)


# ============================================================================
# REDIRECTS
# ============================================================================

@api_router.get("/content/redirects")
async def list_redirects():
    """Get all redirects for client-side or middleware use."""
    redirects_cursor = db.redirects.find({}, {"_id": 0})
    redirects_list = await redirects_cursor.to_list(length=1000)
    return {"redirects": redirects_list}


# ============================================================================
# CLIENT ACCESS (For future use)
# ============================================================================

@api_router.get("/access/{user_id}")
async def get_client_access(
    user_id: str,
    authorization: Optional[str] = Header(None),
    session_token: Optional[str] = Cookie(None)
):
    """Get client access permissions."""
    user = await require_auth(authorization, session_token)
    
    # Users can only access their own permissions (unless admin)
    if user.user_id != user_id and user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    access_doc = await db.client_access.find_one(
        {"user_id": user_id},
        {"_id": 0}
    )
    
    if not access_doc:
        # Return default empty access
        return ClientAccess(
            user_id=user_id,
            scope={"products": [], "services": [], "labs": []},
            permissions=["read"],
            granted_at=datetime.now(timezone.utc)
        )
    
    return ClientAccess(**access_doc)


# ============================================================================
# LEGACY ENDPOINT (Keep for compatibility)
# ============================================================================

@api_router.get("/")
async def root():
    return {"message": "Relvanta Platform API"}


# Include the router in the main app
app.include_router(api_router)

# CORS middleware
origins = os.getenv("CORS_ORIGINS")
allowed_origins = origins.split(",") if origins else []

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "relvanta-api"}
