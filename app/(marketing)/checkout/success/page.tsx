'use client'

import Link from 'next/link'

export default function CheckoutSuccessPage() {
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
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#020617',
          padding: 40,
          borderRadius: 16,
          border: '1px solid #1e293b',
          textAlign: 'center',
        }}
      >
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
          ✓
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 12, color: '#e5e7eb' }}>
          Payment Successful
        </h1>

        <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>
          Welcome to Continuum. Your subscription is now active.
        </p>

        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>
          Use the same email you paid with to create your account.
        </p>

        <Link
          href="/signup"
          style={{
            display: 'block',
            padding: '16px 24px',
            borderRadius: 10,
            background: 'linear-gradient(180deg, #22c55e, #16a34a)',
            color: '#020617',
            fontWeight: 600,
            fontSize: 16,
            textDecoration: 'none',
            marginBottom: 12,
          }}
        >
          Create Your Account
        </Link>

        <Link
          href="/login"
          style={{
            display: 'block',
            padding: '16px 24px',
            borderRadius: 10,
            background: 'transparent',
            color: '#22c55e',
            fontWeight: 600,
            fontSize: 16,
            textDecoration: 'none',
            border: '1px solid #22c55e',
          }}
        >
          Already have an account? Log In
        </Link>
      </div>
    </div>
  )
}