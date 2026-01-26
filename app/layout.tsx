import './globals.css';

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
        {children}
      </body>
    </html>
  );
}