import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const fallbackImages = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=80',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80',
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
  'https://images.unsplash.com/photo-1633681122182-c3fcb02e6bce?w=800&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80',
  'https://images.unsplash.com/photo-1527799851257-6592aae86836?w=800&q=80'
];

const salonsData = [
  {
    name: "Ornatrix Unisex Hair Studio",
    description: "5-star rated unisex salon known for precision cuts, hair coloring & spa treatments.",
    address: "Parthasarathy Nagar, Manapakkam, Chennai 600125",
    area: "Manapakkam",
    reviewCount: 182,
    rating: 5.0,
    image: "",
    latitude: 12.9921,
    longitude: 80.1771,
    priceRange: "₹₹",
    phone: "+91 96 0000 0000",
    openHours: "10am – 8pm",
    tags: ["unisex", "hair", "spa"],
    featured: false,
    services: [
      { name: "Haircut", price: 400, duration: 45, category: "Hair" },
      { name: "Hair Coloring", price: 2000, duration: 120, category: "Hair" },
      { name: "Hair Spa", price: 1200, duration: 60, category: "Hair" },
      { name: "Facial", price: 800, duration: 60, category: "Skin" }
    ]
  },
  {
    name: "Naturals Signature Salon",
    description: "Premium unisex chain with 3300+ reviews, luxury bridal & skincare services.",
    address: "87, Arcot Road, Saligramam, Chennai 600093",
    area: "Saligramam",
    reviewCount: 3300,
    rating: 4.9,
    image: "",
    latitude: 13.0513,
    longitude: 80.1542,
    priceRange: "₹₹₹",
    phone: "+91 44 4200 9750",
    openHours: "9am – 9pm",
    tags: ["luxury", "bridal", "skincare"],
    featured: true,
    services: [
      { name: "Haircut", price: 650, duration: 45, category: "Hair" },
      { name: "Hair Smoothening", price: 5500, duration: 180, category: "Hair" },
      { name: "Keratin Treatment", price: 5500, duration: 150, category: "Hair" },
      { name: "Facial", price: 1350, duration: 60, category: "Skin" },
      { name: "Bridal Package", price: 7999, duration: 240, category: "Bridal" }
    ]
  },
  {
    name: "Bounce Unisex Salon Ashoknagar",
    description: "Trendy unisex salon popular for fashion hair coloring and modern styling.",
    address: "Dev Towers, 74, 4th Avenue, Ashok Nagar, Chennai 600083",
    area: "Ashok Nagar",
    reviewCount: 1614,
    rating: 4.9,
    image: "",
    latitude: 13.0538,
    longitude: 80.2231,
    priceRange: "₹₹",
    phone: "+91 73585 99934",
    openHours: "10am – 8pm",
    tags: ["unisex", "trendy", "color"],
    featured: false,
    services: [
      { name: "Haircut", price: 500, duration: 45, category: "Hair" },
      { name: "Fashion Hair Color", price: 2500, duration: 120, category: "Hair" },
      { name: "Hair Spa", price: 1000, duration: 60, category: "Hair" },
      { name: "Grooming Package", price: 1500, duration: 90, category: "Grooming" }
    ]
  },
  {
    name: "VIBE Unisex Salon",
    description: "Premium quality salon in T. Nagar at competitive pricing with 1500+ reviews.",
    address: "Dhandapani Street, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    reviewCount: 1540,
    rating: 4.9,
    image: "",
    latitude: 13.0418,
    longitude: 80.2342,
    priceRange: "₹₹",
    phone: "+91 44 4200 1122",
    openHours: "10am – 9pm",
    tags: ["unisex", "affordable", "t-nagar"],
    featured: false,
    services: [
      { name: "Haircut", price: 350, duration: 45, category: "Hair" },
      { name: "Facial", price: 700, duration: 60, category: "Skin" },
      { name: "Manicure", price: 400, duration: 30, category: "Nails" },
      { name: "Pedicure", price: 600, duration: 45, category: "Nails" }
    ]
  },
  {
    name: "Lakme Salon",
    description: "Iconic salon chain by Lakme, leading bridal makeup destination in Chennai.",
    address: "Somasundaram Street, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    reviewCount: 2850,
    rating: 4.9,
    image: "",
    latitude: 13.0405,
    longitude: 80.2335,
    priceRange: "₹₹₹",
    phone: "+91 44 2815 3030",
    openHours: "10am – 8pm",
    tags: ["luxury", "bridal", "makeup"],
    featured: true,
    services: [
      { name: "Haircut", price: 800, duration: 45, category: "Hair" },
      { name: "Bridal Makeup", price: 8000, duration: 180, category: "Bridal" },
      { name: "Hair Smoothening", price: 4500, duration: 150, category: "Hair" },
      { name: "Party Makeup", price: 3000, duration: 90, category: "Makeup" }
    ]
  },
  {
    name: "Toni & Guy Hairdressing",
    description: "London-trained stylists offering premium hairdressing and signature cutting techniques.",
    address: "Rangarajapuram Main Road, Kodambakkam, Chennai 600024",
    area: "Kodambakkam",
    reviewCount: 289,
    rating: 4.9,
    image: "",
    latitude: 13.0456,
    longitude: 80.2261,
    priceRange: "₹₹₹",
    phone: "+91 44 4567 8901",
    openHours: "10am – 8pm",
    tags: ["luxury", "international", "hair"],
    featured: true,
    services: [
      { name: "Creative Cut", price: 1200, duration: 60, category: "Hair" },
      { name: "Colour & Highlights", price: 3500, duration: 120, category: "Hair" },
      { name: "Brazilian Blowout", price: 5000, duration: 150, category: "Hair" },
      { name: "Deep Conditioning", price: 1800, duration: 60, category: "Hair" }
    ]
  },
  {
    name: "Green Trends Academy",
    description: "Popular unisex chain known for affordable grooming and beauty services.",
    address: "South Usman Road, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    reviewCount: 2100,
    rating: 4.9,
    image: "",
    latitude: 13.0398,
    longitude: 80.2325,
    priceRange: "₹₹",
    phone: "+91 44 2434 5678",
    openHours: "10am – 9pm",
    tags: ["unisex", "affordable", "chain"],
    featured: false,
    services: [
      { name: "Haircut", price: 250, duration: 30, category: "Hair" },
      { name: "Facial", price: 500, duration: 45, category: "Skin" },
      { name: "Waxing", price: 300, duration: 30, category: "Beauty" },
      { name: "Manicure", price: 350, duration: 30, category: "Nails" }
    ]
  },
  {
    name: "Dessange Paris",
    description: "French luxury salon brand known for signature hair spas and elegant ambiance.",
    address: "Cenotaph Road, Teynampet, Chennai 600018",
    area: "Teynampet",
    reviewCount: 450,
    rating: 4.8,
    image: "",
    latitude: 13.0375,
    longitude: 80.2430,
    priceRange: "₹₹₹",
    phone: "+91 44 2435 1000",
    openHours: "10am – 8pm",
    tags: ["luxury", "french", "hair-spa"],
    featured: false,
    services: [
      { name: "Haircut", price: 1500, duration: 60, category: "Hair" },
      { name: "Hair Spa", price: 2500, duration: 75, category: "Hair" },
      { name: "Hair Coloring", price: 4000, duration: 120, category: "Hair" },
      { name: "Keratin Treatment", price: 6000, duration: 150, category: "Hair" }
    ]
  },
  {
    name: "Page 3 Luxury Salon",
    description: "Premium salon specializing in Kerastase and Olaplex hair treatments.",
    address: "3rd Floor, VR Mall, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    reviewCount: 780,
    rating: 4.8,
    image: "",
    latitude: 13.0887,
    longitude: 80.2102,
    priceRange: "₹₹₹",
    phone: "+91 44 2620 3030",
    openHours: "11am – 9pm",
    tags: ["luxury", "mall", "kerastase"],
    featured: false,
    services: [
      { name: "Haircut", price: 900, duration: 45, category: "Hair" },
      { name: "Olaplex Treatment", price: 3500, duration: 90, category: "Hair" },
      { name: "Kerastase Treatment", price: 4000, duration: 90, category: "Hair" },
      { name: "Facial", price: 1500, duration: 60, category: "Skin" }
    ]
  },
  {
    name: "Wink Wink Salon",
    description: "Trusted neighborhood salon in Alwarpet for haircuts, facials, and nail services.",
    address: "Alwarpet, Chennai 600018",
    area: "Alwarpet",
    reviewCount: 320,
    rating: 4.7,
    image: "",
    latitude: 13.0320,
    longitude: 80.2505,
    priceRange: "₹₹",
    phone: "+91 44 2499 7070",
    openHours: "10am – 8pm",
    tags: ["neighbourhood", "unisex", "alwarpet"],
    featured: false,
    services: [
      { name: "Haircut", price: 500, duration: 45, category: "Hair" },
      { name: "Hair Coloring", price: 2000, duration: 120, category: "Hair" },
      { name: "Facial", price: 800, duration: 60, category: "Skin" },
      { name: "Pedicure", price: 600, duration: 45, category: "Nails" }
    ]
  },
  {
    name: "Anlon Art Salon",
    description: "Renowned for skilled stylists, layer haircuts, and balayage highlights.",
    address: "Khader Nawaz Khan Road, Nungambakkam, Chennai 600034",
    area: "Nungambakkam",
    reviewCount: 520,
    rating: 4.8,
    image: "",
    latitude: 13.0535,
    longitude: 80.2478,
    priceRange: "₹₹₹",
    phone: "+91 44 2833 2020",
    openHours: "10am – 8pm",
    tags: ["premium", "balayage", "nungambakkam"],
    featured: false,
    services: [
      { name: "Layer Haircut", price: 800, duration: 45, category: "Hair" },
      { name: "Balayage", price: 4500, duration: 150, category: "Hair" },
      { name: "Hair Coloring", price: 3000, duration: 120, category: "Hair" },
      { name: "Hair Spa", price: 1500, duration: 60, category: "Hair" }
    ]
  },
  {
    name: "BBLUNT",
    description: "Premium salon brand by Adhuna Bhabani offering personalized hair services.",
    address: "Khader Nawaz Khan Road, Nungambakkam, Chennai 600034",
    area: "Nungambakkam",
    reviewCount: 380,
    rating: 4.7,
    image: "",
    latitude: 13.0540,
    longitude: 80.2480,
    priceRange: "₹₹₹",
    phone: "+91 44 2833 5050",
    openHours: "10am – 8pm",
    tags: ["premium", "celebrity", "hair"],
    featured: false,
    services: [
      { name: "Haircut", price: 1200, duration: 60, category: "Hair" },
      { name: "Hair Coloring", price: 3500, duration: 120, category: "Hair" },
      { name: "Blow-dry", price: 800, duration: 30, category: "Hair" },
      { name: "Hair Treatment", price: 2000, duration: 60, category: "Hair" }
    ]
  },
  {
    name: "Vurve Salon",
    description: "Gen Z favorite with 15 locations across Chennai for trendy cuts and color.",
    address: "14, Dr Nair Road, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    reviewCount: 4200,
    rating: 4.9,
    image: "https://vurvesalon.com/wp-content/uploads/2024/06/salon-tnager.png",
    latitude: 13.0433,
    longitude: 80.2406,
    priceRange: "₹₹",
    phone: "+91 92 8282 9282",
    openHours: "10am – 8pm",
    tags: ["trendy", "gen-z", "multilocation"],
    featured: true,
    services: [
      { name: "Haircut Stylist", price: 1000, duration: 45, category: "Hair" },
      { name: "Haircut Director", price: 1900, duration: 60, category: "Hair" },
      { name: "Beard Trim", price: 400, duration: 20, category: "Grooming" },
      { name: "Threading Eyebrow", price: 175, duration: 15, category: "Beauty" },
      { name: "Full Body Waxing", price: 4000, duration: 120, category: "Beauty" },
      { name: "Signature Facial", price: 3850, duration: 60, category: "Skin" }
    ]
  },
  {
    name: "Studio Profile",
    description: "Premium unisex salon chain known for precision haircuts and grooming.",
    address: "3rd Floor, VR Mall, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    reviewCount: 650,
    rating: 4.5,
    image: "",
    latitude: 13.0885,
    longitude: 80.2100,
    priceRange: "₹₹₹",
    phone: "+91 44 2620 2020",
    openHours: "11am – 9pm",
    tags: ["premium", "mall", "grooming"],
    featured: false,
    services: [
      { name: "Haircut", price: 700, duration: 45, category: "Hair" },
      { name: "Hair Styling", price: 1200, duration: 60, category: "Hair" },
      { name: "Facial", price: 1000, duration: 60, category: "Skin" },
      { name: "Grooming Package", price: 1500, duration: 90, category: "Grooming" }
    ]
  },
  {
    name: "Green Trends",
    description: "Well-established unisex salon chain with multiple outlets across Chennai.",
    address: "45, Velachery Main Road, Velachery, Chennai 600042",
    area: "Velachery",
    reviewCount: 1800,
    rating: 4.6,
    image: "",
    latitude: 12.9815,
    longitude: 80.2180,
    priceRange: "₹₹",
    phone: "+91 44 4200 5678",
    openHours: "9:30am – 9pm",
    tags: ["unisex", "chain", "affordable"],
    featured: false,
    services: [
      { name: "Haircut", price: 250, duration: 30, category: "Hair" },
      { name: "Hair Coloring", price: 1800, duration: 120, category: "Hair" },
      { name: "Facial", price: 600, duration: 45, category: "Skin" },
      { name: "Waxing", price: 200, duration: 20, category: "Beauty" }
    ]
  },
  {
    name: "YLG Salon Adyar",
    description: "Premium hair, skin & waxing salon with ELT facials and Next Gen Waxing.",
    address: "62, 2nd Main Road, Gandhi Nagar, Adyar, Chennai 600020",
    area: "Adyar",
    reviewCount: 1210,
    rating: 4.7,
    image: "https://ylgchennai.in/assets/images/salon-interior-adyar-poster.jpg",
    latitude: 13.0081,
    longitude: 80.2514,
    priceRange: "₹₹",
    phone: "+91 75501 96111",
    openHours: "10am – 8pm",
    tags: ["waxing", "facial", "premium"],
    featured: true,
    services: [
      { name: "Haircut", price: 499, duration: 45, category: "Hair" },
      { name: "Hair Color", price: 2500, duration: 120, category: "Hair" },
      { name: "ELT Facial", price: 2500, duration: 60, category: "Skin" },
      { name: "Next Gen Waxing", price: 800, duration: 30, category: "Beauty" },
      { name: "Bridal Makeup", price: 7999, duration: 240, category: "Bridal" }
    ]
  },
  {
    name: "Virtue Salon",
    description: "Luxury unisex salon with Davines & Schwarzkopf products in Anna Nagar.",
    address: "AA-144, 3rd Avenue, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    reviewCount: 440,
    rating: 4.7,
    image: "",
    latitude: 13.0870,
    longitude: 80.2140,
    priceRange: "₹₹",
    phone: "+91 44 2620 4040",
    openHours: "10am – 8pm",
    tags: ["luxury", "anna-nagar", "davines"],
    featured: false,
    services: [
      { name: "Haircut", price: 600, duration: 45, category: "Hair" },
      { name: "Keratin Treatment", price: 3500, duration: 120, category: "Hair" },
      { name: "Hair Coloring", price: 2500, duration: 120, category: "Hair" },
      { name: "Facial", price: 900, duration: 60, category: "Skin" }
    ]
  },
  {
    name: "Toni & Guy",
    description: "International premium salon brand with world-class styling in the heart of Anna Nagar.",
    address: "Y 206 Golden Glade, 5th Avenue, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    reviewCount: 289,
    rating: 4.7,
    image: "https://toniandguysalon.in/wp-content/uploads/2026/05/cf7a262b-2bdf-46c9-9075-07c7837b50cc.webp",
    latitude: 13.0865,
    longitude: 80.2118,
    priceRange: "₹₹₹",
    phone: "+91 89259 15912",
    openHours: "10am – 8pm",
    tags: ["luxury", "international", "hair"],
    featured: true,
    services: [
      { name: "Haircut Stylist", price: 800, duration: 45, category: "Hair" },
      { name: "Haircut Director", price: 1800, duration: 60, category: "Hair" },
      { name: "Hair Coloring", price: 3500, duration: 120, category: "Hair" },
      { name: "Keratin Treatment", price: 5000, duration: 150, category: "Hair" }
    ]
  },
  {
    name: "FootFetish Signature Salon & Spa",
    description: "Premium salon and spa with reflexology focus and beauty services.",
    address: "New Avadi Road, Kilpauk, Chennai 600010",
    area: "Kilpauk",
    reviewCount: 580,
    rating: 4.7,
    image: "",
    latitude: 13.0802,
    longitude: 80.2387,
    priceRange: "₹₹₹",
    phone: "+91 44 2643 5050",
    openHours: "10am – 8pm",
    tags: ["spa", "reflexology", "kilpauk"],
    featured: false,
    services: [
      { name: "Haircut", price: 600, duration: 45, category: "Hair" },
      { name: "Spa Massage", price: 1800, duration: 60, category: "Spa" },
      { name: "Facial", price: 1200, duration: 60, category: "Skin" },
      { name: "Pedicure", price: 700, duration: 45, category: "Nails" }
    ]
  },
  {
    name: "Zique Luxury Salon And Spa",
    description: "High-end salon and spa in Chetpet with premium beauty treatments.",
    address: "Raintree Place, MC Nicholas Road, Chetpet, Chennai 600031",
    area: "Chetpet",
    reviewCount: 340,
    rating: 4.8,
    image: "",
    latitude: 13.0705,
    longitude: 80.2425,
    priceRange: "₹₹₹",
    phone: "+91 44 2836 4040",
    openHours: "10am – 8pm",
    tags: ["luxury", "spa", "chetpet"],
    featured: false,
    services: [
      { name: "Haircut", price: 1000, duration: 60, category: "Hair" },
      { name: "Spa", price: 2500, duration: 90, category: "Spa" },
      { name: "Facial", price: 2000, duration: 60, category: "Skin" },
      { name: "Bridal Makeup", price: 10000, duration: 240, category: "Bridal" }
    ]
  },
  {
    name: "PLSH Unisex Salon",
    description: "Modern unisex salon popular for hair extensions, cuts, and coloring in T.Nagar.",
    address: "Habibullah Road, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    reviewCount: 280,
    rating: 4.7,
    image: "",
    latitude: 13.0430,
    longitude: 80.2355,
    priceRange: "₹₹",
    phone: "+91 44 4200 2323",
    openHours: "10am – 9pm",
    tags: ["modern", "hair-extensions", "t-nagar"],
    featured: false,
    services: [
      { name: "Haircut", price: 400, duration: 45, category: "Hair" },
      { name: "Hair Extensions", price: 5000, duration: 180, category: "Hair" },
      { name: "Hair Coloring", price: 2000, duration: 120, category: "Hair" },
      { name: "Keratin", price: 3000, duration: 120, category: "Hair" }
    ]
  },
  {
    name: "Limelite Salon and Spa",
    description: "Premium salon chain under CavinKare offering comprehensive beauty services.",
    address: "Cenotaph Road, Alwarpet, Chennai 600018",
    area: "Alwarpet",
    reviewCount: 900,
    rating: 4.6,
    image: "",
    latitude: 13.0350,
    longitude: 80.2485,
    priceRange: "₹₹",
    phone: "+91 44 4200 8080",
    openHours: "10am – 8pm",
    tags: ["chain", "unisex", "spa"],
    featured: false,
    services: [
      { name: "Haircut", price: 500, duration: 45, category: "Hair" },
      { name: "Hair Coloring", price: 2000, duration: 120, category: "Hair" },
      { name: "Spa", price: 1500, duration: 60, category: "Spa" },
      { name: "Facial", price: 800, duration: 60, category: "Skin" }
    ]
  },
  {
    name: "Zewez Signature Salon",
    description: "Eco-conscious luxury salon using Kevin Murphy & Davines with 95% waste recycling.",
    address: "Chennai (multiple locations)",
    area: "Chennai",
    reviewCount: 320,
    rating: 4.8,
    image: "",
    latitude: 13.0500,
    longitude: 80.2300,
    priceRange: "₹₹₹",
    phone: "+91 44 4200 9999",
    openHours: "10am – 8pm",
    tags: ["eco-friendly", "luxury", "sustainable"],
    featured: false,
    services: [
      { name: "Haircut", price: 900, duration: 45, category: "Hair" },
      { name: "Hair Coloring", price: 3000, duration: 120, category: "Hair" },
      { name: "HydraFacial", price: 3500, duration: 60, category: "Skin" },
      { name: "Keratin", price: 4500, duration: 150, category: "Hair" }
    ]
  },
  {
    name: "Salon Volume",
    description: "Bridal studio and unisex salon in Pallikaranai known for bridal makeup and hair color.",
    address: "81, Velachery Main Road, Pallikaranai, Chennai 600100",
    area: "Pallikaranai",
    reviewCount: 210,
    rating: 4.6,
    image: "",
    latitude: 12.9380,
    longitude: 80.2078,
    priceRange: "₹₹",
    phone: "+91 44 4200 1111",
    openHours: "10am – 8pm",
    tags: ["bridal", "unisex", "pallikaranai"],
    featured: false,
    services: [
      { name: "Haircut", price: 300, duration: 30, category: "Hair" },
      { name: "Bridal Makeup", price: 6000, duration: 180, category: "Bridal" },
      { name: "Hair Coloring", price: 2000, duration: 120, category: "Hair" },
      { name: "Facial", price: 600, duration: 45, category: "Skin" }
    ]
  },
  {
    name: "Vurve Salon Velachery",
    description: "Vurve Salon in Velachery offering premium hair, beauty & nail services.",
    address: "81, 100 Feet Road, Rajalakshmi Nagar, Velachery, Chennai 600042",
    area: "Velachery",
    reviewCount: 1200,
    rating: 4.8,
    image: "https://vurvesalon.com/wp-content/uploads/2024/06/salon-velachery.png",
    latitude: 12.9810,
    longitude: 80.2205,
    priceRange: "₹₹",
    phone: "+91 44 4868 0220",
    openHours: "10am – 8pm",
    tags: ["trendy", "velachery", "unisex"],
    featured: false,
    services: [
      { name: "Haircut Stylist", price: 1000, duration: 45, category: "Hair" },
      { name: "Hair Coloring", price: 3000, duration: 120, category: "Hair" },
      { name: "Facial", price: 3850, duration: 60, category: "Skin" },
      { name: "Nail Art", price: 800, duration: 45, category: "Nails" }
    ]
  }
];

async function main() {
  console.log('🧹 Cleaning up database...');
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.favourite.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.salon.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🌱 Seeding salons and services...');

  let imageCounter = 0;
  for (const rawSalon of salonsData) {
    let imageUrl = rawSalon.image;
    if (!imageUrl) {
      imageUrl = fallbackImages[imageCounter % fallbackImages.length];
      imageCounter++;
    }

    // Calculate price range dynamically from the list of services
    const prices = rawSalon.services.map(s => s.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const formattedPriceRange = minPrice === maxPrice 
      ? `₹${minPrice}`
      : `₹${minPrice} - ₹${maxPrice}`;

    const created = await prisma.salon.create({
      data: {
        name: rawSalon.name,
        description: rawSalon.description,
        address: rawSalon.address,
        area: rawSalon.area,
        rating: rawSalon.rating,
        reviewCount: rawSalon.reviewCount,
        latitude: rawSalon.latitude,
        longitude: rawSalon.longitude,
        priceRange: formattedPriceRange,
        image: imageUrl,
        phone: rawSalon.phone,
        openHours: rawSalon.openHours,
        tags: JSON.stringify(rawSalon.tags),
        featured: rawSalon.featured,
        services: {
          create: rawSalon.services
        }
      }
    });
    console.log(`  ✅ Created: ${created.name}`);
  }

  console.log('👤 Seeding demo user...');
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@beautyhubai.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@beautyhubai.com',
      password: 'hashed'
    },
  });

  console.log('💬 Seeding reviews...');
  const createdSalons = await prisma.salon.findMany({ select: { id: true } });

  const demoReviews = [
    { rating: 5, comment: 'Amazing haircut! The stylist really understood what I wanted.', userName: 'Priya S' },
    { rating: 4, comment: 'Great service overall. Pricing is reasonable for the quality.', userName: 'Meera K' },
    { rating: 5, comment: 'Best keratin treatment in Chennai. My hair is silky smooth!', userName: 'Divya R' },
    { rating: 5, comment: 'The bridal makeup was absolutely stunning. Worth every rupee!', userName: 'Ananya M' },
    { rating: 4, comment: 'Professional staff, clean environment. Slight wait time on weekends.', userName: 'Kavitha L' },
    { rating: 5, comment: 'World class experience. The balayage looks incredible!', userName: 'Shruti N' },
    { rating: 4, comment: 'Good value for money. Quick and clean service.', userName: 'Ranjith K' },
    { rating: 4, comment: 'Loved the ombre color! Staff was very friendly.', userName: 'Nithya P' },
    { rating: 5, comment: 'Perfect bridal package! They took care of everything.', userName: 'Saranya T' },
    { rating: 5, comment: 'The keratin smoothing is unreal. Best experience!', userName: 'Keerthana V' },
  ];

  for (let i = 0; i < demoReviews.length; i++) {
    const review = demoReviews[i];
    const salon = createdSalons[i % createdSalons.length];
    await prisma.review.create({
      data: {
        rating: review.rating,
        comment: review.comment,
        userName: review.userName,
        userId: demoUser.id,
        salonId: salon.id,
      },
    });
  }

  console.log(`🎉 Seeding complete! ${createdSalons.length} salons and reviews seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
