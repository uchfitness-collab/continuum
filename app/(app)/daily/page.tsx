'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabaseClient';

const REST_DAY_SCORE = 100;

/* ---------- EST DATE HELPERS ---------- */

const getESTDate = () => {
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estDate = new Date(estString);
  const year = estDate.getFullYear();
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayESTDate = () => {
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estDate = new Date(estString);
  estDate.setDate(estDate.getDate() - 1);
  const year = estDate.getFullYear();
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getESTDisplayDate = () => {
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estDate = new Date(estString);
  return estDate.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};

const getYesterdayDisplayDate = () => {
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estDate = new Date(estString);
  estDate.setDate(estDate.getDate() - 1);
  return estDate.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};

const getMondayOfWeek = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday.toISOString().split('T')[0];
};

/* ---------- DEFAULT FORM STATE ---------- */
const defaultForm = () => ({
  physical: false,
  nutrition: false,
  reps: 'below_10' as 'below_10' | '25_plus' | '50_plus',
  mindPositive: false,
  mindNegative: false,
  negativeTrigger: 'None',
  discipline: 5,
  mission: false,
  philosophy: false,
  mood: 5,
  dailyNotes: '',
});

export default function DailyPage() {
  const router = useRouter();

  // Which mode: 'today' or 'yesterday'
  const [mode, setMode] = useState<'today' | 'yesterday'>('today');

  // Today form
  const [todayForm, setTodayForm] = useState(defaultForm());
  const [todayLocked, setTodayLocked] = useState(false);
  const [todayLog, setTodayLog] = useState<any>(null);

  // Yesterday form
  const [yesterdayForm, setYesterdayForm] = useState(defaultForm());
  const [yesterdayLocked, setYesterdayLocked] = useState(false);
  const [yesterdayLog, setYesterdayLog] = useState<any>(null);
  const [yesterdayMissed, setYesterdayMissed] = useState(false);

  const [userHabits, setUserHabits] = useState<any>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const today = getESTDate();
  const yesterday = getYesterdayESTDate();
  const displayDate = getESTDisplayDate();
  const yesterdayDisplay = getYesterdayDisplayDate();

  const activeForm = mode === 'today' ? todayForm : yesterdayForm;
  const setActiveForm = mode === 'today'
    ? (fn: any) => setTodayForm(fn)
    : (fn: any) => setYesterdayForm(fn);
  const isLocked = mode === 'today' ? todayLocked : yesterdayLocked;
  const activeLog = mode === 'today' ? todayLog : yesterdayLog;
  const activeDate = mode === 'today' ? today : yesterday;

  useEffect(() => {
    const loadData = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.push('/login'); return; }

      // Load habits
      const { data: habits } = await supabase
        .from('user_habits').select('*')
        .eq('user_id', auth.user.id).maybeSingle();
      setUserHabits(habits);

      // Load weekly goals
      const weekStart = getMondayOfWeek(today);
      const { data: goals } = await supabase
        .from('weekly_goals').select('*')
        .eq('user_id', auth.user.id)
        .eq('week_start_date', weekStart).maybeSingle();
      setWeeklyGoals(goals);

      // Load today's log
      const { data: existingToday } = await supabase
        .from('daily_logs').select('*')
        .eq('user_id', auth.user.id).eq('log_date', today).maybeSingle();

      if (existingToday) {
        setTodayLog(existingToday);
        setTodayLocked(true);
        if (!existingToday.is_rest_day) {
          setTodayForm({
            physical: existingToday.body_physical_activity_completed,
            nutrition: existingToday.body_nutritional_discipline_maintained,
            reps: existingToday.body_daily_reps_level,
            mindPositive: existingToday.mind_positive_habit_completed,
            mindNegative: existingToday.mind_negative_habit_avoided,
            negativeTrigger: existingToday.negative_trigger || 'None',
            discipline: existingToday.mind_discipline_rating,
            mission: existingToday.identity_daily_mission_completed,
            philosophy: existingToday.identity_philosophy_practice_completed,
            mood: existingToday.identity_mood_rating,
            dailyNotes: existingToday.daily_notes || '',
          });
        }
      }

      // Load yesterday's log
      const { data: existingYesterday } = await supabase
        .from('daily_logs').select('*')
        .eq('user_id', auth.user.id).eq('log_date', yesterday).maybeSingle();

      if (existingYesterday) {
        setYesterdayLog(existingYesterday);
        setYesterdayLocked(true);
        if (!existingYesterday.is_rest_day) {
          setYesterdayForm({
            physical: existingYesterday.body_physical_activity_completed,
            nutrition: existingYesterday.body_nutritional_discipline_maintained,
            reps: existingYesterday.body_daily_reps_level,
            mindPositive: existingYesterday.mind_positive_habit_completed,
            mindNegative: existingYesterday.mind_negative_habit_avoided,
            negativeTrigger: existingYesterday.negative_trigger || 'None',
            discipline: existingYesterday.mind_discipline_rating,
            mission: existingYesterday.identity_daily_mission_completed,
            philosophy: existingYesterday.identity_philosophy_practice_completed,
            mood: existingYesterday.identity_mood_rating,
            dailyNotes: existingYesterday.daily_notes || '',
          });
        }
      } else {
        // Yesterday was missed — show the option only if today is logged
        setYesterdayMissed(true);
      }

      setIsLoading(false);
    };

    loadData();
  }, [router, today, yesterday]);

  useEffect(() => {
    if (activeForm.mindNegative) {
      setActiveForm((prev: any) => ({ ...prev, negativeTrigger: 'None' }));
    }
  }, [activeForm.mindNegative]);

  const submitRestDay = async () => {
    if (isLocked) return;
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { data: prior } = await supabase
      .from('daily_logs').select('sovereign_score')
      .eq('user_id', data.user.id)
      .lt('log_date', activeDate)
      .order('log_date', { ascending: false })
      .limit(1).maybeSingle();

    const priorScore = prior?.sovereign_score ?? 150;
    const sovereignScore = priorScore * 0.7 + REST_DAY_SCORE * 0.3;

    const { error } = await supabase.from('daily_logs').insert({
      user_id: data.user.id,
      log_date: activeDate,
      is_rest_day: true,
      daily_raw_score: REST_DAY_SCORE,
      sovereign_score: sovereignScore,
      sovereign_value: sovereignScore,
      body_score: 0, mind_score: 0, identity_score: 0,
      negative_trigger: 'None',
      daily_notes: activeForm.dailyNotes,
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
      setMessage('Rest day logged! Redirecting...');
      if (mode === 'today') { setTodayLocked(true); }
      else { setYesterdayLocked(true); setYesterdayMissed(false); }
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  };

  const submitDay = async () => {
    if (isLocked) return;
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const f = activeForm;
    let bodyScore = (f.physical ? 20 : 0) + (f.nutrition ? 20 : 0);
    bodyScore += f.reps === '50_plus' ? 10 : f.reps === '25_plus' ? 5 : -5;
    const mindScore = (f.mindPositive ? 20 : 0) + (f.mindNegative ? 20 : 0) + f.discipline;
    const identityScore = (f.mission ? 20 : 0) + (f.philosophy ? 20 : 0) + f.mood;
    const dailyRawScore = bodyScore + mindScore + identityScore;

    const { data: prior } = await supabase
      .from('daily_logs').select('sovereign_score')
      .eq('user_id', data.user.id)
      .lt('log_date', activeDate)
      .order('log_date', { ascending: false })
      .limit(1).maybeSingle();

    const priorScore = prior?.sovereign_score ?? 150;
    const sovereignScore = priorScore * 0.7 + dailyRawScore * 0.3;

    const { error } = await supabase.from('daily_logs').insert({
      user_id: data.user.id,
      log_date: activeDate,
      body_physical_activity_completed: f.physical,
      body_nutritional_discipline_maintained: f.nutrition,
      body_daily_reps_level: f.reps,
      mind_negative_habit_avoided: f.mindNegative,
      mind_positive_habit_completed: f.mindPositive,
      mind_discipline_rating: f.discipline,
      negative_trigger: f.negativeTrigger,
      identity_daily_mission_completed: f.mission,
      identity_philosophy_practice_completed: f.philosophy,
      identity_mood_rating: f.mood,
      body_score: bodyScore,
      mind_score: mindScore,
      identity_score: identityScore,
      daily_raw_score: dailyRawScore,
      sovereign_score: sovereignScore,
      sovereign_value: sovereignScore,
      is_rest_day: false,
      daily_notes: f.dailyNotes,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Log submitted! Redirecting...');
      if (mode === 'today') { setTodayLocked(true); }
      else { setYesterdayLocked(true); setYesterdayMissed(false); }
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at top, #020617, #01030f)' }}>
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      </div>
    );
  }

  if (!userHabits) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at top, #020617, #01030f)', padding: 24 }}>
        <div style={{ maxWidth: 500, padding: 40, background: '#020617', borderRadius: 16, border: '1px solid #ef4444', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, marginBottom: 16, color: '#ef4444' }}>No Habits Defined</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>You need to define your daily habits before you can start logging.</p>
          <Link href="/habits" style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(180deg, #22c55e, #16a34a)', color: '#020617', fontWeight: 600, borderRadius: 8, textDecoration: 'none' }}>
            Set Up Habits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '60px 24px', background: 'radial-gradient(circle at top, #020617, #01030f)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>Daily Log</h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            {isLocked ? `${mode === 'today' ? "Today's" : "Yesterday's"} log is complete ✓` : 'Show up. Record truthfully.'}
          </p>
        </div>

        {/* TAB SWITCHER — only show yesterday tab if today is logged AND yesterday was missed */}
        {todayLocked && yesterdayMissed && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            <button
              onClick={() => { setMode('today'); setMessage(null); }}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 15,
                background: mode === 'today' ? 'linear-gradient(180deg, #22c55e, #16a34a)' : 'transparent',
                color: mode === 'today' ? '#020617' : '#94a3b8',
                border: mode === 'today' ? 'none' : '1px solid #334155',
                cursor: 'pointer',
              }}
            >
              Today ✓
            </button>
            <button
              onClick={() => { setMode('yesterday'); setMessage(null); }}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10, fontWeight: 600, fontSize: 15,
                background: mode === 'yesterday' ? 'linear-gradient(180deg, #f59e0b, #d97706)' : 'transparent',
                color: mode === 'yesterday' ? '#020617' : '#f59e0b',
                border: mode === 'yesterday' ? 'none' : '1px solid #f59e0b40',
                cursor: 'pointer',
              }}
            >
              ⚠️ Log Yesterday
            </button>
          </div>
        )}

        {/* DATE DISPLAY */}
        <div style={{ marginBottom: 24, color: '#94a3b8', fontSize: 14 }}>
          📅 {mode === 'today' ? displayDate : yesterdayDisplay} (EST)
          {mode === 'yesterday' && (
            <span style={{ marginLeft: 8, color: '#f59e0b', fontWeight: 600 }}>— Missed Day</span>
          )}
        </div>

        {/* WEEKLY GOALS REMINDER */}
        {weeklyGoals && (weeklyGoals.goal1 || weeklyGoals.goal2 || weeklyGoals.goal3) && (
          <div style={{ padding: 20, marginBottom: 32, borderRadius: 12, background: '#2c1810', border: '1px solid #fbbf24' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🎯</span>
              <h3 style={{ color: '#fbbf24', margin: 0, fontSize: 16, fontWeight: 600 }}>This Week's Goals</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {weeklyGoals.goal1 && <div style={{ color: '#e5e7eb', fontSize: 14, display: 'flex', alignItems: 'start', gap: 8 }}><span style={{ color: '#fbbf24', flexShrink: 0 }}>•</span><span>{weeklyGoals.goal1}</span></div>}
              {weeklyGoals.goal2 && <div style={{ color: '#e5e7eb', fontSize: 14, display: 'flex', alignItems: 'start', gap: 8 }}><span style={{ color: '#fbbf24', flexShrink: 0 }}>•</span><span>{weeklyGoals.goal2}</span></div>}
              {weeklyGoals.goal3 && <div style={{ color: '#e5e7eb', fontSize: 14, display: 'flex', alignItems: 'start', gap: 8 }}><span style={{ color: '#fbbf24', flexShrink: 0 }}>•</span><span>{weeklyGoals.goal3}</span></div>}
            </div>
            <Link href="/goals" style={{ marginTop: 12, display: 'inline-block', fontSize: 13, color: '#fbbf24', textDecoration: 'underline' }}>Update goals →</Link>
          </div>
        )}

        {/* COMPLETED SCORES */}
        {isLocked && activeLog && (
          <div style={{ padding: 24, marginBottom: 32, borderRadius: 12, background: '#022c22', border: '1px solid #22c55e' }}>
            <h3 style={{ color: '#22c55e', marginBottom: 16, fontSize: 18 }}>
              {mode === 'today' ? "Today's" : "Yesterday's"} Results
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16 }}>
              <ScorePill label="Body" value={activeLog.body_score} color="#22c55e" />
              <ScorePill label="Mind" value={activeLog.mind_score} color="#3b82f6" />
              <ScorePill label="Identity" value={activeLog.identity_score} color="#a855f7" />
              <ScorePill label="Sovereign" value={activeLog.sovereign_score.toFixed(1)} color="#fbbf24" large />
            </div>
            {activeLog.is_rest_day && <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14, textAlign: 'center' }}>Rest Day</p>}
          </div>
        )}

        {message && (
          <div style={{ padding: 16, marginBottom: 24, borderRadius: 10, background: isLocked ? '#022c22' : '#020617', border: `1px solid ${isLocked ? '#22c55e' : '#334155'}`, color: isLocked ? '#22c55e' : '#e5e7eb', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {/* BODY PILLAR */}
        <Pillar title="Body" color="#22c55e" icon="💪">
          <HabitCheck label={userHabits.body_physical_activity_name || 'Physical activity'} value={activeForm.physical} onChange={(v) => setActiveForm((p: any) => ({ ...p, physical: v }))} disabled={isLocked} />
          <HabitCheck label={userHabits.body_nutritional_discipline_name || 'Nutrition discipline'} value={activeForm.nutrition} onChange={(v) => setActiveForm((p: any) => ({ ...p, nutrition: v }))} disabled={isLocked} />
          <HabitSelect
            label={`${userHabits.body_daily_reps_name || 'Daily reps'} completed`}
            value={activeForm.reps}
            onChange={(v) => setActiveForm((p: any) => ({ ...p, reps: v }))}
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
          <HabitCheck label={userHabits.mind_positive_habit_name || 'Positive habit completed'} value={activeForm.mindPositive} onChange={(v) => setActiveForm((p: any) => ({ ...p, mindPositive: v }))} disabled={isLocked} />
          <HabitCheck label={`Avoided: ${userHabits.mind_negative_habit_name || 'negative habit'}`} value={activeForm.mindNegative} onChange={(v) => setActiveForm((p: any) => ({ ...p, mindNegative: v }))} disabled={isLocked} />
          {!activeForm.mindNegative && (
            <HabitSelect
              label="What triggered the slip-up?"
              value={activeForm.negativeTrigger}
              onChange={(v) => setActiveForm((p: any) => ({ ...p, negativeTrigger: v }))}
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
          <HabitRating label="Discipline rating (1-10)" sublabel="How disciplined were you today?" value={activeForm.discipline} onChange={(v) => setActiveForm((p: any) => ({ ...p, discipline: v }))} disabled={isLocked} />
        </Pillar>

        {/* IDENTITY PILLAR */}
        <Pillar title="Identity" color="#a855f7" icon="⚡">
          <HabitCheck label={userHabits.identity_daily_mission_name || 'Daily mission completed'} value={activeForm.mission} onChange={(v) => setActiveForm((p: any) => ({ ...p, mission: v }))} disabled={isLocked} />
          <HabitCheck label={userHabits.identity_philosophy_practice_name || 'Philosophy practiced'} value={activeForm.philosophy} onChange={(v) => setActiveForm((p: any) => ({ ...p, philosophy: v }))} disabled={isLocked} />
          <HabitRating label="Mood rating (1-10)" sublabel="How was your mood today?" value={activeForm.mood} onChange={(v) => setActiveForm((p: any) => ({ ...p, mood: v }))} disabled={isLocked} />
        </Pillar>

        {/* DAILY JOURNAL */}
        <Pillar title="Daily Notes" color="#fbbf24" icon="📝">
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: '#e5e7eb', marginBottom: 4 }}>What happened {mode === 'yesterday' ? 'yesterday' : 'today'}? (Optional)</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Capture wins, struggles, or context. This helps you spot patterns.</div>
            </label>
            <textarea
              value={activeForm.dailyNotes}
              onChange={(e) => setActiveForm((p: any) => ({ ...p, dailyNotes: e.target.value }))}
              disabled={isLocked}
              placeholder="e.g., Crushed the gym, felt unstoppable. Had a stressful work call in the afternoon."
              rows={4}
              style={{ width: '100%', padding: 14, borderRadius: 10, background: '#01030f', border: '1px solid #334155', color: '#e5e7eb', fontSize: 15, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', cursor: isLocked ? 'not-allowed' : 'text', opacity: isLocked ? 0.6 : 1 }}
            />
          </div>
        </Pillar>

        {/* BUTTONS */}
        {!isLocked ? (
          <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
            <button onClick={submitDay} style={{ flex: 1, padding: 16, background: 'linear-gradient(180deg, #22c55e, #16a34a)', color: '#020617', fontWeight: 600, fontSize: 16, borderRadius: 10, border: 'none', cursor: 'pointer' }}>
              Submit {mode === 'yesterday' ? 'Yesterday' : 'Day'}
            </button>
            <button onClick={submitRestDay} style={{ flex: 1, padding: 16, background: 'transparent', color: '#94a3b8', fontWeight: 600, fontSize: 16, borderRadius: 10, border: '1px solid #334155', cursor: 'pointer' }}>
              Log Rest Day
            </button>
          </div>
        ) : (
          <button onClick={() => router.push('/dashboard')} style={{ width: '100%', padding: 16, marginTop: 40, background: 'linear-gradient(180deg, #22c55e, #16a34a)', color: '#020617', fontWeight: 600, fontSize: 16, borderRadius: 10, border: 'none', cursor: 'pointer' }}>
            View Dashboard
          </button>
        )}

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
          {!isLocked && 'Log locks after submission. Be honest.'}
          {isLocked && mode === 'today' && 'Your log resets at 12:01 AM EST. Come back tomorrow.'}
          {isLocked && mode === 'yesterday' && 'Yesterday\'s log is complete.'}
        </p>

      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Pillar({ title, color, icon, children }: { title: string; color: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28, padding: 28, borderRadius: 16, background: '#020617', border: `1px solid ${color}30`, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h2 style={{ color, margin: 0, fontSize: 20, fontWeight: 600 }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  );
}

function HabitCheck({ label, value, onChange, disabled }: { label: string; value: boolean; onChange: (v: boolean) => void; disabled: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#01030f', borderRadius: 10, border: `1px solid ${value ? '#22c55e40' : '#334155'}`, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} style={{ width: 18, height: 18, cursor: disabled ? 'not-allowed' : 'pointer' }} />
      <span style={{ fontSize: 15, color: '#e5e7eb' }}>{label}</span>
    </label>
  );
}

function HabitSelect({ label, value, onChange, disabled, options }: { label: string; value: string; onChange: (v: any) => void; disabled: boolean; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#94a3b8' }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} style={{ width: '100%', padding: 14, borderRadius: 10, background: '#01030f', border: '1px solid #334155', color: '#e5e7eb', fontSize: 15, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function HabitRating({ label, sublabel, value, onChange, disabled }: { label: string; sublabel: string; value: number; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <div style={{ fontSize: 14, color: '#e5e7eb', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>{sublabel}</div>
      </label>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} disabled={disabled} style={{ width: '100%', padding: 14, borderRadius: 10, background: '#01030f', border: '1px solid #334155', color: '#e5e7eb', fontSize: 15, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}>
        {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </div>
  );
}

function ScorePill({ label, value, color, large = false }: { label: string; value: any; color: string; large?: boolean }) {
  return (
    <div style={{ padding: large ? 16 : 12, background: '#01030f', borderRadius: 10, border: `1px solid ${color}40`, textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: large ? 24 : 20, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}