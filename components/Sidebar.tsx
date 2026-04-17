"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  UtensilsCrossed,
  ClipboardList,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  CalendarDays,
  Store,
  ChefHat,
  Tags,
  QrCode
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { dbUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = "firebase-auth=; path=/; max-age=0";
    router.push("/auth/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu items for "Owner"
  const ownerItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: UtensilsCrossed, label: "Menu Editor", href: "/dashboard/menu" },
    { icon: Tags, label: "Categories", href: "/dashboard/categories" },
    { icon: QrCode, label: "QR Code", href: "/dashboard/qr" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "General Settings", href: "/dashboard/settings" },
  ];

  // Menu items for "Admin"
  const adminItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: ClipboardList, label: "Orders", href: "/dashboard/orders" },
    { icon: UtensilsCrossed, label: "Manage Menu", href: "/dashboard/menu" },
    { icon: QrCode, label: "QR Code", href: "/dashboard/qr" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    { icon: Settings, label: "Profile Settings", href: "/dashboard/settings" },
  ];

  const menuItems = dbUser?.role === "owner" ? ownerItems : adminItems;

  return (
    <>
      {/* Mobile Header (Top) */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 bg-[#050505] border-b border-zinc-800 shrink-0 z-40 relative">
        <Link href="/" className="flex items-center">
          <Image src="/scanlyTealText.png" alt="Scanly" width={80} height={24} className="h-5 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs font-semibold tracking-wide text-zinc-300 truncate max-w-[120px]">{dbUser?.restrauntName}</span>
          <button onClick={handleLogout} className="text-red-400 p-1.5 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-colors">
             <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (Side) */}
      <div
        className={`hidden md:flex ${
          isCollapsed ? "w-20" : "w-64"
        } bg-zinc-900 border-r border-zinc-800 text-gray-100 transition-all duration-300 ease-in-out flex-col h-screen sticky top-0 shrink-0`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 py-10 border-b border-zinc-800">
          {!isCollapsed && (
            <Link href="/" className="flex shrink-0">
              <div className="w-40 flex items-center">
                <Image src="/scanlyTealText.png" alt="Scanly" width={88} height={28} className="w-full h-auto object-contain" />
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto w-10 h-10 relative flex items-center justify-center drop-shadow-sm bg-white/10 rounded-xl p-1 pb-1">
              <Image src="/scanlyLogo.png" alt="Scanly Logo" width={32} height={32} className="object-contain" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors ml-1"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <p className="px-3 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 mt-2">
              Main Navigation
            </p>
          )}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");

            return (
              <Link
                key={index}
                href={item.href}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-[#0A0A0A] p-5 text-white border border-zinc-700 shadow-sm"
                    : "text-gray-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? "mx-auto" : ""} ${isActive ? "text-[#49BEB7]" : ""}`} />
                {!isCollapsed && (
                  <span className={`font-medium text-sm ${isActive ? "text-white" : ""}`}>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Area */}
        <div className="border-t border-zinc-800 p-4">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {dbUser?.restrauntName || "Loading..."}
                </p>
                <p className="text-[0.65rem] text-[#49BEB7] font-black uppercase tracking-widest truncate mt-1">
                  {dbUser?.role || "Guest"}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center mt-4 space-x-3">
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-red-500/10 border border-zinc-700 hover:border-red-500/50 hover:text-red-400 transition-colors text-white ${isCollapsed ? "w-full" : "w-full"}`}
              title="Sign Out"
            >
              <LogOut className="w-[18px] h-[18px]" />
              {!isCollapsed && <span className="font-bold text-sm tracking-wide">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Tabs) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090909]/90 backdrop-blur-xl border-t border-zinc-800 flex items-center justify-around z-50 px-2 pb-[env(safe-area-inset-bottom)]">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");

          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[3.5rem] py-1 transition-colors ${
                isActive ? "text-[#49BEB7]" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className={`w-[22px] h-[22px] mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(73,190,183,0.5)]" : ""}`} />
              <span className="text-[0.6rem] font-bold tracking-wide truncate max-w-[60px] text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
