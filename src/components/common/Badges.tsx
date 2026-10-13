import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PredictionClass, RiskLevel } from '../../types';

export const PredictionBadge: React.FC<{
  prediction: PredictionClass;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}> = ({ prediction, size = 'md', showIcon = true }) => {
  const isPhish = prediction === 'phishing';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5',
  }[size];

  if (isPhish) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-mono bg-rose-500/15 border border-rose-500/30 text-rose-300 ${sizeClasses}`}
      >
        {showIcon && <ShieldAlert className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
        <span>Potential Phishing</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 ${sizeClasses}`}
    >
      {showIcon && <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>Likely Legitimate</span>
    </span>
  );
};

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const configs = {
    critical: {
      label: 'Critical Risk',
      bg: 'bg-red-500/20 text-red-300 border-red-500/40',
      dot: 'bg-red-400 animate-pulse',
    },
    high: {
      label: 'High Risk',
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      dot: 'bg-rose-400',
    },
    moderate: {
      label: 'Moderate Risk',
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dot: 'bg-amber-400',
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      dot: 'bg-teal-400',
    },
    safe: {
      label: 'Safe',
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dot: 'bg-emerald-400',
    },
  }[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${configs.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${configs.dot}`} />
      {configs.label}
    </span>
  );
};

export const ModelBadge: React.FC<{ modelId: 'standard' | 'ridge' | 'lasso' | string }> = ({
  modelId,
}) => {
  const configs: Record<string, { label: string; tag: string; color: string }> = {
    standard: {
      label: 'Standard LR',
      tag: 'No Penalty',
      color: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    ridge: {
      label: 'Ridge LR',
      tag: 'L2 Penalty',
      color: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    },
    lasso: {
      label: 'Lasso LR',
      tag: 'L1 Penalty',
      color: 'bg-violet-950/60 text-violet-300 border-violet-800/60',
    },
  };

  const key = modelId.toLowerCase().includes('ridge')
    ? 'ridge'
    : modelId.toLowerCase().includes('lasso')
    ? 'lasso'
    : 'standard';

  const cfg = configs[key];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono border ${cfg.color}`}
    >
      <span>{cfg.label}</span>
      <span className="text-[10px] opacity-75">[{cfg.tag}]</span>
    </span>
  );
};
