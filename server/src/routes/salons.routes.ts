import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/salons — list with filters
router.get('/', async (req, res) => {
  try {
    const { area, priceRange, minRating, service, sort, search, featured } = req.query;

    const where: Record<string, unknown> = {};
    if (area) where.area = area;
    if (priceRange) where.priceRange = priceRange;
    if (featured === 'true') where.featured = true;
    if (minRating) where.rating = { gte: parseFloat(minRating as string) };
    if (service) {
      where.services = { some: { name: { contains: service as string } } };
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { area: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    let orderBy: Record<string, string> = { rating: 'desc' };
    if (sort === 'price_asc') orderBy = { priceRange: 'asc' };
    if (sort === 'price_desc') orderBy = { priceRange: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'reviews') orderBy = { reviewCount: 'desc' };

    const salons = await prisma.salon.findMany({
      where,
      orderBy,
      include: { services: true },
    });

    res.json({ salons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/salons/:id — single salon
router.get('/:id', async (req, res) => {
  try {
    const salon = await prisma.salon.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { services: true },
    });
    if (!salon) { res.status(404).json({ error: 'Salon not found' }); return; }
    res.json({ salon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/salons/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { salonId: parseInt(req.params.id) },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/salons/:id/reviews
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userId, rating, comment, userName, userAvatar } = req.body;
    const salonId = parseInt(req.params.id);

    const review = await prisma.review.create({
      data: { userId, salonId, rating, comment, userName, userAvatar },
    });

    // Update salon aggregate rating
    const allReviews = await prisma.review.findMany({ where: { salonId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.salon.update({
      where: { id: salonId },
      data: { rating: parseFloat(avgRating.toFixed(1)), reviewCount: allReviews.length },
    });

    res.status(201).json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
