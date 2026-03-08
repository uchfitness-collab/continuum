import Link from 'next/link';

const SPARK_LINK = 'https://buy.stripe.com/14A00jboSclr2fy9hq5EY03';
const FORGE_LINK = 'https://buy.stripe.com/bJe14n1Oi5X3f2k65e5EY02';
const SOVEREIGN_LINK = 'https://buy.stripe.com/bJefZhdx01GN9I01OY5EY01';

export default function PricingPage() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #020617, #01030f)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 20px',
      }}
    >
      {/* HEADER */}
      <h1
        style={{
          fontSize: 'clamp(32px, 6vw, 52px)',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 16,
          background: 'linear-gradient(135deg, #e5e7eb, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Choose Your Commitment
      </h1>

      <p
        style={{
          color: '#94a3b8',
          fontSize: 'clamp(15px, 2.5vw, 18px)',
          textAlign: 'center',
          maxWidth: 560,
          lineHeight: 1.7,
          marginBottom: 64,
        }}
      >
        The longer you commit, the lower the price. Because the ones who are serious
        shouldn't pay more.
      </p>

      {/* PRICING CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          maxWidth: 1100,
          width: '100%',
        }}
      >
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
          color="#22c55e"
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
          color="#3b82f6"
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
            'Best value — lowest monthly rate',
          ]}
          color="#a855f7"
          href={SOVEREIGN_LINK}
          cta="Go Sovereign"
        />
      </div>

      {/* FOOTER NOTE */}
      <p style={{ color: '#475569', fontSize: 13, marginTop: 48, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>
          Log in
        </Link>
      </p>
    </section>
  );
}

function PricingCard({
  name,
  price,
  duration,
  description,
  features,
  color,
  href,
  cta,
  highlighted = false,
}: {
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  color: string;
  href: string;
  cta: string;
  highlighted?: boolean;
}) {
  return (
    <div
      style={{
        padding: 32,
        background: highlighted ? `${color}10` : '#020617',
        borderRadius: 20,
        border: `2px solid ${highlighted ? color : color + '30'}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {highlighted && (
        <div
          style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: color,
            color: '#020617',
            fontWeight: 700,
            fontSize: 12,
            padding: '4px 16px',
            borderRadius: 20,
            whiteSpace: 'nowrap',
          }}
        >
          MOST POPULAR
        </div>
      )}

      <h2 style={{ color, fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{name}</h2>
      <p style={{ color: '#475569', fontSize: 13, marginBottom: 20 }}>{duration}</p>

      <div style={{ marginBottom: 20 }}>
        <span style={{ color: '#e5e7eb', fontSize: 48, fontWeight: 700 }}>${price}</span>
        <span style={{ color: '#475569', fontSize: 15 }}>/mo</span>
      </div>

      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
        {description}
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#94a3b8', fontSize: 14 }}>
            <span style={{ color, fontWeight: 700, marginTop: 1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <a href={href} style={{ textDecoration: 'none', marginTop: 'auto' }}>
        <button
          style={{
            width: '100%',
            padding: '16px 24px',
            background: highlighted
              ? `linear-gradient(180deg, ${color}, ${color}cc)`
              : 'transparent',
            color: highlighted ? '#020617' : color,
            border: `2px solid ${color}`,
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          {cta}
        </button>
      </a>
    </div>
  );
}