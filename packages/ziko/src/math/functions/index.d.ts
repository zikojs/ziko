export type * from './arithmetic/index.d.ts'
export type * from './conversions/index.d.ts'
export type * from './logic/index.d.ts'
export type * from './utils/index.d.ts'
export type * from './mapfun/index.d.ts'
export type * from './ufunc/index.d.ts'

// import type { Complex } from "../complex/index.js";
// import type { MapfunResult, Mappable } from "../utils/mapfun.js";

// /* -------------------- MapfunWrap -------------------- */

// type MapfunWrap<F extends (x: any) => any, A extends Mappable[]> =
//     A["length"] extends 1
//         ? MapfunResult<F, A[0]>
//         : { [K in keyof A]: MapfunResult<F, A[K]> };


// /* -------------------- mapfun-based simple operators -------------------- */

// export declare function abs<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.abs, A>;

// export declare function sqrt<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.sqrt, A>;

// export declare function e<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.exp, A>;

// export declare function ln<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.log, A>;

// /* ---- Fixed-based operators ---- */

// export declare function cos<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.cos, A>;

// export declare function sin<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.sin, A>;

// export declare function tan<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.tan, A>;

// export declare function sec<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.sec, A>;

// export declare function sinc<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.sinc, A>;

// export declare function csc<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.csc, A>;

// export declare function cot<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.cot, A>;

// export declare function acos<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.acos, A>;

// export declare function asin<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.asin, A>;

// export declare function atan<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.atan, A>;

// export declare function acot<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.acot, A>;

// export declare function cosh<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.cosh, A>;

// export declare function sinh<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.sinh, A>;

// export declare function tanh<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.tanh, A>;

// export declare function coth<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.coth, A>;

// export declare function acosh<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.acosh, A>;

// export declare function asinh<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.asinh, A>;

// export declare function atanh<A extends Mappable[]>(...x: A):
//     MapfunWrap<Math.atanh, A>;

// /* ---- Math wrappers ---- */

// export declare function ceil<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.ceil, A>;

// export declare function floor<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.floor, A>;

// export declare function round<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.round, A>;

// export declare function sign<A extends Mappable[]>(...x: A):
//     MapfunWrap<typeof Math.sign, A>;

// export declare function sig<A extends Mappable[]>(...x: A):
//     MapfunWrap<(n: number) => number, A>;

// export declare function fact<A extends Mappable[]>(...x: A):
//     MapfunWrap<(n: number) => number, A>;


// /* -------------------- pow -------------------- */

// export declare function pow(x: number, n: number): number;
// export declare function pow(x: number, n: Complex): Complex;
// export declare function pow(x: number, n: Mappable): any;

// export declare function pow(x: Complex, n: number): Complex;
// export declare function pow(x: Complex, n: Complex): Complex;
// export declare function pow(x: Complex, n: Mappable): any;

// export declare function pow(x: Mappable[], n: number): any[];
// export declare function pow(x: Mappable[], n: Mappable[]): any[];


// /* -------------------- sqrtn -------------------- */

// export declare function sqrtn(x: number, n: number): number;
// export declare function sqrtn(x: number, n: Mappable): any;

// export declare function sqrtn(x: Complex, n: number): Complex;
// export declare function sqrtn(x: Complex, n: Mappable): any;

// export declare function sqrtn(x: Mappable[], n: number): any[];
// export declare function sqrtn(x: Mappable[], n: Mappable[]): any[];


// /* -------------------- atan2 -------------------- */

// export declare function atan2(x: number, y: number, rad?: boolean): number;
// export declare function atan2(x: number, y: Mappable, rad?: boolean): any;
// export declare function atan2(x: Mappable, y: number, rad?: boolean): any;
// export declare function atan2(x: Mappable[], y: Mappable[], rad?: boolean): any[];


// /* -------------------- hypot -------------------- */

// export declare function hypot(...x: number[]): number;
// export declare function hypot(...x: Mappable[]): any;
