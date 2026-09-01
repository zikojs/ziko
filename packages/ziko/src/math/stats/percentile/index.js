export const percentile = (X, p) => {
  if (X.length === 0) 
    return NaN;
  let a = X.sort((x, y) => x - y);
  let index = (p / 100) * (a.length - 1);
  let i = Math.floor(index);
  let f = index - i;
  if (i === a.length - 1) 
    return a[i]; 
  return a[i] * (1 - f) + a[i + 1] * f;
}

export const q1 = X => percentile(X, 25); 
export const median = X => percentile(X, 50); 
export const q3 = X => percentile(X, 75); 

// Interquartile Range
export const iqr = X => q3(X) - q1(X)
