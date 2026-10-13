import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Download,
  FileJson,
  FileSpreadsheet,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Database,
  Info,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { PredictionResult, ModelId } from '../../types';
import { PredictionBadge, ModelBadge, RiskBadge } from '../common/Badges';
import { FeatureDetailModal } from '../scanner/FeatureDetailModal';
import {
  deleteScanFromHistory,
  clearAllHistory,
  exportHistoryAsJson,
  exportHistoryAsCsv,
} from '../../utils/historyStorage';

interface HistoryViewProps {
  history: PredictionResult[];
  onHistoryUpdated: (newHistory: PredictionResult[]) => void;
  onNavigateToScan: (url: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onHistoryUpdated,
  onNavigateToScan,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<'all' | 'phishing' | 'legitimate'>('all');
  const [filterModel, setFilterModel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'confidence_high' | 'confidence_low'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedScan, setSelectedScan] = useState<PredictionResult | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter & Sort
  const filteredList = history.filter((item) => {
    const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      filterClass === 'all' ? true : item.prediction === filterClass;
    const matchesModel =
      filterModel === 'all' ? true : item.modelId === filterModel;
    return matchesSearch && matchesClass && matchesModel;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    if (sortBy === 'confidence_high') {
      return b.confidence - a.confidence;
    }
    if (sortBy === 'confidence_low') {
      return a.confidence - b.confidence;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedList.length / pageSize));
  const paginatedList = sortedList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteScanFromHistory(id);
    onHistoryUpdated(updated);
  };

  const handleConfirmClearAll = () => {
    clearAllHistory();
    onHistoryUpdated([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header & Distinction Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <History className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
              Inspection Registry
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Scan History & Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete record of analyzed URLs, extracted feature vectors, and regularized model outputs.
          </p>
        </div>

        {/* Export / Clear Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportHistoryAsJson(history)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
            title="Download JSON telemetry"
          >
            <FileJson className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => exportHistoryAsCsv(history)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
            title="Download CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-mono border border-rose-800/50 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Storage Architecture Notice (Requirement 7) */}
      <div className="p-3.5 rounded-lg bg-[#0E172C] border border-cyan-800/30 flex items-start gap-3 text-xs text-slate-300">
        <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-cyan-300 font-mono">Storage Architecture:</strong> Displaying{' '}
          <span className="text-slate-100 font-semibold">{history.length} records</span> stored in
          local browser persistent storage. You can filter, search, inspect individual feature vectors, or export the registry as JSON or CSV.
        </div>
      </div>

      {/* Controls Bar: Search, Filters, Sort */}
      <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by URL domain or path..."
            className="w-full px-3 py-2 pl-9 rounded-lg bg-[#0B1020] border border-slate-700 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Classification Filter */}
          <select
            value={filterClass}
            onChange={(e) => {
              setFilterClass(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 rounded-lg bg-[#0B1020] border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Verdicts</option>
            <option value="phishing">Phishing</option>
            <option value="legitimate">Legitimate</option>
          </select>

          {/* Model Filter */}
          <select
            value={filterModel}
            onChange={(e) => {
              setFilterModel(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 rounded-lg bg-[#0B1020] border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Models</option>
            <option value="ridge">Ridge (L2)</option>
            <option value="lasso">Lasso (L1)</option>
            <option value="standard">Standard LR</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-2 rounded-lg bg-[#0B1020] border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="confidence_high">Highest Confidence</option>
            <option value="confidence_low">Lowest Confidence</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl bg-[#0F172A] border border-slate-800 shadow-xl overflow-hidden">
        {paginatedList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0E1529] text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Target URL</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Risk Profile</th>
                  <th className="py-3 px-4">Model Used</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedScan(item)}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="truncate text-slate-200 group-hover:text-cyan-300 font-mono text-xs">
                        {item.url}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        Length: {item.features.url_length} chars · HTTPS: {item.features.isHttps ? 'Yes' : 'No'} · Dots: {item.features.nb_dots}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PredictionBadge prediction={item.prediction} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold">
                      <span
                        className={
                          item.prediction === 'phishing'
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }
                      >
                        {item.confidence}%
                      </span>
                      <div className="text-[10px] font-normal text-slate-500">
                        P = {(item.probability * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RiskBadge level={item.riskLevel} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <ModelBadge modelId={item.modelId} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      <div>{new Date(item.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScan(item);
                          }}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Inspect 13 Features"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToScan(item.url);
                          }}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-300 transition-colors"
                          title="Re-scan in Analyzer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(e, item.id)}
                          className="p-1.5 rounded hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete from Log"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <History className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-semibold text-slate-200">No scan history recorded</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Scan records appear here after inspecting URLs in the Scanner page.
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        {sortedList.length > pageSize && (
          <div className="p-3 bg-[#0B1020] border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedList.length)} of{' '}
              {sortedList.length} scans
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800 text-cyan-300 font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full p-6 rounded-xl bg-[#0F172A] border border-rose-800/60 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Clear All Scan History?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently delete all {history.length} URL analysis records from your browser's local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearAll}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono cursor-pointer"
              >
                Confirm Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Details Modal */}
      {selectedScan && (
        <FeatureDetailModal
          isOpen={!!selectedScan}
          onClose={() => setSelectedScan(null)}
          features={selectedScan.features}
          url={selectedScan.url}
        />
      )}
    </div>
  );
};
