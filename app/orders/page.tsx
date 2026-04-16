"use client";

import React, { Suspense, useContext, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import MenuContext from "@/app/context/menuContext";
import CartContext from "@/app/context/cartContext";
import Image from "next/image";

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const restrauntNameQuery = searchParams.get("restrauntName") || searchParams.get("restaurantName");

  const { setRestaurantName, menuData, menuLoading, menuIsError } = useContext(MenuContext)!;
  const cartContext = useContext(CartContext);
  
  useEffect(() => {
    if (restrauntNameQuery) {
      setRestaurantName(restrauntNameQuery);
    }
  }, [restrauntNameQuery, setRestaurantName]);

  if (!cartContext) return null;

  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = cartContext;

  const restaurant = menuData?.restaurant;
  const pColor = restaurant?.colors?.primary || "#1E1208";
  const sColor = restaurant?.colors?.secondary || "#ECE7D1";

  if (menuLoading || (!menuData && !menuIsError)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: sColor, color: pColor }}>
        <Loader2 size={32} className="animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 flex justify-center" style={{ backgroundColor: sColor, color: pColor }}>
      <div className="w-full max-w-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 p-2 -ml-2 rounded-full hover:opacity-70 transition-opacity"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span className="font-serif font-medium text-sm hidden sm:inline">Back to Menu</span>
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h1 className="font-serif text-2xl font-bold tracking-wide">My Orders</h1>
          </div>
          <div className="w-10 opacity-0" /> {/* Spacer for centering */}
        </div>

        {/* Restaurant Header */}
        {restaurant && (
          <div className="flex flex-col items-center mb-10 text-center">
            {restaurant.photoURL && (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 shadow-sm mb-3" style={{ borderColor: pColor }}>
                 <Image src={restaurant.photoURL} alt={restaurant.name} width={64} height={64} className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="font-serif text-lg font-bold opacity-80" style={{ color: pColor }}>{restaurant.name}</h2>
          </div>
        )}

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl flex flex-col items-center gap-4 shadow-sm" style={{ borderColor: pColor, backgroundColor: sColor }}>
            <ShoppingBag size={48} className="opacity-20" />
            <div className="flex flex-col gap-2">
              <p className="font-serif text-xl opacity-70">Your cart is empty</p>
              <button 
                onClick={() => router.back()}
                className="text-sm font-semibold hover:underline opacity-80"
              >
                Browse menu
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 rounded-2xl border shadow-sm" style={{ borderColor: pColor }}>
                  {item.image ? (
                     <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border" style={{ borderColor: pColor }}>
                       <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />
                     </div>
                  ) : (
                     <div className="shrink-0 w-16 h-16 rounded-xl border flex items-center justify-center opacity-30" style={{ borderColor: pColor }}>
                       <ShoppingBag size={20} />
                     </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-sm sm:text-base leading-tight mb-1 truncate">{item.name}</h3>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full border opacity-90" style={{ borderColor: pColor }}>
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-white bg-red-400 p-1.5 rounded-md hover:bg-red-500 transition-colors shadow-sm"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center gap-2 border rounded-full px-2 py-0.5 shadow-sm" style={{ borderColor: pColor }}>
                       <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-0.5 hover:scale-110 transition-transform">
                         <Minus size={12} strokeWidth={3} />
                       </button>
                       <span className="font-mono text-sm font-bold w-4 text-center">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-0.5 hover:scale-110 transition-transform">
                         <Plus size={12} strokeWidth={3} />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ornamental divider */}
            <div className="relative z-10 flex items-center justify-center opacity-20 my-2">
               <span style={{ color: pColor }} className="text-lg">--- ✦ ---</span>
            </div>

            {/* Total & Checkout */}
            <div className="border border-t-2 rounded-2xl p-6 shadow-md" style={{ borderColor: pColor }}>
              <div className="flex items-center justify-between mb-">
                <span className="font-serif text-xl font-bold opacity-80">Subtotal</span>
                <span className="font-mono text-xl font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#e8845c] animate-spin" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
