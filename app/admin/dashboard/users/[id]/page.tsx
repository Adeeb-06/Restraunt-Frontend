"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User as UserIcon,
  Plus,
  Check,
  X,
  Clock,
  Loader2,
  Wand2
} from "lucide-react";
import AccessCodesTable from "@/components/admin/AccessCodesTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function UserAccessCodesPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const queryClient = useQueryClient();

  const [showInput, setShowInput] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTime, setNewTime] = useState("");

  const {
    data: user,
    isLoading: userLoading,
    isError: userIsError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await api.get(`/api/admin/users/${userId}`);
      return res.data;
    },
  });

  const generateCodeMutation = useMutation({
    mutationFn: async (newCodeData: { code: string; validity: string }) => {
      const res = await api.post(`/api/admin/users/${userId}/access-codes`, newCodeData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      setShowInput(false);
      setNewCode("");
      setNewTime("");
    },
  });

  const handleCreateCode = () => {
    generateCodeMutation.mutate({ code: newCode, validity: newTime });
  };

  const handlegenerateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(result);
  };

  // Map Mongoose _id to id so our table UI stays happy without rewriting it
  const refinedAccessCodes = user?.accessCodes?.map((ac: any) => ({
    ...ac,
    id: ac._id || ac.id
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <button
            onClick={() => router.push("/admin/dashboard/users")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-4"
          >
            <ArrowLeft size={16} /> Back to Users
          </button>

          <div className="flex items-center gap-5">
            {user?.photoURL ? (
                <img src={user.photoURL} alt={user.restrauntName} className="w-16 h-16 rounded-full border-[3px] border-zinc-700/50 shadow-lg shrink-0 object-cover" />
            ) : (
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border-[3px] border-zinc-700/50 shadow-lg shrink-0">
                  <UserIcon size={28} />
                </div>
            )}
            <div>
              <h2 className="text-3xl font-bold text-white font-serif tracking-wide flex items-center gap-3">
                {user?.restrauntName || "Loading..."}
                {userLoading && <Loader2 className="animate-spin text-[#e8845c]" size={20} />}
              </h2>
              <p className="text-zinc-400 mt-1 flex items-center gap-2">
                Managing credentials for:{" "}
                <span className="font-mono text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                  {userId}
                </span>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowInput(!showInput)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all shadow-lg shrink-0 ${
            showInput
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "bg-[#e8845c]/10 text-[#e8845c] hover:bg-[#e8845c]/20 border border-[#e8845c]/20"
          }`}
        >
          {showInput ? (
            <>
              <X size={18} /> Cancel
            </>
          ) : (
            <>
              <Plus size={18} /> Generate New Code
            </>
          )}
        </button>
      </div>

      {/* Slide down input section for generating codes cleanly from the table page */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${showInput ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="p-6 bg-[#111111] rounded-3xl border border-zinc-800 flex flex-col md:flex-row gap-5 items-end shadow-2xl mb-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#e8845c]"></div>
            <div className="flex-1 w-full space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
                  Access Code String
                </label>
                <button 
                  onClick={handlegenerateRandomCode}
                  className="text-[10px] text-[#e8845c] hover:text-[#c96a41] flex items-center gap-1 font-bold tracking-widest uppercase transition-colors"
                >
                  <Wand2 size={12} /> Auto Generate
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. SPECIAL_CODE_123"
                className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-[#e8845c] transition-colors"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
                Validity Timeout
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                  <Clock size={16} />
                </div>
                <input
                  type="datetime-local"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-[#e8845c] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert transition-colors"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={handleCreateCode}
              disabled={!newCode || !newTime || generateCodeMutation.isPending}
              className="w-full md:w-auto px-8 py-3.5 bg-[#e8845c] text-white font-medium rounded-xl hover:bg-[#c96a41] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#e8845c]/20 flex items-center justify-center gap-2"
            >
              {generateCodeMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Confirm
            </button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        {userLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#e8845c]" size={42} /></div>
        ) : userIsError ? (
            <div className="text-center p-20 text-red-500 font-bold bg-[#111111] border border-red-900 rounded-3xl">Failed to load access codes</div>
        ) : (
            <AccessCodesTable codes={refinedAccessCodes} />
        )}
      </div>
    </div>
  );
}
