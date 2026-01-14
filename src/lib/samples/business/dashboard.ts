export const BUSINESS_DASHBOARD = `'use client';

import { useState } from 'react';
import { Building2, TrendingUp, Users, CreditCard, ArrowRight, Bell, ChevronRight, DollarSign, ArrowUpRight, ArrowDownRight, User } from 'lucide-react';

export default function BusinessDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'lending', label: 'Lending', icon: CreditCard },
    { id: 'relationship-manager', label: 'RM Access', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavigate = (screenId: string) => {
    setActiveNav(screenId);
    window.parent.postMessage({ type: 'NAVIGATE', screenId }, '*');
  };

  const accounts = [
    { name: 'Operating Account', number: '****4521', balance: '$1,245,890.50', change: '+2.4%', up: true },
    { name: 'Payroll Account', number: '****7832', balance: '$458,230.00', change: '+1.2%', up: true },
    { name: 'Credit Facility', number: '****2190', balance: '$2,000,000.00', available: '$1,450,000.00', type: 'credit' },
  ];

  const quickActions = [
    { label: 'Wire Transfer', icon: ArrowRight, action: 'wire' },
    { label: 'Apply for Loan', icon: CreditCard, action: 'lending' },
    { label: 'Contact RM', icon: Users, action: 'relationship-manager' },
  ];

  const recentTransactions = [
    { description: 'Supplier Payment - ABC Corp', amount: '-$45,000.00', date: 'Today, 2:30 PM' },
    { description: 'Customer Payment Received', amount: '+$128,500.00', date: 'Today, 11:15 AM' },
    { description: 'Payroll Processing', amount: '-$234,567.00', date: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* App Header Bar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] via-[#2E5A8F] to-[#1E3A5F] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2E5A8F] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">Good morning, Michael</h1>
              <p className="text-sm text-[#666666]">Acme Corporation</p>
            </div>
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
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.action}
                onClick={() => action.action !== 'wire' && handleNavigate(action.action)}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-xl border border-[#E0E0E0] hover:border-[#C41230] hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-[#FEF2F4] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#C41230]" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#333333] text-center sm:text-left">{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Accounts */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] mb-6">
          <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
            <h2 className="font-semibold text-[#333333]">Your Accounts</h2>
            <button className="text-sm text-[#0066CC] hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#E0E0E0]">
            {accounts.map((account) => (
              <div key={account.number} className="p-4 hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-[#666666]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#333333]">{account.name}</p>
                      <p className="text-sm text-[#666666]">{account.number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#333333]">{account.balance}</p>
                    {account.available ? (
                      <p className="text-xs text-[#666666]">Available: {account.available}</p>
                    ) : account.change && (
                      <div className={\`flex items-center justify-end gap-1 text-xs \${account.up ? 'text-[#28A745]' : 'text-[#DC3545]'}\`}>
                        {account.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {account.change}
                      </div>
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
                    <p className="font-medium text-[#333333]">{tx.description}</p>
                    <p className="text-xs text-[#666666]">{tx.date}</p>
                  </div>
                  <p className={\`font-semibold \${tx.amount.startsWith('+') ? 'text-[#28A745]' : 'text-[#333333]'}\`}>
                    {tx.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Card */}
        <div className="bg-[#FFF8E1] border border-[#FFD200] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-[#C41230] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#333333]">Credit Facility Review Due</p>
              <p className="text-sm text-[#666666] mt-1">Your annual credit facility review is due in 14 days. Contact your relationship manager to schedule.</p>
              <button
                onClick={() => handleNavigate('relationship-manager')}
                className="flex items-center gap-1 mt-2 text-sm font-medium text-[#C41230] hover:underline"
              >
                Contact RM <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;
