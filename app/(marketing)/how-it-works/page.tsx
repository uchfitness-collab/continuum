'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 style={{ fontSize: 42, fontWeight: 700, marginBottom: 16 }}>
            How Continuum Works
          </h1>
          <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto' }}>
            Your personal operating system for building discipline through daily action.
          </p>
        </div>

        {/* The Daily Practice */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>
            The Daily Practice
          </h2>
          
          <div style={{
            background: '#020617',
            padding: 32,
            borderRadius: 16,
            border: '1px solid #22c55e',
            marginBottom: 32
          }}>
            <h3 style={{ fontSize: 22, marginBottom: 16, color: '#22c55e' }}>
              Discipline is doing it every day
            </h3>
            <p style={{ color: '#e5e7eb', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              Continuum works because you show up daily. The act of logging itself is discipline — 
              committing to track your actions honestly, day after day, regardless of how you performed.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>
              Most people fail not because they have a bad day, but because they stop tracking after a bad day. 
              Continuum rewards consistency over perfection. Log the truth, even when it's uncomfortable. 
              That's where growth happens.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <DailyStep
              step="1"
              title="Log in every day"
              description="Make it part of your routine. Morning, evening — pick a time and stick to it. The discipline is in the repetition."
            />
            
            <DailyStep
              step="2"
              title="Answer honestly (takes less than 3 minutes)"
              description="Check the boxes. Rate yourself. Don't overthink it. The system works when you're truthful, not when you're perfect."
            />
            
            <DailyStep
              step="3"
              title="See your score and move on"
              description="Your score updates automatically. Watch it compound over time. One day doesn't define you — the pattern does."
            />
            
            <DailyStep
              step="4"
              title="Come back tomorrow"
              description="The power is in repetition. Show up again. And again. That's how identity shifts — through proof, not promises."
            />
          </div>
        </section>

        {/* The Three Pillars */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>
            The Three Pillars
          </h2>
          
          <div style={{ display: 'grid', gap: 24 }}>
            <Pillar
              title="Body"
              color="#22c55e"
              description="Physical action creates momentum. Track your workouts, nutrition discipline, and daily reps."
              habits={[
                'Did you complete your physical activity?',
                'Did you maintain your nutritional standard?',
                'How many reps did you do today?'
              ]}
            />
            
            <Pillar
              title="Mind"
              color="#3b82f6"
              description="What you avoid matters as much as what you do. Track discipline, habit replacement, and mental control."
              habits={[
                'Did you complete your positive habit?',
                'Did you avoid your negative habit?',
                'How disciplined were you today? (1-10)'
              ]}
            />
            
            <Pillar
              title="Identity"
              color="#a855f7"
              description="Identity is built through proof. Align who you say you are with what you do daily."
              habits={[
                'Did you complete your daily mission?',
                'Did you practice your philosophy?',
                'How was your mood today? (1-10)'
              ]}
            />
          </div>
        </section>

        {/* What You Track */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>
            What You'll Track
          </h2>
          
          <div style={{
            background: '#020617',
            padding: 32,
            borderRadius: 16,
            border: '1px solid #334155'
          }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, marginBottom: 12, color: '#22c55e' }}>You define your standards</h3>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>
                Continuum isn't a generic habit tracker. You set your own physical activity, your own nutritional 
                discipline, your own daily mission. These are YOUR standards, not someone else's template.
              </p>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, marginBottom: 12, color: '#3b82f6' }}>Log daily</h3>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>
                Every day, you'll answer simple yes/no questions and rate yourself on a scale. 
                It takes less than 3 minutes. The key is doing it every single day.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 12, color: '#a855f7' }}>Watch your score compound</h3>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>
                Your Sovereign Score tracks your consistency over time. Good days build momentum. 
                Bad days don't erase your progress. The score rewards sustained discipline, not perfection.
              </p>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>
            Core Principles
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            <Principle
              title="Truth Over Comfort"
              description="Log honestly. Gaming the system only games yourself. The discomfort of truth is where growth begins."
            />
            
            <Principle
              title="Consistency Compounds"
              description="Show up daily. Perfect days don't build discipline — repetition does. One day won't make you, but skipping will break you."
            />
            
            <Principle
              title="Identity Through Action"
              description="You become who you consistently prove yourself to be. Track the proof. The score follows."
            />
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <Link
            href="/signup"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              color: '#020617',
              fontWeight: 600,
              fontSize: 18,
              borderRadius: 12,
              textDecoration: 'none',
            }}
          >
            Start Tracking Today
          </Link>
          
          <p style={{ marginTop: 16, color: '#94a3b8', fontSize: 14 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#22c55e', textDecoration: 'none' }}>
              Log in
            </Link>
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
  description,
  habits
}: {
  title: string;
  color: string;
  description: string;
  habits: string[];
}) {
  return (
    <div style={{
      padding: 24,
      background: '#020617',
      borderRadius: 16,
      border: `1px solid ${color}55`,
    }}>
      <h3 style={{ color, fontSize: 22, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: '#94a3b8', marginBottom: 16, fontSize: 14 }}>
        {description}
      </p>
      <ul style={{ color: '#e5e7eb', fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
        {habits.map((habit, i) => (
          <li key={i} style={{ marginBottom: 8 }}>{habit}</li>
        ))}
      </ul>
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
      gap: 16,
      padding: 20,
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 18,
        flexShrink: 0
      }}>
        {step}
      </div>
      <div>
        <h3 style={{ fontSize: 16, marginBottom: 4 }}>{title}</h3>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>{description}</p>
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
      padding: 24,
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <h3 style={{ fontSize: 18, marginBottom: 8, color: '#22c55e' }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: 14 }}>{description}</p>
    </div>
  );
}