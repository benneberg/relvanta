import Link from 'next/link';
import { getFooterNavigation } from '@/lib/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerSections = getFooterNavigation();

  return (
    <footer className="hidden md:block bg-charcoal-surface border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Logo Mark */}
              <div className="relative w-6 h-6">
                <div className="absolute top-0 left-0 w-3 h-3 bg-white/20 rounded-[2px] z-20"></div>
                <div className="absolute top-[2px] right-0 w-3 h-3 bg-primary rounded-[2px] z-30"></div>
                <div className="absolute bottom-[2px] left-[2px] w-3 h-3 bg-charcoal-light border border-white/10 rounded-[2px] z-10"></div>
                <div className="absolute bottom-0 right-[2px] w-3 h-3 bg-white/5 rounded-[2px] z-0"></div>
              </div>
              <span className="text-lg font-bold text-white">Relvanta</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Effortless AI integration for business automation. Empowering medium-sized businesses with cutting-edge solutions.
            </p>
          </div>

          {/* Dynamic Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm transition-colors"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {currentYear} Relvanta AB. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:hello@relvanta.com"
                className="text-white/40 hover:text-white text-sm transition-colors"
                data-testid="footer-contact-email"
              >
                hello@relvanta.com
              </a>
              <span className="text-white/20">•</span>
              <span className="text-white/40 text-sm">Stockholm, Sweden</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
