import express from 'express';
import cors from 'cors';
import walletRoutes from './routes/wallet.js';
import assetRoutes from './routes/assets.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/wallet', walletRoutes);
app.use('/api/assets', assetRoutes);

app.listen(4000, () => console.log('Server running on port 4000'));
