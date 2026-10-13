/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ModelId, PredictionResult } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { UrlScannerView } from './components/scanner/UrlScannerView';
import { HistoryView } from './components/history/HistoryView';
import { ModelComparisonView } from './components/models/ModelComparisonView';
import { AboutProjectView } from './components/about/AboutProjectView';
import { SettingsView } from './components/settings/SettingsView';
import { getScanHistory, saveScanToHistory, clearAllHistory } from './utils/historyStorage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedModel, setSelectedModel] = useState<ModelId>('ridge');
  const [decisionThreshold, setDecisionThreshold] = useState<number>(0.50);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [scannerTargetUrl, setScannerTargetUrl] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Initialize scan history from local storage on mount
  useEffect(() => {
    const loadedHistory = getScanHistory();
    setHistory(loadedHistory);
  }, []);

  // When a scan completes, persist to history
  const handleScanCompleted = (result: PredictionResult) => {
    const updated = saveScanToHistory(result);
    setHistory(updated);
  };

  const handleInspectUrl = (result: PredictionResult) => {
    setScannerTargetUrl(result.url);
    setCurrentTab('scanner');
  };

  const handleNavigateToScan = (url: string) => {
    setScannerTargetUrl(url);
    setCurrentTab('scanner');
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('phishguard_scan_history_v1');
    const fresh = getScanHistory();
    setHistory(fresh);
  };

  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex overflow-x-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navigation */}
        <Navbar
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              history={history}
              onNavigate={setCurrentTab}
              onInspectUrl={handleInspectUrl}
            />
          )}

          {currentTab === 'scanner' && (
            <UrlScannerView
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              onScanCompleted={handleScanCompleted}
              initialUrl={scannerTargetUrl}
            />
          )}

          {currentTab === 'history' && (
            <HistoryView
              history={history}
              onHistoryUpdated={setHistory}
              onNavigateToScan={handleNavigateToScan}
            />
          )}

          {currentTab === 'models' && <ModelComparisonView />}

          {currentTab === 'about' && <AboutProjectView />}

          {currentTab === 'settings' && (
            <SettingsView
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              decisionThreshold={decisionThreshold}
              onUpdateThreshold={setDecisionThreshold}
              history={history}
              onResetDemoData={handleResetDemoData}
              onClearHistory={handleClearHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}
