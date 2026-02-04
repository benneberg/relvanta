import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/api';
import { Product } from '@/lib/schemas';
import MDXRenderer from '@/components/content/MDXRenderer';
import Link from 'next/link';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { products } = await getProducts({ visibility: 'public' });
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.warn('Could not fetch products during build:', error);
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
    <div className="flex flex-col gap-8 px-6 py-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" data-testid="product-breadcrumb">
        <Link href="/products" className="text-white/40 hover:text-white transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Products
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60">{product.name}</span>
      </nav>

      {/* Header */}
      <section className="bg-charcoal-surface rounded-3xl p-8 border border-glass-border relative overflow-hidden" data-testid="product-header">
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-30"
          style={{ backgroundColor: product.accent_color || '#3b82f6' }}
        ></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${product.accent_color || '#3b82f6'}20` }}
            >
              <span 
                className="text-3xl font-bold"
                style={{ color: product.accent_color || '#3b82f6' }}
              >
                {product.name.charAt(0)}
              </span>
            </div>
            {product.status === 'beta' && (
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-semibold rounded-full border border-yellow-500/20 uppercase">
                Beta
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid="product-title">
            {product.name}
          </h1>
          {product.tagline && (
            <p className="text-lg text-white/60 italic mb-4">{product.tagline}</p>
          )}
          <p className="text-white/70 leading-relaxed mb-6">
            {product.short_description}
          </p>

          {/* Links */}
          {product.links && (
            <div className="flex flex-wrap gap-3">
              {product.links.demo && (
                <a
                  href={product.links.demo}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-full transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  data-testid="product-demo-link"
                >
                  Try Demo
                </a>
              )}
              {product.links.docs && (
                <a
                  href={product.links.docs}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-full transition-all"
                  data-testid="product-docs-link"
                >
                  Documentation
                </a>
              )}
              {product.links.external && (
                <a
                  href={product.links.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-full transition-all"
                >
                  Learn More
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-charcoal-surface rounded-2xl p-6 border border-glass-border" data-testid="product-content">
        <div className="prose prose-invert prose-sm max-w-none">
          <MDXRenderer content={product.long_description} />
        </div>
      </section>

      {/* Info Grid */}
      <section className="grid md:grid-cols-2 gap-4" data-testid="product-info">
        <div className="bg-charcoal-surface rounded-2xl p-6 border border-glass-border">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Category</h3>
          <p className="text-white font-medium">{product.category}</p>
        </div>
        {product.target_audience && (
          <div className="bg-charcoal-surface rounded-2xl p-6 border border-glass-border">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Target Audience</h3>
            <p className="text-white font-medium">{product.target_audience}</p>
          </div>
        )}
      </section>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <section className="bg-charcoal-surface rounded-2xl p-6 border border-glass-border" data-testid="product-features">
          <h3 className="text-sm font-semibold text-white tracking-wide mb-4">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="size-2 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                <span className="text-white/70 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4" data-testid="related-products">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">Related Products</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.slug}`}
                className="product-card-hover bg-charcoal-surface rounded-2xl p-5 border border-glass-border group"
                data-testid={`related-product-${relatedProduct.slug}`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${relatedProduct.accent_color || '#3b82f6'}15` }}
                  >
                    <span style={{ color: relatedProduct.accent_color || '#3b82f6' }} className="text-xl font-bold">
                      {relatedProduct.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold mb-1 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{relatedProduct.category}</p>
                    <p className="text-sm text-white/60 line-clamp-2">{relatedProduct.short_description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-charcoal-surface rounded-3xl p-8 border border-glass-border text-center" data-testid="product-cta">
        <h3 className="text-xl font-bold text-white mb-3">Interested in {product.name}?</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          Contact our team to learn how {product.name} can help your business.
        </p>
        <a
          href={`mailto:hello@relvanta.com?subject=Inquiry about ${product.name}`}
          className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          data-testid="product-contact-btn"
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
}
