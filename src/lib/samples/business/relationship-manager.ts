export const BUSINESS_RELATIONSHIP_MANAGER = `'use client';

import { useState } from 'react';
import { Building2, TrendingUp, Users, CreditCard, Phone, Mail, Calendar, MessageSquare, Star, Clock, ChevronRight, Video, User } from 'lucide-react';

export default function RelationshipManager() {
  const [activeNav, setActiveNav] = useState('relationship-manager');
  const [activeTab, setActiveTab] = useState('contact');

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

  const rmProfile = {
    name: 'Sarah Johnson',
    title: 'Senior Relationship Manager',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@bank.com',
    experience: '12 years',
    clients: '85+ business clients',
    rating: 4.9,
    availability: 'Available',
  };

  const upcomingMeetings = [
    {
      title: 'Quarterly Business Review',
      date: 'Jan 15, 2025',
      time: '10:00 AM',
      type: 'Video Call',
    },
    {
      title: 'Credit Facility Discussion',
      date: 'Jan 22, 2025',
      time: '2:30 PM',
      type: 'In Person',
    },
  ];

  const recentMessages = [
    {
      from: 'Sarah Johnson',
      subject: 'Re: Credit Line Increase Request',
      preview: 'Good news! Your application is progressing well. I expect to have...',
      time: '2 hours ago',
      unread: true,
    },
    {
      from: 'Sarah Johnson',
      subject: 'Year-End Account Summary',
      preview: 'Please find attached your year-end business account summary...',
      time: 'Yesterday',
      unread: false,
    },
    {
      from: 'Sarah Johnson',
      subject: 'New Investment Opportunity',
      preview: 'I wanted to share an exclusive investment opportunity that might...',
      time: '3 days ago',
      unread: false,
    },
  ];

  const quickActions = [
    { label: 'Schedule Call', icon: Phone, action: 'call' },
    { label: 'Send Message', icon: MessageSquare, action: 'message' },
    { label: 'Video Meeting', icon: Video, action: 'video' },
    { label: 'Book Appointment', icon: Calendar, action: 'appointment' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* App Header Bar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] via-[#2E5A8F] to-[#1E3A5F] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2E5A8F] rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">Relationship Manager</h1>
            <p className="text-sm text-[#666666]">Your dedicated banking partner</p>
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
        {/* RM Profile Card */}
        <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#C41230] to-[#E91E63] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              SJ
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-[#333333]">{rmProfile.name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <Star className="w-4 h-4 text-[#FFD200] fill-current" />
                  <span className="text-sm font-medium text-[#666666]">{rmProfile.rating}</span>
                </div>
              </div>
              <p className="text-[#666666] mb-3">{rmProfile.title}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1 text-[#666666]">
                  <Clock className="w-4 h-4" />
                  {rmProfile.experience}
                </div>
                <div className="flex items-center gap-1 text-[#666666]">
                  <Users className="w-4 h-4" />
                  {rmProfile.clients}
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-[#E8F5E9] text-[#28A745] rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-[#28A745] rounded-full animate-pulse" />
                {rmProfile.availability}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.action}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-[#E0E0E0] hover:border-[#C41230] hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-[#FEF2F4] rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#C41230]" />
                </div>
                <span className="text-xs font-medium text-[#333333]">{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['contact', 'meetings', 'messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={\`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors \${
                activeTab === tab
                  ? 'bg-[#C41230] text-white'
                  : 'bg-white text-[#666666] hover:bg-[#F5F5F5] border border-[#E0E0E0]'
              }\`}
            >
              {tab === 'contact' && 'Contact Info'}
              {tab === 'meetings' && 'Meetings'}
              {tab === 'messages' && 'Messages'}
            </button>
          ))}
        </div>

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-xl border border-[#E0E0E0] divide-y divide-[#E0E0E0]">
            <a href={\`tel:\${rmProfile.phone}\`} className="flex items-center gap-4 p-4 hover:bg-[#FAFAFA] transition-colors">
              <div className="w-10 h-10 bg-[#FEF2F4] rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#C41230]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#999999]">Phone</p>
                <p className="font-medium text-[#333333]">{rmProfile.phone}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#999999]" />
            </a>
            <a href={\`mailto:\${rmProfile.email}\`} className="flex items-center gap-4 p-4 hover:bg-[#FAFAFA] transition-colors">
              <div className="w-10 h-10 bg-[#FEF2F4] rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#C41230]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#999999]">Email</p>
                <p className="font-medium text-[#333333]">{rmProfile.email}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#999999]" />
            </a>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-4">
            {upcomingMeetings.map((meeting, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#E0E0E0] p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[#333333]">{meeting.title}</h3>
                  <span className="px-2 py-1 bg-[#F5F5F5] text-[#666666] rounded text-xs">
                    {meeting.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-[#666666]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {meeting.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {meeting.time}
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-4 bg-[#C41230] text-white rounded-xl font-medium hover:bg-[#A30F28] transition-colors flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule New Meeting
            </button>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl border border-[#E0E0E0] divide-y divide-[#E0E0E0]">
            {recentMessages.map((msg, idx) => (
              <div key={idx} className={\`p-4 hover:bg-[#FAFAFA] cursor-pointer transition-colors \${msg.unread ? 'bg-[#FEF2F4]' : ''}\`}>
                <div className="flex items-start gap-3">
                  {msg.unread && (
                    <span className="w-2 h-2 bg-[#C41230] rounded-full mt-2 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={\`font-medium \${msg.unread ? 'text-[#333333]' : 'text-[#666666]'}\`}>{msg.subject}</p>
                      <span className="text-xs text-[#999999] whitespace-nowrap ml-2">{msg.time}</span>
                    </div>
                    <p className="text-sm text-[#666666] truncate">{msg.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}`;
