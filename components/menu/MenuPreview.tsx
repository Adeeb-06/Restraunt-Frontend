"use client";

import React, { useContext, useEffect, useState } from "react";
import { Loader2, Utensils, Info, ChevronDown } from "lucide-react";
import MenuContext from "@/app/context/menuContext";

interface Item {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  showInMenu?: boolean;
}

interface MenuCategory {
  category: string;
  items: Item[];
}

interface RestaurantMenuData {
  restaurant: {
    name: string;
    photoURL?: string;
    itemImageEnabled?: boolean;
  };
  menu: MenuCategory[];
}

interface MenuPreviewProps {
  restaurantName: string | null;
}

function MenuItem({ item, showImage = true }: { item: Item, showImage?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.description && item.description.length > 90;
  const isAvailable = item.showInMenu !== false;

  return (
    <div className={`relative group flex gap-4 p-4 rounded-2xl border transition-all duration-200 ${
      isAvailable 
        ? "border-[#3E2C23]/15 bg-[#FAF8F2] hover:border-[#3E2C23]/35 hover:shadow-[0_6px_28px_rgba(62,44,35,0.10)] hover:-translate-y-px" 
        : "border-[#3E2C23]/5 bg-[#FAF8F2]/60 opacity-70 grayscale-[40%]"
    }`}>
      
      {/* ── Not Available Overlay ── */}
      {!isAvailable && (
        <div className="absolute inset-0 z-10 bg-[#FAF8F2]/30 backdrop-blur-[0.5px] rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="bg-[#FAF8F2]/95 px-4 py-1.5 rounded-full border border-[#3E2C23]/15 shadow-sm transform -rotate-2 scale-105">
             <span className="font-serif italic font-bold text-[#3E2C23]/80 text-[0.85rem] tracking-wide">
               Not Available
             </span>
          </div>
        </div>
      )}

      {/* Image */}
      {showImage && (
        <div className="relative shrink-0 w-[88px] h-[88px] rounded-xl overflow-hidden border border-[#3E2C23]/10 bg-[#EDE8D8]">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isAvailable ? "group-hover:scale-105" : ""}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#3E2C23]/30">
              <Utensils size={20} strokeWidth={1.4} />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 min-w-0 flex flex-col gap-1.5 py-0.5 ${!isAvailable ? "opacity-80" : ""}`}>
        {/* Name + Price row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif font-semibold text-[0.95rem] text-[#1E1208] leading-snug tracking-[0.01em]">
            {item.name}
          </h3>
          <span className="shrink-0 font-mono text-[0.78rem] font-medium text-[#3E2C23] px-2.5 py-0.5 rounded-full border border-[#3E2C23]/20 bg-[#3E2C23]/[0.05]">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <div className="flex flex-col gap-0.5">
            <p
              className={`text-[0.8rem] leading-[1.75] text-[#2B1D14]/60 transition-all duration-300 ${
                !expanded && isLong ? "line-clamp-2" : ""
              }`}
            >
              {item.description}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="self-start flex items-center gap-0.5 text-[0.72rem] italic text-[#8B6347] hover:text-[#5c3d25] hover:underline transition-colors"
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    expanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuPreview({ restaurantName }: MenuPreviewProps) {
  const { setRestaurantName, menuData, menuLoading, menuIsError, menuError } =
    useContext(MenuContext)!;

  useEffect(() => {
    if (restaurantName) setRestaurantName(restaurantName);
  }, [restaurantName, setRestaurantName]);

  /* ── No restaurant ── */
  if (!restaurantName) {
    return (
      <div className="w-full min-h-[50vh] bg-[#ECE7D1] rounded-2xl border border-[#3E2C23]/20 flex flex-col items-center justify-center gap-3 p-8 text-center text-[#3E2C23]">
        <Utensils size={36} strokeWidth={1.2} className="opacity-35" />
        <h1 className="font-serif text-2xl font-bold text-[#1E1208]">
          Welcome
        </h1>
        <p className="text-sm leading-relaxed text-[#3E2C23]/55 max-w-xs">
          Please configure your restaurant name or access a valid link.
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (menuIsError) {
    const errorMsg =
      (menuError as any)?.response?.data?.error ||
      "We couldn't find a menu to preview.";
    return (
      <div className="w-full min-h-[50vh] bg-[#ECE7D1] rounded-2xl border border-[#3E2C23]/20 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="w-14 h-14 rounded-full border border-[#3E2C23]/25 flex items-center justify-center text-[#3E2C23]/50">
          <Info size={22} strokeWidth={1.4} />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#1E1208]">
          Not Found
        </h1>
        <p className="text-sm leading-relaxed text-[#3E2C23]/55 max-w-xs">
          {errorMsg}
        </p>
      </div>
    );
  }

  /* ── Loading ── */
  if (menuLoading || !menuData) {
    return (
      <div className="w-full min-h-[50vh] bg-[#ECE7D1] rounded-2xl border border-[#3E2C23]/20 flex flex-col items-center justify-center gap-3">
        <Loader2
          size={28}
          strokeWidth={1.5}
          className="animate-spin text-[#3E2C23]/50"
        />
        <p className="text-sm italic text-[#3E2C23]/50 animate-pulse">
          Loading menu…
        </p>
      </div>
    );
  }

  const { restaurant, menu } = menuData;
  const filledCats = menu.filter((c: MenuCategory) => c.items.length > 0);

  return (
    <div className="relative w-full bg-[#ECE7D1] text-[#2B1D14] rounded-2xl border border-[#3E2C23]/20 shadow-xl overflow-hidden overflow-y-auto">

      {/* Top vignette */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#3E2C23]/[0.07] to-transparent pointer-events-none z-0" />

      {/* ── Header ── */}
      <header className="relative z-10 flex flex-col items-center text-center pt-10 pb-7 px-6 gap-2.5">

        {/* Logo */}
        <div className="relative mb-1">
          <div className="absolute inset-0 rounded-full bg-[#3E2C23]/10 blur-2xl scale-110" />
          <div className="relative z-10 w-[90px] h-[90px] rounded-full overflow-hidden border-[1.5px] border-[#3E2C23]/28 bg-[#E2DAC6] shadow-[0_4px_20px_rgba(62,44,35,0.12)]">
            {restaurant.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={restaurant.photoURL}
                alt={`${restaurant.name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#3E2C23]/32">
                <Utensils size={26} strokeWidth={1.3} />
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1 className="font-serif font-bold text-[clamp(1.75rem,5vw,2.5rem)] leading-tight tracking-wide text-[#1E1208]">
          {restaurant.name}
        </h1>

        {/* Live badge */}
        <div className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.13em] text-[#3E2C23]/48">
          <span className="w-[7px] h-[7px] rounded-full bg-[#8B6347] animate-pulse" />
          Live Menu
        </div>

        {/* Category nav */}
        {filledCats.length > 1 && (
          <nav className="flex flex-wrap justify-center gap-2 mt-2 w-full max-w-sm">
            {filledCats.map((cat: MenuCategory, idx: number) => (
              <a
                key={idx}
                href={`#cat-${idx}`}
                className="px-4 py-1.5 rounded-full border border-[#3E2C23]/22 bg-[#3E2C23]/[0.04] text-[0.75rem] text-[#3E2C23] whitespace-nowrap hover:bg-[#3E2C23] hover:text-[#ECE7D1] hover:border-[#3E2C23] hover:shadow-[0_4px_14px_rgba(62,44,35,0.17)] transition-all duration-200"
              >
                {cat.category}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Ornamental divider */}
      <div className="relative z-10 flex items-center gap-3 px-8 mb-1">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3E2C23]/22 to-transparent" />
        <span className="text-[#3E2C23]/28 text-[0.48rem] leading-none">✦</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3E2C23]/22 to-transparent" />
      </div>

      {/* ── Menu sections ── */}
      <main className="relative z-10 px-4 sm:px-6 max-w-2xl mx-auto pt-8 pb-14 flex flex-col gap-12">
        {filledCats.length === 0 ? (
          <p className="text-center py-16 italic text-sm text-[#3E2C23]/40">
            Menu is currently empty. Check back soon!
          </p>
        ) : (
          filledCats.map((cat: MenuCategory, catIdx: number) => (
            <section
              key={catIdx}
              id={`cat-${catIdx}`}
              className="scroll-mt-4"
            >
              {/* Category heading */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="text-[#3E2C23]/28 text-[0.48rem] leading-none">✦</span>
                <h2 className="font-serif text-xl md:text-[1.35rem] font-semibold italic tracking-wide text-[#2B1D14]">
                  {cat.category}
                </h2>
                <span className="text-[#3E2C23]/28 text-[0.48rem] leading-none">✦</span>
              </div>

              {/* Items list */}
              <div className="flex flex-col gap-3">
                {cat.items.map((item, itemIdx) => (
                  <MenuItem key={itemIdx} item={item} showImage={restaurant.itemImageEnabled ?? true} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center gap-4 px-10 pb-8 max-w-sm mx-auto">
        <div className="flex-1 h-px bg-[#3E2C23]/15" />
        <span className="font-serif italic text-[0.72rem] text-[#3E2C23]/35 whitespace-nowrap tracking-wider">
          — {restaurant.name} —
        </span>
        <div className="flex-1 h-px bg-[#3E2C23]/15" />
      </footer>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}