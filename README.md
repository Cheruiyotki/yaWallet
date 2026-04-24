# YakusWallet

A full-stack cryptocurrency wallet tracking application built with React, Express, and Prisma.

## Features

- **Wallet Management** - Create and manage multiple cryptocurrency wallets
- **Asset Tracking** - Track various crypto assets with real-time values
- **Portfolio Overview** - View total portfolio value and 24h changes
- **RESTful API** - Backend API for wallet and asset operations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Express.js |
| Database | PostgreSQL with Prisma ORM |
| Icons | Lucide React |

## Project Structure

```
yakusWallet/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── routes/
│   │   ├── assets.js        # Asset management routes
│   │   ├── wallet.js        # Single wallet routes
│   │   └── wallets.js       # Wallet CRUD routes
│   ├── server.js            # Express server entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── WalletDashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository**

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure the database**
   
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/yakuswallet"
   ```

4. **Run Prisma migrations**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

5. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend** (runs on port 4000)
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend** (runs on port 5173)
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallets` | Get all wallets |
| POST | `/api/wallets` | Create a wallet |
| GET | `/api/wallet/:id` | Get wallet by ID |
| PUT | `/api/wallet/:id` | Update wallet |
| DELETE | `/api/wallet/:id` | Delete wallet |
| GET | `/api/assets` | Get all assets |
| POST | `/api/assets` | Create an asset |

## Database Schema

- **User** - Has many wallets
- **Wallet** - Belongs to a user, has many assets
- **Asset** - Belongs to a wallet, tracks crypto holdings

## License

MIT