"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  LogOut,
  ChefHat
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

export default function AdminSidebar() {
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

  const adminItems = [
    { icon: Home, label: "Overview", href: "/admin/dashboard" },
    { icon: Users, label: "User Management", href: "/admin/dashboard/users" },
    { icon: Settings, label: "Settings", href: "/admin/dashboard/settings" },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-zinc-900 border-r border-zinc-800 text-gray-100 transition-all duration-300 ease-in-out flex flex-col h-screen sticky top-0`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 py-10 border-b border-zinc-800">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center space-x-2 shrink-0 gap-1.5">
            <div className="w-10 h-10 relative flex items-center justify-center drop-shadow-sm bg-white/10 rounded-xl p-1 shrink-0">
              <Image src="/scanlyLogo.png" alt="Scanly Logo" width={40} height={40} className="object-contain" />
            </div>
            <div className="flex flex-col mt-0.5">
              <div className="w-[5rem]">
                <Image src="/scanlyTextLogo.png" alt="Scanly" width={80} height={24} className="w-full h-auto object-contain" />
              </div>
              <span className="text-[0.6rem] uppercase tracking-widest text-[#49BEB7] font-bold mt-0.5">Admin</span>
            </div>
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
            Admin Menu
          </p>
        )}
        {adminItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/admin/dashboard");

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
                {dbUser?.restrauntName || "Admin User"}
              </p>
              <p className="text-xs text-[#49BEB7] uppercase tracking-widest truncate mt-1">
                System Admin
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
            <UserIcon className="w-4 h-4" />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
