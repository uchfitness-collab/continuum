'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const BASELINE_SCORE = 110;

// ✅ EXACT blueprint date format: Jan 26, Feb 26, Mar 26, Apr 26
const formatMonthDay = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [avgSovereign, setAvgSovereign] = useState(0);
  const [priorDay, setPriorDay] = useState(0);
  const [daysIn, setDaysIn] = useState(0);
  const [weeksIn, setWeeksIn] = useState(0);

  const [pillarAverages, setPillarAverages] = useState({
    body: 0,
    mind: 0,
    identity: 0,
  });

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push('/login');
        return;
      }

      setEmail(auth.user.email ?? null);

      const { data: logs } = await supabase
        .from('daily_logs')
        .select(`
          log_date,
          sovereign_score,
          body_score,
          mind_score,
          identity_score
        `)
        .eq('user_id', auth.user.id)
        .order('log_date', { ascending: true });

      if (!logs || logs.length === 0) return;

      // ---- stats (logged days only) ----
      setDaysIn(logs.length);
      setWeeksIn(Math.ceil(logs.length / 7));

      const sovereignScores = logs.map(l => l.sovereign_score);
      setAvgSovereign(
        sovereignScores.reduce((a, b) => a + b, 0) / sovereignScores.length
      );

      setPriorDay(
        logs.length > 1
          ? logs[logs.length - 2].sovereign_score
          : logs[0].sovereign_score
      );

      setPillarAverages({
        body: logs.reduce((s, l) => s + l.body_score, 0) / logs.length,
        mind: logs.reduce((s, l) => s + l.mind_score, 0) / logs.length,
        identity: logs.reduce((s, l) => s + l.identity_score, 0) / logs.length,
      });

      // ---- build chart range EXACTLY like blueprint ----
      const logMap = new Map(logs.map(l => [l.log_date, l]));

      const firstDate = new Date(logs[0].log_date + 'T00:00:00');
      const futureEnd = new Date(firstDate);
      futureEnd.setDate(futureEnd.getDate() + 90); // future months visible

      const fullRange: any[] = [];
      let d = new Date(firstDate);

      while (d <= futureEnd) {
        const dateStr = d.toISOString().split('T')[0];
        const found = logMap.get(dateStr);

        fullRange.push({
          date: dateStr,
          label: formatMonthDay(dateStr), // 🔥 THIS is what X-axis uses
          sovereign: found ? found.sovereign_score : null,
          baseline: BASELINE_SCORE,
        });

        d.setDate(d.getDate() + 1);
      }

      setChartData(fullRange);
    };

    load();
  }, [router]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>{email}</p>

      <div style={{ display: 'flex', gap: 40, marginBottom: 20 }}>
        <div>
          <strong>Days In</strong>
          <br />
          {daysIn}
        </div>
        <div>
          <strong>Weeks</strong>
          <br />
          {weeksIn}
        </div>
        <div>
          <strong>Average Sovereign</strong>
          <br />
          {avgSovereign.toFixed(1)}
        </div>
        <div>
          <strong>Prior Day</strong>
          <br />
          {priorDay.toFixed(1)}
        </div>
      </div>

      <h2>Sovereign Trajectory</h2>

      <div
        style={{
          height: 350,
          background: '#020617',
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 0 0 1px #1e293b',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="label"     // 🔥 FIXED — matches original chart
              interval={30}       // monthly spacing like blueprint
              stroke="#94a3b8"
            />

            <YAxis domain={[0, 175]} stroke="#94a3b8" />

            <Tooltip
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: '#020617',
                border: '1px solid #334155',
                color: '#e5e7eb',
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="sovereign"
              name="Sovereign Score"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
              connectNulls={true}
            />

            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ marginTop: 30 }}>Pillar Averages</h3>
      <div style={{ display: 'flex', gap: 40 }}>
        <div>
          <strong>Body</strong>
          <br />
          {pillarAverages.body.toFixed(1)}
        </div>
        <div>
          <strong>Mind</strong>
          <br />
          {pillarAverages.mind.toFixed(1)}
        </div>
        <div>
          <strong>Identity</strong>
          <br />
          {pillarAverages.identity.toFixed(1)}
        </div>
      </div>
    </div>
  );
}