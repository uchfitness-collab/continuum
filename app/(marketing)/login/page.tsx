'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabaseClient'

type View = 'login' | 'forgot' | 'forgot-sent'

export default function LoginPage() {
  const router = useRouter()
  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (!profile || !profile.onboarding_completed) {
        router.push('/onboarding')
        return
      }

      const { data: habitData } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (!habitData) {
        router.push('/habits')
      } else {
        router.push('/dashboard')
      }
    }

    setLoading(false)
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setView('forgot-sent')
    setLoading(false)
  }

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at top, #020617, #01030f)',
    padding: 'clamp(16px, 4vw, 24px)',
  }

  const cardStyle = {
    background: '#020617',
    padding: 'clamp(24px, 5vw, 40px)',
    borderRadius: 16,
    border: '1px solid #1e293b',
  }

  const inputStyle = {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    background: '#01030f',
    border: '1px solid #334155',
    color: '#e5e7eb',
    fontSize: 15,
    boxSizing: 'border-box' as const,
  }

  const Logo = () => (
    <Link href="/" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      justifyContent: 'center',
      marginBottom: 'clamp(24px, 5vw, 40px)',
      textDecoration: 'none',
    }}>
      <img
        src="/continuum-hero.jpg"
        alt="Continuum"
        style={{ width: 40, height: 40, borderRadius: 8, filter: 'grayscale(100%)' }}
      />
      <span style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, color: '#e5e7eb' }}>
        Continuum
      </span>
    </Link>
  )

  // ─── FORGOT SENT ───
  if (view === 'forgot-sent') {
    return (
      <div style={containerStyle}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Logo />
          <div style={cardStyle}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 26px)', fontWeight: 600, color: '#e5e7eb', marginBottom: 8 }}>
                Check your email
              </h1>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>
                We sent a password reset link to <strong style={{ color: '#e5e7eb' }}>{email}</strong>.
                Click the link to set a new password.
              </p>
            </div>
            <button
              onClick={() => { setView('login'); setError(null) }}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 10,
                background: 'transparent',
                color: '#22c55e',
                fontWeight: 600,
                fontSize: 16,
                border: '1px solid #22c55e',
                cursor: 'pointer',
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── FORGOT PASSWORD ───
  if (view === 'forgot') {
    return (
      <div style={containerStyle}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Logo />
          <div style={cardStyle}>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 26px)', fontWeight: 600, marginBottom: 8, textAlign: 'center', color: '#e5e7eb' }}>
              Reset Password
            </h1>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, marginBottom: 'clamp(24px, 5vw, 32px)' }}>
              Enter your email and we'll send you a reset link
            </p>

            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#e5e7eb' }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              {error && (
                <div style={{ padding: 12, marginBottom: 20, borderRadius: 8, background: '#2c0808', border: '1px solid #ef4444', color: '#ef4444', fontSize: 14 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 16,
                  borderRadius: 10,
                  background: loading ? '#94a3b8' : 'linear-gradient(180deg, #22c55e, #16a34a)',
                  color: '#020617',
                  fontWeight: 600,
                  fontSize: 16,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #1e293b', textAlign: 'center' }}>
              <button
                onClick={() => { setView('login'); setError(null) }}
                style={{ background: 'none', border: 'none', color: '#22c55e', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── LOGIN ───
  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <Logo />
        <div style={cardStyle}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 28px)', fontWeight: 600, marginBottom: 8, textAlign: 'center', color: '#e5e7eb' }}>
            Welcome Back
          </h1>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 'clamp(14px, 3vw, 15px)', marginBottom: 'clamp(24px, 5vw, 32px)' }}>
            Continue building your discipline
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#e5e7eb' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#e5e7eb' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* FORGOT PASSWORD LINK */}
            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <button
                type="button"
                onClick={() => { setView('forgot'); setError(null) }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div style={{ padding: 12, marginBottom: 20, borderRadius: 8, background: '#2c0808', border: '1px solid #ef4444', color: '#ef4444', fontSize: 14 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 10,
                background: loading ? '#94a3b8' : 'linear-gradient(180deg, #22c55e, #16a34a)',
                color: '#020617',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #1e293b', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <Link href="/" style={{ display: 'block', marginTop: 20, textAlign: 'center', color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>
    </div>
  )
}