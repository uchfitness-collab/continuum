'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
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
          opacity: 0.08,
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
          maxWidth: 900,
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
            background: 'linear-gradient(135deg, #e5e7eb, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            padding: '0 16px',
          }}>
            Frequently Asked Questions
          </h1>

          <p style={{ 
            fontSize: 'clamp(16px, 3vw, 18px)',
            lineHeight: 1.7, 
            maxWidth: 680, 
            margin: '0 auto',
            color: '#94a3b8',
            padding: '0 16px',
          }}>
            Everything you need to know about using Continuum.
          </p>
        </div>

        {/* CATEGORIES */}
        <Category title="Getting Started" icon="🚀" color="#22c55e">
          <Question question="What happens after I sign up?">
            <p>
              After signing up, you'll verify your email through Supabase authentication. 
              Once verified, log in and you'll be taken directly to your dashboard. From there:
            </p>
            <ol style={{ marginLeft: 24, marginTop: 12, lineHeight: 1.8 }}>
              <li>Go to the <strong>Goals</strong> page and set your 1-year vision</li>
              <li>Go to the <strong>Habits</strong> page and define your daily tracking system</li>
              <li>Return to <strong>Daily Log</strong> and record your first day</li>
            </ol>
            <p style={{ marginTop: 12 }}>
              The whole setup takes about 10-15 minutes. Don't skip it — your goals and habits 
              are the foundation of everything.
            </p>
          </Question>

          <Question question="What should I do first?">
            <p>
              <strong>Step 1:</strong> Set your 1-year goals on the Goals page. Define where you're going.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>Step 2:</strong> Define your daily habits on the Habits page. These should directly 
              support your 1-year goals.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>Step 3:</strong> Log your first day. Check off what you did, rate your discipline and mood, 
              and hit submit.
            </p>
            <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14 }}>
              Check out the <Link href="/how-to-use" style={{ color: '#22c55e', textDecoration: 'underline' }}>How to Use</Link> page 
              for a detailed walkthrough.
            </p>
          </Question>

          <Question question="Do I need to set goals before tracking?">
            <p>
              <strong>Technically no, but practically yes.</strong> You can skip straight to daily tracking, 
              but without goals, you're just logging random activities. Your habits should move you toward 
              specific outcomes.
            </p>
            <p style={{ marginTop: 12 }}>
              If your goal is "lose 30 lbs," your Body habits should be "hit the gym 4x/week" and "no sugar." 
              If they don't connect, the tracking is pointless. Goals give your data meaning.
            </p>
          </Question>

          <Question question="What are the three pillars (Body, Mind, Identity)?">
            <p><strong>Body 💪:</strong> Physical execution. Did you move? Maintain discipline with food? Complete your reps?</p>
            <p style={{ marginTop: 8 }}><strong>Mind 🧠:</strong> Mental discipline. Did you complete your positive habit? Avoid the negative one?</p>
            <p style={{ marginTop: 8 }}><strong>Identity ⚡:</strong> Who you're becoming. Did you work on your mission? Practice your philosophy?</p>
            <p style={{ marginTop: 12 }}>
              Each pillar is worth 50 points per day. Max daily score = 150 points. The three pillars combine 
              into your <strong>Sovereign Score</strong>, which tracks your consistency over time.
            </p>
          </Question>

          <Question question="How long does it take to set everything up?">
            <p>
              <strong>10-15 minutes total.</strong> Here's the breakdown:
            </p>
            <ul style={{ marginLeft: 24, marginTop: 12, lineHeight: 1.8 }}>
              <li>1-Year Goals: 5 minutes</li>
              <li>Daily Habits: 5 minutes</li>
              <li>First Daily Log: 2-3 minutes</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Once you're set up, daily logging takes 2-3 minutes before bed. That's it.
            </p>
          </Question>
        </Category>

        <Category title="Daily Logging" icon="📝" color="#3b82f6">
          <Question question="When should I log my day?">
            <p>
              <strong>Every night before bed.</strong> Your memory is fresh, and you can capture the truth 
              while it's still clear. Don't wait until the next morning — you'll forget details or rationalize 
              failures.
            </p>
            <p style={{ marginTop: 12 }}>
              The act of logging before bed is itself an act of discipline. It forces honesty.
            </p>
          </Question>

          <Question question="What time does the daily log reset?">
            <p>
              <strong>12:01 AM EST (Eastern Standard Time).</strong> Once the clock hits midnight EST, 
              the log locks and you can't edit it. A new log opens for the next day.
            </p>
            <p style={{ marginTop: 12 }}>
              This is intentional. The lock prevents you from going back and gaming the system. 
              What's done is done. Move forward.
            </p>
          </Question>

          <Question question="Can I edit yesterday's log if I forgot something?">
            <p>
              <strong>No.</strong> Once the log locks at 12:01 AM EST, it's permanent. You can't go back 
              and change it.
            </p>
            <p style={{ marginTop: 12 }}>
              This is by design. If you could edit past logs, you'd inflate your score and lie to yourself. 
              The whole point is honest measurement. If you forgot to log, that's a lesson: log before bed, 
              not in the morning.
            </p>
          </Question>

          <Question question="What's a rest day and when should I use it?">
            <p>
              A <strong>rest day</strong> gives you a score of 100 (below the 110 baseline) and maintains 
              your streak. Use it when you're legitimately recovering — sickness, injury, or planned recovery.
            </p>
            <p style={{ marginTop: 12, color: '#fbbf24' }}>
              <strong>Don't abuse it.</strong> Rest days should be rare. If you're logging rest days 2-3 times 
              per week, you're not disciplined — you're coasting. Use them sparingly.
            </p>
          </Question>

          <Question question="What if I miss a day?">
            <p>
              <strong>Your streak breaks, but your Sovereign Score doesn't reset.</strong> The score is a 
              weighted average, so one missed day won't destroy your progress. It'll pull your score down slightly, 
              but you can recover.
            </p>
            <p style={{ marginTop: 12 }}>
              Missing a day isn't the end. What matters is: do you come back the next day, or do you spiral? 
              The system rewards comebacks.
            </p>
          </Question>
        </Category>

        <Category title="Scoring System" icon="📊" color="#a855f7">
          <Question question="How does the Sovereign Score work?">
            <p>
              The Sovereign Score is a <strong>weighted average</strong> that rewards consistency:
            </p>
            <p style={{ marginTop: 12, marginLeft: 24 }}>
              <strong>70% yesterday's score + 30% today's score</strong>
            </p>
            <p style={{ marginTop: 12 }}>
              This means one perfect day won't spike your score overnight, and one bad day won't destroy it. 
              The score compounds slowly over weeks and months. Consistency is what moves the needle.
            </p>
          </Question>

          <Question question="What's a good score?">
            <p>
              <strong>110-130 = Solid.</strong> You're executing consistently above baseline.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>130-140 = Great.</strong> You're disciplined and building momentum.
            </p>
            <p style={{ marginTop: 8 }}>
              <strong>140+ = Exceptional.</strong> You're operating at a very high level.
            </p>
            <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14 }}>
              Don't chase perfection. A score of 120 sustained for 90 days is better than spiking to 145 
              for a week and crashing. Focus on the trend, not individual days.
            </p>
          </Question>

          <Question question="Why is my score not changing much?">
            <p>
              Because it's designed that way. The weighted average (70% history + 30% today) means the score 
              moves slowly. This is a feature, not a bug.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If your score is flat for 2+ weeks:</strong> Your habits aren't challenging enough. 
              Increase the difficulty. What used to be hard should eventually become easy.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>If your score is dropping:</strong> You're coasting. Review your dashboard, identify 
              patterns, and course-correct.
            </p>
          </Question>

          <Question question="What's the baseline score (110)?">
            <p>
              <strong>110 is the target baseline.</strong> It represents consistent execution across all three 
              pillars without being perfect. If you're hitting most of your habits most days, you'll hover 
              around 110-120.
            </p>
            <p style={{ marginTop: 12 }}>
              Below 110 = You're slipping. Above 110 = You're building. The baseline gives you a reference point 
              to know if you're on track.
            </p>
          </Question>

          <Question question="How are points calculated for each pillar?">
            <p style={{ marginBottom: 12 }}>
              <strong>Body (50 pts max):</strong>
            </p>
            <ul style={{ marginLeft: 24, lineHeight: 1.8, fontSize: 14 }}>
              <li>Physical activity completed = 20 pts</li>
              <li>Nutritional discipline maintained = 20 pts</li>
              <li>Daily reps: Below 10 = -5 pts | 25+ = +5 pts | 50+ = +10 pts</li>
            </ul>

            <p style={{ marginBottom: 12, marginTop: 16 }}>
              <strong>Mind (50 pts max):</strong>
            </p>
            <ul style={{ marginLeft: 24, lineHeight: 1.8, fontSize: 14 }}>
              <li>Positive habit completed = 20 pts</li>
              <li>Negative habit avoided = 20 pts</li>
              <li>Discipline rating (1-10) = adds to score</li>
            </ul>

            <p style={{ marginBottom: 12, marginTop: 16 }}>
              <strong>Identity (50 pts max):</strong>
            </p>
            <ul style={{ marginLeft: 24, lineHeight: 1.8, fontSize: 14 }}>
              <li>Daily mission completed = 20 pts</li>
              <li>Philosophy practiced = 20 pts</li>
              <li>Mood rating (1-10) = adds to score</li>
            </ul>

            <p style={{ marginTop: 16, color: '#fbbf24', fontWeight: 600 }}>
              Max daily score = 150 points
            </p>
          </Question>
        </Category>

        <Category title="Features" icon="⚙️" color="#fbbf24">
          <Question question="What are weekly goals and how do they work?">
            <p>
              <strong>Weekly goals are 3 specific targets you set every Monday.</strong> They reset automatically 
              at 12:01 AM EST every Monday. You set them on the Goals page.
            </p>
            <p style={{ marginTop: 12 }}>
              They appear on your Daily Log page as reminders throughout the week, and show up on your 
              Weekly Reflection on Sunday so you can review how you did.
            </p>
            <p style={{ marginTop: 12 }}>
              Think of them as mini-milestones that keep you focused week-to-week. Examples: "Work out 5 times," 
              "Log every day with 120+ score," "Finish course module by Friday."
            </p>
          </Question>

          <Question question="How do I track my progress over time?">
            <p>
              Your <strong>Dashboard</strong> is your command center. It shows:
            </p>
            <ul style={{ marginLeft: 24, marginTop: 12, lineHeight: 1.8 }}>
              <li>Sovereign Score chart (last 120 days)</li>
              <li>Current streak</li>
              <li>Pillar performance (Body, Mind, Identity averages)</li>
              <li>Habit consistency over 30 days</li>
              <li>Top weakness triggers</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Check your dashboard daily. Look at the trend, not individual days. Is your score going up, flat, 
              or down? That tells you everything.
            </p>
          </Question>

          <Question question="What are 'weakness patterns' on my dashboard?">
            <p>
              <strong>Weakness patterns track what triggers your slip-ups.</strong> When you fail to avoid your 
              negative habit, the system asks "what triggered it?" — stress, boredom, fatigue, social media, etc.
            </p>
            <p style={{ marginTop: 12 }}>
              Over 30 days, the dashboard shows your top 3 triggers. If "stress" shows up 12 times, you know 
              that's your weak spot. Awareness is the first step to fixing it.
            </p>
          </Question>

          <Question question="Can I share my progress?">
            <p>
              <strong>Yes.</strong> On your Dashboard, click <strong>"Share My Progress"</strong> or 
              <strong>"Share My Chart"</strong> to download an image card with your stats. Post it on social 
              media for public accountability.
            </p>
            <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14 }}>
              Social pressure works when used strategically. Let people watch you build.
            </p>
          </Question>

          <Question question="What are daily notes for?">
            <p>
              <strong>Daily notes are an optional journal field</strong> at the bottom of your Daily Log. 
              Use it to capture context: what happened today? What triggered a slip-up? What felt different?
            </p>
            <p style={{ marginTop: 12 }}>
              When you review your notes weekly, patterns emerge. You'll see things you'd otherwise miss. 
              Notes turn data into insights.
            </p>
          </Question>
        </Category>

        <Category title="Account & Billing" icon="💳" color="#ef4444">
          <Question question="How much does Continuum cost?">
            <p>
              <strong>$12/month.</strong> That's it. No annual commitments, no hidden fees, no upsells.
            </p>
            <p style={{ marginTop: 12 }}>
              You get full access to all features: unlimited tracking, dashboard analytics, weekly reflections, 
              progress sharing, and everything else.
            </p>
          </Question>

          <Question question="Can I cancel anytime?">
            <p>
              <strong>Yes.</strong> Cancel anytime, no questions asked. Your data stays accessible until the end 
              of your current billing period. After that, your account is paused (not deleted) and you can 
              reactivate whenever you want.
            </p>
          </Question>

          <Question question="What payment methods do you accept?">
            <p>
              We accept all major credit cards (Visa, Mastercard, Amex, Discover) through Stripe. 
              Billing is handled securely — we don't store your card information.
            </p>
          </Question>
        </Category>

        <Category title="Technical" icon="🔧" color="#64748b">
          <Question question="What timezone does Continuum use?">
            <p>
              <strong>Eastern Standard Time (EST).</strong> All daily resets, weekly goal resets, and timestamps 
              are in EST. The daily log locks at 12:01 AM EST, and weekly goals reset every Monday at 12:01 AM EST.
            </p>
            <p style={{ marginTop: 12 }}>
              If you're in a different timezone, adjust your logging schedule accordingly. For example, if you're 
              in PST, the log locks at 9:01 PM your time.
            </p>
          </Question>

          <Question question="Is my data private?">
            <p>
              <strong>Yes.</strong> Your logs, goals, and notes are private. We don't share your data with anyone. 
              We don't sell it. We don't use it for advertising. It's yours.
            </p>
            <p style={{ marginTop: 12 }}>
              The only data that leaves our system is when YOU choose to share progress images publicly.
            </p>
          </Question>

          <Question question="Can I export my data?">
            <p>
              <strong>Not yet, but it's coming.</strong> We're building a CSV export feature so you can download 
              your entire history (logs, scores, notes) and analyze it however you want.
            </p>
            <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14 }}>
              Your data is yours. We'll never lock you in.
            </p>
          </Question>
        </Category>

        {/* BOTTOM CTA */}
        <div style={{
          marginTop: 80,
          padding: 'clamp(32px, 6vw, 48px)',
          background: 'linear-gradient(135deg, #020617, #0f172a)',
          borderRadius: 16,
          border: '2px solid #22c55e',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 36px)',
            marginBottom: 16,
            fontWeight: 700
          }}>
            Still Have Questions?
          </h2>
          <p style={{
            color: '#94a3b8',
            marginBottom: 32,
            fontSize: 'clamp(15px, 3vw, 17px)',
            lineHeight: 1.6,
            maxWidth: 560,
            margin: '0 auto 32px'
          }}>
            The best way to understand Continuum is to use it. Sign up, set your goals, 
            and log your first day. You'll see how it works immediately.
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

function Category({
  title,
  icon,
  color,
  children
}: {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      marginBottom: 48,
      padding: 'clamp(24px, 5vw, 32px)',
      background: '#020617',
      borderRadius: 16,
      border: `2px solid ${color}30`,
      borderLeft: `6px solid ${color}`
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24
      }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <h2 style={{
          fontSize: 'clamp(22px, 4vw, 28px)',
          margin: 0,
          color,
          fontWeight: 700
        }}>
          {title}
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function Question({
  question,
  children
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      background: '#01030f',
      borderRadius: 10,
      border: '1px solid #334155',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: 16,
          background: 'transparent',
          border: 'none',
          color: '#e5e7eb',
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: 600,
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16
        }}
      >
        <span>{question}</span>
        <span style={{
          fontSize: 20,
          color: '#22c55e',
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0
        }}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div style={{
          padding: '0 16px 16px 16px',
          fontSize: 'clamp(13px, 3vw, 15px)',
          lineHeight: 1.8,
          color: '#94a3b8'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}