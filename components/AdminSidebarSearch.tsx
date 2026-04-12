"use client";
import React from "react";
import { Search } from "lucide-react";

interface AdminSidebarSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export default function AdminSidebarSearch({ value, onChange }: AdminSidebarSearchProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-zinc-500" />
      </div>
      <input
        type="text"
        placeholder="Search users..."
        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e8845c] focus:bg-zinc-800 transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
