import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <section className="space-y-4" data-testid="about-header">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-white/40 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <h2 className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">About</h2>
        </div>
        
        <div className="bg-charcoal-surface rounded-3xl p-8 border border-glass-border relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">About Relvanta</h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
              Empowering medium-sized businesses with cutting-edge AI solutions since 2023.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relvanta-card rounded-2xl p-6 border border-glass-border" data-testid="about-mission">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Our Mission</h2>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          Founded in 2023, Relvanta is on a mission to democratize access to cutting-edge artificial intelligence 
          for medium-sized businesses. We believe AI shouldn&apos;t be exclusive to tech giants. Our goal is to bridge 
          the gap between enterprise-grade AI capabilities and businesses ready to grow.
        </p>
      </section>

      {/* Approach */}
      <section className="relvanta-card rounded-2xl p-6 border border-glass-border" data-testid="about-approach">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 bg-green-500/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-green-500">psychology</span>
          </div>
          <h2 className="text-lg font-semibold text-white">Our Approach</h2>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          We combine deep technical expertise with business acumen to deliver AI solutions that generate 
          measurable ROI. Our team has deployed AI systems for over 100 organizations across retail, 
          manufacturing, finance, and healthcare. We don&apos;t just build technology—we build partnerships.
        </p>
      </section>

      {/* Values */}
      <section className="space-y-4" data-testid="about-values">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-semibold text-white tracking-wide">Our Values</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relvanta-card rounded-2xl p-5 border border-glass-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-lg">engineering</span>
              </div>
              <h4 className="text-white font-medium">Pragmatism</h4>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              We focus on solutions that work in the real world, not theoretical perfection.
            </p>
          </div>
          
          <div className="relvanta-card rounded-2xl p-5 border border-glass-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500 text-lg">visibility</span>
              </div>
              <h4 className="text-white font-medium">Transparency</h4>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              No black boxes—we explain how our AI systems work and why they make decisions.
            </p>
          </div>
          
          <div className="relvanta-card rounded-2xl p-5 border border-glass-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-lg">handshake</span>
              </div>
              <h4 className="text-white font-medium">Partnership</h4>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              Your success is our success. We measure our impact by your outcomes.
            </p>
          </div>
          
          <div className="relvanta-card rounded-2xl p-5 border border-glass-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-500 text-lg">lightbulb</span>
              </div>
              <h4 className="text-white font-medium">Innovation</h4>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">
              We stay at the forefront of AI research to bring you the latest advances.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relvanta-card rounded-2xl p-6 border border-glass-border" data-testid="about-team">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-cyan-500">groups</span>
          </div>
          <h2 className="text-lg font-semibold text-white">The Team</h2>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          Our team includes former researchers from MIT and Stanford, AI engineers from top tech companies, 
          and business consultants with deep industry expertise. We bring together diverse perspectives 
          to solve complex challenges.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="relvanta-card rounded-3xl p-8 border border-glass-border text-center" data-testid="about-cta">
        <h3 className="text-xl font-bold text-white mb-3">Let&apos;s Talk</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          Ready to explore how AI can transform your business?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="mailto:hello@relvanta.com"
            className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-full text-white text-sm font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            data-testid="about-contact-btn"
          >
            hello@relvanta.com
          </a>
          <span className="text-white/30 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">location_on</span>
            Stockholm, Sweden
          </span>
        </div>
      </section>
    </div>
  );
}
