import Link from "next/link";
import { ArrowRight, Star, Code, Server, Flame, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 pt-20">
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#e8845c] rounded-full blur-[120px] opacity-[0.08] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#f5c27a] rounded-full blur-[120px] opacity-[0.06] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center min-h-[85vh]">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs sm:text-sm font-medium text-zinc-400 mb-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Star size={14} className="text-[#e8845c] fill-[#e8845c]" />
          <span>Michelin Recommended 2025</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-serif text-white tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          Crafted with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8845c] to-[#f5c27a]">Passion</span>,<br />
          Served with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8845c] to-[#f5c27a]">Purpose</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          From farm-fresh ingredients to beautifully plated masterpieces —
          explore a menu curated for the discerning palate.
        </p>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <Link href="/auth/register" className="group flex items-center justify-center w-full sm:w-auto space-x-2 bg-gradient-to-r from-[#e8845c] to-[#c96a41] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#e8845c]/20 hover:shadow-[#e8845c]/40 transition-all hover:-translate-y-0.5">
            <span>Reserve a Table</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#about-project" className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-zinc-300 hover:text-white hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700 transition-all">
            About Project
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16 mt-20 pt-10 border-t border-zinc-800/60 w-full max-w-3xl animate-in fade-in duration-1000 delay-700">
          {[
            { value: "150+", label: "Dishes" },
            { value: "12yr", label: "Experience" },
            { value: "4.9★", label: "Rating" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-bold text-white mb-2 font-serif">{s.value}</span>
              <span className="text-xs sm:text-sm font-medium text-zinc-500 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* About the Project Section */}
      <section id="about-project" className="relative w-full border-t border-zinc-800/60 bg-[#0A0A0A] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16 lg:mb-24">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">About This Platform</h2>
            <p className="text-zinc-400 max-w-2xl text-lg md:text-xl leading-relaxed">
              This completely modern restaurant management application was engineered from the ground up using a full-stack architecture tailored for high performance and premium design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Code, 
                title: "Next.js 14 App Router", 
                desc: "Leveraging Server Components, seamless client-side navigation, and optimal rendering for a blazing fast frontend." 
              },
              { 
                icon: Server, 
                title: "Robust Node Backend", 
                desc: "An Express.js + Mongoose architecture delivering secure API endpoints and scalable restaurant data management." 
              },
              { 
                icon: ShieldCheck, 
                title: "Firebase Authentication", 
                desc: "State-of-the-art token security and login flow, perfectly synchronized with backend role-based access for Admins and Owners." 
              },
              { 
                icon: Flame, 
                title: "Tailwind CSS v4", 
                desc: "100% utility-first bespoke styling using the latest compiler, deep zinc themes, and glowing brand accents with zero CSS bloat." 
              }
            ].map((feature, i) => (
              <div key={i} className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-8 hover:bg-zinc-900 shadow-xl hover:border-zinc-700/80 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-[#e8845c]/10 text-[#e8845c] border border-[#e8845c]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-base text-zinc-400 leading-relaxed">
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
