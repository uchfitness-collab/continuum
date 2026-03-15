'use client';

import Link from 'next/link';

const SPARK_LINK     = 'https://buy.stripe.com/14A00jboSclr2fy9hq5EY03';
const FORGE_LINK     = 'https://buy.stripe.com/bJe14n1Oi5X3f2k65e5EY02';
const SOVEREIGN_LINK = 'https://buy.stripe.com/bJefZhdx01GN9I01OY5EY01';

export default function PricingPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#080c18',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* HERO */}
      <section style={{
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 60px) clamp(52px, 6vw, 80px)',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)', fontWeight: 600, marginBottom: 24,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          Pricing
        </div>
        <h1 style={{
          fontSize: 'clamp(34px, 6vw, 64px)',
          fontWeight: 700, lineHeight: 1.1,
          letterSpacing: '-0.03em', marginBottom: 20,
        }}>
          Choose Your Commitment
        </h1>
        <p style={{
          fontSize: 'clamp(15px, 2vw, 19px)',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.7, maxWidth: 520,
          marginLeft: 'auto', marginRight: 'auto',
        }}>
          The longer you commit, the lower the price. Because the ones who are serious shouldn&apos;t pay more.
        </p>
      </section>

      {/* CARDS */}
      <section style={{
        padding: 'clamp(52px, 6vw, 80px) clamp(24px, 6vw, 60px)',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <div className="pricing-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          alignItems: 'start',
        }}>
          <PricingCard
            name="Spark"
            price={19}
            duration="30 Days"
            description="The ignition point. 30 days to build the habit, prove the commitment, and see what you're made of."
            features={[
              'Full access to Body, Mind & Identity tracking',
              'Daily Sovereign Score',
              '30-day discipline challenge',
            ]}
            color="#4ade80"
            href={SPARK_LINK}
            cta="Start Your Spark"
          />
          <PricingCard
            name="Forge"
            price={14}
            duration="180 Days"
            description="Six months to forge who you're becoming. The habits are locking in and there's no turning back."
            features={[
              'Full access to Body, Mind & Identity tracking',
              'Daily Sovereign Score',
              '180-day discipline challenge',
              'Progress milestones',
            ]}
            color="#60a5fa"
            href={FORGE_LINK}
            cta="Start Forging"
            highlighted
          />
          <PricingCard
            name="Sovereign"
            price={9}
            duration="365 Days"
            description="A full year of proof. For the ones who are all in — no excuses, no breaks, no shortcuts."
            features={[
              'Full access to Body, Mind & Identity tracking',
              'Daily Sovereign Score',
              '365-day discipline challenge',
              'Progress milestones',
              'Lowest monthly rate',
            ]}
            color="#a78bfa"
            href={SOVEREIGN_LINK}
            cta="Go Sovereign"
          />
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div style={{ textAlign: 'center', paddingBottom: 80 }}>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}>
            Log in
          </Link>
        </p>
      </div>

    </main>
  );
}

function PricingCard({
  name, price, total, duration, description, features,
  color, href, cta, highlighted = false,
}: {
  name: string; price: number; duration: string;
  description: string; features: string[]; color: string;
  href: string; cta: string; highlighted?: boolean;
}) {
  return (
    <div style={{
      padding: 'clamp(24px, 3vw, 36px)',
      background: highlighted ? `${color}08` : 'rgba(255,255,255,0.025)',
      borderRadius: 18,
      border: highlighted ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      outline: highlighted ? `1px solid ${color}20` : 'none',
      outlineOffset: 3,
    }}>

      {highlighted && (
        <div style={{
          position: 'absolute', top: -13, left: '50%',
          transform: 'translateX(-50%)',
          background: color, color: '#080c18',
          fontWeight: 700, fontSize: 10,
          padding: '4px 14px', borderRadius: 20,
          whiteSpace: 'nowrap', letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Most Popular
        </div>
      )}

      {/* NAME + DURATION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color }}>{name}</span>
        <span style={{
          fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)', fontWeight: 600,
          padding: '4px 10px', borderRadius: 6,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {duration}
        </span>
      </div>

      {/* PRICE */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 'clamp(48px, 6vw, 56px)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>${price}</span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>/mo</span>
      </div>
      

      {/* DESCRIPTION */}
      <p style={{
        fontSize: 'clamp(13px, 1.4vw, 15px)',
        color: 'rgba(255,255,255,0.4)',
        lineHeight: 1.7, marginBottom: 28,
      }}>
        {description}
      </p>

      {/* FEATURES */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            <span style={{ color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a href={href} style={{ textDecoration: 'none', marginTop: 'auto' }}>
        <button style={{
          width: '100%',
          padding: 'clamp(14px, 1.5vw, 16px) 24px',
          background: highlighted ? color : 'transparent',
          color: highlighted ? '#080c18' : color,
          border: `1px solid ${highlighted ? color : color + '50'}`,
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 'clamp(14px, 1.4vw, 15px)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}>
          {cta}
        </button>
      </a>
    </div>
  );
}