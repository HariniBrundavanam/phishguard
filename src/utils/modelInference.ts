import {
  ModelId,
  ModelName,
  PredictionClass,
  PredictionResult,
  RiskLevel,
  SingleModelPrediction,
  URLFeatures,
} from '../types';
import { extractURLFeatures } from './featureExtractor';

export const ORDERED_FEATURE_KEYS: (keyof URLFeatures)[] = [
  'url_length',
  'valid_url',
  'at_symbol',
  'sensitive_words_count',
  'path_length',
  'isHttps',
  'nb_dots',
  'nb_hyphens',
  'nb_and',
  'nb_or',
  'nb_www',
  'nb_com',
  'nb_underscore',
];

// StandardScaler parameters (mean & standard deviation) fitted on the 1,354 unique URL dataset
export const SCALER_PARAMS: Record<keyof URLFeatures, { mean: number; scale: number }> = {
  url_length: { mean: 51.7947, scale: 20.0934 },
  valid_url: { mean: 0.1196, scale: 0.3247 },
  at_symbol: { mean: 0.0155, scale: 0.3315 },
  sensitive_words_count: { mean: 0.1507, scale: 0.4080 },
  path_length: { mean: 15.3685, scale: 19.3209 },
  isHttps: { mean: 0.2777, scale: 0.4480 },
  nb_dots: { mean: 3.9535, scale: 2.1650 },
  nb_hyphens: { mean: 0.7755, scale: 1.4021 },
  nb_and: { mean: 0.0251, scale: 0.1612 },
  nb_or: { mean: 0.2622, scale: 0.5056 },
  nb_www: { mean: 0.2962, scale: 0.4773 },
  nb_com: { mean: 0.6758, scale: 0.5642 },
  nb_underscore: { mean: 0.1544, scale: 0.5759 },
};

// Trained model weights extracted directly from scikit-learn models (Cell 31 of Notebook)
export const MODEL_WEIGHTS: Record<
  'standard' | 'ridge' | 'lasso',
  {
    name: ModelName;
    intercept: number;
    weights: Record<keyof URLFeatures, number>;
    regularization: string;
    penalty: string;
  }
> = {
  standard: {
    name: 'Standard Logistic Regression',
    intercept: -0.701,
    regularization: 'None (Unconstrained)',
    penalty: 'Standard Log-Loss (C=1.0, max_iter=1000)',
    weights: {
      url_length: 0.609885,
      valid_url: 1.169995,
      at_symbol: -0.529703,
      sensitive_words_count: 0.169712,
      path_length: -0.532479,
      isHttps: 0.085866,
      nb_dots: -0.072254,
      nb_hyphens: 0.204412,
      nb_and: -0.072373,
      nb_or: -0.037641,
      nb_www: -0.535779,
      nb_com: 0.119909,
      nb_underscore: -0.196200,
    },
  },
  ridge: {
    name: 'Ridge Logistic Regression (L2)',
    intercept: -0.701,
    regularization: 'L2 (Ridge)',
    penalty: 'C=1.0, solver="liblinear" (Weight magnitude shrinkage)',
    weights: {
      url_length: 0.608466,
      valid_url: 1.172258,
      at_symbol: -0.519325,
      sensitive_words_count: 0.169749,
      path_length: -0.531957,
      isHttps: 0.085753,
      nb_dots: -0.071586,
      nb_hyphens: 0.204337,
      nb_and: -0.072170,
      nb_or: -0.037697,
      nb_www: -0.534345,
      nb_com: 0.119505,
      nb_underscore: -0.195375,
    },
  },
  lasso: {
    name: 'Lasso Logistic Regression (L1)',
    intercept: -0.701,
    regularization: 'L1 (Lasso)',
    penalty: 'C=1.0, solver="liblinear" (L1 absolute regularization penalty)',
    weights: {
      url_length: 0.565555,
      valid_url: 1.175929,
      at_symbol: -0.347045,
      sensitive_words_count: 0.161626,
      path_length: -0.510538,
      isHttps: 0.078034,
      nb_dots: -0.038321,
      nb_hyphens: 0.205401,
      nb_and: -0.066288,
      nb_or: -0.029815,
      nb_www: -0.533148,
      nb_com: 0.104720,
      nb_underscore: -0.186068,
    },
  },
};

function sigmoid(z: number): number {
  if (z < -40) return 0;
  if (z > 40) return 1;
  return 1 / (1 + Math.exp(-z));
}

export function runModelInference(
  features: URLFeatures,
  modelId: 'standard' | 'ridge' | 'lasso',
  decisionThreshold: number = 0.5
): SingleModelPrediction {
  const modelConfig = MODEL_WEIGHTS[modelId];

  // 1. StandardScaler normal transformation: (x - mean) / scale
  let logit = modelConfig.intercept;
  for (const key of ORDERED_FEATURE_KEYS) {
    const rawVal = features[key];
    const { mean, scale } = SCALER_PARAMS[key];
    const scaledVal = (rawVal - mean) / (scale || 1);
    const weight = modelConfig.weights[key];
    logit += weight * scaledVal;
  }

  // 2. Sigmoid probability: P(y = 1 | x)
  const probability = sigmoid(logit);
  const isPhishing = probability >= decisionThreshold;

  const confidence = isPhishing
    ? Math.round(probability * 1000) / 10
    : Math.round((1 - probability) * 1000) / 10;

  return {
    modelId,
    modelName: modelConfig.name,
    prediction: isPhishing ? 'phishing' : 'legitimate',
    probability: Math.round(probability * 1000) / 1000,
    confidence,
    regularization: modelConfig.regularization,
    l1_l2_penalty: modelConfig.penalty,
  };
}

export function evaluateRisk(
  features: URLFeatures,
  phishProb: number
): {
  riskLevel: RiskLevel;
  riskFactors: string[];
  safeFactors: string[];
} {
  const riskFactors: string[] = [];
  const safeFactors: string[] = [];

  if (features.valid_url === 1) {
    riskFactors.push('RFC valid URL structure (Strongest positive phishing indicator in trained dataset: coef +1.17)');
  }

  if (features.url_length > 65) {
    riskFactors.push(`Long URL length (${features.url_length} chars, above dataset mean of 51.8 chars)`);
  } else {
    safeFactors.push(`Compact URL length (${features.url_length} chars)`);
  }

  if (features.sensitive_words_count > 0) {
    riskFactors.push(`Contains ${features.sensitive_words_count} credential keywords (login, verify, update, account)`);
  } else {
    safeFactors.push('Zero credential harvesting trigger keywords');
  }

  if (features.nb_hyphens >= 2) {
    riskFactors.push(`Multiple hyphens (${features.nb_hyphens}) indicative of brand impersonation or domain masquerading`);
  }

  if (features.nb_www > 1) {
    riskFactors.push(`Multiple "www" occurrences (${features.nb_www}) detected`);
  }

  if (features.nb_com > 1) {
    riskFactors.push(`Multiple "com" tokens (${features.nb_com}) found in URL string`);
  }

  if (features.at_symbol > 0) {
    riskFactors.push(`Contains @ symbol delimiter (${features.at_symbol})`);
  }

  if (features.isHttps === 1) {
    safeFactors.push('TLS/HTTPS protocol scheme detected');
  } else {
    riskFactors.push('Unencrypted plain HTTP protocol scheme');
  }

  if (features.nb_dots >= 5) {
    riskFactors.push(`Excessive dot delimiters (${features.nb_dots}) indicating deep subdomain nesting`);
  }

  let riskLevel: RiskLevel = 'safe';
  if (phishProb >= 0.75 || riskFactors.length >= 4) {
    riskLevel = 'critical';
  } else if (phishProb >= 0.55 || riskFactors.length >= 2) {
    riskLevel = 'high';
  } else if (phishProb >= 0.40 || riskFactors.length >= 1) {
    riskLevel = 'moderate';
  } else if (phishProb >= 0.20) {
    riskLevel = 'low';
  } else {
    riskLevel = 'safe';
  }

  return { riskLevel, riskFactors, safeFactors };
}

/**
 * Executes complete prediction workflow across requested model or all 3 models
 */
export function predictUrlLocally(
  rawUrl: string,
  selectedModel: ModelId = 'ridge',
  decisionThreshold: number = 0.5
): PredictionResult {
  const features = extractURLFeatures(rawUrl);

  const primaryModelKey: 'standard' | 'ridge' | 'lasso' =
    selectedModel === 'all' ? 'ridge' : selectedModel;

  const allModelKeys: ('standard' | 'ridge' | 'lasso')[] = ['standard', 'ridge', 'lasso'];
  const allModels: SingleModelPrediction[] = allModelKeys.map((m) =>
    runModelInference(features, m, decisionThreshold)
  );

  const primaryPrediction = allModels.find((m) => m.modelId === primaryModelKey)!;
  const { riskLevel, riskFactors, safeFactors } = evaluateRisk(features, primaryPrediction.probability);

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    url: rawUrl.trim(),
    prediction: primaryPrediction.prediction,
    probability: primaryPrediction.probability,
    confidence: primaryPrediction.confidence,
    modelUsed: primaryPrediction.modelName,
    modelId: primaryModelKey,
    features,
    timestamp: new Date().toISOString(),
    riskLevel,
    riskFactors,
    safeFactors,
    allModels,
  };
}
