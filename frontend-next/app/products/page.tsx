import Link from 'next/link';
import { getProducts } from '@/lib/api';
import type { Product } from '@/lib/schemas';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function ProductsPage() {
  // Don’t fail the build if the backend isn’t reachable during `next build`.
  // Vercel builds often run without access to your separate API.
  let products: Product[] = [];
  try {
    const response = await getProducts({ visibility: 'public' });
    products = response.products;
  } catch (error) {
    console.warn('ProductsPage: could not fetch products, rendering empty state:', error);
  }

  // Filter to show only live and beta products
  const activeProducts = products.filter(
    (p) => p.status === 'live' || p.status === 'beta'
  );

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI Products
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Production-ready AI solutions designed to solve real business problems.
            Deploy in days, not months.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all p-6 h-full">
                {/* Status Badge */}
                {product.status === 'beta' && (
                  <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded-full mb-4">
                    BETA
                  </span>
                )}

                {/* Icon/Accent Color */}
                <div
                  className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: product.accent_color }}
                >
                  {product.name.charAt(0)}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {product.category}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {product.short_description}
                </p>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {product.features.slice(0, 3).map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA */}
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                  Learn more
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {activeProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No products available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
