import Link from 'next/link';
import { getProducts } from '@/lib/api';
import type { Product } from '@/lib/schemas';

export const revalidate = 60;

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    const response = await getProducts({ visibility: 'public' });
    products = response.products;
  } catch (error) {
    console.warn('ProductsPage: could not fetch products:', error);
  }

  const activeProducts = products.filter(
    (p) => p.status === 'live' || p.status === 'beta'
  );

  return (
    <div className="flex flex-col gap-8 px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <section className="space-y-4" data-testid="products-header">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <h2 className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">Products</h2>
        </div>
        
        <div className="bg-charcoal-surface rounded-3xl p-8 border border-glass-border relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">AI Products</h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Production-ready AI solutions designed to solve real business problems. Deploy in days, not months.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="space-y-4" data-testid="products-grid">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">All Products</h3>
          <span className="text-[10px] text-gray-500 font-mono">{activeProducts.length} AVAILABLE</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {activeProducts.length === 0 && (
          <div className="bg-charcoal-surface rounded-2xl p-12 border border-glass-border text-center">
            <span className="material-symbols-outlined text-4xl text-white/20 mb-4">inventory_2</span>
            <p className="text-gray-400 text-sm">No products available at the moment. Check back soon!</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-charcoal-surface rounded-3xl p-8 border border-glass-border text-center" data-testid="products-cta">
        <h2 className="text-xl font-bold text-white mb-3">Need a Custom Solution?</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          Our team can build tailored AI solutions for your specific business needs.
        </p>
        <Link
          href="/services"
          className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          data-testid="products-contact-btn"
        >
          Explore Services
        </Link>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="product-card-hover relative bg-charcoal-surface rounded-2xl p-6 border border-glass-border overflow-hidden group"
      data-testid={`product-card-${product.slug}`}
    >
      {/* Colored top border */}
      <div 
        className="top-border absolute top-0 left-0 w-full h-0.5"
        style={{ backgroundColor: product.accent_color || '#3b82f6' }}
      ></div>
      
      <div className="flex items-start gap-4">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${product.accent_color || '#3b82f6'}15` }}
        >
          <span 
            className="text-2xl font-bold"
            style={{ color: product.accent_color || '#3b82f6' }}
          >
            {product.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-semibold text-lg">{product.name}</h4>
            {product.status === 'beta' && (
              <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] rounded-full border border-yellow-500/20 uppercase">
                Beta
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-mono">
            {product.category} • by Relvanta
          </p>
          {product.tagline && (
            <p className="text-xs text-gray-400 italic mb-2">{product.tagline}</p>
          )}
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            {product.short_description}
          </p>
          
          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.features.slice(0, 3).map((feature, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-white/50"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Arrow indicator */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-primary">arrow_forward</span>
      </div>
    </Link>
  );
}
