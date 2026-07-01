import { useState } from 'react';
import { Book } from '../types';
import { Sparkles, Eye, Compass, CloudRain, Search, LayoutGrid, Coffee, Stars, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CurationModuleProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

interface TasteProfile {
  id: string;
  label: string;
  emoji: string;
  tagline: string;
  matchedIsbns: string[]; // Match against book.isbn
}

const TASTE_PROFILES: TasteProfile[] = [
  {
    id: 'rainy',
    label: 'Quiet Rainy Afternoon',
    emoji: '☕',
    tagline: 'Lyrical historical fiction, atmospheric Venice, and secrets buried in salt deserts.',
    matchedIsbns: ['978-3-16-148410-0', '978-0-553-38679-0']
  },
  {
    id: 'cosmic',
    label: 'Existential Philosophy',
    emoji: '🌌',
    tagline: 'Quantum mechanics, deep galactic perception, and the ethics of tomorrow’s engineering.',
    matchedIsbns: ['978-0-12-345678-9', '978-1-5011-7134-5']
  },
  {
    id: 'suspense',
    label: 'High-Stakes Investigation',
    emoji: '🔍',
    tagline: 'Art theft under Buenos Aires neon, and locked-door blizzards in remote Norwegian villages.',
    matchedIsbns: ['978-1-4028-9462-6', '978-0-06-206840-8']
  },
  {
    id: 'design',
    label: 'Spatial Design & Silence',
    emoji: '📐',
    tagline: 'Japanese woodwork, typographic life struggles, and the power of pure negative space.',
    matchedIsbns: ['978-4-8222-1049-2', '978-0-394-58201-3', '978-3-7913-8106-0']
  }
];

export default function CurationModule({ books, onSelectBook }: CurationModuleProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const activeProfile = TASTE_PROFILES.find(p => p.id === selectedProfileId);
  const matchedBooks = activeProfile
    ? books.filter(b => activeProfile.matchedIsbns.includes(b.isbn))
    : [];

  return (
    <div id="curation-desk" className="bg-[#1c1917]/5 border border-stone-200/80 rounded-2xl p-6 md:p-8 mb-12 shadow-xs relative overflow-hidden">
      {/* Dynamic ambient context lighting (theme-aligned neutral) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-stone-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-stone-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-stone-605 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-500 animate-pulse" />
            What is your mind seeking today?
          </span>
          <h2 className="font-serif font-black text-xl md:text-2xl text-stone-900 tracking-tight">
            Select a literary appetite to reveal our curators' corresponding matches instantly.
          </h2>
        </div>

        {selectedProfileId && (
          <button
            onClick={() => setSelectedProfileId(null)}
            className="text-xs text-stone-850 hover:text-black font-semibold self-start sm:self-center transition-all px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 rounded-lg shrink-0 cursor-pointer"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Buttons Selection Grid with Dynamic Live Elements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
        {TASTE_PROFILES.map((profile) => {
          const isActive = profile.id === selectedProfileId;
          return (
            <button
              key={profile.id}
              onClick={() => setSelectedProfileId(profile.id)}
              className={`group relative p-4 rounded-xl border text-left flex flex-col justify-between h-28 cursor-pointer overflow-hidden transition-all duration-300 select-none focus:outline-none ${
                isActive
                  ? 'bg-stone-900 border-stone-900 text-white shadow-md shadow-stone-950/10 scale-[1.02]'
                  : 'bg-white border-stone-200 hover:border-stone-400 text-stone-850 hover:bg-stone-50/40 hover:shadow-xs'
              }`}
            >
              {/* ELEGANT LIVE PROCEDURAL BACKGROUNDS (Moving live element each content) */}
              {profile.id === 'rainy' && (
                <div className={`absolute inset-0 overflow-hidden pointer-events-none rounded-xl transition-opacity duration-300 ${isActive ? 'opacity-30' : 'opacity-10 group-hover:opacity-20'}`}>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-[1px] h-3 rounded-full transition-colors ${
                        isActive ? 'bg-stone-300/40' : 'bg-stone-400/20 group-hover:bg-stone-400/40'
                      }`}
                      initial={{ y: -20, x: `${15 + i * 16}%` }}
                      animate={{ y: 120 }}
                      transition={{
                        duration: 1.2 + i * 0.2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.15
                      }}
                    />
                  ))}
                  <div className="absolute right-3 top-3">
                    <CloudRain className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-stone-300' : 'text-stone-400 group-hover:text-stone-605'
                    } animate-bounce`} />
                  </div>
                </div>
              )}

              {profile.id === 'cosmic' && (
                <div className={`absolute inset-0 overflow-hidden pointer-events-none rounded-xl transition-opacity duration-300 ${isActive ? 'opacity-40' : 'opacity-20 group-hover:opacity-30'}`}>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 rounded-full transition-colors ${
                        isActive ? 'bg-stone-300/40' : 'bg-stone-400/25 group-hover:bg-stone-400/50'
                      }`}
                      style={{ left: `${15 + i * 15}%`, top: `${20 + (i * 23) % 60}%` }}
                      animate={{ scale: [0.4, 1.3, 0.4], opacity: [0.2, 0.9, 0.2] }}
                      transition={{
                        duration: 1.8 + i * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.25
                      }}
                    />
                  ))}
                  <div className="absolute right-3 top-3">
                    <Stars className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-stone-300' : 'text-stone-400 group-hover:text-stone-605'
                    } animate-pulse`} />
                  </div>
                </div>
              )}

              {profile.id === 'suspense' && (
                <div className={`absolute inset-0 overflow-hidden pointer-events-none rounded-xl transition-opacity duration-300 ${isActive ? 'opacity-30' : 'opacity-10 group-hover:opacity-20'}`}>
                  <motion.div
                    className={`absolute w-[40px] h-full bg-gradient-to-r from-transparent to-transparent -skew-x-12 ${
                      isActive ? 'via-stone-500/10' : 'via-stone-400/10 group-hover:via-stone-400/20'
                    }`}
                    initial={{ x: "-150%" }}
                    animate={{ x: "250%" }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="absolute right-3 top-3">
                    <Search className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-stone-300' : 'text-stone-400 group-hover:text-stone-605'
                    } animate-pulse`} />
                  </div>
                  {/* Subtle search target */}
                  <div className={`absolute left-8 bottom-3 w-5 h-5 border rounded-full transition-colors ${
                    isActive ? 'border-stone-500/10' : 'border-stone-500/5 group-hover:border-stone-500/15'
                  }`} />
                </div>
              )}

              {profile.id === 'design' && (
                <div className={`absolute inset-0 overflow-hidden pointer-events-none rounded-xl transition-opacity duration-300 ${isActive ? 'opacity-25' : 'opacity-10 group-hover:opacity-20'}`}>
                  <div className="absolute left-2 top-2 border-l border-t border-stone-400/40 w-2.5 h-2.5" />
                  <div className="absolute right-2 top-2 border-r border-t border-stone-400/40 w-2.5 h-2.5" />
                  <div className="absolute left-2 bottom-2 border-l border-b border-stone-400/40 w-2.5 h-2.5" />
                  <div className="absolute right-2 bottom-2 border-r border-b border-stone-400/40 w-2.5 h-2.5" />
                  
                  <motion.div
                    className={`absolute inset-0 border border-dashed m-1 rounded-lg transition-colors ${
                      isActive ? 'border-stone-500/10' : 'border-stone-400/15 group-hover:border-stone-400/25'
                    }`}
                    animate={{ scale: [0.98, 1.02, 0.98] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="absolute right-3 top-3">
                    <LayoutGrid className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-stone-300' : 'text-stone-400 group-hover:text-stone-605'
                    } animate-[spin_8s_linear_infinite]`} />
                  </div>
                </div>
              )}

              {/* Tag Selection Indicator */}
              <div className="flex items-center justify-between w-full relative z-10">
                <span className={`text-xl transition-transform duration-300 group-hover:scale-125 ${isActive ? 'scale-110' : ''}`}>
                  {profile.emoji}
                </span>
                
                {isActive && (
                  <motion.span
                    layoutId="activeCurationDot"
                    className="w-2 h-2 rounded-full bg-stone-350"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>

              <div className="relative z-10">
                <span className={`font-serif text-sm font-bold tracking-tight block ${isActive ? 'text-white' : 'text-stone-900 group-hover:text-stone-950'}`}>
                  {profile.label}
                </span>
                <span className={`text-[10px] block font-mono mt-0.5 tracking-wider uppercase font-semibold ${isActive ? 'text-stone-400' : 'text-stone-450'}`}>
                  Curator Choice
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recommended Books List animates into position */}
      <AnimatePresence mode="wait">
        {selectedProfileId && activeProfile && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="p-5 bg-white rounded-xl border border-stone-200 flex flex-col md:flex-row gap-6 md:items-center justify-between shadow-2xs relative z-10 shadow-stone-950/2"
          >
            <div className="flex-1">
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-stone-550 block mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Selected Appetite Match Preview:
              </span>
              <p className="text-stone-750 text-xs md:text-sm font-medium leading-relaxed italic pr-4">
                "{activeProfile.tagline}"
              </p>
            </div>

            {/* Matching lists preview */}
            <div className="flex gap-4 flex-wrap">
              {matchedBooks.length === 0 ? (
                <div className="text-stone-400 text-xs italic flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Curator compiling matched copies...</span>
                </div>
              ) : (
                matchedBooks.map((book) => (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    key={book.id}
                    onClick={() => onSelectBook(book)}
                    className="flex items-center gap-3 bg-stone-50/80 hover:bg-stone-100 p-2.5 rounded-lg border border-stone-200 hover:border-stone-405 cursor-pointer transition-colors group select-none shadow-3xs"
                    title="View book description"
                  >
                    <div className="w-8 h-11 bg-stone-200 rounded-md overflow-hidden border border-stone-300 shadow-2xs flex-shrink-0 relative">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {/* Subtle elegant reflection across the cover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                    </div>
                    <div className="max-w-[130px]">
                      <span className="font-serif text-xs font-bold text-stone-904 line-clamp-1 group-hover:text-stone-800 transition-colors">
                        {book.title}
                      </span>
                      <span className="text-[10px] text-stone-500 line-clamp-1 italic">
                        by {book.author}
                      </span>
                    </div>
                    <Eye className="w-4 h-4 text-stone-400 group-hover:text-stone-750 ml-1.5 transition-all duration-300" />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
