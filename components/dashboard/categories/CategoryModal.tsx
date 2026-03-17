import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { isAxiosError } from "axios";

interface CategoryFormValues {
  name: string;
  description: string;
  isActive: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  refetchCategories: () => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  refetchCategories,
}: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const res = await api.post("/api/categories", data);

      if (res.status === 201 || res.status === 200) {
        toast.success("Category created successfully!");
        onSuccess();
        refetchCategories();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to create category");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />
      <div className="relative bg-[#0A0A0A] border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-white mb-6">Create New Category</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Appetizers"
              {...register("name", { required: "Name is required" })}
              className={`w-full bg-[#111111] border ${
                errors.name ? "border-red-500" : "border-zinc-800"
              } rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8845c] transition-colors`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </span>
            )}
          </div>
         
          <div className="flex items-center gap-3 py-2">
            <label className="text-sm font-medium text-zinc-400 select-none cursor-pointer flex items-center gap-3">
              <input
                type="checkbox"
                {...register("isActive")}
                className="w-5 h-5 rounded bg-zinc-900 border-zinc-700 text-[#e8845c] focus:ring-[#e8845c] focus:ring-offset-zinc-900"
              />
              Visible to customers
            </label>
          </div>
          <div className="flex gap-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => onClose()}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#e8845c] to-[#c96a41] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Save Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
