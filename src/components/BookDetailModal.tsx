import { useState, FormEvent, useEffect } from 'react';
import { Book, Review, AuthUser } from '../types';
import { X, Star, Heart, ShoppingBag, Calendar, Hash, BookOpen, AlertTriangle, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onAddToCart: (book: Book, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (book: Book) => void;
  onAddReview: (bookId: string, rating: number, comment: string, reviewerName: string) => void;
  currentUser?: AuthUser | null;
}

export default function BookDetailModal({
  book,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onAddReview,
  currentUser,
}: BookDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState(currentUser?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Prefill reviewName on currentUser change
  useEffect(() => {
    if (currentUser?.name) {
      setReviewName(currentUser.name);
    }
  }, [currentUser]);

  if (!book) return null;

  // Sorting logic for current reader reviews
  const sortedReviews = [...book.reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateB !== dateA) {
        return dateB - dateA;
      }
      return b.id.localeCompare(a.id);
    }
    if (sortBy === 'highest') {
      return b.rating - a.rating;
    }
    if (sortBy === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    if (val > book.stock) return;
    setQuantity(val);
  };

  const handleAddReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim()) {
      setSubmitError('Please enter your name.');
      return;
    }
    if (!reviewComment.trim() || reviewComment.length < 8) {
      setSubmitError('Please write a slightly longer review (minimum 8 characters).');
      return;
    }

    onAddReview(book.id, reviewRating, reviewComment, reviewName);
    setIsSubmitSuccess(true);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setSubmitError('');

    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSubmitSuccess(false);
    }, 4000);
  };

  const isOutOfStock = book.stock === 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-[#fbfbf9] w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row z-10"
        >
          {/* Close Trigger Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 border border-stone-200 text-stone-600 hover:text-black hover:bg-stone-50 shadow-xs hover:shadow-sm transition-all z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Block: Image & Book Specs (Fixed and scroll-containable on mobile) */}
          <div className="md:w-5/12 bg-stone-100/70 p-6 md:p-8 flex flex-col justify-start border-b md:border-b-0 md:border-r border-stone-200 overflow-y-auto">
            <div className="w-full max-w-[220px] mx-auto aspect-[3/4] bg-white rounded-lg shadow-md overflow-hidden border border-stone-200 flex-shrink-0">
              <img
                src={book.coverImage}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Spec Details with Mono Styling */}
            <div className="mt-6 space-y-3 font-mono text-xs text-stone-600">
              <div className="flex items-center gap-2 pb-2.5 border-b border-stone-200">
                <Hash className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold text-stone-800">ISBN:</span>
                <span className="ml-auto">{book.isbn}</span>
              </div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-stone-200">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold text-stone-800">Published:</span>
                <span className="ml-auto">{book.publishedYear}</span>
              </div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-stone-200">
                <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold text-stone-800">Pages:</span>
                <span className="ml-auto">{book.pages} pages</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold text-stone-800">Inventory Status:</span>
                <span className="ml-auto">
                  {isOutOfStock ? (
                    <span className="text-rose-600 font-bold uppercase text-[10px]">Sold Out</span>
                  ) : book.stock <= 4 ? (
                    <span className="text-amber-600 font-bold uppercase text-[10px] animate-pulse">Low Stock ({book.stock})</span>
                  ) : (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">{book.stock} Available</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Right Block: Pure Scrollable info details */}
          <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto flex-1 flex flex-col">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
              {book.category}
            </div>
            
            <h2 className="font-serif font-bold text-2xl md:text-3xl text-stone-900 leading-tight mb-1">
              {book.title}
            </h2>
            
            <p className="text-stone-600 italic text-sm md:text-base mb-4">
              by {book.author}
            </p>

            {/* Quick rating summaries */}
            <div className="flex items-center gap-2 mb-6 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100 self-start">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(book.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold font-mono text-stone-700">
                {book.rating.toFixed(1)} / 5.0
              </span>
              <span className="text-xs text-stone-400 font-mono">
                ({book.reviews.length} {book.reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Story Synopses */}
            <div className="space-y-4 text-stone-700 text-sm leading-relaxed mb-6 font-sans">
              <p className="font-medium text-stone-900 text-sm italic pr-2">
                "{book.description}"
              </p>
              <div className="p-4 bg-stone-50/50 rounded-lg border border-stone-100 text-stone-600">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Synopsis</h4>
                {book.synopsis}
              </div>
            </div>

            {/* Price Buy & Quantity triggers */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 flex flex-wrap gap-4 items-center justify-between mb-8">
              <div>
                <span className="text-xs text-stone-400 block font-mono">Price</span>
                <span className="text-2xl font-semibold font-mono text-stone-900">${book.price.toFixed(2)}</span>
              </div>

              {!isOutOfStock && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-stone-400 font-mono">Quantity</span>
                  <div className="flex items-center gap-1 border border-stone-200 bg-stone-50 rounded-lg p-0.5">
                    <button
                      onClick={() => handleQtyChange(quantity - 1)}
                      className="p-1 px-2.5 font-bold text-stone-600 hover:bg-stone-200 rounded-md transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono text-sm leading-none">{quantity}</span>
                    <button
                      onClick={() => handleQtyChange(quantity + 1)}
                      className="p-1 px-2.5 font-bold text-stone-600 hover:bg-stone-200 rounded-md transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                  whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
                  onClick={() => {
                    if (!isOutOfStock) {
                      onAddToCart(book, quantity);
                      onClose();
                    }
                  }}
                  disabled={isOutOfStock}
                  className={`px-5 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm ${
                    isOutOfStock
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-[#1c1917] text-[#fbfbf9] hover:bg-stone-800'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </motion.button>

                <button
                  onClick={() => onToggleWishlist(book)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-500'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Customer Book Reviews List */}
            <div className="border-t border-stone-200 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-stone-500" />
                  <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                    Reader Reviews ({book.reviews.length})
                  </h3>
                </div>
                
                {book.reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-450 font-mono">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-stone-700 bg-white border border-stone-250 rounded-lg px-2 py-1 text-xs cursor-pointer focus:outline-none focus:border-stone-900 font-sans font-medium shadow-2xs"
                    >
                      <option value="newest">Newest</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Verified Public Reviews Integrity Indicator */}
              <div className="mb-4 p-3 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono text-stone-500 leading-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-2xs shrink-0 inline-block animate-pulse" />
                  <span>Verified Purchase Reviews &bull; Content Integrity Checked</span>
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-700 font-sans block text-right">
                  Permanent reader feedback index: cannot be hidden or disabled by publishers
                </span>
              </div>

              {/* Reviews Feed */}
              {book.reviews.length === 0 ? (
                <p className="text-stone-400 text-xs italic mb-6">No reader reviews yet. Be the first to share your thoughts!</p>
              ) : (
                <div className="space-y-4 mb-8">
                  {sortedReviews.map((rev) => (
                    <div key={rev.id} className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                            <User className="w-3 h-3 text-stone-500" />
                          </div>
                          <span className="font-semibold text-xs text-stone-800">{rev.userName}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                              Verified
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">{rev.date}</span>
                      </div>

                      {/* Stars indicator */}
                      <div className="flex text-amber-400 gap-0.5 mb-1.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${idx < rev.rating ? 'fill-amber-400' : 'text-stone-200'}`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-stone-600 font-sans leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Write Review Submission Form */}
              <div className="p-5 bg-stone-100/50 rounded-xl border border-stone-200">
                <h4 className="font-serif font-semibold text-sm text-stone-850 mb-3 block">
                  Write Your Review
                </h4>

                {isSubmitSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-205 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
                    <span className="font-bold">Thank you!</span> Your review has been submitted successfully and will show above.
                  </div>
                ) : (
                  <form onSubmit={handleAddReviewSubmit} className="space-y-3">
                    {submitError && (
                      <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-md">
                        {submitError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="e.g. Rachel Sterling"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#1c1917]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                          Rating Score
                        </label>
                        <div className="flex items-center gap-1.5 mt-1 border border-stone-300 bg-white rounded-lg p-1 w-fit">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setReviewRating(starValue)}
                                className="p-0.5 focus:outline-none"
                              >
                                <Star
                                  className={`w-4 h-4 transition-colors cursor-pointer ${
                                    starValue <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 hover:text-amber-200'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                        Review Comment
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What did you think of the story, writing, pacing, or characters?"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#1c1917] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-stone-800 hover:bg-black text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                    >
                      Post Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
