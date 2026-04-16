"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/providers/FirebaseAuthProvider";
import { QrCode, Printer, Utensils, Download, Wifi } from "lucide-react";
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
      const url = `${process.env.CLIENT_URL}/menu?restrauntName=${encodeURIComponent(
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



  const [wifiNetwork, setWifiNetwork] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");

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
    <div className="space-y-6 max-w-4xl pb-20">
      <div className="flex justify-between items-center print:hidden flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 w-full md:w-auto">
          <QrCode className="text-[#e8845c]" /> Menu QR Code
        </h2>

        <div className="flex gap-3">
          <button onClick={() => handleDownload("png")} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors">
            <Download size={16} /> PNG
          </button>
          <button onClick={() => handleDownload("jpg")} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors">
            <Download size={16} /> JPG
          </button>
          <button onClick={() => window.print()} className="bg-[#e8845c] hover:bg-[#d6724a] text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors font-medium cursor-pointer">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Inputs for Wi-Fi (optional) */}
      <div className="print:hidden w-full max-w-sm mx-auto flex flex-col gap-3 p-5 bg-zinc-900 rounded-2xl border border-zinc-800">
        <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Optional Details for Card</h3>
        <input 
          type="text" 
          placeholder="Wi-Fi Network Name" 
          className="bg-zinc-950/50 border border-zinc-700 text-white px-4 py-2.5 rounded-xl text-sm w-full outline-none focus:border-[#e8845c] transition-colors"
          value={wifiNetwork}
          onChange={(e) => setWifiNetwork(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Wi-Fi Password" 
          className="bg-zinc-950/50 border border-zinc-700 text-white px-4 py-2.5 rounded-xl text-sm w-full outline-none focus:border-[#e8845c] transition-colors"
          value={wifiPassword}
          onChange={(e) => setWifiPassword(e.target.value)}
        />
      </div>

      <div className="flex justify-center py-6">
        <div
          ref={cardRef}
          id="print-area"
          className="relative bg-white w-full max-w-[240px]  overflow-hidden shadow-2xl text-center"
          style={{ width: '240px' }} // fixed small width for a consistent card ratio aspect
        >
          {/* Abstract Modern Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none bg-zinc-50 z-0">
             {/* Diagonal Abstract Graphic */}
             <svg className="absolute top-0 left-0 w-full" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H240V90C160 140 80 60 0 110V0Z" fill={dbUser.colors?.secondary || "#ffedd5"} />
             </svg>
             <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M240 180H0V60C80 10 160 90 240 40V180Z" fill={dbUser.colors?.secondary || "#ffedd5"} />
             </svg>
             {/* Subtle Pattern Overlay */}
             <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
          </div>

          <div className="relative z-10 px-4 py-5 flex flex-col items-center h-full">
            {/* Logo Wrapper */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-[3px] border-white shadow-md bg-white flex items-center justify-center mb-2">
              {dbUser.photoURL ? (
                <Image
                  src={dbUser.photoURL}
                  alt="logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                  crossOrigin="anonymous"
                />
              ) : (
                <Utensils className="text-zinc-300" size={20} />
              )}
            </div>

            <h2 className="text-[1.1rem] font-black text-zinc-900 tracking-tight leading-tight mb-0.5">
              {dbUser.restrauntName}
            </h2>

            {/* Wi-Fi Details */}
            {(wifiNetwork || wifiPassword) && (
              <div className="flex items-center justify-center gap-1 mt-1 bg-white/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-sm border border-zinc-100">
                <Wifi size={10} className="text-zinc-500" />
                <span className="text-[0.55rem] font-bold text-zinc-700 tracking-wide">
                  {wifiNetwork}
                  {wifiNetwork && wifiPassword && " / "}
                  {wifiPassword}
                </span>
              </div>
            )}

            <p className={`text-[0.55rem] font-bold text-orange-600 mb-3 uppercase tracking-[0.2em] mt-2`}>
              Scan For Menu
            </p>

            {/* QR Scanner Target Container */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-zinc-100 mb-3 relative group">
              {/* Corner Targets */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-orange-500 rounded-tl-md -translate-x-0.5 -translate-y-0.5"></div>
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-orange-500 rounded-tr-md translate-x-0.5 -translate-y-0.5"></div>
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-orange-500 rounded-bl-md -translate-x-0.5 translate-y-0.5"></div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-orange-500 rounded-br-md translate-x-0.5 translate-y-0.5"></div>

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-[110px] h-[110px] mx-auto mix-blend-multiply"
                />
              ) : (
                <div className="w-[110px] h-[110px] bg-zinc-100 animate-pulse rounded-lg mx-auto" />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400">
               <QrCode size={11} strokeWidth={2.5} />
               <p className="text-[0.55rem] font-medium tracking-wide">
                 Point your camera to order
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}