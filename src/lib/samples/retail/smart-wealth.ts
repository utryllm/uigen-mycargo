export const RETAIL_SMART_WEALTH = `'use client';

import { useState } from 'react';
import { Home, CreditCard, PiggyBank, TrendingUp, ArrowUpRight, ArrowDownRight, PieChart, BarChart3, MessageCircle, Calendar, ChevronRight, Shield, User } from 'lucide-react';

export default function SmartWealth() {
  const [activeNav, setActiveNav] = useState('smart-wealth');
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'savings-goals', label: 'Goals', icon: PiggyBank },
    { id: 'smart-wealth', label: 'SmartWealth', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavigate = (screenId: string) => {
    setActiveNav(screenId);
    window.parent.postMessage({ type: 'NAVIGATE', screenId }, '*');
  };

  const portfolioValue = 125430.50;
  const portfolioChange = 2340.25;
  const portfolioChangePercent = 1.9;

  const holdings = [
    { name: 'US Equity Fund', value: '$52,500', allocation: 42, change: '+2.4%', up: true },
    { name: 'International Equity', value: '$28,750', allocation: 23, change: '+1.8%', up: true },
    { name: 'Bond Fund', value: '$25,000', allocation: 20, change: '-0.3%', up: false },
    { name: 'Money Market', value: '$19,180', allocation: 15, change: '+0.1%', up: true },
  ];

  const insights = [
    {
      type: 'opportunity',
      title: 'Rebalancing Opportunity',
      description: 'Your equity allocation is 5% above target. Consider rebalancing to maintain your risk profile.',
      action: 'Review Portfolio',
    },
    {
      type: 'achievement',
      title: 'Milestone Reached!',
      description: 'Congratulations! Your portfolio has grown 15% this year, outperforming the market benchmark.',
      action: 'View Details',
    },
  ];

  const advisor = {
    name: 'David Chen',
    title: 'Certified Financial Planner',
    availability: 'Available today',
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* App Header Bar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] via-[#2E5A8F] to-[#1E3A5F] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2E5A8F] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">SmartWealth</h1>
            <p className="text-sm text-[#666666]">Your personalized investment dashboard</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-[#E0E0E0] px-2 sm:px-4 overflow-x-auto">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={\`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap \${
                  isActive
                    ? 'text-[#C41230] border-[#C41230]'
                    : 'text-[#666666] border-transparent hover:text-[#333333]'
                }\`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        {/* Portfolio Summary */}
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2E5A8F] rounded-xl p-4 sm:p-6 mb-6 text-white">
          <p className="text-white/80 text-sm mb-1">Total Portfolio Value</p>
          <p className="text-2xl sm:text-3xl font-bold mb-2">
            \${portfolioValue.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[#28A745]">
              <ArrowUpRight className="w-4 h-4" />
              <span className="font-medium">+\${portfolioChange.toLocaleString()}</span>
            </div>
            <span className="text-white/60">({portfolioChangePercent}% today)</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'holdings', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors \${
                activeTab === tab
                  ? 'bg-[#C41230] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#F5F5F5] border border-[#E0E0E0]'
              }\`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Asset Allocation */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-[#C41230]" />
                <h2 className="font-semibold text-[#333333]">Asset Allocation</h2>
              </div>
              <div className="flex items-center gap-6 mb-4">
                <div className="w-24 h-24 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#E0E0E0" strokeWidth="4" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#0066CC" strokeWidth="4" strokeDasharray="42 100" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#C41230" strokeWidth="4" strokeDasharray="23 100" strokeDashoffset="-42" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#28A745" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-65" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#FFD200" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-85" />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    { label: 'US Equity', percent: 42, color: '#0066CC' },
                    { label: 'Intl Equity', percent: 23, color: '#C41230' },
                    { label: 'Bonds', percent: 20, color: '#28A745' },
                    { label: 'Cash', percent: 15, color: '#FFD200' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-[#666666]">{item.label}</span>
                      <span className="ml-auto font-medium text-[#333333]">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advisor Card */}
            <div className="bg-white rounded-xl border border-[#E0E0E0] p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1E3A5F] to-[#2E5A8F] rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  DC
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#333333]">{advisor.name}</h3>
                  <p className="text-sm text-[#666666]">{advisor.title}</p>
                  <div className="flex items-center gap-1 text-sm text-[#28A745] mt-1">
                    <span className="w-2 h-2 bg-[#28A745] rounded-full" />
                    {advisor.availability}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-[#F5F5F5] hover:bg-[#E0E0E0] rounded-lg flex items-center justify-center transition-colors">
                    <MessageCircle className="w-5 h-5 text-[#666666]" />
                  </button>
                  <button className="w-10 h-10 bg-[#F5F5F5] hover:bg-[#E0E0E0] rounded-lg flex items-center justify-center transition-colors">
                    <Calendar className="w-5 h-5 text-[#666666]" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Holdings Tab */}
        {activeTab === 'holdings' && (
          <div className="bg-white rounded-xl border border-[#E0E0E0]">
            <div className="flex items-center gap-2 p-4 border-b border-[#E0E0E0]">
              <BarChart3 className="w-5 h-5 text-[#C41230]" />
              <h2 className="font-semibold text-[#333333]">Your Holdings</h2>
            </div>
            <div className="divide-y divide-[#E0E0E0]">
              {holdings.map((holding) => (
                <div key={holding.name} className="p-4 hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#333333]">{holding.name}</p>
                      <p className="text-sm text-[#666666]">{holding.allocation}% of portfolio</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#333333]">{holding.value}</p>
                      <div className={\`flex items-center justify-end gap-1 text-sm \${holding.up ? 'text-[#28A745]' : 'text-[#DC3545]'}\`}>
                        {holding.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {holding.change}
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0066CC] rounded-full"
                      style={{ width: \`\${holding.allocation}%\` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={\`rounded-xl border p-4 \${
                  insight.type === 'opportunity'
                    ? 'bg-[#FFF8E1] border-[#FFD200]'
                    : 'bg-[#E8F5E9] border-[#28A745]'
                }\`}
              >
                <div className="flex items-start gap-3">
                  {insight.type === 'opportunity' ? (
                    <Shield className="w-5 h-5 text-[#C41230] mt-0.5 flex-shrink-0" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-[#28A745] mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[#333333]">{insight.title}</p>
                    <p className="text-sm text-[#666666] mt-1">{insight.description}</p>
                    <button className="flex items-center gap-1 mt-2 text-sm font-medium text-[#C41230] hover:underline">
                      {insight.action} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 text-center">
              <p className="text-sm text-[#666666] mb-3">Want personalized investment advice?</p>
              <button className="w-full py-3 bg-[#C41230] text-white rounded-xl font-medium hover:bg-[#A30F28] transition-colors">
                Schedule Advisor Call
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}`;
