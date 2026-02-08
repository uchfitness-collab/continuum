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
      if (!auth.user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', auth.user.id)
        .maybeSingle();

      if (data) {
        setHabits({
          body_physical_activity_name: data.body_physical_activity_name ?? '',
          body_daily_reps_name: data.body_daily_reps_name ?? '',
          body_nutritional_discipline_name: data.body_nutritional_discipline_name ?? '',
          mind_negative_habit_name: data.mind_negative_habit_name ?? '',
          mind_positive_habit_name: data.mind_positive_habit_name ?? '',
          identity_daily_mission_name: data.identity_daily_mission_name ?? '',
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
      .upsert(
        { user_id: auth.user.id, ...habits },
        { onConflict: 'user_id' }
      );

    setSaving(false);
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Habits saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at top, #020617, #01030f)',
      }}>
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 12 }}>
            Your Daily Standards
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6 }}>
            Define the habits you'll track every day. These become your non-negotiables.
          </p>
          <Link 
            href="/guide"
            style={{
              display: 'inline-block',
              marginTop: 12,
              color: '#22c55e',
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Need help? View the habit guide →
          </Link>
        </div>

        {/* MESSAGE */}
        {message && (
          <div style={{
            padding: 16,
            marginBottom: 24,
            borderRadius: 10,
            background: message.type === 'success' ? '#022c22' : '#2c0808',
            border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
            textAlign: 'center',
          }}>
            {message.text}
          </div>
        )}

        {/* BODY PILLAR */}
        <Pillar title="Body" color="#22c55e" icon="💪">
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
            placeholder="e.g., No candy, Avoid alcohol, No fast food"
            examples={['Avoid candy/sweets', 'No soda', 'Avoid fast food', 'No alcohol']}
          />
        </Pillar>

        {/* MIND PILLAR */}
        <Pillar title="Mind" color="#3b82f6" icon="🧠">
          <HabitInput
            label="Negative Habit to Avoid"
            sublabel="What habit are you eliminating?"
            value={habits.mind_negative_habit_name}
            onChange={(v) => setHabits({ ...habits, mind_negative_habit_name: v })}
            placeholder="e.g., Social media over 2 hours, Watching porn"
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

        {/* IDENTITY PILLAR */}
        <Pillar title="Identity" color="#a855f7" icon="⚡">
          <HabitInput
            label="Daily Mission"
            sublabel="What ONE thing moves you toward your future self?"
            value={habits.identity_daily_mission_name}
            onChange={(v) => setHabits({ ...habits, identity_daily_mission_name: v })}
            placeholder="e.g., Work on business 1 hour, Practice guitar 30 min"
            examples={['Work on business for 1 hour', 'Write 500 words', 'Study for 30 min']}
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

        {/* SAVE BUTTON */}
        <button
          onClick={saveHabits}
          disabled={saving}
          style={{
            marginTop: 40,
            width: '100%',
            padding: 16,
            background: saving ? '#94a3b8' : 'linear-gradient(180deg, #22c55e, #16a34a)',
            color: '#020617',
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 10,
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save Habits'}
        </button>

        <p style={{ 
          marginTop: 16, 
          textAlign: 'center', 
          fontSize: 13, 
          color: '#94a3b8' 
        }}>
          You can update these anytime. Give each habit at least 30 days before changing.
        </p>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Pillar({
  title,
  color,
  icon,
  children,
}: {
  title: string;
  color: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      marginBottom: 32,
      padding: 28,
      borderRadius: 16,
      background: '#020617',
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <h2 style={{ fontSize: 22, fontWeight: 600, color, margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {children}
      </div>
    </div>
  );
}

function HabitInput({
  label,
  sublabel,
  value,
  onChange,
  placeholder,
  examples,
}: {
  label: string;
  sublabel: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  examples: string[];
}) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#e5e7eb', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
          {sublabel}
        </div>
      </label>
      
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: 14,
          borderRadius: 10,
          background: '#01030f',
          border: '1px solid #334155',
          color: '#e5e7eb',
          fontSize: 15,
        }}
      />
      
      <button
        onClick={() => setShowExamples(!showExamples)}
        type="button"
        style={{
          marginTop: 8,
          padding: '6px 12px',
          background: 'transparent',
          border: '1px solid #334155',
          borderRadius: 6,
          color: '#94a3b8',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        {showExamples ? 'Hide' : 'Show'} examples
      </button>
      
      {showExamples && (
        <div style={{
          marginTop: 8,
          padding: 12,
          background: '#01030f',
          borderRadius: 8,
          border: '1px solid #334155',
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
            Examples:
          </div>
          <div style={{ fontSize: 13, color: '#e5e7eb', lineHeight: 1.8 }}>
            {examples.map((ex, i) => (
              <div key={i}>• {ex}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}