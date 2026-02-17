import Link from 'next/link';

export default function HowToUsePage() {
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
          opacity: 0.1,
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
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1000,
          margin: '0 auto',
          padding: '80px 20px 100px',
        }}
      >
        {/* HERO */}
        <div style={{ marginBottom: 64, textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: 'clamp(36px, 6vw, 52px)',
            fontWeight: 700, 
            marginBottom: 20,
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            padding: '0 16px',
          }}>
            How to Use Continuum
          </h1>

          <p style={{ 
            fontSize: 'clamp(17px, 3vw, 20px)',
            lineHeight: 1.7, 
            maxWidth: 720, 
            margin: '0 auto',
            color: '#94a3b8',
            padding: '0 16px',
          }}>
            Follow these 6 steps exactly. Don't skip ahead. Don't improvise.
            This is the system that makes discipline measurable.
          </p>
        </div>

        {/* STEPS */}
        <BigStep
          number="1"
          title="Set Your 1-Year Goals"
          color="#3b82f6"
        >
          <p style={{ marginBottom: 20 }}>
            Before you track anything, you need to know <strong>where you're going</strong>.
          </p>

          <p style={{ marginBottom: 20 }}>
            Go to the <strong>Goals</strong> page inside the app and define your 1-year vision across three areas:
          </p>

          <GoalExample 
            icon="💪"
            title="Body"
            example="Lose 30 lbs, run a half-marathon under 2 hours, have visible abs"
          />

          <GoalExample 
            icon="🧠"
            title="Mind"
            example="Read 24 books, eliminate social media addiction, meditate 365 days straight"
          />

          <GoalExample 
            icon="⚡"
            title="Identity"
            example="Launch SaaS product with $10k monthly revenue and 100 paying customers"
          />

          <InfoBox color="#3b82f6">
            <strong>Why this matters:</strong> Your daily habits should move you toward these goals.
            If your goal is "lose 30 lbs," your habits should be "hit the gym" and "no sugar."
            If they don't connect, you're just tracking random activities.
          </InfoBox>
        </BigStep>

        <BigStep
          number="2"
          title="Define Your Daily Habits"
          color="#22c55e"
        >
          <p style={{ marginBottom: 20 }}>
            Now that you know your destination, define the <strong>daily actions</strong> that will get you there.
          </p>

          <p style={{ marginBottom: 20 }}>
            Go to the <strong>Habits</strong> page and set up 6 core habits across 3 pillars:
          </p>

          <PillarHabits
            icon="💪"
            color="#22c55e"
            title="Body (3 habits)"
            habits={[
              "Physical activity - e.g., 'Work out with high intensity'",
              "Nutritional discipline - e.g., 'No candy or excessive sugar'",
              "Daily reps - e.g., 'Push-ups, dips, pull-ups'"
            ]}
          />

          <PillarHabits
            icon="🧠"
            color="#3b82f6"
            title="Mind (2 habits)"
            habits={[
              "Positive habit - e.g., 'Play chess and read every day'",
              "Negative habit to avoid - e.g., 'No doom scrolling for 2+ hours'"
            ]}
          />

          <PillarHabits
            icon="⚡"
            color="#a855f7"
            title="Identity (2 habits)"
            habits={[
              "Daily mission - e.g., 'Work on business for 2+ hours'",
              "Philosophy practice - e.g., 'Journal and reflect on stoicism'"
            ]}
          />

          <InfoBox color="#22c55e">
            <strong>Make them specific:</strong> Not "eat healthy" but "no sugar after 6 PM."
            Not "be productive" but "work on project for minimum 2 hours."
            Vague habits = vague results.
          </InfoBox>
        </BigStep>

        <BigStep
          number="3"
          title="Set Weekly Goals (Optional)"
          color="#fbbf24"
        >
          <p style={{ marginBottom: 20 }}>
            Back on the <strong>Goals</strong> page, scroll down to "This Week's Goals."
          </p>

          <p style={{ marginBottom: 20 }}>
            Set 3 specific targets for the week (Monday - Sunday):
          </p>

          <ul style={{
            marginLeft: 28,
            marginBottom: 24,
            lineHeight: 2,
            fontSize: 'clamp(14px, 3vw, 16px)'
          }}>
            <li>Goal 1: "Log 7/7 days above baseline (110+ score)"</li>
            <li>Goal 2: "Hit the gym 5 times this week"</li>
            <li>Goal 3: "Ship product feature by Friday"</li>
          </ul>

          <InfoBox color="#fbbf24">
            <strong>Weekly goals reset every Monday at 12:01 AM EST.</strong> They show up on your
            Daily Log page as a reminder, and appear on your Weekly Reflection so you can review
            how you did. Think of them as mini-milestones that keep you focused week-to-week.
          </InfoBox>
        </BigStep>

        <BigStep
          number="4"
          title="Log Your Day Every Night"
          color="#ef4444"
        >
          <p style={{ marginBottom: 20 }}>
            This is the core loop. Every evening before bed, go to the <strong>Daily Log</strong> page
            and answer one question: <strong>Did you execute?</strong>
          </p>

          <ScoreBreakdown />

          <InfoBox color="#ef4444">
            <strong>Your Sovereign Score is a weighted average:</strong> 70% yesterday's score + 30% today's score.
            This means one perfect day won't inflate your score overnight, and one bad day won't destroy your progress.
            <strong style={{ display: 'block', marginTop: 12, color: '#22c55e' }}>
              Target: Stay above 110 (the baseline).
            </strong>
          </InfoBox>

          <div style={{
            marginTop: 24,
            padding: 20,
            background: '#1e0a0a',
            border: '1px solid #ef444450',
            borderRadius: 10,
            fontSize: 14,
            lineHeight: 1.7
          }}>
            <strong style={{ color: '#ef4444' }}>Critical:</strong> The daily log locks at 12:01 AM EST.
            You can't go back and edit. Log <em>before bed</em>, not the next morning.
            Your memory fades. Capture the truth while it's fresh.
          </div>
        </BigStep>

        <BigStep
          number="5"
          title="Check Your Dashboard Daily"
          color="#a855f7"
        >
          <p style={{ marginBottom: 20 }}>
            The <strong>Dashboard</strong> is your truth mirror. Check it daily to see:
          </p>

          <ul style={{
            marginLeft: 28,
            marginBottom: 24,
            lineHeight: 2,
            fontSize: 'clamp(14px, 3vw, 16px)'
          }}>
            <li><strong>Your current streak</strong> - How many consecutive days you've logged</li>
            <li><strong>Sovereign Score chart</strong> - Your trajectory over the last 120 days</li>
            <li><strong>Pillar performance</strong> - Which area (Body, Mind, Identity) is strongest/weakest</li>
            <li><strong>Habit consistency</strong> - How often you hit your habits over 30 days</li>
            <li><strong>Weakness patterns</strong> - What triggers your slip-ups (stress, boredom, fatigue)</li>
          </ul>

          <InfoBox color="#a855f7">
            <strong>Look for trends, not individual days.</strong> Is your score trending up, flat, or down?
            If it's flat for 2+ weeks, your habits aren't challenging enough. If it's dropping, you're coasting.
            The chart doesn't lie.
          </InfoBox>
        </BigStep>

        <BigStep
          number="6"
          title="Reflect Every Sunday Night"
          color="#3b82f6"
        >
          <p style={{ marginBottom: 20 }}>
            Every Sunday, go to the <strong>Weekly</strong> page and complete your reflection.
          </p>

          <p style={{ marginBottom: 20 }}>
            You'll review:
          </p>

          <ReflectionSection
            title="This Week's Goals"
            description="The 3 goals you set on Monday. Did you hit them?"
          />

          <ReflectionSection
            title="What Worked"
            description="Where did you execute at or above your standard?"
          />

          <ReflectionSection
            title="What Broke"
            description="Where did you fall below your standard — and why?"
          />

          <ReflectionSection
            title="Next Week's Adjustment"
            description="What specific change will you make to close the gap?"
          />

          <InfoBox color="#3b82f6">
            <strong>Why this matters:</strong> You can't improve what you don't review.
            Most people fail because they never stop to ask "what's working?"
            The weekly reflection forces you to analyze patterns, spot triggers, and make adjustments.
            Give each change at least 30 days before judging it.
          </InfoBox>
        </BigStep>

        {/* ADDITIONAL TIPS */}
        <div style={{
          marginTop: 80,
          padding: 'clamp(32px, 6vw, 48px)',
          background: '#020617',
          borderRadius: 16,
          border: '2px solid #22c55e30'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 36px)',
            marginBottom: 32,
            fontWeight: 700,
            color: '#22c55e'
          }}>
            Pro Tips
          </h2>

          <Tip
            icon="🎯"
            text="Don't chase perfection. A score of 110-130 is solid. Consistency beats intensity."
          />

          <Tip
            icon="📊"
            text="Review your dashboard weekly. If your score is flat for 2+ weeks, increase the difficulty of your habits."
          />

          <Tip
            icon="🔥"
            text="Streaks are motivating, but don't stress if you break one. The Sovereign Score rewards comebacks."
          />

          <Tip
            icon="📝"
            text="Use the daily notes field to capture context. Patterns emerge when you review your notes later."
          />

          <Tip
            icon="🚫"
            text="Rest days are fine, but use them sparingly. They give you 100 points (below baseline) and maintain your streak."
          />

          <Tip
            icon="🔄"
            text="Adjust your habits every 30 days. As you grow, what used to be hard becomes easy. Keep challenging yourself."
          />
        </div>

        {/* FINAL CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: 80,
          padding: 'clamp(32px, 6vw, 48px)',
          background: 'linear-gradient(135deg, #020617, #0f172a)',
          borderRadius: 16,
          border: '2px solid #22c55e'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(28px, 5vw, 36px)',
            marginBottom: 16,
            fontWeight: 700
          }}>
            That's It. Now Start.
          </h2>
          <p style={{ 
            color: '#94a3b8', 
            marginBottom: 36, 
            fontSize: 'clamp(15px, 3vw, 17px)',
            lineHeight: 1.6,
            maxWidth: 640,
            margin: '0 auto 36px'
          }}>
            No more excuses. No more "I'll start Monday." Define your standards,
            log your execution, and watch the data prove who you're becoming.
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
            $12/month · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Components ---------- */

function BigStep({
  number,
  title,
  color,
  children
}: {
  number: string;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      marginBottom: 64,
      padding: 'clamp(28px, 5vw, 40px)',
      background: '#020617',
      borderRadius: 16,
      border: `2px solid ${color}`,
      borderLeft: `6px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        <div style={{
          width: 'clamp(56px, 10vw, 64px)',
          height: 'clamp(56px, 10vw, 64px)',
          borderRadius: 12,
          background: color,
          color: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(28px, 5vw, 36px)',
          fontWeight: 800,
          flexShrink: 0
        }}>
          {number}
        </div>
        <h2 style={{ 
          fontSize: 'clamp(24px, 4vw, 32px)',
          margin: 0,
          color,
          fontWeight: 700
        }}>
          {title}
        </h2>
      </div>
      <div style={{ 
        fontSize: 'clamp(14px, 3vw, 16px)',
        lineHeight: 1.8,
        color: '#e5e7eb'
      }}>
        {children}
      </div>
    </div>
  );
}

function GoalExample({ icon, title, example }: { icon: string; title: string; example: string }) {
  return (
    <div style={{
      padding: 16,
      marginBottom: 12,
      background: '#01030f',
      borderRadius: 10,
      border: '1px solid #334155'
    }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 15 }}>{title}</div>
      <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{example}</div>
    </div>
  );
}

function PillarHabits({
  icon,
  color,
  title,
  habits
}: {
  icon: string;
  color: string;
  title: string;
  habits: string[];
}) {
  return (
    <div style={{
      padding: 20,
      marginBottom: 16,
      background: '#01030f',
      borderRadius: 10,
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h4 style={{ margin: 0, color, fontSize: 16, fontWeight: 600 }}>{title}</h4>
      </div>
      <ul style={{ marginLeft: 20, lineHeight: 1.8, fontSize: 14, color: '#94a3b8' }}>
        {habits.map((habit, i) => (
          <li key={i}>{habit}</li>
        ))}
      </ul>
    </div>
  );
}

function InfoBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 24,
      padding: 20,
      background: '#01030f',
      border: `1px solid ${color}40`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 10,
      fontSize: 14,
      lineHeight: 1.7,
      color: '#e5e7eb'
    }}>
      {children}
    </div>
  );
}

function ScoreBreakdown() {
  return (
    <div style={{
      padding: 24,
      marginBottom: 24,
      background: '#01030f',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <h4 style={{ marginBottom: 16, color: '#e5e7eb', fontSize: 16 }}>
        Daily Scoring System:
      </h4>

      <ScorePillar
        icon="💪"
        color="#22c55e"
        title="Body (50 pts max)"
        items={[
          "Physical activity completed = 20 pts",
          "Nutritional discipline maintained = 20 pts",
          "Daily reps: Below 10 = -5 pts | 25+ = +5 pts | 50+ = +10 pts"
        ]}
      />

      <ScorePillar
        icon="🧠"
        color="#3b82f6"
        title="Mind (50 pts max)"
        items={[
          "Positive habit completed = 20 pts",
          "Negative habit avoided = 20 pts",
          "Discipline rating (1-10) = adds to score"
        ]}
      />

      <ScorePillar
        icon="⚡"
        color="#a855f7"
        title="Identity (50 pts max)"
        items={[
          "Daily mission completed = 20 pts",
          "Philosophy practiced = 20 pts",
          "Mood rating (1-10) = adds to score"
        ]}
      />

      <div style={{
        marginTop: 16,
        padding: 16,
        background: '#020617',
        borderRadius: 8,
        fontSize: 14,
        color: '#94a3b8'
      }}>
        <strong style={{ color: '#fbbf24' }}>Max daily score = 150 points</strong> (50 per pillar)
      </div>
    </div>
  );
}

function ScorePillar({
  icon,
  color,
  title,
  items
}: {
  icon: string;
  color: string;
  title: string;
  items: string[];
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h5 style={{ margin: 0, color, fontSize: 15, fontWeight: 600 }}>{title}</h5>
      </div>
      <ul style={{ marginLeft: 32, fontSize: 13, lineHeight: 1.8, color: '#94a3b8' }}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ReflectionSection({ title, description }: { title: string; description: string }) {
  return (
    <div style={{
      padding: 16,
      marginBottom: 12,
      background: '#01030f',
      borderRadius: 10,
      border: '1px solid #334155'
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 15, color: '#22c55e' }}>
        {title}
      </div>
      <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
        {description}
      </div>
    </div>
  );
}

function Tip({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      marginBottom: 20,
      alignItems: 'start'
    }}>
      <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
      <p style={{
        margin: 0,
        fontSize: 'clamp(14px, 3vw, 16px)',
        lineHeight: 1.7,
        color: '#e5e7eb'
      }}>
        {text}
      </p>
    </div>
  );
}