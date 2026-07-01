import { useState, FormEvent } from 'react';
import { CartItem } from '../types';
import { X, Check, CreditCard, Landmark, Truck, ShieldCheck, Mail, MapPin, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountPercent: number;
  discountCode: string;
  onOrderComplete: (orderData: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    totalAmount: number;
  }) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  discountPercent,
  discountCode,
  onOrderComplete,
}: CheckoutModalProps) {
  const [step, setStep] = useState(1); // Steps: 1 (Shipping), 2 (Billing Summary), 3 (Success Card)
  
  // Shipping form fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [shippingError, setShippingError] = useState('');

  // Billing form fields state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [billingError, setBillingError] = useState('');

  // Generated Order Details State
  const [generatedId, setGeneratedId] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  if (!isOpen) return null;

  // Calculates financial balances
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.book.price * curr.quantity, 0);
  const discountAmount = subtotal * discountPercent;
  const shippingCharge = subtotal > 50 || subtotal === 0 ? 0 : 4.99;
  const estimatedTax = (subtotal - discountAmount) * 0.0825;
  const grandTotal = subtotal - discountAmount + shippingCharge + estimatedTax;

  const handleNextStepShipping = (e: FormEvent) => {
    e.preventDefault();
    setShippingError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !postalCode.trim()) {
      setShippingError('Please fill out all required shipping and contact information.');
      return;
    }

    if (!email.includes('@') || email.length < 5) {
      setShippingError('Please provide a valid email format.');
      return;
    }

    setStep(2);
  };

  const handleCompleteOrderPayment = (e: FormEvent) => {
    e.preventDefault();
    setBillingError('');

    if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
      setBillingError('Please fill out all card payment details.');
      return;
    }

    // Auto generate mock receipt details
    const orderNumber = 'JLV-' + Math.floor(100000 + Math.random() * 900000);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const dateFormatted = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    setGeneratedId(orderNumber);
    setEstimatedDelivery(dateFormatted);

    // Trigger parent hook
    onOrderComplete({
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      shippingAddress: `${address}, ${city}, ${postalCode}`,
      totalAmount: grandTotal,
    });

    setStep(3);
  };

  const handleDismissAndReset = () => {
    // Reset forms and exit
    setStep(1);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setPostalCode('');
    setCardName('');
    setCardNumber('4111 2222 3333 4444');
    setExpiry('12/28');
    setCvv('123');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 3 ? handleDismissAndReset : onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Modal core window */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#fbfbf9] w-full max-w-2xl rounded-2xl overflow-hidden border border-stone-200 shadow-2xl z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white text-stone-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-stone-800" />
              <h3 className="font-serif font-bold text-lg">Secure Checking Desk</h3>
            </div>
            {step < 3 && (
              <button
                onClick={onClose}
                className="p-1 rounded-full text-stone-400 hover:text-black hover:bg-stone-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Progress bar indicators */}
          {step < 3 && (
            <div className="bg-stone-50 py-3.5 px-6 border-b border-stone-100 flex items-center justify-center gap-4 text-xs font-medium text-stone-400">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#1c1917]' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-[#1c1917] text-[#fbfbf9]' : 'bg-stone-200'}`}>1</span>
                <span>Delivery Address</span>
              </div>
              <div className="w-8 h-[1px] bg-stone-200" />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#1c1917]' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-[#1c1917] text-[#fbfbf9]' : 'bg-stone-200'}`}>2</span>
                <span>Payment details</span>
              </div>
            </div>
          )}

          {/* Body Content area scrollable */}
          <div className="p-6 md:p-8 overflow-y-auto flex-1 font-sans">
            {step === 1 && (
              <form onSubmit={handleNextStepShipping} className="space-y-4">
                <h4 className="font-serif font-bold text-base text-stone-800 flex items-center gap-2 mb-2">
                  <Truck className="w-4.5 h-4.5 text-stone-600" />
                  Courier Shipping Coordinates
                </h4>

                {shippingError && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                    {shippingError}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      First Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. John"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Last Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Vance"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      E-Mail Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                    Street Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 742 Evergreen Terrace"
                      className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      City / Region *
                    </label>
                    <input
                      required
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Springfield"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Postal Zipcode *
                    </label>
                    <input
                      required
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 90210"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1c1917] hover:bg-stone-850 text-[#fbfbf9] rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                  >
                    Proceed to Payment Details
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleCompleteOrderPayment} className="space-y-6">
                <div className="bg-stone-50 p-4 border border-stone-200 rounded-xl space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500">Order Totals Review</h4>
                  <div className="grid grid-cols-2 gap-y-1 text-xs font-mono text-stone-600">
                    <span>Subtotal:</span>
                    <span className="text-right">${subtotal.toFixed(2)}</span>
                    
                    {discountPercent > 0 && (
                      <>
                        <span className="text-emerald-700">Coupon Discount ({discountCode}):</span>
                        <span className="text-right text-emerald-700">-${discountAmount.toFixed(2)}</span>
                      </>
                    )}
                    <span>Est. Taxes:</span>
                    <span className="text-right">${estimatedTax.toFixed(2)}</span>
                    
                    <span>Shipping Charges:</span>
                    <span className="text-right">{shippingCharge === 0 ? 'FREE' : `$${shippingCharge.toFixed(2)}`}</span>
                    
                    <div className="col-span-2 border-t border-stone-200 my-1.5" />
                    
                    <span className="font-serif font-bold text-stone-900 text-sm">Grand Total Amount:</span>
                    <span className="text-right text-stone-950 font-bold text-sm">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-base text-stone-850 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-stone-700" />
                    Secure Simulated Card Credentials
                  </h4>

                  {billingError && (
                    <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg">
                      {billingError}
                    </p>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      required
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. John Vance"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="bg-stone-100 p-3.5 rounded-lg border border-stone-200/60 text-stone-600 space-y-1 text-[11px] font-mono mb-3">
                    <div className="flex items-center gap-1.5 font-bold text-stone-700 mb-1.5 uppercase">
                      <Landmark className="w-3.5 h-3.5" /> Simulated checkout terminal
                    </div>
                    <span>For sandbox exploration, simple realistic inputs are already auto-filled below. Feel free to substitute. No genuine money is processed.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                        Card Number
                      </label>
                      <input
                        required
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                          Expiry
                        </label>
                        <input
                          required
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-2 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                          CVV
                        </label>
                        <input
                          required
                          type="password"
                          maxLength={4}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="***"
                          className="w-full px-2 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-stone-500 hover:text-stone-900 font-semibold cursor-pointer underline"
                  >
                    Back to Shipping Coordinates
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm rounded-lg"
                  >
                    Verify & Complete Secure Payment
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                {/* Checkmark Celebration */}
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-650 mx-auto shadow-md">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-2xl text-stone-900">
                    Your Order is Confirmed!
                  </h3>
                  <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed">
                    Thank you for patronizing **Jelvan Books Store**. Your literary parcel is already being hand-bundled by our staff.
                  </p>
                </div>

                {/* Printable Receipt Layout */}
                <div id="receipt-details" className="bg-white border border-stone-200 p-5 rounded-xl max-w-md mx-auto text-left font-mono text-xs space-y-3.5 shadow-sm relative">
                  <div className="border-b border-dashed border-stone-200 pb-3 block">
                    <span className="font-bold text-stone-850 block uppercase text-[10px] text-center mb-1">
                      Jelvan Books Store Receipt
                    </span>
                    <span className="text-[10px] text-stone-400 block text-center">
                      May 31, 2026 • Secure Merchant ID: #JBS-729
                    </span>
                  </div>

                  <div className="space-y-1 pb-3 border-b border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-400">ORDER NO:</span>
                      <span className="font-bold text-stone-800">{generatedId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">DESPATCH COURIER:</span>
                      <span className="text-stone-800">Priority Ground</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">EST. ARRIVAL:</span>
                      <span className="text-stone-800 font-bold">{estimatedDelivery}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pb-3 border-b border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block">Shipped To:</span>
                    <p className="text-stone-700 leading-relaxed font-sans text-xs">
                      <strong className="font-semibold">{firstName} {lastName}</strong><br />
                      {address}<br />
                      {city}, {postalCode}<br />
                      {phone}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">Parcel Contents:</span>
                    {cartItems.map((item) => (
                      <div key={item.book.id} className="flex justify-between text-stone-600 text-xs">
                        <span className="truncate max-w-[200px]">{item.book.title} (x{item.quantity})</span>
                        <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-dashed border-stone-200 pt-2.5 mt-2 flex justify-between font-bold text-stone-900 text-sm">
                      <span className="font-serif font-black">Paid Total:</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-4">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Invoice
                  </button>
                  <button
                    onClick={handleDismissAndReset}
                    className="px-6 py-2 bg-[#1c1917] hover:bg-stone-850 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
