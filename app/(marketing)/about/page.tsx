import Image from 'next/image';

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '64px 24px 96px', // ⬅️ reduced top padding
        color: '#e5e7eb',
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* HERO */}
      <section style={{ textAlign: 'center', marginBottom: 80 }}>
        <Image
          src="/continuum-hero.jpg"
          alt="Continuum"
          width={420}
          height={760}
          priority
          style={{
            margin: '0 auto 32px',
            display: 'block',
            transform: 'translateY(-24px)', // ⬅️ moves image UP
            opacity: 0.96,
          }}
        />

        <h1
          style={{
            fontSize: 44,
            fontWeight: 500,
            marginBottom: 18,
            letterSpacing: '-0.02em',
          }}
        >
          About Continuum
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.75,
            maxWidth: 720,
            margin: '0 auto',
            color: '#cbd5e1',
          }}
        >
          Continuum is a personal operating system designed to measure, reinforce,
          and compound daily discipline.
        </p>
      </section>

      {/* CORE IDEA */}
      <section style={{ marginBottom: 72 }}>
        <p style={{ fontSize: 18, lineHeight: 1.75 }}>
          Most people don’t fail because they lack ambition. They fail because they
          lack <strong>structure</strong>. Continuum exists to solve that problem.
        </p>

        <p style={{ marginTop: 18, lineHeight: 1.75 }}>
          It converts your daily actions into a single evolving metric — the
          <strong> Sovereign Score</strong> — so you can see, in real time, whether
          you are becoming who you say you want to be.
        </p>
      </section>

      <Divider />

      <Section title="Why Habits Matter">
        <p>
          James Clear wrote, “Every action you take is a vote for the type of person
          you wish to become.” The problem is that most people never track their
          votes.
        </p>
        <p>
          They rely on memory, emotion, or motivation — all unreliable. Continuum
          removes ambiguity. It replaces feelings with feedback.
        </p>
        <p>
          You don’t guess whether you’re disciplined. You <strong>see it</strong>.
        </p>
      </Section>

      <Divider />

      <Section title="The Philosophy Behind Continuum">
        <p>
          Jim Rohn famously said, “Discipline is the bridge between goals and
          accomplishment.” Continuum is that bridge — built daily, one action at a
          time.
        </p>
        <p>
          Bob Proctor taught, “You do not rise to the level of your goals. You fall
          to the level of your habits.” Continuum ensures you don’t fall blindly.
          You rise — or descend — with awareness.
        </p>
      </Section>

      <Divider />

      <Section title="How Continuum Works">
        <h3 style={subTitleStyle}>The Three Pillars</h3>
        <ul style={listStyle}>
          <li><strong>Body</strong> — physical discipline, nutrition, effort output</li>
          <li><strong>Mind</strong> — focus, restraint, mental discipline</li>
          <li><strong>Identity</strong> — actions that reinforce your future self</li>
        </ul>
        <p>
          Each day, your inputs form a <strong>Daily Raw Score</strong>. That feeds
          into your <strong>Sovereign Score</strong> — a weighted moving average
          that rewards consistency, not perfection.
        </p>
      </Section>

      <Divider />

      <Section title="Final Thought">
        <p>You don’t need more motivation. You need visibility.</p>
        <p>Every day, you cast a vote. Continuum simply counts them.</p>
      </Section>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Divider() {
  return (
    <hr
      style={{
        margin: '72px 0',
        border: 'none',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <h2
        style={{
          fontSize: 28,
          marginBottom: 22,
          fontWeight: 500,
          letterSpacing: '-0.015em',
        }}
      >
        {title}
      </h2>
      <div style={{ lineHeight: 1.75, color: '#d1d5db' }}>{children}</div>
    </section>
  );
}

const subTitleStyle = {
  marginTop: 28,
  marginBottom: 14,
  fontSize: 20,
  fontWeight: 500,
};

const listStyle = {
  margin: '16px 0 28px 22px',
  lineHeight: 1.9,
};