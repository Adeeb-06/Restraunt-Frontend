"use client";
import React from "react";
import { User as UserIcon, Key, ChevronRight } from "lucide-react";
import Link from "next/link";

interface UserManagementItemProps {
  user: {
    id: string;
    restrauntName: string;
    email: string;
    photoURL?: string;
  };
}

export default function UserManagementItem({ user }: UserManagementItemProps) {
  return (
    <div className="bg-[#111111] rounded-2xl p-4 md:p-6 border border-zinc-800 shadow-xl transition-all hover:border-zinc-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.restrauntName} className="w-12 h-12 rounded-full border-2 border-zinc-700 object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border-2 border-zinc-700">
              <UserIcon size={20} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">{user.restrauntName}</h3>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>
        </div>

        <Link
          href={`/admin/dashboard/users/${user.id}`}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 group"
        >
          <Key size={16} className="text-[#e8845c] group-hover:scale-110 transition-transform" /> 
          Manage Codes 
          <ChevronRight size={16} className="text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
