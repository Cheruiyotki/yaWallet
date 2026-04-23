import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDown, ArrowUp, History, Repeat } from 'lucide-react';

const ACTIONS = [
  { label: 'Receive', icon: ArrowDown },
  { label: 'Send', icon: ArrowUp },
  { label: 'History', icon: History },
  { label: 'Swap', icon: Repeat },
];

export default function WalletDashboard() {
  const [wallet, setWallet] = useState({ total: 0, gains: 0, percent: 0 });
  const [assets, setAssets] = useState([]);
  const [walletName] = useState('Wallet 1');

  useEffect(() => {
    axios.get('http://localhost:4000/api/wallet/1').then(res => setWallet(res.data));
    axios.get('http://localhost:4000/api/assets/1').then(res => setAssets(res.data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-[#2d1a4a] via-[#18181b] to-black">
      <div className="w-full max-w-[480px] mx-auto p-4 flex flex-col gap-6 font-sans">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button className="flex items-center gap-2 bg-glass px-4 py-2 rounded-full text-white/80 border border-white/10 backdrop-blur-md">
            {walletName}
            <svg width="16" height="16" fill="none"><path d="M4 6l4 4 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon to-purple-500 flex items-center justify-center border border-white/10">
            <span className="text-white font-bold">👤</span>
          </div>
        </div>

        {/* Balance */}
        <div className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-bold text-white">${wallet.total.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          <span className="mt-2 px-4 py-1 rounded-full bg-glass border border-white/10 backdrop-blur-md text-neon font-semibold text-sm flex items-center gap-2">
            ▲ {wallet.percent.toFixed(1)}% <span className="text-white/70">(${wallet.gains.toLocaleString(undefined, {minimumFractionDigits:2})})</span>
          </span>
        </div>

        {/* Asset List */}
        <div className="bg-glass rounded-2xl p-4 border border-white/10 backdrop-blur-md flex flex-col gap-4">
          {assets.map(asset => (
            <div key={asset.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={asset.iconUrl} alt={asset.symbol} className="w-10 h-10 rounded-full bg-black/30 border border-white/10" />
                <div>
                  <div className="text-white font-semibold">{asset.name}</div>
                  <div className="text-xs text-white/50">{asset.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">${asset.valueUsd.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                <div className="text-xs text-white/50">${asset.marketPrice.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                <div className={`text-xs font-bold ${asset.change24h >= 0 ? 'text-neon' : 'text-red-400'}`}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {ACTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="group flex flex-col items-center justify-center gap-2 bg-glass rounded-xl py-4 border border-white/10 backdrop-blur-md transition-all hover:scale-105 hover:border-neon"
            >
              <Icon className="w-6 h-6 text-white group-hover:text-neon transition" />
              <span className="text-white/80 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
