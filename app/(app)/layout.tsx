import Link from 'next/link';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
        <Link href="/dashboard" style={{ fontWeight: 700, fontSize: 18, color: '#e5e7eb', textDecoration: 'none' }}>
          Continuum
        </Link>

        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/daily">Daily Log</Link>
          <Link href="/weekly">Weekly Reflection</Link>
          <Link href="/habits">Habits</Link>
          <Link href="/login">Logout</Link>
        </div>
      </nav>

      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {children}
      </main>
    </>
  );
}