export const RETAIL_PAYMENTS = `'use client';

import { useState } from 'react';
import { Home, CreditCard, PiggyBank, TrendingUp, Send, Receipt, Clock, Users, ChevronRight, Plus, Search } from 'lucide-react';

export default function EverydayPayments() {
  const [activeNav, setActiveNav] = useState('payments');
  const [activeTab, setActiveTab] = useState('send');

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

  const recentContacts = [
    { name: 'Mom', initials: 'M', color: '#C41230' },
    { name: 'Alex', initials: 'A', color: '#0066CC' },
    { name: 'Sarah', initials: 'S', color: '#28A745' },
    { name: 'Work', initials: 'W', color: '#FFD200' },
  ];

  const scheduledPayments = [
    { name: 'Rent Payment', to: 'ABC Properties', amount: '$1,500.00', date: 'Jan 1, 2025', recurring: true },
    { name: 'Car Insurance', to: 'State Farm', amount: '$189.00', date: 'Jan 5, 2025', recurring: true },
    { name: 'Phone Bill', to: 'Verizon', amount: '$85.00', date: 'Jan 10, 2025', recurring: true },
  ];

  const billers = [
    { name: 'Electric Company', icon: '⚡', lastPaid: 'Dec 15', amount: '$124.50' },
    { name: 'Water Utility', icon: '💧', lastPaid: 'Dec 20', amount: '$45.00' },
    { name: 'Internet', icon: '📶', lastPaid: 'Dec 22', amount: '$79.99' },
    { name: 'Gas Company', icon: '🔥', lastPaid: 'Dec 18', amount: '$67.00' },
  ];

  const paymentHistory = [
    { to: 'Alex Johnson', amount: '$50.00', date: 'Today', type: 'sent' },
    { to: 'Mom', amount: '$200.00', date: 'Yesterday', type: 'sent' },
    { to: 'Sarah Miller', amount: '$35.00', date: 'Dec 28', type: 'received' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Bank Header Stripe */}
      <div className="bg-[#C41230] h-2" />
      <div className="bg-[#FFD200] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">Payments</h1>
          <p className="text-sm text-[#666666]">Send money, pay bills, manage transfers</p>
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
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Send', icon: Send, action: 'send' },
            { label: 'Request', icon: Users, action: 'request' },
            { label: 'Pay Bills', icon: Receipt, action: 'bills' },
            { label: 'Scheduled', icon: Clock, action: 'scheduled' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.action}
                onClick={() => setActiveTab(item.action)}
                className={\`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all \${
                  activeTab === item.action
                    ? 'bg-[#FEF2F4] border-[#C41230]'
                    : 'bg-white border-[#E0E0E0] hover:border-[#C41230]'
                }\`}
              >
                <div className={\`w-10 h-10 rounded-lg flex items-center justify-center \${
                  activeTab === item.action ? 'bg-[#C41230]' : 'bg-[#F5F5F5]'
                }\`}>
                  <Icon className={\`w-5 h-5 \${activeTab === item.action ? 'text-white' : 'text-[#666666]'}\`} />
                </div>
                <span className="text-xs font-medium text-[#333333]">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Send Tab */}
        {activeTab === 'send' && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
              <input
                type="text"
                placeholder="Search name, email, or phone"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E0E0E0] rounded-xl text-sm focus:outline-none focus:border-[#C41230]"
              />
            </div>

            {/* Recent Contacts */}
            <div className="mb-6">
              <p className="text-sm font-medium text-[#666666] mb-3">Recent</p>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recentContacts.map((contact) => (
                  <button key={contact.name} className="flex flex-col items-center gap-2 min-w-[60px]">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: contact.color }}
                    >
                      {contact.initials}
                    </div>
                    <span className="text-xs text-[#666666]">{contact.name}</span>
                  </button>
                ))}
                <button className="flex flex-col items-center gap-2 min-w-[60px]">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#E0E0E0] flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#999999]" />
                  </div>
                  <span className="text-xs text-[#666666]">New</span>
                </button>
              </div>
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-xl border border-[#E0E0E0]">
              <div className="p-4 border-b border-[#E0E0E0]">
                <h3 className="font-semibold text-[#333333]">Recent Activity</h3>
              </div>
              <div className="divide-y divide-[#E0E0E0]">
                {paymentHistory.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={\`w-10 h-10 rounded-full flex items-center justify-center \${
                        item.type === 'sent' ? 'bg-[#FEF2F4]' : 'bg-[#E8F5E9]'
                      }\`}>
                        <Send className={\`w-4 h-4 \${
                          item.type === 'sent' ? 'text-[#C41230] rotate-45' : 'text-[#28A745] -rotate-135'
                        }\`} />
                      </div>
                      <div>
                        <p className="font-medium text-[#333333]">{item.to}</p>
                        <p className="text-xs text-[#666666]">{item.date}</p>
                      </div>
                    </div>
                    <p className={\`font-semibold \${item.type === 'received' ? 'text-[#28A745]' : 'text-[#333333]'}\`}>
                      {item.type === 'received' ? '+' : '-'}{item.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Bills Tab */}
        {activeTab === 'bills' && (
          <div className="bg-white rounded-xl border border-[#E0E0E0]">
            <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
              <h3 className="font-semibold text-[#333333]">My Billers</h3>
              <button className="flex items-center gap-1 text-sm text-[#0066CC]">
                <Plus className="w-4 h-4" />
                Add Biller
              </button>
            </div>
            <div className="divide-y divide-[#E0E0E0]">
              {billers.map((biller) => (
                <div key={biller.name} className="p-4 flex items-center justify-between hover:bg-[#FAFAFA] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center text-lg">
                      {biller.icon}
                    </div>
                    <div>
                      <p className="font-medium text-[#333333]">{biller.name}</p>
                      <p className="text-xs text-[#666666]">Last paid: {biller.lastPaid}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#333333]">{biller.amount}</span>
                    <ChevronRight className="w-4 h-4 text-[#999999]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Tab */}
        {activeTab === 'scheduled' && (
          <div className="space-y-4">
            {scheduledPayments.map((payment, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#E0E0E0] p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-[#333333]">{payment.name}</h3>
                    <p className="text-sm text-[#666666]">To: {payment.to}</p>
                  </div>
                  <p className="font-semibold text-[#333333]">{payment.amount}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#666666]">
                    <Clock className="w-4 h-4" />
                    {payment.date}
                  </div>
                  {payment.recurring && (
                    <span className="px-2 py-1 bg-[#E8F5E9] text-[#28A745] text-xs rounded-full">
                      Recurring
                    </span>
                  )}
                </div>
              </div>
            ))}
            <button className="w-full py-4 bg-[#C41230] text-white rounded-xl font-medium hover:bg-[#A30F28] transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Schedule New Payment
            </button>
          </div>
        )}

        {/* Request Tab */}
        {activeTab === 'request' && (
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-6 text-center">
            <div className="w-16 h-16 bg-[#FEF2F4] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#C41230]" />
            </div>
            <h3 className="font-semibold text-[#333333] mb-2">Request Money</h3>
            <p className="text-sm text-[#666666] mb-4">Send a payment request to friends and family</p>
            <button className="w-full py-3 bg-[#C41230] text-white rounded-xl font-medium hover:bg-[#A30F28] transition-colors">
              Create Request
            </button>
          </div>
        )}
      </main>
    </div>
  );
}`;
