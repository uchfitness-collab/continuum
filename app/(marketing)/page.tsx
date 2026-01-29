import Link from 'next/link';

/* ---------- PAGE ---------- */

export default function MarketingHome() {
  return (
    <section
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* BACKGROUND IMAGE */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/continuum-hero.jpg')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.22,
          filter: 'grayscale(100%)',
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(15,23,42,0.55), rgba(2,6,23,0.95))',
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          padding: '120px 24px 140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* HERO COPY */}
        <h1 style={{ fontSize: 56, fontWeight: 600, maxWidth: 900 }}>
          Your Personal Operating System for Discipline
        </h1>

        <p
          style={{
            maxWidth: 720,
            fontSize: 18,
            lineHeight: 1.6,
            opacity: 0.85,
            marginTop: 24,
          }}
        >
          Continuum helps you measure what actually matters — daily action,
          consistency, and identity alignment — through a single score that
          compounds over time.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 16, marginTop: 36 }}>
          <Link href="/login">
            <button style={primaryButton}>Get Started</button>
          </Link>

          <Link href="/about">
            <button style={secondaryButton}>Learn More</button>
          </Link>
        </div>

        {/* PILLARS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
            marginTop: 100,
            maxWidth: 1100,
            textAlign: 'left',
          }}
        >
          <Pillar
            title="Body"
            text="Physical action creates momentum. Continuum tracks movement, nutrition discipline, and daily reps — because energy fuels everything."
          />
          <Pillar
            title="Mind"
            text="What you avoid matters as much as what you do. Track discipline, habit replacement, and mental control."
          />
          <Pillar
            title="Identity"
            text="Identity is built through proof. Continuum measures alignment between who you say you are and what you do daily."
          />
        </div>

        {/* FINAL CTA */}
        <div style={{ marginTop: 120, textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, marginBottom: 24 }}>
            Discipline is measurable. Now prove it.
          </h2>
          <Link href="/login">
            <button style={primaryButton}>Start Tracking Today</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- HELPERS ---------- */

function Pillar({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 style={{ marginBottom: 12 }}>{title}</h3>
      <p style={{ opacity: 0.75, lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

const primaryButton = {
  padding: '12px 22px',
  background: '#22c55e',
  color: '#000',
  borderRadius: 10,
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
};

const secondaryButton = {
  padding: '12px 22px',
  background: 'transparent',
  color: '#e5e7eb',
  borderRadius: 10,
  border: '1px solid #334155',
  cursor: 'pointer',
};