'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white">
      
      {/* NAV */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/10">
        <h1 className="text-xl font-semibold tracking-wide">Continuum</h1>
        <div className="flex gap-6 text-sm text-gray-300">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/daily" className="hover:text-white">Daily Log</Link>
          <Link href="/weekly" className="hover:text-white">Weekly Reflection</Link>
          <Link href="/habits" className="hover:text-white">Habits</Link>
          <Link href="/login" className="hover:text-white">Log In</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 pt-28 pb-24">
        <h2 className="text-5xl font-bold leading-tight max-w-3xl">
          Your Personal Operating System<br />for Discipline
        </h2>

        <p className="mt-6 max-w-xl text-gray-300 text-lg">
          Continuum helps you measure what actually matters —  
          daily action, consistency, and identity alignment — through a single
          score that compounds over time.
        </p>

        <div className="flex gap-4 mt-10">
          <Link
            href="/signup"
            className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white/10"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* WHAT IS CONTINUUM */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-10 text-left">
          <div>
            <h3 className="text-xl font-semibold mb-3">Body</h3>
            <p className="text-gray-400">
              Physical action creates momentum. Continuum tracks movement,
              nutrition discipline, and daily reps — because energy fuels everything.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Mind</h3>
            <p className="text-gray-400">
              What you avoid matters as much as what you do. Track discipline,
              habit replacement, and mental control.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Identity</h3>
            <p className="text-gray-400">
              Identity is built through proof. Continuum measures alignment
              between who you say you are and what you do daily.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-32">
        <h3 className="text-3xl font-bold">
          Discipline is measurable. Now prove it.
        </h3>
        <Link
          href="/signup"
          className="inline-block mt-8 bg-green-500 hover:bg-green-600 text-black px-8 py-4 rounded-xl font-semibold text-lg"
        >
          Start Tracking Today
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 pb-10">
        © {new Date().getFullYear()} Continuum Growth. All rights reserved.
      </footer>
    </main>
  );
}