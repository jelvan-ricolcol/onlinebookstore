import { useState } from 'react';
import { Order } from '../types';
import { 
  Box, ShieldCheck, Truck, Map, CheckCircle2, 
  ArrowRight, RotateCcw, Calendar, FileText, MapPin, Navigation, Tag, Clipboard
} from 'lucide-react';
import { motion } from 'motion/react';

interface OrderTrackingProps {
  order: Order;
  currentStep: number;
  onAdvanceStep: () => void;
  onResetStep: () => void;
}

export const TRACKING_STEPS = [
  { 
    title: "Order Placed", 
    statusLabel: "Authorized & Allocated", 
    desc: "Inventory allocated, invoice record generated in publisher database", 
    icon: Box,
    hub: "Manila Distribution Hub",
    activity: "Requested custom editions retrieved from climate-controlled archiving vault."
  },
  { 
    title: "Processed", 
    statusLabel: "Prepared with Craft Wrap", 
    desc: "Secured in custom protective packaging boards and bookmarked", 
    icon: ShieldCheck,
    hub: "Makati Curation Center",
    activity: "Wrapped in acid-free tissue paper, wax-sealed, and hand-inspected for pristine margins."
  },
  { 
    title: "Shipped", 
    statusLabel: "Handed over to Express Cargo", 
    desc: "Dispatched on premium courier route with tracking index", 
    icon: Truck,
    hub: "Luzon Logistics Expressway",
    activity: "In-transit with registered courier flight. Waybill scanner logged."
  },
  { 
    title: "Local Hub", 
    statusLabel: "Out on Courier Route", 
    desc: "Dispatched with local parcel courier carrier to delivery zone", 
    icon: Map,
    hub: "Pasig Cargo Terminal",
    activity: "Sorted into regional delivery vehicle queue. Estimated doorstep dispatch active."
  },
  { 
    title: "Delivered", 
    statusLabel: "Hand-signed & Completed", 
    desc: "Handover completed with proof-of-recipient signature", 
    icon: CheckCircle2,
    hub: "Recipient Resident Gateway",
    activity: "Delivered to shelf collector. Delivery waybill archive permanently stored in ledger."
  }
];

export default function OrderTracking({ order, currentStep, onAdvanceStep, onResetStep }: OrderTrackingProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Helper to format days added
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

  const activeStepObj = TRACKING_STEPS[currentStep] || TRACKING_STEPS[0];

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
      {/* Waybill quick address & details summary bar */}
      <div className="p-4 bg-stone-50 border-b border-stone-150 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="space-y-1">
          <span className="text-[9px] uppercase text-stone-400 font-sans block font-semibold hover:text-stone-600 transition-colors">
            Transit Reference Index
          </span>
          <div className="flex items-center gap-1.5">
            <Clipboard className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-850 font-bold">JLV-TRK-{order.id.replace(/\D/g, '') || '9124'}-EXP</span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] uppercase text-stone-400 font-sans block font-semibold">
            Recipient Coordinates
          </span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="text-stone-750 font-sans font-medium line-clamp-1 truncate block max-w-[150px]">
              {order.shippingAddress}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] uppercase text-stone-400 font-sans block font-semibold">
            Waybill ETA Plan
          </span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-stone-850 font-sans font-bold">
              {getOffsetDateLabel(order.date, 3)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual timeline stepper container */}
      <div className="p-6 md:p-8">
        
        {/* Progress Stepper Trail */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-4 mb-8">
          
          {/* Background Connecting bar line (hidden on mobile, shown on desktop) */}
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 right-3.5 h-[2px] bg-stone-100 hidden md:block z-0" />
          
          {/* Active green connecting bar line */}
          <div 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[2px] bg-stone-900 hidden md:block z-0 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
          />

          {TRACKING_STEPS.map((step, idx) => {
            const isPassed = idx <= currentStep;
            const isCurrent = idx === currentStep;
            const StepIcon = step.icon;

            return (
              <div 
                key={step.title}
                className="relative flex md:flex-col items-center md:items-center gap-4 md:gap-2 z-10 flex-1 w-full"
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Visual marker node bubble */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-crosshair ${
                    isCurrent
                      ? "bg-rose-600 text-white shadow-md ring-4 ring-rose-100"
                      : isPassed
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-400 border border-stone-250"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </motion.div>

                {/* Captions */}
                <div className="text-left md:text-center">
                  <h4 className={`text-[11px] font-bold tracking-tight ${
                    isCurrent ? "text-rose-600" : isPassed ? "text-stone-850" : "text-stone-400"
                  }`}>
                    {step.title}
                  </h4>
                  <span className="text-[9px] font-mono text-stone-400 block md:mt-0.5">
                    {getOffsetDateLabel(order.date, idx)}
                  </span>
                </div>

                {isCurrent && (
                  <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-rose-600 animate-ping hidden md:block" />
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Detail Panel representing selected/active timeline stage */}
        <motion.div 
          layout
          className="p-4 bg-stone-50 border border-stone-150 rounded-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200/60 font-sans">
            <div className="flex items-center gap-1.5">
              <span className="p-1 px-2 text-[9px] font-mono font-bold uppercase rounded bg-rose-50 border border-rose-200 text-rose-700">
                Hub Activity
              </span>
              <span className="text-stone-450 text-[11px] font-mono">&bull; {activeStepObj.hub}</span>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeStepObj.statusLabel}</span>
            </div>
          </div>

          <p className="text-xs text-stone-650 leading-relaxed pt-2.5 font-sans">
            {activeStepObj.activity}
          </p>
        </motion.div>

      </div>

      {/* Control panel for simulating transitions (Sandbox tools) */}
      <div className="px-5 py-3.5 bg-stone-50/80 border-t border-stone-150 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-stone-500 font-sans select-none">
          <Navigation className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-[10px] leading-tight font-mono">
            <strong>Simulation Sandbox:</strong> Control courier tracking checkpoints manually to inspect design transitions.
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto self-end shrink-0">
          <button
            onClick={onAdvanceStep}
            className="flex-1 sm:flex-none px-3.5 py-1.5 bg-stone-900 hover:bg-black text-[#fbfbf9] rounded-lg tracking-tight font-bold transition-all flex items-center justify-center gap-1.5 hover:shadow-2xs cursor-pointer select-none font-sans"
            title="Move cargo timeline further"
          >
            <span>Advance Transit State</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onResetStep}
            className="p-1.5 bg-white border border-stone-250 hover:bg-stone-50 text-stone-500 hover:text-stone-850 rounded-lg transition-all cursor-pointer"
            title="Reset Cargo Log Timeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
