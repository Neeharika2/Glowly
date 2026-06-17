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

function mapServiceNameToObject(name: string): { name: string; price: number; duration: number; category: string } {
  const cleanName = name.toLowerCase().trim();
  let price = 500;
  let duration = 45;
  let category = 'General';

  if (cleanName.includes('haircut') || cleanName.includes('hair cut')) {
    price = 400;
    duration = 30;
    category = 'Hair';
  } else if (cleanName.includes('color') || cleanName.includes('colouring') || cleanName.includes('balayage') || cleanName.includes('highlight') || cleanName.includes('dying')) {
    price = 2500;
    duration = 90;
    category = 'Hair';
  } else if (cleanName.includes('spa')) {
    price = 1200;
    duration = 60;
    category = 'Spa';
  } else if (cleanName.includes('bridal') || cleanName.includes('makeup') || cleanName.includes('make up')) {
    price = 8000;
    duration = 180;
    category = 'Bridal';
  } else if (cleanName.includes('facial') || cleanName.includes('hydrafacial') || cleanName.includes('skin')) {
    price = 1500;
    duration = 60;
    category = 'Skin';
  } else if (cleanName.includes('manicure')) {
    price = 600;
    duration = 45;
    category = 'Nails';
  } else if (cleanName.includes('pedicure')) {
    price = 700;
    duration = 45;
    category = 'Nails';
  } else if (cleanName.includes('nail art') || cleanName.includes('nail extensions')) {
    price = 800;
    duration = 60;
    category = 'Nails';
  } else if (cleanName.includes('waxing')) {
    price = 900;
    duration = 45;
    category = 'Skin';
  } else if (cleanName.includes('threading')) {
    price = 60;
    duration = 10;
    category = 'Beauty';
  } else if (cleanName.includes('massage')) {
    price = 2000;
    duration = 60;
    category = 'Spa';
  } else if (cleanName.includes('keratin') || cleanName.includes('smoothening') || cleanName.includes('botox') || cleanName.includes('olaplex') || cleanName.includes('kerastase') || cleanName.includes('treatment')) {
    price = 4500;
    duration = 120;
    category = 'Hair';
  } else if (cleanName.includes('styling') || cleanName.includes('blow-dry') || cleanName.includes('blowdry')) {
    price = 600;
    duration = 30;
    category = 'Hair';
  } else if (cleanName.includes('grooming') || cleanName.includes('men')) {
    price = 800;
    duration = 45;
    category = 'Grooming';
  }

  return {
    name,
    price,
    duration,
    category
  };
}

const rawSalons = [
  {
    name: "Ornatrix Unisex Hair Studio",
    description: "5-star rated unisex salon known for precision cuts, hair coloring & spa treatments.",
    address: "Parthasarathy Nagar, Manapakkam, Chennai 600125",
    area: "Manapakkam",
    rating: 5.0,
    latitude: "12.9921",
    longitude: "80.1771",
    priceRange: "₹300 - ₹3,000",
    services: ["Haircuts", "Hair Coloring", "Highlights", "Hair Spa", "Men's Grooming"],
    image: ""
  },
  {
    name: "Naturals Signature Salon",
    description: "Premium unisex chain with 3300+ reviews, luxury bridal & skincare services.",
    address: "87, Arcot Road, Avm Nagar, Saligramam, Chennai 600093",
    area: "Saligramam",
    rating: 4.9,
    latitude: "13.0513",
    longitude: "80.1542",
    priceRange: "₹350 - ₹8,000",
    services: ["Bridal Makeup", "Hair Smoothening", "Keratin", "Facials", "Waxing", "Threading"],
    image: ""
  },
  {
    name: "Bounce Unisex Salon Ashoknagar",
    description: "Trendy unisex salon popular for fashion hair coloring and modern styling.",
    address: "Nelson Manickam Rd, Aminjikarai, Chennai 600029",
    area: "Aminjikarai",
    rating: 4.9,
    latitude: "13.0538",
    longitude: "80.2231",
    priceRange: "₹400 - ₹4,000",
    services: ["Fashion Hair Coloring", "Haircuts", "Styling", "Grooming Packages"],
    image: ""
  },
  {
    name: "VIBE Unisex Salon",
    description: "Premium quality salon in T. Nagar at competitive pricing with 1500+ reviews.",
    address: "Dhandapani Street, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    rating: 4.9,
    latitude: "13.0418",
    longitude: "80.2342",
    priceRange: "₹300 - ₹3,500",
    services: ["Haircuts", "Hair Styling", "Facials", "Manicure", "Pedicure"],
    image: ""
  },
  {
    name: "Lakme Salon",
    description: "Iconic salon chain by Lakme, leading bridal makeup destination in Chennai.",
    address: "Somasundaram Street, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    rating: 4.9,
    latitude: "13.0405",
    longitude: "80.2335",
    priceRange: "₹500 - ₹10,000",
    services: ["Bridal Makeup", "Hair Smoothening", "Skin Treatments", "Party Makeup", "Haircuts"],
    image: ""
  },
  {
    name: "Toni & Guy Hairdressing",
    description: "London-trained stylists offering premium hairdressing and signature cutting techniques.",
    address: "Rangarajapuram Main Road, Kodambakkam, Chennai 600024",
    area: "Kodambakkam",
    rating: 4.9,
    latitude: "13.0456",
    longitude: "80.2261",
    priceRange: "₹400 - ₹2,500",
    services: ["Haircuts", "Hair Coloring", "Keratin Treatment", "Bridal Hair", "Botox Treatment"],
    image: ""
  },
  {
    name: "Green Trends Academy",
    description: "Popular unisex chain known for affordable grooming and beauty services.",
    address: "South Usman Road, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    rating: 4.9,
    latitude: "13.0398",
    longitude: "80.2325",
    priceRange: "₹200 - ₹3,000",
    services: ["Haircuts", "Facials", "Waxing", "Threading", "Manicure", "Pedicure"],
    image: ""
  },
  {
    name: "Dessange Paris",
    description: "French luxury salon brand known for signature hair spas and elegant ambiance.",
    address: "Cenotaph Road, Teynampet, Chennai 600018",
    area: "Teynampet",
    rating: 4.8,
    latitude: "13.0375",
    longitude: "80.2430",
    priceRange: "₹1,000 - ₹8,000",
    services: ["Hair Spa", "Haircuts", "Hair Coloring", "Blow-dry", "Keratin"],
    image: ""
  },
  {
    name: "Page 3 Luxury Salon",
    description: "Premium salon specializing in Kerastase and Olaplex hair treatments.",
    address: "3rd Floor, VR Mall, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    rating: 4.8,
    latitude: "13.0887",
    longitude: "80.2102",
    priceRange: "₹800 - ₹6,000",
    services: ["Kerastase Treatments", "Olaplex", "Hair Coloring", "Facials", "Massages"],
    image: ""
  },
  {
    name: "Wink Wink Salon",
    description: "Trusted neighborhood salon in Alwarpet for haircuts, facials, and nail services.",
    address: "Alwarpet, Chennai 600018",
    area: "Alwarpet",
    rating: 4.7,
    latitude: "13.0320",
    longitude: "80.2505",
    priceRange: "₹500 - ₹4,000",
    services: ["Haircuts", "Hair Coloring", "Facials", "Pedicure", "Manicure"],
    image: ""
  },
  {
    name: "Anlon Art Salon",
    description: "Renowned for skilled stylists, layer haircuts, and balayage highlights.",
    address: "Khader Nawaz Khan Road, Nungambakkam, Chennai 600034",
    area: "Nungambakkam",
    rating: 4.8,
    latitude: "13.0535",
    longitude: "80.2478",
    priceRange: "₹600 - ₹5,000",
    services: ["Layer Haircuts", "Balayage", "Hair Coloring", "Hair Spa", "Styling"],
    image: ""
  },
  {
    name: "BBLUNT",
    description: "Premium salon brand by Adhuna Bhabani offering personalized hair services.",
    address: "Khader Nawaz Khan Road, Nungambakkam, Chennai 600034",
    area: "Nungambakkam",
    rating: 4.7,
    latitude: "13.0540",
    longitude: "80.2480",
    priceRange: "₹800 - ₹6,000",
    services: ["Haircuts", "Hair Coloring", "Blow-dry", "Hair Treatments"],
    image: ""
  },
  {
    name: "Vurve Salon",
    description: "Gen Z favorite with 15 locations across Chennai for trendy cuts and color.",
    address: "Ground Floor, New No 14, Old No 20, Dr Nair Rd, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    rating: 4.9,
    latitude: "13.0433",
    longitude: "80.2406",
    priceRange: "₹175 - ₹17,000",
    services: ["Men's Hair", "Women's Hair", "Hair Coloring", "Nail Art", "Facials", "Waxing"],
    image: "https://vurvesalon.com/wp-content/uploads/2024/06/salon-tnager.png"
  },
  {
    name: "Studio Profile",
    description: "Premium unisex salon chain known for precision haircuts and grooming.",
    address: "3rd Floor, VR Mall, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    rating: 4.5,
    latitude: "13.0885",
    longitude: "80.2100",
    priceRange: "₹500 - ₹3,000",
    services: ["Haircuts", "Hair Styling", "Facials", "Grooming"],
    image: ""
  },
  {
    name: "Green Trends",
    description: "Well-established unisex salon chain with multiple outlets across Chennai.",
    address: "45, Velachery Main Road, Velachery, Chennai 600042",
    area: "Velachery",
    rating: 4.6,
    latitude: "12.9815",
    longitude: "80.2180",
    priceRange: "₹200 - ₹3,000",
    services: ["Haircuts", "Hair Coloring", "Facials", "Waxing", "Threading"],
    image: ""
  },
  {
    name: "YLG Salon",
    description: "Premium hair, skin & waxing salon with ELT facials and Next Gen Waxing.",
    address: "62, 2nd Main Rd, Gandhi Nagar, Adyar, Chennai 600020",
    area: "Adyar",
    rating: 4.7,
    latitude: "13.0081",
    longitude: "80.2514",
    priceRange: "₹100 - ₹5,000",
    services: ["Haircuts", "Hair Coloring", "ELT Facials", "Waxing", "Bridal Makeup"],
    image: "https://ylgchennai.in/assets/images/salon-interior-adyar-poster.jpg"
  },
  {
    name: "Virtue Salon",
    description: "Luxury unisex salon with Davines & Schwarzkopf products in Anna Nagar.",
    address: "AA-144, 3rd Avenue, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    rating: 4.7,
    latitude: "13.0870",
    longitude: "80.2140",
    priceRange: "₹400 - ₹5,000",
    services: ["Haircuts", "Keratin", "Hair Coloring", "Facials", "Waxing", "Manicure"],
    image: ""
  },
  {
    name: "Toni & Guy",
    description: "London-trained hairstylists in a premium salon setting at Anna Nagar.",
    address: "Y 206 Golden Glade, 5th Avenue, Anna Nagar, Chennai 600040",
    area: "Anna Nagar",
    rating: 4.7,
    latitude: "13.0865",
    longitude: "80.2118",
    priceRange: "₹400 - ₹2,500",
    services: ["Haircuts", "Hair Coloring", "Keratin", "Bridal", "Hair Spa"],
    image: "https://toniandguysalon.in/wp-content/uploads/2026/05/cf7a262b-2bdf-46c9-9075-07c7837b50cc.webp"
  },
  {
    name: "FootFetish Signature Salon & Spa",
    description: "Premium salon and spa with reflexology focus and beauty services.",
    address: "New Avadi Road, Kilpauk, Chennai 600010",
    area: "Kilpauk",
    rating: 4.7,
    latitude: "13.0802",
    longitude: "80.2387",
    priceRange: "₹500 - ₹5,000",
    services: ["Spa", "Haircuts", "Facials", "Pedicure", "Manicure", "Waxing"],
    image: ""
  },
  {
    name: "Zique Luxury Salon And Spa",
    description: "High-end salon and spa in Chetpet with premium beauty treatments.",
    address: "Raintree Place, MC Nicholas Road, Chetpet, Chennai 600031",
    area: "Chetpet",
    rating: 4.8,
    latitude: "13.0705",
    longitude: "80.2425",
    priceRange: "₹800 - ₹6,000",
    services: ["Haircuts", "Spa", "Facials", "Massages", "Bridal"],
    image: ""
  },
  {
    name: "PLSH Unisex Salon",
    description: "Modern unisex salon popular for hair extensions, cuts, and coloring in T.Nagar.",
    address: "Habibullah Road, T. Nagar, Chennai 600017",
    area: "T. Nagar",
    rating: 4.7,
    latitude: "13.0430",
    longitude: "80.2355",
    priceRange: "₹300 - ₹4,000",
    services: ["Haircuts", "Hair Coloring", "Hair Extensions", "Keratin", "Facials"],
    image: ""
  },
  {
    name: "Limelite Salon and Spa",
    description: "Premium salon chain under CavinKare offering comprehensive beauty services.",
    address: "Cenotaph Road, Alwarpet, Chennai 600018",
    area: "Alwarpet",
    rating: 4.6,
    latitude: "13.0350",
    longitude: "80.2485",
    priceRange: "₹500 - ₹4,000",
    services: ["Haircuts", "Hair Coloring", "Spa", "Facials", "Bridal"],
    image: ""
  },
  {
    name: "Zewez Signature Salon",
    description: "Eco-conscious luxury salon using Kevin Murphy & Davines with 95% waste recycling.",
    address: "Chennai",
    area: "Chennai",
    rating: 4.8,
    latitude: "13.0500",
    longitude: "80.2300",
    priceRange: "₹600 - ₹6,000",
    services: ["Haircuts", "Hair Coloring", "Keratin", "HydraFacial", "Bridal", "Nail Art"],
    image: ""
  },
  {
    name: "Salon Volume",
    description: "Bridal studio and unisex salon in Pallikaranai known for bridal makeup and hair color.",
    address: "81, Velachery Main Rd, Pallikaranai, Chennai 600100",
    area: "Pallikaranai",
    rating: 4.6,
    latitude: "12.9380",
    longitude: "80.2078",
    priceRange: "₹200 - ₹3,500",
    services: ["Bridal Makeup", "Hair Coloring", "Facials", "Waxing", "Hair Spa"],
    image: ""
  },
  {
    name: "Vurve Salon",
    description: "Vurve Salon in Velachery offering premium hair, beauty & nail services.",
    address: "81, 100 Feet Road, Rajalakshmi Nagar, Velachery, Chennai 600042",
    area: "Velachery",
    rating: 4.8,
    latitude: "12.9810",
    longitude: "80.2205",
    priceRange: "₹175 - ₹17,000",
    services: ["Haircuts", "Hair Coloring", "Facials", "Nail Art", "Waxing", "Massage"],
    image: "https://vurvesalon.com/wp-content/uploads/2024/06/salon-velachery.png"
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
  for (const rawSalon of rawSalons) {
    const services = rawSalon.services.map(mapServiceNameToObject);
    const tags = Array.from(new Set(services.map(s => s.category.toLowerCase())));
    
    let imageUrl = rawSalon.image;
    if (!imageUrl) {
      imageUrl = fallbackImages[imageCounter % fallbackImages.length];
      imageCounter++;
    }

    const lat = typeof rawSalon.latitude === 'string' ? parseFloat(rawSalon.latitude) : rawSalon.latitude;
    const lng = typeof rawSalon.longitude === 'string' ? parseFloat(rawSalon.longitude) : rawSalon.longitude;

    const created = await prisma.salon.create({
      data: {
        name: rawSalon.name,
        description: rawSalon.description,
        address: rawSalon.address,
        area: rawSalon.area,
        rating: rawSalon.rating,
        latitude: lat,
        longitude: lng,
        priceRange: rawSalon.priceRange,
        image: imageUrl,
        tags: JSON.stringify(tags),
        featured: rawSalon.rating >= 4.8,
        services: {
          create: services
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
