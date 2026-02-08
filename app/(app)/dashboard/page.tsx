'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayLogged, setTodayLogged] = useState(false);

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

      // Check if today is logged
      const today = new Date().toISOString().split('T')[0];
      const todayLog = logs.find(l => l.log_date === today);
      setTodayLogged(!!todayLog);

      // Calculate current streak
      let streak = 0;
      const sortedDates = logs.map(l => l.log_date).sort().reverse();
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); // Reset to midnight

      for (let i = 0; i < sortedDates.length; i++) {
        const logDate = new Date(sortedDates[i] + 'T00:00:00');
        logDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(todayDate);
        expectedDate.setDate(todayDate.getDate() - i);
        expectedDate.setHours(0, 0, 0, 0);
        
        const logDateStr = logDate.toISOString().split('T')[0];
        const expectedDateStr = expectedDate.toISOString().split('T')[0];
        
        if (logDateStr === expectedDateStr) {
          streak++;
        } else {
          break;
        }
      }

      // If streak is still 0 but we have logs, at least count today
      if (streak === 0 && logs.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const hasToday = logs.some(l => l.log_date === todayStr);
        if (hasToday) streak = 1;
      }

      setCurrentStreak(streak);

      // Build chart data with smart 6-month window
      const logMap = new Map(logs.map(l => [l.log_date, l]));
      const todayForChart = new Date();
      const firstDate = new Date(logs[0].log_date + 'T00:00:00');

      let startDate: Date;
      let endDate: Date;

      if (logs.length < 180) {
        // New users (< 6 months): show from day 1 to 6 months forward
        startDate = new Date(firstDate);
        endDate = new Date(firstDate);
        endDate.setDate(endDate.getDate() + 180);
      } else {
        // Veteran users (6+ months): show rolling 6-month window
        startDate = new Date(todayForChart);
        startDate.setDate(startDate.getDate() - 180);
        endDate = new Date(todayForChart);
      }

      const range: any[] = [];
      let d = new Date(startDate);

      while (d <= endDate) {
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

  const trend = avgSovereign > priorDay ? 'up' : avgSovereign < priorDay ? 'down' : 'stable';

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>
            Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            Your discipline, measured over time.
          </p>
        </div>

        {/* TODAY CTA */}
        {!todayLogged && (
          <div style={{
            padding: 20,
            marginBottom: 32,
            borderRadius: 12,
            background: '#022c22',
            border: '2px solid #22c55e',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h3 style={{ color: '#22c55e', marginBottom: 4, fontSize: 18 }}>
                Today's log is pending
              </h3>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
                Keep your streak alive. Log your day.
              </p>
            </div>
            <Link
              href="/daily"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                color: '#020617',
                fontWeight: 600,
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 15,
              }}
            >
              Log Today
            </Link>
          </div>
        )}

        {/* STATS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          <StatCard label="Current Streak" value={`${currentStreak} days`} color="#22c55e" />
          <StatCard label="Total Days" value={daysIn} />
          <StatCard label="Weeks Active" value={weeksIn} />
          <StatCard 
            label="Avg Sovereign" 
            value={avgSovereign.toFixed(1)} 
            trend={trend}
          />
        </div>

        {/* CHART */}
        <div style={{
          marginBottom: 40,
          padding: 24,
          background: '#020617',
          borderRadius: 16,
          border: '1px solid #1e293b',
        }}>
          <h2 style={{ fontSize: 22, marginBottom: 20, fontWeight: 600 }}>
            Sovereign Trajectory (6 Months)
          </h2>
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="label" 
                  interval={30} 
                  stroke="#94a3b8"
                  style={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 175]} 
                  stroke="#94a3b8"
                  style={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid #334155',
                    color: '#e5e7eb',
                    borderRadius: 8,
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
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PILLAR AVERAGES */}
        <div>
          <h2 style={{ fontSize: 22, marginBottom: 20, fontWeight: 600 }}>
            Pillar Performance
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
          }}>
            <PillarCard 
              label="Body" 
              value={pillarAverages.body} 
              color="#22c55e"
              icon="💪"
            />
            <PillarCard 
              label="Mind" 
              value={pillarAverages.mind} 
              color="#3b82f6"
              icon="🧠"
            />
            <PillarCard 
              label="Identity" 
              value={pillarAverages.identity} 
              color="#a855f7"
              icon="⚡"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ 
  label, 
  value, 
  color, 
  trend 
}: { 
  label: string; 
  value: any;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
}) {
  return (
    <div style={{
      background: '#020617',
      padding: 24,
      borderRadius: 12,
      border: '1px solid #1e293b',
    }}>
      <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8 
      }}>
        <div style={{ 
          fontSize: 28, 
          fontWeight: 600,
          color: color || '#e5e7eb',
        }}>
          {value}
        </div>
        {trend && trend !== 'stable' && (
          <span style={{ 
            fontSize: 18,
            color: trend === 'up' ? '#22c55e' : '#ef4444',
          }}>
            {trend === 'up' ? '↗' : '↘'}
          </span>
        )}
      </div>
    </div>
  );
}

function PillarCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  const percentage = toOutOf100(value);
  
  return (
    <div style={{
      background: '#020617',
      padding: 24,
      borderRadius: 12,
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 10,
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <div style={{ color, fontWeight: 600, fontSize: 16 }}>
          {label}
        </div>
      </div>
      
      <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>
        {percentage}
        <span style={{ fontSize: 18, color: '#94a3b8', fontWeight: 400 }}>
          /100
        </span>
      </div>
      
      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: 8,
        background: '#1e293b',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: 4,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}