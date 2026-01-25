'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

export default function HabitsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const [habits, setHabits] = useState({
    body_physical_activity_name: '',
    body_daily_reps_name: '',
    body_nutritional_discipline_name: '',
    mind_negative_habit_name: '',
    mind_positive_habit_name: '',
    identity_daily_mission_name: '',
    identity_philosophy_practice_name: '',
  });

  useEffect(() => {
    const loadHabits = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', auth.user.id)
        .maybeSingle();

      if (data) {
        setHabits({
          body_physical_activity_name: data.body_physical_activity_name ?? '',
          body_daily_reps_name: data.body_daily_reps_name ?? '',
          body_nutritional_discipline_name: data.body_nutritional_discipline_name ?? '',
          mind_negative_habit_name: data.mind_negative_habit_name ?? '',
          mind_positive_habit_name: data.mind_positive_habit_name ?? '',
          identity_daily_mission_name: data.identity_daily_mission_name ?? '',
          identity_philosophy_practice_name: data.identity_philosophy_practice_name ?? '',
        });
      }

      setLoading(false);
    };

    loadHabits();
  }, [router]);

  const saveHabits = async () => {
    setMessage('');
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { error } = await supabase
      .from('user_habits')
      .upsert(
        {
          user_id: auth.user.id,
          ...habits,
        },
        { onConflict: 'user_id' }
      );

    setMessage(error ? error.message : 'Habits saved');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h1>Habit Definitions</h1>

      <h3>Body</h3>
      <input
        placeholder="Physical activity (e.g. Gym workout)"
        value={habits.body_physical_activity_name}
        onChange={e => setHabits({ ...habits, body_physical_activity_name: e.target.value })}
      /><br /><br />

      <input
        placeholder="Daily reps (e.g. Push-ups)"
        value={habits.body_daily_reps_name}
        onChange={e => setHabits({ ...habits, body_daily_reps_name: e.target.value })}
      /><br /><br />

      <input
        placeholder="Nutrition habit to avoid (e.g. Avoid candy)"
        value={habits.body_nutritional_discipline_name}
        onChange={e => setHabits({ ...habits, body_nutritional_discipline_name: e.target.value })}
      />

      <h3 style={{ marginTop: 30 }}>Mind</h3>
      <input
        placeholder="Negative habit to avoid"
        value={habits.mind_negative_habit_name}
        onChange={e => setHabits({ ...habits, mind_negative_habit_name: e.target.value })}
      /><br /><br />

      <input
        placeholder="Positive habit to build"
        value={habits.mind_positive_habit_name}
        onChange={e => setHabits({ ...habits, mind_positive_habit_name: e.target.value })}
      />

      <h3 style={{ marginTop: 30 }}>Identity</h3>
      <input
        placeholder="Daily mission"
        value={habits.identity_daily_mission_name}
        onChange={e => setHabits({ ...habits, identity_daily_mission_name: e.target.value })}
      /><br /><br />

      <input
        placeholder="Philosophy practice"
        value={habits.identity_philosophy_practice_name}
        onChange={e => setHabits({ ...habits, identity_philosophy_practice_name: e.target.value })}
      />

      <br /><br />
      <button onClick={saveHabits}>Save Habits</button>
      {message && <p>{message}</p>}
    </div>
  );
}