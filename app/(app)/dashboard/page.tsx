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

const CHART_DAYS = 120;

const getESTDate = () => {
  const now = new Date();
  const estString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const estDate = new Date(estString);
  const year = estDate.getFullYear();
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatMonthDay = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
};

const toOutOf100 = (value: number) => Math.round((value / 50) * 100);

const getScoreStatus = (avg: number): { label: string; color: string } => {
  if (avg >= 140) return { label: '👑 Sovereign', color: '#22c55e' };
  if (avg >= 130) return { label: '🔒 Locked In', color: '#22c55e' };
  if (avg >= 110) return { label: '📈 Building', color: '#3b82f6' };
  if (avg >= 90)  return { label: '🔍 Finding Your Footing', color: '#fbbf24' };
  return { label: '🌱 Getting Started', color: '#94a3b8' };
};

const getMotivationalQuote = (streak: number, avgScore: number) => {
  if (streak === 0) return { text: "Every master was once a beginner. Start today.", color: "#94a3b8" };
  if (streak >= 30) return { text: "30+ days. You're no longer building habits—you ARE the habit.", color: "#22c55e" };
  if (streak >= 7)  return { text: "One week strong. Momentum is your friend.", color: "#22c55e" };
  if (avgScore >= 140) return { text: "Excellence isn't an act, it's a habit. You're proving it.", color: "#22c55e" };
  if (avgScore < 110)  return { text: "Rome wasn't built in a day. Neither is discipline.", color: "#fbbf24" };
  return { text: "Consistency beats intensity. Show up again tomorrow.", color: "#94a3b8" };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color, fontSize: 14, fontWeight: 600, margin: '2px 0' }}>
            {entry.name}: {entry.value !== null ? entry.value.toFixed(1) : '—'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [chartData, setChartData] = useState<any[]>([]);
  const [avgSovereign, setAvgSovereign] = useState(0);
  const [last7DaysAvg, setLast7DaysAvg] = useState(0);
  const [priorDay, setPriorDay] = useState(0);
  const [daysIn, setDaysIn] = useState(0);
  const [weeksIn, setWeeksIn] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestDay, setBestDay] = useState(0);
  const [todayLogged, setTodayLogged] = useState(false);
  const [triggerData, setTriggerData] = useState<{ trigger: string; count: number }[]>([]);
  const [baselineScore, setBaselineScore] = useState(110);
  const [isMobile, setIsMobile] = useState(false);

  const [pillarAverages, setPillarAverages] = useState({ body: 0, mind: 0, identity: 0 });
  const [habitCompletion, setHabitCompletion] = useState({
    body: { completed: 0, total: 0, percentage: 0 },
    mind: { completed: 0, total: 0, percentage: 0 },
    identity: { completed: 0, total: 0, percentage: 0 },
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.push('/login'); return; }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('baseline_score')
        .eq('user_id', auth.user.id)
        .maybeSingle();

      const userBaseline = profile?.baseline_score || 110;
      setBaselineScore(userBaseline);

      const { data: logs } = await supabase
        .from('daily_logs')
        .select(`log_date, sovereign_score, body_score, mind_score, identity_score, negative_trigger, body_physical_activity_completed, body_nutritional_discipline_maintained, mind_positive_habit_completed, mind_negative_habit_avoided, identity_daily_mission_completed, identity_philosophy_practice_completed, is_rest_day`)
        .eq('user_id', auth.user.id)
        .order('log_date', { ascending: true });

      if (!logs || logs.length === 0) return;

      setDaysIn(logs.length);
      setWeeksIn(Math.ceil(logs.length / 7));

      const sovereignScores = logs.map(l => l.sovereign_score);
      setAvgSovereign(sovereignScores.reduce((a, b) => a + b, 0) / sovereignScores.length);
      setBestDay(Math.max(...sovereignScores));
      setPriorDay(logs.length > 1 ? logs[logs.length - 2].sovereign_score : logs[0].sovereign_score);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const last7Logs = logs.filter(l => new Date(l.log_date) >= sevenDaysAgo);
      if (last7Logs.length > 0) {
        setLast7DaysAvg(last7Logs.reduce((sum, log) => sum + log.sovereign_score, 0) / last7Logs.length);
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      setPillarAverages({
        body: logs.reduce((s, l) => s + l.body_score, 0) / logs.length,
        mind: logs.reduce((s, l) => s + l.mind_score, 0) / logs.length,
        identity: logs.reduce((s, l) => s + l.identity_score, 0) / logs.length,
      });

      const recentLogs = logs.filter(l => new Date(l.log_date) >= thirtyDaysAgo && !l.is_rest_day);
      const total = recentLogs.length;

      setHabitCompletion({
        body: {
          completed: recentLogs.filter(l => l.body_physical_activity_completed && l.body_nutritional_discipline_maintained).length,
          total,
          percentage: total > 0 ? Math.round((recentLogs.filter(l => l.body_physical_activity_completed && l.body_nutritional_discipline_maintained).length / total) * 100) : 0,
        },
        mind: {
          completed: recentLogs.filter(l => l.mind_positive_habit_completed && l.mind_negative_habit_avoided).length,
          total,
          percentage: total > 0 ? Math.round((recentLogs.filter(l => l.mind_positive_habit_completed && l.mind_negative_habit_avoided).length / total) * 100) : 0,
        },
        identity: {
          completed: recentLogs.filter(l => l.identity_daily_mission_completed && l.identity_philosophy_practice_completed).length,
          total,
          percentage: total > 0 ? Math.round((recentLogs.filter(l => l.identity_daily_mission_completed && l.identity_philosophy_practice_completed).length / total) * 100) : 0,
        },
      });

      const today = getESTDate();
      setTodayLogged(!!logs.find(l => l.log_date === today));

      let streak = 0;
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const sortedDates = logs.map(l => l.log_date).sort((a, b) => b.localeCompare(a));
      const mostRecentDate = new Date(sortedDates[0] + 'T00:00:00');
      mostRecentDate.setHours(0, 0, 0, 0);
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      if (mostRecentDate >= yesterday) {
        let checkDate = new Date(mostRecentDate);
        for (const logDate of sortedDates) {
          const currentLogDate = new Date(logDate + 'T00:00:00');
          currentLogDate.setHours(0, 0, 0, 0);
          if (currentLogDate.getTime() === checkDate.getTime()) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else if (currentLogDate < checkDate) break;
        }
      }
      setCurrentStreak(streak);

      const triggerCounts: { [key: string]: number } = {};
      recentLogs.forEach(log => {
        if (log.negative_trigger && log.negative_trigger !== 'None') {
          triggerCounts[log.negative_trigger] = (triggerCounts[log.negative_trigger] || 0) + 1;
        }
      });
      setTriggerData(Object.entries(triggerCounts).map(([trigger, count]) => ({ trigger, count })).sort((a, b) => b.count - a.count));

      const logMap = new Map(logs.map(l => [l.log_date, l]));
      const todayForChart = new Date();
      const firstDate = new Date(logs[0].log_date + 'T00:00:00');
      let startDate: Date, endDate: Date;

      if (logs.length < CHART_DAYS) {
        startDate = new Date(firstDate);
        endDate = new Date(firstDate);
        endDate.setDate(endDate.getDate() + CHART_DAYS);
      } else {
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
          baseline: userBaseline,
        });
        d.setDate(d.getDate() + 1);
      }
      setChartData(range);
    };

    load();
  }, [router]);

  const trend = avgSovereign > priorDay ? 'up' : avgSovereign < priorDay ? 'down' : 'stable';
  const quote = getMotivationalQuote(currentStreak, avgSovereign);
  const trend7Days = last7DaysAvg > avgSovereign ? 'up' : last7DaysAvg < avgSovereign ? 'down' : 'stable';
  const scoreStatus = getScoreStatus(avgSovereign);

  // Overall consistency = avg of all 3 pillar percentages
  const overallConsistency = Math.round((habitCompletion.body.percentage + habitCompletion.mind.percentage + habitCompletion.identity.percentage) / 3);

  // Sovereign average = combined pillar average out of 100
  const sovereignAverage = Math.round((toOutOf100(pillarAverages.body) + toOutOf100(pillarAverages.mind) + toOutOf100(pillarAverages.identity)) / 3);

  // Chart x-axis: show fewer ticks on mobile
  const xAxisInterval = isMobile
    ? Math.floor(chartData.length / 3)
    : Math.floor(chartData.length / 5);

  const chartHeight = isMobile ? 240 : 450;

  const handleShareProgress = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 630);
    gradient.addColorStop(0, '#020617');
    gradient.addColorStop(1, '#01030f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 1160, 590);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('Continuum Progress', 60, 100);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 72px Arial';
    ctx.fillText(`${currentStreak} Day Streak`, 60, 220);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '24px Arial';
    ctx.fillText(`${daysIn} total days logged`, 60, 260);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(60, 300, 1080, 200);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(avgSovereign.toFixed(1), 100, 370);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Avg Sovereign', 100, 410);
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(toOutOf100(pillarAverages.body).toString(), 400, 370);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Body /100', 400, 410);
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(toOutOf100(pillarAverages.mind).toString(), 650, 370);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Mind /100', 650, 410);
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(toOutOf100(pillarAverages.identity).toString(), 900, 370);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px Arial';
    ctx.fillText('Identity /100', 900, 410);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 22px Arial';
    const words = quote.text.split(' ');
    let line = '';
    let y = 560;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > 1080 && n > 0) {
        ctx.fillText(line, 60, y);
        line = words[n] + ' ';
        y += 30;
      } else { line = testLine; }
    }
    ctx.fillText(line, 60, y);

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
    const chartContainer = document.getElementById('chart-section');
    if (!chartContainer) { alert('Chart not found. Please try again.'); return; }
    const html2canvas = (await import('html2canvas')).default;
    try {
      const canvas = await html2canvas(chartContainer as HTMLElement, { backgroundColor: '#020617', scale: 2, logging: false });
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .dashboard-root {
          min-height: 100vh;
          padding: 60px 24px 80px;
          background: radial-gradient(ellipse at top, #0a0f1e 0%, #020617 50%, #01030f 100%);
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 768px) {
          .dashboard-root { padding: 24px 16px 60px; }
        }

        .stat-card {
          background: linear-gradient(135deg, #0d1424 0%, #080d1a 100%);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #1e293b;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
          pointer-events: none;
        }

        .stat-card:hover {
          border-color: #334155;
          transform: translateY(-2px);
        }

        .glow-card {
          box-shadow: 0 0 30px rgba(34, 197, 94, 0.08);
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #1e293b;
          border-radius: 999px;
          overflow: hidden;
          margin-top: 12px;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4));
          border-radius: 999px;
        }

        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #e5e7eb;
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }

        .chart-container {
          background: linear-gradient(135deg, #080e1e 0%, #060b17 100%);
          border-radius: 20px;
          border: 1px solid #1e293b;
          padding: 28px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .chart-container::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #22c55e30, transparent);
        }

        @media (max-width: 768px) {
          .chart-container { padding: 16px; }
        }

        .quote-bar {
          padding: 18px 24px;
          margin-bottom: 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0d1424 0%, #080d1a 100%);
          border: 1px solid #1e293b;
          border-left: 3px solid #22c55e40;
          position: relative;
          overflow: hidden;
        }

        .quote-bar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at left, rgba(34,197,94,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .log-banner {
          padding: 18px 20px;
          margin-bottom: 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, #022c22 0%, #011a15 100%);
          border: 1px solid #22c55e40;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .log-btn {
          padding: 12px 22px;
          background: linear-gradient(180deg, #22c55e, #16a34a);
          color: #020617;
          font-weight: 700;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          flex-shrink: 0;
        }

        .inner-section {
          padding: 28px;
          background: linear-gradient(135deg, #080d1a 0%, #060b17 100%);
          border-radius: 20px;
          border: 1px solid #1e293b;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .inner-section { padding: 20px 16px; }
        }

        .weakness-card {
          padding: 20px 24px;
          border-radius: 16px;
          background: linear-gradient(135deg, #080d1a 0%, #060b17 100%);
          border: 1px solid #ef444420;
          border-left: 3px solid #ef4444;
          margin-bottom: 32px;
        }

        .share-btn {
          padding: 14px 28px;
          color: #fff;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s, transform 0.2s;
        }

        .share-btn:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      <div className="dashboard-root">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* HEADER */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: isMobile ? 28 : 40, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.03em', color: '#f1f5f9' }}>
              Dashboard
            </h1>
            <p style={{ color: '#475569', fontSize: 15 }}>Your discipline, measured over time.</p>
          </div>

          {/* QUOTE */}
          <div className="quote-bar">
            <p style={{ color: quote.color, fontSize: 15, fontStyle: 'italic', margin: 0, lineHeight: 1.7 }}>
              "{quote.text}"
            </p>
          </div>

          {/* LOG BANNER */}
          {!todayLogged && (
            <div className="log-banner">
              <div>
                <h3 style={{ color: '#22c55e', marginBottom: 4, fontSize: 16, fontWeight: 600 }}>Today's log is pending</h3>
                <p style={{ color: '#475569', fontSize: 14, margin: 0 }}>Keep your streak alive. Log your day.</p>
              </div>
              <Link href="/daily" className="log-btn">Log Today</Link>
            </div>
          )}

          {/* TOP STAT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 32 }}>
            <StatCard label="Current Streak" value={`${currentStreak} days`} color="#22c55e" glow />
            <StatCard label="Total Days" value={daysIn} />
            <StatCard label="Weeks Active" value={weeksIn} />
            <StatCard label="Best Day" value={bestDay > 0 ? bestDay.toFixed(1) : '—'} color="#fbbf24" />
          </div>

          {/* AVG SOVEREIGN FEATURE CARD */}
          <div style={{
            padding: isMobile ? '20px' : '28px 32px',
            marginBottom: 32,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #0d1424 0%, #080d1a 100%)',
            border: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${scoreStatus.color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div>
              <div style={{ color: '#475569', fontSize: 13, marginBottom: 6, fontWeight: 500 }}>Avg Sovereign Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: isMobile ? 40 : 52, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {avgSovereign > 0 ? avgSovereign.toFixed(1) : '—'}
                </span>
                {trend !== 'stable' && avgSovereign > 0 && (
                  <span style={{ fontSize: 24, color: trend === 'up' ? '#22c55e' : '#ef4444' }}>
                    {trend === 'up' ? '↗' : '↘'}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: scoreStatus.color, marginBottom: 4 }}>{scoreStatus.label}</div>
              <div style={{ color: '#475569', fontSize: 13 }}>All-time average</div>
            </div>
          </div>

          {/* CHART */}
          <div id="chart-section" className="chart-container">
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: isMobile ? 18 : 22, marginBottom: 24, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              Sovereign Score
            </h2>
            <div style={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: isMobile ? -20 : 0, bottom: 5 }}>
                  <XAxis
                    dataKey="label"
                    interval={xAxisInterval}
                    stroke="#1e293b"
                    tick={{ fill: '#475569', fontSize: isMobile ? 10 : 12, fontFamily: 'DM Sans' }}
                    axisLine={{ stroke: '#1e293b' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 175]}
                    stroke="#1e293b"
                    tick={{ fill: '#475569', fontSize: isMobile ? 10 : 12, fontFamily: 'DM Sans' }}
                    axisLine={false}
                    tickLine={false}
                    ticks={[0, 50, 110, 150, 175]}
                    width={isMobile ? 30 : 40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 20, fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name={`Baseline (${baselineScore})`}
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    activeDot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="sovereign"
                    name="Your Score"
                    stroke="#3b82f6"
                    strokeWidth={isMobile ? 2 : 3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#020617', strokeWidth: 3 }}
                    connectNulls
                  />

                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TREND CARDS */}
          {daysIn > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <TrendCard label="Last 7 Days Avg" value={last7DaysAvg} trend={trend7Days} color="#3b82f6" icon="📈" />
              <StrongestPillarCard pillarAverages={pillarAverages} />
              <NeedsAttentionCard pillarAverages={pillarAverages} />
              <OverallConsistencyCard percentage={overallConsistency} />
            </div>
          )}

          {/* HABIT CONSISTENCY + PILLAR PERFORMANCE */}
          <div className="inner-section">
            {habitCompletion.body.total > 0 && (
              <div style={{ marginBottom: 36 }}>
                <h2 className="section-title">Habit Consistency — Last 30 Days</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                  <HabitCompletionCard label="Body Habits" completed={habitCompletion.body.completed} total={habitCompletion.body.total} percentage={habitCompletion.body.percentage} color="#22c55e" icon="💪" />
                  <HabitCompletionCard label="Mind Habits" completed={habitCompletion.mind.completed} total={habitCompletion.mind.total} percentage={habitCompletion.mind.percentage} color="#3b82f6" icon="🧠" />
                  <HabitCompletionCard label="Identity Habits" completed={habitCompletion.identity.completed} total={habitCompletion.identity.total} percentage={habitCompletion.identity.percentage} color="#a855f7" icon="⚡" />
                  <HabitCompletionCard label="All 3 Pillars" completed={Math.round(overallConsistency * habitCompletion.body.total / 100)} total={habitCompletion.body.total} percentage={overallConsistency} color="#fbbf24" icon="🏆" />
                </div>
              </div>
            )}

            <div>
              <h2 className="section-title">Pillar Performance</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                <PillarCard label="Body" value={pillarAverages.body} color="#22c55e" icon="💪" />
                <PillarCard label="Mind" value={pillarAverages.mind} color="#3b82f6" icon="🧠" />
                <PillarCard label="Identity" value={pillarAverages.identity} color="#a855f7" icon="⚡" />
                <PillarCard label="Sovereign Avg" value={(pillarAverages.body + pillarAverages.mind + pillarAverages.identity) / 3} color="#fbbf24" icon="👑" overrideValue={sovereignAverage} />
              </div>
            </div>
          </div>

          {/* WEAKNESS PATTERNS */}
          {triggerData.length > 0 && (
            <div className="weakness-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 22 }}>⚠️</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#ef4444', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Weakness Patterns</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {triggerData.slice(0, 3).map((item, index) => (
                  <div key={item.trigger} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#060b17', borderRadius: 10, border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: index === 0 ? '#ef4444' : '#1e293b', color: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{index + 1}</span>
                      <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>{item.trigger}</span>
                    </div>
                    <span style={{ color: '#ef4444', fontSize: 15, fontWeight: 700 }}>{item.count}x</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 14, color: '#475569', fontSize: 13, lineHeight: 1.6 }}>
                Awareness is the first step to mastery. Plan ahead to defend against these triggers.
              </p>
            </div>
          )}

          {/* SHARE BUTTONS */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleShareProgress} className="share-btn" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              📸 Share Progress
            </button>
            <button onClick={handleShareChart} className="share-btn" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              📊 Share Chart
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, color, glow }: { label: string; value: any; color?: string; glow?: boolean }) {
  return (
    <div className={`stat-card${glow ? ' glow-card' : ''}`}>
      <div style={{ color: '#475569', fontSize: 12, fontWeight: 500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, color: color || '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function TrendCard({ label, value, trend, color, icon }: { label: string; value: number; trend: 'up' | 'down' | 'stable'; color: string; icon: string }) {
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ color: '#475569', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value > 0 ? value.toFixed(1) : '—'}</div>
        {value > 0 && trend !== 'stable' && (
          <span style={{ fontSize: 18, color: trend === 'up' ? '#22c55e' : '#ef4444' }}>{trend === 'up' ? '↗' : '↘'}</span>
        )}
      </div>
      <div style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>
        {trend === 'up' && 'Improving'}{trend === 'down' && 'Needs focus'}{trend === 'stable' && 'Steady'}
      </div>
    </div>
  );
}

function StrongestPillarCard({ pillarAverages }: { pillarAverages: { body: number; mind: number; identity: number } }) {
  const pillars = [
    { name: 'Body', value: pillarAverages.body, icon: '💪', color: '#22c55e' },
    { name: 'Mind', value: pillarAverages.mind, icon: '🧠', color: '#3b82f6' },
    { name: 'Identity', value: pillarAverages.identity, icon: '⚡', color: '#a855f7' },
  ];
  const strongest = pillars.reduce((max, p) => p.value > max.value ? p : max);
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${strongest.color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{strongest.icon}</span>
        <div style={{ color: '#475569', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Strongest Pillar</div>
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color: strongest.color, letterSpacing: '-0.02em', marginBottom: 4 }}>{strongest.name}</div>
      <div style={{ color: '#475569', fontSize: 12 }}>{toOutOf100(strongest.value)}% average</div>
    </div>
  );
}

function NeedsAttentionCard({ pillarAverages }: { pillarAverages: { body: number; mind: number; identity: number } }) {
  const pillars = [
    { name: 'Body', value: pillarAverages.body, icon: '💪', color: '#22c55e' },
    { name: 'Mind', value: pillarAverages.mind, icon: '🧠', color: '#3b82f6' },
    { name: 'Identity', value: pillarAverages.identity, icon: '⚡', color: '#a855f7' },
  ];
  const weakest = pillars.reduce((min, p) => p.value < min.value ? p : min);
  return (
    <div className="stat-card" style={{ borderLeft: '3px solid #fbbf24' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{weakest.icon}</span>
        <div style={{ color: '#475569', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Needs Attention</div>
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color: '#fbbf24', letterSpacing: '-0.02em', marginBottom: 4 }}>{weakest.name}</div>
      <div style={{ color: '#475569', fontSize: 12 }}>{toOutOf100(weakest.value)}% average</div>
    </div>
  );
}

function OverallConsistencyCard({ percentage }: { percentage: number }) {
  return (
    <div className="stat-card" style={{ borderLeft: '3px solid #e879f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>🎯</span>
        <div style={{ color: '#475569', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overall Consistency</div>
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 800, color: '#e879f9', letterSpacing: '-0.02em', marginBottom: 8 }}>{percentage > 0 ? `${percentage}%` : '—'}</div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%`, background: 'linear-gradient(90deg, #a855f7, #e879f9)' }} />
      </div>
    </div>
  );
}

function HabitCompletionCard({ label, completed, total, percentage, color, icon }: { label: string; completed: number; total: number; percentage: number; color: string; icon: string }) {
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ color: '#475569', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color, letterSpacing: '-0.03em', marginBottom: 4 }}>{percentage}%</div>
      <div style={{ color: '#475569', fontSize: 12, marginBottom: 10 }}>{completed}/{total} days</div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
}

function PillarCard({ label, value, color, icon, overrideValue }: { label: string; value: number; color: string; icon: string; overrideValue?: number }) {
  const percentage = overrideValue !== undefined ? overrideValue : toOutOf100(value);
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ color: '#475569', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      </div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
        <span style={{ color }}>{percentage}</span>
        <span style={{ fontSize: 16, color: '#334155', fontWeight: 400 }}>/100</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
}