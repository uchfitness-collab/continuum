import Link from 'next/link';

export default function AboutPage() {
  return (
    <section
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: 'radial-gradient(circle at top, #020617, #01030f)',
        color: '#e5e7eb',
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
          opacity: 0.15,
          filter: 'grayscale(100%)',
          pointerEvents: 'none',
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(15,23,42,0.6), rgba(2,6,23,0.97))',
          pointerEvents: 'none',
        }}
      />

      {/* CONTENT */}
      <div
        className="about-content"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 900,
          margin: '0 auto',
          padding: '80px 20px 100px',
        }}
      >
        {/* HERO */}
        <div style={{ marginBottom: 64, textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: 'clamp(32px, 6vw, 52px)',
            fontWeight: 700, 
            marginBottom: 20,
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #e5e7eb, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            padding: '0 16px',
          }}>
            Discipline is Measurable.<br />Now Prove It.
          </h1>

          <p style={{ 
            fontSize: 'clamp(16px, 3vw, 19px)',
            lineHeight: 1.7, 
            maxWidth: 680, 
            margin: '0 auto',
            color: '#94a3b8',
            padding: '0 16px',
          }}>
            Continuum doesn't motivate you. It doesn't coach you. It doesn't tell you what to do.
            It gives you one thing: proof of who you actually are when no one's watching.
          </p>
        </div>

        {/* THE PROBLEM */}
        <Section title="You Already Know What to Do">
          <p>
            The problem isn't information. You know you should work out. You know you should 
            read instead of scroll. You know what your 10-year self would want you to do today.
          </p>

          <p>
            The problem is <strong>execution under zero accountability</strong>.
          </p>

          <p>
            When no one's tracking you, when there's no deadline, when it's just you and the voice 
            in your head saying "I'll start tomorrow" — that's where most people break. Not once. 
            Every single day.
          </p>

          <p style={{ 
            marginTop: 24, 
            padding: 20,
            background: '#1e0a0a',
            border: '2px solid #ef444420',
            borderRadius: 10,
            fontSize: 15,
            lineHeight: 1.7
          }}>
            Without measurement, discipline is just a story you tell yourself about who you 
            <em> think</em> you are. Continuum turns it into data you can't argue with.
          </p>
        </Section>

        <hr style={divider} />

        {/* WHY HABITS MATTER */}
        <Section title="Why Habits Are Everything">
          <p>
            James Clear got it right: <strong>"You do not rise to the level of your goals. 
            You fall to the level of your systems."</strong>
          </p>

          <p>
            Your habits are your system. They're the compound interest of self-improvement.
            Get 1% better each day, and you'll end up 37 times better in a year. Get 1% worse,
            and you'll decline to nearly zero.
          </p>

          <div style={{
            marginTop: 24,
            padding: 20,
            background: '#0f172a',
            border: '1px solid #3b82f640',
            borderRadius: 10,
          }}>
            <h4 style={{ 
              fontSize: 16, 
              marginBottom: 12, 
              color: '#3b82f6',
              fontWeight: 600
            }}>
              The Three Layers of Behavior Change
            </h4>
            
            <ul style={{ ...list, marginTop: 12, marginBottom: 0 }}>
              <li>
                <strong>Outcomes:</strong> What you want to achieve (lose 30 lbs, launch business)
              </li>
              <li>
                <strong>Process:</strong> Your systems and habits (daily workouts, coding 2 hrs/day)
              </li>
              <li>
                <strong>Identity:</strong> Who you become ("I'm a disciplined person," "I'm a builder")
              </li>
            </ul>

            <p style={{ 
              marginTop: 16,
              marginBottom: 0,
              fontSize: 14,
              lineHeight: 1.7,
              color: '#94a3b8'
            }}>
              Most people focus on outcomes. Winners focus on identity. Continuum measures both —
              your daily process <em>and</em> the identity you're building through proof.
            </p>
          </div>

          <p style={{ marginTop: 24 }}>
            <strong>Habits create identity.</strong> Every action is a vote for the type of person you wish to become.
            Log 100 days of discipline? You're not trying to be disciplined anymore. You <em>are</em> disciplined.
            That's not motivation. That's evidence.
          </p>
        </Section>

        <hr style={divider} />

        {/* THE SYSTEM */}
        <Section title="How It Works">
          <p style={{ fontSize: 'clamp(15px, 3vw, 17px)', color: '#e5e7eb', marginBottom: 28 }}>
            Every day, you answer one question across three areas: <strong>Did you execute?</strong>
          </p>

          <Pillar
            icon="💪"
            color="#22c55e"
            title="Body"
            description="Physical action creates momentum. Did you move? Did you maintain nutritional discipline? Did you complete your reps? Your body is the foundation. When it's strong, everything else follows."
          />

          <Pillar
            icon="🧠"
            color="#3b82f6"
            title="Mind"
            description="What you avoid matters as much as what you do. Did you skip the negative habit? Did you complete the positive one? Mental discipline is the ability to choose discomfort when comfort is available."
          />

          <Pillar
            icon="⚡"
            color="#a855f7"
            title="Identity"
            description="Identity is built through proof. Did you complete your daily mission? Did you practice your philosophy? The gap between who you say you are and what you actually do — this pillar measures that gap."
          />

          <p style={{ 
            marginTop: 32, 
            fontSize: 'clamp(14px, 3vw, 16px)',
            lineHeight: 1.8,
            color: '#94a3b8'
          }}>
            Your answers across these three pillars calculate a single number: the <strong style={{ color: '#22c55e' }}>Sovereign Score</strong>. 
            Not a streak. Not a badge. A score that compounds daily and reveals the truth about your trajectory.
          </p>
        </Section>

        <hr style={divider} />

        {/* SOVEREIGN SCORE */}
        <Section title="The Sovereign Score">
          <p>
            Most apps reward you for showing up once. Continuum rewards you for showing up 
            <strong> consistently</strong>.
          </p>

          <p>
            The score weighs your most recent behavior (30%) against your historical average (70%). 
            This means:
          </p>

          <ul style={list}>
            <li>One perfect day won't inflate your score overnight</li>
            <li>One bad day won't destroy your progress</li>
            <li>Consistency over weeks and months is what moves the needle</li>
            <li>The score tells you if you're building or coasting — no guessing</li>
          </ul>

          <div style={{
            marginTop: 28,
            padding: 'clamp(16px, 4vw, 24px)',
            background: '#022c22',
            border: '2px solid #22c55e40',
            borderRadius: 12,
          }}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#e5e7eb' }}>
              <strong style={{ color: '#22c55e' }}>The score isn't the goal.</strong> It's the signal. 
              It tells you whether your daily actions align with who you're trying to become. 
              When it's rising, you know. When it's flat or falling, you know that too.
            </p>
          </div>
        </Section>

        <hr style={divider} />

        {/* NEW FEATURES */}
        <Section title="Features That Keep You On Track">
          <Feature
            icon="🎯"
            title="Weekly Goals"
            description="Set 3 specific goals every Monday. See them on your Daily Log as reminders. Review them Sunday night. Weekly goals create focus and make reflection meaningful. They reset automatically every Monday at 12:01 AM EST."
          />

          <Feature
            icon="📊"
            title="Pattern Recognition"
            description="Your Dashboard tracks your top weakness triggers over 30 days. Slip up because of stress? Boredom? Fatigue? The system identifies patterns you might miss. Awareness is the first step to mastery."
          />

          <Feature
            icon="🔥"
            title="Streak Tracking"
            description="See how many consecutive days you've logged. Streaks are powerful motivators, but they're not the only metric that matters. The Sovereign Score rewards comebacks — missing one day doesn't erase your progress."
          />

          <Feature
            icon="📈"
            title="Habit Consistency Metrics"
            description="Track how often you complete each habit over the last 30 days. Body habits at 95%? Mind habits at 60%? The data shows exactly where you're strong and where you're slipping."
          />

          <Feature
            icon="📝"
            title="Daily Notes & Journal"
            description="Capture context with every log. What happened today? What triggered a slip-up? What felt different? Reviewing your notes weekly reveals patterns and insights you'd otherwise miss."
          />

          <Feature
            icon="📤"
            title="Progress Sharing"
            description="Download shareable images of your stats or chart. Post them for public accountability. Social pressure works when you use it strategically."
          />
        </Section>

        <hr style={divider} />

        {/* WHY THIS WORKS */}
        <Section title="Why Measurement Changes Everything">
          <Principle
            title="You can't hide from data"
            text="When you log daily, patterns emerge. You see exactly where discipline breaks down — which days, which pillars, which excuses you keep repeating. You can lie to yourself. You can't lie to the chart."
          />

          <Principle
            title="Consistency becomes visible"
            text="Discipline isn't dramatic. It's boring. It's the same actions, day after day, with no one watching. The score makes that repetition visible. It proves you showed up even when it didn't feel like it mattered."
          />

          <Principle
            title="Identity shifts through proof"
            text="You don't become disciplined by deciding to be disciplined. You become disciplined by proving it daily. Continuum tracks the proof so you can see the person you're becoming take shape over time."
          />

          <Principle
            title="Feedback tightens the loop"
            text="Most people go weeks or months before realizing they've been coasting. With Continuum, you know within 24 hours. The feedback loop is tight. Course correction is immediate."
          />
        </Section>

        <hr style={divider} />

        {/* SOVEREIGNTY */}
        <Section title="What is Sovereignty?">
          <p>
            Sovereignty is self-governance. It's the ability to set a standard and hold it without 
            external pressure.
          </p>

          <p>
            Most people outsource their discipline to others. They need a coach. They need a 
            workout partner. They need someone checking in. When that person isn't there, the 
            standard collapses.
          </p>

          <p>
            Sovereign individuals hold their own standard. They don't need external validation 
            to execute. They don't need someone watching to do the work.
          </p>

          <p style={{ 
            marginTop: 28,
            padding: 'clamp(16px, 4vw, 24px)',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: 10,
            fontSize: 'clamp(14px, 3vw, 16px)',
            lineHeight: 1.8,
            fontStyle: 'italic'
          }}>
            Continuum gives you the measurement tool to build that sovereignty. Define your standards. 
            Track your adherence. Watch the gap between intention and action close over time. 
            <strong style={{ color: '#22c55e', display: 'block', marginTop: 16, fontStyle: 'normal' }}>
              Sovereignty isn't granted. It's earned — one disciplined day at a time.
            </strong>
          </p>
        </Section>

        <hr style={divider} />

        {/* WHO IT'S FOR */}
        <Section title="This Is For You If...">
          <ul style={{ ...list, marginLeft: 0, listStyle: 'none' }}>
            <li style={{ 
              marginBottom: 16, 
              paddingLeft: 28,
              position: 'relative'
            }}>
              <span style={{ 
                position: 'absolute', 
                left: 0, 
                color: '#22c55e',
                fontSize: 18
              }}>✓</span>
              You know what you should be doing but can't sustain it for more than a few days
            </li>
            <li style={{ 
              marginBottom: 16, 
              paddingLeft: 28,
              position: 'relative'
            }}>
              <span style={{ 
                position: 'absolute', 
                left: 0, 
                color: '#22c55e',
                fontSize: 18
              }}>✓</span>
              You're tired of relying on motivation or external accountability
            </li>
            <li style={{ 
              marginBottom: 16, 
              paddingLeft: 28,
              position: 'relative'
            }}>
              <span style={{ 
                position: 'absolute', 
                left: 0, 
                color: '#22c55e',
                fontSize: 18
              }}>✓</span>
              You want truth more than comfort — even when the truth is ugly
            </li>
            <li style={{ 
              marginBottom: 16, 
              paddingLeft: 28,
              position: 'relative'
            }}>
              <span style={{ 
                position: 'absolute', 
                left: 0, 
                color: '#22c55e',
                fontSize: 18
              }}>✓</span>
              You're building something meaningful and need a system to stay sharp long-term
            </li>
            <li style={{ 
              marginBottom: 16, 
              paddingLeft: 28,
              position: 'relative'
            }}>
              <span style={{ 
                position: 'absolute', 
                left: 0, 
                color: '#22c55e',
                fontSize: 18
              }}>✓</span>
              You take full responsibility for your outcomes — no excuses
            </li>
          </ul>

          <p style={{ 
            marginTop: 32, 
            fontSize: 15, 
            color: '#94a3b8',
            lineHeight: 1.8
          }}>
            This isn't gamification. This isn't a streak app. This isn't a community. 
            This is a measurement tool for people who refuse to coast and need a system 
            that tells them the truth every single day.
          </p>
        </Section>

        <hr style={divider} />

        {/* THE COMMITMENT */}
        <Section title="What This Requires From You">
          <p style={{ fontSize: 'clamp(15px, 3vw, 17px)', color: '#e5e7eb' }}>
            Continuum requires exactly one thing: <strong>honesty</strong>.
          </p>

          <p>
            If you log truthfully — even when you fail, even when the score drops — the system works. 
            The data becomes valuable. The feedback becomes actionable.
          </p>

          <p>
            If you game it, you only game yourself. The score inflates. The feedback becomes noise. 
            You waste your time.
          </p>

          <div style={{
            marginTop: 28,
            padding: 'clamp(16px, 4vw, 20px)',
            background: '#1e0a0a',
            border: '1px solid #ef444440',
            borderRadius: 10,
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: 15, 
              lineHeight: 1.7,
              color: '#e5e7eb'
            }}>
              This is for people who want the truth more than they want to feel good. 
              If that's not you, this won't work.
            </p>
          </div>
        </Section>

        <hr style={divider} />

        {/* WHAT IT'S NOT */}
        <Section title="What Continuum Is Not">
          <ul style={list}>
            <li><strong>Not a coaching program</strong> — We don't tell you what habits to track</li>
            <li><strong>Not a content platform</strong> — No motivational posts or educational libraries</li>
            <li><strong>Not a social network</strong> — No followers, no leaderboards, no public profiles</li>
            <li><strong>Not a streak tracker</strong> — Missing a day isn't the end. Patterns matter, not perfection</li>
            <li><strong>Not a magic solution</strong> — This is a measurement tool. You still have to do the work</li>
          </ul>

          <p style={{ marginTop: 24, fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
            Continuum is a mirror. It shows you exactly who you are based on what you do daily. 
            Whether you like what you see is up to you.
          </p>
        </Section>

        <hr style={divider} />

        {/* FINAL CTA */}
        <div className="final-cta" style={{ 
          textAlign: 'center', 
          marginTop: 80,
          padding: 'clamp(32px, 6vw, 48px)',
          background: 'linear-gradient(135deg, #020617, #0f172a)',
          borderRadius: 16,
          border: '2px solid #22c55e30'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(28px, 5vw, 36px)',
            marginBottom: 16,
            fontWeight: 700
          }}>
            Ready to Stop Lying to Yourself?
          </h2>
          <p style={{ 
            color: '#94a3b8', 
            marginBottom: 36, 
            fontSize: 'clamp(15px, 3vw, 17px)',
            lineHeight: 1.6,
            maxWidth: 560,
            margin: '0 auto 36px'
          }}>
            Start tracking today. Define your standards. Log your execution. 
            See who you actually are when no one's watching.
          </p>
          
          <Link
            href="/signup"
            style={{
              display: 'inline-block',
              padding: 'clamp(14px, 3vw, 18px) clamp(32px, 6vw, 48px)',
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              color: '#020617',
              fontWeight: 700,
              fontSize: 'clamp(16px, 3vw, 18px)',
              borderRadius: 10,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)'
            }}
          >
            Start Tracking Now
          </Link>

          <p style={{
            marginTop: 24,
            fontSize: 14,
            color: '#64748b'
          }}>
            $12/month · Cancel anytime · No long-term commitment
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */

const divider = {
  margin: 'clamp(40px, 8vw, 64px) 0',
  border: 'none',
  borderTop: '1px solid #1e293b',
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ 
        fontSize: 'clamp(24px, 4vw, 32px)',
        marginBottom: 24, 
        color: '#e5e7eb',
        fontWeight: 600
      }}>
        {title}
      </h2>
      <div style={{ 
        lineHeight: 1.8, 
        color: '#94a3b8',
        fontSize: 'clamp(14px, 3vw, 16px)'
      }}>
        {children}
      </div>
    </section>
  );
}

function Pillar({
  icon,
  color,
  title,
  description
}: {
  icon: string;
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{
      padding: 'clamp(16px, 4vw, 24px)',
      marginBottom: 16,
      background: '#020617',
      borderRadius: 12,
      border: `2px solid ${color}30`
    }}>
      <div style={{ 
        fontSize: 'clamp(28px, 5vw, 32px)',
        marginBottom: 12 
      }}>
        {icon}
      </div>
      <h4 style={{ 
        fontSize: 'clamp(18px, 3vw, 20px)',
        marginBottom: 10, 
        color,
        fontWeight: 600
      }}>
        {title}
      </h4>
      <p style={{ 
        color: '#94a3b8', 
        fontSize: 'clamp(13px, 3vw, 15px)',
        lineHeight: 1.7,
        margin: 0
      }}>
        {description}
      </p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{
      padding: 20,
      marginBottom: 16,
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', alignItems: 'start', gap: 16 }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>{icon}</div>
        <div>
          <h4 style={{ 
            fontSize: 16,
            marginBottom: 8, 
            color: '#22c55e',
            fontWeight: 600
          }}>
            {title}
          </h4>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: 14,
            lineHeight: 1.7,
            margin: 0
          }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function Principle({
  title,
  text
}: {
  title: string;
  text: string;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ 
        marginBottom: 8, 
        fontSize: 'clamp(15px, 3vw, 17px)',
        color: '#22c55e',
        fontWeight: 600
      }}>
        → {title}
      </h4>
      <p style={{ 
        color: '#94a3b8', 
        fontSize: 'clamp(13px, 3vw, 15px)',
        lineHeight: 1.7,
        margin: 0
      }}>
        {text}
      </p>
    </div>
  );
}

const list = {
  margin: '20px 0 24px 28px',
  lineHeight: 2,
  color: '#e5e7eb',
  fontSize: 'clamp(13px, 3vw, 15px)'
};