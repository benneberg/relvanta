import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/api/',
          '/_next/',
          '/labs/', // Protected content
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI crawler
        disallow: ['/'], // Optionally block AI crawlers from certain content
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
