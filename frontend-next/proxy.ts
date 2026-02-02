import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Cache redirects in memory (refresh every 5 minutes)
let redirectsCache: { from: string; to: string; permanent: boolean }[] = [];
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchRedirects() {
  const now = Date.now();
  
  // Return cached if still fresh
  if (redirectsCache.length > 0 && now - lastFetch < CACHE_DURATION) {
    return redirectsCache;
  }

  try {
    const response = await fetch(`${API_URL}/api/content/redirects`, {
      next: { revalidate: 300 }, // 5 minutes
    });

    if (response.ok) {
      const data = await response.json();
      redirectsCache = data.redirects || [];
      lastFetch = now;
    }
  } catch (error) {
    console.error('Failed to fetch redirects:', error);
  }

  return redirectsCache;
}

// Named export for Next.js 16+ proxy
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip proxy for certain paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Fetch and check redirects
  const redirects = await fetchRedirects();
  const redirect = redirects.find((r) => r.from === pathname);

  if (redirect) {
    const url = request.nextUrl.clone();
    url.pathname = redirect.to;
    
    return NextResponse.redirect(url, redirect.permanent ? 308 : 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
