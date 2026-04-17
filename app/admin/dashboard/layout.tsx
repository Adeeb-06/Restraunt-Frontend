"use client";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AdminProvider from "@/providers/AdminProvider";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseUser, dbUser, authLoading } = useAuth();
  const router = useRouter();

  console.log(dbUser , "ADmin")

  useEffect(() => {
    if (authLoading) return;

    if (!firebaseUser) {
      router.push("/auth/login");
    } else if (dbUser && dbUser.role !== "admin") {
      router.push("/dashboard");
    }
  }, [firebaseUser, dbUser, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#e8845c] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium animate-pulse">Initializing your kitchen...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) return null;

  return (
    <AdminProvider>
      <div className="flex flex-col md:flex-row h-[100dvh] bg-[#050505] overflow-hidden relative">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-16 md:pb-0">
          <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
             <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                  Welcome back, <span className="text-[#e8845c]">{dbUser?.restrauntName || "Chef"}</span>
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                  Here's what's happening in your restaurant today.
                </p>
             </div>
             {children}
          </div>
        </main>
      </div>
    </AdminProvider>
  );
}
