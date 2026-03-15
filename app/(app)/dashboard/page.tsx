'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabaseClient';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
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
  if (avg >= 140) return { label: 'Sovereign',           color: '#4ade80' };
  if (avg >= 130) return { label: 'Locked In',           color: '#4ade80' };
  if (avg >= 110) return { label: 'Building',            color: '#60a5fa' };
  if (avg >= 90)  return { label: 'Finding Your Footing',color: '#fbbf24' };
  return             { label: 'Getting Started',         color: 'rgba(255,255,255,0.3)' };
};

const getMotivationalQuote = (streak: number, avgScore: number) => {
  if (streak === 0)    return { text: 'Every master was once a beginner. Start today.',                    color: 'rgba(255,255,255,0.35)' };
  if (streak >= 30)   return { text: "30+ days. You're no longer building habits — you ARE the habit.",   color: '#4ade80' };
  if (streak >= 7)    return { text: 'One week strong. Momentum is your friend.',                         color: '#4ade80' };
  if (avgScore >= 140) return { text: "Excellence isn't an act, it's a habit. You're proving it.",        color: '#4ade80' };
  if (avgScore < 110)  return { text: "Rome wasn't built in a day. Neither is discipline.",               color: '#fbbf24' };
  return                { text: 'Consistency beats intensity. Show up again tomorrow.',                   color: 'rgba(255,255,255,0.35)' };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '12px 16px' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color, fontSize: 13, fontWeight: 600, margin: '2px 0' }}>
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
    body:     { completed: 0, total: 0, percentage: 0 },
    mind:     { completed: 0, total: 0, percentage: 0 },
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

      const { data: profile } = await supabase.from('user_profiles').select('baseline_score').eq('user_id', auth.user.id).maybeSingle();
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
      if (last7Logs.length > 0) setLast7DaysAvg(last7Logs.reduce((sum, log) => sum + log.sovereign_score, 0) / last7Logs.length);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      setPillarAverages({
        body:     logs.reduce((s, l) => s + l.body_score, 0)     / logs.length,
        mind:     logs.reduce((s, l) => s + l.mind_score, 0)     / logs.length,
        identity: logs.reduce((s, l) => s + l.identity_score, 0) / logs.length,
      });

      const recentLogs = logs.filter(l => new Date(l.log_date) >= thirtyDaysAgo && !l.is_rest_day);
      const total = recentLogs.length;

      setHabitCompletion({
        body:     { completed: recentLogs.filter(l => l.body_physical_activity_completed && l.body_nutritional_discipline_maintained).length, total, percentage: total > 0 ? Math.round((recentLogs.filter(l => l.body_physical_activity_completed && l.body_nutritional_discipline_maintained).length / total) * 100) : 0 },
        mind:     { completed: recentLogs.filter(l => l.mind_positive_habit_completed && l.mind_negative_habit_avoided).length, total, percentage: total > 0 ? Math.round((recentLogs.filter(l => l.mind_positive_habit_completed && l.mind_negative_habit_avoided).length / total) * 100) : 0 },
        identity: { completed: recentLogs.filter(l => l.identity_daily_mission_completed && l.identity_philosophy_practice_completed).length, total, percentage: total > 0 ? Math.round((recentLogs.filter(l => l.identity_daily_mission_completed && l.identity_philosophy_practice_completed).length / total) * 100) : 0 },
      });

      const today = getESTDate();
      setTodayLogged(!!logs.find(l => l.log_date === today));

      let streak = 0;
      const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0);
      const sortedDates = logs.map(l => l.log_date).sort((a, b) => b.localeCompare(a));
      const mostRecentDate = new Date(sortedDates[0] + 'T00:00:00'); mostRecentDate.setHours(0, 0, 0, 0);
      const yesterday = new Date(todayDate); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0, 0, 0, 0);
      if (mostRecentDate >= yesterday) {
        let checkDate = new Date(mostRecentDate);
        for (const logDate of sortedDates) {
          const currentLogDate = new Date(logDate + 'T00:00:00'); currentLogDate.setHours(0, 0, 0, 0);
          if (currentLogDate.getTime() === checkDate.getTime()) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
          else if (currentLogDate < checkDate) break;
        }
      }
      setCurrentStreak(streak);

      const triggerCounts: { [key: string]: number } = {};
      recentLogs.forEach(log => { if (log.negative_trigger && log.negative_trigger !== 'None') triggerCounts[log.negative_trigger] = (triggerCounts[log.negative_trigger] || 0) + 1; });
      setTriggerData(Object.entries(triggerCounts).map(([trigger, count]) => ({ trigger, count })).sort((a, b) => b.count - a.count));

      const logMap = new Map(logs.map(l => [l.log_date, l]));
      const todayForChart = new Date();
      const firstDate = new Date(logs[0].log_date + 'T00:00:00');
      let startDate: Date, endDate: Date;
      if (logs.length < CHART_DAYS) { startDate = new Date(firstDate); endDate = new Date(firstDate); endDate.setDate(endDate.getDate() + CHART_DAYS); }
      else { startDate = new Date(todayForChart); startDate.setDate(startDate.getDate() - CHART_DAYS); endDate = new Date(todayForChart); }

      const range: any[] = [];
      let d = new Date(startDate);
      while (d <= endDate) {
        const dateStr = d.toISOString().split('T')[0];
        const found = logMap.get(dateStr);
        range.push({ label: formatMonthDay(dateStr), sovereign: found ? found.sovereign_score : null, baseline: userBaseline });
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
  const overallConsistency = Math.round((habitCompletion.body.percentage + habitCompletion.mind.percentage + habitCompletion.identity.percentage) / 3);
  const sovereignAverage = Math.round((toOutOf100(pillarAverages.body) + toOutOf100(pillarAverages.mind) + toOutOf100(pillarAverages.identity)) / 3);
  const xAxisInterval = isMobile ? Math.floor(chartData.length / 3) : Math.floor(chartData.length / 5);
  const chartHeight = isMobile ? 220 : 420;

  const handleShareProgress = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#080c18';
    ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 1160, 590);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('Continuum Progress', 60, 100);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 72px Arial';
    ctx.fillText(`${currentStreak} Day Streak`, 60, 220);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '24px Arial';
    ctx.fillText(`${daysIn} total days logged`, 60, 260);
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(60, 300, 1080, 200);
    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 40px Arial'; ctx.fillText(avgSovereign.toFixed(1), 100, 370);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '20px Arial'; ctx.fillText('Avg Sovereign', 100, 410);
    ctx.fillStyle = '#4ade80'; ctx.font = 'bold 40px Arial'; ctx.fillText(toOutOf100(pillarAverages.body).toString(), 400, 370);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '20px Arial'; ctx.fillText('Body /100', 400, 410);
    ctx.fillStyle = '#60a5fa'; ctx.font = 'bold 40px Arial'; ctx.fillText(toOutOf100(pillarAverages.mind).toString(), 650, 370);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '20px Arial'; ctx.fillText('Mind /100', 650, 410);
    ctx.fillStyle = '#a78bfa'; ctx.font = 'bold 40px Arial'; ctx.fillText(toOutOf100(pillarAverages.identity).toString(), 900, 370);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '20px Arial'; ctx.fillText('Identity /100', 900, 410);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = 'italic 22px Arial';
    const words = quote.text.split(' ');
    let line = ''; let y = 560;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > 1080 && n > 0) { ctx.fillText(line, 60, y); line = words[n] + ' '; y += 30; }
      else { line = testLine; }
    }
    ctx.fillText(line, 60, y);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `continuum-progress-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    });
  };

  const handleShareChart = async () => {
    const chartContainer = document.getElementById('chart-section');
    if (!chartContainer) { alert('Chart not found. Please try again.'); return; }
    const html2canvas = (await import('html2canvas')).default;
    try {
      const canvas = await html2canvas(chartContainer as HTMLElement, { backgroundColor: '#080c18', scale: 2, logging: false });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `continuum-chart-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      });
    } catch (error) { console.error('Error capturing chart:', error); alert('Failed to capture chart. Please try again.'); }
  };

  return (
    <>
      <style>{`
        .db-root {
          min-height: 100vh;
          padding: clamp(24px, 5vw, 60px) clamp(16px, 4vw, 24px) 80px;
          background: #080c18;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .stat-card {
          background: rgba(255,255,255,0.025);
          padding: clamp(16px, 2.5vw, 22px);
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.15s;
        }
        .stat-card:hover { border-color: rgba(255,255,255,0.12); }
        .progress-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; margin-top: 12px; }
        .progress-fill { height: 100%; border-radius: 999px; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .section-title { font-size: clamp(15px, 2vw, 18px); font-weight: 700; color: #fff; margin-bottom: 18px; letter-spacing: -0.01em; }
        .chart-container { background: rgba(255,255,255,0.025); border-radius: 16px; border: 1px solid rgba(255,255,255,0.07); padding: clamp(16px, 3vw, 28px); margin-bottom: 24px; }
        .inner-section { padding: clamp(18px, 3vw, 28px); background: rgba(255,255,255,0.025); border-radius: 16px; border: 1px solid rgba(255,255,255,0.07); margin-bottom: 24px; }
        .share-btn { padding: 13px 24px; color: #fff; font-weight: 600; border-radius: 10px; border: none; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; font-family: inherit; transition: opacity 0.15s; }
        .share-btn:hover { opacity: 0.85; }
      `}</style>

      <div className="db-root">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* HEADER */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 12 }}>Dashboard</p>
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6, color: '#fff' }}>Your Discipline, Measured.</h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Every day you log is proof.</p>
          </div>

          {/* QUOTE */}
          <div style={{ padding: '14px 18px', marginBottom: 20, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${quote.color}` }}>
            <p style={{ color: quote.color, fontSize: 14, fontStyle: 'italic', margin: 0, lineHeight: 1.65 }}>
              &quot;{quote.text}&quot;
            </p>
          </div>

          {/* LOG BANNER */}
          {!todayLogged && (
            <div style={{ padding: 'clamp(14px, 2vw, 18px) clamp(16px, 2.5vw, 20px)', marginBottom: 20, borderRadius: 12, background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: '#4ade80', marginBottom: 3, fontSize: 14, fontWeight: 600 }}>Today&apos;s log is pending</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, margin: 0 }}>Keep your streak alive. Log your day.</p>
              </div>
              <Link href="/daily" style={{ padding: '11px 20px', background: '#4ade80', color: '#080c18', fontWeight: 700, borderRadius: 10, textDecoration: 'none', fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}>
                Log Today
              </Link>
            </div>
          )}

          {/* TOP STAT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
            <StatCard label="Streak"      value={`${currentStreak}d`}                  color="#4ade80" />
            <StatCard label="Total Days"  value={daysIn} />
            <StatCard label="Weeks"       value={weeksIn} />
            <StatCard label="Best Day"    value={bestDay > 0 ? bestDay.toFixed(1) : '—'} color="#fbbf24" />
          </div>

          {/* AVG SOVEREIGN FEATURE CARD */}
          <div style={{ padding: isMobile ? '18px' : '24px 28px', marginBottom: 20, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 6, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Avg Sovereign Score</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: isMobile ? 40 : 52, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {avgSovereign > 0 ? avgSovereign.toFixed(1) : '—'}
                </span>
                {trend !== 'stable' && avgSovereign > 0 && (
                  <span style={{ fontSize: 22, color: trend === 'up' ? '#4ade80' : '#f87171' }}>{trend === 'up' ? '↗' : '↘'}</span>
                )}
              </div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: scoreStatus.color, marginBottom: 3 }}>{scoreStatus.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>All-time average</p>
            </div>
          </div>

          {/* CHART */}
          <div id="chart-section" className="chart-container">
            <p className="section-title">Sovereign Score — Last {CHART_DAYS} Days</p>
            <div style={{ height: chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: isMobile ? 10 : 0, bottom: 5 }}>
                  <XAxis dataKey="label" interval={xAxisInterval} stroke="rgba(255,255,255,0.05)" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: isMobile ? 10 : 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} tickLine={false} />
                  <YAxis domain={[0, 175]} stroke="rgba(255,255,255,0.05)" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: isMobile ? 10 : 12 }} axisLine={false} tickLine={false} ticks={[0, 50, 110, 150, 175]} width={isMobile ? 30 : 40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12, fontWeight: 500 }} iconType="line" />
                  <Line type="monotone" dataKey="baseline" name={`Baseline (${baselineScore})`} stroke="#4ade80" strokeWidth={1.5} strokeDasharray="6 4" dot={false} activeDot={false} />
                  <Line type="monotone" dataKey="sovereign" name="Your Score" stroke="#60a5fa" strokeWidth={isMobile ? 2 : 2.5} dot={false} activeDot={{ r: 5, fill: '#60a5fa', stroke: '#080c18', strokeWidth: 2 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TREND CARDS */}
          {daysIn > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
              <TrendCard label="Last 7 Days"    value={last7DaysAvg}   trend={trend7Days} color="#60a5fa" />
              <StrongestPillarCard pillarAverages={pillarAverages} />
              <NeedsAttentionCard  pillarAverages={pillarAverages} />
              <OverallConsistencyCard percentage={overallConsistency} />
            </div>
          )}

          {/* HABIT CONSISTENCY + PILLAR PERFORMANCE */}
          <div className="inner-section">
            {habitCompletion.body.total > 0 && (
              <div style={{ marginBottom: 32 }}>
                <p className="section-title">Habit Consistency — Last 30 Days</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  <HabitCompletionCard label="Body"     completed={habitCompletion.body.completed}     total={habitCompletion.body.total}     percentage={habitCompletion.body.percentage}     color="#4ade80" />
                  <HabitCompletionCard label="Mind"     completed={habitCompletion.mind.completed}     total={habitCompletion.mind.total}     percentage={habitCompletion.mind.percentage}     color="#60a5fa" />
                  <HabitCompletionCard label="Identity" completed={habitCompletion.identity.completed} total={habitCompletion.identity.total} percentage={habitCompletion.identity.percentage} color="#a78bfa" />
                  <HabitCompletionCard label="Overall"  completed={Math.round(overallConsistency * habitCompletion.body.total / 100)} total={habitCompletion.body.total} percentage={overallConsistency} color="#fbbf24" />
                </div>
              </div>
            )}
            <div>
              <p className="section-title">Pillar Performance</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                <PillarCard label="Body"          value={pillarAverages.body}     color="#4ade80" />
                <PillarCard label="Mind"          value={pillarAverages.mind}     color="#60a5fa" />
                <PillarCard label="Identity"      value={pillarAverages.identity} color="#a78bfa" />
                <PillarCard label="Sovereign Avg" value={(pillarAverages.body + pillarAverages.mind + pillarAverages.identity) / 3} color="#fbbf24" overrideValue={sovereignAverage} />
              </div>
            </div>
          </div>

          {/* WEAKNESS PATTERNS */}
          {triggerData.length > 0 && (
            <div style={{ padding: 'clamp(18px, 3vw, 24px)', marginBottom: 24, borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid #f87171' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#f87171', marginBottom: 16, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Weakness Patterns</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {triggerData.slice(0, 3).map((item, index) => (
                  <div key={item.trigger} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: index === 0 ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.04)', color: index === 0 ? '#f87171' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{index + 1}</span>
                      <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 500 }}>{item.trigger}</span>
                    </div>
                    <span style={{ color: '#f87171', fontSize: 13, fontWeight: 700 }}>{item.count}x</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.25)', fontSize: 12, lineHeight: 1.6 }}>Awareness is the first step to mastery. Plan ahead to defend against these triggers.</p>
            </div>
          )}

          {/* SHARE BUTTONS */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleShareProgress} className="share-btn" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
              Share Progress
            </button>
            <button onClick={handleShareChart} className="share-btn" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
              Share Chart
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ label, value, color }: { label: string; value: any; color?: string }) {
  return (
    <div className="stat-card">
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      <p style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color: color || '#fff', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>{value}</p>
    </div>
  );
}

function TrendCard({ label, value, trend, color }: { label: string; value: number; trend: 'up' | 'down' | 'stable'; color: string }) {
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${color}` }}>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <p style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color, letterSpacing: '-0.02em', margin: 0 }}>{value > 0 ? value.toFixed(1) : '—'}</p>
        {value > 0 && trend !== 'stable' && <span style={{ fontSize: 16, color: trend === 'up' ? '#4ade80' : '#f87171' }}>{trend === 'up' ? '↗' : '↘'}</span>}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 4 }}>{trend === 'up' ? 'Improving' : trend === 'down' ? 'Needs focus' : 'Steady'}</p>
    </div>
  );
}

function StrongestPillarCard({ pillarAverages }: { pillarAverages: { body: number; mind: number; identity: number } }) {
  const pillars = [
    { name: 'Body', value: pillarAverages.body, color: '#4ade80' },
    { name: 'Mind', value: pillarAverages.mind, color: '#60a5fa' },
    { name: 'Identity', value: pillarAverages.identity, color: '#a78bfa' },
  ];
  const strongest = pillars.reduce((max, p) => p.value > max.value ? p : max);
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${strongest.color}` }}>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Strongest</p>
      <p style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: strongest.color, letterSpacing: '-0.02em', marginBottom: 3, margin: 0 }}>{strongest.name}</p>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 4 }}>{toOutOf100(strongest.value)}% avg</p>
    </div>
  );
}

function NeedsAttentionCard({ pillarAverages }: { pillarAverages: { body: number; mind: number; identity: number } }) {
  const pillars = [
    { name: 'Body', value: pillarAverages.body, color: '#4ade80' },
    { name: 'Mind', value: pillarAverages.mind, color: '#60a5fa' },
    { name: 'Identity', value: pillarAverages.identity, color: '#a78bfa' },
  ];
  const weakest = pillars.reduce((min, p) => p.value < min.value ? p : min);
  return (
    <div className="stat-card" style={{ borderLeft: '3px solid #fbbf24' }}>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Needs Attention</p>
      <p style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#fbbf24', letterSpacing: '-0.02em', margin: 0 }}>{weakest.name}</p>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 4 }}>{toOutOf100(weakest.value)}% avg</p>
    </div>
  );
}

function OverallConsistencyCard({ percentage }: { percentage: number }) {
  return (
    <div className="stat-card" style={{ borderLeft: '3px solid #a78bfa' }}>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Consistency</p>
      <p style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#a78bfa', letterSpacing: '-0.02em', margin: 0 }}>{percentage > 0 ? `${percentage}%` : '—'}</p>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${percentage}%`, background: '#a78bfa' }} /></div>
    </div>
  );
}

function HabitCompletionCard({ label, completed, total, percentage, color }: { label: string; completed: number; total: number; percentage: number; color: string }) {
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${color}` }}>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      <p style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color, letterSpacing: '-0.02em', marginBottom: 3, margin: 0 }}>{percentage}%</p>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 4, marginBottom: 0 }}>{completed}/{total} days</p>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${percentage}%`, background: color }} /></div>
    </div>
  );
}

function PillarCard({ label, value, color, overrideValue }: { label: string; value: number; color: string; overrideValue?: number }) {
  const percentage = overrideValue !== undefined ? overrideValue : toOutOf100(value);
  return (
    <div className="stat-card" style={{ borderLeft: `3px solid ${color}` }}>
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, color, letterSpacing: '-0.02em' }}>{percentage}</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>/100</span>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${percentage}%`, background: color }} /></div>
    </div>
  );
}