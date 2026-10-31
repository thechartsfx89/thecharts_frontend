// app/live-charts/page.tsx
"use client";

import React, { useState } from 'react';
import Header from "@/app/dashboard/landing/headerLanding"; // Assuming you have a header component
import Footer from "@/components/pages/Footer/footer"; // Assuming you have a footer component

export default function LiveChartsPage() {
  const [activeTab, setActiveTab] = useState('crypto');

  const tabs = [
    { id: 'crypto', label: 'Cryptocurrency', icon: '₿' },
    { id: 'forex', label: 'Forex', icon: '💱' },
    { id: 'indices', label: 'Indian Indices', icon: '📈' },
  ];

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 sm:w-40 sm:h-40 bg-indigo-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-purple-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Live Trading Charts
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto px-4">
              Stay ahead in the market with real-time charts for cryptocurrencies, forex, and Indian indices. Powered by TradingView.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center space-x-1 sm:space-x-2 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white/70 text-gray-700 hover:bg-white/90 hover:shadow-md'
                  }`}
              >
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 transition-all duration-500">
            {activeTab === 'crypto' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cryptocurrency Charts
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <ChartCard title="Bitcoin (BTC/USD)" embedId="bitcoin-chart" />
                  <ChartCard title="Ethereum (ETH/USD)" embedId="ethereum-chart" />
                  <ChartCard title="Binance Coin (BNB/USD)" embedId="bnb-chart" />
                  <ChartCard title="Solana (SOL/USD)" embedId="solana-chart" />
                </div>
              </div>
            )}

            {activeTab === 'forex' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Forex Charts
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <ChartCard title="EUR/USD" embedId="eur-usd-chart" />
                  <ChartCard title="GBP/USD" embedId="gbp-usd-chart" />
                  <ChartCard title="USD/JPY" embedId="usd-jpy-chart" />
                  <ChartCard title="AUD/USD" embedId="aud-usd-chart" />
                </div>
              </div>
            )}

            {activeTab === 'indices' && (
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Indian Indices Charts
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <ChartCard title="Nifty 50" embedId="nifty50-chart" />
                  <ChartCard title="Sensex" embedId="sensex-chart" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

// Reusable Chart Card Component
const ChartCard = ({ title, embedId }: { title: string; embedId: string }) => (
  <div className="bg-white/60 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-white/30 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">{title}</h3>
    <div className="w-full h-64 sm:h-80 lg:h-96">
      {/* TradingView Embed - Replace with actual embed code */}
      <iframe
        src={`https://www.tradingview.com/widgetembed/?frameElementId=${embedId}&symbol=${getSymbol(embedId)}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=light&style=1&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en`}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full rounded-lg"
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