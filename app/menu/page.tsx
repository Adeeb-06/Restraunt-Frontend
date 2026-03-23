"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import MenuPreview from "@/components/menu/MenuPreview";

function MenuContent() {
  const searchParams = useSearchParams();
  const restrauntNameQuery = searchParams.get("restrauntName") || searchParams.get("restaurantName");

  return (
    <div className="min-h-screen bg-[#0A0A0A] md:p-8 p-0">
        <MenuPreview restaurantName={restrauntNameQuery} />
    </div>
  );
}

// Wrapper to provide Suspense boundary for useSearchParams
export default function PublicMenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#e8845c] animate-spin" />
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
