# Relvanta Platform 🚀

A comprehensive AI solutions platform showcasing products, services, and experimental labs for medium-sized businesses.

- **Backend**: FastAPI with MongoDB
- **Authentication**: Firebase Authentication (Google OAuth)
- **Database**: MongoDB (local or MongoDB Atlas)

```
┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│   Next.js 14+   │─────▶│   FastAPI API    │─────▶│   MongoDB    │
│   (Port 3001)   │      │   (Port 8001)    │      │  (Port 27017)│
│                 │◀─────│                  │◀─────│              │
│  - ISR Pages    │      │  - Content API   │      │  - Products  │
│  - SSR Auth     │      │  - Auth Routes   │      │  - Services  │
│  - SSG Static   │      │  - Validation    │      │  - Labs      │
└─────────────────┘      └──────────────────┘      └──────────────┘
         │                        │
         │                        │
         └────────────────────────┘
          Firebase Authentication
         (Google OAuth Provider)
```

## Project Structure

```
/app/
├── backend/                    # FastAPI Backend
│   ├── server.py              # Main FastAPI app
│   ├── models.py              # Pydantic models
│   ├── seed_content.py        # Database seeding script
│   └── requirements.txt       # Python dependencies
│
├── frontend-next/             # Next.js Frontend
│   ├── app/                   # App Router pages
│   │   ├── page.tsx          # Homepage (SSG)
│   │   ├── products/         # Products (ISR)
│   │   ├── services/         # Services (ISR)
│   │   ├── labs/             # Labs (SSR, auth)
│   │   ├── private/          # Dashboard (SSR, auth)


### 🎯 Core Functionality

**Products Showcase**
- AI-powered visual analytics (OneEye)
- Predictive analytics platform (PredictIQ)
- Conversational AI (ChatFlow)
- ISR with 60-second revalidation

**Services Catalog**
- AI Strategy Consulting
- MLOps Implementation
- AI Pilot Programs
- Detailed engagement information

**Experimental Labs** 🧪
- CodeOracle (AI code review)
- VoiceInsight (voice analytics)
- Requires authentication
- Live experiment metrics

**Authentication & Access Control**
- Emergent Google OAuth integration
- Role-based access (admin, collaborator, client)
- Protected routes for labs and private dashboard
- Session management with HTTP-only cookies

### 🎨 Design & UX

- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Automatic theme switching
- **CSS Variables**: Semantic design tokens
- **Accessibility**: ARIA labels and keyboard navigation

### ⚡ Performance

- **ISR**: 60s revalidation for public content
- **SSR**: Fresh data for authenticated users
- **SSG**: Static generation for marketing pages
- **Image Optimization**: Next.js Image component

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB (running locally)
- Yarn package manager

### Installation & Setup

1. **Backend Setup**

```bash
# Install Python dependencies
cd /app/backend
pip install -r requirements.txt

# Seed database with sample content
python seed_content.py

# Backend runs automatically via supervisor on port 8001
```

2. **Frontend Setup**

```bash
# Install Node dependencies
cd /app/frontend-next
yarn install

# Frontend runs automatically via supervisor on port 3001
```

3. **Check Services**

```bash
# Check all services status
sudo supervisorctl status

# Expected output:
# backend          RUNNING
# frontend-next    RUNNING
# mongodb          RUNNING
```

### Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## API Endpoints

### Content Endpoints

```bash
# List products
GET /api/content/products?visibility=public&status=live

# Get product by slug
GET /api/content/products/{slug}

# List services
GET /api/content/services?visibility=public

# Get service by slug
GET /api/content/services/{slug}

# List labs (requires auth)
GET /api/content/labs
Authorization: Bearer {session_token}

# Get lab by slug (requires auth)
GET /api/content/labs/{slug}
Authorization: Bearer {session_token}
```

### Authentication Endpoints

```bash
# Create session (called by frontend after OAuth)
POST /api/auth/session
X-Session-ID: {emergent_session_id}

# Get current user
GET /api/auth/me
Cookie: session_token={token}

# Logout
POST /api/auth/logout
Cookie: session_token={token}
```

## Authentication Flow

```
1. User clicks "Sign In with Google"
   │
2. Redirect to https://auth.emergentagent.com/
   │
3. User authenticates with Google
   │
4. Redirect to /login#session_id={session_id}
   │
5. Frontend exchanges session_id for session_token
   │
6. session_token stored in HTTP-only cookie (7 days)
   │
7. Cookie automatically sent with API requests
   │
8. Access to /labs and /private routes granted
```

## Content Management

### Adding New Content

**Via Database:**

```python
# Connect to MongoDB
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime, timezone
import uuid

async def add_product():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["test_database"]
    
    product = {
        "id": str(uuid.uuid4()),
        "slug": "new-product",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "visibility": "public",
        "name": "New Product",
        "tagline": "Your tagline here",
        "short_description": "Brief description",
        "long_description": "# Full markdown content here",
        "category": "AI Tools",
        "status": "beta",
        "accent_color": "#3B82F6",
        "features": ["Feature 1", "Feature 2"],
        "target_audience": "Developers, Businesses"
    }
    
    await db.products.insert_one(product)
    print("Product added!")

asyncio.run(add_product())
```

**Or modify `/app/backend/seed_content.py` and re-run:**

```bash
cd /app/backend
python seed_content.py
```

## Development

### Backend Development

```bash
# Check backend logs
tail -f /var/log/supervisor/backend.out.log

# Restart backend
sudo supervisorctl restart backend

# Test API endpoint
curl http://localhost:8001/api/content/products | jq .
```

### Frontend Development

```bash
# Check frontend logs
tail -f /var/log/supervisor/frontend-next.out.log

# Restart frontend
sudo supervisorctl restart frontend-next

# The frontend has hot-reload enabled
# Changes to files will auto-refresh
```

### Adding New Pages

1. Create page in `/app/frontend-next/app/`
2. Define rendering strategy (SSG, ISR, SSR)
3. Add to navigation in `components/layout/Header.tsx`

Example:
```typescript
// app/new-page/page.tsx
export const revalidate = 60; // ISR with 60s revalidation

export default async function NewPage() {
  // Fetch data from API
  const data = await fetch(`${API_URL}/api/endpoint`);
  
  return <div>Your page content</div>;
}
```

## Testing

### Backend Testing

```bash
# Test product endpoint
curl http://localhost:8001/api/content/products

# Test auth endpoint (requires session_token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8001/api/auth/me

# Test labs endpoint (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8001/api/content/labs
```

### Authentication Testing

See `/app/auth_testing.md` for comprehensive auth testing instructions.

```bash
# Create test user and session
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test@example.com',
  name: 'Test User',
  role: 'client',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Token: ' + sessionToken);
"
```

## Troubleshooting

### Backend Issues

```bash
# Check if MongoDB is running
sudo supervisorctl status mongodb

# Check backend logs for errors
tail -n 100 /var/log/supervisor/backend.err.log

# Restart all services
sudo supervisorctl restart all
```

### Frontend Issues

```bash
# Check Next.js build errors
cd /app/frontend-next
yarn build

# Check frontend logs
tail -n 100 /var/log/supervisor/frontend-next.err.log

# Clear Next.js cache
rm -rf .next
```

### Database Issues

```bash
# Check MongoDB status
sudo supervisorctl status mongodb

# Connect to MongoDB shell
mongosh

# View collections
use test_database
show collections
db.products.find().limit(1).pretty()
```

## Environment Variables

**Backend** (`/app/backend/.env`):
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
```

**Frontend** (`/app/frontend-next/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_ENVIRONMENT=development
```

## Technology Stack

**Technology Stack:**
- Next.js 16.1.6
- React 19.2.4
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- Zod 4.3.6 (validation)
- React-Markdown 10.1.0
- Firebase 12.8.0 (authentication)

**Backend**
- FastAPI 0.110.1
- Python 3.11
- Motor 3.3.1 (MongoDB async driver)
- Pydantic 2.6+ (validation)
- Firebase Admin 7.1.0 (token verification)

**Infrastructure**
- Supervisor (process management)
- MongoDB 4.5
- Firebase Authentication

## Key Design Decisions

1. **Hybrid Architecture**: Next.js frontend + FastAPI backend for best of both worlds
2. **MongoDB Storage**: Database-backed content instead of file-based
3. **Schema Sync**: Zod (frontend) mirrors Pydantic (backend) for type safety
4. **ISR Strategy**: 60s revalidation balances freshness and performance
5. **Emergent OAuth**: Simplified authentication without Firebase setup

## Performance Targets

- LCP (Largest Contentful Paint): < 2.0s
- FID (First Input Delay): < 50ms
- CLS (Cumulative Layout Shift): < 0.05
- Bundle Size: < 100KB gzipped (initial JS)

## Security Features

- HTTP-only cookies for session management
- CSRF protection via SameSite cookies
- Server-side authentication checks
- No sensitive data in client bundles
- Security headers (X-Frame-Options, etc.)

## Future Enhancements

- [ ] Client portal pages (`/private/clients/[clientSlug]`)
- [ ] Admin dashboard for content management
- [ ] Email notifications via API
- [ ] Search functionality across products/services
- [ ] Product comparison tool
- [ ] Analytics integration

## Support & Documentation

- **Frontend README**: `/app/frontend-next/README.md`
- **Auth Testing**: `/app/auth_testing.md`
- **API Docs**: http://localhost:8001/docs (when backend is running)

## License

© 2025 Relvanta AB. All rights reserved.

---

**Built with ❤️ by the Relvanta team**
