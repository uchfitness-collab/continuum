'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabaseClient';

const MAX_PILLAR_POINTS_PER_DAY = 50;

const getMondayOfWeek = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday.toISOString().split('T')[0];
};

export default function WeeklyReflectionPage() {
  const router = useRouter();

  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [weekData, setWeekData] = useState<any[]>([]);
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
      if (!auth.user) {
        router.push('/login');
        return;
      }

      const userId = auth.user.id;

      const { data: goals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

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
      const endStr = endOfWeek.toISOString().split('T')[0];

      setWeekRange(
        `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`
      );

      const { data: logs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('log_date', startStr)
        .lte('log_date', endStr);

      if (logs && logs.length > 0) {
        setWeekData(logs);

        const totalBody = logs.reduce((sum, l) => sum + (l.body_score || 0), 0);
        const totalMind = logs.reduce((sum, l) => sum + (l.mind_score || 0), 0);
        const totalIdentity = logs.reduce((sum, l) => sum + (l.identity_score || 0), 0);
        const totalSovereign = logs.reduce((sum, l) => sum + (l.sovereign_score || 0), 0);

        const maxPillar = logs.length * MAX_PILLAR_POINTS_PER_DAY;
        const maxTotalPossible = 7 * MAX_PILLAR_POINTS_PER_DAY * 3;

        setBodyPercent(Math.round((totalBody / maxPillar) * 100));
        setMindPercent(Math.round((totalMind / maxPillar) * 100));
        setIdentityPercent(Math.round((totalIdentity / maxPillar) * 100));
        setWeeklyPercent(Math.round((totalSovereign / maxTotalPossible) * 100));
      }

      const { data: allLogs } = await supabase
        .from('daily_logs')
        .select('log_date')
        .eq('user_id', userId)
        .order('log_date', { ascending: true });

      if (allLogs && allLogs.length > 0) {
        const firstDate = new Date(allLogs[0].log_date);
        const diffDays = Math.floor(
          (estToday.getTime() - firstDate.getTime()) /
          (1000 * 60 * 60 * 24)
        );
        const calculatedWeek = Math.floor(diffDays / 7) + 1;
        setWeekNumber(calculatedWeek);

        const { data: reflection } = await supabase
          .from('weekly_reflections')
          .select('*')
          .eq('user_id', userId)
          .eq('week_number', calculatedWeek)
          .maybeSingle();

        if (reflection) {
          setWins(reflection.what_worked_well || '');
          setChallenges(reflection.what_broke_standard || '');
          setNextWeekFocus(reflection.next_week_goals || '');
        }

        const { data: thisWeekGoals } = await supabase
          .from('weekly_goals')
          .select('*')
          .eq('user_id', userId)
          .eq('week_start_date', startStr)
          .maybeSingle();

        if (thisWeekGoals) {
          setLastWeekGoals(thisWeekGoals);
        }
      }

      setLoading(false);
    };

    load();
  }, [router]);

  const submitReflection = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    await supabase.from('weekly_reflections').upsert(
      {
        user_id: auth.user.id,
        week_number: weekNumber,
        what_worked_well: wins,
        what_broke_standard: challenges,
        next_week_goals: nextWeekFocus,
      },
      { onConflict: 'user_id,week_number' }
    );

    setMessage('Reflection saved ✓');
  };

  if (loading) return null;

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 40,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1 style={{ fontSize: 36, fontWeight: 600 }}>
              Week {weekNumber} Reflection
            </h1>
            <p style={{ color: '#94a3b8' }}>{weekRange}</p>
          </div>

          {/* VIEW HISTORY BUTTON */}
          <Link
            href="/weekly/history"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              background: 'transparent',
              color: '#94a3b8',
              fontWeight: 600,
              fontSize: 14,
              border: '1px solid #334155',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            📚 View History
          </Link>
        </div>

        {/* TOP TWO BOXES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          marginBottom: 40,
        }}>

          {yearGoals && (
            <div style={{
              padding: 28,
              borderRadius: 16,
              background: '#020617',
              border: '1px solid #3b82f640',
              borderLeft: '4px solid #3b82f6',
            }}>
              <h3 style={{ color: '#3b82f6', marginBottom: 16, fontSize: 18 }}>
                🎯 Your 1-Year Direction
              </h3>
              {yearGoals.body_goal && (
                <p style={{ marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}>
                  💪 {yearGoals.body_goal}
                </p>
              )}
              {yearGoals.mind_goal && (
                <p style={{ marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}>
                  🧠 {yearGoals.mind_goal}
                </p>
              )}
              {yearGoals.identity_goal && (
                <p style={{ marginBottom: 0, fontSize: 14, lineHeight: 1.6 }}>
                  ⚡ {yearGoals.identity_goal}
                </p>
              )}
            </div>
          )}

          {lastWeekGoals && (lastWeekGoals.goal1 || lastWeekGoals.goal2 || lastWeekGoals.goal3) ? (
            <div style={{
              padding: 28,
              borderRadius: 16,
              background: '#020617',
              border: '1px solid #fbbf2440',
              borderLeft: '4px solid #fbbf24',
            }}>
              <h3 style={{ color: '#fbbf24', marginBottom: 16, fontSize: 18 }}>
                📋 This Week's Goals — How'd You Do?
              </h3>
              {lastWeekGoals.goal1 && (
                <p style={{ marginBottom: 8, fontSize: 14 }}>• {lastWeekGoals.goal1}</p>
              )}
              {lastWeekGoals.goal2 && (
                <p style={{ marginBottom: 8, fontSize: 14 }}>• {lastWeekGoals.goal2}</p>
              )}
              {lastWeekGoals.goal3 && (
                <p style={{ marginBottom: 0, fontSize: 14 }}>• {lastWeekGoals.goal3}</p>
              )}
            </div>
          ) : (
            <div style={{
              padding: 28,
              borderRadius: 16,
              background: '#020617',
              border: '1px solid #94a3b840',
              borderLeft: '4px solid #94a3b8',
            }}>
              <h3 style={{ color: '#94a3b8', marginBottom: 16, fontSize: 18 }}>
                📋 This Week's Goals
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>
                No goals set for this week. Set your goals on the Goals page.
              </p>
            </div>
          )}
        </div>

        {/* STATS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginBottom: 40,
          padding: 28,
          background: '#020617',
          borderRadius: 16,
          border: '1px solid #22c55e40',
        }}>
          <Stat label="Weekly %" value={weeklyPercent} />
          <Stat label="Body %" value={bodyPercent} />
          <Stat label="Mind %" value={mindPercent} />
          <Stat label="Identity %" value={identityPercent} />
        </div>

        <Card title="Where did you execute at or above your standard this week?" color="#22c55e">
          <Textarea value={wins} onChange={setWins} />
        </Card>

        <Card title="Where did you fall below your standard — and why?" color="#ef4444">
          <Textarea value={challenges} onChange={setChallenges} />
        </Card>

        <Card title="What specific adjustment will you make next week to close the gap?" color="#a855f7">
          <Textarea value={nextWeekFocus} onChange={setNextWeekFocus} />
        </Card>

        <div style={{
          padding: 24,
          marginBottom: 32,
          borderRadius: 16,
          background: '#020617',
          border: '1px solid #fbbf24',
        }}>
          <h3 style={{ color: '#fbbf24', marginBottom: 8, fontSize: 18 }}>
            📝 Set Next Week's Goals
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
            Head to the{' '}
            <a href="/goals" style={{ color: '#fbbf24', textDecoration: 'underline' }}>
              Goals page
            </a>{' '}
            to set your weekly goals for next week.
          </p>
        </div>

        <button
          onClick={submitReflection}
          style={{
            width: '100%',
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
          Save Reflection
        </button>

        {message && (
          <p style={{ marginTop: 16, textAlign: 'center', color: '#22c55e' }}>{message}</p>
        )}

      </div>
    </div>
  );
}

function getColor(value: number) {
  if (value >= 80) return '#22c55e';
  if (value >= 50) return '#facc15';
  return '#ef4444';
}

function Stat({ label, value }: any) {
  const color = getColor(value);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color }}>
        {value}%
      </div>
    </div>
  );
}

function Card({ title, color, children }: any) {
  return (
    <div style={{
      marginBottom: 32,
      padding: 32,
      borderRadius: 20,
      background: '#020617',
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color, marginBottom: 20 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Textarea({ value, onChange }: any) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={5}
      style={{
        width: '100%',
        padding: 16,
        borderRadius: 12,
        background: '#01030f',
        border: '1px solid #334155',
        color: '#e5e7eb',
        fontSize: 15,
        resize: 'vertical',
        fontFamily: 'inherit',
        lineHeight: 1.6,
      }}
    />
  );
}