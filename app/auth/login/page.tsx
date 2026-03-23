"use client";
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ChefHat } from "lucide-react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setAuthCookieAndRedirect } from "@/lib/auth";
import { upsertUserInDB } from "@/lib/userService";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Sync user to MongoDB
      try {
        await upsertUserInDB({
          restrauntName:
            userCred.user.displayName ||
            data.email.split("@")[0],
          email: data.email,
          firebaseUid: userCred.user.uid,
          photoURL: userCred.user.photoURL || "",
        });
      } catch (dbError: any) {
        throw new Error(dbError.message || "Failed to sync user with database");
      }

      toast.success("Welcome back! 🍽️");
      setAuthCookieAndRedirect("/");
    } catch (error: any) {
      const msg =
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
          ? "Invalid email or password"
          : error.code === "auth/user-not-found"
            ? "No account found with this email"
            : error.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      // Upsert — create if new user, link UID if returning user
      try {
        await upsertUserInDB({
          restrauntName: user.displayName || user.email?.split("@")[0] || "Guest",
          email: user.email!,
          firebaseUid: user.uid,
          photoURL: user.photoURL || "",
        });
      } catch (dbError: any) {
        throw new Error(dbError.message || "Failed to sync user with database");
      }

      toast.success("Welcome back! 🍽️");
      setAuthCookieAndRedirect("/");
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden text-zinc-300">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#e8845c] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#f5c27a] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8845c] to-[#c96a41] flex items-center justify-center text-white shadow-lg shadow-[#e8845c]/30 mb-4">
            <ChefHat size={28} strokeWidth={2} />
          </div>
          <span className="font-serif text-3xl font-bold text-white tracking-wide">Saveur</span>
        </div>

        <div className="bg-[#111111] border border-zinc-800/80 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-zinc-500 text-sm">Sign in to explore our curated menu</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-zinc-800/80"></div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-zinc-800/80"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-zinc-500" size={18} />
                </div>
                <input
                  type="email"
                  placeholder="chef@example.com"
                  {...register("email", { required: "Email is required" })}
                  className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-red-500' : 'border-zinc-800'} rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-[#e8845c] transition-colors`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-zinc-500" size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                  className={`w-full bg-[#0a0a0a] border ${errors.password ? 'border-red-500' : 'border-zinc-800'} rounded-xl py-3 pl-11 pr-12 text-white placeholder-zinc-700 focus:outline-none focus:border-[#e8845c] transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#e8845c] to-[#c96a41] text-white font-bold rounded-xl shadow-lg shadow-[#e8845c]/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 mt-2 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-8">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-[#e8845c] font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
        
        <p className="text-center text-xs text-zinc-600 font-medium uppercase tracking-widest mt-8">
          Fresh ingredients • Authentic flavors
        </p>
      </div>
    </div>
  );
}
