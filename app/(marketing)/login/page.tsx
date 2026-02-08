'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/src/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
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

    // Check if user has set up their habits
    if (data.user) {
      const { data: habitData } = await supabase
        .from('user_habits')
        .select('*')
        .eq('user_id', data.user.id)
        .single()

      // If no habits set up, send to habits page
      if (!habitData) {
        router.push('/habits')
      } else {
        // If habits exist, send to dashboard
        router.push('/dashboard')
      }
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
      padding: '24px',
    }}>
      {/* CONTENT */}
      <div style={{
        width: '100%',
        maxWidth: 440,
      }}>
        {/* LOGO */}
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
          <span style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#e5e7eb',
          }}>
            Continuum
          </span>
        </Link>

        {/* FORM CARD */}
        <div style={{
          background: '#020617',
          padding: 40,
          borderRadius: 16,
          border: '1px solid #1e293b',
        }}>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 600, 
            marginBottom: 8,
            textAlign: 'center',
            color: '#e5e7eb',
          }}>
            Welcome Back
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: 15,
            marginBottom: 32,
          }}>
            Continue building your discipline
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 500,
                color: '#e5e7eb',
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
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
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 500,
                color: '#e5e7eb',
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
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
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: 12,
                marginBottom: 20,
                borderRadius: 8,
                background: '#2c0808',
                border: '1px solid #ef4444',
                color: '#ef4444',
                fontSize: 14,
              }}>
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

          <div style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: '1px solid #1e293b',
            textAlign: 'center',
          }}>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              Don't have an account?{' '}
              <Link 
                href="/signup"
                style={{
                  color: '#22c55e',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* BACK TO HOME */}
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