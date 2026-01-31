/**
 * API client utilities for fetching content from the FastAPI backend.
 */
import {
  Product,
  Service,
  Lab,
  Page,
  ProductSchema,
  ServiceSchema,
  LabSchema,
  PageSchema,
  ProductListResponseSchema,
  ServiceListResponseSchema,
  LabListResponseSchema,
  User,
  UserSchema,
} from './schemas';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

/**
 * Fetch all products with optional filters
 */
export async function getProducts(params?: {
  visibility?: string;
  status?: string;
  category?: string;
  revalidate?: number;
}): Promise<{ products: Product[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params?.visibility) queryParams.set('visibility', params.visibility);
  if (params?.status) queryParams.set('status', params.status);
  if (params?.category) queryParams.set('category', params.category);

  const url = `${API_URL}/api/content/products${queryParams.toString() ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    next: { revalidate: params?.revalidate ?? 60 }, // ISR with 60s revalidation
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  return ProductListResponseSchema.parse(data);
}

/**
 * Fetch a single product by slug
 */
export async function getProduct(slug: string, revalidate = 60): Promise<Product> {
  const response = await fetch(`${API_URL}/api/content/products/${slug}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const data = await response.json();
  return ProductSchema.parse(data);
}

/**
 * Fetch all services
 */
export async function getServices(params?: {
  visibility?: string;
  engagement_type?: string;
  revalidate?: number;
}): Promise<{ services: Service[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params?.visibility) queryParams.set('visibility', params.visibility);
  if (params?.engagement_type) queryParams.set('engagement_type', params.engagement_type);

  const url = `${API_URL}/api/content/services${queryParams.toString() ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    next: { revalidate: params?.revalidate ?? 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.statusText}`);
  }

  const data = await response.json();
  return ServiceListResponseSchema.parse(data);
}

/**
 * Fetch a single service by slug
 */
export async function getService(slug: string, revalidate = 60): Promise<Service> {
  const response = await fetch(`${API_URL}/api/content/services/${slug}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Service not found');
    }
    throw new Error(`Failed to fetch service: ${response.statusText}`);
  }

  const data = await response.json();
  return ServiceSchema.parse(data);
}

/**
 * Fetch all labs (requires authentication)
 */
export async function getLabs(params?: {
  status?: string;
  token?: string;
}): Promise<{ labs: Lab[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set('status', params.status);

  const url = `${API_URL}/api/content/labs${queryParams.toString() ? `?${queryParams}` : ''}`;

  const headers: HeadersInit = {};
  if (params?.token) {
    headers['Authorization'] = `Bearer ${params.token}`;
  }

  const response = await fetch(url, {
    headers,
    cache: 'no-store', // SSR - always fetch fresh
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch labs: ${response.statusText}`);
  }

  const data = await response.json();
  return LabListResponseSchema.parse(data);
}

/**
 * Fetch a single lab by slug (requires authentication)
 */
export async function getLab(slug: string, token?: string): Promise<Lab> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/content/labs/${slug}`, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Lab not found');
    }
    throw new Error(`Failed to fetch lab: ${response.statusText}`);
  }

  const data = await response.json();
  return LabSchema.parse(data);
}

/**
 * Fetch a page by slug
 */
export async function getPage(slug: string, revalidate = 60): Promise<Page> {
  const response = await fetch(`${API_URL}/api/content/pages/${slug}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Page not found');
    }
    throw new Error(`Failed to fetch page: ${response.statusText}`);
  }

  const data = await response.json();
  return PageSchema.parse(data);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(token?: string): Promise<User | null> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers,
      credentials: 'include', // Send cookies
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return UserSchema.parse(data);
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
}

/**
 * Create session from Emergent OAuth session_id
 */
export async function createSession(sessionId: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth/session`, {
    method: 'POST',
    headers: {
      'X-Session-ID': sessionId,
    },
    credentials: 'include', // Store cookies
  });

  if (!response.ok) {
    throw new Error('Failed to create session');
  }

  const data = await response.json();
  return UserSchema.parse(data);
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
