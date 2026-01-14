'use client';

import { X, Building2, User } from 'lucide-react';

interface SampleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrototype: (persona: 'business' | 'retail') => void;
}

export function SampleSelectorModal({
  isOpen,
  onClose,
  onSelectPrototype,
}: SampleSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#333333]">
              Select Prototype
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#999999] hover:text-[#666666] hover:bg-[#F5F5F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-[#666666] mt-1">
            Choose a persona to load the demo
          </p>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-3">
          {/* Business Option */}
          <button
            onClick={() => {
              onSelectPrototype('business');
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#E0E0E0] hover:border-[#6366F1] hover:bg-[#EEF2FF] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h3 className="font-semibold text-[#333333] group-hover:text-[#6366F1] transition-colors">
                Business Banking
              </h3>
              <p className="text-sm text-[#666666]">
                Corporate accounts & lending
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] group-hover:bg-[#6366F1] flex items-center justify-center transition-colors flex-shrink-0">
              <svg
                className="w-4 h-4 text-[#999999] group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Retail Option */}
          <button
            onClick={() => {
              onSelectPrototype('retail');
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#E0E0E0] hover:border-[#8B5CF6] hover:bg-[#F5F3FF] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h3 className="font-semibold text-[#333333] group-hover:text-[#8B5CF6] transition-colors">
                Personal Banking
              </h3>
              <p className="text-sm text-[#666666]">
                Payments, savings & wealth
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] group-hover:bg-[#8B5CF6] flex items-center justify-center transition-colors flex-shrink-0">
              <svg
                className="w-4 h-4 text-[#999999] group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F5F5F5] border-t border-[#E0E0E0]">
          <p className="text-xs text-center text-[#888888]">
            5 interactive screens per prototype
          </p>
        </div>
      </div>
    </div>
  );
}
