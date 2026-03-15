'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

const getESTDate = () => {
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estDate = new Date(estString);
  const year = estDate.getFullYear();
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMondayOfWeek = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday.toISOString().split('T')[0];
};

export default function GoalsPage() {
  const router = useRouter();

  const [bodyGoal, setBodyGoal] = useState('');
  const [mindGoal, setMindGoal] = useState('');
  const [identityGoal, setIdentityGoal] = useState('');

  const [weeklyGoal1, setWeeklyGoal1] = useState('');
  const [weeklyGoal2, setWeeklyGoal2] = useState('');
  const [weeklyGoal3, setWeeklyGoal3] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingWeekly, setSavingWeekly] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [weeklyMessage, setWeeklyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadGoals = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.push('/login'); return; }
      setUserId(auth.user.id);

      const { data: goals } = await supabase.from('user_goals').select('*').eq('user_id', auth.user.id).maybeSingle();
      if (goals) {
        setBodyGoal(goals.body_goal || '');
        setMindGoal(goals.mind_goal || '');
        setIdentityGoal(goals.identity_goal || '');
      }

      const today = getESTDate();
      const weekStart = getMondayOfWeek(today);
      setCurrentWeekStart(weekStart);

      const { data: weeklyGoals } = await supabase.from('weekly_goals').select('*').eq('user_id', auth.user.id).eq('week_start_date', weekStart).maybeSingle();
      if (weeklyGoals) {
        setWeeklyGoal1(weeklyGoals.goal1 || '');
        setWeeklyGoal2(weeklyGoals.goal2 || '');
        setWeeklyGoal3(weeklyGoals.goal3 || '');
      }

      setLoading(false);
    };
    loadGoals();
  }, [router]);

  const handleSaveYearlyGoals = async () => {
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase.from('user_goals').upsert(
        { user_id: userId, body_goal: bodyGoal, mind_goal: mindGoal, identity_goal: identityGoal, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
      setMessage({ type: 'success', text: '1-year goals saved.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save goals' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWeeklyGoals = async () => {
    if (!userId || !currentWeekStart) return;
    setSavingWeekly(true);
    setWeeklyMessage(null);
    try {
      const { error } = await supabase.from('weekly_goals').upsert(
        { user_id: userId, week_start_date: currentWeekStart, goal1: weeklyGoal1, goal2: weeklyGoal2, goal3: weeklyGoal3, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,week_start_date' }
      );
      if (error) throw error;
      setWeeklyMessage({ type: 'success', text: 'Weekly goals saved.' });
      setTimeout(() => setWeeklyMessage(null), 3000);
    } catch (err: any) {
      setWeeklyMessage({ type: 'error', text: err.message || 'Failed to save weekly goals' });
    } finally {
      setSavingWeekly(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080c18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#4ade80', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const weekEndDate = new Date(currentWeekStart + 'T00:00:00');
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  const weekRange = `${new Date(currentWeekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c18',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 24px)',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 14 }}>
            Goals
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 10, lineHeight: 1.15 }}>
            Set Your Direction
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.65 }}>
            Your daily habits are the inputs. These are the outcomes.
          </p>
        </div>

        {/* WEEKLY GOALS */}
        <div style={{
          padding: 'clamp(20px, 3vw, 28px)', marginBottom: 20,
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '3px solid #fbbf24',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', fontWeight: 700, color: '#fbbf24', margin: 0 }}>
              This Week&apos;s Goals
            </h2>
            <span style={{
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', fontWeight: 600,
              padding: '3px 8px', borderRadius: 5,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              Resets Monday
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginBottom: 20 }}>{weekRange}</p>

          {weeklyMessage && <MessageBox message={weeklyMessage} />}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {[
              { val: weeklyGoal1, set: setWeeklyGoal1, ph: 'Goal 1 — e.g., Log 7/7 days above baseline' },
              { val: weeklyGoal2, set: setWeeklyGoal2, ph: 'Goal 2 — e.g., Hit the gym 5 times' },
              { val: weeklyGoal3, set: setWeeklyGoal3, ph: 'Goal 3 — e.g., Finish the project by Friday' },
            ].map(({ val, set, ph }, i) => (
              <input
                key={i}
                type="text"
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={ph}
                style={inputStyle}
              />
            ))}
          </div>

          <button
            onClick={handleSaveWeeklyGoals}
            disabled={savingWeekly}
            style={{
              padding: '12px 24px',
              background: savingWeekly ? 'rgba(255,255,255,0.06)' : '#fbbf24',
              color: savingWeekly ? 'rgba(255,255,255,0.3)' : '#080c18',
              fontWeight: 700, fontSize: 14, borderRadius: 10,
              border: 'none', cursor: savingWeekly ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {savingWeekly ? 'Saving...' : 'Save Weekly Goals'}
          </button>
        </div>

        {/* 1-YEAR GOALS */}
        <div style={{ marginTop: 40, marginBottom: 24 }}>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
            1-Year Direction
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, lineHeight: 1.65 }}>
            Your North Star. Review weekly to make sure your daily habits align.
          </p>
        </div>

        {message && <MessageBox message={message} />}

        {/* TIP BOX */}
        <div style={{
          padding: 'clamp(16px, 2.5vw, 20px)', marginBottom: 24,
          background: 'rgba(74,222,128,0.04)',
          border: '1px solid rgba(74,222,128,0.12)',
          borderLeft: '3px solid rgba(74,222,128,0.4)',
          borderRadius: 12,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#4ade80', marginBottom: 10 }}>How to set effective goals</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              'Be specific — not "get fit" but "lose 20 lbs and run a 5K"',
              'Make it achievable in 12 months with consistent daily effort',
              'Focus on outcomes, not activities',
              'Ask: if I do my habits daily for a year, is this goal inevitable?',
            ].map((tip, i) => (
              <p key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.55, display: 'flex', gap: 8 }}>
                <span style={{ color: 'rgba(74,222,128,0.5)', flexShrink: 0 }}>→</span>{tip}
              </p>
            ))}
          </div>
        </div>

        {/* BODY GOAL */}
        <GoalSection
          title="Body" color="#4ade80"
          prompt="What does your body look, feel, and perform like in 1 year?"
          examples={[
            'Lose 30 pounds and maintain 15% body fat',
            'Run a half-marathon under 2 hours',
            'Bench press 225 lbs for 5 reps',
            'Complete 100 consecutive push-ups',
          ]}
          value={bodyGoal} onChange={setBodyGoal}
          placeholder="e.g., Lose 25 lbs, run a 10k under 50 minutes, and have visible abs"
        />

        {/* MIND GOAL */}
        <GoalSection
          title="Mind" color="#60a5fa"
          prompt="What mental habits, skills, or knowledge do you want to build?"
          examples={[
            'Read 24 books (2 per month)',
            'Eliminate social media addiction completely',
            'Learn conversational Spanish',
            'Meditate daily for 365 consecutive days',
          ]}
          value={mindGoal} onChange={setMindGoal}
          placeholder="e.g., Read 30 books, learn Python, build deep focus for 2-hour sessions"
        />

        {/* IDENTITY GOAL */}
        <GoalSection
          title="Identity" color="#a78bfa"
          prompt="Who are you becoming? What will you have built or created?"
          examples={[
            'Launch a profitable side business ($5k/month)',
            'Publish 52 blog posts or essays',
            'Write and self-publish a book',
            'Network with 100 new people in my industry',
          ]}
          value={identityGoal} onChange={setIdentityGoal}
          placeholder="e.g., Launch my business, hit $5k/month revenue, and build in public"
        />

        {/* SAVE */}
        <div style={{ marginTop: 8, marginBottom: 48 }}>
          <button
            onClick={handleSaveYearlyGoals}
            disabled={saving}
            style={{
              width: '100%',
              padding: 'clamp(14px, 2vw, 16px)',
              background: saving ? 'rgba(255,255,255,0.08)' : '#4ade80',
              color: saving ? 'rgba(255,255,255,0.3)' : '#080c18',
              fontWeight: 700, fontSize: 15, borderRadius: 12,
              border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {saving ? 'Saving...' : 'Save 1-Year Goals'}
          </button>
          <p style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            You can update these anytime as your vision evolves.
          </p>
        </div>

        {/* BOTTOM TIP */}
        <div style={{
          padding: 'clamp(18px, 2.5vw, 24px)',
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 40,
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
            Connecting goals to daily habits
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
            Your goals are the destination. Your habits are the vehicle. Make sure what you&apos;re tracking in{' '}
            <span style={{ color: '#4ade80' }}>Habits</span> directly supports these outcomes.
            If your goal is to launch a business, your daily mission should be &quot;work on business for 2 hours minimum.&quot;
          </p>
        </div>

      </div>
    </div>
  );
}

/* ---------- SHARED STYLES ---------- */

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10,
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

/* ---------- COMPONENTS ---------- */

function MessageBox({ message }: { message: { type: 'success' | 'error'; text: string } }) {
  return (
    <div style={{
      padding: '12px 16px', marginBottom: 16, borderRadius: 10,
      background: message.type === 'success' ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)',
      border: `1px solid ${message.type === 'success' ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
      color: message.type === 'success' ? '#4ade80' : '#f87171',
      fontSize: 13,
    }}>
      {message.text}
    </div>
  );
}

function GoalSection({
  title, color, prompt, examples, value, onChange, placeholder,
}: {
  title: string; color: string; prompt: string;
  examples: string[]; value: string;
  onChange: (val: string) => void; placeholder: string;
}) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div style={{
      padding: 'clamp(18px, 3vw, 24px)', marginBottom: 16,
      background: 'rgba(255,255,255,0.025)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', fontWeight: 700, color, margin: 0 }}>{title}</h3>
        <span style={{
          fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)', fontWeight: 600,
          padding: '3px 8px', borderRadius: 5,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
        }}>1 Year</span>
      </div>

      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 14, lineHeight: 1.5 }}>{prompt}</p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          ...inputStyle,
          lineHeight: 1.6,
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />

      <button
        onClick={() => setShowExamples(!showExamples)}
        type="button"
        style={{
          marginTop: 10,
          padding: '5px 12px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6,
          color: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        {showExamples ? 'Hide' : 'Show'} examples
      </button>

      {showExamples && (
        <div style={{
          marginTop: 10, padding: '12px 14px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            Examples
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {examples.map((ex, i) => (
              <button
                key={i} type="button"
                onClick={() => { onChange(ex); setShowExamples(false); }}
                style={{
                  background: 'none', border: 'none', padding: 0,
                  color: 'rgba(255,255,255,0.45)', fontSize: 13,
                  cursor: 'pointer', textAlign: 'left', lineHeight: 1.5,
                }}
              >
                → {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}