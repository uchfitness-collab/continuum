'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabaseClient';

const MAX_PILLAR_POINTS_PER_DAY = 50;

export default function WeeklyReflectionPage() {
  const router = useRouter();

  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [weekRange, setWeekRange] = useState('');

  const [weeklyPercent, setWeeklyPercent] = useState(0);
  const [bodyPercent, setBodyPercent] = useState(0);
  const [mindPercent, setMindPercent] = useState(0);
  const [identityPercent, setIdentityPercent] = useState(0);

  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextWeekFocus, setNextWeekFocus] = useState('');

  const [lastWeekGoals, setLastWeekGoals] = useState<any>(null);
  const [yearGoals, setYearGoals] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.push('/login'); return; }
      const userId = auth.user.id;

      const { data: goals } = await supabase.from('user_goals').select('*').eq('user_id', userId).maybeSingle();
      if (goals) setYearGoals(goals);

      const now = new Date();
      const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
      const [datePart] = estString.split(', ');
      const [month, day, year] = datePart.split('/');
      const estToday = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      const dayOfWeek = estToday.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const startOfWeek = new Date(estToday);
      startOfWeek.setDate(estToday.getDate() + diffToMonday);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startStr = startOfWeek.toISOString().split('T')[0];
      const endStr   = endOfWeek.toISOString().split('T')[0];

      setWeekRange(`${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);

      const { data: logs } = await supabase.from('daily_logs').select('*').eq('user_id', userId).gte('log_date', startStr).lte('log_date', endStr);

      if (logs && logs.length > 0) {
        const totalBody      = logs.reduce((sum, l) => sum + (l.body_score || 0), 0);
        const totalMind      = logs.reduce((sum, l) => sum + (l.mind_score || 0), 0);
        const totalIdentity  = logs.reduce((sum, l) => sum + (l.identity_score || 0), 0);
        const totalSovereign = logs.reduce((sum, l) => sum + (l.sovereign_score || 0), 0);
        const maxPillar = logs.length * MAX_PILLAR_POINTS_PER_DAY;
        const maxTotalPossible = 7 * MAX_PILLAR_POINTS_PER_DAY * 3;
        setBodyPercent(Math.round((totalBody / maxPillar) * 100));
        setMindPercent(Math.round((totalMind / maxPillar) * 100));
        setIdentityPercent(Math.round((totalIdentity / maxPillar) * 100));
        setWeeklyPercent(Math.round((totalSovereign / maxTotalPossible) * 100));
      }

      const { data: allLogs } = await supabase.from('daily_logs').select('log_date').eq('user_id', userId).order('log_date', { ascending: true });

      if (allLogs && allLogs.length > 0) {
        const firstDate = new Date(allLogs[0].log_date);
        const diffDays = Math.floor((estToday.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
        const calculatedWeek = Math.floor(diffDays / 7) + 1;
        setWeekNumber(calculatedWeek);

        const { data: reflection } = await supabase.from('weekly_reflections').select('*').eq('user_id', userId).eq('week_number', calculatedWeek).maybeSingle();
        if (reflection) {
          setWins(reflection.what_worked_well || '');
          setChallenges(reflection.what_broke_standard || '');
          setNextWeekFocus(reflection.next_week_goals || '');
        }

        const { data: thisWeekGoals } = await supabase.from('weekly_goals').select('*').eq('user_id', userId).eq('week_start_date', startStr).maybeSingle();
        if (thisWeekGoals) setLastWeekGoals(thisWeekGoals);
      }

      setLoading(false);
    };
    load();
  }, [router]);

  const submitReflection = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    await supabase.from('weekly_reflections').upsert(
      { user_id: auth.user.id, week_number: weekNumber, what_worked_well: wins, what_broke_standard: challenges, next_week_goals: nextWeekFocus },
      { onConflict: 'user_id,week_number' }
    );
    setMessage('Reflection saved.');
    setTimeout(() => setMessage(''), 3000);
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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 36, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 12 }}>Week</p>
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6, lineHeight: 1.15 }}>
              Week {weekNumber} Reflection
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>{weekRange}</p>
          </div>
          <Link href="/weekly/history" style={{
            padding: '10px 18px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            View History
          </Link>
        </div>

        {/* 1-YEAR DIRECTION */}
        {yearGoals && (
          <div style={{
            padding: 'clamp(18px, 3vw, 24px)', marginBottom: 12,
            background: 'rgba(255,255,255,0.025)',
            borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: '3px solid #60a5fa',
          }}>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#60a5fa', fontWeight: 700, marginBottom: 14 }}>
              Your 1-Year Direction
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {yearGoals.body_goal && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>{yearGoals.body_goal}</p>
                </div>
              )}
              {yearGoals.mind_goal && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#60a5fa', flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>{yearGoals.mind_goal}</p>
                </div>
              )}
              {yearGoals.identity_goal && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a78bfa', flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>{yearGoals.identity_goal}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* THIS WEEK'S GOALS */}
        <div style={{
          padding: 'clamp(18px, 3vw, 24px)', marginBottom: 24,
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '3px solid #fbbf24',
        }}>
          <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fbbf24', fontWeight: 700, marginBottom: 14 }}>
            This Week&apos;s Goals
          </p>
          {lastWeekGoals && (lastWeekGoals.goal1 || lastWeekGoals.goal2 || lastWeekGoals.goal3) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[lastWeekGoals.goal1, lastWeekGoals.goal2, lastWeekGoals.goal3].filter(Boolean).map((goal: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fbbf24', flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>{goal}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', margin: 0 }}>
              No goals set for this week.{' '}
              <Link href="/goals" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 500 }}>Set them on the Goals page →</Link>
            </p>
          )}
        </div>

        {/* STATS */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24,
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)',
          padding: 'clamp(16px, 2.5vw, 24px)',
        }}>
          <Stat label="Weekly"   value={weeklyPercent} />
          <Stat label="Body"     value={bodyPercent} />
          <Stat label="Mind"     value={mindPercent} />
          <Stat label="Identity" value={identityPercent} />
        </div>

        {/* REFLECTION CARDS */}
        <ReflectionCard title="Where did you execute at or above your standard this week?" color="#4ade80" value={wins} onChange={setWins} />
        <ReflectionCard title="Where did you fall below your standard — and why?" color="#f87171" value={challenges} onChange={setChallenges} />
        <ReflectionCard title="What specific adjustment will you make next week to close the gap?" color="#a78bfa" value={nextWeekFocus} onChange={setNextWeekFocus} />

        {/* SET NEXT WEEK GOALS */}
        <div style={{
          padding: 'clamp(16px, 2.5vw, 20px)', marginBottom: 24,
          background: 'rgba(255,255,255,0.025)',
          borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '3px solid #fbbf24',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24', marginBottom: 6 }}>Set next week&apos;s goals</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6 }}>
            Head to the{' '}
            <Link href="/goals" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 500 }}>Goals page</Link>
            {' '}to set your targets for next week.
          </p>
        </div>

        {/* SAVE */}
        <button
          onClick={submitReflection}
          style={{
            width: '100%', padding: 'clamp(14px, 2vw, 16px)',
            background: '#4ade80', color: '#080c18',
            fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          Save Reflection
        </button>

        {message && (
          <p style={{ marginTop: 14, textAlign: 'center', color: '#4ade80', fontSize: 13 }}>{message}</p>
        )}

      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function getScoreColor(value: number) {
  if (value >= 80) return '#4ade80';
  if (value >= 50) return '#fbbf24';
  return '#f87171';
}

function Stat({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color, margin: 0 }}>{value}%</p>
    </div>
  );
}

function ReflectionCard({ title, color, value, onChange }: { title: string; color: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      marginBottom: 12,
      padding: 'clamp(18px, 3vw, 24px)',
      borderRadius: 14,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${color}`,
    }}>
      <p style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 14, lineHeight: 1.4 }}>{title}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{
          width: '100%', padding: '13px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          color: '#fff', fontSize: 14, resize: 'vertical',
          fontFamily: 'inherit', lineHeight: 1.6, outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}