"use client";
import React from "react";
import { Search } from "lucide-react";

interface UserManagementSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export default function UserManagementSearch({ value, onChange }: UserManagementSearchProps) {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={20} className="text-zinc-500" />
      </div>
      <input
        type="text"
        placeholder="Search for restaurants or email..."
        className="w-full bg-[#111111] border border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-[#e8845c] focus:bg-black transition-all shadow-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
