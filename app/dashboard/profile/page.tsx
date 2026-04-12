"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { Loader2, Camera, User, Store } from "lucide-react";
import { toast } from "react-toastify";
import { getIdToken } from "firebase/auth";
import { updateUserProfileInDB } from "@/lib/userService";

export default function ProfilePage() {
  const { dbUser, firebaseUser, setDbUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [restrauntName, setRestrauntName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (dbUser) {
      setRestrauntName(dbUser.restrauntName || "");
      setPhotoURL(dbUser.photoURL || "");
    }
  }, [dbUser]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration missing. Check .env.local");
      }

      data.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to upload image. Please try again.");

      const json = await res.json();
      setPhotoURL(json.secure_url);
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!firebaseUser || !dbUser) return;
    if (!restrauntName.trim()) {
      return toast.error("Restaurant Name cannot be empty.");
    }

    setIsSaving(true);
    try {
      const token = await getIdToken(firebaseUser);
      const res = await updateUserProfileInDB(dbUser.email, token, {
        restrauntName,
        photoURL,
      });
      setDbUser(res.user);
      toast.success("Profile saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8845c] rounded-full blur-[120px] pointer-events-none opacity-5" />

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-32 h-32 rounded-full border border-zinc-700 bg-[#0a0a0a] overflow-hidden group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-zinc-600">
                  <User size={48} />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white drop-shadow-lg" size={28} />
              </div>
              
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="animate-spin text-[#e8845c]" size={28} />
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-colors"
            >
              Change Photo
            </button>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-6 w-full mt-2">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Restaurant Name
              </label>
              <div className="relative">
                <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={restrauntName}
                  onChange={(e) => setRestrauntName(e.target.value)}
                  placeholder="The Chef's Kitchen"
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8845c] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Owner Email
              </label>
              <input
                type="email"
                value={dbUser?.email || ""}
                disabled
                className="w-full bg-[#111111] border border-zinc-800/50 rounded-xl px-4 py-3 text-zinc-600 cursor-not-allowed"
              />
              <p className="text-[10px] text-zinc-600 mt-1.5 ml-1">Email cannot be changed natively.</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end pt-6 border-t border-zinc-800/80">
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#e8845c] to-[#c96a41] text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#e8845c]/20 disabled:opacity-60 disabled:pointer-events-none"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
