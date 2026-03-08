'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabaseClient'

const STEPS = [
  {
    id: 'primary_goal',
    question: "What's your primary goal?",
    subtitle: "This helps us understand why you're here.",
    options: [
      { value: 'lose_weight', label: '🔥 Lose weight & get lean' },
      { value: 'build_muscle', label: '💪 Build muscle & strength' },
      { value: 'mental_discipline', label: '🧠 Build mental discipline' },
      { value: 'overall_lifestyle', label: '⚡ Overall lifestyle upgrade' },
      { value: 'career_focus', label: '🚀 Career & productivity focus' },
    ],
  },
  {
    id: 'age_range',
    question: "What's your age range?",
    subtitle: 'Helps us understand our community.',
    options: [
      { value: '18_24', label: '18 – 24' },
      { value: '25_34', label: '25 – 34' },
      { value: '35_44', label: '35 – 44' },
      { value: '45_plus', label: '45+' },
    ],
  },
  {
    id: 'referral_source',
    question: 'How did you hear about Continuum?',
    subtitle: "We're curious how you found us.",
    options: [
      { value: 'social_media', label: '📱 Social media' },
      { value: 'friend', label: '👥 A friend told me' },
      { value: 'google', label: '🔍 Google search' },
      { value: 'other', label: '✨ Other' },
    ],
  },
  {
    id: 'baseline_score',
    question: 'Set your personal baseline score.',
    subtitle: 'This is the daily score you commit to hitting. Be honest — this is your minimum standard, not your dream.',
    options: [
      { value: '80', label: '80 — I\'m just getting started' },
      { value: '95', label: '95 — I have some discipline already' },
      { value: '110', label: '110 — I\'m consistent and ready to push' },
      { value: '125', label: '125 — I operate at a high level' },
    ],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phoneNumber, setPhoneNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        router.push('/login')
        return
      }
      setUserId(auth.user.id)

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name, onboarding_completed')
        .eq('user_id', auth.user.id)
        .maybeSingle()

      if (profile?.onboarding_completed) {
        router.push('/habits')
        return
      }

      if (profile?.first_name) {
        setFirstName(profile.first_name)
      }
    }

    checkAuth()
  }, [router])

  const currentStep = STEPS[step]
  const totalSteps = STEPS.length
  const progress = ((step) / totalSteps) * 100

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: value }))
  }

  const handleNext = async () => {
    if (!answers[currentStep.id]) return

    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
      return
    }

    setLoading(true)

    await supabase
      .from('user_profiles')
      .upsert(
        {
          user_id: userId,
          first_name: firstName,
          phone_number: phoneNumber.trim() || null,
          primary_goal: answers.primary_goal,
          age_range: answers.age_range,
          referral_source: answers.referral_source,
          baseline_score: parseInt(answers.baseline_score) || 110,
          onboarding_completed: true,
        },
        { onConflict: 'user_id' }
      )

    router.push('/habits')
  }

  const selectedValue = answers[currentStep?.id]
  const isBaselineStep = currentStep.id === 'baseline_score'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
      padding: 'clamp(16px, 4vw, 24px)',
    }}>
      <div style={{ width: '100%', maxWidth: 500 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e5e7eb', marginBottom: 8 }}>
            {firstName ? `Welcome, ${firstName} 👋` : 'Welcome to Continuum 👋'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 15 }}>
            {isBaselineStep ? 'One final step — set your standard.' : '3 quick questions before you start'}
          </p>
        </div>

        <div style={{
          width: '100%',
          height: 4,
          background: '#1e293b',
          borderRadius: 999,
          marginBottom: 40,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress + (100 / totalSteps)}%`,
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            borderRadius: 999,
            transition: 'width 0.4s ease',
          }} />
        </div>

        <div style={{
          background: '#020617',
          padding: 'clamp(24px, 5vw, 40px)',
          borderRadius: 16,
          border: '1px solid #1e293b',
          marginBottom: 24,
        }}>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>
            {isBaselineStep ? 'Final step' : `Question ${step + 1} of ${totalSteps - 1}`}
          </p>

          <h2 style={{
            fontSize: 'clamp(20px, 4vw, 24px)',
            fontWeight: 600,
            color: '#e5e7eb',
            marginBottom: 8,
          }}>
            {currentStep.question}
          </h2>

          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
            {currentStep.subtitle}
          </p>

          {/* Baseline explanation box */}
          {isBaselineStep && (
            <div style={{
              padding: 16,
              background: '#022c22',
              border: '1px solid #22c55e30',
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <p style={{ color: '#22c55e', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                💡 Your baseline is the green line on your dashboard. Below it = slipping. Above it = building. You can update this anytime in settings.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentStep.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 10,
                  border: selectedValue === option.value
                    ? '1px solid #22c55e'
                    : '1px solid #334155',
                  background: selectedValue === option.value
                    ? '#022c22'
                    : '#01030f',
                  color: selectedValue === option.value ? '#22c55e' : '#e5e7eb',
                  fontSize: 15,
                  fontWeight: selectedValue === option.value ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {step === STEPS.length - 1 && (
            <div style={{ marginTop: 28 }}>
              <label style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 500,
                color: '#e5e7eb',
              }}>
                Phone number{' '}
                <span style={{ color: '#64748b', fontWeight: 400 }}>(optional)</span>
              </label>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>
                For SMS reminders in the future.
              </p>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 10,
                  background: '#01030f',
                  border: '1px solid #334155',
                  color: '#e5e7eb',
                  fontSize: 15,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedValue || loading}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 10,
            background: !selectedValue || loading
              ? '#1e293b'
              : 'linear-gradient(180deg, #22c55e, #16a34a)',
            color: !selectedValue || loading ? '#64748b' : '#020617',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: !selectedValue || loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {loading
            ? 'Saving...'
            : step === STEPS.length - 1
            ? "Start my challenge →"
            : 'Next →'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={() => router.push('/habits')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: 13,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Skip for now
          </button>
        </p>

      </div>
    </div>
  )
}