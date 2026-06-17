import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// POST /api/reviews
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { salonId, rating, comment, userName, userAvatar } = req.body;
    const userId = req.userId!;

    const review = await prisma.review.create({
      data: { userId, salonId: parseInt(salonId), rating, comment, userName, userAvatar },
    });

    // Recalculate salon rating
    const allReviews = await prisma.review.findMany({ where: { salonId: parseInt(salonId) } });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await prisma.salon.update({
      where: { id: parseInt(salonId) },
      data: { rating: parseFloat(avg.toFixed(1)), reviewCount: allReviews.length },
    });

    res.status(201).json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
