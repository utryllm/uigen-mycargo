export const RETAIL_DASHBOARD = `'use client';

import { useState } from 'react';
import { Home, CreditCard, PiggyBank, TrendingUp, Bell, ChevronRight, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Plus } from 'lucide-react';

export default function RetailDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'savings-goals', label: 'Goals', icon: PiggyBank },
    { id: 'smart-wealth', label: 'SmartWealth', icon: TrendingUp },
  ];

  const handleNavigate = (screenId: string) => {
    setActiveNav(screenId);
    window.parent.postMessage({ type: 'NAVIGATE', screenId }, '*');
  };

  const accounts = [
    { name: 'Everyday Account', number: '****8834', balance: '$12,458.90', type: 'checking' },
    { name: 'Savings Account', number: '****2156', balance: '$45,230.00', type: 'savings' },
    { name: 'Credit Card', number: '****9012', balance: '-$1,234.56', available: '$8,765.44', type: 'credit' },
  ];

  const recentTransactions = [
    { merchant: 'Amazon', category: 'Shopping', amount: '-$89.99', date: 'Today' },
    { merchant: 'Salary Deposit', category: 'Income', amount: '+$4,500.00', date: 'Yesterday' },
    { merchant: 'Netflix', category: 'Entertainment', amount: '-$15.99', date: 'Dec 28' },
    { merchant: 'Whole Foods', category: 'Groceries', amount: '-$156.32', date: 'Dec 27' },
  ];

  const spendingInsights = [
    { category: 'Food & Dining', amount: '$456', change: '-12%', up: false },
    { category: 'Shopping', amount: '$289', change: '+8%', up: true },
    { category: 'Transport', amount: '$125', change: '-5%', up: false },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Bank Header Stripe */}
      <div className="bg-[#C41230] h-2" />
      <div className="bg-[#FFD200] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">Good morning, Jessica</h1>
            <p className="text-sm text-[#666666]">Here's your financial overview</p>
          </div>
          <button className="relative p-2 rounded-full hover:bg-[#F5F5F5] transition-colors">
            <Bell className="w-5 h-5 text-[#666666]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#C41230] rounded-full" />
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
        {/* Total Balance Card */}
        <div className="bg-gradient-to-r from-[#C41230] to-[#E91E63] rounded-xl p-4 sm:p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-sm">Total Balance</p>
            <button onClick={() => setShowBalance(!showBalance)} className="p-1 hover:bg-white/10 rounded">
              {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-2xl sm:text-3xl font-bold mb-1">
            {showBalance ? '$56,454.34' : '••••••'}
          </p>
          <div className="flex items-center gap-1 text-sm text-white/80">
            <ArrowUpRight className="w-4 h-4" />
            +$2,340 this month
          </div>
        </div>

        {/* Accounts */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] mb-6">
          <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
            <h2 className="font-semibold text-[#333333]">My Accounts</h2>
            <button className="flex items-center gap-1 text-sm text-[#0066CC] hover:underline">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          <div className="divide-y divide-[#E0E0E0]">
            {accounts.map((account) => (
              <div key={account.number} className="p-4 hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">{account.name}</p>
                    <p className="text-sm text-[#666666]">{account.number}</p>
                  </div>
                  <div className="text-right">
                    <p className={\`font-semibold \${account.balance.startsWith('-') ? 'text-[#DC3545]' : 'text-[#333333]'}\`}>
                      {showBalance ? account.balance : '••••'}
                    </p>
                    {account.available && (
                      <p className="text-xs text-[#666666]">Available: {showBalance ? account.available : '••••'}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] mb-6">
          <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
            <h2 className="font-semibold text-[#333333]">Recent Transactions</h2>
            <button className="text-sm text-[#0066CC] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#E0E0E0]">
            {recentTransactions.map((tx, idx) => (
              <div key={idx} className="p-4 hover:bg-[#FAFAFA] transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#333333]">{tx.merchant}</p>
                    <p className="text-xs text-[#666666]">{tx.category} • {tx.date}</p>
                  </div>
                  <p className={\`font-semibold \${tx.amount.startsWith('+') ? 'text-[#28A745]' : 'text-[#333333]'}\`}>
                    {tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Insights */}
        <div className="bg-white rounded-xl border border-[#E0E0E0]">
          <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
            <h2 className="font-semibold text-[#333333]">This Month's Spending</h2>
            <button
              onClick={() => handleNavigate('smart-wealth')}
              className="flex items-center gap-1 text-sm text-[#0066CC] hover:underline"
            >
              Insights <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 grid grid-cols-3 gap-4">
            {spendingInsights.map((item) => (
              <div key={item.category} className="text-center">
                <p className="text-lg font-semibold text-[#333333]">{item.amount}</p>
                <p className="text-xs text-[#666666] mb-1">{item.category}</p>
                <div className={\`flex items-center justify-center gap-1 text-xs \${item.up ? 'text-[#DC3545]' : 'text-[#28A745]'}\`}>
                  {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}`;
