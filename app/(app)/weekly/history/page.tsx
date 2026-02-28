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
      if (!auth.user) {
        router.push('/login');
        return;
      }

      const userId = auth.user.id;

      // Load all weekly reflections
      const { data: allReflections } = await supabase
        .from('weekly_reflections')
        .select('*')
        .eq('user_id', userId)
        .order('week_number', { ascending: false });

      if (!allReflections || allReflections.length === 0) {
        setLoading(false);
        return;
      }

      // For each reflection, load the daily logs for that week to compute scores
      const enriched = await Promise.all(
        allReflections.map(async (ref) => {
          if (!ref.week_start_date || !ref.week_end_date) return { ...ref, bodyPercent: 0, mindPercent: 0, identityPercent: 0, weeklyPercent: 0 };

          const { data: logs } = await supabase
            .from('daily_logs')
            .select('body_score, mind_score, identity_score, sovereign_score')
            .eq('user_id', userId)
            .gte('log_date', ref.week_start_date)
            .lte('log_date', ref.week_end_date);

          if (!logs || logs.length === 0) {
            return { ...ref, bodyPercent: 0, mindPercent: 0, identityPercent: 0, weeklyPercent: 0 };
          }

          const totalBody = logs.reduce((sum, l) => sum + (l.body_score || 0), 0);
          const totalMind = logs.reduce((sum, l) => sum + (l.mind_score || 0), 0);
          const totalIdentity = logs.reduce((sum, l) => sum + (l.identity_score || 0), 0);
          const totalSovereign = logs.reduce((sum, l) => sum + (l.sovereign_score || 0), 0);

          const maxPillar = logs.length * MAX_PILLAR_POINTS_PER_DAY;
          const maxTotalPossible = 7 * MAX_PILLAR_POINTS_PER_DAY * 3;

          return {
            ...ref,
            bodyPercent: Math.round((totalBody / maxPillar) * 100),
            mindPercent: Math.round((totalMind / maxPillar) * 100),
            identityPercent: Math.round((totalIdentity / maxPillar) * 100),
            weeklyPercent: Math.round((totalSovereign / maxTotalPossible) * 100),
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
    const end = new Date(endDate + 'T00:00:00');
    return `${start.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at top, #020617, #01030f)',
      }}>
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 48,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8 }}>
              Weekly History
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>
              Every week you've shown up. See what you learned.
            </p>
          </div>
          <Link
            href="/weekly"
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              background: 'transparent',
              color: '#94a3b8',
              fontWeight: 600,
              fontSize: 14,
              border: '1px solid #334155',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ← Current Week
          </Link>
        </div>

        {/* EMPTY STATE */}
        {reflections.length === 0 && (
          <div style={{
            padding: 48,
            borderRadius: 16,
            background: '#020617',
            border: '1px solid #334155',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 20, marginBottom: 12 }}>📭</p>
            <p style={{ color: '#94a3b8', fontSize: 16 }}>
              No reflections yet. Complete your first weekly reflection to start building your history.
            </p>
            <Link
              href="/weekly"
              style={{
                display: 'inline-block',
                marginTop: 20,
                padding: '12px 24px',
                background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                color: '#020617',
                fontWeight: 600,
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              Write This Week's Reflection
            </Link>
          </div>
        )}

        {/* REFLECTION CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reflections.map((ref) => {
            const isExpanded = expandedWeek === ref.week_number;
            const overallColor = getColor(ref.weeklyPercent);
            const hasContent = ref.what_worked_well || ref.what_broke_standard || ref.next_week_goals || ref.pattern_observed;

            return (
              <div
                key={ref.week_number}
                style={{
                  borderRadius: 16,
                  background: '#020617',
                  border: `1px solid ${isExpanded ? overallColor + '60' : '#1e293b'}`,
                  borderLeft: `4px solid ${overallColor}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* CARD HEADER — always visible, clickable */}
                <button
                  onClick={() => toggleWeek(ref.week_number)}
                  style={{
                    width: '100%',
                    padding: '24px 28px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Left: week info */}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#e5e7eb', marginBottom: 4 }}>
                      Week {ref.week_number}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>
                      {formatDateRange(ref.week_start_date, ref.week_end_date)}
                    </div>
                    {ref.weekly_theme && (
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4, fontStyle: 'italic' }}>
                        "{ref.weekly_theme}"
                      </div>
                    )}
                  </div>

                  {/* Right: scores + chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <ScoreBadge label="Overall" value={ref.weeklyPercent} />
                      <ScoreBadge label="Body" value={ref.bodyPercent} />
                      <ScoreBadge label="Mind" value={ref.mindPercent} />
                      <ScoreBadge label="Identity" value={ref.identityPercent} />
                    </div>
                    <div style={{
                      fontSize: 18,
                      color: '#64748b',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}>
                      ▾
                    </div>
                  </div>
                </button>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                  <div style={{
                    padding: '0 28px 28px 28px',
                    borderTop: '1px solid #1e293b',
                  }}>
                    {!hasContent ? (
                      <p style={{ color: '#64748b', fontSize: 14, paddingTop: 20, margin: 0 }}>
                        No written reflection was saved for this week.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 24 }}>

                        {ref.what_worked_well && (
                          <ReflectionBlock
                            label="Where did you execute at or above your standard?"
                            color="#22c55e"
                            content={ref.what_worked_well}
                          />
                        )}

                        {ref.what_broke_standard && (
                          <ReflectionBlock
                            label="Where did you fall below your standard — and why?"
                            color="#ef4444"
                            content={ref.what_broke_standard}
                          />
                        )}

                        {ref.next_week_goals && (
                          <ReflectionBlock
                            label="What specific adjustment did you plan for the following week?"
                            color="#a855f7"
                            content={ref.next_week_goals}
                          />
                        )}

                        {ref.pattern_observed && (
                          <ReflectionBlock
                            label="Pattern observed"
                            color="#3b82f6"
                            content={ref.pattern_observed}
                          />
                        )}

                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM BACK LINK */}
        {reflections.length > 0 && (
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Link
              href="/weekly"
              style={{
                color: '#64748b',
                fontSize: 14,
                textDecoration: 'underline',
              }}
            >
              ← Back to current week
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function getColor(value: number) {
  if (value >= 80) return '#22c55e';
  if (value >= 50) return '#facc15';
  return '#ef4444';
}

function ScoreBadge({ label, value }: { label: string; value: number }) {
  const color = getColor(value);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>
        {value}%
      </div>
    </div>
  );
}

function ReflectionBlock({ label, color, content }: { label: string; color: string; content: string }) {
  return (
    <div style={{
      padding: 20,
      borderRadius: 12,
      background: '#01030f',
      border: `1px solid ${color}20`,
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label}
      </div>
      <p style={{
        fontSize: 15,
        color: '#e5e7eb',
        lineHeight: 1.7,
        margin: 0,
        whiteSpace: 'pre-wrap',
      }}>
        {content}
      </p>
    </div>
  );
}