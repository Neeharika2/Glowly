import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Chennai salons...');

  const salons = [
    {
      name: 'Naturals Salon & Spa',
      description: 'Premium salon chain known for expert hair care and skin treatments across Chennai.',
      address: '42, Anna Salai, Teynampet',
      area: 'Teynampet',
      rating: 4.5,
      reviewCount: 312,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
      latitude: 13.0418,
      longitude: 80.2481,
      priceRange: '₹₹',
      phone: '+91 44 2435 6789',
      openHours: '9am – 8pm',
      tags: JSON.stringify(['hair', 'skin', 'bridal']),
      featured: true,
      services: [
        { name: 'Haircut', price: 400, duration: 30, category: 'Hair' },
        { name: 'Hair Spa', price: 1200, duration: 60, category: 'Hair' },
        { name: 'Facial', price: 800, duration: 45, category: 'Skin' },
        { name: 'Bridal Makeup', price: 8000, duration: 180, category: 'Bridal' },
        { name: 'Manicure', price: 500, duration: 40, category: 'Nails' },
      ],
    },
    {
      name: 'Green Trends',
      description: 'Eco-friendly luxury salon with trained professionals and a relaxing ambience.',
      address: '18, Nelson Manickam Road, Aminjikarai',
      area: 'Anna Nagar',
      rating: 4.3,
      reviewCount: 198,
      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80',
      latitude: 13.0862,
      longitude: 80.2101,
      priceRange: '₹₹',
      phone: '+91 44 2374 5612',
      openHours: '10am – 8pm',
      tags: JSON.stringify(['eco', 'hair', 'skin']),
      featured: true,
      services: [
        { name: 'Haircut & Style', price: 350, duration: 35, category: 'Hair' },
        { name: 'Keratin Treatment', price: 3500, duration: 120, category: 'Hair' },
        { name: 'Clean-up Facial', price: 600, duration: 40, category: 'Skin' },
        { name: 'Pedicure', price: 600, duration: 45, category: 'Nails' },
        { name: 'Threading', price: 50, duration: 10, category: 'Beauty' },
      ],
    },
    {
      name: 'Lakme Salon',
      description: 'India\'s iconic beauty brand. Expert stylists and premium products guaranteed.',
      address: '7, G.N. Chetty Road, T. Nagar',
      area: 'T Nagar',
      rating: 4.6,
      reviewCount: 425,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
      latitude: 13.0418,
      longitude: 80.2320,
      priceRange: '₹₹₹',
      phone: '+91 44 2815 3322',
      openHours: '9am – 9pm',
      tags: JSON.stringify(['premium', 'bridal', 'hair', 'makeup']),
      featured: true,
      services: [
        { name: 'Signature Haircut', price: 700, duration: 45, category: 'Hair' },
        { name: 'Bridal Makeup', price: 12000, duration: 210, category: 'Bridal' },
        { name: 'Balayage', price: 4500, duration: 150, category: 'Hair' },
        { name: 'Gold Facial', price: 1500, duration: 60, category: 'Skin' },
        { name: 'Party Makeup', price: 2500, duration: 90, category: 'Makeup' },
      ],
    },
    {
      name: 'Toni & Guy',
      description: 'International premium salon brand with world-class styling in the heart of Chennai.',
      address: '110, Nungambakkam High Road',
      area: 'Nungambakkam',
      rating: 4.7,
      reviewCount: 289,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
      latitude: 13.0609,
      longitude: 80.2437,
      priceRange: '₹₹₹',
      phone: '+91 44 4567 8901',
      openHours: '10am – 8pm',
      tags: JSON.stringify(['luxury', 'international', 'hair']),
      featured: true,
      services: [
        { name: 'Creative Cut', price: 1200, duration: 60, category: 'Hair' },
        { name: 'Colour & Highlights', price: 3500, duration: 120, category: 'Hair' },
        { name: 'Brazilian Blowout', price: 5000, duration: 150, category: 'Hair' },
        { name: 'Deep Conditioning', price: 1800, duration: 60, category: 'Hair' },
      ],
    },
    {
      name: 'Jawed Habib Hair & Beauty',
      description: 'Affordable expert styling for men and women. Known for precision cuts.',
      address: '3rd Floor, Phoenix Marketcity, Velachery',
      area: 'Velachery',
      rating: 4.2,
      reviewCount: 156,
      image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=80',
      latitude: 12.9813,
      longitude: 80.2206,
      priceRange: '₹',
      phone: '+91 44 6680 5544',
      openHours: '10am – 10pm',
      tags: JSON.stringify(['affordable', 'hair', 'men']),
      featured: false,
      services: [
        { name: 'Mens Haircut', price: 250, duration: 25, category: 'Hair' },
        { name: 'Womens Haircut', price: 400, duration: 35, category: 'Hair' },
        { name: 'Hair Color', price: 1500, duration: 90, category: 'Hair' },
        { name: 'Beard Trim', price: 150, duration: 15, category: 'Grooming' },
        { name: 'Facial', price: 500, duration: 40, category: 'Skin' },
      ],
    },
    {
      name: 'Bounce Salon',
      description: 'Trendy salon popular with young professionals. Great for modern cuts and colors.',
      address: '56, 2nd Avenue, Anna Nagar',
      area: 'Anna Nagar',
      rating: 4.4,
      reviewCount: 203,
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80',
      latitude: 13.0856,
      longitude: 80.2097,
      priceRange: '₹₹',
      phone: '+91 44 2626 7788',
      openHours: '9:30am – 8:30pm',
      tags: JSON.stringify(['trendy', 'hair', 'color']),
      featured: false,
      services: [
        { name: 'Style Cut', price: 450, duration: 35, category: 'Hair' },
        { name: 'Ombre Color', price: 2800, duration: 120, category: 'Hair' },
        { name: 'Hair Spa', price: 1000, duration: 60, category: 'Hair' },
        { name: 'Manicure', price: 400, duration: 35, category: 'Nails' },
        { name: 'Pedicure', price: 500, duration: 45, category: 'Nails' },
      ],
    },
    {
      name: 'Femina Beauty Salon',
      description: 'Women-only boutique salon in Adyar. Specialising in skin care and bridal packages.',
      address: '24, LB Road, Adyar',
      area: 'Adyar',
      rating: 4.5,
      reviewCount: 178,
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
      latitude: 13.0012,
      longitude: 80.2565,
      priceRange: '₹₹',
      phone: '+91 44 2441 9900',
      openHours: '9am – 7pm',
      tags: JSON.stringify(['women-only', 'bridal', 'skin']),
      featured: false,
      services: [
        { name: 'Bridal Makeup', price: 7500, duration: 180, category: 'Bridal' },
        { name: 'Saree Draping', price: 500, duration: 30, category: 'Bridal' },
        { name: 'D-Tan Facial', price: 700, duration: 45, category: 'Skin' },
        { name: 'Full Body Waxing', price: 1200, duration: 60, category: 'Beauty' },
        { name: 'Mehendi', price: 800, duration: 90, category: 'Bridal' },
      ],
    },
    {
      name: 'Strands Salon',
      description: 'Upscale hair studio in OMR with celebrity stylists. Best for transformations.',
      address: '101, OMR Road, Sholinganallur',
      area: 'OMR',
      rating: 4.8,
      reviewCount: 267,
      image: 'https://images.unsplash.com/photo-1633681122182-c3fcb02e6bce?w=800&q=80',
      latitude: 12.9001,
      longitude: 80.2275,
      priceRange: '₹₹₹',
      phone: '+91 44 6688 0011',
      openHours: '10am – 8pm',
      tags: JSON.stringify(['luxury', 'hair', 'transformation']),
      featured: true,
      services: [
        { name: 'Luxury Cut & Style', price: 1500, duration: 75, category: 'Hair' },
        { name: 'Keratin Smoothing', price: 6000, duration: 180, category: 'Hair' },
        { name: 'Full Color', price: 3000, duration: 120, category: 'Hair' },
        { name: 'Scalp Treatment', price: 2000, duration: 60, category: 'Hair' },
        { name: 'Olaplex Treatment', price: 2500, duration: 90, category: 'Hair' },
      ],
    },
    {
      name: 'Beauty Secrets',
      description: 'Trusted neighbourhood salon in Kodambakkam with loyal clientele since 2005.',
      address: '15, Kodambakkam High Road',
      area: 'Kodambakkam',
      rating: 4.1,
      reviewCount: 134,
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
      latitude: 13.0527,
      longitude: 80.2186,
      priceRange: '₹',
      phone: '+91 44 2374 1122',
      openHours: '9am – 7:30pm',
      tags: JSON.stringify(['affordable', 'neighbourhood', 'skin']),
      featured: false,
      services: [
        { name: 'Haircut', price: 200, duration: 25, category: 'Hair' },
        { name: 'Basic Facial', price: 300, duration: 35, category: 'Skin' },
        { name: 'Threading', price: 40, duration: 10, category: 'Beauty' },
        { name: 'Waxing (Arms)', price: 200, duration: 20, category: 'Beauty' },
        { name: 'Manicure', price: 300, duration: 30, category: 'Nails' },
      ],
    },
    {
      name: 'Mirrors Unisex Salon',
      description: 'Modern unisex salon offering premium grooming for men and women in Porur.',
      address: '78, Porur Main Road',
      area: 'Porur',
      rating: 4.3,
      reviewCount: 112,
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
      latitude: 13.0334,
      longitude: 80.1579,
      priceRange: '₹₹',
      phone: '+91 44 2482 6677',
      openHours: '9am – 8pm',
      tags: JSON.stringify(['unisex', 'grooming', 'men']),
      featured: false,
      services: [
        { name: 'Mens Cut & Style', price: 300, duration: 30, category: 'Hair' },
        { name: 'Womens Cut', price: 450, duration: 40, category: 'Hair' },
        { name: 'Clean Shave', price: 200, duration: 20, category: 'Grooming' },
        { name: 'De-tan Facial', price: 600, duration: 45, category: 'Skin' },
        { name: 'Pedicure', price: 500, duration: 40, category: 'Nails' },
      ],
    },
  ];

  for (const salonData of salons) {
    const { services, ...salon } = salonData;
    const created = await prisma.salon.create({
      data: {
        ...salon,
        rating: salon.rating,
        services: { create: services },
      },
    });
    console.log(`  ✅ Created: ${created.name}`);
  }

  // Seed demo reviews
  const demoReviews = [
    { salonId: 1, rating: 5, comment: 'Amazing haircut! The stylist really understood what I wanted.', userName: 'Priya S', userId: 1 },
    { salonId: 1, rating: 4, comment: 'Great service overall. Pricing is reasonable for the quality.', userName: 'Meera K', userId: 1 },
    { salonId: 2, rating: 5, comment: 'Best keratin treatment in Chennai. My hair is silky smooth!', userName: 'Divya R', userId: 1 },
    { salonId: 3, rating: 5, comment: 'The bridal makeup was absolutely stunning. Worth every rupee!', userName: 'Ananya M', userId: 1 },
    { salonId: 3, rating: 4, comment: 'Professional staff, clean environment. Slight wait time on weekends.', userName: 'Kavitha L', userId: 1 },
    { salonId: 4, rating: 5, comment: 'World class experience. The balayage looks incredible!', userName: 'Shruti N', userId: 1 },
    { salonId: 5, rating: 4, comment: 'Good value for money. Quick and clean service.', userName: 'Ranjith K', userId: 1 },
    { salonId: 6, rating: 4, comment: 'Loved the ombre color! Staff was very friendly.', userName: 'Nithya P', userId: 1 },
    { salonId: 7, rating: 5, comment: 'Perfect bridal package! They took care of everything.', userName: 'Saranya T', userId: 1 },
    { salonId: 8, rating: 5, comment: 'The keratin smoothing is unreal. Best salon in OMR.', userName: 'Keerthana V', userId: 1 },
  ];

  // Create a demo user first for reviews
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@beautyhubnai.com' },
    update: {},
    create: { name: 'Demo User', email: 'demo@beautyhubai.com', password: 'hashed' },
  });

  for (const review of demoReviews) {
    await prisma.review.create({
      data: { ...review, userId: demoUser.id },
    });
  }

  console.log('🎉 Seeding complete! 10 salons + demo reviews added.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
