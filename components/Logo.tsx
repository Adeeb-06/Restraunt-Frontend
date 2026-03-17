"use client";
import React from "react";
import { ChefHat } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="bg-primary text-secondary p-1.5 rounded-lg shadow-lg shadow-primary/20">
        <ChefHat size={22} strokeWidth={2.2} />
      </div>
      <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        Saveur
      </span>
    </div>
  );
}
