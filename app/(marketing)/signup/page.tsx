'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabaseClient'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // ✅ THIS IS THE KEY FIX
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (signUpError) throw signUpError

      // Do NOT push here.
      // User will be redirected after email confirmation.
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top, #020617, #01030f)',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 40,
            textDecoration: 'none',
          }}
        >
          <img
            src="/continuum-hero.jpg"
            alt="Continuum"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              filter: 'grayscale(100%)',
            }}
          />
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#e5e7eb',
            }}
          >
            Continuum
          </span>
        </Link>

        <div
          style={{
            background: '#020617',
            padding: 40,
            borderRadius: 16,
            border: '1px solid #1e293b',
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginBottom: 8,
              textAlign: 'center',
              color: '#e5e7eb',
            }}
          >
            Start Building Discipline
          </h1>
          <p
            style={{
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: 15,
              marginBottom: 32,
            }}
          >
            Create your account and track your sovereignty
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#e5e7eb' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 10,
                  background: '#01030f',
                  border: '1px solid #334155',
                  color: '#e5e7eb',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: '#e5e7eb' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 10,
                  background: '#01030f',
                  border: '1px solid #334155',
                  color: '#e5e7eb',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: '#e5e7eb' }}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: 14,
                  borderRadius: 10,
                  background: '#01030f',
                  border: '1px solid #334155',
                  color: '#e5e7eb',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: 12,
                  marginBottom: 20,
                  borderRadius: 8,
                  background: '#2c0808',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                }}
              >
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
                background: loading
                  ? '#94a3b8'
                  : 'linear-gradient(180deg, #22c55e, #16a34a)',
                color: '#020617',
                fontWeight: 600,
                border: 'none',
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}