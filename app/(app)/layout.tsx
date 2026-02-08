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

  useEffect(() => {
    const runGate = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      // 1️⃣ Not logged in → login
      if (!user) {
        router.push('/login');
        return;
      }

      const userEmail = user.email ?? null;
      setEmail(userEmail);

      // 2️⃣ Internal users → always allowed
      if (userEmail && INTERNAL_USERS.includes(userEmail)) {
        return;
      }

      // 3️⃣ Check Stripe subscription
      try {
        const res = await fetch(
          'https://cvfcwwgnnanzgcbpjon.supabase.co/functions/v1/check-subscription',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail }),
          }
        );

        const result = await res.json();

        // 4️⃣ No active subscription → Stripe Checkout
        if (!result.active) {
          window.location.href =
            'https://cvfcwwgnnanzgcbpjon.supabase.co/functions/v1/bright-responder';
          return;
        }
      } catch (err) {
        console.error('Subscription gate error:', err);
        window.location.href =
          'https://cvfcwwgnnanzgcbpjon.supabase.co/functions/v1/bright-responder';
      }
    };

    runGate();
  }, [router]);

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
            <span style={{ fontSize: 18, fontWeight: 700 }}>
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