import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-8">
      <div className="bg-charcoal-surface rounded-3xl p-12 border border-glass-border text-center max-w-md relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-500/10 rounded-full blur-[60px]"></div>
        
        <div className="relative z-10">
          <div className="size-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-white/20">search_off</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-white/60 mb-4">Page Not Found</h2>
          <p className="text-white/40 text-sm mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            data-testid="not-found-home-btn"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
