import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  RotateCcw,
  Copy,
  Check,
  BookmarkPlus,
  Layers,
  AlertTriangle,
  Info,
  Sliders,
  ChevronDown,
  Zap,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { ModelId, PredictionResult } from '../../types';
import { predictUrlLocally } from '../../utils/modelInference';
import { SAMPLE_URLS } from '../../data/sampleUrls';
import { PredictionBadge, RiskBadge } from '../common/Badges';
import { FeatureDetailModal } from './FeatureDetailModal';

interface UrlScannerViewProps {
  selectedModel: ModelId;
  onSelectModel: (m: ModelId) => void;
  onScanCompleted: (result: PredictionResult) => void;
  initialUrl?: string;
}

export const UrlScannerView: React.FC<UrlScannerViewProps> = ({
  selectedModel,
  onSelectModel,
  onScanCompleted,
  initialUrl = '',
}) => {
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanResult, setScanResult] = useState<PredictionResult | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Validate URL input
  const validateUrl = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setValidationError('Please enter or paste a URL to analyze.');
      return false;
    }
    if (trimmed.length < 4) {
      setValidationError('URL is too short to extract meaningful features.');
      return false;
    }
    if (!trimmed.includes('.') && !trimmed.startsWith('localhost')) {
      setValidationError('Please provide a valid domain with a TLD extension (e.g., example.com).');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateUrl(inputUrl)) return;

    setIsScanning(true);
    setScanResult(null);
    setSavedSuccess(false);

    try {
      // Feature extraction pipeline simulation steps
      setScanStep('Parsing URL components & RFC syntax...');
      await new Promise((r) => setTimeout(r, 180));

      setScanStep('Computing 13 lexical and structural URL attributes...');
      await new Promise((r) => setTimeout(r, 190));

      setScanStep('Normalizing feature vector via trained StandardScaler...');
      await new Promise((r) => setTimeout(r, 190));

      setScanStep('Evaluating Logistic Regression logit & regularization penalties...');
      await new Promise((r) => setTimeout(r, 160));

      const result = predictUrlLocally(inputUrl, selectedModel);

      setScanResult(result);
      onScanCompleted(result);
    } catch (err) {
      console.error('Scan execution error:', err);
      setValidationError('An error occurred during feature processing. Please try again.');
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleClear = () => {
    setInputUrl('');
    setScanResult(null);
    setValidationError(null);
    setSavedSuccess(false);
  };

  const handleLoadSample = (sampleUrl: string) => {
    setInputUrl(sampleUrl);
    setValidationError(null);
  };

  const handleCopyUrl = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult.url);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleSaveToHistoryManual = () => {
    if (!scanResult) return;
    onScanCompleted(scanResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Zap className="w-4 h-4" />
          </span>
          <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
            Trained Machine Learning Model Inspector
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Phishing URL Classifier
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Enter any web address to extract 13 numerical characteristics, normalize features using the trained{' '}
          <code className="text-cyan-300 font-mono text-xs">StandardScaler</code>, and predict phishing
          probability using Regularized Logistic Regression.
        </p>
      </div>

      {/* Primary URL Input Card */}
      <div className="p-5 sm:p-7 rounded-xl bg-[#0F172A] border border-slate-700/80 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleScan} className="space-y-4 relative z-10">
          {/* Input Label & Model Selector Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label
              htmlFor="url-input"
              className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              Target Web Address
            </label>

            {/* Model Select Pill Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0B1020] rounded-lg border border-slate-800 text-xs">
              <span className="text-[11px] font-mono text-slate-400 px-2 hidden md:inline">
                Model:
              </span>
              <button
                type="button"
                onClick={() => onSelectModel('ridge')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  selectedModel === 'ridge'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="L2 Regularization (Shrinks coefficients, combats multicollinearity)"
              >
                Ridge (L2)
              </button>
              <button
                type="button"
                onClick={() => onSelectModel('lasso')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  selectedModel === 'lasso'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="L1 Regularization (L1 penalty, peak 0.8002 ROC-AUC)"
              >
                Lasso (L1)
              </button>
              <button
                type="button"
                onClick={() => onSelectModel('standard')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  selectedModel === 'standard'
                    ? 'bg-slate-800 text-slate-200 border border-slate-600 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Standard Logistic Regression (No penalty)"
              >
                Standard LR
              </button>
              <button
                type="button"
                onClick={() => onSelectModel('all')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  selectedModel === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Compare all 3 models side-by-side"
              >
                All 3
              </button>
            </div>
          </div>

          {/* Large URL Input Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <span className="font-mono text-sm text-cyan-400/80">URL &gt;</span>
            </div>
            <input
              id="url-input"
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Paste a URL to check for potential phishing… (e.g. https://domain.com/path)"
              className="w-full pl-18 pr-28 py-3.5 sm:py-4 bg-[#0B1020] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 font-mono text-sm sm:text-base focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              disabled={isScanning}
              autoComplete="off"
              spellCheck="false"
            />
            {inputUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-3 my-auto h-7 px-2 flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                title="Clear input"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Quick Preset Samples */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                Sample Presets:
              </span>
              {SAMPLE_URLS.slice(0, 4).map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadSample(sample.url)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono border whitespace-nowrap transition-colors cursor-pointer ${
                    sample.expectedCategory === 'phishing'
                      ? 'bg-rose-950/20 text-rose-300 border-rose-900/40 hover:bg-rose-900/30'
                      : 'bg-emerald-950/20 text-emerald-300 border-emerald-900/40 hover:bg-emerald-900/30'
                  }`}
                  title={sample.description}
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Main Submit & Clear Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClear}
                disabled={!inputUrl || isScanning}
                className="px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors disabled:opacity-40 cursor-pointer"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isScanning}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-lg shadow-cyan-950/50 disabled:opacity-60 cursor-pointer"
              >
                {isScanning ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Scan URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Loading Progress State */}
        {isScanning && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-pulse text-cyan-400" />
                {scanStep}
              </span>
              <span className="text-slate-400 animate-pulse">Running In-Browser ML...</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-300 w-full animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* SCAN RESULTS PANEL */}
      {scanResult && !isScanning && (
        <div className="space-y-6 animate-fadeIn">
          {/* SECTION A: Primary Verdict Banner */}
          <div
            className={`p-6 sm:p-7 rounded-xl border relative overflow-hidden shadow-2xl transition-all ${
              scanResult.prediction === 'phishing'
                ? 'bg-gradient-to-br from-[#1A0D14] via-[#120B15] to-[#0B1020] border-rose-600/50 shadow-rose-950/30'
                : 'bg-gradient-to-br from-[#0B1B17] via-[#0A1617] to-[#0B1020] border-emerald-600/50 shadow-emerald-950/30'
            }`}
          >
            {/* Ambient Corner Glow */}
            <div
              className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${
                scanResult.prediction === 'phishing' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Verdict Icon + Title */}
              <div className="flex items-start gap-4">
                <div
                  className={`p-3.5 rounded-xl border shrink-0 ${
                    scanResult.prediction === 'phishing'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  }`}
                >
                  {scanResult.prediction === 'phishing' ? (
                    <ShieldAlert className="w-10 h-10" />
                  ) : (
                    <ShieldCheck className="w-10 h-10" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <PredictionBadge prediction={scanResult.prediction} size="lg" />
                    <RiskBadge level={scanResult.riskLevel} />
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/60 font-semibold">
                      Trained scikit-learn Weights
                    </span>
                  </div>

                  <h3
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      scanResult.prediction === 'phishing' ? 'text-rose-200' : 'text-emerald-200'
                    }`}
                  >
                    {scanResult.prediction === 'phishing'
                      ? 'Potential Phishing URL Detected'
                      : 'Likely Legitimate URL'}
                  </h3>

                  <p className="text-xs text-slate-400 font-mono mt-1 break-all select-all">
                    Target: <span className="text-slate-200">{scanResult.url}</span>
                  </p>
                </div>
              </div>

              {/* Confidence & Model Probability Display */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                <div className="text-left md:text-right">
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Model Confidence
                  </div>
                  <div
                    className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
                      scanResult.prediction === 'phishing' ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {scanResult.confidence}%
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    P(Phishing) = {(scanResult.probability * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="mt-2 text-right">
                  <div className="text-[10px] font-mono text-slate-400">Evaluated with</div>
                  <div className="text-xs font-mono font-medium text-cyan-300">
                    {scanResult.modelUsed}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-mono transition-colors cursor-pointer"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 text-xs font-mono transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View All 13 Features</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToHistoryManual}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-mono transition-colors cursor-pointer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-slate-400" />
                  <span>{savedSuccess ? 'Saved to Logs!' : 'Save to History'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Scan Another URL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SECTION C: Visual Risk Summary Card */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Risk Analysis & Behavioral Signals
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risk Factors Column */}
              <div className="p-4 rounded-lg bg-rose-950/15 border border-rose-900/30">
                <div className="text-xs font-mono uppercase text-rose-300 font-semibold mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Identified Threat Indicators ({scanResult.riskFactors.length})
                </div>
                {scanResult.riskFactors.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {scanResult.riskFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No explicit structural threat anomalies detected.
                  </p>
                )}
              </div>

              {/* Safe Factors Column */}
              <div className="p-4 rounded-lg bg-emerald-950/15 border border-emerald-900/30">
                <div className="text-xs font-mono uppercase text-emerald-300 font-semibold mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Benign Indicators ({scanResult.safeFactors.length})
                </div>
                {scanResult.safeFactors.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {scanResult.safeFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Lacking typical benign structural hallmarks.
                  </p>
                )}
              </div>
            </div>

            {/* Crucial Security Notice */}
            <div className="mt-4 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-300">Security Notice:</strong> The classification is based on statistical lexical features (length, valid syntax, punctuation, sensitive tokens). A legitimate verdict signifies the absence of typical phishing traits, not an absolute guarantee that the remote server is uncompromised.
              </span>
            </div>
          </div>

          {/* SECTION D: Tri-Model Comparison (Side-by-Side Standard vs Ridge vs Lasso) */}
          {scanResult.allModels && scanResult.allModels.length > 0 && (
            <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Regularization Comparative Breakdown
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Outputs from all three logistic regression models on this identical feature vector.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scanResult.allModels.map((m) => {
                  const isCurrent = scanResult.modelId === m.modelId;
                  const isPhish = m.prediction === 'phishing';

                  return (
                    <div
                      key={m.modelId}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-slate-900/90 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/20'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {m.modelName}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Selected
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono mb-3">
                        {m.regularization}
                      </div>

                      <div className="flex items-baseline justify-between mb-2">
                        <PredictionBadge prediction={m.prediction} size="sm" />
                        <span
                          className={`font-mono font-bold text-base ${
                            isPhish ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {m.confidence}%
                        </span>
                      </div>

                      {/* Mini Probability Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>P(Phishing)</span>
                          <span>{(m.probability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isPhish ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, m.probability * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 leading-tight">
                        {m.l1_l2_penalty}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION B: Extracted URL Features Matrix */}
          <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Primary Feature Vector Elements
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted values fed to the StandardScaler and logistic sigmoid classifier.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsInspectorOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Inspect All 13 Features</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Cards for top key features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  key: 'valid_url',
                  label: 'Valid URL Syntax',
                  val: scanResult.features.valid_url === 1 ? '1 (Valid)' : '0 (Invalid)',
                  unit: '',
                  isDanger: scanResult.features.valid_url === 1,
                  desc: 'Highest dataset weight: +1.17',
                },
                {
                  key: 'url_length',
                  label: 'URL Length',
                  val: scanResult.features.url_length,
                  unit: 'chars',
                  isDanger: scanResult.features.url_length > 65,
                  desc: 'Mean: 51.8 chars',
                },
                {
                  key: 'sensitive_words_count',
                  label: 'Sensitive Words',
                  val: scanResult.features.sensitive_words_count,
                  unit: 'tokens',
                  isDanger: scanResult.features.sensitive_words_count > 0,
                  desc: 'login, account, verify...',
                },
                {
                  key: 'nb_hyphens',
                  label: 'Hyphens Count',
                  val: scanResult.features.nb_hyphens,
                  unit: 'hyphens',
                  isDanger: scanResult.features.nb_hyphens >= 2,
                  desc: 'Brand spoofing marker',
                },
                {
                  key: 'nb_dots',
                  label: 'Dots Count',
                  val: scanResult.features.nb_dots,
                  unit: 'dots',
                  isDanger: scanResult.features.nb_dots >= 5,
                  desc: 'Subdomain depth',
                },
                {
                  key: 'isHttps',
                  label: 'HTTPS Protocol',
                  val: scanResult.features.isHttps === 1 ? 'YES' : 'NO',
                  unit: '',
                  isDanger: scanResult.features.isHttps === 0,
                  desc: scanResult.features.isHttps === 1 ? 'Active TLS' : 'Unencrypted HTTP',
                },
              ].map((f) => (
                <div
                  key={f.key}
                  className={`p-3 rounded-lg border transition-all ${
                    f.isDanger
                      ? 'bg-rose-950/20 border-rose-800/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-slate-400 mb-1 truncate">
                    {f.label}
                  </div>
                  <div
                    className={`text-lg font-bold font-mono ${
                      f.isDanger ? 'text-rose-400' : 'text-slate-100'
                    }`}
                  >
                    {f.val}{' '}
                    {f.unit && <span className="text-[10px] font-normal text-slate-500">{f.unit}</span>}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-1">
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature Details Modal */}
      {scanResult && (
        <FeatureDetailModal
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          features={scanResult.features}
          url={scanResult.url}
        />
      )}
    </div>
  );
};
