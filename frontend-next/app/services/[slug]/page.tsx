import { notFound } from 'next/navigation';
import { getService, getServices } from '@/lib/api';
import MDXRenderer from '@/components/content/MDXRenderer';
import Link from 'next/link';

export const revalidate = 60; // ISR

export async function generateStaticParams() {
  const { services } = await getServices({ visibility: 'public' });
  return services.map((service) => ({
    slug: service.slug,
  }));
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

  // Fetch related services if IDs exist
  let relatedServices = [];
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
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/services" className="hover:text-blue-600 dark:hover:text-blue-400">
            Services
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{service.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full mb-4 uppercase">
            {service.engagement_type}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {service.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {service.summary}
          </p>

          {/* Duration */}
          {service.duration && (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Duration:</strong> {service.duration}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <MDXRenderer content={service.description} />
        </div>

        {/* Deliverables */}
        {service.deliverables && service.deliverables.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Deliverables
            </h2>
            <ul className="space-y-3">
              {service.deliverables.map((deliverable, idx) => (
                <li key={idx} className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-8 bg-blue-50 dark:bg-gray-800 rounded-xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Contact our team to discuss your needs and how we can help.
          </p>
          <a
            href="mailto:hello@relvanta.com?subject=Inquiry about ${service.name}"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
