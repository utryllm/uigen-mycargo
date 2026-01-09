export const BUSINESS_LENDING = `'use client';

import { useState } from 'react';
import { Building2, TrendingUp, Users, CreditCard, ChevronRight, CheckCircle, Clock, FileText, Calculator } from 'lucide-react';

export default function CorporateLending() {
  const [activeNav, setActiveNav] = useState('lending');
  const [activeTab, setActiveTab] = useState('products');

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

  const lendingProducts = [
    {
      name: 'Business Line of Credit',
      description: 'Flexible revolving credit for working capital needs',
      rate: 'Prime + 1.5%',
      limit: 'Up to $5M',
      icon: CreditCard,
    },
    {
      name: 'Term Loan',
      description: 'Fixed-rate financing for equipment and expansion',
      rate: 'From 5.99%',
      limit: 'Up to $10M',
      icon: FileText,
    },
    {
      name: 'Commercial Real Estate',
      description: 'Financing for property acquisition and development',
      rate: 'From 6.25%',
      limit: 'Up to $25M',
      icon: Building2,
    },
  ];

  const activeLoans = [
    {
      name: 'Revolving Credit Facility',
      balance: '$550,000',
      limit: '$2,000,000',
      rate: '7.25%',
      nextPayment: 'Interest Only - Jan 15',
      status: 'active',
    },
    {
      name: 'Equipment Term Loan',
      balance: '$125,450',
      originalAmount: '$200,000',
      rate: '6.50%',
      nextPayment: '$4,567 - Jan 1',
      status: 'active',
    },
  ];

  const applications = [
    {
      type: 'Line of Credit Increase',
      requestedAmount: '$500,000',
      status: 'In Review',
      submitted: 'Dec 15, 2024',
      statusColor: '#FFC107',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Bank Header Stripe */}
      <div className="bg-[#C41230] h-2" />
      <div className="bg-[#FFD200] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">Corporate Lending</h1>
          <p className="text-sm text-[#666666]">Manage your credit facilities and applications</p>
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
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['products', 'active', 'applications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors \${
                activeTab === tab
                  ? 'bg-[#C41230] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#F5F5F5] border border-[#E0E0E0]'
              }\`}
            >
              {tab === 'products' && 'Lending Products'}
              {tab === 'active' && 'Active Loans'}
              {tab === 'applications' && 'Applications'}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {lendingProducts.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.name}
                  className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-5 hover:border-[#C41230] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FEF2F4] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#C41230]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#333333] mb-1">{product.name}</h3>
                      <p className="text-sm text-[#666666] mb-3">{product.description}</p>
                      <div className="flex flex-wrap gap-4">
                        <div>
                          <p className="text-xs text-[#999999]">Rate</p>
                          <p className="text-sm font-medium text-[#333333]">{product.rate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#999999]">Limit</p>
                          <p className="text-sm font-medium text-[#333333]">{product.limit}</p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#999999]" />
                  </div>
                </div>
              );
            })}

            <button className="w-full py-4 bg-[#C41230] text-white rounded-xl font-medium hover:bg-[#A30F28] transition-colors flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculate Your Rate
            </button>
          </div>
        )}

        {/* Active Loans Tab */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeLoans.map((loan, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#333333]">{loan.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      <span className="text-sm text-[#28A745]">Active</span>
                    </div>
                  </div>
                  <button className="text-sm text-[#0066CC] hover:underline">Details</button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-[#999999]">Current Balance</p>
                    <p className="text-lg font-semibold text-[#333333]">{loan.balance}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999]">{loan.limit ? 'Credit Limit' : 'Original Amount'}</p>
                    <p className="text-sm font-medium text-[#666666]">{loan.limit || loan.originalAmount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999]">Interest Rate</p>
                    <p className="text-sm font-medium text-[#666666]">{loan.rate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999]">Next Payment</p>
                    <p className="text-sm font-medium text-[#666666]">{loan.nextPayment}</p>
                  </div>
                </div>

                {loan.limit && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[#666666] mb-1">
                      <span>Credit Used</span>
                      <span>{loan.balance} of {loan.limit}</span>
                    </div>
                    <div className="w-full h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C41230] rounded-full"
                        style={{ width: '27.5%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-[#333333]">{app.type}</h3>
                      <p className="text-sm text-[#666666]">Requested: {app.requestedAmount}</p>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: \`\${app.statusColor}20\`, color: app.statusColor }}
                    >
                      <Clock className="w-3 h-3 inline mr-1" />
                      {app.status}
                    </div>
                  </div>
                  <p className="text-xs text-[#999999]">Submitted: {app.submitted}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-[#E0E0E0] mx-auto mb-3" />
                <p className="text-[#666666]">No pending applications</p>
              </div>
            )}

            <button className="w-full py-4 bg-white border-2 border-dashed border-[#E0E0E0] text-[#666666] rounded-xl font-medium hover:border-[#C41230] hover:text-[#C41230] transition-colors">
              + Start New Application
            </button>
          </div>
        )}
      </main>
    </div>
  );
}`;
