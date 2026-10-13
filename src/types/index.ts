export type ModelId = 'standard' | 'ridge' | 'lasso' | 'all';

export type ModelName =
  | 'Standard Logistic Regression'
  | 'Ridge Logistic Regression (L2)'
  | 'Lasso Logistic Regression (L1)';

export type PredictionClass = 'phishing' | 'legitimate';

export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'safe';

export interface URLFeatures {
  url_length: number;
  valid_url: number;
  at_symbol: number;
  sensitive_words_count: number;
  path_length: number;
  isHttps: number;
  nb_dots: number;
  nb_hyphens: number;
  nb_and: number;
  nb_or: number;
  nb_www: number;
  nb_com: number;
  nb_underscore: number;
}

export interface FeatureMeta {
  key: keyof URLFeatures;
  label: string;
  description: string;
  category: 'Structural' | 'Security' | 'Lexical' | 'Pattern';
  dangerThreshold?: (val: number) => boolean;
  benchmarkNormal: string;
}

export interface SingleModelPrediction {
  modelId: 'standard' | 'ridge' | 'lasso';
  modelName: ModelName;
  prediction: PredictionClass;
  probability: number; // 0.0 to 1.0 (phishing probability)
  confidence: number;  // 0 to 100%
  regularization: string;
  l1_l2_penalty: string;
}

export interface PredictionResult {
  id: string;
  url: string;
  prediction: PredictionClass;
  probability: number;
  confidence: number;
  modelUsed: ModelName;
  modelId: 'standard' | 'ridge' | 'lasso';
  features: URLFeatures;
  timestamp: string;
  riskLevel: RiskLevel;
  riskFactors: string[];
  safeFactors: string[];
  allModels?: SingleModelPrediction[];
}

export interface ConfusionMatrix {
  tn: number; // True Negative (Legitimate correctly identified)
  fp: number; // False Positive (Legitimate misclassified as Phishing)
  fn: number; // False Negative (Phishing missed!)
  tp: number; // True Positive (Phishing correctly caught)
}

export interface RocCurvePoint {
  fpr: number;
  tpr: number;
  threshold?: number;
}

export interface FeatureWeight {
  feature: keyof URLFeatures;
  label: string;
  weight: number;
  isZeroedOut?: boolean;
}

export interface ModelMetricData {
  modelId: 'standard' | 'ridge' | 'lasso';
  modelName: ModelName;
  shortName: string;
  regularization: string;
  formula: string;
  penaltyDescription: string;
  hyperparameters: {
    C: number;
    penalty: string;
    solver: string;
    max_iter: number;
  };
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
  };
  confusionMatrix: ConfusionMatrix;
  rocCurve: RocCurvePoint[];
  featureWeights: FeatureWeight[];
  activeFeaturesCount: number;
  prunedFeaturesCount: number;
  dataSource: string;
}
