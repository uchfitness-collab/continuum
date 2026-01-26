import Link from 'next/link';

export default function MarketingLayout({
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
        {/* Logo → Home */}
        <Link
          href="/"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#e5e7eb',
            textDecoration: 'none',
          }}
        >
          Continuum
        </Link>

        {/* Nav Links */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            fontSize: 14,
            color: '#cbd5f5',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: '#cbd5f5' }}>
            Home
          </Link>
          <Link href="/about" style={{ textDecoration: 'none', color: '#cbd5f5' }}>
            About
          </Link>
          <Link href="/stories" style={{ textDecoration: 'none', color: '#cbd5f5' }}>
            Stories
          </Link>
          <Link href="/login" style={{ textDecoration: 'none', color: '#cbd5f5' }}>
            Log In
          </Link>
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