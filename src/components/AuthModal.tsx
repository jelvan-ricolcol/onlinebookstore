import { useState, FormEvent } from 'react';
import { AuthUser } from '../types';
import { X, ShieldCheck, Mail, Lock, User, Briefcase, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'buyer' | 'publisher'>('buyer');
  
  // Buyer form states
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  
  // Publisher form states
  const [publisherName, setPublisherName] = useState('');
  const [publisherEmail, setPublisherEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmitBuyer = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!buyerName.trim() || !buyerEmail.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    if (!buyerEmail.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: buyerName.trim(),
      email: buyerEmail.trim().toLowerCase(),
      role: 'Buyer',
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleSubmitPublisher = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!publisherName.trim() || !publisherEmail.trim() || !companyName.trim()) {
      setError('Please fill out all publisher fields.');
      return;
    }

    if (!publisherEmail.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    const newUser: AuthUser = {
      id: `pub-${Date.now()}`,
      name: publisherName.trim(),
      email: publisherEmail.trim().toLowerCase(),
      role: 'Publisher',
      companyName: companyName.trim(),
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickLogin = (role: 'Buyer' | 'Publisher') => {
    if (role === 'Buyer') {
      const newUser: AuthUser = {
        id: 'usr-default-buyer',
        name: 'Rachel Jelvan',
        email: 'rjelvanbaloaloa@gmail.com',
        role: 'Buyer'
      };
      onLoginSuccess(newUser);
    } else {
      const newUser: AuthUser = {
        id: 'pub-default-publisher',
        name: 'Jelvan Editorial Collective',
        email: 'collective@jelvanbooks.com',
        role: 'Publisher',
        companyName: 'Jelvan Press & Partners'
      };
      onLoginSuccess(newUser);
    }
    onClose();
  };

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
          transition={{ duration: 0.25 }}
          className="relative bg-[#fbfbf9] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-stone-200 z-10 flex flex-col"
        >
          {/* Close Trigger Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-black hover:bg-stone-100 transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Brand Header */}
          <div className="p-6 bg-white border-b border-stone-150 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-[#fbfbf9] flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 leading-none">
              Jelvan Books Console
            </h3>
            <p className="text-stone-400 text-xs mt-1.5 font-light">
              Sign in to manage purchases, curate titles, or update drafts
            </p>
          </div>

          {/* Role Tab Selector switches */}
          <div className="flex border-b border-stone-200 bg-stone-50/50">
            <button
              onClick={() => {
                setActiveTab('buyer');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer focus:outline-none ${
                activeTab === 'buyer'
                  ? 'border-stone-900 text-stone-900 bg-white font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-605'
              }`}
            >
              Buyer Portal
            </button>
            <button
              onClick={() => {
                setActiveTab('publisher');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer focus:outline-none ${
                activeTab === 'publisher'
                  ? 'border-stone-900 text-stone-900 bg-white font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-605'
              }`}
            >
              Publisher Desk
            </button>
          </div>

          {/* Form and Quick login panel */}
          <div className="p-6 space-y-4">
            {error && (
              <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-md">
                {error}
              </p>
            )}

            {activeTab === 'buyer' ? (
              <form onSubmit={handleSubmitBuyer} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      required
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Rachel Sterling"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      required
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="e.g. rachel@example.com"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="password"
                      placeholder="• • • • • •"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-100 border border-stone-200 text-stone-400 rounded-lg cursor-not-allowed focus:outline-none"
                      disabled
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm pt-2"
                >
                  Enter Buyer Experience
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitPublisher} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    Publisher Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      required
                      type="text"
                      value={publisherName}
                      onChange={(e) => setPublisherName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    Company / Press label
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      required
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Vance Literary Collective"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    Email coordinates
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      required
                      type="email"
                      value={publisherEmail}
                      onChange={(e) => setPublisherEmail(e.target.value)}
                      placeholder="e.g. curator@vancestudio.com"
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Enter Publisher Editor Workstation
                </button>
              </form>
            )}

            {/* Quick Demo Credentials block */}
            <div className="pt-4 border-t border-stone-200 text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center justify-center gap-1">
                <KeyRound className="w-3.5 h-3.5" /> Guest Accounts Showcase Login
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Buyer')}
                  className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100/80 border border-rose-100 text-rose-700 rounded-lg text-[10px] font-bold tracking-tight cursor-pointer transition-colors"
                >
                  Sign-In as Buyer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Publisher')}
                  className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-100 text-amber-700 override-text rounded-lg text-[10px] font-bold tracking-tight cursor-pointer transition-colors"
                >
                  Sign-In as Publisher
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
