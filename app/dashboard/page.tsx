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

const formatMonthYear = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    year: '2-digit',
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

      setEmail(auth.user.email);

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

      // ---- stats ----
      setDaysIn(logs.length);
      setWeeksIn(Math.ceil(logs.length / 7));

      const sovereignScores = logs.map(l => l.sovereign_score);
      setAvgSovereign(
        sovereignScores.reduce((a, b) => a + b, 0) /
          sovereignScores.length
      );

      setPriorDay(
        logs.length > 1
          ? logs[logs.length - 2].sovereign_score
          : 150
      );

      // ---- pillar averages ----
      setPillarAverages({
        body:
          logs.reduce((s, l) => s + l.body_score, 0) / logs.length,
        mind:
          logs.reduce((s, l) => s + l.mind_score, 0) / logs.length,
        identity:
          logs.reduce((s, l) => s + l.identity_score, 0) / logs.length,
      });

      // ---- chart range ----
      const firstDate = new Date(logs[0].log_date);
      const futureEnd = new Date(firstDate);
      futureEnd.setDate(futureEnd.getDate() + 90);

      const fullRange: any[] = [];
      let d = new Date(firstDate);

      while (d <= futureEnd) {
        const dateStr = d.toISOString().split('T')[0];
        const found = logs.find(l => l.log_date === dateStr);

        fullRange.push({
          date: dateStr,
          label: formatMonthYear(dateStr),
          sovereign: found ? found.sovereign_score : undefined, // FIX
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

      {/* Stats */}
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

      {/* Chart */}
      <h2>Sovereign Trajectory</h2>

      <div style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="label" interval={13} />
            <YAxis domain={[0, 175]} />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="sovereign"
              name="Sovereign Score"
              stroke="#2563eb"
              strokeWidth={2}
              dot
              connectNulls={false}   // FIX
            />

            <Line
              type="monotone"
              dataKey="baseline"
              name="Baseline"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pillars */}
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