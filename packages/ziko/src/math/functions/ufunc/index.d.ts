import { mapfun, MapFunResult } from '../mapfun/index.d.ts';
import { complex } from '../../complex/index.d.ts';

// --- Standard Unary / Multi-Argument Math Functions ---

export function abs<T>(x: T): MapFunResult<T, any>;
export function abs<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function sqrt<T>(x: T): MapFunResult<T, any>;
export function sqrt<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function cbrt<T>(x: T): MapFunResult<T, any>;
export function cbrt<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function exp<T>(x: T): MapFunResult<T, any>;
export function exp<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function ln<T>(x: T): MapFunResult<T, any>;
export function ln<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function sign<T>(x: T): MapFunResult<T, any>;
export function sign<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function floor<T>(x: T): MapFunResult<T, any>;
export function floor<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function ceil<T>(x: T): MapFunResult<T, any>;
export function ceil<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function round<T>(x: T): MapFunResult<T, any>;
export function round<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function trunc<T>(x: T): MapFunResult<T, any>;
export function trunc<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function fract<T>(x: T): MapFunResult<T, any>;
export function fract<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function cos<T>(x: T): MapFunResult<T, any>;
export function cos<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function sin<T>(x: T): MapFunResult<T, any>;
export function sin<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function tan<T>(x: T): MapFunResult<T, any>;
export function tan<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function sec<T>(x: T): MapFunResult<T, any>;
export function sec<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function acos<T>(x: T): MapFunResult<T, any>;
export function acos<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function asin<T>(x: T): MapFunResult<T, any>;
export function asin<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function atan<T>(x: T): MapFunResult<T, any>;
export function atan<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function acot<T>(x: T): MapFunResult<T, any>;
export function acot<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function cosh<T>(x: T): MapFunResult<T, any>;
export function cosh<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function sinh<T>(x: T): MapFunResult<T, any>;
export function sinh<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function tanh<T>(x: T): MapFunResult<T, any>;
export function tanh<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function coth<T>(x: T): MapFunResult<T, any>;
export function coth<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function acosh<T>(x: T): MapFunResult<T, any>;
export function acosh<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function asinh<T>(x: T): MapFunResult<T, any>;
export function asinh<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function atanh<T>(x: T): MapFunResult<T, any>;
export function atanh<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

export function sig<T>(x: T): MapFunResult<T, any>;
export function sig<T extends any[]>(...x: T): { [K in keyof T]: MapFunResult<T[K], any> };

// --- Functions that pop parameters from the end (pow, nthr, croot) ---

export function pow<T, N>(base: T, n: N): MapFunResult<T, any>;
export function pow<T extends any[], N>(...args: [...T, N]): { [K in keyof T]: MapFunResult<T[K], any> };

export function nthr<T, N extends number>(base: T, n: N): MapFunResult<T, any>;
export function nthr<T extends any[], N extends number>(...args: [...T, N]): { [K in keyof T]: MapFunResult<T[K], any> };

export function croot<T, C>(base: T, root: C): MapFunResult<T, any>;
export function croot<T extends any[], C>(...args: [...T, C]): { [K in keyof T]: MapFunResult<T[K], any> };