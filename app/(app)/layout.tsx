'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
      } else {
        setEmail(data.user.email ?? null);
      }
    });
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
        {/* LEFT SIDE - LOGO + NAV LINKS */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {/* LOGO */}
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
            <span style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#e5e7eb',
            }}>
              Continuum
            </span>
          </Link>

          {/* NAV LINKS */}
          <div style={{ display: 'flex', gap: 20 }}>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/daily">Daily Log</NavLink>
            <NavLink href="/habits">Habits</NavLink>
            <NavLink href="/goals">Goals</NavLink>
            <NavLink href="/weekly">Weekly</NavLink>
            <NavLink href="/guide">Guide</NavLink>
          </div>
        </div>

        {/* RIGHT SIDE - USER INFO + LOGOUT */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {email && (
            <span style={{ 
              opacity: 0.6, 
              fontSize: 13,
              color: '#94a3b8',
            }}>
              {email}
            </span>
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
              fontSize: 14,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef444420';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
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

/* ---------- Components ---------- */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href}
      style={{
        color: '#94a3b8',
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: 500,
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#22c55e')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
    >
      {children}
    </Link>
  );
}