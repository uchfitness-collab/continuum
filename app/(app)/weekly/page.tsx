'use client';

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

      // Calculate week number from first daily log
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('log_date')
        .eq('user_id', auth.user.id)
        .order('log_date', { ascending: true });

      if (!logs || logs.length === 0) return;

      const firstDate = new Date(logs[0].log_date);
      const today = new Date();
      const diffDays =
        Math.floor((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

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
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
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
      },
      { onConflict: 'user_id,week_number' }
    );

    setMessage(error ? error.message : 'Weekly reflection saved');
  };

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h1>Week {weekNumber} Reflection</h1>

      <label>
        Weekly Theme
        <input
          value={theme}
          onChange={e => setTheme(e.target.value)}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <br /><br />

      <label>
        Did you show up this week?
        <select
          value={livedTheme === null ? '' : livedTheme ? 'yes' : 'no'}
          onChange={e => setLivedTheme(e.target.value === 'yes')}
          style={{ width: '100%', marginTop: 4 }}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </label>

      <br /><br />

      <label>
        What worked well?
        <textarea
          value={workedWell}
          onChange={e => setWorkedWell(e.target.value)}
          rows={3}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <br /><br />

      <label>
        What broke your standard?
        <textarea
          value={brokeStandard}
          onChange={e => setBrokeStandard(e.target.value)}
          rows={3}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <br /><br />

      <label>
        Pattern observed
        <textarea
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          rows={3}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <br /><br />

      <label>
        Goals for next week
        <textarea
          value={nextWeekGoals}
          onChange={e => setNextWeekGoals(e.target.value)}
          rows={3}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <br /><br />

      <button onClick={submitReflection}>Save Reflection</button>

      {message && <p>{message}</p>}
    </div>
  );
}