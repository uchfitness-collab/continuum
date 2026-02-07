'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GuidePage() {
  const router = useRouter();
  const [showGoals, setShowGoals] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 12 }}>
            How to Use Continuum
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            A complete guide to setting up your habits and tracking your discipline.
          </p>
        </div>

        {/* SECTION NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 40,
          flexWrap: 'wrap'
        }}>
          <NavButton 
            label="Setting Up Habits" 
            onClick={() => setShowGoals(false)}
            active={!showGoals}
          />
          <NavButton 
            label="Your 1-Year Goals" 
            onClick={() => setShowGoals(true)}
            active={showGoals}
          />
        </div>

        {!showGoals ? (
          /* HABITS GUIDE */
          <>
            {/* INTRO */}
            <Section>
              <h2 style={sectionTitle}>The Habit Definitions Page</h2>
              <p style={paragraph}>
                Before you can track your discipline, you need to define your standards. 
                The <strong>Habits</strong> page is where you set the specific actions you'll 
                be judged by daily.
              </p>
              <p style={paragraph}>
                These aren't generic templates. These are <em>your</em> standards. 
                What you define here becomes what you track every single day.
              </p>
              <ActionBox>
                <p style={{ margin: 0, fontSize: 14 }}>
                  💡 <strong>Pro tip:</strong> Start with habits you can realistically do daily. 
                  It's better to consistently hit a small target than sporadically hit a big one.
                </p>
              </ActionBox>
            </Section>

            {/* BODY PILLAR */}
            <Section>
              <PillarHeader title="Body Pillar" color="#22c55e" />
              <p style={paragraph}>
                Physical action creates momentum. Your Body pillar should track movement, 
                nutrition discipline, and daily physical output.
              </p>

              <HabitExample
                title="Physical Activity"
                question="What physical activity will you do daily?"
                examples={[
                  "Gym workout (weights or cardio)",
                  "10,000 steps",
                  "30-minute run",
                  "Yoga or stretching session",
                  "Sports practice (basketball, soccer, etc.)",
                  "Home workout (bodyweight exercises)"
                ]}
                tips="Be specific. 'Gym workout' is better than 'exercise.' Make it binary: did you do it or not?"
              />

              <HabitExample
                title="Nutritional Discipline"
                question="What will you avoid or maintain daily?"
                examples={[
                  "Avoid candy and sweets",
                  "No soda or sugary drinks",
                  "Avoid fast food",
                  "No alcohol",
                  "Avoid late-night eating (after 8pm)",
                  "No junk food/processed snacks"
                ]}
                tips="Pick ONE thing to avoid. Don't try to fix your entire diet at once. What's the biggest weakness right now?"
              />

              <HabitExample
                title="Daily Reps"
                question="What reps will you complete daily?"
                examples={[
                  "Push-ups",
                  "Squats",
                  "Pull-ups",
                  "Burpees",
                  "Sit-ups",
                  "Jumping jacks"
                ]}
                tips="Choose something you can do anywhere, anytime. No excuses. Track quantity: <10, 25+, or 50+."
              />
            </Section>

            {/* MIND PILLAR */}
            <Section>
              <PillarHeader title="Mind Pillar" color="#3b82f6" />
              <p style={paragraph}>
                What you avoid matters as much as what you do. The Mind pillar tracks discipline, 
                habit replacement, and mental control.
              </p>

              <HabitExample
                title="Negative Habit to Avoid"
                question="What habit are you eliminating?"
                examples={[
                  "Social media scrolling (or limit to 2 hours max)",
                  "Watching pornography",
                  "Playing video games excessively",
                  "Watching TV/Netflix binges",
                  "Doom scrolling news",
                  "Negative self-talk or complaining"
                ]}
                tips="Be honest. What's your biggest time-waster or mental drain? This is the habit you're removing."
              />

              <HabitExample
                title="Positive Habit to Build"
                question="What are you replacing it with?"
                examples={[
                  "Read for 5-30 minutes",
                  "Learn a new skill (language, instrument, coding)",
                  "Work on a creative project",
                  "Call a friend or family member",
                  "Play chess or strategic games",
                  "Listen to educational podcast"
                ]}
                tips="This replaces your negative habit. When you feel the urge to scroll, you do THIS instead."
              />
            </Section>

            {/* IDENTITY PILLAR */}
            <Section>
              <PillarHeader title="Identity Pillar" color="#a855f7" />
              <p style={paragraph}>
                Identity is built through proof. This pillar tracks alignment between who you 
                say you are and what you actually do daily.
              </p>

              <HabitExample
                title="Daily Mission"
                question="What ONE thing moves you toward your future self?"
                examples={[
                  "Work on side business for 30 minutes",
                  "Practice instrument for 15 minutes",
                  "Write 500 words",
                  "Study/learn for 30 minutes",
                  "Network or reach out to 1 person",
                  "Build your product for 1 hour"
                ]}
                tips="This is your MOST important habit. It's the thing that, if you did it every day for a year, would completely change your life."
              />

              <HabitExample
                title="Philosophy Practice"
                question="What daily practice grounds you?"
                examples={[
                  "Journaling (morning or evening)",
                  "Meditation (5-20 minutes)",
                  "Gratitude practice (write 3 things)",
                  "Prayer or spiritual practice",
                  "Reading philosophy or scripture",
                  "Evening reflection on the day"
                ]}
                tips="This is your anchor. It's how you stay connected to your values and process your day."
              />
            </Section>

            {/* HOW TO FILL IT OUT */}
            <Section>
              <h2 style={sectionTitle}>How to Fill Out Your Habits Page</h2>
              <StepGuide
                step="1"
                title="Go to the Habits page"
                description="Click 'Habits' in the navigation at the top of the screen."
              />
              <StepGuide
                step="2"
                title="Define each habit clearly"
                description="Use the examples above. Be specific. Make it measurable. Can you answer 'yes' or 'no' at the end of the day?"
              />
              <StepGuide
                step="3"
                title="Save your habits"
                description="Once saved, these become your daily standards. You'll track them every single day in the Daily Log."
              />
              <StepGuide
                step="4"
                title="Update as needed"
                description="Your habits can evolve. If something isn't working, change it. But don't change them constantly—give each habit at least 30 days."
              />
            </Section>

            {/* CTA */}
            <div style={{
              marginTop: 48,
              padding: 32,
              background: '#020617',
              borderRadius: 12,
              border: '1px solid #22c55e',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>Ready to define your standards?</h3>
              <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14 }}>
                Go to the Habits page and set up your daily tracking.
              </p>
              <Link
                href="/habits"
                style={{
                  display: 'inline-block',
                  padding: '12px 28px',
                  background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                  color: '#020617',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                Set Up Habits
              </Link>
            </div>
          </>
        ) : (
          /* GOALS SECTION */
          <>
            <Section>
              <h2 style={sectionTitle}>Your 1-Year Vision</h2>
              <p style={paragraph}>
                Discipline without direction is just motion. Before you start tracking daily habits, 
                define where you're going.
              </p>
              <p style={paragraph}>
                What do you want to achieve in the next 12 months? Not vague wishes—specific, 
                measurable outcomes.
              </p>
            </Section>

            <GoalSection
              pillar="Body"
              color="#22c55e"
              icon="💪"
              prompt="What does your body look, feel, and perform like in 1 year?"
              examples={[
                "Lose 30 pounds and maintain 15% body fat",
                "Run a half-marathon under 2 hours",
                "Bench press 225 lbs for 5 reps",
                "Complete 100 consecutive push-ups",
                "Have visible abs and defined muscle tone",
                "Consistently sleep 7-8 hours per night"
              ]}
            />

            <GoalSection
              pillar="Mind"
              color="#3b82f6"
              icon="🧠"
              prompt="What mental habits and skills do you want to build?"
              examples={[
                "Read 24 books (2 per month)",
                "Eliminate social media addiction completely",
                "Learn conversational Spanish",
                "Complete an online course in data science",
                "Meditate daily for 365 consecutive days",
                "Build deep focus—2 hours of uninterrupted work daily"
              ]}
            />

            <GoalSection
              pillar="Identity"
              color="#a855f7"
              icon="⚡"
              prompt="Who are you becoming? What will you have built?"
              examples={[
                "Launch profitable side business ($5k/month revenue)",
                "Publish 52 blog posts or essays",
                "Build and ship 3 software products",
                "Network with 100 new people in my industry",
                "Become a certified yoga instructor",
                "Write and self-publish a book"
              ]}
            />

            <Section>
              <h2 style={sectionTitle}>How to Use Your Goals</h2>
              <p style={paragraph}>
                Your goals aren't tasks. They're <strong>outcomes</strong>. Your daily habits 
                are the inputs that produce these outcomes.
              </p>
              <div style={{
                padding: 24,
                background: '#020617',
                borderRadius: 12,
                border: '1px solid #334155',
                marginTop: 20
              }}>
                <h4 style={{ fontSize: 16, marginBottom: 12, color: '#22c55e' }}>
                  Example: Connecting Goals to Habits
                </h4>
                <p style={{ ...paragraph, fontSize: 14, lineHeight: 1.7 }}>
                  <strong>Goal:</strong> "Launch profitable side business ($5k/month revenue)"<br/>
                  <strong>Daily Mission:</strong> "Work on business for 1 hour minimum"<br/>
                  <strong>Why it works:</strong> 365 hours of focused work compounds into a real business.
                </p>
              </div>
              <p style={{ ...paragraph, marginTop: 20 }}>
                Every day you complete your habits, you're voting for the person who achieves these goals. 
                Continuum tracks the votes.
              </p>
            </Section>

            {/* Goals CTA */}
            <div style={{
              marginTop: 48,
              padding: 32,
              background: '#020617',
              borderRadius: 12,
              border: '1px solid #a855f7',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>Start tracking toward your vision</h3>
              <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 14 }}>
                Define your habits and log your first day.
              </p>
              <Link
                href="/daily"
                style={{
                  display: 'inline-block',
                  padding: '12px 28px',
                  background: 'linear-gradient(180deg, #a855f7, #9333ea)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 8,
                  textDecoration: 'none',
                }}
              >
                Log Today's Habits
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function NavButton({ 
  label, 
  onClick, 
  active 
}: { 
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        border: active ? '2px solid #22c55e' : '1px solid #334155',
        background: active ? '#22c55e15' : 'transparent',
        color: active ? '#22c55e' : '#94a3b8',
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      {children}
    </section>
  );
}

function PillarHeader({ title, color }: { title: string; color: string }) {
  return (
    <h2 style={{
      fontSize: 24,
      marginBottom: 16,
      color,
      borderLeft: `4px solid ${color}`,
      paddingLeft: 16
    }}>
      {title}
    </h2>
  );
}

function HabitExample({
  title,
  question,
  examples,
  tips
}: {
  title: string;
  question: string;
  examples: string[];
  tips: string;
}) {
  return (
    <div style={{
      padding: 24,
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155',
      marginBottom: 20
    }}>
      <h4 style={{ fontSize: 16, marginBottom: 8, color: '#e5e7eb' }}>{title}</h4>
      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, fontStyle: 'italic' }}>
        {question}
      </p>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>Examples:</p>
        <ul style={{ margin: 0, paddingLeft: 20, color: '#e5e7eb', fontSize: 14, lineHeight: 1.8 }}>
          {examples.map((ex, i) => (
            <li key={i}>{ex}</li>
          ))}
        </ul>
      </div>
      <div style={{
        padding: 12,
        background: '#01030f',
        borderRadius: 8,
        borderLeft: '3px solid #22c55e'
      }}>
        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
          💡 {tips}
        </p>
      </div>
    </div>
  );
}

function StepGuide({
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
      marginBottom: 20,
      padding: 20,
      background: '#020617',
      borderRadius: 12,
      border: '1px solid #334155'
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 16,
        flexShrink: 0
      }}>
        {step}
      </div>
      <div>
        <h4 style={{ fontSize: 15, marginBottom: 4, color: '#e5e7eb' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{description}</p>
      </div>
    </div>
  );
}

function GoalSection({
  pillar,
  color,
  icon,
  prompt,
  examples
}: {
  pillar: string;
  color: string;
  icon: string;
  prompt: string;
  examples: string[];
}) {
  return (
    <Section>
      <div style={{
        padding: 28,
        background: '#020617',
        borderRadius: 16,
        border: `2px solid ${color}40`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 32 }}>{icon}</div>
          <h3 style={{ fontSize: 22, color, margin: 0 }}>{pillar} Goal</h3>
        </div>
        
        <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 20, fontStyle: 'italic' }}>
          {prompt}
        </p>

        <div>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10, fontWeight: 600 }}>
            Example Goals:
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#e5e7eb', fontSize: 14, lineHeight: 2 }}>
            {examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function ActionBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: 16,
      background: '#022c22',
      border: '1px solid #22c55e',
      borderRadius: 10,
      marginTop: 16,
      color: '#e5e7eb'
    }}>
      {children}
    </div>
  );
}

/* ---------- Styles ---------- */

const sectionTitle = {
  fontSize: 26,
  marginBottom: 16,
  color: '#e5e7eb'
};

const paragraph = {
  fontSize: 15,
  lineHeight: 1.8,
  color: '#94a3b8',
  marginBottom: 16
};