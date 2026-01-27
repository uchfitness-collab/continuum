'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

const REST_DAY_SCORE = 100;

export default function DailyPage() {
  // Body
  const [physical, setPhysical] = useState(false);
  const [nutrition, setNutrition] = useState(false);
  const [reps, setReps] = useState<'below_10' | '25_plus' | '50_plus'>('below_10');

  // Mind
  const [mindPositive, setMindPositive] = useState(false);
  const [mindNegative, setMindNegative] = useState(false);
  const [discipline, setDiscipline] = useState(5);

  // Identity
  const [mission, setMission] = useState(false);
  const [philosophy, setPhilosophy] = useState(false);
  const [mood, setMood] = useState(5);

  const [message, setMessage] = useState<string | null>(null);
  const today = new Date().toISOString().split('T')[0];

  // -------------------------
  // REST DAY (DE-EMPHASIZED)
  // -------------------------
  const submitRestDay = async () => {
    setMessage(null);

    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { data: prior } = await supabase
      .from('daily_logs')
      .select('sovereign_score')
      .eq('user_id', data.user.id)
      .lt('log_date', today)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const priorScore = prior?.sovereign_score ?? 150;
    const sovereignScore = priorScore * 0.7 + REST_DAY_SCORE * 0.3;

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: data.user.id,
        log_date: today,
        is_rest_day: true,
        daily_raw_score: REST_DAY_SCORE,
        sovereign_score: sovereignScore,
        sovereign_value: sovereignScore,
        body_score: 0,
        mind_score: 0,
        identity_score: 0,
      },
      { onConflict: 'user_id,log_date' }
    );

    setMessage(error ? error.message : 'Rest day logged.');
  };

  // -------------------------
  // NORMAL DAY
  // -------------------------
  const submitDay = async () => {
    setMessage(null);

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setMessage('Not authenticated');
      return;
    }

    // Scores
    let bodyScore = (physical ? 20 : 0) + (nutrition ? 20 : 0);
    bodyScore += reps === '50_plus' ? 10 : reps === '25_plus' ? 5 : -5;

    let mindScore = (mindPositive ? 20 : 0) + (mindNegative ? 20 : 0) + discipline;
    let identityScore = (mission ? 20 : 0) + (philosophy ? 20 : 0) + mood;

    const dailyRawScore = bodyScore + mindScore + identityScore;

    const { data: prior } = await supabase
      .from('daily_logs')
      .select('sovereign_score')
      .eq('user_id', data.user.id)
      .lt('log_date', today)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const priorScore = prior?.sovereign_score ?? 150;
    const sovereignScore = priorScore * 0.7 + dailyRawScore * 0.3;

    const { data: allScores } = await supabase
      .from('daily_logs')
      .select('sovereign_score')
      .eq('user_id', data.user.id);

    const total =
      (allScores?.reduce((s, r) => s + r.sovereign_score, 0) ?? 0) +
      sovereignScore;

    const sovereignValue = total / ((allScores?.length ?? 0) + 1);

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: data.user.id,
        log_date: today,
        body_physical_activity_completed: physical,
        body_nutritional_discipline_maintained: nutrition,
        body_daily_reps_level: reps,
        mind_negative_habit_avoided: mindNegative,
        mind_positive_habit_completed: mindPositive,
        mind_discipline_rating: discipline,
        identity_daily_mission_completed: mission,
        identity_philosophy_practice_completed: philosophy,
        identity_mood_rating: mood,
        body_score: bodyScore,
        mind_score: mindScore,
        identity_score: identityScore,
        daily_raw_score: dailyRawScore,
        sovereign_score: sovereignScore,
        sovereign_value: sovereignValue,
        is_rest_day: false,
      },
      { onConflict: 'user_id,log_date' }
    );

    setMessage(error ? error.message : 'Daily log submitted.');
  };

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Daily Log</h1>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}

      <hr style={{ margin: '24px 0' }} />

      <h3>Body</h3>
      <label><input type="checkbox" checked={physical} onChange={e => setPhysical(e.target.checked)} /> Physical</label><br/>
      <label><input type="checkbox" checked={nutrition} onChange={e => setNutrition(e.target.checked)} /> Nutrition</label><br/>
      <select value={reps} onChange={e => setReps(e.target.value as any)}>
        <option value="below_10">Below 10</option>
        <option value="25_plus">25+</option>
        <option value="50_plus">50+</option>
      </select>

      <h3>Mind</h3>
      <label><input type="checkbox" checked={mindPositive} onChange={e => setMindPositive(e.target.checked)} /> Positive</label><br/>
      <label><input type="checkbox" checked={mindNegative} onChange={e => setMindNegative(e.target.checked)} /> Negative avoided</label><br/>
      <select value={discipline} onChange={e => setDiscipline(Number(e.target.value))}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
      </select>

      <h3>Identity</h3>
      <label><input type="checkbox" checked={mission} onChange={e => setMission(e.target.checked)} /> Mission</label><br/>
      <label><input type="checkbox" checked={philosophy} onChange={e => setPhilosophy(e.target.checked)} /> Philosophy</label><br/>
      <select value={mood} onChange={e => setMood(Number(e.target.value))}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
      </select>

      <br /><br />

      <button
        onClick={submitDay}
        style={{ width: '100%', padding: 14, fontWeight: 'bold' }}
      >
        Submit Daily Log
      </button>

      {/* REST DAY — SMALL, SEPARATE, DISCOURAGED */}
      <button
        onClick={submitRestDay}
        style={{
          marginTop: 24,
          padding: '6px 10px',
          fontSize: 12,
          background: 'transparent',
          color: '#888',
          border: '1px dashed #444',
        }}
      >
        Log Rest Day
      </button>
    </div>
  );
}