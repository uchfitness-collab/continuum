'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';

const getESTDate = () => {
  const now = new Date();
  const estString = now.toLocaleString('en-US', {
    timeZone: 'America/New_York',
  });
  const estDate = new Date(estString);

  const year = estDate.getFullYear();
  const month = String(estDate.getMonth() + 1).padStart(2, '0');
  const day = String(estDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getMondayOfWeek = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days, else go to Monday
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday.toISOString().split('T')[0];
};

export default function GoalsPage() {
  const router = useRouter();
  
  // 1-Year Goal states
  const [bodyGoal, setBodyGoal] = useState('');
  const [mindGoal, setMindGoal] = useState('');
  const [identityGoal, setIdentityGoal] = useState('');
  
  // Weekly Goal states
  const [weeklyGoal1, setWeeklyGoal1] = useState('');
  const [weeklyGoal2, setWeeklyGoal2] = useState('');
  const [weeklyGoal3, setWeeklyGoal3] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingWeekly, setSavingWeekly] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [weeklyMessage, setWeeklyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load existing goals
  useEffect(() => {
    const loadGoals = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push('/login');
        return;
      }

      setUserId(auth.user.id);

      // Load 1-year goals
      const { data: goals } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', auth.user.id)
        .maybeSingle();

      if (goals) {
        setBodyGoal(goals.body_goal || '');
        setMindGoal(goals.mind_goal || '');
        setIdentityGoal(goals.identity_goal || '');
      }

      // Load weekly goals
      const today = getESTDate();
      const weekStart = getMondayOfWeek(today);
      setCurrentWeekStart(weekStart);

      const { data: weeklyGoals } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', auth.user.id)
        .eq('week_start_date', weekStart)
        .maybeSingle();

      if (weeklyGoals) {
        setWeeklyGoal1(weeklyGoals.goal1 || '');
        setWeeklyGoal2(weeklyGoals.goal2 || '');
        setWeeklyGoal3(weeklyGoals.goal3 || '');
      }

      setLoading(false);
    };

    loadGoals();
  }, [router]);

  const handleSaveYearlyGoals = async () => {
    if (!userId) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_goals')
        .upsert({
          user_id: userId,
          body_goal: bodyGoal,
          mind_goal: mindGoal,
          identity_goal: identityGoal,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setMessage({ type: 'success', text: '1-Year goals saved successfully!' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save goals' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWeeklyGoals = async () => {
    if (!userId || !currentWeekStart) return;

    setSavingWeekly(true);
    setWeeklyMessage(null);

    try {
      const { error } = await supabase
        .from('weekly_goals')
        .upsert({
          user_id: userId,
          week_start_date: currentWeekStart,
          goal1: weeklyGoal1,
          goal2: weeklyGoal2,
          goal3: weeklyGoal3,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,week_start_date'
        });

      if (error) throw error;

      setWeeklyMessage({ type: 'success', text: 'Weekly goals saved!' });
      
      setTimeout(() => setWeeklyMessage(null), 3000);
    } catch (err: any) {
      setWeeklyMessage({ type: 'error', text: err.message || 'Failed to save weekly goals' });
    } finally {
      setSavingWeekly(false);
    }
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

  const weekEndDate = new Date(currentWeekStart + 'T00:00:00');
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  const weekRange = `${new Date(currentWeekStart + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div style={{
      minHeight: '100vh',
      padding: '60px 24px',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 12 }}>
            Goals
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.6 }}>
            Set your direction. Your daily habits are the inputs that produce these outcomes.
          </p>
        </div>

        {/* ==================== WEEKLY GOALS SECTION ==================== */}
        <div style={{
          padding: 32,
          marginBottom: 48,
          background: '#020617',
          borderRadius: 16,
          border: '2px solid #fbbf24',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12, 
            marginBottom: 8 
          }}>
            <div style={{ fontSize: 28 }}>🎯</div>
            <h2 style={{ fontSize: 24, color: '#fbbf24', margin: 0 }}>This Week's Goals</h2>
          </div>
          
          <p style={{ 
            fontSize: 14, 
            color: '#94a3b8', 
            marginBottom: 24,
            marginTop: 8,
          }}>
            {weekRange} • These reset every Monday
          </p>

          {weeklyMessage && (
            <div style={{
              padding: 12,
              marginBottom: 20,
              borderRadius: 8,
              background: weeklyMessage.type === 'success' ? '#022c22' : '#2c0808',
              border: `1px solid ${weeklyMessage.type === 'success' ? '#22c55e' : '#ef4444'}`,
              color: weeklyMessage.type === 'success' ? '#22c55e' : '#ef4444',
              fontSize: 14,
            }}>
              {weeklyMessage.text}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="text"
              value={weeklyGoal1}
              onChange={(e) => setWeeklyGoal1(e.target.value)}
              placeholder="Goal 1: e.g., Log 7/7 days above baseline"
              style={{
                width: '100%',
                padding: 14,
                background: '#01030f',
                border: '1px solid #fbbf2450',
                borderRadius: 10,
                color: '#e5e7eb',
                fontSize: 15,
              }}
            />
            <input
              type="text"
              value={weeklyGoal2}
              onChange={(e) => setWeeklyGoal2(e.target.value)}
              placeholder="Goal 2: e.g., Hit the gym 5 times"
              style={{
                width: '100%',
                padding: 14,
                background: '#01030f',
                border: '1px solid #fbbf2450',
                borderRadius: 10,
                color: '#e5e7eb',
                fontSize: 15,
              }}
            />
            <input
              type="text"
              value={weeklyGoal3}
              onChange={(e) => setWeeklyGoal3(e.target.value)}
              placeholder="Goal 3: e.g., Ship product feature by Friday"
              style={{
                width: '100%',
                padding: 14,
                background: '#01030f',
                border: '1px solid #fbbf2450',
                borderRadius: 10,
                color: '#e5e7eb',
                fontSize: 15,
              }}
            />
          </div>

          <button
            onClick={handleSaveWeeklyGoals}
            disabled={savingWeekly}
            style={{
              marginTop: 20,
              padding: '12px 28px',
              background: 'linear-gradient(180deg, #fbbf24, #f59e0b)',
              color: '#020617',
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 8,
              border: 'none',
              cursor: savingWeekly ? 'not-allowed' : 'pointer',
              opacity: savingWeekly ? 0.6 : 1,
            }}
          >
            {savingWeekly ? 'Saving...' : 'Save Weekly Goals'}
          </button>
        </div>

        {/* ==================== 1-YEAR GOALS SECTION ==================== */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
            Your 1-Year Direction
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
            These are your North Star. Review weekly to ensure your daily habits align.
          </p>
        </div>

        {message && (
          <div style={{
            padding: 16,
            marginBottom: 24,
            borderRadius: 10,
            background: message.type === 'success' ? '#022c22' : '#2c0808',
            border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
          }}>
            {message.text}
          </div>
        )}

        {/* INSTRUCTION BOX */}
        <div style={{
          padding: 24,
          marginBottom: 40,
          background: '#020617',
          borderRadius: 12,
          border: '1px solid #334155',
        }}>
          <h3 style={{ fontSize: 18, marginBottom: 12, color: '#22c55e' }}>
            How to Set Effective Goals
          </h3>
          <ul style={{ 
            margin: 0, 
            paddingLeft: 20, 
            color: '#94a3b8', 
            fontSize: 14, 
            lineHeight: 1.8 
          }}>
            <li>Be specific and measurable (not "get fit" but "lose 20 lbs and run a 5K")</li>
            <li>Make it achievable in 12 months with consistent daily effort</li>
            <li>Focus on outcomes, not just activities ("launch business" not "work on business")</li>
            <li>Ask: If I did my daily habits every day for a year, would this goal be inevitable?</li>
          </ul>
        </div>

        {/* BODY GOAL */}
        <GoalSection
          title="Body Goal"
          color="#22c55e"
          icon="💪"
          prompt="What does your body look, feel, and perform like in 1 year?"
          examples={[
            "Lose 30 pounds and maintain 15% body fat",
            "Run a half-marathon under 2 hours",
            "Bench press 225 lbs for 5 reps",
            "Complete 100 consecutive push-ups",
            "Achieve visible abs and defined muscle tone"
          ]}
          value={bodyGoal}
          onChange={setBodyGoal}
          placeholder="Example: Lose 25 lbs, run 10k in under 50 minutes, and have visible abs"
        />

        {/* MIND GOAL */}
        <GoalSection
          title="Mind Goal"
          color="#3b82f6"
          icon="🧠"
          prompt="What mental habits, skills, or knowledge do you want to build?"
          examples={[
            "Read 24 books (2 per month)",
            "Eliminate social media addiction completely",
            "Learn conversational Spanish",
            "Complete an online course in data science",
            "Meditate daily for 365 consecutive days"
          ]}
          value={mindGoal}
          onChange={setMindGoal}
          placeholder="Example: Read 30 books, learn Python, and build deep focus for 2-hour work sessions"
        />

        {/* IDENTITY GOAL */}
        <GoalSection
          title="Identity Goal"
          color="#a855f7"
          icon="⚡"
          prompt="Who are you becoming? What will you have built or created?"
          examples={[
            "Launch profitable side business ($5k/month revenue)",
            "Publish 52 blog posts or essays",
            "Build and ship 3 software products",
            "Network with 100 new people in my industry",
            "Write and self-publish a book"
          ]}
          value={identityGoal}
          onChange={setIdentityGoal}
          placeholder="Example: Launch SaaS product with 100 paying customers and $10k MRR"
        />

        {/* SAVE BUTTON */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            onClick={handleSaveYearlyGoals}
            disabled={saving}
            style={{
              padding: '14px 40px',
              background: 'linear-gradient(180deg, #22c55e, #16a34a)',
              color: '#020617',
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 10,
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save 1-Year Goals'}
          </button>
          
          <p style={{ marginTop: 16, fontSize: 13, color: '#94a3b8' }}>
            You can update these anytime as your vision evolves.
          </p>
        </div>

        {/* BOTTOM TIP */}
        <div style={{
          marginTop: 48,
          padding: 24,
          background: '#020617',
          borderRadius: 12,
          border: '1px solid #22c55e40',
        }}>
          <h4 style={{ fontSize: 16, marginBottom: 10, color: '#22c55e' }}>
            💡 Connecting Goals to Daily Habits
          </h4>
          <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
            Your goals are the destination. Your daily habits are the vehicle. Make sure what you're 
            tracking in the <strong>Habits</strong> page directly supports these 1-year outcomes. 
            If your goal is to "launch a business," your daily mission should be "work on business 
            for 1 hour minimum."
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function GoalSection({
  title,
  color,
  icon,
  prompt,
  examples,
  value,
  onChange,
  placeholder
}: {
  title: string;
  color: string;
  icon: string;
  prompt: string;
  examples: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div style={{
      padding: 28,
      marginBottom: 32,
      background: '#020617',
      borderRadius: 16,
      border: `2px solid ${color}40`,
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 16 
      }}>
        <div style={{ fontSize: 32 }}>{icon}</div>
        <h3 style={{ fontSize: 22, color, margin: 0 }}>{title}</h3>
      </div>
      
      {/* Prompt */}
      <p style={{ 
        fontSize: 15, 
        color: '#94a3b8', 
        marginBottom: 20, 
        fontStyle: 'italic' 
      }}>
        {prompt}
      </p>

      {/* Text Area */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%',
          padding: 16,
          background: '#01030f',
          border: `1px solid ${color}30`,
          borderRadius: 10,
          color: '#e5e7eb',
          fontSize: 15,
          lineHeight: 1.6,
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />

      {/* Examples Toggle */}
      <button
        onClick={() => setShowExamples(!showExamples)}
        style={{
          marginTop: 12,
          padding: '8px 14px',
          background: 'transparent',
          border: `1px solid ${color}50`,
          borderRadius: 6,
          color: color,
          fontSize: 13,
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        {showExamples ? 'Hide Examples' : 'Show Examples'}
      </button>

      {/* Examples Dropdown */}
      {showExamples && (
        <div style={{
          marginTop: 16,
          padding: 16,
          background: '#01030f',
          borderRadius: 10,
          border: `1px solid ${color}20`,
        }}>
          <p style={{ 
            fontSize: 13, 
            color: '#94a3b8', 
            marginBottom: 10, 
            fontWeight: 600 
          }}>
            Example Goals:
          </p>
          <ul style={{ 
            margin: 0, 
            paddingLeft: 20, 
            color: '#e5e7eb', 
            fontSize: 14, 
            lineHeight: 1.9 
          }}>
            {examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}