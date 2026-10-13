import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, Shield, Layers } from 'lucide-react';
import { URLFeatures, FeatureMeta } from '../../types';
import { FEATURES_METADATA } from '../../utils/featureExtractor';

interface FeatureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: URLFeatures;
  url: string;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  isOpen,
  onClose,
  features,
  url,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0F172A] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131E3A]/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-wide">
                URL Feature Engineering Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                13 extracted numerical features fed into StandardScaler and Regularized Logistic Regression
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Target Bar */}
        <div className="px-6 py-3 bg-[#0B1020] border-b border-slate-800/80">
          <div className="text-xs text-slate-400 uppercase font-mono tracking-wider mb-1">
            Target URL
          </div>
          <div className="font-mono text-sm text-cyan-300 break-all select-all bg-slate-900/60 p-2 rounded border border-slate-800">
            {url}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {FEATURES_METADATA.map((meta) => {
              const val = features[meta.key];
              const isDanger = meta.dangerThreshold ? meta.dangerThreshold(val) : false;

              return (
                <div
                  key={meta.key}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isDanger
                      ? 'bg-rose-950/20 border-rose-800/50 hover:border-rose-700'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {meta.category}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-100">
                          {meta.label}
                        </h4>
                      </div>
                      <div className="font-mono text-xs text-cyan-400/80 mt-0.5">
                        {meta.key}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-base font-bold font-mono px-2 py-0.5 rounded ${
                          isDanger
                            ? 'text-rose-400 bg-rose-950/60 border border-rose-800'
                            : 'text-emerald-400 bg-emerald-950/40 border border-emerald-800'
                        }`}
                      >
                        {val}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                    {meta.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-500 font-mono">
                      Normal benchmark: <span className="text-slate-400">{meta.benchmarkNormal}</span>
                    </span>
                    {isDanger ? (
                      <span className="flex items-center gap-1 text-rose-400 font-mono">
                        <AlertTriangle className="w-3 h-3" /> Suspicious Value
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono">
                        <CheckCircle className="w-3 h-3" /> Within Normal Bounds
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mathematical Note */}
          <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-cyan-300 mb-1">
              <Info className="w-4 h-4 text-cyan-400" />
              StandardScaler Preprocessing Pipeline Note
            </div>
            <p className="leading-relaxed">
              In scikit-learn, these 13 raw numeric values are normalized using{' '}
              <code className="text-cyan-200 bg-slate-900 px-1 py-0.5 rounded">
                z = (x - μ) / σ
              </code>{' '}
              before entering the logistic sigmoid layer. This prevents high-magnitude features like{' '}
              <code className="text-cyan-200 bg-slate-900 px-1 py-0.5 rounded">url_length</code> from
              dominating binary indicators like{' '}
              <code className="text-cyan-200 bg-slate-900 px-1 py-0.5 rounded">isHttps</code> or{' '}
              <code className="text-cyan-200 bg-slate-900 px-1 py-0.5 rounded">at_symbol</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-[#0B1020]/90">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
