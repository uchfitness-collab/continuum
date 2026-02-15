'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
      padding: 'clamp(60px, 10vw, 80px) clamp(16px, 4vw, 24px) clamp(80px, 12vw, 120px)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
{/* Header */}
<div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 64px)' }}>
  <h1 style={{ 
    fontSize: 'clamp(32px, 6vw, 48px)',
    fontWeight: 700, 
    marginBottom: 20,
    background: 'linear-gradient(135deg, #e5e7eb, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}>
    How Continuum Works
  </h1>

  <p style={{ 
    fontSize: 'clamp(16px, 3vw, 19px)',
    color: '#e5e7eb', 
    maxWidth: 700, 
    margin: '0 auto 16px',
    lineHeight: 1.7,
    padding: '0 16px',
  }}>
    Discipline is invisible — until you measure it.
  </p>

  <p style={{ 
    fontSize: 'clamp(14px, 3vw, 17px)',
    color: '#94a3b8', 
    maxWidth: 640, 
    margin: '0 auto',
    lineHeight: 1.7,
    padding: '0 16px',
  }}>
    Continuum turns daily execution into measurable proof. 
    No hype. No streak games. No social comparison. 
    Just evidence of who you are becoming.
  </p>
</div>

{/* How It Works in 4 Simple Steps */}
<section style={{ marginBottom: 'clamp(56px, 10vw, 72px)' }}>
  <h2 style={{ 
    fontSize: 'clamp(24px, 4vw, 32px)',
    marginBottom: 28, 
    textAlign: 'center',
    color: '#e5e7eb',
    fontWeight: 600
  }}>
    How It Works — In 4 Simple Steps
  </h2>

  <p style={{
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 'clamp(14px, 3vw, 16px)',
    marginBottom: 36,
    maxWidth: 700,
    margin: '0 auto 36px',
    padding: '0 16px',
  }}>
    The system never changes. The questions never change. 
    Only your execution does.
  </p>

  <div style={{ display: 'grid', gap: 20 }}>
    <DailyStep
      step="1"
      title="Define Your Standards"
      description="Set your Body, Mind, and Identity habits. Your rules. Your expectations. Your definition of execution."
    />
    
    <DailyStep
      step="2"
      title="Log Daily (2–3 Minutes)"
      description="Answer the same questions every day. Check the boxes. Rate yourself honestly. Truth creates useful data."
    />
    
    <DailyStep
      step="3"
      title="See Your Sovereign Score Update"
      description="Your score recalculates automatically, weighing today's execution against your history. One day doesn’t matter. Patterns do."
    />
    
    <DailyStep
      step="4"
      title="Repeat. Relentlessly."
      description="No streak resets. No gamification. Just daily logging. Discipline compounds quietly."
    />
  </div>

  <div style={{
    marginTop: 40,
    padding: 'clamp(24px, 5vw, 32px)',
    borderRadius: 16,
    background: '#020617',
    border: '1px solid #22c55e40',
    textAlign: 'center'
  }}>
    <h3 style={{ 
      fontSize: 'clamp(18px, 3vw, 20px)',
      marginBottom: 16, 
      color: '#22c55e',
      fontWeight: 600
    }}>
      Example Daily Log
    </h3>

    <p style={{ color: '#e5e7eb', marginBottom: 6 }}>
      Body: ✔ Workout · ✔ Nutrition · 25+ Reps
    </p>
    <p style={{ color: '#e5e7eb', marginBottom: 6 }}>
      Mind: ✔ Positive Habit · ✘ Avoided Negative Habit (Stress)
    </p>
    <p style={{ color: '#e5e7eb', marginBottom: 6 }}>
      Identity: ✔ Mission · ✔ Philosophy · Mood 8/10
    </p>
    <p style={{ color: '#fbbf24', fontWeight: 700, marginTop: 12 }}>
      Sovereign Score: 141.6
    </p>
  </div>
</section>

        {/* The Three Pillars */}
        <section style={{ marginBottom: 'clamp(56px, 10vw, 72px)' }}>
          <h2 style={{ 
            fontSize: 'clamp(24px, 4vw, 32px)',
            marginBottom: 32, 
            textAlign: 'center',
            color: '#e5e7eb',
            fontWeight: 600
          }}>
            What You'll Track Daily
          </h2>
          
          <p style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: 'clamp(14px, 3vw, 16px)',
            marginBottom: 36,
            maxWidth: 700,
            margin: '0 auto 36px',
            padding: '0 16px',
          }}>
            Every day, you answer the same questions across three areas. 
            These questions don't change. The routine doesn't change. 
            Only your answers — and your score — change.
          </p>

          <div style={{ display: 'grid', gap: 24 }}>
            <Pillar
              title="Body"
              color="#22c55e"
              icon="💪"
              description="Physical action creates momentum. When your body is disciplined, everything else gets easier."
              habits={[
                'Did you complete your physical activity today?',
                'Did you maintain your nutritional discipline?',
                'How many reps did you complete? (<10, 25+, or 50+)'
              ]}
            />
            
            <Pillar
              title="Mind"
              color="#3b82f6"
              icon="🧠"
              description="What you avoid is as important as what you do. Mental discipline is choosing discomfort when comfort is available."
              habits={[
                'Did you complete your positive habit today?',
                'Did you avoid your negative habit today?',
                'How disciplined were you overall? (Rate 1-10)'
              ]}
            />
            
            <Pillar
              title="Identity"
              color="#a855f7"
              icon="⚡"
              description="Identity is built through daily proof. This pillar measures the gap between who you say you are and what you actually do."
              habits={[
                'Did you complete your daily mission?',
                'Did you practice your philosophy today?',
                'How was your mood? (Rate 1-10)'
              ]}
            />
          </div>
        </section>

        {/* The Sovereign Score */}
        <section style={{ marginBottom: 'clamp(56px, 10vw, 72px)' }}>
          <h2 style={{ 
            fontSize: 'clamp(24px, 4vw, 32px)',
            marginBottom: 28, 
            textAlign: 'center',
            color: '#e5e7eb',
            fontWeight: 600
          }}>
            The Sovereign Score
          </h2>
          
          <div style={{
            background: '#020617',
            padding: 'clamp(24px, 5vw, 36px)',
            borderRadius: 16,
            border: '1px solid #334155',
            marginBottom: 28
          }}>
            <h3 style={{ 
              fontSize: 'clamp(18px, 3vw, 20px)',
              marginBottom: 16, 
              color: '#22c55e',
              fontWeight: 600
            }}>
              One number. Your entire trajectory.
            </h3>
            <p style={{ 
              color: '#e5e7eb', 
              fontSize: 'clamp(14px, 3vw, 16px)',
              lineHeight: 1.8,
              marginBottom: 20
            }}>
              Your Sovereign Score updates automatically after each log. 
              It reflects your consistency over time — a living measure of the gap between your standards and your actions.
            </p>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: 'clamp(13px, 3vw, 15px)',
              lineHeight: 1.7 
            }}>
              This means one perfect day won't inflate your score overnight, and one bad day 
              won't destroy your progress. What matters is the trend. Are you building or coasting? 
              The score tells you the truth.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <ScorePrinciple
              title="It rewards consistency, not perfection"
              description="You don't need perfect days. You need to show up consistently. The score reflects sustained discipline over time, not isolated performance."
            />
            
            <ScorePrinciple
              title="It shows you your trajectory, not just your day"
              description="Is the line going up, down, or flat? That's all you need to know. The score gives you a signal you can't argue with."
            />
            
            <ScorePrinciple
              title="It's private and self-referenced"
              description="Your score isn't compared to anyone else. This isn't a competition. It's a measure of your own standards and how well you're holding them."
            />
          </div>
        </section>

        {/* What Makes This Different */}
        <section style={{ marginBottom: 'clamp(56px, 10vw, 72px)' }}>
          <h2 style={{ 
            fontSize: 'clamp(24px, 4vw, 32px)',
            marginBottom: 32, 
            textAlign: 'center',
            color: '#e5e7eb',
            fontWeight: 600
          }}>
            What Makes This Different
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24
          }}>
            <Principle
              title="No Gamification"
              description="No badges. No streaks that reset to zero. No points. Just a score that compounds and shows you the truth about your discipline."
            />
            
            <Principle
              title="No Motivation"
              description="We don't send you inspirational quotes. We don't coach you. We don't tell you what to do. We measure what you actually do."
            />
            
            <Principle
              title="No Social Features"
              description="No followers. No likes. No leaderboards. This is between you and your standards. No one else needs to see it."
            />
            
            <Principle
              title="No Prescriptions"
              description="You define your own habits. Your workout. Your mission. Your philosophy. These are your standards, not ours."
            />
            
            <Principle
              title="No Complexity"
              description="Same questions. Same routine. Same system. Every single day. The simplicity is the point. Complexity is an excuse to quit."
            />
            
            <Principle
              title="No Forgiveness"
              description="The data shows what you did, not what you meant to do. If you didn't execute, the score reflects that. Truth over comfort."
            />
          </div>
        </section>

        {/* The Daily Habit */}
        <section style={{ marginBottom: 'clamp(56px, 10vw, 72px)' }}>
          <div style={{
            background: 'linear-gradient(135deg, #020617, #0f172a)',
            padding: 'clamp(28px, 6vw, 40px)',
            borderRadius: 16,
            border: '2px solid #22c55e30',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(22px, 4vw, 28px)',
              marginBottom: 20,
              color: '#e5e7eb',
              fontWeight: 600
            }}>
              The Only Habit That Matters
            </h2>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: 'clamp(15px, 3vw, 17px)',
              lineHeight: 1.8,
              maxWidth: 700,
              margin: '0 auto 24px',
              padding: '0 16px',
            }}>
              You can have perfect Body discipline. You can nail your Mind habits. 
              You can execute flawlessly on Identity. But if you don't log it, the system 
              doesn't work.
            </p>
            <p style={{ 
              color: '#e5e7eb', 
              fontSize: 'clamp(14px, 3vw, 16px)',
              lineHeight: 1.7,
              fontWeight: 600
            }}>
              The meta-habit is logging itself. Show up daily. Record the truth. 
              That's where discipline lives.
            </p>
          </div>
        </section>

        {/* What Happens Over Time */}
        <section style={{ marginBottom: 'clamp(56px, 10vw, 72px)' }}>
          <h2 style={{ 
            fontSize: 'clamp(24px, 4vw, 32px)',
            marginBottom: 32, 
            textAlign: 'center',
            color: '#e5e7eb',
            fontWeight: 600
          }}>
            What Happens Over Time
          </h2>

          <div style={{ display: 'grid', gap: 24 }}>
            <TimelineItem
              phase="Week 1"
              title="Establishing baseline"
              description="Your first week establishes your starting point. The score will fluctuate as you figure out your rhythm. Don't judge yourself yet — you're just collecting data."
            />

            <TimelineItem
              phase="Week 2-4"
              title="Patterns emerge"
              description="You start to see which days are hardest. Which pillar you neglect. Which excuses you repeat. The data becomes a mirror. This is where most people quit — when the truth gets uncomfortable."
            />

            <TimelineItem
              phase="Month 2-3"
              title="Consistency builds"
              description="The score stabilizes. You've figured out your standards. The daily log becomes routine. You stop thinking about it — you just do it. This is where discipline becomes identity."
            />

            <TimelineItem
              phase="Month 4+"
              title="Evidence compounds"
              description="You have months of data. The trend line tells a story you can't argue with. You see exactly who you've been. The score isn't motivating you anymore — it's just measuring reality."
            />
          </div>
        </section>

        {/* Final CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'clamp(60px, 10vw, 80px)',
          padding: 'clamp(32px, 6vw, 48px)',
          background: 'linear-gradient(135deg, #020617, #0f172a)',
          borderRadius: 16,
          border: '2px solid #22c55e30'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(28px, 5vw, 36px)',
            marginBottom: 20,
            fontWeight: 700,
            color: '#e5e7eb'
          }}>
            Start Tracking Today
          </h2>
          <p style={{ 
            color: '#94a3b8', 
            marginBottom: 36, 
            fontSize: 'clamp(15px, 3vw, 17px)',
            lineHeight: 1.6,
            maxWidth: 560,
            margin: '0 auto 36px',
            padding: '0 16px',
          }}>
            Define your standards. Log your execution. Watch your discipline compound. 
            It's that simple.
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
            Get Started Now
          </Link>
          
          <p style={{ marginTop: 24, color: '#64748b', fontSize: 14 }}>
            Already tracking?{' '}
            <Link href="/login" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>
              Log in
            </Link>
          </p>

          <p style={{ marginTop: 20, fontSize: 14, color: '#64748b' }}>
            $12/month · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Pillar({
  title,
  color,
  icon,
  description,
  habits
}: {
  title: string;
  color: string;
  icon: string;
  description: string;
  habits: string[];
}) {
  return (
    <div style={{
      padding: 'clamp(20px, 4vw, 28px)',
      background: '#020617',
      borderRadius: 16,
      border: `2px solid ${color}40`,
    }}>
      <div style={{ 
        fontSize: 'clamp(28px, 5vw, 32px)',
        marginBottom: 12 
      }}>
        {icon}
      </div>
      <h3 style={{ 
        color, 
        fontSize: 'clamp(20px, 4vw, 24px)',
        marginBottom: 12,
        fontWeight: 600
      }}>
        {title}
      </h3>
      <p style={{ 
        color: '#94a3b8', 
        marginBottom: 20, 
        fontSize: 'clamp(13px, 3vw, 15px)',
        lineHeight: 1.7
      }}>
        {description}
      </p>
      <div style={{
        paddingTop: 20,
        borderTop: '1px solid #334155'
      }}>
        <p style={{ 
          fontSize: 13, 
          color: '#64748b', 
          marginBottom: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Daily Questions:
        </p>
        <ul style={{ 
          color: '#e5e7eb', 
          fontSize: 'clamp(13px, 3vw, 14px)',
          lineHeight: 2, 
          paddingLeft: 20,
          margin: 0
        }}>
          {habits.map((habit, i) => (
            <li key={i}>{habit}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DailyStep({
  step,
  title,
  description
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 'clamp(16px, 3vw, 20px)',
      padding: 'clamp(16px, 4vw, 24px)',
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <div style={{
        width: 'clamp(40px, 8vw, 48px)',
        height: 'clamp(40px, 8vw, 48px)',
        borderRadius: 10,
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 'clamp(16px, 3vw, 20px)',
        flexShrink: 0
      }}>
        {step}
      </div>
      <div>
        <h3 style={{ 
          fontSize: 'clamp(15px, 3vw, 17px)',
          marginBottom: 6,
          color: '#e5e7eb',
          fontWeight: 600
        }}>
          {title}
        </h3>
        <p style={{ 
          color: '#94a3b8', 
          fontSize: 'clamp(13px, 3vw, 15px)',
          lineHeight: 1.7,
          margin: 0
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function Principle({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={{
      padding: 'clamp(20px, 4vw, 24px)',
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <h3 style={{ 
        fontSize: 'clamp(16px, 3vw, 18px)',
        marginBottom: 10, 
        color: '#22c55e',
        fontWeight: 600
      }}>
        {title}
      </h3>
      <p style={{ 
        color: '#94a3b8', 
        fontSize: 'clamp(13px, 3vw, 14px)',
        lineHeight: 1.7,
        margin: 0
      }}>
        {description}
      </p>
    </div>
  );
}

function ScorePrinciple({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div style={{
      padding: 'clamp(16px, 4vw, 20px)',
      background: '#020617',
      borderRadius: 10,
      border: '1px solid #22c55e30',
      borderLeft: '4px solid #22c55e'
    }}>
      <h4 style={{ 
        fontSize: 'clamp(14px, 3vw, 16px)',
        marginBottom: 8, 
        color: '#e5e7eb',
        fontWeight: 600
      }}>
        {title}
      </h4>
      <p style={{ 
        color: '#94a3b8', 
        fontSize: 'clamp(13px, 3vw, 14px)',
        lineHeight: 1.7,
        margin: 0
      }}>
        {description}
      </p>
    </div>
  );
}

function TimelineItem({
  phase,
  title,
  description
}: {
  phase: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{
      padding: 'clamp(20px, 4vw, 24px)',
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <div style={{ 
        fontSize: 13, 
        color: '#22c55e', 
        marginBottom: 8,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {phase}
      </div>
      <h3 style={{ 
        fontSize: 'clamp(16px, 3vw, 18px)',
        marginBottom: 10, 
        color: '#e5e7eb',
        fontWeight: 600
      }}>
        {title}
      </h3>
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