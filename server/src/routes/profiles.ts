import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import prisma from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/profiles/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json(user);
});

// PUT /api/profiles/me
router.put('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, age, bio } = req.body;
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name, age: age ? Number(age) : undefined, bio },
  });
  res.json(user);
});

// POST /api/profiles/me/photo
router.post('/me/photo', authMiddleware, upload.single('photo'), async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  const photoUrl = `/uploads/${req.file.filename}`;
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { photoUrl },
  });
  res.json({ photoUrl: user.photoUrl });
});

// GET /api/profiles/candidates  — противоположный пол, ещё не свайпнутые
router.get('/candidates', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const me = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!me) { res.status(404).json({ error: 'User not found' }); return; }

  const oppositeGender = me.gender === 'male' ? 'female' : 'male';

  const alreadySwiped = await prisma.swipe.findMany({
    where: { swiperId: req.userId },
    select: { swipedId: true },
  });
  const excludeIds = [req.userId as number, ...alreadySwiped.map((s) => s.swipedId)];

  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: excludeIds },
      gender: oppositeGender,
    },
    select: { id: true, name: true, age: true, bio: true, photoUrl: true },
  });
  res.json(candidates);
});

export default router;
