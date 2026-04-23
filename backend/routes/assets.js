import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/assets/:walletId
router.get('/:walletId', async (req, res) => {
  const walletId = parseInt(req.params.walletId);
  const assets = await prisma.asset.findMany({ where: { walletId } });
  res.json(assets);
});

export default router;
