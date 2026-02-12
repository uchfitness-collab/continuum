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
  const [signupSuccess, setSignupSuccess] = useState(false)

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
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (signUpError) throw signUpError

      // Show success message
      setSignupSuccess(true)

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
        padding: 'clamp(16px, 4vw, 24px)',
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
            marginBottom: 'clamp(24px, 5vw, 40px)',
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
              fontSize: 'clamp(20px, 4vw, 24px)',
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
            padding: 'clamp(24px, 5vw, 40px)',
            borderRadius: 16,
            border: '1px solid #1e293b',
          }}
        >
          {signupSuccess ? (
            // Success message - check email
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
              }}>
                ✉️
              </div>
              
              <h1
                style={{
                  fontSize: 'clamp(24px, 4vw, 28px)',
                  fontWeight: 600,
                  marginBottom: 12,
                  color: '#e5e7eb',
                }}
              >
                Check Your Email
              </h1>
              
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                We've sent a verification link to <strong style={{ color: '#22c55e' }}>{email}</strong>
              </p>

              <div style={{
                padding: 20,
                background: '#022c22',
                border: '1px solid #22c55e',
                borderRadius: 12,
                marginBottom: 24,
              }}>
                <p style={{
                  color: '#22c55e',
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  <strong>Important:</strong> Click the verification link in your email to activate your account and start using Continuum.
                </p>
              </div>

              <p style={{
                color: '#94a3b8',
                fontSize: 13,
                marginBottom: 32,
              }}>
                Don't see the email? Check your spam folder.
              </p>

              <Link
                href="/login"
                style={{
                  display: 'inline-block',
                  padding: '12px 32px',
                  background: 'linear-gradient(180deg, #22c55e, #16a34a)',
                  color: '#020617',
                  fontWeight: 600,
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 15,
                }}
              >
                Go to Login
              </Link>
            </div>
          ) : (
            // Signup form
            <>
              <h1
                style={{
                  fontSize: 'clamp(24px, 4vw, 28px)',
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
                  fontSize: 'clamp(14px, 3vw, 15px)',
                  marginBottom: 'clamp(24px, 5vw, 32px)',
                }}
              >
                Create your account and track your sovereignty
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#e5e7eb' 
                  }}>
                    Email
                  </label>
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
                      fontSize: 15,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#e5e7eb' 
                  }}>
                    Password
                  </label>
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
                      fontSize: 15,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#e5e7eb' 
                  }}>
                    Confirm Password
                  </label>
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
                      fontSize: 15,
                      boxSizing: 'border-box',
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
                      fontSize: 14,
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
                    fontSize: 16,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div style={{
                marginTop: 24,
                paddingTop: 24,
                borderTop: '1px solid #1e293b',
                textAlign: 'center',
              }}>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>
                  Already have an account?{' '}
                  <Link 
                    href="/login"
                    style={{
                      color: '#22c55e',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        <Link
          href="/"
          style={{
            display: 'block',
            marginTop: 20,
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}