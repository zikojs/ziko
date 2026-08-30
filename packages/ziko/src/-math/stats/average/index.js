// Mean
export const mean = (...x) => x.reduce((a, b) => a + b) / x.length;
export const geo_mean = (...x) => (x.reduce((a, b) => a * b)) ** (1/x.length);
// Quadratic Mean
export const rms = (...x) => {
    const n = x.length;
    return (Math.hypot(...x)/n)**(1/n)
}

export const weighted_mean=(values, weights)=>{
  let sum = 0, sw = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i] * weights[i];
    sw += weights[i];
  }
  return sum / sw;
}

export const harmonic_mean = (...x) => {
  let s = 0, i = 0;
  for(i=0; i<x.length; i++) 
    s += 1/x[i]
  return x.length / s;
}

export const power_mean = (X, p) =>{
  let s = 0, i = 0, l = X.length;
  for(i=0; i < l; i++) 
    s+= X[i]**p
  return (s / l) ** (1 / p);
}

export const trimmed_mean = (X, k) =>{
  let a = [...X].sort((a,b)=>a-b).slice(k, X.length - k);
  return mean(...a);
}

export const winsorized_mean = (X, k) =>{
  let a = [...X].sort((a,b)=>a-b);
  let low = a[k], high = a[a.length - k - 1];
  a = a.map(x => Math.max(low, Math.min(high, x)));
  return mean(a);
}

export const midrange = (x) =>{
  let min = Math.min(...x);
  let max = Math.max(...x);
  return (min + max) / 2;
}

export const midhinge = (...x) =>{
  let a = x.sort((a,b)=>a-b);
  let q1 = a[Math.floor((a.length - 1) * 0.25)];
  let q3 = a[Math.floor((a.length - 1) * 0.75)];
  return (q1 + q3) / 2;
}


export const interquartile_mean = (...x) =>{
  let a = x.sort((a,b)=>a-b);
  let q1 = a[Math.floor((a.length - 1) * 0.25)];
  let q3 = a[Math.floor((a.length - 1) * 0.75)];
  let m = a.filter(x => x >= q1 && x <= q3);
  return mean(m);
}


export const contraharmonic_mean = (...x) =>{
  let num = 0, den = 0, i, l = x.length;
  for(i = 0; i < l; i++){
    num += x[i]**2;
    den += x[i]
  }
  return num / den;
}
