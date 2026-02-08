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
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 12,
            color: '#e5e7eb',
          }}
        >
          You’re In
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: 15,
            marginBottom: 32,
          }}
        >
          Your subscription is set.  
          Continuum is now available to you.
        </p>

        <Link
          href="/habits"
          style={{
            display: 'inline-block',
            padding: '16px 24px',
            borderRadius: 10,
            background: 'linear-gradient(180deg, #22c55e, #16a34a)',
            color: '#020617',
            fontWeight: 600,
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          Enter Continuum
        </Link>
      </div>
    </div>
  )
}