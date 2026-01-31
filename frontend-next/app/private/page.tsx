import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/api';
import Link from 'next/link';

export default async function PrivateDashboard() {
  // Get session token from cookies
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  // Redirect to login if not authenticated
  if (!sessionToken) {
    redirect('/login?returnTo=/private');
  }

  // Get current user
  let user;
  try {
    user = await getCurrentUser(sessionToken);
    if (!user) {
      redirect('/login?returnTo=/private');
    }
  } catch (error) {
    redirect('/login?returnTo=/private');
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your personalized AI dashboard
              </p>
            </div>
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-700"
              />
            )}
          </div>

          {/* User Info Card */}
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Email
                </p>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Role
                </p>
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full uppercase">
                  {user.role}
                </span>
              </div>
              {user.organization_slug && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Organization
                  </p>
                  <p className="text-gray-900 dark:text-white">{user.organization_slug}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/products"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Browse Products
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Explore our AI-powered solutions
            </p>
          </Link>

          <Link
            href="/services"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Consulting Services
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Expert guidance for your AI journey
            </p>
          </Link>

          <Link
            href="/labs"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Experimental Labs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Preview cutting-edge innovations
            </p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Getting Started
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Explore Products
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Browse our AI solutions and find the perfect fit for your business needs.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Schedule a Consultation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Book a call with our experts to discuss your AI strategy.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Start Building
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Deploy your first AI solution and start seeing results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
