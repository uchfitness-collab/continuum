export const dynamic = 'force-dynamic';
'use client';

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

  const [message, setMessage] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // -------------------------
  // REST DAY HANDLER
  // -------------------------
  const submitRestDay = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    // Check rest days in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentRestDays } = await supabase
      .from('daily_logs')
      .select('id')
      .eq('user_id', auth.user.id)
      .eq('is_rest_day', true)
      .gte('log_date', sevenDaysAgo.toISOString().split('T')[0]);

    if ((recentRestDays?.length ?? 0) >= 1) {
      setMessage('You already used a rest day this week');
      return;
    }

    // Prior sovereign
    const { data: prior } = await supabase
      .from('daily_logs')
      .select('sovereign_score')
      .eq('user_id', auth.user.id)
      .lt('log_date', today)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const priorScore = prior?.sovereign_score ?? 150;
    const sovereignScore = priorScore * 0.7 + REST_DAY_SCORE * 0.3;

    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: auth.user.id,
        log_date: today,
        is_rest_day: true,

        body_score: 0,
        mind_score: 0,
        identity_score: 0,
        daily_raw_score: REST_DAY_SCORE,
        sovereign_score: sovereignScore,
        sovereign_value: sovereignScore,
      },
      { onConflict: 'user_id,log_date' }
    );

    setMessage(error ? error.message : 'Rest Day Logged');
  };

  // -------------------------
  // NORMAL DAY HANDLER
  // -------------------------
  const submitDay = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      setMessage('Not authenticated');
      return;
    }
  
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
  
    // --------------------
    // GET LAST LOG
    // --------------------
    const { data: lastLog } = await supabase
      .from('daily_logs')
      .select('log_date, sovereign_score')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })
      .limit(1)
      .maybeSingle();
  
    let priorScore = lastLog?.sovereign_score ?? 150;
    let lastDate = lastLog ? new Date(lastLog.log_date) : null;
  
    // --------------------
    // INSERT MISSED DAYS
    // --------------------
    if (lastDate) {
      const cursor = new Date(lastDate);
      cursor.setDate(cursor.getDate() + 1);
  
      while (cursor < today) {
        const dateStr = cursor.toISOString().split('T')[0];
  
        const rawScore = 50;
        const sovereignScore = priorScore * 0.7 + rawScore * 0.3;
  
        await supabase.from('daily_logs').insert({
          user_id: user.id,
          log_date: dateStr,
          missed_day: true,
  
          body_score: 0,
          mind_score: 0,
          identity_score: 0,
          daily_raw_score: rawScore,
          sovereign_score: sovereignScore,
          sovereign_value: sovereignScore,
        });
  
        priorScore = sovereignScore;
        cursor.setDate(cursor.getDate() + 1);
      }
    }
  
    // --------------------
    // BODY SCORE
    // --------------------
    let bodyScore = 0;
    if (physical) bodyScore += 20;
    if (nutrition) bodyScore += 20;
  
    if (reps === '50_plus') bodyScore += 10;
    else if (reps === '25_plus') bodyScore += 5;
    else bodyScore -= 5;
  
    // --------------------
    // MIND SCORE
    // --------------------
    let mindScore = 0;
    if (mindNegative) mindScore += 20;
    if (mindPositive) mindScore += 20;
    mindScore += discipline;
  
    // --------------------
    // IDENTITY SCORE
    // --------------------
    let identityScore = 0;
    if (mission) identityScore += 20;
    if (philosophy) identityScore += 20;
    identityScore += mood;
  
    const dailyRawScore = bodyScore + mindScore + identityScore;
    const sovereignScore = priorScore * 0.7 + dailyRawScore * 0.3;
  
    // --------------------
    // RUNNING AVERAGE
    // --------------------
    const { data: allScores } = await supabase
      .from('daily_logs')
      .select('sovereign_score')
      .eq('user_id', user.id);
  
    const total =
      (allScores?.reduce((s, r) => s + r.sovereign_score, 0) ?? 0) +
      sovereignScore;
  
    const sovereignValue = total / ((allScores?.length ?? 0) + 1);
  
    // --------------------
    // UPSERT TODAY
    // --------------------
    const { error } = await supabase.from('daily_logs').upsert(
      {
        user_id: user.id,
        log_date: todayStr,
  
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
        missed_day: false,
      },
      { onConflict: 'user_id,log_date' }
    );
  
    setMessage(error ? error.message : 'Logged');
  };

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Daily Log</h1>

      <br /><br />

<button
  onClick={submitDay}
  style={{
    width: '100%',
    padding: '12px',
    fontWeight: 'bold',
  }}
>
  Submit Daily Log
</button>

{message && <p style={{ marginTop: 12 }}>{message}</p>}

<hr style={{ margin: '40px 0' }} />



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
      <button onClick={submitDay}>Submit Day</button>

      <button
  onClick={submitRestDay}
  style={{
    width: '100%',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    color: '#555',
    border: '1px solid #ccc',
  }}
>
  Log Rest Day
</button>

      {message && <p>{message}</p>}
    </div>
  );
}