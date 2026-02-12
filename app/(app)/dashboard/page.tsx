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
const CHART_DAYS = 120; // Changed from 180 to 120 (4 months)

const formatMonthDay = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
};

const toOutOf100 = (value: number) => Math.round((value / 50) * 100);

// Motivational quotes based on performance
const getMotivationalQuote = (streak: number, avgScore: number) => {
  if (streak === 0) {
    return { text: "Every master was once a beginner. Start today.", color: "#94a3b8" };
  }
  if (streak >= 30) {
    return { text: "30+ days. You're no longer building habits—you ARE the habit.", color: "#22c55e" };
  }
  if (streak >= 7) {
    return { text: "One week strong. Momentum is your friend.", color: "#22c55e" };
  }
  if (avgScore >= 140) {
    return { text: "Excellence isn't an act, it's a habit. You're proving it.", color: "#22c55e" };
  }
  if (avgScore < 110) {
    return { text: "Rome wasn't built in a day. Neither is discipline.", color: "#fbbf24" };
  }
  return { text: "Consistency beats intensity. Show up again tomorrow.", color: "#94a3b8" };
};

export default function DashboardPage() {
  const router = useRouter();

  const [chartData, setChartData] = useState<any[]>([]);
  const [avgSovereign, setAvgSovereign] = useState(0);
  const [priorDay, setPriorDay] = useState(0);
  const [daysIn, setDaysIn] = useState(0);
  const [weeksIn, setWeeksIn] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayLogged, setTodayLogged] = useState(false);
  const [triggerData, setTriggerData] = useState<{ trigger: string; count: number }[]>([]);
  const [bestDay, setBestDay] = useState<{ date: string; score: number } | null>(null);
  const [worstDay, setWorstDay] = useState<{ date: string; score: number } | null>(null);

  const [pillarAverages, setPillarAverages] = useState({
    body: 0,
    mind: 0,
    identity: 0,
  });

  const [habitCompletion, setHabitCompletion] = useState({
    body: { completed: 0, total: 0, percentage: 0 },
    mind: { completed: 0, total: 0, percentage: 0 },
    identity: { completed: 0, total: 0, percentage: 0 },
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
        .select(`log_date, sovereign_score, body_score, mind_score, identity_score, negative_trigger, body_physical_activity_completed, body_nutritional_discipline_maintained, mind_positive_habit_completed, mind_negative_habit_avoided, identity_daily_mission_completed, identity_philosophy_practice_completed, is_rest_day`)
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

      // Calculate habit completion % (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentLogs = logs.filter(l => new Date(l.log_date) >= thirtyDaysAgo && !l.is_rest_day);

      const bodyCompleted = recentLogs.filter(l => 
        l.body_physical_activity_completed && l.body_nutritional_discipline_maintained
      ).length;
      const mindCompleted = recentLogs.filter(l => 
        l.mind_positive_habit_completed && l.mind_negative_habit_avoided
      ).length;
      const identityCompleted = recentLogs.filter(l => 
        l.identity_daily_mission_completed && l.identity_philosophy_practice_completed
      ).length;

      const total = recentLogs.length;

      setHabitCompletion({
        body: { 
          completed: bodyCompleted, 
          total, 
          percentage: total > 0 ? Math.round((bodyCompleted / total) * 100) : 0 
        },
        mind: { 
          completed: mindCompleted, 
          total, 
          percentage: total > 0 ? Math.round((mindCompleted / total) * 100) : 0 
        },
        identity: { 
          completed: identityCompleted, 
          total, 
          percentage: total > 0 ? Math.round((identityCompleted / total) * 100) : 0 
        },
      });

      // Check if today is logged
      const today = new Date().toISOString().split('T')[0];
      const todayLog = logs.find(l => l.log_date === today);
      setTodayLogged(!!todayLog);

      // Calculate current streak - FIXED VERSION
      let streak = 0;
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const todayStr = todayDate.toISOString().split('T')[0];
      
      // Sort dates descending (most recent first)
      const sortedDates = logs.map(l => l.log_date).sort((a, b) => b.localeCompare(a));
      
      // Check if user has logged today or yesterday to start counting
      const mostRecentLog = sortedDates[0];
      const mostRecentDate = new Date(mostRecentLog + 'T00:00:00');
      mostRecentDate.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      // Only count streak if most recent log is today or yesterday
      if (mostRecentDate >= yesterday) {
        // Start from most recent log and count backwards
        let checkDate = new Date(mostRecentDate);
        
        for (const logDate of sortedDates) {
          const currentLogDate = new Date(logDate + 'T00:00:00');
          currentLogDate.setHours(0, 0, 0, 0);
          
          if (currentLogDate.getTime() === checkDate.getTime()) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1); // Move to previous day
          } else if (currentLogDate < checkDate) {
            // There's a gap in the logs
            break;
          }
        }
      }

      setCurrentStreak(streak);

      // Calculate best and worst days
      const sorted = [...logs].sort((a, b) => b.sovereign_score - a.sovereign_score);
      setBestDay({
        date: sorted[0].log_date,
        score: sorted[0].sovereign_score,
      });
      setWorstDay({
        date: sorted[sorted.length - 1].log_date,
        score: sorted[sorted.length - 1].sovereign_score,
      });

      // Process trigger data (last 30 days)
      const triggerCounts: { [key: string]: number } = {};
      recentLogs.forEach(log => {
        if (log.negative_trigger && log.negative_trigger !== 'None') {
          triggerCounts[log.negative_trigger] = (triggerCounts[log.negative_trigger] || 0) + 1;
        }
      });

      const triggerArray = Object.entries(triggerCounts)
        .map(([trigger, count]) => ({ trigger, count }))
        .sort((a, b) => b.count - a.count);

      setTriggerData(triggerArray);

      // Build chart data - UPDATED TO 120 DAYS
      const logMap = new Map(logs.map(l => [l.log_date, l]));
      const todayForChart = new Date();
      const firstDate = new Date(logs[0].log_date + 'T00:00:00');

      let startDate: Date;
      let endDate: Date;

      // If user has less than 120 days, show from first log to 120 days ahead
      // If user has 120+ days, show rolling window of most recent 120 days
      if (logs.length < CHART_DAYS) {
        startDate = new Date(firstDate);
        endDate = new Date(firstDate);
        endDate.setDate(endDate.getDate() + CHART_DAYS);
      } else {
        // Rolling window: show last 120 days
        startDate = new Date(todayForChart);
        startDate.setDate(startDate.getDate() - CHART_DAYS);
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
  const quote = getMotivationalQuote(currentStreak, avgSovereign);

  const handleShareProgress = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 630);
    gradient.addColorStop(0, '#020617');
    gradient.addColorStop(1, '#01030f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Border glow effect
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 1160, 590);

    // Title
    ctx.fillStyle = '#e5e7eb';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('Continuum Progress', 60, 100);

    // Streak stat
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 72px Arial';
    ctx.fillText(`${currentStreak} Day Streak`, 60, 220);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px Arial';
    ctx.fillText(`${daysIn} total days logged`, 60, 260);

    // Stats box
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(60, 300, 1080, 200);
    
    // Sovereign Score
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(avgSovereign.toFixed(1), 100, 370);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Avg Sovereign', 100, 410);

    // Body Score
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(toOutOf100(pillarAverages.body).toString(), 400, 370);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Body /100', 400, 410);

    // Mind Score
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(toOutOf100(pillarAverages.mind).toString(), 650, 370);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Mind /100', 650, 410);

    // Identity Score
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(toOutOf100(pillarAverages.identity).toString(), 900, 370);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Identity /100', 900, 410);

    // Quote at bottom
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 22px Arial';
    const quoteText = quote.text;
    const maxWidth = 1080;
    const words = quoteText.split(' ');
    let line = '';
    let y = 560;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 60, y);
        line = words[n] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 60, y);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `continuum-progress-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const handleShareChart = async () => {
    // Find the entire chart container including title
    const chartContainer = document.getElementById('chart-section');
    
    if (!chartContainer) {
      alert('Chart not found. Please try again.');
      return;
    }

    // Dynamically import html2canvas
    const html2canvas = (await import('html2canvas')).default;
    
    try {
      const canvas = await html2canvas(chartContainer as HTMLElement, {
        backgroundColor: '#020617',
        scale: 2,
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `continuum-chart-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error capturing chart:', error);
      alert('Failed to capture chart. Please try again.');
    }
  };

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

        {/* MOTIVATIONAL QUOTE */}
        <div style={{
          padding: 20,
          marginBottom: 32,
          borderRadius: 12,
          background: '#020617',
          border: '1px solid #334155',
          textAlign: 'center',
        }}>
          <p style={{ 
            color: quote.color, 
            fontSize: 16, 
            fontStyle: 'italic',
            margin: 0,
            lineHeight: 1.6,
          }}>
            "{quote.text}"
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
        <div 
          id="chart-section"
          style={{
            marginBottom: 40,
            padding: 24,
            background: '#020617',
            borderRadius: 16,
            border: '1px solid #1e293b',
          }}
        >
          <h2 style={{ fontSize: 22, marginBottom: 20, fontWeight: 600 }}>
            Sovereign Trajectory (Last {CHART_DAYS} Days)
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REST OF THE COMPONENTS... (keeping all the same) */}
        {/* MOVED BELOW CHART: BEST/WORST + HABITS + PILLARS (COMBINED SECTION) */}
        <div style={{ marginBottom: 40 }}>
          
          {/* BEST/WORST DAY */}
          {daysIn > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 20,
              marginBottom: 40,
            }}>
              <BestWorstCard 
                label="Best Day" 
                date={bestDay?.date} 
                score={bestDay?.score}
                color="#22c55e"
                icon="🏆"
              />
              <BestWorstCard 
                label="Worst Day" 
                date={worstDay?.date} 
                score={worstDay?.score}
                color="#ef4444"
                icon="⚠️"
              />
            </div>
          )}

          {/* HABIT COMPLETION % + PILLAR AVERAGES (COMBINED WRAPPER) */}
          <div style={{
            padding: 24,
            background: '#020617',
            borderRadius: 16,
            border: '1px solid #1e293b',
          }}>
            {/* Habits row */}
            {habitCompletion.body.total > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 22, marginBottom: 20, fontWeight: 600 }}>
                  Habit Consistency (Last 30 Days)
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 20,
                }}>
                  <HabitCompletionCard 
                    label="Body Habits"
                    completed={habitCompletion.body.completed}
                    total={habitCompletion.body.total}
                    percentage={habitCompletion.body.percentage}
                    color="#22c55e"
                    icon="💪"
                  />
                  <HabitCompletionCard 
                    label="Mind Habits"
                    completed={habitCompletion.mind.completed}
                    total={habitCompletion.mind.total}
                    percentage={habitCompletion.mind.percentage}
                    color="#3b82f6"
                    icon="🧠"
                  />
                  <HabitCompletionCard 
                    label="Identity Habits"
                    completed={habitCompletion.identity.completed}
                    total={habitCompletion.identity.total}
                    percentage={habitCompletion.identity.percentage}
                    color="#a855f7"
                    icon="⚡"
                  />
                </div>
              </div>
            )}

            {/* Pillars row */}
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

        {/* TRIGGER INSIGHTS */}
        {triggerData.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, marginBottom: 20, fontWeight: 600 }}>
              Weakness Patterns (Last 30 Days)
            </h2>
            <div style={{
              padding: 24,
              borderRadius: 16,
              background: '#020617',
              border: '1px solid #ef444430',
              borderLeft: '4px solid #ef4444',
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10,
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 24 }}>⚠</span>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ef4444', margin: 0 }}>
                  Your Top Triggers
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {triggerData.slice(0, 3).map((item, index) => (
                  <div 
                    key={item.trigger}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 14,
                      background: '#01030f',
                      borderRadius: 10,
                      border: '1px solid #334155',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: index === 0 ? '#ef4444' : '#334155',
                        color: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ color: '#e5e7eb', fontSize: 15, fontWeight: 500 }}>
                        {item.trigger}
                      </span>
                    </div>
                    <span style={{ color: '#ef4444', fontSize: 16, fontWeight: 600 }}>
                      {item.count}x
                    </span>
                  </div>
                ))}
              </div>

              <p style={{ 
                marginTop: 16, 
                color: '#94a3b8', 
                fontSize: 14,
                lineHeight: 1.6,
              }}>
                Awareness is the first step to mastery. Plan ahead to defend against these triggers.
              </p>
            </div>
          </div>
        )}

        {/* SHARE BUTTONS */}
        <div style={{ 
          display: 'flex', 
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={handleShareProgress}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            📸 Share My Progress
          </button>

          <button
            onClick={handleShareChart}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            📊 Share My Chart
          </button>
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

function BestWorstCard({
  label,
  date,
  score,
  color,
  icon,
}: {
  label: string;
  date?: string;
  score?: number;
  color: string;
  icon: string;
}) {
  if (!date || score === undefined) return null;

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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
        marginBottom: 12,
      }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <div style={{ color, fontWeight: 600, fontSize: 16 }}>
          {label}
        </div>
      </div>
      
      <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 4, color }}>
        {score.toFixed(1)}
      </div>
      
      <div style={{ color: '#94a3b8', fontSize: 14 }}>
        {formattedDate}
      </div>
    </div>
  );
}

function HabitCompletionCard({
  label,
  completed,
  total,
  percentage,
  color,
  icon,
}: {
  label: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
  icon: string;
}) {
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
      
      <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 4, color }}>
        {percentage}%
      </div>

      <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 12 }}>
        {completed}/{total} days
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