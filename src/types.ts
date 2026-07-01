export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'Buyer' | 'Publisher';
  companyName?: string; // For publishers
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  isVerifiedPurchase?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  synopsis: string; // longer detailed version
  price: number;
  category: string;
  rating: number;
  coverImage: string;
  publishedYear: number;
  pages: number;
  features?: string[]; // e.g. ["Best Seller", "Editor's Choice", "Staff Pick"]
  stock: number;
  isbn: string;
  reviews: Review[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: {
    bookId: string;
    title: string;
    price: number;
    quantity: number;
    coverImage: string;
  }[];
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}

export type Category = 
  | 'All'
  | 'Fiction & Literature'
  | 'Science & Philosophy'
  | 'History & Biography'
  | 'Self-Improvement'
  | 'Mystery & Thriller'
  | 'Arts & Design';
