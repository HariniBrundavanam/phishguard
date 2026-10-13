export interface SampleUrlPreset {
  label: string;
  url: string;
  expectedCategory: 'phishing' | 'legitimate';
  categoryBadge: string;
  description: string;
  demonstrates: string;
}

export const SAMPLE_URLS: SampleUrlPreset[] = [
  {
    label: 'PayPal Credential Harvest',
    url: 'http://paypal.com.account-verification-notice.secure-login.ru/update/user?id=92841&key=pass',
    expectedCategory: 'phishing',
    categoryBadge: 'Phishing',
    description: 'Deceptive subdomain mimicking PayPal, nested dots, unencrypted HTTP, sensitive keywords.',
    demonstrates: 'Subdomain spoofing & sensitive keyword extraction',
  },
  {
    label: 'Netflix Suspended Account Spoof',
    url: 'http://netflix-billing-update-support.online/login/verify.php?auth_token=8f812e9871bc',
    expectedCategory: 'phishing',
    categoryBadge: 'Phishing',
    description: 'Typosquatted domain with hyphens, multiple credential keywords, HTTP protocol.',
    demonstrates: 'Hyphens & sensitive keywords penalty',
  },
  {
    label: 'Obfuscated @ Credential Attack',
    url: 'http://google.com@auth-banking-portal-secure.info/session/confirm?ref=urgent',
    expectedCategory: 'phishing',
    categoryBadge: 'Phishing',
    description: 'Exploits RFC @ symbol delimiter where browser routes to auth-banking-portal-secure.info.',
    demonstrates: 'High @ symbol coefficient trigger',
  },
  {
    label: 'Deep Subdomain Nested Phish',
    url: 'http://www.apple.id.support.security.update.cloud-verification.tk/login.html',
    expectedCategory: 'phishing',
    categoryBadge: 'Phishing',
    description: 'Excessive dot count (>6) combined with suspicious TLD and branded tokens.',
    demonstrates: 'nb_dots feature impact & URL length',
  },
  {
    label: 'Official GitHub Repository',
    url: 'https://github.com/scikit-learn/scikit-learn/blob/main/sklearn/linear_model/_logistic.py',
    expectedCategory: 'legitimate',
    categoryBadge: 'Legitimate',
    description: 'Legitimate HTTPS domain, genuine RFC structure, standard developer repository path.',
    demonstrates: 'Standard benign profile with HTTPS benefit',
  },
  {
    label: 'Official Google Scholar',
    url: 'https://scholar.google.com/citations?view_op=top_venues&hl=en',
    expectedCategory: 'legitimate',
    categoryBadge: 'Legitimate',
    description: 'Reputable academic subdomain with standard query parameters and valid HTTPS TLS certificate.',
    demonstrates: 'Legitimate academic portal classification',
  },
  {
    label: 'Official Wikipedia Article',
    url: 'https://en.wikipedia.org/wiki/Logistic_regression#L1_and_L2_regularization',
    expectedCategory: 'legitimate',
    categoryBadge: 'Legitimate',
    description: 'Clean authority domain, zero sensitive attack triggers, valid SSL.',
    demonstrates: 'Clean reference domain classification',
  },
  {
    label: 'University Student Portal',
    url: 'https://portal.stanford.edu/students/academics/grades/transcript.pdf',
    expectedCategory: 'legitimate',
    categoryBadge: 'Legitimate',
    description: 'Edu domain with deep path, contains no suspicious typosquatting or excessive punctuation.',
    demonstrates: 'Safe institutional path handling',
  },
];
