'use client';

import Link from 'next/link';

export default function MarketingHome() {
  return (
    <main style={{ background: '#080c18', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* HERO */}
      <section style={{
        padding: 'clamp(52px, 8vw, 120px) clamp(24px, 6vw, 60px) clamp(60px, 8vw, 120px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontSize: 'clamp(10px, 1.2vw, 12px)',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)', fontWeight: 600, marginBottom: 28,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          Personal Operating System
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 7vw, 72px)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 24,
          maxWidth: 860,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Your potential has<br />a scorecard.<br />
          <span style={{ color: 'rgba(255,255,255,0.28)' }}>Start filling it in.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 20px)',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.7,
          marginBottom: 40,
          maxWidth: 580,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Continuum measures your daily execution across Body, Mind, and Identity —
          then shows you the score you&apos;ve actually earned.
        </p>

        <div className="hero-btns" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          maxWidth: 360,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 20,
        }}>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', background: '#4ade80', color: '#080c18',
              fontSize: 'clamp(14px, 1.5vw, 16px)', fontWeight: 700,
              padding: 'clamp(14px, 1.5vw, 18px) 36px',
              borderRadius: 12, border: 'none', cursor: 'pointer',
            }}>
              Start Tracking
            </button>
          </Link>
          <Link href="/how-it-works" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%', background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 'clamp(13px, 1.3vw, 15px)', fontWeight: 500,
              padding: 'clamp(13px, 1.4vw, 16px) 36px',
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.09)', cursor: 'pointer',
            }}>
              How It Works
            </button>
          </Link>
        </div>

        <p style={{ fontSize: 'clamp(11px, 1.1vw, 13px)', color: 'rgba(255,255,255,0.22)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#4ade80', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
        </p>
      </section>

      <Divider />

      {/* HOW IT WORKS */}
      <section style={{ padding: 'clamp(52px, 6vw, 90px) clamp(24px, 6vw, 60px)' }}>
        <SectionLabel>How it works</SectionLabel>
        <div className="steps-grid" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Step num={1} title="Log your day in 2 minutes"   desc="Check in across Body, Mind, and Identity. No journaling. No long surveys." />
          <Step num={2} title="Get your Sovereign Score"    desc="A weighted daily score showing how well you executed against who you claim to be." />
          <Step num={3} title="See the pattern emerge"      desc="Weekly reflections reveal where you're consistent — and where you're not." last />
        </div>
      </section>

      <Divider />

      {/* THREE PILLARS */}
      <section style={{ padding: 'clamp(52px, 6vw, 90px) clamp(24px, 6vw, 60px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <SectionLabel>Three pillars</SectionLabel>
        <div className="pillars-grid" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PillarCard
            title="Body" tag="Movement" color="#4ade80" bg="rgba(74,222,128,0.08)"
            desc="Track movement, nutrition discipline, and daily reps. When your body is disciplined, everything else follows."
          />
          <PillarCard
            title="Mind" tag="Discipline" color="#60a5fa" bg="rgba(96,165,250,0.08)"
            desc="What you avoid matters as much as what you do. Track discipline, habit replacement, and mental control."
          />
          <PillarCard
            title="Identity" tag="Accountability" color="#a78bfa" bg="rgba(167,139,250,0.08)"
            desc="Measure the gap between who you say you are and what you actually do. Actions define identity, not intentions."
          />
        </div>
      </section>

      <Divider />

      {/* SCORE TEASER */}
      <section style={{ padding: 'clamp(52px, 6vw, 90px) clamp(24px, 6vw, 60px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <SectionLabel>Your score, daily</SectionLabel>
        <div style={{ maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 18, padding: 'clamp(24px, 3vw, 36px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 26 }}>
              <span style={{ fontSize: 'clamp(60px, 8vw, 80px)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>84</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'clamp(10px, 1.1vw, 12px)', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4ade80', fontWeight: 600, marginBottom: 4 }}>Locked In</div>
                <div style={{ fontSize: 'clamp(11px, 1.1vw, 13px)', color: 'rgba(255,255,255,0.25)' }}>Day 12 of 30</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <ScoreBar label="Body"     pct={82} color="#4ade80" />
              <ScoreBar label="Mind"     pct={91} color="#60a5fa" />
              <ScoreBar label="Identity" pct={67} color="#a78bfa" />
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* FINAL CTA */}
      <section style={{
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 60px)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 700, color: '#fff',
          lineHeight: 1.15, letterSpacing: '-0.025em', marginBottom: 16,
        }}>
          Stop lying to yourself.<br />Start tracking.
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 1.8vw, 18px)',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: 36, lineHeight: 1.65,
          maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
        }}>
          See who you actually are when no one&apos;s watching.
        </p>
        <Link href="/pricing" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: 'clamp(14px, 1.5vw, 18px) clamp(36px, 4vw, 56px)',
            background: '#4ade80', color: '#080c18',
            borderRadius: 12, fontSize: 'clamp(14px, 1.5vw, 16px)',
            fontWeight: 700, border: 'none', cursor: 'pointer',
          }}>
            Start Tracking
          </button>
        </Link>
      </section>

      <style jsx global>{`
        @media (min-width: 768px) {
          .hero-btns {
            flex-direction: row !important;
            max-width: 440px !important;
          }
          .hero-btns a button {
            width: auto !important;
          }
          .steps-grid {
            flex-direction: row !important;
          }
          .pillars-grid {
            flex-direction: row !important;
          }
        }
      `}</style>
    </main>
  );
}

/* ---------- HELPERS ---------- */

function Divider() {
  return <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 'clamp(10px, 1vw, 11px)', letterSpacing: '0.22em',
      textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
      fontWeight: 600, marginBottom: 36,
    }}>
      {children}
    </p>
  );
}

function Step({ num, title, desc, last = false }: { num: number; title: string; desc: string; last?: boolean }) {
  return (
    <div className={last ? 'step' : 'step step-connector'} style={{
      display: 'flex', gap: 18, alignItems: 'flex-start',
      paddingBottom: last ? 0 : 28, flex: 1, position: 'relative',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, color: 'rgba(255,255,255,0.28)',
        flexShrink: 0, fontWeight: 600,
        background: 'rgba(255,255,255,0.03)',
      }}>
        {num}
      </div>
      <div style={{ paddingTop: 4 }}>
        <p style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: 'rgba(255,255,255,0.32)', lineHeight: 1.6 }}>{desc}</p>
      </div>
      <style jsx>{`
        .step-connector::after {
          content: '';
          position: absolute;
          left: 14px;
          top: 32px;
          height: calc(100% - 2px);
          width: 1px;
          background: rgba(255,255,255,0.06);
        }
        @media (min-width: 768px) {
          .step-connector::after {
            left: auto;
            top: 14px;
            right: 0;
            height: 1px;
            width: calc(100% - 46px);
          }
          .step {
            padding-bottom: 0 !important;
            padding-right: 40px;
          }
          .step:last-child {
            padding-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

function PillarCard({ title, tag, color, bg, desc }: { title: string; tag: string; color: string; bg: string; desc: string }) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: 'clamp(20px, 2.5vw, 28px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', fontWeight: 600, color }}>{title}</span>
        <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 6, fontWeight: 600, background: bg, color }}>
          {tag}
        </span>
      </div>
      <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: 'rgba(255,255,255,0.32)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

function ScoreBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{
        height: 56, background: 'rgba(255,255,255,0.05)',
        borderRadius: 5, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginBottom: 8,
      }}>
        <div style={{ height: `${pct}%`, background: color, opacity: 0.5, borderRadius: '5px 5px 0 0' }} />
      </div>
      <p style={{ fontSize: 12, textAlign: 'center', fontWeight: 700, color, marginBottom: 4 }}>{pct}</p>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
    </div>
  );
}