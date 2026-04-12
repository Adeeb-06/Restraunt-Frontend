"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { QrCode, Printer, Utensils, Download } from "lucide-react";
import Image from "next/image";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import * as htmlToImage from "html-to-image";

export default function QrCodePage() {
  const { dbUser } = useAuth();
  const [menuUrl, setMenuUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dbUser?.restrauntName) {
      const url = `https://quickserve-ten.vercel.app/menu?restrauntName=${encodeURIComponent(
        dbUser.restrauntName
      )}`;
      setMenuUrl(url);

      // ✅ Generate QR locally (NO CORS ISSUE)
      QRCode.toDataURL(url, { width: 512 })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [dbUser]);

  if (!dbUser) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#e8845c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }



const handleDownload = async (format: "jpg" | "png") => {
  if (!cardRef.current || !dbUser.restrauntName) return;

  try {
    setIsExporting(true);

    let dataUrl: string;

    if (format === "png") {
      dataUrl = await htmlToImage.toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });
    } else {
      dataUrl = await htmlToImage.toJpeg(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
      });
    }

    const link = document.createElement("a");
    link.download = `${dbUser.restrauntName.replace(/\s+/g, "_")}_Menu_QR.${format}`;
    link.href = dataUrl;
    link.click();

  } catch (error) {
    console.error("Export failed:", error);
    alert("Export failed again. This is likely due to external images (logo).");
  } finally {
    setIsExporting(false);
  }
};

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <QrCode className="text-[#e8845c]" /> Menu QR Code
        </h2>

        <div className="flex gap-3">
          <button onClick={() => handleDownload("png")}>
            <Download size={18} /> PNG
          </button>
          <button onClick={() => handleDownload("jpg")}>
            <Download size={18} /> JPG
          </button>
          <button onClick={() => window.print()}>
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      <div className="flex justify-center py-10">
        <div
          ref={cardRef}
          id="print-area"
          className="bg-white max-w-sm rounded-3xl border-8 border-zinc-900 p-12 text-center"
        >
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto mb-4">
            {dbUser.photoURL ? (
              <Image
                src={dbUser.photoURL}
                alt="logo"
                width={100}
                height={100}
                unoptimized
                crossOrigin="anonymous"
              />
            ) : (
              <Utensils />
            )}
          </div>

          <h2 className="text-2xl font-bold text-black">
            {dbUser.restrauntName}
          </h2>

          <p className="text-orange-500 mb-6">Scan for Menu</p>

          {/* ✅ LOCAL QR (FIXED) */}
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="w-56 h-56 mx-auto"
            />
          ) : (
            <div className="w-56 h-56 bg-gray-200 animate-pulse mx-auto" />
          )}

          <p className="text-xs mt-4 text-gray-500">
            Point your camera to order
          </p>
        </div>
      </div>
    </div>
  );
}