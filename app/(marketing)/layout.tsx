'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "#e5e7eb" }}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px clamp(16px, 4vw, 32px)",
          borderBottom: "1px solid #1e293b",
          position: "relative",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 20 }}>
          <Image
            src="/continuum-hero.jpg"
            alt="Continuum"
            width={36}
            height={36}
          />
          <span style={{ fontWeight: 600 }}>Continuum</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/about">About</Link>
          <Link href="/stories">Stories</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/login">Log In</Link>

          <Link
            href="/signup"
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              background: "#22c55e",
              color: "#020617",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            flexDirection: "column",
            gap: 5,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 8,
            zIndex: 20,
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            width: 24,
            height: 2,
            background: "#e5e7eb",
            transition: "all 0.3s",
            transform: mobileMenuOpen ? "rotate(45deg) translateY(7px)" : "none",
          }} />
          <span style={{
            width: 24,
            height: 2,
            background: "#e5e7eb",
            transition: "all 0.3s",
            opacity: mobileMenuOpen ? 0 : 1,
          }} />
          <span style={{
            width: 24,
            height: 2,
            background: "#e5e7eb",
            transition: "all 0.3s",
            transform: mobileMenuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
          }} />
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#020617",
              borderBottom: "1px solid #1e293b",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              zIndex: 10,
            }}
          >
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: "12px 0", borderBottom: "1px solid #1e293b" }}
            >
              About
            </Link>
            <Link 
              href="/stories" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: "12px 0", borderBottom: "1px solid #1e293b" }}
            >
              Stories
            </Link>
            <Link 
              href="/faq" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: "12px 0", borderBottom: "1px solid #1e293b" }}
            >
              FAQ
            </Link>
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: "12px 0", borderBottom: "1px solid #1e293b" }}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: 6,
                background: "#22c55e",
                color: "#020617",
                fontWeight: 600,
                textAlign: "center",
                textDecoration: "none",
                marginTop: 8,
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>

      <main>{children}</main>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: flex !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }

        a {
          color: #e5e7eb;
          text-decoration: none;
          transition: color 0.2s;
        }

        a:hover {
          color: #22c55e;
        }
      `}</style>
    </div>
  );
}