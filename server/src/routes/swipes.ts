import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/swipes  { swipedId, direction: "like"|"dislike" }
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { swipedId, direction } = req.body;

  if (!swipedId || !direction) {
    res.status(400).json({ error: 'swipedId and direction are required' });
    return;
  }
  if (!['like', 'dislike'].includes(direction)) {
    res.status(400).json({ error: 'direction must be "like" or "dislike"' });
    return;
  }

  // Сохраняем свайп
  await prisma.swipe.upsert({
    where: { swiperId_swipedId: { swiperId: req.userId as number, swipedId: Number(swipedId) } },
    create: { swiperId: req.userId as number, swipedId: Number(swipedId), direction },
    update: { direction },
  });

  let match = null;

  // Проверяем взаимный лайк
  if (direction === 'like') {
    const mutual = await prisma.swipe.findUnique({
      where: {
        swiperId_swipedId: { swiperId: Number(swipedId), swipedId: req.userId as number },
      },
    });

    if (mutual?.direction === 'like') {
      // Создаём матч (если ещё не существует)
      const existingMatch = await prisma.match.findFirst({
        where: {
          OR: [
            { user1Id: req.userId, user2Id: Number(swipedId) },
            { user1Id: Number(swipedId), user2Id: req.userId },
          ],
        },
      });

      if (!existingMatch) {
        match = await prisma.match.create({
          data: { user1Id: req.userId as number, user2Id: Number(swipedId) },
          include: { user1: true, user2: true },
        });
      }
    }
  }

  res.json({ success: true, match });
});

export default router;
