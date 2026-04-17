"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChefHat, LogOut, User, Menu, X, UtensilsCrossed, LayoutDashboard } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { toast } from "react-toastify";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Reservations", href: "#reservations" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { firebaseUser, dbUser, authLoading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const initials = firebaseUser?.displayName
    ? firebaseUser.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : firebaseUser?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${scrolled ? "bg-[#F7F9F2]/80 backdrop-blur-xl border-b border-zinc-200 shadow-sm" : "bg-transparent border-b border-transparent"}`}>
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
          
          {/* Brand */}
          <Link href="/" className="flex items-center  group" onClick={() => setMobileOpen(false)}>
            <div className="w-16 h-16 relative flex items-center justify-center group-hover:scale-105 transition-transform drop-shadow-sm">
              <Image width={120} height={120} src="/scanlyLogo.png" alt="Scanly Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-sans text-2xl font-black text-zinc-900 tracking-tight">Scanly</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-4" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-medium text-zinc-600 hover:text-[#49BEB7] px-3 py-2 rounded-lg hover:bg-zinc-200/50 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Area */}
          <div className="flex items-center gap-3 ml-auto">
            {authLoading ? (
               <div className="w-40 h-9 rounded-lg bg-zinc-200/50 animate-pulse" />
            ) : firebaseUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full hover:bg-zinc-200/50 transition-colors border border-transparent hover:border-zinc-300"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-expanded={userMenuOpen}
                >
                  {firebaseUser.photoURL ? (
                    <img src={firebaseUser.photoURL} alt="User" className="w-7 h-7 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-zinc-200 border border-zinc-300 flex items-center justify-center text-xs font-bold text-zinc-600">
                      {initials}
                    </div>
                  )}
                  <span className="text-sm font-medium text-zinc-800 hidden sm:block">
                    {firebaseUser.displayName?.split(" ")[0] ?? "Account"}
                  </span>
                  <svg
                    className={`text-zinc-500 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-zinc-200 shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <p className="text-sm font-bold text-zinc-900 truncate">{firebaseUser.displayName ?? "Guest"}</p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{firebaseUser.email}</p>
                    </div>
                    
                    <div className="p-1.5">
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:text-[#49BEB7] hover:bg-[#49BEB7]/10 rounded-lg transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User size={16} /> My Profile
                      </Link>
                      {(dbUser?.role === "admin" || dbUser?.role === "owner") && (
                        <Link href={dbUser?.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:text-[#49BEB7] hover:bg-[#49BEB7]/10 rounded-lg transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      )}
                    </div>
                    
                    <div className="p-1.5 border-t border-zinc-100">
                      <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/auth/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-4 py-2 hover:bg-zinc-200/50 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="text-sm font-bold text-white bg-[#49BEB7] px-5 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-[#3ba8a1] transition-all">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-colors ml-2" onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#F7F9F2] border-l border-zinc-200 z-50 p-6 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
            <nav className="flex flex-col gap-2 mt-12 mb-8">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="text-lg font-medium text-zinc-700 hover:text-[#49BEB7] px-4 py-3 rounded-lg hover:bg-zinc-200/50 transition-colors" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
            </nav>

            {!authLoading && !firebaseUser && (
              <div className="flex flex-col gap-3 mt-auto">
                <Link href="/auth/login" className="text-center font-medium bg-zinc-200/80 text-zinc-800 py-3 rounded-xl hover:bg-zinc-300 transition-colors" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/auth/register" className="text-center font-bold bg-[#49BEB7] text-white py-3 rounded-xl hover:bg-[#3ba8a1] shadow-md transition-colors" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </div>
            )}
            
            {!authLoading && firebaseUser && (
              <button className="mt-auto flex items-center justify-center gap-2 text-red-500 bg-red-50 py-3 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-100" onClick={handleLogout}>
                <LogOut size={18} /> Sign Out
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
