export default function AboutPage() {
    return (
      <section
        style={{
          minHeight: '100vh',
          backgroundImage:
            "linear-gradient(rgba(2,6,23,0.88), rgba(2,6,23,0.95)), url('/continuum-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#e5e7eb',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: '120px 24px',
          }}
        >
          {/* HERO */}
          <h1 style={{ fontSize: 44, fontWeight: 600, marginBottom: 24 }}>
            A System for Discipline
          </h1>
  
          <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 760, opacity: 0.9 }}>
            This is a personal operating system designed to make discipline visible,
            measurable, and cumulative over time.
          </p>
  
          <hr style={divider} />
  
          {/* CORE PROBLEM */}
          <Section title="The Real Problem">
            <p>
              Most people don’t fail because they lack ambition. They fail because
              they lack structure.
            </p>
  
            <p>
              Motivation fades. Memory lies. Emotion distorts. Without feedback,
              effort becomes guesswork.
            </p>
  
            <p>
              This system exists to remove ambiguity and replace it with truth.
            </p>
          </Section>
  
          <hr style={divider} />
  
          {/* PHILOSOPHY */}
          <Section title="The Philosophy">
            <p>
              Discipline is not intensity. It is consistency.
            </p>
  
            <p>
              What you do once does not matter. What you repeat does.
            </p>
  
            <p>
              Every action you take is a vote for the type of person you are becoming.
              Most people never count their votes.
            </p>
          </Section>
  
          <hr style={divider} />
  
          {/* HOW IT WORKS */}
          <Section title="How It Works">
            <h3 style={subTitle}>The Three Pillars</h3>
  
            <ul style={list}>
              <li>
                <strong>Body</strong> — physical effort, movement, and energy output
              </li>
              <li>
                <strong>Mind</strong> — restraint, focus, and daily discipline
              </li>
              <li>
                <strong>Identity</strong> — actions that reinforce your future self
              </li>
            </ul>
  
            <p>
              Each day produces a raw score based on your inputs. That score feeds
              into a longer-term metric that rewards consistency rather than
              perfection.
            </p>
          </Section>
  
          <hr style={divider} />
  
          {/* HOW TO USE */}
          <Section title="How to Use It">
            <Step
              title="1. Define Your Standards"
              text="You decide what counts as effort, discipline, and progress."
            />
            <Step
              title="2. Log Reality"
              text="Each day, you record what actually happened. No stories. No excuses."
            />
            <Step
              title="3. Review the Trajectory"
              text="The dashboard shows whether discipline is compounding or eroding."
            />
            <Step
              title="4. Reflect Weekly"
              text="Patterns matter more than days. Reflection reveals truth."
            />
          </Section>
  
          <hr style={divider} />
  
          {/* WHO IT'S FOR */}
          <Section title="Who This Is For">
            <p>
              This is for people who take responsibility seriously.
            </p>
  
            <p>
              It is not a streak app. It is not gamification. It is a mirror.
            </p>
          </Section>
  
          <hr style={divider} />
  
          {/* FINAL */}
          <Section title="Final Thought">
            <p>You don’t need more motivation.</p>
            <p>You need visibility.</p>
          </Section>
        </div>
      </section>
    );
  }
  
  /* ---------- Helpers ---------- */
  
  const divider = {
    margin: '72px 0',
    border: 'none',
    borderTop: '1px solid #1f2937',
  };
  
  function Section({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 28, marginBottom: 20 }}>{title}</h2>
        <div style={{ lineHeight: 1.7, opacity: 0.9 }}>{children}</div>
      </section>
    );
  }
  
  function Step({ title, text }: { title: string; text: string }) {
    return (
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 6 }}>{title}</h4>
        <p>{text}</p>
      </div>
    );
  }
  
  const subTitle = {
    marginTop: 24,
    marginBottom: 12,
  };
  
  const list = {
    margin: '16px 0 24px 20px',
    lineHeight: 1.8,
  };