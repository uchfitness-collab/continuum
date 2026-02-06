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

const formatMonthDay = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
};

const toOutOf100 = (value: number) => Math.round((value / 50) * 100);

export default function DashboardPage() {
  const router = useRouter();

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

      const { data: logs } = await supabase
        .from('daily_logs')
        .select(`log_date, sovereign_score, body_score, mind_score, identity_score`)
        .eq('user_id', auth.user.id)
        .order('log_date', { ascending: true });

      if (!logs || logs.length === 0) return;

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

      const logMap = new Map(logs.map(l => [l.log_date, l]));
      const firstDate = new Date(logs[0].log_date + 'T00:00:00');
      const futureEnd = new Date(firstDate);
      futureEnd.setDate(futureEnd.getDate() + 90);

      const range: any[] = [];
      let d = new Date(firstDate);

      while (d <= futureEnd) {
        const dateStr = d.toISOString().split('T')[0];
        const found = logMap.get(dateStr);

        range.push({
          label: formatMonthDay(dateStr),
          sovereign: found ? found.sovereign_score : null,
          baseline: BASELINE_SCORE,
        });

        d.setDate(d.getDate() + 1);
      }

      setChartData(range);
    };

    load();
  }, [router]);

  return (
    <div className="page">
      <div className="watermark" />

      <div className="content">
        <header>
          <h1>Continuum Dashboard</h1>
          <p className="subtitle">Your discipline, measured over time.</p>
        </header>

        <div className="stats">
          <Stat label="Days In" value={daysIn} />
          <Stat label="Weeks" value={weeksIn} />
          <Stat label="Avg Sovereign" value={avgSovereign.toFixed(1)} />
          <Stat label="Prior Day" value={priorDay.toFixed(1)} />
        </div>

        <section>
          <h2>Sovereign Trajectory</h2>

          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="label" interval={30} stroke="#94a3b8" />
                <YAxis domain={[0, 175]} stroke="#94a3b8" />
                <Tooltip
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
                  connectNulls
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
        </section>

        <section>
          <h3>Pillar Averages</h3>
          <div className="pillars">
            <Pillar label="Body" value={pillarAverages.body} color="#22c55e" />
            <Pillar label="Mind" value={pillarAverages.mind} color="#3b82f6" />
            <Pillar label="Identity" value={pillarAverages.identity} color="#a855f7" />
          </div>
        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 60px 32px;
          background: radial-gradient(circle at top, #020617, #01030f);
          position: relative;
        }
        .watermark {
          position: absolute;
          inset: 0;
          background: url('/continuum-hero.jpg') center / 460px no-repeat;
          opacity: 0.035;
          pointer-events: none;
        }
        .content {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
        }
        header h1 {
          font-size: 32px;
          font-weight: 600;
        }
        .subtitle {
          color: #94a3b8;
          margin-top: 4px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: 36px 0;
        }
        .chart {
          height: 360px;
          background: #020617;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 0 0 1px #1e293b;
        }
        section h2 {
          font-size: 22px;
          margin-bottom: 16px;
        }
        section h3 {
          margin-top: 36px;
          margin-bottom: 16px;
        }
        .pillars {
          display: flex;
          gap: 32px;
        }
      `}</style>
    </div>
  );
}

/* ---------- Components ---------- */

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div
      style={{
        background: '#020617',
        padding: 20,
        borderRadius: 14,
        boxShadow: '0 0 0 1px #1e293b',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Pillar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div style={{ color, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 20 }}>
        {toOutOf100(value)} / 100
      </div>
    </div>
  );
}