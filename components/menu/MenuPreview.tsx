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
      className="relative group flex gap-4 p-4 md:p-5 rounded-3xl border transition-all duration-500 hover:-translate-y-1.5 shadow-sm hover:shadow-2xl overflow-hidden backdrop-blur-md"
      style={{
        backgroundColor: `${sColor}E6`, // 90% opacity for slight transparency
        borderColor: `${pColor}20`,
        boxShadow: `0 4px 20px ${pColor}08`,
        opacity: isAvailable ? 1 : 0.65,
      }}
      onMouseEnter={(e) => {
        if(isAvailable) {
          e.currentTarget.style.boxShadow = `0 12px 30px ${pColor}20`;
          e.currentTarget.style.borderColor = `${pColor}50`;
        }
      }}
      onMouseLeave={(e) => {
        if(isAvailable) {
          e.currentTarget.style.boxShadow = `0 4px 20px ${pColor}08`;
          e.currentTarget.style.borderColor = `${pColor}20`;
        }
      }}
    >
      {/* Decorative gradient overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${pColor}10 0%, transparent 50%)`
        }}
      />

      {/* ── Not Available Overlay ── */}
      {!isAvailable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div 
            className="px-5 py-2 rounded-full border shadow-xl transform -rotate-3 scale-110 backdrop-blur-sm"
            style={{ backgroundColor: sColor, borderColor: pColor }}
          >
            <span className="font-serif italic font-bold text-[0.95rem] tracking-wide" style={{ color: pColor }}>
              Not Available
            </span>
          </div>
        </div>
      )}

      {/* Image */}
      {showImage && (
        <div 
          className="relative shrink-0 w-[96px] h-[96px] md:w-[112px] md:h-[112px] rounded-2xl overflow-hidden border group/img cursor-pointer shadow-inner"
          style={{ borderColor: `${pColor}30`, backgroundColor: sColor }}
          onClick={handleAddToCart}
        >
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isAvailable ? "group-hover/img:scale-110" : ""}`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-40 transition-transform duration-700 ease-out group-hover/img:scale-110" style={{ color: pColor }}>
              <Utensils size={24} strokeWidth={1.2} />
            </div>
          )}
          {/* Add to Cart Overlay */}
          {isAvailable && (
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
              <div className="bg-white/95 p-2 rounded-full shadow-2xl transform scale-75 group-hover/img:scale-100 transition-all duration-300">
                <Plus size={22} className="text-black" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2 py-1 z-10 relative">
        {/* Name + Price row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
          <h3 
            className="font-serif font-bold text-[1.1rem] leading-snug tracking-wide group-hover:text-opacity-80 transition-colors wrap-break-word"
            style={{ color: pColor }}
          >
            {item.name}
          </h3>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span 
              className="shrink-0 font-mono text-[0.85rem] font-bold px-3 py-1 rounded-full border shadow-sm"
              style={{ color: sColor, borderColor: pColor, backgroundColor: pColor }}
            >
              ${Number(item.price).toFixed(2)}
            </span>
            {isAvailable && (
              <button 
                onClick={handleAddToCart}
                className="p-1.5 rounded-full border transition-all transform hover:scale-110 hover:rotate-90 active:scale-95 shadow-md"
                style={{ color: pColor, backgroundColor: sColor, borderColor: `${pColor}40` }}
                aria-label="Add to cart"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div className="flex flex-col gap-1 mt-0.5">
            <p
              className={`text-[0.85rem] leading-[1.6] transition-all duration-300 opacity-75 font-sans ${
                !expanded && isLong ? "line-clamp-2" : ""
              }`}
              style={{ color: pColor }}
            >
              {item.description}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="self-start flex items-center gap-1 text-[0.75rem] font-medium hover:underline transition-colors opacity-70 mt-1"
                style={{ color: pColor }}
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
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
      className="relative w-full rounded-[2rem] border shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden overflow-y-auto isolate"
      style={{ backgroundColor: sColor, color: pColor, borderColor: `${pColor}20`, scrollBehavior: 'smooth' }}
    >
      {/* Artistic Dynamic Backgrounds */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] opacity-[0.04] pointer-events-none rounded-full blur-[80px]"
        style={{ backgroundColor: pColor }}
      />
      <div 
        className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] opacity-[0.03] pointer-events-none rounded-full blur-[100px]"
        style={{ backgroundColor: pColor }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex flex-col items-center text-center pt-16 pb-10 px-6 gap-3">
        {/* Logo */}
        <div className="relative mb-4 group">
          <div 
            className="absolute -inset-6 opacity-10 group-hover:opacity-30 transition-opacity duration-700 blur-2xl rounded-full"
            style={{ backgroundColor: pColor }}
          />
          <div 
            className="relative z-10 w-[110px] h-[110px] sm:w-[120px] sm:h-[120px] rounded-full overflow-hidden border-[3px] shadow-2xl transform transition-transform duration-500 group-hover:scale-105" 
            style={{ borderColor: `${pColor}80`, backgroundColor: sColor }}
          >
            {restaurant.photoURL ? (
              <Image
                src={restaurant.photoURL}
                alt={`${restaurant.name} logo`}
                className="w-full h-full object-cover"
                width={120}
                height={120}
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
          className="font-serif font-black text-[clamp(1.75rem,8vw,3rem)] leading-tight tracking-wider uppercase break-words px-2 w-full max-w-[90vw]"
          style={{ color: pColor, textShadow: `0 4px 20px ${pColor}20` }}
        >
          {restaurant.name}
        </h1>

        {/* Live badge */}
        <div
          className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] font-semibold mt-1"
          style={{ color: pColor }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse shadow-sm"
            style={{ backgroundColor: pColor, boxShadow: `0 0 10px ${pColor}` }}
          />
          Live Menu
        </div>

        {/* Category nav */}
        {filledCats.length > 1 && (
          <nav className="flex flex-wrap justify-center gap-2.5 mt-6 w-full max-w-lg">
            {filledCats.map((cat: MenuCategory, idx: number) => (
              <a
                key={idx}
                href={`#cat-${idx}`}
                className="px-5 py-2 rounded-full border text-[0.8rem] font-bold whitespace-nowrap transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                style={{ 
                  color: pColor, 
                  borderColor: `${pColor}40`,
                  backgroundColor: `${sColor}E6`,
                  backdropFilter: 'blur(4px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = pColor;
                  e.currentTarget.style.color = sColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${sColor}E6`;
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
      <div className="relative z-10 flex items-center justify-center opacity-40 px-8 mb-8 pb-4">
         <span style={{ color: pColor }} className="text-2xl font-light tracking-[0.5em]">◇ ◈ ◇</span>
      </div>

      {/* ── Menu sections ── */}
      <main className="relative z-10 px-4 sm:px-6 max-w-2xl mx-auto pt-4 pb-14 flex flex-col gap-12">
        {filledCats.length === 0 ? (
          <p className="text-center py-16 italic text-sm opacity-50" style={{ color: pColor }}>
            Menu is currently empty. Check back soon!
          </p>
        ) : (
          filledCats.map((cat: MenuCategory, catIdx: number) => (
            <section key={catIdx} id={`cat-${catIdx}`} className="scroll-mt-6">
              {/* Category heading */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8" style={{ color: pColor }}>
                <div className="h-[2px] w-6 sm:w-12 rounded-full opacity-30 shrink-0" style={{ backgroundColor: pColor }} />
                <h2
                  className="font-serif text-xl sm:text-2xl md:text-[1.85rem] font-black tracking-widest uppercase text-center break-words max-w-[65%]"
                  style={{ textShadow: `0 2px 10px ${pColor}10` }}
                >
                  {cat.category}
                </h2>
                <div className="h-[2px] w-6 sm:w-12 rounded-full opacity-30 shrink-0" style={{ backgroundColor: pColor }} />
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
        <div className="fixed bottom-6 w-full max-w-2xl mx-auto left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
          <Link
            href={`/orders?restrauntName=${encodeURIComponent(restaurantName || "")}`}
            className="pointer-events-auto relative overflow-hidden group flex items-center justify-between gap-4 py-4 px-8 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 transition-all duration-500 w-full md:w-auto"
            style={{ backgroundColor: pColor, color: sColor, border: `2px solid ${sColor}40` }}
          >
             {/* Hover shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1000 ease-in-out" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-[0.65rem] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-[transparent]" style={{ borderColor: pColor }}>
                  {cartItemCount}
                </span>
              </div>
              <span className="font-serif font-bold text-[0.95rem] tracking-wider uppercase">My Orders</span>
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
