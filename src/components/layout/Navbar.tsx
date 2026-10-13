import React from 'react';
import {
  Menu,
  ShieldCheck,
  Cpu,
  Sparkles,
  Sliders,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onToggleMobileSidebar,
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'scanner':
        return 'URL Security Scanner';
      case 'history':
        return 'Scan Logs & History';
      case 'models':
        return 'Model Evaluation & Metrics';
      case 'about':
        return 'System Architecture & Methodology';
      case 'settings':
        return 'System Preferences & Settings';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B1020]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>PhishGuard AI</span>
            <span>/</span>
            <span className="text-cyan-400 font-medium capitalize">{currentTab}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {getTabTitle(currentTab)}
          </h1>
        </div>
      </div>

      {/* Right: Status Indicators & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* ML Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="hidden sm:inline">Ridge & Lasso Engine Active</span>
          <span className="sm:hidden">ML Active</span>
        </div>

        {/* Quick Scan Action Button */}
        {currentTab !== 'scanner' && (
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan URL</span>
          </button>
        )}
      </div>
    </header>
  );
};
