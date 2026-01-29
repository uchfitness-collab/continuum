import Image from 'next/image';
import Link from 'next/link';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: '#e5e7eb' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src="/continuum-hero.jpg"
            alt="Continuum"
            width={36}
            height={36}
          />
          <span style={{ fontWeight: 600 }}>Continuum</span>
        </Link>

        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/about">About</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/login">Log In</Link>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}