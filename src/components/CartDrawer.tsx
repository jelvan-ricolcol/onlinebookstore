import { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, ShoppingBag, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onCheckout: (appliedDiscount: number, discountCode: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [appliedCode, setAppliedCode] = useState('');

  if (!isOpen) return null;

  // Recalculating subtotals
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.book.price * curr.quantity, 0);
  const discountAmount = subtotal * discountPercent;
  const shippingCharge = subtotal > 50 || subtotal === 0 ? 0 : 4.99;
  const estimatedTax = (subtotal - discountAmount) * 0.0825; // 8.25% sales tax
  const total = subtotal - discountAmount + shippingCharge + estimatedTax;

  const handleApplyPromo = () => {
    setPromoError('');
    if (promoInput.trim().toUpperCase() === 'JELVAN10') {
      setDiscountPercent(0.10);
      setAppliedCode('JELVAN10 (10% Off)');
      setPromoInput('');
    } else if (promoInput.trim().toUpperCase() === 'READMORE') {
      setDiscountPercent(0.15);
      setAppliedCode('READMORE (15% Off)');
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon. Try JELVAN10 or READMORE');
    }
  };

  const handleRemovePromo = () => {
    setDiscountPercent(0);
    setAppliedCode('');
    setPromoError('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop modal overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Drawer Sliding Body */}
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-stone-100"
          >
            {/* Header layout */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-stone-700" />
                <h2 className="font-serif font-bold text-lg text-stone-900">Your Shopping Library</h2>
              </div>
              <span className="bg-stone-100 text-stone-850 px-2 py-0.5 rounded-full font-mono text-xs font-semibold">
                {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items
              </span>
              <button
                onClick={onClose}
                className="p-1 text-stone-400 hover:text-black hover:bg-stone-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List scroll panel */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 mb-4 shadow-xs">
                    <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                  </div>
                  <h3 className="font-serif font-semibold text-stone-800 text-base mb-1">Your bookshelf is empty</h3>
                  <p className="text-stone-400 text-xs max-w-[240px] leading-relaxed mb-6">
                    Looks like you haven't selected any literary treasures to checkout yet.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Browse the Collection
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.book.id}
                    className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-105/60 relative group"
                  >
                    <div className="w-16 h-22 bg-white rounded-md border border-stone-200 overflow-hidden shadow-xs flex-shrink-0">
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="font-serif font-bold text-sm text-stone-850 line-clamp-1 mb-0.5">
                        {item.book.title}
                      </h4>
                      <p className="text-stone-500 text-xs italic mb-2 line-clamp-1">by {item.book.author}</p>

                      <div className="flex items-center justify-between">
                        {/* Dynamic Quantity Increments */}
                        <div className="flex items-center gap-1 border border-stone-200 bg-white rounded-md p-0.5">
                          <button
                            onClick={() => onUpdateQty(item.book.id, item.quantity - 1)}
                            className="w-5 h-5 text-stone-500 font-bold hover:bg-stone-100 rounded-sm flex items-center justify-center transition-colors text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono text-xs text-stone-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.book.id, item.quantity + 1)}
                            disabled={item.quantity >= item.book.stock}
                            className="w-5 h-5 text-stone-500 font-bold hover:bg-stone-100 rounded-sm flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-xs"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono text-xs font-semibold text-stone-800">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Trash buttons */}
                    <button
                      onClick={() => onRemoveItem(item.book.id)}
                      className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-rose-600 rounded-lg bg-stone-50 group-hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Calculations and Promo triggers at bottom */}
            {cartItems.length > 0 && (
              <div className="border-t border-stone-200 p-6 bg-stone-50/50 space-y-4">
                {/* Promo Code section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                      Apply Promotion Code
                    </label>
                    <span className="text-[9px] text-stone-400 font-mono">(Try: JELVAN10 for 10% off)</span>
                  </div>

                  {appliedCode ? (
                    <div className="flex items-center justify-between p-2 bg-emerald-55/70 border border-emerald-150 rounded-lg text-emerald-800 text-xs">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Percent className="w-3.5 h-3.5" /> Applied Code: <strong className="font-bold">{appliedCode}</strong>
                      </span>
                      <button
                        onClick={handleRemovePromo}
                        className="text-[10px] underline font-bold uppercase hover:text-emerald-950 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="e.g. JELVAN10"
                        className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 text-xs font-mono uppercase"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-3.5 py-1.5 bg-stone-800 hover:bg-black text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && <p className="text-[10px] text-rose-600 font-mono italic">{promoError}</p>}
                </div>

                {/* Subtotals & Taxes breakdown */}
                <div className="space-y-1.5 font-mono text-xs text-stone-600 pt-3 border-t border-stone-200">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-650">
                      <span>Discount ({(discountPercent * 100).toFixed(0)}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{shippingCharge === 0 ? 'FREE' : `$${shippingCharge.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8.25%):</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-900 font-semibold text-sm pt-2.5 border-t border-stone-200">
                    <span className="font-serif">Total Summary:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Complete checkout button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onCheckout(discountPercent, appliedCode)}
                  className="w-full mt-4 py-3 bg-[#1c1917] hover:bg-stone-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md group"
                >
                  Proceed to Secure Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
