'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabaseClient';

export default function HabitsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [habits, setHabits] = useState({
    body_physical_activity_name: '',
    body_daily_reps_name: '',
    body_nutritional_discipline_name: '',
    mind_negative_habit_name: '',
    mind_positive_habit_name: '',
    identity_daily_mission_name: '',
    identity_philosophy_practice_name: '',
  });

  useEffect(() => {
    const loadHabits = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.push('/login'); return; }

      const { data } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', auth.user.id)
        .maybeSingle();

      if (data) {
        setHabits({
          body_physical_activity_name:      data.body_physical_activity_name ?? '',
          body_daily_reps_name:             data.body_daily_reps_name ?? '',
          body_nutritional_discipline_name:  data.body_nutritional_discipline_name ?? '',
          mind_negative_habit_name:         data.mind_negative_habit_name ?? '',
          mind_positive_habit_name:         data.mind_positive_habit_name ?? '',
          identity_daily_mission_name:       data.identity_daily_mission_name ?? '',
          identity_philosophy_practice_name: data.identity_philosophy_practice_name ?? '',
        });
      }

      setLoading(false);
    };

    loadHabits();
  }, [router]);

  const saveHabits = async () => {
    setMessage(null);
    setSaving(true);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { error } = await supabase
      .from('user_habits')
      .upsert({ user_id: auth.user.id, ...habits }, { onConflict: 'user_id' });

    setSaving(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Habits saved.' });
      setTimeout(() => setMessage(null), 3000);
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
            Habits
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 10, lineHeight: 1.15 }}>
            Your Daily Standards
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: 1.65, marginBottom: 12 }}>
            Define the habits you'll track every day. These become your non-negotiables.
          </p>
          <Link href="/guide" style={{ color: '#4ade80', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
            Need help? View the habit guide →
          </Link>
        </div>

        {/* MESSAGE */}
        {message && (
          <div style={{
            padding: '13px 16px', marginBottom: 24, borderRadius: 10,
            background: message.type === 'success' ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)',
            border: `1px solid ${message.type === 'success' ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
            color: message.type === 'success' ? '#4ade80' : '#f87171',
            fontSize: 14, textAlign: 'center',
          }}>
            {message.text}
          </div>
        )}

        {/* BODY */}
        <Pillar title="Body" color="#4ade80">
          <HabitInput
            label="Physical Activity"
            sublabel="What movement will you do daily?"
            value={habits.body_physical_activity_name}
            onChange={(v) => setHabits({ ...habits, body_physical_activity_name: v })}
            placeholder="e.g., Gym workout, 10k steps, 30-min run"
            examples={['Gym workout', '10,000 steps', '30-minute run', 'Yoga session']}
          />
          <HabitInput
            label="Daily Reps"
            sublabel="What reps will you complete daily?"
            value={habits.body_daily_reps_name}
            onChange={(v) => setHabits({ ...habits, body_daily_reps_name: v })}
            placeholder="e.g., Push-ups, Squats, Pull-ups"
            examples={['Push-ups', 'Squats', 'Pull-ups', 'Burpees']}
          />
          <HabitInput
            label="Nutritional Discipline"
            sublabel="What will you avoid daily?"
            value={habits.body_nutritional_discipline_name}
            onChange={(v) => setHabits({ ...habits, body_nutritional_discipline_name: v })}
            placeholder="e.g., No candy, No fast food, No alcohol"
            examples={['Avoid candy/sweets', 'No soda', 'Avoid fast food', 'No alcohol']}
          />
        </Pillar>

        {/* MIND */}
        <Pillar title="Mind" color="#60a5fa">
          <HabitInput
            label="Negative Habit to Avoid"
            sublabel="What habit are you eliminating?"
            value={habits.mind_negative_habit_name}
            onChange={(v) => setHabits({ ...habits, mind_negative_habit_name: v })}
            placeholder="e.g., No doom scrolling for 2+ hours"
            examples={['Limit social media to 2 hours', 'Avoid doom scrolling', 'No video games']}
          />
          <HabitInput
            label="Positive Habit to Build"
            sublabel="What are you replacing it with?"
            value={habits.mind_positive_habit_name}
            onChange={(v) => setHabits({ ...habits, mind_positive_habit_name: v })}
            placeholder="e.g., Read 30 minutes, Learn chess"
            examples={['Read for 30 min', 'Learn a language', 'Practice instrument']}
          />
        </Pillar>

        {/* IDENTITY */}
        <Pillar title="Identity" color="#a78bfa">
          <HabitInput
            label="Daily Mission"
            sublabel="What ONE thing moves you toward your future self?"
            value={habits.identity_daily_mission_name}
            onChange={(v) => setHabits({ ...habits, identity_daily_mission_name: v })}
            placeholder="e.g., Work on business 2 hours, Write 500 words"
            examples={['Work on business for 2 hours', 'Write 500 words', 'Study for 30 min']}
          />
          <HabitInput
            label="Philosophy Practice"
            sublabel="What daily practice grounds you?"
            value={habits.identity_philosophy_practice_name}
            onChange={(v) => setHabits({ ...habits, identity_philosophy_practice_name: v })}
            placeholder="e.g., Journaling, Meditation, Prayer"
            examples={['Journal for 10 min', 'Meditate 15 min', 'Gratitude practice']}
          />
        </Pillar>

        {/* SAVE */}
        <button
          onClick={saveHabits}
          disabled={saving}
          style={{
            width: '100%',
            padding: 'clamp(14px, 2vw, 16px)',
            background: saving ? 'rgba(255,255,255,0.08)' : '#4ade80',
            color: saving ? 'rgba(255,255,255,0.3)' : '#080c18',
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 12,
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            marginTop: 8,
          }}
        >
          {saving ? 'Saving...' : 'Save Habits'}
        </button>

        <p style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          You can update these anytime. Give each habit at least 30 days before changing.
        </p>

      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Pillar({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{
      marginBottom: 20,
      padding: 'clamp(20px, 3vw, 28px)',
      borderRadius: 16,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 'clamp(16px, 2.5vw, 18px)', fontWeight: 700, color, margin: 0 }}>{title}</h2>
        <span style={{
          fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)', fontWeight: 600,
          padding: '3px 8px', borderRadius: 5,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          Pillar
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {children}
      </div>
    </div>
  );
}

function HabitInput({
  label, sublabel, value, onChange, placeholder, examples,
}: {
  label: string; sublabel: string; value: string;
  onChange: (v: string) => void; placeholder: string; examples: string[];
}) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.82)', marginBottom: 3 }}>{label}</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{sublabel}</p>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '13px 14px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          color: '#fff',
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      <button
        onClick={() => setShowExamples(!showExamples)}
        type="button"
        style={{
          marginTop: 8,
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
          marginTop: 8, padding: '12px 14px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            Examples
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {examples.map((ex, i) => (
              <button
                key={i}
                type="button"
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