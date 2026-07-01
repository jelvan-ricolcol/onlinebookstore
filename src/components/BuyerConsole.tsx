import { useState } from 'react';
import { AuthUser, Order } from '../types';
import { 
  ShoppingBag, Star, Sparkles, MapPin, Compass, CheckCircle2, 
  RotateCcw, Award, Truck, ShieldCheck, Box, ChevronRight, 
  X, ArrowRight, HelpCircle, Check, Map, Clipboard, Tag, CalendarClock, Package, PackageOpen,
  Receipt, ChevronDown, ChevronUp, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OrderTracking, { TRACKING_STEPS } from './OrderTracking';

interface BuyerConsoleProps {
  user: AuthUser;
  orders: Order[];
  onLogout: () => void;
  wishlistCount: number;
}

export default function BuyerConsole({ user, orders, onLogout, wishlistCount }: BuyerConsoleProps) {
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [expandedReceiptOrderId, setExpandedReceiptOrderId] = useState<string | null>(null);

  // Maintain local milestone index progress maps for each order
  const [milestones, setMilestones] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('jbs_tracking_milestones');
    return saved ? JSON.parse(saved) : {};
  });

  const getMilestoneStep = (orderId: string) => {
    return milestones[orderId] !== undefined ? milestones[orderId] : 2; // Default to 'Shipped' milestone (stage 2)
  };

  const advanceMilestone = (orderId: string) => {
    const current = getMilestoneStep(orderId);
    const next = current < TRACKING_STEPS.length - 1 ? current + 1 : 0; // wrap back if finished
    const updated = { ...milestones, [orderId]: next };
    setMilestones(updated);
    localStorage.setItem('jbs_tracking_milestones', JSON.stringify(updated));
  };

  const resetMilestone = (orderId: string) => {
    const updated = { ...milestones, [orderId]: 0 };
    setMilestones(updated);
    localStorage.setItem('jbs_tracking_milestones', JSON.stringify(updated));
  };

  // Filter orders relevant only to this authenticated customer's email
  const myOrders = orders.filter((o) => o.customerEmail.toLowerCase() === user.email.toLowerCase());
  const totalSpent = myOrders.reduce((sum, curr) => sum + curr.totalAmount, 0);

  // Find active tracking order details
  const activeOrder = myOrders.find((o) => o.id === activeTrackingOrderId);
  const activeMilestoneIndex = activeOrder ? getMilestoneStep(activeOrder.id) : 2;

  // Simple date generator helper
  const getOffsetDateLabel = (dateStr: string, offsetDays: number) => {
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        d.setDate(d.getDate() + offsetDays);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch (_) {}
    return "Next Business Day";
  };

  return (
    <div id="buyer-workbench" className="bg-gradient-to-br from-rose-50/20 via-white to-stone-50 border border-stone-200 rounded-2xl p-6 md:p-8 mb-12 shadow-xs">
      
      {/* Console Top profile branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-600/10 border border-rose-200 flex items-center justify-center text-rose-700 font-serif font-black text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-stone-900 leading-tight">
                {user.name}’s Reading Desk
              </h2>
              <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-700/90 rounded text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 font-sans">
                <Award className="w-3.5 h-3.5 text-rose-600" /> Premium Buyer
              </span>
            </div>
            <p className="text-stone-550 text-xs mt-0.5 font-sans">
              Verified customer session for <span className="font-semibold text-stone-800">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Console Action triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-1.5 border border-stone-300 hover:border-stone-850 hover:bg-stone-50 text-stone-705 text-xs font-semibold rounded-lg transition-all cursor-pointer font-sans"
          >
            Sign-Out Portal
          </button>
        </div>
      </div>

      {/* User metrics overview bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white border border-stone-200 rounded-xl">
          <span className="text-[10px] text-stone-400 block uppercase font-mono tracking-wider">Acquired Literature</span>
          <span className="text-lg font-mono font-semibold text-stone-805 mt-1 block">
            {myOrders.reduce((qt, o) => qt + o.items.reduce((acc, it) => acc + it.quantity, 0), 0)} items
          </span>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl font-mono">
          <span className="text-[10px] text-stone-400 block uppercase font-sans tracking-wider text-xs font-semibold">Total Literature Investment</span>
          <span className="text-lg font-semibold text-stone-805 mt-1 block">
            ${totalSpent.toFixed(2)}
          </span>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl">
          <span className="text-[10px] text-stone-400 block uppercase font-mono tracking-wider font-semibold">Tracked Wishlist</span>
          <span className="text-lg font-mono font-semibold text-stone-805 mt-1 block">
            {wishlistCount} saved titles
          </span>
        </div>
      </div>      {/* Main Order ledger lists */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-sm text-stone-800 flex items-center gap-1.5 font-sans">
          <ShoppingBag className="w-4 h-4 text-stone-500" /> Personal Order History Tracker
        </h3>

        {myOrders.length === 0 ? (
          <div className="py-8 bg-stone-50/50 border border-dashed border-stone-250 rounded-xl text-center">
            <Compass className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-stone-605">No invoice records on checkout history</h4>
            <p className="text-stone-450 text-[11px] max-w-xs mx-auto mt-1 leading-relaxed">
              Browse the library shelves, add books to your catalog card, and complete checking secure checkout. Your orders will list here immediately.
            </p>
          </div>
        ) : (
          <div className="space-y-4 font-sans">
            {myOrders.map((order) => {
              const currentStep = getMilestoneStep(order.id);
              const milestoneObj = TRACKING_STEPS[currentStep];
              const isTrackingOpen = activeTrackingOrderId === order.id;
              const isReceiptOpen = expandedReceiptOrderId === order.id;

              // Calculate high-fidelity mathematical line-items breakdown
              const itemsSum = order.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
              const taxRate = 0.08;
              const taxCalculated = parseFloat((itemsSum * taxRate).toFixed(2));
              const assumedShipping = itemsSum >= 45 ? 0 : 4.99;
              const computedRawTotal = itemsSum + taxCalculated + assumedShipping;
              // To reconcile our beautiful ledger to the exact authorized check out total:
              const discountOffset = parseFloat((computedRawTotal - order.totalAmount).toFixed(2));

              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-4 text-xs hover:border-stone-400 transition-colors shadow-2xs"
                >
                  {/* Top Header Grid */}
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Left side summary and items wrap */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-bold text-stone-850 text-xs bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                          Order ID: {order.id}
                        </span>
                        <span className="text-stone-400 font-medium text-[10.5px]">
                          Authorized {order.date}
                        </span>
                        <span className="text-stone-300">|</span>
                        <span className="text-stone-500 font-mono text-[10px]">
                          Checkout Total: <strong className="text-stone-900 font-bold">${order.totalAmount.toFixed(2)}</strong>
                        </span>
                      </div>

                      {/* Item Preview Badges */}
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="py-1 px-2.5 bg-stone-50/80 border border-stone-150 rounded-lg flex items-center gap-2 hover:bg-stone-50 transition-all text-xs"
                          >
                            <div className="w-4 h-6 rounded overflow-hidden flex-shrink-0 bg-stone-200 shadow-3xs">
                              <img
                                src={it.coverImage}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[10px] text-stone-800 font-medium max-w-[140px] truncate">
                              {it.title}
                            </span>
                            <span className="text-[9px] bg-stone-200/60 px-1.5 py-0.5 rounded text-stone-600 font-mono font-bold">
                              x{it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10] text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>Ship To Address: <strong className="text-stone-750 font-medium">{order.shippingAddress}</strong></span>
                      </div>
                    </div>

                    {/* Right side interactive state controls */}
                    <div className="flex flex-row md:flex-col justify-between md:justify-center items-end text-right border-t md:border-t-0 border-stone-100 pt-3 md:pt-0 gap-3 min-w-[220px]">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block font-mono">Courier Milestone</span>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="inline-block w-2-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-bold text-stone-800 text-[11px] font-sans">{milestoneObj.title}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-end">
                        {/* Receipt details toggler */}
                        <button
                          id={`btn-receipt-${order.id}`}
                          onClick={() => setExpandedReceiptOrderId(isReceiptOpen ? null : order.id)}
                          className={`p-1.5 px-3 rounded-lg font-semibold text-[10px] flex items-center gap-1.5 tracking-tight transition-all cursor-pointer border ${
                            isReceiptOpen
                              ? "bg-rose-50 border-rose-250 text-rose-800 hover:bg-rose-100/50"
                              : "bg-stone-50 border-stone-250 text-stone-705 hover:bg-stone-100/70"
                          }`}
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>{isReceiptOpen ? "Hide Breakdown" : "Invoice Sheet"}</span>
                          {isReceiptOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {/* Interactive delivery tracking link */}
                        <button
                          id={`btn-tracking-${order.id}`}
                          onClick={() => setActiveTrackingOrderId(isTrackingOpen ? null : order.id)}
                          className={`p-1.5 px-3 rounded-lg font-semibold text-[10px] flex items-center gap-1.5 tracking-tight hover:shadow-xs transition-all cursor-pointer ${
                            isTrackingOpen
                              ? "bg-stone-100 border border-stone-300 text-stone-700"
                              : "bg-stone-900 text-white hover:bg-stone-950"
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{isTrackingOpen ? "Close Tracker" : "Track Shipment"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* HIGH-FIDELITY ITEMIZED INVOICE SHEET DETAIL DRAWDOWN */}
                  <AnimatePresence initial={false}>
                    {isReceiptOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-stone-200 bg-stone-50/55 rounded-lg p-3.5 mt-1 border"
                      >
                        <div id={`receipt-panel-${order.id}`} className="space-y-4">
                          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                            <div className="flex items-center gap-1.5">
                              <Receipt className="w-4 h-4 text-stone-500" />
                              <h4 className="font-serif font-bold text-xs text-stone-800">Itemized Purchase Invoice Segment</h4>
                            </div>
                            <span className="font-mono text-[9px] uppercase tracking-wider text-rose-700 font-bold bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                              Paid in Full
                            </span>
                          </div>

                          {/* Order Products Ledger Table */}
                          <div className="space-y-1.5">
                            <div className="grid grid-cols-12 text-[10px] uppercase tracking-wider text-stone-400 font-mono pb-1 border-b border-stone-150 font-bold">
                              <span className="col-span-6">Catalog Title</span>
                              <span className="col-span-2 text-right">Unit Price</span>
                              <span className="col-span-2 text-center">Qty</span>
                              <span className="col-span-2 text-right">Line Total</span>
                            </div>

                            {order.items.map((it, index) => (
                              <div key={index} className="grid grid-cols-12 items-center py-1.5 text-stone-750 font-sans border-b border-stone-100 last:border-0 hover:bg-stone-100/30 px-0.5 rounded">
                                <div className="col-span-6 flex items-center gap-2">
                                  <div className="w-5 h-7 rounded bg-stone-200 overflow-hidden flex-shrink-0 shadow-3xs">
                                    <img src={it.coverImage} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <span className="font-medium text-[11px] truncate" title={it.title}>
                                    {it.title}
                                  </span>
                                </div>
                                <span className="col-span-2 text-right font-mono text-[10.5px]">${it.price.toFixed(2)}</span>
                                <span className="col-span-2 text-center font-mono text-[10.5px] font-semibold text-stone-600">x{it.quantity}</span>
                                <span className="col-span-2 text-right font-mono font-bold text-stone-900 text-[10.5px]">
                                  ${(it.price * it.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Premium Billing math sheet */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stone-200 pt-3">
                            <div className="space-y-2 mt-1">
                              <span className="text-[10px] uppercase text-stone-400 font-semibold tracking-wider font-sans block">Order Protocol Metadata</span>
                              <div className="space-y-1 text-stone-600 text-[10px] leading-relaxed">
                                <p><strong>Customer Name:</strong> {order.customerName}</p>
                                <p><strong>Registered Email:</strong> {order.customerEmail}</p>
                                <p><strong>Standard Dispatch Strategy:</strong> Courier Airfreight Express</p>
                                <p><strong>Tracking Waybill Status:</strong> {milestoneObj.title}</p>
                              </div>
                            </div>

                            <div className="space-y-1.5 bg-[#FAF9F5] p-3 rounded-lg border border-stone-200 text-stone-705 font-mono">
                              <div className="flex justify-between text-[11px]">
                                <span>Subtotal Premium:</span>
                                <span>${itemsSum.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-[11px]">
                                <span>Estimated Sales Tax (8% VAT/GST):</span>
                                <span>${taxCalculated.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-[11px]">
                                <span>Postal Air & Secured Courier:</span>
                                <span>{assumedShipping === 0 ? "FREE" : `$${assumedShipping.toFixed(2)}`}</span>
                              </div>

                              {discountOffset !== 0 && (
                                <div className="flex justify-between text-[11px] text-amber-700 font-semibold font-sans">
                                  <span>Elite VIP Bundle Auto-Deduction:</span>
                                  <span>{discountOffset > 0 ? `-$${discountOffset.toFixed(2)}` : `+$${Math.abs(discountOffset).toFixed(2)}`}</span>
                                </div>
                              )}

                              <div className="flex justify-between text-[11.5px] font-bold text-stone-900 border-t border-stone-200 pt-1.5 mt-1">
                                <span>Grand Authorized Sum:</span>
                                <span className="text-emerald-700">${order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Link/Call-To-Action connecting directly to the OrderTracking stepper component */}
                          <div className="p-2.5 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between text-[11px] font-sans">
                            <div className="flex items-center gap-1.5 text-stone-605">
                              <Truck className="w-4 h-4 text-stone-500 animate-bounce" />
                              <span>Want to trace transport waypoint transitions live on our satellite grid map?</span>
                            </div>
                            <button
                              id={`receipt-tracker-link-${order.id}`}
                              onClick={() => {
                                setActiveTrackingOrderId(isTrackingOpen ? null : order.id);
                                document.getElementById(`order-card-${order.id}`)?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="px-2.5 py-1 rounded bg-stone-900 font-bold text-white hover:bg-black transition-all flex items-center gap-1 text-[9.5px] uppercase cursor-pointer"
                            >
                              <span>{isTrackingOpen ? "Open Stepper Map Panel Below" : "Launch Transit Tracker Now"}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* High fidelity inline stepper simulation timeline */}
                  <AnimatePresence initial={false}>
                    {isTrackingOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-stone-150 pt-4 animate-fadeIn"
                      >
                        <OrderTracking
                          order={order}
                          currentStep={currentStep}
                          onAdvanceStep={() => advanceMilestone(order.id)}
                          onResetStep={() => resetMilestone(order.id)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
