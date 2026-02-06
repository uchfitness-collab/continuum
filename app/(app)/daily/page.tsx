'use client';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

const REST_DAY_SCORE = 100;

export default function DailyPage() {
  // Body
  const [physical, setPhysical] = useState(false);
  const [nutrition, setNutrition] = useState(false);
  const [reps, setReps] =
    useState<'below_10' | '25_plus' | '50_plus'>('below_10');

  // Mind
  const [mindPositive, setMindPositive] = useState(false);
  const [mindNegative, setMindNegative] = useState(false);
  const [discipline, setDiscipline] = useState(5);

  // Identity
  const [mission, setMission] = useState(false);
  const [philosophy, setPhilosophy] = useState(false);
  const [mood, setMood] = useState(5);

  const [message, setMessage] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  /* ---------- REST DAY ---------- */
  const submitRestDay = async () => {
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { data: prior } = await supabase
      .from('daily_logs')
      .select('sovereign_score')
      .eq('user_id', data.user.id)
      .lt('log_date', today)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const priorScore = prior?.sovereign_score ?? 150;
    const sovereignScore = priorScore * 0.7 + REST_DAY_SCORE * 0.3;

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: data.user.id,
        log_date: today,
        is_rest_day: true,
        daily_raw_score: REST_DAY_SCORE,
        sovereign_score: sovereignScore,
        sovereign_value: sovereignScore,
        body_score: 0,
        mind_score: 0,
        identity_score: 0,
      },
      { onConflict: 'user_id,log_date' }
    );

    setMessage(error ? error.message : 'Rest day logged.');
  };

  /* ---------- NORMAL DAY ---------- */
  const submitDay = async () => {
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    let bodyScore = (physical ? 20 : 0) + (nutrition ? 20 : 0);
    bodyScore += reps === '50_plus' ? 10 : reps === '25_plus' ? 5 : -5;

    const mindScore =
      (mindPositive ? 20 : 0) +
      (mindNegative ? 20 : 0) +
      discipline;

    const identityScore =
      (mission ? 20 : 0) +
      (philosophy ? 20 : 0) +
      mood;

    const dailyRawScore = bodyScore + mindScore + identityScore;

    const { data: prior } = await supabase
      .from('daily_logs')
      .select('sovereign_score')
      .eq('user_id', data.user.id)
      .lt('log_date', today)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const priorScore = prior?.sovereign_score ?? 150;
    const sovereignScore = priorScore * 0.7 + dailyRawScore * 0.3;

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: data.user.id,
        log_date: today,
        body_physical_activity_completed: physical,
        body_nutritional_discipline_maintained: nutrition,
        body_daily_reps_level: reps,
        mind_negative_habit_avoided: mindNegative,
        mind_positive_habit_completed: mindPositive,
        mind_discipline_rating: discipline,
        identity_daily_mission_completed: mission,
        identity_philosophy_practice_completed: philosophy,
        identity_mood_rating: mood,
        body_score: bodyScore,
        mind_score: mindScore,
        identity_score: identityScore,
        daily_raw_score: dailyRawScore,
        sovereign_score: sovereignScore,
        sovereign_value: sovereignScore,
        is_rest_day: false,
      },
      { onConflict: 'user_id,log_date' }
    );

    setMessage(error ? error.message : 'Daily log submitted.');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '60px 24px',
        background: 'radial-gradient(circle at top, #020617, #01030f)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 760 }}>
        <h1 style={{ fontSize: 30, fontWeight: 600 }}>Daily Log</h1>
        <p style={{ color: '#94a3b8', marginBottom: 32 }}>
          Show up. Record truthfully.
        </p>

        {message && (
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>{message}</p>
        )}

        {/* BODY */}
        <Section title="Body" color="#22c55e">
          <Check label="Physical activity" value={physical} onChange={setPhysical} />
          <Check label="Nutrition discipline" value={nutrition} onChange={setNutrition} />
          <Select value={reps} onChange={setReps} />
        </Section>

        {/* MIND */}
        <Section title="Mind" color="#3b82f6">
          <Check label="Positive habit completed" value={mindPositive} onChange={setMindPositive} />
          <Check label="Negative habit avoided" value={mindNegative} onChange={setMindNegative} />
          <Rating value={discipline} onChange={setDiscipline} />
        </Section>

        {/* IDENTITY */}
        <Section title="Identity" color="#a855f7">
          <Check label="Daily mission completed" value={mission} onChange={setMission} />
          <Check label="Philosophy practiced" value={philosophy} onChange={setPhilosophy} />
          <Rating value={mood} onChange={setMood} />
        </Section>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          <button
            onClick={submitDay}
            style={{
              flex: 1,
              padding: 14,
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              color: '#020617',
              fontWeight: 600,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Submit Day
          </button>

          <button
            onClick={submitRestDay}
            style={{
              flex: 1,
              padding: 14,
              background: '#020617',
              color: '#94a3b8',
              borderRadius: 10,
              border: '1px solid #334155',
              cursor: 'pointer',
            }}
          >
            Log Rest Day
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: 28,
        padding: 24,
        borderRadius: 16,
        background: '#020617',
        boxShadow: `0 0 0 1px ${color}55`,
      }}
    >
      <h2 style={{ color, marginBottom: 14 }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function Check({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ display: 'flex', gap: 10 }}>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function Select({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: any) => void;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: 10,
        borderRadius: 8,
        background: '#020617',
        border: '1px solid #334155',
        color: '#e5e7eb',
      }}
    >
      <option value="below_10">Below 10</option>
      <option value="25_plus">25+</option>
      <option value="50_plus">50+</option>
    </select>
  );
}

function Rating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{
        padding: 10,
        borderRadius: 8,
        background: '#020617',
        border: '1px solid #334155',
        color: '#e5e7eb',
      }}
    >
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
}