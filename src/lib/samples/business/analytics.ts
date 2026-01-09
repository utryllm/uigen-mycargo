export const BUSINESS_ANALYTICS = `'use client';

import { useState } from 'react';
import { Building2, TrendingUp, Users, CreditCard, Download, Calendar, ArrowUpRight, ArrowDownRight, PieChart, BarChart3, Filter } from 'lucide-react';

export default function BusinessAnalytics() {
  const [activeNav, setActiveNav] = useState('analytics');
  const [period, setPeriod] = useState('month');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'lending', label: 'Lending', icon: CreditCard },
    { id: 'relationship-manager', label: 'RM Access', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  const handleNavigate = (screenId: string) => {
    setActiveNav(screenId);
    window.parent.postMessage({ type: 'NAVIGATE', screenId }, '*');
  };

  const summaryCards = [
    { label: 'Total Revenue', value: '$2,458,900', change: '+12.5%', up: true },
    { label: 'Total Expenses', value: '$1,234,567', change: '+8.2%', up: true },
    { label: 'Net Cash Flow', value: '$1,224,333', change: '+18.3%', up: true },
    { label: 'Avg Daily Balance', value: '$890,450', change: '-2.1%', up: false },
  ];

  const spendingCategories = [
    { category: 'Payroll', amount: '$567,890', percent: 46, color: '#C41230' },
    { category: 'Suppliers', amount: '$234,567', percent: 19, color: '#FFD200' },
    { category: 'Operations', amount: '$185,432', percent: 15, color: '#0066CC' },
    { category: 'Marketing', amount: '$123,456', percent: 10, color: '#28A745' },
    { category: 'Other', amount: '$123,222', percent: 10, color: '#666666' },
  ];

  const cashFlowData = [
    { month: 'Jul', inflow: 180, outflow: 140 },
    { month: 'Aug', inflow: 220, outflow: 160 },
    { month: 'Sep', inflow: 200, outflow: 180 },
    { month: 'Oct', inflow: 280, outflow: 200 },
    { month: 'Nov', inflow: 260, outflow: 190 },
    { month: 'Dec', inflow: 320, outflow: 210 },
  ];

  const maxValue = 350;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Bank Header Stripe */}
      <div className="bg-[#C41230] h-2" />
      <div className="bg-[#FFD200] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">Business Analytics</h1>
            <p className="text-sm text-[#666666]">Financial insights and reports</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#F5F5F5] hover:bg-[#E0E0E0] rounded-lg text-sm font-medium text-[#333333] transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
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
        {/* Period Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {['week', 'month', 'quarter', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={\`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors \${
                  period === p
                    ? 'bg-[#C41230] text-white'
                    : 'bg-white text-[#666666] hover:bg-[#F5F5F5] border border-[#E0E0E0]'
                }\`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E0E0E0] rounded-lg text-sm text-[#666666] hover:bg-[#F5F5F5]">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-[#E0E0E0] p-4">
              <p className="text-xs sm:text-sm text-[#666666] mb-1">{card.label}</p>
              <p className="text-lg sm:text-xl font-semibold text-[#333333]">{card.value}</p>
              <div className={\`flex items-center gap-1 mt-1 text-xs sm:text-sm \${card.up ? 'text-[#28A745]' : 'text-[#DC3545]'}\`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change} vs last {period}
              </div>
            </div>
          ))}
        </div>

        {/* Cash Flow Chart */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#C41230]" />
              <h2 className="font-semibold text-[#333333]">Cash Flow</h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[#28A745] rounded" />
                <span className="text-[#666666]">Inflow</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[#DC3545] rounded" />
                <span className="text-[#666666]">Outflow</span>
              </div>
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end gap-2 sm:gap-4 h-48">
            {cashFlowData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end h-40">
                  <div
                    className="flex-1 bg-[#28A745] rounded-t"
                    style={{ height: \`\${(data.inflow / maxValue) * 100}%\` }}
                  />
                  <div
                    className="flex-1 bg-[#DC3545] rounded-t"
                    style={{ height: \`\${(data.outflow / maxValue) * 100}%\` }}
                  />
                </div>
                <span className="text-xs text-[#666666]">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-[#C41230]" />
            <h2 className="font-semibold text-[#333333]">Spending by Category</h2>
          </div>

          <div className="space-y-3">
            {spendingCategories.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm text-[#333333]">{cat.category}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-[#333333]">{cat.amount}</span>
                    <span className="text-[#666666] ml-2">({cat.percent}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: \`\${cat.percent}%\`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 text-sm font-medium text-[#0066CC] hover:underline">
            View Detailed Report
          </button>
        </div>
      </main>
    </div>
  );
}`;
