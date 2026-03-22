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

    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push('/dashboard')
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

  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#080c18',
    padding: 'clamp(16px, 4vw, 24px)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.025)',
    padding: 'clamp(28px, 5vw, 44px)',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.07)',
    width: '100%',
  }

  const input: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    color: '#fff',
    fontSize: 15,
    boxSizing: 'border-box',
    outline: 'none',
  }

  const label: React.CSSProperties = {
    display: 'block',
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: '0.01em',
  }

  const Logo = () => (
    <Link href="/" style={{
      display: 'flex', alignItems: 'center', gap: 10,
      justifyContent: 'center',
      marginBottom: 'clamp(28px, 5vw, 40px)',
      textDecoration: 'none',
    }}>
      <img src="/continuum-hero.jpg" alt="Continuum" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
      <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff' }}>
        Continuum
      </span>
    </Link>
  )

  if (view === 'forgot-sent') {
    return (
      <div style={wrap}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Logo />
          <div style={card}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 22,
              }}>
                ✉️
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.02em' }}>
                Check your email
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.65 }}>
                We sent a reset link to{' '}
                <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{email}</strong>.
                Click it to set a new password.
              </p>
            </div>
            <button
              onClick={() => { setView('login'); setError(null) }}
              style={{
                width: '100%', padding: 15, borderRadius: 10,
                background: 'transparent', color: '#4ade80',
                fontWeight: 600, fontSize: 15,
                border: '1px solid rgba(74,222,128,0.3)', cursor: 'pointer',
              }}
            >
              Back to Log In
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'forgot') {
    return (
      <div style={wrap}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Logo />
          <div style={card}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, textAlign: 'center', color: '#fff', letterSpacing: '-0.02em' }}>
              Reset your password
            </h1>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: 20 }}>
                <label style={label}>Email</label>
                <input
                  type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required style={input}
                />
              </div>

              {error && <ErrorBox message={error} />}

              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', padding: 15, borderRadius: 10,
                  background: loading ? 'rgba(255,255,255,0.1)' : '#4ade80',
                  color: loading ? 'rgba(255,255,255,0.3)' : '#080c18',
                  fontWeight: 700, fontSize: 15, border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <button
                onClick={() => { setView('login'); setError(null) }}
                style={{ background: 'none', border: 'none', color: '#4ade80', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                ← Back to Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={wrap}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Logo />
        <div style={card}>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 26px)', fontWeight: 700, marginBottom: 8, textAlign: 'center', color: '#fff', letterSpacing: '-0.02em' }}>
            Welcome back
          </h1>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 'clamp(24px, 5vw, 36px)', lineHeight: 1.6 }}>
            Continue building your discipline.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Email</label>
              <input
                type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                required style={input}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={label}>Password</label>
              <input
                type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                required style={input}
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <button
                type="button"
                onClick={() => { setView('forgot'); setError(null) }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>

            {error && <ErrorBox message={error} />}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: 15, borderRadius: 10,
                background: loading ? 'rgba(255,255,255,0.1)' : '#4ade80',
                color: loading ? 'rgba(255,255,255,0.3)' : '#080c18',
                fontWeight: 700, fontSize: 15, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              Don&apos;t have an account?{' '}
              <Link href="/pricing" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 600 }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <Link href="/" style={{ display: 'block', marginTop: 20, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{
      padding: '12px 16px', marginBottom: 20, borderRadius: 8,
      background: 'rgba(248,113,113,0.06)',
      border: '1px solid rgba(248,113,113,0.2)',
      color: '#f87171', fontSize: 13, lineHeight: 1.5,
    }}>
      {message}
    </div>
  )
}