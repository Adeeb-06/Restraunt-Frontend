"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChefHat, LogOut, User, Menu, X, UtensilsCrossed } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { toast } from "react-toastify";

const NAV_LINKS = [
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Reservations", href: "#reservations" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { firebaseUser, authLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close user menu on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Close mobile menu on resize ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      document.cookie = "firebase-auth=; path=/; max-age=0";
      toast.success("Signed out successfully");
      setUserMenuOpen(false);
      window.location.href = "/auth/login";
    } catch {
      toast.error("Sign out failed");
    }
  };

  /* ── Avatar initials ── */
  const initials = firebaseUser?.displayName
    ? firebaseUser.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : firebaseUser?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar-inner">

          {/* ── Brand ── */}
          <Link href="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
            <div className="navbar-logo">
              <ChefHat size={22} strokeWidth={1.8} />
            </div>
            <span className="navbar-brand-name">Saveur</span>
            <UtensilsCrossed size={14} className="navbar-brand-accent" />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="navbar-links" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="navbar-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Auth Area ── */}
          <div className="navbar-auth">
            {authLoading ? (
              <div className="navbar-skeleton" aria-hidden="true" />
            ) : firebaseUser ? (
              /* ── Logged in: avatar + dropdown ── */
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button
                  id="user-avatar-btn"
                  className="user-avatar-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  {firebaseUser.photoURL ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={firebaseUser.photoURL}
                      alt={firebaseUser.displayName ?? "User"}
                      className="user-avatar-img"
                    />
                  ) : (
                    <span className="user-avatar-initials">{initials}</span>
                  )}
                  <span className="user-display-name">
                    {firebaseUser.displayName?.split(" ")[0] ?? "Account"}
                  </span>
                  <svg
                    className={`user-chevron${userMenuOpen ? " rotated" : ""}`}
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown */}
                <div className={`user-dropdown${userMenuOpen ? " user-dropdown--open" : ""}`}>
                  <div className="user-dropdown-header">
                    <p className="user-dropdown-name">
                      {firebaseUser.displayName ?? "Guest"}
                    </p>
                    <p className="user-dropdown-email">{firebaseUser.email}</p>
                  </div>
                  <div className="user-dropdown-divider" />
                  <Link
                    href="/profile"
                    className="user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={15} />
                    My Profile
                  </Link>
                  <button
                    id="logout-btn"
                    className="user-dropdown-item user-dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* ── Guest: login + register ── */
              <div className="guest-auth-btns">
                <Link href="/auth/login" className="btn-ghost" id="nav-login-btn">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-primary" id="nav-register-btn">
                  Get Started
                </Link>
              </div>
            )}

            {/* ── Mobile hamburger ── */}
            <button
              className="hamburger-btn"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer overlay ── */}
      <div
        className={`mobile-overlay${mobileOpen ? " mobile-overlay--open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ── */}
      <div className={`mobile-drawer${mobileOpen ? " mobile-drawer--open" : ""}`}>
        <nav className="mobile-nav">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mobile-auth">
          {!authLoading && !firebaseUser && (
            <>
              <Link
                href="/auth/login"
                className="mobile-btn-ghost"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="mobile-btn-primary"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
          {!authLoading && firebaseUser && (
            <button className="mobile-btn-danger" onClick={handleLogout}>
              <LogOut size={16} />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );
}
