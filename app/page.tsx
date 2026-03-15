"use client";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="page-with-navbar home-page">
      {/* Ambient background */}
      <div className="home-bg-blob home-blob-1" />
      <div className="home-bg-blob home-blob-2" />

      {/* Hero */}
      <section className="hero-section" id="menu">
        <div className="hero-badge">
          <Star size={12} fill="currentColor" />
          <span>Michelin Recommended 2025</span>
        </div>

        <h1 className="hero-title">
          Crafted with <span className="hero-highlight">Passion</span>,<br />
          Served with <span className="hero-highlight">Purpose</span>
        </h1>

        <p className="hero-subtitle">
          From farm-fresh ingredients to beautifully plated masterpieces —
          explore a menu curated for the discerning palate.
        </p>

        <div className="hero-cta-group">
          <Link href="/auth/register" className="hero-btn-primary">
            Reserve a Table
            <ArrowRight size={16} />
          </Link>
          <Link href="#menu" className="hero-btn-ghost">
            View Menu
          </Link>
        </div>

        {/* Stats row */}
        <div className="hero-stats">
          {[
            { value: "150+", label: "Dishes" },
            { value: "12yr", label: "Experience" },
            { value: "4.9★", label: "Rating" },
          ].map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
