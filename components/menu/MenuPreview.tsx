"use client";

import React, { useContext, useEffect, useState } from "react";
import { Loader2, Utensils, Info, ChevronDown } from "lucide-react";
import MenuContext from "@/app/context/menuContext";
import Image from "next/image";

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
    colors?: { primary: string; secondary: string };
  };
  menu: MenuCategory[];
}

interface MenuPreviewProps {
  restaurantName: string | null;
}

function MenuItem({
  item,
  showImage = true,
  pColor,
  sColor,
}: {
  item: Item;
  showImage?: boolean;
  pColor: string;
  sColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.description && item.description.length > 90;
  const isAvailable = item.showInMenu !== false;

  return (
    <div
      className="relative group flex gap-4 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-px shadow-sm hover:shadow-md"
      style={{
        backgroundColor: sColor,
        borderColor: pColor,
        opacity: isAvailable ? 1 : 0.6,
      }}
    >
      {/* ── Not Available Overlay ── */}
      {!isAvailable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div 
            className="px-4 py-1.5 rounded-full border shadow-sm transform -rotate-2 scale-105 backdrop-blur-[1px]"
            style={{ backgroundColor: sColor, borderColor: pColor }}
          >
            <span className="font-serif italic font-bold text-[0.85rem] tracking-wide" style={{ color: pColor }}>
              Not Available
            </span>
          </div>
        </div>
      )}

      {/* Image */}
      {showImage && (
        <div 
          className="relative shrink-0 w-[88px] h-[88px] rounded-xl overflow-hidden border"
          style={{ borderColor: pColor, backgroundColor: sColor }}
        >
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isAvailable ? "group-hover:scale-105" : ""}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-40" style={{ color: pColor }}>
              <Utensils size={20} strokeWidth={1.4} />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5 py-0.5">
        {/* Name + Price row */}
        <div className="flex items-start justify-between gap-3">
          <h3 
            className="font-serif font-semibold text-[0.95rem] leading-snug tracking-[0.01em]"
            style={{ color: pColor }}
          >
            {item.name}
          </h3>
          <span 
            className="shrink-0 font-mono text-[0.78rem] font-medium px-2.5 py-0.5 rounded-full border"
            style={{ color: pColor, borderColor: pColor, backgroundColor: sColor }}
          >
            ${Number(item.price).toFixed(2)}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <div className="flex flex-col gap-0.5">
            <p
              className={`text-[0.8rem] leading-[1.75] transition-all duration-300 opacity-80 ${
                !expanded && isLong ? "line-clamp-2" : ""
              }`}
              style={{ color: pColor }}
            >
              {item.description}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="self-start flex items-center gap-0.5 text-[0.72rem] italic hover:underline transition-colors opacity-80"
                style={{ color: pColor }}
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
      <div className="w-full min-h-[50vh] rounded-2xl border flex flex-col items-center justify-center gap-3 p-8 text-center" style={{ backgroundColor: '#ECE7D1', borderColor: '#3E2C23', color: '#1E1208' }}>
        <Utensils size={36} strokeWidth={1.2} className="opacity-35" />
        <h1 className="font-serif text-2xl font-bold">Welcome</h1>
        <p className="text-sm leading-relaxed opacity-60 max-w-xs">
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
      <div className="w-full min-h-[50vh] rounded-2xl border flex flex-col items-center justify-center gap-3 p-8 text-center" style={{ backgroundColor: '#ECE7D1', borderColor: '#3E2C23', color: '#1E1208' }}>
        <div className="w-14 h-14 rounded-full border flex items-center justify-center opacity-60" style={{ borderColor: '#3E2C23' }}>
          <Info size={22} strokeWidth={1.4} />
        </div>
        <h1 className="font-serif text-2xl font-bold">Not Found</h1>
        <p className="text-sm leading-relaxed opacity-60 max-w-xs">
          {errorMsg}
        </p>
      </div>
    );
  }

  /* ── Loading ── */
  if (menuLoading || !menuData) {
    return (
      <div className="w-full min-h-[50vh] rounded-2xl border flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#ECE7D1', borderColor: '#3E2C23', color: '#1E1208' }}>
        <Loader2
          size={28}
          strokeWidth={1.5}
          className="animate-spin opacity-50"
        />
        <p className="text-sm italic opacity-50 animate-pulse">Loading menu…</p>
      </div>
    );
  }

  const { restaurant, menu } = menuData;
  const filledCats = menu.filter((c: MenuCategory) => c.items.length > 0);
  
  const pColor = restaurant.colors?.primary || "#1E1208";
  const sColor = restaurant.colors?.secondary || "#ECE7D1";

  return (
    <div
      className="relative w-full rounded-2xl border shadow-xl overflow-hidden overflow-y-auto"
      style={{ backgroundColor: sColor, color: pColor, borderColor: pColor, scrollBehavior: 'smooth' }}
    >
      {/* ── Header ── */}
      <header className="relative z-10 flex flex-col items-center text-center pt-12 pb-7 px-6 gap-2.5">
        {/* Logo */}
        <div className="relative mb-2">
          <div className="relative z-10 w-[100px] h-[100px] rounded-full overflow-hidden border-[2px] shadow-lg" style={{ borderColor: pColor, backgroundColor: sColor }}>
            {restaurant.photoURL ? (
              <Image
                src={restaurant.photoURL}
                alt={`${restaurant.name} logo`}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-40" style={{ color: pColor }}>
                <Utensils size={30} strokeWidth={1.3} />
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1
          className="font-serif font-bold text-[clamp(1.75rem,5vw,2.5rem)] leading-tight tracking-wide"
          style={{ color: pColor }}
        >
          {restaurant.name}
        </h1>

        {/* Live badge */}
        <div
          className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.13em]"
          style={{ color: pColor }}
        >
          <span
            className="w-[7px] h-[7px] rounded-full animate-pulse"
            style={{ backgroundColor: pColor }}
          />
          Live Menu
        </div>

        {/* Category nav */}
        {filledCats.length > 1 && (
          <nav className="flex flex-wrap justify-center gap-2 mt-4 w-full max-w-sm">
            {filledCats.map((cat: MenuCategory, idx: number) => (
              <a
                key={idx}
                href={`#cat-${idx}`}
                className="px-4 py-1.5 rounded-full border text-[0.75rem] font-bold whitespace-nowrap transition-all duration-200"
                style={{ 
                  color: pColor, 
                  borderColor: pColor,
                  backgroundColor: sColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = pColor;
                  e.currentTarget.style.color = sColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = sColor;
                  e.currentTarget.style.color = pColor;
                }}
              >
                {cat.category}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Ornamental divider */}
      <div className="relative z-10 flex items-center justify-center opacity-30 px-8 mb-4">
         <span style={{ color: pColor }} className="text-xl">--- ✦ ---</span>
      </div>

      {/* ── Menu sections ── */}
      <main className="relative z-10 px-4 sm:px-6 max-w-2xl mx-auto pt-4 pb-14 flex flex-col gap-12">
        {filledCats.length === 0 ? (
          <p className="text-center py-16 italic text-sm opacity-50" style={{ color: pColor }}>
            Menu is currently empty. Check back soon!
          </p>
        ) : (
          filledCats.map((cat: MenuCategory, catIdx: number) => (
            <section key={catIdx} id={`cat-${catIdx}`} className="scroll-mt-4">
              {/* Category heading */}
              <div className="flex items-center justify-center gap-3 mb-5 opacity-80" style={{ color: pColor }}>
                <span className="text-[0.48rem] leading-none">
                  ✦
                </span>
                <h2
                  className="font-serif text-xl md:text-[1.35rem] font-bold italic tracking-wide"
                >
                  {cat.category}
                </h2>
                <span className="text-[0.48rem] leading-none">
                  ✦
                </span>
              </div>

              {/* Items list */}
              <div className="flex flex-col gap-3">
                {cat.items.map((item, itemIdx) => (
                  <MenuItem
                    key={itemIdx}
                    item={item}
                    showImage={restaurant.itemImageEnabled ?? true}
                    pColor={pColor}
                    sColor={sColor}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-center pb-8 max-w-sm mx-auto opacity-50" style={{ color: pColor }}>
        <span className="font-serif italic text-[0.72rem] whitespace-nowrap tracking-wider">
          — {restaurant.name} —
        </span>
      </footer>
    </div>
  );
}
