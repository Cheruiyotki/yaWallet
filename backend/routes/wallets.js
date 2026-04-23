import express from 'express';
import prismaPkg from '@prisma/client';

const router = express.Router();
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

// GET /api/wallets/:userId
router.get('/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isFinite(userId)) return res.status(400).json({ error: 'Invalid user id' });

  const wallets = await prisma.wallet.findMany({
    where: { userId },
    orderBy: { id: 'asc' },
    select: { id: true, name: true },
  });

  res.json(wallets);
});

export default router;
