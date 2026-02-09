'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

export default function WeeklyReflectionPage() {
  const router = useRouter();

  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [avgScore, setAvgScore] = useState(0);
  
  // Reflection fields
  const [theme, setTheme] = useState('');
  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextWeekFocus, setNextWeekFocus] = useState('');
  
  // Goals
  const [goal1, setGoal1] = useState('');
  const [goal2, setGoal2] = useState('');
  const [goal3, setGoal3] = useState('');
  
  // Last week's goals
  const [lastWeekGoals, setLastWeekGoals] = useState<any>(null);
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push('/login');
        return;
      }

      // Get this week's logs
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', auth.user.id)
        .gte('log_date', startOfWeek.toISOString().split('T')[0])
        .order('log_date', { ascending: true });

      if (logs && logs.length > 0) {
        setWeekData(logs);
        const avg = logs.reduce((sum, l) => sum + l.sovereign_score, 0) / logs.length;
        setAvgScore(avg);
      }

      // Calculate week number
      const { data: allLogs } = await supabase
        .from('daily_logs')
        .select('log_date')
        .eq('user_id', auth.user.id)
        .order('log_date', { ascending: true });

      if (allLogs && allLogs.length > 0) {
        const firstDate = new Date(allLogs[0].log_date);
        const diffDays = Math.floor(
          (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const calculatedWeekNumber = Math.floor(diffDays / 7) + 1;
        setWeekNumber(calculatedWeekNumber);

        // Load existing reflection for this week
        const { data: reflection } = await supabase
          .from('weekly_reflections')
          .select('*')
          .eq('user_id', auth.user.id)
          .eq('week_number', calculatedWeekNumber)
          .maybeSingle();

        if (reflection) {
          setTheme(reflection.weekly_theme || '');
          setWins(reflection.what_worked_well || '');
          setChallenges(reflection.what_broke_standard || '');
          setNextWeekFocus(reflection.next_week_goals || '');
          
          if (reflection.weekly_goals) {
            setGoal1(reflection.weekly_goals.goal1 || '');
            setGoal2(reflection.weekly_goals.goal2 || '');
            setGoal3(reflection.weekly_goals.goal3 || '');
          }
        }

        // Load LAST week's goals to review
        const { data: lastWeek } = await supabase
          .from('weekly_reflections')
          .select('*')
          .eq('user_id', auth.user.id)
          .eq('week_number', calculatedWeekNumber - 1)
          .maybeSingle();

        if (lastWeek && lastWeek.weekly_goals) {
          setLastWeekGoals(lastWeek.weekly_goals);
        }
      }

      setLoading(false);
    };

    load();
  }, [router]);

  const submitReflection = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setMessage('Not authenticated');
      return;
    }

    const start = new Date();
    start.setDate(start.getDate() - start.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const goals = {
      goal1: goal1.trim(),
      goal2: goal2.trim(),
      goal3: goal3.trim(),
    };

    const { error } = await supabase.from('weekly_reflections').upsert(
      {
        user_id: auth.user.id,
        week_number: weekNumber,
        week_start_date: start.toISOString().split('T')[0],
        week_end_date: end.toISOString().split('T')[0],
        weekly_theme: theme,
        what_worked_well: wins,
        what_broke_standard: challenges,
        next_week_goals: nextWeekFocus,
        weekly_goals: goals,
      },
      { onConflict: 'user_id,week_number' }
    );

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Reflection saved ✓');
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  };

  if (loading) {
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

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>
            Week {weekNumber} Reflection
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            Patterns reveal truth. Progress compounds in reflection.
          </p>
        </div>

        {/* LAST WEEK GOALS REVIEW */}
        {lastWeekGoals && (lastWeekGoals.goal1 || lastWeekGoals.goal2 || lastWeekGoals.goal3) && (
          <div style={{
            padding: 24,
            marginBottom: 32,
            borderRadius: 12,
            background: '#020617',
            border: '1px solid #fbbf2440',
            borderLeft: '4px solid #fbbf24',
          }}>
            <h3 style={{ color: '#fbbf24', marginBottom: 16, fontSize: 18 }}>
              📋 Last Week's Goals - How'd You Do?
            </h3>
            {lastWeekGoals.goal1 && <p style={{ color: '#e5e7eb', marginBottom: 8 }}>• {lastWeekGoals.goal1}</p>}
            {lastWeekGoals.goal2 && <p style={{ color: '#e5e7eb', marginBottom: 8 }}>• {lastWeekGoals.goal2}</p>}
            {lastWeekGoals.goal3 && <p style={{ color: '#e5e7eb', marginBottom: 8 }}>• {lastWeekGoals.goal3}</p>}
            <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 12 }}>
              Reflect on these as you complete today's reflection.
            </p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginBottom: 40,
          padding: 24,
          background: '#020617',
          borderRadius: 12,
          border: '1px solid #22c55e40',
        }}>
          <Stat label="Days Logged" value={weekData.length} />
          <Stat label="Avg Score" value={avgScore.toFixed(1)} />
          <Stat label="Consistency" value={`${Math.round((weekData.length / 7) * 100)}%`} />
        </div>

        <Card title="This Week's Theme" color="#22c55e" icon="🎯">
          <Input value={theme} onChange={setTheme} placeholder="e.g., Consistency, Focus, Momentum" />
        </Card>

        <Card title="What Worked" color="#22c55e" icon="✓">
          <Textarea value={wins} onChange={setWins} placeholder="Which habits had the biggest impact?" />
        </Card>

        <Card title="What Broke" color="#ef4444" icon="⚠">
          <Textarea value={challenges} onChange={setChallenges} placeholder="Where did you fall short?" />
        </Card>

        <Card title="Next Week's Focus" color="#a855f7" icon="→">
          <Textarea value={nextWeekFocus} onChange={setNextWeekFocus} placeholder="What will you do differently?" />
        </Card>

        {/* WEEKLY GOALS */}
        <Card title="Next Week's Goals" color="#fbbf24" icon="🎯">
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>
            Set 1-3 measurable goals. We'll check in next week.
          </p>
          <Input value={goal1} onChange={setGoal1} placeholder="Goal 1: e.g., Log 7/7 days" />
          <Input value={goal2} onChange={setGoal2} placeholder="Goal 2: e.g., Avoid Social Media trigger" />
          <Input value={goal3} onChange={setGoal3} placeholder="Goal 3: e.g., Sovereign Score > 120" />
        </Card>

        {message && (
          <div style={{
            padding: 16,
            marginBottom: 20,
            borderRadius: 10,
            background: message.includes('✓') ? '#022c22' : '#2c0808',
            border: `1px solid ${message.includes('✓') ? '#22c55e' : '#ef4444'}`,
            color: message.includes('✓') ? '#22c55e' : '#ef4444',
            textAlign: 'center',
          }}>
            {message}
          </div>
        )}

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
      </div>
    </div>
  );
}

function Card({ title, color, icon, children }: any) {
  return (
    <div style={{
      marginBottom: 28,
      padding: 28,
      borderRadius: 16,
      background: '#020617',
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h2 style={{ fontSize: 20, fontWeight: 600, color, margin: 0 }}>{title}</h2>
      </div>
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
        padding: 14,
        borderRadius: 10,
        background: '#01030f',
        border: '1px solid #334155',
        color: '#e5e7eb',
        fontSize: 15,
        marginBottom: 12,
      }}
    />
  );
}

function Textarea({ value, onChange, placeholder }: any) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
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
      }}
    />
  );
}

function Stat({ label, value }: any) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: '#22c55e' }}>{value}</div>
    </div>
  );
}