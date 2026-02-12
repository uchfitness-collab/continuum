// ============================================================
// CHECKOUT SUCCESS PAGE - CURRENTLY DISABLED FOR BETA
// ============================================================
// This page is commented out during the beta period (free signups).
// To re-enable after beta:
// 1. Uncomment all code below
// 2. Set up Stripe checkout flow in your signup process
// 3. Redirect successful payments to /checkout-success
// ============================================================

'use client'

import Link from 'next/link'

export default function CheckoutSuccessPage() {
  // ============================================================
  // FREE BETA VERSION - Redirect to habits setup
  // ============================================================
  // During beta, users sign up for free and don't need checkout
  // This page redirects them directly to habits setup
  
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
          🎉
        </div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 12,
            color: '#e5e7eb',
          }}
        >
          Welcome to Beta!
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: 15,
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          You're part of our exclusive beta. Continuum is free during this period while we refine the experience.
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
          Set Up Your Habits
        </Link>
      </div>
    </div>
  )
}

// ============================================================
// POST-BETA VERSION (COMMENTED OUT)
// ============================================================
// Uncomment the code below when you're ready to charge users
// ============================================================

/*
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

        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 12,
            color: '#e5e7eb',
          }}
        >
          Payment Successful
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: 15,
            marginBottom: 32,
          }}
        >
          Your subscription is active.  
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
*/