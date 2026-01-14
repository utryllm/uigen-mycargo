export const BUSINESS_PROFILE = `'use client';

import { useState } from 'react';
import { Home, Briefcase, Users, BarChart3, User, Building2, Shield, Bell, Key, HelpCircle, LogOut, ChevronRight, Check, Camera, Mail, Phone, MapPin } from 'lucide-react';

export default function BusinessProfile() {
  const [activeNav, setActiveNav] = useState('profile');
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    transactions: true,
    marketing: false,
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lending', label: 'Lending', icon: Briefcase },
    { id: 'relationship-manager', label: 'RM', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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
        { id: 'company', label: 'Company Details', icon: Building2, badge: null },
        { id: 'team', label: 'Team Management', icon: Users, badge: '3' },
      ],
    },
    {
      title: 'Security',
      items: [
        { id: 'security', label: 'Security Settings', icon: Shield, badge: null },
        { id: 'api', label: 'API Access', icon: Key, badge: 'New' },
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

  const teamMembers = [
    { name: 'Sarah Johnson', role: 'Admin', email: 'sarah@company.com', status: 'active' },
    { name: 'Mike Chen', role: 'Finance', email: 'mike@company.com', status: 'active' },
    { name: 'Emily Brown', role: 'Viewer', email: 'emily@company.com', status: 'pending' },
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
                        JD
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#E0E0E0] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F5F5F5]">
                        <Camera className="w-4 h-4 text-[#666666]" />
                      </button>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#333333]">John Davidson</h2>
                      <p className="text-sm text-[#666666]">Account Administrator</p>
                      <p className="text-xs text-[#888888] mt-1">Member since January 2020</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-lg">
                      <Mail className="w-5 h-5 text-[#666666]" />
                      <div>
                        <p className="text-xs text-[#888888]">Email</p>
                        <p className="text-sm text-[#333333]">john.davidson@acmecorp.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-lg">
                      <Phone className="w-5 h-5 text-[#666666]" />
                      <div>
                        <p className="text-xs text-[#888888]">Phone</p>
                        <p className="text-sm text-[#333333]">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 w-full py-2.5 border border-[#C41230] text-[#C41230] rounded-lg text-sm font-medium hover:bg-[#FEF2F4] transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* ===== BUSINESS SPECIFIC 25%: Company Details ===== */}
            {activeSection === 'company' && (
              <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                <h3 className="text-lg font-semibold text-[#333333] mb-4">Company Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                    <Building2 className="w-6 h-6 text-[#C41230]" />
                    <div>
                      <p className="text-xs text-[#888888]">Company Name</p>
                      <p className="font-medium text-[#333333]">Acme Corporation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                    <MapPin className="w-6 h-6 text-[#C41230]" />
                    <div>
                      <p className="text-xs text-[#888888]">Business Address</p>
                      <p className="font-medium text-[#333333]">123 Business Ave, Suite 400</p>
                      <p className="text-sm text-[#666666]">New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#F5F5F5] rounded-lg">
                      <p className="text-xs text-[#888888]">Tax ID (EIN)</p>
                      <p className="font-medium text-[#333333]">**-***4567</p>
                    </div>
                    <div className="p-4 bg-[#F5F5F5] rounded-lg">
                      <p className="text-xs text-[#888888]">Business Type</p>
                      <p className="font-medium text-[#333333]">Corporation</p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 border border-[#C41230] text-[#C41230] rounded-lg text-sm font-medium hover:bg-[#FEF2F4] transition-colors">
                    Update Company Info
                  </button>
                </div>
              </div>
            )}

            {/* ===== BUSINESS SPECIFIC 25%: Team Management ===== */}
            {activeSection === 'team' && (
              <div className="bg-white rounded-xl border border-[#E0E0E0]">
                <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
                  <h3 className="font-semibold text-[#333333]">Team Members</h3>
                  <button className="px-3 py-1.5 bg-[#C41230] text-white text-sm rounded-lg hover:bg-[#A30F28] transition-colors">
                    + Invite Member
                  </button>
                </div>
                <div className="divide-y divide-[#E0E0E0]">
                  {teamMembers.map((member) => (
                    <div key={member.email} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center text-sm font-medium text-[#666666]">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-[#333333]">{member.name}</p>
                          <p className="text-xs text-[#666666]">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-[#F5F5F5] text-xs text-[#666666] rounded">
                          {member.role}
                        </span>
                        <span className={\`px-2 py-1 text-xs rounded \${
                          member.status === 'active'
                            ? 'bg-[#E8F5E9] text-[#28A745]'
                            : 'bg-[#FFF3E0] text-[#F57C00]'
                        }\`}>
                          {member.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#999999]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== BUSINESS SPECIFIC 25%: API Access ===== */}
            {activeSection === 'api' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FEF2F4] rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-[#C41230]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#333333]">API Keys</h3>
                      <p className="text-sm text-[#666666]">Manage your API credentials for integrations</p>
                    </div>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#666666]">Production Key</span>
                      <span className="px-2 py-1 bg-[#E8F5E9] text-[#28A745] text-xs rounded">Active</span>
                    </div>
                    <code className="text-sm text-[#333333] font-mono">sk_live_****************************ab12</code>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#666666]">Test Key</span>
                      <span className="px-2 py-1 bg-[#E3F2FD] text-[#1976D2] text-xs rounded">Test Mode</span>
                    </div>
                    <code className="text-sm text-[#333333] font-mono">sk_test_****************************cd34</code>
                  </div>
                  <button className="mt-4 w-full py-2.5 border border-[#C41230] text-[#C41230] rounded-lg text-sm font-medium hover:bg-[#FEF2F4] transition-colors">
                    Generate New Key
                  </button>
                </div>

                <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4">
                  <p className="text-sm text-[#8D6E00]">
                    <strong>Security Note:</strong> Never share your API keys. Rotate keys regularly for enhanced security.
                  </p>
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
                      <div>
                        <p className="font-medium text-[#333333]">Password</p>
                        <p className="text-sm text-[#666666]">Last changed 30 days ago</p>
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
                      { label: 'Contact Support', desc: 'Get help from our team' },
                      { label: 'Documentation', desc: 'API docs and guides' },
                      { label: 'Report an Issue', desc: 'Let us know if something is wrong' },
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
                  <h4 className="font-semibold mb-2">Need immediate help?</h4>
                  <p className="text-sm opacity-90 mb-4">Our business support team is available 24/7</p>
                  <button className="px-4 py-2 bg-white text-[#C41230] rounded-lg text-sm font-medium hover:bg-[#F5F5F5] transition-colors">
                    Call 1-800-BUSINESS
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
