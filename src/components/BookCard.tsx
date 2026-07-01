import { Book } from '../types';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface BookCardProps {
  key?: string;
  book: Book;
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  isWishlisted: boolean;
  onToggleWishlist: (book: Book) => void;
}

export default function BookCard({
  book,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: BookCardProps) {
  const isOutOfStock = book.stock === 0;

  return (
    <motion.div
      id={`book-card-${book.id}`}
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group bg-white rounded-xl border border-stone-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow relative flex flex-col h-full"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden cursor-pointer" onClick={() => onSelect(book)}>
        <img
          src={book.coverImage}
          alt={book.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Feature Tags Overlay */}
        {book.features && book.features.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {book.features.map((feature, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-[#1c1917]/95 text-[#fbfbf9] rounded-sm shadow-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Action Overlays */}
        <div className="absolute inset-0 bg-[#1c1917]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(book);
            }}
            className="p-3 bg-[#fbfbf9] text-[#1c1917] rounded-full shadow-lg hover:bg-stone-100 transition-colors"
            title="Quick View"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onAddToCart(book);
            }}
            disabled={isOutOfStock}
            className={`p-3 rounded-full shadow-lg transition-colors ${
              isOutOfStock
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-[#1c1917] text-[#fbfbf9] hover:bg-stone-800'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Heart Favorite Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(book);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 backdrop-blur-xs shadow-xs hover:bg-white text-stone-600 hover:text-rose-600 transition-all cursor-pointer z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
            }`}
          />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-stone-800 text-white font-medium text-xs rounded-sm tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[11px] font-medium text-stone-500 tracking-wider uppercase mb-1">
          {book.category}
        </div>
        
        <h3 
          className="font-serif font-semibold text-[15px] leading-snug text-[#1c1917] hover:text-[#c2410c] transition-colors line-clamp-1 mb-1 cursor-pointer"
          onClick={() => onSelect(book)}
        >
          {book.title}
        </h3>
        
        <p className="text-xs text-stone-600 italic mb-2 line-clamp-1">
          by {book.author}
        </p>

        {/* Rating Block */}
        <div className="flex items-center gap-1 mb-3 mt-auto">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < borderRating(book.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-stone-600">{book.rating.toFixed(1)}</span>
        </div>

        {/* Pricing and Stock Info */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
          <span className="font-mono text-base font-semibold text-[#1c1917]">
            ${book.price.toFixed(2)}
          </span>
          
          {isOutOfStock ? (
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600">
              Out of stock
            </span>
          ) : book.stock <= 4 ? (
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 animate-pulse">
              Only {book.stock} left!
            </span>
          ) : (
            <span className="text-[10px] uppercase font-medium tracking-wider text-stone-400">
              In Stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Simple rounding for stars
function borderRating(rating: number): number {
  return Math.round(rating);
}
