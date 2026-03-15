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
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estDate = new Date(estString);
  return estDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const getMondayOfWeek = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday.toISOString().split('T')[0];
};

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

  const [activeTab, setActiveTab] = useState<'today' | 'yesterday'>('today');
  const activeDate = activeTab === 'today' ? today : yesterday;

  const [todayForm, setTodayForm] = useState(defaultFormState());
  const [todayLog, setTodayLog] = useState<any>(null);
  const [isTodayLocked, setIsTodayLocked] = useState(false);

  const [yesterdayForm, setYesterdayForm] = useState(defaultFormState());
  const [yesterdayLog, setYesterdayLog] = useState<any>(null);
  const [isYesterdayLocked, setIsYesterdayLocked] = useState(false);
  const [showYesterdayTab, setShowYesterdayTab] = useState(false);

  const [userHabits, setUserHabits] = useState<any>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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

      const { data: habits } = await supabase.from('user_habits').select('*').eq('user_id', auth.user.id).maybeSingle();
      setUserHabits(habits);

      const weekStart = getMondayOfWeek(today);
      const { data: goals } = await supabase.from('weekly_goals').select('*').eq('user_id', auth.user.id).eq('week_start_date', weekStart).maybeSingle();
      setWeeklyGoals(goals);

      const { data: existingToday } = await supabase.from('daily_logs').select('*').eq('user_id', auth.user.id).eq('log_date', today).maybeSingle();
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

      const { data: existingYesterday } = await supabase.from('daily_logs').select('*').eq('user_id', auth.user.id).eq('log_date', yesterday).maybeSingle();
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
      user_id: data.user.id, log_date: activeDate, is_rest_day: true,
      daily_raw_score: REST_DAY_SCORE, sovereign_score: sovereignScore, sovereign_value: sovereignScore,
      body_score: 0, mind_score: 0, identity_score: 0, negative_trigger: 'None',
      daily_notes: form.dailyNotes,
      body_physical_activity_completed: false, body_nutritional_discipline_maintained: false,
      body_daily_reps_level: 'below_10', mind_positive_habit_completed: false,
      mind_negative_habit_avoided: false, mind_discipline_rating: 5,
      identity_daily_mission_completed: false, identity_philosophy_practice_completed: false,
      identity_mood_rating: 5,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Rest day logged.' });
      if (activeTab === 'today') { setIsTodayLocked(true); setTimeout(() => router.push('/dashboard'), 1500); }
      else { setIsYesterdayLocked(true); setTimeout(() => setActiveTab('today'), 1500); }
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
      user_id: data.user.id, log_date: activeDate,
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
      body_score: bodyScore, mind_score: mindScore, identity_score: identityScore,
      daily_raw_score: dailyRawScore, sovereign_score: sovereignScore, sovereign_value: sovereignScore,
      is_rest_day: false, daily_notes: form.dailyNotes,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Log submitted.' });
      if (activeTab === 'today') { setIsTodayLocked(true); setTimeout(() => router.push('/dashboard'), 1500); }
      else { setIsYesterdayLocked(true); setTimeout(() => setActiveTab('today'), 1500); }
    }
  };

  if (isLoading) {
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

  if (!userHabits) {
    return (
      <div style={{ minHeight: '100vh', background: '#080c18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          maxWidth: 440, width: '100%', padding: 'clamp(28px, 5vw, 40px)',
          background: 'rgba(255,255,255,0.025)', borderRadius: 18,
          border: '1px solid rgba(248,113,113,0.2)', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: '#f87171', fontWeight: 700 }}>No Habits Defined</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28, lineHeight: 1.65, fontSize: 14 }}>
            You need to define your daily habits before you can start logging.
          </p>
          <Link href="/habits" style={{
            display: 'inline-block', padding: '14px 32px',
            background: '#4ade80', color: '#080c18',
            fontWeight: 700, borderRadius: 10, textDecoration: 'none', fontSize: 15,
          }}>
            Set Up Habits
          </Link>
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
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 12 }}>
            Daily Log
          </p>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6, lineHeight: 1.15 }}>
            {isLocked ? `${activeTab === 'yesterday' ? "Yesterday's" : "Today's"} log is complete ✓` : 'Show up. Record truthfully.'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            {getESTDisplayDate(activeDate)} · EST
          </p>
        </div>

        {/* DATE TABS */}
        {showYesterdayTab && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            <button
              onClick={() => { setActiveTab('today'); setMessage(null); }}
              style={{
                flex: 1, padding: '11px 16px', borderRadius: 10,
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                background: activeTab === 'today' ? '#4ade80' : 'rgba(255,255,255,0.03)',
                color: activeTab === 'today' ? '#080c18' : 'rgba(255,255,255,0.4)',
                border: activeTab === 'today' ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.15s',
              }}
            >
              Today {isTodayLocked ? '✓' : ''}
            </button>
            <button
              onClick={() => { setActiveTab('yesterday'); setMessage(null); }}
              style={{
                flex: 1, padding: '11px 16px', borderRadius: 10,
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                background: activeTab === 'yesterday' ? '#fbbf24' : 'rgba(255,255,255,0.03)',
                color: activeTab === 'yesterday' ? '#080c18' : 'rgba(255,255,255,0.4)',
                border: activeTab === 'yesterday' ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.15s',
              }}
            >
              Yesterday {isYesterdayLocked ? '✓' : '⚠️'}
            </button>
          </div>
        )}

        {/* WEEKLY GOALS */}
        {weeklyGoals && (weeklyGoals.goal1 || weeklyGoals.goal2 || weeklyGoals.goal3) && (
          <div style={{
            padding: 'clamp(16px, 2.5vw, 20px)', marginBottom: 24, borderRadius: 12,
            background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>This Week's Goals</p>
              <Link href="/goals" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, textDecoration: 'none' }}>Edit →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[weeklyGoals.goal1, weeklyGoals.goal2, weeklyGoals.goal3].filter(Boolean).map((goal: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fbbf24', flexShrink: 0, marginTop: 5 }} />
                  {goal}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOCKED SCORES */}
        {isLocked && currentLog && (
          <div style={{
            padding: 'clamp(18px, 3vw, 24px)', marginBottom: 24, borderRadius: 14,
            background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)',
          }}>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 16 }}>
              {activeTab === 'yesterday' ? "Yesterday's Results" : "Today's Results"}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <ScorePill label="Body"      value={currentLog.body_score}                   color="#4ade80" />
              <ScorePill label="Mind"      value={currentLog.mind_score}                   color="#60a5fa" />
              <ScorePill label="Identity"  value={currentLog.identity_score}               color="#a78bfa" />
              <ScorePill label="Sovereign" value={currentLog.sovereign_score?.toFixed(1)}  color="#fbbf24" large />
            </div>
            {currentLog.is_rest_day && (
              <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' }}>Rest Day</p>
            )}
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <div style={{
            padding: '13px 16px', marginBottom: 20, borderRadius: 10,
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
          <HabitCheck label={userHabits.body_physical_activity_name || 'Physical activity'} value={form.physical} onChange={(v) => setForm((p) => ({ ...p, physical: v }))} disabled={isLocked} />
          <HabitCheck label={userHabits.body_nutritional_discipline_name || 'Nutrition discipline'} value={form.nutrition} onChange={(v) => setForm((p) => ({ ...p, nutrition: v }))} disabled={isLocked} />
          <HabitSelect
            label={`${userHabits.body_daily_reps_name || 'Daily reps'} completed`}
            value={form.reps} onChange={(v) => setForm((p) => ({ ...p, reps: v }))} disabled={isLocked}
            options={[
              { value: 'below_10', label: 'Below 10 (-5 pts)' },
              { value: '25_plus',  label: '25+ reps (+5 pts)' },
              { value: '50_plus',  label: '50+ reps (+10 pts)' },
            ]}
          />
        </Pillar>

        {/* MIND */}
        <Pillar title="Mind" color="#60a5fa">
          <HabitCheck label={userHabits.mind_positive_habit_name || 'Positive habit completed'} value={form.mindPositive} onChange={(v) => setForm((p) => ({ ...p, mindPositive: v }))} disabled={isLocked} />
          <HabitCheck label={`Avoided: ${userHabits.mind_negative_habit_name || 'negative habit'}`} value={form.mindNegative} onChange={(v) => setForm((p) => ({ ...p, mindNegative: v }))} disabled={isLocked} />
          {!form.mindNegative && (
            <HabitSelect
              label="What triggered the slip-up?"
              value={form.negativeTrigger} onChange={(v) => setForm((p) => ({ ...p, negativeTrigger: v }))} disabled={isLocked}
              options={[
                { value: 'Social Media',   label: 'Social Media' },
                { value: 'Boredom',        label: 'Boredom' },
                { value: 'Stress',         label: 'Stress' },
                { value: 'Fatigue',        label: 'Fatigue' },
                { value: 'Hunger',         label: 'Hunger' },
                { value: 'Peer Pressure',  label: 'Peer Pressure' },
                { value: 'Other',          label: 'Other' },
              ]}
            />
          )}
          <HabitRating label="Discipline rating (1–10)" sublabel="How disciplined were you today?" value={form.discipline} onChange={(v) => setForm((p) => ({ ...p, discipline: v }))} disabled={isLocked} />
        </Pillar>

        {/* IDENTITY */}
        <Pillar title="Identity" color="#a78bfa">
          <HabitCheck label={userHabits.identity_daily_mission_name || 'Daily mission completed'} value={form.mission} onChange={(v) => setForm((p) => ({ ...p, mission: v }))} disabled={isLocked} />
          <HabitCheck label={userHabits.identity_philosophy_practice_name || 'Philosophy practiced'} value={form.philosophy} onChange={(v) => setForm((p) => ({ ...p, philosophy: v }))} disabled={isLocked} />
          <HabitRating label="Mood rating (1–10)" sublabel="How was your mood today?" value={form.mood} onChange={(v) => setForm((p) => ({ ...p, mood: v }))} disabled={isLocked} />
        </Pillar>

        {/* DAILY NOTES */}
        <Pillar title="Daily Notes" color="#fbbf24">
          <div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10, lineHeight: 1.5 }}>
              Capture wins, struggles, or context. Patterns emerge when you review these later.
            </p>
            <textarea
              value={form.dailyNotes}
              onChange={(e) => setForm((p) => ({ ...p, dailyNotes: e.target.value }))}
              disabled={isLocked}
              placeholder="e.g., Crushed the gym today. Stressful work call in the afternoon affected my focus."
              rows={4}
              style={{
                width: '100%', padding: '13px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                color: '#fff', fontSize: 14, lineHeight: 1.6, resize: 'vertical',
                fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                cursor: isLocked ? 'not-allowed' : 'text',
                opacity: isLocked ? 0.5 : 1,
              }}
            />
          </div>
        </Pillar>

        {/* SUBMIT */}
        {!isLocked ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <button
              onClick={submitDay}
              style={{
                width: '100%', padding: 'clamp(14px, 2vw, 16px)',
                background: '#4ade80', color: '#080c18',
                fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer',
              }}
            >
              Submit {activeTab === 'yesterday' ? "Yesterday's" : "Today's"} Log
            </button>
            <button
              onClick={submitRestDay}
              style={{
                width: '100%', padding: 'clamp(13px, 2vw, 15px)',
                background: 'transparent', color: 'rgba(255,255,255,0.35)',
                fontWeight: 500, fontSize: 14, borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
              }}
            >
              Log Rest Day
            </button>
          </div>
        ) : (
          activeTab === 'today' && (
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                width: '100%', padding: 'clamp(14px, 2vw, 16px)', marginTop: 8,
                background: '#4ade80', color: '#080c18',
                fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer',
              }}
            >
              View Dashboard
            </button>
          )
        )}

        <p style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          {!isLocked && 'Log locks after submission. Be honest.'}
          {isLocked && activeTab === 'today' && 'Resets at 12:01 AM EST. Come back tomorrow.'}
          {isLocked && activeTab === 'yesterday' && "Yesterday's log is complete."}
        </p>

      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Pillar({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{
      marginBottom: 16,
      padding: 'clamp(18px, 3vw, 24px)',
      borderRadius: 16,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${color}`,
    }}>
      <h2 style={{ color, margin: '0 0 20px', fontSize: 'clamp(15px, 2vw, 17px)', fontWeight: 700, letterSpacing: '0.01em' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  );
}

function HabitCheck({ label, value, onChange, disabled }: { label: string; value: boolean; onChange: (v: boolean) => void; disabled: boolean }) {
  const [touched, setTouched] = useState(false);

  const handleChange = (v: boolean) => {
    if (disabled) return;
    setTouched(true);
    onChange(v);
  };

  return (
    <div style={{
      padding: 'clamp(12px, 2vw, 16px)',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: 10,
      border: touched || disabled
        ? `1px solid ${value ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.2)'}`
        : '1px solid rgba(255,255,255,0.06)',
      opacity: disabled ? 0.65 : 1,
      transition: 'border-color 0.15s',
    }}>
      <p style={{ fontSize: 'clamp(13px, 2vw, 14px)', color: 'rgba(255,255,255,0.75)', marginBottom: 12, lineHeight: 1.4 }}>{label}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => handleChange(true)} disabled={disabled}
          style={{
            flex: 1, padding: '11px 0', borderRadius: 8, border: 'none',
            fontWeight: 700, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
            background: touched && value ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
            color: touched && value ? '#4ade80' : 'rgba(255,255,255,0.4)',
            outline: touched && value ? '1px solid rgba(74,222,128,0.3)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          Yes
        </button>
        <button
          onClick={() => handleChange(false)} disabled={disabled}
          style={{
            flex: 1, padding: '11px 0', borderRadius: 8, border: 'none',
            fontWeight: 700, fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
            background: touched && !value ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.04)',
            color: touched && !value ? '#f87171' : 'rgba(255,255,255,0.4)',
            outline: touched && !value ? '1px solid rgba(248,113,113,0.25)' : 'none',
            transition: 'all 0.15s',
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
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{label}</p>
      <select
        value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
        style={{
          width: '100%', padding: '13px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          color: '#fff', fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1, outline: 'none',
        }}
      >
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function HabitRating({ label, sublabel, value, onChange, disabled }: { label: string; sublabel: string; value: number; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 3, fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginBottom: 8 }}>{sublabel}</p>
      <select
        value={value} onChange={(e) => onChange(Number(e.target.value))} disabled={disabled}
        style={{
          width: '100%', padding: '13px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          color: '#fff', fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1, outline: 'none',
        }}
      >
        {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </div>
  );
}

function ScorePill({ label, value, color, large = false }: { label: string; value: any; color: string; large?: boolean }) {
  return (
    <div style={{
      padding: large ? '14px 10px' : '12px 10px',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: 10,
      border: `1px solid ${color}25`,
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: large ? 22 : 18, fontWeight: 700, color, margin: 0 }}>{value}</p>
    </div>
  );
}