import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Continuum',
  description: 'Your Personal Operating System for Daily Discipline',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'Inter, system-ui, sans-serif',
          backgroundColor: '#0f172a',
          color: '#e5e7eb',
        }}
      >
        {/* NAVBAR */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            backgroundColor: '#020617',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Continuum
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <NavLink href="/dashboard" label="Dashboard" />
            <NavLink href="/daily" label="Daily Log" />
            <NavLink href="/weekly" label="Weekly Reflection" />
            <NavLink href="/habits" label="Habit Definitions" />
            <NavLink href="/about" label="About" />
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '32px 24px',
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: 'none',
        color: '#cbd5f5',
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {label}
    </Link>
  );
}