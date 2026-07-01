import { useState, useEffect } from 'react';
import { Book, CartItem, Category, AuthUser, Order } from './types';
import { INITIAL_BOOKS, CATEGORIES } from './data/books';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import HeroSection from './components/HeroSection';
import CurationModule from './components/CurationModule';
import AuthModal from './components/AuthModal';
import PublisherWorkstation from './components/PublisherWorkstation';
import BuyerConsole from './components/BuyerConsole';
import { Search, ShoppingBag, Heart, SlidersHorizontal, ArrowUpDown, X, Star, Bookmark, User, LogIn, Lock, GraduationCap, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // --- Persistent States ---
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('jbs_catalog');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jbs_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('jbs_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('jbs_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('jbs_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- UI Layout Toggle States ---
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // --- Filtering & Sorting States ---
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  // --- Checkout Discount details ---
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountCode, setDiscountCode] = useState('');

  // --- Synchronize with LocalStorage on Changes ---
  useEffect(() => {
    localStorage.setItem('jbs_catalog', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('jbs_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jbs_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('jbs_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jbs_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jbs_user');
    }
  }, [currentUser]);

  // --- Core Action Hooks & Handlers ---

  const handleAddToCart = (book: Book, quantity = 1) => {
    if (book.stock === 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.book.id === book.id);
      if (existing) {
        // Enforce stock boundaries
        const newQty = Math.min(book.stock, existing.quantity + quantity);
        return prevCart.map((item) =>
          item.book.id === book.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { book, quantity: Math.min(book.stock, quantity) }];
    });
  };

  const handleUpdateCartQty = (bookId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveCartItem(bookId);
      return;
    }

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.book.id === bookId) {
          // Verify current catalog stock limits
          const catalogBook = books.find((b) => b.id === bookId);
          const limit = catalogBook ? catalogBook.stock : item.book.stock;
          return { ...item, quantity: Math.min(limit, quantity) };
        }
        return item;
      });
    });
  };

  const handleRemoveCartItem = (bookId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.book.id !== bookId));
  };

  const handleToggleWishlist = (book: Book) => {
    setWishlist((prevWish) =>
      prevWish.includes(book.id)
        ? prevWish.filter((id) => id !== book.id)
        : [...prevWish, book.id]
    );
  };

  const handleAddReview = (
    bookId: string,
    rating: number,
    comment: string,
    reviewerName: string
  ) => {
    setBooks((prevBooks) => {
      return prevBooks.map((book) => {
        if (book.id === bookId) {
          const newReview = {
            id: `r-user-${Date.now()}`,
            bookId,
            userName: reviewerName,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0],
            isVerifiedPurchase: true, // Mocked write review as verified purchases
          };

          const updatedReviews = [newReview, ...book.reviews];
          // Recalculating rolling standard rating
          const combinedRating =
            updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;

          const updatedBook = {
            ...book,
            reviews: updatedReviews,
            rating: parseFloat(combinedRating.toFixed(1)),
          };

          // Synchronize the selected modal modal context so it refreshes visually
          if (selectedBook && selectedBook.id === bookId) {
            setSelectedBook(updatedBook);
          }

          return updatedBook;
        }
        return book;
      });
    });
  };

  const handleCheckoutSecureBegin = (discount: number, promo: string) => {
    setDiscountPercent(discount);
    setDiscountCode(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (orderData: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    totalAmount: number;
  }) => {
    // Construct dynamic order record from current cart items
    const orderNumber = 'JLV-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderNumber,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      items: cart.map((it) => ({
        bookId: it.book.id,
        title: it.book.title,
        price: it.book.price,
        quantity: it.quantity,
        coverImage: it.book.coverImage,
      })),
      totalAmount: orderData.totalAmount,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      status: 'Pending',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Subtract stock levels dynamically in our local database catalog
    setBooks((prevBooks) => {
      return prevBooks.map((book) => {
        const cartItem = cart.find((item) => item.book.id === book.id);
        if (cartItem) {
          const newStock = Math.max(0, book.stock - cartItem.quantity);
          return {
            ...book,
            stock: newStock,
          };
        }
        return book;
      });
    });

    // Clear cart entirely upon purchase completion
    setCart([]);
    setDiscountPercent(0);
    setDiscountCode('');
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setShowWishlistOnly(false);
  };

  // --- Filtering & Sorting Compute Logic ---
  const filteredBooks = books
    .filter((book) => {
      const matchCategory = activeCategory === 'All' || book.category === activeCategory;
      const matchSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchWishlist = !showWishlistOnly || wishlist.includes(book.id);

      return matchCategory && matchSearch && matchWishlist;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.rating - a.rating; // default: order by popular rating
    });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#1c1917] flex flex-col font-sans selection:bg-[#1c1917] selection:text-[#fbfbf9]">
      
      {/* Prime Header element */}
      <header className="sticky top-0 bg-[#fbfbf9]/95 backdrop-blur-md border-b border-stone-200 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Logo & title branding */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={handleResetFilters}>
            <div className="w-9 h-9 rounded-lg bg-[#1c1917] flex items-center justify-center text-[#fbfbf9] shadow-xs">
              <Bookmark className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg tracking-tight text-stone-900 block leading-none">
                Jelvan
              </span>
              <span className="text-[10px] tracking-wider font-mono uppercase text-amber-700 block leading-none mt-1">
                Books Store
              </span>
            </div>
          </div>

          {/* Centralized Search bar */}
          <div className="max-w-md w-full relative hidden md:block">
            <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-2 bg-stone-100 focus:bg-white border border-stone-200 focus:border-[#1c1917] hover:border-stone-300 rounded-full text-xs font-medium focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 focus:outline-none p-1 text-stone-400 hover:text-black cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action buttons (Wishlist & Cart) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer relative flex items-center gap-1.5 text-xs font-semibold ${
                showWishlistOnly
                  ? 'border-rose-100 bg-rose-50 text-rose-600'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-black'
              }`}
              title="Show personal Wishlist"
            >
              <Heart className={`w-4 h-4 ${showWishlistOnly ? 'fill-rose-500' : ''}`} />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-lg border border-stone-200 hover:bg-[#1c1917]/5 text-stone-800 hover:text-black transition-all cursor-pointer relative flex items-center gap-1.5 text-xs font-semibold"
              title="View Cart Drawer"
            >
              <ShoppingBag className="w-4 h-4 text-[#1c1917]" />
              <span className="hidden sm:inline">Library Cart</span>
              {cartTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-stone-900 border border-stone-100 text-[#fbfbf9] font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* User Session State action badges */}
            {currentUser ? (
              <div className="flex items-center gap-1 border border-stone-200 bg-stone-100/60 rounded-lg p-1 pr-2 shadow-2xs">
                <span className={`px-2 py-1 text-[9px] uppercase font-bold tracking-wider rounded-md text-white font-mono ${
                  currentUser.role === 'Publisher' 
                    ? 'bg-amber-600' 
                    : 'bg-rose-500'
                }`}>
                  {currentUser.role}
                </span>
                <span className="text-xs font-bold text-stone-805 px-1.5 max-w-[110px] truncate hidden sm:inline-block font-sans">
                  {currentUser.name}
                </span>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                  }}
                  className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-stone-200 cursor-pointer transition-colors"
                  title="Sign Out Workspace"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="p-2 px-3.5 rounded-lg bg-stone-900 hover:bg-[#1c1917]/90 text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs"
                title="Authenticate Desktop"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Sign In Desk</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Primary Container elements */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col">
        
        {/* Interactive Workspace modules */}
        {currentUser?.role === 'Publisher' && (
          <PublisherWorkstation
            books={books}
            orders={orders}
            onAddBook={(newBook) => setBooks((prev) => [newBook, ...prev])}
            onUpdateBook={(updatedBook) => setBooks((prev) => prev.map((b) => b.id === updatedBook.id ? updatedBook : b))}
            onDeleteBook={(bookId) => setBooks((prev) => prev.filter((b) => b.id !== bookId))}
            onUpdateOrder={(updatedOrder) => setOrders((prev) => prev.map((o) => o.id === updatedOrder.id ? updatedOrder : o))}
            merchantName={currentUser.companyName || currentUser.name}
          />
        )}

        {currentUser?.role === 'Buyer' && (
          <BuyerConsole
            user={currentUser}
            orders={orders}
            onLogout={() => setCurrentUser(null)}
            wishlistCount={wishlist.length}
          />
        )}

        {/* Mobile Search input panel */}
        <div className="relative block md:hidden mb-6">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books..."
            className="w-full pl-9 pr-4 py-2 bg-stone-100 border border-stone-200 focus:border-[#1c1917] rounded-lg text-xs font-medium focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 focus:outline-none p-1 text-stone-400 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Hero brand panel section */}
        <HeroSection />

        {/* Curator Mood Discovery Module */}
        <CurationModule books={books} onSelectBook={(b) => setSelectedBook(b)} />

        {/* Filters and Navigation controls toolbar */}
        <div id="catalog-anchor" className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8 mt-4">
          
          {/* horizontal scroll category filter tags */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    // Autofocus scroll viewport to products list smoothly
                    document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap cursor-pointer transition-all ${
                    isActive
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort selection drop dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 rounded-lg p-1.5 px-2 text-stone-800 font-semibold focus:outline-none focus:border-[#1c1917]"
            >
              <option value="popular">Popular Stars</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active search filters indicators widget */}
        {(searchQuery || showWishlistOnly || activeCategory !== 'All') && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs bg-stone-100 p-2.5 rounded-lg border border-stone-200">
            <span className="text-stone-500 font-bold uppercase text-[9px] tracking-wider">Active filters:</span>
            
            {activeCategory !== 'All' && (
              <span className="bg-white border border-stone-200 px-2 py-0.5 rounded-md text-stone-800 flex items-center gap-1 font-semibold">
                Category: {activeCategory}
                <X className="w-3 h-3 cursor-pointer text-stone-400 hover:text-black" onClick={() => setActiveCategory('All')} />
              </span>
            )}

            {searchQuery && (
              <span className="bg-white border border-stone-200 px-2 py-0.5 rounded-md text-stone-800 flex items-center gap-1 font-semibold">
                Search: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer text-stone-400 hover:text-black" onClick={() => setSearchQuery('')} />
              </span>
            )}

            {showWishlistOnly && (
              <span className="bg-white border border-stone-200 px-2 py-0.5 rounded-md text-stone-800 flex items-center gap-1 font-semibold text-rose-700">
                ⭐ Wishlisted items only
                <X className="w-3 h-3 cursor-pointer text-stone-450 hover:text-rose-900" onClick={() => setShowWishlistOnly(false)} />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-stone-500 hover:text-stone-900 underline font-bold ml-auto text-[11px]"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Catalog product grid panel */}
        <div id="catalog-grid" className="flex-1">
          {filteredBooks.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-stone-200 rounded-2xl bg-white max-w-md mx-auto my-12">
              <Bookmark className="w-12 h-12 text-stone-300 mx-auto stroke-[1] mb-3" />
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-1">No matching narratives found</h3>
              <p className="text-stone-400 text-xs px-6 leading-relaxed mb-6">
                Your filter coordinates didn't match any literary assets currently inside the catalog. Try resetting your search query or choosing another category block.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Show All Catalog
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={(b) => setSelectedBook(b)}
                  onAddToCart={(b) => handleAddToCart(b, 1)}
                  isWishlisted={wishlist.includes(book.id)}
                  onToggleWishlist={(b) => handleToggleWishlist(b)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Centralized Book Info Detailed Modal overlay */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedBook ? wishlist.includes(selectedBook.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddReview={handleAddReview}
        currentUser={currentUser}
      />

      {/* Navigation sliding drawer representing the shopping basket */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutSecureBegin}
      />

      {/* Sequential Checkout Wizard modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        discountPercent={discountPercent}
        discountCode={discountCode}
        onOrderComplete={handleOrderComplete}
      />

      {/* Dynamic Security Auth Drawer overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          // Auto-scroll screen focused context to console desk
          setTimeout(() => {
            document.getElementById(user.role === 'Publisher' ? 'publisher-workbench' : 'buyer-workbench')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }}
      />

      {/* Clean Aesthetic Footer section */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4 mt-16 border-t border-stone-850 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          {/* Branding */}
          <div className="space-y-2">
            <span className="font-serif font-black text-white text-base tracking-tight block">
              Jelvan Books Store
            </span>
            <span className="text-stone-500 font-mono text-[10px] uppercase block tracking-widest">
              A Shelter for Readers
            </span>
            <p className="text-stone-400 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
              Crafting cohesive physical and digital libraries through hand-picked selections of modern masterworks and classics.
            </p>
          </div>

          {/* Location details */}
          <div className="space-y-1 text-xs">
            <span className="text-stone-300 font-semibold block uppercase text-[10px] tracking-wider mb-1">
              Store coordinates
            </span>
            <span className="text-stone-400 block font-mono">742 Evergreen Terrace</span>
            <span className="text-stone-400 block font-mono">Springfield, USA</span>
            <span className="text-stone-400 block font-mono">Phone: +1 (555) 019-2834</span>
          </div>

          {/* Work Hours & Mocks */}
          <div className="space-y-1 text-xs md:text-right">
            <span className="text-stone-300 font-semibold block uppercase text-[10px] tracking-wider mb-1 md:text-right text-center">
              Opening Hours
            </span>
            <span className="text-stone-400 block font-mono">Mon - Fri: 09:00 - 19:30</span>
            <span className="text-stone-400 block font-mono">Sat: 10:00 - 18:00</span>
            <div className="pt-3 border-t border-stone-850 md:text-right text-center mt-3 space-y-1">
              <span className="text-stone-500 block text-[9px] font-mono leading-normal">
                This is for showcase / portfolio / project application sample for clients.
              </span>
              <span className="text-stone-500 block text-[9px] font-mono hover:text-stone-300 transition-colors">
                Released under the MIT License.
              </span>
              <span className="text-stone-500 block text-[10px] font-mono mt-1">
                © 2026 Jelvan Books. All Rights Reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
