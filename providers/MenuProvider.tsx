"use client";
import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import MenuContext from "@/app/context/menuContext";
interface Item {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface MenuCategory {
  category: string;
  items: Item[];
}

interface RestaurantMenuData {
  restaurant: {
    name: string;
    photoURL?: string;
  };
  menu: MenuCategory[];
}

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [restaurantName, setRestaurantName] = useState<string>("");
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchMenu,
  } = useQuery<RestaurantMenuData>({
    queryKey: ["publicMenu", restaurantName],
    queryFn: async () => {
      if (!restaurantName) return null;
      const res = await api.get(
        `/api/menu?restrauntName=${encodeURIComponent(restaurantName)}`,
      );
      return res.data;
    },
    enabled: !!restaurantName,
    retry: 1,
  });

  return <MenuContext.Provider value={{
    refetchMenu,
    menuData:data,
    menuLoading:isLoading,
    menuIsError:isError,
    menuError:error,
    setRestaurantName,
    restaurantName,
  }}>{children}</MenuContext.Provider>;
};

export default MenuProvider;
