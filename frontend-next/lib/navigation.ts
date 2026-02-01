/**
 * Dynamic navigation utilities
 * Generates navigation from content instead of hardcoding
 */

export interface NavItem {
  name: string;
  href: string;
  order?: number;
}

/**
 * Get main navigation items
 * In a full implementation, this would fetch from database
 * For now, it's a structured way to manage navigation
 */
export function getMainNavigation(): NavItem[] {
  return [
    { name: 'Products', href: '/products', order: 1 },
    { name: 'Services', href: '/services', order: 2 },
    { name: 'Labs', href: '/labs', order: 3 },
    { name: 'About', href: '/about', order: 4 },
  ].sort((a, b) => (a.order || 999) - (b.order || 999));
}

/**
 * Get footer navigation sections
 */
export interface FooterSection {
  title: string;
  links: NavItem[];
}

export function getFooterNavigation(): FooterSection[] {
  return [
    {
      title: 'Products',
      links: [
        { name: 'OneEye', href: '/products/oneeye' },
        { name: 'PredictIQ', href: '/products/predictiq' },
        { name: 'ChatFlow', href: '/products/chatflow' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Strategy Consulting', href: '/services/ai-strategy-consulting' },
        { name: 'MLOps Implementation', href: '/services/mlops-implementation' },
        { name: 'AI Pilot Program', href: '/services/ai-pilot-program' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Labs', href: '/labs' },
        { name: 'Sign In', href: '/login' },
      ],
    },
  ];
}

/**
 * Future: Fetch navigation from database
 * This would be called by the above functions
 */
export async function fetchNavigationFromDB() {
  // TODO: Implement when admin UI is built
  // const response = await fetch('/api/content/navigation');
  // return response.json();
  return null;
}
