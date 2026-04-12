"use client";
import React, { useState, useEffect } from "react";
import { Clock, Key, Trash2, Calendar, AlertCircle } from "lucide-react";

interface AccessCode {
  id: string;
  code: string;
  validity: string;
}

interface AccessCodesTableProps {
  codes: AccessCode[];
}

export default function AccessCodesTable({ codes }: AccessCodesTableProps) {
  const [now, setNow] = useState(new Date().getTime());

  // Update time every minute to keep time left fresh natively
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().getTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeLeft = (validityDateStr: string) => {
    const target = new Date(validityDateStr).getTime();
    const diff = target - now;
    
    if (diff <= 0) return { text: "Expired", isExpired: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return { text: `${days}d ${hours}h left`, isExpired: false };
    if (hours > 0) return { text: `${hours}h ${minutes}m left`, isExpired: false };
    return { text: `${minutes}m left`, isExpired: false };
  };

  if (codes.length === 0) {
    return (
      <div className="bg-[#111111] p-12 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center shadow-lg">
        <Key size={48} className="text-zinc-700 mb-4" />
        <h3 className="text-xl font-bold text-white">No Access Codes</h3>
        <p className="text-zinc-500 mt-2">This user currently has no active or expired access codes.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] rounded-3xl border border-zinc-800 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/50 border-b border-zinc-800">
              <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest min-w-[200px]">Access Code</th>
              <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest min-w-[200px]">Validity Ends</th>
              <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest min-w-[150px]">Time Left</th>
              <th className="p-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {codes.map((codeInfo) => {
              const status = getTimeLeft(codeInfo.validity);
              return (
                <tr key={codeInfo.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700 shrink-0">
                        <Key size={16} />
                      </div>
                      <span className="font-mono text-sm tracking-widest text-[#e8845c] font-bold bg-[#e8845c]/10 px-3 py-1.5 rounded-lg border border-[#e8845c]/20">
                        {codeInfo.code}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                      <Calendar size={14} className="text-zinc-500" />
                      {new Date(codeInfo.validity).toLocaleDateString()} at {new Date(codeInfo.validity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                      status.isExpired 
                        ? "bg-red-500/10 text-red-500 border-red-500/20" 
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}>
                      {status.isExpired ? <AlertCircle size={14} /> : <Clock size={14} />}
                      {status.text}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors inline-block"
                      title="Revoke Code"
                      onClick={() => console.log('Revoking code:', codeInfo.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
