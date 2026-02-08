'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { useRouter } from 'next/navigation';

/* ---------- Internal Free Tier Allowlist ---------- */
const INTERNAL_USERS = [
  'uchfitness@gmail.com',
  'heribertor7@yahoo.com',
  'helenalejo2@gmail.com',
  'davianhall2002@gmail.com',
  'chidi.akusobi@gmail.com',
  'kelechiakusobi@gmail.com',
  'ijeoma.akusobi@gmail.com',
  'davidhkoffi@gmail.com',
  'darrenhall1997@gmail.com',
  'akusobiinvestments@gmail.com',
  'mr.ifeanyirobi@gmail.com',
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runGate = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push('/login');
        return;
      }

      const userEmail = user.email ?? null;
      setEmail(userEmail);

      if (userEmail && INTERNAL_USERS.includes(userEmail)) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          'https://cvfcwwgnnmanzgcbpjon.supabase.co/functions/v1/check-subscription',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }),
          }
        );

        if (!res.ok) {
          throw new Error('Failed to check subscription');
        }

        const result = await res.json();

        if (result.active) {
          setLoading(false);
          return;
        }

        await redirectToCheckout();
      } catch (err) {
        console.error('Subscription gate error:', err);
        await redirectToCheckout();
      }
    };

    runGate();
  }, [router]);

  const redirectToCheckout = async () => {
    try {
      const res = await fetch(
        'https://cvfcwwgnnmanzgcbpjon.supabase.co/functions/v1/bright-responder',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout redirect error:', err);
      router.push('/signup?error=payment_required');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: '3px solid #1e293b',
              borderTopColor: '#22c55e',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e5e7eb' }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          background: '#020617',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <img
              src="/continuum-hero.jpg"
              alt="Continuum"
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                filter: 'grayscale(100%)',
              }}
            />
            <span style={{ fontSize: 18, fontWeight: 700, color: '#e5e7eb' }}>
              Continuum
            </span>
          </Link>

          <div style={{ display: 'flex', gap: 20 }}>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/daily">Daily Log</NavLink>
            <NavLink href="/habits">Habits</NavLink>
            <NavLink href="/goals">Goals</NavLink>
            <NavLink href="/weekly">Weekly</NavLink>
            <NavLink href="/guide">Guide</NavLink>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {email && (
            <span style={{ fontSize: 13, opacity: 0.6 }}>{email}</span>
          )}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            style={{
              background: 'transparent',
              color: '#ef4444',
              padding: '8px 16px',
              borderRadius: 6,
              fontWeight: 600,
              border: '1px solid #ef444440',
              cursor: 'pointer',
            }}
          >
            Log Out
          </button>
        </div>
      </nav>

      <main>{children}</main>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: '#94a3b8',
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: 500,
      }}
    >
      {children}
    </Link>
  );
}