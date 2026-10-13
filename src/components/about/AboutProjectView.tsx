import React from 'react';
import {
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Code2,
  Sparkles,
  Scale,
  Activity,
  FileCode,
} from 'lucide-react';
import { FEATURES_METADATA } from '../../utils/featureExtractor';
import { DATASET_SUMMARY } from '../../data/benchmarkMetrics';

export const AboutProjectView: React.FC = () => {
  const methodologySteps = [
    {
      step: 1,
      title: 'Load & Deduplicate Dataset',
      desc: 'Acquired dataset of 2,488 URL records. Detected and removed 1,134 duplicates, establishing a clean benchmark corpus of 1,354 unique URLs (905 Legitimate, 449 Phishing).',
    },
    {
      step: 2,
      title: 'Inspect & Verify Missing Values',
      desc: 'Verified complete data integrity with 0 missing values across all 14 columns. Inspected feature summary statistics, distributions, and class proportions (66.84% vs 33.16%).',
    },
    {
      step: 3,
      title: 'Extract 13 URL-Based Features',
      desc: 'Engineered 13 quantitative lexical, structural, and security features without issuing external network requests or downloading web page HTML.',
    },
    {
      step: 4,
      title: 'Stratified 80/20 Train/Test Split',
      desc: 'Executed stratified train-test split (1,083 training URLs, 271 test URLs; 181 legitimate, 90 phishing) using random_state=42 to guarantee balanced evaluation.',
    },
    {
      step: 5,
      title: 'StandardScaler Normalization',
      desc: 'Fitted StandardScaler (z = (x - μ) / σ) on training features to prevent scale divergence between long URL lengths (mean ~51.8) and binary indicators (mean ~0.12).',
    },
    {
      step: 6,
      title: 'Train Regularized Models',
      desc: 'Fitted Standard Logistic Regression, Ridge Logistic Regression (L2, C=1.0, liblinear), and Lasso Logistic Regression (L1, C=1.0, liblinear).',
    },
    {
      step: 7,
      title: 'Evaluate Metrics & ROC-AUC',
      desc: 'Evaluated models on 271 test set: Accuracy (77.12%), Precision (75.93%), Recall (45.56%), F1-Score (56.94%), and ROC-AUC (0.8002 for Lasso, 0.7999 for Standard, 0.7997 for Ridge).',
    },
    {
      step: 8,
      title: 'Deploy In-Browser Classifier',
      desc: 'Implemented the trained StandardScaler normalization parameters and model weights directly in the client application for instantaneous real-time inference.',
    },
  ];

  const workflowSteps = [
    { label: 'URL Input', sub: 'Target Address', icon: Code2, color: 'text-cyan-400' },
    { label: 'Feature Extraction', sub: '13 Attributes', icon: Layers, color: 'text-teal-400' },
    { label: 'Feature Scaling', sub: 'StandardScaler', icon: Scale, color: 'text-blue-400' },
    { label: 'ML Model (LR)', sub: 'Ridge / Lasso', icon: Cpu, color: 'text-violet-400' },
    { label: 'Inference Probability', sub: 'Sigmoid Logit', icon: Activity, color: 'text-emerald-400' },
    { label: 'Result Display', sub: 'Risk Analysis', icon: ShieldCheck, color: 'text-cyan-300' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="w-4 h-4" />
          </span>
          <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
            System Methodology & Architecture
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Phishing URL Detection Using Ridge- and Lasso-Regularized Logistic Regression
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Complete machine learning workflow, dataset specifications, feature coefficients, and regularization theory.
        </p>
      </div>

      {/* 1. Problem Statement & Objective Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Problem Statement */}
        <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase font-bold tracking-wider">
            <span>Problem Statement</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            The Camouflage of Modern Phishing Attacks
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Phishing attacks remain one of the most pervasive cyber threats, causing billions in annual financial and credential losses. Modern attackers craft URLs that meticulously mimic legitimate domains using typosquatting, subdomains, deceptive path routing, and freely acquired TLS/HTTPS certificates. Manual inspection by human end-users is prone to fatigue and error, creating an urgent need for automated, high-throughput, and interpretable machine-learning classifiers.
          </p>
        </div>

        {/* Objective */}
        <div className="p-6 rounded-xl bg-[#0F172A] border border-cyan-900/40 bg-gradient-to-br from-[#0F172A] to-[#0A1A2E] shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold tracking-wider">
            <span>Project Objective</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            High-Confidence Regularized Classification
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Develop an end-to-end machine-learning system that extracts lightweight numerical features from URL strings and classifies them as potentially phishing or legitimate. By evaluating Standard Logistic Regression alongside Ridge (L2) and Lasso (L1) regularization, the system investigates how parameter penalty constraints resolve multicollinearity, control model variance, and maximize ROC-AUC.
          </p>
        </div>
      </div>

      {/* 2. Visual Workflow Diagram */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Operational Pipeline Architecture
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end flow from raw user input to final risk classification display.
          </p>
        </div>

        {/* Responsive Pipeline Steps Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {workflowSteps.map((wf, idx) => {
            const Icon = wf.icon;

            return (
              <div
                key={idx}
                className="relative p-4 rounded-xl bg-[#0B1020] border border-slate-800 flex flex-col items-center text-center justify-between group hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex flex-col items-center">
                  <div className={`p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 mb-2 ${wf.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-100">
                    {wf.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {wf.sub}
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-mono text-cyan-400/80">
                  Step 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Methodology 8-Step Breakdown */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-5">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Machine Learning Methodology (8-Phase Lifecycle)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Experimental protocol executed on the phishing URL dataset in scikit-learn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {methodologySteps.map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 font-mono">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Feature Engineering Deep Dive */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            Feature Engineering Schema (13 Attributes)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical, lexical, and structural attributes extracted purely from URL strings without requesting remote server HTML.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES_METADATA.map((feat) => (
            <div
              key={feat.key}
              className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200">{feat.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {feat.category}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-cyan-400/80 mb-1.5">
                  {feat.key}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {feat.description}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                Baseline: {feat.benchmarkNormal}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Regularization Mathematical Comparison */}
      <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            Mathematical Theory: Ridge (L2) vs. Lasso (L1) Regularization
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0B1020] border border-cyan-800/40 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase">
              Ridge Logistic Regression (L2 Penalty)
            </h4>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-200">
              Loss_Ridge = -Σ [y log(p) + (1-y) log(1-p)] + λ · Σ w_j²
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ridge applies a quadratic Euclidean norm penalty on parameter magnitudes. For correlated attributes such as URL length and path length, Ridge contracts coefficients smoothly toward zero, mitigating collinearity variance while retaining all feature signals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B1020] border border-violet-800/40 space-y-2">
            <h4 className="text-xs font-bold text-violet-300 font-mono uppercase">
              Lasso Logistic Regression (L1 Penalty)
            </h4>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-violet-200">
              Loss_Lasso = -Σ [y log(p) + (1-y) log(1-p)] + λ · Σ |w_j|
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lasso uses an absolute magnitude penalty. In our experimental evaluations on the 1,354 URL dataset, Lasso achieved the highest ROC-AUC score of <strong>0.8002</strong>, demonstrating superior ranking discrimination across cutoffs.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Technology Stack & Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Technology Stack */}
        <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Technology Stack
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 font-medium">Machine Learning Core</span>
              <span className="font-mono text-cyan-400">Python 3.11, scikit-learn, pandas, NumPy</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 font-medium">Preprocessing & Standardization</span>
              <span className="font-mono text-cyan-400">StandardScaler (μ, σ normalization)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 font-medium">Web Application Framework</span>
              <span className="font-mono text-cyan-400">React 19, Vite, TypeScript</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
              <span className="text-slate-300 font-medium">Design & Visualizations</span>
              <span className="font-mono text-cyan-400">Tailwind CSS, Recharts, Lucide Icons</span>
            </div>
          </div>
        </div>

        {/* Future Scope */}
        <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Future Scope & Extensions
          </h3>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Decision Threshold Tuning:</strong> Allowing adaptive threshold cutoffs to balance recall and precision for specific risk profiles.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>DNS & WHOIS Integration:</strong> Incorporating domain registration age and registrar reputation to detect newly registered phishing domains.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Browser Extension Package:</strong> Packaging the in-browser model weights into a lightweight extension for zero-latency URL vetting.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
