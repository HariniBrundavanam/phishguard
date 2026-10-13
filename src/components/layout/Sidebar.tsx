import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  History,
  BarChart3,
  BookOpen,
  Settings,
  Link2,
  ChevronRight,
  X,
  Layers,
  Cpu,
} from 'lucide-react';
import { ModelId } from '../../types';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  selectedModel: ModelId;
  onSelectModel: (m: ModelId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  selectedModel,
  onSelectModel,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'scanner',
      label: 'URL Scanner',
      icon: ShieldCheck,
      badge: 'Core',
    },
    {
      id: 'history',
      label: 'Scan History',
      icon: History,
      badge: undefined,
    },
    {
      id: 'models',
      label: 'Model Comparison',
      icon: BarChart3,
      badge: '3 Models',
    },
    {
      id: 'about',
      label: 'Methodology & Docs',
      icon: BookOpen,
      badge: 'ML Architecture',
    },
    {
      id: 'settings',
      label: 'Preferences & Config',
      icon: Settings,
      badge: undefined,
    },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 flex flex-col bg-[#0B1020] border-r border-slate-800/80 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Logo Section */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-[#0E1529]">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-slate-950 shadow-md shadow-cyan-950/40">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-slate-800">
                <Link2 className="w-2.5 h-2.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-white tracking-tight">
                  Phish<span className="text-cyan-400">Guard</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                  AI
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Ridge & Lasso Classifier
              </div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors group cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}

          {/* Regularization Models Selector Mini-Card */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="px-3 pb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                Active Classifier
              </span>
            </div>

            <div className="space-y-1 px-1">
              {[
                { id: 'ridge', name: 'Ridge LR (L2)', sub: 'L2 Penalty' },
                { id: 'lasso', name: 'Lasso LR (L1)', sub: 'L1 Penalty' },
                { id: 'standard', name: 'Standard LR', sub: 'Unconstrained' },
                { id: 'all', name: 'Tri-Model Ensemble', sub: 'Side-by-Side' },
              ].map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectModel(m.id as ModelId)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-mono transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-cyan-300 border border-slate-700 font-semibold'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="text-[9px] opacity-70">{m.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Info Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0E1529]/80 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-medium text-xs mb-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Machine Learning Engine
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              StandardScaler + Regularized Logistic Regression (L1/L2) on 13 URL Features.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
