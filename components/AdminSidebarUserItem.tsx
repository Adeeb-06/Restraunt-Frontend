"use client";
import React, { useState } from "react";
import { Plus, User as UserIcon, Clock, Check, X } from "lucide-react";

interface AdminSidebarUserItemProps {
  user: {
    id: string;
    restrauntName: string;
    email: string;
    photoURL?: string;
  };
}

export default function AdminSidebarUserItem({ user }: AdminSidebarUserItemProps) {
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState("");
  const [time, setTime] = useState("");

  const handleSave = () => {
    // Only frontend logic as requested
    console.log("Saved access code:", { code, time, userId: user.id });
    setShowInput(false);
    setCode("");
    setTime("");
  };

  return (
    <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-700/50 flex flex-col gap-2 transition-all hover:bg-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.restrauntName} className="w-8 h-8 rounded-full border border-zinc-600" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400">
              <UserIcon size={14} />
            </div>
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-white truncate">{user.restrauntName}</span>
            <span className="text-xs text-zinc-400 truncate">{user.email}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setShowInput(!showInput)}
          className={`p-1.5 rounded-md transition-colors ${showInput ? 'bg-zinc-700 text-white' : 'bg-[#e8845c]/10 text-[#e8845c] hover:bg-[#e8845c]/20'}`}
          title="Add Access Code"
        >
          {showInput ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {showInput && (
        <div className="mt-2 pt-3 border-t border-zinc-700/50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            placeholder="Access Code"
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#e8845c]"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500">
                <Clock size={14} />
              </div>
              <input
                type="datetime-local"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#e8845c] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSave}
              disabled={!code || !time}
              className="p-1.5 bg-[#e8845c] text-white rounded-lg hover:bg-[#c96a41] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
