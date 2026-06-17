import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// POST /api/favourites — toggle favourite
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { salonId } = req.body;
    const userId = req.userId!;

    const existing = await prisma.favourite.findUnique({
      where: { userId_salonId: { userId, salonId: parseInt(salonId) } },
    });

    if (existing) {
      await prisma.favourite.delete({ where: { id: existing.id } });
      res.json({ favourited: false });
    } else {
      await prisma.favourite.create({ data: { userId, salonId: parseInt(salonId) } });
      res.json({ favourited: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/favourites/me
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const favourites = await prisma.favourite.findMany({
      where: { userId: req.userId! },
      include: { salon: { include: { services: true } } },
    });
    res.json({ favourites: favourites.map((f) => f.salon) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
