import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getLabs } from '@/lib/api';
import Link from 'next/link';

export default async function LabsPage() {
  // Get session token from cookies
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  // Redirect to login if not authenticated
  if (!sessionToken) {
    redirect('/login?returnTo=/labs');
  }

  let labs;
  try {
    const response = await getLabs({ token: sessionToken });
    labs = response.labs;
  } catch (error) {
    // If authentication fails, redirect to login
    redirect('/login?returnTo=/labs');
  }

  // Status badges
  const statusColors = {
    hypothesis: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    running: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    validated: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    failed: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    graduated: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Relvanta Labs
            </h1>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-semibold rounded-full">
              EXPERIMENTAL
            </span>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Explore our cutting-edge experiments and early-stage innovations. These projects
            represent the future of AI at Relvanta.
          </p>
        </div>

        {/* Labs Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {labs.map((lab) => (
            <Link key={lab.id} href={`/labs/${lab.slug}`} className="group block">
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all p-6 h-full">
                {/* Status */}
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 uppercase ${statusColors[lab.status]}`}
                >
                  {lab.status}
                </span>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lab.name}
                </h3>

                {/* Hypothesis */}
                {lab.hypothesis && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      Hypothesis:
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">{lab.hypothesis}</p>
                  </div>
                )}

                {/* Metrics */}
                {lab.metrics && lab.metrics.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {lab.metrics.slice(0, 3).map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                      >
                        <span>{metric.name}:</span>
                        <span className="font-semibold">
                          {metric.actual || metric.target}
                          {metric.actual && (
                            <span className="text-gray-400 ml-1">/ {metric.target}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:underline mt-4">
                  View experiment
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
        {labs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No active experiments at the moment. Check back soon for new innovations!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
