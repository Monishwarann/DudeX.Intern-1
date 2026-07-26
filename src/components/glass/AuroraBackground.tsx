import React from 'react';

export const AuroraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#090d16] text-slate-100 overflow-x-hidden">
      {/* Background Animated Aurora Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-cyan-500/15 to-indigo-600/15 blur-[140px] animate-float" />
        <div className="absolute -bottom-[20%] left-[20%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-pink-500/15 to-purple-700/15 blur-[130px]" />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
