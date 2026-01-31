# Relvanta Platform - Next.js Frontend

Modern AI solutions platform built with Next.js 14+ App Router, TypeScript, and Tailwind CSS.

## Architecture

**Hybrid Approach:**
- **Frontend**: Next.js 14+ with App Router (this application)
- **Backend**: FastAPI + MongoDB (separate service)
- **Authentication**: Emergent Google OAuth

## Project Structure

```
frontend-next/
├── app/                    # Next.js App Router pages
│   ├── (pages)/
│   │   ├── page.tsx       # Homepage (SSG)
│   │   ├── products/      # Products listing & detail (ISR)
│   │   ├── services/      # Services listing & detail (ISR)
│   │   ├── labs/          # Labs (SSR, auth-required)
│   │   ├── private/       # Private dashboard (SSR, auth-required)
│   │   ├── login/         # Login page (Client)
│   │   └── about/         # About page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── not-found.tsx      # 404 page
├── components/
│   ├── layout/            # Header, Footer
│   └── content/           # MDXRenderer
├── lib/
│   ├── schemas.ts         # Zod schemas (mirrors backend Pydantic)
│   └── api.ts             # API client utilities
└── public/                # Static assets

## Features

### Content Types
- **Products**: AI solutions with ISR (60s revalidation)
- **Services**: Consulting offerings with ISR
- **Labs**: Experimental projects (SSR, requires auth)
- **Pages**: Static content pages

### Authentication
- Emergent Google OAuth integration
- Session management with HTTP-only cookies
- Protected routes: `/private/*`, `/labs/*`
- Automatic redirect to login for unauthenticated users

### Rendering Strategies
- **SSG** (Static Site Generation): Homepage, Login
- **ISR** (Incremental Static Regeneration): Products, Services (60s revalidation)
- **SSR** (Server-Side Rendering): Labs, Private dashboard

### Design System
- Custom CSS Variables for theming
- Semantic tokens (--color-text-primary, --spacing-section, etc.)
- Dark mode support via `prefers-color-scheme`
- Tailwind CSS for utility classes

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn package manager
- Backend API running on port 8001

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_ENVIRONMENT=development
```

## Development

### Adding New Content Types

1. **Define Zod Schema** in `lib/schemas.ts`
2. **Create API Function** in `lib/api.ts`
3. **Create Backend Endpoint** in FastAPI
4. **Build UI Pages** in `app/`

### Adding Protected Routes

1. Check for session token in cookies:
```typescript
import { cookies } from 'next/headers';

const cookieStore = await cookies();
const sessionToken = cookieStore.get('session_token')?.value;

if (!sessionToken) {
  redirect('/login?returnTo=/your-route');
}
```

2. Pass token to API functions that require auth

## API Integration

All API calls go through `lib/api.ts`, which:
- Validates responses with Zod schemas
- Handles authentication headers
- Implements appropriate caching strategies (ISR, SSR, no-cache)

Example:
```typescript
import { getProducts } from '@/lib/api';

// ISR with 60s revalidation
const { products } = await getProducts({ visibility: 'public' });

// SSR with auth
const { labs } = await getLabs({ token: sessionToken });
```

## Content Management

Content is stored in MongoDB and fetched via FastAPI endpoints:
- **Products**: `/api/content/products`
- **Services**: `/api/content/services`
- **Labs**: `/api/content/labs`
- **Pages**: `/api/content/pages/{slug}`

## Authentication Flow

1. User clicks "Sign In with Google"
2. Redirected to `https://auth.emergentagent.com/`
3. After OAuth, returned to `/login#session_id={session_id}`
4. Frontend exchanges `session_id` for `session_token`
5. `session_token` stored in HTTP-only cookie
6. Cookie automatically sent with API requests

## Deployment

The application is designed for deployment on Vercel or similar platforms:

1. **Environment Variables**: Configure in deployment platform
2. **Backend URL**: Set `NEXT_PUBLIC_API_URL` to production backend
3. **Build Command**: `yarn build`
4. **Start Command**: `yarn start`
5. **Port**: Defaults to 3001 (configurable)

## Performance

- **LCP Target**: < 2.0s
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Caching**: ISR for products/services, SSR for protected content

## Security

- HTTP-only cookies for session management
- CSRF protection via SameSite cookies
- Content Security Policy headers
- Protected routes with server-side auth checks
- No sensitive data in client bundles

## Testing

```bash
# Run linter
yarn lint

# Build to check for errors
yarn build
```

## Technologies

- **Framework**: Next.js 16.1+
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 4.1+
- **Validation**: Zod 4.3+
- **Markdown**: React-Markdown
- **HTTP Client**: Native fetch with Next.js caching

## Key Decisions

1. **Hybrid Architecture**: Keep FastAPI for backend logic, use Next.js for rendering
2. **MongoDB vs File-based**: Content stored in MongoDB (not file-based as in original spec)
3. **Zod + Pydantic**: Parallel schemas with identical structure for type safety
4. **ISR for Public Content**: 60s revalidation balances freshness and performance
5. **SSR for Protected Content**: Always fresh data for authenticated users

## Support

For questions or issues:
- Backend API: Check `/app/backend/`
- Content seeding: Run `/app/backend/seed_content.py`
- Authentication: See `/app/auth_testing.md`

## License

© 2025 Relvanta AB. All rights reserved.
