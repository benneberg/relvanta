import Link from 'next/link';
import { getServices } from '@/lib/api';
import type { Service } from '@/lib/schemas';

export const revalidate = 60;

export default async function ServicesPage() {
  let services: Service[] = [];
  try {
    const response = await getServices({ visibility: 'public' });
    services = response.services;
  } catch (error) {
    console.warn('ServicesPage: could not fetch services:', error);
  }

  return (
    <div className="flex flex-col gap-8 px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <section className="space-y-4" data-testid="services-header">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <h2 className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">Services</h2>
        </div>
        
        <div className="relvanta-card rounded-3xl p-8 border border-glass-border relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">AI Services</h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Expert consulting and implementation services to help you successfully adopt AI in your organization.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-4" data-testid="services-grid">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">All Services</h3>
          <span className="text-[10px] text-gray-500 font-mono">{services.length} AVAILABLE</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {services.length === 0 && (
          <div className="relvanta-card rounded-2xl p-12 border border-glass-border text-center">
            <span className="material-symbols-outlined text-4xl text-white/20 mb-4">handshake</span>
            <p className="text-gray-400 text-sm">No services available at the moment. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Process Section */}
      <section className="space-y-4" data-testid="services-process">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">Our Process</h3>
        </div>

        <div className="relvanta-card rounded-3xl p-6 border border-glass-border">
          <div className="grid md:grid-cols-4 gap-6">
            <ProcessStep number="01" title="Discovery" description="Understanding your business needs and AI opportunities" />
            <ProcessStep number="02" title="Strategy" description="Developing a tailored AI implementation roadmap" />
            <ProcessStep number="03" title="Implementation" description="Building and deploying AI solutions" />
            <ProcessStep number="04" title="Optimization" description="Continuous improvement and scaling" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relvanta-card rounded-3xl p-8 border border-glass-border text-center" data-testid="services-cta">
        <h2 className="text-xl font-bold text-white mb-3">Ready to Get Started?</h2>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          Let&apos;s discuss how we can help transform your business with AI.
        </p>
        <a
          href="mailto:hello@relvanta.com"
          className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          data-testid="services-contact-btn"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const icons = ['dashboard', 'psychology', 'settings', 'support_agent', 'analytics', 'code'];
  const colors = ['primary', 'green-500', 'purple-500', 'amber-500', 'cyan-500', 'pink-500'];
  const color = colors[index % colors.length];
  const icon = icons[index % icons.length];

  return (
    <Link 
      href={`/services/${service.slug}`}
      className="product-card-hover relvanta-card rounded-2xl p-6 border border-glass-border group"
      data-testid={`service-card-${service.slug}`}
    >
      <div className={`size-12 bg-${color}/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${color}/20 transition-colors`}>
        <span className={`material-symbols-outlined text-${color} text-2xl`}>{icon}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-white font-semibold">{service.name}</h4>
      </div>
      
      <span className="inline-block px-2 py-0.5 bg-white/5 text-white/50 text-[10px] rounded-full uppercase tracking-wider mb-3">
        {service.engagement_type}
      </span>
      
      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">
        {service.summary}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        {service.duration && (
          <span className="text-white/30 text-xs">{service.duration}</span>
        )}
        <span className="text-primary text-xs font-medium group-hover:underline ml-auto">
          Learn more →
        </span>
      </div>
    </Link>
  );
}

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center p-4">
      <div className="text-3xl font-bold text-primary/30 mb-2 font-mono">{number}</div>
      <h4 className="text-white font-semibold mb-2">{title}</h4>
      <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
    </div>
  );
}
