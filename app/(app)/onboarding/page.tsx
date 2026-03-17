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
      { value: '80', label: "80 — I'm just getting started" },
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

  // FIX: Skip now marks onboarding_completed = true so it never shows again
  const handleSkip = async () => {
    if (!userId) return
    await supabase
      .from('user_profiles')
      .upsert(
        { user_id: userId, onboarding_completed: true },
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
      background: '#080c18',
      padding: 'clamp(16px, 4vw, 24px)',
    }}>
      <div style={{ width: '100%', maxWidth: 500 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#22c55e',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 999,
            padding: '4px 14px',
            marginBottom: 16,
          }}>
            Continuum
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', marginBottom: 8, margin: '0 0 8px' }}>
            {firstName ? `Welcome, ${firstName} 👋` : 'Welcome to Continuum 👋'}
          </h1>
          <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>
            {isBaselineStep ? 'One final step — set your standard.' : '3 quick questions before you start'}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: 3,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 999,
          marginBottom: 32,
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

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          padding: 'clamp(24px, 5vw, 36px)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 16,
        }}>
          <p style={{ color: '#475569', fontSize: 12, marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            {isBaselineStep ? 'Final step' : `Question ${step + 1} of ${totalSteps - 1}`}
          </p>

          <h2 style={{
            fontSize: 'clamp(18px, 4vw, 22px)',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: 6,
            margin: '0 0 6px',
          }}>
            {currentStep.question}
          </h2>

          <p style={{ color: '#475569', fontSize: 14, marginBottom: 24, margin: '0 0 24px' }}>
            {currentStep.subtitle}
          </p>

          {/* Baseline info box */}
          {isBaselineStep && (
            <div style={{
              padding: 14,
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.15)',
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <p style={{ color: '#22c55e', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                💡 Your baseline is the green line on your dashboard. Below it = slipping. Above it = building. You can update this anytime in settings.
              </p>
            </div>
          )}

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentStep.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  borderRadius: 10,
                  border: selectedValue === option.value
                    ? '1px solid rgba(34,197,94,0.5)'
                    : '1px solid rgba(255,255,255,0.06)',
                  background: selectedValue === option.value
                    ? 'rgba(34,197,94,0.08)'
                    : 'rgba(255,255,255,0.02)',
                  color: selectedValue === option.value ? '#22c55e' : '#94a3b8',
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

          {/* Phone input on last step */}
          {step === STEPS.length - 1 && (
            <div style={{ marginTop: 24 }}>
              <label style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 500,
                color: '#94a3b8',
                letterSpacing: '0.04em',
              }}>
                Phone number{' '}
                <span style={{ color: '#475569', fontWeight: 400 }}>(optional)</span>
              </label>
              <p style={{ color: '#475569', fontSize: 12, marginBottom: 10, margin: '0 0 10px' }}>
                For SMS reminders in the future.
              </p>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%',
                  padding: 13,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#f1f5f9',
                  fontSize: 15,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          )}
        </div>

        {/* CTA button */}
        <button
          onClick={handleNext}
          disabled={!selectedValue || loading}
          style={{
            width: '100%',
            padding: 15,
            borderRadius: 10,
            background: !selectedValue || loading
              ? 'rgba(255,255,255,0.04)'
              : 'linear-gradient(180deg, #22c55e, #16a34a)',
            color: !selectedValue || loading ? '#334155' : '#020617',
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            cursor: !selectedValue || loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            letterSpacing: '0.02em',
          }}
        >
          {loading
            ? 'Saving...'
            : step === STEPS.length - 1
            ? 'Start my challenge →'
            : 'Next →'}
        </button>

        {/* Skip — now correctly marks onboarding complete */}
        <p style={{ textAlign: 'center', marginTop: 14 }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#334155',
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