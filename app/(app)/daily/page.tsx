'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [negativeTrigger, setNegativeTrigger] = useState('None');
  const [discipline, setDiscipline] = useState(5);

  // Identity
  const [mission, setMission] = useState(false);
  const [philosophy, setPhilosophy] = useState(false);
  const [mood, setMood] = useState(5);

  // Journal
  const [dailyNotes, setDailyNotes] = useState('');

  // User habits
  const [userHabits, setUserHabits] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayLog, setTodayLog] = useState<any>(null);
  
  const today = new Date().toISOString().split('T')[0];

  // Load user's habits and check if today's log exists
  useEffect(() => {
    const loadData = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push('/login');
        return;
      }

      // Load user's habit definitions
      const { data: habits } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', auth.user.id)
        .maybeSingle();

      setUserHabits(habits);

      // Check if today's log exists
      const { data: existingLog } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', auth.user.id)
        .eq('log_date', today)
        .maybeSingle();

      if (existingLog) {
        setTodayLog(existingLog);
        setIsLocked(true);
        
        if (!existingLog.is_rest_day) {
          setPhysical(existingLog.body_physical_activity_completed);
          setNutrition(existingLog.body_nutritional_discipline_maintained);
          setReps(existingLog.body_daily_reps_level);
          setMindPositive(existingLog.mind_positive_habit_completed);
          setMindNegative(existingLog.mind_negative_habit_avoided);
          setNegativeTrigger(existingLog.negative_trigger || 'None');
          setDiscipline(existingLog.mind_discipline_rating);
          setMission(existingLog.identity_daily_mission_completed);
          setPhilosophy(existingLog.identity_philosophy_practice_completed);
          setMood(existingLog.identity_mood_rating);
          setDailyNotes(existingLog.daily_notes || '');
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [router, today]);

  // Auto-set trigger based on mindNegative
  useEffect(() => {
    if (mindNegative) {
      setNegativeTrigger('None');
    }
  }, [mindNegative]);

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
      negative_trigger: 'None',
      daily_notes: dailyNotes,
      // ADD THESE REQUIRED FIELDS:
      body_physical_activity_completed: false,
      body_nutritional_discipline_maintained: false,
      body_daily_reps_level: 'below_10',
      mind_positive_habit_completed: false,
      mind_negative_habit_avoided: false,
      mind_discipline_rating: 5,
      identity_daily_mission_completed: false,
      identity_philosophy_practice_completed: false,
      identity_mood_rating: 5,
    });
  
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Rest day logged successfully! Redirecting...');
      setIsLocked(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  };

  const submitDay = async () => {
    if (isLocked) return;
    
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    let bodyScore = (physical ? 20 : 0) + (nutrition ? 20 : 0);
    bodyScore += reps === '50_plus' ? 10 : reps === '25_plus' ? 5 : -5;

    const mindScore = (mindPositive ? 20 : 0) + (mindNegative ? 20 : 0) + discipline;
    const identityScore = (mission ? 20 : 0) + (philosophy ? 20 : 0) + mood;
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
      negative_trigger: negativeTrigger,
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
      daily_notes: dailyNotes,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Daily log submitted successfully! Redirecting...');
      setIsLocked(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  };

  if (isLoading) {
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

  // Show message if no habits defined
  if (!userHabits) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at top, #020617, #01030f)',
        padding: 24,
      }}>
        <div style={{
          maxWidth: 500,
          padding: 40,
          background: '#020617',
          borderRadius: 16,
          border: '1px solid #ef4444',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: '#ef4444' }}>
            No Habits Defined
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
            You need to define your daily habits before you can start logging.
          </p>
          <Link
            href="/habits"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              color: '#020617',
              fontWeight: 600,
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Set Up Habits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>
            Daily Log
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            {isLocked ? "Today's log is complete ✓" : 'Show up. Record truthfully.'}
          </p>
        </div>

        {/* COMPLETED SCORES */}
        {isLocked && todayLog && (
          <div style={{
            padding: 24,
            marginBottom: 32,
            borderRadius: 12,
            background: '#022c22',
            border: '1px solid #22c55e',
          }}>
            <h3 style={{ color: '#22c55e', marginBottom: 16, fontSize: 18 }}>
              Today's Results
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
              gap: 16 
            }}>
              <ScorePill label="Body" value={todayLog.body_score} color="#22c55e" />
              <ScorePill label="Mind" value={todayLog.mind_score} color="#3b82f6" />
              <ScorePill label="Identity" value={todayLog.identity_score} color="#a855f7" />
              <ScorePill 
                label="Sovereign" 
                value={todayLog.sovereign_score.toFixed(1)} 
                color="#fbbf24" 
                large 
              />
            </div>
            {todayLog.is_rest_day && (
              <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14, textAlign: 'center' }}>
                Rest Day
              </p>
            )}
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <div style={{
            padding: 16,
            marginBottom: 24,
            borderRadius: 10,
            background: isLocked ? '#022c22' : '#020617',
            border: `1px solid ${isLocked ? '#22c55e' : '#334155'}`,
            color: isLocked ? '#22c55e' : '#e5e7eb',
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

        {/* BODY PILLAR */}
        <Pillar title="Body" color="#22c55e" icon="💪">
          <HabitCheck
            label={userHabits.body_physical_activity_name || 'Physical activity'}
            value={physical}
            onChange={setPhysical}
            disabled={isLocked}
          />
          <HabitCheck
            label={userHabits.body_nutritional_discipline_name || 'Nutrition discipline'}
            value={nutrition}
            onChange={setNutrition}
            disabled={isLocked}
          />
          <HabitSelect
            label={`${userHabits.body_daily_reps_name || 'Daily reps'} completed`}
            value={reps}
            onChange={setReps}
            disabled={isLocked}
            options={[
              { value: 'below_10', label: 'Below 10 (-5 pts)' },
              { value: '25_plus', label: '25+ reps (+5 pts)' },
              { value: '50_plus', label: '50+ reps (+10 pts)' },
            ]}
          />
        </Pillar>

        {/* MIND PILLAR */}
        <Pillar title="Mind" color="#3b82f6" icon="🧠">
          <HabitCheck
            label={userHabits.mind_positive_habit_name || 'Positive habit completed'}
            value={mindPositive}
            onChange={setMindPositive}
            disabled={isLocked}
          />
          <HabitCheck
            label={`Avoided: ${userHabits.mind_negative_habit_name || 'negative habit'}`}
            value={mindNegative}
            onChange={setMindNegative}
            disabled={isLocked}
          />
          
          {/* TRIGGER DROPDOWN - Only show if they didn't avoid the habit */}
          {!mindNegative && (
            <HabitSelect
              label="What triggered the slip-up?"
              value={negativeTrigger}
              onChange={setNegativeTrigger}
              disabled={isLocked}
              options={[
                { value: 'Social Media', label: 'Social Media' },
                { value: 'Boredom', label: 'Boredom' },
                { value: 'Stress', label: 'Stress' },
                { value: 'Fatigue', label: 'Fatigue' },
                { value: 'Hunger', label: 'Hunger' },
                { value: 'Peer Pressure', label: 'Peer Pressure' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          )}

          <HabitRating
            label="Discipline rating (1-10)"
            sublabel="How disciplined were you today?"
            value={discipline}
            onChange={setDiscipline}
            disabled={isLocked}
          />
        </Pillar>

        {/* IDENTITY PILLAR */}
        <Pillar title="Identity" color="#a855f7" icon="⚡">
          <HabitCheck
            label={userHabits.identity_daily_mission_name || 'Daily mission completed'}
            value={mission}
            onChange={setMission}
            disabled={isLocked}
          />
          <HabitCheck
            label={userHabits.identity_philosophy_practice_name || 'Philosophy practiced'}
            value={philosophy}
            onChange={setPhilosophy}
            disabled={isLocked}
          />
          <HabitRating
            label="Mood rating (1-10)"
            sublabel="How was your mood today?"
            value={mood}
            onChange={setMood}
            disabled={isLocked}
          />
        </Pillar>

        {/* DAILY JOURNAL */}
        <Pillar title="Daily Notes" color="#fbbf24" icon="📝">
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: '#e5e7eb', marginBottom: 4 }}>
                What happened today? (Optional)
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
                Capture wins, struggles, or context. This helps you spot patterns.
              </div>
            </label>
            <textarea
              value={dailyNotes}
              onChange={(e) => setDailyNotes(e.target.value)}
              disabled={isLocked}
              placeholder="e.g., Crushed the gym, felt unstoppable. Had a stressful work call in the afternoon."
              rows={4}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 10,
                background: '#01030f',
                border: '1px solid #334155',
                color: '#e5e7eb',
                fontSize: 15,
                lineHeight: 1.6,
                resize: 'vertical',
                fontFamily: 'inherit',
                cursor: isLocked ? 'not-allowed' : 'text',
                opacity: isLocked ? 0.6 : 1,
              }}
            />
          </div>
        </Pillar>

        {/* BUTTONS */}
        {!isLocked ? (
          <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
            <button
              onClick={submitDay}
              style={{
                flex: 1,
                padding: 16,
                background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                color: '#020617',
                fontWeight: 600,
                fontSize: 16,
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
                padding: 16,
                background: 'transparent',
                color: '#94a3b8',
                fontWeight: 600,
                fontSize: 16,
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
              padding: 16,
              marginTop: 40,
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              color: '#020617',
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            View Dashboard
          </button>
        )}

        <p style={{
          marginTop: 16,
          textAlign: 'center',
          fontSize: 13,
          color: '#94a3b8',
        }}>
          {!isLocked && 'Log locks after submission. Be honest.'}
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
      marginBottom: 28,
      padding: 28,
      borderRadius: 16,
      background: '#020617',
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h2 style={{ color, margin: 0, fontSize: 20, fontWeight: 600 }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

function HabitCheck({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled: boolean;
}) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      background: '#01030f',
      borderRadius: 10,
      border: `1px solid ${value ? '#22c55e40' : '#334155'}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
    }}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        style={{ width: 18, height: 18, cursor: disabled ? 'not-allowed' : 'pointer' }}
      />
      <span style={{ fontSize: 15, color: '#e5e7eb' }}>{label}</span>
    </label>
  );
}

function HabitSelect({
  label,
  value,
  onChange,
  disabled,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: any) => void;
  disabled: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: 8,
        fontSize: 14,
        color: '#94a3b8',
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: 14,
          borderRadius: 10,
          background: '#01030f',
          border: '1px solid #334155',
          color: '#e5e7eb',
          fontSize: 15,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function HabitRating({
  label,
  sublabel,
  value,
  onChange,
  disabled,
}: {
  label: string;
  sublabel: string;
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <div style={{ fontSize: 14, color: '#e5e7eb', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>{sublabel}</div>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{
          width: '100%',
          padding: 14,
          borderRadius: 10,
          background: '#01030f',
          border: '1px solid #334155',
          color: '#e5e7eb',
          fontSize: 15,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

function ScorePill({
  label,
  value,
  color,
  large = false,
}: {
  label: string;
  value: any;
  color: string;
  large?: boolean;
}) {
  return (
    <div style={{
      padding: large ? 16 : 12,
      background: '#01030f',
      borderRadius: 10,
      border: `1px solid ${color}40`,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontSize: large ? 24 : 20,
        fontWeight: 600,
        color,
      }}>
        {value}
      </div>
    </div>
  );
}