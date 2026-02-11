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
  'bonafedeben@gmail.com',
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          padding: '16px clamp(16px, 4vw, 32px)',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          background: '#020617',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', alignItems: 'center', flex: 1 }}>
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

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', gap: 20 }}>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/daily">Daily Log</NavLink>
            <NavLink href="/habits">Habits</NavLink>
            <NavLink href="/goals">Goals</NavLink>
            <NavLink href="/weekly">Weekly</NavLink>
            <NavLink href="/guide">Guide</NavLink>
          </div>
        </div>

        {/* Desktop User Info + Logout */}
        <div className="desktop-user" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
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
              fontSize: 14,
            }}
          >
            Log Out
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            width: 24,
            height: 2,
            background: '#e5e7eb',
            transition: 'all 0.3s',
            transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
          }} />
          <span style={{
            width: 24,
            height: 2,
            background: '#e5e7eb',
            transition: 'all 0.3s',
            opacity: mobileMenuOpen ? 0 : 1,
          }} />
          <span style={{
            width: 24,
            height: 2,
            background: '#e5e7eb',
            transition: 'all 0.3s',
            transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
          }} />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'fixed',
            top: 61,
            left: 0,
            right: 0,
            background: '#020617',
            borderBottom: '1px solid #1e293b',
            padding: '20px',
            zIndex: 99,
            maxHeight: 'calc(100vh - 61px)',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/daily" onClick={() => setMobileMenuOpen(false)}>
              Daily Log
            </MobileNavLink>
            <MobileNavLink href="/habits" onClick={() => setMobileMenuOpen(false)}>
              Habits
            </MobileNavLink>
            <MobileNavLink href="/goals" onClick={() => setMobileMenuOpen(false)}>
              Goals
            </MobileNavLink>
            <MobileNavLink href="/weekly" onClick={() => setMobileMenuOpen(false)}>
              Weekly
            </MobileNavLink>
            <MobileNavLink href="/guide" onClick={() => setMobileMenuOpen(false)}>
              Guide
            </MobileNavLink>
            
            {email && (
              <div style={{ 
                padding: '12px 0',
                borderTop: '1px solid #1e293b',
                marginTop: 8,
                fontSize: 13,
                color: '#94a3b8',
              }}>
                {email}
              </div>
            )}
            
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              style={{
                background: 'transparent',
                color: '#ef4444',
                padding: '12px 16px',
                borderRadius: 6,
                fontWeight: 600,
                border: '1px solid #ef444440',
                cursor: 'pointer',
                fontSize: 15,
                marginTop: 8,
                textAlign: 'left',
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      <main>{children}</main>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          
          .desktop-user {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: flex !important;
          }
        }

        @media (min-width: 1025px) {
          .mobile-menu {
            display: none !important;
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
        transition: 'color 0.2s',
      }}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ 
  href, 
  children,
  onClick 
}: { 
  href: string; 
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        color: '#e5e7eb',
        textDecoration: 'none',
        fontSize: 16,
        fontWeight: 500,
        padding: '12px 0',
        borderBottom: '1px solid #1e293b',
        display: 'block',
      }}
    >
      {children}
    </Link>
  );
}