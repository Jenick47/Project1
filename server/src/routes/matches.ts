import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/matches  — список матчей текущего пользователя
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { user1Id: req.userId },
        { user2Id: req.userId },
      ],
    },
    include: {
      user1: { select: { id: true, name: true, age: true, photoUrl: true } },
      user2: { select: { id: true, name: true, age: true, photoUrl: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Возвращаем партнёра (не текущего пользователя)
  const result = matches.map((m) => ({
    matchId: m.id,
    createdAt: m.createdAt,
    partner: m.user1Id === req.userId ? m.user2 : m.user1,
  }));

  res.json(result);
});

export default router;
