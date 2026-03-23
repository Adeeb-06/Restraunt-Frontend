"use client";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { createContext } from "react";
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


export interface MenuContextType {

  refetchMenu: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
  menuData: any;
  menuLoading: boolean;
  menuIsError: boolean;
  menuError: Error | null;
  setRestaurantName: (name: string) => void;
  restaurantName: string;
  
}

const MenuContext = createContext<MenuContextType | null>(null);

export default MenuContext;
