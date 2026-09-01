import {add, mul} from '../arithmetic/index.js';

export const min = (...x) => Math.min(...x);
export const max = (...x) => Math.max(...x);

export const binomial = (n, k) =>{
  if(n !== Math.floor(n)) return TypeError('n must be an integer');
  if(k !== Math.floor(k)) return TypeError('k must be an integer');
  if (n < 0) return TypeError('n must be non-negative');
  if (k < 0 || n < 0 || k > n) return 0;
  if (k > n - k) k = n - k;
    let c = 1, i;
    for (i = 0; i < k; i++)
        c = c * (n - i) / (i + 1);
    return c;
}

// export const mean = (...x) => x.reduce((a, b) => a + b) / x.length;

// export const variance = (...x) => {
//   const n = x.length;
//   if (n === 0) return NaN;
//   const x_mean = mean(...x);
//   return x.reduce((sum, xi) => sum + (xi - x_mean) ** 2, 0) / n;
// };

// export const std = (...x) => Math.sqrt(variance(...x));

// export const accum_sum = (...x) => {
//   let result = [];
//   let total = 0, i, n = x.length;
//   for(i = 0; i < n ; i++){
//     total = add(total, x[i])
//     result.push(total);
//   }
//   return result;
// };

export const accum_prod = (...x) => {
  let result = [];
  let prod = 1, i, n = x.length;
  for(i = 0; i < n ; i++){
    prod = mul(prod, x[i])
    result.push(prod);
  }
  return result;
};

// export const percentile = (X, p) => {
//   if (X.length === 0) 
//     return NaN;
//   let a = [...X].sort((x, y) => x - y);
//   let index = (p / 100) * (a.length - 1);
//   let i = Math.floor(index);
//   let f = index - i;
//   if (i === a.length - 1) 
//     return a[i]; 
//   return a[i] * (1 - f) + a[i + 1] * f;
// }

// export const median = X => percentile(X, 50); 
