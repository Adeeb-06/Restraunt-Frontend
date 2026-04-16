import Link from "next/link";
import { ArrowRight, Star, QrCode, Smartphone, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#F7F9F2] text-zinc-600 pt-20 overflow-x-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#49BEB7] rounded-full blur-[120px] opacity-[0.15] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#3ba8a1] rounded-full blur-[120px] opacity-[0.1] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center min-h-[85vh]">
       
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-sans text-zinc-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          QR Code Based <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#49BEB7] to-[#25827C]">Smart Menus</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-600 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          Say goodbye to expensive printed menus. Scanly empowers restaurants to create, update, and deploy beautiful digital menus instantly via simple QR codes.
        </p>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <Link href="/auth/register" className="group flex items-center justify-center w-full sm:w-auto space-x-2 bg-[#49BEB7] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#49BEB7]/30 hover:shadow-[#49BEB7]/50 transition-all hover:-translate-y-0.5">
            <span>Get Started for Free</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#features" className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/50 border border-transparent hover:border-zinc-300 transition-all">
            View Features
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16 mt-20 pt-10 border-t border-zinc-200 w-full max-w-3xl animate-in fade-in duration-1000 delay-700">
          {[
            { value: "0", label: "Printing Costs" },
            { value: "2 Mins", label: "To Setup" },
            { value: "100%", label: "Customizable" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-black text-zinc-900 mb-2">{s.value}</span>
              <span className="text-xs sm:text-sm font-bold text-[#49BEB7] uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About / Features Section */}
      <section id="features" className="relative w-full border-t border-zinc-200 bg-white py-24 lg:py-32 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16 lg:mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6">Why Restaurants Choose Scanly</h2>
            <p className="text-zinc-600 max-w-2xl text-lg md:text-xl leading-relaxed">
              We provide everything you need to modernize your dining experience. Instantly adjust prices, hide out-of-stock items, and match your brand's unique colors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: QrCode, 
                title: "Instant QR Generation", 
                desc: "Automatically generate beautiful HD QR codes tailored to your restaurant that you can print right away." 
              },
              { 
                icon: Smartphone, 
                title: "Mobile Optimized", 
                desc: "A stunning app-like menu experience right in your customers' browsers, no downloads required." 
              },
              { 
                icon: Zap, 
                title: "Real-time Updates", 
                desc: "Sold out of the special? Hide it instantly. Need to update a price? Change it and sync immediately." 
              },
              { 
                icon: ShieldCheck, 
                title: "Secure & Reliable", 
                desc: "Your data is safe, backed by modern secure architecture keeping your admin dashboard locked in." 
              }
            ].map((feature, i) => (
              <div key={i} className="bg-zinc-50 border border-zinc-100 rounded-2xl p-8 hover:bg-white shadow-sm hover:shadow-xl hover:border-zinc-200 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-[#49BEB7]/10 text-[#49BEB7] border border-[#49BEB7]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-base text-zinc-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
