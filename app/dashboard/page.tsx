"use client";
import React from "react";
import { useAuth } from "@/providers/FirebaseAuthProvider";
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

  const stats = [
    { label: "Today's Orders", value: "42", icon: ShoppingBag, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Active Customers", value: "12", icon: Users, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
    { label: "Menu Items", value: "24", icon: Utensils, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { label: "Revenue", value: "$1,240", icon: TrendingUp, color: "text-[#e8845c]", bgColor: "bg-[#e8845c]/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111111] border border-zinc-800/80 rounded-2xl p-6 hover:bg-[#161616] transition-colors shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 font-medium text-sm">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-[#e8845c] tracking-widest uppercase">Live Data</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-[#111111] rounded-2xl border border-zinc-800/80 shadow-lg overflow-hidden">
             <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
               <h2 className="text-lg font-bold text-white">Recent Orders</h2>
               <button className="text-sm font-medium text-[#e8845c] hover:text-[#c96a41] transition-colors">View All</button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <tbody>
                   {[1, 2, 3, 4].map((item) => (
                     <tr key={item} className="border-b border-zinc-800/50 hover:bg-[#161616]/50 transition-colors">
                       <td className="p-4">
                         <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-[#e8845c]">
                             <Clock size={18} />
                           </div>
                           <div>
                             <div className="font-bold text-white">Table #0{item}</div>
                             <div className="text-xs text-zinc-500 mt-0.5">3 items • $45.00</div>
                           </div>
                         </div>
                       </td>
                       <td className="p-4 text-right">
                         <span className="px-3 py-1 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full">
                           IN PROGRESS
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-[#e8845c] to-[#c96a41] rounded-2xl p-6 shadow-lg text-white">
              <h2 className="text-lg font-bold">System Status</h2>
              <div className="space-y-4 mt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Kitchen Display</span>
                  <CheckCircle2 size={18} className="text-emerald-300" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Payment Gateway</span>
                  <CheckCircle2 size={18} className="text-emerald-300" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium opacity-90">Inventory Sync</span>
                  <AlertCircle size={18} className="text-amber-200" />
                </div>
              </div>
           </div>

           <div className="bg-[#111111] rounded-2xl border border-zinc-800/80 shadow-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-2.5 rounded-lg border border-[#e8845c] text-[#e8845c] hover:bg-[#e8845c] hover:text-white text-sm font-bold transition-all">New Order</button>
                <button className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white text-sm font-bold transition-all">Print Menu</button>
                <button className="px-4 py-2.5 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black text-sm font-bold transition-all">Alert Staff</button>
                <button className="px-4 py-2.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm font-bold transition-all">Clock Out</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
