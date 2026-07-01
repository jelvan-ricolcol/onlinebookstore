import { Book, Category } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Silent Meridian',
    author: 'Eleanor Vance',
    description: 'An atmospheric, lyrical exploration of cartography, lost civilizations, and family secrets in 19th-century Venice.',
    synopsis: 'When a collection of unsolved maps arrives at the Venetian Archives, young archivist Beatrice Vianello discovers a hidden thread connecting her own ancestry to a forgotten island in the Adriatic. As she deciphers the cartographer’s cryptic notations, Beatrice is drawn into a world of celestial navigation, clandestine societies, and a decades-old mystery that reshapes everything she knows about the map of Europe.',
    price: 24.99,
    category: 'Fiction & Literature',
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2024,
    pages: 412,
    features: ['Editor\'s Choice', 'Best Seller'],
    stock: 8,
    isbn: '978-3-16-148410-0',
    reviews: [
      {
        id: 'r1',
        bookId: '1',
        userName: 'Julian Barnes',
        rating: 5,
        comment: 'Vance’s writing is as detailed and beautiful as the maps she describes. An absolute triumph of literary historical fiction.',
        date: '2026-05-12',
        isVerifiedPurchase: true
      },
      {
        id: 'r2',
        bookId: '1',
        userName: 'Sophia L.',
        rating: 4,
        comment: 'The world-building in Venice is so immersive. The pacing slows down slightly in the middle, but the climax is utterly breathtaking.',
        date: '2026-05-24',
        isVerifiedPurchase: true
      }
    ]
  },
  {
    id: '2',
    title: 'Echoes of the Cosmos',
    author: 'Dr. Alistair Finch',
    description: 'A groundbreaking perspective on quantum mechanics and how human perception shapes local stars and deep structures.',
    synopsis: 'Are we merely passive observers of the universe, or active participants in its continuous creation? Dr. Finch bridges the gap between quantum astrophysics and philosophy, arguing that our cognitive structures play a fundamental role in wave-function collapses. Written in an accessible but rigorous style, this work challenges our standard definitions of reality.',
    price: 29.50,
    category: 'Science & Philosophy',
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2025,
    pages: 350,
    features: ['New Arrival'],
    stock: 14,
    isbn: '978-0-12-345678-9',
    reviews: [
      {
        id: 'r3',
        bookId: '2',
        userName: 'Astrid G.',
        rating: 5,
        comment: 'An incredibly mind-bending book. It makes highly complex quantum theories feel like beautiful poetry.',
        date: '2026-04-30',
        isVerifiedPurchase: true
      }
    ]
  },
  {
    id: '3',
    title: 'The Cartographer of Shadows',
    author: 'Mateo Rojas',
    description: 'A sharp, thrilling mystery set in the high-stakes art smuggling underworld of Buenos Aires.',
    synopsis: 'Julian Caro is the best art restorer in Argentina—and a master of fabricating authentic-looking provenances. But when a wealthy collector hires him to authenticate a sketchbook rumored to be by a young Goya, Julian finds himself targeted by a network of criminals, double-crossing agents, and a quiet detective with a personal vendetta.',
    price: 18.95,
    category: 'Mystery & Thriller',
    rating: 4.6,
    coverImage: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2023,
    pages: 320,
    features: ['Staff Pick'],
    stock: 5,
    isbn: '978-1-4028-9462-6',
    reviews: [
      {
        id: 'r4',
        bookId: '3',
        userName: 'Marcus Sterling',
        rating: 5,
        comment: 'Fast-paced, intelligent, and filled with dark, atmospheric Argentine tango salons. Couldn\'t put it down!',
        date: '2026-05-15',
        isVerifiedPurchase: false
      }
    ]
  },
  {
    id: '4',
    title: 'Minimal: The Power of Less in Design',
    author: 'Keisuke Tanaka',
    description: 'A stunning monograph showcasing minimalism in modern product design, interior layout, and visual theory.',
    synopsis: 'Tanaka explores the profound impact of negative space, materials selection, and silent engineering. Drawing from traditional Japanese mastercraft and Bauhaus classics, this book acts as both an educational critique and a stunning visual retrospective of objects that speak through omission.',
    price: 45.00,
    category: 'Arts & Design',
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2024,
    pages: 280,
    features: ['Bestseller', 'Editor\'s Choice'],
    stock: 12,
    isbn: '978-4-8222-1049-2',
    reviews: [
      {
        id: 'r5',
        bookId: '4',
        userName: 'Leila Chen',
        rating: 5,
        comment: 'The layout of the book itself is a masterpiece of minimalism. Perfect for my coffee table and my brain.',
        date: '2026-05-20',
        isVerifiedPurchase: true
      }
    ]
  },
  {
    id: '5',
    title: 'Chronicles of the Silk Road',
    author: 'Amara Al-Jamil',
    description: 'A rich historical biographical tapestry exploring the unsung merchants, diplomats, and scholars of central Asia.',
    synopsis: 'Amara Al-Jamil weaves a masterful narrative using newly surfaced diaries and tax rolls from Dunhuang. Rather than focusing solely on kings and conquerors, this work reveals the granular, everyday lives of the women, translators, and caravan guards who truly kept East and West connected during the Tang Dynasty.',
    price: 32.00,
    category: 'History & Biography',
    rating: 4.7,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2023,
    pages: 540,
    features: ['Recommended'],
    stock: 6,
    isbn: '978-0-670-89123-5',
    reviews: [
      {
        id: 'r6',
        bookId: '5',
        userName: 'Dr. Henry Cooper',
        rating: 5,
        comment: 'Extremely detailed and academically rigorous, yet it reads with the fluid grace of an epic novel.',
        date: '2026-03-14',
        isVerifiedPurchase: true
      }
    ]
  },
  {
    id: '6',
    title: 'Atomic Habits of the Mind',
    author: 'Sarah Jenkins',
    description: 'A psychological framework to untangle cognitive loops, eliminate digital exhaustion, and foster focus.',
    synopsis: 'Our minds are constantly hijacked by continuous scrolling, rapid notification systems, and micro-attention traps. Sarah Jenkins presents an actionable, evidence-based roadmap to rebuild mental autonomy. By understanding standard chemical triggers in our neurological relays, we can establish deep work rituals that stick.',
    price: 16.99,
    category: 'Self-Improvement',
    rating: 4.5,
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2024,
    pages: 254,
    features: ['Best Seller'],
    stock: 22,
    isbn: '978-0-7352-1129-2',
    reviews: [
      {
        id: 'r7',
        bookId: '6',
        userName: 'Danielle K.',
        rating: 4,
        comment: 'Very practical strategies for disconnecting from my phone. The exercises are simple but highly revelatory.',
        date: '2026-05-18',
        isVerifiedPurchase: true
      }
    ]
  },
  {
    id: '7',
    title: 'The Great Convergence',
    author: 'Julian Thorne',
    description: 'An analysis of how artificial intelligence, genomic code, and nanotechnology are reshaping human nature.',
    synopsis: 'Thorne presents a startling look at the next fifty years of human evolution. By merging historical technological cycles with state-of-the-art developments in gene editing and computing, he maps out the ethical, philosophical, and economic decisions that our generation must make before the tech is out of the bottle.',
    price: 27.50,
    category: 'Science & Philosophy',
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2025,
    pages: 402,
    features: ['Staff Pick', 'New Arrival'],
    stock: 9,
    isbn: '978-1-5011-7134-5',
    reviews: []
  },
  {
    id: '8',
    title: 'A Life in Typographic Lines',
    author: 'Clara Oswald',
    description: 'The memoir of legendary typographer Clara Oswald, detailing her design struggles and post-war letters in Munich.',
    synopsis: 'From printing underground pamphlets during the mid-century reconstruction to setting typography guidelines for Europe\'s greatest publications, Clara Oswald\'s memoirs present a beautiful reflection on aesthetics, technology movements, and the power of the printed curve.',
    price: 38.00,
    category: 'History & Biography',
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2024,
    pages: 310,
    features: ['Editor\'s Choice'],
    stock: 4,
    isbn: '978-0-394-58201-3',
    reviews: [
      {
        id: 'r8',
        bookId: '8',
        userName: 'Gerry V.',
        rating: 5,
        comment: 'For design nerds, this is the Holy Grail. The description of her interactions with Adrian Frutiger alone is worth the price.',
        date: '2026-05-01',
        isVerifiedPurchase: true
      }
    ]
  },
  {
    id: '9',
    title: 'Winter at the Lake House',
    author: 'Rachel Moreau',
    description: 'A classic Nordic noir mystery surrounding a sudden disappearance in a secluded, snow-covered Norwegian village.',
    synopsis: 'Inspector Henning Juul is seeking quiet isolation after a traumatic case, but the murder of a local carpenter in a locked boathouse drags him returning to active duty. As the blizzard cuts off the village from civil authorities, the tight-knit community begins to implode with mutual suspicion.',
    price: 15.99,
    category: 'Mystery & Thriller',
    rating: 4.4,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2023,
    pages: 368,
    features: [],
    stock: 15,
    isbn: '978-0-06-206840-8',
    reviews: []
  },
  {
    id: '10',
    title: 'Architecture of Silence',
    author: 'Kengo Kuro',
    description: 'A photographic journey into the spatial harmony of traditional shrines and modern wooden structures of Kyoto.',
    synopsis: 'With beautiful monochrome photographs and spatial breakdowns, Kuro walks the reader through structural designs that harmonize perfectly with standard weather, shadows, and natural soundscapes, fostering a meditative architectural shelter from contemporary chaos.',
    price: 49.99,
    category: 'Arts & Design',
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2025,
    pages: 320,
    features: ['Staff Pick', 'Collector\'s Edition'],
    stock: 3,
    isbn: '978-3-7913-8106-0',
    reviews: [
      {
        id: 'r9',
        bookId: '10',
        userName: 'Kenji T.',
        rating: 5,
        comment: 'Kuro has captured the soul of Japanese wood carpentry. A spiritual experience.',
        date: '2026-04-10',
        isVerifiedPurchase: true
      }
    ]
  },
  {
    id: '11',
    title: 'The Art of Dialogue',
    author: 'Douglas Stone',
    description: 'A transformative guide on resolving corporate friction and interpersonal gridlock using empathetic communication.',
    synopsis: 'Most communication is not what we speak, but what we trigger. Douglas Stone dissects active listening, somatic processing, and linguistic structures to help readers conduct painful conversations without damage to relationships or projects.',
    price: 14.99,
    category: 'Self-Improvement',
    rating: 4.3,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2024,
    pages: 220,
    stock: 18,
    isbn: '978-0-14-311225-9',
    reviews: []
  },
  {
    id: '12',
    title: 'Memory of the Wind',
    author: 'Siddharth Roy',
    description: 'A sweeping, magical family drama set in the ancient salt flats of Gujarat, spanning three generations.',
    synopsis: 'A family’s secrets are buried beneath the shimmering visual illusions of the salt deserts. When young photographer Kabir returns to settle his grandfather’s estate, he discovers letters detailing a forbidden friendship and an ancient chest of indigo dyes that hold the path to the family\'s forgotten fortune.',
    price: 21.00,
    category: 'Fiction & Literature',
    rating: 4.7,
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600',
    publishedYear: 2024,
    pages: 450,
    features: ['Recommended'],
    stock: 7,
    isbn: '978-0-553-38679-0',
    reviews: [
      {
        id: 'r10',
        bookId: '12',
        userName: 'Radhika M.',
        rating: 5,
        comment: 'So lush and mystical. It captures the dry winds and shifting salt scenery beautifully. Highly recommended!',
        date: '2026-05-02',
        isVerifiedPurchase: true
      }
    ]
  }
];

export const CATEGORIES: Category[] = [
  'All',
  'Fiction & Literature',
  'Science & Philosophy',
  'History & Biography',
  'Self-Improvement',
  'Mystery & Thriller',
  'Arts & Design'
];
