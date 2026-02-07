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
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl border border-white/10"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Log In</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded bg-zinc-800 border border-white/10 text-white placeholder-zinc-400 focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded bg-zinc-800 border border-white/10 text-white placeholder-zinc-400 focus:outline-none"
          required
        />

        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-green-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}