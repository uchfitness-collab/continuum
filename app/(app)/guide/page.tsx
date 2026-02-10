'use client';

import Link from 'next/link';

export default function GuidePage() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 12, color: '#e5e7eb' }}>
            How Continuum Works
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6 }}>
            Continuum doesn't tell you what to do. It measures whether you're doing what you said you would.
          </p>
        </div>

        {/* WHAT THIS IS */}
        <Section>
          <h2 style={sectionTitle}>What This System Does</h2>
          <p style={paragraph}>
            Continuum is a measurement tool for daily discipline. You define your standards. 
            You log your execution. The system tracks the gap between what you intend and what you actually do.
          </p>
          <p style={paragraph}>
            Every day, you'll answer a simple question: did you execute on your commitments? 
            The Sovereign Score aggregates your answers across three areas—Body, Mind, and Identity—into 
            a single metric that shows whether you're moving forward, plateauing, or slipping.
          </p>
          <p style={paragraph}>
            This is not a fitness app. It's not therapy. It's not a productivity system. 
            It's a behavioral feedback loop that makes consistency visible over time.
          </p>
        </Section>

        {/* THE THREE PILLARS */}
        <Section>
          <h2 style={sectionTitle}>The Three Pillars</h2>
          <p style={paragraph}>
            Your daily execution is measured across three core dimensions. Each pillar represents a different 
            aspect of discipline, and together they determine your Sovereign Score.
          </p>

          <PillarCard
            title="Body"
            color="#22c55e"
            description="Physical action creates momentum. This pillar tracks whether you moved, maintained nutritional discipline, and completed your daily physical output."
            tracks={[
              "Physical activity completion",
              "Nutritional discipline maintained",
              "Daily reps completed (tracked by volume)"
            ]}
          />

          <PillarCard
            title="Mind"
            color="#3b82f6"
            description="What you avoid matters as much as what you do. This pillar measures whether you reinforced a positive habit and avoided a negative one."
            tracks={[
              "Negative habit avoided",
              "Positive habit completed",
              "Overall discipline rating (1-10)"
            ]}
          />

          <PillarCard
            title="Identity"
            color="#a855f7"
            description="Identity is built through proof. This pillar tracks whether your daily actions align with the person you're trying to become."
            tracks={[
              "Daily mission completed",
              "Philosophy practice completed",
              "Mood rating (1-10)"
            ]}
          />
        </Section>

        {/* THE SOVEREIGN SCORE */}
        <Section>
          <h2 style={sectionTitle}>The Sovereign Score</h2>
          <p style={paragraph}>
            The Sovereign Score is a single daily number that reflects how consistently you executed across all three pillars. 
            It's calculated based on your inputs and weighted to reward consistency over intensity.
          </p>
          <p style={paragraph}>
            A rising score signals increasing alignment between your stated standards and your actual behavior. 
            A declining score reveals where execution is breaking down. The score doesn't judge any single day—it 
            shows momentum, plateaus, and regressions over time.
          </p>
          <p style={paragraph}>
            You are not trying to maximize your score. You are trying to stay aligned with your own standards 
            and use changes in the score to diagnose where discipline is strong and where it's slipping.
          </p>
        </Section>

        {/* HOW TO USE IT */}
        <Section>
          <h2 style={sectionTitle}>How to Use This System</h2>
          
          <Step
            number="1"
            title="Define Your Habits"
            description="Go to the Habits page and define the specific actions you'll track daily. Be concrete. Make them binary—did you do it or not? These are YOUR standards, not generic templates."
          />
          
          <Step
            number="2"
            title="Set Your Goals (Optional)"
            description="Go to the Goals page and define 1-year goals for each pillar if it helps you maintain direction. These are reference points, not prescriptions. You can update them anytime."
          />
          
          <Step
            number="3"
            title="Log Daily"
            description="Every day, go to the Daily Log and honestly record your execution. Did you complete your physical activity? Avoid your negative habit? Complete your daily mission? Answer truthfully."
          />
          
          <Step
            number="4"
            title="Review Your Dashboard"
            description="Use the Dashboard to observe trends. Is your score rising, falling, or stagnant? Where are breakdowns occurring? What patterns are emerging? The data shows you the truth."
          />
          
          <Step
            number="5"
            title="Reflect Weekly"
            description="At the end of each week, go to the Weekly page and complete your reflection. This is where you diagnose what worked, what didn't, and what needs to change. Review your patterns and adjust."
          />
        </Section>

        {/* WHAT NOT TO DO */}
        <Section>
          <h2 style={sectionTitle}>What Not to Do</h2>
          
          <DontBox>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#e5e7eb' }}>
              <strong>Don't chase a perfect score.</strong> The score is a signal, not a target. 
              Trying to max it out defeats the purpose. You're measuring alignment, not performance.
            </p>
          </DontBox>

          <DontBox>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#e5e7eb' }}>
              <strong>Don't change your habits constantly.</strong> Give each habit at least 30 days 
              before deciding it's not working. Frequent changes undermine the longitudinal signal.
            </p>
          </DontBox>

          <DontBox>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#e5e7eb' }}>
              <strong>Don't lie to yourself.</strong> This system only works if you log honestly. 
              Inflating your inputs breaks the feedback loop and wastes your time.
            </p>
          </DontBox>

          <DontBox>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#e5e7eb' }}>
              <strong>Don't skip the weekly reflection.</strong> The daily logs give you data. 
              The weekly reflection gives you insight. Both are required for the system to work.
            </p>
          </DontBox>
        </Section>

        {/* WHAT TO EXPECT */}
        <Section>
          <h2 style={sectionTitle}>What to Expect</h2>
          <p style={paragraph}>
            In the first week, you'll likely experience inconsistency. Your score will fluctuate. 
            Some days will feel easy, others impossible. This is normal. You're establishing a baseline.
          </p>
          <p style={paragraph}>
            After 2-3 weeks, patterns will emerge. You'll notice which habits are hardest to maintain, 
            which days are weakest, and where your discipline breaks down first. The weekly reflections 
            will help you see these patterns clearly.
          </p>
          <p style={paragraph}>
            After 30 days, you'll have enough data to make informed adjustments. The score becomes 
            meaningful because you can compare it against your own history. Your goals become clearer 
            as you see what's actually moving the needle.
          </p>
          <p style={paragraph}>
            Long-term, Continuum becomes a historical record of your execution. Weeks turn into months. 
            Months turn into years. The system shows you, with evidence, whether you're becoming the 
            person you said you would.
          </p>
        </Section>

        {/* THE PAGES */}
        <Section>
          <h2 style={sectionTitle}>The Pages Explained</h2>
          
          <PageExplainer
            title="Habits"
            description="Define your daily standards once. These are the specific actions you'll track every single day across all three pillars."
          />

          <PageExplainer
            title="Goals"
            description="Set 1-year goals for each pillar. These give you direction and context for your daily habits. Optional but recommended."
          />

          <PageExplainer
            title="Daily Log"
            description="Your daily check-in. Answer honestly: did you execute today? This is where the discipline happens—showing up to log even when you failed."
          />

          <PageExplainer
            title="Dashboard"
            description="See your Sovereign Score, current streak, trajectory chart, and pillar performance. This is your command center—it shows you the truth at a glance."
          />

          <PageExplainer
            title="Weekly"
            description="Complete your weekly reflection. Review what worked, what broke down, what patterns emerged, and what needs to change. This is where insights happen."
          />

          <PageExplainer
            title="Guide"
            description="You're here now. Come back anytime you need a reminder of how the system works or what each page does."
          />
        </Section>

        {/* CTA */}
        <div style={{
          marginTop: 56,
          padding: 40,
          background: 'linear-gradient(135deg, #020617, #0f172a)',
          borderRadius: 16,
          border: '2px solid #22c55e40',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 22, marginBottom: 16, color: '#e5e7eb' }}>
            Ready to start tracking?
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: 28, fontSize: 15, maxWidth: 500, margin: '0 auto 28px' }}>
            If you haven't already, define your habits, set your goals, and log your first day.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link
              href="/habits"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                color: '#020617',
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              Define Habits
            </Link>
            <Link
              href="/daily"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'transparent',
                color: '#22c55e',
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 8,
                border: '2px solid #22c55e',
                textDecoration: 'none',
              }}
            >
              Log Today
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 56 }}>
      {children}
    </section>
  );
}

function PillarCard({ 
  title, 
  color, 
  description, 
  tracks 
}: { 
  title: string; 
  color: string; 
  description: string; 
  tracks: string[];
}) {
  return (
    <div style={{
      padding: 28,
      background: '#020617',
      borderRadius: 12,
      border: `2px solid ${color}30`,
      marginBottom: 20
    }}>
      <h3 style={{ 
        fontSize: 20, 
        marginBottom: 12, 
        color,
        borderLeft: `4px solid ${color}`,
        paddingLeft: 16
      }}>
        {title}
      </h3>
      <p style={{ 
        fontSize: 15, 
        lineHeight: 1.7, 
        color: '#94a3b8', 
        marginBottom: 20 
      }}>
        {description}
      </p>
      <div>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>
          What it tracks:
        </p>
        <ul style={{ 
          margin: 0, 
          paddingLeft: 20, 
          color: '#e5e7eb', 
          fontSize: 14, 
          lineHeight: 1.9 
        }}>
          {tracks.map((track, i) => (
            <li key={i}>{track}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Step({ 
  number, 
  title, 
  description 
}: { 
  number: string; 
  title: string; 
  description: string;
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 20,
      marginBottom: 24,
      padding: 24,
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 18,
        flexShrink: 0
      }}>
        {number}
      </div>
      <div>
        <h4 style={{ fontSize: 16, marginBottom: 6, color: '#e5e7eb' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function DontBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: 20,
      background: '#1e0a0a',
      border: '2px solid #ef444440',
      borderRadius: 10,
      marginBottom: 16
    }}>
      {children}
    </div>
  );
}

function PageExplainer({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={{
      padding: 20,
      background: '#020617',
      borderRadius: 10,
      border: '1px solid #334155',
      marginBottom: 16
    }}>
      <h4 style={{ 
        fontSize: 16, 
        marginBottom: 8, 
        color: '#22c55e',
        fontWeight: 600
      }}>
        {title}
      </h4>
      <p style={{ 
        margin: 0, 
        fontSize: 14, 
        color: '#94a3b8', 
        lineHeight: 1.7 
      }}>
        {description}
      </p>
    </div>
  );
}

/* ---------- Styles ---------- */

const sectionTitle = {
  fontSize: 26,
  marginBottom: 20,
  color: '#e5e7eb',
  fontWeight: 600
};

const paragraph = {
  fontSize: 15,
  lineHeight: 1.8,
  color: '#94a3b8',
  marginBottom: 20
};