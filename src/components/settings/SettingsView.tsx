import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Check,
  RotateCcw,
  Scale,
  ShieldAlert,
  Database,
  Layers,
  FileSpreadsheet,
  FileJson,
} from 'lucide-react';
import { ModelId, PredictionResult } from '../../types';
import { SCALER_PARAMS, ORDERED_FEATURE_KEYS } from '../../utils/modelInference';
import { FEATURES_METADATA } from '../../utils/featureExtractor';
import { exportHistoryAsCsv, exportHistoryAsJson } from '../../utils/historyStorage';

interface SettingsViewProps {
  selectedModel: ModelId;
  onSelectModel: (m: ModelId) => void;
  decisionThreshold: number;
  onUpdateThreshold: (t: number) => void;
  history: PredictionResult[];
  onResetDemoData: () => void;
  onClearHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  selectedModel,
  onSelectModel,
  decisionThreshold,
  onUpdateThreshold,
  history,
  onResetDemoData,
  onClearHistory,
}) => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [thresholdSaved, setThresholdSaved] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateThreshold(val);
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 1500);
  };

  const handleResetDemo = () => {
    onResetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Settings className="w-4 h-4" />
          </span>
          <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
            System Preferences
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Model & Application Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Customize classification decision thresholds, manage default regularizers, inspect trained StandardScaler parameters, and manage local storage.
        </p>
      </div>

      {/* 1. Decision Threshold Configurator */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Classification Decision Cutoff Threshold
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust the sigmoid probability threshold at which a URL is classified as Phishing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-cyan-300">
              {decisionThreshold.toFixed(2)}
            </span>
            {thresholdSaved && (
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Applied
              </span>
            )}
          </div>
        </div>

        {/* Threshold Slider */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={decisionThreshold}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>0.10 (High Sensitivity / Max Recall)</span>
            <span>0.50 (Default Notebook Cutoff)</span>
            <span>0.90 (High Specificity / Min False Alarms)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed font-mono">
          <div className="text-cyan-400 font-bold">Operating Sensitivity Tradeoff:</div>
          <div>
            • <strong>Default 0.50:</strong> Evaluated in notebook (Accuracy: 77.12%, Precision: 75.93%, Recall: 45.56%, False Positives: 13 / 181).
          </div>
          <div>
            • <strong>Lowering to 0.30 - 0.40:</strong> Significantly increases phishing recall (catches more malicious links) with modest increase in false alerts.
          </div>
        </div>
      </div>

      {/* 2. Default Active Classifier Preference */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Default Classification Model
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select the default logistic regression formulation used on the URL Scanner view.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { id: 'ridge', name: 'Ridge LR (L2)', desc: 'L2 penalty (C=1.0, liblinear)' },
            { id: 'lasso', name: 'Lasso LR (L1)', desc: 'L1 penalty (Peak 0.8002 AUC)' },
            { id: 'standard', name: 'Standard LR', desc: 'Unconstrained (C=1.0, lbfgs)' },
            { id: 'all', name: 'Tri-Model Ensemble', desc: 'Side-by-side comparison' },
          ].map((m) => {
            const isSelected = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectModel(m.id as ModelId)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                    : 'bg-[#0B1020] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white font-mono">{m.name}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400">{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Trained StandardScaler Parameters Reference */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            Trained StandardScaler Parameters (1,354 Unique URL Dataset)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mean (μ) and Scale (σ) vectors fitted on the 1,083 training set rows, normalizing feature inputs prior to sigmoid evaluation.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Feature Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Mean (μ)</th>
                <th className="py-2.5 px-3">Std Dev (σ)</th>
                <th className="py-2.5 px-3">Normalization Formula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {ORDERED_FEATURE_KEYS.map((key) => {
                const meta = FEATURES_METADATA.find((f) => f.key === key)!;
                const { mean, scale } = SCALER_PARAMS[key];
                return (
                  <tr key={key} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-semibold text-cyan-300">{key}</td>
                    <td className="py-2.5 px-3 text-slate-400">{meta?.category}</td>
                    <td className="py-2.5 px-3 font-mono">{mean.toFixed(4)}</td>
                    <td className="py-2.5 px-3 font-mono">{scale.toFixed(4)}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      z = (x - {mean.toFixed(2)}) / {scale.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Local Storage & Telemetry Management */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Registry & Log Storage Management
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Currently storing {history.length} URL scan records in local browser memory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportHistoryAsJson(history)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON ({history.length})</span>
          </button>

          <button
            onClick={() => exportHistoryAsCsv(history)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>{resetSuccess ? 'Presets Restored!' : 'Reset Sample Scans'}</span>
          </button>

          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-mono border border-rose-800/50 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <span>Clear All Scan Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
