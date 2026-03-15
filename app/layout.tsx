import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirebaseAuthProvider } from "@/providers/FirebaseAuthProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <FirebaseAuthProvider>
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            theme="dark"
          />
          {children}
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
