import Link from 'next/link';
import { getProducts } from '@/lib/api';
import { getServices } from '@/lib/api';
import type { Product, Service } from '@/lib/schemas';

export const revalidate = 60;

export default async function HomePage() {
  let products: Product[] = [];
  let services: Service[] = [];
  
  try {
    const [productsRes, servicesRes] = await Promise.all([
      getProducts({ visibility: 'public' }),
      getServices({ visibility: 'public' }),
    ]);
    products = productsRes.products;
    services = servicesRes.services;
  } catch (error) {
    console.warn('HomePage: could not fetch data:', error);
  }

  const activeProducts = products.filter(
    (p) => p.status === 'live' || p.status === 'beta'
  );

  return (
    <div className="flex flex-col gap-10 px-6 py-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col gap-6" data-testid="hero-section">
        <div className="relative flex flex-col items-center justify-center py-16 md:py-24 bg-charcoal-surface rounded-[1rem] border border-glass-border shadow-2xl overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pulse-glow"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern pointer-events-none"></div>
          
          {/* Logo with animation */}
          <div className="flex items-center gap-5 z-10 relative">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-7 h-7 bg-white/20 rounded-[3px] z-20 backdrop-blur-sm border border-white/10 opacity-0 scale-in stagger-2"></div>
              <div className="absolute top-[5px] right-0 w-7 h-7 bg-primary rounded-[3px] z-30 shadow-[0_0_20px_rgba(59,130,246,0.6)] opacity-0 scale-in stagger-3"></div>
              <div className="absolute bottom-[5px] left-[5px] w-7 h-7 bg-charcoal-light border border-white/10 rounded-[3px] z-10 opacity-0 scale-in stagger-4"></div>
              <div className="absolute bottom-0 right-[5px] w-7 h-7 bg-white/5 rounded-[3px] z-0 opacity-0 scale-in stagger-5"></div>
            </div>
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none opacity-0 slide-in stagger-6">
              Relvanta
            </div>
          </div>

          {/* Subtitle */}
          <p className="mt-6 text-center text-white/60 text-sm md:text-base max-w-md z-10 relative px-4">
            Effortless AI integration for business automation
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 z-10 relative">
            <Link 
              href="/products"
              className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              data-testid="hero-explore-btn"
            >
              Explore Products
            </Link>
            <Link
              href="/services"
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm font-medium transition-all"
              data-testid="hero-services-btn"
            >
              View Services
            </Link>
          </div>

          {/* Status badges */}
          <div className="mt-8 flex items-center gap-3 z-10 relative">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider text-white/50 font-medium">Dark Mode</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider text-white/50 font-medium">V2.0</span>
          </div>

          {/* System Status */}
          <div className="mt-6 flex items-center gap-2 z-10 relative">
            <div className="size-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            <span className="text-xs text-white/40">All systems operational</span>
          </div>
        </div>

        <div className="px-1">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">AI-Powered Business Solutions</h1>
          <p className="text-gray-400 text-sm leading-relaxed font-light">
            A high-performance platform designed for medium-sized businesses. Utilizing advanced AI, intuitive interfaces, and precise automation to transform your operations.
          </p>
        </div>
      </section>

      {/* Featured Services - Horizontal Scroll */}
      <section className="space-y-5 -mx-6" data-testid="featured-services">
        <div className="flex items-center justify-between px-6 border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">Featured Services</h3>
          <Link href="/services" className="text-primary text-xs font-medium hover:underline">
            View All →
          </Link>
        </div>
        
        <div className="overflow-x-auto smooth-scroll hide-scroll px-6">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
            {services.length === 0 && (
              <>
                <PlaceholderServiceCard title="Analytics Pro" icon="dashboard" status="Active" />
                <PlaceholderServiceCard title="Alert System" icon="notifications" status="3 Alerts" />
                <PlaceholderServiceCard title="System Control" icon="settings" status="Available" />
                <PlaceholderServiceCard title="Global Distribution" icon="public" status="Operational" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* AI Products Section */}
      <section className="space-y-4" data-testid="ai-products">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">AI Products</h3>
          <span className="text-[10px] text-gray-500 font-mono">BY RELVANTA</span>
        </div>

        <div className="grid gap-4">
          {activeProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {activeProducts.length === 0 && (
            <>
              <PlaceholderProductCard 
                name="oneEye" 
                tagline="Keep an eye on everything, effortlessly"
                description="AI-driven security monitoring that watches your systems 24/7."
                color="purple"
                letter="1"
              />
              <PlaceholderProductCard 
                name="predictor" 
                tagline="Complex predictions, simplified"
                description="Turn your data into actionable forecasts with AI-powered predictions."
                color="blue"
                letter="P"
              />
              <PlaceholderProductCard 
                name="dressUp" 
                tagline="Polish your user experience with AI"
                description="UX analysis and optimization powered by AI insights."
                color="red"
                letter="D"
              />
              <PlaceholderProductCard 
                name="FlowBot" 
                tagline="Streamline repetitive tasks with AI"
                description="Workflow automation that learns from your patterns."
                color="amber"
                letter="F"
              />
            </>
          )}
        </div>
      </section>

      {/* Why Relvanta Section */}
      <section className="space-y-6" data-testid="why-relvanta">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">Why Relvanta?</h3>
        </div>

        <div className="bg-charcoal-surface rounded-3xl p-6 border border-glass-border shadow-xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">bolt</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Production-Ready AI</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Pre-built solutions that work out of the box. No lengthy R&D cycles.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="size-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-500 text-2xl">support_agent</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Expert Guidance</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Strategic consulting from AI researchers and industry veterans.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="size-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-purple-500 text-2xl">trending_up</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Scalable Architecture</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Infrastructure that grows with your business. Start small, scale fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-charcoal-surface rounded-3xl p-8 border border-glass-border text-center" data-testid="cta-section">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Ready to Transform Your Business?</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          Schedule a consultation to explore how Relvanta can help you achieve your AI goals.
        </p>
        <Link
          href="/services"
          className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          data-testid="cta-get-started-btn"
        >
          Get Started
        </Link>
      </section>

      {/* Grid decoration */}
      <div className="flex items-center justify-center opacity-10 py-6">
        <span className="material-symbols-outlined text-4xl text-white">grid_4x4</span>
      </div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const icons = ['dashboard', 'notifications', 'settings', 'public'];
  return (
    <Link 
      href={`/services/${service.slug}`}
      className="w-[280px] bg-charcoal-surface rounded-2xl p-6 border border-glass-border hover:border-primary/30 transition-all group cursor-pointer"
      data-testid={`service-card-${service.slug}`}
    >
      <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <span className="material-symbols-outlined text-primary text-2xl">{icons[index % 4]}</span>
      </div>
      <h4 className="text-white font-semibold mb-2">{service.name}</h4>
      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
        {service.summary}
      </p>
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full border border-primary/20">
          {service.engagement_type}
        </span>
        <span className="text-white/30 text-xs">{service.duration || 'Flexible'}</span>
      </div>
    </Link>
  );
}

function PlaceholderServiceCard({ title, icon, status }: { title: string; icon: string; status: string }) {
  return (
    <div className="w-[280px] bg-charcoal-surface rounded-2xl p-6 border border-glass-border hover:border-primary/30 transition-all group cursor-pointer">
      <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
      </div>
      <h4 className="text-white font-semibold mb-2">{title}</h4>
      <p className="text-gray-400 text-xs leading-relaxed mb-4">
        Real-time insights with advanced visualization and predictive modeling
      </p>
      <div className="flex items-center justify-between">
        <span className="text-primary text-xs font-mono">{status}</span>
        <span className="text-white/30 text-xs">Updated 2h ago</span>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const colorMap: Record<string, string> = {
    '#7C3AED': 'purple',
    '#3b82f6': 'blue',
    '#ef4444': 'red',
    '#f59e0b': 'amber',
  };
  const color = colorMap[product.accent_color || '#3b82f6'] || 'blue';
  
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="product-card-hover relative bg-charcoal-surface rounded-2xl p-5 border border-glass-border overflow-hidden group cursor-pointer"
      data-testid={`product-card-${product.slug}`}
    >
      {/* Colored top border */}
      <div className={`top-border absolute top-0 left-0 w-full h-0.5 bg-${color}-500`}></div>
      
      <div className="flex items-start gap-4">
        <div 
          className={`w-12 h-12 rounded-lg bg-${color}-500/10 flex items-center justify-center shrink-0`}
          style={{ backgroundColor: `${product.accent_color}15` }}
        >
          <span 
            className="text-2xl font-bold"
            style={{ color: product.accent_color }}
          >
            {product.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold mb-1">{product.name}</h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-mono">by Relvanta</p>
          {product.tagline && (
            <p className="text-xs text-gray-400 italic mb-2">{product.tagline}</p>
          )}
          <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
            {product.short_description}
          </p>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderProductCard({ 
  name, 
  tagline, 
  description, 
  color, 
  letter 
}: { 
  name: string; 
  tagline: string; 
  description: string; 
  color: string; 
  letter: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'bg-purple-500' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'bg-blue-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'bg-red-500' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'bg-amber-500' },
  };
  const c = colorClasses[color];

  return (
    <div className="product-card-hover relative bg-charcoal-surface rounded-2xl p-5 border border-glass-border overflow-hidden group cursor-pointer">
      <div className={`top-border absolute top-0 left-0 w-full h-0.5 ${c.border}`}></div>
      
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
          <span className={`text-2xl font-bold ${c.text}`}>{letter}</span>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{name}</h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-mono">by Relvanta</p>
          <p className="text-xs text-gray-400 italic mb-2">{tagline}</p>
          <p className="text-xs text-white/70 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
