'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

export default function HabitsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
    setMessage('');
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { error } = await supabase
      .from('user_habits')
      .upsert(
        { user_id: auth.user.id, ...habits },
        { onConflict: 'user_id' }
      );

    setMessage(error ? error.message : 'Habits saved');
  };

  if (loading) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '60px 24px',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        background:
          'radial-gradient(circle at top, #020617 0%, #020617 40%, #01030f 100%)',
      }}
    >
      {/* Continuum watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/continuum-hero.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '420px',
          opacity: 0.04,
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: 760, position: 'relative' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>Habit Definitions</h1>
        <p style={{ color: '#94a3b8', marginTop: 4, marginBottom: 32 }}>
          Define the standards you will be judged by daily.
        </p>

        <Pillar
          title="Body"
          color="#22c55e"
          inputs={[
            ['Physical activity', 'body_physical_activity_name'],
            ['Daily reps', 'body_daily_reps_name'],
            ['Nutrition discipline', 'body_nutritional_discipline_name'],
          ]}
          habits={habits}
          setHabits={setHabits}
        />

        <Pillar
          title="Mind"
          color="#3b82f6"
          inputs={[
            ['Negative habit to avoid', 'mind_negative_habit_name'],
            ['Positive habit to build', 'mind_positive_habit_name'],
          ]}
          habits={habits}
          setHabits={setHabits}
        />

        <Pillar
          title="Identity"
          color="#a855f7"
          inputs={[
            ['Daily mission', 'identity_daily_mission_name'],
            ['Philosophy practice', 'identity_philosophy_practice_name'],
          ]}
          habits={habits}
          setHabits={setHabits}
        />

        <button
          onClick={saveHabits}
          style={{
            marginTop: 36,
            width: '100%',
            padding: 14,
            background: '#22c55e',
            color: '#020617',
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Save Habits
        </button>

        {message && (
          <p style={{ marginTop: 16, color: '#94a3b8' }}>{message}</p>
        )}
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Pillar({
  title,
  color,
  inputs,
  habits,
  setHabits,
}: {
  title: string;
  color: string;
  inputs: [string, keyof typeof habits][];
  habits: any;
  setHabits: any;
}) {
  return (
    <div
      style={{
        marginTop: 28,
        padding: 24,
        borderRadius: 16,
        background: '#020617',
        boxShadow: `0 0 0 1px ${color}40`,
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 600, color, marginBottom: 16 }}>
        {title}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {inputs.map(([label, key]) => (
          <input
            key={key}
            placeholder={label}
            value={habits[key]}
            onChange={e =>
              setHabits({ ...habits, [key]: e.target.value })
            }
            style={{
              padding: 12,
              borderRadius: 10,
              background: '#020617',
              border: '1px solid #1e293b',
              color: '#e5e7eb',
            }}
          />
        ))}
      </div>
    </div>
  );
}