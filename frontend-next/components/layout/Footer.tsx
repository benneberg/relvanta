import Link from 'next/link';
import { getFooterNavigation } from '@/lib/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerSections = getFooterNavigation();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Relvanta
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Empowering medium-sized businesses with cutting-edge AI solutions.
            </p>
          </div>

          {/* Dynamic Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Relvanta AB. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="mailto:hello@relvanta.com"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
              >
                Contact
              </a>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Stockholm, Sweden
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
