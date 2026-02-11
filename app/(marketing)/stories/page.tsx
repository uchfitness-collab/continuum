import Link from 'next/link';

export default function StoriesPage() {
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
          opacity: 0.15,
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
          maxWidth: 1100,
          margin: '0 auto',
          padding: 'clamp(80px, 12vw, 120px) clamp(16px, 4vw, 24px) clamp(60px, 10vw, 80px)',
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 60px)' }}>
          <h1 style={{ 
            fontSize: 'clamp(32px, 6vw, 44px)',
            fontWeight: 700, 
            marginBottom: 16 
          }}>
            Stories of Discipline
          </h1>
          <p style={{ 
            fontSize: 'clamp(16px, 3vw, 18px)',
            color: '#94a3b8', 
            maxWidth: 700, 
            margin: '0 auto',
            padding: '0 16px',
          }}>
            These are not testimonials. They are real examples of how daily standards, 
            habit removal, and consistency translate into measurable results.
          </p>
        </div>

        {/* PILLAR TABS */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          justifyContent: 'center',
          marginBottom: 'clamp(48px, 8vw, 60px)',
          flexWrap: 'wrap',
          padding: '0 16px',
        }}>
          <PillarTab label="All Stories" active />
          <PillarTab label="Body" color="#22c55e" />
          <PillarTab label="Mind" color="#3b82f6" />
          <PillarTab label="Identity" color="#a855f7" />
        </div>

        {/* STORIES */}
        <div style={{ display: 'grid', gap: 'clamp(48px, 8vw, 60px)' }}>
          
          {/* STORY 1 - MIND */}
          <Story
            pillar="Mind"
            pillarColor="#3b82f6"
            name="Carlos Tevez"
            role="Real Estate Operator"
            challenge="Inconsistent focus and social media distraction"
            solution="One deal review per day. Social media flagged as negative habit. Reading as replacement."
            result="Reviewed more deals in 3 months than entire previous year. Closed major opportunity from improved focus."
          >
            <p>
              Carlos Tevez didn't think he had a discipline problem. From the outside, things looked fine.
            </p>
            <p>
              He was active in real estate—reviewing opportunities, talking to brokers, managing deals. 
              But when he looked honestly at his days, the pattern was clear: focus was inconsistent. 
              Some days he reviewed deals deeply. Other days he reacted to messages, scrolled social media, 
              and told himself he'd get to it tomorrow.
            </p>
            <p>
              He decided to test one simple rule using Continuum: <strong>review at least one deal every day, 
              no matter what.</strong>
            </p>
            <p>
              Not five deals. Not a full analysis. Just one, done properly.
            </p>
            <p>
              Carlos also made two supporting changes. He flagged excessive social media use as a negative habit. 
              Reading replaced it. Physical training became binary—either completed or not. Every day was logged, 
              even the bad ones.
            </p>
            <p>
              The score didn't judge him, but it didn't lie either.
            </p>
            <p>
              Within a few weeks, the pattern became uncomfortable. On days he slipped into social media, 
              deal reviews were rushed or skipped entirely. On days he followed the system, focus improved 
              and decisions felt cleaner.
            </p>
            <p>
              Over the next few months, the output spoke for itself. Carlos reviewed more deals than he had 
              the entire previous year. Follow-ups became faster. Hesitation disappeared.
            </p>
            <p>
              When a strong opportunity appeared, he recognized it immediately and moved. That deal closed.
            </p>
            <p style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: 20 }}>
              Continuum didn't change Carlos's life overnight. It enforced standards when motivation wasn't 
              present—and made progress unavoidable.
            </p>
          </Story>

          {/* STORY 2 - BODY */}
          <Story
            pillar="Body"
            pillarColor="#22c55e"
            name="Sarah Chen"
            role="Software Engineer"
            challenge="Starting and stopping workout routines. No consistency."
            solution="Binary tracking: workout completed or not. 25+ push-ups daily. Avoided sugar."
            result="First 90-day streak ever. Lost 18 lbs. Energy increased dramatically."
          >
            <p>
              Sarah Chen had tried every fitness app. Started strong. Quit within weeks. The pattern repeated for years.
            </p>
            <p>
              The problem wasn't motivation—it was visibility. She'd miss a day, feel guilty, then avoid tracking entirely. 
              Without feedback, the pattern became invisible again.
            </p>
            <p>
              With Continuum, she set one rule: <strong>log every day, even the failures.</strong>
            </p>
            <p>
              Her Body pillar was simple: Did she complete her workout? Yes or no. Did she do 25+ push-ups? 
              Did she avoid sugar? Binary questions. Honest answers.
            </p>
            <p>
              Week one was rough. She logged three failures. But she logged them. Week two, the Sovereign Score 
              started climbing. Not because she had perfect days—because she showed up consistently.
            </p>
            <p>
              By month two, something shifted. Missing a workout felt wrong. Not guilty—just misaligned. 
              The score reflected reality, and reality demanded consistency.
            </p>
            <p>
              Three months in, Sarah hit her first 90-day streak. She'd lost 18 pounds. More importantly, 
              her energy was stable. Focus at work improved. The physical momentum carried into everything else.
            </p>
            <p style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: 20 }}>
              Continuum didn't motivate Sarah. It made her accountable to herself. The score doesn't judge—it reflects.
            </p>
          </Story>

          {/* STORY 3 - IDENTITY */}
          <Story
            pillar="Identity"
            pillarColor="#a855f7"
            name="Marcus Williams"
            role="Aspiring Founder"
            challenge="'Someday' syndrome. Planning but never shipping."
            solution="Daily mission: work on startup for 1 hour minimum. Philosophy practice: journaling."
            result="Shipped MVP in 6 weeks. First paying customer in 8. Identity shift from 'aspiring' to founder."
          >
            <p>
              Marcus Williams called himself an "aspiring founder" for three years. He had ideas. He had notes. 
              He had conversations about startups. What he didn't have was a product.
            </p>
            <p>
              The gap between intention and action was massive. He'd work on his idea intensely for a week, 
              then nothing for a month. Every restart felt like starting over.
            </p>
            <p>
              Continuum forced a different question: <strong>What does a founder actually do?</strong>
            </p>
            <p>
              His daily mission became non-negotiable: work on the startup for one hour minimum. Not planning. 
              Not researching. Building. Writing code. Talking to potential customers. Real work.
            </p>
            <p>
              He paired this with a philosophy practice: journaling. Every night, he wrote three sentences about 
              what he built and what he learned. The practice created accountability to his future self.
            </p>
            <p>
              The Sovereign Score tracked alignment between who he claimed to be and what he actually did. 
              Days where he "thought about" his startup but didn't ship? Low score. Days where he shipped, 
              even small features? High score.
            </p>
            <p>
              Six weeks in, his MVP was live. Week eight brought the first paying customer. Not because of a 
              breakthrough—because of consistency.
            </p>
            <p>
              Marcus stopped calling himself an "aspiring founder." The identity shifted through proof, 
              one tracked day at a time.
            </p>
            <p style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: 20 }}>
              You don't become who you want to be through intention. You become who you consistently prove yourself to be.
            </p>
          </Story>

        </div>

        {/* CTA */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'clamp(60px, 10vw, 80px)',
          padding: 'clamp(28px, 6vw, 40px)',
          background: '#020617',
          borderRadius: 16,
          border: '1px solid #22c55e'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(24px, 4vw, 28px)',
            marginBottom: 12 
          }}>
            Your story starts with one day
          </h2>
          <p style={{ 
            color: '#94a3b8', 
            marginBottom: 24, 
            fontSize: 'clamp(14px, 3vw, 16px)',
            padding: '0 16px',
          }}>
            Track your actions. See your trajectory. Prove who you're becoming.
          </p>
          <Link
            href="/signup"
            style={{
              display: 'inline-block',
              padding: 'clamp(12px, 3vw, 14px) clamp(24px, 5vw, 32px)',
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              color: '#020617',
              fontWeight: 600,
              fontSize: 'clamp(14px, 3vw, 16px)',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            Start Tracking Today
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Components ---------- */

function PillarTab({ 
  label, 
  color, 
  active = false 
}: { 
  label: string;
  color?: string;
  active?: boolean;
}) {
  return (
    <button
      style={{
        padding: '10px 20px',
        borderRadius: 8,
        border: active ? `2px solid ${color || '#22c55e'}` : '1px solid #334155',
        background: active ? `${color || '#22c55e'}15` : 'transparent',
        color: active ? (color || '#22c55e') : '#94a3b8',
        fontWeight: active ? 600 : 400,
        fontSize: 'clamp(13px, 3vw, 14px)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

function Story({
  pillar,
  pillarColor,
  name,
  role,
  challenge,
  solution,
  result,
  children
}: {
  pillar: string;
  pillarColor: string;
  name: string;
  role: string;
  challenge: string;
  solution: string;
  result: string;
  children: React.ReactNode;
}) {
  return (
    <article
      style={{
        background: '#020617',
        borderRadius: 16,
        padding: 'clamp(24px, 5vw, 40px)',
        border: `1px solid ${pillarColor}30`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 'clamp(24px, 5vw, 32px)' }}>
        <div style={{ 
          display: 'inline-block',
          padding: '6px 12px',
          background: `${pillarColor}20`,
          color: pillarColor,
          borderRadius: 6,
          fontSize: 'clamp(12px, 3vw, 13px)',
          fontWeight: 600,
          marginBottom: 16
        }}>
          {pillar} Pillar
        </div>
        
        <h2 style={{ 
          fontSize: 'clamp(24px, 4vw, 28px)',
          fontWeight: 600, 
          marginBottom: 4 
        }}>
          {name}
        </h2>
        <p style={{ 
          color: '#94a3b8', 
          fontSize: 'clamp(14px, 3vw, 16px)'
        }}>
          {role}
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'clamp(16px, 3vw, 20px)',
        marginBottom: 'clamp(24px, 5vw, 32px)',
        padding: 'clamp(16px, 4vw, 20px)',
        background: '#01030f',
        borderRadius: 12,
      }}>
        <Stat label="Challenge" value={challenge} />
        <Stat label="Solution" value={solution} />
        <Stat label="Result" value={result} />
      </div>

      {/* Full Story */}
      <div style={{ 
        lineHeight: 1.9, 
        fontSize: 'clamp(14px, 3vw, 16px)',
        color: '#e5e7eb',
      }}>
        {children}
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ 
        fontSize: 'clamp(11px, 3vw, 12px)',
        color: '#94a3b8', 
        marginBottom: 6, 
        fontWeight: 600 
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: 'clamp(13px, 3vw, 14px)',
        color: '#e5e7eb', 
        lineHeight: 1.5 
      }}>
        {value}
      </div>
    </div>
  );
}