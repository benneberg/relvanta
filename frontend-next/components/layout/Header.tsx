'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getMainNavigation } from '@/lib/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = getMainNavigation();

  return (
    <header className="sticky top-0 z-40 bg-charcoal-dark/80 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" data-testid="header-logo">
            {/* Animated Logo Mark */}
            <div className="relative w-8 h-8">
              <div className="absolute top-0 left-0 w-4 h-4 bg-white/20 rounded-[2px] z-20 backdrop-blur-sm border border-white/10"></div>
              <div className="absolute top-[3px] right-0 w-4 h-4 bg-primary rounded-[2px] z-30 shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
              <div className="absolute bottom-[3px] left-[3px] w-4 h-4 bg-charcoal-light border border-white/10 rounded-[2px] z-10"></div>
              <div className="absolute bottom-0 right-[3px] w-4 h-4 bg-white/5 rounded-[2px] z-0"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Relvanta</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white/60 hover:text-white text-sm font-medium tracking-wide transition-colors"
                data-testid={`nav-link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/login"
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-full transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              data-testid="header-signin-btn"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/80 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
            aria-label="Toggle mobile menu"
            data-testid="mobile-menu-toggle"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-white/5 mt-2">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="mx-4 mt-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors text-center text-sm"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-signin-btn"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
