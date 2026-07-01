import { BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function HeroSection() {
  return (
    <div id="store-hero" className="relative bg-stone-900 text-[#fbfbf9] rounded-2xl overflow-hidden mb-12 border border-stone-800 shadow-md">
      {/* Background cover representation */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600"
          alt="Jelvan Books Interior Library"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-102"
        />
      </div>

      <div className="relative z-10 px-6 py-12 md:py-16 md:px-12 max-w-3xl flex flex-col items-start text-left">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-stone-800/80 backdrop-blur-xs border border-stone-700/50 px-3 py-1 rounded-full text-stone-250 text-[10px] font-mono tracking-widest uppercase mb-4 flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          EST. 2026 • Literary Boutique
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-serif font-semibold text-3xl md:text-5xl leading-tight mb-4 tracking-tight"
        >
          Curation for the <br />
          <span className="italic text-amber-100 font-normal">Discerning Mind</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-stone-300 text-xs md:text-sm max-w-xl leading-relaxed mb-8 font-sans space-y-3"
        >
          <p className="text-white text-sm md:text-base font-semibold">Welcome to Jelvan Online Books Store</p>
          <p className="text-stone-400">
            A sanctuary of classic literature, architectural monographs, deep scientific treatises, and atmospheric mysteries. Every title on our shelf has been carefully weighed and selected.
          </p>
        </motion.div>

        {/* Curation highlights bar with elegant indicators */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full border-t border-stone-800 pt-6 mt-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-200">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Carefully Filtered</span>
              <span className="text-xs text-stone-300">Hand-selected masterworks</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Free Shipping</span>
              <span className="text-xs text-stone-300">Orders exceeding $50</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Personal Care</span>
              <span className="text-xs text-stone-300">Bundled inside cotton paper</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
