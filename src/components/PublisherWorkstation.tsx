import { useState, FormEvent } from 'react';
import { Book, Order, Category } from '../types';
import { CATEGORIES } from '../data/books';
import { 
  Plus, BookOpen, DollarSign, Archive, TrendingUp, Sparkles, Sliders, Trash2, Edit2, RotateCcw, HelpCircle, 
  Check, Briefcase, Search, Printer, ArrowUpDown, User, Mail, MapPin, SlidersHorizontal, Box, ShieldCheck, 
  Truck, Map, CheckCircle2, ChevronDown, ChevronUp, FileText, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Milestone definitions matching OrderTracking step schema
const RELL_TRACKING_STEPS = [
  { title: "Order Placed", desc: "Inventory allocated, invoice record generated", icon: Box },
  { title: "Processed", desc: "Secured in protective craft boards & wax-sealed", icon: ShieldCheck },
  { title: "Shipped", desc: "Dispatched on premium courier route", icon: Truck },
  { title: "Local Hub", desc: "Out on Courier Route with local dispatcher", icon: Map },
  { title: "Delivered", desc: "Handover completed with proof-of-signature", icon: CheckCircle2 }
];

interface PublisherWorkstationProps {
  books: Book[];
  orders: Order[];
  onAddBook: (newBook: Book) => void;
  onUpdateBook: (updatedBook: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  merchantName: string;
}

export default function PublisherWorkstation({
  books,
  orders,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onUpdateOrder,
  merchantName,
}: PublisherWorkstationProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales' | 'publish'>('inventory');

  // --- Add Book Form States ---
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSynopsis, setNewSynopsis] = useState('');
  const [newPrice, setNewPrice] = useState('24.99');
  const [newCategory, setNewCategory] = useState<Category>('Fiction & Literature');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600');
  const [newYear, setNewYear] = useState('2026');
  const [newPages, setNewPages] = useState('320');
  const [newStock, setNewStock] = useState('10');
  const [newIsbn, setNewIsbn] = useState('978-0-307-27767-1');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // --- Edit Mode States for Stock / Price adjustments ---
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // --- Order Management Workspace States ---
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Pending' | 'Shipped' | 'Delivered'>('All');
  const [sortByOrder, setSortByOrder] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  
  // Consignee details quick editor state fields
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerEmail, setEditCustomerEmail] = useState('');
  const [editShippingAddress, setEditShippingAddress] = useState('');
  
  // Waybill label print modal popover triggering state
  const [waybillOrderId, setWaybillOrderId] = useState<string | null>(null);

  // Helper to synchronize milestone tracking codes with the client tracking framework
  const getOrderMilestone = (orderId: string): number => {
    try {
      const saved = localStorage.getItem('jbs_tracking_milestones');
      const map = saved ? JSON.parse(saved) : {};
      return map[orderId] !== undefined ? map[orderId] : 2; // Default to 'Shipped' stage
    } catch (_) {
      return 2;
    }
  };

  const updateOrderMilestone = (order: Order, stepIndex: number) => {
    try {
      const saved = localStorage.getItem('jbs_tracking_milestones');
      const map = saved ? JSON.parse(saved) : {};
      map[order.id] = stepIndex;
      localStorage.setItem('jbs_tracking_milestones', JSON.stringify(map));
      
      // Update Order's status tag: 'Pending' | 'Shipped' | 'Delivered'
      let derivedStatus: 'Pending' | 'Shipped' | 'Delivered' = 'Pending';
      if (stepIndex >= 2 && stepIndex <= 3) {
        derivedStatus = 'Shipped';
      } else if (stepIndex === 4) {
        derivedStatus = 'Delivered';
      }
      
      onUpdateOrder({
        ...order,
        status: derivedStatus
      });
    } catch (_) {}
  };

  const handleStartEditingOrder = (order: Order) => {
    setEditingOrderId(order.id);
    setEditCustomerName(order.customerName);
    setEditCustomerEmail(order.customerEmail);
    setEditShippingAddress(order.shippingAddress);
  };

  const handleSaveOrderDetails = (order: Order) => {
    if (!editCustomerName.trim() || !editCustomerEmail.trim() || !editShippingAddress.trim()) {
      return;
    }
    onUpdateOrder({
      ...order,
      customerName: editCustomerName.trim(),
      customerEmail: editCustomerEmail.trim(),
      shippingAddress: editShippingAddress.trim(),
    });
    setEditingOrderId(null);
  };

  // --- Dashboard Calculation Metrics ---
  const totalBooks = books.length;
  const totalStockCount = books.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockCount = books.filter((b) => b.stock <= 4).length;
  const grossEarnings = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Filtered and sorted orders for the Publisher's Order Desk
  const processedOrders = orders.filter((o) => {
    const currentMilestoneIndex = getOrderMilestone(o.id);
    let generalStatus: 'Pending' | 'Shipped' | 'Delivered' = 'Pending';
    if (currentMilestoneIndex >= 2 && currentMilestoneIndex <= 3) {
      generalStatus = 'Shipped';
    } else if (currentMilestoneIndex === 4) {
      generalStatus = 'Delivered';
    }

    const matchStatus = orderStatusFilter === 'All' || generalStatus === orderStatusFilter;

    const matchSearch = 
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.shippingAddress.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.items.some((item) => item.title.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (sortByOrder === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortByOrder === 'date-desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortByOrder === 'amount-asc') {
      return a.totalAmount - b.totalAmount;
    }
    if (sortByOrder === 'amount-desc') {
      return b.totalAmount - a.totalAmount;
    }
    return 0;
  });

  const ordersPendingCount = orders.filter(o => getOrderMilestone(o.id) <= 1).length;
  const ordersShippedCount = orders.filter(o => {
    const ms = getOrderMilestone(o.id);
    return ms === 2 || ms === 3;
  }).length;
  const ordersDeliveredCount = orders.filter(o => getOrderMilestone(o.id) === 4).length;

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !newTitle.trim() ||
      !newAuthor.trim() ||
      !newDesc.trim() ||
      !newSynopsis.trim() ||
      !newIsbn.trim()
    ) {
      setFormError('Please fill out all text parameters.');
      return;
    }

    const priceVal = parseFloat(newPrice);
    const stockVal = parseInt(newStock);
    const yearVal = parseInt(newYear);
    const pagesVal = parseInt(newPages);

    if (isNaN(priceVal) || priceVal <= 0) {
      setFormError('Price must be a positive decimal.');
      return;
    }
    if (isNaN(stockVal) || stockVal < 0) {
      setFormError('Starting stock cannot be negative.');
      return;
    }

    const freshlyMintedBook: Book = {
      id: `book-m-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      description: newDesc.trim(),
      synopsis: newSynopsis.trim(),
      price: priceVal,
      category: newCategory,
      rating: 5.0, // Brand new publisher items carry high default review rates
      coverImage: newCover.trim(),
      publishedYear: isNaN(yearVal) ? 2026 : yearVal,
      pages: isNaN(pagesVal) ? 250 : pagesVal,
      features: ['Publisher Upload'],
      stock: stockVal,
      isbn: newIsbn.trim(),
      reviews: [],
    };

    onAddBook(freshlyMintedBook);
    setFormSuccess(true);
    
    // Clear inputs
    setNewTitle('');
    setNewAuthor('');
    setNewDesc('');
    setNewSynopsis('');
    setNewPrice('24.99');
    setNewStock('10');

    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('inventory');
    }, 2500);
  };

  const startEditing = (b: Book) => {
    setEditingBookId(b.id);
    setEditPrice(b.price.toString());
    setEditStock(b.stock.toString());
  };

  const saveQuickEdit = (book: Book) => {
    const parsedPrice = parseFloat(editPrice);
    const parsedStock = parseInt(editStock);

    if (isNaN(parsedPrice) || parsedPrice <= 0 || isNaN(parsedStock) || parsedStock < 0) {
      return; // Ignore invalid values
    }

    onUpdateBook({
      ...book,
      price: parsedPrice,
      stock: parsedStock,
    });
    setEditingBookId(null);
  };

  return (
    <div id="publisher-workbench" className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 mb-12 shadow-sm">
      
      {/* Workspace Header banner metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-150 pb-5 mb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-amber-600 flex items-center gap-1.5 mb-1">
            <Briefcase className="w-3.5 h-3.5" /> SECURE OFFICE OF {merchantName.toUpperCase()}
          </span>
          <h2 className="font-serif font-bold text-2xl text-stone-900 leading-tight">
            Publisher Control Station
          </h2>
          <p className="text-stone-500 text-xs mt-0.5 font-light">
            Modify printed parameters, supply additional title drafts, and audit historic client order checkouts.
          </p>
        </div>

        {/* Tab switch controls */}
        <div className="flex bg-stone-105 border border-stone-200 p-0.5 rounded-lg text-xs gap-1 self-start md:self-auto font-semibold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'bg-[#1c1917] text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Catalog Inventory
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'publish' ? 'bg-[#1c1917] text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Add Title
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'sales' ? 'bg-[#1c1917] text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Store Sales ({orders.length})
          </button>
        </div>
      </div>

      {/* Analytical Bento Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-mono block">Curated Titles</span>
            <span className="text-lg font-mono font-semibold text-stone-900">{totalBooks}</span>
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center">
            <Archive className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-mono block">In-Stock Books</span>
            <span className="text-lg font-mono font-semibold text-stone-900">{totalStockCount} units</span>
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 text-rose-750 flex items-center justify-center">
            <Sliders className="w-4.5 h-4.5 text-rose-600" />
          </div>
          <div>
            <span className="text-[10px] text-rose-500 font-mono block">Supply Alerts</span>
            <span className="text-lg font-mono font-semibold text-rose-720">{lowStockCount} critical</span>
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center">
            <DollarSign className="w-4.5 h-4.5 text-emerald-650" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-650 font-mono block">Gross Income</span>
            <span className="text-lg font-mono font-semibold text-stone-900">${grossEarnings.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Content panels swap */}
      <div>
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-stone-850">
                Live Inventory Listing Matrix
              </h4>
              <span className="text-[10px] font-mono text-stone-400">
                Click any title’s edit button to adjust price or stock level instantly.
              </span>
            </div>

            {/* Scrollable listing table interface */}
            <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white shadow-xs">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 border-b border-stone-205 text-stone-500 uppercase font-bold tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Cover / Title Details</th>
                    <th className="p-4">ISBN Number</th>
                    <th className="p-4">Category Category</th>
                    <th className="p-4">Listing Price</th>
                    <th className="p-4">Copies Free</th>
                    <th className="p-4 text-center">Desk Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {books.map((book) => {
                    const isEditing = editingBookId === book.id;
                    return (
                      <tr key={book.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-8 h-11 bg-stone-100 rounded-md border border-stone-200 overflow-hidden shadow-2xs flex-shrink-0">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-serif font-semibold text-stone-850 block line-clamp-1">
                              {book.title}
                            </span>
                            <span className="text-[10px] text-stone-550 italic block">
                              by {book.author}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-stone-500 tracking-tight">
                          {book.isbn}
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-701 rounded-full text-[10px] uppercase font-medium">
                            {book.category}
                          </span>
                        </td>

                        {/* Inline price edits parameters */}
                        <td className="p-4 font-mono font-medium text-stone-900">
                          {isEditing ? (
                            <div className="relative max-w-[80px]">
                              <span className="absolute left-1.5 top-1.5 text-stone-400">$</span>
                              <input
                                type="text"
                                value={editPrice || ''}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-full pl-4 pr-1 py-1 bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-850"
                              />
                            </div>
                          ) : (
                            `$${book.price.toFixed(2)}`
                          )}
                        </td>

                        {/* Inline stock supply limits */}
                        <td className="p-4 font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock || ''}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="max-w-[70px] px-2 py-1 bg-white border border-stone-300 rounded focus:outline-none focus:border-stone-850"
                            />
                          ) : (
                            <span
                              className={`font-semibold ${
                                book.stock === 0
                                  ? 'text-rose-600 font-black'
                                  : book.stock <= 4
                                  ? 'text-amber-600 animate-pulse'
                                  : 'text-stone-800'
                              }`}
                            >
                              {book.stock} copies
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveQuickEdit(book)}
                                  className="p-1 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-semibold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingBookId(null)}
                                  className="p-1 px-1.5 border border-stone-200 hover:bg-stone-50 text-stone-500 rounded text-[10px] cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(book)}
                                  className="p-2 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 cursor-pointer"
                                  title="Quick update Price / Stock"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to retire "${book.title}" from store shelves?`)) {
                                      onDeleteBook(book.id);
                                    }
                                  }}
                                  className="p-2 text-stone-400 hover:text-rose-600 rounded-md hover:bg-stone-100 cursor-pointer"
                                  title="Retire book listing"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sales ledger receipts tab screen */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            
            {/* Control Panel Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-stone-50 border border-stone-200 p-4 rounded-xl">
              <div>
                <span className="text-[10px] text-stone-400 font-mono block uppercase font-bold tracking-wider">Total Handled Orders</span>
                <span className="text-xl font-mono font-bold text-[#1c1917]">{orders.length}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-600 font-mono block uppercase font-bold tracking-wider">Pending Processing</span>
                <span className="text-xl font-mono font-bold text-amber-700">{ordersPendingCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-600 font-mono block uppercase font-bold tracking-wider">In Cargo Transit</span>
                <span className="text-xl font-mono font-bold text-blue-700">{ordersShippedCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-650 font-mono block uppercase font-bold tracking-wider">Arrived & Signed</span>
                <span className="text-xl font-mono font-bold text-emerald-700">{ordersDeliveredCount}</span>
              </div>
            </div>

            {/* Filters of Order Ledger */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-150 pb-4">
              {/* Category Status Filters */}
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
                {(['All', 'Pending', 'Shipped', 'Delivered'] as const).map((status) => {
                  const isActive = orderStatusFilter === status;
                  let count = orders.length;
                  if (status === 'Pending') count = ordersPendingCount;
                  else if (status === 'Shipped') count = ordersShippedCount;
                  else if (status === 'Delivered') count = ordersDeliveredCount;

                  return (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                        isActive
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-50 border border-stone-205 text-stone-605 hover:border-stone-400'
                      }`}
                    >
                      {status} Dispatches ({count})
                    </button>
                  );
                })}
              </div>

              {/* Advanced search query or custom dropdown sorting */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Search Bar */}
                <div className="relative min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={orderSearchQuery || ''}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by ID, buyer, address..."
                    className="w-full pl-9 pr-6 py-2 bg-white border border-stone-200 hover:border-stone-400 rounded-lg text-xs font-medium focus:outline-none focus:border-stone-900 transition-all font-sans"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-850"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort selector dropdown */}
                <span className="text-stone-400 flex items-center gap-1 font-sans ml-2">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Order:
                </span>
                <select
                  value={sortByOrder}
                  onChange={(e) => setSortByOrder(e.target.value as any)}
                  className="bg-white border border-stone-200 rounded-lg p-1.5 px-2 text-stone-800 font-semibold focus:outline-none focus:border-stone-900"
                >
                  <option value="date-desc">Newest Invoices</option>
                  <option value="date-asc">Oldest Invoices</option>
                  <option value="amount-desc">Amount: High to Low</option>
                  <option value="amount-asc">Amount: Low to High</option>
                </select>
              </div>
            </div>

            {/* Orders list rendering matrix */}
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-stone-50 border border-dashed border-stone-200 rounded-xl space-y-2">
                <HelpCircle className="w-9 h-9 text-stone-300 mx-auto" />
                <h5 className="font-serif font-bold text-sm text-stone-700">No Sales Ledger Compiled Yet</h5>
                <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                  Sales entries will compile automatically as buyers complete their checkout transactions. To test, log out, sign in as a Buyer, add preferred titles to the shopping cart, and complete the secure payment simulation.
                </p>
              </div>
            ) : processedOrders.length === 0 ? (
              <div className="p-12 text-center bg-stone-50 border border-dashed border-stone-200 rounded-xl">
                <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500 font-semibold">No matching order entries found</p>
                <button
                  onClick={() => { setOrderSearchQuery(''); setOrderStatusFilter('All'); }}
                  className="mt-3 px-3 py-1 bg-stone-950 text-white hover:bg-black text-[10px] rounded-md transition-all uppercase font-bold"
                >
                  Reset Order Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {processedOrders.map((order) => {
                  const currentMilestoneIndex = getOrderMilestone(order.id);
                  const isEditingOrder = editingOrderId === order.id;
                  
                  // Financial calculations
                  const orderItemsSum = order.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
                  const orderTax = parseFloat((orderItemsSum * 0.08).toFixed(2));
                  const orderCarrierAmt = orderItemsSum >= 45 ? 0 : 4.99;
                  const discountDeductionPercent = parseFloat((orderItemsSum + orderTax + orderCarrierAmt - order.totalAmount).toFixed(2));

                  return (
                    <div
                      key={order.id}
                      className="p-5 bg-white border border-stone-200 rounded-xl space-y-4 hover:border-stone-400 transition-colors shadow-2xs relative"
                    >
                      {/* Top Row: Ref and Action Triggers */}
                      <div className="flex flex-col sm:flex-row items-add sm:items-center justify-between gap-3 border-b border-stone-150 pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-stone-900 border border-stone-350 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-mono">
                            ID: {order.id}
                          </span>
                          <span className="text-[10.5px] text-stone-450 font-sans">
                            Invoiced {order.date}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Waybill printing shortcut */}
                          <button
                            onClick={() => setWaybillOrderId(waybillOrderId === order.id ? null : order.id)}
                            className={`p-1.5 px-3 rounded-lg font-semibold text-[10px] flex items-center gap-1.5 tracking-tight border cursor-pointer select-none transition-all ${
                              waybillOrderId === order.id
                                ? 'bg-amber-50 border-amber-300 text-amber-850'
                                : 'bg-stone-50 border-stone-250 text-stone-705 hover:bg-stone-100'
                            }`}
                            title="Generate Shipping Labels Waybill"
                          >
                            <Printer className="w-3.5 h-3.5 text-stone-500" />
                            <span>Waybill Voucher</span>
                            {waybillOrderId === order.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {/* Quick details editor trigger */}
                          <button
                            onClick={() => {
                              if (isEditingOrder) {
                                handleSaveOrderDetails(order);
                              } else {
                                handleStartEditingOrder(order);
                              }
                            }}
                            className={`p-1.5 px-3 rounded-lg font-semibold text-[10px] flex items-center gap-1.5 tracking-tight border cursor-pointer transition-all ${
                              isEditingOrder
                                ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
                                : 'bg-stone-50 border-stone-250 text-stone-705 hover:bg-stone-100'
                            }`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>{isEditingOrder ? "Save Detail" : "Edit Details"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Waybill voucher label card (expanded view) */}
                      {waybillOrderId === order.id && (
                        <div
                          className="bg-amber-50/40 p-4 border border-dashed border-amber-300 rounded-lg text-xs space-y-3 font-mono text-stone-850 animate-fadeIn"
                        >
                          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                            <span className="font-bold flex items-center gap-1.5 text-amber-805 font-sans">
                              <Truck className="w-4 h-4 text-amber-650" /> JELVAN EXPRESS WAYBILL VOUCHER
                            </span>
                            <span className="text-[10px] text-amber-600">POST BARCODE LOG</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-sans">
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Dispatch Origin</span>
                              <p className="font-mono text-[10px] leading-tight text-stone-650">
                                Jelvan Curation Hub<br />
                                742 Evergreen Terrace<br />
                                Springfield Core, USA
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Shipment Destination</span>
                              <p className="font-mono text-[10px] leading-tight font-semibold text-stone-850">
                                {order.customerName}<br />
                                {order.shippingAddress}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">Postal Scan Reference</span>
                              <div className="p-1 px-2 border bg-white border-amber-200 inline-block font-mono text-[10px]">
                                <span className="block font-bold tracking-widest text-[#1c1917] text-xs">||| |||| | || |||</span>
                                <span className="block text-[9px] text-stone-500 mt-1">JLV-{order.id.replace(/\D/g, '') || '9124'}-EXP</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-amber-200 flex items-center justify-between font-sans">
                            <p className="text-[10px] text-amber-700">
                              💡 <strong>Voucher Ready:</strong> Print waybill slip and attach securely to package wrapper.
                            </p>
                            <button
                              onClick={() => {
                                window.print();
                              }}
                              className="px-2.5 py-1 rounded bg-[#1c1917] hover:bg-black text-[#fbfbf9] flex items-center gap-1 text-[9.5px] uppercase font-bold transition-all cursor-pointer"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Print Voucher</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Recipient Details & Items ledger splits */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs text-stone-605">
                        {/* Consignee credentials coordinates block (4cols) */}
                        <div className="md:col-span-4 bg-stone-50/50 p-3.5 rounded-lg border border-stone-200 text-xs">
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400 font-sans block mb-2">
                            Consignee delivery coordinates
                          </span>

                          {isEditingOrder ? (
                            <div className="space-y-2.5 font-sans">
                              <div>
                                <label className="block text-[9px] font-bold text-stone-500 mb-0.5">Purchaser Name</label>
                                <input
                                  type="text"
                                  value={editCustomerName || ''}
                                  onChange={(e) => setEditCustomerName(e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:border-stone-700"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-stone-500 mb-0.5">Customer Email Address</label>
                                <input
                                  type="email"
                                  value={editCustomerEmail || ''}
                                  onChange={(e) => setEditCustomerEmail(e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:border-stone-700 font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-stone-500 mb-0.5">Shipping Address Destination</label>
                                <textarea
                                  rows={2}
                                  value={editShippingAddress || ''}
                                  onChange={(e) => setEditShippingAddress(e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs focus:outline-none focus:border-stone-700 resize-none"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2 font-sans mt-1">
                              <div className="flex items-center gap-1.5 text-stone-850">
                                <User className="w-3.5 h-3.5 text-stone-405 shrink-0" />
                                <strong className="font-semibold">{order.customerName}</strong>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-stone-550 font-mono">
                                <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                                <span>{order.customerEmail}</span>
                              </div>
                              <div className="flex items-start gap-1.5 text-[11px] text-stone-550 leading-relaxed pt-1.5 border-t border-stone-200 mt-1.5">
                                <MapPin className="w-3.5 h-3.5 text-rose-550 shrink-0 mt-0.5 animate-bounce" />
                                <span>{order.shippingAddress}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Order contents item list block (5cols) */}
                        <div className="md:col-span-5 space-y-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 font-sans block">
                            Shipped Book Parcels
                          </span>

                          <div className="space-y-1.5 block max-h-[160px] overflow-y-auto pr-1">
                            {order.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-0 hover:bg-stone-50 px-1 rounded transition-colors"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div className="w-4.5 h-6 bg-stone-100 rounded overflow-hidden shrink-0 shadow-3xs">
                                    <img src={it.coverImage} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                                  </div>
                                  <span className="font-medium text-stone-805 tracking-tight truncate max-w-[140px]" title={it.title}>
                                    {it.title}
                                  </span>
                                  <span className="text-[10px] text-stone-400 font-mono">
                                    (${it.price.toFixed(2)})
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 font-mono shrink-0">
                                  <span className="text-[10.5px] text-stone-450 bg-stone-100 px-1 py-0.5 rounded">x{it.quantity}</span>
                                  <span className="font-bold text-stone-900 text-[11px]">
                                    ${(it.price * it.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Grand cost balance breakdowns sheet (3cols) */}
                        <div className="md:col-span-3 bg-stone-50/50 p-3 rounded-lg border border-stone-200 font-mono text-[11px] text-stone-550 flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 font-sans block mb-1">
                              Financial Summary
                            </span>
                            <div className="flex justify-between">
                              <span>Premium Sub:</span>
                              <span>${orderItemsSum.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estimated Tax:</span>
                              <span>${orderTax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Courier Post:</span>
                              <span>{orderCarrierAmt === 0 ? "FREE" : `$${orderCarrierAmt.toFixed(2)}`}</span>
                            </div>
                            {discountDeductionPercent !== 0 && (
                              <div className="flex justify-between text-[10.5px] text-amber-705 font-sans font-semibold">
                                <span>VIP Bundle:</span>
                                <span>{discountDeductionPercent > 0 ? `-$${discountDeductionPercent}` : `+$${Math.abs(discountDeductionPercent)}`}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between text-xs font-bold text-stone-900 border-t border-stone-200 pt-2 mt-2">
                            <span>Grand Invoice:</span>
                            <span className="text-emerald-700">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: Live Interactive Delivery Stepper waypoint triggers! */}
                      <div className="pt-3 border-t border-stone-150">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-1 text-stone-500 font-sans font-semibold">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
                            <span>Modify Shipment Status Milestone Interactive Tracker:</span>
                          </div>
                          
                          {/* Stepper Node controllers */}
                          <div className="flex flex-wrap gap-1 md:gap-1.5">
                            {RELL_TRACKING_STEPS.map((step, idx) => {
                              const isPassed = idx <= currentMilestoneIndex;
                              const isCurrent = idx === currentMilestoneIndex;
                              const NodeIcon = step.icon;

                              return (
                                <button
                                  key={step.title}
                                  onClick={() => updateOrderMilestone(order, idx)}
                                  className={`p-1 px-2.5 rounded text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer transition-all border ${
                                    isCurrent
                                      ? "bg-[#1c1917] text-white border-black shadow-2xs"
                                      : isPassed
                                      ? "bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300"
                                      : "bg-white hover:bg-stone-50 text-stone-405 border-stone-200"
                                  }`}
                                  title={`${step.title}: ${step.desc}`}
                                >
                                  <NodeIcon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-bounce' : ''}`} />
                                  <span>{step.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Publish/Add New Book View panel layout */}
        {activeTab === 'publish' && (
          <form onSubmit={handleAddSubmit} className="space-y-5">
            <h4 className="font-serif font-bold text-base text-stone-850 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Catalog Registry Form
            </h4>

            {formSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-xl flex items-center gap-2 font-mono">
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" /> Congratulations! Your book draft has successfully materialized on our catalogue shelf and is active for client purchase. Returning to catalog shortly...
              </div>
            ) : (
              <div className="space-y-4">
                {formError && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-lg">
                    {formError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Book Title Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Letters from the Black Forest"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Author / Illustrator Credits *
                    </label>
                    <input
                      required
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Clara Oswald"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      ISBN Number *
                    </label>
                    <input
                      required
                      type="text"
                      value={newIsbn}
                      onChange={(e) => setNewIsbn(e.target.value)}
                      placeholder="978-0-307-27767-1"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono text-stone-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Category Genre
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-semibold"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Listing Price *
                    </label>
                    <input
                      required
                      type="text"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="24.99"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono text-stone-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Starting Supply Stock *
                    </label>
                    <input
                      required
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      placeholder="10"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono text-stone-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Pages Count
                    </label>
                    <input
                      type="number"
                      value={newPages}
                      onChange={(e) => setNewPages(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                      Published Year
                    </label>
                    <input
                      type="number"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                    Book Jacket Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 font-mono text-stone-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                    Brief Catchphrase Description *
                  </label>
                  <input
                    required
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="e.g. A gorgeous retrospective review of mid-century wood printing techniques."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider uppercase text-stone-500 mb-1">
                    Detailed Book Synopsis Story *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newSynopsis}
                    onChange={(e) => setNewSynopsis(e.target.value)}
                    placeholder="Describe the entire storyline, conceptual framework, character details, or study content in detail for our buyers..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-stone-900 resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Register and Print Listing
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
