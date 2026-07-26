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
    <div style={{ background: "#080c18", minHeight: "100vh", color: "#fff", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px clamp(20px, 4vw, 60px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        zIndex: 50,
      }}>

        {/* LOGO */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image
            src="/continuum-hero.jpg"
            alt="Continuum"
            width={30}
            height={30}
            style={{ borderRadius: 6, objectFit: "cover" }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#fff" }}>
            Continuum
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link href="/how-it-works" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.02em" }}>
            How It Works
          </Link>
          <Link href="/contact" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: "0.02em" }}>
            Contact
          </Link>
        </div>

        {/* DESKTOP RIGHT */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/login" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
            Log In
          </Link>
          <Link href="/signup" style={{
            padding: "9px 20px",
            background: "#4ade80",
            color: "#080c18",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}>
            Start Tracking
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
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
          }}
          aria-label="Toggle menu"
        >
          <span style={{ width: 22, height: 1.5, background: "#fff", display: "block", transition: "all 0.25s", transform: mobileMenuOpen ? "rotate(45deg) translateY(6.5px)" : "none", opacity: mobileMenuOpen ? 1 : 0.6 }} />
          <span style={{ width: 22, height: 1.5, background: "#fff", display: "block", transition: "all 0.25s", opacity: mobileMenuOpen ? 0 : 0.6 }} />
          <span style={{ width: 22, height: 1.5, background: "#fff", display: "block", transition: "all 0.25s", transform: mobileMenuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none", opacity: mobileMenuOpen ? 1 : 0.6 }} />
        </button>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#080c18",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "8px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            zIndex: 40,
          }}>
            {[
              { href: "/how-it-works", label: "How It Works" },
              { href: "/contact",      label: "Contact" },
              { href: "/login",        label: "Log In" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "block",
                marginTop: 16,
                padding: "14px",
                background: "#4ade80",
                color: "#080c18",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Start Tracking
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
          .mobile-menu-btn {
            display: none !important;
          }
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          color: #4ade80;
          transition: color 0.15s;
        }
      `}</style>
    </div>
  );
}