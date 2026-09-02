import { mapfun, apply_fun } from "../mapfun/index.js";

export const deg2rad = (...deg) => mapfun(x => x * Math.PI / 180, ...deg);
export const rad2deg = (...rad) => mapfun(x => x / Math.PI * 180, ...rad);

export const norm = (x, min, max) => apply_fun(
    x, 
    v => min !== max ? (v - min) / (max - min) : 0
);
export const lerp = (x, min, max) => apply_fun(
    x, 
    v => (max - min) * v + min
);
export const clamp = (x, min, max) => apply_fun(
    x, 
    v => Math.min(Math.max(v, min), max)
);
export const map = (x, a, b, c, d) => apply_fun(
    x, 
    v => lerp(norm(v, a, b), c, d)
);

export const hypot = (...x) => {
  const c0 = x.find(a => a.isComplex?.());
  if (c0) {
    const W = x.map(n => n.isComplex?.() ? n : new c0.constructor(n, 0));
    return Math.hypot(...W.map(c => c.z));
  }
  return Math.hypot(...x);
};


export const atan2 = (y, x, rad = true) => {
    if (y instanceof Array && !(x instanceof Array))
        return mapfun(n => atan2(n, x, rad), ...y);

    if (x instanceof Array && !(y instanceof Array))
        return mapfun(n => atan2(y, n, rad), ...x);

    if (y instanceof Array && x instanceof Array)
        return y.map((v, i) => atan2(v, x[i], rad));

    const phi = Math.atan2(y, x);
    return rad ? phi : phi * 180 / Math.PI;
}


