// Population Variance
import { mean } from "../average/index.js";
export const variance = (...x) => {
  const n = x.length;
  if (n === 0) return NaN;
  const x_mean = mean(...x);
  return x.reduce((sum, xi) => sum + (xi - x_mean) ** 2, 0) / n;
};
export const std = (...x) => Math.sqrt(variance(...x));

export const sample_variance = (...x) => {
  const n = x.length;
  if (n < 2) return NaN;
  const x_mean = mean(...x);
  return x.reduce((sum, xi) => sum + (xi - x_mean) ** 2, 0) / (n - 1);
};
export const sample_std = (...x) => Math.sqrt(sample_variance(...x));

export const weighted_variance = (X, weights) => {
  const n = X.length;
  if (n === 0 || weights.length !== n) return NaN;
  const sw = weights.reduce((sum, w) => sum + w, 0);
  const mean = X.reduce((sum, x, i) => sum + x * weights[i], 0) / sw;
  return X.reduce((sum, x, i) => sum + weights[i] * (x - mean) ** 2, 0) / sw;
};
export const weighted_std = (X, weights) => Math.sqrt(weighted_variance(X, weights));

export const rolling_variance = (X, windowSize) => {
  if (windowSize < 1 || X.length < windowSize) return [];
  let result = [];
  for (let i = 0; i <= X.length - windowSize; i++) {
    const w = X.slice(i, i + windowSize);
    result.push(sample_variance(w)); // usually sample variance for rolling
  }
  return result;
};
export const rolling_std = (X, windowSize) => Math.sqrt(rolling_variance(X, windowSize));
