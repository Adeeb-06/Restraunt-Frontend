"use client";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseUser, dbUser, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push("/auth/login");
    }
  }, [firebaseUser, authLoading, router]);

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
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 max-w-[1600px] mx-auto">
           <div className="mb-8">
              <h1 className="text-3xl font-bold font-serif text-white">
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
  );
}
