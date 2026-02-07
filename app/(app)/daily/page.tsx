'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

const REST_DAY_SCORE = 100;

export default function DailyPage() {
  const router = useRouter();
  
  // Body
  const [physical, setPhysical] = useState(false);
  const [nutrition, setNutrition] = useState(false);
  const [reps, setReps] = useState<'below_10' | '25_plus' | '50_plus'>('below_10');

  // Mind
  const [mindPositive, setMindPositive] = useState(false);
  const [mindNegative, setMindNegative] = useState(false);
  const [discipline, setDiscipline] = useState(5);

  // Identity
  const [mission, setMission] = useState(false);
  const [philosophy, setPhilosophy] = useState(false);
  const [mood, setMood] = useState(5);

  const [message, setMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayLog, setTodayLog] = useState<any>(null);
  
  const today = new Date().toISOString().split('T')[0];

  // Check if today's log already exists
  useEffect(() => {
    const checkTodayLog = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push('/login');
        return;
      }

      const { data: existingLog } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', auth.user.id)
        .eq('log_date', today)
        .maybeSingle();

      if (existingLog) {
        setTodayLog(existingLog);
        setIsLocked(true);
        
        // Load the existing values into the form (so user can see what they logged)
        if (!existingLog.is_rest_day) {
          setPhysical(existingLog.body_physical_activity_completed);
          setNutrition(existingLog.body_nutritional_discipline_maintained);
          setReps(existingLog.body_daily_reps_level);
          setMindPositive(existingLog.mind_positive_habit_completed);
          setMindNegative(existingLog.mind_negative_habit_avoided);
          setDiscipline(existingLog.mind_discipline_rating);
          setMission(existingLog.identity_daily_mission_completed);
          setPhilosophy(existingLog.identity_philosophy_practice_completed);
          setMood(existingLog.identity_mood_rating);
        }
      }
      
      setIsLoading(false);
    };

    checkTodayLog();
  }, [router, today]);

  /* ---------- REST DAY ---------- */
  const submitRestDay = async () => {
    if (isLocked) return;
    
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

    const { error } = await supabase.from('daily_logs').insert({
      user_id: data.user.id,
      log_date: today,
      is_rest_day: true,
      daily_raw_score: REST_DAY_SCORE,
      sovereign_score: sovereignScore,
      sovereign_value: sovereignScore,
      body_score: 0,
      mind_score: 0,
      identity_score: 0,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Rest day logged successfully!');
      setIsLocked(true);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  };

  /* ---------- NORMAL DAY ---------- */
  const submitDay = async () => {
    if (isLocked) return;
    
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

    const { error } = await supabase.from('daily_logs').insert({
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
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Daily log submitted successfully!');
      setIsLocked(true);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '60px 24px',
        background: 'radial-gradient(circle at top, #020617, #01030f)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      </div>
    );
  }

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
          {isLocked ? 'Today\'s log is complete ✓' : 'Show up. Record truthfully.'}
        </p>

        {isLocked && todayLog && (
          <div style={{
            padding: 20,
            marginBottom: 24,
            borderRadius: 12,
            background: '#022c22',
            border: '1px solid #22c55e',
          }}>
            <h3 style={{ color: '#22c55e', marginBottom: 12 }}>Today's Scores</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, color: '#e5e7eb' }}>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Body</div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{todayLog.body_score}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Mind</div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{todayLog.mind_score}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Identity</div>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{todayLog.identity_score}</div>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #334155' }}>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>Sovereign Score</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#22c55e' }}>
                {todayLog.sovereign_score.toFixed(1)}
              </div>
            </div>
            {todayLog.is_rest_day && (
              <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14 }}>
                (Rest Day)
              </p>
            )}
          </div>
        )}

        {message && (
          <p style={{ 
            color: isLocked ? '#22c55e' : '#94a3b8', 
            marginBottom: 20,
            padding: 12,
            background: isLocked ? '#022c22' : '#020617',
            borderRadius: 8,
            border: isLocked ? '1px solid #22c55e' : '1px solid #334155'
          }}>
            {message}
          </p>
        )}

        {/* BODY */}
        <Section title="Body" color="#22c55e">
          <Check label="Physical activity" value={physical} onChange={setPhysical} disabled={isLocked} />
          <Check label="Nutrition discipline" value={nutrition} onChange={setNutrition} disabled={isLocked} />
          <Select value={reps} onChange={setReps} disabled={isLocked} />
        </Section>

        {/* MIND */}
        <Section title="Mind" color="#3b82f6">
          <Check label="Positive habit completed" value={mindPositive} onChange={setMindPositive} disabled={isLocked} />
          <Check label="Negative habit avoided" value={mindNegative} onChange={setMindNegative} disabled={isLocked} />
          <Rating value={discipline} onChange={setDiscipline} disabled={isLocked} />
        </Section>

        {/* IDENTITY */}
        <Section title="Identity" color="#a855f7">
          <Check label="Daily mission completed" value={mission} onChange={setMission} disabled={isLocked} />
          <Check label="Philosophy practiced" value={philosophy} onChange={setPhilosophy} disabled={isLocked} />
          <Rating value={mood} onChange={setMood} disabled={isLocked} />
        </Section>

        {/* BUTTONS */}
        {!isLocked ? (
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
        ) : (
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              width: '100%',
              padding: 14,
              marginTop: 40,
              background: '#334155',
              color: '#e5e7eb',
              fontWeight: 600,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            View Dashboard
          </button>
        )}
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
  disabled = false,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label style={{ display: 'flex', gap: 10, opacity: disabled ? 0.5 : 1 }}>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label}
    </label>
  );
}

function Select({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (v: any) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        padding: 10,
        borderRadius: 8,
        background: '#020617',
        border: '1px solid #334155',
        color: '#e5e7eb',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
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
  disabled = false,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      disabled={disabled}
      style={{
        padding: 10,
        borderRadius: 8,
        background: '#020617',
        border: '1px solid #334155',
        color: '#e5e7eb',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
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