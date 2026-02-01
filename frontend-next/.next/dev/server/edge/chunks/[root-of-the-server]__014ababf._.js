(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__014ababf._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/frontend-next/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend-next/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "https://document-reviewer.preview.emergentagent.com") || 'http://localhost:8001';
// Cache redirects in memory (refresh every 5 minutes)
let redirectsCache = [];
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
            next: {
                revalidate: 300
            }
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
async function middleware(request) {
    const pathname = request.nextUrl.pathname;
    // Skip middleware for certain paths
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Fetch and check redirects
    const redirects = await fetchRedirects();
    const redirect = redirects.find((r)=>r.from === pathname);
    if (redirect) {
        const url = request.nextUrl.clone();
        url.pathname = redirect.to;
        return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url, redirect.permanent ? 308 : 307);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2d$next$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */ '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__014ababf._.js.map