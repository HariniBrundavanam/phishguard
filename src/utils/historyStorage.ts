import { PredictionResult } from '../types';
import { predictUrlLocally } from './modelInference';

const STORAGE_KEY = 'phishguard_scan_history_v1';

const INITIAL_DEMO_URLS = [
  {
    url: 'http://paypal.com.account-verification-notice.secure-login.ru/update/user?id=92841',
    model: 'ridge' as const,
  },
  {
    url: 'https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/linear_model/_logistic.py',
    model: 'lasso' as const,
  },
  {
    url: 'http://netflix-billing-update-support.online/login/verify.php',
    model: 'standard' as const,
  },
  {
    url: 'https://en.wikipedia.org/wiki/Logistic_regression',
    model: 'ridge' as const,
  },
];

export function getScanHistory(): PredictionResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial demo scans so first-time visitors see a populated table
      const seeded = INITIAL_DEMO_URLS.map(({ url, model }) => {
        return predictUrlLocally(url, model);
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading scan history:', err);
    return [];
  }
}

export function saveScanToHistory(result: PredictionResult): PredictionResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getScanHistory();
    // Prepend new scan, remove duplicates by exact URL if already scanned recently
    const filtered = current.filter((item) => item.id !== result.id);
    const updated = [result, ...filtered].slice(0, 50); // retain up to 50 items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving scan to history:', err);
    return [];
  }
}

export function deleteScanFromHistory(id: string): PredictionResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getScanHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error deleting scan:', err);
    return [];
  }
}

export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing history:', err);
  }
}

export function exportHistoryAsJson(history: PredictionResult[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `phishguard_scans_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportHistoryAsCsv(history: PredictionResult[]): void {
  const headers = [
    'Timestamp',
    'URL',
    'Prediction',
    'Confidence (%)',
    'Model Used',
    'Risk Level',
    'URL Length',
    'HTTPS',
    'Dots',
    'Sensitive Words',
    '@ Symbol',
  ];

  const rows = history.map((item) => [
    `"${item.timestamp}"`,
    `"${item.url.replace(/"/g, '""')}"`,
    item.prediction,
    item.confidence,
    `"${item.modelUsed}"`,
    item.riskLevel,
    item.features.url_length,
    item.features.isHttps,
    item.features.nb_dots,
    item.features.sensitive_words_count,
    item.features.at_symbol,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', encodedUri);
  downloadAnchor.setAttribute('download', `phishguard_scans_${Date.now()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
