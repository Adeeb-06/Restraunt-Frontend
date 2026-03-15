"use client";
import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ChefHat } from "lucide-react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setAuthCookieAndRedirect } from "@/lib/auth";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
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
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCred.user, { displayName: data.username });
      toast.success("Account created! Welcome aboard 🎉");
      setAuthCookieAndRedirect("/");
    } catch (error: any) {
      const msg =
        error.code === "auth/email-already-in-use"
          ? "This email is already registered"
          : error.code === "auth/weak-password"
            ? "Password is too weak (min 6 characters)"
            : "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Account created! Welcome aboard 🎉");
      setAuthCookieAndRedirect("/");
    } catch (error: any) {
      toast.error("Google sign-up failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-container">
        {/* Brand / Logo */}
        <div className="auth-brand">
          <div className="brand-icon">
            <ChefHat size={28} strokeWidth={1.8} />
          </div>
          <span className="brand-name">Saveur</span>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">
              Join us and discover exquisite flavors
            </p>
          </div>

          {/* Google Button */}
          <button
            id="google-register-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="google-btn"
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <div className="divider-line" />
            <span className="divider-text">or continue with email</span>
            <div className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="register-name" className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  id="register-name"
                  type="text"
                  placeholder="Gordon Ramsay"
                  {...register("username", { required: "Name is required" })}
                  className={`form-input ${errors.username ? "input-error" : ""}`}
                />
              </div>
              {errors.username && (
                <span className="error-msg">{errors.username.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="register-email" className="form-label">Email address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="register-email"
                  type="email"
                  placeholder="chef@example.com"
                  {...register("email", { required: "Email is required" })}
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                />
              </div>
              {errors.email && (
                <span className="error-msg">{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="register-password" className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  className={`form-input ${errors.password ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-msg">{errors.password.message}</span>
              )}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link href="/auth/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>

        <p className="auth-tagline">
          🍴 Fresh ingredients, authentic flavors, unforgettable dining.
        </p>
      </div>
    </div>
  );
}
