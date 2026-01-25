'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

type Log = {
  log_date: string;
  body_score: number;
  mind_score: number;
  identity_score: number;
  daily_raw_score: number;
  sovereign_score: number;
  rest_day: boolean;
  missed_day: boolean;
};

export default function HistoryPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from('daily_logs')
        .select(
          `
          log_date,
          body_score,
          mind_score,
          identity_score,
          daily_raw_score,
          sovereign_score,
          rest_day,
          missed_day
        `
        )
        .eq('user_id', user.id)
        .order('log_date', { ascending: false });

      setLogs(data ?? []);
    };

    load();
  }, []);

  const dayType = (log: Log) => {
    if (log.missed_day) return 'Missed';
    if (log.rest_day) return 'Rest';
    return 'Normal';
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>History</h1>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: 20,
        }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Body</th>
            <th>Mind</th>
            <th>Identity</th>
            <th>Raw</th>
            <th>Sovereign</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.log_date}>
              <td>{log.log_date}</td>
              <td>{log.body_score}</td>
              <td>{log.mind_score}</td>
              <td>{log.identity_score}</td>
              <td>{log.daily_raw_score}</td>
              <td>{log.sovereign_score.toFixed(1)}</td>
              <td>{dayType(log)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}