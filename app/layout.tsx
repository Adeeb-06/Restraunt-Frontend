import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseAuthProvider } from "@/providers/FirebaseAuthProvider";
import NavbarWrapper from "@/components/NavbarWrapper";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saveur — Fine Dining Experience",
  description:
    "Explore our curated restaurant menu with exquisite dishes and authentic flavors.",
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
            <NavbarWrapper />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              theme="dark"
            />
            {children}
          </FirebaseAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
