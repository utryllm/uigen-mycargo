'use client';

import { X, Building2, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SampleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrototype: (persona: 'business' | 'retail') => void;
}

const PROTOTYPES = [
  {
    id: 'business' as const,
    name: 'Business Owner',
    description: 'Corporate banking experience with lending tools and relationship manager access',
    icon: Building2,
    color: '#1E3A5F',
    features: [
      'Account Dashboard',
      'Corporate Lending',
      'Relationship Manager',
      'Business Analytics',
    ],
  },
  {
    id: 'retail' as const,
    name: 'Retail Customer',
    description: 'Personal banking with payments, savings goals, and wealth management',
    icon: User,
    color: '#C41230',
    features: [
      'Account Dashboard',
      'Everyday Payments',
      'Savings Goals',
      'SmartWealth',
    ],
  },
];

export function SampleSelectorModal({
  isOpen,
  onClose,
  onSelectPrototype,
}: SampleSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b border-[#E0E0E0] flex-shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#333333]">
              Choose a Prototype
            </h2>
            <p className="text-xs text-[#666666] hidden sm:block">
              Select a persona to load an interactive banking prototype
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-[#666666] hover:text-[#333333] hover:bg-[#F5F5F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROTOTYPES.map((prototype) => {
              const Icon = prototype.icon;
              return (
                <button
                  key={prototype.id}
                  onClick={() => {
                    onSelectPrototype(prototype.id);
                    onClose();
                  }}
                  className={cn(
                    'group relative p-4 sm:p-5 rounded-xl border-2 border-[#E0E0E0] text-left transition-all duration-200',
                    'hover:border-[#C41230] hover:shadow-lg hover:-translate-y-0.5',
                    'focus:outline-none focus:ring-2 focus:ring-[#C41230] focus:ring-offset-2'
                  )}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${prototype.color}15` }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: prototype.color }}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-semibold text-[#333333] mb-1">
                    {prototype.name}
                  </h3>
                  <p className="text-sm text-[#666666] mb-4">
                    {prototype.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-1.5">
                    {prototype.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-xs text-[#555555]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C41230]" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-[#C41230]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <p className="mt-4 text-xs text-[#999999] text-center">
            Each prototype includes 4 interactive screens. You can modify any screen using the chat.
          </p>
        </div>
      </div>
    </div>
  );
}
