'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

const MAX_PILLAR_POINTS_PER_DAY = 50;

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

  const [goal1, setGoal1] = useState('');
  const [goal2, setGoal2] = useState('');
  const [goal3, setGoal3] = useState('');

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
      const estToday = new Date(
        now.toLocaleString('en-US', { timeZone: 'America/New_York' })
      );

      const day = estToday.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;

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

          if (reflection.weekly_goals) {
            setGoal1(reflection.weekly_goals.goal1 || '');
            setGoal2(reflection.weekly_goals.goal2 || '');
            setGoal3(reflection.weekly_goals.goal3 || '');
          }
        }

        const { data: lastWeek } = await supabase
          .from('weekly_reflections')
          .select('*')
          .eq('user_id', userId)
          .eq('week_number', calculatedWeek - 1)
          .maybeSingle();

        if (lastWeek?.weekly_goals) {
          setLastWeekGoals(lastWeek.weekly_goals);
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
        weekly_goals: { goal1, goal2, goal3 },
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

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600 }}>
            Week {weekNumber} Reflection
          </h1>
          <p style={{ color: '#94a3b8' }}>{weekRange}</p>
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
              <h3 style={{ color: '#3b82f6', marginBottom: 16 }}>
                🎯 Your 1-Year Direction
              </h3>
              {yearGoals.body_goal && <p>💪 {yearGoals.body_goal}</p>}
              {yearGoals.mind_goal && <p>🧠 {yearGoals.mind_goal}</p>}
              {yearGoals.identity_goal && <p>⚡ {yearGoals.identity_goal}</p>}
            </div>
          )}

          {lastWeekGoals && (
            <div style={{
              padding: 28,
              borderRadius: 16,
              background: '#020617',
              border: '1px solid #fbbf2440',
              borderLeft: '4px solid #fbbf24',
            }}>
              <h3 style={{ color: '#fbbf24', marginBottom: 16 }}>
                📋 Last Week's Goals — How’d You Do?
              </h3>
              {lastWeekGoals.goal1 && <p>• {lastWeekGoals.goal1}</p>}
              {lastWeekGoals.goal2 && <p>• {lastWeekGoals.goal2}</p>}
              {lastWeekGoals.goal3 && <p>• {lastWeekGoals.goal3}</p>}
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

        <Card title="Next Week's Goals" color="#fbbf24">
          <Input value={goal1} onChange={setGoal1} placeholder="Goal 1" />
          <Input value={goal2} onChange={setGoal2} placeholder="Goal 2" />
          <Input value={goal3} onChange={setGoal3} placeholder="Goal 3" />
        </Card>

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
          <p style={{ marginTop: 16, color: '#22c55e' }}>{message}</p>
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

function Input({ value, onChange, placeholder }: any) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: 16,
        borderRadius: 12,
        background: '#01030f',
        border: '1px solid #334155',
        color: '#e5e7eb',
        fontSize: 15,
        marginBottom: 14,
      }}
    />
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
      }}
    />
  );
}