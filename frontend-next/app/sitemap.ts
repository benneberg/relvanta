import { MetadataRoute } from 'next';
import { getProducts, getServices } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '').replace(':8001', '') || 'http://localhost:3001';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { products } = await getProducts({ visibility: 'public' });
    
    productPages = [
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      ...products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: product.updated_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ];
  } catch (error) {
    console.warn('Could not fetch products for sitemap, using static pages only:', error);
    // Add just the products listing page
    productPages = [{
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }];
  }

  // Dynamic service pages
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const { services } = await getServices({ visibility: 'public' });
    
    servicePages = [
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      ...services.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updated_at,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
    ];
  } catch (error) {
    console.warn('Could not fetch services for sitemap, using static pages only:', error);
    // Add just the services listing page
    servicePages = [{
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }];
  }

  return [...staticPages, ...productPages, ...servicePages];
}
