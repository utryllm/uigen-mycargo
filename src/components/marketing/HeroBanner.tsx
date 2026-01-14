'use client';

// Custom Protofy Logo - Abstract "P" made of connecting nodes/prototype blocks
function ProtofyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main P shape with nodes */}
      <rect x="8" y="6" width="6" height="6" rx="1.5" fill="white" />
      <rect x="18" y="6" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.9" />
      <rect x="18" y="13" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="8" y="13" width="6" height="6" rx="1.5" fill="white" />
      <rect x="8" y="20" width="6" height="6" rx="1.5" fill="white" fillOpacity="0.8" />

      {/* Connection lines */}
      <path d="M14 9H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M11 12V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M14 16H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M11 19V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M21 12V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function HeroBanner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F1A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Subtle glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-3xl mx-auto relative z-10">
        {/* Logo Icon */}
        <div className="relative inline-flex mb-10">
          <div className="w-28 h-28 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#A78BFA] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#6366F1]/30 transform rotate-3">
            <ProtofyLogo className="w-20 h-20" />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#A78BFA] rounded-full animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#6366F1] rounded-full" />
          <div className="absolute top-1/2 -right-8 w-3 h-3 bg-[#8B5CF6] rounded-full" />
        </div>

        {/* Brand Name */}
        <h1 className="text-8xl font-bold mb-8 tracking-tight">
          <span className="bg-gradient-to-r from-white via-[#E0E7FF] to-[#C7D2FE] bg-clip-text text-transparent">
            Protofy
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-3xl font-medium tracking-wide">
          <span className="text-white">Describe it.</span>
          <span className="mx-4 text-[#6366F1]">•</span>
          <span className="text-[#C7D2FE]">See it.</span>
          <span className="mx-4 text-[#8B5CF6]">•</span>
          <span className="bg-gradient-to-r from-[#6366F1] to-[#A78BFA] bg-clip-text text-transparent">Ship it.</span>
        </p>
      </div>
    </div>
  );
}
