import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/wallet/:id
router.get('/:id', async (req, res) => {
  const walletId = parseInt(req.params.id);
  const assets = await prisma.asset.findMany({ where: { walletId } });
  const total = assets.reduce((sum, a) => sum + a.valueUsd, 0);
  const gains = assets.reduce((sum, a) => sum + (a.valueUsd * a.change24h / 100), 0);
  const percent = total ? (gains / (total - gains)) * 100 : 0;
  res.json({ total, gains, percent });
});

export default router;
