import express from 'express';
import prismaPkg from '@prisma/client';
const router = express.Router();
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

// GET /api/assets/:walletId
router.get('/:walletId', async (req, res) => {
  const walletId = Number(req.params.walletId);
  if (!Number.isFinite(walletId)) return res.status(400).json({ error: 'Invalid wallet id' });
  const assets = await prisma.asset.findMany({ where: { walletId }, orderBy: { valueUsd: 'desc' } });
  res.json(assets);
});

export default router;
