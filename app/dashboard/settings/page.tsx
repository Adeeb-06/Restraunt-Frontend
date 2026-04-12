"use client";
import React, { useState, useEffect } from "react";
import { Settings, Palette, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { updateUserColorsInDB } from "@/lib/userService";

export default function GeneralSettingsPage() {
  const { firebaseUser, dbUser, setDbUser } = useAuth();
  
  const [primaryColor, setPrimaryColor] = useState("#e8845c");
  const [secondaryColor, setSecondaryColor] = useState("#e8845c");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Populate actual colors from database on load
  useEffect(() => {
    if (dbUser?.colors) {
      if (dbUser.colors.primary) setPrimaryColor(dbUser.colors.primary);
      if (dbUser.colors.secondary) setSecondaryColor(dbUser.colors.secondary);
    }
  }, [dbUser]);

  const handleSaveColors = async () => {
    if (!firebaseUser?.email) return;

    try {
      setIsSaving(true);
      setErrorMsg("");
      setSuccessMsg("");
      
      const token = await firebaseUser.getIdToken();
      
      const response = await updateUserColorsInDB(firebaseUser.email, token, {
        primary: primaryColor,
        secondary: secondaryColor
      });
      
      setDbUser(response.user);
      setSuccessMsg("Brand colors successfully updated!");
      
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to update colors.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl">
      <div>
         <h2 className="text-2xl font-bold text-white mb-2 font-serif flex items-center gap-3">
             <Settings className="text-[#e8845c]" /> General Settings
         </h2>
         <p className="text-zinc-400">Configure your restaurant's global preferences and visual flair.</p>
      </div>

      <div className="bg-[#111111] p-6 md:p-8 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#e8845c] to-purple-500"></div>
        
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-800/80">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700/50">
            <Palette className="text-[#e8845c]" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">Brand Colors</h3>
            <p className="text-sm text-zinc-500 mt-1">Select the primary and secondary colors that represent your restaurant.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2">
            <Check size={16} /> {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Primary Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-16 rounded-xl cursor-pointer bg-zinc-900 border border-zinc-700 shrink-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#e8845c] transition-colors"
                placeholder="#000000"
              />
            </div>
            <p className="text-xs text-zinc-600 pl-1">Used for main buttons, highlights, and primary actions.</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Secondary Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-16 h-16 rounded-xl cursor-pointer bg-zinc-900 border border-zinc-700 shrink-0"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#e8845c] transition-colors"
                placeholder="#000000"
              />
            </div>
            <p className="text-xs text-zinc-600 pl-1">Used for badges, secondary icons, and gradients.</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800/80 flex justify-end">
          <button
            onClick={handleSaveColors}
            disabled={isSaving}
            className="px-8 py-3.5 bg-[#e8845c] hover:bg-[#c96a41] text-white font-medium rounded-xl transition-all shadow-lg shadow-[#e8845c]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {isSaving ? "Saving..." : "Save Colors"}
          </button>
        </div>
      </div>
    </div>
  );
}
