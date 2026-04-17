import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseAuthProvider } from "@/providers/FirebaseAuthProvider";
import NavbarWrapper from "@/components/NavbarWrapper";
import QueryProvider from "@/providers/QueryProvider";
import MenuProvider from "@/providers/MenuProvider";
import CartProvider from "@/providers/CartProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scanly — Modern QR Smart Menus for Restaurants",
  description:
    "Elevate your dining experience with Scanly. We provide sleek, interactive, and beautifully customizable digital QR menus for modern restaurants.",
  keywords: ["QR Menu", "Digital Menu", "Restaurant Management", "Scanly", "Smart Menu", "Restaurant SaaS"],
  openGraph: {
    title: "Scanly — Smart QR Menus",
    description: "Sleek, interactive, and customizable digital QR menus for modern restaurants.",
    type: "website",
    siteName: "Scanly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scanly — Smart QR Menus",
    description: "Sleek, interactive, and customizable digital QR menus for modern restaurants.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <QueryProvider>
          <FirebaseAuthProvider>
            <MenuProvider>
              <CartProvider>
                <NavbarWrapper />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  theme="dark"
                />
                {children}
              </CartProvider>
            </MenuProvider>
          </FirebaseAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
