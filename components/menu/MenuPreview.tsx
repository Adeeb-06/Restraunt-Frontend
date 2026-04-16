"use client";

import React, { useContext, useEffect, useState } from "react";
import { Loader2, Utensils, Info, ChevronDown, Plus, ShoppingCart } from "lucide-react";
import MenuContext from "@/app/context/menuContext";
import CartContext from "@/app/context/cartContext";
import Image from "next/image";
import Link from "next/link";

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
  const cartContext = useContext(CartContext);
  const isLong = item.description && item.description.length > 90;
  const isAvailable = item.showInMenu !== false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartContext && isAvailable) {
      cartContext.addToCart(item);
    }
  };

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
          className="relative shrink-0 w-[88px] h-[88px] rounded-xl overflow-hidden border group/img cursor-pointer"
          style={{ borderColor: pColor, backgroundColor: sColor }}
          onClick={handleAddToCart}
        >
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isAvailable ? "group-hover/img:scale-110" : ""}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-40 transition-transform duration-500 ease-out group-hover/img:scale-110" style={{ color: pColor }}>
              <Utensils size={20} strokeWidth={1.4} />
            </div>
          )}
          {/* Add to Cart Overlay */}
          {isAvailable && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 p-1.5 rounded-full shadow-lg transform scale-90 group-hover/img:scale-100 transition-all duration-300">
                <Plus size={20} className="text-black" />
              </div>
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
          <div className="flex items-center gap-2">
            <span 
              className="shrink-0 font-mono text-[0.78rem] font-medium px-2.5 py-0.5 rounded-full border"
              style={{ color: pColor, borderColor: pColor, backgroundColor: sColor }}
            >
              ${Number(item.price).toFixed(2)}
            </span>
            {isAvailable && !showImage && (
              <button 
                onClick={handleAddToCart}
                className="p-1 rounded-full border transition-all hover:scale-110"
                style={{ color: sColor, backgroundColor: pColor, borderColor: pColor }}
                aria-label="Add to cart"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
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
  const cartContext = useContext(CartContext);
  const cartItemCount = cartContext?.cart.reduce((total, item) => total + item.quantity, 0) || 0;

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
      <div 
        className="w-full min-h-[100dvh] rounded-2xl border flex flex-col pt-12 px-6 overflow-hidden bg-gradient-to-b"
        style={{ 
          backgroundColor: '#ECE7D1', 
          borderColor: '#3E2C23',
          backgroundImage: 'linear-gradient(to bottom, #ECE7D1, #E5DCC0)',
          color: '#1E1208' 
        }}
      >
        <div className="animate-pulse flex flex-col items-center w-full max-w-2xl mx-auto">
          {/* Logo Skeleton */}
          <div className="w-[100px] h-[100px] rounded-full border-[2px] shadow-lg mb-4 flex items-center justify-center bg-black/5" style={{ borderColor: '#3E2C23' }}>
             <Utensils size={30} className="opacity-20 animate-bounce" />
          </div>
          
          {/* Title Skeleton */}
          <div className="h-8 w-48 bg-black/10 rounded-full mb-3 shrink-0"></div>
          
          {/* Badge Skeleton */}
          <div className="h-4 w-24 bg-black/10 rounded-full mb-6 shrink-0"></div>

          {/* Nav Categories Skeleton */}
          <div className="flex gap-2 mb-10 w-full justify-center">
            <div className="h-7 w-16 bg-black/10 rounded-full"></div>
            <div className="h-7 w-20 bg-black/10 rounded-full"></div>
            <div className="h-7 w-16 bg-black/10 rounded-full"></div>
          </div>

          <div className="w-full flex justify-center mb-8">
             <div className="text-xl opacity-20 tracking-wider">--- ✦ ---</div>
          </div>

          {/* Category Title */}
          <div className="h-6 w-32 bg-black/10 rounded-full mb-5"></div>

          {/* Menu Items Skeleton */}
          <div className="w-full flex gap-4 flex-col">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl border flex-col sm:flex-row shadow-sm" style={{ borderColor: '#3E2C23', backgroundColor: 'rgba(255,255,255,0.4)' }}>
                {/* Image Skeleton */}
                <div className="w-full sm:w-[88px] h-32 sm:h-[88px] rounded-xl bg-black/10 shrink-0"></div>
                {/* Text Skeleton */}
                <div className="flex-1 flex flex-col gap-3 py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="h-5 w-3/4 bg-black/10 rounded"></div>
                    <div className="h-5 w-12 bg-black/10 rounded-full shrink-0"></div>
                  </div>
                  <div className="h-3 w-full bg-black/5 rounded"></div>
                  <div className="h-3 w-4/5 bg-black/5 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

      {/* Floating View Cart / Orders Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 w-full max-w-2xl mx-auto left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
          <Link
            href={`/orders?restrauntName=${encodeURIComponent(restaurantName || "")}`}
            className="pointer-events-auto flex items-center justify-between gap-4 py-3.5 px-6 rounded-full shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full md:w-auto"
            style={{ backgroundColor: pColor, color: sColor, border: `1px solid ${sColor}` }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[0.6rem] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              </div>
              <span className="font-serif font-bold text-sm tracking-wide">My Orders</span>
            </div>
            
            <span className="font-mono font-medium text-sm">
              ${cartContext?.totalPrice.toFixed(2)}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
