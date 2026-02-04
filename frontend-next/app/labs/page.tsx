import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getLabs } from '@/lib/api';
import Link from 'next/link';

export default async function LabsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  if (!sessionToken) {
    redirect('/login?returnTo=/labs');
  }

  let labs;
  try {
    const response = await getLabs({ token: sessionToken });
    labs = response.labs;
  } catch {
    redirect('/login?returnTo=/labs');
  }

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    hypothesis: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
    running: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    validated: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    failed: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    graduated: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  };

  return (
    <div className="flex flex-col gap-8 px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <section className="space-y-4" data-testid="labs-header">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <h2 className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">Labs</h2>
        </div>
        
        <div className="relvanta-card rounded-3xl p-8 border border-glass-border relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Relvanta Labs</h1>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-semibold rounded-full border border-yellow-500/20 uppercase">
                  Experimental
                </span>
              </div>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
                Explore our cutting-edge experiments and early-stage innovations. These projects represent the future of AI at Relvanta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Labs Grid */}
      <section className="space-y-4" data-testid="labs-grid">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">Active Experiments</h3>
          <span className="text-[10px] text-gray-500 font-mono">{labs.length} EXPERIMENTS</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {labs.map((lab) => {
            const status = statusColors[lab.status] || statusColors.hypothesis;
            return (
              <Link
                key={lab.id}
                href={`/labs/${lab.slug}`}
                className="product-card-hover bg-charcoal-surface rounded-2xl p-6 border border-glass-border group"
                data-testid={`lab-card-${lab.slug}`}
              >
                <span className={`inline-block px-2 py-0.5 ${status.bg} ${status.text} text-[10px] rounded-full border ${status.border} uppercase tracking-wider mb-3`}>
                  {lab.status}
                </span>
                
                <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {lab.name}
                </h4>
                
                {lab.hypothesis && (
                  <div className="mb-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Hypothesis:</p>
                    <p className="text-sm text-white/60">{lab.hypothesis}</p>
                  </div>
                )}

                {lab.metrics && lab.metrics.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    {lab.metrics.slice(0, 3).map((metric, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-white/40">{metric.name}</span>
                        <span className="text-white/70 font-mono">
                          {metric.actual || metric.target}
                          {metric.actual && (
                            <span className="text-white/30 ml-1">/ {metric.target}</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center text-primary text-xs font-medium group-hover:underline mt-4">
                  View experiment
                  <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {labs.length === 0 && (
          <div className="relvanta-card rounded-2xl p-12 border border-glass-border text-center">
            <span className="material-symbols-outlined text-4xl text-white/20 mb-4">science</span>
            <p className="text-gray-400 text-sm">No active experiments at the moment. Check back soon for new innovations!</p>
          </div>
        )}
      </section>
    </div>
  );
}
