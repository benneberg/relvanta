'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/', icon: 'apps' },
  { name: 'Products', href: '/products', icon: 'inventory_2' },
  { name: 'Services', href: '/services', icon: 'handshake' },
  { name: 'Labs', href: '/labs', icon: 'science' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="relative liquid-glass px-4 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 transition-colors relative py-1 px-3 ${
                  isActive ? 'text-primary' : 'text-white/40 hover:text-white/60'
                }`}
                data-testid={`mobile-nav-${item.name.toLowerCase()}`}
              >
                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`}>
                  {item.name}
                </span>
                {/* Active indicator */}
                <div 
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full nav-indicator transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
