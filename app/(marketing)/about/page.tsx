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
          opacity: 0.22,
          filter: 'grayscale(100%)',
          pointerEvents: 'none',
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(15,23,42,0.55), rgba(2,6,23,0.95))',
          pointerEvents: 'none',
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 960,
          margin: '0 auto',
          padding: '120px 24px',
        }}
      >
        {/* HERO */}
        <h1 style={{ fontSize: 44, fontWeight: 600, marginBottom: 24 }}>
          Build Sovereignty Through Discipline
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 760, opacity: 0.9 }}>
          Continuum is a personal operating system that transforms discipline from 
          abstract intention into measurable reality. Track your actions. See your 
          trajectory. Prove who you're becoming.
        </p>

        <hr style={divider} />

        {/* THE PROBLEM */}
        <Section title="The Problem">
          <p>
            Most people know what they should do. They fail anyway.
          </p>

          <p>
            Not because they lack ambition. Not because they lack resources. 
            They fail because discipline happens in the dark — invisible, unmeasured, forgotten by tomorrow.
          </p>

          <p>
            Without feedback, you can't course-correct. Without visibility, effort becomes guesswork. 
            Without measurement, discipline becomes another story you tell yourself.
          </p>
        </Section>

        <hr style={divider} />

        {/* THE SOLUTION */}
        <Section title="The Solution">
          <p>
            Continuum makes discipline visible.
          </p>

          <p>
            Every day, you track your actions across three pillars: Body, Mind, and Identity. 
            The system calculates a Sovereign Score that compounds over time — rewarding consistency, 
            not perfection.
          </p>

          <p>
            The result? A single number that tells you the truth about whether you're building or 
            coasting. No stories. No excuses. Just data.
          </p>
        </Section>

        <hr style={divider} />

        {/* WHY THIS WORKS */}
        <Section title="Why This Works">
          <Principle
            title="Measurement drives behavior"
            text="When you track something daily, you can't lie to yourself. The act of logging forces honesty."
          />

          <Principle
            title="Consistency compounds"
            text="Discipline isn't about perfect days. It's about showing up repeatedly. The score rewards the pattern, not the peak."
          />

          <Principle
            title="Identity shifts through proof"
            text="You become who you consistently prove yourself to be. Continuum tracks the proof so you can see the shift happening."
          />
        </Section>

        <hr style={divider} />

        {/* THE THREE PILLARS */}
        <Section title="The Three Pillars">
          <h3 style={subTitle}>Where Discipline Happens</h3>

          <Pillar
            icon="💪"
            title="Body"
            description="Physical action creates momentum. Track your movement, nutrition discipline, and daily reps. Energy fuels everything else."
          />

          <Pillar
            icon="🧠"
            title="Mind"
            description="What you avoid matters as much as what you do. Track negative habits avoided, positive habits built, and daily discipline."
          />

          <Pillar
            icon="⚡"
            title="Identity"
            description="Who you say you are vs. what you actually do. Track your daily mission, philosophy practice, and alignment with your future self."
          />
        </Section>

        <hr style={divider} />

        {/* SOVEREIGNTY */}
        <Section title="What is Sovereignty?">
          <p>
            Sovereignty is self-governance. It's the ability to set a standard and hold it.
          </p>

          <p>
            Most people outsource their standards to others — their employer, their partner, 
            social media, the algorithm. They react instead of deciding.
          </p>

          <p>
            Continuum gives you the system to reclaim control. Define your standards. 
            Track your adherence. See the gap between intention and action close over time.
          </p>

          <p style={{ marginTop: 24, fontStyle: 'italic', color: '#22c55e' }}>
            Sovereignty isn't granted. It's built — one disciplined day at a time.
          </p>
        </Section>

        <hr style={divider} />

        {/* WHO IT'S FOR */}
        <Section title="Who This Is For">
          <p>
            Continuum is for people who refuse to coast.
          </p>

          <ul style={list}>
            <li>You know what you should be doing, but struggle with consistency</li>
            <li>You want accountability that doesn't rely on another person</li>
            <li>You're building something meaningful and need a system to stay sharp</li>
            <li>You value truth over comfort</li>
            <li>You take responsibility for your outcomes</li>
          </ul>

          <p>
            This isn't a streak app. This isn't gamification. This is a mirror that shows 
            you exactly where you are and where you're trending.
          </p>
        </Section>

        <hr style={divider} />

        {/* HOW YOU'LL USE IT */}
        <Section title="How You'll Use It">
          <Step
            number="1"
            title="Define Your Standards"
            text="You decide what counts. Your workout. Your nutritional discipline. Your daily mission. No templates. No generic habits. This is your system."
          />
          
          <Step
            number="2"
            title="Log Daily (3 minutes)"
            text="Every day, you answer simple questions: Did you do it? Yes or no. Rate your discipline. Rate your mood. The act of logging is discipline."
          />
          
          <Step
            number="3"
            title="Watch Your Score Compound"
            text="Your Sovereign Score updates automatically. One day doesn't define you — the pattern does. Watch consistency build momentum over weeks and months."
          />
          
          <Step
            number="4"
            title="Reflect Weekly"
            text="Once a week, you review what worked, what broke your standard, and what patterns emerged. Patterns reveal truth."
          />
        </Section>

        <hr style={divider} />

        {/* THE COMMITMENT */}
        <Section title="The Commitment">
          <p>
            Continuum requires one thing from you: <strong>honesty</strong>.
          </p>

          <p>
            If you log truthfully — even when you fail — the system works. 
            If you game it, you only game yourself.
          </p>

          <p>
            This is for people who want the truth more than they want comfort.
          </p>
        </Section>

        <hr style={divider} />

        {/* FINAL CTA */}
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <h2 style={{ fontSize: 32, marginBottom: 16 }}>
            Ready to build sovereignty?
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 16 }}>
            Start tracking today. See what you're really made of.
          </p>
          
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
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */

const divider = {
  margin: '72px 0',
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
      <h2 style={{ fontSize: 28, marginBottom: 20, color: '#e5e7eb' }}>{title}</h2>
      <div style={{ lineHeight: 1.8, opacity: 0.9, fontSize: 16 }}>{children}</div>
    </section>
  );
}

function Step({ 
  number, 
  title, 
  text 
}: { 
  number: string;
  title: string; 
  text: string;
}) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: 16, 
      marginBottom: 24,
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
        {number}
      </div>
      <div>
        <h4 style={{ marginBottom: 6, fontSize: 16, color: '#e5e7eb' }}>{title}</h4>
        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{text}</p>
      </div>
    </div>
  );
}

function Pillar({
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
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <h4 style={{ fontSize: 18, marginBottom: 8, color: '#22c55e' }}>{title}</h4>
      <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{description}</p>
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
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ marginBottom: 6, fontSize: 16, color: '#22c55e' }}>→ {title}</h4>
      <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

const subTitle = {
  marginTop: 24,
  marginBottom: 16,
  fontSize: 18,
  color: '#94a3b8'
};

const list = {
  margin: '16px 0 24px 24px',
  lineHeight: 2,
  color: '#e5e7eb',
  fontSize: 15
};