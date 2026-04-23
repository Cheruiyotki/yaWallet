import express from 'express';
import prismaPkg from '@prisma/client';
const router = express.Router();
const { PrismaClient } = prismaPkg;
const prisma = new PrismaClient();

// GET /api/wallet/:id
router.get('/:id', async (req, res) => {
  const walletId = Number(req.params.id);
  if (!Number.isFinite(walletId)) return res.status(400).json({ error: 'Invalid wallet id' });

  const wallet = await prisma.wallet.findUnique({ where: { id: walletId }, select: { id: true } });
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

  const totalAgg = await prisma.asset.aggregate({
    where: { walletId },
    _sum: { valueUsd: true },
  });

  const total = Number(totalAgg?._sum?.valueUsd || 0);

  const gainsRows =
    await prisma.$queryRaw`SELECT COALESCE(SUM("valueUsd" * "change24h" / 100.0), 0) AS "gains" FROM "Asset" WHERE "walletId" = ${walletId}`;

  const gains = Number(gainsRows?.[0]?.gains || 0);
  const base = total - gains;
  const percent = base > 0 ? (gains / base) * 100 : 0;

  res.json({ total, gains, percent });
});

export default router;
