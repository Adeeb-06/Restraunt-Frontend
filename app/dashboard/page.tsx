"use client";
import React from "react";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import MenuPreview from "@/components/menu/MenuPreview";
import { 
  Users, 
  ShoppingBag, 
  Utensils, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const { dbUser } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Menu Preview Section */}
      <div className="mt-8">
         <h2 className="text-xl font-bold text-white mb-6 font-serif flex items-center gap-3">
             <Utensils className="text-[#e8845c]" /> Quick Menu Preview
         </h2>
         <div className="bg-[#111111] p-4 md:p-8 rounded-3xl border border-zinc-800/80 shadow-lg h-[800px] flex overflow-hidden">
             {/* Using the abstracted preview component passed with the current user's DB restrauntName */}
             {dbUser?.restrauntName ? (
                <div className="w-full max-w-md mx-auto h-full border-4 border-[#1c1c1c] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                   <MenuPreview restaurantName={dbUser.restrauntName} />
                </div>
             ) : (
                <div className="w-full flex items-center justify-center text-zinc-500">
                   Load failed
                </div>
             )}
         </div>
      </div>
    </div>
  );
}
