import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// POST /api/bookings — create booking
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { salonId, serviceId, date, time } = req.body;
    const userId = req.userId!;

    const booking = await prisma.booking.create({
      data: {
        userId,
        salonId: parseInt(salonId),
        serviceId: parseInt(serviceId),
        date: new Date(date),
        time,
        status: 'confirmed',
      },
      include: {
        salon: { select: { name: true, image: true, address: true } },
        service: { select: { name: true, price: true } },
      },
    });

    res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/bookings/me — user's bookings
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId! },
      include: {
        salon: { select: { name: true, image: true, address: true, area: true } },
        service: { select: { name: true, price: true } },
      },
      orderBy: { date: 'desc' },
    });
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/bookings/:id — cancel booking
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!booking || booking.userId !== req.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    await prisma.booking.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'cancelled' },
    });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
