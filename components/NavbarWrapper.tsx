"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Do not show navbar on dashboard routes
  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/menu");
  
  if (isDashboard) return null;
  
  return <Navbar />;
}
