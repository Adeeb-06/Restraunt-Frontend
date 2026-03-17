import React from "react";
import { Edit, Trash, Eye, EyeOff } from "lucide-react";
import { Item } from "@/lib/api";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface MenuItemCardProps {
  item: Item;
  onDelete: (id: string, name: string) => void;
}

export default function MenuItemCard({ item, onDelete }: MenuItemCardProps) {
  const categoryName = typeof item.category === "object" ? item.category.name : "Unknown Category";
  const queryClient = useQueryClient();

  const toggleShowInMenu = async () => {
    try {
      await api.put(`/api/items/${item._id}`, {
        showInMenu: !item.showInMenu,
      });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success(`Item is now ${!item.showInMenu ? 'visible' : 'hidden'} on the menu!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to update item visibility");
    }
  };

  return (
    <tr className="border-b border-zinc-800/50 hover:bg-[#161616]/50 transition-colors group">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src={item.image} 
               alt={item.name} 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
             />
          </div>
          <div>
            <h3 className="font-bold text-white leading-tight">{item.name}</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8845c] truncate">
              {categoryName}
            </span>
          </div>
        </div>
      </td>
      <td className="p-4 hidden md:table-cell">
        <p className="text-sm text-zinc-500 line-clamp-1 max-w-[300px]">
          {item.description}
        </p>
      </td>
      <td className="p-4">
        <span className="text-white font-bold whitespace-nowrap">${Number(item.price).toFixed(2)}</span>
      </td>
      <td className="p-4">
        <button
          onClick={toggleShowInMenu}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            item.showInMenu
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
              : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-white"
          }`}
          title={item.showInMenu ? "Hide from Menu" : "Show on Menu"}
        >
          {item.showInMenu ? (
            <>
              <Eye size={14} /> ACTIVE
            </>
          ) : (
            <>
              <EyeOff size={14} /> HIDDEN
            </>
          )}
        </button>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
           <button 
             className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
             title="Edit Item (Coming Soon)"
           >
              <Edit size={16} />
           </button>
           <button 
              className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              onClick={() => onDelete(item._id, item.name)}
              title="Delete Item"
           >
              <Trash size={16} />
           </button>
        </div>
      </td>
    </tr>
  );
}
