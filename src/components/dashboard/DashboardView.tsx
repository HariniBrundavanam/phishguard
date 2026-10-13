import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  ChevronRight,
  Cpu,
  Layers,
  Sparkles,
  Sliders,
  Clock,
  ArrowRight,
  Award,
} from 'lucide-react';
import { PredictionResult } from '../../types';
import { PredictionBadge, ModelBadge } from '../common/Badges';
import { FeatureDetailModal } from '../scanner/FeatureDetailModal';
import { DATASET_SUMMARY } from '../../data/benchmarkMetrics';

interface DashboardViewProps {
  history: PredictionResult[];
  onNavigate: (tab: string) => void;
  onInspectUrl: (result: PredictionResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  onNavigate,
  onInspectUrl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<'all' | 'phishing' | 'legitimate'>('all');
  const [selectedScanForModal, setSelectedScanForModal] = useState<PredictionResult | null>(null);

  // Statistics calculation
  const totalScans = history.length;
  const phishCount = history.filter((i) => i.prediction === 'phishing').length;
  const legitCount = history.filter((i) => i.prediction === 'legitimate').length;
  const phishPercentage = totalScans > 0 ? Math.round((phishCount / totalScans) * 100) : 0;

  // Filter recent scans
  const filteredHistory = history
    .filter((item) => {
      const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterClass === 'all' ? true : item.prediction === filterClass;
      return matchesSearch && matchesFilter;
    })
    .slice(0, 8);

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-12">
      {/* 1. Welcome Hero Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0E172C] via-[#0E1528] to-[#0A1122] border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Decorative Grid and Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Machine Learning Cybersecurity Engine
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Stay One Step Ahead of Phishing
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mt-2.5 leading-relaxed">
              PhishGuard AI analyzes statistical, lexical, and structural URL features to detect fraudulent websites with high accuracy. Powered by Standard, Ridge (L2), and Lasso (L1) Regularized Logistic Regression.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => onNavigate('scanner')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Scan a URL</span>
              </button>

              <button
                onClick={() => onNavigate('models')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Compare Regularization</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="hidden lg:flex flex-col gap-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shrink-0 w-64 backdrop-blur-xs">
            <div className="text-xs font-mono uppercase text-slate-400">
              Dataset Test Benchmark
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-cyan-400">77.12%</span>
              <span className="text-[11px] font-mono text-slate-400">Accuracy (271 Test Set)</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 w-[77.12%]" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
              <span>Lasso AUC: 0.8002</span>
              <span>1,354 Unique URLs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total URLs Scanned */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Scanned</span>
            <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {totalScans}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
            <span>Session & Local Storage</span>
            <span className="text-cyan-400">Active</span>
          </div>
        </div>

        {/* Card 2: Phishing Detected */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Phishing Caught</span>
            <div className="p-2 rounded-lg bg-rose-950/50 text-rose-400 border border-rose-900/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400">
            {phishCount}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
            <span>Threat Ratio</span>
            <span className="text-rose-400">{phishPercentage}% of total</span>
          </div>
        </div>

        {/* Card 3: Legitimate URLs */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Legitimate URLs</span>
            <div className="p-2 rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-900/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            {legitCount}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
            <span>Safe Ratio</span>
            <span className="text-emerald-400">
              {totalScans > 0 ? 100 - phishPercentage : 0}% of total
            </span>
          </div>
        </div>

        {/* Card 4: Model Status */}
        <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Model Status</span>
            <div className="p-2 rounded-lg bg-cyan-950/50 text-cyan-400 border border-cyan-900/30">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            3 Models Ready
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
            <span>Engine:</span>
            <span className="text-emerald-400">Standard, Ridge & Lasso</span>
          </div>
        </div>
      </div>

      {/* 3. Regularized Model Architecture Overview Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Logistic Regression Formulations
          </h3>
          <button
            onClick={() => onNavigate('models')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Evaluation & Metrics</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Model Card 1: Standard Logistic Regression */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase font-bold text-slate-300">
                  Standard Logistic
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  No Regularization
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Unconstrained Maximum Likelihood Estimation with L-BFGS solver (max_iter=1000). Achieves 77.12% accuracy and 0.7999 ROC-AUC on the 271 test dataset.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Test Accuracy / AUC:</span>
              <span className="text-slate-200 font-semibold">77.12% / 0.7999</span>
            </div>
          </div>

          {/* Model Card 2: Ridge (L2) */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-cyan-800/40 bg-gradient-to-b from-[#0F172A] to-[#0A1624] flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase font-bold text-cyan-300">
                  Ridge Logistic (L2)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  λ · ||w||₂² Penalty
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Imposes quadratic shrinkage penalty with liblinear solver (C=1.0). Smooths parameter vectors across collinear features such as url_length and path_length.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Test Accuracy / AUC:</span>
              <span className="text-cyan-400 font-semibold">77.12% / 0.7997</span>
            </div>
          </div>

          {/* Model Card 3: Lasso (L1) */}
          <div className="p-5 rounded-xl bg-[#0F172A] border border-violet-800/40 bg-gradient-to-b from-[#0F172A] to-[#120F24] flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase font-bold text-violet-300">
                  Lasso Logistic (L1)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Peak AUC: 0.8002
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Imposes absolute magnitude penalty with liblinear solver (C=1.0). Achieves the highest ROC-AUC (0.8002) among all three models on the test set.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Test Accuracy / AUC:</span>
              <span className="text-violet-400 font-semibold">77.12% / 0.8002</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Scans Table */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent URL Inspections
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspections persisted in local browser cache. Click any row to review extracted features.
            </p>
          </div>

          {/* Table Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search URLs..."
                className="w-44 sm:w-52 px-3 py-1.5 pl-8 rounded-lg bg-[#0B1020] border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-[#0B1020] border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Predictions</option>
              <option value="phishing">Phishing Only</option>
              <option value="legitimate">Legitimate Only</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Target URL</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Model Used</th>
                  <th className="py-2.5 px-3">Scan Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedScanForModal(scan)}
                  >
                    <td className="py-3 px-3 max-w-xs truncate text-slate-200 group-hover:text-cyan-300 font-mono">
                      {scan.url}
                    </td>
                    <td className="py-3 px-3">
                      <PredictionBadge prediction={scan.prediction} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      <span
                        className={
                          scan.prediction === 'phishing' ? 'text-rose-400' : 'text-emerald-400'
                        }
                      >
                        {scan.confidence}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      <ModelBadge modelId={scan.modelId} />
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(scan.timestamp).toLocaleDateString()}{' '}
                      <span className="text-slate-400 text-[10px]">
                        {new Date(scan.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedScanForModal(scan);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-mono transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Search className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-medium text-slate-300">No scanned URLs found</p>
            <p className="text-xs text-slate-400">
              {searchTerm
                ? 'Try adjusting your search filter or clear query.'
                : 'Enter a URL in the Scanner to analyze features and classification.'}
            </p>
            <button
              onClick={() => onNavigate('scanner')}
              className="mt-2 px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors cursor-pointer"
            >
              Scan First URL
            </button>
          </div>
        )}
      </div>

      {/* Feature Details Modal */}
      {selectedScanForModal && (
        <FeatureDetailModal
          isOpen={!!selectedScanForModal}
          onClose={() => setSelectedScanForModal(null)}
          features={selectedScanForModal.features}
          url={selectedScanForModal.url}
        />
      )}
    </div>
  );
};
