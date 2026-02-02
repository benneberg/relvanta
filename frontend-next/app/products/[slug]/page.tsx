import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/api';
import { Product } from '@/lib/schemas';
import MDXRenderer from '@/components/content/MDXRenderer';
import Link from 'next/link';

export const revalidate = 60; // ISR

// Generate static paths for products
export async function generateStaticParams() {
  // During build, the API might not be accessible
  // Return empty array to skip static generation at build time
  // Pages will be generated on-demand with ISR
  try {
    const { products } = await getProducts({ visibility: 'public' });
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.warn('Could not fetch products during build, will generate on-demand:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    return {
      title: product.name,
      description: product.short_description,
    };
  } catch {
    return {
      title: 'Product Not Found',
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let product;
  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  // Fetch related products if IDs exist
  let relatedProducts: Product[] = [];
  if (product.related_products && product.related_products.length > 0) {
    try {
      const { products: allProducts } = await getProducts({ visibility: 'public' });
      relatedProducts = allProducts.filter(p => 
        product.related_products?.includes(p.id) && p.slug !== slug
      );
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: product.accent_color }}
            >
              {product.name.charAt(0)}
            </div>
            {product.status === 'beta' && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded-full">
                BETA
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {product.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            {product.tagline}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {product.short_description}
          </p>

          {/* Links */}
          {product.links && (
            <div className="flex flex-wrap gap-4">
              {product.links.demo && (
                <a
                  href={product.links.demo}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Try Demo
                </a>
              )}
              {product.links.docs && (
                <a
                  href={product.links.docs}
                  className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-colors"
                >
                  Documentation
                </a>
              )}
              {product.links.external && (
                <a
                  href={product.links.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-colors"
                >
                  Learn More
                </a>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <MDXRenderer content={product.long_description} />
        </div>

        {/* Sidebar Info */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
          {/* Category */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Category
            </h3>
            <p className="text-lg text-gray-900 dark:text-white">{product.category}</p>
          </div>

          {/* Target Audience */}
          {product.target_audience && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Target Audience
              </h3>
              <p className="text-lg text-gray-900 dark:text-white">
                {product.target_audience}
              </p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Products
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group block p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: relatedProduct.accent_color }}
                  >
                    {relatedProduct.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {relatedProduct.category}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                    {relatedProduct.short_description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-8 bg-blue-50 dark:bg-gray-800 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Interested in {product.name}?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Contact our team to learn how {product.name} can help your business.
          </p>
          <a
            href="mailto:hello@relvanta.com?subject=Inquiry about ${product.name}"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
