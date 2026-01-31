import Link from 'next/link';
import { getServices } from '@/lib/api';

export const revalidate = 60; // ISR

export default async function ServicesPage() {
  const { services } = await getServices({ visibility: 'public' });

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Expert consulting and implementation services to help you successfully adopt
            AI in your organization.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all p-6 h-full flex flex-col">
                {/* Engagement Type Badge */}
                <span className="inline-block self-start px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full mb-4 uppercase">
                  {service.engagement_type}
                </span>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                  {service.summary}
                </p>

                {/* Duration */}
                {service.duration && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Duration: {service.duration}
                  </p>
                )}

                {/* Scope */}
                {service.scope && service.scope.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {service.scope.slice(0, 3).map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                      >
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA */}
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:underline mt-auto">
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
        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No services available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
