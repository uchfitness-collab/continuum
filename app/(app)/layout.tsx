'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) { router.push('/login'); return; }
      setEmail(user.email ?? null);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080c18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#4ade80', borderRadius: '50%', margin: '0 auto 14px', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080c18', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px clamp(20px, 4vw, 60px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, background: '#080c18', zIndex: 200,
      }}>
        <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 36px)', alignItems: 'center', flex: 1 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/continuum-hero.jpg" alt="Continuum" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff' }}>
              Continuum
            </span>
          </Link>
          <div className="desktop-nav" style={{ display: 'flex', gap: 24 }}>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/daily">Daily Log</NavLink>
            <NavLink href="/habits">Habits</NavLink>
            <NavLink href="/goals">Goals</NavLink>
            <NavLink href="/weekly">Week</NavLink>
            <NavLink href="/guide">Guide</NavLink>
          </div>
        </div>

        <div className="desktop-user" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {email && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>{email}</span>}
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
            style={{ background: 'transparent', color: 'rgba(255,255,255,0.4)', padding: '8px 16px', borderRadius: 8, fontWeight: 500, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 13 }}
          >
            Log Out
          </button>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', flexDirection: 'column', gap: 5, background: 'transparent', border: 'none', cursor: 'pointer', padding: 8 }}
          aria-label="Toggle menu"
        >
          <span style={{ width: 22, height: 1.5, background: '#fff', display: 'block', transition: 'all 0.25s', transform: mobileMenuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none', opacity: mobileMenuOpen ? 1 : 0.5 }} />
          <span style={{ width: 22, height: 1.5, background: '#fff', display: 'block', transition: 'all 0.25s', opacity: mobileMenuOpen ? 0 : 0.5 }} />
          <span style={{ width: 22, height: 1.5, background: '#fff', display: 'block', transition: 'all 0.25s', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none', opacity: mobileMenuOpen ? 1 : 0.5 }} />
        </button>
      </nav>

      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: 61, left: 0, right: 0, bottom: 0, background: '#080c18', zIndex: 199, overflowY: 'auto', padding: '8px 24px 32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/daily',     label: 'Daily Log' },
              { href: '/habits',    label: 'Habits' },
              { href: '/goals',     label: 'Goals' },
              { href: '/weekly',    label: 'Week' },
              { href: '/guide',     label: 'Guide' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 17, fontWeight: 500, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'block' }}>
                {label}
              </Link>
            ))}
            {email && <div style={{ padding: '16px 0', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{email}</div>}
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
              style={{ background: 'transparent', color: 'rgba(239,68,68,0.8)', padding: '14px 0', borderRadius: 0, fontWeight: 500, border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: 15, textAlign: 'left', marginTop: 8 }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      <main>{children}</main>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) {
          .desktop-nav  { display: none !important; }
          .desktop-user { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .mobile-menu-btn { display: none !important; }
        }
        * { box-sizing: border-box; }
        body { background: #080c18; color: #fff; margin: 0; }
        a { color: inherit; text-decoration: none; }
        a:hover { color: #4ade80; transition: color 0.15s; }
      `}</style>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em' }}>
      {children}
    </Link>
  );
}