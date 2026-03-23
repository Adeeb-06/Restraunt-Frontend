import React, { useState, useRef, useEffect, useContext } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Category } from "@/lib/api";
import MenuContext from "@/app/context/menuContext";
import { useAuth } from "@/providers/FirebaseAuthProvider";

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  isCategoriesLoading: boolean;
  onSuccess: () => void;
}

interface ItemFormValues {
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
}

export default function MenuItemModal({
  isOpen,
  onClose,
  categories,
  isCategoriesLoading,
  onSuccess,
}: MenuItemModalProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {refetchMenu} = useContext(MenuContext)!
  const { dbUser } = useAuth();
  const isImageNeeded = dbUser?.itemImageEnabled ?? true;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ItemFormValues>({
    defaultValues: {
      name: "",
      price: "",
      category: "",
      description: "",
      image: "",
    },
  });

  const imageValue = watch("image");

  useEffect(() => {
    if (!isOpen) {
      reset();
      setImagePreview(null);
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing. Add to .env.local.");
      }

      data.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Failed to upload image. Check cloud configuration.");

      const json = await res.json();
      setValue("image", json.secure_url);
      setImagePreview(json.secure_url);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: ItemFormValues) => {
    if (isImageNeeded && !data.image) return toast.error("Please upload an image for your menu item");

    try {
      const payload = {
        ...data,
        price: Number(data.price),
      };
      console.log(payload);
      const res = await api.post("/api/items/create", payload);

      if (res.status === 201 || res.status === 200) {
        toast.success("Item created successfully!");
        onSuccess();
        refetchMenu();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to create item.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isSubmitting && !uploadingImage && onClose()}
      />
      <div className="relative bg-[#0A0A0A] border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-zinc-800/80">
          <h3 className="text-xl font-bold text-white">Create New Dish</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {/* Image Upload */}
          {isImageNeeded && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Dish Image
              </label>
              <div
                className={`w-full h-40 bg-[#111111] border-2 border-dashed ${errors.image ? 'border-red-500' : 'border-zinc-800 hover:border-[#e8845c]'} rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UploadCloud size={32} className="text-zinc-600 group-hover:text-[#e8845c] mb-2 transition-colors" />
                    <span className="text-sm font-medium text-zinc-400">Click to upload image</span>
                    <span className="text-xs text-zinc-600 mt-1">Recommended: 800x600px max 5MB</span>
                  </>
                )}

                {uploadingImage && (
                  <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col items-center justify-center text-[#e8845c] font-medium text-sm">
                    <Loader2 size={24} className="animate-spin mb-2" />
                    Uploading...
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {(!imageValue && errors.image) && (
                   <span className="text-red-500 text-xs mt-1">Image is required</span>
              )}
              {/* hidden input for react hook form validation trick */}
              <input type="hidden" {...register("image", { required: "Please upload an image" })} />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Dish Name
              </label>
              <input
                type="text"
                placeholder="e.g. Wagyu Ribeye"
                {...register("name", { required: "Name is required" })}
                className={`w-full bg-[#111111] border ${errors.name ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8845c] transition-colors`}
              />
              {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="45.00"
                {...register("price", { required: "Price is required", min: 0 })}
                className={`w-full bg-[#111111] border ${errors.price ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8845c] transition-colors`}
              />
              {errors.price && <span className="text-red-500 text-xs mt-1">{errors.price.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`w-full bg-[#111111] border ${errors.category ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8845c] transition-colors appearance-none`}
              >
                <option value="" disabled>
                  Select category
                </option>
                {isCategoriesLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  categories.map((cat: Category) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
              {errors.category && <span className="text-red-500 text-xs mt-1">{errors.category.message}</span>}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              placeholder="A rich, marbled 12oz ribeye served with black truffle butter..."
              {...register("description", { required: "Description is required" })}
              className={`w-full bg-[#111111] border ${errors.description ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#e8845c] transition-colors resize-none h-24 custom-scrollbar`}
            />
            {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => !uploadingImage && onClose()}
              disabled={uploadingImage || isSubmitting}
              className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadingImage || isSubmitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#e8845c] to-[#c96a41] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save Dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
