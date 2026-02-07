"""
Seed script to populate MongoDB with sample Relvanta content.
Run this to initialize the database with products, services, labs, and pages.
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
from datetime import datetime, timezone
import uuid

# ---------------------------------------------------------------------------
# Environment loading (local only – Fly.io secrets override automatically)
# ---------------------------------------------------------------------------

load_dotenv(Path(__file__).parent / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
PYTHON_ENV = os.getenv("PYTHON_ENV", "development")

# ---------------------------------------------------------------------------
# Safety guard
# ---------------------------------------------------------------------------

if PYTHON_ENV == "production":
    raise RuntimeError("❌ Refusing to seed database in production environment")

# ---------------------------------------------------------------------------
# Index definitions
# ---------------------------------------------------------------------------

async def ensure_indexes(db):
    print("🔧 Ensuring indexes...")

    await db.products.create_index("slug", unique=True)
    await db.services.create_index("slug", unique=True)
    await db.labs.create_index("slug", unique=True)
    await db.pages.create_index("slug", unique=True)

    await db.products.create_index("visibility")
    await db.services.create_index("visibility")
    await db.labs.create_index("visibility")

    await db.redirects.create_index("from", unique=True)

    print("✅ Indexes ready")

# ---------------------------------------------------------------------------
# Seed logic
# ---------------------------------------------------------------------------

async def seed_database():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    print("\n🌱 Seeding Relvanta Platform database")
    print(f"🌍 ENV        : {PYTHON_ENV}")
    print(f"📦 DB_NAME    : {DB_NAME}")
    print(f"📡 MONGO_URL  : {MONGO_URL}")
    print("📂 Databases BEFORE seed:", await client.list_database_names())

    await ensure_indexes(db)

    # -----------------------------------------------------------------------
    # Clear collections (idempotent)
    # -----------------------------------------------------------------------

    print("\n🧹 Clearing existing collections...")

    await db.products.delete_many({})
    await db.services.delete_many({})
    await db.labs.delete_many({})
    await db.pages.delete_many({})
    await db.redirects.delete_many({})

    print("✅ Collections cleared")

    now = datetime.now(timezone.utc)

    # -----------------------------------------------------------------------
    # PRODUCTS
    # -----------------------------------------------------------------------

    products = [
        {
            "id": str(uuid.uuid4()),
            "slug": "oneeye",
            "created_at": now,
            "updated_at": now,
            "visibility": "public",
            "order": 1,
            "name": "OneEye",
            "tagline": "AI-powered visual intelligence for modern businesses",
            "short_description": "Transform visual data into actionable insights with advanced computer vision and deep learning.",
            "long_description": "...",
            "category": "Visual Analytics",
            "status": "live",
            "accent_color": "#4A90E2",
            "icon": "/icons/oneeye.svg",
            "features": [
                "Real-time object detection",
                "Anomaly detection",
                "Sentiment analysis",
                "Automated quality control",
            ],
            "target_audience": "Retail, Manufacturing, Security, Healthcare",
            "links": {
                "demo": "/products/oneeye/demo",
                "docs": "/products/oneeye/docs",
            },
            "theme": {
                "primary_color": "#4A90E2",
                "secondary_color": "#E0F2F7",
            },
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "predictiq",
            "created_at": now,
            "updated_at": now,
            "visibility": "public",
            "order": 2,
            "name": "PredictIQ",
            "tagline": "Forecasting the future with advanced predictive analytics",
            "short_description": "Leverage machine learning to predict trends and optimize operations.",
            "long_description": "...",
            "category": "Predictive Analytics",
            "status": "beta",
            "accent_color": "#10B981",
            "icon": "/icons/predictiq.svg",
            "features": [
                "Time series forecasting",
                "Demand prediction",
                "Churn prediction",
            ],
            "target_audience": "Financial Services, E-commerce, Manufacturing",
            "links": {"demo": "/products/predictiq/demo"},
            "theme": {
                "primary_color": "#10B981",
                "secondary_color": "#D1FAE5",
            },
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "chatflow",
            "created_at": now,
            "updated_at": now,
            "visibility": "public",
            "order": 3,
            "name": "ChatFlow",
            "tagline": "Intelligent conversational AI",
            "short_description": "Build sophisticated chatbots powered by LLMs.",
            "long_description": "...",
            "category": "Conversational AI",
            "status": "live",
            "accent_color": "#8B5CF6",
            "icon": "/icons/chatflow.svg",
            "features": [
                "Multi-channel deployment",
                "Contextual memory",
                "Enterprise integrations",
            ],
            "target_audience": "Support, Sales, HR",
            "links": {
                "demo": "/products/chatflow/demo",
                "docs": "/products/chatflow/docs",
            },
            "theme": {
                "primary_color": "#8B5CF6",
                "secondary_color": "#EDE9FE",
            },
        },
    ]

    await db.products.insert_many(products)
    print(f"✅ Inserted {len(products)} products")

    # -----------------------------------------------------------------------
    # SERVICES
    # -----------------------------------------------------------------------

    services = [
        {
            "id": str(uuid.uuid4()),
            "slug": "ai-strategy-consulting",
            "created_at": now,
            "updated_at": now,
            "visibility": "public",
            "order": 1,
            "name": "AI Strategy Consulting",
            "summary": "Define your AI roadmap.",
            "description": "...",
            "scope": ["Discovery", "Strategy", "Roadmap"],
            "engagement_type": "project",
            "deliverables": ["AI roadmap", "Use case portfolio"],
            "duration": "6 weeks",
        }
    ]

    await db.services.insert_many(services)
    print(f"✅ Inserted {len(services)} services")

    # -----------------------------------------------------------------------
    # LABS
    # -----------------------------------------------------------------------

    labs = [
        {
            "id": str(uuid.uuid4()),
            "slug": "code-oracle",
            "created_at": now,
            "updated_at": now,
            "visibility": "labs",
            "order": 1,
            "name": "CodeOracle",
            "description": "...",
            "hypothesis": "LLMs can outperform static analysis.",
            "status": "running",
            "start_date": datetime(2025, 1, 15, tzinfo=timezone.utc),
        }
    ]

    await db.labs.insert_many(labs)
    print(f"✅ Inserted {len(labs)} labs")

    # -----------------------------------------------------------------------
    # PAGES
    # -----------------------------------------------------------------------

    pages = [
        {
            "id": str(uuid.uuid4()),
            "slug": "about",
            "created_at": now,
            "updated_at": now,
            "visibility": "public",
            "title": "About Relvanta",
            "content": "...",
            "seo": {
                "title": "About Relvanta",
                "description": "AI solutions for modern businesses",
            },
        }
    ]

    await db.pages.insert_many(pages)
    print(f"✅ Inserted {len(pages)} pages")

    # -----------------------------------------------------------------------
    # REDIRECTS
    # -----------------------------------------------------------------------

    redirects = [
        {"from": "/product/oneeye", "to": "/products/oneeye", "permanent": True},
        {"from": "/consulting", "to": "/services/ai-strategy-consulting", "permanent": True},
    ]

    await db.redirects.insert_many(redirects)
    print(f"✅ Inserted {len(redirects)} redirects")

    print("\n🎉 Database seeded successfully")
    print("📁 Collections:", await db.list_collection_names())
    print("📂 Databases AFTER seed:", await client.list_database_names())

    client.close()

# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    asyncio.run(seed_database())
