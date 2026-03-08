'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

const BASELINE_OPTIONS = [
  { value: 80, label: '80', description: "Just getting started" },
  { value: 95, label: '95', description: "Building consistency" },
  { value: 110, label: '110', description: "Consistent and pushing" },
  { value: 125, label: '125', description: "Operating at a high level" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [baselineScore, setBaselineScore] = useState(110);
  const [savedBaseline, setSavedBaseline] = useState(110);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push('/login');
        return;
      }
      setUserId(auth.user.id);

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('baseline_score')
        .eq('user_id', auth.user.id)
        .maybeSingle();

      if (profile?.baseline_score) {
        setBaselineScore(profile.baseline_score);
        setSavedBaseline(profile.baseline_score);
      }
    };

    load();
  }, [router]);

  const saveBaseline = async () => {
    if (!userId) return;
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('user_profiles')
      .upsert(
        { user_id: userId, baseline_score: baselineScore },
        { onConflict: 'user_id' }
      );

    if (error) {
      setMessage('Something went wrong. Try again.');
    } else {
      setSavedBaseline(baselineScore);
      setMessage('Baseline updated.');
      setTimeout(() => setMessage(''), 3000);
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Settings</h1>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>
            Manage your challenge settings.
          </p>
        </div>

        {/* Baseline Score */}
        <div style={{
          background: '#020617',
          border: '1px solid #1e293b',
          borderRadius: 16,
          padding: 32,
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
            Your Baseline Score
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            This is the green line on your dashboard — your daily minimum standard. Below it means you're slipping. Above it means you're building.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {BASELINE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setBaselineScore(option.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: 10,
                  border: baselineScore === option.value
                    ? '1px solid #22c55e'
                    : '1px solid #334155',
                  background: baselineScore === option.value
                    ? '#022c22'
                    : '#01030f',
                  color: '#e5e7eb',
                  fontSize: 15,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{
                  fontWeight: 600,
                  color: baselineScore === option.value ? '#22c55e' : '#e5e7eb',
                  fontSize: 18,
                }}>
                  {option.label}
                </span>
                <span style={{ color: '#64748b', fontSize: 13 }}>
                  {option.description}
                </span>
              </button>
            ))}
          </div>

          {baselineScore !== savedBaseline && (
            <div style={{
              padding: 14,
              background: '#1a1a00',
              border: '1px solid #fbbf2430',
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <p style={{ color: '#fbbf24', fontSize: 13, margin: 0 }}>
                ⚠ Changing your baseline affects how your dashboard chart looks going forward.
              </p>
            </div>
          )}

          <button
            onClick={saveBaseline}
            disabled={loading || baselineScore === savedBaseline}
            style={{
              width: '100%',
              padding: 16,
              borderRadius: 10,
              background: loading || baselineScore === savedBaseline
                ? '#1e293b'
                : 'linear-gradient(180deg, #22c55e, #16a34a)',
              color: loading || baselineScore === savedBaseline ? '#64748b' : '#020617',
              fontWeight: 600,
              fontSize: 15,
              border: 'none',
              cursor: loading || baselineScore === savedBaseline ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {loading ? 'Saving...' : baselineScore === savedBaseline ? 'Saved' : 'Update Baseline'}
          </button>

          {message && (
            <p style={{
              marginTop: 12,
              color: '#22c55e',
              fontSize: 14,
              textAlign: 'center',
            }}>
              {message}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}