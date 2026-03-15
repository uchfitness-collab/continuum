'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c18',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 24px)',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 14 }}>
            Guide
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 10, lineHeight: 1.15 }}>
            How to Use Continuum
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.65 }}>
            Follow these steps in order. Don&apos;t skip ahead.
          </p>
        </div>

        {/* STEPS */}
        <Step number="01" title="Set Your 1-Year Goals" color="#60a5fa">
          <Body>Go to the <Hl>Goals</Hl> page and fill out your 1-year vision for Body, Mind, and Identity.</Body>
          <Body>Your goals are your North Star. Everything you track daily should move you toward these outcomes. If your goal is &quot;lose 30 lbs,&quot; your habits should be &quot;hit the gym&quot; and &quot;no sugar.&quot;</Body>
          <Examples items={[
            'Body: "Lose 25 lbs, run a 10k under 50 minutes, have visible abs"',
            'Mind: "Read 24 books, eliminate social media addiction, meditate daily"',
            'Identity: "Launch business, network with 1 new person daily, study 45 min"',
          ]} />
          <Warning>Don&apos;t move to Step 2 until you&apos;ve saved your 1-year goals.</Warning>
        </Step>

        <Step number="02" title="Define Your Daily Habits" color="#4ade80">
          <Body>Go to the <Hl>Habits</Hl> page and set up your daily tracking system across 3 pillars.</Body>
          <PillarBlock color="#4ade80" title="Body" items={[
            'Physical activity — e.g. "Work out with high intensity"',
            'Nutritional discipline — e.g. "No candy or excessive sugar"',
            'Daily reps — e.g. "Push-ups, dips, pull-ups"',
          ]} />
          <PillarBlock color="#60a5fa" title="Mind" items={[
            'Positive habit — e.g. "Play chess and read every day"',
            'Negative habit to avoid — e.g. "No doom scrolling for 2+ hours"',
          ]} />
          <PillarBlock color="#a78bfa" title="Identity" items={[
            'Daily mission — e.g. "Work on business for 2+ hours"',
            'Philosophy practice — e.g. "Journal and reflect on stoicism"',
          ]} />
          <InfoBox color="#4ade80">Your habits should directly support your 1-year goals. If your goal is to launch a business, your identity mission should be &quot;work on business for X hours minimum.&quot;</InfoBox>
          <Warning>Save your habits before moving to Step 3.</Warning>
        </Step>

        <Step number="03" title="Set This Week's Goals" color="#fbbf24">
          <Body>Go back to the <Hl>Goals</Hl> page and scroll to &quot;This Week&apos;s Goals.&quot; Set 3 specific targets for the week.</Body>
          <Examples items={[
            '"Log 7/7 days above baseline score"',
            '"Hit the gym 5 times this week"',
            '"Ship the product feature by Friday"',
          ]} />
          <InfoBox color="#fbbf24">Weekly goals reset every Monday at 12:01 AM EST. They appear on your Daily Log as a reminder and on your Weekly Reflection so you can review how you did.</InfoBox>
        </Step>

        <Step number="04" title="Log Your Day Every Night" color="#f87171">
          <Body>Go to the <Hl>Daily Log</Hl> and record your day honestly before bed. The log locks at 12:01 AM EST.</Body>
          <PillarBlock color="#4ade80" title="Body (50 pts max)" items={[
            'Physical activity completed = 20 pts',
            'Nutritional discipline maintained = 20 pts',
            'Daily reps: Below 10 = -5 pts | 25+ = +5 pts | 50+ = +10 pts',
          ]} />
          <PillarBlock color="#60a5fa" title="Mind (50 pts max)" items={[
            'Positive habit completed = 20 pts',
            'Negative habit avoided = 20 pts',
            'Discipline rating 1–10 = adds to score',
          ]} />
          <PillarBlock color="#a78bfa" title="Identity (50 pts max)" items={[
            'Daily mission completed = 20 pts',
            'Philosophy practiced = 20 pts',
            'Mood rating 1–10 = adds to score',
          ]} />
          <InfoBox color="#f87171">
            Your <strong style={{ color: '#fff' }}>Sovereign Score</strong> = 70% yesterday&apos;s score + 30% today&apos;s. Consistency compounds. <strong style={{ color: '#4ade80' }}>Target: stay above 110.</strong>
          </InfoBox>
        </Step>

        <Step number="05" title="Check Your Dashboard Daily" color="#a78bfa">
          <Body>The <Hl>Dashboard</Hl> is your truth mirror. Check it daily to see where you stand.</Body>
          <Examples items={[
            'Your current streak and Sovereign Score trajectory',
            'Pillar performance — which area is holding you back',
            'Habit consistency over the last 30 days',
            'Weakness triggers — what causes your slip-ups',
          ]} />
          <InfoBox color="#a78bfa">Look for trends, not individual days. If your score is flat for 2+ weeks, your habits aren&apos;t challenging enough. The chart doesn&apos;t lie.</InfoBox>
        </Step>

        <Step number="06" title="Reflect Every Sunday" color="#fbbf24" last>
          <Body>Every Sunday, go to the <Hl>Week</Hl> page and complete your reflection.</Body>
          <PillarBlock color="#4ade80" title="What Worked" items={['Where did you execute at or above your standard?']} />
          <PillarBlock color="#f87171" title="What Broke" items={['Where did you fall below your standard — and why?']} />
          <PillarBlock color="#a78bfa" title="Next Week&apos;s Adjustment" items={['What ONE specific change will you make to close the gap?']} />
          <InfoBox color="#fbbf24">After saving your reflection, go back to the Goals page and set next week&apos;s targets. Give every change at least 30 days before judging it.</InfoBox>
        </Step>

        {/* ADDITIONAL FEATURES */}
        <div style={{
          padding: 'clamp(20px, 3vw, 28px)', marginBottom: 16,
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '3px solid #4ade80',
        }}>
          <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4ade80', fontWeight: 700, marginBottom: 20 }}>Additional Features</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              ['Rest Days', 'Log a rest day from the Daily Log — gives you 100 pts and maintains your streak. Use sparingly.'],
              ['Daily Notes', 'At the bottom of the Daily Log, capture context: wins, struggles, lessons. Patterns emerge when you review these.'],
              ['Share Your Progress', 'Use the Share buttons on the Dashboard to download a progress card. Post it for public accountability.'],
              ['Negative Triggers', 'When you fail to avoid your negative habit, the log asks what triggered it. Your dashboard tracks patterns over 30 days.'],
            ].map(([title, desc], i) => (
              <div key={i}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.82)', marginBottom: 5 }}>{title}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PRO TIPS */}
        <div style={{
          padding: 'clamp(20px, 3vw, 28px)', marginBottom: 16,
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '3px solid #60a5fa',
        }}>
          <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#60a5fa', fontWeight: 700, marginBottom: 20 }}>Pro Tips</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              'Log at night, not the next morning. Your memory fades. Record truthfully before bed.',
              "Don't chase perfection. A score of 110–130 consistently is elite. Consistency beats intensity.",
              "If you break a streak, start again immediately. The system rewards comebacks.",
              "Review your dashboard weekly. If your score is flat for 2+ weeks, your habits aren't challenging enough.",
              "Adjust your habits every 30 days. As you grow, what used to be hard becomes easy.",
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#60a5fa', flexShrink: 0, marginTop: 6 }} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <div style={{ padding: 'clamp(36px, 5vw, 52px) clamp(20px, 3vw, 32px)', textAlign: 'center', marginTop: 8 }}>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Ready to start?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(14px, 1.8vw, 16px)', marginBottom: 28, lineHeight: 1.65 }}>
            Set your 1-year direction and log your first day.
          </p>
          <Link href="/goals" style={{
            display: 'inline-block',
            padding: 'clamp(13px, 1.5vw, 16px) clamp(32px, 4vw, 48px)',
            background: '#4ade80', color: '#080c18',
            fontWeight: 700, fontSize: 'clamp(14px, 1.5vw, 16px)',
            borderRadius: 12, textDecoration: 'none',
          }}>
            Set Your Goals →
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Step({ number, title, color, children, last = false }: { number: string; title: string; color: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: 'clamp(16px, 3vw, 28px)', alignItems: 'flex-start',
      marginBottom: last ? 40 : 'clamp(32px, 4vw, 48px)',
    }}>
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: `${color}12`, border: `1px solid ${color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color, letterSpacing: '0.04em',
        }}>
          {number}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.2 }}>
          {title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: 0 }}>{children}</p>;
}

function Hl({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#4ade80', fontWeight: 600 }}>{children}</span>;
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: '#fbbf24', fontWeight: 600, margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <span>⚠️</span><span>{children}</span>
    </p>
  );
}

function InfoBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '13px 16px', borderRadius: 10,
      background: `${color}08`, border: `1px solid ${color}20`,
      borderLeft: `3px solid ${color}`,
      fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)',
    }}>
      {children}
    </div>
  );
}

function Examples({ items }: { items: string[] }) {
  return (
    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Examples</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.55, display: 'flex', gap: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>→</span>{item}
          </p>
        ))}
      </div>
    </div>
  );
}

function PillarBlock({ color, title, items }: { color: string; title: string; items: string[] }) {
  return (
    <div style={{
      padding: '13px 16px', borderRadius: 10,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderLeft: `3px solid ${color}`,
    }}>
      <p style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 8, letterSpacing: '0.02em' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {items.map((item, i) => (
          <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.55 }}>{item}</p>
        ))}
      </div>
    </div>
  );
}