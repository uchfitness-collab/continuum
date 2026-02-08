'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

export default function WeeklyReflectionPage() {
  const router = useRouter();

  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [avgScore, setAvgScore] = useState(0);
  
  // Simplified fields
  const [theme, setTheme] = useState('');
  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextWeekFocus, setNextWeekFocus] = useState('');
  
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
        setWeekNumber(Math.floor(diffDays / 7) + 1);
      }

      // Load existing reflection
      const { data: reflection } = await supabase
        .from('weekly_reflections')
        .select('*')
        .eq('user_id', auth.user.id)
        .eq('week_number', Math.floor((today.getTime() - new Date(allLogs?.[0]?.log_date || today).getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1)
        .maybeSingle();

      if (reflection) {
        setTheme(reflection.weekly_theme || '');
        setWins(reflection.what_worked_well || '');
        setChallenges(reflection.what_broke_standard || '');
        setNextWeekFocus(reflection.next_week_goals || '');
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
        
        {/* HEADER */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>
            Week {weekNumber} Reflection
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            Patterns reveal truth. Progress compounds in reflection.
          </p>
        </div>

        {/* WEEK STATS */}
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
          <Stat label="Avg Sovereign Score" value={avgScore.toFixed(1)} />
          <Stat 
            label="Consistency" 
            value={`${Math.round((weekData.length / 7) * 100)}%`} 
          />
        </div>

        {/* THEME */}
        <Card title="This Week's Theme" color="#22c55e" icon="🎯">
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>
            One word that captures what you focused on this week
          </p>
          <Input
            value={theme}
            onChange={setTheme}
            placeholder="e.g., Consistency, Focus, Momentum"
          />
        </Card>

        {/* WINS */}
        <Card title="What Worked" color="#22c55e" icon="✓">
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>
            What actions, habits, or decisions moved the needle?
          </p>
          <Textarea 
            value={wins} 
            onChange={setWins}
            placeholder="Which daily habits had the biggest impact? What decisions felt aligned?"
          />
        </Card>

        {/* CHALLENGES */}
        <Card title="What Broke" color="#ef4444" icon="⚠">
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>
            Where did you fall short of your standard?
          </p>
          <Textarea 
            value={challenges} 
            onChange={setChallenges}
            placeholder="Which days did you miss? What patterns emerged in your failures?"
          />
        </Card>

        {/* NEXT WEEK */}
        <Card title="Next Week's Focus" color="#a855f7" icon="→">
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 12 }}>
            What's the ONE thing you're prioritizing next week?
          </p>
          <Textarea 
            value={nextWeekFocus} 
            onChange={setNextWeekFocus}
            placeholder="Be specific. What will you do differently?"
          />
        </Card>

        {/* MESSAGE */}
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

        {/* SAVE BUTTON */}
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

        <p style={{ 
          marginTop: 16, 
          textAlign: 'center', 
          fontSize: 13, 
          color: '#94a3b8' 
        }}>
          Your reflection helps you see the patterns others miss.
        </p>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Card({
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h2 style={{ fontSize: 20, fontWeight: 600, color, margin: 0 }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
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
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
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

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: '#22c55e' }}>
        {value}
      </div>
    </div>
  );
}