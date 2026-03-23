"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { Plus, Utensils, Loader2, AlertCircle, Search } from "lucide-react";
import { toast } from "react-toastify";
import MenuItemCard from "@/components/dashboard/menu/MenuItemCard";
import MenuItemModal from "@/components/dashboard/menu/MenuItemModal";
import api from "@/lib/axios";
import { Item, Category } from "@/lib/api"; // Types
import { updateUserSettingsInDB } from "@/lib/userService";
import { getIdToken } from "firebase/auth";

export default function MenuItemsPage() {
  const { firebaseUser, dbUser, setDbUser } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdatingSetting, setIsUpdatingSetting] = useState(false);

  const toggleImageRequired = async () => {
    if (!firebaseUser || !dbUser) return;
    setIsUpdatingSetting(true);
    try {
      const token = await getIdToken(firebaseUser);
      const newSetting = !(dbUser.itemImageEnabled ?? true);
      const res = await updateUserSettingsInDB(dbUser.email, token, { itemImageEnabled: newSetting });
      setDbUser(res.user);
      toast.success(newSetting ? "Item images are now required." : "Item images are now optional/hidden.");
    } catch (err: any) {
      toast.error("Failed to update setting");
    } finally {
      setIsUpdatingSetting(false);
    }
  };

  // Queries
  const { data: items = [], isLoading: itemsLoading , refetch: refetchItems } = useQuery({
    queryKey: ["items", searchTerm],
    queryFn: async () => {
      if (!firebaseUser) return [];
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }
      const { data } = await api.get(`/api/items?${queryParams.toString()}`);
      return data;
    },
    enabled: !!firebaseUser,
  });

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!firebaseUser) return [];
      const { data } = await api.get("/api/categories");
      return data;
    },
    enabled: !!firebaseUser,
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await api.delete(`/api/items/${id}`);
        queryClient.invalidateQueries({ queryKey: ["items"] });
        toast.success("Item deleted successfully!");
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || err.message || "Failed to delete item",
        );
      }
    }
  };

  if (dbUser?.role !== "owner") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-400">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p>You need Owner permissions to manage Menu Items.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">
            Menu Editor
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Add, edit, and organize the dishes displayed on your restaurant's
            digital menu.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-sm text-zinc-400 font-medium">Image in Menu:</span>
            <button
              onClick={toggleImageRequired}
              disabled={isUpdatingSetting}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                (dbUser?.itemImageEnabled ?? true) ? "bg-[#e8845c]" : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  (dbUser?.itemImageEnabled ?? true) ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="relative flex-1 sm:flex-none">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-[#111111] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8845c] transition-colors"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e8845c] to-[#c96a41] text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-[#e8845c]/20"
          >
            <Plus size={18} />
            New Dish
          </button>
        </div>
      </div>

      {/* List / Grid */}
      {itemsLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#e8845c] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-500 mb-4">
            <Utensils size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Items Yet</h3>
          <p className="text-zinc-500 mb-6 max-w-sm">
            Start building your menu by adding dishes with their descriptions
            and prices.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
          >
            Add First Dish
          </button>
        </div>
      ) : (
        <div className="bg-[#111111] border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/50">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Dish Name</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hidden md:table-cell">Description</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Price</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: Item) => (
                  <MenuItemCard key={item._id} item={item} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal Component */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        isCategoriesLoading={catLoading}
        onSuccess={() => {
          refetchItems();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
