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
        }}
      >
        <div style={{ display: 'flex', gap: 20 }}>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/daily">Daily Log</NavLink>
          <NavLink href="/habits">Habits</NavLink>
          <NavLink href="/weekly">Weekly Reflection</NavLink>
          <NavLink href="/guide">Guide</NavLink>
          <NavLink href="/goals">Goals</NavLink>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {email && <span style={{ opacity: 0.7, fontSize: 14 }}>{email}</span>}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            style={{
              background: '#ef4444',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 6,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Log out
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
        color: '#e5e7eb',
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: 500,
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#22c55e')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#e5e7eb')}
    >
      {children}
    </Link>
  );
}