import { notFound } from 'next/navigation';
import { getService, getServices } from '@/lib/api';
import { Service } from '@/lib/schemas';
import MDXRenderer from '@/components/content/MDXRenderer';
import Link from 'next/link';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { services } = await getServices({ visibility: 'public' });
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.warn('Could not fetch services during build:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const service = await getService(slug);
    return {
      title: service.name,
      description: service.summary,
    };
  } catch {
    return {
      title: 'Service Not Found',
    };
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let service;
  try {
    service = await getService(slug);
  } catch {
    notFound();
  }

  let relatedServices: Service[] = [];
  if (service.related_services && service.related_services.length > 0) {
    try {
      const { services: allServices } = await getServices({ visibility: 'public' });
      relatedServices = allServices.filter(s => 
        service.related_services?.includes(s.id) && s.slug !== slug
      );
    } catch (error) {
      console.error('Error fetching related services:', error);
    }
  }

  return (
    <div className="flex flex-col gap-8 px-6 py-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" data-testid="service-breadcrumb">
        <Link href="/services" className="text-white/40 hover:text-white transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Services
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60">{service.name}</span>
      </nav>

      {/* Header */}
      <section className="bg-charcoal-surface rounded-3xl p-8 border border-glass-border relative overflow-hidden" data-testid="service-header">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20 uppercase mb-4">
            {service.engagement_type}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" data-testid="service-title">
            {service.name}
          </h1>
          <p className="text-white/70 leading-relaxed mb-4">
            {service.summary}
          </p>

          {service.duration && (
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <span className="material-symbols-outlined text-lg">schedule</span>
              <span>Duration: {service.duration}</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-charcoal-surface rounded-2xl p-6 border border-glass-border" data-testid="service-content">
        <div className="prose prose-invert prose-sm max-w-none">
          <MDXRenderer content={service.description} />
        </div>
      </section>

      {/* Scope */}
      {service.scope && service.scope.length > 0 && (
        <section className="bg-charcoal-surface rounded-2xl p-6 border border-glass-border" data-testid="service-scope">
          <h3 className="text-sm font-semibold text-white tracking-wide mb-4">Scope</h3>
          <div className="space-y-3">
            {service.scope.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="size-2 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] mt-2"></div>
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Deliverables */}
      {service.deliverables && service.deliverables.length > 0 && (
        <section className="bg-charcoal-surface rounded-2xl p-6 border border-glass-border" data-testid="service-deliverables">
          <h3 className="text-sm font-semibold text-white tracking-wide mb-4">Deliverables</h3>
          <div className="space-y-3">
            {service.deliverables.map((deliverable, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="size-5 bg-green-500/10 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-green-500 text-sm">check</span>
                </div>
                <span className="text-white/70 text-sm">{deliverable}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="space-y-4" data-testid="related-services">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">Related Services</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.id}
                href={`/services/${relatedService.slug}`}
                className="product-card-hover bg-charcoal-surface rounded-2xl p-5 border border-glass-border group"
                data-testid={`related-service-${relatedService.slug}`}
              >
                <span className="inline-block px-2 py-0.5 bg-white/5 text-white/50 text-[10px] rounded-full uppercase tracking-wider mb-3">
                  {relatedService.engagement_type}
                </span>
                <h4 className="text-white font-semibold mb-2 group-hover:text-primary transition-colors">
                  {relatedService.name}
                </h4>
                <p className="text-sm text-white/60 line-clamp-2 mb-3">{relatedService.summary}</p>
                {relatedService.duration && (
                  <p className="text-xs text-white/30">Duration: {relatedService.duration}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-charcoal-surface rounded-3xl p-8 border border-glass-border text-center" data-testid="service-cta">
        <h3 className="text-xl font-bold text-white mb-3">Ready to Get Started?</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          Contact our team to discuss your needs and how we can help.
        </p>
        <a
          href={`mailto:hello@relvanta.com?subject=Inquiry about ${service.name}`}
          className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          data-testid="service-contact-btn"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
}
