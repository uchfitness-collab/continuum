'use client';

import Link from 'next/link';

export default function HowToUsePage() {
  return (
    <main style={{
      background: '#080c18',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      minHeight: '100vh',
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
          The System
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 20,
          maxWidth: 800,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          How Continuum works.
        </h1>
        <p style={{
          fontSize: 'clamp(15px, 2vw, 19px)',
          color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.7,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Six steps. Follow them in order. Don&apos;t improvise.
          This is the system that makes discipline measurable.
        </p>
      </section>

      {/* STEPS */}
      <section style={{ padding: 'clamp(52px, 6vw, 80px) clamp(24px, 6vw, 60px)', maxWidth: 900, margin: '0 auto' }}>

        <Step number="01" title="Set Your 1-Year Goals" color="#60a5fa">
          <p style={bodyText}>
            Before you track anything, you need to know where you&apos;re going. Go to the <Highlight>Goals</Highlight> page and define your 1-year vision across all three pillars.
          </p>
          <div style={cardGrid}>
            <GoalCard color="#4ade80" title="Body" example="Lose 30 lbs, run a half-marathon under 2 hours, have visible abs." />
            <GoalCard color="#60a5fa" title="Mind" example="Read 24 books, eliminate doom scrolling, meditate 365 days straight." />
            <GoalCard color="#a78bfa" title="Identity" example="Build a business, write daily, close the gap between who you are and who you say you are." />
          </div>
          <InfoBox color="#60a5fa">
            Your daily habits should connect directly to these goals. If they don&apos;t, you&apos;re just tracking noise.
          </InfoBox>
        </Step>

        <Step number="02" title="Define Your Daily Habits" color="#4ade80">
          <p style={bodyText}>
            Go to the <Highlight>Habits</Highlight> page and set up your core habits across the three pillars. Be specific — vague habits produce vague results.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <PillarHabits color="#4ade80" title="Body" subtitle="3 habits" habits={[
              'Physical activity — e.g. "Work out with high intensity"',
              'Nutritional discipline — e.g. "No sugar after 6 PM"',
              'Daily reps — e.g. "50 push-ups, 20 pull-ups"',
            ]} />
            <PillarHabits color="#60a5fa" title="Mind" subtitle="2 habits" habits={[
              'Positive habit — e.g. "Read 30 minutes every day"',
              'Negative habit to avoid — e.g. "No doom scrolling for 2+ hours"',
            ]} />
            <PillarHabits color="#a78bfa" title="Identity" subtitle="2 habits" habits={[
              'Daily mission — e.g. "Work on the business for 2+ hours"',
              'Philosophy practice — e.g. "Journal and reflect on stoicism"',
            ]} />
          </div>
          <InfoBox color="#4ade80">
            Not &quot;eat healthy&quot; — &quot;no sugar after 6 PM.&quot; Not &quot;be productive&quot; — &quot;ship one thing before noon.&quot; Precision is the point.
          </InfoBox>
        </Step>

        <Step number="03" title="Set Weekly Goals" color="#fbbf24">
          <p style={bodyText}>
            On the <Highlight>Goals</Highlight> page, set 3 specific targets for the week. These act as mini-milestones that keep you focused between Sunday reflections.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {[
              '"Log all 7 days above baseline (110+ score)"',
              '"Hit the gym 5 times this week"',
              '"Ship the new feature by Friday"',
            ].map((goal, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                fontSize: 14, color: 'rgba(255,255,255,0.7)',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', flexShrink: 0 }} />
                {goal}
              </div>
            ))}
          </div>
          <InfoBox color="#fbbf24">
            Weekly goals reset every Monday at 12:01 AM. They appear on your Daily Log as a reminder and on your Weekly Reflection so you can review how you did.
          </InfoBox>
        </Step>

        <Step number="04" title="Log Your Day Every Night" color="#f87171">
          <p style={bodyText}>
            This is the core loop. Every night before bed, go to the <Highlight>Daily Log</Highlight> and answer one question: did you execute?
          </p>

          {/* Score breakdown */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14,
            padding: 'clamp(20px, 3vw, 28px)',
            marginBottom: 24,
          }}>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 20 }}>Daily Scoring</p>
            <div style={cardGrid}>
              <ScoreCard color="#4ade80" title="Body" max={50} items={['Physical activity = 20 pts', 'Nutritional discipline = 20 pts', 'Daily reps bonus = up to +10 pts']} />
              <ScoreCard color="#60a5fa" title="Mind" max={50} items={['Positive habit = 20 pts', 'Negative avoided = 20 pts', 'Discipline rating = up to +10 pts']} />
              <ScoreCard color="#a78bfa" title="Identity" max={50} items={['Daily mission = 20 pts', 'Philosophy practiced = 20 pts', 'Mood rating = up to +10 pts']} />
            </div>
            <div style={{
              marginTop: 20, padding: '12px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 8, fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Max daily score</span>
              <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: 15 }}>150 points</span>
            </div>
          </div>

          <InfoBox color="#f87171">
            Your <strong style={{ color: '#fff' }}>Sovereign Score</strong> is a weighted average — 70% yesterday&apos;s score + 30% today&apos;s. One great day won&apos;t spike it. One bad day won&apos;t kill it. <strong style={{ color: '#4ade80' }}>Target: stay above 110.</strong>
          </InfoBox>

          <div style={{
            marginTop: 12, padding: '16px 20px',
            background: 'rgba(248,113,113,0.05)',
            border: '1px solid rgba(248,113,113,0.15)',
            borderRadius: 10, fontSize: 13, lineHeight: 1.7,
            color: 'rgba(255,255,255,0.6)',
          }}>
            <strong style={{ color: '#f87171' }}>The log locks at 12:01 AM.</strong> You can&apos;t edit yesterday. Log before bed — not in the morning. Capture the truth while it&apos;s fresh.
          </div>
        </Step>

        <Step number="05" title="Check Your Dashboard Daily" color="#a78bfa">
          <p style={bodyText}>
            The <Highlight>Dashboard</Highlight> is your truth mirror. It shows you exactly where you stand — no stories, no excuses.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {[
              ['Current streak', 'How many consecutive days you&apos;ve logged'],
              ['Sovereign Score chart', 'Your trajectory over the last 120 days'],
              ['Pillar breakdown', 'Which area — Body, Mind, or Identity — is holding you back'],
              ['Habit consistency', 'How often you actually hit your habits over 30 days'],
            ].map(([title, desc], i) => (
              <div key={i} style={{
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', marginBottom: 3 }}>{title}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            ))}
          </div>
          <InfoBox color="#a78bfa">
            Look for trends, not single days. Flat for 2+ weeks? Your habits aren&apos;t challenging enough. Score dropping? You&apos;re coasting. The chart doesn&apos;t lie.
          </InfoBox>
        </Step>

        <Step number="06" title="Reflect Every Sunday Night" color="#60a5fa" last>
          <p style={bodyText}>
            Every Sunday, go to the <Highlight>Weekly</Highlight> page and complete your reflection. This is where improvement actually happens.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {[
              ['This Week&apos;s Goals', 'The 3 targets you set Monday. Did you hit them?'],
              ['What Worked', 'Where did you execute at or above your standard?'],
              ['What Broke', 'Where did you fall short — and what caused it?'],
              ['Next Week&apos;s Adjustment', 'One specific change to close the gap.'],
            ].map(([title, desc], i) => (
              <div key={i} style={{
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#4ade80', marginBottom: 3 }} dangerouslySetInnerHTML={{ __html: title }} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            ))}
          </div>
          <InfoBox color="#60a5fa">
            You can&apos;t improve what you don&apos;t review. The weekly reflection forces you to see patterns, identify triggers, and make adjustments. Give every change at least 30 days before judging it.
          </InfoBox>
        </Step>
      </section>

      <Divider />

      {/* PRO TIPS */}
      <section style={{ padding: 'clamp(52px, 6vw, 80px) clamp(24px, 6vw, 60px)', maxWidth: 900, margin: '0 auto' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontWeight: 600, marginBottom: 36 }}>
          Pro tips
        </p>
        <div style={cardGrid}>
          {[
            ['Don&apos;t chase perfection', 'A score of 110–130 consistently is elite. Consistency beats intensity every time.'],
            ['Streaks are motivating, not sacred', 'The Sovereign Score rewards comebacks. One bad day doesn&apos;t erase 30 good ones.'],
            ['Adjust every 30 days', 'As you grow, what used to be hard becomes easy. Keep raising the standard.'],
            ['Use the notes field', 'Patterns emerge when you review your context over time. Capture why, not just what.'],
          ].map(([title, text], i) => (
            <div key={i} style={{
              padding: 'clamp(18px, 2.5vw, 24px)',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
            }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: title }} />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, margin: 0 }} dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
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
          fontWeight: 700, lineHeight: 1.15,
          letterSpacing: '-0.025em', marginBottom: 16,
        }}>
          That&apos;s it. Now start.
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 1.8vw, 18px)',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: 36, lineHeight: 1.65,
          maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
        }}>
          No more &quot;I&apos;ll start Monday.&quot; Define your standard, log your execution, and let the data show you who you&apos;re becoming.
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

    </main>
  );
}

/* ---------- STYLES ---------- */

const bodyText: React.CSSProperties = {
  fontSize: 'clamp(14px, 1.5vw, 16px)',
  color: 'rgba(255,255,255,0.5)',
  lineHeight: 1.75,
  marginBottom: 24,
};

const cardGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 12,
  marginBottom: 24,
};

/* ---------- COMPONENTS ---------- */

function Divider() {
  return <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />;
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#4ade80', fontWeight: 600 }}>{children}</span>;
}

function Step({
  number, title, color, children, last = false,
}: {
  number: string; title: string; color: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', gap: 'clamp(20px, 4vw, 40px)',
      marginBottom: last ? 0 : 'clamp(48px, 6vw, 72px)',
      alignItems: 'flex-start',
    }}>
      {/* Number column */}
      <div style={{ flexShrink: 0, paddingTop: 4 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${color}15`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color, letterSpacing: '0.04em',
        }}>
          {number}
        </div>
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 700, color: '#fff',
          letterSpacing: '-0.02em',
          marginBottom: 20, lineHeight: 1.2,
        }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

function GoalCard({ color, title, example }: { color: string; title: string; example: string }) {
  return (
    <div style={{
      padding: 'clamp(16px, 2vw, 20px)',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
    }}>
      <p style={{ fontSize: 14, fontWeight: 600, color, marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, margin: 0 }}>{example}</p>
    </div>
  );
}

function PillarHabits({ color, title, subtitle, habits }: { color: string; title: string; subtitle: string; habits: string[] }) {
  return (
    <div style={{
      padding: 'clamp(16px, 2vw, 20px)',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${color}`,
      borderRadius: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color }}>{title}</span>
        <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>{subtitle}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {habits.map((h, i) => (
          <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>{h}</p>
        ))}
      </div>
    </div>
  );
}

function ScoreCard({ color, title, max, items }: { color: string; title: string; max: number; items: string[] }) {
  return (
    <div style={{
      padding: 'clamp(14px, 2vw, 18px)',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{title}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>{max} pts</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.map((item, i) => (
          <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.5 }}>{item}</p>
        ))}
      </div>
    </div>
  );
}

function InfoBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '16px 20px',
      background: `${color}08`,
      border: `1px solid ${color}20`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 10,
      fontSize: 13, lineHeight: 1.75,
      color: 'rgba(255,255,255,0.55)',
      marginBottom: 0,
    }}>
      {children}
    </div>
  );
}