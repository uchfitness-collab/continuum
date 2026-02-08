import Link from 'next/link';

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
          opacity: 0.28,
          filter: 'grayscale(100%)',
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(15,23,42,0.5), rgba(2,6,23,0.92))',
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          padding: '100px 24px 120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* HERO COPY */}
        <h1 style={{ 
          fontSize: 56, 
          fontWeight: 700, 
          maxWidth: 900,
          lineHeight: 1.15,
          marginBottom: 24
        }}>
          Your Personal Operating System for Discipline
        </h1>

        <p
          style={{
            maxWidth: 680,
            fontSize: 19,
            lineHeight: 1.7,
            color: '#94a3b8',
            marginBottom: 40,
          }}
        >
          Continuum helps you measure what actually matters — daily action,
          consistency, and identity alignment — through a single score that
          compounds over time.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button style={primaryButton}>Get Started</button>
          </Link>

          <Link href="/how-it-works" style={{ textDecoration: 'none' }}>
            <button style={secondaryButton}>How It Works</button>
          </Link>
        </div>

        {/* PILLARS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 56,
            marginTop: 120,
            maxWidth: 1100,
            textAlign: 'left',
          }}
        >
          <Pillar
            title="Body"
            color="#22c55e"
            text="Physical action creates momentum. Continuum tracks movement, nutrition discipline, and daily reps — because energy fuels everything."
          />
          <Pillar
            title="Mind"
            color="#3b82f6"
            text="What you avoid matters as much as what you do. Track discipline, habit replacement, and mental control."
          />
          <Pillar
            title="Identity"
            color="#a855f7"
            text="Identity is built through proof. Continuum measures alignment between who you say you are and what you do daily."
          />
        </div>

        {/* FINAL CTA */}
        <div style={{ marginTop: 140, textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, marginBottom: 16, fontWeight: 600 }}>
            Discipline is measurable. Now prove it.
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 17 }}>
            Join hundreds tracking their way to sovereignty.
          </p>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button style={primaryButton}>Start Tracking Today</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- HELPERS ---------- */

function Pillar({ title, text, color }: { title: string; text: string; color: string }) {
  return (
    <div>
      <h3 style={{ 
        marginBottom: 14, 
        fontSize: 22,
        color,
        fontWeight: 600
      }}>
        {title}
      </h3>
      <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: 15 }}>{text}</p>
    </div>
  );
}

const primaryButton = {
  padding: '14px 32px',
  background: 'linear-gradient(180deg, #22c55e, #16a34a)',
  color: '#020617',
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 16,
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

const secondaryButton = {
  padding: '14px 32px',
  background: 'rgba(255,255,255,0.05)',
  color: '#e5e7eb',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.2)',
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 600,
  transition: 'all 0.2s',
};