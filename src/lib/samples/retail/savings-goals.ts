export const RETAIL_SAVINGS_GOALS = `'use client';

import { useState } from 'react';
import { Home, CreditCard, PiggyBank, TrendingUp, Plus, Plane, Car, GraduationCap, Home as HomeIcon, ChevronRight, Sparkles, User } from 'lucide-react';

export default function SavingsGoals() {
  const [activeNav, setActiveNav] = useState('savings-goals');

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

  const goals = [
    {
      name: 'Dream Vacation',
      icon: Plane,
      target: 5000,
      current: 3250,
      color: '#0066CC',
      deadline: 'Jun 2025',
      monthlyContribution: '$250',
    },
    {
      name: 'New Car',
      icon: Car,
      target: 25000,
      current: 8500,
      color: '#C41230',
      deadline: 'Dec 2025',
      monthlyContribution: '$500',
    },
    {
      name: 'Emergency Fund',
      icon: PiggyBank,
      target: 15000,
      current: 12000,
      color: '#28A745',
      deadline: 'Mar 2025',
      monthlyContribution: '$400',
    },
  ];

  const suggestions = [
    { name: 'Education Fund', icon: GraduationCap, description: 'Save for courses or certifications' },
    { name: 'Home Down Payment', icon: HomeIcon, description: 'Start saving for your dream home' },
  ];

  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* App Header Bar */}
      <div className="bg-gradient-to-r from-[#1E3A5F] via-[#2E5A8F] to-[#1E3A5F] h-1" />

      {/* Header */}
      <header className="bg-white border-b border-[#E0E0E0] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1E3A5F] to-[#2E5A8F] rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-[#333333]">Savings Goals</h1>
              <p className="text-sm text-[#666666]">Track and achieve your financial goals</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-[#C41230] text-white rounded-lg text-sm font-medium hover:bg-[#A30F28] transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Goal</span>
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
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2E5A8F] rounded-xl p-4 sm:p-6 mb-6 text-white">
          <p className="text-white/80 text-sm mb-1">Total Savings Progress</p>
          <p className="text-2xl sm:text-3xl font-bold mb-3">
            \${totalSaved.toLocaleString()} <span className="text-lg font-normal text-white/60">/ \${totalTarget.toLocaleString()}</span>
          </p>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#FFD200] rounded-full transition-all"
              style={{ width: \`\${(totalSaved / totalTarget) * 100}%\` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">{Math.round((totalSaved / totalTarget) * 100)}% achieved</span>
            <span className="text-white/80">{goals.length} active goals</span>
          </div>
        </div>

        {/* Active Goals */}
        <div className="mb-6">
          <h2 className="font-semibold text-[#333333] mb-4">Active Goals</h2>
          <div className="space-y-4">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const progress = (goal.current / goal.target) * 100;
              return (
                <div
                  key={goal.name}
                  className="bg-white rounded-xl border border-[#E0E0E0] p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: \`\${goal.color}15\` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: goal.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-[#333333]">{goal.name}</h3>
                        <ChevronRight className="w-5 h-5 text-[#999999]" />
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[#666666]">
                          \${goal.current.toLocaleString()} of \${goal.target.toLocaleString()}
                        </span>
                        <span className="font-medium" style={{ color: goal.color }}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#F0F0F0] rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: \`\${progress}%\`, backgroundColor: goal.color }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#666666]">
                        <span>Target: {goal.deadline}</span>
                        <span>Monthly: {goal.monthlyContribution}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Goal Suggestions */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#FFD200]" />
            <h2 className="font-semibold text-[#333333]">Suggested Goals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={suggestion.name}
                  className="bg-white rounded-xl border border-dashed border-[#E0E0E0] p-4 text-left hover:border-[#C41230] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#666666]" />
                    </div>
                    <h3 className="font-medium text-[#333333]">{suggestion.name}</h3>
                  </div>
                  <p className="text-sm text-[#666666]">{suggestion.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-[#FFF8E1] border border-[#FFD200] rounded-xl p-4">
          <div className="flex items-start gap-3">
            <PiggyBank className="w-5 h-5 text-[#C41230] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#333333]">Smart Savings Tip</p>
              <p className="text-sm text-[#666666] mt-1">
                You're on track with your Emergency Fund! Consider increasing your monthly contribution by $50 to reach your goal 2 months earlier.
              </p>
              <button className="mt-2 text-sm font-medium text-[#C41230] hover:underline">
                Adjust contribution →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;
