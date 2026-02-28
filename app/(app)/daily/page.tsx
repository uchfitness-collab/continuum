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

const getESTDisplayDate = (dateStr?: string) => {
  if (dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estDate = new Date(estString);
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

/* ---------- Default form state ---------- */
const defaultFormState = () => ({
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

  const today = getESTDate();
  const yesterday = getYesterdayESTDate();

  // Which day we're logging
  const [activeTab, setActiveTab] = useState<'today' | 'yesterday'>('today');
  const activeDate = activeTab === 'today' ? today : yesterday;

  // Today form
  const [todayForm, setTodayForm] = useState(defaultFormState());
  const [todayLog, setTodayLog] = useState<any>(null);
  const [isTodayLocked, setIsTodayLocked] = useState(false);

  // Yesterday form
  const [yesterdayForm, setYesterdayForm] = useState(defaultFormState());
  const [yesterdayLog, setYesterdayLog] = useState<any>(null);
  const [isYesterdayLocked, setIsYesterdayLocked] = useState(false);
  const [showYesterdayTab, setShowYesterdayTab] = useState(false);

  // Shared
  const [userHabits, setUserHabits] = useState<any>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLocked = activeTab === 'today' ? isTodayLocked : isYesterdayLocked;
  const currentLog = activeTab === 'today' ? todayLog : yesterdayLog;
  const form = activeTab === 'today' ? todayForm : yesterdayForm;
  const setForm = (updater: (prev: ReturnType<typeof defaultFormState>) => ReturnType<typeof defaultFormState>) => {
    if (activeTab === 'today') setTodayForm(updater);
    else setYesterdayForm(updater);
  };

  useEffect(() => {
    const loadData = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.push('/login'); return; }

      const { data: habits } = await supabase
        .from('user_habits').select('*').eq('user_id', auth.user.id).maybeSingle();
      setUserHabits(habits);

      const weekStart = getMondayOfWeek(today);
      const { data: goals } = await supabase
        .from('weekly_goals').select('*')
        .eq('user_id', auth.user.id).eq('week_start_date', weekStart).maybeSingle();
      setWeeklyGoals(goals);

      // Load today's log
      const { data: existingToday } = await supabase
        .from('daily_logs').select('*')
        .eq('user_id', auth.user.id).eq('log_date', today).maybeSingle();

      if (existingToday) {
        setTodayLog(existingToday);
        setIsTodayLocked(true);
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
        setIsYesterdayLocked(true);
        setShowYesterdayTab(true);
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
        // Yesterday is missing — show tab so they can fill it in
        setShowYesterdayTab(true);
      }

      setIsLoading(false);
    };

    loadData();
  }, [router, today, yesterday]);

  useEffect(() => {
    if (form.mindNegative) {
      setForm((prev) => ({ ...prev, negativeTrigger: 'None' }));
    }
  }, [form.mindNegative]);

  const submitRestDay = async () => {
    if (isLocked) return;
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { data: prior } = await supabase
      .from('daily_logs').select('sovereign_score')
      .eq('user_id', data.user.id).lt('log_date', activeDate)
      .order('log_date', { ascending: false }).limit(1).maybeSingle();

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
      daily_notes: form.dailyNotes,
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
      setMessage('Rest day logged successfully!');
      if (activeTab === 'today') {
        setIsTodayLocked(true);
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setIsYesterdayLocked(true);
        setTimeout(() => setActiveTab('today'), 1500);
      }
    }
  };

  const submitDay = async () => {
    if (isLocked) return;
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    let bodyScore = (form.physical ? 20 : 0) + (form.nutrition ? 20 : 0);
    bodyScore += form.reps === '50_plus' ? 10 : form.reps === '25_plus' ? 5 : -5;
    const mindScore = (form.mindPositive ? 20 : 0) + (form.mindNegative ? 20 : 0) + form.discipline;
    const identityScore = (form.mission ? 20 : 0) + (form.philosophy ? 20 : 0) + form.mood;
    const dailyRawScore = bodyScore + mindScore + identityScore;

    const { data: prior } = await supabase
      .from('daily_logs').select('sovereign_score')
      .eq('user_id', data.user.id).lt('log_date', activeDate)
      .order('log_date', { ascending: false }).limit(1).maybeSingle();

    const priorScore = prior?.sovereign_score ?? 150;
    const sovereignScore = priorScore * 0.7 + dailyRawScore * 0.3;

    const { error } = await supabase.from('daily_logs').insert({
      user_id: data.user.id,
      log_date: activeDate,
      body_physical_activity_completed: form.physical,
      body_nutritional_discipline_maintained: form.nutrition,
      body_daily_reps_level: form.reps,
      mind_negative_habit_avoided: form.mindNegative,
      mind_positive_habit_completed: form.mindPositive,
      mind_discipline_rating: form.discipline,
      negative_trigger: form.negativeTrigger,
      identity_daily_mission_completed: form.mission,
      identity_philosophy_practice_completed: form.philosophy,
      identity_mood_rating: form.mood,
      body_score: bodyScore,
      mind_score: mindScore,
      identity_score: identityScore,
      daily_raw_score: dailyRawScore,
      sovereign_score: sovereignScore,
      sovereign_value: sovereignScore,
      is_rest_day: false,
      daily_notes: form.dailyNotes,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Daily log submitted successfully!');
      if (activeTab === 'today') {
        setIsTodayLocked(true);
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setIsYesterdayLocked(true);
        setTimeout(() => setActiveTab('today'), 1500);
      }
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
            {isLocked ? `${activeTab === 'yesterday' ? "Yesterday's" : "Today's"} log is complete ✓` : 'Show up. Record truthfully.'}
          </p>
        </div>

        {/* DATE TABS — only show if yesterday tab is relevant */}
        {showYesterdayTab && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            <button
              onClick={() => { setActiveTab('today'); setMessage(null); }}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                background: activeTab === 'today' ? '#22c55e' : '#01030f',
                color: activeTab === 'today' ? '#020617' : '#94a3b8',
                border: activeTab === 'today' ? '1px solid #22c55e' : '1px solid #334155',
                transition: 'all 0.15s ease',
              }}
            >
              Today — {getESTDisplayDate().split(',')[0]}
              {isTodayLocked ? ' ✓' : ''}
            </button>
            <button
              onClick={() => { setActiveTab('yesterday'); setMessage(null); }}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                background: activeTab === 'yesterday' ? '#f59e0b' : '#01030f',
                color: activeTab === 'yesterday' ? '#020617' : '#94a3b8',
                border: activeTab === 'yesterday' ? '1px solid #f59e0b' : '1px solid #334155',
                transition: 'all 0.15s ease',
              }}
            >
              Yesterday — {getESTDisplayDate(yesterday).split(',')[0]}
              {isYesterdayLocked
                ? ' ✓'
                : <span style={{ marginLeft: 8, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 999 }}>MISSED</span>
              }
            </button>
          </div>
        )}

        {/* DATE DISPLAY */}
        <div style={{ marginBottom: 28, color: '#94a3b8', fontSize: 14 }}>
          📅 {getESTDisplayDate(activeDate)} (EST)
          {activeTab === 'yesterday' && !isYesterdayLocked && (
            <span style={{ marginLeft: 10, color: '#f59e0b', fontWeight: 600, fontSize: 13 }}>
              ⚠️ Logging for yesterday — last chance!
            </span>
          )}
        </div>

        {/* WEEKLY GOALS */}
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

        {/* SCORES (locked view) */}
        {isLocked && currentLog && (
          <div style={{ padding: 24, marginBottom: 32, borderRadius: 12, background: '#022c22', border: '1px solid #22c55e' }}>
            <h3 style={{ color: '#22c55e', marginBottom: 16, fontSize: 18 }}>
              {activeTab === 'yesterday' ? "Yesterday's Results" : "Today's Results"}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16 }}>
              <ScorePill label="Body" value={currentLog.body_score} color="#22c55e" />
              <ScorePill label="Mind" value={currentLog.mind_score} color="#3b82f6" />
              <ScorePill label="Identity" value={currentLog.identity_score} color="#a855f7" />
              <ScorePill label="Sovereign" value={currentLog.sovereign_score.toFixed(1)} color="#fbbf24" large />
            </div>
            {currentLog.is_rest_day && <p style={{ marginTop: 12, color: '#94a3b8', fontSize: 14, textAlign: 'center' }}>Rest Day</p>}
          </div>
        )}

        {message && (
          <div style={{ padding: 16, marginBottom: 24, borderRadius: 10, background: '#022c22', border: '1px solid #22c55e', color: '#22c55e', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {/* BODY PILLAR */}
        <Pillar title="Body" color="#22c55e" icon="💪">
          <HabitCheck label={userHabits.body_physical_activity_name || 'Physical activity'} value={form.physical} onChange={(v) => setForm((p) => ({ ...p, physical: v }))} disabled={isLocked} />
          <HabitCheck label={userHabits.body_nutritional_discipline_name || 'Nutrition discipline'} value={form.nutrition} onChange={(v) => setForm((p) => ({ ...p, nutrition: v }))} disabled={isLocked} />
          <HabitSelect
            label={`${userHabits.body_daily_reps_name || 'Daily reps'} completed`}
            value={form.reps}
            onChange={(v) => setForm((p) => ({ ...p, reps: v }))}
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
          <HabitCheck label={userHabits.mind_positive_habit_name || 'Positive habit completed'} value={form.mindPositive} onChange={(v) => setForm((p) => ({ ...p, mindPositive: v }))} disabled={isLocked} />
          <HabitCheck label={`Avoided: ${userHabits.mind_negative_habit_name || 'negative habit'}`} value={form.mindNegative} onChange={(v) => setForm((p) => ({ ...p, mindNegative: v }))} disabled={isLocked} />
          {!form.mindNegative && (
            <HabitSelect
              label="What triggered the slip-up?"
              value={form.negativeTrigger}
              onChange={(v) => setForm((p) => ({ ...p, negativeTrigger: v }))}
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
          <HabitRating label="Discipline rating (1-10)" sublabel="How disciplined were you today?" value={form.discipline} onChange={(v) => setForm((p) => ({ ...p, discipline: v }))} disabled={isLocked} />
        </Pillar>

        {/* IDENTITY PILLAR */}
        <Pillar title="Identity" color="#a855f7" icon="⚡">
          <HabitCheck label={userHabits.identity_daily_mission_name || 'Daily mission completed'} value={form.mission} onChange={(v) => setForm((p) => ({ ...p, mission: v }))} disabled={isLocked} />
          <HabitCheck label={userHabits.identity_philosophy_practice_name || 'Philosophy practiced'} value={form.philosophy} onChange={(v) => setForm((p) => ({ ...p, philosophy: v }))} disabled={isLocked} />
          <HabitRating label="Mood rating (1-10)" sublabel="How was your mood today?" value={form.mood} onChange={(v) => setForm((p) => ({ ...p, mood: v }))} disabled={isLocked} />
        </Pillar>

        {/* DAILY JOURNAL */}
        <Pillar title="Daily Notes" color="#fbbf24" icon="📝">
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: '#e5e7eb', marginBottom: 4 }}>What happened today? (Optional)</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>Capture wins, struggles, or context. This helps you spot patterns.</div>
            </label>
            <textarea
              value={form.dailyNotes}
              onChange={(e) => setForm((p) => ({ ...p, dailyNotes: e.target.value }))}
              disabled={isLocked}
              placeholder="e.g., Crushed the gym, felt unstoppable. Had a stressful work call in the afternoon."
              rows={4}
              style={{ width: '100%', padding: 14, borderRadius: 10, background: '#01030f', border: '1px solid #334155', color: '#e5e7eb', fontSize: 15, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', cursor: isLocked ? 'not-allowed' : 'text', opacity: isLocked ? 0.6 : 1 }}
            />
          </div>
        </Pillar>

        {/* SUBMIT BUTTONS */}
        {!isLocked ? (
          <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
            <button
              onClick={submitDay}
              style={{ flex: 1, padding: 16, background: 'linear-gradient(180deg, #22c55e, #16a34a)', color: '#020617', fontWeight: 600, fontSize: 16, borderRadius: 10, border: 'none', cursor: 'pointer' }}
            >
              Submit {activeTab === 'yesterday' ? "Yesterday's Log" : "Today's Log"}
            </button>
            <button
              onClick={submitRestDay}
              style={{ flex: 1, padding: 16, background: 'transparent', color: '#94a3b8', fontWeight: 600, fontSize: 16, borderRadius: 10, border: '1px solid #334155', cursor: 'pointer' }}
            >
              Log Rest Day
            </button>
          </div>
        ) : (
          activeTab === 'today' && (
            <button
              onClick={() => router.push('/dashboard')}
              style={{ width: '100%', padding: 16, marginTop: 40, background: 'linear-gradient(180deg, #22c55e, #16a34a)', color: '#020617', fontWeight: 600, fontSize: 16, borderRadius: 10, border: 'none', cursor: 'pointer' }}
            >
              View Dashboard
            </button>
          )
        )}

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
          {!isLocked && 'Log locks after submission. Be honest.'}
          {isLocked && activeTab === 'today' && "Your log resets at 12:01 AM EST. Come back tomorrow."}
          {isLocked && activeTab === 'yesterday' && "Yesterday's log is complete."}
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
  const [touched, setTouched] = useState(false);

  const handleChange = (v: boolean) => {
    if (disabled) return;
    setTouched(true);
    onChange(v);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: 14,
      background: '#01030f',
      borderRadius: 10,
      border: touched || disabled
        ? `1px solid ${value ? '#22c55e40' : '#ef444440'}`
        : '1px solid #334155',
      opacity: disabled ? 0.6 : 1,
    }}>
      <span style={{ fontSize: 15, color: '#e5e7eb' }}>{label}</span>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => handleChange(true)}
          disabled={disabled}
          style={{
            padding: '6px 18px',
            borderRadius: 8,
            border: 'none',
            fontWeight: 600,
            fontSize: 14,
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: touched && value ? '#16a34a' : !touched ? '#1e293b' : '#1a2a1a',
            color: touched && value ? '#ffffff' : !touched ? '#e5e7eb' : '#4ade80',
            boxShadow: touched && value ? '0 0 8px #22c55e60' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          Yes
        </button>
        <button
          onClick={() => handleChange(false)}
          disabled={disabled}
          style={{
            padding: '6px 18px',
            borderRadius: 8,
            border: 'none',
            fontWeight: 600,
            fontSize: 14,
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: touched && !value ? '#7f1d1d' : !touched ? '#1e293b' : '#1a1010',
            color: touched && !value ? '#ffffff' : !touched ? '#e5e7eb' : '#f87171',
            boxShadow: touched && !value ? '0 0 8px #ef444460' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          No
        </button>
      </div>
    </div>
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