import { FeatureMeta, URLFeatures } from '../types';

export const SENSITIVE_KEYWORDS = [
  'login',
  'verify',
  'update',
  'account',
  'banking',
  'secure',
  'signin',
  'ebayisapi',
  'webscr',
  'password',
  'confirm',
  'suspend',
  'billing',
  'wallet',
  'auth',
  'recover',
  'unlock',
  'security',
];

/**
 * Extracts the exact 13 numerical features expected by the scikit-learn
 * Logistic Regression models trained on the phishing URL dataset.
 */
export function extractURLFeatures(rawUrl: string): URLFeatures {
  const url = (rawUrl || '').trim();

  // 1. url_length
  const url_length = url.length;

  // 2. valid_url
  let isValid = 0;
  let parsedUrl: URL | null = null;
  try {
    let normalized = url;
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'http://' + normalized;
    }
    parsedUrl = new URL(normalized);
    // RFC 3986 basic hostname check
    if (parsedUrl.hostname && parsedUrl.hostname.includes('.')) {
      isValid = 1;
    }
  } catch {
    isValid = 0;
  }

  // 3. at_symbol count
  const at_symbol = (url.match(/@/g) || []).length;

  // 4. sensitive_words_count
  const lowerUrl = url.toLowerCase();
  let sensitiveCount = 0;
  for (const word of SENSITIVE_KEYWORDS) {
    const regex = new RegExp(word, 'g');
    const matches = lowerUrl.match(regex);
    if (matches) {
      sensitiveCount += matches.length;
    }
  }

  // 5. path_length
  let path_length = 0;
  if (parsedUrl) {
    path_length = (parsedUrl.pathname + parsedUrl.search + parsedUrl.hash).length;
  } else {
    const domainEnd = url.indexOf('/', 8);
    path_length = domainEnd !== -1 ? url.substring(domainEnd).length : 0;
  }

  // 6. isHttps
  const isHttps = url.toLowerCase().startsWith('https://') ? 1 : 0;

  // 7. nb_dots
  const nb_dots = (url.match(/\./g) || []).length;

  // 8. nb_hyphens
  const nb_hyphens = (url.match(/-/g) || []).length;

  // 9. nb_and
  const nb_and = (url.match(/&/g) || []).length;

  // 10. nb_or
  const nb_or = (url.match(/\|/g) || []).length;

  // 11. nb_www
  const nb_www = (lowerUrl.match(/www/g) || []).length;

  // 12. nb_com
  const nb_com = (lowerUrl.match(/com/g) || []).length;

  // 13. nb_underscore
  const nb_underscore = (url.match(/_/g) || []).length;

  return {
    url_length,
    valid_url: isValid,
    at_symbol,
    sensitive_words_count: sensitiveCount,
    path_length,
    isHttps,
    nb_dots,
    nb_hyphens,
    nb_and,
    nb_or,
    nb_www,
    nb_com,
    nb_underscore,
  };
}

export const FEATURES_METADATA: FeatureMeta[] = [
  {
    key: 'valid_url',
    label: 'Valid RFC URL (valid_url)',
    category: 'Structural',
    description: 'Whether the URL structure conforms to RFC standard specification. In the dataset, valid URL structure has the highest positive correlation (+1.17 coefficient) with target class 1.',
    dangerThreshold: (val) => val === 1,
    benchmarkNormal: 'Mean: 0.12 (dataset: 12%)',
  },
  {
    key: 'url_length',
    label: 'Total URL Length (url_length)',
    category: 'Structural',
    description: 'Total character count of the URL string. Phishing URLs frequently exceed 60-70 characters to embed redirects and obfuscated subdomains.',
    dangerThreshold: (val) => val > 65,
    benchmarkNormal: 'Mean: 51.8 chars (range 13 - 96)',
  },
  {
    key: 'nb_hyphens',
    label: 'Hyphens Count (nb_hyphens)',
    category: 'Pattern',
    description: 'Number of hyphens in the URL. Commonly leveraged in typosquatting to impersonate brands (e.g. paypal-security-verify.com). Positive coefficient: +0.20.',
    dangerThreshold: (val) => val >= 2,
    benchmarkNormal: 'Mean: 0.78 (range 0 - 10)',
  },
  {
    key: 'sensitive_words_count',
    label: 'Sensitive Words Count (sensitive_words_count)',
    category: 'Lexical',
    description: 'Count of credential-harvesting triggers (login, verify, update, account, banking, secure, password). Positive coefficient: +0.17.',
    dangerThreshold: (val) => val >= 1,
    benchmarkNormal: 'Mean: 0.15 (range 0 - 3)',
  },
  {
    key: 'nb_com',
    label: 'COM Token Count (nb_com)',
    category: 'Pattern',
    description: 'Occurrences of "com" in the URL string. Multiple occurrences often indicate nested deceptive domains (e.g. bank.com.fakeportal.net). Positive coefficient: +0.12.',
    dangerThreshold: (val) => val > 1,
    benchmarkNormal: 'Mean: 0.68 (range 0 - 3)',
  },
  {
    key: 'isHttps',
    label: 'HTTPS Scheme (isHttps)',
    category: 'Security',
    description: 'Indicates TLS/HTTPS protocol. Notice in modern phishing, attackers frequently obtain free certificates, so HTTPS is not an absolute indicator of safety.',
    dangerThreshold: (val) => val === 0,
    benchmarkNormal: 'Mean: 0.28 (28% of dataset)',
  },
  {
    key: 'nb_or',
    label: 'Pipe (|) Delimiter (nb_or)',
    category: 'Pattern',
    description: 'Occurrences of vertical pipe character in query parameters.',
    dangerThreshold: (val) => val > 0,
    benchmarkNormal: 'Mean: 0.26 (range 0 - 3)',
  },
  {
    key: 'nb_dots',
    label: 'Dots Count (nb_dots)',
    category: 'Structural',
    description: 'Count of dot characters in the URL string, reflecting subdomain depth.',
    dangerThreshold: (val) => val >= 5,
    benchmarkNormal: 'Mean: 3.95 (range 0 - 13)',
  },
  {
    key: 'nb_and',
    label: 'Ampersands (&) Count (nb_and)',
    category: 'Pattern',
    description: 'Count of ampersand delimiters in URL query strings.',
    dangerThreshold: (val) => val >= 2,
    benchmarkNormal: 'Mean: 0.025 (range 0 - 2)',
  },
  {
    key: 'nb_underscore',
    label: 'Underscore Count (nb_underscore)',
    category: 'Pattern',
    description: 'Count of underscore characters in the URL hostname or path.',
    dangerThreshold: (val) => val >= 2,
    benchmarkNormal: 'Mean: 0.15 (range 0 - 7)',
  },
  {
    key: 'at_symbol',
    label: '@ Symbol Count (at_symbol)',
    category: 'Pattern',
    description: 'Presence of @ symbol used in browser URL parsing to discard the user prefix and navigate to the secondary domain.',
    dangerThreshold: (val) => val > 0,
    benchmarkNormal: 'Mean: 0.015 (range 0 - 9)',
  },
  {
    key: 'path_length',
    label: 'Path Length (path_length)',
    category: 'Structural',
    description: 'Length of the path, query string, and fragment following the hostname.',
    dangerThreshold: (val) => val > 40,
    benchmarkNormal: 'Mean: 15.4 (range 0 - 85)',
  },
  {
    key: 'nb_www',
    label: 'WWW Token Count (nb_www)',
    category: 'Pattern',
    description: 'Occurrences of "www" token across the URL string.',
    dangerThreshold: (val) => val > 1,
    benchmarkNormal: 'Mean: 0.30 (range 0 - 2)',
  },
];
