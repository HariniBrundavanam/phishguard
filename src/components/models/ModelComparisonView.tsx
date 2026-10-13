import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Sliders,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  Award,
  Database,
} from 'lucide-react';
import { BENCHMARK_METRICS, METRIC_EXPLANATIONS, DATASET_SUMMARY } from '../../data/benchmarkMetrics';

export const ModelComparisonView: React.FC = () => {
  const [selectedModelTab, setSelectedModelTab] = useState<'lasso' | 'ridge' | 'standard'>('lasso');

  // Currently displayed metrics
  const activeMetrics = BENCHMARK_METRICS;
  const currentModelData = activeMetrics.find((m) => m.modelId === selectedModelTab)!;

  // Comparison chart data format for Recharts
  const comparisonChartData = [
    {
      metric: 'Accuracy',
      Standard: (activeMetrics[0].metrics.accuracy * 100).toFixed(1),
      Ridge_L2: (activeMetrics[1].metrics.accuracy * 100).toFixed(1),
      Lasso_L1: (activeMetrics[2].metrics.accuracy * 100).toFixed(1),
    },
    {
      metric: 'Precision',
      Standard: (activeMetrics[0].metrics.precision * 100).toFixed(1),
      Ridge_L2: (activeMetrics[1].metrics.precision * 100).toFixed(1),
      Lasso_L1: (activeMetrics[2].metrics.precision * 100).toFixed(1),
    },
    {
      metric: 'Recall',
      Standard: (activeMetrics[0].metrics.recall * 100).toFixed(1),
      Ridge_L2: (activeMetrics[1].metrics.recall * 100).toFixed(1),
      Lasso_L1: (activeMetrics[2].metrics.recall * 100).toFixed(1),
    },
    {
      metric: 'F1-Score',
      Standard: (activeMetrics[0].metrics.f1Score * 100).toFixed(1),
      Ridge_L2: (activeMetrics[1].metrics.f1Score * 100).toFixed(1),
      Lasso_L1: (activeMetrics[2].metrics.f1Score * 100).toFixed(1),
    },
    {
      metric: 'ROC-AUC',
      Standard: (activeMetrics[0].metrics.rocAuc * 100).toFixed(1),
      Ridge_L2: (activeMetrics[1].metrics.rocAuc * 100).toFixed(1),
      Lasso_L1: (activeMetrics[2].metrics.rocAuc * 100).toFixed(1),
    },
  ];

  // Combined ROC curves data for Recharts
  const rocPlotData = [
    { fpr: 0.0, Standard: 0.0, Ridge: 0.0, Lasso: 0.0, Guess: 0.0 },
    { fpr: 0.02, Standard: 0.18, Ridge: 0.17, Lasso: 0.19, Guess: 0.02 },
    { fpr: 0.05, Standard: 0.38, Ridge: 0.37, Lasso: 0.39, Guess: 0.05 },
    { fpr: 0.072, Standard: 0.456, Ridge: 0.456, Lasso: 0.456, Guess: 0.072 },
    { fpr: 0.12, Standard: 0.59, Ridge: 0.58, Lasso: 0.60, Guess: 0.12 },
    { fpr: 0.18, Standard: 0.69, Ridge: 0.69, Lasso: 0.70, Guess: 0.18 },
    { fpr: 0.28, Standard: 0.79, Ridge: 0.79, Lasso: 0.80, Guess: 0.28 },
    { fpr: 0.42, Standard: 0.88, Ridge: 0.88, Lasso: 0.89, Guess: 0.42 },
    { fpr: 0.65, Standard: 0.95, Ridge: 0.95, Lasso: 0.95, Guess: 0.65 },
    { fpr: 1.0, Standard: 1.0, Ridge: 1.0, Lasso: 1.0, Guess: 1.0 },
  ];

  return (
    <div className="space-y-7 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BarChart3 className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
              Empirical ML Performance
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Model Evaluation & Regularization Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-3xl">
            Trained and tested on 1,354 unique phishing and legitimate URLs using scikit-learn Logistic Regression with L1 (Lasso) and L2 (Ridge) regularizers.
          </p>
        </div>

        {/* Dataset Summary Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>1,354 URLs (80% Train / 20% Test)</span>
        </div>
      </div>

      {/* Dataset Stratification Info Card */}
      <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <div className="text-slate-500 text-[10px] uppercase">Deduplicated Corpus</div>
          <div className="text-white font-bold text-base mt-0.5">1,354 URLs</div>
          <div className="text-slate-400 text-[10px]">1,134 duplicates removed</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase">Class Distribution</div>
          <div className="text-emerald-400 font-bold text-base mt-0.5">905 Legitimate</div>
          <div className="text-rose-400 text-[10px]">449 Phishing (33.2%)</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase">Stratified Split</div>
          <div className="text-cyan-400 font-bold text-base mt-0.5">1,083 / 271</div>
          <div className="text-slate-400 text-[10px]">80% Train, 20% Test</div>
        </div>
        <div>
          <div className="text-slate-500 text-[10px] uppercase">Peak Performance</div>
          <div className="text-violet-400 font-bold text-base mt-0.5">AUC 0.8002</div>
          <div className="text-slate-400 text-[10px]">Lasso (L1) Regularization</div>
        </div>
      </div>

      {/* 1. Summary Scorecards for 3 Models */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeMetrics.map((m) => {
          const isSelected = selectedModelTab === m.modelId;
          const isWinner = m.modelId === 'lasso';

          return (
            <div
              key={m.modelId}
              onClick={() => setSelectedModelTab(m.modelId)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#121B33] border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                  : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
              }`}
            >
              {isWinner && (
                <div className="absolute top-0 right-0 px-3 py-0.5 bg-gradient-to-l from-violet-500 to-cyan-500 text-slate-950 font-bold text-[10px] font-mono uppercase tracking-wider rounded-bl-lg flex items-center gap-1 shadow-sm">
                  <Award className="w-3 h-3" />
                  Peak ROC-AUC (0.8002)
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white font-mono">{m.modelName}</h3>
              </div>

              <div className="text-[11px] font-mono text-cyan-400/90 mb-3">
                {m.regularization}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Accuracy</div>
                  <div className="text-base font-bold text-slate-100">
                    {(m.metrics.accuracy * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">ROC-AUC</div>
                  <div
                    className={`text-base font-bold ${
                      isWinner ? 'text-violet-400' : 'text-cyan-400'
                    }`}
                  >
                    {m.metrics.rocAuc.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Precision</div>
                  <div className="text-sm font-semibold text-slate-300">
                    {(m.metrics.precision * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Recall</div>
                  <div className="text-sm font-semibold text-teal-300">
                    {(m.metrics.recall * 100).toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Active Features: {m.activeFeaturesCount}/13</span>
                <span className="text-cyan-400 font-mono">
                  {isSelected ? '● Inspected' : 'Click to inspect'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Interactive Comparison Chart & ROC Curve Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric Comparison Bar Chart */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Cross-Metric Performance Comparison (%)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated across Accuracy, Precision, Recall, F1, and ROC-AUC on 271 test URLs.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonChartData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[40, 85]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Standard" name="Standard LR" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Ridge_L2" name="Ridge (L2)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Lasso_L1" name="Lasso (L1)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-snug">
            <strong className="text-slate-200">Analysis:</strong> All three models achieve 77.12% accuracy and 75.93% precision. Lasso Logistic Regression achieves the highest ROC-AUC of <strong>0.8002</strong>, demonstrating slightly superior ranking discrimination across cutoffs.
          </div>
        </div>

        {/* ROC Curves Visualization */}
        <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                Receiver Operating Characteristic (ROC) Curves
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                True Positive Rate (Sensitivity) vs False Positive Rate across decision thresholds.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={rocPlotData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="fpr"
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'FPR', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                  domain={[0, 1]}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'TPR', angle: -90, position: 'insideLeft', offset: 15 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="Lasso"
                  name="Lasso L1 (AUC 0.8002)"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Ridge"
                  name="Ridge L2 (AUC 0.7997)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="Standard"
                  name="Standard LR (AUC 0.7999)"
                  stroke="#64748b"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                />
                <Line
                  type="linear"
                  dataKey="Guess"
                  name="Random Classifier"
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-snug">
            <strong className="text-slate-200">Operating Point:</strong> At default 0.5 probability threshold, the false positive rate is only 7.2% (13 false alarms out of 181 legitimate URLs) while catching 45.6% of phishing links.
          </div>
        </div>
      </div>

      {/* 3. Confusion Matrix Deep Dive for Active Model */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Confusion Matrix & Error Distribution — {currentModelData.modelName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact 271 test set predictions (181 Legitimate / 90 Phishing) from scikit-learn evaluation.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#0B1020] rounded-lg border border-slate-800 text-xs font-mono">
            {(['lasso', 'ridge', 'standard'] as const).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedModelTab(id)}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  selectedModelTab === id
                    ? 'bg-slate-800 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 2x2 Confusion Matrix Visualization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* True Negative */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                  True Negative (TN)
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-300">
                {currentModelData.confusionMatrix.tn}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Legitimate URLs correctly verified (92.8% of legitimate test set).
            </p>
          </div>

          {/* False Positive (Type I Error) */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                  False Positive (FP)
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-amber-300">
                {currentModelData.confusionMatrix.fp}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Legitimate URLs falsely flagged as phishing (only 7.2% false alarm rate).
            </p>
          </div>

          {/* False Negative (Type II Error) */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                  False Negative (FN)
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-rose-300">
                {currentModelData.confusionMatrix.fn}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Phishing URLs missed at 0.5 cutoff. Can be tuned via threshold settings.
            </p>
          </div>

          {/* True Positive */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                  True Positive (TP)
                </span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-cyan-300">
                {currentModelData.confusionMatrix.tp}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Malicious phishing URLs correctly identified.
            </p>
          </div>
        </div>

        {/* Hyperparameters Card */}
        <div className="p-4 rounded-lg bg-[#0B1020] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">Trained Pipeline:</span>
            <code className="text-cyan-300">
              LogisticRegression(penalty='{currentModelData.hyperparameters.penalty}', C={currentModelData.hyperparameters.C}, solver='{currentModelData.hyperparameters.solver}')
            </code>
          </div>
          <div className="text-slate-400">
            Penalized Loss: <span className="text-slate-200">{currentModelData.penaltyDescription}</span>
          </div>
        </div>
      </div>

      {/* 4. Feature Weights Table (Exact Notebook Coefficients from Cell 31) */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Trained Feature Coefficients — {currentModelData.modelName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Exact coefficient values fitted by scikit-learn on the StandardScaler-normalized features.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentModelData.featureWeights.map((fw) => {
            const isPositive = fw.weight > 0;

            return (
              <div
                key={fw.feature}
                className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                  isPositive
                    ? 'bg-rose-950/10 border-rose-900/30'
                    : 'bg-emerald-950/10 border-emerald-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-200 font-semibold">{fw.label}</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      isPositive
                        ? 'text-rose-400 bg-rose-950/40'
                        : 'text-emerald-400 bg-emerald-950/40'
                    }`}
                  >
                    {fw.weight > 0 ? `+${fw.weight.toFixed(4)}` : fw.weight.toFixed(4)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {isPositive
                    ? 'Increases phishing probability (malicious signal)'
                    : 'Reduces phishing probability (benign signal)'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed font-mono">
          <strong className="text-slate-200">Key Feature Insight:</strong> In this dataset, <code className="text-rose-400">valid_url</code> (+1.1759) and <code className="text-rose-400">url_length</code> (+0.5656) represent the strongest positive contributors towards class 1 (phishing), while <code className="text-emerald-400">nb_www</code> (-0.5331), <code className="text-emerald-400">path_length</code> (-0.5105), and <code className="text-emerald-400">at_symbol</code> (-0.3470) drive negative logit shifts.
        </div>
      </div>

      {/* 5. Metric Explanations Guide */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Cybersecurity ML Evaluation Metrics Guide
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interpretation of model evaluation indicators on the test dataset.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {METRIC_EXPLANATIONS.map((exp) => (
            <div
              key={exp.name}
              className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-cyan-300 font-mono">{exp.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {exp.symbol}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px]">
                <div className="text-cyan-400 font-mono font-medium">
                  Dataset Result: {exp.ideal}
                </div>
                <div className="text-slate-400 mt-1 leading-snug">
                  {exp.securityContext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
