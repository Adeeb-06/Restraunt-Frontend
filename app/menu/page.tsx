import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import MenuPreview from "@/components/menu/MenuPreview";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate dynamic SEO metadata matching the specific restaurant being viewed
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const name = resolvedParams.restrauntName || resolvedParams.restaurantName;
  const rawRestaurantName = typeof name === 'string' ? decodeURIComponent(name) : null;
  const restaurantName = rawRestaurantName ? rawRestaurantName : 'Restaurant';

  return {
    title: `${restaurantName.toUpperCase()} | Menu - Scanly`,
    description: `Browse the official digital menu for ${restaurantName}. Featuring live updates, prices, descriptions, and easy online ordering. Powered by Scanly.`,
    openGraph: {
      title: `${restaurantName.toUpperCase()} | Menu - Scanly`,
      description: `View the delicious digital menu for ${restaurantName}.`,
      siteName: "Scanly",
    },
    twitter: {
      card: "summary_large_image",
      title: `${restaurantName} | Live Menu`,
      description: `View the digital menu for ${restaurantName}.`,
    },
  };
}

export default async function PublicMenuPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const name = resolvedParams.restrauntName || resolvedParams.restaurantName;
  const restaurantName = typeof name === 'string' ? decodeURIComponent(name) : null;

  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#e8845c] animate-spin" />
        </div>
      }>
        <MenuPreview restaurantName={restaurantName} />
      </Suspense>
    </div>
  );
}
