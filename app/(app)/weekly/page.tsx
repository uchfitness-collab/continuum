'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

export default function WeeklyReflectionPage() {
  const router = useRouter();

  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [theme, setTheme] = useState('');
  const [livedTheme, setLivedTheme] = useState<boolean | null>(null);
  const [workedWell, setWorkedWell] = useState('');
  const [brokeStandard, setBrokeStandard] = useState('');
  const [pattern, setPattern] = useState('');
  const [nextWeekGoals, setNextWeekGoals] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push('/login');
        return;
      }

      const { data: logs } = await supabase
        .from('daily_logs')
        .select('log_date')
        .eq('user_id', auth.user.id)
        .order('log_date', { ascending: true });

      if (!logs || logs.length === 0) return;

      const firstDate = new Date(logs[0].log_date);
      const today = new Date();
      const diffDays = Math.floor(
        (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      setWeekNumber(Math.floor(diffDays / 7) + 1);
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
        lived_theme: livedTheme,
        what_worked_well: workedWell,
        what_broke_standard: brokeStandard,
        pattern_observed: pattern,
        next_week_goals: nextWeekGoals,
      },
      { onConflict: 'user_id,week_number' }
    );

    setMessage(error ? error.message : 'Weekly reflection saved');
  };

  return (
    <div className="page">
      <div className="watermark" />

      <div className="content">
        <header>
          <h1>Week {weekNumber} Reflection</h1>
          <p className="subtitle">
            This is where discipline compounds.
          </p>
        </header>

        <Card title="Weekly Theme" color="#22c55e">
          <Input
            value={theme}
            onChange={setTheme}
            placeholder="One word or principle that defined this week"
          />
        </Card>

        <Card title="Did you show up this week?" color="#22c55e">
          <select
            value={livedTheme === null ? '' : livedTheme ? 'yes' : 'no'}
            onChange={e => setLivedTheme(e.target.value === 'yes')}
            className="select"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Card>

        <Card title="What worked well?" color="#3b82f6">
          <Textarea value={workedWell} onChange={setWorkedWell} />
        </Card>

        <Card title="What broke your standard?" color="#3b82f6">
          <Textarea value={brokeStandard} onChange={setBrokeStandard} />
        </Card>

        <Card title="Pattern observed" color="#a855f7">
          <Textarea value={pattern} onChange={setPattern} />
        </Card>

        <Card title="Goals for next week" color="#a855f7">
          <Textarea value={nextWeekGoals} onChange={setNextWeekGoals} />
        </Card>

        <button className="primary" onClick={submitReflection}>
          Save Reflection
        </button>

        {message && <p className="msg">{message}</p>}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 60px 24px;
          background: radial-gradient(circle at top, #020617, #01030f);
          position: relative;
          display: flex;
          justify-content: center;
        }
        .watermark {
          position: absolute;
          inset: 0;
          background: url('/continuum-hero.jpg') center / 420px no-repeat;
          opacity: 0.04;
          pointer-events: none;
        }
        .content {
          width: 100%;
          max-width: 760px;
          position: relative;
        }
        header h1 {
          font-size: 30px;
          font-weight: 600;
        }
        .subtitle {
          color: #94a3b8;
          margin-top: 6px;
          margin-bottom: 36px;
        }
        .primary {
          margin-top: 36px;
          width: 100%;
          padding: 14px;
          background: #22c55e;
          color: #020617;
          font-weight: 600;
          font-size: 16px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
        }
        .msg {
          margin-top: 16px;
          color: #94a3b8;
        }
        .select {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: #020617;
          border: 1px solid #1e293b;
          color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Card({
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
        boxShadow: `0 0 0 1px ${color}40`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14, color }}>
        {title}
      </h2>
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
        padding: 12,
        borderRadius: 10,
        background: '#020617',
        border: '1px solid #1e293b',
        color: '#e5e7eb',
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={4}
      style={{
        width: '100%',
        padding: 12,
        borderRadius: 10,
        background: '#020617',
        border: '1px solid #1e293b',
        color: '#e5e7eb',
        resize: 'vertical',
      }}
    />
  );
}