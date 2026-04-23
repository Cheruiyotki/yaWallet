import React, { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Menu, Transition } from '@headlessui/react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  History,
  Repeat,
  TrendingDown,
  TrendingUp,
  User,
} from 'lucide-react';

const ACTIONS = [
  { label: 'Receive', icon: ArrowDown },
  { label: 'Send', icon: ArrowUp },
  { label: 'History', icon: History },
  { label: 'Swap', icon: Repeat },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const DEFAULT_WALLETS = [
  { id: 1, name: 'Wallet 1' },
  { id: 2, name: 'Wallet 2' },
];

function formatUsd(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

export default function WalletDashboard() {
  const [wallet, setWallet] = useState({ total: 0, gains: 0, percent: 0 });
  const [assets, setAssets] = useState([]);
  const [wallets, setWallets] = useState(DEFAULT_WALLETS);
  const [selectedWalletId, setSelectedWalletId] = useState(DEFAULT_WALLETS[0].id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedWallet = useMemo(
    () => wallets.find(w => w.id === selectedWalletId) || DEFAULT_WALLETS[0],
    [wallets, selectedWalletId]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/wallets/1`);
        if (!mounted) return;
        if (Array.isArray(res.data) && res.data.length > 0) {
          setWallets(res.data);
          if (!res.data.some(w => w.id === selectedWalletId)) setSelectedWalletId(res.data[0].id);
        }
      } catch {
        // Fallback to DEFAULT_WALLETS
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    (async () => {
      try {
        const [walletRes, assetsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/wallet/${selectedWalletId}`),
          axios.get(`${API_BASE}/api/assets/${selectedWalletId}`),
        ]);
        if (!mounted) return;
        setWallet(walletRes.data);
        setAssets(Array.isArray(assetsRes.data) ? assetsRes.data : []);
      } catch {
        if (!mounted) return;
        setError('Failed to load wallet data. Is the backend running on port 4000?');
        setWallet({ total: 0, gains: 0, percent: 0 });
        setAssets([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedWalletId]);

  const percent = Number(wallet?.percent || 0);
  const trendIsPositive = percent >= 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-[#2d1a4a] via-[#18181b] to-black px-4">
      <div className="w-full max-w-[480px] mx-auto py-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 bg-glass px-4 py-2 rounded-full text-white/85 border border-white/10 backdrop-blur-md hover:border-white/20 transition">
              <span className="font-medium">{selectedWallet?.name || 'Wallet'}</span>
              <ChevronDown className="w-4 h-4 text-white/70" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left rounded-2xl bg-glass border border-white/10 backdrop-blur-md p-1 focus:outline-none shadow-xl shadow-black/30">
                {wallets.map(w => (
                  <Menu.Item key={w.id}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => setSelectedWalletId(w.id)}
                        className={[
                          'w-full text-left px-3 py-2 rounded-xl text-sm',
                          active ? 'bg-white/10 text-white' : 'text-white/80',
                          w.id === selectedWalletId ? 'border border-white/10' : 'border border-transparent',
                        ].join(' ')}
                      >
                        {w.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] via-[#22c55e] to-[#0ea5e9] flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg shadow-black/30">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Balance */}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-extrabold tracking-tight text-white">{formatUsd(wallet?.total)}</span>
          <span
            className={[
              'mt-3 px-4 py-1.5 rounded-full bg-glass border border-white/10 backdrop-blur-md font-semibold text-sm flex items-center gap-2',
              trendIsPositive ? 'text-neon' : 'text-red-300',
            ].join(' ')}
          >
            {trendIsPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trendIsPositive ? '+' : ''}
            {percent.toFixed(1)}%
            <span className="text-white/70">({formatUsd(wallet?.gains)})</span>
          </span>
          {error ? <div className="mt-3 text-xs text-red-300">{error}</div> : null}
        </div>

        {/* Asset List */}
        <div className="bg-glass rounded-3xl p-4 border border-white/10 backdrop-blur-md flex flex-col gap-4 shadow-xl shadow-black/30">
          {loading ? (
            <div className="text-sm text-white/60">Loading assets…</div>
          ) : assets.length === 0 ? (
            <div className="text-sm text-white/60">No assets found for this wallet.</div>
          ) : (
            assets.map(asset => {
              const change = Number(asset?.change24h || 0);
              const positive = change >= 0;

              return (
                <div key={asset.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-white/25 via-white/0 to-white/0 blur-[1px]" />
                      <img
                        src={asset.iconUrl}
                        alt={asset.symbol}
                        className="relative w-10 h-10 rounded-full bg-black/30 border border-white/10"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="text-white font-semibold leading-tight">{asset.name}</div>
                      <div className="text-xs text-white/55">
                        {(Number(asset.amount || 0) || 0).toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
                        {asset.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold leading-tight">{formatUsd(Number(asset.valueUsd || 0))}</div>
                    <div className="text-xs text-white/55">{formatUsd(Number(asset.marketPrice || 0))}</div>
                    <div className={['text-xs font-bold', positive ? 'text-neon' : 'text-red-300'].join(' ')}>
                      {positive ? '+' : ''}
                      {change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {ACTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="group flex flex-col items-center justify-center gap-2 bg-glass rounded-2xl py-4 border border-white/10 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 active:translate-y-0"
            >
              <Icon className="w-6 h-6 text-white group-hover:text-neon transition-colors" />
              <span className="text-white/80 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
