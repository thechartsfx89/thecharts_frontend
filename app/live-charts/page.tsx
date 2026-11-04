// app/live-charts/page.tsx
"use client";

import React, { useState } from 'react';
import { ArrowLeftRight, Bitcoin, LineChart } from 'lucide-react';
import { PageHero, TcPage } from '@/components/pages/Landing/page-shell';
import { SectionHeading } from '@/components/pages/Landing/sections';

const TABS = [
  { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin },
  { id: 'forex', label: 'Forex', icon: ArrowLeftRight },
  { id: 'indices', label: 'Indian Indices', icon: LineChart },
];

const PANELS: { [key: string]: { title: string; charts: { title: string; embedId: string }[] } } = {
  crypto: {
    title: 'Cryptocurrency Charts',
    charts: [
      { title: 'Bitcoin (BTC/USD)', embedId: 'bitcoin-chart' },
      { title: 'Ethereum (ETH/USD)', embedId: 'ethereum-chart' },
      { title: 'Binance Coin (BNB/USD)', embedId: 'bnb-chart' },
      { title: 'Solana (SOL/USD)', embedId: 'solana-chart' },
    ],
  },
  forex: {
    title: 'Forex Charts',
    charts: [
      { title: 'EUR/USD', embedId: 'eur-usd-chart' },
      { title: 'GBP/USD', embedId: 'gbp-usd-chart' },
      { title: 'USD/JPY', embedId: 'usd-jpy-chart' },
      { title: 'AUD/USD', embedId: 'aud-usd-chart' },
    ],
  },
  indices: {
    title: 'Indian Indices Charts',
    charts: [
      { title: 'Nifty 50', embedId: 'nifty50-chart' },
      { title: 'Sensex', embedId: 'sensex-chart' },
    ],
  },
};

export default function LiveChartsPage() {
  const [activeTab, setActiveTab] = useState('crypto');
  const panel = PANELS[activeTab];

  return (
    <TcPage>
      <PageHero
        eyebrow="Live Charts"
        title={
          <>
            Live <span className="text-[#16c75f]">Trading Charts</span>
          </>
        }
        sub="Stay ahead in the market with real-time charts for cryptocurrencies, forex, and Indian indices. Powered by TradingView."
      />

      <section className="bg-[#f3fbf6] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Tabs */}
          <div className="flex justify-center">
            <div role="tablist" aria-label="Chart categories" className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-6 ${activeTab === tab.id ? 'bg-[#0b1b33] text-white shadow-lg shadow-slate-900/20' : 'text-slate-600 hover:bg-slate-100 hover:text-[#0b1b33]'}`}
                >
                  <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-[#16c75f]' : ''}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-12">
            <SectionHeading eyebrow="Live Charts" title={panel.title} />
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {panel.charts.map((chart) => (
                <ChartCard key={chart.embedId} title={chart.title} embedId={chart.embedId} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </TcPage>
  );
}

// Reusable Chart Card Component
const ChartCard = ({ title, embedId }: { title: string; embedId: string }) => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
      <span className="h-2 w-2 rounded-full bg-[#16c75f]" />
      <h3 className="font-bold text-[#0b1b33]">{title}</h3>
    </div>
    <div className="h-64 w-full sm:h-80 lg:h-96">
      {/* TradingView Embed - Replace with actual embed code */}
      <iframe
        title={title}
        src={`https://www.tradingview.com/widgetembed/?frameElementId=${embedId}&symbol=${getSymbol(embedId)}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=light&style=1&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en`}
        frameBorder="0"
        allowFullScreen
        className="h-full w-full"
      ></iframe>
    </div>
  </div>
);

// Helper function to get TradingView symbol based on embedId
const getSymbol = (embedId: string) => {
  const symbols: { [key: string]: string } = {
    'bitcoin-chart': 'BITSTAMP:BTCUSD',
    'ethereum-chart': 'BITSTAMP:ETHUSD',
    'bnb-chart': 'BINANCE:BNBUSD',
    'solana-chart': 'BINANCE:SOLUSD',
    'eur-usd-chart': 'FX:EURUSD',
    'gbp-usd-chart': 'FX:GBPUSD',
    'usd-jpy-chart': 'FX:USDJPY',
    'aud-usd-chart': 'FX:AUDUSD',
    'nifty50-chart': 'NSE:NIFTY50', // ✅ Correct
    'sensex-chart': 'BSE:SENSEX',   // ✅ Working
  };
  return symbols[embedId] || 'BITSTAMP:BTCUSD';
};
