"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { Edit, Trash, Plus, Tag, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { Category } from "@/lib/api"; // Importing type
import CategoryModal from "@/components/dashboard/categories/CategoryModal";

export default function CategoriesPage() {
  const { firebaseUser, dbUser } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: categories = [],
    isLoading,
    error,
    refetch: refetchCategories,
  } = useQuery({
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
        await api.delete(`/api/categories/${id}`);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Category deleted successfully!");
      } catch (err: any) {
        toast.error(
          err.response?.data?.error ||
            err.message ||
            "Failed to delete category",
        );
      }
    }
  };

  if (dbUser?.role !== "owner") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-zinc-400">
        <AlertCircle size={48} className="mb-4 text-red-500" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p>You need Owner permissions to manage Categories.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">
            Menu Categories
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Manage food and beverage groups for your menu.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e8845c] to-[#c96a41] text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-[#e8845c]/20"
        >
          <Plus size={18} />
          New Category
        </button>
      </div>

      {/* List / Table */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-[#e8845c] animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle />
          <span>Failed to load categories. Please try again later.</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[#111111] border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center text-zinc-500 mb-4">
            <Tag size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No Categories Yet
          </h3>
          <p className="text-zinc-500 mb-6 max-w-sm">
            Create your first category (like "Appetizers" or "Beverages") to
            start organizing your menu.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="bg-[#111111] border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/50">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Category Name
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Items Count
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Status
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat: Category) => (
                  <tr
                    key={cat._id}
                    className="border-b border-zinc-800/50 hover:bg-[#161616]/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#e8845c]/10 text-[#e8845c] flex items-center justify-center">
                          <Tag size={16} />
                        </div>
                        <span className="font-bold text-white">{cat.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-400 max-w-[200px] truncate">
                      {cat.items?.length || 0}
                    </td>
                    <td className="p-4">
                      {cat.isActive ? (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-bold rounded-full">
                          HIDDEN
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          onClick={() => handleDelete(cat._id, cat.name)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal Component */}
      <CategoryModal
        isOpen={isModalOpen}
        refetchCategories={refetchCategories}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
