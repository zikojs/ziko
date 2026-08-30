// Simple Moving Average
export const sma = (X, w) =>{
  let r = [];
  for (let i = 0; i <= X.length - w; i++) {
    let s = 0;
    for (let j = 0; j < w; j++) s += X[i + j];
    r.push(s / w);
  }
  return r;
}

// exponential Moving Average
export const ema = (X, alpha) =>{
  let r = [], prev = X[0];
  r.push(prev);
  for (let i = 1; i < X.length; i++) {
    prev = alpha * X[i] + (1 - alpha) * prev;
    r.push(prev);
  }
  return r;
}

// weightedMovingAverage
export const wma = (X, weights) =>{
  let k = weights.length;
  let sw = weights.reduce((a,b)=>a+b, 0);
  let r = [];
  for (let i = 0; i <= X.length - k; i++) {
    let s = 0;
    for (let j = 0; j < k; j++) s += X[i+j] * weights[j];
    r.push(s / sw);
  }
  return r;
}