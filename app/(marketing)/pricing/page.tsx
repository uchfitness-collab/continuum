'use client';

import Link from 'next/link';

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
          Free While We Build
        </h1>
        <p style={{
          fontSize: 'clamp(15px, 2vw, 19px)',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.7, maxWidth: 520,
          marginLeft: 'auto', marginRight: 'auto',
        }}>
          Continuum is free right now. Get in early, build the habit, and shape what comes next.
        </p>
      </section>

      {/* CARD */}
      <section style={{
        padding: 'clamp(52px, 6vw, 80px) clamp(24px, 6vw, 60px)',
        maxWidth: 480, margin: '0 auto',
      }}>
        <div style={{
          padding: 'clamp(24px, 3vw, 40px)',
          background: 'rgba(74,222,128,0.06)',
          borderRadius: 18,
          border: '1px solid rgba(74,222,128,0.25)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>Full Access</span>

          <div style={{ margin: '24px 0 8px' }}>
            <span style={{ fontSize: 72, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }}>Free</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 32 }}>No credit card required</p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            {[
              'Full access to Body, Mind & Identity tracking',
              'Daily Sovereign Score',
              'Weekly reflections & history',
              'Habit tracking & streaks',
              'Progress milestones',
            ].map((f) => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '16px 24px',
              background: '#4ade80',
              color: '#080c18',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
            }}>
              Get Started — It&apos;s Free
            </button>
          </Link>
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