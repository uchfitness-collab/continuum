'use client';

import { useState } from 'react';
import { supabase } from '../../src/lib/supabaseClient';

export default function SettingsPage() {
  const [physical, setPhysical] = useState('');
  const [nutrition, setNutrition] = useState('');
  const [reps, setReps] = useState('');
  const [message, setMessage] = useState('');

  const saveHabits = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('user_habits').upsert({
      user_id: user.id,
      body_physical_activity_name: physical,
      body_nutritional_discipline_name: nutrition,
      body_daily_reps_name: reps,
      mind_negative_habit_name: 'placeholder',
      mind_positive_habit_name: 'placeholder',
      identity_daily_mission_name: 'placeholder',
      identity_philosophy_practice_name: 'placeholder',
    });

    setMessage(error ? error.message : 'Habits saved');
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Habit Settings</h1>

      <input
        placeholder="Physical activity"
        value={physical}
        onChange={(e) => setPhysical(e.target.value)}
      />

      <input
        placeholder="Nutrition rule"
        value={nutrition}
        onChange={(e) => setNutrition(e.target.value)}
      />

      <input
        placeholder="Daily reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />

      <button onClick={saveHabits}>Save</button>
      {message && <p>{message}</p>}
    </div>
  );
}