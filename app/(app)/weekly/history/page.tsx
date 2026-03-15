'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/src/lib/supabaseClient';

const MAX_PILLAR_POINTS_PER_DAY = 50;

export default function WeeklyHistoryPage() {
  const router = useRouter();
  const [reflections, setReflections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.push('/login'); return; }

      const userId = auth.user.id;

      const { data: allReflections } = await supabase
        .from('weekly_reflections')
        .select('*')
        .eq('user_id', userId)
        .order('week_number', { ascending: false });

      if (!allReflections || allReflections.length === 0) { setLoading(false); return; }

      const enriched = await Promise.all(
        allReflections.map(async (ref) => {
          if (!ref.week_start_date || !ref.week_end_date) return { ...ref, bodyPercent: 0, mindPercent: 0, identityPercent: 0, weeklyPercent: 0 };

          const { data: logs } = await supabase
            .from('daily_logs')
            .select('body_score, mind_score, identity_score, sovereign_score')
            .eq('user_id', userId)
            .gte('log_date', ref.week_start_date)
            .lte('log_date', ref.week_end_date);

          if (!logs || logs.length === 0) return { ...ref, bodyPercent: 0, mindPercent: 0, identityPercent: 0, weeklyPercent: 0 };

          const totalBody     = logs.reduce((sum, l) => sum + (l.body_score || 0), 0);
          const totalMind     = logs.reduce((sum, l) => sum + (l.mind_score || 0), 0);
          const totalIdentity = logs.reduce((sum, l) => sum + (l.identity_score || 0), 0);
          const totalSovereign = logs.reduce((sum, l) => sum + (l.sovereign_score || 0), 0);
          const maxPillar = logs.length * MAX_PILLAR_POINTS_PER_DAY;
          const maxTotalPossible = 7 * MAX_PILLAR_POINTS_PER_DAY * 3;

          return {
            ...ref,
            bodyPercent:     Math.round((totalBody / maxPillar) * 100),
            mindPercent:     Math.round((totalMind / maxPillar) * 100),
            identityPercent: Math.round((totalIdentity / maxPillar) * 100),
            weeklyPercent:   Math.round((totalSovereign / maxTotalPossible) * 100),
          };
        })
      );

      setReflections(enriched);
      setLoading(false);
    };

    load();
  }, [router]);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeek(expandedWeek === weekNumber ? null : weekNumber);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate + 'T00:00:00');
    const end   = new Date(endDate   + 'T00:00:00');
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080c18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#4ade80', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c18',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 24px)',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: 12 }}>Week</p>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 8, lineHeight: 1.15 }}>Weekly History</h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 }}>Every week you&apos;ve shown up. See what you learned.</p>
          </div>
          <Link href="/weekly" style={{
            padding: '10px 18px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: 13,
            border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            ← Current Week
          </Link>
        </div>

        {/* EMPTY STATE */}
        {reflections.length === 0 && (
          <div style={{
            padding: 'clamp(32px, 5vw, 48px)',
            borderRadius: 16,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, marginBottom: 20, lineHeight: 1.65 }}>
              No reflections yet. Complete your first weekly reflection to start building your history.
            </p>
            <Link href="/weekly" style={{
              display: 'inline-block', padding: '13px 28px',
              background: '#4ade80', color: '#080c18',
              fontWeight: 700, borderRadius: 10, textDecoration: 'none', fontSize: 14,
            }}>
              Write This Week&apos;s Reflection
            </Link>
          </div>
        )}

        {/* REFLECTION CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reflections.map((ref) => {
            const isExpanded = expandedWeek === ref.week_number;
            const overallColor = getScoreColor(ref.weeklyPercent);
            const hasContent = ref.what_worked_well || ref.what_broke_standard || ref.next_week_goals || ref.pattern_observed;

            return (
              <div key={ref.week_number} style={{
                borderRadius: 14,
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderLeft: `3px solid ${overallColor}`,
                overflow: 'hidden',
                transition: 'border-color 0.15s',
              }}>
                {/* HEADER ROW */}
                <button
                  onClick={() => toggleWeek(ref.week_number)}
                  style={{
                    width: '100%', padding: 'clamp(16px, 2.5vw, 22px) clamp(16px, 2.5vw, 24px)',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
                      Week {ref.week_number}
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                      {formatDateRange(ref.week_start_date, ref.week_end_date)}
                    </p>
                    {ref.weekly_theme && (
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3, fontStyle: 'italic', margin: 0 }}>
                        &quot;{ref.weekly_theme}&quot;
                      </p>
                    )}
                  </div>

                  {/* SCORES */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    <div className="score-badges" style={{ display: 'flex', gap: 14 }}>
                      <ScoreBadge label="Overall"   value={ref.weeklyPercent} />
                      <ScoreBadge label="Body"      value={ref.bodyPercent} />
                      <ScoreBadge label="Mind"      value={ref.mindPercent} />
                      <ScoreBadge label="Identity"  value={ref.identityPercent} />
                    </div>
                    <span style={{
                      fontSize: 12, color: 'rgba(255,255,255,0.25)',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s', display: 'inline-block',
                    }}>▾</span>
                  </div>
                </button>

                {/* EXPANDED */}
                {isExpanded && (
                  <div style={{
                    padding: 'clamp(16px, 2.5vw, 24px)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    {!hasContent ? (
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, margin: 0 }}>
                        No written reflection was saved for this week.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {ref.what_worked_well && (
                          <ReflectionBlock label="What worked" color="#4ade80" content={ref.what_worked_well} />
                        )}
                        {ref.what_broke_standard && (
                          <ReflectionBlock label="What broke" color="#f87171" content={ref.what_broke_standard} />
                        )}
                        {ref.next_week_goals && (
                          <ReflectionBlock label="Next week's adjustment" color="#a78bfa" content={ref.next_week_goals} />
                        )}
                        {ref.pattern_observed && (
                          <ReflectionBlock label="Pattern observed" color="#60a5fa" content={ref.pattern_observed} />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {reflections.length > 0 && (
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Link href="/weekly" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textDecoration: 'none' }}>
              ← Back to current week
            </Link>
          </div>
        )}

        <style>{`
          @media (max-width: 480px) {
            .score-badges { gap: 10px !important; }
          }
        `}</style>

      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function getScoreColor(value: number) {
  if (value >= 80) return '#4ade80';
  if (value >= 50) return '#fbbf24';
  return '#f87171';
}

function ScoreBadge({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 3, letterSpacing: '0.04em' }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color, margin: 0 }}>{value}%</p>
    </div>
  );
}

function ReflectionBlock({ label, color, content }: { label: string; color: string; content: string }) {
  return (
    <div style={{
      padding: 'clamp(14px, 2vw, 18px)',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderLeft: `3px solid ${color}`,
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </p>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
        {content}
      </p>
    </div>
  );
}