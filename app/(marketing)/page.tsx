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
        background: 'radial-gradient(circle at top, #020617, #01030f)',
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
          backgroundPosition: 'center -150px',
          opacity: 0.05,
          filter: 'grayscale(100%)',
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, rgba(15,23,42,0.55), rgba(2,6,23,0.94))',
        }}
      />

      {/* CONTENT */}
      <div
        className="marketing-content"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          width: '100%',
          padding: '80px 20px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* HERO COPY */}
        <h1 className="hero-title" style={{ 
          fontSize: 'clamp(36px, 8vw, 64px)',
          fontWeight: 700, 
          maxWidth: 920,
          lineHeight: 1.1,
          marginBottom: 24,
          background: 'linear-gradient(135deg, #e5e7eb, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '0 16px',
        }}>
          Discipline is Measurable.<br />Now Prove It.
        </h1>

        <p
          style={{
            maxWidth: 680,
            fontSize: 'clamp(16px, 3vw, 20px)',
            lineHeight: 1.7,
            color: '#94a3b8',
            marginBottom: 40,
            padding: '0 16px',
          }}
        >
          Continuum measures your daily execution across Body, Mind, and Identity—
          then shows you whether you're building the person you claim to be or just pretending.
        </p>

        {/* CTA */}
        <div className="cta-buttons" style={{ 
          display: 'flex', 
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '0 16px',
        }}>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button className="primary-btn" style={primaryButton}>Start Tracking</button>
          </Link>

          <Link href="/how-it-works" style={{ textDecoration: 'none' }}>
            <button className="secondary-btn" style={secondaryButton}>How It Works</button>
          </Link>
        </div>

        {/* PILLARS */}
        <div
          className="pillars-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginTop: 80,
            maxWidth: 1100,
            width: '100%',
            textAlign: 'left',
            padding: '0 16px',
          }}
        >
          <Pillar
            icon="💪"
            title="Body"
            color="#22c55e"
            text="Physical action creates momentum. Track movement, nutrition discipline, and daily reps. When your body is disciplined, everything else follows."
          />
          <Pillar
            icon="🧠"
            title="Mind"
            color="#3b82f6"
            text="What you avoid matters as much as what you do. Track discipline, habit replacement, and mental control. Choose discomfort when comfort is available."
          />
          <Pillar
            icon="⚡"
            title="Identity"
            color="#a855f7"
            text="Identity is built through proof. Measure the gap between who you say you are and what you actually do daily. Actions define identity, not intentions."
          />
        </div>

        {/* FINAL CTA */}
        <div style={{ marginTop: 80, textAlign: 'center', padding: '0 16px' }}>
          <h2 style={{ 
            fontSize: 'clamp(28px, 5vw, 40px)',
            marginBottom: 16, 
            fontWeight: 700,
            color: '#e5e7eb'
          }}>
            Stop lying to yourself. Start tracking.
          </h2>
          <p style={{ 
            color: '#94a3b8', 
            marginBottom: 32, 
            fontSize: 'clamp(16px, 3vw, 18px)',
            maxWidth: 560,
            margin: '0 auto 32px'
          }}>
            See who you actually are when no one's watching.
          </p>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button className="primary-btn" style={primaryButton}>Get Started</button>
          </Link>
        </div>
      </div>

    </section>
  );
}

/* ---------- HELPERS ---------- */

function Pillar({ 
  icon,
  title, 
  text, 
  color 
}: { 
  icon: string;
  title: string; 
  text: string; 
  color: string;
}) {
  return (
    <div style={{
      padding: 24,
      background: '#020617',
      borderRadius: 16,
      border: `2px solid ${color}30`,
    }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>
        {icon}
      </div>
      <h3 style={{ 
        marginBottom: 14, 
        fontSize: 24,
        color,
        fontWeight: 600
      }}>
        {title}
      </h3>
      <p style={{ 
        color: '#94a3b8', 
        lineHeight: 1.7, 
        fontSize: 15,
        margin: 0
      }}>
        {text}
      </p>
    </div>
  );
}

const primaryButton = {
  padding: '16px 40px',
  background: 'linear-gradient(180deg, #22c55e, #16a34a)',
  color: '#020617',
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 17,
  border: 'none',
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

const secondaryButton = {
  padding: '16px 40px',
  background: 'transparent',
  color: '#e5e7eb',
  borderRadius: 10,
  border: '2px solid #334155',
  cursor: 'pointer',
  fontSize: 17,
  fontWeight: 600,
  transition: 'all 0.2s',
};