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
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-zinc-900 text-gray-100 transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 py-10 border-b border-zinc-800">
        {!isCollapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 relative flex items-center justify-center drop-shadow-sm bg-white/10 rounded-xl p-1">
              <Image src="/scanlylogo.png" alt="Scanly Logo" width={40} height={40} className="object-contain" />
            </div>
            <span className="font-black text-2xl font-sans tracking-tight">Scanly</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto w-10 h-10 relative flex items-center justify-center drop-shadow-sm bg-white/10 rounded-xl p-1 pb-1">
            <Image src="/scanlylogo.png" alt="Scanly Logo" width={32} height={32} className="object-contain" />
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
      <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-3 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 mt-2">
            Main Navigation
          </p>
        )}
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          // Simple exact match or startsWith logic
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard");

          return (
            <Link
              key={index}
              href={item.href}
              title={isCollapsed ? item.label : ""}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-white p-5 text-zinc-900 shadow-sm"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? "mx-auto" : ""}`} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
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
              <p className="text-xl font-medium text-white truncate">
                {dbUser?.restrauntName || "Loading..."}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-widest truncate mt-1">
                {dbUser?.role || "Guest"}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-4 space-x-3">
          <button
            onClick={handleLogout}
            className={`btn btn-sm bg-[#49BEB7] hover:bg-[#3ba8a1] border-none text-white ${isCollapsed ? "w-full" : ""}`}
            title="Sign Out"
          >
            <User className="w-4 h-4" />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
