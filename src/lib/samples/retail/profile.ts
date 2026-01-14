export const RETAIL_PROFILE = `'use client';

import { useState } from 'react';
import { Home, CreditCard, PiggyBank, TrendingUp, User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Check, Camera, Mail, Phone, Wallet, DollarSign, AlertTriangle, Smartphone, Palette } from 'lucide-react';

export default function RetailProfile() {
  const [activeNav, setActiveNav] = useState('profile');
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    transactions: true,
    marketing: false,
  });
  const [spendingAlerts, setSpendingAlerts] = useState({
    dailyLimit: true,
    largeTransactions: true,
    international: true,
    lowBalance: true,
  });

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

  const menuSections = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Profile Information', icon: User, badge: null },
        { id: 'cards', label: 'Linked Cards', icon: Wallet, badge: '2' },
        { id: 'preferences', label: 'Preferences', icon: Palette, badge: null },
      ],
    },
    {
      title: 'Security',
      items: [
        { id: 'security', label: 'Security Settings', icon: Shield, badge: null },
        { id: 'alerts', label: 'Spending Alerts', icon: AlertTriangle, badge: 'New' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: null },
        { id: 'help', label: 'Help & Support', icon: HelpCircle, badge: null },
      ],
    },
  ];

  const linkedCards = [
    { name: 'Visa Debit', last4: '4582', type: 'debit', expires: '12/26', color: '#1A1F71' },
    { name: 'Mastercard Credit', last4: '9921', type: 'credit', expires: '08/27', color: '#EB001B' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* App Header Bar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] via-[#2E5A8F] to-[#1E3A5F] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2E5A8F] rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">Settings</h1>
            <p className="text-sm text-[#666666]">Manage your account and preferences</p>
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Menu */}
          <div className="lg:w-72 space-y-4">
            {menuSections.map((section) => (
              <div key={section.title} className="bg-white rounded-xl border border-[#E0E0E0]">
                <p className="px-4 py-2 text-xs font-semibold text-[#888888] uppercase tracking-wider border-b border-[#E0E0E0]">
                  {section.title}
                </p>
                <div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={\`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors \${
                          activeSection === item.id
                            ? 'bg-[#FEF2F4] text-[#C41230]'
                            : 'text-[#333333] hover:bg-[#FAFAFA]'
                        }\`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={\`px-2 py-0.5 text-xs rounded-full \${
                            item.badge === 'New'
                              ? 'bg-[#C41230] text-white'
                              : 'bg-[#E0E0E0] text-[#666666]'
                          }\`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Logout Button */}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#C41230] bg-white rounded-xl border border-[#E0E0E0] hover:bg-[#FEF2F4] transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {/* ===== COMMON 75%: Profile Section ===== */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#C41230] to-[#E91E63] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        JS
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#E0E0E0] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F5F5F5]">
                        <Camera className="w-4 h-4 text-[#666666]" />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#333333]">Jamie Smith</h2>
                      <p className="text-sm text-[#666666]">Personal Account</p>
                      <p className="text-xs text-[#888888] mt-1">Member since March 2021</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-lg">
                      <Mail className="w-5 h-5 text-[#666666]" />
                      <div>
                        <p className="text-xs text-[#888888]">Email</p>
                        <p className="text-sm text-[#333333]">jamie.smith@email.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-lg">
                      <Phone className="w-5 h-5 text-[#666666]" />
                      <div>
                        <p className="text-xs text-[#888888]">Phone</p>
                        <p className="text-sm text-[#333333]">+1 (555) 987-6543</p>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 w-full py-2.5 border border-[#C41230] text-[#C41230] rounded-lg text-sm font-medium hover:bg-[#FEF2F4] transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* ===== RETAIL SPECIFIC 25%: Linked Cards ===== */}
            {activeSection === 'cards' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E0E0E0]">
                  <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
                    <h3 className="font-semibold text-[#333333]">Your Cards</h3>
                    <button className="px-3 py-1.5 bg-[#C41230] text-white text-sm rounded-lg hover:bg-[#A30F28] transition-colors">
                      + Add Card
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    {linkedCards.map((card) => (
                      <div key={card.last4} className="relative overflow-hidden rounded-xl p-4" style={{ backgroundColor: card.color }}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-6">
                            <p className="text-white/80 text-sm">{card.name}</p>
                            <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded uppercase">
                              {card.type}
                            </span>
                          </div>
                          <p className="text-white text-lg font-mono tracking-wider mb-4">
                            **** **** **** {card.last4}
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/60 text-xs">EXPIRES</p>
                              <p className="text-white text-sm">{card.expires}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-white/80" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-xl p-4">
                  <p className="text-sm text-[#2E7D32]">
                    <strong>Secure:</strong> Your card details are encrypted and never stored on our servers.
                  </p>
                </div>
              </div>
            )}

            {/* ===== RETAIL SPECIFIC 25%: Preferences ===== */}
            {activeSection === 'preferences' && (
              <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                <h3 className="font-semibold text-[#333333] mb-4">Personal Preferences</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <label className="block text-sm font-medium text-[#333333] mb-2">Default Account</label>
                    <select className="w-full p-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#C41230]">
                      <option>Everyday Account (****4582)</option>
                      <option>Savings Account (****7891)</option>
                    </select>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <label className="block text-sm font-medium text-[#333333] mb-2">Currency Display</label>
                    <select className="w-full p-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#C41230]">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                    </select>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg">
                    <label className="block text-sm font-medium text-[#333333] mb-2">Statement Frequency</label>
                    <select className="w-full p-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#C41230]">
                      <option>Monthly</option>
                      <option>Quarterly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                  <button className="w-full py-2.5 bg-[#C41230] text-white rounded-lg text-sm font-medium hover:bg-[#A30F28] transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* ===== RETAIL SPECIFIC 25%: Spending Alerts ===== */}
            {activeSection === 'alerts' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FEF2F4] rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-[#C41230]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#333333]">Spending Alerts</h3>
                      <p className="text-sm text-[#666666]">Get notified about your spending patterns</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'dailyLimit', label: 'Daily Spending Limit', desc: 'Alert when spending exceeds $500/day', icon: DollarSign },
                      { key: 'largeTransactions', label: 'Large Transactions', desc: 'Notify for transactions over $200', icon: AlertTriangle },
                      { key: 'international', label: 'International Purchases', desc: 'Alert for purchases outside the US', icon: Smartphone },
                      { key: 'lowBalance', label: 'Low Balance Warning', desc: 'Notify when balance falls below $100', icon: Wallet },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-[#666666]" />
                            <div>
                              <p className="font-medium text-[#333333]">{item.label}</p>
                              <p className="text-sm text-[#666666]">{item.desc}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSpendingAlerts(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                            className={\`w-12 h-6 rounded-full transition-colors \${
                              spendingAlerts[item.key as keyof typeof spendingAlerts] ? 'bg-[#C41230]' : 'bg-[#E0E0E0]'
                            }\`}
                          >
                            <div className={\`w-5 h-5 bg-white rounded-full shadow transform transition-transform \${
                              spendingAlerts[item.key as keyof typeof spendingAlerts] ? 'translate-x-6' : 'translate-x-0.5'
                            }\`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#C41230] to-[#E91E63] rounded-xl p-4 text-white">
                  <h4 className="font-semibold mb-1">Customize Your Limits</h4>
                  <p className="text-sm opacity-90">Tap on any alert to customize the threshold amount</p>
                </div>
              </div>
            )}

            {/* ===== COMMON 75%: Security Settings ===== */}
            {activeSection === 'security' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                  <h3 className="font-semibold text-[#333333] mb-4">Security Settings</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-[#28A745]" />
                        <div>
                          <p className="font-medium text-[#333333]">Two-Factor Authentication</p>
                          <p className="text-sm text-[#666666]">Add extra security to your account</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#28A745]">Enabled</span>
                        <Check className="w-4 h-4 text-[#28A745]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-[#666666]" />
                        <div>
                          <p className="font-medium text-[#333333]">Biometric Login</p>
                          <p className="text-sm text-[#666666]">Use fingerprint or Face ID</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#28A745]">Active</span>
                        <Check className="w-4 h-4 text-[#28A745]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                      <div>
                        <p className="font-medium text-[#333333]">Password</p>
                        <p className="text-sm text-[#666666]">Last changed 45 days ago</p>
                      </div>
                      <button className="px-3 py-1.5 text-sm text-[#C41230] hover:bg-[#FEF2F4] rounded-lg transition-colors">
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                      <div>
                        <p className="font-medium text-[#333333]">Login History</p>
                        <p className="text-sm text-[#666666]">View recent sign-in activity</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#999999]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== COMMON 75%: Notifications ===== */}
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                <h3 className="font-semibold text-[#333333] mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'sms', label: 'SMS Alerts', desc: 'Get text messages for important alerts' },
                    { key: 'transactions', label: 'Transaction Alerts', desc: 'Notify me of all transactions' },
                    { key: 'marketing', label: 'Marketing', desc: 'Receive promotional offers' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg">
                      <div>
                        <p className="font-medium text-[#333333]">{item.label}</p>
                        <p className="text-sm text-[#666666]">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        className={\`w-12 h-6 rounded-full transition-colors \${
                          notifications[item.key as keyof typeof notifications] ? 'bg-[#C41230]' : 'bg-[#E0E0E0]'
                        }\`}
                      >
                        <div className={\`w-5 h-5 bg-white rounded-full shadow transform transition-transform \${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'
                        }\`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== COMMON 75%: Help & Support ===== */}
            {activeSection === 'help' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                  <h3 className="font-semibold text-[#333333] mb-4">Help & Support</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'FAQs', desc: 'Find answers to common questions' },
                      { label: 'Contact Support', desc: 'Chat with our support team' },
                      { label: 'Video Tutorials', desc: 'Learn how to use our app' },
                      { label: 'Report a Problem', desc: 'Let us know if something is wrong' },
                    ].map((item) => (
                      <button key={item.label} className="w-full flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg hover:bg-[#EEEEEE] transition-colors">
                        <div className="text-left">
                          <p className="font-medium text-[#333333]">{item.label}</p>
                          <p className="text-sm text-[#666666]">{item.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#999999]" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#C41230] to-[#E91E63] rounded-xl p-6 text-white">
                  <h4 className="font-semibold mb-2">Need help?</h4>
                  <p className="text-sm opacity-90 mb-4">Our support team is here for you 24/7</p>
                  <button className="px-4 py-2 bg-white text-[#C41230] rounded-lg text-sm font-medium hover:bg-[#F5F5F5] transition-colors">
                    Start Live Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}`;
