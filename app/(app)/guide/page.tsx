'use client';

export default function GuidePage() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h1 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
            How to Use Continuum
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.6 }}>
            Follow these steps exactly. Don't skip ahead.
          </p>
        </div>

        {/* STEP 1 */}
        <Step 
          number={1}
          title="Set Your 1-Year Goals"
          color="#3b82f6"
        >
          <p>Go to the <strong>Goals</strong> page and fill out your 1-year vision for Body, Mind, and Identity.</p>
          
          <Box color="#3b82f6">
            <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>Why this matters:</p>
            <p style={{ margin: 0 }}>
              Your goals are your North Star. Everything you track daily should move you toward these outcomes.
              If your goal is "lose 30 lbs," your daily habits should be "hit the gym" and "no sugar."
            </p>
          </Box>

          <p><strong>Examples of good goals:</strong></p>
          <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
            <li>💪 Body: "Lose 25 lbs, run a 10k in under 50 minutes, have visible abs"</li>
            <li>🧠 Mind: "Read 24 books, eliminate social media addiction, meditate daily for 365 days"</li>
            <li>⚡ Identity: "Launch SaaS product with $10k MRR and 100 paying customers"</li>
          </ul>

          <p style={{ color: '#fbbf24', fontWeight: 600 }}>
            ⚠️ Don't move to Step 2 until you've saved your 1-year goals.
          </p>
        </Step>

        {/* STEP 2 */}
        <Step 
          number={2}
          title="Define Your Daily Habits"
          color="#22c55e"
        >
          <p>Go to the <strong>Habits</strong> page and set up your daily tracking system.</p>
          
          <p>You'll define 6 core habits across 3 pillars:</p>

          <HabitExample 
            pillar="Body 💪"
            habits={[
              "Physical activity (e.g., 'Work out with high intensity workouts')",
              "Nutritional discipline (e.g., 'No candy or excessive sugar')",
              "Daily reps (e.g., 'Push-ups, dips, pull-ups completed')"
            ]}
          />

          <HabitExample 
            pillar="Mind 🧠"
            habits={[
              "Positive habit (e.g., 'Play chess and read everyday')",
              "Negative habit to avoid (e.g., 'Doom scrolling for 2+ hours')"
            ]}
          />

          <HabitExample 
            pillar="Identity ⚡"
            habits={[
              "Daily mission (e.g., 'Work on business for 2+ hours')",
              "Philosophy practice (e.g., 'Journal and reflect on stoicism')"
            ]}
          />

          <Box color="#22c55e">
            <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>Pro tip:</p>
            <p style={{ margin: 0 }}>
              Your habits should directly support your 1-year goals. If your goal is "launch a business,"
              your Identity mission should be "work on business for X hours minimum."
            </p>
          </Box>

          <p style={{ color: '#fbbf24', fontWeight: 600 }}>
            ⚠️ Save your habits before moving to Step 3.
          </p>
        </Step>

        {/* STEP 3 */}
        <Step 
          number={3}
          title="Set This Week's Goals (Optional but Recommended)"
          color="#fbbf24"
        >
          <p>Go back to the <strong>Goals</strong> page and scroll to "This Week's Goals."</p>
          
          <p>Set 3 specific goals for this week (Monday - Sunday):</p>

          <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
            <li>Goal 1: "Log 7/7 days above baseline score"</li>
            <li>Goal 2: "Hit the gym 5 times this week"</li>
            <li>Goal 3: "Ship product feature by Friday"</li>
          </ul>

          <Box color="#fbbf24">
            <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>What are weekly goals?</p>
            <p style={{ margin: 0 }}>
              Weekly goals reset every Monday at 12:01 AM EST. They show up on your Daily Log page as a reminder,
              and appear on your Weekly Reflection so you can review how you did.
            </p>
          </Box>

          <p style={{ fontSize: 14, color: '#94a3b8', fontStyle: 'italic' }}>
            You can skip this step and come back later, but weekly goals help you stay focused.
          </p>
        </Step>

        {/* STEP 4 */}
        <Step 
          number={4}
          title="Log Your First Day"
          color="#a855f7"
        >
          <p>Go to the <strong>Daily Log</strong> page and record your day.</p>
          
          <p>Here's what you'll track:</p>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: '#22c55e', fontSize: 16, marginBottom: 8 }}>Body Pillar:</h4>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li>Did you complete your physical activity? (20 pts)</li>
              <li>Did you maintain nutritional discipline? (20 pts)</li>
              <li>How many daily reps? (Below 10 = -5 pts, 25+ = +5 pts, 50+ = +10 pts)</li>
            </ul>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: '#3b82f6', fontSize: 16, marginBottom: 8 }}>Mind Pillar:</h4>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li>Did you complete your positive habit? (20 pts)</li>
              <li>Did you avoid your negative habit? (20 pts)</li>
              <li>Discipline rating 1-10 (adds to score)</li>
            </ul>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ color: '#a855f7', fontSize: 16, marginBottom: 8 }}>Identity Pillar:</h4>
            <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
              <li>Did you complete your daily mission? (20 pts)</li>
              <li>Did you practice your philosophy? (20 pts)</li>
              <li>Mood rating 1-10 (adds to score)</li>
            </ul>
          </div>

          <Box color="#a855f7">
            <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>Scoring system:</p>
            <p style={{ margin: 0, marginBottom: 8 }}>
              Max daily score = 150 points (50 per pillar)
            </p>
            <p style={{ margin: 0, marginBottom: 8 }}>
              Your <strong>Sovereign Score</strong> is a weighted average: 70% yesterday's score + 30% today's score.
              This creates momentum — consistency compounds over time.
            </p>
            <p style={{ margin: 0, fontWeight: 600, color: '#22c55e' }}>
              Target: Stay above 110 (the baseline).
            </p>
          </Box>

          <p style={{ fontWeight: 600, marginTop: 20 }}>
            Important: The daily log locks at 12:01 AM EST each night. Log honestly before bed.
          </p>
        </Step>

        {/* STEP 5 */}
        <Step 
          number={5}
          title="Check Your Dashboard Daily"
          color="#ef4444"
        >
          <p>The <strong>Dashboard</strong> is your command center. Check it daily to:</p>
          
          <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
            <li>See your current streak</li>
            <li>Track your Sovereign Score trajectory over the last 120 days</li>
            <li>Monitor pillar performance (Body, Mind, Identity)</li>
            <li>Identify your top weakness triggers (e.g., "Social Media" triggered 8 slip-ups this month)</li>
            <li>Review habit consistency over the last 30 days</li>
          </ul>

          <Box color="#ef4444">
            <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>What to look for:</p>
            <p style={{ margin: 0, marginBottom: 8 }}>
              <strong>Strongest Pillar:</strong> Which area you're dominating
            </p>
            <p style={{ margin: 0, marginBottom: 8 }}>
              <strong>Needs Attention:</strong> Which pillar is dragging you down
            </p>
            <p style={{ margin: 0 }}>
              <strong>Weakness Patterns:</strong> What's causing you to break standard (stress, boredom, fatigue, etc.)
            </p>
          </Box>

          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 16 }}>
            Pro tip: Share your chart or progress card on social media to create public accountability.
          </p>
        </Step>

        {/* STEP 6 */}
        <Step 
          number={6}
          title="Reflect Every Sunday (Weekly Review)"
          color="#fbbf24"
        >
          <p>Every Sunday, go to the <strong>Weekly</strong> page and complete your reflection.</p>
          
          <p>You'll review:</p>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, color: '#fbbf24' }}>This Week's Goals:</h4>
            <p style={{ margin: 0, fontSize: 14 }}>
              See the 3 goals you set on Monday. Did you hit them?
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, color: '#22c55e' }}>What Worked:</h4>
            <p style={{ margin: 0, fontSize: 14 }}>
              Where did you execute at or above your standard? What went well?
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, color: '#ef4444' }}>What Broke:</h4>
            <p style={{ margin: 0, fontSize: 14 }}>
              Where did you fall below your standard — and why?
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 16, marginBottom: 8, color: '#a855f7' }}>Next Week's Adjustment:</h4>
            <p style={{ margin: 0, fontSize: 14 }}>
              What specific change will you make next week to close the gap?
            </p>
          </div>

          <Box color="#fbbf24">
            <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>Why this matters:</p>
            <p style={{ margin: 0 }}>
              You can't improve what you don't review. The weekly reflection forces you to analyze patterns,
              spot triggers, and make adjustments. Most people fail because they never stop to ask "what's working?"
            </p>
          </Box>

          <p style={{ fontWeight: 600, marginTop: 20 }}>
            After you save your reflection, go back to the Goals page and set next week's goals.
          </p>
        </Step>

        {/* ADDITIONAL FEATURES */}
        <div style={{
          padding: 32,
          marginTop: 48,
          marginBottom: 40,
          background: '#020617',
          borderRadius: 16,
          border: '2px solid #22c55e',
        }}>
          <h2 style={{ fontSize: 28, marginBottom: 24, color: '#22c55e' }}>
            Additional Features
          </h2>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8, color: '#e5e7eb' }}>
              Rest Days
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#94a3b8' }}>
              On the Daily Log page, you can log a "Rest Day" instead of tracking habits.
              This gives you a score of 100 (slightly below baseline) and maintains your streak.
              Use this sparingly — only on legitimate recovery days.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8, color: '#e5e7eb' }}>
              Daily Notes (Journal)
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#94a3b8' }}>
              At the bottom of the Daily Log, there's a notes field. Use this to capture context:
              wins, struggles, lessons learned, or anything that will help you spot patterns later.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8, color: '#e5e7eb' }}>
              Share Your Progress
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#94a3b8' }}>
              On the Dashboard, use the "Share My Progress" or "Share My Chart" buttons to download
              an image card with your stats. Post it on X, Instagram, or LinkedIn for public accountability.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: 18, marginBottom: 8, color: '#e5e7eb' }}>
              Negative Triggers
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#94a3b8' }}>
              When you fail to avoid your negative habit, the Daily Log asks "what triggered the slip-up?"
              Your Dashboard tracks these over 30 days so you can see patterns (e.g., "I always break when stressed").
            </p>
          </div>
        </div>

        {/* FINAL TIPS */}
        <div style={{
          padding: 32,
          marginBottom: 40,
          background: '#020617',
          borderRadius: 16,
          border: '2px solid #3b82f6',
        }}>
          <h2 style={{ fontSize: 28, marginBottom: 24, color: '#3b82f6' }}>
            Pro Tips for Success
          </h2>

          <ul style={{ marginLeft: 20, lineHeight: 2, fontSize: 15 }}>
            <li>
              <strong>Log at night, not the next morning.</strong> Your memory fades. Record truthfully before bed.
            </li>
            <li>
              <strong>Don't chase perfection.</strong> A score of 110-130 is solid. Consistency beats intensity.
            </li>
            <li>
              <strong>Use streaks as motivation, not pressure.</strong> If you break a streak, start again immediately.
              The system is designed to reward comebacks.
            </li>
            <li>
              <strong>Review your dashboard weekly.</strong> Look at your chart. Are you trending up or flat?
              If flat, your habits aren't challenging enough.
            </li>
            <li>
              <strong>Adjust your habits every 30 days.</strong> As you grow, what used to be hard becomes easy.
              Increase the difficulty to keep progressing toward your 1-year goals.
            </li>
            <li>
              <strong>Share your journey.</strong> Public accountability works. Post your weekly results. Let people watch you build.
            </li>
          </ul>
        </div>

        {/* BOTTOM CTA */}
        <div style={{
          padding: 40,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 16,
        }}>
          <h2 style={{ fontSize: 32, marginBottom: 16, fontWeight: 700 }}>
            Ready to start?
          </h2>
          <p style={{ fontSize: 18, marginBottom: 24, lineHeight: 1.6 }}>
            Go to the Goals page, set your 1-year direction, and log your first day.
          </p>
          <a
            href="/goals"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: '#020617',
              color: '#fff',
              fontWeight: 600,
              fontSize: 18,
              borderRadius: 10,
              textDecoration: 'none',
              border: '2px solid #fff',
            }}
          >
            Set Your Goals →
          </a>
        </div>

      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Step({ 
  number, 
  title, 
  color, 
  children 
}: { 
  number: number; 
  title: string; 
  color: string; 
  children: React.ReactNode;
}) {
  return (
    <div style={{
      padding: 32,
      marginBottom: 40,
      background: '#020617',
      borderRadius: 16,
      border: `2px solid ${color}`,
      borderLeft: `6px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: color,
          color: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 700,
        }}>
          {number}
        </div>
        <h2 style={{ fontSize: 24, margin: 0, color }}>
          {title}
        </h2>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.8, color: '#e5e7eb' }}>
        {children}
      </div>
    </div>
  );
}

function Box({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: 20,
      marginTop: 16,
      marginBottom: 16,
      background: '#01030f',
      border: `1px solid ${color}40`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 10,
      fontSize: 14,
      lineHeight: 1.7,
      color: '#e5e7eb',
    }}>
      {children}
    </div>
  );
}

function HabitExample({ pillar, habits }: { pillar: string; habits: string[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 16, marginBottom: 8 }}>{pillar}</h4>
      <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
        {habits.map((habit, i) => (
          <li key={i}>{habit}</li>
        ))}
      </ul>
    </div>
  );
}